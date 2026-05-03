// Wave 8 — pipeline strip. Visual treatment matches the canonical
// Foto 3 mockup:
//   - Each stage is its own glow card via [data-pipeline-stage]
//   - Icon on top, title (mono kicker) middle, blurb (small) bottom
//   - Glow arrow → between stages
//   - Whole strip lives in [data-pipeline-bar] for the dark gradient
//     bottom band

import type { CSSProperties } from "react";
import { PIPELINE_STAGES } from "./types";
import Icon, { PIPELINE_ICON, PIPELINE_BLURB } from "./visual/Icons";

const stageStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  padding: "12px 16px",
  flexShrink: 0,
  minWidth: 130,
  textAlign: "center",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--text-primary)",
  fontWeight: 600,
};

const blurbStyle: CSSProperties = {
  margin: 0,
  fontSize: 10,
  color: "var(--text-muted)",
  lineHeight: 1.4,
  maxWidth: 130,
};

export default function PipelineStrip() {
  return (
    <footer
      data-pipeline-bar
      style={{
        padding: "18px 24px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        overflowX: "auto",
      }}
      data-pipeline-strip
    >
      {PIPELINE_STAGES.map((stage, i) => (
        <div
          key={stage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div data-pipeline-stage style={stageStyle}>
            <span
              aria-hidden
              style={{
                color: "var(--accent)",
                display: "inline-flex",
                filter: "drop-shadow(0 0 6px rgba(94,165,255,0.55))",
              }}
            >
              <Icon name={PIPELINE_ICON[stage]} size={22} />
            </span>
            <p style={titleStyle}>{stage}</p>
            <p style={blurbStyle}>{PIPELINE_BLURB[stage]}</p>
          </div>
          {i < PIPELINE_STAGES.length - 1 && (
            <span
              aria-hidden
              style={{
                color: "var(--accent)",
                opacity: 0.55,
                flexShrink: 0,
                display: "inline-flex",
                filter: "drop-shadow(0 0 4px rgba(94,165,255,0.45))",
                margin: "0 2px",
              }}
            >
              <Icon name="arrow-right" size={14} strokeWidth={1.6} />
            </span>
          )}
        </div>
      ))}
    </footer>
  );
}
