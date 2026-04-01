import { type KnowledgeGraph, type KnowledgeNode, CONFIDENCE_RANK } from "../dna/living-knowledge";

interface KnowledgeGraphStripProps {
  graph: KnowledgeGraph;
  maxNodes?: number;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "8px",
  letterSpacing: "0.04em",
};

function typeDotColor(type: KnowledgeNode["type"]): string {
  switch (type) {
    case "concept":   return "#8b7355";
    case "artifact":  return "#5a6e5a";
    case "insight":   return "#6b5a8b";
    default:          return "var(--r-dim)";
  }
}

function confidencePct(confidence: KnowledgeNode["confidence"]): number {
  return (CONFIDENCE_RANK[confidence] / 4) * 100 | 0;
}

export function KnowledgeGraphStrip({ graph, maxNodes = 8 }: KnowledgeGraphStripProps) {
  if (graph.nodes.length === 0) return null;

  const visible = graph.nodes.slice(0, maxNodes);

  return (
    <div style={{ background: "transparent" }}>
      {/* Header */}
      <div
        style={{
          ...MONO,
          textTransform: "uppercase",
          color: "var(--r-dim)",
          paddingBottom: "4px",
        }}
      >
        knowledge · graph
      </div>

      {visible.map((node) => {
        const domain = node.tags[0] ?? node.type;
        const label = node.content.length > 48
          ? node.content.slice(0, 47) + "…"
          : node.content;

        return (
          <div
            key={node.id}
            style={{
              ...MONO,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 0",
              borderBottom: "1px solid var(--r-border-soft)",
            }}
          >
            {/* Type dot */}
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: typeDotColor(node.type),
                flexShrink: 0,
              }}
            />
            {/* Label */}
            <span
              style={{
                color: "var(--r-text)",
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </span>
            {/* Domain */}
            <span style={{ color: "var(--r-dim)", flexShrink: 0 }}>
              {domain}
            </span>
            {/* Confidence */}
            <span style={{ color: "var(--r-subtext)", flexShrink: 0, minWidth: "3ch", textAlign: "right" }}>
              {confidencePct(node.confidence)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
