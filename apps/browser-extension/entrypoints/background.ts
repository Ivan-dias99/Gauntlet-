import { defineBackground } from 'wxt/sandbox';

// Background — service worker (Manifest V3).
//
// Doctrine: the capsule lives at the cursor, not in a separate window.
// On hotkey or icon click we ask the active tab's content script to
// mount the in-page overlay. Only when that fails — chrome:// pages,
// the Web Store, PDF viewer, freshly opened blank tabs where the
// content script hasn't loaded — do we fall back to the standalone
// composer.html window. The fallback is the lifeboat, not the surface.
//
// All HTTP traffic from the extension also flows through here
// (gauntlet:fetch) so requests originate from chrome-extension://<id>
// instead of the host page, bypassing CORS rejection on non-deploy
// origins.

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
      // Window vanished between query and update — fall through.
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

// Tabs the content script can never reach. We don't even attempt
// sendMessage on these — go straight to the fallback window.
function isInjectableUrl(url: string | undefined): boolean {
  if (!url) return false;
  if (url.startsWith('chrome://')) return false;
  if (url.startsWith('chrome-extension://')) return false;
  if (url.startsWith('edge://')) return false;
  if (url.startsWith('about:')) return false;
  if (url.startsWith('view-source:')) return false;
  if (url.startsWith('https://chrome.google.com/webstore')) return false;
  if (url.startsWith('https://chromewebstore.google.com')) return false;
  return true;
}

async function resolveActiveTab(
  hint?: chrome.tabs.Tab,
): Promise<chrome.tabs.Tab | null> {
  if (hint?.id != null) return hint;
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab ?? null;
  } catch {
    return null;
  }
}

async function summonOnActiveTab(hint?: chrome.tabs.Tab): Promise<void> {
  const tab = await resolveActiveTab(hint);
  if (!tab?.id || !isInjectableUrl(tab.url)) {
    await openComposerWindow();
    return;
  }
  try {
    const reply = (await chrome.tabs.sendMessage(tab.id, {
      type: 'gauntlet:summon',
    })) as { ok?: boolean } | undefined;
    if (reply?.ok) return;
    await openComposerWindow();
  } catch {
    // No content script in this tab (race during page load, or a tab
    // that loaded before the extension was installed). Fallback.
    await openComposerWindow();
  }
}

export default defineBackground(() => {
  chrome.action.onClicked.addListener((tab) => {
    void summonOnActiveTab(tab);
  });

  chrome.commands.onCommand.addListener((command, tab) => {
    if (command !== 'summon-capsule') return;
    void summonOnActiveTab(tab);
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === 'gauntlet:fetch') {
      void proxyFetch(msg as FetchProxyRequest).then(sendResponse);
      return true; // keep the channel open for the async response
    }
    return false;
  });
});
