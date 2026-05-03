// Fase 1.5 — Permissions & Privacy panel (right rail), recalibrated.
//
// Visual identity tightened:
//   * accent-tinted border + soft glow ring on the wrapper
//   * shield glyph in the header (CSS-drawn, no asset)
//   * tighter type rhythm; status pill aligned right
//   * link to the full matrix as a subtle CTA at the bottom
//
// Data is unchanged from Fase 1: three categories derived from the
// same MATRIX that PermissionsPage renders in detail. Privacy Mode and
// Data Retention stay out — there is no backend setting that would
// honour them honestly today.

import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import Pill from "../../components/atoms/Pill";

interface CategorySummary {
  label: string;
  description: string;
  scopes: string[];
  granted: boolean;
}

// Human-first descriptions so the panel reads like product chrome,
// not like a config dump. The technical scopes stay below the
// description for operators who need them — they map 1:1 to the
// connector × scope rows on PermissionsPage MATRIX.
const CATEGORIES: CategorySummary[] = [
  {
    label: "Data Access",
    description: "Workspace files, docs, terminal",
    scopes: ["filesystem.fs.read", "filesystem.fs.write"],
    granted: true,
  },
  {
    label: "Network Access",
    description: "Anthropic models, internal APIs",
    scopes: ["anthropic.models.invoke"],
    granted: true,
  },
  {
    label: "Code Execution",
    description: "Local environment only",
    scopes: ["shell.cmd.run"],
    granted: true,
  },
];

const wrapStyle: CSSProperties = {
  background: "color-mix(in oklab, var(--bg-surface) 92%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-md, 8px)",
  boxShadow:
    "0 0 0 1px color-mix(in oklab, var(--accent) 14%, transparent), 0 24px 60px rgba(0, 0, 0, 0.30)",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  position: "sticky",
  top: 16,
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 16px",
  borderBottom: "1px solid var(--border-color-soft)",
  background: "color-mix(in oklab, var(--accent) 6%, transparent)",
};

const shieldStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  borderRadius: 6,
  border: "1px solid var(--accent)",
  color: "var(--accent)",
  fontSize: 12,
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-kicker, 0.26em)",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const bodyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "4px 16px 12px",
};

const rowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "12px 0",
  borderTop: "1px solid var(--border-color-soft)",
};

const rowFirstStyle: CSSProperties = {
  ...rowStyle,
  borderTop: "none",
};

const rowHeader: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};

const scopeStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  color: "var(--text-muted)",
};

const linkStyle: CSSProperties = {
  display: "block",
  margin: "0 16px 14px",
  padding: "8px 12px",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--accent)",
  textDecoration: "none",
  border: "1px solid color-mix(in oklab, var(--accent) 32%, transparent)",
  borderRadius: "var(--radius-sm, 4px)",
  textAlign: "center",
};

export default function PermissionsPanel() {
  return (
    <aside style={wrapStyle} aria-label="Permissions and privacy">
      <header style={headerStyle}>
        <span style={shieldStyle} aria-hidden>
          {/* Minimal shield glyph — text instead of SVG keeps the
              file token-driven and free of asset dependencies. */}
          ▣
        </span>
        <h3 style={titleStyle}>Permissions &amp; Privacy</h3>
        <span style={{ marginLeft: "auto" }}>
          <Pill tone="ghost">V0 static</Pill>
        </span>
      </header>

      <div style={bodyStyle}>
        {CATEGORIES.map((cat, i) => (
          <div key={cat.label} style={i === 0 ? rowFirstStyle : rowStyle}>
            <div style={rowHeader}>
              <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{cat.label}</span>
              <Pill tone={cat.granted ? "ok" : "ghost"}>
                {cat.granted ? "allowed" : "declined"}
              </Pill>
            </div>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {cat.description}
            </span>
            <span style={scopeStyle}>{cat.scopes.join(" · ")}</span>
          </div>
        ))}
      </div>

      <Link to="/control/permissions" style={linkStyle}>
        Open full matrix →
      </Link>
    </aside>
  );
}
