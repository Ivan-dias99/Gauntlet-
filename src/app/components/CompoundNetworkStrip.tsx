import {
  type CompoundNetwork,
  type CompoundNodeType,
} from "../dna/compound-intelligence";

interface Props {
  network:   CompoundNetwork;
  maxNodes?: number;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function nodeTypeColor(type: CompoundNodeType): string {
  switch (type) {
    case "operator":   return "var(--r-accent)";
    case "mission":    return "var(--r-ok)";
    case "agent":      return "var(--chamber-creation)";
    case "knowledge":  return "var(--chamber-lab)";
    case "pattern":    return "var(--chamber-school)";
    case "output":     return "var(--r-subtext)";
    case "ecosystem":  return "var(--r-dim)";
  }
}

function barrierColor(score: number): string {
  if (score >= 0.7) return "var(--r-ok)";
  if (score >= 0.4) return "var(--r-warn)";
  return "var(--r-err)";
}

export function CompoundNetworkStrip({ network, maxNodes = 5 }: Props) {
  const topNodes = [...network.nodes]
    .sort((a, b) => b.advantageScore - a.advantageScore)
    .slice(0, maxNodes);

  const { barrier } = network;

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
        compound · {network.nodes.length} nodes
        <span
          style={{
            color: barrierColor(barrier.score),
            marginLeft: "6px",
          }}
        >
          barrier {(barrier.score * 100).toFixed(0)}%
        </span>
      </div>

      {/* Replication barrier row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "3px 0",
          borderBottom: topNodes.length > 0 ? "1px solid var(--r-border-soft)" : undefined,
        }}
      >
        <div
          style={{
            width: "5px",
            height: "2px",
            background: barrierColor(barrier.score),
            flexShrink: 0,
          }}
        />
        <span style={{ ...MONO, color: "var(--r-subtext)", flex: 1 }}>
          replication barrier
        </span>
        <span style={{ ...MONO, color: "var(--r-dim)" }}>
          {barrier.missionHistory}m · {barrier.patternCount}p · {barrier.knowledgeDepth}mo
        </span>
      </div>

      {topNodes.map((node, i) => {
        const isLast = i === topNodes.length - 1;
        return (
          <div
            key={node.id}
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
                background: nodeTypeColor(node.type),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {node.label}
            </span>
            <span style={{ ...MONO, color: nodeTypeColor(node.type) }}>
              {node.type}
            </span>
            <span style={{ ...MONO, color: "var(--r-dim)" }}>
              {(node.advantageScore * 100).toFixed(0)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
