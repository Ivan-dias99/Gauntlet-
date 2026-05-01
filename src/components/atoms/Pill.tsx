// Wave P-45 — Pill atom.
//
// Small bordered chip used across pages for status, kind, count, etc.
// Variants:
//   tone   — neutral | ok | warn | danger | ghost
//   size   — sm (default) | md
//   shape  — rounded (default) | full (capsule)
// The atom owns NO behavior; it is purely presentational. Consumers
// wrap it in a button if they want interactivity. Lives under
// src/components/atoms/ per the hierarchy laid out in
// docs/COMPONENT_HIERARCHY.md (Wave P-45).

import type { ReactNode } from "react";

export type PillTone = "neutral" | "ok" | "warn" | "danger" | "ghost";
export type PillSize = "sm" | "md";
export type PillShape = "rounded" | "full";

interface Props {
  children: ReactNode;
  tone?: PillTone;
  size?: PillSize;
  shape?: PillShape;
  glyph?: ReactNode;
  /** Pulled through to the rendered span for tests / styling hooks. */
  dataAttr?: Record<string, string>;
}

const TONE_COLOR: Record<PillTone, { fg: string; bg: string }> = {
  neutral: {
    fg: "var(--text-primary)",
    bg: "color-mix(in oklab, var(--text-primary) 6%, transparent)",
  },
  ok: {
    fg: "color-mix(in oklab, var(--ok, #4a8c5d) 92%, var(--text-primary))",
    bg: "color-mix(in oklab, var(--ok, #4a8c5d) 14%, transparent)",
  },
  warn: {
    fg: "color-mix(in oklab, var(--warn, #c0922a) 92%, var(--text-primary))",
    bg: "color-mix(in oklab, var(--warn, #c0922a) 14%, transparent)",
  },
  danger: {
    fg: "color-mix(in oklab, var(--danger, #d04a4a) 92%, var(--text-primary))",
    bg: "color-mix(in oklab, var(--danger, #d04a4a) 14%, transparent)",
  },
  ghost: {
    fg: "var(--text-muted)",
    bg: "transparent",
  },
};

export default function Pill({
  children,
  tone = "neutral",
  size = "sm",
  shape = "rounded",
  glyph,
  dataAttr = {},
}: Props) {
  const palette = TONE_COLOR[tone];
  return (
    <span
      data-pill-tone={tone}
      data-pill-size={size}
      data-pill-shape={shape}
      {...dataAttr}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        fontFamily: "var(--mono)",
        fontSize: size === "sm" ? "var(--t-meta)" : "var(--t-body-sec)",
        letterSpacing: "var(--track-meta)",
        textTransform: "uppercase",
        color: palette.fg,
        background: palette.bg,
        border: tone === "ghost"
          ? "1px solid var(--border-soft)"
          : "1px solid color-mix(in oklab, currentColor 32%, transparent)",
        borderRadius: shape === "full" ? "999px" : "var(--radius-sm)",
        whiteSpace: "nowrap",
      }}
    >
      {glyph && <span aria-hidden style={{ opacity: 0.85 }}>{glyph}</span>}
      <span>{children}</span>
    </span>
  );
}
