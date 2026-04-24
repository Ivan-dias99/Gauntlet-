import { useEffect, useRef, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useCopy } from "../../i18n/copy";
import DormantPanel from "../../shell/DormantPanel";

// Core · Policies — constitutional register of principles in force.
//
// Editorial hierarchy, modeled on Terminal's canvas + composer split.
// There is no wrapping "panel" slab here: the register is a
// typographic list with hairlines between articles, flowing on the
// chamber surface like a printed register. The composer is a thin,
// anchored instrument sharing the same material family as Terminal's
// ExecutionComposer.
//
// The chamber head + CoreInstrument strip above this tab already
// carry identity (name, tagline, em-vigor count, last invocation,
// sync). This page does not duplicate those.

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
    principles, addPrinciple,
    syncState, hydratedFromBackend, syncError,
  } = useSpine();
  const copy = useCopy();
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [rejection, setRejection] = useState<null | "duplicate" | "empty" | "tooLong">(null);

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
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
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
  const canSubmit = trimmed.length > 0 && !isTooLong;

  return (
    <div className="core-policies" data-chamber="school">
      {showStatus && (
        <div className="core-policies-alerts fadeIn">
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

      {principles.length === 0 ? (
        hydratedFromBackend === false ? (
          <DormantPanel
            detail="doutrina por carregar — backend não respondeu na hidratação. O que aparecer abaixo veio só da cache local."
            style={{ marginInline: "auto", maxWidth: 560 }}
          />
        ) : (
          <section
            className="core-empty"
            data-chamber="school"
          >
            <span className="core-empty-glyph" aria-hidden>§</span>
            <span className="core-empty-kicker">{copy.schoolEmptyKicker}</span>
            <span className="core-empty-body">{copy.schoolEmpty}</span>
            <span className="core-empty-hint">{copy.schoolEmptyHint}</span>
          </section>
        )
      ) : (
        <section className="core-register" aria-label="registo constitucional">
          <header className="core-register-head">
            <span className="core-register-kicker">— registo constitucional</span>
            <span className="core-register-count">
              ordem de inscrição · {principles.length}
            </span>
          </header>
          <ol className="core-register-list">
            {[...principles].reverse().map((p, i) => {
              const articleNumber = principles.length - i;
              return (
                <li
                  key={p.id}
                  className="doctrine-article fadeUp"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <div className="doctrine-article-gutter">
                    <span className="doctrine-article-kicker">artigo</span>
                    <span className="doctrine-article-num" data-article-roman>
                      {toRoman(articleNumber)}
                    </span>
                  </div>
                  <p className="doctrine-article-text">{p.text}</p>
                  <time className="doctrine-article-aside">
                    inscrita {relativeTime(p.createdAt, nowMs)}
                  </time>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section
        className="core-composer"
        data-focused={inputFocused ? "true" : undefined}
      >
        <div className="core-composer-row">
          <span className="core-composer-glyph" aria-hidden>§</span>
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
            className="core-composer-input"
            aria-label={copy.schoolInputVoice}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="core-composer-send"
            aria-label={copy.schoolInscribe}
          >
            {copy.schoolInscribe}
          </button>
        </div>
        <div className="core-composer-meta">
          <span className="core-composer-voice">{copy.schoolInputVoice}</span>
          {rejection !== null && (
            <span
              className="core-composer-rejection"
              data-testid="school-rejection"
            >
              {rejection === "duplicate" && "✗ já inscrito"}
              {rejection === "tooLong" && `✗ excede ${PRINCIPLE_MAX_LEN} caracteres`}
              {rejection === "empty" && "✗ nada para inscrever"}
            </span>
          )}
          {showCount && (
            <span
              data-testid="school-charcount"
              className="core-composer-count"
              data-tone={countTone}
            >
              {charsLeft}
            </span>
          )}
          <span className="core-composer-spacer" />
          <span className="core-composer-hint">
            {copy.schoolComposerHint}
          </span>
        </div>
      </section>
    </div>
  );
}
