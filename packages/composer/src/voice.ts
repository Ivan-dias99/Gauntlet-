// Voice input — Web Speech API wrapper.
//
// Press-and-hold the mic button; the recogniser streams partial
// transcripts which the cápsula appends to the input. Releasing stops
// the stream and commits the final transcript.
//
// Why Web Speech API instead of OpenAI Whisper / Anthropic / etc:
//   * zero round-trip cost — Chrome ships it; Edge ships it; Safari
//     ships it on macOS 14+.
//   * zero added bundle size — it's a browser API.
//   * privacy — Chrome routes to Google but the user already opted
//     into the cápsula on the active page; this isn't an extra leak.
//
// Feature-detected. When the API isn't available the component
// renders nothing (the cápsula keeps working without voice).
//
// Types: Web Speech API isn't yet in lib.dom.d.ts as a stable
// surface — we declare the minimum we use. The runtime is
// vendor-prefixed (webkitSpeechRecognition) on Chromium-based
// browsers; getRecognitionCtor reaches both.

interface MinimalSpeechRecognitionAlternative {
  transcript: string;
}

interface MinimalSpeechRecognitionResult {
  isFinal: boolean;
  0: MinimalSpeechRecognitionAlternative;
}

interface MinimalSpeechRecognitionResultList {
  length: number;
  [index: number]: MinimalSpeechRecognitionResult;
}

interface MinimalSpeechRecognitionEvent {
  results: MinimalSpeechRecognitionResultList;
  resultIndex: number;
}

interface MinimalSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: MinimalSpeechRecognitionEvent) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type RecognitionCtor = new () => MinimalSpeechRecognition;

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: RecognitionCtor;
  webkitSpeechRecognition?: RecognitionCtor;
}

export function isVoiceSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as SpeechRecognitionWindow;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as SpeechRecognitionWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface VoiceSession {
  // Stop listening and commit the final transcript via onCommit.
  stop: () => void;
  // Cancel without committing — used when the user moves the mouse off
  // the mic button before the press timer fires.
  abort: () => void;
}

export interface VoiceCallbacks {
  // Live partial transcript while the user is still talking.
  onPartial: (text: string) => void;
  // Final transcript when the user releases the mic button.
  onCommit: (text: string) => void;
  // Surface a non-fatal error to the caller (permission denied, no
  // microphone, recognition timed out without speech). The cápsula
  // shows this in the same band as model errors so the operator
  // knows why nothing happened.
  onError: (msg: string) => void;
}

export function startVoice(callbacks: VoiceCallbacks): VoiceSession | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) {
    callbacks.onError('Voice input is not supported in this browser.');
    return null;
  }

  let recognition: MinimalSpeechRecognition | null = new Ctor();
  recognition.continuous = true;
  recognition.interimResults = true;
  // Default language tracks the page; fall back to en-US. Operators
  // who want pt-PT / es-ES etc should set their browser language.
  try {
    recognition.lang = (navigator.language || 'en-US');
  } catch {
    recognition.lang = 'en-US';
  }

  let aborted = false;
  let lastFinal = '';

  recognition.onresult = (e: MinimalSpeechRecognitionEvent) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i];
      const transcript = result[0]?.transcript ?? '';
      if (result.isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    if (final) {
      lastFinal = (lastFinal + ' ' + final).trim();
    }
    callbacks.onPartial((lastFinal + ' ' + interim).trim());
  };

  recognition.onerror = (ev: { error?: string }) => {
    const code = ev.error ?? 'unknown';
    if (aborted) return;
    if (code === 'no-speech') {
      callbacks.onError('Voice: silence detected. Hold the mic and speak.');
    } else if (code === 'not-allowed' || code === 'service-not-allowed') {
      callbacks.onError('Voice: microphone permission denied.');
    } else if (code === 'aborted') {
      // User cancelled — silent.
    } else {
      callbacks.onError(`Voice error: ${code}`);
    }
  };

  recognition.onend = () => {
    if (aborted) return;
    if (lastFinal) callbacks.onCommit(lastFinal);
  };

  try {
    recognition.start();
  } catch (err) {
    callbacks.onError(
      err instanceof Error ? err.message : 'Voice failed to start.',
    );
    return null;
  }

  return {
    stop: () => {
      try {
        recognition?.stop();
      } catch {
        // already stopped
      }
    },
    abort: () => {
      aborted = true;
      try {
        recognition?.abort();
      } catch {
        // already gone
      }
      recognition = null;
    },
  };
}
