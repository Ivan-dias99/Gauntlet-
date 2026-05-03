// Fase 1 — Recent Commands tile.
//
// Real data only: pulls /runs?limit=5 and renders question + route + age.
// No mock fallback — when the backend is unreachable or empty the tile
// renders an honest empty state.

import type { CSSProperties } from "react";
import { useRecentRuns } from "../hooks/useRecentRuns";
import type { StudioRun } from "../hooks/useRecentRuns";
import Pill from "../../components/atoms/Pill";

const cardStyle: CSSProperties = {
  background: "var(--bg-surface)",
  border: "var(--border-soft)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minHeight: 200,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
  margin: 0,
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
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
  padding: "6px 0",
  borderTop: "var(--border-soft)",
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
  fontSize: "var(--t-meta, 11px)",
  color: "var(--text-muted)",
  flexShrink: 0,
};

export default function RecentCommands() {
  const state = useRecentRuns(5);

  return (
    <section style={cardStyle} data-studio-tile="recent-commands">
      <header style={headerStyle}>
        <h3 style={titleStyle}>Recent commands</h3>
        <Pill tone="ghost">/runs</Pill>
      </header>
      <Body state={state} />
    </section>
  );
}

function Body({ state }: { state: ReturnType<typeof useRecentRuns> }) {
  if (state.kind === "loading") {
    return <Empty text="loading…" />;
  }
  if (state.kind === "unreachable") {
    return <Empty text={`backend unreachable · ${state.reason}`} />;
  }
  if (state.kind === "error") {
    return <Empty text={`error · ${state.message}`} />;
  }
  if (state.runs.length === 0) {
    return <Empty text="no runs yet — invoke the capsule to write the first row" />;
  }
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {state.runs.map((r) => (
        <li key={r.id} style={rowStyle}>
          <span style={questionStyle} title={r.question}>
            {truncate(r.question, 64)}
          </span>
          <span style={ageStyle}>{formatAge(r.timestamp)}</span>
        </li>
      ))}
    </ul>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>
      {text}
    </p>
  );
}

function truncate(s: string, max: number): string {
  if (!s) return "(empty)";
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}

// Compact age relative to now ("2m", "1h", "3d"). Falls back to the raw
// ISO string if parsing fails — never invent a value.
function formatAge(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  const seconds = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

// Re-export so LastUsedTools can share the same fetch tick instead of
// triggering a second /runs call. Phase-1 keeps the two tiles independent
// for simplicity; phase-2+ may share a single context if the dashboard
// grows more tiles.
export type { StudioRun };
