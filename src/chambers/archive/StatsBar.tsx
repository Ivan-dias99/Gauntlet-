import type { Stats } from "./helpers";
import { formatTokens } from "./helpers";

// Compact stats row over the ledger column. Any metric that is zero
// across every recorded run is rendered as "—" rather than a fake
// ceiling: surface_mock runs never record latency/tokens/tools, and
// "0ms" / "0 tokens" would read as "infinitely fast" instead of
// "never measured".

interface Props {
  stats: Stats;
}

export default function StatsBar({ stats }: Props) {
  if (stats.total === 0) return null;

  const hasLatency = stats.avgLatencyMs > 0;
  const totalTokens = stats.totalInput + stats.totalOutput;
  const hasTokens = totalTokens > 0;
  const hasTools = stats.toolCalls > 0;

  return (
    <div
      data-archive-stats
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: 6,
        padding: "var(--space-2) var(--space-3)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
      }}
    >
      <Cell label="runs" value={`${stats.total}`} />
      <Cell
        label="refused"
        value={`${(stats.refusalRate * 100).toFixed(0)}%`}
        sub={`${stats.refused}/${stats.total}`}
        tone={stats.refusalRate >= 0.5 ? "warn" : undefined}
      />
      {hasLatency ? (
        <Cell label="latency" value={`${stats.avgLatencyMs}ms`} />
      ) : (
        <Cell label="latency" value="—" muted />
      )}
      {hasTokens ? (
        <Cell
          label="tokens"
          value={formatTokens(totalTokens)}
          sub={`${formatTokens(stats.totalInput)} in`}
        />
      ) : (
        <Cell label="tokens" value="—" muted />
      )}
      {hasTools ? (
        <Cell label="tools" value={`${stats.toolCalls}`} />
      ) : (
        <Cell label="tools" value="—" muted />
      )}
    </div>
  );
}

function Cell({
  label, value, sub, tone, muted,
}: { label: string; value: string; sub?: string; tone?: "warn"; muted?: boolean }) {
  const color =
    tone === "warn" ? "var(--cc-warn)" :
    muted ? "var(--text-ghost)" :
    "var(--text-primary)";
  return (
    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 14,
          color,
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            color: "var(--text-ghost)",
            letterSpacing: "var(--track-meta)",
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
