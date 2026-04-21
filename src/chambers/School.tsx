import { useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";
import EmptyState from "../shell/EmptyState";

function toRoman(n: number): string {
  if (n <= 0) return "";
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let x = n;
  for (const [v, s] of map) {
    while (x >= v) { out += s; x -= v; }
  }
  return out;
}

export default function School() {
  const { principles, addPrinciple, activeMission } = useSpine();
  const { values } = useTweaks();
  const copy = useCopy();
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const layout = values.schoolLayout;
  const isGoverning = principles.length > 0;

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
          — DOUTRINA SOBERANA
        </span>
        <span style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          princípios que vinculam lab e construção
        </span>
        {principles.length > 0 && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: isGoverning ? "var(--accent)" : "var(--text-ghost)",
              fontFamily: "var(--mono)",
              letterSpacing: 1.5,
            }}
          >
            {principles.length} §
          </span>
        )}
      </div>

      <div style={{
        flex: 1, overflow: "auto",
        padding: "calc(32px * var(--density, 1)) clamp(20px, 5vw, 64px)",
      }}>

        {/* Governance status panel */}
        {isGoverning && (
          <div
            className="fadeIn"
            style={{
              marginBottom: 28,
              padding: "12px 16px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "2px solid var(--accent-dim)",
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 20%, transparent)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "var(--mono)" }}>
                VIGOR CONSTITUCIONAL · {principles.length} {principles.length === 1 ? "artigo" : "artigos"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55 }}>
              Injectados no sistema em cada query de Lab e Creation.
              {activeMission
                ? <> Missão activa: <span style={{ color: "var(--text-secondary)" }}>{activeMission.title}</span>.</>
                : " Nenhuma missão activa — princípios prontos para quando houver."}
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-ghost)", fontFamily: "var(--mono)", letterSpacing: 1 }}>
              → Lab · Creation · auto-router
            </div>
          </div>
        )}

        {principles.length === 0 && (
          <EmptyState
            glyph="§"
            kicker="— Constituição em branco"
            body={copy.schoolEmpty}
            hint="inscreve o primeiro artigo abaixo"
            style={{ marginTop: "10vh" }}
          />
        )}

        {layout === "tablets" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {principles.map((p, i) => (
              <div
                key={p.id}
                className="fadeUp"
                style={{
                  animationDelay: `${i * 40}ms`,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius)",
                  padding: "18px 20px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--accent-dim)",
                    fontFamily: "var(--mono)",
                    letterSpacing: 2,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {isGoverning && (
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
                  )}
                  <span data-article-roman>§ {toRoman(principles.length - i)}</span>
                </div>
                <div style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6 }}>
                  {p.text}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 720 }}>
            {principles.map((p, i) => (
              <div
                key={p.id}
                className="fadeUp"
                style={{
                  animationDelay: `${i * 35}ms`,
                  display: "grid",
                  gridTemplateColumns: "64px 1fr",
                  gap: "0 20px",
                  padding: "18px 0",
                  borderBottom: "1px solid var(--border-subtle)",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    paddingTop: 3,
                  }}
                >
                  {isGoverning && (
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 2px color-mix(in oklab, var(--accent) 20%, transparent)" }} />
                  )}
                  <span
                    data-article-roman
                    style={{
                      fontSize: 11,
                      color: "var(--accent-dim)",
                      fontFamily: "var(--mono)",
                      letterSpacing: 1.5,
                    }}
                  >
                    § {toRoman(i + 1)}
                  </span>
                </div>
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
        )}
      </div>

      <div
        data-architect-input="principio"
        data-architect-input-state={inputFocused ? "focused" : "idle"}
        style={{ margin: "0 clamp(20px, 5vw, 64px) 18px" }}
      >
        <div
          data-architect-voice
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: inputFocused ? "var(--accent)" : "var(--text-ghost)",
            marginBottom: 8,
            paddingLeft: 4,
            transition: "color 0.15s",
          }}
        >
          — PRINCÍPIO
        </div>
      <div
        className="glass"
        style={{
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
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={copy.schoolPlaceholder}
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
            {copy.schoolInscribe}
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
