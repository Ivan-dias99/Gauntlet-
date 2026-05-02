# Composer V0 — Transition Log

The five-operation transplant from five-chamber shell to cursor capsule.
Each operation is one surgical cut, gated by a binary validation check.
Reversibility holds until Op 5.

## Lei de fechamento

A transição não é projeto. É operação de transplante de superfície
sobre cérebro vivo. O cérebro continua a bater durante a operação. A
superfície velha sai por fora enquanto a nova entra por dentro. Em
nenhum momento o paciente para.

## As cinco operações

### Op 1 — Composer routes em vivo · `0166f4d`

The capsule needs ground before existing. Four routes
(`/composer/{context,intent,preview,apply}`) wired to the real brain,
running alongside the existing `/route`, `/dev`, `/crew` routes. Three
`TODO[wire]` integration points (engine triad, agent loop, run ledger)
all closed in this commit.

**Validation gate 1:**
- Mock-mode smoke flow returns 200 on all four stages
- Positive: `intent="generate_code"` conf=0.85, preview `refused=false`,
  apply `status="applied"`. Two rows in `runs.json` (composer envelope +
  underlying agent row, correlated via `composer:intent_id` marker).
- Negative: `intent="ambiguous"` conf=0.35 with `clarifying_questions`,
  preview `refused=true` `judge_verdict="low"`
  `refusal_reason="ambiguous_intent"`, apply `status="skipped"`.
- 18/18 existing `test_security` tests pass.

### Op 2 — Browser extension primeiro contacto · `3fc6764`

`apps/browser-extension/` in WXT + Manifest V3. Surgical scope:
selection capture, `Alt+Space` global hotkey, minimal capsule (input +
Compor + preview + Copy + Esc-to-dismiss), client wired to the four
`/composer/*` routes, toolbar popup as fallback for `chrome://` pages.

Out of scope: Code Mode, Design Mode, Analysis Mode (Wave 1+),
streaming previews (Wave 1+), API-key UI (deferred to Op 4 settings),
production backend URL (Op 4).

**Validation gate 2 (machine-side):**
- `npm install` clean, `npm run compile` zero TS errors
- `npm run build` produces `chrome-mv3` in 1.7 s, 340 KB total
- `manifest.json` correctly emits service_worker, content_scripts on
  `<all_urls>`, command `Alt+Space`, host_perms scoped to localhost

**Validation gate 2 (operator-side):** open
`fastapi.tiangolo.com/tutorial/path-params/`, select paragraph, hit
`Alt+Space`, type `turn this into a working FastAPI route`, click
`Compor`, click `Copy`. ≤ 3 clicks beyond the type. **Operator
verifies on their machine.**

### Op 3 — Arquivar o shell antigo · `15ac30f`

Surgical move via `git mv` (preserves history):

```
src/shell/                   → _legacy/shell/
src/chambers/                → _legacy/chambers/  (six chambers)
src/pages/                   → _legacy/pages/
src/router.tsx               → _legacy/router.tsx
src/App.tsx                  → _legacy/App.legacy.tsx
src/preview-agent/           → _legacy/preview-agent/
src/lib/previewBridge.ts     → _legacy/lib/
src/lib/intentSwitchGuard.*  → _legacy/lib/
```

91 files moved. Zero deleted. New `src/App.tsx` is a placeholder
("the brain still beats, the surface migrated"). `tsconfig.json`
gains `"exclude": ["_legacy", "apps", "node_modules"]` so the active
graph stays clean.

Surviving in `src/` (Control Center seed): `spine/`, `tweaks/`,
`trust/`, `i18n/`, `styles/`, `design/`, `hooks/`,
`lib/{motion,ruberraApi,signalApi,telemetry}.ts`,
`components/atoms/`, `tools/registry.ts`.

**Validation gate 3:**
- `npm run typecheck` zero errors (tsc honors the exclude)
- `npm run build` 29 modules, 149 KB JS gz (down from full chamber
  bundle — proof `_legacy/` is no longer in the active graph)
- `apps/browser-extension` rebuild still 340 KB (independent toolchain)
- `signal-backend` untouched

Reversibility: `git revert 15ac30f` restores the old shell as the
active surface in one step.

### Op 4 — Control Center podado · `a94f4c1`

Replaces the placeholder with five operator surfaces under `/control`:

