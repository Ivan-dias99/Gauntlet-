import { useEffect, useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";
import EmptyState from "../shell/EmptyState";
import DormantPanel from "../shell/DormantPanel";

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
  const { state, principles, addPrinciple, activeMission, syncState, hydratedFromBackend, syncError } = useSpine();
  const { values } = useTweaks();
  const copy = useCopy();
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [rejection, setRejection] = useState<null | "duplicate" | "empty" | "tooLong">(null);
  const layout = values.schoolLayout;
  const isGoverning = principles.length > 0;
  const lastApplied = activeMission?.events.find((e) => e.type === "doctrine_applied") ?? null;

  // Consequence substrate — every `doctrine_applied` event is Lab or
  // Creation firing a real query with principles attached. We can count
  // those across all missions, not just the active one, and derive
  // coverage: "governed N of M missions". No fabricated per-principle
  // tracking — the substrate doesn't carry it, so we don't show it.
  const totalMissions = state.missions.length;
  let totalApplications = 0;
  let missionsGoverned = 0;
  for (const m of state.missions) {
    const applied = m.events.filter((e) => e.type === "doctrine_applied").length;
    if (applied > 0) {
      missionsGoverned += 1;
      totalApplications += applied;
    }
  }

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
    <div className="chamber-shell">
      <div
        className="chamber-head"
        style={{
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
        }}>
          {copy.schoolSubtitle}
        </span>
        {principles.length > 0 && (
          <span className="chamber-head-crest" aria-hidden>
            <span className="chamber-head-crest-num">
              {toRoman(principles.length)}
            </span>
            <span className="chamber-head-crest-kicker">
              {principles.length === 1 ? "artigo" : "artigos"}
            </span>
          </span>
        )}
      </div>

      <div className="chamber-body" data-pad="calm">

        {/* Constitutional seal — declarative institutional header, a
            declaration line, a row of consequence counters pulled from
            real `doctrine_applied` events, and a status row. No italic,
            no stat-card composition, no fabricated per-principle data. */}
        {isGoverning && (
          <div className="fadeIn doctrine-seal">
            <div className="doctrine-seal-title">
              <span className="doctrine-seal-title-kicker">doutrina</span>
              <span aria-hidden className="doctrine-seal-title-sep">·</span>
              {activeMission ? (
                <span className="doctrine-seal-title-mission">
                  missão {activeMission.title}
                </span>
              ) : (
                <span className="doctrine-seal-title-null">
                  sem missão activa
                </span>
              )}
            </div>

            <div className="doctrine-seal-declaration">
              {principles.length === 1 ? (
                <>
                  <strong>Um princípio</strong> sob vigor. Vincula cada query de Lab e Creation
                  {activeMission ? " e governa esta missão." : "."}
                </>
              ) : (
                <>
                  <strong>{principles.length} princípios</strong> sob vigor. Vinculam cada query de Lab e Creation
                  {activeMission ? " e governam esta missão." : "."}
                </>
              )}
            </div>

            <div className="doctrine-seal-counters">
              <span className="doctrine-seal-counter">
                <span
                  className="doctrine-seal-counter-value"
                  data-tone={totalApplications > 0 ? "accent" : "dim"}
                >
                  {totalApplications}
                </span>
                <span className="doctrine-seal-counter-label">
                  {totalApplications === 1 ? "aplicação" : "aplicações"}
                </span>
              </span>
              <span className="doctrine-seal-counter">
                <span
                  className="doctrine-seal-counter-value"
                  data-tone={missionsGoverned > 0 ? undefined : "dim"}
                >
                  {missionsGoverned}
                </span>
                <span className="doctrine-seal-counter-label">
                  de {totalMissions} missões governadas
                </span>
              </span>
              {lastApplied ? (
                <span className="doctrine-seal-counter">
                  <span className="doctrine-seal-counter-value">
                    {new Date(lastApplied.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="doctrine-seal-counter-label">
                    última aplicação
                  </span>
                </span>
              ) : (
                <span className="doctrine-seal-counter-null">
                  {activeMission
                    ? "ainda não aplicada nesta missão"
                    : "aguarda missão activa"}
                </span>
              )}
            </div>

            {(syncState !== "synced" || hydratedFromBackend === false || syncError) && (
              <div className="doctrine-seal-status">
                <span
                  className="doctrine-seal-status-item"
                  data-doctrine-sync={syncState}
                  data-state={
                    syncState === "synced" ? "ok" :
                    syncState === "syncing" ? "info" : "warn"
                  }
                >
                  {syncState === "synced"
                    ? "sincronizado"
                    : syncState === "syncing"
                    ? "a sincronizar…"
                    : "local — backend não confirmou"}
                </span>
                {hydratedFromBackend === false && (
                  <span
                    className="doctrine-seal-status-item"
                    data-doctrine-load="local-only"
                    data-state="warn"
                  >
                    carregada da cache — backend não respondeu
                  </span>
                )}
                {syncError && (
                  <span
                    className="doctrine-seal-status-item"
                    data-doctrine-sync-error={syncError.kind}
                    data-state="warn"
                    title={syncError.message}
                  >
                    motivo:{" "}
                    {syncError.kind === "unreachable"
                      ? "backend inacessível"
                      : syncError.envelope?.error ?? "erro do backend"}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {principles.length === 0 && (
          // If hydration never reached the backend, the empty state could be
          // an honest void OR a backend-down false-empty. Distinguish so the
          // user doesn't waste time wondering why their inscribed doctrine is
          // missing.
          hydratedFromBackend === false ? (
            <DormantPanel
              detail="doutrina por carregar — backend não respondeu na hidratação. O que aparecer abaixo veio só da cache local."
              style={{ marginTop: "10vh", marginLeft: "auto", marginRight: "auto" }}
            />
          ) : (
            <EmptyState
              glyph="§"
              kicker={copy.schoolEmptyKicker}
              body={copy.schoolEmpty}
              hint={copy.schoolEmptyHint}
              style={{ marginTop: "10vh" }}
            />
          )
        )}

        {principles.length > 0 && (
          <div className="doctrine-preamble">
            <span className="doctrine-preamble-heavy">registo constitucional</span>
            <span>
              {principles.length === 1
                ? "1 artigo"
                : `${principles.length} artigos`}
            </span>
            <span className="doctrine-preamble-order">
              por ordem de inscrição
            </span>
          </div>
        )}

        {/* Constitutional ordering: the register reads ascending. Article I
            is the first inscribed; Article N is the most recent. Source
            state stores principles newest-first, so we reverse once for
            display. */}
        {layout === "tablets" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {[...principles].reverse().map((p, i) => {
              const articleNumber = i + 1;
              return (
                <div
                  key={p.id}
                  className="fadeUp doctrine-tablet"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="doctrine-tablet-head">
                    <span className="doctrine-tablet-kicker">artigo</span>
                    <span className="doctrine-tablet-num" data-article-roman>
                      {toRoman(articleNumber)}
                    </span>
                  </div>
                  <div className="doctrine-tablet-text">{p.text}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            {[...principles].reverse().map((p, i) => {
              const articleNumber = i + 1;
              return (
                <div
                  key={p.id}
                  className="fadeUp doctrine-article"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <div className="doctrine-article-gutter">
                    <span className="doctrine-article-kicker">artigo</span>
                    <span className="doctrine-article-num" data-article-roman>
                      {toRoman(articleNumber)}
                    </span>
                  </div>
                  <div className="doctrine-article-body">
                    <span className="doctrine-article-text">{p.text}</span>
                    <span className="doctrine-article-meta">
                      inscrita {relativeTime(p.createdAt, nowMs)}
                    </span>
                  </div>
                </div>
              );
            })}
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
              className="fadeIn doctrine-ratify"
              data-warn={isDuplicate || isTooLong ? "true" : undefined}
            >
              {copy.schoolInscribe}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
