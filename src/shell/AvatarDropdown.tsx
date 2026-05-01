// Wave P-39b — avatar dropdown in TopNav right cluster.
//
// Menu: profile · settings · sign out (placeholder). Closes on Esc,
// click-outside, or item activation. Real auth flows land in P-43.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const MENU_ITEMS: ReadonlyArray<
  | { kind: "link"; to: string; label: string }
  | { kind: "divider" }
  | { kind: "action"; label: string; tone?: "danger" }
> = [
  { kind: "link", to: "/profile", label: "perfil" },
  { kind: "link", to: "/settings", label: "definições" },
  { kind: "divider" },
  { kind: "action", label: "sair", tone: "danger" },
];

export default function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      data-avatar-dropdown
      style={{ position: "relative" }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="conta"
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-soft)",
          background: "var(--surface-soft, transparent)",
          color: "var(--text-primary)",
          fontFamily: "var(--mono)",
          fontSize: "var(--t-meta)",
          cursor: "pointer",
        }}
      >
        op
      </button>
      {open && (
        <ul
          role="menu"
          data-avatar-menu
          style={{
            position: "absolute",
            top: "calc(100% + var(--space-1))",
            right: 0,
            margin: 0,
            padding: "var(--space-1)",
            listStyle: "none",
            minWidth: 180,
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-md)",
            background: "var(--bg, #0a0a0a)",
            boxShadow: "var(--shadow-md, 0 6px 20px rgba(0,0,0,0.4))",
            zIndex: 60,
          }}
        >
          {MENU_ITEMS.map((item, i) => {
            if (item.kind === "divider") {
              return (
                <li
                  key={`divider-${i}`}
                  aria-hidden
                  style={{
                    height: 1,
                    background: "var(--border-soft)",
                    margin: "var(--space-1) 0",
                  }}
                />
              );
            }
            const sharedStyle = {
              display: "block",
              width: "100%",
              padding: "var(--space-2)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-meta)",
              textAlign: "left" as const,
              border: 0,
              background: "transparent",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              color:
                item.kind === "action" && item.tone === "danger"
                  ? "var(--danger, #d04a4a)"
                  : "var(--text-primary)",
              textDecoration: "none",
            };
            if (item.kind === "link") {
              return (
                <li key={item.to} role="none">
                  <Link
                    to={item.to}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    style={sharedStyle}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.label} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  style={sharedStyle}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
