// Fase 1 — Studio Home (Idle / Dormant Mode).
//
// Composes the orb hero, three real-data tiles, and the permissions
// summary panel. Every tile here either reads from a real backend
// endpoint or derives from one — there is no mock data with badges.
//
// Layout: 2-column main split — content on the left, permissions on
// the right. The grid tiles below the hero share /runs once the
// hooks are split into a context (Fase 2+).

import type { CSSProperties } from "react";
import IdleHero from "./IdleHero";
import RecentCommands from "./RecentCommands";
import LastUsedTools from "./LastUsedTools";
import ReadinessStatus from "./ReadinessStatus";
import PermissionsPanel from "./PermissionsPanel";

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 320px)",
  gap: 24,
  alignItems: "start",
};

const leftStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
  minWidth: 0,
};

const tilesStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

export default function StudioHome() {
  return (
    <div style={wrapStyle} data-studio-home>
      <div style={leftStyle}>
        <IdleHero />
        <div style={tilesStyle}>
          <RecentCommands />
          <LastUsedTools />
          <ReadinessStatus />
        </div>
      </div>
      <PermissionsPanel />
    </div>
  );
}
