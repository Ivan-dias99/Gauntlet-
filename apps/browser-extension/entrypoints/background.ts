import { defineBackground } from 'wxt/sandbox';

// Background — service worker (Manifest V3).
//
// Doctrine: the capsule lives at the cursor, not in a separate window.
// On hotkey or icon click we ask the active tab's content script to
// mount the in-page overlay.
//
// Restricted URLs (chrome://, edge://, the Web Store, PDF viewer, etc.)
// cannot host an injected content script. Older builds fell back to a
// standalone composer.html popup window in that case — but the popup
// has no page context (no selection, no DOM, no screenshot) and lives
// off the cursor, both red flags under lente 1 ("ponta do cursor").
// We removed that fallback. Pressing summon on a restricted URL now
// pulses the toolbar badge briefly so the operator gets a visual hint
// to switch to a real tab. Lifeboat fica para o caso degenerado em que
// o content script foi injectado mas nunca respondeu — aí ainda é o
// menor mal versus silêncio total.
//
// All HTTP traffic from the extension also flows through here
// (gauntlet:fetch) so requests originate from chrome-extension://<id>
// instead of the host page, bypassing CORS rejection on non-deploy
// origins.

// Compact fallback window — the standalone composer is a lifeboat for
// restricted surfaces (chrome://, edge://, the Web Store, PDF viewer).
// On normal pages the in-page capsule must win; the fallback never
// becomes a 1200x800 dashboard.
const COMPOSER_WINDOW_WIDTH = 760;
const COMPOSER_WINDOW_HEIGHT = 460;

// Last-summon diagnostics — surfaced via gauntlet:debug message so the
// operator (and tests) can see WHY the fallback opened. Ephemeral; only
// the most recent decision is kept.
type SummonMode = 'in-page' | 'injected' | 'restricted-skip' | 'fallback-window';
type FallbackReason =
  | 'restricted-url'
  | 'no-active-tab'
  | 'content-script-unavailable'
  | 'injection-failed'
  | 'injection-retry-failed';

// Badge pulse — a fugitive visual hint that the operator pressed summon
// on a surface that can't host the cápsula. Single-character emoji on
// the toolbar action, cleared after 1.6s. No notifications API needed
// (would require a new permission); manifest already has 'tabs'.
let badgeClearTimer: ReturnType<typeof setTimeout> | null = null;
function pulseRestrictedHint(): void {
  try {
    void chrome.action.setBadgeBackgroundColor({ color: '#d07a5a' });
    void chrome.action.setBadgeText({ text: '×' });
    if (badgeClearTimer) clearTimeout(badgeClearTimer);
    badgeClearTimer = setTimeout(() => {
      void chrome.action.setBadgeText({ text: '' });
    }, 1600);
  } catch {
    // chrome.action may not be available in some test harnesses.
  }
}

interface SummonDiagnostics {
  at: number;
  mode: SummonMode;
  url?: string;
  reason?: FallbackReason;
  detail?: string;
}

let lastSummonDiagnostics: SummonDiagnostics | null = null;

function recordSummon(d: SummonDiagnostics): void {
  lastSummonDiagnostics = d;
  // Console-visible to anyone with the service-worker devtools open.
  // No PII beyond the page URL — that's already in the operator's tab.
  if (d.mode === 'fallback-window') {
    // eslint-disable-next-line no-console
    console.warn('[gauntlet] fallback-window opened', d);
  } else {
    // eslint-disable-next-line no-console
    console.info('[gauntlet] summon', d);
  }
}

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

async function trySendSummon(tabId: number): Promise<boolean> {
  try {
    const reply = (await chrome.tabs.sendMessage(tabId, {
      type: 'gauntlet:summon',
    })) as { ok?: boolean } | undefined;
    return reply?.ok === true;
  } catch {
    // No content script in this tab — caller decides whether to inject.
    return false;
  }
}

// Retry sendMessage with exponential backoff. On heavy SPAs (Railway
// dashboard, MSN feed, etc.) the content script's `executeScript` call
// can return before React has hydrated and registered its
// `runtime.onMessage.addListener`. The first sendMessage races against
// the React effect; we burn a few hundred milliseconds across two
// retries before falling back to the popup window.
async function trySendSummonWithRetry(
  tabId: number,
  delaysMs: number[],
): Promise<boolean> {
  for (const wait of delaysMs) {
    await new Promise<void>((resolve) => setTimeout(resolve, wait));
    if (await trySendSummon(tabId)) return true;
  }
  return false;
}

