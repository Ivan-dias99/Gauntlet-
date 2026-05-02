// Wave 1 — Composer layout (canonical surface fiel à Foto 3).
//
// Three-column grid: 4 mode panels stacked left, central canvas, 4 mode
// panels stacked right. Bottom: pipeline strip. Active mode controls
// what the central column renders — Compose is wired end-to-end, the
// other 8 modes render ModePlaceholder.

import { useState } from "react";
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
import ModePlaceholder from "./panels/ModePlaceholder";
import PipelineStrip from "./PipelineStrip";

// Split the 8 non-compose modes evenly across the two side columns.
// Order roughly mirrors Foto 3 (input-side panels first on the left,
// downstream panels on the right).
const LEFT_MODES: ComposerMode[] = ["idle", "context", "route", "memory"];
const RIGHT_MODES: ComposerMode[] = ["code", "design", "analysis", "apply"];

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderBottom: "var(--border-soft)",
  background: "var(--bg-surface)",
};

const gridStyle: CSSProperties = {
  flex: 1,
  display: "grid",
  gridTemplateColumns: "minmax(220px, 280px) minmax(0, 1fr) minmax(220px, 280px)",
  gap: 16,
  padding: 24,
  overflow: "auto",
  alignItems: "start",
};

const columnStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

function findMode(id: ComposerMode): ModeDescriptor {
  const found = MODES.find((m) => m.id === id);
  if (!found) throw new Error(`unknown mode: ${id}`);
  return found;
}

export default function ComposerLayout() {
  const [active, setActive] = useState<ComposerMode>("compose");

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--sans)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      data-composer-surface
    >
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            aria-hidden
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "var(--accent, #4a7cff)",
              boxShadow: "0 0 14px var(--accent, #4a7cff)",
            }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-kicker)",
              color: "var(--text-muted)",
            }}
          >
            RUBERRA · COMPOSER
          </p>
          <span style={{ color: "var(--text-muted)" }}>·</span>
          <span style={{ fontSize: 14, color: "var(--text-primary)" }}>Wave 1 surface</span>
        </div>
        <Link
          to="/control"
          style={{
            color: "var(--text-secondary, var(--text-muted))",
            textDecoration: "none",
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            border: "var(--border-soft)",
            borderRadius: "var(--radius-sm, 4px)",
            padding: "6px 12px",
          }}
        >
          → Control
        </Link>
      </header>

      <main style={gridStyle}>
        <aside style={columnStyle} aria-label="left mode panels">
          {LEFT_MODES.map((id) => (
            <ModePanel key={id} mode={findMode(id)} active={active} onSelect={setActive} />
          ))}
        </aside>

        <section style={{ ...columnStyle, gap: 16 }}>
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
          ) : (
            <ModePlaceholder mode={active} />
          )}
        </section>

        <aside style={columnStyle} aria-label="right mode panels">
          {RIGHT_MODES.map((id) => (
            <ModePanel key={id} mode={findMode(id)} active={active} onSelect={setActive} />
          ))}
        </aside>
      </main>

      <PipelineStrip />
    </div>
  );
}
