import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '../../components/Capsule';
import { ComposerClient } from '../../lib/composer-client';

// Toolbar popup — fallback surface for pages where the content script can't
// run (chrome://, edge://, the new-tab page). The capsule itself is the
// same component so behaviour stays consistent.
//
// Selection capture is unavailable here (popup runs in its own document),
// so the snapshot is empty — the operator's input alone is the context.

const style = document.createElement('style');
style.textContent =
  CAPSULE_CSS +
  `
  body { margin: 0; background: #0a0c10; }
  .gauntlet-capsule {
    position: static;
    width: 420px;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
  `;
document.head.appendChild(style);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Capsule
      client={new ComposerClient()}
      initialSnapshot={{ text: '', url: 'popup://toolbar', pageTitle: 'Toolbar' }}
      onDismiss={() => window.close()}
    />
  </StrictMode>,
);
