// Fase 1 — Studio sidebar navigation.
//
// 10 items in 3 groups: WORKSPACE / COMPOSE / GOVERNANCE.
// Only Home is wired to a real surface in this fase. The other 9 entries
// route to StudioStub which renders an honest "Coming next" panel — the
// presence of the entry communicates the studio's full surface, the stub
// is honest that the wiring lands in later fases.

import { NavLink } from "react-router-dom";
import type { CSSProperties } from "react";

export type StudioRouteId =
  | "home"
  | "compose"
  | "code"
  | "design"
  | "analysis"
  | "memory"
  | "models"
  | "permissions"
  | "ledger"
  | "settings";

export interface StudioNavEntry {
  id: StudioRouteId;
  to: string;
  label: string;
  hint: string;
  live: boolean;
}

export type StudioNavGroup = {
  group: "WORKSPACE" | "COMPOSE" | "GOVERNANCE";
  entries: StudioNavEntry[];
};

export const STUDIO_NAV: StudioNavGroup[] = [
  {
    group: "WORKSPACE",
    entries: [
      { id: "home", to: "/composer", label: "Home", hint: "Idle · readiness", live: true },
    ],
  },
  {
    group: "COMPOSE",
    entries: [
      { id: "compose",  to: "/composer/compose",  label: "Compose",  hint: "Direct invocation",         live: false },
      { id: "code",     to: "/composer/code",     label: "Code",     hint: "Patch + diff",              live: false },
      { id: "design",   to: "/composer/design",   label: "Design",   hint: "Frames + tokens",           live: false },
      { id: "analysis", to: "/composer/analysis", label: "Analysis", hint: "Reports + charts",          live: false },
    ],
  },
  {
    group: "GOVERNANCE",
    entries: [
      { id: "memory",      to: "/composer/memory",      label: "Memory",      hint: "Failures · spine",        live: false },
      { id: "models",      to: "/composer/models",      label: "Models",      hint: "Routing · gateway",       live: false },
      { id: "permissions", to: "/composer/permissions", label: "Permissions", hint: "Connector × scope",       live: false },
      { id: "ledger",      to: "/composer/ledger",      label: "Ledger",      hint: "Runs · provenance",       live: false },
      { id: "settings",    to: "/composer/settings",    label: "Settings",    hint: "API · runtime · theme",   live: false },
    ],
  },
];

const asideStyle: CSSProperties = {
  borderRight: "var(--border-soft)",
  background: "var(--bg-surface)",
  padding: "20px 0",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  position: "sticky",
  top: 0,
  height: "100vh",
  overflow: "auto",
};

const groupHeaderStyle: CSSProperties = {
  margin: 0,
  padding: "0 20px",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-micro, 9px)",
  letterSpacing: "var(--track-kicker, 0.26em)",
  color: "var(--text-muted)",
  textTransform: "uppercase",
};

export default function SidebarNav() {
  return (
    <aside style={asideStyle} aria-label="Studio navigation">
      <header style={{ padding: "0 20px 12px", borderBottom: "var(--border-soft)" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro, 9px)",
            letterSpacing: "var(--track-kicker, 0.26em)",
            color: "var(--text-muted)",
          }}
        >
          RUBERRA · COMPOSER
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-secondary)" }}>
          Studio
        </p>
      </header>

      {STUDIO_NAV.map((g) => (
        <section key={g.group} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h3 style={groupHeaderStyle}>{g.group}</h3>
          <nav style={{ display: "flex", flexDirection: "column", padding: "0 12px" }}>
            {g.entries.map((entry) => (
              <NavLink
                key={entry.id}
                to={entry.to}
                end={entry.to === "/composer"}
                style={({ isActive }) => navLinkStyle(isActive, entry.live)}
                data-studio-entry={entry.id}
              >
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontWeight: 500 }}>{entry.label}</span>
                  {!entry.live && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "var(--t-micro, 9px)",
                        letterSpacing: "var(--track-meta, 0.12em)",
                        color: "var(--text-ghost, var(--text-muted))",
                        textTransform: "uppercase",
                      }}
                    >
                      next
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontSize: "var(--t-micro, 9px)",
                    letterSpacing: "var(--track-meta, 0.12em)",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {entry.hint}
                </span>
              </NavLink>
            ))}
          </nav>
        </section>
      ))}
    </aside>
  );
}

function navLinkStyle(isActive: boolean, isLive: boolean): CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: "var(--radius-sm, 4px)",
    textDecoration: "none",
    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
    background: isActive ? "var(--bg-elevated)" : "transparent",
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    lineHeight: 1.3,
    opacity: isLive ? 1 : 0.78,
  };
}
