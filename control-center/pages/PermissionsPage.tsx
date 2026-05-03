import { Panel, SurfaceHeader } from "./ControlLayout";
import Pill from "../components/atoms/Pill";

interface Scope {
  scope: string;
  granted: boolean;
}

interface ConnectorRow {
  connector: string;
  glyph: string;
  description: string;
  scopes: Scope[];
}

const MATRIX: ConnectorRow[] = [
  {
    connector: "anthropic",
    glyph: "▲",
    description: "Engine + agent calls (triad, judge, dev loop).",
    scopes: [{ scope: "models.invoke", granted: true }],
  },
  {
    connector: "filesystem",
    glyph: "▥",
    description: "Tool: filesystem read/write inside TOOL_WORKSPACE_ROOT.",
    scopes: [
      { scope: "fs.read", granted: true },
      { scope: "fs.write", granted: true },
    ],
  },
  {
    connector: "shell",
    glyph: "▶",
    description: "Tool: bounded run_command + execute_python.",
    scopes: [{ scope: "cmd.run", granted: true }],
  },
  {
    connector: "github",
    glyph: "◆",
    description: "Connector for repo browsing + PR ops (post-V0).",
    scopes: [
      { scope: "repo.read", granted: false },
      { scope: "repo.write", granted: false },
      { scope: "pulls.create", granted: false },
    ],
  },
];

export default function PermissionsPage() {
  const totalScopes = MATRIX.reduce((acc, r) => acc + r.scopes.length, 0);
  const grantedScopes = MATRIX.reduce(
    (acc, r) => acc + r.scopes.filter((s) => s.granted).length,
    0,
  );

  return (
    <>
      <SurfaceHeader
        eyebrow="Permissions"
        title="Connector × scope matrix"
        subtitle="Read-only in V0 — mutation lands when /permissions/* ships and OAuth is wired."
      />

      {/* Hero summary */}
      <section
        className="gx-card"
        data-tone="hero"
        style={{
          marginBottom: 18,
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 auto", minWidth: 240 }}>
          <span className="gx-eyebrow">surface · authorisation</span>
          <h2
            style={{
              margin: "8px 0 6px",
              fontFamily: "var(--serif)",
              fontWeight: 400,
              fontSize: 22,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
            }}
          >
            {grantedScopes} of {totalScopes} scopes wired
          </h2>
          <p
            style={{
              margin: 0,
              color: "var(--text-secondary)",
              fontSize: 13,
              lineHeight: 1.55,
              maxWidth: 560,
            }}
          >
            Anthropic + filesystem + shell are live by default — they back the agent loop's tool
            registry. GitHub stays declined until OAuth ships.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <SummaryStat label="connectors" value={String(MATRIX.length)} />
          <SummaryStat
            label="granted"
            value={String(grantedScopes)}
            tone="ok"
          />
          <SummaryStat
            label="declined"
            value={String(totalScopes - grantedScopes)}
            tone="warn"
          />
        </div>
      </section>

      {/* Connector tiles */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {MATRIX.map((row) => (
          <ConnectorTile key={row.connector} row={row} />
        ))}
      </section>

      <Panel title="V0 disclosure" hint="why this is read-only">
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          The composer routes (
          <code
            style={{
              fontFamily: "var(--mono)",
              background: "var(--bg-elevated)",
              border: "var(--border-soft)",
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            /composer/*
          </code>
          ) and the tool runtime currently consult the backend's static config. Per-operator scope
          mutation lands later along with the OAuth flow for GitHub. The Gauntlet smoke flow does
          not depend on writable permissions.
        </p>
      </Panel>
    </>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn";
}) {
  const accent =
    tone === "ok"
      ? "var(--cc-ok)"
      : tone === "warn"
      ? "var(--cc-warn)"
      : "var(--text-primary)";
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        textAlign: "center",
        minWidth: 86,
      }}
    >
      <div
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 400,
          fontSize: 22,
          color: accent,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ConnectorTile({ row }: { row: ConnectorRow }) {
  const allGranted = row.scopes.every((s) => s.granted);
  const someGranted = row.scopes.some((s) => s.granted);
  const state = allGranted ? "granted" : someGranted ? "partial" : "declined";

  return (
    <div className="gx-tile" data-state={state === "declined" ? "declined" : state === "granted" ? "granted" : undefined}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 8,
              background: state === "granted"
                ? "color-mix(in oklab, var(--cc-ok) 14%, transparent)"
                : "var(--bg-elevated)",
              border: state === "granted"
                ? "1px solid color-mix(in oklab, var(--cc-ok) 30%, transparent)"
                : "var(--border-soft)",
              color: state === "granted" ? "var(--cc-ok)" : "var(--text-secondary)",
              fontFamily: "var(--mono)",
              fontSize: 14,
            }}
          >
            {row.glyph}
          </span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "var(--track-meta)",
              color: "var(--text-primary)",
              textTransform: "uppercase",
            }}
          >
            {row.connector}
          </span>
        </div>
        {state === "granted" && <Pill tone="ok">live</Pill>}
        {state === "partial" && <Pill tone="warn">partial</Pill>}
        {state === "declined" && <Pill tone="ghost">declined</Pill>}
      </header>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {row.description}
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginTop: 4,
        }}
      >
        {row.scopes.map((s) => (
          <li
            key={s.scope}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "5px 8px",
              background: "var(--bg-elevated)",
              borderRadius: 6,
              fontFamily: "var(--mono)",
              fontSize: 11,
              border: "var(--border-soft)",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>{s.scope}</span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                color: s.granted ? "var(--cc-ok)" : "var(--text-muted)",
              }}
            >
              {s.granted ? "granted" : "declined"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
