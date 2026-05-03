import { Panel, SurfaceHeader } from "../composer/shell/StudioPrimitives";
import Pill from "../components/atoms/Pill";

// V0 read-only matrix of declared connector scopes. Mutating permissions
// requires a backend write surface (POST /permissions or similar) that
// signal-backend doesn't yet expose — the actual enforcement lives in
// the per-tool / per-connector handlers. Wave 1 lands the writable
// matrix once /permissions/{set,get} is shipped on the backend.

interface Scope {
  scope: string;
  granted: boolean;
}

interface ConnectorRow {
  connector: string;
  description: string;
  scopes: Scope[];
}

const MATRIX: ConnectorRow[] = [
  {
    connector: "anthropic",
    description: "Engine + agent calls (triad, judge, dev loop).",
    scopes: [{ scope: "models.invoke", granted: true }],
  },
  {
    connector: "filesystem",
    description: "Tool: filesystem read/write inside TOOL_WORKSPACE_ROOT.",
    scopes: [
      { scope: "fs.read", granted: true },
      { scope: "fs.write", granted: true },
    ],
  },
  {
    connector: "shell",
    description: "Tool: bounded run_command + execute_python.",
    scopes: [{ scope: "cmd.run", granted: true }],
  },
  {
    connector: "github",
    description: "Connector for repo browsing + PR ops (Op 5+).",
    scopes: [
      { scope: "repo.read", granted: false },
      { scope: "repo.write", granted: false },
      { scope: "pulls.create", granted: false },
    ],
  },
  {
    connector: "vercel",
    description: "Connector for deployments observation (read).",
    scopes: [
      { scope: "deployments.list", granted: false },
      { scope: "deployments.read", granted: false },
    ],
  },
  {
    connector: "figma",
    description: "Connector for design import (Surface chamber legacy).",
    scopes: [{ scope: "files.read", granted: false }],
  },
];

export default function PermissionsPage() {
  return (
    <>
      <SurfaceHeader
        title="Permissions"
        subtitle="Connector × scope matrix. Read-only in V0 — mutation lands when /permissions/* ships."
      />

      <Panel title="Matrix" hint="declared scopes per connector">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            fontFamily: "var(--mono)",
          }}
        >
          <thead>
            <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ padding: "6px 10px", fontWeight: 500 }}>connector</th>
              <th style={{ padding: "6px 10px", fontWeight: 500 }}>scope</th>
              <th style={{ padding: "6px 10px", fontWeight: 500 }}>state</th>
              <th style={{ padding: "6px 10px", fontWeight: 500 }}>note</th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.flatMap((row) =>
              row.scopes.map((scope, i) => (
                <tr key={`${row.connector}:${scope.scope}`} style={{ borderTop: "var(--border-soft)" }}>
                  <td style={{ padding: "8px 10px", color: "var(--text-primary)" }}>
                    {i === 0 ? row.connector : ""}
                  </td>
                  <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>
                    {scope.scope}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    {scope.granted
                      ? <Pill tone="ok">granted</Pill>
                      : <Pill tone="ghost">declined</Pill>}
                  </td>
                  <td style={{ padding: "8px 10px", color: "var(--text-muted)", fontFamily: "var(--sans)", fontSize: 12 }}>
                    {i === 0 ? row.description : ""}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </Panel>

      <Panel title="V0 disclosure" hint="why this is read-only">
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
          The composer routes (<code style={{ fontFamily: "var(--mono)" }}>/composer/*</code>) and the
          tool runtime currently consult the backend's static config. Per-operator scope mutation is
          deferred to Wave 1 along with the OAuth flows for GitHub / Vercel / Figma. The Composer V0
          smoke flow does not depend on writable permissions.
        </p>
      </Panel>
    </>
  );
}
