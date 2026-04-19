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
from api_caching import build_system_blocks
from config import ANTHROPIC_API_KEY, MAX_TOKENS, MODEL_ID, RUBERRA_MOCK
from dataclasses import dataclass
from doctrine import (
    CREW_CODER_PROMPT,
    CREW_CRITIC_PROMPT,
    CREW_DOCS_WRITER_PROMPT,
    CREW_PLANNER_PROMPT,
    CREW_REFLECTION_PROMPT,
    CREW_RESEARCHER_PROMPT,
    CREW_SECURITY_REVIEWER_PROMPT,
    CREW_TEST_WRITER_PROMPT,
)
from mock_client import MockAsyncAnthropic
from models import RuberraQuery
from retrieval import RetrievedRun, format_retrieved, retrieve_similar
from tools import ToolRegistry

logger = logging.getLogger("ruberra.crew")


# ── Tunables ────────────────────────────────────────────────────────────────

MAX_REFINEMENTS: int = 1          # after first coder run, critic may reject once
PLANNER_TEMPERATURE: float = 1.0  # thinking requires temperature == 1
CRITIC_TEMPERATURE: float = 1.0   # thinking requires temperature == 1
REFLECTION_TEMPERATURE: float = 0.0

# Extended-thinking budget for the structured roles. Small budget = cheap
# stabilization; large budget = deeper verdicts. Callers can override via
# RUBERRA_THINKING_BUDGET env if needed (handled by config.py later).
PLANNER_THINKING_BUDGET: int = 1024
CRITIC_THINKING_BUDGET: int = 2048

# ── Specialist registry ─────────────────────────────────────────────────────


@dataclass(frozen=True)
class SpecialistSpec:
    """Static config for a crew specialist."""
    name: str
    system_prompt: str
    tools: tuple[str, ...]
    temperature: float = 0.2
    max_iterations: int = 6


SPECIALISTS: dict[str, SpecialistSpec] = {
    "researcher": SpecialistSpec(
        name="researcher",
        system_prompt=CREW_RESEARCHER_PROMPT,
        tools=("read_file", "list_directory", "git",
               "web_search", "fetch_url", "package_info"),
        temperature=0.2,
        max_iterations=6,
    ),
    "coder": SpecialistSpec(
        name="coder",
        system_prompt=CREW_CODER_PROMPT,
        tools=("read_file", "list_directory", "execute_python",
               "run_command", "git"),
        temperature=0.2,
        max_iterations=8,
    ),
    "security-reviewer": SpecialistSpec(
        name="security-reviewer",
        system_prompt=CREW_SECURITY_REVIEWER_PROMPT,
        tools=("read_file", "list_directory", "git", "fetch_url"),
        temperature=0.15,
        max_iterations=5,
    ),
    "test-writer": SpecialistSpec(
        name="test-writer",
        system_prompt=CREW_TEST_WRITER_PROMPT,
        tools=("read_file", "list_directory", "execute_python",
               "run_command", "git"),
        temperature=0.2,
        max_iterations=6,
    ),
    "docs-writer": SpecialistSpec(
        name="docs-writer",
        system_prompt=CREW_DOCS_WRITER_PROMPT,
        tools=("read_file", "list_directory", "git"),
        temperature=0.3,
        max_iterations=4,
    ),
}

