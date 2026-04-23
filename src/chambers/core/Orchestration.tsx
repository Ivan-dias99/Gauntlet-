// Core · Orchestration — read-only display of the four pipelines the
// engine operates today, with the budgets that keep them honest.
// Values mirror signal-backend/agent.py and engine.py constants. Every
// panel flows through the shared .panel + .diagnostic-row primitives.

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
  { label: "Confidence tiers",   value: "HIGH (3 concordam) · LOW (qualquer diferença → refusal)" },
  { label: "Failure memory",     value: "Persistent; matches fingerprint; reforça caução" },
];

const CREW: Row[] = [
  { label: "Plan",        value: "planner → (researcher) → coder → critic" },
  { label: "Refinement",  value: "1 round automático se critic rejeita" },
  { label: "Streaming",   value: "crew_start · plan · role_start/role_event/role_done · critic_verdict · done" },
];

const SURFACE: Row[] = [
  { label: "Dispatch",         value: "Mock handler — process_surface_mock_streaming" },
  { label: "Output contract",  value: "SurfacePlan { screens, components, design_system_binding, fidelity, mode, notes, mock }" },
  { label: "Run recording",    value: "Registado em /runs com route=\"surface\", termination_reason=\"surface_mock\" enquanto o mock é a fonte." },
];

export default function Orchestration() {
  return (
    <div
      style={{
        padding: "var(--space-4)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "var(--space-3)",
        maxWidth: 1100,
      }}
    >
      <Panel title="Agent loop"              sub="Terminal"                 rows={AGENT} />
      <Panel title="Self-consistency triad"  sub="Insight · Archive · Core" rows={TRIAD} />
      <Panel title="Crew pipeline"           sub="Terminal opt-in"          rows={CREW} />
      <Panel title="Surface (mock)"          sub="Design workstation"       rows={SURFACE} />
    </div>
  );
}

function Panel({ title, sub, rows }: { title: string; sub: string; rows: Row[] }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <span className="panel-title">{title}</span>
        <span className="panel-sub">{sub}</span>
      </div>
      <div>
        {rows.map((r) => (
          <div key={r.label} className="diagnostic-row">
            <span className="diagnostic-row-key">{r.label}</span>
            <span
              className="diagnostic-row-value"
              style={{ fontFamily: "var(--sans)", lineHeight: 1.5 }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
