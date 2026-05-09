// useTTS — text-to-speech hook for the Capsule.
//
// Doctrine: TTS is a bonus, never the core path. The hook owns its
// enabled flag (loaded from prefs and live-synced via the
// `gauntlet:tts` window event the SettingsDrawer broadcasts), the
// last-spoken guard (so a re-render with the same compose string
// does not re-trigger), and the unmount cancel. Caller passes
// `isPlanReady` so we only speak the final answer, never partial
// stream deltas; and `planCompose` so we know what to read.
//
// Returns:
//   * enabled — current toggle state, exposed for UI affordances
//   * cancel  — clears any in-flight utterance and resets the guard
//                so the next plan_ready re-speaks

import { useCallback, useEffect, useRef, useState } from 'react';
import { type PillPrefs } from './pill-prefs';

export interface UseTTSArgs {
  prefs: PillPrefs;
  isPlanReady: boolean;
  planCompose: string | undefined;
}

export interface UseTTSResult {
  enabled: boolean;
  cancel: () => void;
}

export function useTTS({ prefs, isPlanReady, planCompose }: UseTTSArgs): UseTTSResult {
  const [enabled, setEnabled] = useState(false);
  const lastSpokenRef = useRef<string>('');

  // Load persisted toggle and subscribe to live updates from the
  // SettingsDrawer. Without the listener the hook's own state would
  // stay stale and continue speaking after the operator turned TTS
  // off mid-read.
  useEffect(() => {
    let cancelled = false;
    void prefs.readTtsEnabled().then((b) => {
      if (!cancelled) setEnabled(b);
    });
    function onTts(ev: Event) {
      const detail = (ev as CustomEvent<{ enabled?: boolean }>).detail;
      if (typeof detail?.enabled === 'boolean') setEnabled(detail.enabled);
    }
    window.addEventListener('gauntlet:tts', onTts);
    return () => {
      cancelled = true;
      window.removeEventListener('gauntlet:tts', onTts);
    };
  }, [prefs]);

  // Speak when plan_ready arrives with a compose answer. Web Speech
  // API is feature-detected at speak time; an unsupported browser
  // silently does nothing.
  useEffect(() => {
    if (!enabled) return;
    if (!isPlanReady) return;
    const text = planCompose;
    if (!text) return;
    if (text === lastSpokenRef.current) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 1.05;
      utt.pitch = 1;
      window.speechSynthesis.speak(utt);
      lastSpokenRef.current = text;
    } catch {
      // SpeechSynthesisUtterance constructor or .speak can throw on
      // hostile shadow contexts; swallow — TTS is a bonus, not core.
    }
  }, [enabled, isPlanReady, planCompose]);

  // Cancel any in-flight utterance when the cápsula unmounts so the
  // voice doesn't keep reading after dismiss.
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
    };
  }, []);

  const cancel = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // ignore
    }
    lastSpokenRef.current = '';
  }, []);

  return { enabled, cancel };
}
