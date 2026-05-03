// Wave 8 — Composer surface layout (visual revision).
//
// Three-column grid: 4 stacked side panels left, central canvas, 4
// stacked side panels right. The grid sits on top of an absolutely-
// positioned ConnectionLines SVG layer that draws glow curves from the
// inner edge of each side panel toward the central composer node.
//
// All visual treatment (glow borders, palette, pulse, gradients) is
// scoped to [data-composer-surface] via ensureComposerStyles() so the
// /control surface keeps its own operator-console look.

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

const LEFT_MODES: ComposerMode[] = ["idle", "context", "memory", "apply"];
const RIGHT_MODES: ComposerMode[] = ["code", "design", "analysis", "route"];

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
  padding: "32px 28px",
  overflow: "auto",
};

const gridStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "minmax(240px, 290px) minmax(0, 1fr) minmax(240px, 290px)",
  gap: 22,
  alignItems: "stretch",
};

const columnStyle: CSSProperties = {
  display: "grid",
  gridTemplateRows: "repeat(4, minmax(170px, 1fr))",
  gap: 16,
  minHeight: 720,
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
          <aside style={columnStyle} aria-label="left mode panels">
            {LEFT_MODES.map((id) => (
              <ModePanel
                key={id}
                mode={findMode(id)}
                active={active}
                onSelect={setActive}
              />
            ))}
          </aside>

          <section
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 580,
              position: "relative",
            }}
          >
            <CursorDecoration />
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
          </section>

          <aside style={columnStyle} aria-label="right mode panels">
            {RIGHT_MODES.map((id) => (
              <ModePanel
                key={id}
                mode={findMode(id)}
                active={active}
                onSelect={setActive}
              />
            ))}
          </aside>
        </div>
      </main>

      <PipelineStrip />
    </div>
  );
}

// Decorative cursor + node above the central canvas, mirroring the
// Foto 3 detail. Pointer-events disabled so it does not interfere with
// the canvas interaction beneath.
function CursorDecoration() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: -22,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
        zIndex: 1,
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
