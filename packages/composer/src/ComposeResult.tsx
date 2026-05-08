// ComposeResult — renders the textual answer when the agent emits
// `compose` instead of (or alongside) DOM actions.
//
// Pure presentational component. Capsule passes the compose string,
// metadata (model/latency), feedback flags (copied / savedFlash /
// savedToDiskFlash) and the action callbacks. The optional
// "Guardar como" button only renders when the caller passes
// `onSaveDisk` (Capsule decides based on ambient capabilities).

import { Markdown } from './markdown';

export interface ComposeResultProps {
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

export function ComposeResult({
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
}: ComposeResultProps) {
  return (
    <section className="gauntlet-capsule__compose-result">
      <header className="gauntlet-capsule__compose-meta">
        <span className="gauntlet-capsule__compose-tag">resposta</span>
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
