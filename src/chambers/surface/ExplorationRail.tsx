import type { SurfaceBriefPayload, SurfacePlanPayload } from "../../hooks/useSignal";

// Surface right rail. The previous canned gallery (Examples / Templates /
// Recent / Search / Library) was deleted — Surface is a workstation, not
// a placeholder catalog. The rail now carries one of two states:
//
//   1. No plan generated yet → a Visual Contract checklist that mirrors
//      the brief on the left, so the user sees what is satisfied and
//      what still blocks generation.
//   2. A plan exists → the structured plan preview (screens, components,
//      notes), with an explicit mock badge when applicable.
//
// Library / catalog can return as a future opt-in surface, but never as
// the default rail.

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  brief: SurfaceBriefPayload;
  hasIntent: boolean;
}

export default function ExplorationRail({ plan, mock, brief, hasIntent }: Props) {
  if (plan) {
    return <PlanPreview plan={plan} mock={mock} />;
  }
  return <ContractChecklist brief={brief} hasIntent={hasIntent} />;
}

// ── Empty state — Visual Contract checklist ────────────────────────────────

function ContractChecklist({
  brief, hasIntent,
}: {
  brief: SurfaceBriefPayload;
  hasIntent: boolean;
}) {
  const designSystemSet = brief.design_system !== "none_declared" || true; // explicit decision counts
  const designSystemHasLabel =
    brief.design_system === "custom"
      ? !!(brief.design_system_label && brief.design_system_label.trim())
      : true;

  const items: Array<{ label: string; satisfied: boolean }> = [
    { label: "intent · brief escrito", satisfied: hasIntent },
    { label: "output · prototype / deck / template / other", satisfied: !!brief.mode },
    { label: "fidelity · wireframe / hi-fi", satisfied: !!brief.fidelity },
    {
      label:
        brief.design_system === "none_declared"
          ? "design system · 'sem DS' declarado"
          : brief.design_system === "custom"
            ? "design system · custom + label"
            : "design system · Signal Canon",
      satisfied: designSystemSet && designSystemHasLabel,
    },
  ];

  const allSatisfied = items.every((i) => i.satisfied);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "var(--space-4)",
        height: "100%",
        minHeight: 0,
        overflow: "auto",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
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
        — Visual Contract {allSatisfied ? "ready" : "blocked"}
      </div>
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: 18,
          lineHeight: 1.4,
          color: "var(--text-primary)",
        }}
      >
        {allSatisfied
          ? "Contrato fechado. Submete o brief para gerar o plano."
          : "Forma o contrato à esquerda. Cada linha por marcar mantém o brief bloqueado."}
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {items.map((it) => (
          <li
            key={it.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body-sec)",
              color: it.satisfied ? "var(--text-secondary)" : "var(--text-muted)",
              opacity: it.satisfied ? 1 : 0.7,
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: 3,
                border: it.satisfied
                  ? "1px solid color-mix(in oklab, var(--cc-ok) 60%, transparent)"
                  : "1px solid var(--border-mid)",
                color: "var(--cc-ok)",
                fontSize: 11,
                lineHeight: 1,
              }}
            >
              {it.satisfied ? "✓" : ""}
            </span>
            <span>{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Generated state — plan preview ──────────────────────────────────────────

function PlanPreview({
  plan, mock,
}: {
  plan: SurfacePlanPayload;
  mock: boolean;
}) {
  return (
    <div
      data-surface-plan-preview
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "var(--space-4)",
        height: "100%",
        minHeight: 0,
        overflow: "auto",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
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
          {plan.mode} · {plan.fidelity} · {plan.design_system_binding}
          {plan.design_system_label ? ` (${plan.design_system_label})` : ""}
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
              padding: 10,
              border: "var(--border-soft)",
              borderRadius: "var(--radius-control)",
              background: "var(--bg-elevated)",
            }}
          >
            <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)" }}>
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
