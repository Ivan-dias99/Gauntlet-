/**
 * Wave P-33 — Token → CSS variable bridge (single source of truth).
 *
 * `buildCssVariables()` flattens the typed token objects into a record
 * of CSS custom properties. `injectCssVariables()` then materialises
 * those properties as a `<style>` element prepended to `<head>` so the
 * static stylesheet (`src/styles/tokens.css`) and any inline
 * `style={{ color: "var(--…)" }}` resolve through one and the same
 * source — and the stylesheet's media-query overrides still cascade
 * normally on top.
 *
 * Round-3 contract: every primitive emitted here is the AUTHORITATIVE
 * value. `src/styles/tokens.css` no longer redeclares any of these on
 * `:root` — only `@media`-wrapped responsive overrides (e.g.
 * `--space-4..7`, `--t-display`, `--t-chamber`, `--t-section` ≤640px)
 * layer on top via the cascade. Adding a baseline for an emitted var
 * to `tokens.css` would silently override the TS source and break the
 * single-source-of-truth contract — don't.
 *
 * The legacy canon (`--space-1..7`, `--radius-shell|panel|control|pill|code`,
 * `--font-mono|sans|serif`, `--t-meta|kicker|body|prominent|title|display|hero`)
 * is emitted here so the TS layer stays the only place those values
 * live. New Wave P-33 vars (`--space-0|8..12`, `--radius-sm|md|lg|full`,
 * `--shadow-sm|md|lg|focus`, `--motion-duration-fast|normal|slow`,
 * `--motion-ease-out|inout|spring`, `--leading-tight|normal|loose`,
 * `--weight-regular|medium`, `--track-{meta|body|display}-new`) are
 * emitted alongside.
 */

import { tokens } from "./tokens";
import { typography } from "./typography";

const px = (n: number): string => `${n}px`;
const ms = (n: number): string => `${n}ms`;

/**
 * Flatten the token graph into a `--key: value` map. Pure function — no
 * DOM access — so it can be unit-tested or rendered server-side.
 */
export function buildCssVariables(): Record<string, string> {
  const vars: Record<string, string> = {};

  // ---- Spacing — new ramp (--space-0..12) + legacy aliases (--space-1..7)
  for (const [k, v] of Object.entries(tokens.space)) {
    vars[`--space-${k}`] = px(v as number);
  }
  // Legacy 7-step ramp kept verbatim so existing CSS continues to read
  // the same pixels it always did. These overwrite the new ramp's
  // `--space-1..7` keys with the values pre-Wave P-33 stylesheets relied
  // on.
  vars["--space-1"] = "8px";
  vars["--space-2"] = "12px";
  vars["--space-3"] = "16px";
  vars["--space-4"] = "24px";
  vars["--space-5"] = "32px";
  vars["--space-6"] = "48px";
  vars["--space-7"] = "64px";

  // ---- Radius — new (sm/md/lg/full)
  vars["--radius-sm"] = px(tokens.radius.sm);
  vars["--radius-md"] = px(tokens.radius.md);
  vars["--radius-lg"] = px(tokens.radius.lg);
  vars["--radius-full"] = `${tokens.radius.full}px`;
  // Legacy canon — kept.
  vars["--radius-shell"] = "28px";
  vars["--radius-panel"] = "22px";
  vars["--radius-control"] = "16px";
  vars["--radius-pill"] = "999px";
  vars["--radius-code"] = "18px";

  // ---- Shadow — new
  vars["--shadow-sm"] = tokens.shadow.sm;
  vars["--shadow-md"] = tokens.shadow.md;
  vars["--shadow-lg"] = tokens.shadow.lg;
  vars["--shadow-focus"] = tokens.shadow.focus;

  // ---- Motion — new
  vars["--motion-duration-fast"] = ms(tokens.motion.duration.fast);
  vars["--motion-duration-normal"] = ms(tokens.motion.duration.normal);
  vars["--motion-duration-slow"] = ms(tokens.motion.duration.slow);
  vars["--motion-ease-out"] = tokens.motion.easing.out;
  vars["--motion-ease-inout"] = tokens.motion.easing.inOut;
  vars["--motion-ease-spring"] = tokens.motion.easing.spring;

  // ---- Font families — namespaced aliases (legacy --mono/--sans/--serif
  // remain canonical and are not overwritten here).
  vars["--font-mono"] = tokens.font.mono;
  vars["--font-sans"] = tokens.font.sans;
  vars["--font-serif"] = tokens.font.serif;

  // ---- Letter-spacing — namespaced tracks. The legacy --track-tight /
  // --track-normal / --track-meta / --track-label / --track-kicker keys
  // remain canonical in tokens.css (no TS counterpart yet) — these
  // -new-suffixed vars are the typed surface for new code.
  vars["--track-meta-new"] = tokens.track.meta;
  vars["--track-body-new"] = tokens.track.body;
  vars["--track-display-new"] = tokens.track.display;

  // ---- Typography scale — full ramp emitted here as the SINGLE source.
  // Round 3 of Wave P-33 removed the duplicate :root declarations for
  // these from src/styles/tokens.css; only the @media-wrapped responsive
  // overrides (e.g. `--t-display: 32px` ≤640px) remain there. Adding a
  // baseline back to the stylesheet would silently override the TS
  // value — see css-vars.ts header doc for the contract.
  vars["--t-meta"] = px(typography.scale.meta);
  vars["--t-kicker"] = px(typography.scale.kicker);
  vars["--t-body"] = px(typography.scale.body);
  vars["--t-prominent"] = px(typography.scale.prominent);
  vars["--t-title"] = px(typography.scale.title);
  vars["--t-display"] = px(typography.scale.display);
  vars["--t-hero"] = px(typography.scale.hero);

  // ---- Leading
  vars["--leading-tight"] = String(typography.leading.tight);
  vars["--leading-normal"] = String(typography.leading.normal);
  vars["--leading-loose"] = String(typography.leading.loose);

  // ---- Weight
  vars["--weight-regular"] = String(typography.weight.regular);
  vars["--weight-medium"] = String(typography.weight.medium);

  return vars;
}

