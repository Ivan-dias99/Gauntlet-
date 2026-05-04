import { useCallback, useEffect, useState } from 'react';
import { Capsule, CAPSULE_CSS } from './Capsule';
import { Pill, PILL_CSS } from './Pill';
import { ComposerClient } from '../lib/composer-client';
import { executeDomActions } from '../lib/dom-actions';
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
  | { kind: 'capsule'; snapshot: SelectionSnapshot; nonce: number };

// App — the state container that lives in the content script's shadow
// root. Owns the pill ↔ capsule transition and the runtime.onMessage
// subscription so background.ts can summon/dismiss without us
// reaching back through the DOM.
export function App() {
  const [surface, setSurface] = useState<Surface>({ kind: 'pill' });

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
    setSurface({ kind: 'pill' });
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

  if (surface.kind === 'pill') {
    return <Pill onClick={summon} />;
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
