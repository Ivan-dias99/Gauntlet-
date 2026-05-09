// useVoiceCapture — press-and-hold voice input hook for the Capsule.
//
// The hook owns the active session, the active flag and the
// abort-on-unmount cleanup. Caller passes per-start callbacks
// (onPartial, onCommit, onError) so the Capsule can inject the
// current input baseline at the moment the operator presses the mic
// without leaking that closure into this module.
//
// Provider precedence is the same as the inline version it replaces:
// Groq Whisper via backend when `ambient.capabilities.remoteVoice`
// supports it, otherwise the local Web Speech API. Both paths are
// feature-detected; if neither works the start() call is a no-op
// and the caller can hide the mic button via `isVoiceSupported()`
// from `./voice`.

import { useCallback, useEffect, useRef, useState } from 'react';
import { type Ambient } from './ambient';
import { type ComposerClient } from './composer-client';
import {
  isRemoteVoiceSupported,
  startVoice,
  startVoiceRemote,
  type VoiceSession,
} from './voice';

export interface VoiceCaptureCallbacks {
  onPartial: (text: string) => void;
  onCommit: (text: string) => void;
  onError: (msg: string) => void;
}

export interface UseVoiceCaptureArgs {
  client: ComposerClient;
  ambient: Ambient;
}

export interface UseVoiceCaptureResult {
  active: boolean;
  start: (cbs: VoiceCaptureCallbacks) => void;
  stop: () => void;
  cancel: () => void;
}

export function useVoiceCapture({ client, ambient }: UseVoiceCaptureArgs): UseVoiceCaptureResult {
  const sessionRef = useRef<VoiceSession | null>(null);
  const [active, setActive] = useState(false);

  // Cleanup on unmount — releases mic permission promptly on dismiss.
  useEffect(() => {
    return () => {
      sessionRef.current?.abort();
    };
  }, []);

  const start = useCallback(
    (cbs: VoiceCaptureCallbacks) => {
      if (sessionRef.current) return;
      // Wrap the caller's callbacks so the hook owns the lifecycle
      // bookkeeping (active flag + ref clear). The caller still gets
      // its onPartial / onCommit / onError invoked exactly once per
      // event, in order.
      const internal: VoiceCaptureCallbacks = {
        onPartial: cbs.onPartial,
        onCommit: (text) => {
          cbs.onCommit(text);
          setActive(false);
          sessionRef.current = null;
        },
        onError: (msg) => {
          cbs.onError(msg);
          setActive(false);
          sessionRef.current = null;
        },
      };

      // Prefer Groq Whisper via backend when the ambient signals
      // support — better quality, language-agnostic, doesn't depend
      // on Chromium's Web Speech entitlement. Fall back to the local
      // Web Speech API when the backend isn't reachable or the
      // runtime lacks MediaRecorder.
      if (ambient.capabilities.remoteVoice && isRemoteVoiceSupported()) {
        setActive(true);
        void startVoiceRemote(client, internal).then((session) => {
          if (session) {
            sessionRef.current = session;
          } else {
            setActive(false);
          }
        });
        return;
      }
      const session = startVoice(internal);
      if (session) {
        sessionRef.current = session;
        setActive(true);
      }
    },
    [ambient, client],
  );

  const stop = useCallback(() => {
    sessionRef.current?.stop();
  }, []);

  const cancel = useCallback(() => {
    sessionRef.current?.abort();
    sessionRef.current = null;
    setActive(false);
  }, []);

  return { active, start, stop, cancel };
}