/**
 * Render the token map as a `:root { … }` CSS string. Used by the
 * runtime injector (via a `<style>` element) and exported for SSR /
 * debugging.
 */
export function renderRootCss(vars: Record<string, string> = buildCssVariables()): string {
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${body}\n}`;
}

/** ID used for the singleton `<style>` element appended to `<head>`. */
const STYLE_ELEMENT_ID = "signal-tokens";

/**
 * Materialise every token onto `:root` via a `<style>` element prepended
 * to `<head>`. Safe to call multiple times — the existing element is
 * replaced rather than duplicated. No-op when `document` is undefined
 * (SSR / unit tests).
 *
 * Why a `<style>` element and not `documentElement.style.setProperty`:
 * inline styles on `<html>` win over stylesheet rules at equal
 * specificity, which would silently blow away the media-query overrides
 * in `src/styles/tokens.css` (e.g. the `@media (max-width: 640px)` block
 * that shrinks `--space-4..7` and the display scale on phones). By
 * emitting a stylesheet rule we let the cascade apply normally — these
 * values become the BASELINE, and any later `:root { ... }` rule (with
 * or without a media wrapper) layers on top in source order.
 *
 * The element is inserted as the FIRST child of `<head>` so it is
 * earlier in source order than `tokens.css` (which Vite injects via its
 * own `<style>` / `<link>` tag). That way the stylesheet's
 * media-query-wrapped overrides reliably win on narrow viewports.
 */
export function injectCssVariables(): void {
  if (typeof document === "undefined") return;
  const head = document.head;
  if (!head) return;
  const css = renderRootCss();

  const existing = document.getElementById(STYLE_ELEMENT_ID);
  if (existing && existing instanceof HTMLStyleElement) {
    // Update in place — keeps source-order position so the cascade
    // contract (this stylesheet first, tokens.css after) is preserved
    // across hot reloads / repeat calls.
    existing.textContent = css;
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = css;
  // Prepend so any later `<style>` (tokens.css via Vite) layers on top.
  head.insertBefore(style, head.firstChild);
}
