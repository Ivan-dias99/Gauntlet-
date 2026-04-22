// Wave-4 Orchestration tab — read-only display of the three pipelines
// the engine currently operates, with the budgets that keep them honest.
// Values mirror signal-backend/agent.py and engine.py constants. Wave 5
// lifts these into editable per-chamber profile slots.

interface Row { label: string; value: string; }

const AGENT: Row[] = [
  { label: "MAX_AGENT_ITERATIONS", value: "10 turns" },
  { label: "MAX_TOOL_CALLS",        value: "20 per run" },
  { label: "MAX_REPEATS",           value: "3 (anti-loop fingerprint)" },
  { label: "AGENT_TEMPERATURE",     value: "0.2" },
  { label: "AGENT_WALL_CLOCK_S",    value: "90s" },
];

const TRIAD: Row[] = [
  { label: "TRIAD_COUNT",            value: "3 parallel calls" },
  { label: "TRIAD_TEMPERATURE",      value: "0.15" },
  { label: "JUDGE_TEMPERATURE",      value: "0.05 (implacable)" },
  { label: "Confidence tiers",       value: "HIGH (3 concordam) · LOW (qualquer diferença → refusal)" },
  { label: "Failure memory",         value: "Persistent; matches fingerprint; reforça caução" },
];

const CREW: Row[] = [
  { label: "Plan",        value: "planner → (researcher) → coder → critic" },
  { label: "Refinement",  value: "1 round automático se critic rejeita" },
  { label: "Streaming",   value: "crew_start · plan · role_start/role_event/role_done · critic_verdict · done" },
];

const SURFACE: Row[] = [
  { label: "Wave 3 dispatch", value: "Mock handler — process_surface_mock_streaming" },
  { label: "Output contract", value: "SurfacePlan { screens, components, design_system_binding, fidelity, mode, notes, mock }" },
  { label: "Wave 5 plan",     value: "Real provider + schema validation antes de done · design_system obrigatório" },
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
      <Panel title="Agent loop" sub="Terminal · Surface (W5)" rows={AGENT} />
      <Panel title="Self-consistency triad" sub="Insight · Archive · Core" rows={TRIAD} />
      <Panel title="Crew pipeline" sub="Terminal opt-in" rows={CREW} />
      <Panel title="Surface (mock)" sub="Wave 3 scaffolding" rows={SURFACE} />
    </div>
  );
}

function Panel({ title, sub, rows }: { title: string; sub: string; rows: Row[] }) {
  return (
    <section
      style={{
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-3)",
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--text-primary)" }}>
          {title}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            marginLeft: "auto",
          }}
        >
          {sub}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 220px) 1fr",
              gap: 10,
              alignItems: "baseline",
              fontSize: "var(--t-body-sec)",
            }}
          >
            <code
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "var(--track-meta)",
                color: "var(--text-muted)",
              }}
            >
              {r.label}
            </code>
            <span style={{ color: "var(--text-primary)" }}>{r.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
