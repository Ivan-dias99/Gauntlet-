import { useState, useCallback } from "react";

// Client for the Python backend (ruberra-backend/) via the /api/ruberra
// proxy. Non-streaming: each call returns the full JSON envelope.
//
// Endpoints:
//   POST /api/ruberra/route  → { route: "agent" | "triad", result: {...} }
//   POST /api/ruberra/dev    → agent loop with tool-use (AgentResponse)
//   POST /api/ruberra/ask    → triad + judge (RuberraResponse)

export interface RuberraQueryBody {
  question: string;
  context?: string;
  force_cautious?: boolean;
  mission_id?: string;
  principles?: string[];
}

type Route = "route" | "dev" | "ask";

export function useRuberra() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (route: Route, body: RuberraQueryBody) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/ruberra/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`ruberra ${route} ${res.status}: ${text.slice(0, 200)}`);
      }
      return await res.json();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  return { call, pending, error };
}
