// Sprint 3 — Sidebar nav with live footer behaviours.
//
// 9-item target shape (Home, Context, Compose, Code, Design, Analysis,
// Route, Memory, Settings). Footer carries:
//   * collapse arrow — toggles icon-only mode (sidebar shrinks to 60px)
//   * theme toggle — flips data-theme on <html> (dark ↔ light premium)
//   * help — opens documentation popover
//   * info — opens "what's new" popover
//   * operator profile — clickable, navigates to /composer/settings
//
// Operator avatar (Avery Morris · Pro) is chrome — no auth wired yet.

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  SunIcon,
  MoonIcon,
} from "./icons";
import { useTheme } from "./useTheme";

export type StudioRouteId =
  | "home" | "context" | "compose" | "code" | "design"
  | "analysis" | "route" | "memory" | "settings";

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

const userButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 6px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "inherit",
  textAlign: "left",
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

const popoverStyle: CSSProperties = {
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: 12,
  width: 248,
  background: "color-mix(in oklab, var(--bg-surface) 96%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-md, 8px)",
  boxShadow:
    "0 0 0 1px color-mix(in oklab, var(--accent) 14%, transparent), 0 18px 50px rgba(0, 0, 0, 0.45)",
  padding: "12px 14px",
  zIndex: 30,
};

type PopId = "help" | "info" | null;

export default function SidebarNav() {
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [pop, setPop] = useState<PopId>(null);

  const asideStyle: CSSProperties = {
    borderRight: "1px solid var(--border-color-soft)",
    background: "color-mix(in oklab, var(--bg-surface) 92%, transparent)",
    padding: "20px 0 16px",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "visible",
    width: collapsed ? 64 : "100%",
    transition: "width var(--motion-duration-fast, 140ms)",
  };

  return (
    <aside style={asideStyle} aria-label="Studio navigation">
      <nav style={navStyle}>
        {STUDIO_NAV.map((entry) => (
          <NavLink
            key={entry.id}
            to={entry.to}
            end={entry.to === "/composer"}
            style={({ isActive }) => navLinkStyle(isActive, collapsed)}
            data-studio-entry={entry.id}
            title={collapsed ? entry.label : undefined}
          >
            <span style={iconCellStyle} aria-hidden>{entry.icon}</span>
            {!collapsed && <span style={{ flex: 1 }}>{entry.label}</span>}
          </NavLink>
        ))}
      </nav>

      <footer style={{ ...footerStyle, position: "relative" }}>
        <div style={footerIconRowStyle}>
          <button
            type="button"
            style={footerIconStyle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span style={{ display: "inline-block", transform: collapsed ? "none" : "rotate(180deg)" }}>
              <ChevronRightIcon size={16} />
            </span>
          </button>
          <button
            type="button"
            style={footerIconStyle}
            aria-label="Toggle theme"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light premium" : "Switch to dark premium"}
          >
            {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
          {!collapsed && (
            <>
              <button
                type="button"
                style={footerIconStyle}
                aria-label="Help"
                onClick={() => setPop((p) => (p === "help" ? null : "help"))}
                title="Help"
              >
                <HelpIcon size={16} />
              </button>
              <button
                type="button"
                style={footerIconStyle}
                aria-label="What's new"
                onClick={() => setPop((p) => (p === "info" ? null : "info"))}
                title="What's new"
              >
                <InfoIcon size={16} />
              </button>
            </>
          )}
        </div>

        {pop === "help" && (
          <div style={popoverStyle} role="dialog" aria-label="Help">
            <p style={popHeader}>Help</p>
            <p style={popBody}>
              Studio is the standalone surface for Composer. The cursor
              capsule (Alt+Space) remains the primary product. For
              shortcuts, settings, and ledger inspection, you're in the
              right place.
            </p>
            <button
              type="button"
              style={popButton}
              onClick={() => {
                setPop(null);
                navigate("/composer/settings");
              }}
            >
              Open Settings
            </button>
          </div>
        )}

        {pop === "info" && (
          <div style={popoverStyle} role="dialog" aria-label="What's new">
            <p style={popHeader}>What's new</p>
            <p style={popBody}>
              Studio Sprint 3 — premium hover, theme toggle, all
              navigation now leads somewhere. Memory and Settings are
              live; Compose / Code / Design / Analysis / Route / Context
              are next.
            </p>
            <button
              type="button"
              style={popButton}
              onClick={() => {
                setPop(null);
                navigate("/composer/overview");
              }}
            >
              Open Overview
            </button>
          </div>
        )}

        <button
          type="button"
          style={userButtonStyle}
          onClick={() => navigate("/composer/settings")}
          title="Open profile settings"
        >
          <span style={avatarStyle} aria-hidden>
            AM
            <span style={avatarStatusDot} />
          </span>
          {!collapsed && (
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
          )}
        </button>
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

const popHeader: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-kicker, 0.26em)",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const popBody: CSSProperties = {
  margin: "8px 0 12px",
  fontSize: 12.5,
  color: "var(--text-secondary)",
  lineHeight: 1.55,
};

const popButton: CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 12px",
  background: "transparent",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-sm, 4px)",
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
  fontSize: 12,
  cursor: "pointer",
};

function navLinkStyle(isActive: boolean, collapsed: boolean): CSSProperties {
  return {
    padding: collapsed ? "10px 0" : "10px 12px",
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
    justifyContent: collapsed ? "center" : "flex-start",
    gap: 12,
    fontSize: 13.5,
    fontFamily: "var(--sans)",
    fontWeight: 500,
  };
}
