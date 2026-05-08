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
  type SelectionSnapshot,
  type StreamCallbacks,
  executeDomActions,
} from '@gauntlet/composer';
import {
  readSelectionAcrossFrames,
  readSelectionSnapshot,
} from './selection';
import { pickFile, readTextFile, readFileBase64 } from './web-filesystem';

const CAPABILITIES: AmbientCapabilities = {
  domExecution: true,
  pillSurface: true,
  screenshot: true,
  dismissDomain: true,
  voice: typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  streaming: true,
  refreshSelection: true,
  // Web shell ganha filesystem via File API (web-filesystem.ts) para
  // paridade visual com desktop. Sem paths reais — proxy via
  // 'web://<uuid>' resolvido em memória. Operador anexa via input
  // picker, exactamente como em desktop com Tauri filesystem.
  filesystemRead: true,
  // Write não tem analogue prático no browser sem fs-access API
  // (que ainda não está em todos os browsers e pede permissão por
  // ficheiro). Mantido off; /guardar slash command continua só
  // disponível em desktop.
  filesystemWrite: false,
  // Tab capture cobre o "screen" do browser. captureScreen()
  // em createBrowserAmbient envolve chrome.tabs.captureVisibleTab
  // na shape { base64, path } esperada pela cápsula. Paridade com
  // desktop screen.png.
  screenCapture: true,
  remoteVoice: true, // backend offers /voice/transcribe; Web Speech remains fallback
  shellExecute: false, // <all_urls> is for HTTP, not bash
  notifications: false, // future: chrome.notifications when we surface a tray story
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
    // Surface the backend's structured detail (FastAPI returns
    // {"detail": {"error": "...", "message": "..."}}) so o operador vê o
    // erro real (ex: "401 Unauthorized" da Groq) em vez do genérico
    // "502 Bad Gateway" da camada HTTP. Paridade com desktop ambient.
    let detailMsg: string | undefined;
    if (parsed && typeof parsed === 'object') {
      const d = (parsed as { detail?: unknown }).detail;
      if (typeof d === 'string') {
        detailMsg = d;
      } else if (d && typeof d === 'object') {
        const obj = d as { message?: unknown; error?: unknown };
        if (typeof obj.message === 'string') detailMsg = obj.message;
        else if (typeof obj.error === 'string') detailMsg = obj.error;
      }
    }
    throw new Error(
      `composer: ${status} ${reply.statusText ?? ''}${
        detailMsg ? ` — ${detailMsg}` : ''
      }`.trim(),
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

export function createBrowserAmbient(): Ambient {
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
    domActions: { execute: executeDomActions },
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
      // Universal screen capture na browser shell — wraps
      // chrome.tabs.captureVisibleTab na shape { base64, path }.
      // Paridade com desktop: a cápsula chama captureScreen() em
      // ambos os shells, recebe um objecto idêntico, anexa um chip
      // "ecrã-XX:XX:XX.png" igual.
      async captureScreen(): Promise<{ base64: string; path: string } | null> {
        if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
          return null;
        }
        try {
          const reply = (await chrome.runtime.sendMessage({
            type: 'gauntlet:capture_screenshot',
          })) as { ok?: boolean; dataUrl?: string } | undefined;
          if (!reply?.ok || !reply.dataUrl) return null;
          // Tira o prefixo `data:image/png;base64,` deixando só o base64.
          const idx = reply.dataUrl.indexOf(',');
          const base64 = idx >= 0 ? reply.dataUrl.slice(idx + 1) : reply.dataUrl;
          return { base64, path: 'web://tab-capture.png' };
        } catch {
          return null;
        }
      },
    },
    // Filesystem na shell web — usa File API por baixo, expõe a mesma
    // interface AmbientFilesystem que o desktop expõe via Tauri. Path
    // proxy 'web://<uuid>' para o cache em memória.
    filesystem: {
      pickFile,
      readTextFile,
      readFileBase64,
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
