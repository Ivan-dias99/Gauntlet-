import { useEffect, useState } from "react";
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

const PRINCIPLE_MAX_LEN = 300;

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

function normalizeForDedup(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

export default function School() {
  const { principles, addPrinciple, activeMission } = useSpine();
  const { values } = useTweaks();
  const copy = useCopy();
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [rejection, setRejection] = useState<null | "duplicate" | "empty" | "tooLong">(null);
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

  const trimmed = input.trim();
  const isDuplicate = !!trimmed && principles.some(
    (p) => normalizeForDedup(p.text) === normalizeForDedup(trimmed),
  );
  const isTooLong = trimmed.length > PRINCIPLE_MAX_LEN;
  const charsLeft = PRINCIPLE_MAX_LEN - trimmed.length;

  function submit() {
    if (!trimmed) { setRejection("empty"); return; }
    if (isTooLong) { setRejection("tooLong"); return; }
    if (isDuplicate) { setRejection("duplicate"); return; }
    addPrinciple(trimmed);
    setInput("");
    setRejection(null);
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
          {copy.schoolTagline}
        </span>
        <span style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          {copy.schoolSubtitle}
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
          <EmptyState
            glyph="§"
            kicker={copy.schoolEmptyKicker}
            body={copy.schoolEmpty}
            hint={copy.schoolEmptyHint}
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
          {copy.schoolInputVoice}
        </div>
        {rejection !== null && (
          <div
            className="fadeIn"
            data-testid="school-rejection"
            style={{
              marginBottom: 8,
              fontSize: 11,
              color: "var(--cc-warn)",
              fontFamily: "var(--mono)",
              letterSpacing: 1,
              paddingLeft: 4,
            }}
          >
            {rejection === "duplicate" && "✗ princípio já inscrito — normalizar antes de repetir."}
            {rejection === "tooLong" && `✗ princípio excede ${PRINCIPLE_MAX_LEN} caracteres.`}
            {rejection === "empty" && "✗ nada para inscrever."}
          </div>
        )}
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
            onChange={(e) => {
              setInput(e.target.value);
              if (rejection !== null) setRejection(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              else if (e.key === "Escape" && input.length > 0) { setInput(""); setRejection(null); }
            }}
            maxLength={PRINCIPLE_MAX_LEN * 2}
            placeholder={copy.schoolPlaceholder}
            style={{
              flex: 1,
              fontSize: 14,
              color: "var(--text-primary)",
              fontFamily: "var(--sans)",
              padding: "6px 0",
            }}
          />
          {trimmed.length > 0 && charsLeft <= 60 && (
            <span
              data-testid="school-charcount"
              style={{
                fontSize: 10,
                fontFamily: "var(--mono)",
                color: charsLeft < 0 ? "var(--cc-err)" : charsLeft <= 20 ? "var(--cc-warn)" : "var(--text-ghost)",
                letterSpacing: 1,
              }}
            >
              {charsLeft}
            </span>
          )}
          {trimmed.length > 0 && (
            <button
              onClick={submit}
              disabled={isTooLong}
              className="fadeIn"
              style={{
                background: "none",
                border: `1px solid ${isDuplicate || isTooLong ? "var(--cc-warn)" : "var(--accent-dim)"}`,
                color: isDuplicate || isTooLong ? "var(--cc-warn)" : "var(--accent)",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "7px 14px",
                borderRadius: 999,
                fontFamily: "var(--mono)",
                cursor: isTooLong ? "not-allowed" : "pointer",
                opacity: isTooLong ? 0.5 : 1,
                transition: "all .2s var(--ease-swift)",
              }}
              onMouseEnter={(e) => {
                if (!isTooLong) e.currentTarget.style.background = "var(--accent-glow)";
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
