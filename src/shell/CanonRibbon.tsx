import { Chamber } from "../spine/types";

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
}

export default function CanonRibbon({ active, onSelect, missionTitle }: Props) {
  return (
    <header style={{
      height: 48,
      background: "#0c0c0c",
      borderBottom: "1px solid #1c1c1c",
      display: "flex",
      alignItems: "center",
      paddingLeft: 24,
      paddingRight: 24,
      flexShrink: 0,
    }}>
      <span style={{
        color: "#3a3530",
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
        fontFamily: "system-ui, sans-serif",
        marginRight: 32,
        userSelect: "none",
      }}>
        RUBERRA
      </span>

      {CHAMBERS.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{
            background: "none",
            border: "none",
            borderBottom: active === c ? "1px solid #c4b89a" : "1px solid transparent",
            cursor: "pointer",
            padding: "0 20px",
            height: 48,
            color: active === c ? "#d4c8b0" : "#4a4540",
            fontSize: 13,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 0.2,
            transition: "color 0.12s",
          }}
        >
          {LABELS[c]}
        </button>
      ))}

      {missionTitle && (
        <span style={{
          marginLeft: "auto",
          fontSize: 11,
          color: "#3a3530",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: 0.3,
          maxWidth: 260,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {missionTitle}
        </span>
      )}
    </header>
  );
}
