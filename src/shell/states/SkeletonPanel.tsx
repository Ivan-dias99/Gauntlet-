// Wave P-36 — Panel skeleton.
//
// Wraps the LoadingState primitive into the canonical chamber-panel
// shape: a header line, a stack of body lines, and a meta row at the
// bottom. Replaces the "render nothing while loading" anti-pattern so
// the layout doesn't reflow when the real data arrives.

import type { CSSProperties } from "react";
import LoadingState from "./LoadingState";

interface Props {
  /** Body line count. Defaults to 3 to match the spec. */
  bodyLines?: number;
  /** Outer style overrides. */
  style?: CSSProperties;
  /** Accessible label. Defaults to "painel a carregar". */
  ariaLabel?: string;
}

export default function SkeletonPanel({
  bodyLines = 3,
  style,
  ariaLabel = "painel a carregar",
}: Props) {
  return (
    <section
      data-state="skeleton-panel"
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      className="panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        ...style,
      }}
    >
      {/* Header line — short, mimics panel title. */}
      <span
        className="skeleton-shimmer"
        data-skeleton-line="header"
        style={{
          display: "block",
          height: 12,
          width: "32%",
          borderRadius: 4,
          // Longhand: `background` shorthand would clobber the
          // .skeleton-shimmer class's background-image gradient and
          // freeze the row to a static block. See LoadingState.
          backgroundColor: "var(--bg-elevated, var(--bg-surface))",
        }}
      />
      {/* Body lines. */}
      <LoadingState lines={bodyLines} />
      {/* Meta row — narrower, mimics kicker. */}
      <span
        className="skeleton-shimmer"
        data-skeleton-line="meta"
        style={{
          display: "block",
          height: 8,
          width: "22%",
          borderRadius: 4,
          backgroundColor: "var(--bg-elevated, var(--bg-surface))",
          opacity: 0.7,
        }}
      />
    </section>
  );
}
