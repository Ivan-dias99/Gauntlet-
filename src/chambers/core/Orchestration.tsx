import { useRegistry, type RegistryBudgets } from "./registry";

// Core · Orchestration — live mirror of the four pipelines the engine
// operates today, with the budgets that keep them honest. Agent +
// Triad numbers come from /system/registry; Crew + Surface remain
// structural descriptions because they don't carry numeric budgets
// (Crew is a fixed plan, Surface is a mock contract).

interface Row {
  label: string;
  value: string;
}

function agentRows(b: RegistryBudgets["agent"]): Row[] {
  return [
    { label: "MAX_AGENT_ITERATIONS", value: `${b.max_iterations} turns` },
    { label: "MAX_TOOL_CALLS", value: `${b.max_tool_calls} per run` },
    { label: "MAX_REPEATS", value: `${b.max_repeats} (anti-loop fingerprint)` },
    { label: "AGENT_TEMPERATURE", value: String(b.temperature) },
    { label: "AGENT_WALL_CLOCK_S", value: `${b.wall_clock_s}s` },
  ];
}

function triadRows(b: RegistryBudgets["triad"]): Row[] {
  return [
    { label: "TRIAD_COUNT", value: `${b.count} parallel calls` },
    { label: "TRIAD_TEMPERATURE", value: String(b.temperature) },
    { label: "JUDGE_TEMPERATURE", value: `${b.judge_temperature} (implacable)` },
    { label: "MODEL", value: b.model },
    {
      label: "Confidence tiers",
      value: "HIGH: 3 concordam · LOW: qualquer diferença → refusal",
    },
    {
      label: "Failure memory",
      value: "Persistent · matches fingerprint · reforça caução",
    },
  ];
}

const CREW: Row[] = [
  { label: "Plan", value: "planner → (researcher) → coder → critic" },
  { label: "Refinement", value: "1 round automático se critic rejeita" },
  {
    label: "Streaming",
    value:
      "crew_start · plan · role_start/event/done · critic_verdict · done",
  },
];

const SURFACE: Row[] = [
  {
    label: "Dispatch",
    value: "Mock handler — process_surface_mock_streaming",
  },
  {
    label: "Output contract",
    value:
      "SurfacePlan { screens, components, design_system_binding, fidelity, mode, notes, mock }",
  },
  {
    label: "Run recording",
    value:
      "Registado em /runs com route=surface, termination_reason=surface_mock enquanto o mock é a fonte.",
  },
];

export default function Orchestration() {
  const reg = useRegistry();

  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Orchestration</span>
        <span className="core-page-intro-sub">
          Quatro pipelines com budgets que mantêm cada rota honesta.
          Agent / Triad lidos ao vivo de{" "}
          <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>
            /system/registry
          </code>
          .
        </span>
      </div>

      {reg.status === "loading" && (
        <div style={{ padding: "var(--space-3)", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="status-dot" data-tone="info" data-pulse="true" />
          <span className="kicker" data-tone="ghost">a ler do backend…</span>
        </div>
      )}
      {reg.status === "unreachable" && (
        <span className="state-pill" data-tone="err">
          <span className="state-pill-dot" />
          backend inacessível
        </span>
      )}
      {reg.status === "error" && (
        <span className="state-pill" data-tone="err">
          <span className="state-pill-dot" />
          {reg.message}
        </span>
      )}
      {reg.status === "ready" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          <Panel title="Agent loop" sub="Terminal" rows={agentRows(reg.data.budgets.agent)} />
          <Panel
            title="Self-consistency triad"
            sub="Insight · Archive · Core"
            rows={triadRows(reg.data.budgets.triad)}
          />
          <Panel title="Crew pipeline" sub="Terminal opt-in" rows={CREW} />
          <Panel title="Surface (mock)" sub="Design workstation" rows={SURFACE} />
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  sub,
  rows,
}: {
  title: string;
  sub: string;
  rows: Row[];
}) {
  return (
    <section className="panel" data-rank="primary">
      <div className="panel-head">
        <span className="panel-title">{title}</span>
        <span className="panel-sub">{sub}</span>
      </div>
      <div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="diagnostic-row"
            style={{ borderBottom: i === rows.length - 1 ? 0 : undefined }}
          >
            <span className="diagnostic-row-key">{r.label}</span>
            <span className="diagnostic-row-value">{r.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
