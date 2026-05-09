import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Capsule,
  CAPSULE_CSS,
  COMPUTER_USE_GATE_CSS,
  Onboarding,
  ONBOARDING_CSS,
  Pill,
  PILL_CSS,
  createPillPrefs,
  DEFAULT_PILL_POSITION,
  DEFAULT_PILL_MODE,
  type PillMode,
  type PillPosition,
  type SelectionSnapshot,
} from '@gauntlet/composer';
import { createBrowserAmbient } from '../lib/ambient';

// Single stylesheet injected into the shadow root by content.tsx.
// Concatenating the CSS bodies into a single export means the script
// only has to insert one <style> regardless of which surface is
// currently rendered. COMPUTER_USE_GATE_CSS is included even though the
// browser shell sets `computerUse: false` — the gate selectors are
// inert without the capability, and bundling the CSS once keeps both
// shells on a single style payload (Lei: divergência visual é regressão).
export const GAUNTLET_SHADOW_CSS =
  CAPSULE_CSS + PILL_CSS + ONBOARDING_CSS + COMPUTER_USE_GATE_CSS;

interface CursorPoint {
  x: number;
  y: number;
}

type Surface =
  | { kind: 'pill' }
  | {
      kind: 'capsule';
      snapshot: SelectionSnapshot;
      cursor: CursorPoint | null;
      nonce: number;
    }
  | { kind: 'gone' };

