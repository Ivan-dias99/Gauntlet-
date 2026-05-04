import { defineContentScript } from 'wxt/sandbox';

// Content script — currently inert.
//
// The composer surface is now the standalone window opened by
// background.ts (chrome.windows.create on icon click / hotkey).
// Keeping the entrypoint registered with `<all_urls>` means we can
// reintroduce an in-page capsule later (page-aware selection capture,
// inline previews, …) without reshipping the manifest. For now it
// loads, does nothing, and lets the user's pages run untouched.
export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'manual',
  async main() {
    return;
  },
});
