// Capsule — Gauntlet's flagship cursor surface.
//
// Doctrine for this file:
//   * Cursor never leaves the page. Capsule floats, dismissable on Esc.
//   * Glass + serif headline + mono labels. One ember accent for life.
//   * One input. One button. One response. The backend decides whether
//     the response is a text answer or a list of DOM actions — the
//     user never has to choose between "Compor" and "Acionar".

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ComposerClient,
  type ContextCaptureRequest,
  type DomPlanResult,
} from '../lib/composer-client';
import {
  assessDanger,
  type DangerAssessment,
  type DomAction,
  type DomActionResult,
} from '../lib/dom-actions';
import {
  readSelectionSnapshot,
  type SelectionRect,
  type SelectionSnapshot,
} from '../lib/selection';

export interface CapsuleProps {
  client: ComposerClient;
  initialSnapshot: SelectionSnapshot;
  onDismiss: () => void;
  // Provided by the in-page content script. When undefined (popup
  // window fallback) the "Acionar" button hides — the popup has no
  // page to actuate against.
  executor?: (actions: DomAction[]) => Promise<DomActionResult[]>;
  // Last known cursor position, in viewport coordinates. Used as the
  // anchor when there is no text selection — without it we'd fall
  // back to the bottom-of-screen strip, which is the opposite of
  // "ponta do cursor". When both bbox and cursor are absent (rare:
  // hotkey before any pointer activity), the strip still serves as
  // the orientation fallback.
  cursorAnchor?: { x: number; y: number } | null;
}

type Phase =
  | 'idle'
  | 'planning'    // request sent, no deltas yet → skeleton showing
  | 'streaming'   // first delta arrived → partial compose rendering
  | 'plan_ready'  // `done` event received → final plan/compose visible
  | 'executing'
  | 'executed'
  | 'error';

