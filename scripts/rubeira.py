"""Rubeira — triple-witness consistency chamber.

This module injects the new implacable-judge heart into the Ruberra
canon. It is not a chat wrapper. It is a chamber organism that obeys:

- RUBERRA_CANON            one runtime truth, no silent fallbacks
- RUBERRA_CREATION_LAWS    consequence must never be hidden
- RUBERRA_MEMORY_LAWS      observed → retained → hardened → revoked
- RUBERRA_CHAMBER_LAWS     review is part of creation, not an afterthought

Three parallel witnesses answer the same question. A fourth voice
judges them without tolerance. Only convergent truth is HARDENED.
Divergence is RETAINED with its full lineage. Revocation requires a
reason. Empty input is refused.
"""

from __future__ import annotations

import asyncio
import hashlib
import os
import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Tuple

from anthropic import AsyncAnthropic


# ---------------------------------------------------------------------------
# Memory states — RUBERRA_MEMORY_LAWS / State law
# ---------------------------------------------------------------------------


class MemoryState(str, Enum):
    OBSERVED = "observed"
    RETAINED = "retained"
    HARDENED = "hardened"
    REVOKED = "revoked"


# ---------------------------------------------------------------------------
# Verdicts — implacable, no middle ground
# ---------------------------------------------------------------------------


class Verdict(str, Enum):
    CONSISTENT = "CONSISTENTE"
    INCONSISTENT = "INCONSISTENTE"
    UNDECIDED = "INDETERMINADO"


# ---------------------------------------------------------------------------
# Witness and ledger records — lineage must remain visible
# ---------------------------------------------------------------------------


@dataclass
class Witness:
    index: int
    text: str
    model: str
    fingerprint: str
    latency_ms: int

    @staticmethod
    def forge(index: int, text: str, model: str, latency_ms: int) -> "Witness":
        clean = (text or "").strip()
        fp = hashlib.sha256(clean.encode("utf-8")).hexdigest()[:12]
        return Witness(
            index=index,
            text=clean,
            model=model,
            fingerprint=fp,
            latency_ms=latency_ms,
        )


@dataclass
class JudgmentRecord:
    lineage_id: str
    question: str
    witnesses: List[Witness]
    verdict: Verdict
    state: MemoryState
    model: str
    judge_model: str
    raw_judge_reply: str
    revocation_reason: Optional[str] = None
    created_at: float = field(default_factory=time.time)

    @property
    def hardened(self) -> bool:
        return self.state == MemoryState.HARDENED

    @property
    def revoked(self) -> bool:
        return self.state == MemoryState.REVOKED

    def to_dict(self) -> dict:
        return {
            "lineage_id": self.lineage_id,
            "question": self.question,
            "verdict": self.verdict.value,
            "state": self.state.value,
            "model": self.model,
            "judge_model": self.judge_model,
            "raw_judge_reply": self.raw_judge_reply,
            "revocation_reason": self.revocation_reason,
            "created_at": self.created_at,
            "witnesses": [
                {
                    "index": w.index,
                    "fingerprint": w.fingerprint,
                    "latency_ms": w.latency_ms,
                    "text": w.text,
                }
                for w in self.witnesses
            ],
        }


# ---------------------------------------------------------------------------
# The organism
# ---------------------------------------------------------------------------


