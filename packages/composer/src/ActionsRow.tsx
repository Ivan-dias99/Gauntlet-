// ActionsRow — the row of buttons under the textarea: keyboard hint,
// optional anexar / ecrã / mic buttons (capability-gated), and the
// submit button with its ripple. Pure presentational; the Capsule
// owns every callback and capability flag.
//
// The voice button is a press-and-hold (pointerdown/up/leave) so the
// caller passes onVoiceStart / onVoiceStop separately. `voiceActive`
// drives the visual state and the accessible label.
//
// `submitRipple` increments per submit so the ripple keyframe replays
// even when two submits land in quick succession.

export interface ActionsRowProps {
  busy: boolean;
  canSubmit: boolean;
  submitRipple: number;
  submitLabel: 'idle' | 'thinking' | 'streaming';
  showAttachFile: boolean;
  showAttachScreen: boolean;
  showVoice: boolean;
  voiceActive: boolean;
  onAttachFile: () => void;
  onAttachScreen: () => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
}

export function ActionsRow({
  busy,
  canSubmit,
  submitRipple,
  submitLabel,
  showAttachFile,
  showAttachScreen,
  showVoice,
  voiceActive,
  onAttachFile,
  onAttachScreen,
  onVoiceStart,
  onVoiceStop,
}: ActionsRowProps) {
  return (
    <div className="gauntlet-capsule__actions">
      <span className="gauntlet-capsule__hint" aria-hidden>
        <span className="gauntlet-capsule__kbd">↵</span>
        <span className="gauntlet-capsule__kbd-sep">·</span>
        <span className="gauntlet-capsule__kbd">⌘K</span>
      </span>
      {showAttachFile && (
        <button
          type="button"
          className="gauntlet-capsule__attach-btn"
          onClick={onAttachFile}
          aria-label="Anexar ficheiro local"
          title="Anexar ficheiro do disco"
          disabled={busy}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
            <path
              d="M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z"
              transform="rotate(45 12 12)"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span className="gauntlet-capsule__attach-label">anexar</span>
        </button>
      )}
      {showAttachScreen && (
        <button
          type="button"
          className="gauntlet-capsule__attach-btn"
          onClick={onAttachScreen}
          aria-label="Capturar ecrã inteiro"
          title="Capturar ecrã inteiro"
          disabled={busy}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
            <rect
              x="3" y="5" width="18" height="13" rx="2"
              fill="none" stroke="currentColor" strokeWidth="1.6"
            />
            <circle cx="12" cy="11.5" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="gauntlet-capsule__attach-label">ecrã</span>
        </button>
      )}
      {/* Botão SHELL removido do row para paridade visual entre shells
          — só desktop tinha o capability shellExecute, o que entregava
          ao operador "estás em desktop". A funcionalidade fica
          acessível via slash /shell quando o ambient suporta. */}
      {showVoice && (
        <button
          type="button"
          className={`gauntlet-capsule__voice${
            voiceActive ? ' gauntlet-capsule__voice--active' : ''
          }`}
          onPointerDown={(ev) => {
            ev.preventDefault();
            onVoiceStart();
          }}
          onPointerUp={onVoiceStop}
          onPointerLeave={() => {
            if (voiceActive) onVoiceStop();
          }}
          aria-label={voiceActive ? 'A ouvir — solta para enviar' : 'Premer e falar'}
          title="Premir e falar"
          disabled={busy}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
            <path
              d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"
              fill="currentColor"
            />
            <path
              d="M19 11a7 7 0 0 1-14 0M12 18v3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="gauntlet-capsule__voice-label">
            {voiceActive ? 'a ouvir' : 'voz'}
          </span>
        </button>
      )}
      <button
        type="submit"
        className="gauntlet-capsule__compose"
        disabled={!canSubmit}
      >
        {/* Ripple — keyed on submitRipple so each submit replays the
            keyframe even if the previous ripple is still mid-animation.
            Pointer-events none so the underlying button still takes
            clicks. */}
        {submitRipple > 0 && (
          <span
            key={submitRipple}
            className="gauntlet-capsule__compose-ripple"
            aria-hidden
          />
        )}
        {submitLabel === 'idle' ? (
          'Enviar'
        ) : (
          <>
            <span className="gauntlet-capsule__compose-spinner" aria-hidden />
            <span>{submitLabel === 'thinking' ? 'a pensar' : 'a escrever'}</span>
          </>
        )}
      </button>
    </div>
  );
}
