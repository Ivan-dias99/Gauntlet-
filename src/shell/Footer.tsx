// Wave P-39b — global footer for non-chamber pages.
//
// Slim row: build SHA · status · doctrine links. Build SHA is injected
// at build time via Vite's `import.meta.env` (see vite.config.ts /
// VITE_BUILD_SHA). Falls back to "dev" when running locally.

import { Link } from "react-router-dom";

const BUILD_SHA: string =
  (import.meta.env?.VITE_BUILD_SHA as string | undefined)?.slice(0, 7) ?? "dev";

const FOOTER_LINKS: ReadonlyArray<{ to: string; label: string }> = [
  { to: "/docs", label: "docs" },
  { to: "/settings", label: "definições" },
  { to: "/connectors", label: "conectores" },
];

export default function Footer() {
  return (
    <footer
      data-page-footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
        borderTop: "1px solid var(--border-soft)",
        fontFamily: "var(--mono)",
        fontSize: "var(--t-meta)",
        letterSpacing: "var(--track-meta)",
        color: "var(--text-muted)",
        background: "var(--bg, #0a0a0a)",
      }}
    >
      <span data-footer-build>
        signal · build {BUILD_SHA}
      </span>
      <nav
        data-footer-links
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        {FOOTER_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {l.label}
          </Link>
        ))}
        <span aria-hidden style={{ opacity: 0.5 }}>·</span>
        <span data-footer-status title="status do sistema">
          ● operacional
        </span>
      </nav>
    </footer>
  );
}
