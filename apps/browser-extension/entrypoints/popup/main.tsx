import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '../../components/Capsule';
import { ComposerClient } from '../../lib/composer-client';

// Toolbar popup — always-safe single-surface delegator.
//
// Goal: clicking the icon should feel identical to pressing the hotkey.
// The popup tries to summon the in-page capsule (full-width drawer) on
// the active tab; if that succeeds within ~250 ms the popup closes and
// the operator works inside the page. If summon is slow, errors, or the
// active tab cannot host a content script (chrome://, edge://, the
// new-tab page), the popup renders the same capsule locally as fallback
// — so the operator NEVER sees an empty popup.

// Chrome / Edge cap toolbar popups at 800×600. Fill the maximum so the
// fallback capsule reads the same as the in-page drawer instead of the
// pinched 420 px sliver it used to be. Body sizes the popup window;
// #root + .gauntlet-capsule fill it without margins so the operator
// sees the same two-panel layout regardless of entry point.
const FALLBACK_CSS = `
  html, body {
    margin: 0;
    width: 800px;
    height: 600px;
    overflow: hidden;
    background: #0a0c10;
  }
  #root {
    width: 100%;
    height: 100%;
  }
  .gauntlet-capsule {
    position: static;
    width: 100%;
    height: 100%;
    min-height: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
`;

const FALLBACK_DELAY_MS = 250;

async function summonOnActiveTab(): Promise<boolean> {
  // `currentWindow: true` from a popup refers to the popup's own window
  // (which has no tabs). `lastFocusedWindow: true` is the user's browser
  // window — what we actually want.
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const tab = tabs[0];
  if (!tab?.id) return false;
  await chrome.tabs.sendMessage(tab.id, { type: 'gauntlet:summon' });
  return true;
}

function PopupRoot() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // If summon takes longer than the threshold, surface the popup
    // capsule so the operator is never staring at an empty window.
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) setShowFallback(true);
    }, FALLBACK_DELAY_MS);

    void (async () => {
      try {
        const ok = await summonOnActiveTab();
        if (cancelled) return;
        if (ok) {
          window.clearTimeout(fallbackTimer);
          window.close();
          return;
        }
        // No reachable tab — render fallback now without waiting.
        setShowFallback(true);
      } catch (err) {
        // Content script not loaded (chrome://, edge://, web store, …)
        // or sendMessage rejected — fall back to the in-popup capsule.
        console.warn('[gauntlet:popup] summon failed, rendering local capsule:', err);
        if (!cancelled) setShowFallback(true);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (!showFallback) return null;
  return (
    <Capsule
      client={new ComposerClient()}
      initialSnapshot={{ text: '', url: 'popup://toolbar', pageTitle: 'Toolbar' }}
      onDismiss={() => window.close()}
    />
  );
}

const style = document.createElement('style');
style.textContent = CAPSULE_CSS + FALLBACK_CSS;
document.head.appendChild(style);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <PopupRoot />
  </StrictMode>,
);
