import { defineBackground } from 'wxt/sandbox';

// Background — service worker (Manifest V3).
//
// Two responsibilities:
//   1. Listen for the summon command (Ctrl+Shift+Space) and forward the
//      summon message to the active tab's content script. If that tab
//      has no content script (chrome://, edge://, …), open the toolbar
//      popup as fallback so the operator still gets a surface.
//   2. Proxy `gauntlet:fetch` messages from popup / content script and
//      perform the HTTP request from this service-worker context. This
//      sidesteps page-origin CORS: requests from the content script
//      would otherwise carry the host page's origin (e.g. vercel.app)
//      and be rejected by the backend, while requests fired from here
//      go out as `chrome-extension://<id>` which is on the allow-list.

interface FetchProxyRequest {
  type: 'gauntlet:fetch';
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface FetchProxyResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
  body?: string;
  headers?: Record<string, string>;
  error?: string;
}

async function proxyFetch(req: FetchProxyRequest): Promise<FetchProxyResponse> {
  try {
    const res = await fetch(req.url, {
      method: req.method ?? 'GET',
      headers: req.headers,
      body: req.body,
    });
    const text = await res.text();
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k] = v;
    });
    return {
      ok: true,
      status: res.status,
      statusText: res.statusText,
      body: text,
      headers,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export default defineBackground(() => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'summon-capsule') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'gauntlet:summon' });
    } catch {
      // Content script not loaded on this URL (chrome://, edge://, etc.).
      // Open a popup as a fallback so the operator still has a surface.
      try {
        await chrome.action.openPopup();
      } catch {
        // openPopup requires user gesture in some browsers — ignore.
      }
    }
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === 'gauntlet:fetch') {
      void proxyFetch(msg as FetchProxyRequest).then(sendResponse);
      return true; // keep the channel open for the async response
    }
    return false;
  });
});
