import { defineBackground } from 'wxt/sandbox';

// Background — service worker (Manifest V3).
//
// Single-surface composer: clicking the toolbar icon OR pressing the
// global hotkey both open the same standalone window (1200x800) that
// hosts the full capsule. Toolbar popups are hard-capped by the
// browser at 800x600 and lay out the two-panel capsule cramped — a
// separate window via chrome.windows.create has no such cap.
//
// All HTTP traffic is also proxied here (gauntlet:fetch) so requests
// originate from chrome-extension://<id> instead of the host page,
// bypassing CORS rejection on non-deploy origins.

const COMPOSER_WINDOW_WIDTH = 1200;
const COMPOSER_WINDOW_HEIGHT = 800;

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

async function findExistingComposerWindow(): Promise<number | null> {
  // The composer URL is unique per extension install, so a tab whose URL
  // points at our popup.html identifies the window we already opened.
  // Querying every popup window survives service-worker eviction (no
  // module-level state to lose).
  const expected = chrome.runtime.getURL('composer.html');
  const wins = await chrome.windows.getAll({
    populate: true,
    windowTypes: ['popup'],
  });
  for (const w of wins) {
    if (!w.id) continue;
    for (const t of w.tabs ?? []) {
      if (t.url === expected) return w.id;
    }
  }
  return null;
}

async function openComposerWindow(): Promise<void> {
  const existingId = await findExistingComposerWindow();
  if (existingId !== null) {
    try {
      await chrome.windows.update(existingId, { focused: true });
      return;
    } catch {
      // Window vanished between query and update — fall through and
      // create a fresh one.
    }
  }
  await chrome.windows.create({
    url: chrome.runtime.getURL('composer.html'),
    type: 'popup',
    width: COMPOSER_WINDOW_WIDTH,
    height: COMPOSER_WINDOW_HEIGHT,
    focused: true,
  });
}

export default defineBackground(() => {
  chrome.action.onClicked.addListener(() => {
    void openComposerWindow();
  });

  chrome.commands.onCommand.addListener((command) => {
    if (command !== 'summon-capsule') return;
    void openComposerWindow();
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === 'gauntlet:fetch') {
      void proxyFetch(msg as FetchProxyRequest).then(sendResponse);
      return true; // keep the channel open for the async response
    }
    return false;
  });
});
