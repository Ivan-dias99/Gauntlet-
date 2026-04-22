import type { Stats } from "./helpers";
import { formatTokens } from "./helpers";

// Compact five-cell stats row. Lives at the top of the ledger column in
// the new split layout — no separate telemetry slab, no dedicated section
// header. The chamber head carries the chamber identity; this row just
// quantifies it.

interface Props {
  stats: Stats;
}

export default function StatsBar({ stats }: Props) {
  if (stats.total === 0) return null;
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
      <Cell label="latency" value={`${stats.avgLatencyMs}ms`} />
      <Cell
        label="tokens"
        value={formatTokens(stats.totalInput + stats.totalOutput)}
        sub={`${formatTokens(stats.totalInput)} in`}
      />
      <Cell label="tools" value={`${stats.toolCalls}`} />
    </div>
  );
}

function Cell({
  label, value, sub, tone,
}: { label: string; value: string; sub?: string; tone?: "warn" }) {
  const color = tone === "warn" ? "var(--cc-warn)" : "var(--text-primary)";
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
