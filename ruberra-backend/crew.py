"""
Ruberra Crew — Multi-Agent Orchestrator

Coordinates four specialized sub-agents against a single task:

    planner  →  researcher?  →  coder  →  critic  →  (refine once if rejected)

Each specialist is an ``AgentOrchestrator`` instance with a scoped system
prompt and a filtered ``ToolRegistry``. Structured roles (planner, critic)
run one-shot: no tool loop, just a single ``messages.create`` that must
return JSON. Execution roles (researcher, coder) run the full agent loop.

The crew shares one ``AsyncAnthropic`` client across all roles so prompt
caching and rate limits behave like a single caller.

Event envelope (wrapped to prevent collision with inner agent events):

    {"type": "crew_start", "task": str}
    {"type": "role_start", "role": str, "goal": str, "iteration": int}
    {"type": "role_event", "role": str, "event": <inner agent event>}
    {"type": "role_done",  "role": str, "summary": str, "tool_calls": int,
                           "input_tokens": int, "output_tokens": int}
    {"type": "plan",       "analysis": str, "steps": list[dict]}
    {"type": "critic_verdict", "accept": bool, "issues": list[str],
                               "summary": str, "refinement": int}
    {"type": "done",       "answer": str, "plan": dict, "roles_run": list[str],
                           "refinements": int, "input_tokens": int,
                           "output_tokens": int, "processing_time_ms": int,
                           "accepted": bool}
    {"type": "error",      "message": str}
"""

from __future__ import annotations

import json
import logging
import re
import time
from typing import Any, AsyncIterator, Optional

from anthropic import AsyncAnthropic

from agent import AgentOrchestrator, AGENT_WALL_CLOCK_S
from config import ANTHROPIC_API_KEY, MAX_TOKENS, MODEL_ID, RUBERRA_MOCK
from doctrine import (
    CREW_CODER_PROMPT,
    CREW_CRITIC_PROMPT,
    CREW_PLANNER_PROMPT,
    CREW_RESEARCHER_PROMPT,
    build_principles_context,
)
from mock_client import MockAsyncAnthropic
from models import RuberraQuery
from tools import ToolRegistry

logger = logging.getLogger("ruberra.crew")


# ── Tunables ────────────────────────────────────────────────────────────────

MAX_REFINEMENTS: int = 1          # after first coder run, critic may reject once
PLANNER_TEMPERATURE: float = 0.1
CRITIC_TEMPERATURE: float = 0.1
RESEARCHER_TEMPERATURE: float = 0.2
CODER_TEMPERATURE: float = 0.2
RESEARCHER_MAX_ITER: int = 6
CODER_MAX_ITER: int = 8

# Role → tool names (must exist in the shared registry)
RESEARCHER_TOOLS: tuple[str, ...] = (
    "read_file", "list_directory", "git", "web_search", "fetch_url", "package_info",
)
CODER_TOOLS: tuple[str, ...] = (
    "read_file", "list_directory", "execute_python", "run_command", "git",
)


# ── Orchestrator ────────────────────────────────────────────────────────────


