// ChamberWorkspace — two/three-pane primitive that matches the target
// design from the Lovable mockups. Replaces the legacy stack of
// ChamberHead + sub-tabs band + content card with a single grid:
//
//   [ Rail (240px, optional) │ Workbench (1fr) │ Sidecar (0.6fr, optional) ]
//
// Each chamber composes the slots it needs. Terminal uses Rail +
// Workbench. Surface uses Workbench + Sidecar. Insight can use all
// three. The grid collapses gracefully on narrower viewports — sidecar
// hides below 1280px, rail collapses to icons below 1024px and slides
// behind the mobile drawer below 720px.
//
// The primitive owns NO state. Chambers feed children; visual contract
// stays one source of truth.
//
// Wave P-43 — first slice toward the target two-pane workspace.

import type { ReactNode } from "react";

interface RailProps {
  /** Identity card at the top of the rail (icon + title + tagline). */
  identity?: ReactNode;
  /** Primary CTA below the identity card (e.g. "+ New mission"). */
  cta?: ReactNode;
  /** Vertical nav items — already rendered as buttons by the chamber. */
  nav?: ReactNode;
  /** Optional secondary list (e.g. RECENTS section). */
  secondary?: ReactNode;
}

interface SidecarProps {
  /** Tabs row at the top — IDE-style file tabs or chamber lenses. */
  tabs?: ReactNode;
  /** Sub-tabs row below the tabs (e.g. Designs · Examples · Design systems). */
  subTabs?: ReactNode;
  /** Right-side actions in the tab bar (e.g. Share, Present, Inspector). */
  actions?: ReactNode;
  /** Main content area of the sidecar. */
  body: ReactNode;
}

interface Props {
  /** Optional left rail. Omit for sidecar-only layouts. */
  rail?: RailProps;
  /** Required main column — composer + hero + sessions. */
  workbench: ReactNode;
  /** Optional right sidecar — preview, files, inspector. */
  sidecar?: SidecarProps;
  /** Breadcrumb above the workspace, e.g. "— TERMINAL · code · agent loop". */
  breadcrumb?: ReactNode;
  /** Chamber identifier — drives data-chamber for theming. */
  chamber: string;
}

export default function ChamberWorkspace({
  rail,
  workbench,
  sidecar,
  breadcrumb,
  chamber,
}: Props) {
  const variant = rail && sidecar ? "triple" : rail ? "rail" : sidecar ? "sidecar" : "single";

  return (
    <div className="chamber-workspace" data-chamber={chamber} data-variant={variant}>
      {breadcrumb && <div className="chamber-workspace-breadcrumb">{breadcrumb}</div>}
      <div className="chamber-workspace-grid">
        {rail && (
          <aside className="cw-rail" aria-label={`${chamber} navigation`}>
            {rail.identity && <div className="cw-rail-identity">{rail.identity}</div>}
            {rail.cta && <div className="cw-rail-cta">{rail.cta}</div>}
            {rail.nav && <nav className="cw-rail-nav">{rail.nav}</nav>}
            {rail.secondary && <div className="cw-rail-secondary">{rail.secondary}</div>}
          </aside>
        )}
        <section className="cw-workbench" aria-label={`${chamber} workbench`}>
          {workbench}
        </section>
        {sidecar && (
          <aside className="cw-sidecar" aria-label={`${chamber} sidecar`}>
            {(sidecar.tabs || sidecar.actions) && (
              <div className="cw-sidecar-tabs-row">
                {sidecar.tabs && <div className="cw-sidecar-tabs">{sidecar.tabs}</div>}
                {sidecar.actions && <div className="cw-sidecar-actions">{sidecar.actions}</div>}
              </div>
            )}
            {sidecar.subTabs && <div className="cw-sidecar-subtabs">{sidecar.subTabs}</div>}
            <div className="cw-sidecar-body">{sidecar.body}</div>
          </aside>
        )}
      </div>
    </div>
  );
}

interface RailIdentityProps {
  glyph: ReactNode;
  title: string;
  tagline: string;
}

export function RailIdentity({ glyph, title, tagline }: RailIdentityProps) {
  return (
    <div className="cw-rail-identity-card">
      <span aria-hidden className="cw-rail-identity-glyph">{glyph}</span>
      <div className="cw-rail-identity-text">
        <span className="cw-rail-identity-title">{title}</span>
        <span className="cw-rail-identity-tagline">{tagline}</span>
      </div>
    </div>
  );
}

interface RailNavItemProps {
  active?: boolean;
  glyph?: ReactNode;
  label: string;
  onClick?: () => void;
}

export function RailNavItem({ active, glyph, label, onClick }: RailNavItemProps) {
  return (
    <button
      type="button"
      className="cw-rail-nav-item"
      data-active={active ? "true" : undefined}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {glyph && <span aria-hidden className="cw-rail-nav-glyph">{glyph}</span>}
      <span className="cw-rail-nav-label">{label}</span>
    </button>
  );
}

interface RailSectionProps {
  label: string;
  children: ReactNode;
}

export function RailSection({ label, children }: RailSectionProps) {
  return (
    <div className="cw-rail-section">
      <div className="cw-rail-section-label">{label}</div>
      <div className="cw-rail-section-body">{children}</div>
    </div>
  );
}
