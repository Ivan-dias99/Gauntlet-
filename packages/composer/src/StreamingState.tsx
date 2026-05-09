// StreamingState — pre-plan_ready feedback. Renders one of two shapes:
//   * the streaming compose preview (when the agent already emitted
//     a partial `compose` value via the JSON delta extractor), or
//   * the skeleton card (planning phase, or streaming with no partial
//     compose yet — e.g., the model is on an action plan and hasn't
//     emitted a compose key in the buffer).
//
// Pure presentational. Capsule decides which mode to render via the
// `mode` prop; we just draw it.

export type StreamingMode = 'streaming-compose' | 'skeleton';

export interface StreamingStateProps {
  mode: StreamingMode;
  partialCompose?: string;
  tokensStreamed?: number;
}

export function StreamingState({ mode, partialCompose, tokensStreamed }: StreamingStateProps) {
  if (mode === 'streaming-compose') {
    return (
      <section className="gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming">
        <header className="gauntlet-capsule__compose-meta">
          <span className="gauntlet-capsule__compose-tag">resposta</span>
          <span className="gauntlet-capsule__compose-meta-text">
            <span
              key={tokensStreamed}
              className="gauntlet-capsule__token-counter gauntlet-capsule__token-counter--pulse"
              aria-live="polite"
            >
              {tokensStreamed ?? 0} chunks
            </span>
            <span aria-hidden>·</span>
            <span>a escrever…</span>
          </span>
        </header>
        <div
          className="gauntlet-capsule__progress-bar"
          role="progressbar"
          aria-label="A receber resposta"
          aria-valuetext="indeterminate"
        >
          <span className="gauntlet-capsule__progress-bar-track" />
        </div>
        <div className="gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming">
          {partialCompose ?? ''}
          <span className="gauntlet-capsule__compose-caret" aria-hidden>▍</span>
        </div>
      </section>
    );
  }
  return (
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
  );
}
