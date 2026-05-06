import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '@gauntlet/composer';
import { buildWebPopupAmbient } from '../../ambient/web-popup';

// composer.html is the FALLBACK surface. The doctrinal surface is the
// in-page capsule mounted by content.tsx via shadow DOM. background.ts
// only opens this window when the active tab cannot host a content
// script (chrome://, the Web Store, freshly opened blank tabs, etc.).
//
// Same Composer as the in-page surface — only the ambient differs
// (no page context, no DOM exec, no screenshot). One Composer, two
// shells of runtime.

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
    height: 100%;
    min-height: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
`;

const style = document.createElement('style');
style.textContent = CAPSULE_CSS + WINDOW_CSS;
document.head.appendChild(style);

const ambient = buildWebPopupAmbient();
const initialSnapshot = ambient.captureContext();
if (initialSnapshot instanceof Promise) {
  // The popup ambient is sync, so this branch is unreachable; kept here
  // only so the type checker doesn't complain about the union.
  throw new Error('web-popup ambient should return a synchronous snapshot');
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Capsule
      ambient={ambient}
      initialSnapshot={initialSnapshot}
      onDismiss={() => window.close()}
    />
  </StrictMode>,
);
