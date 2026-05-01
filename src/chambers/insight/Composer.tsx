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

export type RouteMode = "auto" | "triad" | "agent";

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
  /** Path the last completed turn took (read-only badge in flyout). */
  routeHint?: "triad" | "agent";
  /** Wave P-41 — operator's declared preference for the next turn. */
  routeMode: RouteMode;
  onRouteModeChange: (m: RouteMode) => void;
}

type Flyout = null | "context" | "route";

export default function Composer({
  value, onChange, onSubmit, pending, placeholder,
  voiceLabel, principlesCount, priorTurns, mockMode, routeHint,
  routeMode, onRouteModeChange,
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
          mockMode={mockMode}
          onDismiss={() => setFlyout(null)}
        />
      )}
      {flyout === "route" && (
        <RouteFlyout
          routeHint={routeHint}
          routeMode={routeMode}
          onRouteModeChange={onRouteModeChange}
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

// Wave P-41 — RouteFlyout is now interactive. The operator declares a
// preferred dispatch mode for the next turn (auto · triad · agent); the
// chamber reads the value and forwards it as `route_hint` in the request
// body. Backend may still override based on telemetry, but the operator
// signal is no longer a no-op.
function RouteFlyout({
  routeHint, routeMode, onRouteModeChange, onDismiss,
}: {
  routeHint?: "triad" | "agent";
  routeMode: RouteMode;
  onRouteModeChange: (m: RouteMode) => void;
  onDismiss: () => void;
}) {
  const options: Array<{
    value: RouteMode; glyph: string; label: string; help: string;
  }> = [
    { value: "auto",  glyph: "◆", label: "auto",        help: "dispatcher decide entre triad e agent" },
    { value: "triad", glyph: "◇", label: "triad+judge", help: "3 análises paralelas, juiz avalia divergência" },
    { value: "agent", glyph: "▸", label: "agent loop",  help: "iterações com tools, para tarefas de execução" },
  ];
  // Codex review #285 (P2): when the operator tabs from one radio option
  // to the sibling, the wrapper's `onBlur` would fire and dismiss the
  // menu before the next option received focus — keyboard traversal was
  // impossible. Skip dismissal when focus moves to another node still
  // inside this flyout.
  const onWrapperBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    onDismiss();
  };
  return (
    <div className="insight-composer-flyout" role="menu" onBlur={onWrapperBlur}>
      {options.map((opt) => {
        const selected = routeMode === opt.value;
        const lastWas = routeHint && opt.value === routeHint;
        return (
          <button
            key={opt.value}
            type="button"
            role="menuitemradio"
            aria-checked={selected}
            className="insight-composer-flyout-item"
            data-active={selected ? "true" : undefined}
            title={opt.help}
            onClick={() => onRouteModeChange(opt.value)}
          >
            <span className="insight-composer-flyout-item-glyph">
              {selected ? "●" : opt.glyph}
            </span>
            <span>{opt.label}</span>
            <span className="insight-composer-flyout-item-kicker">
              {selected ? "selecionado" : lastWas ? "última" : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
