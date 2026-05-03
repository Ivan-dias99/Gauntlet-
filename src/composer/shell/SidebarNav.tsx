// Sprint 2 — Sidebar nav, 9-item target shape.
//
// Per the target mock: Home, Context, Compose, Code, Design, Analysis,
// Route, Memory, Settings. No group headers, no hint subtext — icons +
// labels only, with active state. Footer carries collapse arrow, help
// glyphs, and a fake operator profile (Avery Morris · Pro).
//
// Doctrine override (operator-authorized): the operator profile is
// chrome — no auth system exists yet. Models / Permissions / Ledger
// are no longer in the sidebar (they live as sub-routes accessible
// from Settings / right-rail link). Their routes still exist.

import { NavLink } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";
import {
  HomeIcon,
  ContextIcon,
  ComposeIcon,
  CodeIcon,
  DesignIcon,
  AnalysisIcon,
  RouteIcon,
  MemoryIcon,
  SettingsIcon,
  ChevronRightIcon,
  HelpIcon,
  InfoIcon,
} from "./icons";

export type StudioRouteId =
  | "home"
  | "context"
  | "compose"
  | "code"
  | "design"
  | "analysis"
  | "route"
  | "memory"
  | "settings";

export interface StudioNavEntry {
  id: StudioRouteId;
  to: string;
  label: string;
  icon: ReactNode;
  live: boolean;
}

export const STUDIO_NAV: StudioNavEntry[] = [
  { id: "home",     to: "/composer",          label: "Home",     icon: <HomeIcon size={16} />,     live: true  },
  { id: "context",  to: "/composer/context",  label: "Context",  icon: <ContextIcon size={16} />,  live: false },
  { id: "compose",  to: "/composer/compose",  label: "Compose",  icon: <ComposeIcon size={16} />,  live: false },
  { id: "code",     to: "/composer/code",     label: "Code",     icon: <CodeIcon size={16} />,     live: false },
  { id: "design",   to: "/composer/design",   label: "Design",   icon: <DesignIcon size={16} />,   live: false },
  { id: "analysis", to: "/composer/analysis", label: "Analysis", icon: <AnalysisIcon size={16} />, live: false },
  { id: "route",    to: "/composer/route",    label: "Route",    icon: <RouteIcon size={16} />,    live: false },
  { id: "memory",   to: "/composer/memory",   label: "Memory",   icon: <MemoryIcon size={16} />,   live: true  },
  { id: "settings", to: "/composer/settings", label: "Settings", icon: <SettingsIcon size={16} />, live: true  },
];

const asideStyle: CSSProperties = {
  borderRight: "1px solid var(--border-color-soft)",
  background: "color-mix(in oklab, var(--bg-surface) 92%, transparent)",
  padding: "20px 0 16px",
  display: "flex",
  flexDirection: "column",
  position: "sticky",
  top: 0,
  height: "100vh",
  overflow: "hidden",
};

const navStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "8px 12px",
  flex: 1,
  overflow: "auto",
};

const footerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: "12px 16px 0",
  borderTop: "1px solid var(--border-color-soft)",
};

const footerIconRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const footerIconStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 6,
  background: "transparent",
  border: "none",
  color: "var(--text-muted)",
  cursor: "pointer",
};

const userStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  paddingTop: 4,
};

const avatarStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 50%, transparent), color-mix(in oklab, var(--accent) 14%, transparent))",
  border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-primary)",
  fontFamily: "var(--mono)",
  fontSize: 12,
  fontWeight: 600,
  flexShrink: 0,
  position: "relative",
};

const avatarStatusDot: CSSProperties = {
  position: "absolute",
  right: -1,
  bottom: -1,
  width: 9,
  height: 9,
  borderRadius: "50%",
  background: "#7ab48a",
  border: "2px solid var(--bg-surface)",
};

export default function SidebarNav() {
  return (
    <aside style={asideStyle} aria-label="Studio navigation">
      <nav style={navStyle}>
        {STUDIO_NAV.map((entry) => (
          <NavLink
            key={entry.id}
            to={entry.to}
            end={entry.to === "/composer"}
            style={({ isActive }) => navLinkStyle(isActive, entry.live)}
            data-studio-entry={entry.id}
          >
            <span style={iconCellStyle} aria-hidden>{entry.icon}</span>
            <span style={{ flex: 1 }}>{entry.label}</span>
          </NavLink>
        ))}
      </nav>

      <footer style={footerStyle}>
        <div style={footerIconRowStyle}>
          <button type="button" style={footerIconStyle} aria-label="Collapse sidebar">
            <ChevronRightIcon size={16} />
          </button>
          <button type="button" style={footerIconStyle} aria-label="Help">
            <HelpIcon size={16} />
          </button>
          <button type="button" style={footerIconStyle} aria-label="What's new">
            <InfoIcon size={16} />
          </button>
        </div>

        <div style={userStyle}>
          <span style={avatarStyle} aria-hidden>
            AM
            <span style={avatarStatusDot} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>
              Avery Morris
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "var(--t-meta, 11px)",
                letterSpacing: "var(--track-meta, 0.12em)",
                color: "var(--accent)",
                textTransform: "uppercase",
              }}
            >
              Pro
            </span>
          </div>
        </div>
      </footer>
    </aside>
  );
}

const iconCellStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  flexShrink: 0,
  color: "currentColor",
};

function navLinkStyle(isActive: boolean, _isLive: boolean): CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: "var(--radius-sm, 6px)",
    textDecoration: "none",
    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
    background: isActive
      ? "color-mix(in oklab, var(--accent) 12%, transparent)"
      : "transparent",
    border: isActive
      ? "1px solid color-mix(in oklab, var(--accent) 32%, transparent)"
      : "1px solid transparent",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    fontSize: 13.5,
    fontFamily: "var(--sans)",
    fontWeight: 500,
  };
}