class Rubeira:
    """One organism. Distinct modes.

    Rubeira runs N parallel witnesses against one question, then subjects
    them to an implacable judge. Only convergent truth is promoted to
    HARDENED. Divergence is RETAINED. Indecision stays OBSERVED. Nothing
    leaves the chamber without state and lineage.
    """

    DEFAULT_MODEL = "claude-opus-4-6"
    DEFAULT_JUDGE_MODEL = "claude-opus-4-6"
    DEFAULT_WITNESSES = 3

    PROMPT_ANSWER = (
        "Responda de forma clara, direta e factual à seguinte pergunta.\n"
        "Sem hedging. Sem cortesia desnecessária. Sem preâmbulo.\n"
        "Se a resposta exigir número, data, nome ou medida, declare-os "
        "explicitamente.\n\n"
        "Pergunta: {pergunta}"
    )

    PROMPT_JUDGE = (
        "Você é um juiz técnico implacável e sem nenhuma tolerância a "
        "variações.\n\n"
        "Analise as {n} respostas abaixo para a MESMA pergunta.\n\n"
        "Critérios rigorosos:\n"
        "- Qualquer diferença em números, datas, nomes, quantidades ou "
        "medidas = INCONSISTENTE\n"
        "- Qualquer diferença na intensidade ou descrição de um evento = "
        "INCONSISTENTE\n"
        "- Qualquer resposta que adicione informação factual ausente nas "
        "outras = INCONSISTENTE\n"
        "- Só responda CONSISTENTE se as respostas forem praticamente "
        "idênticas em conteúdo e nível de detalhe.\n\n"
        "Responda com APENAS UMA PALAVRA, sem explicação: "
        "CONSISTENTE ou INCONSISTENTE.\n\n"
        "Respostas:\n{bloco}"
    )

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = DEFAULT_MODEL,
        judge_model: str = DEFAULT_JUDGE_MODEL,
        witnesses: int = DEFAULT_WITNESSES,
        max_tokens: int = 1024,
        judge_max_tokens: int = 16,
    ) -> None:
        key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not key:
            raise RuntimeError(
                "Rubeira refuses to run without ANTHROPIC_API_KEY. "
                "Canon law: no silent fallbacks."
            )
        if witnesses < 2:
            raise ValueError("Rubeira requires at least 2 witnesses to judge.")

        self.client = AsyncAnthropic(api_key=key)
        self.model = model
        self.judge_model = judge_model
        self.n_witnesses = witnesses
        self.max_tokens = max_tokens
        self.judge_max_tokens = judge_max_tokens
        self._ledger: List[JudgmentRecord] = []

    # -- witnesses ------------------------------------------------------

    async def _one_witness(self, index: int, question: str) -> Witness:
        started = time.monotonic()
        resp = await self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            messages=[
                {
                    "role": "user",
                    "content": self.PROMPT_ANSWER.format(pergunta=question),
                }
            ],
        )
        latency_ms = int((time.monotonic() - started) * 1000)
        text = resp.content[0].text if resp.content else ""
        return Witness.forge(
            index=index,
            text=text,
            model=self.model,
            latency_ms=latency_ms,
        )

    async def _summon_witnesses(self, question: str) -> List[Witness]:
        tasks = [
            self._one_witness(i, question) for i in range(self.n_witnesses)
        ]
        return await asyncio.gather(*tasks)

    # -- judgment -------------------------------------------------------

    async def _judge(
        self, witnesses: List[Witness]
    ) -> Tuple[Verdict, str]:
        bloco = "\n".join(f"{w.index + 1}. {w.text}" for w in witnesses)
        prompt = self.PROMPT_JUDGE.format(n=len(witnesses), bloco=bloco)

        resp = await self.client.messages.create(
            model=self.judge_model,
            max_tokens=self.judge_max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = (resp.content[0].text if resp.content else "").strip()
        token = raw.upper().split()[0].strip(".,!?;:") if raw else ""

        if token == "CONSISTENTE":
            return Verdict.CONSISTENT, raw
        if token == "INCONSISTENTE":
            return Verdict.INCONSISTENT, raw
        return Verdict.UNDECIDED, raw

    # -- public API -----------------------------------------------------

    async def perguntar(self, pergunta: str) -> JudgmentRecord:
        """Run the triple-witness chamber against a question.

        Returns a ledgered JudgmentRecord whose memory state is promoted
        by canon law: HARDENED on convergence, RETAINED on divergence,
        OBSERVED on indecision. The record is appended to the ledger
        before it is returned, so consequence is never hidden.
        """
        if not pergunta or not pergunta.strip():
            raise ValueError("Rubeira refuses empty questions.")

        lineage_id = uuid.uuid4().hex[:12]
        witnesses = await self._summon_witnesses(pergunta)
        verdict, raw = await self._judge(witnesses)

        if verdict == Verdict.CONSISTENT:
            state = MemoryState.HARDENED
        elif verdict == Verdict.INCONSISTENT:
            state = MemoryState.RETAINED
        else:
            state = MemoryState.OBSERVED

        record = JudgmentRecord(
            lineage_id=lineage_id,
            question=pergunta.strip(),
            witnesses=witnesses,
            verdict=verdict,
            state=state,
            model=self.model,
            judge_model=self.judge_model,
            raw_judge_reply=raw,
        )
        self._ledger.append(record)
        return record

    def revoke(self, lineage_id: str, reason: str) -> bool:
        """Revoke a record with an explicit reason. Canon requires it."""
        if not reason or not reason.strip():
            raise ValueError("Revocation without reason is forbidden.")
        for rec in self._ledger:
            if rec.lineage_id == lineage_id:
                rec.state = MemoryState.REVOKED
                rec.revocation_reason = reason.strip()
                return True
        return False

    @property
    def ledger(self) -> List[JudgmentRecord]:
        return list(self._ledger)


# ---------------------------------------------------------------------------
# CLI entrypoint — bare runtime, no theater
# ---------------------------------------------------------------------------


async def main() -> None:
    import json

    pergunta = "Quanto custa um iPhone 16 Pro Max de 256GB no Brasil hoje?"
    rubeira = Rubeira()
    record = await rubeira.perguntar(pergunta)

    print(json.dumps(record.to_dict(), indent=2, ensure_ascii=False))
    print()
    print(f"lineage_id: {record.lineage_id}")
    print(f"verdict:    {record.verdict.value}")
    print(f"state:      {record.state.value}")
    print(f"hardened:   {record.hardened}")


if __name__ == "__main__":
    asyncio.run(main())
