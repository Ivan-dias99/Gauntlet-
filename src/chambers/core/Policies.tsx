import { useEffect, useRef, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useCopy } from "../../i18n/copy";
import DormantPanel from "../../shell/DormantPanel";
import DoctrineTelemetryPanel from "./DoctrineTelemetryPanel";

// Core · Policies — constitutional register of principles in force.
// Rendered inside the shared .core-page frame so the tab reads with
// the same composition discipline as Routing / Permissions / System /
// Orchestration. Institutional typography (serif articles, § gutter,
// doctrine composer) is preserved; the surrounding chrome is the
// generic page scaffold.

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

export default function Policies() {
  const {
    state, principles, addPrinciple, activeMission,
    syncState, hydratedFromBackend, syncError,
  } = useSpine();
  const copy = useCopy();
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [rejection, setRejection] = useState<null | "duplicate" | "empty" | "tooLong">(null);
  const isGoverning = principles.length > 0;
  const lastApplied = activeMission?.events.find((e) => e.type === "doctrine_applied") ?? null;

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
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const showStatus =
    syncState !== "synced" || hydratedFromBackend === false || !!syncError;

  return (
    <div className="core-page" data-chamber="school">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Policies</span>
        <span className="core-page-intro-sub">
          Princípios constitucionais que vinculam cada invocação em qualquer chamber.
          Inscrição explícita, sem revogação silenciosa.
        </span>
      </div>

      {isGoverning && (
        <section
          className="fadeIn panel"
          data-rank="primary"
          style={{ maxWidth: 860, marginInline: "auto", width: "100%" }}
        >
          <div className="panel-head">
            <span className="panel-title">
              {activeMission
                ? <>missão <em style={{ fontStyle: "normal", color: "var(--text-secondary)" }}>{activeMission.title}</em></>
                : <>doutrina em vigor</>}
            </span>
            <span className="panel-sub">
              <span style={{ color: "var(--accent)", marginRight: 6 }}>
                {toRoman(principles.length)}
              </span>
              {principles.length === 1 ? "artigo" : "artigos"}
            </span>
          </div>

          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "var(--text-primary)",
              letterSpacing: "-0.005em",
            }}
          >
            {principles.length === 1 ? (
              <>
                <strong style={{ fontWeight: 500, color: "var(--accent)" }}>Um princípio</strong> sob vigor.
                Vincula cada invocação, em qualquer chamber
                {activeMission ? " e governa esta missão." : "."}
              </>
            ) : (
              <>
                <strong style={{ fontWeight: 500, color: "var(--accent)" }}>{principles.length} princípios</strong> sob vigor.
                Vinculam cada invocação, em qualquer chamber
                {activeMission ? " e governam esta missão." : "."}
              </>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "var(--space-3)",
              paddingTop: "var(--space-2)",
              borderTop: "1px solid var(--border-color-soft)",
            }}
          >
            <Metric
              value={totalApplications}
              label={totalApplications === 1 ? "invocação" : "invocações"}
              tone={totalApplications > 0 ? "accent" : "muted"}
            />
            <Metric
              value={`${missionsGoverned} de ${totalMissions}`}
              label="missões governadas"
              tone={missionsGoverned > 0 ? undefined : "muted"}
            />
            {lastApplied ? (
              <Metric
                value={new Date(lastApplied.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                label="última invocação"
              />
            ) : (
              <Metric
                value="—"
                label={activeMission ? "aguarda invocação" : "sem missão activa"}
                tone="muted"
              />
            )}
          </div>

          {showStatus && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
                paddingTop: "var(--space-2)",
                borderTop: "1px solid var(--border-color-soft)",
              }}
            >
              <span
                className="state-pill"
                data-tone={
                  syncState === "synced" ? "ok" :
                  syncState === "syncing" ? "info" : "warn"
                }
              >
                <span className="state-pill-dot" />
                {syncState === "synced"
                  ? "sincronizado"
                  : syncState === "syncing"
                  ? "a sincronizar…"
                  : "local — backend não confirmou"}
              </span>
              {hydratedFromBackend === false && (
                <span className="state-pill" data-tone="warn">
                  <span className="state-pill-dot" />
                  cache local
                </span>
              )}
              {syncError && (
                <span
                  className="state-pill"
                  data-tone="warn"
                  title={syncError.message}
                >
                  <span className="state-pill-dot" />
                  {syncError.kind === "unreachable"
                    ? "backend inacessível"
                    : syncError.envelope?.error ?? "erro do backend"}
                </span>
              )}
            </div>
          )}
        </section>
      )}

      {principles.length === 0 && (
        hydratedFromBackend === false ? (
          <DormantPanel
            detail={copy.dormantCore}
            style={{ marginInline: "auto" }}
          />
        ) : (
          <div className="core-empty" data-chamber="school">
            <span className="core-empty-glyph" aria-hidden>§</span>
            <span className="core-empty-kicker">{copy.schoolEmptyKicker}</span>
            <span className="core-empty-body">{copy.schoolEmpty}</span>
            <span className="core-empty-hint">{copy.schoolEmptyHint}</span>
          </div>
        )
      )}

      {principles.length > 0 && (
        <section
          className="panel"
          data-rank="primary"
          style={{ maxWidth: 860, marginInline: "auto", width: "100%" }}
        >
          <div className="panel-head">
            <span className="panel-title">registo constitucional</span>
            <span className="panel-sub">
              por ordem de inscrição · {principles.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
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
        </section>
      )}

      {isGoverning && <DoctrineTelemetryPanel />}

      <section
        className="command-bay"
        data-focused={inputFocused ? "true" : undefined}
        style={{ maxWidth: 860, marginInline: "auto", width: "100%" }}
      >
        <div className="command-bay-voice">
          <span className="status-dot" data-tone={inputFocused ? "accent" : "ghost"} />
          <span>{copy.schoolInputVoice}</span>
          {rejection !== null && (
            <span
              className="kicker"
              data-tone="warn"
              data-testid="school-rejection"
              style={{ marginLeft: "auto" }}
            >
              {rejection === "duplicate" && "✗ já inscrito"}
              {rejection === "tooLong" && `✗ excede ${PRINCIPLE_MAX_LEN} caracteres`}
              {rejection === "empty" && "✗ nada para inscrever"}
            </span>
          )}
        </div>
        <div className="command-bay-row">
          <span
            aria-hidden
            className="command-bay-prompt"
            style={{ color: "var(--accent)", fontSize: 18, fontFamily: "var(--serif)" }}
          >
            §
          </span>
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
            className="command-bay-input"
            style={{ fontFamily: "var(--serif)", fontSize: 15.5 }}
          />
        </div>
        <div className="command-bay-actions">
          <button
            onClick={submit}
            disabled={isTooLong || trimmed.length === 0}
            className="btn-chip"
            data-variant={isDuplicate || isTooLong ? undefined : "ok"}
            style={{ opacity: trimmed.length === 0 ? 0.45 : 1 }}
          >
            {copy.schoolInscribe}
          </button>
          {showCount && (
            <span
              data-testid="school-charcount"
              className="kicker"
              data-tone={countTone}
            >
              {charsLeft}
            </span>
          )}
          <span className="command-bay-hint" style={{ marginLeft: "auto" }}>
            enter ratifica · shift+enter nova linha
          </span>
        </div>
      </section>
    </div>
  );
}

function Metric({
  value, label, tone,
}: {
  value: string | number;
  label: string;
  tone?: "accent" | "muted";
}) {
  const valueColor =
    tone === "accent" ? "var(--accent)" :
    tone === "muted"  ? "var(--text-muted)" : "var(--text-primary)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 22,
          lineHeight: 1,
          color: valueColor,
          letterSpacing: "-0.01em",
          fontWeight: 400,
        }}
      >
        {value}
      </span>
      <span
        className="kicker"
        data-tone="ghost"
        style={{ letterSpacing: "var(--track-meta)" }}
      >
        {label}
      </span>
    </div>
  );
}