async function tryInjectContentScript(tabId: number): Promise<boolean> {
  // WXT bundles the content script into `content-scripts/content.js`
  // (the default output) so we can re-inject on demand into pages that
  // loaded before the extension was installed or that the content
  // script never reached for any other reason.
  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      files: ['content-scripts/content.js'],
    });
    return true;
  } catch {
    return false;
  }
}

async function summonOnActiveTab(hint?: chrome.tabs.Tab): Promise<void> {
  const now = Date.now();
  if (now - lastSummonAt < SUMMON_DEDUPE_MS) return;
  lastSummonAt = now;

  const tab = await resolveActiveTab(hint);
  if (!tab?.id) {
    recordSummon({ at: now, mode: 'restricted-skip', reason: 'no-active-tab' });
    pulseRestrictedHint();
    return;
  }
  if (!isInjectableUrl(tab.url)) {
    recordSummon({
      at: now,
      mode: 'restricted-skip',
      url: tab.url,
      reason: 'restricted-url',
    });
    pulseRestrictedHint();
    return;
  }

  // First attempts: the content script may already be there from the
  // manifest's content_scripts[matches=<all_urls>] entry, but on heavy
  // SPAs it can still be racing its first useEffect. One immediate
  // try plus an 80ms catch covers the common case without waste.
  if (await trySendSummonWithRetry(tab.id, [0, 80])) {
    recordSummon({ at: now, mode: 'in-page', url: tab.url });
    return;
  }

  // Second attempt: inject the content script and retry with backoff.
  // Heavy SPAs (Railway dashboard, MSN feed, GitHub PR pages, etc.)
  // can take a few hundred milliseconds between executeScript and the
  // useEffect that registers `runtime.onMessage.addListener`. We burn
  // up to ~700 ms total over three attempts (60 → 200 → 450) before
  // giving up on the in-page surface and opening the popup. A press
  // perceptibly slower than instant on cold cursors is still vastly
  // better than the lifeboat window taking over a normal page.
  const injected = await tryInjectContentScript(tab.id);
  if (!injected) {
    recordSummon({
      at: now,
      mode: 'restricted-skip',
      url: tab.url,
      reason: 'injection-failed',
    });
    pulseRestrictedHint();
    return;
  }
  if (await trySendSummonWithRetry(tab.id, [60, 200, 450])) {
    recordSummon({ at: now, mode: 'injected', url: tab.url });
    return;
  }

  // Last-resort lifeboat: content script injected but its message
  // listener never woke up within ~700ms. Truly rare (heavy SPA stuck
  // mid-paint, extension storage quota exceeded, etc.). Without a
  // surface here the operator gets nothing for a press, which is worse
  // than a brief popup window. Doctrine accepts this as the only place
  // where the standalone window may still appear.
  recordSummon({
    at: now,
    mode: 'fallback-window',
    url: tab.url,
    reason: 'injection-retry-failed',
    detail: 'content script injected but onMessage listener never replied within 710ms',
  });
  await openComposerWindow();
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

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'gauntlet:debug') {
      sendResponse({ ok: true, lastSummon: lastSummonDiagnostics });
      return false;
    }
    if (msg && msg.type === 'gauntlet:fetch') {
      void proxyFetch(msg as FetchProxyRequest).then(sendResponse);
      return true; // keep the channel open for the async response
    }
    if (msg && msg.type === 'gauntlet:capture_screenshot') {
      // Screenshot the visible part of the tab the request came from.
      // chrome.tabs.captureVisibleTab requires either activeTab or
      // <all_urls> + the tab to be active in its window — both true
      // by the time the user has hit summon. Returns a data URL we
      // forward verbatim to the content script.
      const windowId = sender.tab?.windowId;
      void (async () => {
        try {
          const dataUrl = await chrome.tabs.captureVisibleTab(
            windowId ?? chrome.windows.WINDOW_ID_CURRENT,
            { format: 'png' },
          );
          sendResponse({ ok: true, dataUrl });
        } catch (err: unknown) {
          sendResponse({
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      })();
      return true;
    }
    return false;
  });

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'gauntlet:stream') return;
    void handleStreamPort(port);
  });
});
