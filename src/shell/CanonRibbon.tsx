import { Chamber } from "../spine/types";
import { useTheme } from "../theme/ThemeContext";

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
  missionTitle?: string;
  onNew?: () => void;
}

export default function CanonRibbon({ active, onSelect, missionTitle, onNew }: Props) {
  const { theme, toggle } = useTheme();

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
        {missionTitle && (
          <span style={{
            fontSize: 11,
            color: "var(--text-ghost)",
            maxWidth: 180,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "var(--mono)",
          }}>
            {missionTitle}
          </span>
        )}

        {/* Theme toggle */}
        <button onClick={toggle} title={theme === "dark" ? "Mudar para Light" : "Mudar para Dark"} style={{
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
          transition: "color 0.15s, border-color 0.15s",
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
            transition: "color 0.15s, border-color 0.15s",
          }}>
            + Missão
          </button>
        )}
      </div>
    </header>
  );
}
