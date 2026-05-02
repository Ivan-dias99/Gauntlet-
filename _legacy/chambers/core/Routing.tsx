// Core · Routing — read-only mirror of signal-backend/chambers/profiles.py.
// Migrated to the shared .panel primitive so the table reads as a
// structured document rather than a raw grid.

const PROFILES: Array<{
  key: string;
  label: string;
  dispatch: string;
  purpose: string;
  note?: string;
}> = [
  { key: "insight",  label: "Insight",  dispatch: "triad",
    purpose: "Self-consistency triad + judge. Pressão de evidência, recusa sobre fabrico." },
  { key: "surface",  label: "Surface",  dispatch: "mock",
    purpose: "Design workstation. Plano estruturado (mock) valida o contrato SurfacePlan.",
    note: "Quando o provider real estiver ligado, o mesmo contrato é validado server-side e design_system passa a obrigatório." },
  { key: "terminal", label: "Terminal", dispatch: "agent",
    purpose: "Agent loop + tool use. Código, execução, patches." },
  { key: "archive",  label: "Archive",  dispatch: "triad",
    purpose: "Retrieval conservador. Summaries não inventam." },
  { key: "core",     label: "Core",     dispatch: "triad",
    purpose: "Governance. Respostas sobre regras caem na triad." },
];

const DISPATCH_TONE: Record<string, "info" | "warn" | "accent" | "muted"> = {
  triad: "accent",
  agent: "warn",
  mock: "info",
};

export default function Routing() {
  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Routing</span>
        <span className="core-page-intro-sub">
          Perfis de chamber. O router decide por chamber.dispatch quando
          query.chamber está presente; cai em is_dev_intent quando ausente.
        </span>
      </div>
      <section className="panel" data-rank="primary">
        <div className="panel-head">
          <span className="panel-title">Chamber profiles</span>
          <span className="panel-sub">Dispatch</span>
        </div>
        <div>
          {PROFILES.map((p) => (
            <div
              key={p.key}
              className="diagnostic-row"
              style={{
                gridTemplateColumns: "minmax(120px, 140px) minmax(90px, 110px) 1fr",
                padding: "var(--space-2) 0",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "var(--t-body)",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {p.label}
                </span>
                <span className="kicker" data-tone="ghost">{p.key}</span>
              </div>
              <span
                className="state-pill"
                data-tone={DISPATCH_TONE[p.dispatch] ?? "muted"}
              >
                <span className="state-pill-dot" />
                {p.dispatch}
              </span>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-secondary)",
                  lineHeight: "var(--lh-body-sec)",
                }}
              >
                {p.purpose}
                {p.note && (
                  <div
                    style={{
                      marginTop: 4,
                      color: "var(--text-ghost)",
                      fontSize: "var(--t-meta)",
                      fontStyle: "italic",
                    }}
                  >
                    {p.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
