// Wave 8 — visual tokens scoped to the /composer surface.
//
// The /control surface keeps its current calm operator-console look.
// The composer surface upgrades to a glowing-circuit aesthetic faithful
// to the canonical Foto 3 mockup: deep navy background, cyan accent
// glow, connection lines between panels, numbered badges, pulse on the
// central dot.
//
// Scope is enforced by the [data-composer-surface] selector on the
// outermost wrapper. Anything outside that subtree continues to read
// the operator-console palette unchanged.

export const COMPOSER_TOKENS = `
[data-composer-surface] {
  /* Palette — deep-navy + electric-cyan. Overrides only the tokens
     consumed inside the composer subtree; /control surfaces are
     untouched because the selector is scoped. */
  --bg: #060a14;
  --bg-surface: #0d1322;
  --bg-elevated: #131a2c;
  --bg-deep: #03060e;
  --border: rgba(120, 180, 255, 0.14);
  --border-soft: 1px solid rgba(120, 180, 255, 0.08);
  --text-primary: #e8eef9;
  --text-secondary: #a8b3c8;
  --text-muted: #6c7a96;
  --text-ghost: #3d4763;
  --accent: #5ea5ff;
  --accent-soft: rgba(94, 165, 255, 0.45);
  --accent-glow: rgba(94, 165, 255, 0.32);
  --accent-glow-strong: rgba(94, 165, 255, 0.55);
  --ok: #4dd6a4;
  --warn: #f0b65f;
  --danger: #ff6e87;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  background:
    radial-gradient(ellipse at 50% 30%, rgba(94, 165, 255, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 0%,  rgba(94, 165, 255, 0.04) 0%, transparent 50%),
    linear-gradient(180deg, #08101e 0%, #050810 100%);
  color: var(--text-primary);
  font-family: var(--sans);
}

/* ─── Panel — every side card around the central composer ─── */
[data-composer-surface] [data-glow-panel] {
  position: relative;
  background:
    linear-gradient(180deg, rgba(94, 165, 255, 0.05) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 100%, rgba(94, 165, 255, 0.06), transparent 70%),
    var(--bg-surface);
  border: 1px solid rgba(120, 180, 255, 0.18);
  border-radius: var(--radius-lg);
  box-shadow:
    0 0 0 1px rgba(94, 165, 255, 0.08),
    0 0 36px rgba(94, 165, 255, 0.12),
    0 10px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    border-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
[data-composer-surface] [data-glow-panel]:hover {
  border-color: rgba(94, 165, 255, 0.4);
  box-shadow:
    0 0 0 1px rgba(94, 165, 255, 0.25),
    0 0 36px rgba(94, 165, 255, 0.22),
    0 10px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}
[data-composer-surface] [data-glow-panel][data-active="true"] {
  border-color: rgba(94, 165, 255, 0.55);
  box-shadow:
    0 0 0 1px rgba(94, 165, 255, 0.45),
    0 0 44px rgba(94, 165, 255, 0.32),
    0 12px 36px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* ─── Numbered badge top-left of each side panel ─── */
[data-composer-surface] [data-glow-badge] {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 30%, rgba(94, 165, 255, 0.95), rgba(94, 165, 255, 0.55) 70%, transparent);
  border: 1px solid rgba(94, 165, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0;
  box-shadow:
    0 0 12px rgba(94, 165, 255, 0.55),
    0 0 0 3px rgba(6, 10, 20, 1);
  z-index: 2;
}

/* ─── Central canvas — the active mode surface.
   Override every canvas variant via attribute selector + !important
   so the ComposeCanvas / CodeCanvas / etc. inline styles cede to the
   surface palette. The composer is the convergence point of every
   connection ray, so the glow stack is intentionally heavy. ─── */
[data-composer-surface] [data-composer-canvas],
[data-composer-surface] [data-code-canvas],
[data-composer-surface] [data-apply-canvas],
[data-composer-surface] [data-design-canvas],
[data-composer-surface] [data-analysis-canvas],
[data-composer-surface] [data-memory-canvas],
[data-composer-surface] [data-route-canvas] {
  position: relative;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(94, 165, 255, 0.10) 0%, rgba(94, 165, 255, 0.04) 35%, transparent 70%),
    var(--bg-surface) !important;
  border: 1px solid rgba(94, 165, 255, 0.55) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow:
    0 0 0 1px rgba(94, 165, 255, 0.45),
    0 0 60px rgba(94, 165, 255, 0.45),
    0 0 140px rgba(94, 165, 255, 0.25),
    0 0 240px rgba(94, 165, 255, 0.10),
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 0 40px rgba(94, 165, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
}

/* Composer halo — a luminous disc behind the active canvas so the
   connection rays appear to be absorbed into a glowing centre. The
   halo is a sibling DIV positioned absolutely; this rule supplies
   the visual treatment, the layout positions it. */
[data-composer-surface] [data-composer-halo] {
  position: absolute;
  inset: -60px;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 50% 50%,
      rgba(180, 220, 255, 0.22) 0%,
      rgba(94, 165, 255, 0.18) 14%,
      rgba(94, 165, 255, 0.08) 30%,
      rgba(94, 165, 255, 0.03) 50%,
      transparent 72%);
  filter: blur(2px);
}

/* ─── Pulse dot used in canvas headers ─── */
@keyframes composer-pulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(94, 165, 255, 0.65);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 18px rgba(94, 165, 255, 1);
    transform: scale(1.18);
  }
}
[data-composer-surface] [data-pulse-dot] {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffff, var(--accent) 60%, transparent 80%);
  animation: composer-pulse 2.4s ease-in-out infinite;
}

/* ─── Top header strip ─── */
[data-composer-surface] [data-top-strip] {
  background:
    linear-gradient(180deg, rgba(94, 165, 255, 0.06), transparent),
    var(--bg-deep);
  border-bottom: 1px solid rgba(120, 180, 255, 0.12);
}

/* ─── Pipeline strip at the bottom ─── */
[data-composer-surface] [data-pipeline-bar] {
  background:
    linear-gradient(180deg, transparent, rgba(94, 165, 255, 0.04)),
    var(--bg-deep);
  border-top: 1px solid rgba(120, 180, 255, 0.12);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.4);
}
[data-composer-surface] [data-pipeline-stage] {
  background:
    linear-gradient(180deg, rgba(94, 165, 255, 0.08), rgba(94, 165, 255, 0.02));
  border: 1px solid rgba(94, 165, 255, 0.2);
  border-radius: 10px;
  box-shadow:
    0 0 16px rgba(94, 165, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: border-color 200ms, box-shadow 200ms;
}
[data-composer-surface] [data-pipeline-stage]:hover {
  border-color: rgba(94, 165, 255, 0.45);
  box-shadow:
    0 0 22px rgba(94, 165, 255, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* ─── Inputs / textareas inside the composer get glow-on-focus ─── */
[data-composer-surface] textarea:focus,
[data-composer-surface] input:focus {
  outline: none;
  border-color: rgba(94, 165, 255, 0.55) !important;
  box-shadow:
    0 0 0 3px rgba(94, 165, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* ─── Primary action button (Compose etc.) ─── */
[data-composer-surface] button[type="submit"]:not(:disabled) {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent),
    var(--accent);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12) inset,
    0 0 20px rgba(94, 165, 255, 0.45),
    0 4px 16px rgba(0, 0, 0, 0.4);
}
[data-composer-surface] button[type="submit"]:not(:disabled):hover {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.18) inset,
    0 0 28px rgba(94, 165, 255, 0.65),
    0 4px 16px rgba(0, 0, 0, 0.4);
}

/* ─── Connection lines (SVG layer) — glow filter target ─── */
[data-composer-surface] [data-connection-lines] {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
[data-composer-surface] [data-connection-lines] path {
  stroke: rgba(94, 165, 255, 0.5);
  stroke-width: 1.2;
  fill: none;
}
`;

// Helper to inject the CSS once at the layout level. Idempotent —
// repeated mounts (e.g. React fast-refresh) reuse the same <style> tag.
const STYLE_TAG_ID = "composer-visual-tokens";

export function ensureComposerStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_TAG_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = COMPOSER_TOKENS;
  document.head.appendChild(style);
}
