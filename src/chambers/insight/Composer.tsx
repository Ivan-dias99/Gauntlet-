import { useEffect, useRef, useState } from "react";

// Insight flagship composer — the dominant anchor of the chamber.
// A single rounded shell with the question surface up top and a
// slim action rail underneath. Three icon-level affordances:
//
//   · context    (+)   opens a small flyout listing passive signals
//                      Insight already honors: doctrine, prior-turn
//                      context window, mock flag. No fake attach.
//   · route      (≡)   shows the dispatch Insight uses (triad) and
//                      the judge thresholds that shape outcomes.
//   · send       (↑)   the primary action; becomes info-tinted while
//                      pending, ghost while empty.
//
// Enter submits; Shift+Enter inserts a newline. Auto-grow bounded so
// the thread above keeps reading width even with long prompts.

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  placeholder: string;
  voiceLabel: string;
  principlesCount: number;
  priorTurns: number;
  mockMode: boolean;
  // Honest readiness companion — when true the backend is unreachable.
  // Drives the context flyout's backend chip into "unreachable" instead
  // of lying "live". Optional so the canonical caller keeps compiling.
  unreachable?: boolean;
  // Readiness-honest companion. When provided, the context flyout's
  // backend chip surfaces "ready" / "degraded" / "unreachable" directly
  // instead of collapsing reachable-but-degraded into a misleading
  // "live". Optional so the canonical caller path keeps compiling.
  readiness?: "ready" | "degraded" | "unreachable";
  routeHint?: "triad" | "agent";
  // Mission Composer semantics — "new" when first send will create a
  // mission, "continue" with the active title otherwise. Drives the
  // strip header and submit verb. Optional so the canonical caller
  // path keeps compiling; defaults to "new" when omitted.
  missionContext?:
    | { kind: "new" }
    | { kind: "continue"; title: string };
}

type Flyout = null | "context" | "route";

export default function Composer({
  value, onChange, onSubmit, pending, placeholder,
  voiceLabel, principlesCount, priorTurns, mockMode, unreachable, readiness, routeHint,
  missionContext,
}: Props) {
  const ctx = missionContext ?? { kind: "new" as const };
  // Four honest states. mockMode wins (canned brain). Otherwise prefer
  // the explicit readiness from /health/ready; fall back to the
  // reachable boolean when readiness is not provided so the canonical
  // caller path keeps working without a parent change.
  const readinessLabel = mockMode
    ? "mock"
    : readiness
      ? readiness
      : unreachable
        ? "unreachable"
        : "ready";
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [flyout, setFlyout] = useState<Flyout>(null);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  // Close the flyout when the focus leaves the composer shell.
  useEffect(() => {
    if (!flyout) return;
    function onDoc(e: MouseEvent) {
      const el = shellRef.current;
      if (el && !el.contains(e.target as Node)) setFlyout(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [flyout]);

  const canSubmit = value.trim().length > 0 && !pending;

  return (
    <div
      ref={shellRef}
      data-insight-composer
      data-mission-kind={ctx.kind}
      className="insight-composer"
      data-focused={focused ? "true" : undefined}
      data-disabled={pending ? "true" : undefined}
      aria-label={voiceLabel}
    >
      {/* Mission Strip — sits above the textarea so the operator always
          knows whether the next send opens a mission or continues one.
          Pure-additive: zero impact on the textarea / rail / flyouts
          below; the canonical visual grammar is preserved. */}
      <div
        data-insight-mission-strip
        data-state={ctx.kind}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderBottom: "1px solid var(--border-color-soft)",
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        <span aria-hidden>◆</span>
        <span>{ctx.kind === "new" ? "nova missão" : "missão activa"}</span>
        {ctx.kind === "continue" && (
          <span
            style={{
              color: "var(--text-secondary)",
              textTransform: "none",
              letterSpacing: 0,
              fontFamily: "var(--serif)",
              fontSize: "var(--t-body-sec)",
              marginLeft: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "min(60ch, 70%)",
            }}
            title={ctx.title}
          >
            {ctx.title}
          </span>
        )}
        <span style={{ flex: 1 }} aria-hidden />
        <span style={{ opacity: 0.7 }}>
          {ctx.kind === "new" ? "primeiro envio ratifica" : "envio adiciona turno"}
        </span>
      </div>

      <textarea
        ref={inputRef}
        autoFocus
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!pending) onSubmit();
          }
          if (e.key === "Escape") setFlyout(null);
        }}
        placeholder={placeholder}
        disabled={pending}
        className="insight-composer-input"
      />

      <div className="insight-composer-rail">
        <button
          type="button"
          className="insight-composer-affordance"
          data-active={flyout === "context" ? "true" : undefined}
          onClick={() => setFlyout(flyout === "context" ? null : "context")}
          title="contexto"
          aria-label="contexto"
        >
          <span className="insight-composer-glyph">+</span>
        </button>
        <button
          type="button"
          className="insight-composer-affordance"
          data-active={flyout === "route" ? "true" : undefined}
          onClick={() => setFlyout(flyout === "route" ? null : "route")}
          title="rota"
          aria-label="rota"
        >
          <span className="insight-composer-glyph">≡</span>
        </button>

        {(pending || focused) && (
          <span className="insight-composer-hint">
            {pending ? "a processar…" : "↵ enviar · ⇧↵ nova linha"}
          </span>
        )}
        {!pending && !focused && <span style={{ flex: 1 }} aria-hidden />}

        <button
          type="button"
          className="insight-composer-send"
          data-state={pending ? "pending" : undefined}
          onClick={onSubmit}
          disabled={!canSubmit}
          title={pending ? "a processar" : "perguntar"}
          aria-label={pending ? "a processar" : "perguntar"}
        >
          <span className="insight-composer-send-glyph">{pending ? "…" : "↑"}</span>
        </button>
      </div>

      {flyout === "context" && (
        <ContextFlyout
          principlesCount={principlesCount}
          priorTurns={priorTurns}
          readinessLabel={readinessLabel}
          onDismiss={() => setFlyout(null)}
        />
      )}
      {flyout === "route" && (
        <RouteFlyout
          routeHint={routeHint}
          onDismiss={() => setFlyout(null)}
        />
      )}
    </div>
  );
}

