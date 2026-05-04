import { defineContentScript } from 'wxt/sandbox';
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '../components/Capsule';
import { ComposerClient } from '../lib/composer-client';
import { readSelectionSnapshot } from '../lib/selection';

// Content script — mounts the Gauntlet capsule **inside the page** as a
// shadow-DOM overlay. This is the doctrinal surface: the capsule lives
// at the cursor, sees the live DOM, and never forces the user into a
// separate window. The standalone composer.html window stays around as
// a fallback for tabs where content scripts cannot run (chrome://,
// chrome-extension://, the Web Store, etc.) — that fallback is wired
// in background.ts.
//
// Lifecycle:
//   * background sends { type: 'gauntlet:summon' } → mount overlay
//   * background sends { type: 'gauntlet:dismiss' } → unmount overlay
//   * a second summon while mounted re-mounts (re-reads selection,
//     refocuses the textarea)
//
// The host element is attached to <html> (not <body>) so it survives
// frameworks that swap the body tag wholesale (e.g. some SPAs on route
// change). Pointer events are off on the host so the rest of the page
// remains clickable; the capsule itself re-enables them via CSS.

const HOST_ID = 'gauntlet-capsule-host';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  // We inject styles into our shadow root manually — never into the host
  // page's stylesheet, which would clash with site CSS.
  cssInjectionMode: 'manual',
  async main() {
    // Top frame only. iframes get the script too (cheap), but mounting
    // the capsule inside an iframe would trap it visually inside that
    // frame and break the bbox math. Skip silently.
    if (window.top !== window.self) return;

    let host: HTMLElement | null = null;
    let root: Root | null = null;

    function dismiss(): void {
      if (root) {
        try {
          root.unmount();
        } catch {
          // React already torn down — ignore.
        }
        root = null;
      }
      if (host) {
        host.remove();
        host = null;
      }
    }

    function summon(): void {
      // Re-summon while mounted = re-read selection. Tear down and
      // re-mount rather than try to push new props through React: the
      // overlay is small and the user's mental model is "press hotkey,
      // get a fresh capsule".
      if (host) dismiss();

      const snapshot = readSelectionSnapshot();

      host = document.createElement('div');
      host.id = HOST_ID;
      // Cover the viewport but pass clicks through everywhere except on
      // the capsule itself (the capsule re-enables pointer-events in CSS).
      Object.assign(host.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '2147483647',
        pointerEvents: 'none',
        // Belt-and-braces against site CSS that targets * {…}
        all: 'initial',
      } as Partial<CSSStyleDeclaration>);

      const shadow = host.attachShadow({ mode: 'open' });
      const styleEl = document.createElement('style');
      styleEl.textContent = CAPSULE_CSS;
      shadow.appendChild(styleEl);

      const mount = document.createElement('div');
      shadow.appendChild(mount);

      document.documentElement.appendChild(host);

      root = createRoot(mount);
      root.render(
        <StrictMode>
          <Capsule
            client={new ComposerClient()}
            initialSnapshot={snapshot}
            onDismiss={dismiss}
          />
        </StrictMode>,
      );
    }

    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
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
    });
  },
});
