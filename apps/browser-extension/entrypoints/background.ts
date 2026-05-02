import { defineBackground } from 'wxt/sandbox';

// Background — service worker (Manifest V3).
// Listens for the Alt+Space command and forwards a summon message to the
// content script on the active tab. If the active tab does not have the
// content script (e.g. chrome:// pages), we silently no-op rather than
// throwing — the operator gets no surface, but no crash dialog either.

// Wave 1 — full Composer surface URL. Capsule "Expand" button opens this
// in a new tab so the operator gets the 9-panel canonical layout.
// Wave 2+ this becomes configurable via chrome.storage so different
// deploys (preview, prod, self-host) can be selected per-operator.
const COMPOSER_URL =
  'https://aiinterfaceshelldesign-u1ly.vercel.app/composer';

export default defineBackground(() => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'summon-capsule') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'ruberra:summon' });
    } catch {
      // Content script not loaded on this URL (chrome://, edge://, etc.).
      // Open a popup as a fallback so the operator still has a surface.
      try {
        await chrome.action.openPopup();
      } catch {
        // openPopup requires user gesture in some browsers — ignore.
      }
    }
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && typeof msg === 'object' && msg.type === 'ruberra:expand') {
      chrome.tabs
        .create({ url: COMPOSER_URL })
        .then(() => sendResponse({ ok: true }))
        .catch((err: unknown) =>
          sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) }),
        );
      return true; // keep the message channel open for the async sendResponse
    }
    return false;
  });
});
