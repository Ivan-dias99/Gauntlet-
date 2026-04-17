"""
Rubeira V1 — Self-Consistency Engine
The core brain. Fires 3 parallel calls to Claude Sonnet,
then routes the responses through the Judge for verdict.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Optional

from anthropic import AsyncAnthropic

from config import (
    ANTHROPIC_API_KEY,
    MODEL_ID,
    TRIAD_TEMPERATURE,
    JUDGE_TEMPERATURE,
    MAX_TOKENS,
    TRIAD_COUNT,
)
from doctrine import (
    SYSTEM_PROMPT,
    JUDGE_PROMPT,
    build_judge_input,
    build_refusal_message,
    build_cautious_answer_wrapper,
    build_failure_context,
)
from models import (
    ConfidenceLevel,
    RefusalReason,
    RubeiraQuery,
    RubeiraResponse,
    TriadResponse,
    JudgeVerdict,
)
from memory import failure_memory

logger = logging.getLogger("rubeira.engine")


class RubeiraEngine:
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
       - MEDIUM confidence → deliver with explicit caveats
       - LOW confidence → refuse and explain why
    9. If refused → record failure in memory
    10. Return structured response
    """
    
    def __init__(self) -> None:
        if not ANTHROPIC_API_KEY:
            raise RuntimeError(
                "ANTHROPIC_API_KEY not set. "
                "Export it in your environment before starting Rubeira."
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
    
    async def _execute_triad(
        self,
        system_prompt: str,
        question: str,
        context: Optional[str] = None,
    ) -> list[TriadResponse]:
        """
        Fire all 3 triad calls in parallel using asyncio.gather.
        This is the self-consistency core — same question, 3 independent answers.
        """
        logger.info(f"Firing {TRIAD_COUNT} parallel triad calls...")
        
        tasks = [
            self._single_triad_call(i, system_prompt, question, context)
            for i in range(TRIAD_COUNT)
        ]
        
        responses = await asyncio.gather(*tasks, return_exceptions=False)
        
        for r in responses:
            logger.info(
                f"  Triad[{r.index}]: {len(r.content)} chars, "
                f"{r.input_tokens}+{r.output_tokens} tokens, "
                f"stop={r.stop_reason}"
            )
        
        return list(responses)
    
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
            "medium": ConfidenceLevel.MEDIUM,
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
    
    # ── Main Pipeline ───────────────────────────────────────────────────────
    
    async def process_query(self, query: RubeiraQuery) -> RubeiraResponse:
        """
        The complete Rubeira pipeline.
        This is the single entry point for all queries.
        """
        start_time = time.monotonic()
        
        # ── Step 1: Check failure memory ────────────────────────────────────
        matching_failures = await failure_memory.find_matching_failures(query.question)
        has_prior_failure = len(matching_failures) > 0
        
        if has_prior_failure:
            logger.warning(
                f"Found {len(matching_failures)} prior failure(s) matching this question. "
                f"Engaging reinforced caution."
            )
        
        # ── Step 2: Build system prompt with failure context ────────────────
        system_prompt = SYSTEM_PROMPT
        if matching_failures or query.force_cautious:
            failure_context = build_failure_context(matching_failures)
            system_prompt = SYSTEM_PROMPT + failure_context
            
            if query.force_cautious:
                system_prompt += (
                    "\n\n## ⚠️ FORCED CAUTION MODE\n"
                    "The user has explicitly requested maximum caution. "
                    "Increase all uncertainty thresholds. "
                    "Prefer refusal over any risk of error."
                )
        
        # ── Step 3: Execute self-consistency triad ──────────────────────────
        triad_responses = await self._execute_triad(
            system_prompt=system_prompt,
            question=query.question,
            context=query.context,
        )
        
        # Check for total triad failure
        failed_calls = [r for r in triad_responses if r.stop_reason == "error"]
        if len(failed_calls) >= 2:
            elapsed = int((time.monotonic() - start_time) * 1000)
            return RubeiraResponse(
                refused=True,
                refusal_message=(
                    "⚠️ **Rubeira — Falha de Sistema**\n\n"
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
        
        # ── Step 4: Invoke the Judge ────────────────────────────────────────
        verdict = await self._invoke_judge(query.question, triad_responses)
        
        # ── Step 5: Decision logic ──────────────────────────────────────────
        elapsed = int((time.monotonic() - start_time) * 1000)
        
        total_in = sum(r.input_tokens for r in triad_responses)
        total_out = sum(r.output_tokens for r in triad_responses)
        
        triad_summary = self._build_triad_summary(triad_responses, verdict)
        
        # ── HIGH CONFIDENCE ─────────────────────────────────────────────────
        if verdict.confidence == ConfidenceLevel.HIGH and not verdict.should_refuse:
            answer = verdict.consensus_answer or triad_responses[0].content
            
            if has_prior_failure:
                answer = build_cautious_answer_wrapper(
                    answer=answer,
                    confidence_level="high",
                    prior_failure=True,
                )
            
            return RubeiraResponse(
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
                    "Apesar de corresponder a falhas anteriores, as 3 respostas foram consistentes."
                    if has_prior_failure else None
                ),
            )
        
        # ── MEDIUM CONFIDENCE ───────────────────────────────────────────────
        if verdict.confidence == ConfidenceLevel.MEDIUM and not verdict.should_refuse:
            answer = verdict.consensus_answer or triad_responses[0].content
            
            answer = build_cautious_answer_wrapper(
                answer=answer,
                confidence_level="medium",
                caveats=verdict.divergence_points if verdict.divergence_points else None,
                prior_failure=has_prior_failure,
            )
            
            return RubeiraResponse(
                answer=answer,
                refused=False,
                confidence=ConfidenceLevel.MEDIUM,
                confidence_explanation=(
                    "As 3 análises internas concordam no essencial mas apresentam "
                    "variações menores. Resposta fornecida com ressalvas."
                ),
                triad_agreement=triad_summary,
                judge_reasoning=verdict.reasoning,
                total_input_tokens=total_in,
                total_output_tokens=total_out,
                processing_time_ms=elapsed,
                matched_prior_failure=has_prior_failure,
                prior_failure_note=(
                    "Pergunta corresponde a falhas anteriores. Cautela reforçada ativada."
                    if has_prior_failure else None
                ),
            )
        
        # ── LOW CONFIDENCE: refuse ──────────────────────────────────────────
        refusal_reason = verdict.refusal_reason or RefusalReason.INCONSISTENCY
        
        refusal_msg = build_refusal_message(
            confidence_level=verdict.confidence.value,
            judge_reasoning=verdict.reasoning,
            divergence_points=verdict.divergence_points,
            prior_failure=has_prior_failure,
        )
        
        # Record this failure in memory
        await failure_memory.record_failure(
            question=query.question,
            failure_type=refusal_reason,
            triad_divergence_summary="; ".join(verdict.divergence_points[:3]),
            judge_reasoning=verdict.reasoning[:500],
        )
        
        return RubeiraResponse(
            refused=True,
            refusal_message=refusal_msg,
            refusal_reason=refusal_reason,
            confidence=ConfidenceLevel.LOW,
            confidence_explanation=(
                "As 3 análises internas produziram respostas inconsistentes. "
                "Rubeira recusa-se a responder para proteger a integridade do sistema."
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
