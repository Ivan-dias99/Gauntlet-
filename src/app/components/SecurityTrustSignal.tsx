/**
 * RUBERRA — Security Trust Signal
 * Stack 06 · Sovereign Security · Visible Trust Bit
 *
 * One signal. Three states. No dashboard.
 *
 * Antigravity law:
 * - healthy  → silent. Nothing renders. Security earns silence.
 * - warn     → one 5px dot, amber. No label. No tooltip spam.
 * - breach   → one 5px dot, error red + one word: "breach". That's all.
 *
 * This component is intentionally minimal. Security trust is not
 * communicated through decoration, lock icons, or shield badges.
 * It is communicated through consequence and silence.
 */

import { type TrustSignal } from "../dna/sovereign-security";

export function SecurityTrustSignal({
  signal,
  onAcknowledge,
}: {
  signal:          TrustSignal;
  onAcknowledge?:  () => void;
}) {
  if (signal === "healthy") return null;

  const color = signal === "breach" ? "var(--r-err)" : "var(--r-warn)";

  return (
    <button
      onClick={onAcknowledge}
      title={signal === "breach" ? "Security breach — click to review" : "Security warning — click to review"}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            "5px",
        background:     "transparent",
        border:         "none",
        cursor:         onAcknowledge ? "pointer" : "default",
        padding:        "0",
        outline:        "none",
        flexShrink:     0,
      }}
    >
      <div
        style={{
          width:        "5px",
          height:       "5px",
          borderRadius: "50%",
          background:   color,
          flexShrink:   0,
          boxShadow:    signal === "breach"
            ? `0 0 0 2px color-mix(in srgb, ${color} 20%, transparent)`
            : "none",
        }}
      />
      {signal === "breach" && (
        <span
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "7.5px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color,
          }}
        >
          breach
        </span>
      )}
    </button>
  );
}
