// Capsule keyboard shortcuts — Cmd/Ctrl+K toggles the command palette;
// Escape unrolls overlays in priority order (palette → voice cancel →
// dismiss the cápsula). Single window keydown listener handles both
// keys so capture-phase ordering is deterministic.

import { useEffect } from 'react';

export interface UseCapsuleKeyboardArgs {
  paletteOpen: boolean;
  setPaletteOpen: (next: boolean | ((v: boolean) => boolean)) => void;
  // True iff the operator is mid-press on the mic button. Esc cancels
  // the in-flight voice capture WITHOUT dismissing the cápsula.
  voiceActive: boolean;
  cancelVoiceCapture: () => void;
  // Last layer — closes the cápsula (the wrapper reports a pending
  // plan as rejected before tearing down).
  handleDismiss: () => void;
}

export function useCapsuleKeyboard({
  paletteOpen,
  setPaletteOpen,
  voiceActive,
  cancelVoiceCapture,
  handleDismiss,
}: UseCapsuleKeyboardArgs): void {
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if ((ev.metaKey || ev.ctrlKey) && (ev.key === 'k' || ev.key === 'K')) {
        ev.preventDefault();
        ev.stopPropagation();
        setPaletteOpen((v) => !v);
        return;
      }
      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        if (paletteOpen) {
          setPaletteOpen(false);
          return;
        }
        if (voiceActive) {
          cancelVoiceCapture();
          return;
        }
        handleDismiss();
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [
    paletteOpen,
    setPaletteOpen,
    voiceActive,
    cancelVoiceCapture,
    handleDismiss,
  ]);
}
