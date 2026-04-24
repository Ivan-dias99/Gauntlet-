import type { SurfaceBriefPayload } from "../../hooks/useSignal";

// Two fidelity tiles — wireframe / hi-fi. The thumbs are inline SVG
// strokes so there's no image asset to ship and the geometry scales
// with the chamber DNA. Active tile gets a chamber-DNA ring; idle
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
        gap: 8,
      }}
    >
      <Tile
        label="Wireframe"
        sub="estrutura · esqueleto · ritmo"
        active={value === "wireframe"}
        onClick={() => onChange("wireframe")}
      >
        <WireframeThumb />
      </Tile>
      <Tile
        label="Alta fidelidade"
        sub="material · tipografia · cor"
        active={value === "hi-fi"}
        onClick={() => onChange("hi-fi")}
      >
        <HiFiThumb />
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
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 8,
        background: active ? "var(--bg-elevated)" : "var(--bg-surface)",
        border: active
          ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 58%, var(--border-color-mid))"
          : "var(--border-soft)",
        borderRadius: "var(--radius-control)",
        boxShadow: active
          ? "0 0 0 1px color-mix(in oklab, var(--chamber-dna, var(--accent)) 28%, transparent) inset"
          : "none",
        cursor: "pointer",
        textAlign: "left",
        transition:
          "background var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-fast) var(--ease-swift)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 68,
          background: active
            ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 6%, var(--bg-input))"
            : "var(--bg-input)",
          border: "var(--border-soft)",
          borderRadius: "calc(var(--radius-control) - 4px)",
        }}
      >
        {children}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: "var(--t-body-sec)",
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
            color: "var(--text-ghost)",
          }}
        >
          {sub}
        </span>
      </span>
    </button>
  );
}

function WireframeThumb() {
  // Flat rectangles + dashed line — a "skeleton" reading at first glance.
  const line = "color-mix(in oklab, var(--text-muted) 55%, transparent)";
  return (
    <svg width="84" height="48" viewBox="0 0 84 48" fill="none" aria-hidden>
      <rect x="4"  y="6"  width="30" height="6"  rx="1" stroke={line} strokeWidth="1" />
      <rect x="4"  y="16" width="46" height="4"  rx="1" stroke={line} strokeWidth="1" />
      <rect x="4"  y="24" width="32" height="20" rx="1" stroke={line} strokeWidth="1" strokeDasharray="2 2" />
      <rect x="40" y="24" width="40" height="20" rx="1" stroke={line} strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function HiFiThumb() {
  // Filled blocks, one accent bar — the "material" reading.
  const fillSoft   = "color-mix(in oklab, var(--text-primary) 14%, transparent)";
  const fillStrong = "color-mix(in oklab, var(--text-primary) 28%, transparent)";
  const accent     = "color-mix(in oklab, var(--chamber-dna, var(--accent)) 70%, transparent)";
  return (
    <svg width="84" height="48" viewBox="0 0 84 48" fill="none" aria-hidden>
      <rect x="4"  y="6"  width="76" height="6"  rx="2" fill={fillSoft} />
      <rect x="4"  y="16" width="30" height="4"  rx="2" fill={fillStrong} />
      <rect x="4"  y="24" width="30" height="20" rx="2" fill={fillSoft} />
      <rect x="38" y="24" width="42" height="10" rx="2" fill={fillStrong} />
      <rect x="38" y="36" width="20" height="6"  rx="2" fill={accent} />
    </svg>
  );
}
