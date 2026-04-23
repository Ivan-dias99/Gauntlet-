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
  routeHint?: "triad" | "agent";
}

type Flyout = null | "context" | "route";

export default function Composer({
  value, onChange, onSubmit, pending, placeholder,
  voiceLabel, principlesCount, priorTurns, mockMode, routeHint,
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
      className="insight-composer"
      data-focused={focused ? "true" : undefined}
      data-disabled={pending ? "true" : undefined}
      aria-label={voiceLabel}
    >
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

        <span className="insight-composer-hint">
          {pending ? "a processar…" : focused ? "↵ enviar · ⇧↵ nova linha" : voiceLabel}
        </span>

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
          mockMode={mockMode}
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
  principlesCount, priorTurns, mockMode, onDismiss,
}: {
  principlesCount: number;
  priorTurns: number;
  mockMode: boolean;
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
        <span className="insight-composer-flyout-item-kicker">
          {mockMode ? "mock" : "live"}
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
