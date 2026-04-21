import { useState, useRef, useEffect } from "react";
import { Chamber } from "../spine/types";
import { formatPulse } from "../spine/pulse";
import { useTheme } from "../theme/ThemeContext";
import { useSpine } from "../spine/SpineContext";
import { useCopy } from "../i18n/copy";

export const CHAMBERS: Chamber[] = ["Lab", "Creation", "Memory", "School"];

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
        title={onHome ? "Voltar ao início" : undefined}
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 8,
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          marginRight: 48,
          cursor: onHome ? "pointer" : "default",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => {
          if (onHome) e.currentTarget.style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-primary)";
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
            boxShadow: "0 0 8px color-mix(in oklab, var(--ember) 60%, transparent)",
          }}
        />
      </button>

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
          {copy.chambers[c].label}
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
              title={copy.switchMission}
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
          <button
            onClick={onTweaks}
            title="Tweaks"
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              padding: "7px 12px",
              cursor: "pointer",
              fontFamily: "var(--mono)",
              borderRadius: "var(--radius)",
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
            ⚙ tweaks
          </button>
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
            {copy.newMission}
          </button>
        )}
      </div>
    </header>
  );
}
