"""
Ruberra — Semantic-ish retrieval over past runs.

Honest naming: this is BM25 lexical retrieval, not transformer
embeddings. BM25 is a standard IR scoring function — token-overlap +
IDF weighting + length normalization. No model, no dependencies,
deterministic, fast, and meaningfully better than substring matching
(which is what ``failure_memory`` does today).

Used to inject the 3 most similar past runs into the crew's planner
and coder context. If past runs already failed on a topic, the planner
sees that; if a past run succeeded on something similar, the coder gets
to reuse that answer shape.

When to upgrade to real embeddings: if BM25 starts returning
semantically distant matches often (e.g. different wording, same
intent), add an embedding provider (Voyage/OpenAI/local
sentence-transformers) and rescore the top-50 BM25 candidates.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass
from typing import Any, Iterable, Optional

from models import RunRecord

TOKEN_RE = re.compile(r"[A-Za-zÀ-ÿ0-9]+", flags=re.UNICODE)

# BM25 hyperparameters — standard defaults.
BM25_K1: float = 1.2
BM25_B: float = 0.75


def _tokenize(text: str) -> list[str]:
    return [t.lower() for t in TOKEN_RE.findall(text or "")]


@dataclass
class RetrievedRun:
    """A past run that scored above threshold on the current query."""
    run: RunRecord
    score: float
    matched_terms: list[str]


class BM25Retriever:
    """Per-corpus BM25 index. Rebuilt lazily whenever the corpus changes."""

    def __init__(self, corpus: list[RunRecord]) -> None:
        self._docs = corpus
        self._tokens: list[list[str]] = [
            _tokenize(self._doc_text(r)) for r in corpus
        ]
        self._avgdl: float = (
            sum(len(t) for t in self._tokens) / len(self._tokens)
            if self._tokens else 0.0
        )
        # Document frequency per term
        df: dict[str, int] = {}
        for doc in self._tokens:
            for term in set(doc):
                df[term] = df.get(term, 0) + 1
        n = len(self._tokens) or 1
        # IDF with the +1 smoothing from Lucene's BM25
        self._idf: dict[str, float] = {
            term: math.log(1 + (n - freq + 0.5) / (freq + 0.5))
            for term, freq in df.items()
        }

    @staticmethod
    def _doc_text(r: RunRecord) -> str:
        parts = [r.question or ""]
        if r.answer:
            parts.append(r.answer)
        if r.context:
            parts.append(r.context)
        return "  ".join(parts)

    def score(self, query: str, doc_idx: int) -> tuple[float, list[str]]:
        """BM25 score of a single document against the query."""
        if doc_idx >= len(self._tokens):
            return 0.0, []
        doc = self._tokens[doc_idx]
        dl = len(doc)
        if dl == 0 or self._avgdl == 0:
            return 0.0, []
        q_terms = set(_tokenize(query))
        if not q_terms:
            return 0.0, []
        tf: dict[str, int] = {}
        for term in doc:
            tf[term] = tf.get(term, 0) + 1
        score = 0.0
        matched: list[str] = []
        for term in q_terms:
            if term not in tf:
                continue
            matched.append(term)
            idf = self._idf.get(term, 0.0)
            f = tf[term]
            norm = 1 - BM25_B + BM25_B * (dl / self._avgdl)
            score += idf * (f * (BM25_K1 + 1)) / (f + BM25_K1 * norm)
        return score, matched

    def top_k(
        self,
        query: str,
        k: int = 3,
        min_score: float = 0.5,
    ) -> list[RetrievedRun]:
        """Return up to ``k`` most-similar runs with score >= ``min_score``."""
        scored: list[tuple[float, int, list[str]]] = []
        for i in range(len(self._docs)):
            s, matched = self.score(query, i)
            if s >= min_score:
                scored.append((s, i, matched))
        scored.sort(key=lambda t: t[0], reverse=True)
        return [
            RetrievedRun(run=self._docs[i], score=s, matched_terms=m)
            for s, i, m in scored[:k]
        ]


def format_retrieved(hits: list[RetrievedRun]) -> str:
    """Inject-ready block summarizing similar past runs."""
    if not hits:
        return ""
    lines = [
        "",
        "## SIMILAR PAST RUNS",
        "",
        "Previous Ruberra sessions on related questions. "
        "Use these to avoid repeating past mistakes or to reuse what worked.",
        "",
    ]
    for h in hits:
        r = h.run
        verdict = "refused" if r.refused else (
            f"answered ({r.confidence})" if r.confidence else "answered"
        )
        lines.append(f"- [{r.route} · {verdict} · score={h.score:.2f}] {r.question[:180]}")
        if r.answer:
            preview = r.answer.strip().replace("\n", " ")[:220]
            lines.append(f"  → {preview}")
    lines.append("")
    return "\n".join(lines)


async def retrieve_similar(
    query: str,
    limit: int = 3,
    mission_id: Optional[str] = None,
) -> list[RetrievedRun]:
    """Top-level entry point — reads from run_store and scores with BM25."""
    from runs import run_store
    corpus = await run_store.list(mission_id=mission_id, limit=500)
    if not corpus:
        return []
    retriever = BM25Retriever(corpus)
    return retriever.top_k(query, k=limit)
