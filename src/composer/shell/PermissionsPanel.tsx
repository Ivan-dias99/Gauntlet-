// Sprint 2 — Permissions & Privacy panel (target visual + full rows).
//
// Doctrine override (operator-authorized): adds Data Retention row
// with Manage button + Privacy Mode toggle. Both are decorative until
// the corresponding settings endpoints ship — the toggle is local
// state only and does not call the backend.

import { useState } from "react";
import type { CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldIcon, CheckCircleIcon } from "./icons";

interface CategorySummary {
  label: string;
  description: string;
  granted: boolean;
}

const CATEGORIES: CategorySummary[] = [
  { label: "Data Access",     description: "Workspace files, docs, terminal",     granted: true },
  { label: "Network Access",  description: "api.internal.local, docs.company.com", granted: true },
  { label: "Code Execution",  description: "Local environment only",              granted: true },
];

const wrapStyle: CSSProperties = {
  background: "color-mix(in oklab, var(--bg-surface) 94%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-md, 10px)",
  boxShadow:
    "0 0 0 1px color-mix(in oklab, var(--accent) 14%, transparent), 0 24px 60px rgba(0, 0, 0, 0.30)",
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
  width: 24,
  height: 24,
  borderRadius: 6,
  border: "1px solid color-mix(in oklab, var(--accent) 50%, transparent)",
  background: "color-mix(in oklab, var(--accent) 14%, transparent)",
  color: "var(--accent)",
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const versionStyle: CSSProperties = {
  marginLeft: "auto",
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
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

const labelStyle: CSSProperties = {
  fontSize: 13,
  color: "var(--text-primary)",
  fontWeight: 500,
};

const allowedBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 8px",
  borderRadius: "999px",
  border: "1px solid color-mix(in oklab, #7ab48a 50%, transparent)",
  background: "color-mix(in oklab, #7ab48a 14%, transparent)",
  color: "color-mix(in oklab, #7ab48a 92%, var(--text-primary))",
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
};

const descriptionStyle: CSSProperties = {
  fontSize: 12,
  color: "var(--text-secondary)",
};

const manageButtonStyle: CSSProperties = {
  padding: "5px 10px",
  background: "transparent",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-sm, 4px)",
  color: "var(--text-secondary)",
  fontFamily: "var(--sans)",
  fontSize: 12,
  cursor: "pointer",
};

const linkStyle: CSSProperties = {
  display: "block",
  margin: "4px 16px 14px",
  padding: "8px 12px",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  textDecoration: "none",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-sm, 4px)",
  textAlign: "center",
};

// Local toggle for Privacy Mode — purely visual. The backend has no
// privacy-mode setting; flipping this does not change behaviour. It's
// chrome that matches the mock's authorized override.
function ToggleSwitch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      style={{
        width: 36,
        height: 20,
        borderRadius: "999px",
        border: "1px solid var(--border-color-soft)",
        background: on
          ? "color-mix(in oklab, var(--accent) 80%, transparent)"
          : "color-mix(in oklab, var(--bg-elevated) 80%, transparent)",
        position: "relative",
        cursor: "pointer",
        padding: 0,
        transition: "background var(--motion-duration-fast, 120ms)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: on ? "#ffffff" : "var(--text-muted)",
          boxShadow: on ? "0 0 8px var(--accent)" : "none",
          transition: "left var(--motion-duration-fast, 120ms)",
        }}
      />
    </button>
  );
}

export default function PermissionsPanel() {
  const [privacyOn, setPrivacyOn] = useState(true);
  const navigate = useNavigate();

  return (
    <aside style={wrapStyle} aria-label="Permissions and privacy">
      <header style={headerStyle}>
        <span style={shieldStyle} aria-hidden>
          <ShieldIcon size={14} />
        </span>
        <h3 style={titleStyle}>Permissions &amp; Privacy</h3>
        <span style={versionStyle}>V0 static</span>
      </header>

      <div style={bodyStyle}>
        {CATEGORIES.map((cat, i) => (
          <div key={cat.label} style={i === 0 ? rowFirstStyle : rowStyle}>
            <div style={rowHeader}>
              <span style={labelStyle}>{cat.label}</span>
              <span style={allowedBadgeStyle}>
                Allowed
                <CheckCircleIcon size={10} />
              </span>
            </div>
            <span style={descriptionStyle}>{cat.description}</span>
          </div>
        ))}

        {/* Data Retention row — Manage button is decorative. */}
        <div style={rowStyle}>
          <div style={rowHeader}>
            <span style={labelStyle}>Data Retention</span>
            <button
              type="button"
              style={manageButtonStyle}
              onClick={() => navigate("/composer/settings")}
            >
              Manage
            </button>
          </div>
          <span style={descriptionStyle}>30 days</span>
        </div>

        {/* Privacy Mode toggle — local state only, no backend wire. */}
        <div style={rowStyle}>
          <div style={rowHeader}>
            <span style={labelStyle}>Privacy Mode</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: privacyOn ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "var(--track-meta, 0.12em)" }}>
                {privacyOn ? "On" : "Off"}
              </span>
              <ToggleSwitch on={privacyOn} onChange={setPrivacyOn} label="Privacy mode" />
            </span>
          </div>
        </div>
      </div>

      <Link to="/composer/permissions" style={linkStyle}>
        Open full matrix →
      </Link>
    </aside>
  );
}
