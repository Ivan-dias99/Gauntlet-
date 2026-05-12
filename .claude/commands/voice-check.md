---
description: Run voice ban-list lint (scripts/check-voice.mjs). Reports any banned label that leaked into code or copy.
allowed-tools:
  - Bash(npm run check:voice)
  - Bash(grep *)
  - Bash(rg *)
  - Bash(cat *)
---

# /voice-check

Enforce the canonical label set from ADR-0005 (Aether v2 visual canon). Banned labels are checked by `scripts/check-voice.mjs`, wired as `npm run check:voice`.

## The canonical / banned contract

**Canonical labels (write these)**:
Enviar · Resposta · Plano · Executar · Executar com cuidado · Executado · Anexar · Ecrã · Voz · Copy · Save · Re-read · Erro · Confirmo, executar mesmo assim · Rejeitar · Cancelar · Pronto · A planear · A responder · A executar · Concluído · Novo prompt · Tentar de novo · Comandos · Último prompt · Palette · Recolher · Fechar

**Banned (never write)**:
~~Compor~~ · ~~Acionar~~ · ~~Submit~~ · ~~Run~~ · ~~Magic~~ · ~~Assistant~~ · ~~Preview~~ (use Resposta)

## Steps

1. Run the lint:

```bash
npm run check:voice 2>&1 | tee /tmp/voice-check.out
```

2. Parse the output:
   - If exit code 0 → all canon honored
   - If non-zero → list each banned word found, with file path and line number

3. Report in this shape:

```
VOICE CHECK
  status: <PASS | FAIL>

  [if FAIL]
  banned labels found:
    - <file>:<line>  "<banned word>"  → replace with "<canonical>"
    - <file>:<line>  "<banned word>"  → replace with "<canonical>"

  replacement map:
    Compor       → Enviar
    Submit       → Enviar
    Run          → Executar
    Acionar      → Executar
    Magic        → (remove; not an Aether concept)
    Assistant    → (remove; not an Aether concept)
    Preview      → Resposta

  next move:
    1. Open each flagged file
    2. Replace banned with canonical
    3. Re-run /voice-check until status = PASS
```

## When to suggest invoking

- After any edit to a `.tsx` file
- After any edit to backend response payloads (errors, button text, header strings)
- Before opening a PR touching user-facing copy
- As part of `/release-prep` — voice check is a release gate

## Closure

Not closed until status = PASS. A flagged file is product debt, not stylistic preference.

## Anti-patterns

- "It's just a comment" — comments are checked too; voice canon applies everywhere
- "It's a test file" — tests assert on user-facing strings; banned labels in tests means they leaked
- "We'll fix in v1.0.1" — voice check is a release gate; not deferred
- Reading the ban-list from the script but not from ADR-0005 — script enforces a snapshot; ADR-0005 is authoritative
