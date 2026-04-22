// Wave-4 Permissions tab — read-only view over the tool allowlist and
// the code-execution gate. Mirrors ruberra-backend/tools.py. Wave 5
// splits per-chamber allowlists (insight=none, terminal=all, surface=
// mock-only, archive=retrieval-subset, core=none).

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

const KIND_TINT: Record<ToolEntry["kind"], string> = {
  filesystem: "var(--cc-info)",
  command:    "var(--cc-warn)",
  vcs:        "var(--accent)",
  network:    "var(--terminal-ok)",
};

export default function Permissions() {
  return (
    <div
      style={{
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        maxWidth: 900,
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
        — Tool allowlist
      </div>
      <div
        style={{
          fontSize: "var(--t-body-sec)",
          color: "var(--text-muted)",
          lineHeight: "var(--lh-body)",
        }}
      >
        Postura deny-by-default. A gated coluna marca tools que só se activam
        com <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>
          AGENT_ALLOW_CODE_EXEC=true
        </code> no ambiente do backend. Em Wave 5 cada chamber recebe a sua
        allowlist: Insight e Core zero tools; Terminal o conjunto completo;
        Surface apenas o handler mock; Archive um subset de retrieval.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {TOOLS.map((t) => (
          <div
            key={t.name}
            style={{
              border: "var(--border-soft)",
              borderRadius: "var(--radius-control)",
              padding: "var(--space-3)",
              background: "var(--bg-surface)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <code
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--text-primary)",
                }}
              >
                {t.name}
              </code>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  color: KIND_TINT[t.kind],
                  marginLeft: "auto",
                }}
              >
                {t.kind}
              </span>
              {t.gated && (
                <span
                  data-gated
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "var(--track-meta)",
                    textTransform: "uppercase",
                    color: "var(--cc-warn)",
                    padding: "1px 6px",
                    border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
                    borderRadius: 999,
                  }}
                >
                  gated
                </span>
              )}
            </div>
            <div style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)", lineHeight: "var(--lh-body)" }}>
              {t.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
