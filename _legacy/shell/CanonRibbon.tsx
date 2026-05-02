import { useState, useRef, useEffect } from "react";
import { Chamber } from "../spine/types";
import { formatPulse } from "../spine/pulse";
import { useSpine } from "../spine/SpineContext";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { useCopy } from "../i18n/copy";
import { useTweaks, DENSITY_LABEL } from "../tweaks/TweaksContext";

// Wave-2 ribbon.
//
// Five canonical tabs — Insight, Surface, Terminal, Archive, Core —
// backed by a single visual grammar. The theme-cycle button and the
// gear-icon tweak toggle have been removed from the ribbon (they return
// inside Core → System in Wave 4). The explicit "+ Mission" chip has
// been removed too: first-send inside Insight creates a mission
// implicitly, and the mission dropdown carries a "+ nova thread" entry
// for users who already have at least one mission.

export const CHAMBERS: Chamber[] = ["insight", "surface", "terminal", "archive", "core"];

function formatAgo(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
}

interface Props {
  active: Chamber;
  onSelect: (c: Chamber) => void;
  // Wave P-37 — When the host (Shell) detects a narrow viewport it
  // renders a hamburger inside the ribbon and slides the chamber
  // switcher into a drawer. The hamburger sits in the ribbon strip so
  // the brand/right-cluster visual rhythm stays intact; the drawer
  // itself lives in Shell.
  onOpenDrawer?: () => void;
  isMobile?: boolean;
}

