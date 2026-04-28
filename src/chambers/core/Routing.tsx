import { useRegistry, type RegistryChamber } from "./registry";

// Core · Routing — live mirror of signal-backend/chambers/profiles.py via
// GET /system/registry. The router uses chamber.dispatch when query.chamber
// is present; falls back to is_dev_intent otherwise.

const DISPATCH_TONE: Record<string, "info" | "warn" | "accent" | "muted"> = {
  triad: "accent",
  agent: "warn",
  surface_mock: "info",
};

const CHAMBER_LABEL: Record<RegistryChamber["key"], string> = {
  insight: "Insight",
  surface: "Surface",
  terminal: "Terminal",
  archive: "Archive",
  core: "Core",
};

const CHAMBER_PURPOSE: Record<RegistryChamber["key"], string> = {
  insight:
    "Self-consistency triad + judge. Pressão de evidência, recusa sobre fabrico.",
  surface:
    "Design workstation. Plano estruturado (mock) valida o contrato SurfacePlan.",
  terminal: "Agent loop + tool use. Código, execução, patches.",
  archive: "Retrieval conservador. Summaries não inventam.",
  core: "Governance. Respostas sobre regras caem na triad.",
};

export default function Routing() {
  const reg = useRegistry();

  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Routing</span>
        <span className="core-page-intro-sub">
          Perfis de chamber lidos ao vivo de <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>/system/registry</code>.
          O router decide por chamber.dispatch quando query.chamber está
          presente; cai em is_dev_intent quando ausente.
        </span>
      </div>
      <section className="panel" data-rank="primary">
        <div className="panel-head">
          <span className="panel-title">Chamber profiles</span>
          <span className="panel-sub">Dispatch · Temperatura · Allowlist</span>
        </div>
        {reg.status === "loading" && (
          <div style={{ padding: "var(--space-3) 0", display: "flex", alignItems: "center", gap: 8 }}>
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
          <div>
            {reg.data.chambers.map((c) => (
              <div
                key={c.key}
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
                    {CHAMBER_LABEL[c.key] ?? c.key}
                  </span>
                  <span className="kicker" data-tone="ghost">{c.key}</span>
                </div>
                <span
                  className="state-pill"
                  data-tone={DISPATCH_TONE[c.dispatch] ?? "muted"}
                >
                  <span className="state-pill-dot" />
                  {c.dispatch}
                </span>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "var(--t-body-sec)",
                    color: "var(--text-secondary)",
                    lineHeight: "var(--lh-body-sec)",
                  }}
                >
                  {CHAMBER_PURPOSE[c.key]}
                  <div
                    style={{
                      marginTop: 4,
                      color: "var(--text-ghost)",
                      fontSize: "var(--t-meta)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {c.temperature !== null && (
                      <>T° {c.temperature} · </>
                    )}
                    {c.allowed_tools === null
                      ? "all tools"
                      : c.allowed_tools.length === 0
                      ? "0 tools"
                      : `${c.allowed_tools.length} tool${c.allowed_tools.length === 1 ? "" : "s"}: ${c.allowed_tools.join(", ")}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
