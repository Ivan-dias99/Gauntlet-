import { defineBackground } from 'wxt/sandbox';

// Background — service worker (Manifest V3).
// Listens for the Alt+Space command and forwards a summon message to the
// content script on the active tab. If the active tab does not have the
// content script (e.g. chrome:// pages), we silently no-op rather than
// throwing — the operator gets no surface, but no crash dialog either.

export default defineBackground(() => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'summon-capsule') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'gauntlet:summon' });
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
});
