import {
  type PlatformInfraState,
  type InfraLayerType,
  type InfraLayerStatus,
  type InfraHealth,
} from "../dna/platform-infrastructure";

interface Props {
  platform: PlatformInfraState;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function layerTypeColor(type: InfraLayerType): string {
  switch (type) {
    case "compute":     return "var(--r-accent)";
    case "storage":     return "var(--chamber-creation)";
    case "network":     return "var(--r-ok)";
    case "intelligence":return "var(--chamber-lab)";
    case "edge":        return "var(--chamber-school)";
    case "security":    return "var(--r-warn)";
  }
}

function statusDot(status: InfraLayerStatus): string {
  switch (status) {
    case "nominal":   return "var(--r-ok)";
    case "degraded":  return "var(--r-warn)";
    case "offline":   return "var(--r-err)";
    case "unknown":   return "var(--r-dim)";
  }
}

function healthColor(health: InfraHealth): string {
  switch (health) {
    case "sovereign_healthy": return "var(--r-ok)";
    case "vendor_dependent":  return "var(--r-warn)";
    case "degraded":          return "var(--r-err)";
    case "offline":           return "var(--r-err)";
  }
}

export function PlatformInfraStrip({ platform }: Props) {
  if (platform.layers.length === 0) return null;

  const sovereign    = platform.layers.filter((l) => l.sovereign).length;
  const nonSovereign = platform.layers.filter((l) => !l.sovereign).length;

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
        infra · {platform.layers.length}
        <span style={{ color: healthColor(platform.health), marginLeft: "6px" }}>
          {platform.health.replace("_", " ")}
        </span>
        {nonSovereign > 0 && (
          <span style={{ color: "var(--r-warn)", marginLeft: "6px" }}>
            {nonSovereign} vendor
          </span>
        )}
      </div>

      {platform.layers.map((layer, i) => {
        const isLast = i === platform.layers.length - 1;
        return (
          <div
            key={layer.id}
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
                borderRadius: layer.sovereign ? "0" : "50%",
                background: statusDot(layer.status),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {layer.provider}
            </span>
            <span style={{ ...MONO, color: layerTypeColor(layer.type) }}>
              {layer.type}
            </span>
            {layer.sovereign && (
              <span style={{ ...MONO, color: "var(--r-accent)" }}>s</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
