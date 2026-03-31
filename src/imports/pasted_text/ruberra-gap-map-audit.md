# RUBERRA — COPILOT GAP MAP AUDIT

**Phase:** 4 — Copilot Cleanup & Consistency  
**Branch:** `copilot/define-gap-map-audit`  
**Audit date:** 2026-03-31  
**Status:** COMPLETE

---

## Audit Scope

This document records the gap map produced during the Copilot phase. It captures the state of the codebase after Codex (runtime) and Cursor (visual polish) have completed their passes, and identifies residual gaps, consistency issues, and edge cases that must be resolved before the final audit closes this cycle.

---

## 1. Governance Gaps — RESOLVED

| Gap | Resolution |
|-----|------------|
| No governance document for pioneer workflow | Created `RUBERRA-DISCIPLINE.md` at repo root |
| `guidelines/Guidelines.md` contained only placeholder template content | Replaced with Ruberra-specific product and architecture guidelines |
| No `.gitignore` — build artifacts tracked in repo | Added `.gitignore` excluding `node_modules`, `dist`, and build artifacts |

---

## 2. Architecture Surface Audit

### 2a. Navigation Graph — WIRED ✓

All chamber views are connected to the navigation graph via `NavFn`. Cross-chamber links are present in `object-graph.ts` through `action_route` and `archive_route` on each `RuberraObject`. No orphaned views detected.

**Views audited:**
- Lab: `home`, `chat`, `analysis`, `code`, `archive`, `domain`, `experiment`
- School: `home`, `chat`, `library`, `archive`, `track`, `lesson`, `role`, `browse`
- Creation: `home`, `chat`, `terminal`, `archive`, `blueprint`, `engine`, `artifact`

### 2b. Product Data Integrity — VERIFIED ✓

Cross-references between `product-data.ts` object IDs and `object-graph.ts` `RUBERRA_OBJECTS` have been audited. All `linkedTracks`, `linkedBlueprints`, `linkedLessons`, and `experiments` reference IDs that exist in `product-data.ts`. No dangling references found.

### 2c. Model Orchestration — CONSISTENT ✓

Every `TaskType` defined in `model-orchestration.ts` has:
- An entry in `TASK_LABELS`
- An entry in `DEFAULT_MODEL_BY_TASK`
- An entry in `FALLBACK_CHAIN_BY_TASK`
- An entry in `CHAMBER_TASKS` for the correct chamber

No missing task routes. `resolveExecutionPlan` correctly handles unavailable models via fallback chain.

### 2d. Shell Types — COMPLETE ✓

All view types (`LabView`, `SchoolView`, `CreationView`) cover the full set of navigable states. `BlockType` and `StatusFlag` enumerations match what `parseBlocks.ts` and `BlockRenderer.tsx` consume.

---

## 3. Dead Surface Audit

Surfaces were checked against the Ruberra Core Law: *nothing dead may exist in the UI*.

| Surface | Status | Notes |
|---------|--------|-------|
| SovereignBar tab buttons | ✓ LIVE | Each triggers `onTabChange` |
| SovereignBar search icon | ⚠ STUB | No search modal wired — future Codex task |
| SovereignBar bell icon | ⚠ STUB | No notification panel wired — future Codex task |
| SovereignBar theme toggle | ✓ LIVE | Toggles dark/light via `onThemeToggle` |
| ShellSideRail nav items | ✓ LIVE | All views trigger `onLabView` / `onSchoolView` / `onCreationView` |
| ShellSideRail "New Note" | ✓ LIVE | Triggers `onNewNote` |
| ShellSideRail "Clear" | ✓ LIVE | Triggers `onClearTab` |
| FloatingNoteSystem drag | ✓ LIVE | Notes are draggable and editable |
| Status bar model label | ✓ LIVE | Reflects `activeModels[activeTab]` |
| Status bar chamber label | ✓ LIVE | Reflects `activeTab` |
| Status bar date | ✓ LIVE | Renders current date |

**Stubs requiring future wiring (Codex domain):**
- Search modal / command palette
- Notification / bell panel

---

## 4. Consistency Findings

### 4a. Token Usage

CSS variables (`var(--r-*)`) and the `R` token object from `tokens.ts` are used consistently across shell components. Chamber accent colors in `ShellSideRail.tsx` and `SovereignBar.tsx` duplicate values from `tokens.ts` as inline constants — acceptable for performance but must stay in sync if tokens change.

### 4b. Font Stack

`'Inter', sans-serif` is used for UI text and `'JetBrains Mono', monospace` for terminal/status surfaces — consistent across all components audited.

### 4c. Message State Shape

`Message` interface is fully typed. `blocks?: MessageBlock[]` is optional and correctly populated by `applyParsedBlocks` only when content is non-empty. No undefined-access risks detected.

### 4d. LocalStorage Persistence

`STORAGE_KEY = "ruberra_messages_v2"` is used with try/catch guards on both read and write. Corrupt storage degrades gracefully to an empty record.

---

## 5. Edge Cases Hardened

| Location | Edge Case | Status |
|----------|-----------|--------|
| `App.tsx` — `loadMessages` | Corrupt or partial `localStorage` data | ✓ Caught, falls back to empty |
| `App.tsx` — `handleSend` | Abort before stream starts | ✓ `AbortError` handled, signal reset |
| `App.tsx` — `handleSend` | HTTP error response | ✓ Error message written to assistant slot |
| `resolveExecutionPlan` | All models in fallback chain unavailable | ✓ Falls through to first pool entry |
| `FloatingNoteSystem` — `removeNote` | Pinned note removal | ✓ Pinned notes are protected |
| `App.tsx` — `emptyRecord` | Missing tab key | ✓ Constructed from `TABS` constant |

---

## 6. Remaining Gaps (Next-Phase Backlog)

The following gaps are **out of Copilot scope** and are recorded for the next Codex/Cursor cycle:

| Gap | Owner | Priority |
|-----|-------|----------|
| Search / command palette (SovereignBar search icon) | Codex | High |
| Notification panel (SovereignBar bell icon) | Codex | Medium |
| Profile / settings panel | Codex | Medium |
| Dark mode CSS variable completeness (some surfaces may lack `data-theme` overrides) | Cursor | Medium |
| School `browse` view — content rail not yet fully seeded | Codex | Low |
| Lab `archive` view — experiment archive list connection | Codex | Low |
| Creation `artifact` view — output bundle surface | Codex | Low |

---

## 7. Audit Verdict

| Domain | Status |
|--------|--------|
| Governance documents | ✓ COMPLETE |
| Navigation graph | ✓ WIRED |
| Product data integrity | ✓ VERIFIED |
| Model orchestration | ✓ CONSISTENT |
| Dead surface removal | ✓ CLEARED (stubs documented) |
| Consistency | ✓ CLEAN |
| Edge case hardening | ✓ DONE |

**Phase 4 (Copilot) is CLOSED. Ready for Phase 5 — Final Audit.**
