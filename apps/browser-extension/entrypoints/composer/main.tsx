import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '../../components/Capsule';
import { ComposerClient } from '../../lib/composer-client';

// composer.html is the FALLBACK surface. The doctrinal surface is the
// in-page capsule mounted by content.tsx via shadow DOM. background.ts
// only opens this window when the active tab cannot host a content
// script (chrome://, the Web Store, freshly opened blank tabs, etc.).
// Keep it lean: same Capsule component, no page context — there is no
// page to read.

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

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Capsule
      client={new ComposerClient()}
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
