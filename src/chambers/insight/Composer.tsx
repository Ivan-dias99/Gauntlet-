import { useEffect, useRef, useState } from "react";
import type { BackendReadiness } from "../../hooks/useBackendStatus";

// Insight Mission Composer.
//
// This is not a generic chat box. It is the surface where a mission
// starts (when none is active) or continues (when one is). The header
// strip communicates that state explicitly, the placeholder guides
// actionable input, and the affordances expose only the signals the
// chamber actually carries.
//
// Affordances:
//   · context (+)  → flyout listing real signals: doctrine count, prior
//                    turns in window, backend readiness. No fake attach.
//   · route (≡)    → which dispatch Insight uses (triad + judge) and
//                    the agent-loop hand-off rule. Read-only.
//   · send (↑)     → primary action; dim while empty, info while pending.
//
// Enter submits; Shift+Enter inserts a newline.

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  placeholder: string;
  voiceLabel: string;
  principlesCount: number;
  priorTurns: number;
  readiness: BackendReadiness;
  routeHint?: "triad" | "agent";
  // Mission semantics: tells the composer whether the next submit will
  // open a new mission or continue an existing one. Drives the header
  // strip + the rejection-recovery copy from the parent.
  missionContext:
    | { kind: "new" }
    | { kind: "continue"; title: string };
}

type Flyout = null | "context" | "route";

const READINESS_LABEL: Record<BackendReadiness, string> = {
  ready_real: "live",
  mock: "mock",
  degraded: "degraded",
  unreachable: "unreachable",
};

export default function Composer({
  value, onChange, onSubmit, pending, placeholder,
  voiceLabel, principlesCount, priorTurns, readiness, routeHint, missionContext,
}: Props) {
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
      data-mission-kind={missionContext.kind}
      className="insight-composer"
      data-focused={focused ? "true" : undefined}
      data-disabled={pending ? "true" : undefined}
      aria-label={voiceLabel}
    >
      <MissionStrip context={missionContext} />

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
            {pending
              ? "a processar…"
              : missionContext.kind === "new"
                ? "↵ ratifica missão · ⇧↵ nova linha"
                : "↵ continuar missão · ⇧↵ nova linha"}
          </span>
        )}
        {!pending && !focused && <span style={{ flex: 1 }} aria-hidden />}

        <button
          type="button"
          className="insight-composer-send"
          data-state={pending ? "pending" : undefined}
          onClick={onSubmit}
          disabled={!canSubmit}
          title={
            pending
              ? "a processar"
              : missionContext.kind === "new"
                ? "ratificar missão"
                : "continuar missão"
          }
          aria-label={
            pending
              ? "a processar"
              : missionContext.kind === "new"
                ? "ratificar missão"
                : "continuar missão"
          }
        >
          <span className="insight-composer-send-glyph">{pending ? "…" : "↑"}</span>
        </button>
      </div>

      {flyout === "context" && (
        <ContextFlyout
          principlesCount={principlesCount}
          priorTurns={priorTurns}
          readiness={readiness}
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

// ── Mission strip ───────────────────────────────────────────────────────────
//
// Sits above the textarea so the user always knows whether the next
// Enter creates a mission or continues one. Replaces the previous
// "generic chat box" reading of the composer.

function MissionStrip({
  context,
}: {
  context: { kind: "new" } | { kind: "continue"; title: string };
}) {
  const isNew = context.kind === "new";
  return (
    <div
      data-insight-mission-strip
      data-state={isNew ? "new" : "continue"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderBottom: "1px solid var(--border-color-soft)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}
    >
      <span aria-hidden>◆</span>
      <span>{isNew ? "nova missão" : "missão activa"}</span>
      {!isNew && (
        <span
          style={{
            color: "var(--text-secondary)",
            textTransform: "none",
            letterSpacing: 0,
            fontFamily: "var(--serif)",
            fontSize: "var(--t-body-sec)",
            marginLeft: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "min(60ch, 70%)",
          }}
        >
          {context.title}
        </span>
      )}
      <span style={{ flex: 1 }} aria-hidden />
      <span style={{ opacity: 0.7 }}>
        {isNew ? "primeiro envio ratifica" : "envio adiciona turno"}
      </span>
    </div>
  );
}

// ── Flyouts ─────────────────────────────────────────────────────────────────
//
// Context: enumerates the real signals Insight already carries — doctrine
// count, prior turns in context window, backend readiness. Read-only.
// Route: shows the dispatch grammar and the cross-chamber hand-off rule.

function ContextFlyout({
  principlesCount, priorTurns, readiness, onDismiss,
}: {
  principlesCount: number;
  priorTurns: number;
  readiness: BackendReadiness;
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
        title="estado de prontidão do backend (readiness, não liveness)"
      >
        <span className="insight-composer-flyout-item-glyph">◉</span>
        <span>backend</span>
        <span
          className="insight-composer-flyout-item-kicker"
          style={
            readiness === "ready_real"
              ? undefined
              : { color: "var(--cc-warn)" }
          }
        >
          {READINESS_LABEL[readiness]}
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
