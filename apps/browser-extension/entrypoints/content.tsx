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
    // Top frame only. iframes get the script too (cheap), but mounting
    // a second pill inside an iframe would visually duplicate the
    // surface and break the bbox math. Skip silently.
    if (window.top !== window.self) return;

    // Defensive: never mount twice. WXT's HMR can re-run main() in dev,
    // and some MV3 race conditions can re-fire the script. If we find
    // our host already on the page, leave it alone.
    if (document.getElementById(HOST_ID)) return;

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
