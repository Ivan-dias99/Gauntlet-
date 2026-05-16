import { defineBackground } from 'wxt/sandbox';

// Background — service worker (Manifest V3).
//
// Doctrine: a cápsula vive na ponta do cursor. Ponto. Não há lifeboat,
// não há fallback window, não há janela popup standalone. Carregar em
// summon (ícone ou Ctrl+Shift+Space) faz uma de duas coisas:
//
//   1. Tab activa aceita content script → cápsula injecta como overlay.
//   2. Tab activa não aceita (chrome://, edge://, Web Store, PDF, sem
//      tab, content script preso, etc) → pulsa um '×' ember no badge
//      durante 1.6s. Sinal mudo de "aqui não posso".
//
// Apple-quality bar: ou abre, ou não abre. Sem segunda janela, sem
// surpresas, sem cápsula órfã. composer.html foi eliminado em 2026-05-08.
//
// All HTTP traffic from the extension also flows through here
// (gauntlet:fetch) so requests originate from chrome-extension://<id>
// instead of the host page, bypassing CORS rejection on non-deploy
// origins.

// Last-summon diagnostics — surfaced via gauntlet:debug message so the
// operator (and tests) can see WHY the fallback opened. Ephemeral; only
// the most recent decision is kept.
type SummonMode = 'in-page' | 'injected' | 'restricted-skip';
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
    // Same allowlist as the streaming path — see ``isAllowedStreamUrl``.
    // The extension's chrome-extension:// origin bypasses page CORS, so
    // every URL we forward must be on the Gauntlet backend surface.
    if (!isAllowedStreamUrl(req.url)) {
      return {
        ok: false,
        status: 0,
        error: `fetch URL rejected by isAllowedStreamUrl: ${req.url}`,
      };
    }
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

// Tabs the content script can never reach. We pulse the badge and
// stop — never open a separate window.
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

  // Content script foi injectado mas listener nunca acordou em 710ms.
  // SPAs presas, storage cheio. Não abrimos janela separada — pulsamos
  // o badge como em qualquer outro restricted-skip. Apple-quality bar:
  // ou abre, ou não abre. Sem segunda janela como prémio de consolação.
  recordSummon({
    at: now,
    mode: 'restricted-skip',
    url: tab.url,
    reason: 'injection-retry-failed',
    detail: 'content script injected but onMessage listener never replied within 710ms',
  });
  pulseRestrictedHint();
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

// Defence-in-depth: the only legitimate callers construct the URL from
// the build-time backend env, but the service-worker fetch path accepts
// whatever a connected port sends. Restrict it to https:// (the prod
// Railway URL), http://localhost / http://127.0.0.1 (dev backend), and
// the chrome-extension:// scheme (test fixtures). Anything else — a
// `data:` URI, `file://`, attacker-controlled http origin — is rejected
// before fetch runs, so a future caller (or a malicious sender) cannot
// turn this into an arbitrary-origin GET/POST proxy from the extension
// context (which would otherwise bypass page CORS).
function isAllowedStreamUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol === 'https:') return true;
  if (
    parsed.protocol === 'http:' &&
    (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
  ) {
    return true;
  }
  return false;
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
    if (!isAllowedStreamUrl(msg.url)) {
      port.postMessage({
        type: 'error',
        status: 0,
        text: `stream URL rejected by isAllowedStreamUrl: ${msg.url}`,
      });
      return;
    }
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
