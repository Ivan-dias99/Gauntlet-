import { useState, useRef, useEffect } from "react";
import { Chamber } from "../spine/types";
import { formatPulse } from "../spine/pulse";
import { useSpine } from "../spine/SpineContext";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { useCopy } from "../i18n/copy";

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
}

export default function CanonRibbon({ active, onSelect }: Props) {
  const {
    state, activeMission, switchMission, clearActiveMission,
    syncState, syncError, hydratedFromBackend,
  } = useSpine();
  const backend = useBackendStatus();
  const copy = useCopy();
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
    <header className="canon-ribbon">
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
        <span aria-hidden className="canon-ribbon-doctrine">
          {copy.brandDoctrine}
        </span>
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
        {backend.mode === "mock" && (
          <span
            data-shell-mode="mock"
            title="Backend em modo simulado — toda a inteligência é canned"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "var(--cc-warn)",
              padding: "2px 8px",
              borderRadius: 999,
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
            }}
          >
            mock
          </span>
        )}
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
                    <span className="mission-pill-title">{activeMission.title}</span>
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
                  <span className="mission-pill-title">{copy.newThreadLabel}</span>
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
                      <div className="dropdown-item-title">{m.title}</div>
                      <div className="dropdown-item-meta">
                        {(() => {
                          const pulse = formatPulse(m);
                          const label = copy.chambers[m.chamber].label;
                          return pulse ? `${label} · ${pulse}` : label;
                        })()}
                      </div>
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
