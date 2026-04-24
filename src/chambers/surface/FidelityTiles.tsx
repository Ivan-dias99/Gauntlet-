import type { SurfaceBriefPayload } from "../../hooks/useSignal";

// Two fidelity tiles — wireframe / hi-fi. The thumbs are inline SVG
// strokes so there's no image asset to ship and the geometry scales
// with the chamber DNA. Active tile earns a decisive material shift:
// outer ring + inner highlight + a status dot in the corner. Idle
// tiles rest on the standard soft border.

type Fidelity = SurfaceBriefPayload["fidelity"];

interface Props {
  value: Fidelity;
  onChange: (v: Fidelity) => void;
}

export default function FidelityTiles({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Fidelidade da surface"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
      }}
    >
      <Tile
        label="Wireframe"
        sub="estrutura · esqueleto · ritmo"
        active={value === "wireframe"}
        onClick={() => onChange("wireframe")}
      >
        <WireframeThumb active={value === "wireframe"} />
      </Tile>
      <Tile
        label="Alta fidelidade"
        sub="material · tipografia · cor"
        active={value === "hi-fi"}
        onClick={() => onChange("hi-fi")}
      >
        <HiFiThumb active={value === "hi-fi"} />
      </Tile>
    </div>
  );
}

function Tile({
  label, sub, active, onClick, children,
}: {
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 10,
        background: active ? "var(--bg-elevated)" : "var(--bg-surface)",
        // Selected state = sage, not copper. Sage encodes "active / ready /
        // selected" in the Signal semantic grammar; copper is reserved for
        // action moments (Generate, mission). Single thin ring beats triple
        // bloom for Apple-level precision.
        border: active
          ? "1px solid color-mix(in oklab, var(--cc-ok) 54%, var(--border-color-mid))"
          : "var(--border-soft)",
        borderRadius: "var(--radius-control)",
        boxShadow: active
          ? [
              "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 6%, transparent)",
              "0 0 0 2px color-mix(in oklab, var(--cc-ok) 16%, transparent)",
            ].join(", ")
          : "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 3%, transparent)",
        cursor: "pointer",
        textAlign: "left",
        transition:
          "background var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-med) var(--ease-swift)",
      }}
    >
      {/* Corner status dot — only on active. A small semantic beacon. */}
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--cc-ok)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "color-mix(in oklab, var(--cc-ok) 80%, transparent)",
              boxShadow: "0 0 0 3px color-mix(in oklab, var(--cc-ok) 16%, transparent)",
            }}
          />
          activo
        </span>
      )}
      <span
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 74,
          background: active
            ? "color-mix(in oklab, var(--cc-ok) 4%, var(--bg-input))"
            : "var(--bg-input)",
          border: "var(--border-soft)",
          borderRadius: "calc(var(--radius-control) - 4px)",
          boxShadow: active
            ? "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 6%, transparent)"
            : "none",
        }}
      >
        {children}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: "var(--t-body-sec)",
            fontWeight: active ? 500 : 400,
            color: active ? "var(--text-primary)" : "var(--text-muted)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            color: active ? "var(--text-muted)" : "var(--text-ghost)",
          }}
        >
          {sub}
        </span>
      </span>
    </button>
  );
}

function WireframeThumb({ active }: { active: boolean }) {
  // Flat rectangles + dashed line — a "skeleton" reading at first glance.
  const line = active
    ? "color-mix(in oklab, var(--text-primary) 54%, transparent)"
    : "color-mix(in oklab, var(--text-muted) 50%, transparent)";
  return (
    <svg width="92" height="52" viewBox="0 0 92 52" fill="none" aria-hidden>
      <rect x="4"  y="6"  width="30" height="6"  rx="1" stroke={line} strokeWidth="1" />
      <rect x="4"  y="16" width="50" height="4"  rx="1" stroke={line} strokeWidth="1" />
      <rect x="4"  y="26" width="34" height="22" rx="1" stroke={line} strokeWidth="1" strokeDasharray="2 2" />
      <rect x="42" y="26" width="44" height="22" rx="1" stroke={line} strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function HiFiThumb({ active }: { active: boolean }) {
  // Filled blocks, one accent bar — the "material" reading.
  const fillSoft = active
    ? "color-mix(in oklab, var(--text-primary) 16%, transparent)"
    : "color-mix(in oklab, var(--text-primary) 12%, transparent)";
  const fillStrong = active
    ? "color-mix(in oklab, var(--text-primary) 32%, transparent)"
    : "color-mix(in oklab, var(--text-primary) 24%, transparent)";
  const accent = active
    ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 78%, transparent)"
    : "color-mix(in oklab, var(--chamber-dna, var(--accent)) 56%, transparent)";
  return (
    <svg width="92" height="52" viewBox="0 0 92 52" fill="none" aria-hidden>
      <rect x="4"  y="6"  width="84" height="6"  rx="2" fill={fillSoft} />
      <rect x="4"  y="16" width="34" height="4"  rx="2" fill={fillStrong} />
      <rect x="4"  y="26" width="34" height="22" rx="2" fill={fillSoft} />
      <rect x="42" y="26" width="46" height="12" rx="2" fill={fillStrong} />
      <rect x="42" y="40" width="24" height="6"  rx="2" fill={accent} />
    </svg>
  );
}
