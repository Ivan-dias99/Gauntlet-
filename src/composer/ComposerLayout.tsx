/**
 * ComposerLayout — the studio of Ruberra Composer.
 *
 * Single house: top bar (StudioHeader) + sidebar (SidebarNav) + main
 * outlet + footer status bar (StatusBar). Every operator surface that
 * used to live under the deleted /control/* layout is mounted as a
 * /composer/* nested route.
 *
 * Doctrine override (operator-authorized): the studio chrome (header,
 * sidebar, status bar) carries elements that don't bind to backend
 * signals — Quick Summon shortcut, window controls, operator avatar,
 * Sparkline / System Load / Memory Usage tiles. They match the target
 * mock 1:1 and are clearly marked in their files.
 */

import { Outlet } from "react-router-dom";
import type { CSSProperties } from "react";
import StudioHeader from "./shell/StudioHeader";
import SidebarNav from "./shell/SidebarNav";
import StatusBar from "./shell/StatusBar";

const rootStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "232px minmax(0, 1fr)",
  gridTemplateRows: "auto 1fr auto",
  minHeight: "100vh",
  background: "var(--studio-backdrop, var(--bg))",
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
};

const headerCellStyle: CSSProperties = {
  gridColumn: "1 / span 2",
  gridRow: "1",
};

const sidebarCellStyle: CSSProperties = {
  gridColumn: "1",
  gridRow: "2 / span 2",
};

const mainStyle: CSSProperties = {
  gridColumn: "2",
  gridRow: "2",
  padding: "28px 32px 28px",
  overflow: "auto",
  minWidth: 0,
};

const statusCellStyle: CSSProperties = {
  gridColumn: "2",
  gridRow: "3",
};

export default function ComposerLayout() {
  return (
    <div style={rootStyle} data-composer-studio>
      <div style={headerCellStyle}>
        <StudioHeader />
      </div>
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
