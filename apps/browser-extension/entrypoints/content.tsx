import { defineContentScript } from 'wxt/sandbox';
import { createShadowRootUi } from 'wxt/client';
import { createRoot, type Root } from 'react-dom/client';
import { Capsule, CAPSULE_CSS } from '../components/Capsule';
import { ComposerClient } from '../lib/composer-client';
import { readSelectionSnapshot } from '../lib/selection';

// Content script — runs on every http(s) page. Loads silent; the capsule
// is injected only when summoned by the background script (via the
// Alt+Space command). The shadow root isolates the capsule from page CSS
// so the host site can't restyle the cursor surface.
export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'manual',

  async main(ctx) {
    const client = new ComposerClient();
    let mounted: Awaited<ReturnType<typeof createShadowRootUi>> | null = null;
    let reactRoot: Root | null = null;

    async function summon() {
      const snapshot = readSelectionSnapshot();

      if (mounted) {
        // Already up — re-read selection without rebuilding the tree.
        rerender(snapshot);
        return;
      }

      mounted = await createShadowRootUi(ctx, {
        name: 'ruberra-capsule-host',
        position: 'inline',
        anchor: 'body',
        onMount: (container) => {
          // Inject styles inside the shadow root so the host page's CSS
          // never reaches the capsule.
          const style = document.createElement('style');
          style.textContent = CAPSULE_CSS;
          container.appendChild(style);

          const mount = document.createElement('div');
          container.appendChild(mount);
          reactRoot = createRoot(mount);
          reactRoot.render(
            <Capsule
              client={client}
              initialSnapshot={snapshot}
              onDismiss={dismiss}
            />,
          );
        },
        onRemove: () => {
          reactRoot?.unmount();
          reactRoot = null;
        },
      });

      mounted.mount();
    }

    function rerender(snapshot: ReturnType<typeof readSelectionSnapshot>) {
      if (!reactRoot) return;
      reactRoot.render(
        <Capsule
          client={client}
          initialSnapshot={snapshot}
          onDismiss={dismiss}
        />,
      );
    }

    function dismiss() {
      mounted?.remove();
      mounted = null;
      reactRoot = null;
    }

    // Listen for the summon message from the background script (Alt+Space).
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg && msg.type === 'ruberra:summon') {
        void summon().then(() => sendResponse({ ok: true }));
        return true; // keep the channel open for the async response
      }
      if (msg && msg.type === 'ruberra:dismiss') {
        dismiss();
        sendResponse({ ok: true });
        return false;
      }
      return false;
    });
  },
});
