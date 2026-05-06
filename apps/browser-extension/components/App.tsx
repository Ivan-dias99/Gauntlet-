import { useCallback, useEffect, useRef, useState } from 'react';
import { Capsule, CAPSULE_CSS } from './Capsule';
import { Pill, PILL_CSS } from './Pill';
import { ComposerClient } from '../lib/composer-client';
import { executeDomActions } from '@gauntlet/composer';
import {
  DEFAULT_PILL_POSITION,
  dismissDomain,
  isDomainDismissed,
  readPillPosition,
  type PillPosition,
} from '../lib/pill-prefs';
import {
  readSelectionAcrossFrames,
  readSelectionSnapshot,
  type SelectionSnapshot,
} from '../lib/selection';

// One ComposerClient per content script — connections are stateless
// (HTTP), but reusing the instance keeps backend URL config in one
// place per page.
const client = new ComposerClient();

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

  // Load persisted pill prefs once at mount. Until they resolve we
  // render the pill at the default position — there's no flash because
  // the default IS the most common position (bottom-right corner). A
  // later setState swaps to the dragged position or hides the pill
  // entirely if the domain is dismissed.
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
        // Hide the pill the moment we know — the brief default render
        // of the pill (a few ms before storage resolves) is acceptable
        // and the only alternative is a "loading" state that flashes
        // worse. setSurface only flips if we're still in the pill
        // state — the hotkey could race and put us in capsule first.
        setSurface((prev) => (prev.kind === 'pill' ? { kind: 'gone' } : prev));
      });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const summon = useCallback(() => {
    // Sync first: render the cápsula immediately with the top-frame
    // snapshot — no perceptible delay for the user. Then async-enrich
    // with a 50ms iframe selection harvest; if a subframe had a
    // longer/non-empty selection (Notion, Reddit, embedded markdown),
    // remount the cápsula with that snapshot. Cheap optimistic mount,
    // best-effort upgrade.
    const cursor = lastCursorRef.current;
    setSurface((prev) => ({
      kind: 'capsule',
      snapshot: readSelectionSnapshot(),
      cursor,
      nonce: prev.kind === 'capsule' ? prev.nonce + 1 : 1,
    }));
    void readSelectionAcrossFrames().then((enriched) => {
      setSurface((prev) => {
        if (prev.kind !== 'capsule') return prev;
        // Only upgrade when the iframe round-trip actually found
        // text the top frame didn't have. Avoids the user typing
        // into the cápsula and having React swap snapshots out from
        // under them for nothing.
        if (!enriched.text || enriched.text === prev.snapshot.text) return prev;
        return {
          ...prev,
          snapshot: enriched,
        };
      });
    });
  }, []);

  const dismiss = useCallback(() => {
    // After closing the capsule, return to the pill — unless the
    // domain has been opted out, in which case stay invisible.
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
    // Hide the surface immediately too — don't make the user wait for
    // a reload to confirm their gesture worked.
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
        // A dismissed-domain user can still summon explicitly via
        // hotkey — that's a deliberate invocation, not a violation of
        // their preference. We just don't show the persistent pill.
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
        flash={pillFlash}
        phase={phase}
        hasContext={hasContext}
        disconnected={phase === 'error'}
      />
    );
  }
  return (
    <Capsule
      key={surface.nonce}
      client={client}
      initialSnapshot={surface.snapshot}
      cursorAnchor={surface.cursor}
      onDismiss={dismiss}
      executor={executeDomActions}
    />
  );
}
