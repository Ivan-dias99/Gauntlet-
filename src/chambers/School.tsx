import { useState } from "react";
import { useSpine } from "../spine/SpineContext";

export default function School() {
  const { principles, addPrinciple } = useSpine();
  const [input, setInput] = useState("");

  function submit() {
    const v = input.trim();
    if (!v) return;
    addPrinciple(v);
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
          School
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Doutrina · Constituição · Princípio
        </span>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "32px 40px" }}>
        {principles.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-ghost)", fontStyle: "italic" }}>
            Sem princípios registados. A constituição está em branco.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 660 }}>
          {principles.map((p, i) => (
            <div key={p.id} style={{
              display: "grid",
              gridTemplateColumns: "36px 1fr",
              gap: "0 20px",
              padding: "18px 0",
              borderBottom: "1px solid var(--border-subtle)",
              alignItems: "flex-start",
            }}>
              <span style={{
                fontSize: 10,
                color: "var(--accent-dim)",
                fontFamily: "var(--mono)",
                letterSpacing: 1,
                paddingTop: 3,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7 }}>
                {p.text}
              </span>
            </div>
          ))}
        </div>
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
          placeholder="Novo princípio..."
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 14, color: "var(--text-primary)",
            fontFamily: "var(--sans)",
          }}
        />
      </div>
    </div>
  );
}
