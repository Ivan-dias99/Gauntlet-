import { ruberraFetch, isBackendUnreachable } from "../lib/ruberraApi";
import { SpineState } from "./types";

const PATH = "/spine";

export async function fetchSpine(signal?: AbortSignal): Promise<SpineState | null> {
  try {
    const res = await ruberraFetch(PATH, { signal });
    if (!res.ok) return null;
    const raw = (await res.json()) as {
      missions?: unknown;
      activeMissionId?: unknown;
      principles?: unknown;
      updatedAt?: unknown;
    };
    return {
      missions: Array.isArray(raw.missions) ? (raw.missions as SpineState["missions"]) : [],
      activeMissionId: typeof raw.activeMissionId === "string" ? raw.activeMissionId : null,
      principles: Array.isArray(raw.principles) ? (raw.principles as SpineState["principles"]) : [],
      updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : 0,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    if (isBackendUnreachable(err)) return null;
    return null;
  }
}

// Returns true if the push was accepted by the backend.
// Throws BackendUnreachableError when the backend cannot be reached, so the
// caller (SpineContext) can surface a sync-state indicator instead of
// swallowing silent data-loss risk. Non-unreachable HTTP failures also throw.
export async function pushSpine(state: SpineState, signal?: AbortSignal): Promise<boolean> {
  const res = await ruberraFetch(PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      missions: state.missions,
      activeMissionId: state.activeMissionId,
      principles: state.principles,
      updatedAt: state.updatedAt,
    }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`spine push ${res.status}`);
  }
  return true;
}
