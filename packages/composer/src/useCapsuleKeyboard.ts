// Capsule keyboard shortcuts — Cmd/Ctrl+K toggles the command palette;
// Escape unrolls overlays in priority order (palette → voice cancel →
// dismiss the cápsula). Extracted from Capsule.tsx during the v1
// polish pass; the doctrine stays the same (the cápsula must always
// answer Esc, no matter what overlay is on top).

import { useEffect } from 'react';

export interface UseCapsuleKeyboardArgs {
  paletteOpen: boolean;
  setPaletteOpen: (next: boolean | ((v: boolean) => boolean)) => void;
  // True iff the operator is mid-press on the mic button. Esc cancels
  // the in-flight voice capture WITHOUT dismissing the cápsula — the
  // gesture is "I changed my mind about this dictation", not "close
  // everything".
  voiceActive: boolean;
  cancelVoiceCapture: () => void;
  // Last layer — closes the cápsula (and reports rejected if a plan
  // was pending; the wrapper handles that contract upstream).
  handleDismiss: () => void;
}

export function useCapsuleKeyboard({
  paletteOpen,
  setPaletteOpen,
  voiceActive,
  cancelVoiceCapture,
  handleDismiss,
}: UseCapsuleKeyboardArgs): void {
  // Cmd+K (mac) / Ctrl+K (everyone else). Pure keyboard surface; no
  // fixture-grade focus traps yet — Esc closes, arrow nav comes in
  // a follow-up if the operator asks for it.
  useEffect(() => {
    function onPaletteKey(ev: KeyboardEvent) {
      const isModK =
        (ev.metaKey || ev.ctrlKey) && (ev.key === 'k' || ev.key === 'K');
      if (isModK) {
        ev.preventDefault();
        ev.stopPropagation();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onPaletteKey, true);
    return () => window.removeEventListener('keydown', onPaletteKey, true);
  }, [setPaletteOpen]);

  // Layered escape: palette first, voice next, then dismiss.
  // Lets the operator close the overlay without losing the cápsula
  // entirely — the same gesture for related concerns.
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
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