VALID_ROLES = tuple(SPECIALISTS.keys())


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
        self._specialists: dict[str, AgentOrchestrator] = {}
        for name, spec in SPECIALISTS.items():
            scoped = self._registry.scoped(list(spec.tools))
            self._specialists[name] = AgentOrchestrator(
                registry=scoped,
                client=self._client,
                system_prompt=spec.system_prompt,
                temperature=spec.temperature,
                max_iterations=spec.max_iterations,
                label=name,
            )
        logger.info(
            "Crew ready: specialists=%s",
            list(self._specialists.keys()),
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

        # ── Semantic memory: pull similar past runs ────────────────────────
        try:
            similar = await retrieve_similar(
                query.question, limit=3, mission_id=query.mission_id,
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning("retrieval failed: %s", exc)
            similar = []
        if similar:
            yield {
                "type": "similar_runs",
                "count": len(similar),
                "matches": [
                    {
                        "question": r.run.question[:160],
                        "route": r.run.route,
                        "refused": r.run.refused,
                        "score": round(r.score, 3),
                    }
                    for r in similar
                ],
            }

        # ── Plan ────────────────────────────────────────────────────────────
        try:
            plan_text, plan_usage = await self._oneshot(
                system=CREW_PLANNER_PROMPT,
                user=self._planner_input(query, similar),
                temperature=PLANNER_TEMPERATURE,
                principles=query.principles,
                thinking_budget=PLANNER_THINKING_BUDGET,
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
        # per-role outputs keyed by role name; coder output is the primary
        # artifact handed to the critic.
        outputs: dict[str, str] = {}
        findings: Optional[str] = None  # researcher shortcut for compat
        coder_output: Optional[str] = None
        last_non_coder_output: Optional[str] = None
        coder_tool_calls = 0

        for step in steps:
            role = step["role"]
            goal = step["goal"]
            if role not in self._specialists:
                logger.warning("skipping unknown specialist: %s", role)
                continue
            specialist = self._specialists[role]

            yield {"type": "role_start", "role": role, "goal": goal, "iteration": 0}

            specialist_input = self._specialist_input(
                query, role, goal, outputs, findings, similar,
            )
            summary_chunks: list[str] = []
            tcs = 0
            tin = 0
            tout = 0
            async for ev in self._run_role_streaming(
                specialist, specialist_input, context=None,
            ):
                if ev["type"] == "role_event_raw":
                    inner = ev["event"]
                    if inner["type"] == "done":
                        summary_chunks.append(inner["answer"])
                        tcs = len(inner.get("tool_calls") or [])
                        tin = inner.get("input_tokens", 0)
                        tout = inner.get("output_tokens", 0)
                    else:
                        yield {"type": "role_event", "role": role, "event": inner}
            output = summary_chunks[-1] if summary_chunks else ""
            outputs[role] = output
            if role == "researcher":
                findings = output
            elif role == "coder":
                coder_output = output
                coder_tool_calls = tcs
            else:
                last_non_coder_output = output
            total_in += tin
            total_out += tout

            # Reflection is coder-specific.
            if role == "coder" and coder_output:
                before = coder_output
                try:
                    refl_text, refl_usage = await self._oneshot(
                        system=CREW_REFLECTION_PROMPT,
                        user=self._reflection_input(query, goal, coder_output),
                        temperature=REFLECTION_TEMPERATURE,
                        principles=query.principles,
                    )
                    total_in += refl_usage[0]
                    total_out += refl_usage[1]
                    refl = self._parse_json(refl_text, fallback={
                        "changed": False,
                        "reason": "(unparseable reflection)",
                        "revised": coder_output,
                    })
                    revised = str(refl.get("revised") or coder_output)
                    changed = bool(refl.get("changed"))
                    yield {
                        "type": "reflection",
                        "changed": changed,
                        "reason": str(refl.get("reason") or ""),
                        "before": before[:3000] if changed else None,
                        "after": revised[:3000] if changed else None,
                    }
                    if changed and revised:
                        coder_output = revised
                        outputs["coder"] = revised
                except Exception as exc:  # noqa: BLE001
                    logger.warning("reflection pass failed: %s", exc)
                    yield {
                        "type": "reflection",
                        "changed": False,
                        "reason": f"reflection unavailable: {exc}",
                        "before": None,
                        "after": None,
                    }

            roles_run.append(role)
            yield {
                "type": "role_done",
                "role": role,
                "summary": output[:600],
                "tool_calls": tcs,
                "input_tokens": tin,
                "output_tokens": tout,
            }

        # If the plan skipped the coder, the critic still deserves something
        # to audit: fall back to the last specialist's output.
        if coder_output is None and last_non_coder_output is None and findings:
            # informational flow — no artifact to audit
            pass

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
                    thinking_budget=CRITIC_THINKING_BUDGET,
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
                self._specialists["coder"], refine_input, context=None,
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
        thinking_budget: Optional[int] = None,
    ) -> tuple[str, tuple[int, int]]:
        """Single non-tool-using call. Returns (text, (input_tokens, output_tokens)).

        When ``thinking_budget`` > 0 extended thinking is enabled and
        temperature is forced to 1.0 (API requirement).
        """
        params: dict[str, Any] = dict(
            model=MODEL_ID,
            max_tokens=MAX_TOKENS,
            temperature=temperature,
            system=build_system_blocks(system, principles),
            messages=[{"role": "user", "content": user}],
        )
        if thinking_budget and thinking_budget > 0:
            params["thinking"] = {
                "type": "enabled",
                "budget_tokens": thinking_budget,
            }
            params["temperature"] = 1.0
        response = await self._client.messages.create(**params)
        # thinking blocks are skipped — only text contributes to the output
        text = ""
        for block in response.content:
            if getattr(block, "type", None) == "text":
                text += block.text
        usage = (response.usage.input_tokens, response.usage.output_tokens)
        return text, usage

    @staticmethod
    def _planner_input(
        query: RuberraQuery, similar: list[RetrievedRun],
    ) -> str:
        parts = [f"TASK: {query.question}"]
        if query.context:
            parts.append(f"CONTEXT: {query.context}")
        hint = format_retrieved(similar)
        if hint:
            parts.append(hint)
        return "\n\n".join(parts)

    @staticmethod
    def _specialist_input(
        query: RuberraQuery,
        role: str,
        goal: str,
        prior_outputs: dict[str, str],
        findings: Optional[str],
        similar: list[RetrievedRun],
    ) -> str:
        """Assemble a specialist's user prompt.

        Every specialist sees the task, user context, researcher findings,
        and similar past runs. Non-researcher specialists also see the
        coder's artifact if available — security-reviewer and test-writer
        especially need it.
        """
        parts = [f"ORIGINAL TASK: {query.question}"]
        if query.context:
            parts.append(f"CONTEXT: {query.context}")
        if findings and role != "researcher":
            parts.append(f"RESEARCHER FINDINGS:\n{findings}")
        coder_artifact = prior_outputs.get("coder")
        if coder_artifact and role in ("security-reviewer", "test-writer", "docs-writer"):
            parts.append(f"CODER ARTIFACT:\n{coder_artifact[:3000]}")
        hint = format_retrieved(similar)
        if hint:
            parts.append(hint)
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
    def _reflection_input(
        query: RuberraQuery, goal: str, draft: str,
    ) -> str:
        return (
            f"ORIGINAL TASK: {query.question}\n\n"
            f"YOUR GOAL: {goal}\n\n"
            f"YOUR DRAFT:\n{draft[:3500]}\n\n"
            "Review critically. Return the JSON as instructed."
        )

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
        """Accept only known specialists; cap to one step per role."""
        seen: set[str] = set()
        out: list[dict[str, str]] = []
        if isinstance(raw, list):
            for item in raw:
                if not isinstance(item, dict):
                    continue
                role = str(item.get("role", "")).strip().lower()
                goal = str(item.get("goal", "")).strip()
                if role not in VALID_ROLES or not goal:
                    continue
                if role in seen:
                    continue
                seen.add(role)
                out.append({"role": role, "goal": goal[:500]})
                if len(out) >= 4:
                    break  # hard cap per plan
        if not out:
            out.append({"role": "coder", "goal": task_fallback[:500]})
        # Canonical ordering: researcher → coder → security-reviewer
        # → test-writer → docs-writer. Anything else sorts stably.
        order = {"researcher": 0, "coder": 1, "security-reviewer": 2,
                 "test-writer": 3, "docs-writer": 4}
        out.sort(key=lambda s: order.get(s["role"], 99))
        return out
