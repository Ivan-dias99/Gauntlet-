import EmptyState from "../shell/EmptyState";

// Wave-2 Surface stub — chamber slot is visible in the ribbon but the
// real composition (split layout, creation panel, exploration rail,
// mode / fidelity / design-system selectors, examples / templates /
// recent / search) arrives in Wave 3 with the mock-first backend.
//
// This is deliberately a low-chrome EmptyState instead of mocked-up UI,
// so the chamber cannot be mistaken for finished work. No pretend
// generators, no placeholder galleries.

export default function SurfaceStub() {
  return (
    <div className="chamber-shell" data-chamber="surface">
      <div className="chamber-head" style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
          }}
        >
          — SURFACE
        </span>
        <span
          style={{
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
          }}
        >
          Design workstation
        </span>
        <span
          data-wave="3"
          style={{
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            color: "var(--accent-dim)",
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            padding: "2px 8px",
            border: "1px solid color-mix(in oklab, var(--accent) 24%, transparent)",
            borderRadius: "var(--radius-pill)",
            lineHeight: 1.4,
          }}
        >
          wave 3
        </span>
      </div>

      <div className="chamber-body">
        <EmptyState
          glyph="◐"
          kicker="— Em construção"
          body="Surface será um workstation de design, não uma aba de chat de design."
          hint="Wave 3 entrega o shell real (painel de criação, rail de exploração, modo, fidelidade, design system) com backend mock."
          style={{ marginTop: "12vh" }}
        />
      </div>
    </div>
  );
}
