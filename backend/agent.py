"""
Signal Dev — Agent Orchestrator

Routes a query along one of two paths:

  * Dev intent detected  →  agentic loop with tool use
  * Everything else      →  existing ``Engine.process_query`` (triad + judge)

The agent loop is a faithful implementation of Claude's native tool-use contract:
the model emits ``tool_use`` blocks, we execute them locally, append ``tool_result``
blocks to the conversation, and re-invoke until ``stop_reason == "end_turn"`` or
a hard iteration / wall-clock budget is exhausted.

Anti-loop guard: identical ``(tool_name, input_fingerprint)`` pairs are tracked
in a per-run counter. Exceeding ``MAX_REPEATS`` forces the agent to either pick
a different tool or terminate.
"""

from __future__ import annotations

import hashlib
import json
import logging
import re
import time
import uuid
from dataclasses import dataclass, field
from typing import Any, AsyncIterator, Optional

from anthropic import AsyncAnthropic

from config import ANTHROPIC_API_KEY, MODEL_ID, MAX_TOKENS, GAUNTLET_MOCK
from mock_client import MockAsyncAnthropic
from doctrine import AGENT_SYSTEM_PROMPT, build_principles_context
from models import SignalQuery
from tools import ToolRegistry, ToolResult

logger = logging.getLogger("gauntlet.agent")


# ── Tunables ────────────────────────────────────────────────────────────────

import os as _os

MAX_AGENT_ITERATIONS: int = 10       # outer loop: model turns
MAX_TOOL_CALLS: int = 20             # across the whole run
MAX_REPEATS: int = 3                 # same tool+input within a run
AGENT_TEMPERATURE: float = 0.2
AGENT_WALL_CLOCK_S: float = 90.0

# Cumulative token budget — sum of input + output across the run. Stops
# a runaway loop from quietly burning the operator's quota when the
# wall-clock and iteration caps both stay green (e.g. very fast model
# producing huge contexts). 200K matches the working window of a single
# Claude Sonnet session and is comfortably above any legitimate run we
# have seen. Override via GAUNTLET_AGENT_TOKEN_BUDGET.
def _read_token_budget() -> int:
    raw = _os.environ.get("GAUNTLET_AGENT_TOKEN_BUDGET", "").strip()
    if not raw:
        return 200_000
    try:
        value = int(raw)
        return value if value > 0 else 200_000
    except ValueError:
        return 200_000

AGENT_TOKEN_BUDGET: int = _read_token_budget()

DEV_KEYWORDS: tuple[str, ...] = (
    # English
    "code", "codebase", "function", "file", "directory", "terminal", "shell",
    "command", "run", "execute", "debug", "stack trace", "error", "exception",
    "git", "commit", "branch", "diff", "merge", "pull request", "repo",
    "npm", "pypi", "pip", "yarn", "pnpm", "package", "dependency", "install",
    "refactor", "lint", "test", "pytest", "unittest", "compile", "build",
    "python", "javascript", "typescript", "node", "bash", "regex",
    # Portuguese
    "código", "ficheiro", "diretório", "diretoria", "comando", "terminal",
    "executar", "correr", "depurar", "erro", "exceção", "biblioteca",
    "pacote", "dependência", "instalar", "função", "refatorar", "teste",
    "compilar", "compilação", "script",
)

_DEV_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in DEV_KEYWORDS) + r")\b",
    flags=re.IGNORECASE,
)


# ── Structured gate/diff signal extraction ──────────────────────────────────
#
# T085 — replaces the regex-on-tool-preview derivation that lived in the
# legacy Terminal surface before the cápsula. The agent already runs every
# tool result; we inspect that result here once and emit typed events so
# the cápsula can render gates/diff without scraping.
# Keep it small: false positives are worse than silence — when the
# signals are ambiguous we yield nothing.

