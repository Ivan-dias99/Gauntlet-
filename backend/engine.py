"""
Signal — Self-Consistency Engine
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
    GEMINI_API_KEY,
    GEMINI_MODEL,
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
    SignalQuery,
    SignalResponse,
    TriadResponse,
    JudgeVerdict,
    RunRecord,
)
from memory import failure_memory
from runs import run_store
from model_gateway import gateway, GatewayCall
import observability

logger = logging.getLogger("gauntlet.engine")

# Agent layer is imported lazily to avoid an import cycle and to keep the
# triad path usable even if the agent module is later swapped out.
_agent_singleton: Optional["AgentOrchestrator"] = None  # type: ignore[name-defined]


def _get_agent() -> "AgentOrchestrator":  # type: ignore[name-defined]
    global _agent_singleton
    if _agent_singleton is None:
        from agent import AgentOrchestrator
        _agent_singleton = AgentOrchestrator()
    return _agent_singleton


class SignalEngine:
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
        elif ANTHROPIC_API_KEY:
            self._client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        elif GEMINI_API_KEY:
            # Free-tier fallback. Triad + judge run against Gemini; the
            # agent loop (tools, streaming) degrades because the v1
            # adapter does not implement those Anthropic-only paths.
            from gemini_provider import AsyncGeminiAnthropicAdapter
            self._client = AsyncGeminiAnthropicAdapter(
                api_key=GEMINI_API_KEY, model=GEMINI_MODEL,
            )
            logger.warning(
                "Engine initialised on Gemini (model=%s). Anthropic key not set.",
                GEMINI_MODEL,
            )
        else:
            raise RuntimeError(
                "Neither ANTHROPIC_API_KEY nor GAUNTLET_GEMINI_API_KEY set, and "
                "GAUNTLET_MOCK is off. Set ANTHROPIC_API_KEY for Claude, "
                "GAUNTLET_GEMINI_API_KEY for Gemini free tier, or "
                "GAUNTLET_MOCK=1 for canned responses."
            )
        # Detached run-log tasks. PR #214 moved _log_triad_run after the
        # `done` yield for stream tail latency parity with agent/crew/
        # surface, but that opened a regression: if the streaming caller
        # disconnects right after `done`, cancellation lands between the
        # yield and the log await, dropping the run record. Logs now run
        # in detached tasks held here so they survive the streaming
        # task's cancellation. The set keeps a strong reference to
        # prevent GC; `_track_log_task` schedules cleanup on completion.
        self._inflight_logs: set[asyncio.Task[None]] = set()
        logger.info(f"Engine initialized. Model: {MODEL_ID}, Triad count: {TRIAD_COUNT}")

    def _track_log_task(self, task: "asyncio.Task[None]") -> None:
        """Add the detached log task to the inflight set with auto-cleanup
        on done. Without the strong reference, asyncio may GC the task
        mid-flight — the docs warn explicitly about fire-and-forget
        create_task without a held reference."""
        self._inflight_logs.add(task)
        task.add_done_callback(self._inflight_logs.discard)
    
    # ── Triad Call ──────────────────────────────────────────────────────────
    
    async def _single_triad_call(
        self,
        index: int,
        system_prompt: str,
        question: str,
        context: Optional[str] = None,
        temperature: float = TRIAD_TEMPERATURE,
    ) -> TriadResponse:
        """
        Execute a single call in the self-consistency triad.
        Each call uses the same system prompt and question but
        may produce slightly different responses due to model stochasticity.

        Wave-7: temperature is a parameter so chamber profiles that
        specify their own temperature (e.g. Archive 0.1, Core 0.1) are
        honored end-to-end. Absent override keeps TRIAD_TEMPERATURE.
        """
        user_message = question
        if context:
            user_message = f"Context: {context}\n\nQuestion: {question}"

        # Wave H integration — pick the model via gateway. Gateway also
        # records per-call cost + per-role counts for /diagnostics.
        choice = gateway.select("triad")
        model_id = choice.model_id

        # Wave P-7 — fallback chain. When the primary fails with a
        # recoverable Anthropic error (rate limit, capacity, network
        # blip), retry once with the next model in ROUTING. Each
        # GatewayCall recorded carries fallback_from so /gateway/summary
        # shows when failover kicked in.
        from anthropic import (
            RateLimitError, APIConnectionError, APITimeoutError, InternalServerError,
        )
        recoverable = (RateLimitError, APIConnectionError, APITimeoutError, InternalServerError)

        async def _attempt(_choice, _model_id, _from: str | None):
            import time as _t
            started = _t.monotonic()
            observability.start("triad")
            _obs_finalized = False
            try:
                response = await self._client.messages.create(
                    model=_model_id,
                    max_tokens=MAX_TOKENS,
                    temperature=temperature,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_message}],
                )
                content = ""
                for block in response.content:
                    if block.type == "text":
                        content += block.text
                in_tok = response.usage.input_tokens
                out_tok = response.usage.output_tokens
                gateway.record(GatewayCall(
                    role="triad", model_id=_model_id, provider=_choice.provider,
                    input_tokens=in_tok, output_tokens=out_tok,
                    fallback_from=_from,
                ))
                observability.end(
                    "triad",
                    duration_ms=int((_t.monotonic() - started) * 1000),
                    succeeded=True,
                )
                _obs_finalized = True
                return TriadResponse(
                    index=index, content=content,
                    model=response.model, stop_reason=response.stop_reason,
                    input_tokens=in_tok, output_tokens=out_tok,
                ), None, False
            except Exception as exc:  # noqa: BLE001
                # Always record + close observability so any failure
                # (recoverable or not) decrements in_flight.
                gateway.record(GatewayCall(
                    role="triad", model_id=_model_id, provider=_choice.provider,
                    succeeded=False, error_kind=type(exc).__name__,
                    fallback_from=_from,
                ))
                observability.end(
                    "triad",
                    duration_ms=int((_t.monotonic() - started) * 1000),
                    succeeded=False, error_kind=type(exc).__name__,
                )
                _obs_finalized = True
                return None, exc, isinstance(exc, recoverable)
            finally:
                if not _obs_finalized:
                    observability.end(
                        "triad",
                        duration_ms=int((_t.monotonic() - started) * 1000),
                        succeeded=False, error_kind="CancelledError",
                    )

        # Primary attempt; on a recoverable error walk the gateway chain.
        result, err, retry = await _attempt(choice, model_id, None)
        if result is not None:
            return result
        if err is not None and retry:
            next_choice = gateway.fallback("triad", model_id)
            if next_choice is not None:
                logger.warning(
                    "Triad call %d primary %s failed (%s) — falling back to %s",
                    index, model_id, type(err).__name__, next_choice.model_id,
                )
                fb_result, fb_err, _ = await _attempt(next_choice, next_choice.model_id, model_id)
                if fb_result is not None:
                    return fb_result
                # Fallback also failed — surface its exception, not the primary's,
                # so triage sees the actual terminal cause (e.g. fallback 400 not
                # primary 429).
                if fb_err is not None:
                    err = fb_err
        logger.error(
            "Triad call %d failed (recoverable=%s): %s",
            index, retry, err,
        )
        return TriadResponse(
            index=index,
            content=f"[TRIAD CALL FAILED: {err}]",
            model=model_id, stop_reason="error",
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

        # Wave H integration — judge picks via gateway too (no fallback
        # chain by design — judge needs deterministic model).
        choice = gateway.select("judge")
        model_id = choice.model_id

        import time as _t
        started = _t.monotonic()
        observability.start("judge")
        _obs_finalized = False
        try:
            response = await self._client.messages.create(
                model=model_id,
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
            gateway.record(GatewayCall(
                role="judge", model_id=model_id, provider=choice.provider,
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
            ))
            observability.end(
                "judge",
                duration_ms=int((_t.monotonic() - started) * 1000),
                succeeded=True,
            )
            _obs_finalized = True
            return verdict

        except Exception as e:
            logger.error(f"Judge invocation failed: {e}")
            gateway.record(GatewayCall(
                role="judge", model_id=model_id, provider=choice.provider,
                succeeded=False, error_kind=type(e).__name__,
            ))
            observability.end(
                "judge",
                duration_ms=int((_t.monotonic() - started) * 1000),
                succeeded=False, error_kind=type(e).__name__,
            )
            _obs_finalized = True
            return JudgeVerdict(
                confidence=ConfidenceLevel.LOW,
                reasoning=f"Judge invocation failed: {str(e)}. Defaulting to refusal for safety.",
                consensus_answer=None,
                divergence_points=["Judge system error"],
                should_refuse=True,
                refusal_reason=RefusalReason.JUDGE_REJECTION,
            )
        finally:
            # Same cancellation guard as _single_triad_call.
            if not _obs_finalized:
                observability.end(
                    "judge",
                    duration_ms=int((_t.monotonic() - started) * 1000),
                    succeeded=False, error_kind="CancelledError",
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
        
        # Wave 6a — refusal substitute. Empty string from the judge
        # gets normalised to None so the frontend's typed fallback
        # path doesn't fire on an empty hint.
        nearest_raw = data.get("nearest_answerable_question")
        nearest = nearest_raw.strip() if isinstance(nearest_raw, str) and nearest_raw.strip() else None

        return JudgeVerdict(
            confidence=confidence,
            reasoning=data.get("reasoning", "No reasoning provided"),
            consensus_answer=data.get("consensus_answer"),
            divergence_points=data.get("divergence_points", []),
            should_refuse=data.get("should_refuse", confidence == ConfidenceLevel.LOW),
            refusal_reason=refusal_reason,
            nearest_answerable_question=nearest,
        )
    
    # ── Dev / Agent Path ────────────────────────────────────────────────────

    async def process_dev_query(self, query: SignalQuery):
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
        self, query: SignalQuery
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

    # ── Routing helper ─────────────────────────────────────────────────────

    @staticmethod
    def _auto_route_agent(query: SignalQuery) -> bool:
        """
        Decide whether the auto-router dispatches to the agent loop. After
        the Gauntlet migration removed chamber profiles, the only signal
        is the legacy ``is_dev_intent`` heuristic on the question text.
        """
        from agent import AgentOrchestrator
        return AgentOrchestrator.is_dev_intent(query.question)

    async def process_auto(self, query: SignalQuery):
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
        self, query: SignalQuery
    ) -> AsyncIterator[dict[str, Any]]:
        """Auto-router streaming variant. Emits a ``route`` event first, then
        streams agent or triad events under a unified envelope. The Surface
        chamber fork was removed with the Gauntlet migration.
        """
        if self._auto_route_agent(query):
            yield {"type": "route", "path": "agent"}
            # Wave 6c — wrap the agent's `done` envelope in `result` so the
            # auto-router contract stays uniform with triad. Frontend's
            # extractAnswer/RouteEvent type expects `done.result`; the agent
            # loop emits `answer` + `tool_calls` etc at top level. Wrap on
            # the way out so consumers don't need a parallel parser.
            async for event in self.process_dev_query_streaming(query):
                if event.get("type") == "done":
                    inner = {k: v for k, v in event.items() if k != "type"}
                    yield {"type": "done", "result": inner}
                else:
                    yield event
        else:
            yield {"type": "route", "path": "triad"}
            async for event in self.process_query_streaming(query):
                yield event

    # ── Main Pipeline ───────────────────────────────────────────────────────

    async def process_query(self, query: SignalQuery) -> SignalResponse:
        """Non-streaming wrapper — collects the final event and rebuilds
        the ``SignalResponse`` model."""
        final: Optional[dict[str, Any]] = None
        async for event in self.process_query_streaming(query):
            if event["type"] == "done":
                final = event
        if not final:
            raise RuntimeError("triad stream ended without a done event")
        return SignalResponse.model_validate(final["result"])

    async def process_query_streaming(
        self, query: SignalQuery
    ) -> AsyncIterator[dict[str, Any]]:
        """
        The complete Signal pipeline, emitting events at each checkpoint:
        ``start``, ``triad_start``, ``triad_done`` (per call), ``judge_start``,
        ``judge_done``, ``done`` (full SignalResponse dict).
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
        #
        # Wave P-24: the inline get_profile + base_prompt/temperature
        # shaping is delegated to ContextRouter. Behaviour for the five
        # canonical chambers (and the chamber=None legacy path) is
        # byte-equivalent to the pre-P-24 inline form — the router just
        # centralises the lookup so the doctrine 10×10 Tool 2 ("Context
        # Router") has an explicit seam. Temperature still falls back to
        # TRIAD_TEMPERATURE here because the router carries the profile
        # value (or None) in notes — engine owns the global default.
        from context_router import ContextRouter
        _router = ContextRouter()
        _ctx = _router.route(query.chamber, query)
        base_prompt = _ctx.system_prompt
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
        # Wave-7: profile.temperature threads through to the triad calls.
        # Wave P-24: temperature lives in RoutedContext.notes so the
        # router stays the single source of truth for chamber shaping.
        _ctx_temperature = _ctx.notes.get("temperature")
        _triad_temperature = (
            _ctx_temperature
            if _ctx_temperature is not None
            else TRIAD_TEMPERATURE
        )

        # ── Step 3: parallel triad with per-completion events ───────────────
        yield {
            "type": "triad_start",
            "count": TRIAD_COUNT,
            "has_prior_failure": has_prior_failure,
        }
        tasks = [
            asyncio.create_task(
                self._single_triad_call(
                    i, system_prompt, query.question, query.context,
                    _triad_temperature,
                )
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
            response = SignalResponse(
                refused=True,
                refusal_message=(
                    "⚠️ **Signal — Falha de Sistema**\n\n"
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
            # Detach the log task BEFORE yielding `done` so it's already
            # registered with the event loop when the caller closes the
            # generator. If we created the task AFTER the yield, a client
            # disconnect would raise GeneratorExit at the suspended yield
            # point and the create_task line would never execute — losing
            # the run record. Creating first ships the task to the loop;
            # the subsequent yield can be cancelled freely without
            # affecting the detached log.
            self._track_log_task(asyncio.create_task(
                self._log_triad_run(query, response)
            ))
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
            # Wave 6a Tier-1 Addition #2 — refusal substitute. Null on
            # accept; carries a smaller/sharper question on refusal.
            "nearest_answerable_question": verdict.nearest_answerable_question,
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
            response = SignalResponse(
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
            response = SignalResponse(
                refused=True,
                refusal_message=refusal_msg,
                refusal_reason=refusal_reason,
                confidence=ConfidenceLevel.LOW,
                confidence_explanation=(
                    "As 3 análises internas produziram respostas inconsistentes. "
                    "Signal recusa-se a responder para proteger a integridade do sistema."
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

        # Detach BEFORE yield (see refusal-path comment above for the
        # full reasoning — GeneratorExit at the yield would kill any
        # post-yield create_task).
        self._track_log_task(asyncio.create_task(
            self._log_triad_run(query, response)
        ))
        yield {"type": "done", "result": response.model_dump()}

    async def _log_triad_run(self, query: SignalQuery, response: SignalResponse) -> None:
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
