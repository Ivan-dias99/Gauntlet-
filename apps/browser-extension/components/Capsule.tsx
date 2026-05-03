// Capsule — Gauntlet's minimal cursor surface.
//
// Doctrine for this file:
//   * Feio mas funcional. Dense, technical, no hero copy.
//   * Input + Compor + preview + Copy. That's the whole product surface.
//   * No mode tabs, no expanded views. The capsule is the product.
//   * Cursor never leaves the page — capsule sits floating, dismissable on Esc.

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
      <header className="gauntlet-capsule__header">
        <span className="gauntlet-capsule__brand">GAUNTLET</span>
        <button
          type="button"
          className="gauntlet-capsule__close"
          onClick={onDismiss}
          aria-label="Dismiss capsule (Esc)"
        >
          ×
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
          placeholder="O que deseja fazer? (Ctrl/Cmd+Enter to compose)"
          value={userInput}
          onChange={(ev) => setUserInput(ev.target.value)}
          onKeyDown={onTextareaKey}
          rows={2}
          disabled={phase === 'composing'}
        />
        <div className="gauntlet-capsule__actions">
          <button
            type="submit"
            className="gauntlet-capsule__compose"
            disabled={phase === 'composing' || !userInput.trim()}
          >
            {phase === 'composing' ? 'compondo…' : 'Compor'}
          </button>
        </div>
      </form>

      {phase === 'error' && error && (
        <div className="gauntlet-capsule__error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <section className="gauntlet-capsule__preview">
          <div className="gauntlet-capsule__preview-meta">
            <span>
              intent: <b>{result.intent.intent}</b>
            </span>
            <span>conf: {result.intent.confidence.toFixed(2)}</span>
            <span>model: {result.preview.model_used}</span>
            <span>{result.preview.latency_ms} ms</span>
            {result.preview.judge_verdict && (
              <span>judge: {result.preview.judge_verdict}</span>
            )}
          </div>

          {result.preview.refused ? (
            <div className="gauntlet-capsule__refusal">
              <strong>refusal</strong>
              <span> — {result.preview.refusal_reason}</span>
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

// Inline styles colocated with the component because the content-script
// shadow root needs them in the same bundle (no separate CSS pipeline in
// V0). Visual: console-of-operator, not product. Beauty in Operação 4.
export const CAPSULE_CSS = `
.gauntlet-capsule {
  position: fixed;
  top: 80px;
  right: 24px;
  width: 480px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  background: #0e1014;
  color: #d6dde6;
  border: 1px solid #2a3140;
  border-radius: 10px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  z-index: 2147483647;
  padding: 14px 16px;
}
.gauntlet-capsule__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.gauntlet-capsule__brand {
  letter-spacing: 0.18em;
  font-size: 11px;
  color: #6b7888;
}
.gauntlet-capsule__close {
  background: none; border: none; color: #8995a6;
  font-size: 18px; cursor: pointer; padding: 0 4px;
}
.gauntlet-capsule__close:hover { color: #fff; }
.gauntlet-capsule__context-meta {
  display: flex; gap: 8px; align-items: center;
  font-size: 11px; color: #8995a6; margin-bottom: 6px;
}
.gauntlet-capsule__source {
  background: #1a2030; padding: 1px 6px; border-radius: 4px; color: #9eb1cc;
}
.gauntlet-capsule__url {
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.gauntlet-capsule__refresh {
  background: none; border: 1px solid #2a3140; color: #9eb1cc;
  font-size: 10px; padding: 1px 6px; border-radius: 4px; cursor: pointer;
}
.gauntlet-capsule__selection {
  background: #161b24; border: 1px solid #1f2734;
  padding: 8px 10px; border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  white-space: pre-wrap; word-break: break-word;
  max-height: 140px; overflow: auto;
  color: #c4cfdc; margin: 0 0 12px;
}
.gauntlet-capsule__selection--empty { color: #5e6776; font-style: italic; }
.gauntlet-capsule__input {
  width: 100%;
  background: #161b24; color: #e6ecf2;
  border: 1px solid #2a3140; border-radius: 6px;
  padding: 8px 10px; font-family: inherit; font-size: 13px;
  resize: vertical; min-height: 44px;
  box-sizing: border-box;
}
.gauntlet-capsule__input:focus { outline: 1px solid #4a7cff; }
.gauntlet-capsule__actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__compose {
  background: #4a7cff; color: white; border: none; border-radius: 6px;
  padding: 6px 14px; font-weight: 600; cursor: pointer; font-size: 13px;
}
.gauntlet-capsule__compose:disabled { background: #2a3140; color: #5e6776; cursor: not-allowed; }
.gauntlet-capsule__error {
  margin-top: 10px; padding: 8px 10px;
  background: #2b1418; border: 1px solid #5a2a30; color: #f1a4ad;
  border-radius: 6px; font-size: 12px;
}
.gauntlet-capsule__preview { margin-top: 14px; border-top: 1px solid #1f2734; padding-top: 12px; }
.gauntlet-capsule__preview-meta {
  display: flex; flex-wrap: wrap; gap: 10px;
  font-size: 11px; color: #8995a6; margin-bottom: 8px;
}
.gauntlet-capsule__preview-meta b { color: #c4cfdc; }
.gauntlet-capsule__artifact {
  background: #0a0d12; border: 1px solid #1f2734;
  padding: 10px; border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px; color: #e6ecf2;
  white-space: pre-wrap; word-break: break-word;
  max-height: 320px; overflow: auto; margin: 0;
}
.gauntlet-capsule__preview-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__copy {
  background: #1a2030; color: #c4cfdc; border: 1px solid #2a3140;
  border-radius: 6px; padding: 6px 14px; cursor: pointer; font-size: 12px;
}
.gauntlet-capsule__copy:hover { background: #232a3b; color: #fff; }
.gauntlet-capsule__refusal {
  padding: 10px; background: #251a14; border: 1px solid #4a3322;
  border-radius: 6px; font-size: 12px; color: #e8c8a4;
}
.gauntlet-capsule__refusal p { margin: 6px 0 0; }
.gauntlet-capsule__refusal ul { margin: 8px 0 0; padding-left: 18px; }
`;
