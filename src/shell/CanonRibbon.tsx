import { useState, useRef, useEffect } from "react";
import { Chamber } from "../spine/types";
import { useTheme } from "../theme/ThemeContext";
import { useSpine } from "../spine/SpineContext";

export const CHAMBERS: Chamber[] = ["Lab", "Creation", "Memory", "School"];

const LABELS: Record<Chamber, string> = {
  Lab: "Investigação",
  Creation: "Construção",
  Memory: "Memória",
  School: "Doutrina",
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
      <span
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          marginRight: 48,
          userSelect: "none",
        }}
      >
        Rubeira
      </span>

      {CHAMBERS.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{
            background: "none",
            border: "none",
            borderBottom:
              active === c ? "1px solid var(--accent)" : "1px solid transparent",
            cursor: "pointer",
            padding: "0 20px",
            height: 56,
            color: active === c ? "var(--accent)" : "var(--text-muted)",
            fontSize: 13,
            fontFamily: "var(--sans)",
            letterSpacing: 0.3,
            transition: "color 0.15s, border-color 0.15s",
            fontWeight: active === c ? 500 : 400,
          }}
        >
          {LABELS[c]}
        </button>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        {missions.length > 0 && (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setOpen((o) => !o)}
              style={{
                background: "none",
                border: `1px solid ${open ? "var(--accent-dim)" : "var(--border)"}`,
                color: open ? "var(--accent)" : "var(--text-secondary)",
                fontSize: 12,
                fontFamily: "var(--sans)",
                padding: "6px 12px",
                cursor: "pointer",
                borderRadius: "var(--radius)",
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s",
              }}
              title="Trocar missão"
            >
              {activeMission?.title ?? "—"} ▾
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
                  Missões
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
                        {LABELS[m.chamber]} · {m.tasks.length}t · {m.notes.length}n
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <button
          onClick={toggle}
          title={`Tema: ${theme}`}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: 14,
            width: 32,
            height: 32,
            cursor: "pointer",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-dim)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          {themeLabel}
        </button>

        {onNew && (
          <button
            onClick={onNew}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              padding: "7px 16px",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              borderRadius: "var(--radius)",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-dim)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            + Missão
          </button>
        )}
      </div>
    </header>
  );
}
