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
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  // Codex review #282 (P1): the CommandPalette mounts only inside Shell on
  // /chambers/* routes, but TopNav (which carries this button) only renders
  // outside chambers via PageShell. The synthetic keydown was being fired
  // into a window that had no listener — visible affordance, no effect.
  //
  // Honest fix: outside chambers, the button navigates to /chambers/insight
  // and signals the Shell (via a `?palette=1` query) to open the palette
  // on mount. Inside chambers (where this button does not currently render)
  // the existing ⌘K keyboard shortcut keeps working as before.
  const navigate = useNavigate();
  const location = useLocation();
  const inChambers = location.pathname.startsWith("/chambers");
  return (
    <button
      type="button"
      onClick={() => {
        if (inChambers) {
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
          );
        } else {
          navigate("/chambers/insight?palette=1");
        }
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
