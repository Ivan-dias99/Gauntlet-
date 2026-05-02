// Wave P-36 — Error-state primitive.
//
// One component, three severities so chambers don't reinvent inline
// vs banner vs full-replacement error UI per panel:
//
//   * "silent" — inline, single line of muted copy. For losses small
//     enough that they don't change the surface (e.g. one row in a
//     table failed to render).
//   * "banner" — full-width bordered banner pinned at the top of a
//     panel. For recoverable failures where the rest of the panel can
//     still function. Always offers retry when `onRetry` is provided.
//   * "full" — replaces the panel content entirely. For failures that
//     leave nothing meaningful to show. Always offers retry when
//     `onRetry` is provided.
//
// Friendly text is the operator's; this primitive only supplies shape.
// No raw `(e as Error).message` should ever land here uninterpreted —
// callers should map exceptions to a one-line cause and pass the raw
// detail in `detail` if it adds diagnostic value.

import type { CSSProperties } from "react";

export type ErrorSeverity = "silent" | "banner" | "full";

interface Props {
  severity: ErrorSeverity;
  /** Friendly one-line cause. */
  message: string;
  /** Optional second line — raw error detail, edge code, etc. */
  detail?: string | null;
  /** Optional title shown beside the kicker on banner / full. */
  title?: string;
  /** Retry handler. Renders a button when provided. */
  onRetry?: () => void;
  /** CTA label override; defaults to "tentar de novo". */
  retryLabel?: string;
  /** Outer style overrides. */
  style?: CSSProperties;
}

export default function ErrorState({
  severity,
  message,
  detail,
  title,
  onRetry,
  retryLabel = "tentar de novo",
  style,
}: Props) {
  if (severity === "silent") {
    return (
      <span
        data-state="error"
        data-severity="silent"
        role="status"
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 6,
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          ...style,
        }}
      >
        <span aria-hidden style={{ color: "var(--cc-warn, var(--text-ghost))" }}>!</span>
        <span>{message}</span>
        {onRetry && (
          <button
            type="button"
            data-error-retry
            onClick={onRetry}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              padding: "2px 6px",
              border: "none",
              background: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {retryLabel}
          </button>
        )}
      </span>
    );
  }

  // Shared shell for banner + full. Banner is a thin pinned strip;
  // full takes the whole content area and centres itself.
  const isFull = severity === "full";
  return (
    <div
      data-state="error"
      data-severity={severity}
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: isFull ? "var(--space-4)" : "var(--space-2) var(--space-3)",
        borderRadius: isFull ? "var(--radius-panel)" : 6,
        border: "1px solid var(--cc-err, currentColor)",
        borderLeftWidth: isFull ? 1 : 4,
        background: "color-mix(in srgb, var(--cc-err, currentColor) 6%, transparent)",
        color: "var(--text-primary)",
        ...(isFull
          ? { alignItems: "center", textAlign: "center", margin: "0 auto", maxWidth: 520 }
          : {}),
        ...style,
      }}
    >
      <div
        data-error-head
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--cc-err, var(--text-secondary))",
        }}
      >
        {title ? `erro · ${title}` : "erro"}
      </div>
      <div
        data-error-message
        style={{
          fontFamily: "var(--serif)",
          fontSize: isFull ? 16 : 14,
          lineHeight: 1.4,
          color: "var(--text-primary)",
          letterSpacing: "-0.005em",
        }}
      >
        {message}
      </div>
      {detail && (
        <div
          data-error-detail
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-muted)",
            wordBreak: "break-word",
            opacity: 0.85,
          }}
        >
          {detail}
        </div>
      )}
      {onRetry && (
        <button
          type="button"
          data-error-retry
          onClick={onRetry}
          style={{
            marginTop: 4,
            alignSelf: isFull ? "center" : "flex-start",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            padding: "5px 12px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--border-color-mid)",
            background: "var(--bg-input)",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
