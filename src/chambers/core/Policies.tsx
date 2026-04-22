import { useEffect, useRef, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useTweaks } from "../../tweaks/TweaksContext";
import { useCopy } from "../../i18n/copy";
import EmptyState from "../../shell/EmptyState";
import DormantPanel from "../../shell/DormantPanel";

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

  // Invocation substrate — every `doctrine_applied` event is Lab or
  // Creation firing with principles attached. We aggregate across all
  // missions for two honest metrics (total invocations + mission
  // coverage). Per-principle causal effects are not tracked, so we
  // never claim "consequence" — only "invocation".
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

  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Composer auto-grow — the inscription surface is a textarea so a
  // principle can span multiple lines. Height tracks content between
  // the CSS min-height (~one line) and max-height (~four lines).
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const trimmed = input.trim();
  const isDuplicate = !!trimmed && principles.some(
    (p) => normalizeForDedup(p.text) === normalizeForDedup(trimmed),
  );
  const isTooLong = trimmed.length > PRINCIPLE_MAX_LEN;
  const charsLeft = PRINCIPLE_MAX_LEN - trimmed.length;
  const showCount = trimmed.length > 0 && charsLeft <= 60;
  const countTone = charsLeft < 0 ? "err" : charsLeft <= 20 ? "warn" : undefined;

  function submit() {
    if (!trimmed) { setRejection("empty"); return; }
    if (isTooLong) { setRejection("tooLong"); return; }
    if (isDuplicate) { setRejection("duplicate"); return; }
    addPrinciple(trimmed);
    setInput("");
    setRejection(null);
    // Keep the inscription surface ready for the next article.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const showStatus =
    syncState !== "synced" || hydratedFromBackend === false || !!syncError;

  return (
    <div className="chamber-shell" data-chamber="school">
      {/* Doctrine strap — constitutional opening line, legible, never ghosted. */}
      <div className="chamber-head">
        <div className="doctrine-strap">
          <span className="doctrine-strap-brand">{copy.schoolTagline}</span>
          <span className="doctrine-strap-line">{copy.schoolSubtitle}</span>
        </div>
      </div>

      <div className="chamber-body" data-pad="calm">

        {/* Mission panel — four-zone institutional surface: head (mono
            kicker + serif mission + right-aligned crest), declaration,
            metrics rail, optional status. Carries doctrine's current
            reach and the honest invocation data from real substrate. */}
        {isGoverning && (
          <div className="fadeIn doctrine-seal">
            <div className="doctrine-seal-head">
              <span className="doctrine-seal-head-kicker">doutrina</span>
              <span aria-hidden className="doctrine-seal-head-sep">·</span>
              {activeMission ? (
                <span className="doctrine-seal-head-mission">
                  missão {activeMission.title}
                </span>
              ) : (
                <span className="doctrine-seal-head-null">
                  sem missão activa
                </span>
              )}
              <span className="doctrine-seal-head-crest" aria-hidden>
                <span className="doctrine-seal-head-crest-num">
                  {toRoman(principles.length)}
                </span>
                <span className="doctrine-seal-head-crest-unit">
                  {principles.length === 1 ? "artigo" : "artigos"}
                </span>
              </span>
            </div>

            <div className="doctrine-seal-declaration">
              {principles.length === 1 ? (
                <>
                  <strong>Um princípio</strong> sob vigor. Vincula cada invocação de Lab e Creation
                  {activeMission ? " e governa esta missão." : "."}
                </>
              ) : (
                <>
                  <strong>{principles.length} princípios</strong> sob vigor. Vinculam cada invocação de Lab e Creation
                  {activeMission ? " e governam esta missão." : "."}
                </>
              )}
            </div>

            <div className="doctrine-seal-metrics">
              <span className="doctrine-seal-metric">
                <span
                  className="doctrine-seal-metric-value"
                  data-tone={totalApplications > 0 ? "accent" : "dim"}
                >
                  {totalApplications}
                </span>
                <span className="doctrine-seal-metric-label">
                  {totalApplications === 1 ? "invocação" : "invocações"}
                </span>
              </span>
              <span className="doctrine-seal-metric">
                <span
                  className="doctrine-seal-metric-value"
                  data-tone={missionsGoverned > 0 ? undefined : "dim"}
                >
                  {missionsGoverned}
                </span>
                <span className="doctrine-seal-metric-label">
                  de {totalMissions} missões governadas
                </span>
              </span>
              {lastApplied ? (
                <span className="doctrine-seal-metric">
                  <span className="doctrine-seal-metric-value">
                    {new Date(lastApplied.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="doctrine-seal-metric-label">
                    última invocação
                  </span>
                </span>
              ) : (
                <span className="doctrine-seal-metric-null">
                  {activeMission
                    ? "ainda não invocada nesta missão"
                    : "aguarda missão activa"}
                </span>
              )}
            </div>

            {showStatus && (
              <div className="doctrine-seal-status">
                <span
                  className="doctrine-seal-status-item"
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
                    data-state="warn"
                  >
                    carregada da cache — backend não respondeu
                  </span>
                )}
                {syncError && (
                  <span
                    className="doctrine-seal-status-item"
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
          <div className="doctrine-register-heading">
            <span>registo constitucional</span>
            <span className="doctrine-register-heading-count">
              {principles.length === 1 ? "1 artigo" : `${principles.length} artigos`}
            </span>
            <span className="doctrine-register-heading-order">
              por ordem de inscrição
            </span>
          </div>
        )}

        {/* Constitutional ordering: article I is the first inscribed;
            article N is the most recent. Source state stores newest-
            first, so we reverse once for display. */}
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
                  </div>
                  <div className="doctrine-article-aside">
                    inscrita {relativeTime(p.createdAt, nowMs)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer — ceremonial inscription surface. Not a glass pill.
          A bordered bay whose left accent activates on focus. */}
      <div
        className="doctrine-composer"
        data-focused={inputFocused ? "true" : undefined}
      >
        <div className="doctrine-composer-label">
          <span>{copy.schoolInputVoice}</span>
        </div>
        {rejection !== null && (
          <div
            className="fadeIn doctrine-composer-rejection"
            data-testid="school-rejection"
          >
            {rejection === "duplicate" && "✗ princípio já inscrito — normalizar antes de repetir."}
            {rejection === "tooLong" && `✗ princípio excede ${PRINCIPLE_MAX_LEN} caracteres.`}
            {rejection === "empty" && "✗ nada para inscrever."}
          </div>
        )}
        <div className="doctrine-composer-row">
          <span aria-hidden className="doctrine-composer-lead">§</span>
          <textarea
            ref={inputRef}
            autoFocus
            rows={1}
            value={input}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onChange={(e) => {
              setInput(e.target.value);
              if (rejection !== null) setRejection(null);
            }}
            onKeyDown={(e) => {
              // Enter ratifies; Shift+Enter / Cmd+Enter break line.
              if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                submit();
              } else if (e.key === "Escape" && input.length > 0) {
                setInput("");
                setRejection(null);
              }
            }}
            maxLength={PRINCIPLE_MAX_LEN * 2}
            placeholder={copy.schoolPlaceholder}
            className="doctrine-composer-input"
          />
          {(showCount || trimmed.length > 0) && (
            <div className="doctrine-composer-actions">
              {showCount && (
                <span
                  data-testid="school-charcount"
                  className="doctrine-composer-count"
                  data-tone={countTone}
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
          )}
        </div>
      </div>
    </div>
  );
}
