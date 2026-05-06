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
    /* Flagship light cream — the cápsula fills the window edge-to-edge
       but the FIRST PAINT (before React hydrates and the cápsula
       paints over) shows the body. Cream avoids the black border /
       black-window-only artifact when something off-screens the
       cápsula or hydration is slow. */
    background: #fbf7ee;
  }
  html[data-theme="dark"], body[data-theme="dark"] {
    background: #0e1016;
  }
  #root {
    width: 100%;
    height: 100%;
  }
  /* The popup window IS the cápsula container. We force the cápsula
     to fill the window with !important + clear position/animation so
     the .gauntlet-capsule--centered class (applied automatically when
     no anchor is present) can't translate the cápsula off-screen via
     its rise-centered keyframe (which has fill-mode: both and ends
     at transform: translate(-50%, -50%)). Without animation: none,
     the cápsula's own animation overrides our transform: none and
     half the cápsula renders past the window edge — operator sees
     only the body's background. */
  .gauntlet-capsule {
    position: static !important;
    width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    max-height: 100% !important;
    min-height: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    border: none !important;
    transform: none !important;
    animation: none !important;
    top: auto !important;
    left: auto !important;
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
  },
  domActions: undefined,
  screenshot: undefined,
};

// Mirror the operator's persisted theme onto html/body so the cold-load
// frame matches the cápsula's resolved theme (no flash of cream around
// a dark cápsula or vice versa).
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
