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
    <div style={{ padding: "40px 56px", maxWidth: 720, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#3a3530", marginBottom: 32 }}>
        School · Doutrina
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 40, alignItems: "center" }}>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Novo princípio ou crença..."
          style={{
            flex: 1, background: "none", border: "none",
            borderBottom: "1px solid #222", outline: "none",
            fontSize: 14, color: "#e8e4df", padding: "6px 0",
            fontFamily: "system-ui, sans-serif",
          }}
        />
        <button onClick={submit} style={btn}>+</button>
      </div>

      {!principles.length && (
        <p style={{ fontSize: 13, color: "#3a3530" }}>Nenhum princípio registado.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {principles.map((p, i) => (
          <div key={p.id} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <span style={{ fontSize: 10, color: "#3a3530", minWidth: 20, marginTop: 3 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 14, color: "#a09880", lineHeight: 1.7 }}>
              {p.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "none", border: "1px solid #2a2520",
  color: "#c4b89a", width: 32, height: 32, flexShrink: 0,
  cursor: "pointer", fontSize: 18, borderRadius: 2,
};
