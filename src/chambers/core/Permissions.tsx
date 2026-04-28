import { useRegistry } from "./registry";

// Core · Permissions — live mirror of the tool registry via GET
// /system/registry. Each tool surfaces name, description, and the
// gated flag; tone is derived from a small name→kind lookup so the
// visual classification doesn't drift when a new tool is added
// (it lands in the "other" tone until the lookup catches up).

type Kind = "filesystem" | "command" | "vcs" | "network" | "other";

const KIND_BY_NAME: Record<string, Kind> = {
  read_file: "filesystem",
  list_directory: "filesystem",
  run_command: "command",
  execute_python: "command",
  git: "vcs",
  fetch_url: "network",
  web_search: "network",
  package_info: "network",
};

const KIND_TONE: Record<Kind, "info" | "warn" | "accent" | "ok" | "muted"> = {
  filesystem: "info",
  command: "warn",
  vcs: "accent",
  network: "ok",
  other: "muted",
};

export default function Permissions() {
  const reg = useRegistry();

  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Permissions</span>
        <span className="core-page-intro-sub">
          Deny-by-default. Tools com a etiqueta gated só se activam com{" "}
          <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>
            SIGNAL_ALLOW_CODE_EXEC=true
          </code>
          . Cada chamber tem allowlist própria — Insight e Core sem tools,
          Terminal completo, Surface só o handler mock, Archive subset de retrieval.
          Lido ao vivo de <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>/system/registry</code>.
        </span>
      </div>

      {reg.status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--space-3)" }}>
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {reg.data.tools.map((t) => {
            const kind = KIND_BY_NAME[t.name] ?? "other";
            return (
              <section key={t.name} className="panel" data-rank="primary">
                <div className="panel-head">
                  <code
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-body)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.name}
                  </code>
                  <span
                    className="kicker"
                    data-tone={KIND_TONE[kind]}
                    style={{ marginLeft: "auto" }}
                  >
                    {kind}
                  </span>
                  {t.gated && (
                    <span data-gated className="state-pill" data-tone="warn">
                      <span className="state-pill-dot" />
                      gated
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "var(--t-body-sec)",
                    color: "var(--text-muted)",
                    lineHeight: "var(--lh-body-sec)",
                  }}
                >
                  {t.description}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
