import { useState, useRef, useEffect } from "react";
import { Chamber } from "../spine/types";
import { formatPulse } from "../spine/pulse";
import { useTheme } from "../theme/ThemeContext";
import { useSpine } from "../spine/SpineContext";
import { useCopy } from "../i18n/copy";

export const CHAMBERS: Chamber[] = ["Lab", "Creation", "Memory", "School"];

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
  onNew?: () => void;
  onHome?: () => void;
  onTweaks?: () => void;
}

export default function CanonRibbon({ active, onSelect, onNew, onHome, onTweaks }: Props) {
  const { theme, toggle } = useTheme();
  const { state, activeMission, switchMission, syncState, syncError, hydratedFromBackend } = useSpine();
  const copy = useCopy();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const missions = state.missions;
  const themeLabel = theme === "dark" ? "●" : theme === "light" ? "○" : "◐";

  return (
    <header
      style={{
        height: 56,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        paddingLeft: 32,
        paddingRight: 24,
        flexShrink: 0,
        boxShadow: "var(--shadow-sm)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <button
        onClick={onHome}
        disabled={!onHome}
        title={onHome ? copy.homeTitle : undefined}
        className="btn-ghost"
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          marginRight: 48,
          cursor: onHome ? "pointer" : "default",
        }}
      >
        Ruberra
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--ember)",
            display: "inline-block",
            boxShadow: "var(--glow-ember-sm)",
          }}
        />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {CHAMBERS.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={active === c ? "tab tab-active" : "tab"}
          >
            {copy.chambers[c].label}
          </button>
        ))}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
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
        {missions.length > 0 && (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setOpen((o) => !o)}
              data-mission-pulse-surface
              data-open={open ? "true" : undefined}
              className="btn"
              data-variant="mission"
              title={copy.switchMission}
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
                <>— ▾</>
              )}
            </button>

            {open && (
              <div className="fadeIn dropdown-panel">
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
        )}

        {onTweaks && (
          <button onClick={onTweaks} title={copy.retune} className="btn-chip">
            ⚙ tweaks
          </button>
        )}

        <button onClick={toggle} title={copy.themeTitle(theme)} className="btn-icon">
          {themeLabel}
        </button>

        {onNew && (
          <button onClick={onNew} className="btn-chip" data-variant="sans">
            {copy.newMission}
          </button>
        )}
      </div>
    </header>
  );
}
