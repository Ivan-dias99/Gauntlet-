import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '@gauntlet/composer';
import { createBrowserAmbient } from '../../lib/ambient';

// composer.html is the FALLBACK surface. The doctrinal surface is the
// in-page capsule mounted by content.tsx via shadow DOM. background.ts
// only opens this window when the active tab cannot host a content
// script (chrome://, the Web Store, freshly opened blank tabs, etc.).
// Keep it lean: same Capsule component, no page context — there is no
// page to read.
//
// The standalone window has no host page, so we hand the cápsula a
// "headless" ambient — same BrowserAmbient adapters but the screenshot
// capture would shoot the popup window itself (useless and recursive),
// so we strip it. domActions is also unavailable for the same reason.

// Lifeboat fallback — the standalone window is compact (760x460 in
// background.ts). The cápsula fills the window edge-to-edge here since
// the window itself IS the surface, but the floating defaults are
// kept so the layout stays single-column and viewport-safe. No bottom
// dock, no two-panel split, no 1200x800 dashboard.
const WINDOW_CSS = `
  html, body {
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    /* Flagship light background — was #0a0c10 (deep ink) which left a
       black border around the cream cápsula on the first paint. The
       cápsula itself fills the window edge-to-edge, but if any frame
       slips through with --gx-bg unresolved (cold load, slow shadow
       css), this guard keeps the surface luminous instead of pitch. */
    background: #fbf7ee;
  }
  html[data-theme="dark"], body[data-theme="dark"] {
    background: #0e1016;
  }
  #root {
    width: 100%;
    height: 100%;
  }
  .gauntlet-capsule {
    position: static;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    min-height: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
    transform: none;
    /* The standalone window is the cápsula container — disable the
       enter rise transform; the capsule is already in place when the
       window opens. Removes the awkward double-animation of OS chrome
       fade + cap rise. */
    animation: none !important;
  }
`;

const style = document.createElement('style');
style.textContent = CAPSULE_CSS + WINDOW_CSS;
document.head.appendChild(style);

const baseAmbient = createBrowserAmbient();
// Strip page-bound capabilities so the cápsula renders the right UI:
// no actuate button (no page DOM), no screenshot (would capture the
// popup itself), no per-domain dismiss (no real domain).
const popupAmbient = {
  ...baseAmbient,
  capabilities: {
    ...baseAmbient.capabilities,
    domExecution: false,
    screenshot: false,
    dismissDomain: false,
    refreshSelection: false,
    // No Pill mounts in this window — the cápsula IS the surface. The
    // settings drawer reads this flag to hide the pill-mode toggle so
    // the operator doesn't toggle a control with no visible effect
    // here (the choice still persists for the in-page surface).
    pillSurface: false,
  },
  domActions: undefined,
  screenshot: undefined,
};

// Mirror the persisted theme onto the html element so the body
// background matches the cápsula's resolved theme on the first paint
// — no flash of cream around a dark capsule, or vice versa.
void popupAmbient.storage.get<string>('gauntlet:theme').then((t) => {
  const theme = t === 'dark' || t === 'light' ? t : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Capsule
      ambient={popupAmbient}
      initialSnapshot={{
        text: '',
        url: 'window://composer',
        pageTitle: 'Composer',
        pageText: '',
        domSkeleton: '',
        bbox: null,
      }}
      onDismiss={() => window.close()}
    />
  </StrictMode>,
);
