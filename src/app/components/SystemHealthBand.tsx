import { type SystemModel } from "../dna/system-awareness";

interface SystemHealthBandProps {
  model: SystemModel;
}

export function SystemHealthBand({ model }: SystemHealthBandProps) {
  const { health, anomalies } = model;

  if (health === "healthy" || health === "unknown") return null;

  const color =
    health === "critical" ? "var(--r-err)" : "var(--r-warn)";

  const topAnomaly = anomalies.find((a) => !a.resolved);
  const headline = topAnomaly
    ? topAnomaly.description.length > 60
      ? topAnomaly.description.slice(0, 59) + "…"
      : topAnomaly.description
    : null;

  return (
    <div
      style={{
        height: "28px",
        padding: "0 16px",
        borderBottom: "1px solid var(--r-border-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "transparent",
      }}
    >
      {/* Left: dot + label */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "7.5px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color,
          }}
        >
          system · {health}
        </span>
      </div>

      {/* Right: anomaly headline */}
      {headline && (
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: "var(--r-subtext)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "60%",
          }}
        >
          {headline}
        </span>
      )}
    </div>
  );
}
