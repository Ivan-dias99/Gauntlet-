import { useState, useRef, useEffect } from "react";
import { useSpine } from "../spine/SpineContext";

export default function Lab() {
  const { activeMission, addNote } = useSpine();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const notes = [...(activeMission?.notes ?? [])].reverse();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMission?.notes.length]);

  function submit() {
    const v = input.trim();
    if (!v) return;
    addNote(v);
    setInput("");
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      <div style={{
        padding: "20px 40px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "baseline",
        gap: 12,
      }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)" }}>
          Lab
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Investigação · Evidência · Verdade
        </span>
      </div>

      {/* Message area */}
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: "24px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        {notes.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-ghost)", fontStyle: "italic", marginTop: 8 }}>
            Sem evidências. Comece a investigar.
          </div>
        )}
        {notes.map(n => (
          <div key={n.id} style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            boxShadow: "var(--shadow-sm)",
            maxWidth: 680,
          }}>
            <div style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.65 }}>
              {n.text}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-ghost)", marginTop: 8, letterSpacing: 0.3 }}>
              {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              &nbsp;·&nbsp;
              {new Date(n.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "16px 40px",
        background: "var(--bg-surface)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <span style={{ color: "var(--accent-dim)", fontSize: 14 }}>›</span>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Nova evidência ou análise..."
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 14, color: "var(--text-primary)",
            fontFamily: "var(--sans)",
          }}
        />
        {input.trim() && (
          <button onClick={submit} style={{
            background: "none", border: "1px solid var(--border)",
            color: "var(--accent)", fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", padding: "6px 14px",
            cursor: "pointer", borderRadius: "var(--radius)",
          }}>
            Enter
          </button>
        )}
      </div>
    </div>
  );
}
