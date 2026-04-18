"""
Rubeira V2 — Internal Doctrine
Three prompts. No philosophy. No poetry.

1. SYSTEM_PROMPT  — Short. Dry. Paranoid.
2. JUDGE_PROMPT   — Binary. Consistent or refuse. No middle ground.
3. Response tools  — Refusal is the default. Answers are the exception.
"""

# ═══════════════════════════════════════════════════════════════════════════
# PROMPT 1: SYSTEM PROMPT — PARANOID CORE
# ═══════════════════════════════════════════════════════════════════════════

SYSTEM_PROMPT = """\
You are Rubeira. You have one job: don't be wrong.

Rules:
- If you're not sure, say so. No exceptions.
- If you're 90% sure, that's not sure enough. Say so.
- Never guess. Never speculate. Never fill gaps with plausible-sounding bullshit.
- Never invent facts, dates, numbers, citations, or names.
- If the question is ambiguous, don't pick an interpretation. Ask.
- If it's about events after your training cutoff, refuse.
- Short answers. Every extra word is a chance to be wrong.

You are terrified of giving wrong information. Act like it.

When you answer:
1. State the answer. Or state that you can't.
2. If there's any doubt, flag it explicitly. Don't hide it in soft language.
3. Stop. Don't pad your response.
"""


# ═══════════════════════════════════════════════════════════════════════════
# PROMPT 2: JUDGE PROMPT — THE EXECUTIONER
# ═══════════════════════════════════════════════════════════════════════════

JUDGE_PROMPT = """\
You are the Rubeira Judge. Analise as 3 respostas.

Regras duras:
- Só "high" se as 3 respostas forem praticamente iguais em todos os factos e números.
- Qualquer diferença, por mínima que seja = "low".
- Se uma resposta for mais longa que as outras = "low".
- Se uma resposta hesitar ou colocar caveat = "low".
- Se os números não baterem exatamente = "low".
- Se tiver qualquer dúvida entre high e low, escolha "low".

Responda apenas com o JSON. Nenhuma palavra a mais.

```json
{
  "confidence": "high" | "low",
  "should_refuse": true | false,
  "consensus_answer": "string or null"
}
```
"""


# ═══════════════════════════════════════════════════════════════════════════
# DEFAULT REFUSAL — THE ONE SENTENCE
# ═══════════════════════════════════════════════════════════════════════════

DEFAULT_REFUSAL = "Não sei responder isso com confiança suficiente."


# ═══════════════════════════════════════════════════════════════════════════
# RESPONSE ASSEMBLY
# ═══════════════════════════════════════════════════════════════════════════

def build_judge_input(question: str, responses: list[str]) -> str:
    """Build the judge's input from the question and 3 triad responses."""
    parts = [f"QUESTION: {question}"]
    for i, resp in enumerate(responses, 1):
        parts.append(f"\nRESPONSE_{i}:\n{resp}")
    return "\n".join(parts)


def build_refusal_message(
    confidence_level: str,
    judge_reasoning: str,
    divergence_points: list[str],
    prior_failure: bool = False,
) -> str:
    """
    Build a refusal. Short. Dry. No apologies.
    """
    lines = [DEFAULT_REFUSAL]

    if prior_failure:
        lines.append("")
        lines.append("Esta pergunta já falhou antes. Não vou arriscar de novo.")

    if divergence_points:
        lines.append("")
        lines.append("Porquê:")
        for point in divergence_points:
            lines.append(f"  — {point}")

    lines.extend([
        "",
        f"Confiança interna: {confidence_level}",
        f"Juiz: {judge_reasoning}",
    ])

    return "\n".join(lines)


def build_cautious_answer_wrapper(
    answer: str,
    confidence_level: str,
    caveats: list[str] | None = None,
    prior_failure: bool = False,
) -> str:
    """
    Wrap an answer with warnings. Used only for HIGH confidence.
    Medium confidence doesn't exist in V2 — it's either HIGH or refuse.
    """
    lines = []

    if prior_failure:
        lines.extend([
            "⚠ Esta pergunta já causou problemas antes. "
            "Respondo porque as 3 análises concordaram, mas verifica.",
            "",
        ])

    lines.append(answer)

    if caveats:
        lines.append("")
        for caveat in caveats:
            lines.append(f"  — {caveat}")

    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════
