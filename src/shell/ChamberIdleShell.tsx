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

import type { Chamber, Mission } from "../spine/types";
import { useSpine } from "../spine/SpineContext";
import { CHAMBER_CONFIG } from "./chamber-config";

interface Props {
  chamber: Chamber;
}

function titleCase(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

function formatAge(ts: number): string {
  const ms = Date.now() - ts;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function missionMeta(m: Mission): string {
  const tasks = m.tasks?.length ?? 0;
  const open = m.tasks?.filter((t) => t.state !== "done").length ?? 0;
  const parts: string[] = [];
  if (tasks > 0) parts.push(`${open}/${tasks}t`);
  parts.push(formatAge(m.lastArtifact?.acceptedAt ?? m.createdAt));
  return parts.join(" · ");
}

export default function ChamberIdleShell({ chamber }: Props) {
  const config = CHAMBER_CONFIG[chamber];
  const Sigil = config.sigil;
  const { state, switchMission } = useSpine();
  const recents = state.missions.filter((m) => m.chamber === chamber).slice(0, 4);

  const navItems = [
    { label: "Workbench", glyph: "▦", active: true },
    ...config.navItems.map((n) => ({ ...n, active: false })),
    { label: "Customize", glyph: "⚙", active: false },
  ];

  return (
    <div className="cis" data-chamber={chamber}>
      {/* Rail (left, 240px) */}
      <aside className="cis-rail" aria-label={`${config.label} navigation`}>
        <div className="cis-rail-identity">
          <span aria-hidden className="cis-rail-identity-glyph">
            <Sigil />
          </span>
          <div className="cis-rail-identity-text">
            <span className="cis-rail-identity-title">{titleCase(config.label)}</span>
            <span className="cis-rail-identity-tagline">{config.taglineRail ?? config.tagline}</span>
          </div>
          <button
            type="button"
            className="cis-rail-search"
            aria-label="Search rail"
            title="Search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16 L20 20" />
            </svg>
          </button>
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
        {/* Recents section — sourced from spine.missions filtered by
            this chamber. When empty, calm "no sessions yet" line.
            Promoted from a nav item to its own section in P-43.6. */}
        <div className="cis-rail-section">
          <div className="cis-rail-section-label">RECENTS</div>
          {recents.length === 0 ? (
            <div className="cis-rail-section-empty">no sessions yet</div>
          ) : (
            <div className="cis-rail-recents">
              {recents.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="cis-rail-recent"
                  onClick={() => switchMission(m.id)}
                  title={m.title}
                >
                  <span aria-hidden className="cis-rail-recent-glyph">┊</span>
                  <span className="cis-rail-recent-text">
                    <span className="cis-rail-recent-title">{m.title}</span>
                    <span className="cis-rail-recent-meta">{missionMeta(m)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User card — operator identity + plan + settings cog. Sits
            at the bottom of the rail, above the chamber breadcrumb. */}
        <div className="cis-rail-user">
          <span className="cis-rail-user-id" aria-hidden>id</span>
          <div className="cis-rail-user-meta">
            <span className="cis-rail-user-name">Operator</span>
            <span className="cis-rail-user-plan">PLAN · MAX</span>
          </div>
          <button
            type="button"
            className="cis-rail-user-cog"
            aria-label="Settings"
            title="Settings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

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
          <span className="cis-hero-kicker" aria-hidden>
            <span className="cis-hero-kicker-glyph"><Sigil /></span>
            <span className="cis-hero-kicker-label">
              {config.label} · WORKBENCH
            </span>
          </span>
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
