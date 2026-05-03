// Sprint 1 — Studio Home (Idle / Dormant Mode).
//
// Layout:
//   * Left column (flex 1): hero (orb + pillars + chip + tip) →
//     3-col grid of real-data tiles directly below the chip.
//   * Right column (320px): Permissions & Privacy panel.
//
// The Expand button on the hero chip scrolls the tiles into view via
// the tilesRef — never navigates. Pure scroll behaviour.

import { useCallback, useRef } from "react";
import type { CSSProperties } from "react";
import IdleHero from "./IdleHero";
import RecentCommands from "./RecentCommands";
import LastUsedTools from "./LastUsedTools";
import ReadinessStatus from "./ReadinessStatus";
import PermissionsPanel from "./PermissionsPanel";

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 320px)",
  gap: 28,
  alignItems: "start",
};

const leftStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
  minWidth: 0,
};

const tilesStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
  scrollMarginTop: 24,
};

export default function StudioHome() {
  const tilesRef = useRef<HTMLDivElement>(null);

  const onExpand = useCallback(() => {
    tilesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div style={wrapStyle} data-studio-home>
      <div style={leftStyle}>
        <IdleHero onExpand={onExpand} />
        <div ref={tilesRef} style={tilesStyle} data-studio-tiles>
          <RecentCommands />
          <LastUsedTools />
          <ReadinessStatus />
        </div>
      </div>
      <PermissionsPanel />
    </div>
  );
}
