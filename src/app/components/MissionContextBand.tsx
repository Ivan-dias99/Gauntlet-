/**
 * RUBERRA — Mission Context Band
 * Stack 05 · Adaptive Experience · Global Mission Binding
 *
 * One slim band. Always honest. Never decorative.
 * When a mission is active, every chamber knows it.
 * When no mission is active, the surface is silent.
 *
 * Antigravity law:
 * - 28px max height. One line. Zero decoration.
 * - Chamber dot (5px) + mission name + status only.
 * - "release" is monospace text — not a close icon.
 * - No animation on enter/exit (motion reserved for structural transitions).
 */

import { type Mission, CHAMBER_ACCENT, MISSION_STATUS_LABEL } from "../dna/mission-substrate";

export function MissionContextBand({
  mission,
  onRelease,
}: {
  mission:   Mission;
  onRelease: () => void;
}) {
  const accent = CHAMBER_ACCENT[mission.identity.chamberLead];
  const status = MISSION_STATUS_LABEL[mission.ledger.currentState];

  return (
    <div
      style={{
        height:          "28px",
        display:         "flex",
        alignItems:      "center",
        padding:         "0 16px",
        gap:             "10px",
        borderBottom:    "1px solid var(--r-border-soft)",
        background:      `color-mix(in srgb, ${accent} 5%, var(--r-surface))`,
        flexShrink:      0,
      }}
    >
      {/* Chamber dot */}
      <div
        style={{
          width:        "5px",
          height:       "5px",
          borderRadius: "50%",
          background:   accent,
          flexShrink:   0,
        }}
      />

      {/* Mission name */}
      <span
        style={{
          fontFamily:    "'Inter', system-ui, sans-serif",
          fontSize:      "11px",
          color:         "var(--r-text)",
          fontWeight:    500,
          letterSpacing: "-0.01em",
          flex:          1,
          overflow:      "hidden",
          textOverflow:  "ellipsis",
          whiteSpace:    "nowrap",
        }}
      >
        {mission.identity.name}
      </span>

      {/* Status */}
      <span
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "7.5px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color:         "var(--r-dim)",
          flexShrink:    0,
        }}
      >
        {status}
      </span>

      {/* Chamber */}
      <span
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "7.5px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color:         accent,
          flexShrink:    0,
        }}
      >
        {mission.identity.chamberLead}
      </span>

      {/* Release */}
      <button
        onClick={onRelease}
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "7.5px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color:         "var(--r-dim)",
          background:    "transparent",
          border:        "none",
          cursor:        "pointer",
          padding:       "0",
          flexShrink:    0,
          outline:       "none",
        }}
        title="Release mission context"
      >
        release
      </button>
    </div>
  );
}
