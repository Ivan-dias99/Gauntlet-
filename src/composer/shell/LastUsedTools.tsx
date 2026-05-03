// Fase 1 — Last Used Tools tile.
//
// Derived from /runs?limit=5 — same hook as RecentCommands, but projected
// through deriveLastUsedTools to surface the distinct tool names the agent
// has actually invoked recently. Honest empty state when no run carries
// tool_calls (triad/ask routes never use tools).

import type { CSSProperties } from "react";
import { useRecentRuns, deriveLastUsedTools } from "../hooks/useRecentRuns";
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

const listStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  margin: 0,
  padding: 0,
  listStyle: "none",
};

export default function LastUsedTools() {
  const state = useRecentRuns(5);

  return (
    <section style={cardStyle} data-studio-tile="last-used-tools">
      <header style={headerStyle}>
        <h3 style={titleStyle}>Last used tools</h3>
        <Pill tone="ghost">/runs</Pill>
      </header>
      <Body state={state} />
    </section>
  );
}

function Body({ state }: { state: ReturnType<typeof useRecentRuns> }) {
  if (state.kind === "loading") return <Empty text="loading…" />;
  if (state.kind === "unreachable") return <Empty text={`backend unreachable · ${state.reason}`} />;
  if (state.kind === "error") return <Empty text={`error · ${state.message}`} />;

  const tools = deriveLastUsedTools(state.runs);
  if (tools.length === 0) {
    return <Empty text="no tool calls in the last 5 runs" />;
  }
  return (
    <ul style={listStyle}>
      {tools.map((name) => (
        <li key={name}>
          <Pill tone="neutral">{name}</Pill>
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
