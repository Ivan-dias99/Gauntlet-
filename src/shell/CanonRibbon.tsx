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
  const { state, activeMission, switchMission } = useSpine();
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
        <span aria-hidden className="vbar" />
        {missions.length > 0 && (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setOpen((o) => !o)}
              data-mission-pulse-surface
              data-open={open ? "true" : undefined}
              className="btn"
              style={{
                fontSize: 12,
                fontFamily: "var(--sans)",
                maxWidth: 280,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
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
                      data-mission-pulse
                      data-mission-pulse-state={pulseLive ? "live" : "dormant"}
                      aria-hidden
                      className={pulseLive ? "breathe" : undefined}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: pulseLive
                          ? "var(--ember)"
                          : "var(--text-ghost)",
                        boxShadow: pulseLive ? "var(--glow-ember-sm)" : "none",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 140,
                      }}
                    >
                      {activeMission.title}
                    </span>
                    <span
                      data-mission-stats
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9,
                        letterSpacing: 0.8,
                        color: "var(--text-ghost)",
                        flexShrink: 0,
                      }}
                      title={
                        lastArtifactAgoMs !== null
                          ? copy.missionLastArtifact(formatAgo(lastArtifactAgoMs))
                          : copy.missionNoArtifacts
                      }
                    >
                      {openTasks}/{totalTasks}t · {notesCount}n
                    </span>
                    <span aria-hidden style={{ color: "var(--text-ghost)", flexShrink: 0 }}>▾</span>
                  </>
                );
              })() : (
                <>— ▾</>
              )}
            </button>

            {open && (
              <div
                className="fadeIn"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: 260,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-md)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    padding: "8px 14px 6px",
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "var(--text-ghost)",
                    fontFamily: "var(--mono)",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  {copy.missions}
                </div>
                {missions.map((m) => {
                  const isActive = m.id === state.activeMissionId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        switchMission(m.id);
                        setOpen(false);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        background: isActive ? "var(--accent-glow)" : "none",
                        border: "none",
                        borderBottom: "1px solid var(--border-subtle)",
                        padding: "10px 14px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: isActive ? "var(--accent)" : "var(--text-secondary)",
                          marginBottom: 2,
                        }}
                      >
                        {m.title}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-ghost)",
                          fontFamily: "var(--mono)",
                        }}
                      >
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