_DIFF_STAT_RE = re.compile(
    r"(\d+)\s+files?\s+changed.*?(\d+)\s+insertions?\(\+\).*?(\d+)\s+deletions?\(-\)",
    flags=re.IGNORECASE | re.DOTALL,
)
# tsc-style "Found N errors" or "0 errors". Vite/tsc writes to stderr,
# our tool surfaces stdout+stderr through `content`.
_TSC_OK_RE = re.compile(r"\bFound\s+0\s+errors\b", flags=re.IGNORECASE)
_TSC_FAIL_RE = re.compile(r"\bFound\s+([1-9]\d*)\s+errors?\b", flags=re.IGNORECASE)
# Vite build success line
_BUILD_OK_RE = re.compile(r"\bbuilt in\s+\d", flags=re.IGNORECASE)
_BUILD_FAIL_RE = re.compile(
    r"\b(build failed|rollup failed|vite build failed|error during build)\b",
    flags=re.IGNORECASE,
)
# pytest / jest / vitest summaries
_TEST_OK_RE = re.compile(
    r"\b(\d+ passed(?:,\s*\d+ skipped)?(?:\s*in\s|$)|all tests passed|✓\s+\d+ tests? passed)\b",
    flags=re.IGNORECASE,
)
_TEST_FAIL_RE = re.compile(
    r"\b(\d+ failed|\d+ failing|FAIL\s+\S+\.(?:test|spec)\.|tests? failed)\b",
    flags=re.IGNORECASE,
)


def _extract_signals(tool_name: str, content: str) -> list[dict[str, Any]]:
    """Return zero or more {type:"gate"|"diff", ...} signal dicts derived
    from a tool_result's content. Caller adds `iteration` + `source`."""
    if not content:
        return []
    out: list[dict[str, Any]] = []

    # Diff stats — only meaningful from git diff/show output.
    if tool_name == "git":
        m = _DIFF_STAT_RE.search(content)
        if m:
            try:
                files, added, removed = (int(m.group(i)) for i in (1, 2, 3))
                out.append({
                    "type": "diff",
                    "files": files,
                    "added": added,
                    "removed": removed,
                })
            except ValueError:
                pass

    # Gates — only meaningful from run_command / execute_python output.
    if tool_name in ("run_command", "execute_python"):
        # typecheck
        if _TSC_OK_RE.search(content):
            out.append({"type": "gate", "name": "typecheck", "state": "pass"})
        elif _TSC_FAIL_RE.search(content):
            out.append({"type": "gate", "name": "typecheck", "state": "fail"})
        # build
        if _BUILD_OK_RE.search(content):
            out.append({"type": "gate", "name": "build", "state": "pass"})
        elif _BUILD_FAIL_RE.search(content):
            out.append({"type": "gate", "name": "build", "state": "fail"})
        # test
        if _TEST_FAIL_RE.search(content):
            out.append({"type": "gate", "name": "test", "state": "fail"})
        elif _TEST_OK_RE.search(content):
            out.append({"type": "gate", "name": "test", "state": "pass"})

    return out


# ── Response Envelope ───────────────────────────────────────────────────────

@dataclass
class AgentResponse:
    """Structured result of an agent run."""
    answer: str
    tool_calls: list[dict[str, Any]] = field(default_factory=list)
    iterations: int = 0
    stop_reason: str = "end_turn"
    input_tokens: int = 0
    output_tokens: int = 0
    processing_time_ms: int = 0
    terminated_early: bool = False
    termination_reason: Optional[str] = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "mode": "agent",
            "answer": self.answer,
            "tool_calls": self.tool_calls,
            "iterations": self.iterations,
            "stop_reason": self.stop_reason,
            "total_input_tokens": self.input_tokens,
            "total_output_tokens": self.output_tokens,
            "processing_time_ms": self.processing_time_ms,
            "terminated_early": self.terminated_early,
            "termination_reason": self.termination_reason,
        }


# ── Orchestrator ────────────────────────────────────────────────────────────

