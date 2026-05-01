// Wave P-39b — global top navigation.
//
//   ┌───────────────────────────────────────────────────────────────┐
//   │ signal · chambers · connectors · plugins · docs   ⌘K  · 👤 ▾  │
//   └───────────────────────────────────────────────────────────────┘
//
// Brand on the left. Primary nav (chambers · connectors · plugins ·
// docs) center-left. Right cluster: ⌘K trigger button + avatar
// dropdown. Active route is highlighted.

import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown";

const PRIMARY_NAV: ReadonlyArray<{ to: string; label: string }> = [
  { to: "/chambers", label: "chambers" },
  { to: "/connectors", label: "conectores" },
  { to: "/plugins", label: "plugins" },
  { to: "/docs", label: "docs" },
];

export default function TopNav() {
  return (
    <header
      data-top-nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-2) var(--space-4)",
        borderBottom: "1px solid var(--border-soft)",
        background: "var(--bg, #0a0a0a)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* brand */}
      <Link
        to="/landing"
        data-top-nav-brand
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-prominent)",
          fontWeight: "var(--weight-medium)",
          letterSpacing: "var(--track-display)",
          color: "var(--text-primary)",
          textDecoration: "none",
        }}
      >
        signal
      </Link>

      {/* primary nav */}
      <nav
        data-top-nav-primary
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-1)",
          flex: 1,
        }}
      >
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `top-nav-link${isActive ? " is-active" : ""}`}
            style={({ isActive }) => ({
              padding: "var(--space-1) var(--space-3)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: isActive ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: isActive
                ? "1px solid var(--accent, currentColor)"
                : "1px solid transparent",
              textDecoration: "none",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* right cluster: ⌘K trigger + avatar */}
      <CmdKButton />
      <AvatarDropdown />
    </header>
  );
}

function CmdKButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // The CommandPalette currently mounts inside ChambersPage's Shell.
        // For non-chamber pages, dispatching the same keydown so any global
        // listener can react. P-39c will hoist the palette to PageShell-level.
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
        );
      }}
      title="⌘K · paleta de comandos"
      style={{
        padding: "var(--space-1) var(--space-2)",
        fontFamily: "var(--mono)",
        fontSize: "var(--t-meta)",
        letterSpacing: "var(--track-meta)",
        color: "var(--text-muted)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-sm)",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      ⌘K
    </button>
  );
}
