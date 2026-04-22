import {
  ruberraFetch,
  isBackendUnreachable,
  parseBackendError,
  BackendError,
} from "../lib/ruberraApi";
import { SpineState, Mission } from "./types";
import { normalizeMission, normalizePrinciples } from "./store";

const PATH = "/spine";

// Normalize server responses through the same sanitizer we use for localStorage
// data. The Python Pydantic models silently drop unknown fields, so a mission
// coming back from the server can have fields missing that the UI assumes are
// always arrays (e.g. `artifacts`). Without normalization, pulse.ts crashes on
// `mission.artifacts.length`. Defense-in-depth: even after the backend is
// fixed, older persisted snapshots on a mounted volume may still be skinny.
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
    const missions = Array.isArray(raw.missions)
      ? (raw.missions.map(normalizeMission).filter(Boolean) as Mission[])
      : [];
    return {
      missions,
      activeMissionId:
        typeof raw.activeMissionId === "string" &&
        missions.some((m) => m.id === raw.activeMissionId)
          ? raw.activeMissionId
          : null,
      principles: normalizePrinciples(raw.principles),
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
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `spine push ${res.status}`);
  }
  return true;
}
