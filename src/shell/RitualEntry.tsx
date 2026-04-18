import { useState } from "react";
import { Chamber } from "../spine/types";
import { useSpine } from "../spine/SpineContext";
import { useCopy } from "../i18n/copy";

const ORDER: Chamber[] = ["Lab", "Creation", "Memory", "School"];

interface Props {
  onDone?: () => void;
}

export default function RitualEntry({ onDone }: Props) {
  const { createMission } = useSpine();
  const copy = useCopy();
  const [title, setTitle] = useState("");
  const [chamber, setChamber] = useState<Chamber | null>(null);

  const ready = title.trim().length > 0 && chamber !== null;

  function commit() {
    if (!ready) return;
    createMission(title, chamber!);
    onDone?.();
  }

  return (
    <div style={{
      height: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: 540, padding: "0 40px" }}>

        <div style={{
          fontSize: 10, letterSpacing: 3,
          color: "var(--text-ghost)", textTransform: "uppercase",
          fontFamily: "var(--mono)",
          marginBottom: 52,
        }}>
          {copy.ritualTag}
        </div>

        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && commit()}
          placeholder={copy.missionName}
          style={{
            width: "100%", background: "none",
            border: "none", borderBottom: "1px solid var(--border)",
            outline: "none", fontSize: 26, color: "var(--text-primary)",
            padding: "6px 0 20px", marginBottom: 48,
            fontFamily: "var(--sans)", letterSpacing: "-0.5px",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 48 }}>
          {ORDER.map(id => {
            const c = copy.chambers[id];
            const active = chamber === id;
            return (
              <button key={id} onClick={() => setChamber(id)} style={{
                background: active ? "var(--bg-elevated)" : "var(--bg-surface)",
                border: `1px solid ${active ? "var(--accent-dim)" : "var(--border-subtle)"}`,
                borderRadius: "var(--radius)",
                padding: "14px 18px",
                cursor: "pointer", textAlign: "left",
                boxShadow: active ? "var(--shadow-sm)" : "none",
                transition: "all 0.12s",
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 500,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  marginBottom: 5,
                }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-ghost)", letterSpacing: 0.3 }}>
                  {c.sub}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            onClick={commit}
            disabled={!ready}
            style={{
              background: ready ? "var(--accent-glow)" : "none",
              border: `1px solid ${ready ? "var(--accent)" : "var(--border)"}`,
              color: ready ? "var(--accent)" : "var(--text-ghost)",
              fontSize: 11, letterSpacing: 2.5,
              textTransform: "uppercase", padding: "12px 36px",
              cursor: ready ? "pointer" : "default",
              fontFamily: "var(--sans)",
              borderRadius: "var(--radius)", transition: "all 0.15s",
            }}
          >
            {copy.enter}
          </button>

          {onDone && (
            <button onClick={onDone} style={{
              background: "none", border: "none",
              color: "var(--text-ghost)", fontSize: 12,
              cursor: "pointer",
            }}>
              {copy.cancel}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