class AgentOrchestrator:
    """Agent loop + routing. Owns its own Anthropic client and tool registry."""

    def __init__(
        self,
        registry: Optional[ToolRegistry] = None,
        client: Optional[AsyncAnthropic] = None,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_iterations: Optional[int] = None,
        label: str = "agent",
    ) -> None:
        if client is not None:
            self._client = client
        elif GAUNTLET_MOCK:
            self._client = MockAsyncAnthropic()
            logger.warning("AgentOrchestrator initialized in MOCK mode")
        else:
            if not ANTHROPIC_API_KEY:
                raise RuntimeError("ANTHROPIC_API_KEY not set")
            self._client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        self._registry = registry or ToolRegistry()
        self._system_prompt = system_prompt or AGENT_SYSTEM_PROMPT
        self._temperature = AGENT_TEMPERATURE if temperature is None else temperature
        self._max_iterations = max_iterations or MAX_AGENT_ITERATIONS
        self._label = label
        logger.info(
            "AgentOrchestrator[%s] ready (tools=%s)", self._label, self._registry.names()
        )

    # ── Routing ────────────────────────────────────────────────────────────

    @staticmethod
    def is_dev_intent(question: str) -> bool:
        """Heuristic router. Cheap keyword + syntactic signal detector."""
        if _DEV_PATTERN.search(question):
            return True
        # obvious dev syntax
        if re.search(r"```|\bdef\s+\w+|\bfunction\s+\w+|\bclass\s+\w+", question):
            return True
        if re.search(r"\b(?:npm|pip|git|docker|curl|bash)\s+\w+", question):
            return True
        return False

    # ── Agent Loop ─────────────────────────────────────────────────────────

    async def run(self, query: SignalQuery) -> AgentResponse:
        """Non-streaming wrapper around ``run_streaming`` — collects the final
        ``done`` event and builds an AgentResponse."""
        final: Optional[dict[str, Any]] = None
        async for event in self.run_streaming(query):
            if event["type"] == "done":
                final = event
        if not final:
            raise RuntimeError("agent stream ended without a done event")
        return AgentResponse(
            answer=final["answer"],
            tool_calls=final["tool_calls"],
            iterations=final["iterations"],
            stop_reason=final["stop_reason"],
            input_tokens=final["input_tokens"],
            output_tokens=final["output_tokens"],
            processing_time_ms=final["processing_time_ms"],
            terminated_early=final["terminated_early"],
            termination_reason=final["termination_reason"],
        )

    async def run_streaming(
        self, query: SignalQuery
    ) -> AsyncIterator[dict[str, Any]]:
        """Execute the agent loop, yielding coarse-grained progress events.

        Wave-5: when the query carries a ``chamber`` key whose profile
        specifies an ``allowed_tools`` allowlist, the agent's anthropic
        schema is filtered to that subset for this run — honoring the
        per-chamber tool policy. Absent profile / None allowlist keeps
        the legacy behavior (all registered tools visible).

        Event shapes:
          {"type": "start"}
          {"type": "iteration", "n": int}
          {"type": "assistant_text", "text": str, "iteration": int}
          {"type": "tool_use", "id": str, "name": str, "input": ..., "iteration": int}
          {"type": "tool_result", "id": str, "ok": bool, "preview": str, "iteration": int}
          {"type": "done", ...full AgentResponse dict...}
        """
        started = time.monotonic()

        # Wave E (P-3) re-review fix: compute the evidence task_id
        # fallback ONCE per agent run. Previously this was derived per
        # iteration (`agent-loop-{iteration}`), which fragmented one
        # logical run into N pseudo-tasks and broke downstream grouping
        # by taskId. `iteration` is already a separate field on the
        # record, so the fallback id stays constant for the whole run.
        # uuid4 ensures distinct ids across runs of the same mission.
        _run_task_id_fallback = (
            (query.task_id or "").strip()
            or f"agent-loop-{uuid.uuid4().hex[:12]}"
        )

        # Chamber profiles were retired with the Gauntlet migration; the
        # agent loop now always uses the orchestrator's default prompt and
        # the unfiltered tool schema. ``profile`` is kept as a local None
        # so the existing fallbacks downstream stay byte-equivalent.
        profile = None
        effective_system_prompt = (
            profile.system_prompt
            if profile and profile.system_prompt
            else self._system_prompt
        )
        # Sprint 5 — apply operator tool policies before exposing the
        # schema to the model. Disallowed tools are dropped both from the
        # Anthropic schema (so the model never proposes them) and from
        # the dispatch path (defence-in-depth: a stale schema cached by
        # the model can't slip a banned call through).
        active_registry = self._registry
        try:
            from composer_settings import settings_store
            settings = await settings_store.get()
            policies = {
                name: {
                    "allowed": p.allowed,
                    "require_approval": p.require_approval,
                }
                for name, p in settings.tool_policies.items()
            }
            if policies:
                active_registry = self._registry.with_policies(policies)
        except Exception:  # noqa: BLE001
            # Settings store unreachable — keep the unfiltered registry.
            # Failure here must not crash the agent loop.
            logger.warning(
                "agent: could not load tool policies; using unfiltered registry"
            )
        full_schema = active_registry.anthropic_schema()
        if profile is not None and profile.allowed_tools is not None:
            allowed = set(profile.allowed_tools)
            effective_schema = [t for t in full_schema if t["name"] in allowed]
        else:
            effective_schema = full_schema

        messages: list[dict[str, Any]] = [
            {"role": "user", "content": self._user_prompt(query)},
        ]
        tool_calls: list[dict[str, Any]] = []
        repeat_counts: dict[str, int] = {}
        total_in, total_out = 0, 0
        terminated_early = False
        termination_reason: Optional[str] = None
        stop_reason = "end_turn"
        iterations = 0

        yield {"type": "start"}

        # Wave P-29 — pause is an iteration-boundary check. We poll the
        # pause registry at the *top* of every iteration so a flip mid-
        # tool-call doesn't kill the run halfway through; the in-flight
        # tool finishes, the next iteration sees the flag, the loop
        # emits a `paused` event and bails with terminated_early=True.
        # Imported lazily to keep agent.py importable in environments
        # where MEMORY_DIR isn't writable (smoke tests).
        from pause_registry import pause_registry

        for iteration in range(1, self._max_iterations + 1):
            iterations = iteration

            # Check pause first so the wall-clock / tool-call budgets
            # don't shadow the operator's explicit pause request.
            if query.task_id and await pause_registry.is_paused(query.task_id):
                paused_entry = await pause_registry.get(query.task_id)
                terminated_early = True
                termination_reason = "paused"
                yield {
                    "type": "paused",
                    "task_id": query.task_id,
                    "iteration": iteration,
                    "reason": paused_entry.reason if paused_entry else None,
                    "paused_at": paused_entry.paused_at if paused_entry else None,
                }
                break

            if time.monotonic() - started > AGENT_WALL_CLOCK_S:
                terminated_early = True
                termination_reason = "wall-clock budget exceeded"
                break
            if len(tool_calls) > MAX_TOOL_CALLS:
                terminated_early = True
                termination_reason = f"tool-call budget exceeded ({MAX_TOOL_CALLS})"
                break

            yield {"type": "iteration", "n": iteration}

            response = await self._client.messages.create(
                model=MODEL_ID,
                max_tokens=MAX_TOKENS,
                temperature=self._temperature,
                system=effective_system_prompt + build_principles_context(query.principles),
                tools=effective_schema,
                messages=messages,
            )
            total_in += response.usage.input_tokens
            total_out += response.usage.output_tokens
            stop_reason = response.stop_reason or "end_turn"

            # Cumulative token budget. Iteration + tool-call caps catch
            # most loops, but a model emitting huge contexts can stay
            # under both while burning quota. Check after each turn so
            # the operator's bill never grows past the configured ceiling.
            if total_in + total_out > AGENT_TOKEN_BUDGET:
                terminated_early = True
                termination_reason = (
                    f"token budget exceeded "
                    f"({total_in + total_out} > {AGENT_TOKEN_BUDGET})"
                )
                break

            if stop_reason == "max_tokens":
                # Model truncated its own output mid-stream — surface it
                # explicitly so the caller doesn't treat the partial
                # answer as authoritative. This was previously folded
                # into the generic "non tool_use" branch and looked like
                # a clean completion.
                logger.warning(
                    "agent stop_reason=max_tokens at iter=%d (in=%d out=%d)",
                    iteration, total_in, total_out,
                )

            # Surface any interim reasoning text the model emitted before
            # deciding on tool calls (or as its final answer).
            for block in response.content:
                if block.type == "text" and block.text:
                    yield {
                        "type": "assistant_text",
                        "text": block.text,
                        "iteration": iteration,
                    }

            # Append the assistant turn verbatim (required by tool-use contract)
            messages.append({
                "role": "assistant",
                "content": [self._block_to_dict(b) for b in response.content],
            })

            if stop_reason != "tool_use":
                break

            tool_use_blocks = [b for b in response.content if b.type == "tool_use"]
            if not tool_use_blocks:
                break

            tool_results_content: list[dict[str, Any]] = []
            for block in tool_use_blocks:
                yield {
                    "type": "tool_use",
                    "id": block.id,
                    "name": block.name,
                    "input": block.input,
                    "iteration": iteration,
                }

                fingerprint = self._fingerprint(block.name, block.input)
                repeat_counts[fingerprint] = repeat_counts.get(fingerprint, 0) + 1
                repeats = repeat_counts[fingerprint]

                if repeats > MAX_REPEATS:
                    logger.warning(
                        "loop guard tripped on %s (repeat %d)", block.name, repeats
                    )
                    result = ToolResult(
                        ok=False,
                        content=(
                            f"[agent guard] '{block.name}' called {repeats} "
                            "times with the same input. Pick a different tool or "
                            "produce a final answer."
                        ),
                    )
                else:
                    # Sprint 5 — defence-in-depth: dispatch via the
                    # policy-filtered registry, so a stale schema in the
                    # model's context cannot route around the operator's
                    # opt-out. Unknown / disallowed names short-circuit
                    # to a refusal envelope.
                    if block.name not in active_registry.names():
                        result = ToolResult(
                            ok=False,
                            content=(
                                f"[policy] tool '{block.name}' is not "
                                "allowed by current Composer settings."
                            ),
                        )
                    else:
                        result = await active_registry.dispatch(
                            block.name, dict(block.input) if block.input else {}
                        )

                tool_calls.append({
                    "name": block.name,
                    "input": block.input,
                    "ok": result.ok,
                    "content_preview": result.content[:300],
                })
                tool_results_content.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": [result.to_tool_block()],
                    "is_error": not result.ok,
                })

                yield {
                    "type": "tool_result",
                    "id": block.id,
                    "ok": result.ok,
                    "preview": result.content[:300],
                    "iteration": iteration,
                }

                # Structured signals derived from the full tool content
                # (not the 300-char preview) so trailing summary lines
                # like "Found 0 errors" / "built in 1.2s" / git diff
                # shortstats are not lost. False positives stay silent.
                for sig in _extract_signals(block.name, result.content):
                    sig["iteration"] = iteration
                    sig["source"] = block.name
                    yield sig

            messages.append({"role": "user", "content": tool_results_content})

        else:
            # loop completed without `break` → iteration cap hit
            terminated_early = True
            termination_reason = f"iteration cap reached ({self._max_iterations})"

        answer = self._extract_text(messages[-1]) if messages else ""
        if not answer:
            for msg in reversed(messages):
                if msg["role"] == "assistant":
                    answer = self._extract_text(msg)
                    if answer:
                        break
        if not answer:
            answer = "(agent produced no final text)"

        yield {
            "type": "done",
            "answer": answer,
            "tool_calls": tool_calls,
            "iterations": iterations,
            "stop_reason": stop_reason,
            "input_tokens": total_in,
            "output_tokens": total_out,
            "processing_time_ms": int((time.monotonic() - started) * 1000),
            "terminated_early": terminated_early,
            "termination_reason": termination_reason,
        }

    # ── Helpers ────────────────────────────────────────────────────────────

    @staticmethod
    def _user_prompt(query: SignalQuery) -> str:
        if query.context:
            return f"Context:\n{query.context}\n\nTask:\n{query.question}"
        return query.question

    @staticmethod
    def _fingerprint(name: str, payload: Any) -> str:
        blob = json.dumps(payload, sort_keys=True, default=str) if payload else ""
        digest = hashlib.sha256(f"{name}::{blob}".encode()).hexdigest()[:16]
        return f"{name}:{digest}"

    @staticmethod
    def _block_to_dict(block: Any) -> dict[str, Any]:
        """Convert an Anthropic SDK content block into a plain dict for replay."""
        if block.type == "text":
            return {"type": "text", "text": block.text}
        if block.type == "tool_use":
            return {
                "type": "tool_use",
                "id": block.id,
                "name": block.name,
                "input": block.input,
            }
        # Defensive: unknown block types round-trip via ``model_dump`` if present
        dump = getattr(block, "model_dump", None)
        return dump() if callable(dump) else {"type": block.type}

    @staticmethod
    def _extract_text(message: dict[str, Any]) -> str:
        if message["role"] != "assistant":
            return ""
        parts = []
        for block in message.get("content", []):
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
        return "\n".join(p for p in parts if p).strip()
