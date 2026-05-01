/**
 * Wave P-33 — Token → CSS variable bridge.
 *
 * `buildCssVariables()` flattens the typed token objects into a record
 * of CSS custom properties. `injectCssVariables()` then writes those
 * properties onto `document.documentElement` so the static stylesheet
 * (`src/styles/tokens.css`) and any inline `style={{ color: "var(--…)" }}`
 * resolve through one and the same source.
 *
 * Backwards compatibility: the existing canon (e.g. `--space-1..7`,
 * `--t-display`, `--t-body`, `--radius-control`, `--shadow-soft`,
 * `--ease-swift`, `--dur-fast`) is re-emitted here so the static
 * stylesheet keeps working even if it ever gets evicted. New Wave P-33
 * vars (`--t-prominent`, `--t-hero`, `--leading-tight|normal|loose`,
 * `--shadow-sm|md|lg|focus`, `--motion-duration-fast|normal|slow`,
 * `--motion-ease-out|inout|spring`) are emitted alongside.
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

  // ---- Letter-spacing — new semantic tracks. Legacy --track-tight /
  // --track-meta / --track-kicker stay as-is in the stylesheet.
  vars["--track-meta-new"] = tokens.track.meta;
  vars["--track-body-new"] = tokens.track.body;
  vars["--track-display-new"] = tokens.track.display;

  // ---- Typography scale — new size vars. --t-display / --t-body /
  // --t-meta already exist in the stylesheet at the same values; we
  // re-emit them so the TS source remains authoritative.
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
 * Render the token map as a `:root { … }` CSS string. Useful for SSR,
 * style-tag injection or debugging. Not used by the runtime injector
 * (which writes directly via `setProperty`) but kept exported because it
 * is the most legible way to inspect the materialised tokens.
 */
export function renderRootCss(vars: Record<string, string> = buildCssVariables()): string {
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${body}\n}`;
}

/**
 * Apply every token to `document.documentElement` via `setProperty`. Safe
 * to call multiple times — values are overwritten in place. No-op when
 * `document` is undefined (SSR / unit tests).
 */
export function injectCssVariables(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root || !root.style) return;
  const vars = buildCssVariables();
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
}
