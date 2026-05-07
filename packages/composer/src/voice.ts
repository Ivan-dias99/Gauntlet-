// Voice input — two paths, one shape:
//
//   * `startVoice` — Web Speech API. Zero round-trip, zero bundle, but
//     Chromium-only and quality varies. Stays as fallback.
//   * `startVoiceRemote` — MediaRecorder + Groq Whisper via the backend.
//     Works in every shell that can ask for the microphone, gives us
//     `whisper-large-v3-turbo` quality (PT/EN/etc), and frees us from
//     Chrome's vendor lock. Preferred when `ambient.capabilities.remoteVoice`.
//
// Both paths return the same `VoiceSession` shape so the cápsula's call
// site doesn't branch on which one fired. The press-and-hold UX stays
// the same: pointerdown → start, pointerup → stop, pointerleave →
// abort. Web Speech streams partial transcripts; the remote path commits
// once on stop (Whisper isn't a streaming API on Groq).
//
// Types: Web Speech API isn't yet in lib.dom.d.ts as a stable surface —
// we declare the minimum we use. The runtime is vendor-prefixed
// (webkitSpeechRecognition) on Chromium-based browsers; getRecognitionCtor
// reaches both.

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

// ── Remote voice (Groq Whisper via backend) ─────────────────────────────────

export function isRemoteVoiceSupported(): boolean {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) return false;
  return (
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof MediaRecorder !== 'undefined'
  );
}

interface RemoteVoiceClient {
  transcribeAudio(
    audioBase64: string,
    mime: string,
    language?: string,
  ): Promise<{ text: string }>;
}

export interface RemoteVoiceOptions {
  language?: string;
  // Preferred audio MIME hint for the recorder. Most engines accept
  // webm/opus; we fall back to whatever the browser picks if the hint
  // isn't supported.
  preferredMime?: string;
}

export function startVoiceRemote(
  client: RemoteVoiceClient,
  callbacks: VoiceCallbacks,
  opts: RemoteVoiceOptions = {},
): Promise<VoiceSession | null> {
  return (async (): Promise<VoiceSession | null> => {
    if (!isRemoteVoiceSupported()) {
      callbacks.onError('Voice: this runtime does not expose MediaRecorder.');
      return null;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'microphone unavailable';
      callbacks.onError(
        `Voice: microphone permission denied or device missing (${msg}).`,
      );
      return null;
    }

    // Pick a MIME the browser actually supports. Chrome/Edge/Firefox all
    // ship audio/webm;codecs=opus; Safari prefers audio/mp4. We fall
    // back to undefined (let the browser decide) when neither matches.
    let mime = opts.preferredMime ?? 'audio/webm;codecs=opus';
    if (
      typeof MediaRecorder.isTypeSupported === 'function' &&
      !MediaRecorder.isTypeSupported(mime)
    ) {
      const candidates = ['audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
      const found = candidates.find((c) => MediaRecorder.isTypeSupported(c));
      mime = found ?? '';
    }

    const recorder = mime
      ? new MediaRecorder(stream, { mimeType: mime })
      : new MediaRecorder(stream);
    const chunks: Blob[] = [];
    let aborted = false;

    recorder.addEventListener('dataavailable', (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    });

    recorder.addEventListener('stop', () => {
      // Cut the mic track regardless of the outcome — leaving it open
      // keeps the OS recording indicator on and is creepy.
      stream.getTracks().forEach((t) => t.stop());

      if (aborted || chunks.length === 0) return;

      const blob = new Blob(chunks, { type: mime || 'audio/webm' });
      void blob
        .arrayBuffer()
        .then((buf) => {
          const audioBase64 = arrayBufferToBase64(buf);
          callbacks.onPartial('a transcrever…');
          return client.transcribeAudio(
            audioBase64,
            blob.type || 'audio/webm',
            opts.language,
          );
        })
        .then((result) => {
          if (aborted) return;
          const text = (result?.text ?? '').trim();
          if (text) {
            callbacks.onCommit(text);
          } else {
            callbacks.onError('Voice: silence detected — nada para transcrever.');
          }
        })
        .catch((err: unknown) => {
          if (aborted) return;
          const msg = err instanceof Error ? err.message : String(err);
          callbacks.onError(`Voice: ${msg}`);
        });
    });

    try {
      recorder.start();
    } catch (err) {
      stream.getTracks().forEach((t) => t.stop());
      callbacks.onError(
        err instanceof Error ? err.message : 'recorder failed to start',
      );
      return null;
    }

    return {
      stop: () => {
        if (recorder.state === 'recording') {
          try {
            recorder.stop();
          } catch {
            // already stopped
          }
        }
      },
      abort: () => {
        aborted = true;
        if (recorder.state === 'recording') {
          try {
            recorder.stop();
          } catch {
            // ignore
          }
        }
        stream.getTracks().forEach((t) => t.stop());
      },
    };
  })();
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  // Walk in 32 KB chunks — applying String.fromCharCode to a 1 MB
  // sequence at once exceeds JS engines' argument limit.
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const slice = bytes.subarray(i, Math.min(i + CHUNK, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return btoa(binary);
}

// ── TTS playback (Edge TTS via backend) ─────────────────────────────────────

interface RemoteTtsClient {
  synthesizeSpeech(
    text: string,
    voice?: string,
  ): Promise<{ audio_base64: string; mime: string }>;
}

export interface PlaySpeechOptions {
  voice?: string;
  // AbortSignal that, when fired, cancels playback mid-stream. The
  // cápsula passes its existing abort controller so submitting a new
  // prompt cuts the previous response's voice cleanly.
  signal?: AbortSignal;
}

export async function playRemoteSpeech(
  client: RemoteTtsClient,
  text: string,
  opts: PlaySpeechOptions = {},
): Promise<void> {
  const { audio_base64: audioBase64, mime } = await client.synthesizeSpeech(
    text,
    opts.voice,
  );
  if (opts.signal?.aborted) return;
  const blob = base64ToBlob(audioBase64, mime || 'audio/mpeg');
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  const cleanup = () => {
    URL.revokeObjectURL(url);
  };
  if (opts.signal) {
    opts.signal.addEventListener(
      'abort',
      () => {
        try {
          audio.pause();
        } catch {
          // ignore
        }
        cleanup();
      },
      { once: true },
    );
  }
  audio.addEventListener('ended', cleanup, { once: true });
  audio.addEventListener('error', cleanup, { once: true });
  await audio.play();
}

function base64ToBlob(b64: string, mime: string): Blob {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
