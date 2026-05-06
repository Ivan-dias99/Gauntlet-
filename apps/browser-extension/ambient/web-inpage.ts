// Web in-page ambient — content script + shadow DOM.
//
// This is the "real" web Composer surface. Mounted by content.tsx in
// the page's top frame; reads page selection, executes DOM actions,
// captures screenshots through the service worker, persists prefs in
// chrome.storage.

import type { Ambient, ContextSnapshot } from "@gauntlet/composer/ambient";
import { executeDomActions } from "@gauntlet/composer/dom-actions";
import {
  readSelectionSnapshot,
  type SelectionSnapshot,
} from "../lib/selection";
import {
  WEB_BACKEND_URL,
  webCaptureScreenshot,
  webStorage,
  webTransport,
} from "./web-shared";

function snapshotToContext(s: SelectionSnapshot): ContextSnapshot {
  return {
    source: "browser",
    text: s.text,
    url: s.url,
    pageTitle: s.pageTitle,
    pageText: s.pageText,
    domSkeleton: s.domSkeleton,
    bbox: s.bbox,
  };
}

export function buildWebInpageAmbient(): Ambient {
  return {
    runtime: "web-inpage",
    transport: webTransport,
    storage: webStorage,
    backendUrl: WEB_BACKEND_URL,
    capabilities: {
      showScreenshot: true,
      showDomainDismiss: true,
      showActions: true,
      showSettings: true,
    },
    captureContext: () => snapshotToContext(readSelectionSnapshot()),
    refreshContext: () => snapshotToContext(readSelectionSnapshot()),
    captureScreenshot: webCaptureScreenshot,
    executeActions: executeDomActions,
    currentHostname: () => {
      try {
        return window.location.hostname;
      } catch {
        return undefined;
      }
    },
  };
}
