// Wave P-43.4 — ChamberIdleShell.
//
// Unified empty layout shared by all five chambers when there is
// nothing yet to render (no mission, no run, no policies, no
// artifacts). Mirrors the target Lovable mockups: rail (240px) with
// chamber identity card + Workbench-active nav + Recents +
// Customize, center column with a small workbench header bar +
// editorial hero + shortcut chips, sidecar (~360px) with idle
// preview state.
//
// The idle shell is a full chamber replacement — chambers conditionally
// render <ChamberIdleShell chamber="..."/> at the top of their tree
// when their isIdle predicate fires. Otherwise the legacy active
// layout takes over. This keeps every working code path intact and
// only changes what the operator sees in the empty case.

import type { Chamber } from "../spine/types";
import { CHAMBER_CONFIG } from "./chamber-config";

interface Props {
  chamber: Chamber;
}

export default function ChamberIdleShell({ chamber }: Props) {
  const config = CHAMBER_CONFIG[chamber];
  const Sigil = config.sigil;

  const navItems = [
    { label: "Workbench",       glyph: "▦", active: true },
    ...config.navItems.map((n) => ({ ...n, active: false })),
    { label: "Recents",          glyph: "◷", active: false },
    { label: "Customize",        glyph: "⚙", active: false },
  ];

  return (
    <div className="cis" data-chamber={chamber}>
      {/* Rail (left, 240px) */}
      <aside className="cis-rail" aria-label={`${config.label} navigation`}>
        <div className="cis-rail-identity">
          <span aria-hidden className="cis-rail-identity-glyph">
            <Sigil />
          </span>
          <span className="cis-rail-identity-label">{config.label}</span>
        </div>
        <nav className="cis-rail-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="cis-rail-nav-item"
              data-active={item.active ? "true" : undefined}
              aria-current={item.active ? "page" : undefined}
            >
              <span aria-hidden className="cis-rail-nav-glyph">{item.glyph}</span>
              <span className="cis-rail-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="cis-rail-footer">
          {config.label} · WORKBENCH
        </div>
      </aside>

      {/* Center workbench (1fr) */}
      <section className="cis-center" aria-label={`${config.label} workbench`}>
        <header className="cis-center-head">
          <span className="cis-center-head-left">
            {config.label} · WORKBENCH · NO MISSION
          </span>
          <span className="cis-center-head-right">{config.tagline}</span>
        </header>
        <div className="cis-center-body">
          <h1 className="cis-hero-title">{config.heroTitle}</h1>
          <p className="cis-hero-body">{config.heroBody}</p>
          <div className="cis-hero-chips" aria-hidden>
            <span className="cis-hero-chip">⌘K Command</span>
            <span className="cis-hero-chip">⌘↵ Send</span>
            <span className="cis-hero-chip">⌘I Import</span>
          </div>
        </div>
      </section>

      {/* Sidecar (right, ~360px) */}
      <aside className="cis-sidecar" aria-label={`${config.label} sidecar`}>
        <header className="cis-sidecar-head">
          <span className="cis-sidecar-head-left">PREVIEW</span>
          <span className="cis-sidecar-head-right">EMPTY</span>
        </header>
        <div className="cis-sidecar-body">
          <span aria-hidden className="cis-sidecar-glyph">
            <Sigil />
          </span>
          <span className="cis-sidecar-kicker">SIDECAR IDLE</span>
          <p className="cis-sidecar-body-text">{config.sidecarBody}</p>
        </div>
      </aside>
    </div>
  );
}