class CrewOrchestrator:
    """Runs the planner → (researcher) → coder → critic pipeline."""

    def __init__(
        self,
        registry: Optional[ToolRegistry] = None,
        client: Optional[AsyncAnthropic] = None,
    ) -> None:
        if client is not None:
            self._client = client
        elif RUBERRA_MOCK:
            self._client = MockAsyncAnthropic()
            logger.warning("CrewOrchestrator initialized in MOCK mode")
        else:
            if not ANTHROPIC_API_KEY:
                raise RuntimeError("ANTHROPIC_API_KEY not set")
            self._client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        self._registry = registry or ToolRegistry()

        researcher_reg = self._registry.scoped(list(RESEARCHER_TOOLS))
        coder_reg = self._registry.scoped(list(CODER_TOOLS))
        self._researcher = AgentOrchestrator(
            registry=researcher_reg,
            client=self._client,
            system_prompt=CREW_RESEARCHER_PROMPT,
            temperature=RESEARCHER_TEMPERATURE,
            max_iterations=RESEARCHER_MAX_ITER,
            label="researcher",
        )
        self._coder = AgentOrchestrator(
            registry=coder_reg,
            client=self._client,
            system_prompt=CREW_CODER_PROMPT,
            temperature=CODER_TEMPERATURE,
            max_iterations=CODER_MAX_ITER,
            label="coder",
        )
        logger.info(
            "Crew ready: researcher=%s coder=%s",
            researcher_reg.names(), coder_reg.names(),
        )

    # ── Public API ─────────────────────────────────────────────────────────

    async def run_streaming(
        self, query: RuberraQuery
    ) -> AsyncIterator[dict[str, Any]]:
        started = time.monotonic()
        total_in = 0
        total_out = 0
        roles_run: list[str] = []

        yield {"type": "crew_start", "task": query.question[:200]}

        # ── Plan ────────────────────────────────────────────────────────────
        try:
            plan_text, plan_usage = await self._oneshot(
                system=CREW_PLANNER_PROMPT,
                user=self._planner_input(query),
                temperature=PLANNER_TEMPERATURE,
                principles=query.principles,
            )
        except Exception as exc:  # noqa: BLE001
            logger.exception("planner failed")
            yield {"type": "error", "message": f"planner failed: {exc}"}
            return
        total_in += plan_usage[0]
        total_out += plan_usage[1]

        plan = self._parse_json(plan_text, fallback={
            "analysis": "planner returned unparseable output",
            "steps": [{"role": "coder", "goal": query.question}],
        })
        steps = self._sanitize_steps(plan.get("steps"), query.question)
        plan["steps"] = steps
        yield {"type": "plan", "analysis": plan.get("analysis", ""), "steps": steps}

        # ── Execute plan ────────────────────────────────────────────────────
        findings: Optional[str] = None
        coder_output: Optional[str] = None
        coder_tool_calls = 0

        for step in steps:
            role = step["role"]
            goal = step["goal"]
            yield {"type": "role_start", "role": role, "goal": goal, "iteration": 0}
            if role == "researcher":
                summary_chunks: list[str] = []
                tcs = 0
                tin = 0
                tout = 0
                async for ev in self._run_role_streaming(
                    self._researcher, goal, context=None,
                ):
                    if ev["type"] == "role_event_raw":
                        inner = ev["event"]
                        if inner["type"] == "done":
                            summary_chunks.append(inner["answer"])
                            tcs = len(inner.get("tool_calls") or [])
                            tin = inner.get("input_tokens", 0)
                            tout = inner.get("output_tokens", 0)
                        else:
                            yield {"type": "role_event", "role": "researcher", "event": inner}
                findings = summary_chunks[-1] if summary_chunks else ""
                total_in += tin
                total_out += tout
                roles_run.append("researcher")
                yield {
                    "type": "role_done",
                    "role": "researcher",
                    "summary": findings[:600],
                    "tool_calls": tcs,
                    "input_tokens": tin,
                    "output_tokens": tout,
                }
            elif role == "coder":
                summary_chunks = []
                tcs = 0
                tin = 0
                tout = 0
                coder_input = self._coder_input(query, goal, findings)
                async for ev in self._run_role_streaming(
                    self._coder, coder_input, context=None,
                ):
                    if ev["type"] == "role_event_raw":
                        inner = ev["event"]
                        if inner["type"] == "done":
                            summary_chunks.append(inner["answer"])
                            tcs = len(inner.get("tool_calls") or [])
                            tin = inner.get("input_tokens", 0)
                            tout = inner.get("output_tokens", 0)
                        else:
                            yield {"type": "role_event", "role": "coder", "event": inner}
                coder_output = summary_chunks[-1] if summary_chunks else ""
                coder_tool_calls = tcs
                total_in += tin
                total_out += tout
                roles_run.append("coder")
                yield {
                    "type": "role_done",
                    "role": "coder",
                    "summary": coder_output[:600],
                    "tool_calls": tcs,
                    "input_tokens": tin,
                    "output_tokens": tout,
                }

        if coder_output is None:
            # informational task — no coder step; use findings as the answer
            answer = findings or "(crew produced no output)"
            yield {
                "type": "done",
                "answer": answer,
                "plan": plan,
                "roles_run": roles_run,
                "refinements": 0,
                "input_tokens": total_in,
                "output_tokens": total_out,
                "processing_time_ms": int((time.monotonic() - started) * 1000),
                "accepted": True,
            }
            return

        # ── Critic → maybe refine ──────────────────────────────────────────
        refinements = 0
        accepted = False
        critic_summary = ""
        while True:
            try:
                verdict_text, verdict_usage = await self._oneshot(
                    system=CREW_CRITIC_PROMPT,
                    user=self._critic_input(query, plan, findings, coder_output),
                    temperature=CRITIC_TEMPERATURE,
                    principles=query.principles,
                )
            except Exception as exc:  # noqa: BLE001
                logger.exception("critic failed")
                verdict_text = json.dumps({
                    "accept": True,
                    "issues": [],
                    "summary": f"critic unavailable ({exc}) — passing through",
                })
                verdict_usage = (0, 0)
            total_in += verdict_usage[0]
            total_out += verdict_usage[1]

            verdict = self._parse_json(verdict_text, fallback={
                "accept": True, "issues": [], "summary": "(unparseable critic output)",
            })
            accepted = bool(verdict.get("accept"))
            issues = [str(i) for i in (verdict.get("issues") or [])][:10]
            critic_summary = str(verdict.get("summary") or "")
            yield {
                "type": "critic_verdict",
                "accept": accepted,
                "issues": issues,
                "summary": critic_summary,
                "refinement": refinements,
            }

            if accepted or refinements >= MAX_REFINEMENTS:
                break

            refinements += 1
            yield {
                "type": "role_start",
                "role": "coder",
                "goal": "refine: address critic issues",
                "iteration": refinements,
            }
            refine_input = self._refine_input(query, coder_output, issues)
            tcs, tin, tout = 0, 0, 0
            summary_chunks = []
            async for ev in self._run_role_streaming(
                self._coder, refine_input, context=None,
            ):
                if ev["type"] == "role_event_raw":
                    inner = ev["event"]
                    if inner["type"] == "done":
                        summary_chunks.append(inner["answer"])
                        tcs = len(inner.get("tool_calls") or [])
                        tin = inner.get("input_tokens", 0)
                        tout = inner.get("output_tokens", 0)
                    else:
                        yield {"type": "role_event", "role": "coder", "event": inner}
            coder_output = summary_chunks[-1] if summary_chunks else coder_output
            coder_tool_calls += tcs
            total_in += tin
            total_out += tout
            yield {
                "type": "role_done",
                "role": "coder",
                "summary": (coder_output or "")[:600],
                "tool_calls": tcs,
                "input_tokens": tin,
                "output_tokens": tout,
            }

        yield {
            "type": "done",
            "answer": coder_output or "(crew produced no output)",
            "plan": plan,
            "roles_run": roles_run,
            "refinements": refinements,
            "input_tokens": total_in,
            "output_tokens": total_out,
            "processing_time_ms": int((time.monotonic() - started) * 1000),
            "accepted": accepted,
        }

    # ── Helpers ────────────────────────────────────────────────────────────

    async def _run_role_streaming(
        self,
        role: AgentOrchestrator,
        goal: str,
        context: Optional[str],
    ) -> AsyncIterator[dict[str, Any]]:
        """Run an agent role. Wrap each inner event as ``role_event_raw`` so
        the caller can choose to re-emit or consume (e.g. capture `done`)."""
        sub_query = RuberraQuery(question=goal, context=context)
        async for inner in role.run_streaming(sub_query):
            yield {"type": "role_event_raw", "event": inner}

    async def _oneshot(
        self,
        *,
        system: str,
        user: str,
        temperature: float,
        principles: Optional[list[str]],
    ) -> tuple[str, tuple[int, int]]:
        """Single non-tool-using call. Returns (text, (input_tokens, output_tokens))."""
        full_system = system + build_principles_context(principles)
        response = await self._client.messages.create(
            model=MODEL_ID,
            max_tokens=MAX_TOKENS,
            temperature=temperature,
            system=full_system,
            messages=[{"role": "user", "content": user}],
        )
        text = ""
        for block in response.content:
            if block.type == "text":
                text += block.text
        usage = (response.usage.input_tokens, response.usage.output_tokens)
        return text, usage

    @staticmethod
    def _planner_input(query: RuberraQuery) -> str:
        parts = [f"TASK: {query.question}"]
        if query.context:
            parts.append(f"CONTEXT: {query.context}")
        return "\n\n".join(parts)

    @staticmethod
    def _coder_input(
        query: RuberraQuery, goal: str, findings: Optional[str]
    ) -> str:
        parts = [f"ORIGINAL TASK: {query.question}"]
        if query.context:
            parts.append(f"CONTEXT: {query.context}")
        if findings:
            parts.append(f"RESEARCHER FINDINGS:\n{findings}")
        parts.append(f"YOUR GOAL: {goal}")
        return "\n\n".join(parts)

    @staticmethod
    def _critic_input(
        query: RuberraQuery,
        plan: dict,
        findings: Optional[str],
        coder_output: str,
    ) -> str:
        parts = [
            f"ORIGINAL TASK: {query.question}",
            f"PLAN: {json.dumps(plan.get('steps'), ensure_ascii=False)}",
        ]
        if findings:
            parts.append(f"RESEARCHER FINDINGS:\n{findings[:1500]}")
        parts.append(f"CODER OUTPUT:\n{coder_output[:3000]}")
        return "\n\n".join(parts)

    @staticmethod
    def _refine_input(
        query: RuberraQuery, previous: str, issues: list[str],
    ) -> str:
        issue_block = "\n".join(f"- {i}" for i in issues) or "(no specific issues)"
        return (
            f"ORIGINAL TASK: {query.question}\n\n"
            f"PREVIOUS OUTPUT (rejected):\n{previous[:2500]}\n\n"
            f"CRITIC ISSUES:\n{issue_block}\n\n"
            "Produce a revised output addressing every issue. Do not repeat the "
            "previous mistakes."
        )

    @staticmethod
    def _parse_json(text: str, fallback: dict) -> dict:
        cleaned = text.strip()
        # strip markdown fences if present
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```[a-zA-Z]*\s*", "", cleaned)
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
        # also tolerate a json block buried in prose
        if not cleaned.startswith("{"):
            m = re.search(r"\{.*\}", cleaned, flags=re.S)
            if m:
                cleaned = m.group(0)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            logger.warning("JSON parse failed, using fallback. raw=%r", text[:200])
            return dict(fallback)

    @staticmethod
    def _sanitize_steps(
        raw: Any, task_fallback: str,
    ) -> list[dict[str, str]]:
        """Accept only researcher/coder steps; cap to one of each."""
        seen: set[str] = set()
        out: list[dict[str, str]] = []
        if isinstance(raw, list):
            for item in raw:
                if not isinstance(item, dict):
                    continue
                role = str(item.get("role", "")).strip().lower()
                goal = str(item.get("goal", "")).strip()
                if role not in ("researcher", "coder") or not goal:
                    continue
                if role in seen:
                    continue
                seen.add(role)
                out.append({"role": role, "goal": goal[:500]})
        # ensure at least one coder step unless researcher-only informational
        if not out:
            out.append({"role": "coder", "goal": task_fallback[:500]})
        # enforce ordering: researcher first if both present
        out.sort(key=lambda s: 0 if s["role"] == "researcher" else 1)
        return out
