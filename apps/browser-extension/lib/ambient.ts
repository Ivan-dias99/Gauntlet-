// BrowserAmbient — concrete Ambient for the WXT extension.
//
// Adapts the shared Composer's needs to chrome.* APIs:
//   * transport: routes JSON through the service worker (gauntlet:fetch)
//     so origin is chrome-extension://<id> and CORS allow-list applies.
//   * stream: opens a port (gauntlet:stream) the background.ts pumps
//     SSE events through.
//   * storage: chrome.storage.local — same key prefixes pill-prefs uses.
//   * selection: window.getSelection() snapshot + iframe round-trip.
//   * domActions: executeDomActions against the live page.
//   * screenshot: chrome.tabs.captureVisibleTab via the background.
//   * debug: forwards gauntlet:debug to the background's last-summon log.

import {
  type Ambient,
  type AmbientCapabilities,
  type AmbientStorage,
  type DomAction,
  type DomActionResult,
  type SelectionSnapshot,
  type StreamCallbacks,
  executeDomActions,
} from '@gauntlet/composer';
import {
  readSelectionAcrossFrames,
  readSelectionSnapshot,
} from './selection';

const CAPABILITIES: AmbientCapabilities = {
  domExecution: true,
  pillSurface: true,
  screenshot: true,
  dismissDomain: true,
  voice: typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  streaming: true,
  refreshSelection: true,
};

interface BackgroundFetchResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
  body?: string;
  headers?: Record<string, string>;
  error?: string;
}

async function backgroundFetch<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> {
  const reply: BackgroundFetchResponse = await chrome.runtime.sendMessage({
    type: 'gauntlet:fetch',
    url,
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!reply || !reply.ok) {
    throw new Error(
      `composer: background fetch failed — ${reply?.error ?? 'unknown error'}`,
    );
  }
  let parsed: unknown = null;
  if (reply.body != null && reply.body !== '') {
    try {
      parsed = JSON.parse(reply.body);
    } catch {
      parsed = reply.body;
    }
  }
  const status = reply.status ?? 0;
  if (status < 200 || status >= 300) {
    throw new Error(
      `composer: ${status} ${reply.statusText ?? ''}`.trim(),
    );
  }
  return parsed as T;
}

const storage: AmbientStorage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const got = await chrome.storage.local.get(key);
      const raw = got[key];
      return (raw ?? null) as T | null;
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch {
      // chrome.storage unavailable in some privacy modes — non-fatal.
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await chrome.storage.local.remove(key);
    } catch {
      // non-fatal
    }
  },
};

function streamViaPort(
  url: string,
  body: unknown,
  callbacks: StreamCallbacks,
): () => void {
  const port = chrome.runtime.connect({ name: 'gauntlet:stream' });
  let settled = false;

  function settle() {
    if (settled) return;
    settled = true;
    try {
      port.disconnect();
    } catch {
      // already disconnected
    }
  }

  port.onMessage.addListener((rawMsg: unknown) => {
    if (!rawMsg || typeof rawMsg !== 'object') return;
    const msg = rawMsg as {
      type?: string;
      event?: string;
      data?: string;
      error?: string;
    };
    if (msg.type === 'sse' && typeof msg.data === 'string') {
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(msg.data);
      } catch {
        callbacks.onError('malformed SSE payload');
        settle();
        return;
      }
      if (msg.event === 'delta') {
        const text = (parsed as { text?: string }).text ?? '';
        callbacks.onDelta(text);
      } else if (msg.event === 'done') {
        const d = parsed as Record<string, unknown>;
        callbacks.onDone({
          plan_id: (d.plan_id as string) ?? '',
          context_id: (d.context_id as string) ?? '',
          actions: (d.actions as never[]) ?? [],
          compose: (d.compose as string | null) ?? null,
          reason: (d.reason as string | null) ?? null,
          model_used: (d.model_used as string) ?? '',
          latency_ms: (d.latency_ms as number) ?? 0,
          raw_response: null,
        });
        settle();
      } else if (msg.event === 'error') {
        const err = (parsed as { error?: string }).error ?? 'model error';
        callbacks.onError(err);
        settle();
      }
    } else if (msg.type === 'error') {
      callbacks.onError(msg.error ?? 'transport error');
      settle();
    } else if (msg.type === 'closed') {
      if (!settled) {
        callbacks.onDone({
          plan_id: '',
          context_id: '',
          actions: [],
          compose: null,
          reason: 'stream ended without result',
          model_used: '',
          latency_ms: 0,
          raw_response: null,
        });
        settled = true;
      }
    }
  });

  port.onDisconnect.addListener(() => {
    if (!settled) {
      const lastError = chrome.runtime.lastError?.message;
      callbacks.onError(lastError ?? 'disconnected');
      settled = true;
    }
  });

  port.postMessage({ type: 'start', url, body });

  return () => {
    if (settled) return;
    try {
      port.postMessage({ type: 'abort' });
    } catch {
      // ignore — port may already be down
    }
    settle();
  };
}

export function createBrowserAmbient(executor?: {
  execute(actions: DomAction[]): Promise<DomActionResult[]>;
}): Ambient {
  const domActions = executor ?? { execute: executeDomActions };
  return {
    shell: 'browser',
    capabilities: CAPABILITIES,
    transport: {
      fetchJson<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        body?: unknown,
      ): Promise<T> {
        return backgroundFetch<T>(method, url, body);
      },
      stream: streamViaPort,
    },
    storage,
    selection: {
      read: (): SelectionSnapshot => readSelectionSnapshot(),
      readAsync: () => readSelectionAcrossFrames(),
    },
    domActions,
    screenshot: {
      async capture(): Promise<string | null> {
        if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
          return null;
        }
        try {
          const reply = (await chrome.runtime.sendMessage({
            type: 'gauntlet:capture_screenshot',
          })) as { ok?: boolean; dataUrl?: string } | undefined;
          if (!reply?.ok || !reply.dataUrl) return null;
          return reply.dataUrl;
        } catch {
          return null;
        }
      },
    },
    debug: {
      async lastSummon(): Promise<unknown | null> {
        try {
          const reply = (await chrome.runtime.sendMessage({
            type: 'gauntlet:debug',
          })) as { ok?: boolean; lastSummon?: unknown } | undefined;
          return reply?.lastSummon ?? null;
        } catch {
          return null;
        }
      },
    },
  };
}
