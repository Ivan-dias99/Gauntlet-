import type { SurfaceBriefPayload, SurfacePlanPayload } from "../../hooks/useSignal";

// Surface right rail — Visual Contract Engine.
//
// Six-stage workstation progression that replaces the old canned gallery:
//
//   1. Brief       — operator declares intent in the brief textarea
//   2. Contract    — the checklist that gates generation
//   3. Plan        — structured plan envelope returned by Sonnet
//   4. Artboard    — screens-as-cards canvas
//   5. Components  — component inventory by screen
//   6. Seal        — explicit acceptance turning the plan into an artifact
//
// Each stage renders only what it can prove from real state. No
// placeholder content. The mock badge stays honest when the backend
// returned a SIGNAL_MOCK=1 plan.

export type SurfaceStageKey =
  | "brief"
  | "contract"
  | "plan"
  | "artboard"
  | "components"
  | "seal";

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  brief: SurfaceBriefPayload;
  hasIntent: boolean;
  pending: boolean;
  sealed: boolean;
  onSeal?: () => void;
}

interface StageMeta {
  key: SurfaceStageKey;
  label: string;
  hint: string;
}

const STAGES: StageMeta[] = [
  { key: "brief",      label: "1 · Brief",      hint: "intenção escrita à esquerda" },
  { key: "contract",   label: "2 · Contract",   hint: "linhas vinculantes do brief" },
  { key: "plan",       label: "3 · Plan",       hint: "envelope estruturado do gerador" },
  { key: "artboard",   label: "4 · Artboard",   hint: "telas como cartões" },
  { key: "components", label: "5 · Components", hint: "inventário por tela" },
  { key: "seal",       label: "6 · Seal",       hint: "aceitar e gravar artifact" },
];

function contractItems(brief: SurfaceBriefPayload, hasIntent: boolean) {
  const dsHasLabel =
    brief.design_system === "custom"
      ? !!(brief.design_system_label && brief.design_system_label.trim())
      : true;
  return [
    { label: "intent · brief escrito",                       satisfied: hasIntent },
    { label: "output · prototype / deck / template / other", satisfied: !!brief.mode },
    { label: "fidelity · wireframe / hi-fi",                 satisfied: !!brief.fidelity },
    {
      label:
        brief.design_system === "none_declared"
          ? "design system · 'sem DS' declarado"
          : brief.design_system === "custom"
            ? "design system · custom + label"
            : "design system · Signal Canon",
      satisfied: dsHasLabel,
    },
  ];
}

function activeStage(props: Props): SurfaceStageKey {
  if (props.sealed) return "seal";
  if (props.plan) {
    if (props.plan.components.length > 0) return "components";
    return "artboard";
  }
  if (props.pending) return "plan";
  const items = contractItems(props.brief, props.hasIntent);
  if (items.every((i) => i.satisfied)) return "contract";
  if (props.hasIntent) return "contract";
  return "brief";
}

function stageReached(stage: SurfaceStageKey, current: SurfaceStageKey): boolean {
  const order = STAGES.map((s) => s.key);
  return order.indexOf(stage) <= order.indexOf(current);
}

export default function ExplorationRail(props: Props) {
  const current = activeStage(props);

  return (
    <div
      data-surface-rail
      data-stage={current}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        overflow: "hidden",
      }}
    >
      <StageRail current={current} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {current === "brief"      && <BriefStage hasIntent={props.hasIntent} />}
        {current === "contract"   && <ContractStage brief={props.brief} hasIntent={props.hasIntent} />}
        {current === "plan"       && <PlanStage pending={props.pending} />}
        {current === "artboard"   && props.plan && <ArtboardStage plan={props.plan} mock={props.mock} />}
        {current === "components" && props.plan && (
          <ComponentsStage plan={props.plan} mock={props.mock} canSeal={!props.sealed} onSeal={props.onSeal} />
        )}
        {current === "seal"       && props.plan && <SealStage plan={props.plan} mock={props.mock} />}
      </div>
    </div>
  );
}

// ── Stage rail (header) ─────────────────────────────────────────────────────