export function Capsule({
  client,
  initialSnapshot,
  onDismiss,
  executor,
  cursorAnchor,
}: CapsuleProps) {
  const [snapshot, setSnapshot] = useState<SelectionSnapshot>(initialSnapshot);
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState<DomPlanResult | null>(null);
  const [planResults, setPlanResults] = useState<DomActionResult[] | null>(null);
  const [dangerConfirmed, setDangerConfirmed] = useState(false);
  // partialCompose holds whatever text we've extracted from the
  // streaming JSON buffer so far. It's only visible in phase 'streaming';
  // once the `done` event fires, the full plan.compose replaces it.
  const [partialCompose, setPartialCompose] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const streamAbortRef = useRef<(() => void) | null>(null);
  const streamBufferRef = useRef<string>('');

  // Danger assessment runs in-page (where document.querySelector resolves
  // against the live DOM) so each action gets per-element classification
  // — submit buttons, password inputs, "Delete" labels. Recomputed only
  // when the plan changes; the result feeds the warning banner and the
  // danger badges in the action list.
  const dangers = useMemo<DangerAssessment[]>(
    () => (plan ? plan.actions.map(assessDanger) : []),
    [plan],
  );
  const hasDanger = dangers.some((d) => d.danger);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      abortRef.current?.abort();
      streamAbortRef.current?.();
    };
  }, []);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        onDismiss();
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onDismiss]);

  const refreshSnapshot = useCallback(() => {
    setSnapshot(readSelectionSnapshot());
  }, []);

  // The single send path, streaming. Backend's /composer/dom_plan_stream
  // emits delta chunks and a final `done` event with the parsed result.
  // We progressively extract a partial `compose` value from the JSON
  // buffer so the user sees text appear token-by-token instead of
  // staring at a spinner. Action plans still arrive in batch on `done`
  // (parsing partial action arrays is not worth the complexity yet).
  const requestPlan = useCallback(async () => {
    if (!userInput.trim() || phase === 'planning' || phase === 'streaming' || phase === 'executing') {
      return;
    }
    abortRef.current?.abort();
    streamAbortRef.current?.();
    const ac = new AbortController();
    abortRef.current = ac;
    setPhase('planning');
    setError(null);
    setPlan(null);
    setPlanResults(null);
    setDangerConfirmed(false);
    setCopied(false);
    setPartialCompose('');
    streamBufferRef.current = '';
    const capture = buildCapture(snapshot);
    try {
      const ctx = await client.captureContext(capture, ac.signal);
      if (ac.signal.aborted) return;
      streamAbortRef.current = client.requestDomPlanStream(
        ctx.context_id,
        userInput.trim(),
        {
          onDelta: (text) => {
            if (ac.signal.aborted) return;
            streamBufferRef.current += text;
            const partial = extractPartialCompose(streamBufferRef.current);
            if (partial !== null) {
              setPartialCompose(partial);
              setPhase((p) => (p === 'planning' ? 'streaming' : p));
            } else {
              // No compose yet — could be an action plan being built.
              // Just transition out of skeleton on first delta so the
              // user knows we're alive.
              setPhase((p) => (p === 'planning' ? 'streaming' : p));
            }
          },
          onDone: (planResult) => {
            if (ac.signal.aborted) return;
            setPlan(planResult);
            setPhase('plan_ready');
            setPartialCompose('');
            streamBufferRef.current = '';
          },
          onError: (err) => {
            if (ac.signal.aborted) return;
            setError(err);
            setPhase('error');
            setPartialCompose('');
            streamBufferRef.current = '';
          },
        },
      );
    } catch (err: unknown) {
      if (ac.signal.aborted) return;
      setError(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  }, [client, snapshot, userInput, phase]);

  const onSubmit = useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      void requestPlan();
    },
    [requestPlan],
  );

  // Plain Enter submits. Shift+Enter inserts a newline. Cmd/Ctrl+Enter
  // also submits as a back-compat habit. Matches conventional chat UX.
  const onTextareaKey = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key !== 'Enter') return;
      if (ev.shiftKey) return;
      ev.preventDefault();
      void requestPlan();
    },
    [requestPlan],
  );

  const onCopyCompose = useCallback(async () => {
    if (!plan?.compose) return;
    try {
      await navigator.clipboard.writeText(plan.compose);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Clipboard write blocked. Select the text and copy manually.');
    }
  }, [plan]);

  const executePlan = useCallback(async () => {
    if (!executor || !plan || plan.actions.length === 0) return;
    // Belt-and-braces: the button is disabled when danger is unconfirmed,
    // but a stale render or an injected event could still fire onClick.
    // Refuse to execute here too so the gate isn't only UI-deep.
    if (hasDanger && !dangerConfirmed) return;
    setPhase('executing');
    setError(null);
    try {
      const results = await executor(plan.actions);
      setPlanResults(results);
      setPhase('executed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  }, [executor, plan, hasDanger, dangerConfirmed]);

  // Where to anchor the capsule, in priority order:
  //   1. Selection bbox — the user is pointing at specific text.
  //   2. Cursor position — no selection, but we know where the mouse
  //      was last seen on the page; treat that as a zero-size rect so
  //      computeAnchorPosition's flip-up/flip-down + clamp logic keeps
  //      working unchanged.
  //   3. Null — the strip layout pinned to the bottom of the viewport
  //      catches us as the last-resort orientation fallback.
  const anchor = useMemo<SelectionRect | null>(() => {
    if (snapshot.bbox) return snapshot.bbox;
    if (cursorAnchor) {
      return {
        x: cursorAnchor.x,
        y: cursorAnchor.y,
        width: 0,
        height: 0,
      };
    }
    return null;
  }, [snapshot.bbox, cursorAnchor]);
  const anchoredStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!anchor) return undefined;
    const pos = computeAnchorPosition(anchor);
    return {
      top: `${pos.top}px`,
      left: `${pos.left}px`,
    };
  }, [anchor]);
  const className = anchor
    ? 'gauntlet-capsule gauntlet-capsule--anchored'
    : 'gauntlet-capsule';

  return (
    <div
      className={className}
      role="dialog"
      aria-label="Gauntlet"
      style={anchoredStyle}
    >
      <div className="gauntlet-capsule__aurora" aria-hidden />

      <div className="gauntlet-capsule__layout">
        {/* Left panel: brand + context */}
        <div className="gauntlet-capsule__panel gauntlet-capsule__panel--left">
          <header className="gauntlet-capsule__header">
            <div className="gauntlet-capsule__brand-block">
              <span className="gauntlet-capsule__mark" aria-hidden>
                <span className="gauntlet-capsule__mark-dot" />
              </span>
              <div className="gauntlet-capsule__brand-text">
                <span className="gauntlet-capsule__brand">GAUNTLET</span>
                <span className="gauntlet-capsule__tagline">cursor · capsule</span>
              </div>
            </div>
            <button
              type="button"
              className="gauntlet-capsule__close"
              onClick={onDismiss}
              aria-label="Dismiss capsule (Esc)"
            >
              <span aria-hidden>esc</span>
            </button>
          </header>

          <section className="gauntlet-capsule__context">
            <div className="gauntlet-capsule__context-meta">
              <span className="gauntlet-capsule__source">browser</span>
              <span className="gauntlet-capsule__url" title={snapshot.url}>
                {snapshot.pageTitle || snapshot.url}
              </span>
              <button
                type="button"
                className="gauntlet-capsule__refresh"
                onClick={refreshSnapshot}
                title="Re-read current selection"
              >
                re-read
              </button>
            </div>
            {snapshot.text ? (
              <pre className="gauntlet-capsule__selection">{truncate(snapshot.text, 600)}</pre>
            ) : (
              <p className="gauntlet-capsule__selection gauntlet-capsule__selection--empty">
                no selection — input alone will be sent as context
              </p>
            )}
          </section>
        </div>

        {/* Right panel: input + results */}
        <div className="gauntlet-capsule__panel gauntlet-capsule__panel--right">
          <form className="gauntlet-capsule__form" onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              className="gauntlet-capsule__input"
              placeholder="O que queres? — Enter para enviar, Shift+Enter nova linha"
              value={userInput}
              onChange={(ev) => setUserInput(ev.target.value)}
              onKeyDown={onTextareaKey}
              rows={2}
              disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing'}
            />
            <div className="gauntlet-capsule__actions">
              <span className="gauntlet-capsule__hint" aria-hidden>
                <span className="gauntlet-capsule__kbd">↵</span>
              </span>
              <button
                type="submit"
                className="gauntlet-capsule__compose"
                disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing' || !userInput.trim()}
              >
                {phase === 'planning' || phase === 'streaming' ? (
                  <>
                    <span className="gauntlet-capsule__compose-spinner" aria-hidden />
                    <span>{phase === 'planning' ? 'a pensar' : 'a escrever'}</span>
                  </>
                ) : (
                  'Enviar'
                )}
              </button>
            </div>
          </form>

          {phase === 'streaming' && partialCompose && (
            <section className="gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming">
              <header className="gauntlet-capsule__compose-meta">
                <span className="gauntlet-capsule__compose-tag">resposta</span>
                <span className="gauntlet-capsule__compose-meta-text">a escrever…</span>
              </header>
              <div className="gauntlet-capsule__compose-text">
                {partialCompose}
                <span className="gauntlet-capsule__compose-caret" aria-hidden>▍</span>
              </div>
            </section>
          )}

          {phase === 'planning' && (
            <section
              className="gauntlet-capsule__skeleton"
              role="status"
              aria-live="polite"
              aria-label="A pensar..."
            >
              <header className="gauntlet-capsule__skeleton-header">
                <span className="gauntlet-capsule__skeleton-tag" />
                <span className="gauntlet-capsule__skeleton-meta" />
              </header>
              <div className="gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90" />
              <div className="gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75" />
              <div className="gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55" />
            </section>
          )}

          {plan?.compose && phase === 'plan_ready' && (
            <section className="gauntlet-capsule__compose-result">
              <header className="gauntlet-capsule__compose-meta">
                <span className="gauntlet-capsule__compose-tag">resposta</span>
                <span className="gauntlet-capsule__compose-meta-text">
                  {plan.model_used}
                  {' · '}
                  {plan.latency_ms} ms
                </span>
              </header>
              <div className="gauntlet-capsule__compose-text">{plan.compose}</div>
              <div className="gauntlet-capsule__compose-actions">
                <button
                  type="button"
                  className="gauntlet-capsule__copy"
                  onClick={() => void onCopyCompose()}
                >
                  {copied ? 'copiado ✓' : 'Copy'}
                </button>
              </div>
            </section>
          )}

          {plan && plan.actions.length === 0 && !plan.compose && phase === 'plan_ready' && (
            <section className="gauntlet-capsule__plan">
              <p className="gauntlet-capsule__plan-empty">
                {plan.reason ?? 'Modelo não conseguiu planear.'}
              </p>
            </section>
          )}

          {plan && plan.actions.length > 0 && (phase === 'plan_ready' || phase === 'executing' || phase === 'executed') && (
            <section className="gauntlet-capsule__plan">
              <header className="gauntlet-capsule__plan-header">
                <span className="gauntlet-capsule__plan-title">plano</span>
                <span className="gauntlet-capsule__plan-meta">
                  {plan.actions.length} action{plan.actions.length === 1 ? '' : 's'}
                  {' · '}
                  {plan.model_used}
                  {' · '}
                  {plan.latency_ms} ms
                </span>
              </header>
              <ol className="gauntlet-capsule__plan-list">
                  {plan.actions.map((a, i) => {
                    const r = planResults?.[i];
                    const status = r ? (r.ok ? 'ok' : 'fail') : 'pending';
                    const danger = dangers[i];
                    return (
                      <li
                        key={`${i}-${a.type}-${a.selector}`}
                        className={`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${status}${
                          danger?.danger ? ' gauntlet-capsule__plan-item--danger' : ''
                        }`}
                      >
                        <span className="gauntlet-capsule__plan-step">{i + 1}</span>
                        <span className="gauntlet-capsule__plan-desc">{describeAction(a)}</span>
                        {danger?.danger && (
                          <span
                            className="gauntlet-capsule__plan-danger"
                            title={danger.reason}
                          >
                            sensível
                          </span>
                        )}
                        {r && !r.ok && (
                          <span className="gauntlet-capsule__plan-err" title={r.error}>
                            {r.error}
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ol>
              {phase !== 'executed' && hasDanger && (
                <div className="gauntlet-capsule__danger-gate" role="alert">
                  <header className="gauntlet-capsule__danger-header">
                    <span className="gauntlet-capsule__danger-mark" aria-hidden>!</span>
                    <span className="gauntlet-capsule__danger-title">
                      Acções sensíveis no plano
                    </span>
                  </header>
                  <ul className="gauntlet-capsule__danger-list">
                    {dangers.map((d, i) =>
                      d.danger ? (
                        <li key={`danger-${i}`}>
                          <strong>step {i + 1}:</strong> {d.reason ?? 'flagged'}
                        </li>
                      ) : null,
                    )}
                  </ul>
                  <label className="gauntlet-capsule__danger-confirm">
                    <input
                      type="checkbox"
                      checked={dangerConfirmed}
                      onChange={(ev) => setDangerConfirmed(ev.target.checked)}
                      disabled={phase === 'executing'}
                    />
                    <span>Confirmo, executar mesmo assim.</span>
                  </label>
                </div>
              )}
              {phase !== 'executed' && (
                <div className="gauntlet-capsule__plan-actions">
                  <button
                    type="button"
                    className={`gauntlet-capsule__execute${
                      hasDanger ? ' gauntlet-capsule__execute--danger' : ''
                    }`}
                    onClick={() => void executePlan()}
                    disabled={
                      phase === 'executing' || (hasDanger && !dangerConfirmed)
                    }
                  >
                    {phase === 'executing'
                      ? 'executando…'
                      : hasDanger
                        ? 'Executar com cuidado'
                        : 'Executar'}
                  </button>
                </div>
              )}
            </section>
          )}

          {phase === 'error' && error && (
            <div className="gauntlet-capsule__error" role="alert">
              <span className="gauntlet-capsule__error-icon" aria-hidden>!</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + '…';
}

// Pull a partial `compose` value out of a streaming JSON buffer.
// Returns null if the response does not look like a compose case
// (e.g., the model started with `{"actions":[…`). Handles the most
// common JSON escape sequences inside the partial string. The buffer
// can end mid-escape (`...He\` waiting for the next char); we drop a
// trailing lone backslash so the rendered text stays clean.
function extractPartialCompose(buffer: string): string | null {
  const match = buffer.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (!match) return null;
  let raw = match[1];
  // Drop a dangling backslash that could be the start of the next
  // escape sequence we haven't received yet.
  if (raw.endsWith('\\') && !raw.endsWith('\\\\')) {
    raw = raw.slice(0, -1);
  }
  return raw
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

// Carry the live page text, DOM skeleton and selection bbox through
// metadata so the backend (and the DOM-action planner in particular)
// has real selectors and live page context to work with. Backwards
// compatible: /composer/context ignores unknown metadata keys.
function buildCapture(snapshot: SelectionSnapshot): ContextCaptureRequest {
  const metadata: Record<string, unknown> = {};
  if (snapshot.pageText) metadata.page_text = snapshot.pageText;
  if (snapshot.domSkeleton) metadata.dom_skeleton = snapshot.domSkeleton;
  if (snapshot.bbox) metadata.selection_bbox = snapshot.bbox;
  return {
    source: 'browser',
    url: snapshot.url,
    page_title: snapshot.pageTitle,
    selection: snapshot.text || undefined,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}

function describeAction(action: DomAction): string {
  switch (action.type) {
    case 'fill':
      return `fill ${action.selector} ← "${truncate(action.value, 80)}"`;
    case 'click':
      return `click ${action.selector}`;
    case 'highlight':
      return `highlight ${action.selector}`;
    case 'scroll_to':
      return `scroll to ${action.selector}`;
  }
}

// Where to put the anchored capsule. Prefers below the selection; flips
// above when there isn't enough room below; clamps inside the viewport
// so the capsule never spills off-screen on small windows or selections
// near the edges. The output is a top-left corner — width/height are
// fixed via CSS so we don't need to know the rendered size to decide
// the corner.
const ANCHOR_WIDTH = 560;
const ANCHOR_GAP = 12;
const ANCHOR_VIEWPORT_PAD = 8;
const ANCHOR_MIN_BELOW_ROOM = 220;

function computeAnchorPosition(bbox: SelectionRect): { top: number; left: number } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  const belowTop = bbox.y + bbox.height + ANCHOR_GAP;
  const aboveBottom = bbox.y - ANCHOR_GAP;

  let top: number;
  if (belowTop + ANCHOR_MIN_BELOW_ROOM <= vh - ANCHOR_VIEWPORT_PAD) {
    top = belowTop;
  } else if (aboveBottom > ANCHOR_MIN_BELOW_ROOM) {
    // Flip above. Top edge sits N above the selection; the capsule's own
    // max-height handles the lower edge.
    top = Math.max(ANCHOR_VIEWPORT_PAD, aboveBottom - ANCHOR_MIN_BELOW_ROOM);
  } else {
    // No room either way — center vertically.
    top = Math.max(ANCHOR_VIEWPORT_PAD, Math.floor((vh - ANCHOR_MIN_BELOW_ROOM) / 2));
  }

  let left = bbox.x;
  const maxLeft = vw - ANCHOR_VIEWPORT_PAD - ANCHOR_WIDTH;
  if (left > maxLeft) left = maxLeft;
  if (left < ANCHOR_VIEWPORT_PAD) left = ANCHOR_VIEWPORT_PAD;

  return { top, left };
}

// CSS colocated — content-script shadow root needs the styles in the bundle.
// Aesthetic: glass morphism, ember accent, mono+serif typography, motion.
export const CAPSULE_CSS = `
@keyframes gauntlet-cap-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.15); }
}
@keyframes gauntlet-cap-aurora {
  0%   { transform: translate3d(-12%, -8%, 0) rotate(0deg); }
  50%  { transform: translate3d(8%,    6%, 0) rotate(180deg); }
  100% { transform: translate3d(-12%, -8%, 0) rotate(360deg); }
}
@keyframes gauntlet-cap-rise {
  0%   { opacity: 0; transform: translateY(8px) scale(0.985); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}
@keyframes gauntlet-cap-spin {
  to { transform: rotate(360deg); }
}

.gauntlet-capsule {
  --gx-ember: #d07a5a;
  --gx-bg: rgba(14, 16, 22, 0.92);
  --gx-bg-solid: #0e1016;
  --gx-surface: rgba(28, 30, 38, 0.70);
  --gx-border: rgba(255, 255, 255, 0.08);
  --gx-border-mid: rgba(255, 255, 255, 0.14);
  --gx-fg: #f0f2f7;
  --gx-fg-dim: #aab0bd;
  --gx-fg-muted: #6a7080;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 25vh;
  min-height: 180px;
  overflow: hidden;
  background: var(--gx-bg);
  color: var(--gx-fg);
  border-top: 1px solid var(--gx-border-mid);
  border-radius: 12px 12px 0 0;
  backdrop-filter: saturate(1.4) blur(28px);
  -webkit-backdrop-filter: saturate(1.4) blur(28px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 -8px 40px rgba(0, 0, 0, 0.45),
    0 -2px 12px rgba(0, 0, 0, 0.35);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  z-index: 2147483647;
  padding: 0;
  isolation: isolate;
  pointer-events: auto;
  animation: gauntlet-cap-rise 280ms cubic-bezier(0.2, 0, 0, 1) both;
}

/* Anchored mode — when the user has a selection on a web page, the
   capsule pops next to the cursor instead of pinning to the bottom of
   the viewport. The position itself is set via inline style by the
   component (computeAnchorPosition). The shape, border, shadow and
   max-height come from here so site CSS can never override them. */
.gauntlet-capsule--anchored {
  bottom: auto;
  right: auto;
  width: 560px;
  max-width: calc(100vw - 16px);
  height: auto;
  min-height: 0;
  max-height: 60vh;
  border: 1px solid var(--gx-border-mid);
  border-radius: 14px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 24px 60px rgba(0, 0, 0, 0.55),
    0 8px 24px rgba(0, 0, 0, 0.35);
}
.gauntlet-capsule--anchored .gauntlet-capsule__layout {
  flex-direction: column;
}
.gauntlet-capsule--anchored .gauntlet-capsule__panel--left {
  width: 100%;
  max-width: none;
  min-width: 0;
  border-right: none;
  border-bottom: 1px solid var(--gx-border);
  padding: 12px 14px;
}
.gauntlet-capsule--anchored .gauntlet-capsule__panel--right {
  padding: 12px 14px;
}
.gauntlet-capsule--anchored .gauntlet-capsule__selection {
  max-height: 90px;
}

.gauntlet-capsule__aurora {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(40% 40% at 30% 30%, rgba(208, 122, 90, 0.18), transparent 60%),
    radial-gradient(40% 40% at 70% 70%, rgba(98, 130, 200, 0.12), transparent 60%);
  filter: blur(40px);
  opacity: 0.6;
  pointer-events: none;
  z-index: -1;
  animation: gauntlet-cap-aurora 28s linear infinite;
}

/* ── Layout ── */
.gauntlet-capsule__layout {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
}

.gauntlet-capsule__panel {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
}

.gauntlet-capsule__panel--left {
  width: 28%;
  min-width: 200px;
  max-width: 340px;
  flex-shrink: 0;
  padding: 14px 16px;
  border-right: 1px solid var(--gx-border);
}

.gauntlet-capsule__panel--right {
  flex: 1;
  min-width: 0;
  padding: 14px 18px;
}

/* ── Header ── */
.gauntlet-capsule__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.gauntlet-capsule__brand-block {
  display: flex; align-items: center; gap: 10px;
}
.gauntlet-capsule__mark {
  position: relative;
  width: 22px; height: 22px;
  border-radius: 7px;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(208, 122, 90, 0.85), rgba(208, 122, 90, 0.35) 60%, transparent 100%),
    #1a1d26;
  border: 1px solid rgba(208, 122, 90, 0.45);
  box-shadow:
    0 0 18px rgba(208, 122, 90, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
  display: flex; align-items: center; justify-content: center;
}
.gauntlet-capsule__mark-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #f4c4ad;
  box-shadow: 0 0 10px rgba(244, 196, 173, 0.85);
  animation: gauntlet-cap-pulse 2.4s ease-in-out infinite;
}
.gauntlet-capsule__brand-text {
  display: flex; flex-direction: column; line-height: 1.05;
}
.gauntlet-capsule__brand {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.26em;
  color: var(--gx-fg);
}
.gauntlet-capsule__tagline {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  color: var(--gx-fg-muted);
  margin-top: 2px;
}
.gauntlet-capsule__close {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-muted);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
}
.gauntlet-capsule__close:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: rgba(255, 255, 255, 0.04);
}

/* ── Context ── */
.gauntlet-capsule__context {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.gauntlet-capsule__context-meta {
  display: flex; gap: 8px; align-items: center;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--gx-fg-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  font-family: "JetBrains Mono", monospace;
  flex-shrink: 0;
}
.gauntlet-capsule__source {
  background: rgba(208, 122, 90, 0.14);
  color: #f4c4ad;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(208, 122, 90, 0.28);
  letter-spacing: 0.12em;
}
.gauntlet-capsule__url {
  flex: 1;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  text-transform: none;
  font-family: "Inter", system-ui, sans-serif;
  letter-spacing: 0;
  color: var(--gx-fg-dim);
  font-size: 11px;
}
.gauntlet-capsule__refresh {
  background: transparent; border: 1px solid var(--gx-border); color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 9px; padding: 2px 8px; border-radius: 4px; cursor: pointer;
  letter-spacing: 0.12em;
}
.gauntlet-capsule__refresh:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: rgba(255, 255, 255, 0.04);
}
.gauntlet-capsule__selection {
  background: rgba(8, 9, 13, 0.6);
  border: 1px solid var(--gx-border);
  padding: 8px 10px;
  border-radius: 8px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11px;
  white-space: pre-wrap; word-break: break-word;
  flex: 1;
  overflow: auto;
  color: var(--gx-fg-dim); margin: 0;
}
.gauntlet-capsule__selection--empty {
  color: var(--gx-fg-muted); font-style: italic;
  font-family: "Inter", sans-serif;
  font-size: 11px;
}

/* ── Form ── */
.gauntlet-capsule__form {
  position: relative;
  flex-shrink: 0;
}
.gauntlet-capsule__input {
  width: 100%;
  background: rgba(8, 9, 13, 0.55);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
  min-height: 56px;
  box-sizing: border-box;
  line-height: 1.5;
  transition: border-color 140ms ease, box-shadow 200ms ease;
}
.gauntlet-capsule__input::placeholder { color: var(--gx-fg-muted); }
.gauntlet-capsule__input:focus {
  outline: none;
  border-color: rgba(208, 122, 90, 0.55);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.30),
    0 0 24px rgba(208, 122, 90, 0.18);
}
.gauntlet-capsule__actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 8px;
}
.gauntlet-capsule__hint {
  display: inline-flex; gap: 4px; align-items: center;
  color: var(--gx-fg-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}
.gauntlet-capsule__kbd {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px;
  padding: 0 4px;
  border: 1px solid var(--gx-border-mid);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--gx-fg-dim);
  font-size: 10px;
}
.gauntlet-capsule__compose {
  position: relative;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #0e1016;
  background:
    linear-gradient(180deg, #f0f2f7 0%, #d4d8e0 100%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.20),
    0 6px 18px rgba(208, 122, 90, 0.30);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__compose:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.32),
    0 10px 24px rgba(208, 122, 90, 0.45);
}
.gauntlet-capsule__compose:disabled {
  opacity: 0.45; cursor: not-allowed; transform: none;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.10);
}
.gauntlet-capsule__compose-spinner {
  width: 12px; height: 12px;
  border: 2px solid rgba(14, 16, 22, 0.25);
  border-top-color: #0e1016;
  border-radius: 50%;
  animation: gauntlet-cap-spin 0.7s linear infinite;
}

/* ── Error ── */
.gauntlet-capsule__error {
  margin-top: 10px; padding: 8px 12px;
  background: rgba(212, 96, 60, 0.10);
  border: 1px solid rgba(212, 96, 60, 0.32);
  color: #f1a4ad;
  border-radius: 8px;
  font-size: 12px;
  display: flex; align-items: center; gap: 10px;
}
.gauntlet-capsule__error-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(212, 96, 60, 0.25);
  color: #f1a4ad;
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
}

/* ── Preview ── */
.gauntlet-capsule__preview {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--gx-border);
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__preview-meta {
  display: flex; flex-wrap: wrap; gap: 6px;
  margin-bottom: 8px;
}
.gauntlet-capsule__preview-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--gx-border);
  background: rgba(255, 255, 255, 0.03);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}
.gauntlet-capsule__preview-pill[data-tone="high"] {
  border-color: rgba(122, 180, 138, 0.35);
  background: rgba(122, 180, 138, 0.10);
}
.gauntlet-capsule__preview-pill[data-tone="low"] {
  border-color: rgba(212, 120, 90, 0.35);
  background: rgba(212, 120, 90, 0.10);
}
.gauntlet-capsule__preview-key { color: var(--gx-fg-muted); }
.gauntlet-capsule__preview-val { color: var(--gx-fg); }

.gauntlet-capsule__artifact {
  background: rgba(8, 9, 13, 0.65);
  border: 1px solid var(--gx-border);
  padding: 10px 12px;
  border-radius: 10px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 12px;
  color: var(--gx-fg);
  white-space: pre-wrap; word-break: break-word;
  margin: 0;
  line-height: 1.55;
}
.gauntlet-capsule__preview-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__copy {
  background: rgba(255, 255, 255, 0.04);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  transition: background 120ms ease, border-color 120ms ease;
}
.gauntlet-capsule__copy:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.22);
}

.gauntlet-capsule__refusal {
  padding: 12px;
  background: rgba(208, 122, 90, 0.07);
  border: 1px solid rgba(208, 122, 90, 0.25);
  border-radius: 10px;
  font-size: 12px;
  color: #e8c8a4;
}
.gauntlet-capsule__refusal header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__refusal-mark {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f4c4ad;
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__refusal-reason {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__refusal p { margin: 0 0 8px; line-height: 1.5; }
.gauntlet-capsule__refusal ul { margin: 8px 0 0; padding-left: 18px; }
.gauntlet-capsule__refusal li { margin: 3px 0; }

/* ── Action-buttons row ── */
.gauntlet-capsule__action-buttons {
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__actuate {
  background: rgba(208, 122, 90, 0.12);
  color: #f4c4ad;
  border: 1px solid rgba(208, 122, 90, 0.45);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: background 120ms ease, transform 120ms ease, opacity 120ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__actuate:hover:not(:disabled) {
  background: rgba(208, 122, 90, 0.22);
  transform: translateY(-1px);
}
.gauntlet-capsule__actuate:disabled {
  opacity: 0.45; cursor: not-allowed;
}

/* ── Skeleton (perceived speed during the planning roundtrip) ──
   We can't stream tokens yet (Sprint 1.4-A), but a shimmering
   placeholder turns 1.5–4s of model latency from "spinner silence"
   into "the capsule is thinking". The shimmer reads as activity even
   if nothing else changes on screen. */
@keyframes gauntlet-cap-shimmer {
  0%   { background-position: -240px 0; }
  100% { background-position:  240px 0; }
}
.gauntlet-capsule__skeleton {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(8, 9, 13, 0.5);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 200ms cubic-bezier(0.2, 0, 0, 1) both;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gauntlet-capsule__skeleton-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 2px;
}
.gauntlet-capsule__skeleton-tag,
.gauntlet-capsule__skeleton-meta,
.gauntlet-capsule__skeleton-line {
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(208, 122, 90, 0.18) 50%,
      rgba(255, 255, 255, 0.04) 100%
    );
  background-size: 240px 100%;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  animation: gauntlet-cap-shimmer 1.4s ease-in-out infinite;
}
.gauntlet-capsule__skeleton-tag   { width: 56px; height: 14px; border-radius: 4px; }
.gauntlet-capsule__skeleton-meta  { width: 140px; height: 10px; border-radius: 3px; }
.gauntlet-capsule__skeleton-line  { height: 11px; border-radius: 3px; }
.gauntlet-capsule__skeleton-line--w90 { width: 90%; animation-delay: 0ms; }
.gauntlet-capsule__skeleton-line--w75 { width: 75%; animation-delay: 120ms; }
.gauntlet-capsule__skeleton-line--w55 { width: 55%; animation-delay: 240ms; }

/* ── Compose response (inline text answer) ── */
.gauntlet-capsule__compose-result {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(8, 9, 13, 0.5);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__compose-meta {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__compose-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f4c4ad;
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__compose-meta-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__compose-text {
  font-size: 13px;
  line-height: 1.55;
  color: var(--gx-fg);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 220px;
  overflow-y: auto;
}
.gauntlet-capsule__compose-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
@keyframes gauntlet-cap-caret {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.gauntlet-capsule__compose-caret {
  display: inline-block;
  margin-left: 1px;
  color: var(--gx-ember);
  animation: gauntlet-cap-caret 1s steps(1) infinite;
}
.gauntlet-capsule__compose-result--streaming {
  border-color: rgba(208, 122, 90, 0.35);
}

/* ── Plan section ── */
.gauntlet-capsule__plan {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(8, 9, 13, 0.5);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__plan-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__plan-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f4c4ad;
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__plan-meta {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__plan-empty {
  margin: 0;
  font-size: 12px;
  color: var(--gx-fg-dim);
  font-style: italic;
}
.gauntlet-capsule__plan-list {
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 4px;
}
.gauntlet-capsule__plan-item {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
  border: 1px solid transparent;
  transition: background 120ms ease, border-color 120ms ease;
}
.gauntlet-capsule__plan-item--ok {
  background: rgba(122, 180, 138, 0.10);
  border-color: rgba(122, 180, 138, 0.35);
  color: #cfe8d3;
}
.gauntlet-capsule__plan-item--fail {
  background: rgba(212, 96, 60, 0.10);
  border-color: rgba(212, 96, 60, 0.35);
  color: #f1a4ad;
}
.gauntlet-capsule__plan-step {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: var(--gx-fg);
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}
.gauntlet-capsule__plan-desc {
  flex: 1;
  word-break: break-all;
}
.gauntlet-capsule__plan-err {
  font-size: 10px;
  color: #f1a4ad;
  font-style: italic;
}
.gauntlet-capsule__plan-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__execute {
  background: linear-gradient(180deg, #d07a5a 0%, #b65d3f 100%);
  color: #0e1016;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.15),
    0 6px 18px rgba(208, 122, 90, 0.45);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}
.gauntlet-capsule__execute:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.25),
    0 10px 24px rgba(208, 122, 90, 0.55);
}
.gauntlet-capsule__execute:disabled {
  opacity: 0.45; cursor: not-allowed; transform: none;
}
.gauntlet-capsule__execute--danger {
  background: linear-gradient(180deg, #d4603c 0%, #a8401e 100%);
  box-shadow:
    0 0 0 1px rgba(255, 90, 60, 0.35),
    0 6px 18px rgba(212, 96, 60, 0.55);
  color: #fff;
}
.gauntlet-capsule__execute--danger:hover:not(:disabled) {
  box-shadow:
    0 0 0 1px rgba(255, 120, 90, 0.45),
    0 10px 24px rgba(212, 96, 60, 0.65);
}

/* ── Per-item danger badge ── */
.gauntlet-capsule__plan-item--danger {
  background: rgba(212, 96, 60, 0.08);
  border-color: rgba(212, 96, 60, 0.30);
}
.gauntlet-capsule__plan-danger {
  flex-shrink: 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #f1a4ad;
  background: rgba(212, 96, 60, 0.18);
  border: 1px solid rgba(212, 96, 60, 0.45);
  border-radius: 4px;
  padding: 2px 6px;
}

/* ── Danger gate — explicit confirmation before destructive execution ── */
.gauntlet-capsule__danger-gate {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(212, 96, 60, 0.10);
  border: 1px solid rgba(212, 96, 60, 0.40);
  border-radius: 8px;
  animation: gauntlet-cap-rise 220ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__danger-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 6px;
}
.gauntlet-capsule__danger-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(212, 96, 60, 0.30);
  color: #fff;
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
}
.gauntlet-capsule__danger-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: #f1a4ad;
}
.gauntlet-capsule__danger-list {
  margin: 0 0 8px 0; padding: 0 0 0 24px;
  font-size: 11px;
  color: #f1a4ad;
  line-height: 1.6;
}
.gauntlet-capsule__danger-list li { margin: 0; }
.gauntlet-capsule__danger-list strong {
  color: #fff;
  font-weight: 600;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  margin-right: 4px;
}
.gauntlet-capsule__danger-confirm {
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--gx-fg);
  user-select: none;
}
.gauntlet-capsule__danger-confirm input[type="checkbox"] {
  width: 14px; height: 14px;
  accent-color: #d4603c;
  cursor: pointer;
}
`;
