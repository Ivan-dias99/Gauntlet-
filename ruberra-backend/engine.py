"""
Ruberra — Self-Consistency Engine
The core brain. Fires 3 parallel calls to Claude Sonnet,
then routes the responses through the Judge for a binary verdict.
Binary confidence: HIGH (all 3 agree) or LOW (refuse).
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, AsyncIterator, Optional

from anthropic import AsyncAnthropic

from config import (
    ANTHROPIC_API_KEY,
    MODEL_ID,
    TRIAD_TEMPERATURE,
    JUDGE_TEMPERATURE,
    MAX_TOKENS,
    TRIAD_COUNT,
    RUBERRA_MOCK,
)
from mock_client import MockAsyncAnthropic
from doctrine import (
    SYSTEM_PROMPT,
    JUDGE_PROMPT,
    build_judge_input,
    build_refusal_message,
    build_cautious_answer_wrapper,
    build_failure_context,
    build_principles_context,
)
from models import (
    ConfidenceLevel,
    RefusalReason,
    RuberraQuery,
    RuberraResponse,
    TriadResponse,
    JudgeVerdict,
    RunRecord,
)
from memory import failure_memory
from runs import run_store

logger = logging.getLogger("ruberra.engine")

# Agent layer is imported lazily to avoid an import cycle and to keep the
# triad path usable even if the agent module is later swapped out.
_agent_singleton: Optional["AgentOrchestrator"] = None  # type: ignore[name-defined]


def _get_agent() -> "AgentOrchestrator":  # type: ignore[name-defined]
    global _agent_singleton
    if _agent_singleton is None:
        from agent import AgentOrchestrator
        _agent_singleton = AgentOrchestrator()
    return _agent_singleton


_crew_singleton: Optional["CrewOrchestrator"] = None  # type: ignore[name-defined]


def _get_crew() -> "CrewOrchestrator":  # type: ignore[name-defined]
    global _crew_singleton
    if _crew_singleton is None:
        from crew import CrewOrchestrator
        _crew_singleton = CrewOrchestrator()
    return _crew_singleton



class RuberraEngine:
    """
    The sovereign intelligence engine.
    
    Flow:
    1. Receive question
    2. Check failure memory for prior failures on similar questions
    3. Build system prompt (with failure context injected if matched)
    4. Fire 3 parallel calls to Claude Sonnet (self-consistency triad)
    5. Collect all 3 responses
    6. Send responses to the Judge for consistency evaluation
    7. Parse judge verdict
    8. Decision logic:
       - HIGH confidence → deliver answer
       - LOW confidence → refuse and explain why
    9. If refused → record failure in memory
    10. Return structured response
    """
    
    def __init__(self) -> None:
        if RUBERRA_MOCK:
            self._client = MockAsyncAnthropic()
            logger.warning("Engine initialized in MOCK mode — no network calls")
        else:
            if not ANTHROPIC_API_KEY:
                raise RuntimeError(
                    "ANTHROPIC_API_KEY not set. "
                    "Export it in your environment before starting Ruberra."
                )
            self._client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        logger.info(f"Engine initialized. Model: {MODEL_ID}, Triad count: {TRIAD_COUNT}")
    
    # ── Triad Call ──────────────────────────────────────────────────────────
    
    async def _single_triad_call(
        self,
        index: int,
        system_prompt: str,
        question: str,
        context: Optional[str] = None,
    ) -> TriadResponse:
        """
        Execute a single call in the self-consistency triad.
        Each call uses the same system prompt and question but
        may produce slightly different responses due to model stochasticity.
        """
        user_message = question
        if context:
            user_message = f"Context: {context}\n\nQuestion: {question}"
        
        try:
            response = await self._client.messages.create(
                model=MODEL_ID,
                max_tokens=MAX_TOKENS,
                temperature=TRIAD_TEMPERATURE,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ],
            )
            
            content = ""
            for block in response.content:
                if block.type == "text":
                    content += block.text
            
            return TriadResponse(
                index=index,
                content=content,
                model=response.model,
                stop_reason=response.stop_reason,
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
            )
        
        except Exception as e:
            logger.error(f"Triad call {index} failed: {e}")
            return TriadResponse(
                index=index,
                content=f"[TRIAD CALL FAILED: {str(e)}]",
                model=MODEL_ID,
                stop_reason="error",
            )
    
    # ── Judge ───────────────────────────────────────────────────────────────
    
    async def _invoke_judge(
        self,
        question: str,
        triad_responses: list[TriadResponse],
    ) -> JudgeVerdict:
        """
        Send the 3 triad responses to the Judge for consistency evaluation.
        The Judge returns a structured JSON verdict.
        """
        judge_input = build_judge_input(
            question=question,
            responses=[r.content for r in triad_responses],
        )
        
        logger.info("Invoking Judge...")
        
        try:
            response = await self._client.messages.create(
                model=MODEL_ID,
                max_tokens=MAX_TOKENS,
                temperature=JUDGE_TEMPERATURE,
                system=JUDGE_PROMPT,
                messages=[
                    {"role": "user", "content": judge_input}
                ],
            )
            
            raw_content = ""
            for block in response.content:
                if block.type == "text":
                    raw_content += block.text
            
            verdict = self._parse_judge_verdict(raw_content)
            logger.info(
                f"Judge verdict: confidence={verdict.confidence.value}, "
                f"should_refuse={verdict.should_refuse}"
            )
            return verdict
        
        except Exception as e:
            logger.error(f"Judge invocation failed: {e}")
            return JudgeVerdict(
                confidence=ConfidenceLevel.LOW,
                reasoning=f"Judge invocation failed: {str(e)}. Defaulting to refusal for safety.",
                consensus_answer=None,
                divergence_points=["Judge system error"],
                should_refuse=True,
                refusal_reason=RefusalReason.JUDGE_REJECTION,
            )
    
    def _parse_judge_verdict(self, raw: str) -> JudgeVerdict:
        """
        Parse the Judge's JSON response into a JudgeVerdict.
        Handles markdown code fences and malformed JSON gracefully.
        """
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            first_newline = cleaned.index("\n")
            cleaned = cleaned[first_newline + 1:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.error(f"Judge returned invalid JSON: {e}\nRaw: {raw[:500]}")
            return JudgeVerdict(
                confidence=ConfidenceLevel.LOW,
                reasoning=f"Judge returned unparseable response. Raw: {raw[:300]}. Defaulting to refusal.",
                should_refuse=True,
                refusal_reason=RefusalReason.JUDGE_REJECTION,
            )
        
        conf_str = data.get("confidence", "low").lower()
        confidence_map = {
            "high": ConfidenceLevel.HIGH,
            "low": ConfidenceLevel.LOW,
        }
        confidence = confidence_map.get(conf_str, ConfidenceLevel.LOW)
        
        refusal_str = data.get("refusal_reason")
        refusal_reason = None
        if refusal_str:
            reason_map = {
                "inconsistency": RefusalReason.INCONSISTENCY,
                "insufficient_knowledge": RefusalReason.INSUFFICIENT_KNOWLEDGE,
                "safety": RefusalReason.SAFETY,
                "prior_failure": RefusalReason.PRIOR_FAILURE,
                "judge_rejection": RefusalReason.JUDGE_REJECTION,
            }
            refusal_reason = reason_map.get(refusal_str, RefusalReason.INCONSISTENCY)
        
        return JudgeVerdict(
            confidence=confidence,
            reasoning=data.get("reasoning", "No reasoning provided"),
            consensus_answer=data.get("consensus_answer"),
            divergence_points=data.get("divergence_points", []),
            should_refuse=data.get("should_refuse", confidence == ConfidenceLevel.LOW),
            refusal_reason=refusal_reason,
        )
    
    # ── Dev / Agent Path ────────────────────────────────────────────────────

    async def process_dev_query(self, query: RuberraQuery):
        """
        Route a query through the agent loop (tool use) instead of the triad.
        Returns the raw ``AgentResponse`` — callers serialize it.
        """
        logger.info("Routing to agent loop: %s", query.question[:120])
        agent = _get_agent()
        result = await agent.run(query)
        await run_store.record(RunRecord(
            route="agent",
            mission_id=query.mission_id,
            question=query.question,
            context=query.context,
            answer=result.answer,
            tool_calls=result.tool_calls,
            iterations=result.iterations,
            processing_time_ms=result.processing_time_ms,
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
            terminated_early=result.terminated_early,
            termination_reason=result.termination_reason,
        ))
        return result

    async def process_dev_query_streaming(
        self, query: RuberraQuery
    ) -> AsyncIterator[dict[str, Any]]:
        """Streaming variant of ``process_dev_query`` — yields agent events
        and records the completed run on ``done``."""
        logger.info("Routing to agent loop (streaming): %s", query.question[:120])
        agent = _get_agent()
        final: Optional[dict[str, Any]] = None
        async for event in agent.run_streaming(query):
            yield event
            if event["type"] == "done":
                final = event
        if final:
            await run_store.record(RunRecord(
                route="agent",
                mission_id=query.mission_id,
                question=query.question,
                context=query.context,
                answer=final["answer"],
                tool_calls=final["tool_calls"],
                iterations=final["iterations"],
                processing_time_ms=final["processing_time_ms"],
                input_tokens=final["input_tokens"],
                output_tokens=final["output_tokens"],
                terminated_early=final["terminated_early"],
                termination_reason=final["termination_reason"],
            ))

    async def process_crew_query_streaming(
        self, query: RuberraQuery
    ) -> AsyncIterator[dict[str, Any]]:
        """Multi-agent crew: planner → (researcher) → coder → critic.

        Yields crew envelope events. On ``done``, records the run so the
        Memory chamber shows it alongside agent / triad runs.
        """
        logger.info("Routing to crew (streaming): %s", query.question[:120])
        crew = _get_crew()
        final: Optional[dict[str, Any]] = None
        async for event in crew.run_streaming(query):
            yield event
            if event["type"] == "done":
                final = event
        if final:
            await run_store.record(RunRecord(
                route="crew",
                mission_id=query.mission_id,
                question=query.question,
                context=query.context,
                answer=final["answer"],
                tool_calls=[{"name": r, "ok": True} for r in final.get("roles_run", [])],
                iterations=final.get("refinements", 0),
                processing_time_ms=final["processing_time_ms"],
                input_tokens=final["input_tokens"],
                output_tokens=final["output_tokens"],
                terminated_early=not final.get("accepted", True),
                termination_reason=(
                    "critic rejected after refinement"
                    if not final.get("accepted", True) else None
                ),
            ))

    # ── Routing helper (Wave 1, populated in Wave 5) ───────────────────────

    @staticmethod
    def _auto_route_agent(query: RuberraQuery) -> bool:
        """
        Decide whether the auto-router dispatches to the agent loop. When
        the query carries an explicit ``chamber`` key, the chamber
        profile's ``dispatch`` decides; when absent, falls back to the
        legacy ``is_dev_intent`` heuristic so pre-Wave-1 clients behave
        exactly as before. The surface_mock dispatch is handled out of
        this function — see process_auto_streaming's surface fork.
        """
        from agent import AgentOrchestrator
        from chambers.profiles import get_profile
        profile = get_profile(query.chamber)
        if profile is not None:
            return profile.dispatch == "agent"
        return AgentOrchestrator.is_dev_intent(query.question)

    async def process_auto(self, query: RuberraQuery):
        """
        Auto-router: if the query carries a chamber, profile decides;
        otherwise dev-intent queries go through the agent loop and the
        rest through the conservative triad + judge pipeline.
        """
        if self._auto_route_agent(query):
            result = await self.process_dev_query(query)
            return {"route": "agent", "result": result.to_dict()}
        result = await self.process_query(query)
        return {"route": "triad", "result": result.model_dump()}

    async def process_auto_streaming(
        self, query: RuberraQuery
    ) -> AsyncIterator[dict[str, Any]]:
        """Auto-router streaming variant. Emits a ``route`` event first, then
        streams agent, triad or surface-mock events under a unified envelope.

        Wave-3 addition: when ``query.chamber == "surface"`` the router forks
        to the chamber-specific mock handler instead of the generic agent
        loop. The mock emits a structured ``surface_plan`` event and a
        ``done`` event with ``mock: True`` in the payload — no provider is
        invoked. Replaced by real generation in Wave 5.
        """
        from chambers.profiles import ChamberKey
        if query.chamber == ChamberKey.SURFACE:
            from chambers.surface import process_surface_mock_streaming
            yield {"type": "route", "path": "surface"}
            async for event in process_surface_mock_streaming(query.question, query.surface):
                yield event
            return

        if self._auto_route_agent(query):
            yield {"type": "route", "path": "agent"}
            async for event in self.process_dev_query_streaming(query):
                yield event
        else:
            yield {"type": "route", "path": "triad"}
            async for event in self.process_query_streaming(query):
                yield event

    # ── Main Pipeline ───────────────────────────────────────────────────────

    async def process_query(self, query: RuberraQuery) -> RuberraResponse:
        """Non-streaming wrapper — collects the final event and rebuilds
        the ``RuberraResponse`` model."""
        final: Optional[dict[str, Any]] = None
        async for event in self.process_query_streaming(query):
            if event["type"] == "done":
                final = event
        if not final:
            raise RuntimeError("triad stream ended without a done event")
        return RuberraResponse.model_validate(final["result"])

    async def process_query_streaming(
        self, query: RuberraQuery
    ) -> AsyncIterator[dict[str, Any]]:
        """
        The complete Ruberra pipeline, emitting events at each checkpoint:
        ``start``, ``triad_start``, ``triad_done`` (per call), ``judge_start``,
        ``judge_done``, ``done`` (full RuberraResponse dict).
        """
        start_time = time.monotonic()
        yield {"type": "start"}

        # ── Step 1: failure memory ──────────────────────────────────────────
        matching_failures = await failure_memory.find_matching_failures(query.question)
        has_prior_failure = len(matching_failures) > 0
        if has_prior_failure:
            logger.warning(
                f"Found {len(matching_failures)} prior failure(s). "
                "Engaging reinforced caution."
            )

        # ── Step 2: system prompt ───────────────────────────────────────────
        # Wave-5: chamber profile overrides the global SYSTEM_PROMPT when
        # a chamber is attached to the query. Failure context + force_cautious
        # caution + principles append the same way on top of whichever base
        # was selected. Pre-Wave-1 clients (no chamber) continue to use
        # SYSTEM_PROMPT verbatim.
        from chambers.profiles import get_profile
        _profile = get_profile(query.chamber)
        base_prompt = (
            _profile.system_prompt
            if _profile and _profile.system_prompt
            else SYSTEM_PROMPT
        )
        system_prompt = base_prompt
        if matching_failures or query.force_cautious:
            system_prompt = base_prompt + build_failure_context(matching_failures)
            if query.force_cautious:
                system_prompt += (
                    "\n\n## ⚠️ FORCED CAUTION MODE\n"
                    "The user has explicitly requested maximum caution. "
                    "Increase all uncertainty thresholds. "
                    "Prefer refusal over any risk of error."
                )
        system_prompt += build_principles_context(query.principles)
        # Note: profile.temperature is exposed via Core → Routing but not
        # yet applied to triad calls. Wave 7 threads it through
        # _single_triad_call so the override is honored end-to-end.

        # ── Step 3: parallel triad with per-completion events ───────────────
        yield {
            "type": "triad_start",
            "count": TRIAD_COUNT,
            "has_prior_failure": has_prior_failure,
        }
        tasks = [
            asyncio.create_task(
                self._single_triad_call(i, system_prompt, query.question, query.context)
            )
            for i in range(TRIAD_COUNT)
        ]
        triad_responses: list[TriadResponse] = []
        for coro in asyncio.as_completed(tasks):
            r = await coro
            triad_responses.append(r)
            yield {
                "type": "triad_done",
                "index": r.index,
                "length": len(r.content),
                "input_tokens": r.input_tokens,
                "output_tokens": r.output_tokens,
                "stop_reason": r.stop_reason,
                "completed": len(triad_responses),
                "total": TRIAD_COUNT,
            }
        triad_responses.sort(key=lambda r: r.index)

        # Check for total triad failure
        failed_calls = [r for r in triad_responses if r.stop_reason == "error"]
        if len(failed_calls) >= 2:
            elapsed = int((time.monotonic() - start_time) * 1000)
            response = RuberraResponse(
                refused=True,
                refusal_message=(
                    "⚠️ **Ruberra — Falha de Sistema**\n\n"
                    f"{len(failed_calls)} de {TRIAD_COUNT} chamadas internas falharam. "
                    "Impossível avaliar consistência. Resposta recusada por segurança."
                ),
                refusal_reason=RefusalReason.JUDGE_REJECTION,
                confidence=ConfidenceLevel.LOW,
                confidence_explanation="Majority of triad calls failed",
                triad_agreement=f"{len(failed_calls)}/{TRIAD_COUNT} calls failed",
                total_input_tokens=sum(r.input_tokens for r in triad_responses),
                total_output_tokens=sum(r.output_tokens for r in triad_responses),
                processing_time_ms=elapsed,
                matched_prior_failure=has_prior_failure,
            )
            await self._log_triad_run(query, response)
            yield {"type": "done", "result": response.model_dump()}
            return

        # ── Step 4: judge ───────────────────────────────────────────────────
        yield {"type": "judge_start"}
        verdict = await self._invoke_judge(query.question, triad_responses)
        yield {
            "type": "judge_done",
            "confidence": verdict.confidence.value,
            "should_refuse": verdict.should_refuse,
            "reasoning": verdict.reasoning,
            "divergence_count": len(verdict.divergence_points),
        }

        # ── Step 5: decision ────────────────────────────────────────────────
        elapsed = int((time.monotonic() - start_time) * 1000)
        total_in = sum(r.input_tokens for r in triad_responses)
        total_out = sum(r.output_tokens for r in triad_responses)
        triad_summary = self._build_triad_summary(triad_responses, verdict)

        if verdict.confidence == ConfidenceLevel.HIGH and not verdict.should_refuse:
            answer = verdict.consensus_answer or triad_responses[0].content
            if has_prior_failure:
                answer = build_cautious_answer_wrapper(
                    answer=answer, prior_failure=True,
                )
            response = RuberraResponse(
                answer=answer,
                refused=False,
                confidence=ConfidenceLevel.HIGH,
                confidence_explanation=(
                    "Todas as 3 análises internas produziram respostas consistentes. "
                    "Confiança máxima."
                ),
                triad_agreement=triad_summary,
                judge_reasoning=verdict.reasoning,
                total_input_tokens=total_in,
                total_output_tokens=total_out,
                processing_time_ms=elapsed,
                matched_prior_failure=has_prior_failure,
                prior_failure_note=(
                    "Apesar de corresponder a falhas anteriores, "
                    "as 3 respostas foram consistentes."
                    if has_prior_failure else None
                ),
            )
        else:
            refusal_reason = verdict.refusal_reason or RefusalReason.INCONSISTENCY
            refusal_msg = build_refusal_message(
                confidence_level=verdict.confidence.value,
                judge_reasoning=verdict.reasoning,
                divergence_points=verdict.divergence_points,
                prior_failure=has_prior_failure,
            )
            await failure_memory.record_failure(
                question=query.question,
                failure_type=refusal_reason,
                triad_divergence_summary="; ".join(verdict.divergence_points[:3]),
                judge_reasoning=verdict.reasoning[:500],
            )
            response = RuberraResponse(
                refused=True,
                refusal_message=refusal_msg,
                refusal_reason=refusal_reason,
                confidence=ConfidenceLevel.LOW,
                confidence_explanation=(
                    "As 3 análises internas produziram respostas inconsistentes. "
                    "Ruberra recusa-se a responder para proteger a integridade do sistema."
                ),
                triad_agreement=triad_summary,
                judge_reasoning=verdict.reasoning,
                total_input_tokens=total_in,
                total_output_tokens=total_out,
                processing_time_ms=elapsed,
                matched_prior_failure=has_prior_failure,
                prior_failure_note=(
                    "Pergunta já havia falhado anteriormente. Falha confirmada novamente."
                    if has_prior_failure else None
                ),
            )

        await self._log_triad_run(query, response)
        yield {"type": "done", "result": response.model_dump()}

    async def _log_triad_run(self, query: RuberraQuery, response: RuberraResponse) -> None:
        await run_store.record(RunRecord(
            route="triad",
            mission_id=query.mission_id,
            question=query.question,
            context=query.context,
            answer=response.answer,
            refused=response.refused or (response.refusal_message is not None),
            confidence=response.confidence.value if response.confidence else None,
            judge_reasoning=response.judge_reasoning or None,
            processing_time_ms=response.processing_time_ms,
            input_tokens=response.total_input_tokens,
            output_tokens=response.total_output_tokens,
        ))

    def _build_triad_summary(
        self,
        responses: list[TriadResponse],
        verdict: JudgeVerdict,
    ) -> str:
        """Build a human-readable summary of triad agreement."""
        lines = [f"Triad: {len(responses)} respostas geradas"]
        
        lengths = [len(r.content) for r in responses]
        lines.append(
            f"Comprimentos: {', '.join(str(l) for l in lengths)} caracteres"
        )
        
        lines.append(f"Confiança do Juiz: {verdict.confidence.value.upper()}")
        
        if verdict.divergence_points:
            lines.append(f"Divergências: {len(verdict.divergence_points)}")
            for dp in verdict.divergence_points[:3]:
                lines.append(f"  • {dp}")
        else:
            lines.append("Divergências: nenhuma detetada")
        
        return " | ".join(lines[:3]) + (
            f" | {len(verdict.divergence_points)} divergência(s)"
            if verdict.divergence_points else " | Convergência total"
        )
