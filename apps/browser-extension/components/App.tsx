import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Capsule,
  CAPSULE_CSS,
  Pill,
  PILL_CSS,
  type ContextSnapshot,
} from '@gauntlet/composer';
import { buildWebInpageAmbient } from '../ambient/web-inpage';
import {
  DEFAULT_PILL_POSITION,
  dismissDomain,
  isDomainDismissed,
  readPillPosition,
  writePillPosition,
  type PillPosition,
} from '../lib/pill-prefs';
import {
  readSelectionAcrossFrames,
  readSelectionSnapshot,
  type SelectionSnapshot,
} from '../lib/selection';

// Single stylesheet injected into the shadow root by content.tsx.
// Concatenating both CSS bodies into a single export means the script
// only has to insert one <style> regardless of which surface is
// currently rendered.
export const GAUNTLET_SHADOW_CSS = CAPSULE_CSS + PILL_CSS;

interface CursorPoint {
  x: number;
  y: number;
}

type Surface =
  | { kind: 'pill' }
  | {
      kind: 'capsule';
      snapshot: ContextSnapshot;
      cursor: CursorPoint | null;
      nonce: number;
    }
  | { kind: 'gone' };

// Map the web-specific SelectionSnapshot (selection.ts) to the unified
// ContextSnapshot the Composer consumes. The shapes overlap; only
// `source` and a couple of optional fields differ. Doing the mapping at
// the App boundary keeps the Composer ambient-agnostic.
function snapshotToContext(s: SelectionSnapshot): ContextSnapshot {
  return {
    source: 'browser',
    text: s.text,
    url: s.url,
    pageTitle: s.pageTitle,
    pageText: s.pageText,
    domSkeleton: s.domSkeleton,
    bbox: s.bbox,
  };
}

// App — the state container that lives in the content script's shadow
// root. Owns the pill ↔ capsule transition, the runtime.onMessage
// subscription so background.ts can summon/dismiss without us
// reaching back through the DOM, and the persisted pill prefs.
//
// The Composer (Capsule + Pill) is ambient-agnostic; this App is the
// web-inpage adapter shell that wires it to chrome.* APIs.
export function App() {
  const ambient = useMemo(() => buildWebInpageAmbient(), []);
  const [surface, setSurface] = useState<Surface>({ kind: 'pill' });
  const [pillPosition, setPillPosition] = useState<PillPosition>(
    DEFAULT_PILL_POSITION,
  );
  // Track whether the current domain was dismissed by the user. The
  // dismiss callback flips this true; the initial useEffect reads
  // chrome.storage to populate it. We keep it as state (not a ref) so
  // the dismiss callback closes over the latest value via the
  // dependency array.
  const [domainDismissed, setDomainDismissed] = useState(false);
  const [pillFlash, setPillFlash] = useState<'ok' | 'fail' | null>(null);
  const [phase, setPhase] = useState<
    'idle' | 'planning' | 'streaming' | 'plan_ready' | 'executing' | 'executed' | 'error' | null
  >(null);

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
  // were actually working.
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
    void readPillPosition().then((p) => {
      if (!cancelled) setPillPosition(p);
    });
    const host = (() => {
      try {
        return window.location.hostname;
      } catch {
        return '';
      }
    })();
    if (host) {
      void isDomainDismissed(host).then((dismissed) => {
        if (cancelled || !dismissed) return;
        setDomainDismissed(true);
        setSurface((prev) => (prev.kind === 'pill' ? { kind: 'gone' } : prev));
      });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const summon = useCallback(() => {
    const cursor = lastCursorRef.current;
    setSurface((prev) => ({
      kind: 'capsule',
      snapshot: snapshotToContext(readSelectionSnapshot()),
      cursor,
      nonce: prev.kind === 'capsule' ? prev.nonce + 1 : 1,
    }));
    void readSelectionAcrossFrames().then((enriched) => {
      setSurface((prev) => {
        if (prev.kind !== 'capsule') return prev;
        if (!enriched.text || enriched.text === prev.snapshot.text) return prev;
        return {
          ...prev,
          snapshot: snapshotToContext(enriched),
        };
      });
    });
  }, []);

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
    if (host) void dismissDomain(host);
    setDomainDismissed(true);
    setSurface({ kind: 'gone' });
  }, []);

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
        onClick={summon}
        onDismissDomain={dismissThisDomain}
        onPositionChange={(next) => {
          setPillPosition(next);
          void writePillPosition(next);
        }}
        flash={pillFlash}
        phase={phase}
      />
    );
  }
  return (
    <Capsule
      key={surface.nonce}
      ambient={ambient}
      initialSnapshot={surface.snapshot}
      cursorAnchor={surface.cursor}
      onDismiss={dismiss}
    />
  );
}
