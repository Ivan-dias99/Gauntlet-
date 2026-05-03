// Sprint 2 — Last Used Tools tile (target visual + populated).
//
// Doctrine override (operator-authorized): same fallback strategy as
// RecentCommands — real /runs tool_calls win when present; otherwise
// demo rows so the tile matches the mock.

import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useRecentRuns, deriveLastUsedTools } from "../hooks/useRecentRuns";
import {
  CodeIcon,
  AnalysisIcon,
  MemoryIcon,
  DesignIcon,
  ContextIcon,
  ToolHubIcon,
} from "./icons";

interface ToolRow {
  name: string;
  icon: ReactNode;
}

const TOOL_ICONS: Record<string, ReactNode> = {
  code:     <CodeIcon size={14} />,
  analysis: <AnalysisIcon size={14} />,
  memory:   <MemoryIcon size={14} />,
  design:   <DesignIcon size={14} />,
  context:  <ContextIcon size={14} />,
};

const DEMO_ROWS: ToolRow[] = [
  { name: "code",     icon: TOOL_ICONS.code },
  { name: "analysis", icon: TOOL_ICONS.analysis },
  { name: "memory",   icon: TOOL_ICONS.memory },
  { name: "design",   icon: TOOL_ICONS.design },
  { name: "context",  icon: TOOL_ICONS.context },
];

const cardStyle: CSSProperties = {
  background: "color-mix(in oklab, var(--bg-surface) 92%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-md, 10px)",
  padding: "16px 18px 12px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minHeight: 200,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  margin: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-kicker, 0.26em)",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const sourceStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text-muted)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "5px 0",
  fontSize: 13,
  color: "var(--text-primary)",
};

const iconCellStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 18,
  color: "var(--accent)",
  flexShrink: 0,
};

const buttonStyle: CSSProperties = {
  marginTop: "auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "8px 12px",
  background: "color-mix(in oklab, var(--bg-elevated) 70%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-sm, 6px)",
  color: "var(--text-secondary)",
  fontFamily: "var(--sans)",
  fontSize: 12,
  cursor: "pointer",
};

export default function LastUsedTools() {
  const state = useRecentRuns(5);
  const navigate = useNavigate();

  // Real tool names from /runs win when present; otherwise demo rows.
  const liveTools = state.kind === "ready" ? deriveLastUsedTools(state.runs) : [];
  const rows: ToolRow[] =
    liveTools.length > 0
      ? liveTools.map((name) => ({ name, icon: TOOL_ICONS[name] ?? <CodeIcon size={14} /> }))
      : DEMO_ROWS;

  return (
    <section style={cardStyle} data-studio-tile="last-used-tools">
      <header style={headerStyle}>
        <h3 style={titleStyle}>Last Used Tools</h3>
        <span style={sourceStyle}>/runs</span>
      </header>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
        {rows.map((r) => (
          <li key={r.name} style={rowStyle}>
            <span style={iconCellStyle}>{r.icon}</span>
            <span>{r.name}</span>
          </li>
        ))}
      </ul>
      <button type="button" style={buttonStyle} onClick={() => navigate("/composer/route")}>
        <ToolHubIcon size={12} />
        Open tool hub
      </button>
    </section>
  );
}
