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
    background: #0a0c10;
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
