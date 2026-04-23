// Core · Orchestration — read-only display of the four pipelines the
// engine operates today, with the budgets that keep them honest.
// Built on the shared .core-page frame + primary-rank panels so the
// tab reads with the same composition discipline as Routing /
// Permissions / System / Policies. Long mono labels (e.g.
// MAX_AGENT_ITERATIONS) sit in a dedicated wider key column so they
// never wrap across lines.

interface Row { label: string; value: string; }

const AGENT: Row[] = [
  { label: "MAX_AGENT_ITERATIONS", value: "10 turns" },
  { label: "MAX_TOOL_CALLS",       value: "20 per run" },
  { label: "MAX_REPEATS",          value: "3 (anti-loop fingerprint)" },
  { label: "AGENT_TEMPERATURE",    value: "0.2" },
  { label: "AGENT_WALL_CLOCK_S",   value: "90s" },
];

const TRIAD: Row[] = [
  { label: "TRIAD_COUNT",        value: "3 parallel calls" },
  { label: "TRIAD_TEMPERATURE",  value: "0.15" },
  { label: "JUDGE_TEMPERATURE",  value: "0.05 (implacable)" },
  { label: "Confidence tiers",   value: "HIGH: 3 concordam · LOW: qualquer diferença → refusal" },
  { label: "Failure memory",     value: "Persistent · matches fingerprint · reforça caução" },
];

const CREW: Row[] = [
  { label: "Plan",        value: "planner → (researcher) → coder → critic" },
  { label: "Refinement",  value: "1 round automático se critic rejeita" },
  { label: "Streaming",   value: "crew_start · plan · role_start/event/done · critic_verdict · done" },
];

const SURFACE: Row[] = [
  { label: "Dispatch",        value: "Mock handler — process_surface_mock_streaming" },
  { label: "Output contract", value: "SurfacePlan { screens, components, design_system_binding, fidelity, mode, notes, mock }" },
  { label: "Run recording",   value: "Registado em /runs com route=surface, termination_reason=surface_mock enquanto o mock é a fonte." },
];

export default function Orchestration() {
  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Orchestration</span>
        <span className="core-page-intro-sub">
          Quatro pipelines com budgets que mantêm cada rota honesta.
          Valores espelham o backend — agent.py e engine.py.
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <Panel title="Agent loop"              sub="Terminal"                 rows={AGENT} />
        <Panel title="Self-consistency triad"  sub="Insight · Archive · Core" rows={TRIAD} />
        <Panel title="Crew pipeline"           sub="Terminal opt-in"          rows={CREW} />
        <Panel title="Surface (mock)"          sub="Design workstation"       rows={SURFACE} />
      </div>
    </div>
  );
}

function Panel({ title, sub, rows }: { title: string; sub: string; rows: Row[] }) {
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
