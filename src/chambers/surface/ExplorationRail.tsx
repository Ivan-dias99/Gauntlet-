import type { SurfacePlanPayload } from "../../hooks/useSignal";

// Surface right-pane — plan canvas / contract hero.
//
// Two states only, by design:
//   1. No plan yet → calm hero waiting for the brief to be generated.
//   2. Plan present → contract canvas (screens · components · notes).
//
// The earlier exploration tabs (Examples / Templates / Recent / Search /
// Library) were demoted: they pulled noise into a region whose job is to
// render the plan, not to compete with the left creation panel. The
// two-split discipline of the canon screenshot is the contract here.

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
}

export default function ExplorationRail({ plan, mock }: Props) {
  return (
    <div
      data-surface-region="canvas"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {plan ? <PlanCanvas plan={plan} mock={mock} /> : <HeroEmpty />}
    </div>
  );
}

function HeroEmpty() {
  return (
    <div
      data-surface-hero="empty"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "var(--space-5, 32px)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        — sem contrato visual
      </span>
      <p
        style={{
          margin: 0,
          maxWidth: 520,
          fontFamily: "var(--serif)",
          fontSize: "var(--t-body)",
          lineHeight: 1.5,
          color: "var(--text-muted)",
        }}
      >
        Define intenção, fidelidade e design system, depois gera o contrato
        visual. O plano aparece aqui — ecrãs, componentes, notas.
      </p>
    </div>
  );
}

function PlanCanvas({ plan, mock }: { plan: SurfacePlanPayload; mock: boolean }) {
  return (
    <div
      data-surface-plan-canvas
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "var(--space-3)",
        overflow: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          — contrato visual
        </span>
        {mock && (
          <span
            data-mock-badge
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--cc-warn)",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: 999,
            }}
          >
            mock
          </span>
        )}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-muted)",
          }}
        >
          {plan.mode} · {plan.fidelity} · {plan.design_system_binding ?? "sem DS"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {plan.screens.map((s) => (
          <div
            key={s.name}
            style={{
              padding: 12,
              border: "var(--border-soft)",
              borderRadius: "var(--radius-control)",
              background: "var(--bg-elevated)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontSize: 16,
                color: "var(--text-primary)",
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                fontSize: "var(--t-body-sec)",
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              {s.purpose}
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text-ghost)",
                marginTop: 6,
              }}
            >
              {plan.components.filter((c) => c.screen === s.name).length} componentes
            </div>
          </div>
        ))}
      </div>

      {plan.notes.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            color: "var(--text-muted)",
            fontSize: "var(--t-body-sec)",
          }}
        >
          {plan.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
