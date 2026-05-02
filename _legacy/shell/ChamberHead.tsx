import type { ReactNode } from "react";

// Shared chamber head primitive. Every chamber uses it, so the
// structural grammar (kicker · tagline · status pills · right slot ·
// optional row-2) is identical while the content stays chamber-owned.
// Internals match the inline heads that existed per-chamber pre-
// consolidation; the primitive is a pure layout shell with named slots.

interface Props {
  // Mono kicker — "— INSIGHT", "— SURFACE", etc. Includes the em-dash
  // prefix so callers can override for special cases without wrapping.
  kicker: string;
  // Tagline — the human subtitle next to the kicker. Kept optional
  // because not every chamber needs one (Core tabs carry their own).
  tagline?: string;
  // Visible when the backend is running in mock mode (canned responses).
  // Propagated from useBackendStatus().mode === "mock".
  mock?: boolean;
  // Count of doctrine principles active in this session. When > 0 we
  // surface a "sob § N" pill so the user sees that every invocation
  // in this chamber carries doctrine.
  principlesCount?: number;
  // Optional right-aligned region (status pill, mission label, timers).
  right?: ReactNode;
  // Optional second row (mission breadcrumbs, context strip extras).
  below?: ReactNode;
  // Extra nodes injected inline next to the pills before `right`. Used
  // for chamber-specific controls like Terminal's mode toggle.
  inline?: ReactNode;
}

export default function ChamberHead({
  kicker, tagline, mock, principlesCount, right, below, inline,
}: Props) {
  return (
    <div
      className="chamber-head"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span
          data-chamber-kicker
          style={{
            fontSize: "var(--t-meta)",
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
          }}
        >
          {kicker}
        </span>
        {tagline && (
          <span
            data-chamber-tagline
            style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)" }}
          >
            {tagline}
          </span>
        )}

        {mock && (
          <span
            data-backend-mode="mock"
            title="Backend em modo simulado — respostas são canned, não geração real"
            style={{
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              color: "var(--cc-warn)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: "var(--radius-pill)",
              lineHeight: 1.4,
            }}
          >
            mock
          </span>
        )}

        {principlesCount !== undefined && principlesCount > 0 && (
          <span
            data-principles-in-context
            title={`${principlesCount} princípio${principlesCount !== 1 ? "s" : ""} activo${principlesCount !== 1 ? "s" : ""} nesta câmara`}
            style={{
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              color: "var(--chamber-dna, var(--accent))",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 32%, transparent)",
              borderRadius: "var(--radius-pill)",
              lineHeight: 1.4,
            }}
          >
            {principlesCount} {principlesCount === 1 ? "princípio" : "princípios"}
          </span>
        )}

        {inline}

        {right && (
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {right}
          </span>
        )}
      </div>

      {below}
    </div>
  );
}
