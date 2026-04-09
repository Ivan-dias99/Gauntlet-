import { type SystemModel } from "../dna/system-awareness";
import { type MissionStatus } from "../dna/mission-substrate";

interface SystemHealthBandProps {
  model: SystemModel;
  missionState?: MissionStatus | "running" | "idle" | "planning";
  missionName?: string;
}

export function SystemHealthBand({ model, missionState, missionName }: SystemHealthBandProps) {
  const { health, anomalies } = model;
  const missionAlert =
    missionState === "blocked" || missionState === "paused" || missionState === "completed" || missionState === "archived";

  if ((health === "healthy" || health === "unknown") && !missionAlert) return null;

  const color = missionState === "blocked"
    ? "var(--r-err)"
    : missionState === "paused"
      ? "var(--r-warn)"
      : missionState === "completed" || missionState === "archived"
        ? "var(--r-dim)"
        : health === "critical"
          ? "var(--r-err)"
          : "var(--r-warn)";

  const topAnomaly = anomalies.find((a) => !a.resolved);
  const headline = missionAlert
    ? `${missionName ? `${missionName} · ` : ""}mission ${missionState}`
    : topAnomaly
      ? topAnomaly.description.length > 60
        ? topAnomaly.description.slice(0, 59) + "…"
        : topAnomaly.description
      : null;
  const label = missionAlert ? `mission · ${missionState}` : `system · ${health}`;

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
          {label}
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
