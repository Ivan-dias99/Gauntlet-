import type { SurfacePlanPayload } from "../../hooks/useSignal";

// Surface output contract — plan preview.
// The right pane of the Surface chamber exists to show the plan the
// backend returned for the current brief. No fake gallery, no
// federated search, no design-system manager. If there is no plan yet
// we show an honest empty state that explains what the left pane has
// to do first.

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  pending: boolean;
}

export default function PlanPreviewPane({ plan, mock, pending }: Props) {
  return (
    <div
      data-surface-region-pane="plan-preview"
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
      {plan ? (
        <PlanPreview plan={plan} mock={mock} />
      ) : (
        <EmptyPlanState pending={pending} />
      )}
    </div>
  );
}

function PlanPreview({ plan, mock }: { plan: SurfacePlanPayload; mock: boolean }) {
  return (
    <div
      data-surface-plan-preview
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
          — Plano gerado
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
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
        }}
      >
        {plan.screens.map((s) => (
          <div
            key={s.name}
            style={{
              padding: 10,
              border: "var(--border-soft)",
              borderRadius: "var(--radius-control)",
              background: "var(--bg-surface)",
            }}
          >
            <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)" }}>
              {s.name}
            </div>
            <div style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)", marginTop: 4 }}>
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

function EmptyPlanState({ pending }: { pending: boolean }) {
  const title = pending ? "a gerar plano…" : "sem plano ainda";
  const body = pending
    ? "O backend está a responder ao brief. O plano aparece aqui assim que chegar."
    : "Escreve o brief à esquerda e carrega em Gerar plano. O plano gerado aparece aqui — ecrãs, componentes, notas.";
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          textAlign: "center",
          color: "var(--text-muted)",
          maxWidth: 360,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          — {title}
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "var(--t-body)", lineHeight: 1.45 }}>
          {body}
        </div>
      </div>
    </div>
  );
}
