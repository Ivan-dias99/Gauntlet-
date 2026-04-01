import { type AnalyticsPattern } from "../dna/intelligence-analytics";

interface Props {
  patterns: AnalyticsPattern[];
  maxVisible?: number;
}

function confidenceLevel(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.4) return "medium";
  return "low";
}

const DOT_COLOR: Record<"high" | "medium" | "low", string> = {
  high:   "#5a6e5a",
  medium: "#8b7355",
  low:    "var(--r-dim)",
};

export function AnalyticsPatternStrip({ patterns, maxVisible = 6 }: Props) {
  if (patterns.length === 0) return null;

  const visible = patterns.slice(0, maxVisible);

  return (
    <div style={{ background: "transparent", fontFamily: "'JetBrains Mono', monospace" }}>
      <div
        style={{
          fontSize: "8px",
          textTransform: "uppercase",
          color: "var(--r-dim)",
          letterSpacing: "0.08em",
          marginBottom: "6px",
        }}
      >
        analytics · patterns
      </div>
      {visible.map((pattern, i) => {
        const level = confidenceLevel(pattern.confidence);
        const dotColor = DOT_COLOR[level];
        const isLast = i === visible.length - 1;

        return (
          <div
            key={pattern.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "8px",
              fontFamily: "'JetBrains Mono', monospace",
              padding: "5px 0",
              borderBottom: isLast ? undefined : "1px solid var(--r-border-soft)",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: dotColor,
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1, color: "var(--r-fg, inherit)" }}>
              {pattern.headline}
            </span>
            <span style={{ color: "var(--r-dim)", whiteSpace: "nowrap" }}>
              {pattern.type}
            </span>
            <span style={{ color: "var(--r-dim)", whiteSpace: "nowrap" }}>
              {pattern.confidence.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
