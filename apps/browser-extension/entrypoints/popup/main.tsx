import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '../../components/Capsule';
import { ComposerClient } from '../../lib/composer-client';

// Toolbar popup — single-surface delegator.
//
// Clicking the toolbar icon must feel identical to pressing the hotkey:
// summon the in-page capsule (full-width drawer) on the active tab and
// close this popup window. The popup-rendered capsule only survives as
// a fallback for pages where content scripts cannot run (chrome://,
// edge://, the new-tab page, the web store), so the operator never
// loses a surface.

const FALLBACK_CSS = `
  body { margin: 0; background: #0a0c10; }
  .gauntlet-capsule {
    position: static;
    width: 720px;
    max-width: 95vw;
    min-height: 360px;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
`;

async function summonOnActiveTab(): Promise<boolean> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return false;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'gauntlet:summon' });
    return true;
  } catch {
    return false;
  }
}

function PopupRoot() {
  const [mode, setMode] = useState<'probing' | 'fallback'>('probing');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ok = await summonOnActiveTab();
      if (cancelled) return;
      if (ok) {
        window.close();
        return;
      }
      setMode('fallback');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (mode === 'probing') {
    // Empty body while we hand off to the page; closes within a tick.
    return null;
  }
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