export default function CanonRibbon({ active, onSelect, onOpenDrawer, isMobile }: Props) {
  const {
    state, activeMission, switchMission, clearActiveMission,
    setMissionStatus,
    syncState, syncError, hydratedFromBackend,
  } = useSpine();
  const backend = useBackendStatus();
  const copy = useCopy();
  const { values: tweaks, cycleDensity, set: setTweak } = useTweaks();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const missions = state.missions;

  function startNewThread() {
    // Return to Insight and drop the active mission pointer. Insight's
    // first-send path creates a fresh mission on next submit.
    clearActiveMission();
    onSelect("insight");
    setOpen(false);
  }

  return (
    <header className="canon-ribbon" data-mobile={isMobile ? "true" : undefined}>
      {isMobile && onOpenDrawer && (
        <button
          type="button"
          className="canon-ribbon-hamburger"
          onClick={onOpenDrawer}
          aria-label="Open chambers menu"
          aria-haspopup="dialog"
        >
          <span aria-hidden className="canon-ribbon-hamburger-bar" />
          <span aria-hidden className="canon-ribbon-hamburger-bar" />
          <span aria-hidden className="canon-ribbon-hamburger-bar" />
        </button>
      )}
      <span className="canon-ribbon-brand" aria-label="Signal">
        <span
          aria-hidden
          className="canon-ribbon-traffic"
          title="signal status — refused · pending · ready"
        >
          <span className="canon-ribbon-traffic-dot" data-tone="err" />
          <span className="canon-ribbon-traffic-dot" data-tone="warn" />
          <span className="canon-ribbon-traffic-dot" data-tone="ok" />
        </span>
        Signal
      </span>

      <div className="canon-ribbon-tabs">
        {CHAMBERS.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={active === c ? "tab tab-active" : "tab"}
            aria-current={active === c ? "page" : undefined}
          >
            {copy.chambers[c].label}
          </button>
        ))}
      </div>

      <div className="canon-ribbon-right">
        {/* Wave P-43.6 — Chamber position counter (e.g. CHAMBER · 03 / 05).
            Reads the active chamber's index in the canonical CHAMBERS
            array. The label sits before the mock pill so the operator's
            eye lands on identity → state → controls. */}
        <span className="canon-ribbon-counter" aria-hidden>
          <span className="canon-ribbon-counter-label">Chamber</span>
          <span className="canon-ribbon-counter-sep">·</span>
          <span className="canon-ribbon-counter-value">
            {String(CHAMBERS.indexOf(active) + 1).padStart(2, "0")}
          </span>
          <span className="canon-ribbon-counter-sep">/</span>
          <span className="canon-ribbon-counter-total">
            {String(CHAMBERS.length).padStart(2, "0")}
          </span>
        </span>
        <span aria-hidden className="vbar" />
        {backend.mode === "mock" && (
          <span
            data-shell-mode="mock"
            title="Backend em modo simulado — toda a inteligência é canned"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "var(--cc-warn)",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
            }}
          >
            mock
          </span>
        )}
        {/* Wave P-43.4 — Theme toggle (sun/moon). Cycles dark↔light;
            sepia is reachable via Core/Customize for power users. The
            paired-button design mirrors the Lovable target. */}
        <div className="canon-ribbon-theme" role="group" aria-label="Theme">
          <button
            type="button"
            className="canon-ribbon-theme-btn"
            data-active={tweaks.theme === "light" ? "true" : undefined}
            onClick={() => setTweak("theme", "light")}
            aria-label="Light theme"
            title="Light theme"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M4.93 4.93 L6.34 6.34 M17.66 17.66 L19.07 19.07 M4.93 19.07 L6.34 17.66 M17.66 6.34 L19.07 4.93" />
            </svg>
          </button>
          <button
            type="button"
            className="canon-ribbon-theme-btn"
            data-active={tweaks.theme === "dark" ? "true" : undefined}
            onClick={() => setTweak("theme", "dark")}
            aria-label="Dark theme"
            title="Dark theme"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          </button>
        </div>
        <span aria-hidden className="vbar" />
        <span
          className="spine-sync"
          data-sync-state={syncState}
          title={(() => {
            const base = copy.spineSyncTitle(syncState);
            const parts = [base];
            if (hydratedFromBackend === false) {
              parts.push("backend não respondeu na hidratação");
            }
            if (syncError) {
              parts.push(
                syncError.kind === "unreachable"
                  ? "último push: backend inacessível"
                  : `último push: ${syncError.envelope?.error ?? "erro do backend"}`,
              );
            }
            return parts.join(" · ");
          })()}
          aria-live="polite"
        >
          <span aria-hidden className="spine-sync-dot" />
          {copy.spineSyncLabel(syncState)}
        </span>
        <span aria-hidden className="vbar" />
        {/* Wave P-37 — density toggle. Cycles cosy → comfortable → compact.
            Persisted via TweaksContext (signal:tweaks). The glyph shows
            three stacked bars whose vertical gap mirrors the active
            density so the icon itself communicates the current state
            without copy. */}
        <button
          type="button"
          onClick={cycleDensity}
          className="btn-icon canon-ribbon-density"
          data-density-state={tweaks.density}
          aria-label={`Density: ${DENSITY_LABEL[tweaks.density]} (click to cycle)`}
          title={`Density: ${DENSITY_LABEL[tweaks.density]}`}
        >
          <span aria-hidden className="canon-ribbon-density-glyph">
            <span />
            <span />
            <span />
          </span>
        </button>
        <span aria-hidden className="vbar" />
        {missions.length > 0 ? (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setOpen((o) => !o)}
              data-mission-pulse-surface
              data-open={open ? "true" : undefined}
              data-chamber={activeMission?.chamber ?? undefined}
              className="btn"
              data-variant="mission"
              title={copy.switchMission}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              {/* Wave P-34 — Mission switch crossfade.
                  The inner title span carries a key tied to the active
                  mission id; remounting on switch reruns the
                  motion-cross-fade animation (120ms opacity ramp).
                  Avoiding display:contents because it strips the
                  element from the layout tree and breaks opacity
                  inheritance. The .mission-pill-title is already the
                  load-bearing copy of the pill, so cross-fading just
                  the title reads as the whole pill morphing without
                  the layout-disturbing wrapper. Reduced-motion users
                  skip the fade via the global @media kill switch. */}
              {activeMission ? (() => {
                const openTasks = activeMission.tasks.filter(
                  (t) => t.state !== "done"
                ).length;
                const totalTasks = activeMission.tasks.length;
                const notesCount = activeMission.notes.length;
                const lastArtifactAgoMs = activeMission.lastArtifact
                  ? Date.now() - activeMission.lastArtifact.acceptedAt
                  : null;
                const pulseLive = openTasks > 0;
                return (
                  <>
                    <span
                      aria-hidden
                      className={pulseLive ? "mission-pill-dot breathe" : "mission-pill-dot"}
                      data-state={pulseLive ? "live" : "dormant"}
                    />
                    <span
                      key={activeMission.id}
                      className="mission-pill-title motion-cross-fade"
                    >
                      {activeMission.title}
                    </span>
                    <span
                      className="mission-pill-meta"
                      title={
                        lastArtifactAgoMs !== null
                          ? copy.missionLastArtifact(formatAgo(lastArtifactAgoMs))
                          : copy.missionNoArtifacts
                      }
                    >
                      {openTasks}/{totalTasks}t · {notesCount}n
                    </span>
                    <span aria-hidden className="mission-pill-caret">▾</span>
                  </>
                );
              })() : (
                <>
                  <span aria-hidden className="mission-pill-dot" data-state="dormant" />
                  <span className="mission-pill-title motion-cross-fade">{copy.newThreadLabel}</span>
                  <span aria-hidden className="mission-pill-caret">▾</span>
                </>
              )}
            </button>

            {open && (
              <div className="fadeIn dropdown-panel">
                <button
                  onClick={startNewThread}
                  className="dropdown-item"
                  data-new-thread
                  style={{ borderBottom: "1px solid var(--border-soft)" }}
                >
                  <div className="dropdown-item-title">+ {copy.newThreadLabel}</div>
                  <div className="dropdown-item-meta">{copy.newThreadHint}</div>
                </button>
                <div className="dropdown-header">{copy.missions}</div>
                {missions.map((m) => {
                  const isActive = m.id === state.activeMissionId;
                  // Wave C UI consumer — render the mission lifecycle
                  // status as a small pill next to the title, except for
                  // "active" (the default and most common state, no badge
                  // needed). Operators get a glance at which threads are
                  // paused, brainstorm-only, archived or completed.
                  const statusLabel: Record<string, string> = {
                    paused: "paused",
                    brainstorm: "brainstorm",
                    archived: "archived",
                    completed: "completed",
                    closed: "closed",
                  };
                  const pillLabel = statusLabel[m.status];
                  // Wave P-2 UI consumer — surface the lifecycle setter as
                  // small action buttons inline with the mission. Buttons
                  // available depend on the current status (terminal
                  // states have none). stopPropagation keeps the wrapping
                  // <button> from firing switchMission when an inner
                  // action is clicked.
                  type Action = { label: string; to: import("../spine/types").MissionStatus };
                  const actions: Action[] =
                    m.status === "active"
                      ? [
                          { label: "pause",    to: "paused" },
                          { label: "archive",  to: "archived" },
                          { label: "complete", to: "completed" },
                        ]
                      : m.status === "paused"
                      ? [
                          { label: "resume",  to: "active" },
                          { label: "archive", to: "archived" },
                        ]
                      : m.status === "brainstorm"
                      ? [{ label: "promote to active", to: "active" }]
                      : [];
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        switchMission(m.id);
                        setOpen(false);
                      }}
                      className="dropdown-item"
                      data-active={isActive ? "true" : undefined}
                    >
                      <div
                        className="dropdown-item-title"
                        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
                      >
                        <span>{m.title}</span>
                        {pillLabel && (
                          <span
                            data-mission-status-pill={m.status}
                            style={{
                              fontSize: "0.65em",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              padding: "1px 6px",
                              borderRadius: "var(--radius-full)",
                              border: "1px solid currentColor",
                              opacity: 0.65,
                            }}
                          >
                            {pillLabel}
                          </span>
                        )}
                      </div>
                      <div className="dropdown-item-meta">
                        {(() => {
                          const pulse = formatPulse(m);
                          const label = copy.chambers[m.chamber].label;
                          return pulse ? `${label} · ${pulse}` : label;
                        })()}
                      </div>
                      {actions.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            marginTop: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          {actions.map((a) => (
                            <span
                              key={a.to}
                              role="button"
                              tabIndex={0}
                              data-mission-status-action={a.to}
                              onClick={(e) => {
                                e.stopPropagation();
                                setMissionStatus(m.id, a.to);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMissionStatus(m.id, a.to);
                                }
                              }}
                              style={{
                                fontSize: "0.7em",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-sm)",
                                border: "1px solid currentColor",
                                opacity: 0.7,
                                cursor: "pointer",
                                userSelect: "none",
                              }}
                            >
                              {a.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
