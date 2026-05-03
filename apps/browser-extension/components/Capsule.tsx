// Capsule — Gauntlet's flagship cursor surface.
//
// Doctrine for this file:
//   * Cursor never leaves the page. Capsule floats, dismissable on Esc.
//   * Glass + serif headline + mono labels. One ember accent for life.
//   * Input + Compor + preview + Copy. Nothing else.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ComposerClient,
  composeOnce,
  type ComposeResult,
  type ContextCaptureRequest,
} from '../lib/composer-client';
import type { SelectionSnapshot } from '../lib/selection';

export interface CapsuleProps {
  client: ComposerClient;
  initialSnapshot: SelectionSnapshot;
  onDismiss: () => void;
}

type Phase = 'idle' | 'composing' | 'ready' | 'error';

export function Capsule({ client, initialSnapshot, onDismiss }: CapsuleProps) {
  const [snapshot, setSnapshot] = useState<SelectionSnapshot>(initialSnapshot);
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<ComposeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    return () => abortRef.current?.abort();
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

  const compose = useCallback(async () => {
    if (!userInput.trim() || phase === 'composing') return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setPhase('composing');
    setError(null);
    setResult(null);
    setCopied(false);
    const capture: ContextCaptureRequest = {
      source: 'browser',
      url: snapshot.url,
      page_title: snapshot.pageTitle,
      selection: snapshot.text || undefined,
    };
    try {
      const r = await composeOnce(client, capture, userInput.trim(), ac.signal);
      setResult(r);
      setPhase('ready');
    } catch (err: unknown) {
      if (ac.signal.aborted) return;
      setError(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  }, [client, snapshot, userInput, phase]);

  const onSubmit = useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      void compose();
    },
    [compose],
  );

  const onTextareaKey = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        void compose();
      }
    },
    [compose],
  );

  const refreshSnapshot = useCallback(() => {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    setSnapshot({
      text,
      url: window.location.href,
      pageTitle: document.title,
    });
  }, []);

  const onCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.preview.artifact.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Clipboard write blocked. Select the preview and copy manually.');
    }
  }, [result]);

  return (
    <div className="gauntlet-capsule" role="dialog" aria-label="Gauntlet">
      <div className="gauntlet-capsule__aurora" aria-hidden />
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

      <form className="gauntlet-capsule__form" onSubmit={onSubmit}>
        <textarea
          ref={inputRef}
          className="gauntlet-capsule__input"
          placeholder="O que queres fazer? — Cmd/Ctrl + Enter to compose"
          value={userInput}
          onChange={(ev) => setUserInput(ev.target.value)}
          onKeyDown={onTextareaKey}
          rows={2}
          disabled={phase === 'composing'}
        />
        <div className="gauntlet-capsule__actions">
          <span className="gauntlet-capsule__hint" aria-hidden>
            <span className="gauntlet-capsule__kbd">⌘</span>
            <span className="gauntlet-capsule__kbd">↵</span>
          </span>
          <button
            type="submit"
            className="gauntlet-capsule__compose"
            disabled={phase === 'composing' || !userInput.trim()}
          >
            {phase === 'composing' ? (
              <>
                <span className="gauntlet-capsule__compose-spinner" aria-hidden />
                <span>compondo</span>
              </>
            ) : (
              'Compor'
            )}
          </button>
        </div>
      </form>

      {phase === 'error' && error && (
        <div className="gauntlet-capsule__error" role="alert">
          <span className="gauntlet-capsule__error-icon" aria-hidden>!</span>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <section className="gauntlet-capsule__preview">
          <div className="gauntlet-capsule__preview-meta">
            <span className="gauntlet-capsule__preview-pill">
              <span className="gauntlet-capsule__preview-key">intent</span>
              <span className="gauntlet-capsule__preview-val">{result.intent.intent}</span>
            </span>
            <span className="gauntlet-capsule__preview-pill">
              <span className="gauntlet-capsule__preview-key">conf</span>
              <span className="gauntlet-capsule__preview-val">
                {result.intent.confidence.toFixed(2)}
              </span>
            </span>
            <span className="gauntlet-capsule__preview-pill">
              <span className="gauntlet-capsule__preview-key">model</span>
              <span className="gauntlet-capsule__preview-val">{result.preview.model_used}</span>
            </span>
            <span className="gauntlet-capsule__preview-pill">
              <span className="gauntlet-capsule__preview-key">latency</span>
              <span className="gauntlet-capsule__preview-val">{result.preview.latency_ms} ms</span>
            </span>
            {result.preview.judge_verdict && (
              <span className="gauntlet-capsule__preview-pill" data-tone={result.preview.judge_verdict}>
                <span className="gauntlet-capsule__preview-key">judge</span>
                <span className="gauntlet-capsule__preview-val">{result.preview.judge_verdict}</span>
              </span>
            )}
          </div>

          {result.preview.refused ? (
            <div className="gauntlet-capsule__refusal">
              <header>
                <span className="gauntlet-capsule__refusal-mark">refusal</span>
                <span className="gauntlet-capsule__refusal-reason">
                  {result.preview.refusal_reason}
                </span>
              </header>
              <p>{result.preview.artifact.content}</p>
              {result.intent.clarifying_questions.length > 0 && (
                <ul>
                  {result.intent.clarifying_questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <>
              <pre className="gauntlet-capsule__artifact">
                {result.preview.artifact.content}
              </pre>
              <div className="gauntlet-capsule__preview-actions">
                <button
                  type="button"
                  className="gauntlet-capsule__copy"
                  onClick={onCopy}
                >
                  {copied ? 'copiado ✓' : 'Copy'}
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + '…';
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
  --gx-bg: rgba(14, 16, 22, 0.78);
  --gx-bg-solid: #0e1016;
  --gx-surface: rgba(28, 30, 38, 0.70);
  --gx-border: rgba(255, 255, 255, 0.08);
  --gx-border-mid: rgba(255, 255, 255, 0.14);
  --gx-fg: #f0f2f7;
  --gx-fg-dim: #aab0bd;
  --gx-fg-muted: #6a7080;

  position: fixed;
  top: 80px;
  right: 24px;
  width: 480px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  background: var(--gx-bg);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border);
  border-radius: 14px;
  backdrop-filter: saturate(1.4) blur(28px);
  -webkit-backdrop-filter: saturate(1.4) blur(28px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 12px 40px rgba(0, 0, 0, 0.45),
    0 4px 12px rgba(0, 0, 0, 0.35);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  z-index: 2147483647;
  padding: 16px 18px 18px;
  isolation: isolate;
  animation: gauntlet-cap-rise 280ms cubic-bezier(0.2, 0, 0, 1) both;
}

.gauntlet-capsule__aurora {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(40% 40% at 30% 30%, rgba(208, 122, 90, 0.22), transparent 60%),
    radial-gradient(40% 40% at 70% 70%, rgba(98, 130, 200, 0.16), transparent 60%);
  filter: blur(40px);
  opacity: 0.6;
  pointer-events: none;
  z-index: -1;
  animation: gauntlet-cap-aurora 28s linear infinite;
}

.gauntlet-capsule__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
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

.gauntlet-capsule__context {
  margin-bottom: 12px;
}
.gauntlet-capsule__context-meta {
  display: flex; gap: 8px; align-items: center;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--gx-fg-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  font-family: "JetBrains Mono", monospace;
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
  padding: 10px 12px;
  border-radius: 8px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11.5px;
  white-space: pre-wrap; word-break: break-word;
  max-height: 140px; overflow: auto;
  color: var(--gx-fg-dim); margin: 0;
}
.gauntlet-capsule__selection--empty {
  color: var(--gx-fg-muted); font-style: italic;
  font-family: "Inter", sans-serif;
  font-size: 11px;
}

.gauntlet-capsule__form {
  position: relative;
}
.gauntlet-capsule__input {
  width: 100%;
  background: rgba(8, 9, 13, 0.55);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical; min-height: 64px;
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
  gap: 12px; margin-top: 10px;
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
  padding: 9px 18px;
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

.gauntlet-capsule__error {
  margin-top: 12px; padding: 10px 12px;
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
}

.gauntlet-capsule__preview {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--gx-border);
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__preview-meta {
  display: flex; flex-wrap: wrap; gap: 6px;
  margin-bottom: 12px;
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
  padding: 12px 14px;
  border-radius: 10px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 12px;
  color: var(--gx-fg);
  white-space: pre-wrap; word-break: break-word;
  max-height: 360px; overflow: auto; margin: 0;
  line-height: 1.55;
}
.gauntlet-capsule__preview-actions {
  display: flex; justify-content: flex-end; margin-top: 10px;
}
.gauntlet-capsule__copy {
  background: rgba(255, 255, 255, 0.04);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 8px;
  padding: 7px 16px;
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
  padding: 14px;
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
`;
