// AnswerPanel — renders the textual answer when the agent emits
// `compose` instead of (or alongside) DOM actions.
//
// Pure presentational component. Capsule passes the compose string,
// metadata (model/latency), feedback flags (copied / savedFlash /
// savedToDiskFlash) and the action callbacks. The optional
// "Guardar como" button only renders when the caller passes
// `onSaveDisk` (Capsule decides based on ambient capabilities).
//
// Named AnswerPanel (not ComposeResult) to avoid colliding with the
// `ComposeResult` wire type that composer-client exports for the
// composeOnce() return shape.

import { Markdown } from './markdown';

export interface AnswerPanelProps {
  compose: string;
  modelUsed: string;
  latencyMs: number;
  copied: boolean;
  savedFlash: string | null;
  savedToDiskFlash: string | null;
  onCopy: () => void;
  onSaveMemory: () => void;
  onSaveDisk?: () => void;
  onCopyBlock: () => void;
}

export function AnswerPanel({
  compose,
  modelUsed,
  latencyMs,
  copied,
  savedFlash,
  savedToDiskFlash,
  onCopy,
  onSaveMemory,
  onSaveDisk,
  onCopyBlock,
}: AnswerPanelProps) {
  return (
    <section className="gauntlet-capsule__compose-result gx-anim-fade">
      <header className="gauntlet-capsule__compose-meta">
        {/* Live region scoped to the short status tag only — putting it
            on the <section> would make AT announce the entire markdown
            answer on every update. The tag flips visible the moment the
            answer mounts, which is the actual "ready" signal. */}
        <span className="gauntlet-capsule__compose-tag" role="status" aria-live="polite">
          resposta
        </span>
        <span className="gauntlet-capsule__compose-meta-text">
          {modelUsed}
          {' · '}
          {latencyMs} ms
        </span>
      </header>
      <div className="gauntlet-capsule__compose-text">
        <Markdown source={compose} onCopyBlock={onCopyBlock} />
      </div>
      <div className="gauntlet-capsule__compose-actions">
        <button
          type="button"
          className="gauntlet-capsule__copy"
          onClick={onCopy}
        >
          {copied ? 'copiado ✓' : 'Copy'}
        </button>
        <button
          type="button"
          className="gauntlet-capsule__copy gauntlet-capsule__copy--ghost"
          onClick={onSaveMemory}
        >
          {savedFlash === 'saved' ? 'guardado ✓' : 'Save'}
        </button>
        {onSaveDisk && (
          <button
            type="button"
            className="gauntlet-capsule__copy gauntlet-capsule__copy--ghost"
            onClick={onSaveDisk}
            title="Guardar resposta para um ficheiro"
          >
            {savedToDiskFlash ? `→ ${savedToDiskFlash}` : 'Guardar como'}
          </button>
        )}
      </div>
    </section>
  );
}
