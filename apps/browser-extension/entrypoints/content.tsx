import { defineContentScript } from 'wxt/sandbox';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App, GAUNTLET_SHADOW_CSS } from '../components/App';

// Content script — mounts the Gauntlet shadow-DOM root **once** per
// top-frame page and lets the React App component own the surface
// state (pill ↔ capsule). Doctrine: cápsula leve, discreta, sempre
// presente — so the pill is rendered on load, not on hotkey. The
// hotkey/icon click flips the App to capsule mode via the existing
// runtime message channel; the App's onDismiss callback flips it
// back to the pill.
//
// The host element is attached to <html> (not <body>) so it survives
// frameworks that swap the body tag wholesale on route changes.
// Pointer events on the host are off so the rest of the page remains
// clickable; the pill and capsule re-enable them via CSS on themselves.

const HOST_ID = 'gauntlet-capsule-host';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  // We inject styles into our shadow root manually — never into the
  // host page's stylesheet, which would clash with site CSS.
  cssInjectionMode: 'manual',
  async main() {
    // Subframe path: don't mount UI — the user can't interact with a
    // capsule trapped inside an iframe — but DO answer the top frame's
    // postMessage requests for the iframe's current selection. This
    // lets the top frame harvest selections across same-origin AND
    // cross-origin iframes (Notion embeds, GitHub markdown, embedded
    // tweets) since both flavours run our content script under
    // `<all_urls>`.
    if (window.top !== window.self) {
      window.addEventListener('message', (ev: MessageEvent) => {
        const data = ev.data as
          | { gauntlet?: string; cid?: string }
          | undefined;
        if (!data || data.gauntlet !== 'subframe-selection-request') return;
        const sel = window.getSelection();
        const text = sel ? sel.toString().trim() : '';
        ev.source?.postMessage(
          {
            gauntlet: 'subframe-selection-response',
            cid: data.cid,
            text,
            url: window.location.href,
            pageTitle: document.title,
          },
          // We can't easily target a specific origin since it might be
          // cross-origin to us; '*' is fine because the payload only
          // carries the user's selection text + url + title, and only
          // gets here in response to a request we received.
          { targetOrigin: '*' } as WindowPostMessageOptions,
        );
      });
      return;
    }

    // Defensive: never mount twice. WXT's HMR can re-run main() in dev,
    // and some MV3 race conditions can re-fire the script. If we find
    // our host already on the page, leave it alone.
    if (document.getElementById(HOST_ID)) return;

    // Per-domain dismiss is honoured INSIDE App, not by skipping the
    // mount, because the App also owns the runtime.onMessage listener
    // that handles hotkey summons. A dismissed domain hides the pill
    // but the explicit hotkey still works in-page — that's a deliberate
    // user gesture, not Gauntlet imposing itself.

    const host = document.createElement('div');
    host.id = HOST_ID;
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
    styleEl.textContent = GAUNTLET_SHADOW_CSS;
    shadow.appendChild(styleEl);

    const mount = document.createElement('div');
    shadow.appendChild(mount);

    document.documentElement.appendChild(host);

    const root = createRoot(mount);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  },
});
