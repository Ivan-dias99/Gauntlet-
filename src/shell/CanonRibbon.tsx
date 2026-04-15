import { useState, useRef, useEffect } from "react";
import { Chamber } from "../spine/types";
import { useTheme } from "../theme/ThemeContext";
import { useSpine } from "../spine/SpineContext";

export const CHAMBERS: Chamber[] = ["Lab", "Creation", "Memory", "School"];

const LABELS: Record<Chamber, string> = {
  Lab:      "Investigação",
  Creation: "Construção",
  Memory:   "Memória",
  School:   "Doutrina",
};

interface Props {
  active: Chamber;
  onSelect: (c: Chamber) => void;
  onNew?: () => void;
}

export default function CanonRibbon({ active, onSelect, onNew }: Props) {
  const { theme, toggle } = useTheme();
  const { state, activeMission, switchMission } = useSpine();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const missions = state.missions;

  return (
    <header style={{
      height: 48,
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      paddingLeft: 24,
      paddingRight: 20,
      flexShrink: 0,
      boxShadow: "var(--shadow-sm)",
      position: "relative",
      zIndex: 10,
    }}>
      <span style={{
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "var(--text-ghost)",
        fontFamily: "var(--mono)",
        marginRight: 32,
        userSelect: "none",
      }}>
        RUBERRA
      </span>

      {CHAMBERS.map(c => (
        <button key={c} onClick={() => onSelect(c)} style={{
          background: "none",
          border: "none",
          borderBottom: active === c ? "1px solid var(--accent)" : "1px solid transparent",
          cursor: "pointer",
          padding: "0 18px",
          height: 48,
          color: active === c ? "var(--accent)" : "var(--text-muted)",
          fontSize: 12,
          fontFamily: "var(--sans)",
          letterSpacing: 0.3,
          transition: "color 0.15s",
          fontWeight: active === c ? 500 : 400,
        }}>
          {LABELS[c]}
        </button>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>

        {/* Mission switcher */}
        {missions.length > 0 && (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: open ? "var(--accent)" : "var(--text-ghost)",
                fontSize: 11,
                fontFamily: "var(--mono)",
                padding: "4px 10px",
                cursor: "pointer",
                borderRadius: "var(--radius)",
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s",
                borderColor: open ? "var(--accent-dim)" : "var(--border)",
              }}
              title="Trocar missão"
            >
              {activeMission?.title ?? "—"} ▾
            </button>

            {open && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: 240,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow-md)",
                overflow: "hidden",
                zIndex: 100,
              }}>
                <div style={{
                  padding: "8px 14px 6px",
                  fontSize: 9,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "var(--text-ghost)",
                  fontFamily: "var(--mono)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}>
                  Missões
                </div>
                {missions.map(m => {
                  const isActive = m.id === state.activeMissionId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => { switchMission(m.id); setOpen(false); }}
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
                      <div style={{
                        fontSize: 13,
                        color: isActive ? "var(--accent)" : "var(--text-secondary)",
                        marginBottom: 2,
                      }}>
                        {m.title}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: "var(--text-ghost)",
                        fontFamily: "var(--mono)",
                      }}>
                        {LABELS[m.chamber]} · {m.tasks.length}t · {m.notes.length}n
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Theme toggle */}
        <button onClick={toggle} title={theme === "dark" ? "Light" : "Dark"} style={{
          background: "none",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: 13,
          width: 28,
          height: 28,
          cursor: "pointer",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {theme === "dark" ? "○" : "●"}
        </button>

        {onNew && (
          <button onClick={onNew} style={{
            background: "none",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            padding: "5px 14px",
            cursor: "pointer",
            fontFamily: "var(--sans)",
            borderRadius: "var(--radius)",
          }}>
            + Missão
          </button>
        )}
      </div>
    </header>
  );
}
