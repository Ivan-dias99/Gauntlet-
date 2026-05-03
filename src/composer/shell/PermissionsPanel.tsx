// Fase 1 — Permissions & Privacy panel (right rail).
//
// Doctrine: sovereignty must be visible. The panel summarises three
// categories derived from the same static V0 matrix that PermissionsPage
// renders in detail, so the studio's right rail and the full Permissions
// route never disagree on the underlying truth.
//
// Three tiles only — every tile maps to scopes that exist in MATRIX:
//   * Data Access   — filesystem.fs.read | fs.write
//   * Network Access — anthropic.models.invoke
//   * Code Execution — shell.cmd.run
//
// Privacy Mode toggle and Data Retention are NOT included — there is no
// backend setting that would honour them today.

import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import Pill from "../../components/atoms/Pill";

interface CategorySummary {
  label: string;
  scopes: string[];
  granted: boolean;
}

const CATEGORIES: CategorySummary[] = [
  {
    label: "Data Access",
    scopes: ["filesystem.fs.read", "filesystem.fs.write"],
    granted: true,
  },
  {
    label: "Network Access",
    scopes: ["anthropic.models.invoke"],
    granted: true,
  },
  {
    label: "Code Execution",
    scopes: ["shell.cmd.run"],
    granted: true,
  },
];

const wrapStyle: CSSProperties = {
  background: "var(--bg-surface)",
  border: "var(--border-soft)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  position: "sticky",
  top: 16,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  paddingTop: 8,
  borderTop: "var(--border-soft)",
};

const rowHeader: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
};

const linkStyle: CSSProperties = {
  marginTop: 4,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  textDecoration: "none",
  border: "var(--border-soft)",
  borderRadius: "var(--radius-sm, 4px)",
  padding: "6px 10px",
  alignSelf: "flex-start",
};

export default function PermissionsPanel() {
  return (
    <aside style={wrapStyle} aria-label="Permissions and privacy">
      <header style={headerStyle}>
        <h3 style={titleStyle}>Permissions &amp; Privacy</h3>
        <Pill tone="ghost">V0 static</Pill>
      </header>

      {CATEGORIES.map((cat) => (
        <div key={cat.label} style={rowStyle}>
          <div style={rowHeader}>
            <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{cat.label}</span>
            <Pill tone={cat.granted ? "ok" : "ghost"}>
              {cat.granted ? "allowed" : "declined"}
            </Pill>
          </div>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta, 11px)",
              color: "var(--text-muted)",
            }}
          >
            {cat.scopes.join(" · ")}
          </span>
        </div>
      ))}

      <Link to="/control/permissions" style={linkStyle}>
        Open full matrix →
      </Link>
    </aside>
  );
}