function StageRail({ current }: { current: SurfaceStageKey }) {
  return (
    <div
      role="tablist"
      aria-label="Visual Contract Engine"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`,
        borderBottom: "var(--border-soft)",
        background: "var(--bg-elevated)",
      }}
    >
      {STAGES.map((s) => {
        const isCurrent = s.key === current;
        const isPast = stageReached(s.key, current) && !isCurrent;
        return (
          <div
            key={s.key}
            role="tab"
            aria-selected={isCurrent}
            data-active={isCurrent ? "true" : undefined}
            data-past={isPast ? "true" : undefined}
            style={{
              padding: "10px 8px",
              borderRight: "1px solid var(--border-color-soft)",
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: isCurrent
                ? "var(--accent)"
                : isPast
                  ? "var(--text-secondary)"
                  : "var(--text-ghost)",
              borderBottom: isCurrent
                ? "2px solid var(--accent)"
                : "2px solid transparent",
              textAlign: "center",
              lineHeight: 1.3,
            }}
            title={s.hint}
          >
            <span aria-hidden style={{ marginRight: 6 }}>
              {isPast ? "✓" : isCurrent ? "●" : "○"}
            </span>
            {s.label}
          </div>
        );
      })}
    </div>
  );
}

// ── Stage bodies ────────────────────────────────────────────────────────────

function StageHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        — {kicker}
      </span>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 18,
          lineHeight: 1.4,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </span>
    </div>
  );
}

function MockBadge({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
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
  );
}

function BriefStage({ hasIntent }: { hasIntent: boolean }) {
  return (
    <>
      <StageHeader
        kicker="Brief"
        title={
          hasIntent
            ? "Intenção em construção. Continua a escrever ou avança o contrato."
            : "Forma a intenção. À esquerda, escreve o brief — quem usa, o que tem de fazer, restrições."
        }
      />
      <p
        style={{
          margin: 0,
          color: "var(--text-muted)",
          fontSize: "var(--t-body-sec)",
          lineHeight: 1.55,
        }}
      >
        Esta câmara é uma estação de contrato visual. Não há galeria. Cada
        envio gera uma estrutura validada — ou recusa-se a gerar.
      </p>
    </>
  );
}

function ContractStage({
  brief, hasIntent,
}: {
  brief: SurfaceBriefPayload;
  hasIntent: boolean;
}) {
  const items = contractItems(brief, hasIntent);
  const allSatisfied = items.every((i) => i.satisfied);
  return (
    <>
      <StageHeader
        kicker="Contract"
        title={
          allSatisfied
            ? "Contrato fechado. Submete para gerar o plano."
            : "Forma o contrato. Cada linha por marcar mantém o brief bloqueado."
        }
      />
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
    </>
  );
}

function PlanStage({ pending }: { pending: boolean }) {
  return (
    <>
      <StageHeader
        kicker="Plan"
        title={
          pending
            ? "Sonnet 4.6 a estruturar o plano. Telas e componentes serão validados antes do done."
            : "Aguarda submissão do brief para gerar o plano."
        }
      />
      <p
        style={{
          margin: 0,
          color: "var(--text-muted)",
          fontSize: "var(--t-body-sec)",
          lineHeight: 1.55,
        }}
      >
        O envelope `surface_plan` chega via SSE; o backend valida o JSON
        contra o contrato Pydantic antes de emitir o evento `done`.
      </p>
    </>
  );
}

function ArtboardStage({ plan, mock }: { plan: SurfacePlanPayload; mock: boolean }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StageHeader
          kicker="Artboard"
          title={`${plan.screens.length} ${plan.screens.length === 1 ? "tela" : "telas"} · ${plan.mode} · ${plan.fidelity}`}
        />
        <span style={{ flex: 1 }} aria-hidden />
        <MockBadge visible={mock} />
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
          </div>
        ))}
      </div>
    </>
  );
}

function ComponentsStage({
  plan, mock, canSeal, onSeal,
}: {
  plan: SurfacePlanPayload;
  mock: boolean;
  canSeal: boolean;
  onSeal: (() => void) | undefined;
}) {
  const byScreen = new Map<string, typeof plan.components>();
  for (const c of plan.components) {
    const arr = byScreen.get(c.screen) ?? [];
    arr.push(c);
    byScreen.set(c.screen, arr);
  }
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StageHeader
          kicker="Components"
          title={`${plan.components.length} componente${plan.components.length === 1 ? "" : "s"} distribuído${plan.components.length === 1 ? "" : "s"} por ${byScreen.size} tela${byScreen.size === 1 ? "" : "s"}`}
        />
        <span style={{ flex: 1 }} aria-hidden />
        <MockBadge visible={mock} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.screens.map((s) => {
          const items = byScreen.get(s.name) ?? [];
          if (items.length === 0) return null;
          return (
            <div
              key={s.name}
              style={{
                padding: 10,
                border: "var(--border-soft)",
                borderRadius: "var(--radius-control)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-label)",
                  textTransform: "uppercase",
                  color: "var(--text-ghost)",
                  marginBottom: 6,
                }}
              >
                {s.name}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 6,
                }}
              >
                {items.map((c) => (
                  <li
                    key={`${c.screen}:${c.name}`}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-body-sec)",
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "var(--text-ghost)" }}>{c.kind}</span>
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
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
      {canSeal && onSeal && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 6,
            borderTop: "1px solid var(--border-color-soft)",
            marginTop: 4,
          }}
        >
          <button
            type="button"
            onClick={onSeal}
            className="btn-chip"
            data-variant="ok"
            title="Aceitar plano e gravar artifact na missão"
          >
            Selar plano →
          </button>
        </div>
      )}
    </>
  );
}

function SealStage({ plan, mock }: { plan: SurfacePlanPayload; mock: boolean }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StageHeader
          kicker="Seal"
          title="Plano selado · artifact gravado na missão"
        />
        <span style={{ flex: 1 }} aria-hidden />
        <MockBadge visible={mock} />
      </div>
      <div
        style={{
          padding: 12,
          border: "1px solid color-mix(in oklab, var(--cc-ok) 36%, transparent)",
          borderRadius: "var(--radius-control)",
          background: "color-mix(in oklab, var(--cc-ok) 6%, transparent)",
          fontFamily: "var(--mono)",
          fontSize: "var(--t-body-sec)",
          color: "var(--text-secondary)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div>{plan.screens.length} telas · {plan.components.length} componentes</div>
        <div style={{ color: "var(--text-muted)" }}>
          DS: {plan.design_system_binding}
          {plan.design_system_label ? ` (${plan.design_system_label})` : ""}
        </div>
        <div style={{ color: "var(--text-muted)" }}>
          Visível em Archive · Documents
        </div>
      </div>
    </>
  );
}
