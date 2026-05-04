import { useCallback, useEffect, useState } from 'react';
import { Capsule, CAPSULE_CSS } from './Capsule';
import { Pill, PILL_CSS } from './Pill';
import { ComposerClient } from '../lib/composer-client';
import { executeDomActions } from '../lib/dom-actions';
import {
  DEFAULT_PILL_POSITION,
  dismissDomain,
  isDomainDismissed,
  readPillPosition,
  type PillPosition,
} from '../lib/pill-prefs';
import { readSelectionSnapshot, type SelectionSnapshot } from '../lib/selection';

// One ComposerClient per content script — connections are stateless
// (HTTP), but reusing the instance keeps backend URL config in one
// place per page.
const client = new ComposerClient();

// Single stylesheet injected into the shadow root by content.tsx.
// Concatenating both CSS bodies into a single export means the script
// only has to insert one <style> regardless of which surface is
// currently rendered.
export const GAUNTLET_SHADOW_CSS = CAPSULE_CSS + PILL_CSS;

type Surface =
  | { kind: 'pill' }
  | { kind: 'capsule'; snapshot: SelectionSnapshot; nonce: number }
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
    // Refresh the selection snapshot every time we summon. Bump the
    // nonce so the Capsule's `key` changes and React remounts it,
    // resetting internal state (input field, plan, danger gate). Without
    // this, a second summon while the capsule is open would keep the
    // previous user input and stale plan in view.
    setSurface((prev) => ({
      kind: 'capsule',
      snapshot: readSelectionSnapshot(),
      nonce: prev.kind === 'capsule' ? prev.nonce + 1 : 1,
    }));
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
      />
    );
  }
  return (
    <Capsule
      key={surface.nonce}
      client={client}
      initialSnapshot={surface.snapshot}
      onDismiss={dismiss}
      executor={executeDomActions}
    />
  );
}
