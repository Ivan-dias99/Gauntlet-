import {
  type OrgIntelligenceState,
  type MissionHealthStatus,
  type OrgInsight,
} from "../dna/org-intelligence";

interface Props {
  org:         OrgIntelligenceState;
  maxInsights?: number;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function healthColor(status: MissionHealthStatus): string {
  switch (status) {
    case "thriving": return "var(--r-ok)";
    case "nominal":  return "var(--r-subtext)";
    case "at_risk":  return "var(--r-warn)";
    case "failing":  return "var(--r-err)";
    case "stalled":  return "var(--r-dim)";
  }
}

function insightColor(type: OrgInsight["type"]): string {
  switch (type) {
    case "gap":         return "var(--r-warn)";
    case "risk":        return "var(--r-err)";
    case "strength":    return "var(--r-ok)";
    case "opportunity": return "var(--r-accent)";
  }
}

export function OrgIntelligenceStrip({ org, maxInsights = 4 }: Props) {
  const visibleInsights = org.insights.slice(0, maxInsights);
  const capGaps         = org.capabilityMap.gaps.length;
  const healthRecords   = org.missionHealth;
  const atRisk          = healthRecords.filter((h) => h.status === "at_risk" || h.status === "failing" || h.status === "stalled").length;

  if (healthRecords.length === 0 && visibleInsights.length === 0) return null;

  return (
    <div style={{ background: "transparent" }}>
      <div
        style={{
          ...MONO,
          fontSize: "8px",
          textTransform: "uppercase",
          color: "var(--r-dim)",
          letterSpacing: "0.08em",
          marginBottom: "6px",
        }}
      >
        org · {healthRecords.length} missions
        {capGaps > 0 && (
          <span style={{ color: "var(--r-warn)", marginLeft: "6px" }}>
            {capGaps} gap{capGaps > 1 ? "s" : ""}
          </span>
        )}
        {atRisk > 0 && (
          <span style={{ color: "var(--r-err)", marginLeft: "6px" }}>
            {atRisk} at risk
          </span>
        )}
      </div>

      {healthRecords.map((record, i) => {
        const isLast = i === healthRecords.length - 1 && visibleInsights.length === 0;
        return (
          <div
            key={record.missionId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 0",
              borderBottom: isLast ? undefined : "1px solid var(--r-border-soft)",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: healthColor(record.status),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {record.missionId}
            </span>
            <span style={{ ...MONO, color: "var(--r-dim)" }}>
              v{(record.velocityScore * 100).toFixed(0)}%
            </span>
            <span style={{ ...MONO, color: healthColor(record.status) }}>
              {record.status}
            </span>
          </div>
        );
      })}

      {visibleInsights.map((insight, i) => {
        const isLast = i === visibleInsights.length - 1;
        return (
          <div
            key={insight.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 0",
              borderBottom: isLast ? undefined : "1px solid var(--r-border-soft)",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "2px",
                background: insightColor(insight.type),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-subtext)", flex: 1 }}>
              {insight.headline}
            </span>
            <span style={{ ...MONO, color: insightColor(insight.type) }}>
              {insight.type}
            </span>
          </div>
        );
      })}
    </div>
  );
}
