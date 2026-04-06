// Ruberra — Event Log
// Append-only log. IndexedDB for durable local persistence (NOT localStorage).
// Backend adapter seam: `backendSink` can be wired to push to a real event log.
// On crash, projections are rebuilt from this log.

import { RuberraEvent, EventType, newId } from "./events";

const DB_NAME = "ruberra";
const STORE = "events";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: "id" });
        os.createIndex("ts", "ts");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  return dbPromise;
}

type Listener = (ev: RuberraEvent) => void;
const listeners = new Set<Listener>();

// In-memory mirror, hydrated at boot
let memory: RuberraEvent[] = [];
let hydrated = false;
let hydratePromise: Promise<void> | null = null;

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function hydrate(): Promise<void> {
  if (hydrated) return;
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    const db = await openDb();
    if (!db) {
      hydrated = true;
      return;
    }
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const os = tx.objectStore(STORE);
      const req = os.index("ts").openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          memory.push(cursor.value as RuberraEvent);
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => resolve();
    });
    hydrated = true;
  })();
  return hydratePromise;
}

export function all(): RuberraEvent[] {
  return memory;
}

export async function append(
  type: EventType,
  payload: Record<string, unknown> = {},
  opts: { actor?: string; repo?: string; thread?: string; parent?: string } = {},
): Promise<RuberraEvent> {
  const ev: RuberraEvent = {
    id: newId(),
    ts: Date.now(),
    type,
    actor: opts.actor ?? "local",
    repo: opts.repo,
    thread: opts.thread,
    parent: opts.parent,
    payload,
  };
  memory.push(ev);
  const db = await openDb();
  if (db) {
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(ev);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // Durable write failed — surface via trust model, not a silent lie.
      console.warn("[ruberra] event durable write failed", ev.type);
    }
  }
  listeners.forEach((l) => l(ev));
  return ev;
}

export function isHydrated() {
  return hydrated;
}
