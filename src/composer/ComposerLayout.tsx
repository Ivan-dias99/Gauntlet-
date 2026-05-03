/**
 * ComposerLayout — the studio of Ruberra Composer.
 *
 * The cursor capsule (apps/browser-extension) is the primary product
 * surface — where 80% of work happens, in context, without leaving
 * the user's app.
 *
 * This studio is the secondary surface — where Composer operations
 * are inspected, configured, audited, and operated standalone when
 * no host app provides context.
 *
 * Both surfaces consume the same backend, share the same design
 * tokens, and (Fase 4+) operate the same sessions. The capsule is
 * compact because the studio exists. The studio exists because some
 * work genuinely needs depth.
 *
 * If a user finds themselves opening the studio for work that should
 * fit in the capsule, the capsule has failed its function. The
 * studio justifies existing only because it makes the capsule more
 * powerful — never as a replacement for it.
 *
 * Fase 1 ships only the Idle Mode at /composer (StudioHome). Every
 * other sidebar entry routes to a StudioStub — honest about which
 * fase activates the wiring.
 */

import { Outlet } from "react-router-dom";
import type { CSSProperties } from "react";
import SidebarNav from "./shell/SidebarNav";
import StatusBar from "./shell/StatusBar";

const rootStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "240px minmax(0, 1fr)",
  gridTemplateRows: "1fr auto",
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
};

const sidebarCellStyle: CSSProperties = {
  gridColumn: "1",
  gridRow: "1 / span 2",
};

const mainStyle: CSSProperties = {
  gridColumn: "2",
  gridRow: "1",
  padding: "32px 40px 40px",
  overflow: "auto",
  minWidth: 0,
};

const statusCellStyle: CSSProperties = {
  gridColumn: "2",
  gridRow: "2",
};

export default function ComposerLayout() {
  return (
    <div style={rootStyle} data-composer-studio>
      <div style={sidebarCellStyle}>
        <SidebarNav />
      </div>
      <main style={mainStyle}>
        <Outlet />
      </main>
      <div style={statusCellStyle}>
        <StatusBar />
      </div>
    </div>
  );
}
