// Wave 8d — Composer surface layout (canonical 4×3 grid).
//
// Faithful to the mockup proportions:
//   row 1: 4 mode panels (idle, context, compose-thumb, code)
//   row 2: design left | active canvas (spans cols 2-3) | analysis right
//   row 3: memory left | route (spans cols 2-3, wide thumbnail) | apply right
//
// The active canvas always lives in cell 2/2-2/3 regardless of which
// mode is selected. Clicking any side panel swaps the canvas content.
// When compose is active, the compose thumbnail panel at 1/3 still
// renders (it is a clickable thumbnail), and the live ComposeCanvas
// renders in the central cell — the redundancy mirrors the mockup.

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { MODES } from "./types";
import type { ComposerMode, ModeDescriptor } from "./types";
import ModePanel from "./panels/ModePanel";
import ComposeCanvas from "./panels/ComposeCanvas";
import RouteCanvas from "./panels/RouteCanvas";
import CodeCanvas from "./panels/CodeCanvas";
import ApplyCanvas from "./panels/ApplyCanvas";
import DesignCanvas from "./panels/DesignCanvas";
import AnalysisCanvas from "./panels/AnalysisCanvas";
import MemoryCanvas from "./panels/MemoryCanvas";
import ModePlaceholder from "./panels/ModePlaceholder";
import PipelineStrip from "./PipelineStrip";
import ConnectionLines from "./visual/ConnectionLines";
import { ensureComposerStyles } from "./visual/tokens";
import Icon from "./visual/Icons";

// Each entry maps a mode → grid placement (gridColumn, gridRow). Compose
// is positioned at 1/3 (top-row thumbnail). The active canvas occupies
// 2/2-2/3 regardless of mode and is rendered separately.
const PANEL_PLACEMENT: Array<{ id: ComposerMode; col: string; row: string }> = [
  { id: "idle",     col: "1",     row: "1" },
  { id: "context",  col: "2",     row: "1" },
  { id: "compose",  col: "3",     row: "1" },
  { id: "code",     col: "4",     row: "1" },
  { id: "design",   col: "1",     row: "2" },
  { id: "analysis", col: "4",     row: "2" },
  { id: "memory",   col: "1",     row: "3" },
  { id: "route",    col: "2 / 4", row: "3" }, // wide
  { id: "apply",    col: "4",     row: "3" },
];

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 28px",
  position: "relative",
  zIndex: 2,
};

const gridShellStyle: CSSProperties = {
  flex: 1,
  position: "relative",
  padding: "28px 28px",
  overflow: "auto",
};

const gridStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
  gridTemplateRows: "minmax(140px, auto) minmax(280px, auto) minmax(140px, auto)",
  gap: 14,
  maxWidth: 1320,
  margin: "0 auto",
};

const canvasCellStyle: CSSProperties = {
  gridColumn: "2 / 4",
  gridRow: "2",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 0,
};

function findMode(id: ComposerMode): ModeDescriptor {
  const found = MODES.find((m) => m.id === id);
  if (!found) throw new Error(`unknown mode: ${id}`);
  return found;
}

export default function ComposerLayout() {
  const [active, setActive] = useState<ComposerMode>("compose");

  useEffect(() => {
    ensureComposerStyles();
  }, []);

  return (
    <div
      data-composer-surface
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header data-top-strip style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span data-pulse-dot aria-hidden />
          <p
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Ruberra · Composer
          </p>
          <span style={{ color: "var(--text-ghost)" }}>·</span>
          <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Super wireframe canónico
          </span>
        </div>
        <Link
          to="/control"
          style={{
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: "1px solid rgba(120,180,255,0.18)",
            borderRadius: 4,
            padding: "6px 12px",
            background: "rgba(94,165,255,0.05)",
          }}
        >
          → Control
        </Link>
      </header>

      <main style={gridShellStyle}>
        <ConnectionLines />

        <div style={gridStyle}>
          {PANEL_PLACEMENT.map(({ id, col, row }) => (
            <ModePanel
              key={id}
              mode={findMode(id)}
              active={active}
              onSelect={setActive}
              cellStyle={{ gridColumn: col, gridRow: row }}
            />
          ))}

          <section style={canvasCellStyle}>
            <div data-composer-halo aria-hidden />
            <CursorDecoration />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: 540,
              }}
            >
              {active === "compose" ? (
                <ComposeCanvas />
              ) : active === "route" ? (
                <RouteCanvas />
              ) : active === "code" ? (
                <CodeCanvas />
              ) : active === "apply" ? (
                <ApplyCanvas />
              ) : active === "design" ? (
                <DesignCanvas />
              ) : active === "analysis" ? (
                <AnalysisCanvas />
              ) : active === "memory" ? (
                <MemoryCanvas />
              ) : (
                <ModePlaceholder mode={active} />
              )}
            </div>
          </section>
        </div>
      </main>

      <PipelineStrip />
    </div>
  );
}

function CursorDecoration() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: -28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <span
        style={{
          color: "var(--text-secondary)",
          filter: "drop-shadow(0 0 6px rgba(94,165,255,0.55))",
          opacity: 0.85,
        }}
      >
        <Icon name="cursor" size={22} strokeWidth={1.2} />
      </span>
    </div>
  );
}
