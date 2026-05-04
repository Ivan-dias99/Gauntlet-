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

// Hotkey dedupe — chrome.commands fires once per keystroke but the
// repeat-on-hold rate plus accidental double-tap can race the content
// script's mount/unmount and produce a flicker as the capsule tears
// itself down and rebuilds. 250 ms is comfortably below human "I
// pressed it twice on purpose" but well above hardware key bounce.
const SUMMON_DEDUPE_MS = 250;
let lastSummonAt = 0;

async function summonOnActiveTab(hint?: chrome.tabs.Tab): Promise<void> {
  const now = Date.now();
  if (now - lastSummonAt < SUMMON_DEDUPE_MS) return;
  lastSummonAt = now;

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

// Port-based streaming fetch proxy. chrome.runtime.sendMessage is one
// shot — fine for /composer/dom_plan, useless for SSE where we want
// to forward each text/event-stream chunk as it arrives. A long-lived
// Port lets us post many messages back to the content script as the
// upstream response trickles in. The protocol:
//   client → background : { type: 'start', url, body }
//   background → client : { type: 'sse', event: 'delta'|'done'|'error', data: <string> }
//   background → client : { type: 'closed' }                — clean end
//   background → client : { type: 'error', error: <string> } — transport failure
//   client → background : { type: 'abort' }                  — cancel
function parseSseEvent(block: string): { event: string; data: string } | null {
  const lines = block.split('\n');
  let eventName = 'message';
  let dataParts: string[] = [];
  for (const line of lines) {
    if (line.startsWith('event:')) eventName = line.slice(6).trim();
    else if (line.startsWith('data:')) dataParts.push(line.slice(5).trimStart());
  }
  if (dataParts.length === 0) return null;
  // SSE allows multi-line data: lines; rejoin with newline.
  return { event: eventName, data: dataParts.join('\n') };
}

interface StreamStartMessage {
  type: 'start';
  url: string;
  body: unknown;
}

async function handleStreamPort(port: chrome.runtime.Port): Promise<void> {
  let aborter: AbortController | null = null;

  port.onMessage.addListener((rawMsg) => {
    const msg = rawMsg as { type?: string; url?: string; body?: unknown };
    if (msg.type === 'start' && typeof msg.url === 'string') {
      aborter = new AbortController();
      const start = msg as StreamStartMessage;
      void runStream(port, start, aborter.signal);
    } else if (msg.type === 'abort') {
      aborter?.abort();
    }
  });
  port.onDisconnect.addListener(() => {
    aborter?.abort();
  });
}

async function runStream(
  port: chrome.runtime.Port,
  msg: StreamStartMessage,
  signal: AbortSignal,
): Promise<void> {
  try {
    const res = await fetch(msg.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'text/event-stream',
      },
      body: JSON.stringify(msg.body),
      signal,
    });
    if (!res.ok || !res.body) {
      port.postMessage({
        type: 'error',
        error: `${res.status} ${res.statusText || 'no body'}`,
      });
      try {
        port.disconnect();
      } catch {
        // already disconnected
      }
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // SSE event boundary is a blank line (\n\n). Process complete
      // events from the buffer; keep the partial tail for next round.
      while (true) {
        const idx = buffer.indexOf('\n\n');
        if (idx === -1) break;
        const block = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const ev = parseSseEvent(block);
        if (ev) {
          try {
            port.postMessage({ type: 'sse', event: ev.event, data: ev.data });
          } catch {
            // Port closed by the other side mid-stream — abort the
            // upstream fetch and bail.
            return;
          }
        }
      }
    }
    try {
      port.postMessage({ type: 'closed' });
      port.disconnect();
    } catch {
      // ignore
    }
  } catch (err: unknown) {
    if (signal.aborted) return;
    try {
      port.postMessage({
        type: 'error',
        error: err instanceof Error ? err.message : String(err),
      });
      port.disconnect();
    } catch {
      // ignore
    }
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

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'gauntlet:stream') return;
    void handleStreamPort(port);
  });
});
