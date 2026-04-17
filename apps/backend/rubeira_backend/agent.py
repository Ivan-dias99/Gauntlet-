"""
Rubeira Dev — Agent Orchestrator

Routes a query along one of two paths:

  * Dev intent detected  →  agentic loop with tool use
  * Everything else      →  existing ``RubeiraEngine.process_query`` (triad + judge)

The agent loop is a faithful implementation of Claude's native tool-use contract:
the model emits ``tool_use`` blocks, we execute them locally, append ``tool_result``
blocks to the conversation, and re-invoke until ``stop_reason == "end_turn"`` or
a hard iteration / wall-clock budget is exhausted.

Anti-loop guard: identical ``(tool_name, input_fingerprint)`` pairs are tracked
in a per-run counter. Exceeding ``MAX_REPEATS`` forces the agent to either pick
a different tool or terminate.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import re
import time
from dataclasses import dataclass, field
from typing import Any, Optional

from anthropic import AsyncAnthropic

from config import ANTHROPIC_API_KEY, MODEL_ID, MAX_TOKENS
from doctrine import AGENT_SYSTEM_PROMPT
from models import RubeiraQuery
from tools import ToolRegistry, ToolResult

logger = logging.getLogger("rubeira.agent")


# ── Tunables ────────────────────────────────────────────────────────────────

MAX_AGENT_ITERATIONS: int = 10       # outer loop: model turns
MAX_TOOL_CALLS: int = 20             # across the whole run
MAX_REPEATS: int = 3                 # same tool+input within a run
AGENT_TEMPERATURE: float = 0.2
AGENT_WALL_CLOCK_S: float = 90.0

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
    ) -> None:
        if not ANTHROPIC_API_KEY:
            raise RuntimeError("ANTHROPIC_API_KEY not set")
        self._client = client or AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        self._registry = registry or ToolRegistry()
        logger.info(
            "AgentOrchestrator ready (tools=%s)", self._registry.names()
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

    async def run(self, query: RubeiraQuery) -> AgentResponse:
        """Execute the agent loop until the model stops or budgets are hit."""
        started = time.monotonic()

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

        for iteration in range(1, MAX_AGENT_ITERATIONS + 1):
            iterations = iteration

            if time.monotonic() - started > AGENT_WALL_CLOCK_S:
                terminated_early = True
                termination_reason = "wall-clock budget exceeded"
                break
            if len(tool_calls) > MAX_TOOL_CALLS:
                terminated_early = True
                termination_reason = f"tool-call budget exceeded ({MAX_TOOL_CALLS})"
                break

            response = await self._client.messages.create(
                model=MODEL_ID,
                max_tokens=MAX_TOKENS,
                temperature=AGENT_TEMPERATURE,
                system=AGENT_SYSTEM_PROMPT,
                tools=self._registry.anthropic_schema(),
                messages=messages,
            )
            total_in += response.usage.input_tokens
            total_out += response.usage.output_tokens
            stop_reason = response.stop_reason or "end_turn"

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
                    result = await self._registry.dispatch(
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

            messages.append({"role": "user", "content": tool_results_content})

        else:
            # loop completed without `break` → iteration cap hit
            terminated_early = True
            termination_reason = f"iteration cap reached ({MAX_AGENT_ITERATIONS})"

        answer = self._extract_text(messages[-1]) if messages else ""
        if not answer:
            # Fall back to the last assistant text block anywhere in the trace
            for msg in reversed(messages):
                if msg["role"] == "assistant":
                    answer = self._extract_text(msg)
                    if answer:
                        break
        if not answer:
            answer = "(agent produced no final text)"

        return AgentResponse(
            answer=answer,
            tool_calls=tool_calls,
            iterations=iterations,
            stop_reason=stop_reason,
            input_tokens=total_in,
            output_tokens=total_out,
            processing_time_ms=int((time.monotonic() - started) * 1000),
            terminated_early=terminated_early,
            termination_reason=termination_reason,
        )

    # ── Helpers ────────────────────────────────────────────────────────────

    @staticmethod
    def _user_prompt(query: RubeiraQuery) -> str:
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