// ——— Flyouts ———
//
// Context: what Insight already carries into the request. Principles,
// prior turns in context window, mock flag. Read-only enumeration.
//
// Route: which dispatch Insight runs and the judge thresholds. Honest
// about the triad + judge grammar; no fake "switch model" toggle.

function ContextFlyout({
  principlesCount, priorTurns, readinessLabel, onDismiss,
}: {
  principlesCount: number;
  priorTurns: number;
  readinessLabel: string;
  onDismiss: () => void;
}) {
  return (
    <div className="insight-composer-flyout" role="menu" onBlur={onDismiss}>
      <button
        type="button"
        className="insight-composer-flyout-item"
        disabled
        title="princípios ativos viajam em cada pergunta"
      >
        <span className="insight-composer-flyout-item-glyph">§</span>
        <span>doutrina</span>
        <span className="insight-composer-flyout-item-kicker">
          {principlesCount}
        </span>
      </button>
      <button
        type="button"
        className="insight-composer-flyout-item"
        disabled
        title="turnos anteriores enviados como contexto"
      >
        <span className="insight-composer-flyout-item-glyph">⋯</span>
        <span>turnos no contexto</span>
        <span className="insight-composer-flyout-item-kicker">
          {Math.min(priorTurns, 8)}
        </span>
      </button>
      <button
        type="button"
        className="insight-composer-flyout-item"
        disabled
        title="modo atual do backend"
      >
        <span className="insight-composer-flyout-item-glyph">◉</span>
        <span>backend</span>
        <span
          className="insight-composer-flyout-item-kicker"
          style={
            readinessLabel === "ready"
              ? undefined
              : { color: "var(--cc-warn)" }
          }
        >
          {readinessLabel}
        </span>
      </button>
    </div>
  );
}

function RouteFlyout({
  routeHint, onDismiss,
}: {
  routeHint?: "triad" | "agent";
  onDismiss: () => void;
}) {
  const current = routeHint ?? "triad";
  return (
    <div className="insight-composer-flyout" role="menu" onBlur={onDismiss}>
      <button
        type="button"
        className="insight-composer-flyout-item"
        disabled
        title="triad: 3 análises paralelas, juiz avalia divergência"
      >
        <span className="insight-composer-flyout-item-glyph">◆</span>
        <span>triad + judge</span>
        <span className="insight-composer-flyout-item-kicker">
          {current === "triad" ? "ativo" : "ronda"}
        </span>
      </button>
      <button
        type="button"
        className="insight-composer-flyout-item"
        disabled
        title="agent: iterações com tools, para tarefas de execução"
      >
        <span className="insight-composer-flyout-item-glyph">▸</span>
        <span>agent loop</span>
        <span className="insight-composer-flyout-item-kicker">
          {current === "agent" ? "ativo" : "terminal"}
        </span>
      </button>
      <button
        type="button"
        className="insight-composer-flyout-item"
        disabled
        title="juiz implacável; divergência ou falha prévia → recusa"
      >
        <span className="insight-composer-flyout-item-glyph">§</span>
        <span>juízo</span>
        <span className="insight-composer-flyout-item-kicker">high / low</span>
      </button>
    </div>
  );
}
