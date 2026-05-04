import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '../../components/Capsule';
import { ComposerClient } from '../../lib/composer-client';

// composer.html is loaded inside a 1200x800 (or larger) window opened by
// background.ts via chrome.windows.create. There is no toolbar popup
// anymore — clicking the icon goes straight to a real window. The
// capsule fills the entire viewport so resizing the window scales the
// surface naturally.

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
      initialSnapshot={{ text: '', url: 'window://composer', pageTitle: 'Composer' }}
      onDismiss={() => window.close()}
    />
  </StrictMode>,
);
