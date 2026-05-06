// Web popup ambient — chrome-extension://composer.html.
//
// Lifeboat surface: opened by background.ts when the active tab can't
// host a content script (chrome://, the Web Store, blank tabs). Same
// transport + storage as the in-page ambient, but no page context, no
// screenshot (would screenshot itself), and no DOM execution.

import type { Ambient, ContextSnapshot } from "@gauntlet/composer/ambient";
import { WEB_BACKEND_URL, webStorage, webTransport } from "./web-shared";

const EMPTY_SNAPSHOT: ContextSnapshot = {
  source: "browser",
  text: "",
  url: "window://composer",
  pageTitle: "Composer",
  pageText: "",
  domSkeleton: "",
  bbox: null,
};

export function buildWebPopupAmbient(): Ambient {
  return {
    runtime: "web-popup",
    transport: webTransport,
    storage: webStorage,
    backendUrl: WEB_BACKEND_URL,
    capabilities: {
      // Capturing the popup window itself is useless; toggle hidden.
      showScreenshot: false,
      // Same chrome.storage backing as in-page — operator can manage
      // dismissed domains from either surface.
      showDomainDismiss: true,
      // No live page → no actions to execute.
      showActions: false,
      showSettings: true,
    },
    captureContext: () => EMPTY_SNAPSHOT,
    // No refresh in the popup — there's nothing to re-read.
  };
}
