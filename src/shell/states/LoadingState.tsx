// Wave P-36 — Loading skeleton primitive.
//
// One inline skeleton block: N stacked lines with a shimmer pass that
// gates on `prefers-reduced-motion` (the global rule in tokens.css
// already neutralises animations under reduce; the .skeleton-shimmer
// class adds the keyframe only when motion is allowed).
//
// Use this primitive directly for one-off small placeholders (a single
// row, a meta line). For panel-shaped placeholders, prefer
// <SkeletonPanel /> which composes this primitive into the standard
// header + body + meta layout.

import type { CSSProperties } from "react";

interface Props {
  /** How many shimmer lines to render. Defaults to 3. */
  lines?: number;
  /** Optional CSS width override per line (e.g. "70%"). Defaults to "100%". */
  width?: string;
  /** Outer style overrides (margins, padding). */
  style?: CSSProperties;
  /** Accessibility label — defaults to "carregando". */
  ariaLabel?: string;
}

export default function LoadingState({
  lines = 3,
  width = "100%",
  style,
  ariaLabel = "carregando",
}: Props) {
  const safeLines = Math.max(1, Math.floor(lines));
  return (
    <div
      data-state="loading"
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        ...style,
      }}
    >
      {Array.from({ length: safeLines }).map((_, i) => (
        <span
          key={i}
          data-skeleton-line={i}
          className="skeleton-shimmer"
          style={{
            display: "block",
            height: 10,
            // Slightly stagger widths so the row reads as text, not bars.
            width: i === safeLines - 1 ? "60%" : width,
            borderRadius: 4,
            background: "var(--bg-elevated, var(--bg-surface))",
          }}
        />
      ))}
    </div>
  );
}
