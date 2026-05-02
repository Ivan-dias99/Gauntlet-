// Wave P-39b — top-level layout for non-chamber pages.
//
// Wraps every route except /chambers/* (which keeps its own immersive
// shell with CanonRibbon). Provides the consistent header + footer +
// container so marketing/settings/profile/connectors/plugins/docs all
// look like the same product.

import type { ReactNode } from "react";
import TopNav from "./TopNav";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
  /** Extra CSS class on the outer wrapper for page-specific tweaks. */
  variant?: "default" | "wide" | "hero";
}

export default function PageShell({ children, variant = "default" }: Props) {
  return (
    <div
      data-page-shell
      data-variant={variant}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg, #0a0a0a)",
      }}
    >
      <TopNav />
      <main
        id="main"
        tabIndex={-1}
        style={{
          flex: 1,
          outline: "none",
          // Hero variants drop padding so the landing page can paint
          // edge-to-edge. Default variant pads the content rail.
          padding: variant === "hero" ? 0 : "var(--space-4) 0",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
