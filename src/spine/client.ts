import { SpineState } from "./types";

const ENDPOINT = "/api/ruberra/spine";

export async function fetchSpine(signal?: AbortSignal): Promise<SpineState | null> {
  try {
    const res = await fetch(ENDPOINT, { signal });
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
  } catch {
    return null;
  }
}

export async function pushSpine(state: SpineState, signal?: AbortSignal): Promise<void> {
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        missions: state.missions,
        activeMissionId: state.activeMissionId,
        principles: state.principles,
      }),
      signal,
    });
  } catch {
    // offline — localStorage still holds the state
  }
}
