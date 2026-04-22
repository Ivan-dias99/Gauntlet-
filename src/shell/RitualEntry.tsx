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
  const [inputFocused, setInputFocused] = useState(false);

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

        <div
          data-architect-input="missao"
          data-architect-input-state={inputFocused ? "focused" : "idle"}
          style={{ marginBottom: 48 }}
        >
          <div
            data-architect-voice
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: inputFocused ? "var(--accent)" : "var(--text-ghost)",
              marginBottom: 12,
              transition: "color 0.15s",
            }}
          >
            {copy.ritualMissionVoice}
          </div>
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={e => e.key === "Enter" && commit()}
            placeholder={copy.missionName}
            style={{
              width: "100%", background: "none",
              border: "none",
              borderBottom: `1px solid ${inputFocused ? "var(--accent-dim)" : "var(--border)"}`,
              outline: "none", fontSize: 26, color: "var(--text-primary)",
              padding: "6px 0 20px",
              fontFamily: "var(--sans)", letterSpacing: "-0.5px",
              transition: "border-color 0.15s",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 48 }}>
          {ORDER.map(id => {
            const c = copy.chambers[id];
            const active = chamber === id;
            return (
              <button key={id} onClick={() => setChamber(id)} style={{
                background: active ? "var(--bg-elevated)" : "var(--bg-surface)",
                border: `1px solid ${active ? "var(--accent-dim)" : "var(--border-soft)"}`,
                borderRadius: "var(--radius-control)",
                padding: "16px 16px",
                cursor: "pointer", textAlign: "left",
                boxShadow: active ? "var(--shadow-soft)" : "none",
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

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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
              borderRadius: "var(--radius-control)", transition: "all 0.15s",
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
