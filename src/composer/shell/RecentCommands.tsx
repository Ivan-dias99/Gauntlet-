// Sprint 2 — Recent Commands tile (target visual + populated).
//
// Doctrine override (operator-authorized): tile renders demo content
// when /runs is empty or unreachable so the Idle surface always
// matches the mock. When the backend has runs, real records win and
// replace the demo rows (so populated state isn't fake — it's
// fallback for the empty/unreachable case).

import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useRecentRuns } from "../hooks/useRecentRuns";
import { ListIcon } from "./icons";

interface CommandRow {
  question: string;
  age: string;
}

const DEMO_ROWS: CommandRow[] = [
  { question: "Refactor auth flows",      age: "2h ago" },
  { question: "Generate analytics report", age: "1d ago" },
  { question: "Review pricing model",      age: "2d ago" },
  { question: "Explain memory layer",      age: "3d ago" },
  { question: "Design onboarding flow",    age: "3d ago" },
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
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 10,
  padding: "5px 0",
  fontSize: 13,
};

const questionStyle: CSSProperties = {
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "var(--text-primary)",
};

const ageStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  color: "var(--text-muted)",
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

function formatAge(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  const seconds = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function truncate(s: string, max: number): string {
  if (!s) return "(empty)";
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}

export default function RecentCommands() {
  const state = useRecentRuns(5);
  const navigate = useNavigate();

  // Real runs win when present; otherwise demo rows so the surface
  // matches the target mock and operators see a populated tile.
  const rows: CommandRow[] =
    state.kind === "ready" && state.runs.length > 0
      ? state.runs.map((r) => ({ question: truncate(r.question, 32), age: formatAge(r.timestamp) }))
      : DEMO_ROWS;

  return (
    <section style={cardStyle} data-studio-tile="recent-commands">
      <header style={headerStyle}>
        <h3 style={titleStyle}>Recent Commands</h3>
        <span style={sourceStyle}>/runs</span>
      </header>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
        {rows.map((r, i) => (
          <li key={i} style={rowStyle}>
            <span style={questionStyle} title={r.question}>{r.question}</span>
            <span style={ageStyle}>{r.age}</span>
          </li>
        ))}
      </ul>
      <button type="button" style={buttonStyle} onClick={() => navigate("/composer/ledger")}>
        <ListIcon size={12} />
        View all history
      </button>
    </section>
  );
}
