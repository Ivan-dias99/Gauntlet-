# RUBERRA — Cursor cascade surface state (Task 01–02)

**Date:** 2026-03-31  
**Branch:** `cursor/claude-task-force-leadership-97fb`  
**Scope:** Cursor-owned visible surfaces; Codex runtime (Supabase streaming, fabric persistence) out of scope here.

## Task 01 — Prior-state audit (strong / weak / dead)

| Zone | Strong | Weak / mid-polish | Dead / fake-finished |
|------|--------|-------------------|----------------------|
| Hero entry | Grid, portal, chamber chips, motion discipline | Wordmark/geometry same opacity in dark as light; no theme sync from App | N/A |
| Shell top bar | Blur, chamber switcher, tokens | Icon rhythm could tighten | N/A |
| Side rail | Chamber sections, nav density | Hover uses `rgba(0,0,0,0.04)` → wrong in dark | Some rows generic |
| Chat | Metamorphic blocks + plain wrapper; manifesto | Lab/School/Creation shared same metamorphic *rail* (accent-only) | Plain text class heuristic can misclassify |
| Terminal | Single header strip; matte ops | Creation vs Lab same chrome | N/A |
| Lab discover | Hero + rails + previews | School/Creation homes not upgraded in same pass | N/A |
| Profile | Ledger, workflows | Dense util layout | N/A |

## Task 02 — Duplication purge map (drivers)

1. **Hero:** Narrative card below portal repeats chamber roles already in portal chips + CTA → **merge into portal** (one sovereign statement).
2. **Chamber list:** Portal chips are canonical; avoid second “what each chamber does” block outside portal.
3. **Metamorphic rail:** Default analytical rail used all chambers for plain text → **override rail per chamber** (Lab/School/Creation).
4. **Side rail hover:** Same hover color all themes → **token-based hover**.

## Tasks 03–50 — Closure honesty

| Range | Status |
|-------|--------|
| 03–10 Homepage | **Closed in code** this commit: `theme` prop → `data-theme` on hero; `--hero-*` tokens (light/dark); static center glow; matte R geometry; narrative **inside** portal only; responsive top/center/bottom padding; portal gateway hover + grid `auto-fit` |
| 11–15 Shell | **Partial**: SovereignBar horizontal padding; side-rail **token hover** (dark-safe); chamber switcher / empty states not fully re-audited |
| 16–20 Chat | **Advanced**: `BlockRenderer` / `MetamorphicPlainSurface` take **`chamber`** — analytical rail uses **chamber accent** (Lab/School/Creation) |
| 21–27 Metamorphic | **Advanced**: chamber-aware analytical rail; lesson section **airier** padding; execution + evidence sections slightly denser/spacier as appropriate |
| 28–33 Terminal | **No change this commit** — prior pass stands |
| 34–37 Chamber closure | **Open** |
| 38–42 Cards / seed | **Open** beyond Lab (School/Creation/Profile rails) |
| 43–48 Sweeps | **Open** |
| 49–50 | `npm run build` OK; residue below |

## Residue (explicit)

- **Codex:** Live model streaming, server truth, connector auth — not Cursor UI scope.
- **Later polish:** School/Creation discovery rails, Profile overview density, full mobile sweep on every sub-view, micro-interaction audit beyond hover fixes.
