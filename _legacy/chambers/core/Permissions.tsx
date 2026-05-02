// Core · Permissions — read-only view over the tool allowlist and the
// code-execution gate. Mirrors signal-backend/tools.py. Each tool lives
// on a shared .panel card so the permissions register reads with the
// same composition grammar as Routing / Orchestration / System.

interface ToolEntry {
  name: string;
  kind: "filesystem" | "command" | "vcs" | "network";
  gated: boolean;
  note: string;
}

const TOOLS: ToolEntry[] = [
  { name: "read_file",       kind: "filesystem", gated: false,
    note: "Rooted at TOOL_WORKSPACE_ROOT. Symlink/traversal blocked." },
  { name: "list_directory",  kind: "filesystem", gated: false,
    note: "Rooted; same workspace boundary as read_file." },
  { name: "run_command",     kind: "command",    gated: true,
    note: "Deny-by-default. SAFE set (read-only) livre; GATED set (pip, npm, node…) requer AGENT_ALLOW_CODE_EXEC=true." },
  { name: "execute_python",  kind: "command",    gated: true,
    note: "Requer AGENT_ALLOW_CODE_EXEC=true. Workspace rooted." },
  { name: "git",             kind: "vcs",        gated: false,
    note: "Config / exec-path / upload-pack / receive-pack / worktree / pager hard-blocked." },
  { name: "web_fetch",       kind: "network",    gated: false,
    note: "Re-valida cada redirect hop. IPs privados / reservados / loopback / metadata bloqueados (SSRF defence)." },
  { name: "web_search",      kind: "network",    gated: false,
    note: "External search API." },
];

const KIND_TONE: Record<ToolEntry["kind"], "info" | "warn" | "accent" | "ok"> = {
  filesystem: "info",
  command:    "warn",
  vcs:        "accent",
  network:    "ok",
};

export default function Permissions() {
  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Permissions</span>
        <span className="core-page-intro-sub">
          Deny-by-default. A coluna gated marca tools que só se activam com{" "}
          <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>
            AGENT_ALLOW_CODE_EXEC=true
          </code>
          . Cada chamber tem allowlist própria — Insight e Core sem tools,
          Terminal completo, Surface só o handler mock, Archive subset de retrieval.
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {TOOLS.map((t) => (
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
                data-tone={KIND_TONE[t.kind]}
                style={{ marginLeft: "auto" }}
              >
                {t.kind}
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
              {t.note}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
