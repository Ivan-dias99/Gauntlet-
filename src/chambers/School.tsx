import { useEffect, useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";

function relativeTime(ts: number, nowMs: number): string {
  const diff = Math.max(0, nowMs - ts);
  const s = Math.floor(diff / 1000);
  if (s < 45) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d}d`;
  return new Date(ts).toLocaleDateString([], { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function School() {
  const { principles, addPrinciple, activeMission } = useSpine();
  const { values } = useTweaks();
  const copy = useCopy();
  const [input, setInput] = useState("");
  const layout = values.schoolLayout;
  const isGoverning = principles.length > 0;
  const lastApplied = activeMission?.events.find((e) => e.type === "doctrine_applied") ?? null;

  // Tick so relative timestamps refresh periodically without a heavy timer.
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const lastInscribedAt = principles.length > 0 ? principles[0].createdAt : null;

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
          {copy.chambers.School.lead}
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
                {principles.length} {principles.length === 1 ? "princípio" : "princípios"} activo{principles.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55 }}>
              Injectados no sistema em cada query de Lab e Creation.
              {activeMission
                ? <> Missão activa: <span style={{ color: "var(--text-secondary)" }}>{activeMission.title}</span>.</>
                : " Nenhuma missão activa — princípios prontos para quando houver."}
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-ghost)", fontFamily: "var(--mono)", letterSpacing: 1, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span>→ Lab · Creation · auto-router</span>
              {lastInscribedAt !== null && (
                <span>
                  última inscrição <span style={{ color: "var(--text-muted)" }}>{relativeTime(lastInscribedAt, nowMs)}</span>
                </span>
              )}
            </div>
            {activeMission && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed var(--border-subtle)", fontSize: 10, color: lastApplied ? "var(--cc-ok)" : "var(--text-ghost)", fontFamily: "var(--mono)", letterSpacing: 1, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ textTransform: "uppercase", letterSpacing: 2 }}>última aplicação:</span>
                {lastApplied ? (
                  <>
                    <span>{lastApplied.label}</span>
                    <span style={{ color: "var(--text-ghost)", marginLeft: "auto" }}>
                      {new Date(lastApplied.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </>
                ) : (
                  <span>nenhuma nesta missão ainda — doutrina existe, mas ainda não governou</span>
                )}
              </div>
            )}
          </div>
        )}

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
              {copy.schoolEmpty}
            </div>
          </div>
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
                  § {String(principles.length - i).padStart(2, "0")}
                  <span style={{ marginLeft: "auto", color: "var(--text-ghost)", textTransform: "none", letterSpacing: 1 }}>
                    {relativeTime(p.createdAt, nowMs)}
                  </span>
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
                  gridTemplateColumns: "44px 1fr",
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
                    style={{
                      fontSize: 10,
                      color: "var(--accent-dim)",
                      fontFamily: "var(--mono)",
                      letterSpacing: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
                  <span
                    style={{
                      fontSize: 9,
                      color: "var(--text-ghost)",
                      fontFamily: "var(--mono)",
                      letterSpacing: 1,
                    }}
                  >
                    {relativeTime(p.createdAt, nowMs)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
  );
}
