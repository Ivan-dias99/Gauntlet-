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
      <div
        style={{
          padding: "20px 40px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
          }}
        >
          School
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Doutrina · Constituição · Princípio
        </span>
        {principles.length > 0 && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: "var(--text-ghost)",
              fontFamily: "var(--mono)",
              letterSpacing: 1.5,
            }}
          >
            {principles.length} {principles.length === 1 ? "princípio" : "princípios"}
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "32px clamp(20px, 5vw, 64px)" }}>
        {principles.length === 0 && (
          <div style={{ alignSelf: "center", textAlign: "center", maxWidth: 520, marginTop: "10vh" }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".4em",
                color: "var(--text-ghost)",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              — Constituição em branco
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: "italic",
                fontSize: 22,
                lineHeight: 1.4,
                color: "var(--text-muted)",
                letterSpacing: "-0.005em",
              }}
            >
              Sem princípios registados. A doutrina aguarda o primeiro axioma.
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 720 }}>
          {principles.map((p, i) => (
            <div
              key={p.id}
              className="fadeUp"
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr",
                gap: "0 20px",
                padding: "18px 0",
                borderBottom: "1px solid var(--border-subtle)",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "var(--accent-dim)",
                  fontFamily: "var(--mono)",
                  letterSpacing: 1,
                  paddingTop: 3,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 15,
                  color: "var(--text-primary)",
                  lineHeight: 1.7,
                  fontFamily: "'Fraunces', Georgia, serif",
                }}
              >
                {p.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="glass"
        style={{
          margin: "0 clamp(20px, 5vw, 64px) 18px",
          borderRadius: 14,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ color: "var(--accent-dim)", fontSize: 14 }}>›</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Novo princípio..."
          style={{
            flex: 1,
            fontSize: 14,
            color: "var(--text-primary)",
            fontFamily: "var(--sans)",
            padding: "6px 0",
          }}
        />
        {input.trim() && (
          <button
            onClick={submit}
            className="fadeIn"
            style={{
              background: "none",
              border: "1px solid var(--accent-dim)",
              color: "var(--accent)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: 999,
              fontFamily: "var(--mono)",
              cursor: "pointer",
              transition: "all .2s var(--ease-swift)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Inscrever
          </button>
        )}
      </div>
    </div>
  );
}