// App — the state container that lives in the content script's shadow
// root. Owns the pill ↔ capsule transition, the runtime.onMessage
// subscription so background.ts can summon/dismiss without us
// reaching back through the DOM, and the persisted pill prefs.
export function App() {
  // Single Ambient per content-script lifetime — wires every chrome.*
  // touchpoint the shared Composer needs (transport, storage,
  // selection, screenshot, debug).
  const ambient = useMemo(() => createBrowserAmbient(), []);
  const prefs = useMemo(() => createPillPrefs(ambient.storage), [ambient]);

  const [surface, setSurface] = useState<Surface>({ kind: 'pill' });
  const [pillPosition, setPillPosition] = useState<PillPosition>(
    DEFAULT_PILL_POSITION,
  );
  const [pillMode, setPillMode] = useState<PillMode>(DEFAULT_PILL_MODE);
  // Track whether the current domain was dismissed by the user. The
  // dismiss callback flips this true; the initial useEffect reads
  // chrome.storage to populate it. We keep it as state (not a ref) so
  // the dismiss callback closes over the latest value via the
  // dependency array.
  const [domainDismissed, setDomainDismissed] = useState(false);
  // Transient flash state for the pill after a plan executes. Cleared
  // by a timer so the pill returns to its resting state and doesn't
  // accumulate stale ambient feedback across multiple sessions.
  const [pillFlash, setPillFlash] = useState<'ok' | 'fail' | null>(null);
  // Phase mirror — Capsule broadcasts gauntlet:phase events; the pill
  // tints itself accordingly so the operator senses "still working"
  // even after the cápsula closes. Only non-idle phases show.
  const [phase, setPhase] = useState<
    'idle' | 'planning' | 'streaming' | 'plan_ready' | 'executing' | 'executed' | 'error' | null
  >(null);
  // Page-level selection presence — drives the pill's --context state
  // so the operator senses "ready to summon" without opening it.
  const [hasContext, setHasContext] = useState(false);
  // Onboarding — show on the very first cápsula open, never again.
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void prefs
      .readOnboardingDone()
      .then((done) => {
        if (!cancelled && !done) setShowOnboarding(true);
      })
      .catch(() => {
        // Storage unreachable — fail closed (skip onboarding) so a
        // broken first-run guard does not loop the tour.
      });
    return () => {
      cancelled = true;
    };
  }, [prefs]);
  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    void prefs.markOnboardingDone();
  }, [prefs]);

  // selectionchange fires far more often than we need (every keystroke
  // inside a contenteditable, every micro-drag of the caret). A simple
  // boolean flip is cheap so we don't throttle, but we do guard against
  // pointless re-renders by short-circuiting equal values.
  useEffect(() => {
    function update() {
      let next = false;
      try {
        const sel = window.getSelection();
        next = !!(sel && sel.toString().trim().length > 0);
      } catch {
        next = false;
      }
      setHasContext((prev) => (prev === next ? prev : next));
    }
    update();
    document.addEventListener('selectionchange', update, { passive: true });
    return () => document.removeEventListener('selectionchange', update);
  }, []);

  useEffect(() => {
    function onResult(ev: Event) {
      const detail = (ev as CustomEvent<{ ok?: boolean }>).detail;
      const kind: 'ok' | 'fail' = detail?.ok === false ? 'fail' : 'ok';
      setPillFlash(kind);
      window.setTimeout(() => setPillFlash(null), 1500);
    }
    function onPhase(ev: Event) {
      const detail = (ev as CustomEvent<{ phase?: typeof phase }>).detail;
      if (!detail?.phase) return;
      setPhase(detail.phase);
      // Auto-clear terminal phases after a few seconds so the pill
      // doesn't keep glowing "executed" forever once the user moves on.
      if (detail.phase === 'executed' || detail.phase === 'error') {
        window.setTimeout(() => setPhase(null), 3500);
      }
    }
    window.addEventListener('gauntlet:execute-result', onResult);
    window.addEventListener('gauntlet:phase', onPhase);
    return () => {
      window.removeEventListener('gauntlet:execute-result', onResult);
      window.removeEventListener('gauntlet:phase', onPhase);
    };
  }, []);

  // Last known cursor position on the page. The hotkey doesn't carry
  // pointer coordinates, so without this ref we'd have nothing to
  // anchor to when the user summons without a text selection — and the
  // capsule would fall back to the bottom strip, far from where they
  // were actually working. Keep it as a ref (not state) because we
  // don't want to re-render on every mousemove.
  const lastCursorRef = useRef<CursorPoint | null>(null);

  useEffect(() => {
    function track(ev: MouseEvent) {
      lastCursorRef.current = { x: ev.clientX, y: ev.clientY };
    }
    window.addEventListener('mousemove', track, { passive: true });
    return () => window.removeEventListener('mousemove', track);
  }, []);

  // Load persisted pill prefs once at mount.
  useEffect(() => {
    let cancelled = false;
    void prefs
      .readPillPosition()
      .then((p) => {
        if (!cancelled) setPillPosition(p);
      })
      .catch(() => {
        // Stay on the default position if storage is broken.
      });
    void prefs
      .readPillMode()
      .then((m) => {
        if (!cancelled) setPillMode(m);
      })
      .catch(() => {
        // Default mode wins — corner pill is the conservative pick.
      });
    // Listen for live pill-mode changes broadcast from the cápsula's
    // settings drawer so flipping mode takes effect without reloading.
    function onPillMode(ev: Event) {
      const detail = (ev as CustomEvent<{ mode?: PillMode }>).detail;
      if (detail?.mode === 'cursor' || detail?.mode === 'corner') {
        setPillMode(detail.mode);
      }
    }
    window.addEventListener('gauntlet:pill-mode', onPillMode);
    const host = (() => {
      try {
        return window.location.hostname;
      } catch {
        return '';
      }
    })();
    if (host) {
      void prefs
        .isDomainDismissed(host)
        .then((dismissed) => {
          if (cancelled || !dismissed) return;
          setDomainDismissed(true);
          setSurface((prev) =>
            prev.kind === 'pill' ? { kind: 'gone' } : prev,
          );
        })
        .catch(() => {
          // Storage failure — assume not dismissed; the operator can
          // re-dismiss from the settings drawer.
        });
    }
    return () => {
      cancelled = true;
      window.removeEventListener('gauntlet:pill-mode', onPillMode);
    };
  }, [prefs]);

  const summon = useCallback(() => {
    // Sync first: render the cápsula immediately with the top-frame
    // snapshot — no perceptible delay for the user. Then async-enrich
    // with a 50ms iframe selection harvest if the ambient supports it.
    const cursor = lastCursorRef.current;
    setSurface((prev) => ({
      kind: 'capsule',
      snapshot: ambient.selection.read(),
      cursor,
      nonce: prev.kind === 'capsule' ? prev.nonce + 1 : 1,
    }));
    if (ambient.selection.readAsync) {
      void ambient.selection.readAsync().then((enriched) => {
        setSurface((prev) => {
          if (prev.kind !== 'capsule') return prev;
          if (!enriched.text || enriched.text === prev.snapshot.text) return prev;
          return {
            ...prev,
            snapshot: enriched,
          };
        });
      });
    }
  }, [ambient]);

  const dismiss = useCallback(() => {
    setSurface(domainDismissed ? { kind: 'gone' } : { kind: 'pill' });
  }, [domainDismissed]);

  const dismissThisDomain = useCallback(() => {
    const host = (() => {
      try {
        return window.location.hostname;
      } catch {
        return '';
      }
    })();
    if (host) void prefs.dismissDomain(host);
    setDomainDismissed(true);
    setSurface({ kind: 'gone' });
  }, [prefs]);

  const persistPillPosition = useCallback(
    (pos: PillPosition) => {
      void prefs.writePillPosition(pos);
    },
    [prefs],
  );

  useEffect(() => {
    function listener(
      msg: unknown,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (r: unknown) => void,
    ): boolean | undefined {
      if (!msg || typeof msg !== 'object') return false;
      const type = (msg as { type?: unknown }).type;
      if (type === 'gauntlet:summon') {
        summon();
        sendResponse({ ok: true });
        return false;
      }
      if (type === 'gauntlet:dismiss') {
        dismiss();
        sendResponse({ ok: true });
        return false;
      }
      return false;
    }
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [summon, dismiss]);

  if (surface.kind === 'gone') {
    return null;
  }
  if (surface.kind === 'pill') {
    return (
      <Pill
        position={pillPosition}
        mode={pillMode}
        onClick={summon}
        onDismissDomain={dismissThisDomain}
        onPersistPosition={persistPillPosition}
        flash={pillFlash}
        phase={phase}
        hasContext={hasContext}
        disconnected={phase === 'error'}
      />
    );
  }
  return (
    <>
      <Capsule
        key={surface.nonce}
        ambient={ambient}
        initialSnapshot={surface.snapshot}
        cursorAnchor={surface.cursor}
        onDismiss={dismiss}
      >
        {showOnboarding && <Onboarding onDone={dismissOnboarding} />}
      </Capsule>
    </>
  );
}
