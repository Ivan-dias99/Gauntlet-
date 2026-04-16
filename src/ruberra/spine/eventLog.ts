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
    const loaded: RuberraEvent[] = [];
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const os = tx.objectStore(STORE);
      const req = os.index("ts").openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          loaded.push(cursor.value as RuberraEvent);
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => resolve();
    });
    // Sort by ts then seq to guarantee stable insertion-order replay even
    // when multiple events share the same millisecond timestamp.
    loaded.sort((a, b) => a.ts - b.ts || (a.seq ?? 0) - (b.seq ?? 0));
    memory = loaded;
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
    seq: memory.length,
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

// ── Export / Import ───────────────────────────────────────────────────────
// Full event log backup and restore for data portability.

export function exportLog(): string {
  return JSON.stringify(memory, null, 2);
}

export async function importLog(jsonStr: string): Promise<number> {
  let events: RuberraEvent[];
  try {
    events = JSON.parse(jsonStr);
  } catch {
    throw new Error("Invalid JSON — could not parse event log");
  }
  if (!Array.isArray(events)) throw new Error("Expected an array of events");

  // Validate structure
  for (const ev of events) {
    if (!ev.id || !ev.type || typeof ev.ts !== "number") {
      throw new Error(`Invalid event: missing id, type, or ts`);
    }
  }

  // Merge: skip events that already exist by id
  const existing = new Set(memory.map((e) => e.id));
  const newEvents = events.filter((e) => !existing.has(e.id));

  if (newEvents.length === 0) return 0;

  // Sort new events by ts + seq
  newEvents.sort((a, b) => a.ts - b.ts || (a.seq ?? 0) - (b.seq ?? 0));

  // Write to IndexedDB
  const db = await openDb();
  if (db) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const os = tx.objectStore(STORE);
      for (const ev of newEvents) os.put(ev);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Add to memory
  memory.push(...newEvents);
  memory.sort((a, b) => a.ts - b.ts || (a.seq ?? 0) - (b.seq ?? 0));

  // Notify listeners of last imported event
  listeners.forEach((l) => l(newEvents[newEvents.length - 1]));

  return newEvents.length;
}

export async function clearLog(): Promise<void> {
  memory = [];
  const db = await openDb();
  if (db) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  listeners.forEach((l) => l({ id: "clear", ts: Date.now(), type: "null.consequence", actor: "system", payload: { action: "log.cleared", reason: "manual clear" } } as RuberraEvent));
}

// Test-only: resets all in-memory state.
// When dbPromise is set to null, openDb() will create a fresh connection on
// the next call — against whatever globalThis.indexedDB is at that time.
// Used in tests to simulate a browser reload (fresh JS module, same storage)
// or to swap to a new IDBFactory instance for test isolation.
// Never call in production code paths.
export function _resetForTest() {
  memory = [];
  hydrated = false;
  hydratePromise = null;
  dbPromise = null;
}