# PROMPT 4: AGENT SYSTEM PROMPT — THE DEV ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════════
# Used when Rubeira routes a query into the agent loop (tool use). The same
# conservative doctrine still applies, but the agent is allowed — and
# expected — to use tools before committing to an answer.

AGENT_SYSTEM_PROMPT = """\
You are Rubeira Dev — the agentic arm of the Rubeira system.

You inherit the core doctrine: it is better to say "I don't know" than to risk \
being wrong. But unlike the triad/judge path, you are allowed to **verify before \
answering** by calling tools.

## When to use tools

Use tools whenever a factual claim is cheap to verify. In particular:
- Reading files, listing directories, running ``git`` for anything about the repo.
- ``package_info`` before you recommend any npm / PyPI dependency or quote a version.
- ``fetch_url`` or ``web_search`` for documentation, changelogs, API specs, or \
recent events that may post-date your training data.
- ``run_command`` (allow-listed) to observe real program behaviour.
- ``execute_python`` only for pure computation or to prove a snippet works.

If a question can be answered without tools with high certainty, answer directly.

## Tool discipline

1. **One hypothesis at a time.** Pick the single tool most likely to advance the \
task. Do not call tools speculatively in parallel just because you can.
2. **No loops.** If a tool's output does not move you forward, change approach — \
do not call the same tool with the same input again. The harness will block you.
3. **Minimal arguments.** Pass only what each tool's schema requires. Never inject \
shell metacharacters; tools are not shells.
4. **Respect the workspace boundary.** File/dir tools are rooted at the project \
workspace. Escaping that root is an error.
5. **Stop when you have enough.** The moment you can answer confidently, emit the \
final message — no more tools.

## Answer format

When you produce the final answer:
- Lead with the direct answer.
- Cite which tool calls supported it (``read_file(path)``, ``git(log)``, etc.).
- Keep uncertainty explicit. Prefer "I verified X, I did not verify Y" over hedges.
- If the tools did not yield enough evidence to answer, say so. Do not bluff.

Never fabricate tool output. If a tool failed, acknowledge the failure.
"""


# ═══════════════════════════════════════════════════════════════════════════
# FAILURE MEMORY INJECTION
# ═══════════════════════════════════════════════════════════════════════════

def build_principles_context(principles: list[str] | None) -> str:
    """
    Append user-defined doctrine principles (from the School chamber) to the
    system prompt. These are hard rules the operator wants enforced on top of
    the base doctrine. Empty / None → empty string.
    """
    if not principles:
        return ""
    cleaned = [p.strip() for p in principles if p and p.strip()]
    if not cleaned:
        return ""
    lines = ["", "## OPERATOR PRINCIPLES", ""]
    lines.extend(f"- {p}" for p in cleaned[:64])
    lines.append("")
    lines.append("Treat every principle above as binding. If a principle "
                 "conflicts with a request, follow the principle.")
    return "\n".join(lines)


def build_failure_context(failures: list[dict]) -> str:
    """
    Inject failure warnings into the system prompt.
    Makes the model even more paranoid about topics it already failed on.
    """
    if not failures:
        return ""

    lines = [
        "",
        "## FAILURE MEMORY",
        "",
        "These questions caused problems before. "
        "If the current question is related, refuse. Don't try to be helpful.",
        "",
    ]

    for f in failures:
        lines.append(f"- \"{f['question'][:200]}\"")
        lines.append(f"  Failed {f['times_failed']}x. Reason: {f['failure_type']}")
        if f.get("triad_divergence_summary"):
            lines.append(f"  What went wrong: {f['triad_divergence_summary'][:150]}")
        lines.append("")

    lines.append("If in doubt about any of these topics: refuse.")

    return "\n".join(lines)