| Path | Reads | Purpose |
|------|-------|---------|
| `/control` | `/health` + `/diagnostics` | Quick health overview |
| `/control/settings` | env + localStorage | Backend config + theme |
| `/control/models` | `/gateway/summary` | Routing + cost tables |
| `/control/permissions` | static V0 matrix | Connector × scope (read-only) |
| `/control/memory` | `/memory/{stats,failures}` | Failures list + clear |
| `/control/ledger` | `/runs` | Filterable run log + detail panel |

Doctrine honoured: console de operador, NOT product. No hero, no CTA,
no onboarding. Densidade calma, tipografia técnica (mono labels,
serif section titles), cor sóbria. Reuses the surviving infra (no
new state primitives, no new backend surface).

**Validation gate 4:**
- `npm run typecheck` zero errors
- `npm run build` 52 modules, 239 KB JS / 76 KB gz
- Backend endpoint shapes spot-checked against live `signal-backend`
  in mock mode — types corrected after the spot-check (initial draft
  assumed wrong shape for `/diagnostics` and `/gateway/summary`)
- Operator tasks reachable in ≤ 3 clicks each (key/last-10/failure/
  connector)

### Op 5 — Renomeação canónica + selagem · pending

Last operation. Only with the four prior gates green. Splits into
**safe parts** (executable in this branch) and **destructive parts**
(operator-side, requires explicit confirmation).

**Safe parts (committed):**
- `package.json` `name`: `ai-shell` → `ruberra-composer`
- `README.md` rewritten to document the Composer V0 architecture
- `docs/COMPOSER_V0.md` (this file)
- `package-lock.json` regenerated to pick up the new name

**Destructive parts (NOT executed; await operator):**
- Rename the GitHub repo
  `Ivan-dias99/Aiinterfaceshelldesign` → `Ivan-dias99/ruberra-composer`.
  GitHub maintains automatic redirects.
  Update `ops/CANON_LOCK.md` + `ops/CONNECTORS.md` Vercel hostnames
  after the rename.
- Delete `_legacy/` in an isolated final commit:
  `cleanup: remove archived five-chamber shell after V0 closure`.
  **Não antes. Só depois do composer-v0 estar deployado em produção
  e correr o seu primeiro fluxo real fora dos testes.**
- Tag `composer-v0` after the deploy.

**Validation gate 5:** tag `composer-v0` deployada em produção.
Smoke flow corre contra produção, não localhost. Ledger de produção
tem registos do uso real. **Nesta operação a transição está
concluída.**

## As leis que governaram a transição

- **Nunca destruir antes de provar a alternativa.** Op 3 só aconteceu
  depois das 1 e 2 estarem verdes. O `_legacy/` só desaparece após o
  `composer-v0` estar selado em produção.
- **Cada operação é um portão, não um milestone.** Milestone é
  decorativo — passa-se mesmo se as coisas não estão verdes. Portão é
  binário — ou está verde ou não se avança.
- **Closure parcial é closure real.** Cada operação fecha uma fatia
  demonstrável isoladamente. Não há "vai estar pronto quando tudo
  estiver pronto".
- **Reversibilidade até à Op 5.** Cada commit reverte limpinho com
  `git revert`. O `_legacy/` existe exatamente para isto.
- **O cérebro é sagrado.** Em nenhuma operação `engine.py`, `agent.py`,
  `crew.py`, `tools.py`, `memory.py`, `runs.py`, `spine.py`,
  `doctrine.py`, `models.py`, `auth.py`, `rate_limit.py` foram
  reescritos. Modificações cirúrgicas para integrar Composer? Sim
  (Op 1 adicionou tipos a `models.py` e router em `server.py`).
  Reescrita? Não.

## Próximos passos (Wave 1+)

Sobre fundação selada (não mais refundação — construção):

- Code Mode rico (full IDE patch generation in the capsule)
- Design Mode (real generator behind the Surface placeholder)
- Analysis Mode (long-form report builder)
- Memory Mode rico (semantic search across runs)
- Voice (speech-to-text input)
- Image Mode (real image-generation route)
- Automation Scheduler (recurring composer flows)
- Connectors live: GitHub (PR ops), Vercel (deploys read), Figma
  (file import)
- Streaming previews (SSE through `/composer/preview/stream`)
- Per-operator permission mutation (POST `/permissions/{set,get}`)
