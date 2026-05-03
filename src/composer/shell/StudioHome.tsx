// Sprint 2 — Studio Home (Idle / Dormant Mode), full target clone.
//
// Split layout: hero + tiles on the left rail, Permissions & Privacy
// panel anchored to the right. The hero, the chip, and the 3-card row
// stack vertically; the right rail holds the permissions panel sticky
// to the top of the scroll area.

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
  gap: 22,
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
