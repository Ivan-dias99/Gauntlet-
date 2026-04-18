import { useState, useCallback } from "react";

// Client for the Python backend (rubeira-backend/) via the /api/rubeira
// proxy. Non-streaming: each call returns the full JSON envelope.
//
// Endpoints:
//   POST /api/rubeira/route  → { route: "agent" | "triad", result: {...} }
//   POST /api/rubeira/dev    → agent loop with tool-use (AgentResponse)
//   POST /api/rubeira/ask    → triad + judge (RubeiraResponse)

export interface RubeiraQueryBody {
  question: string;
  context?: string;
  force_cautious?: boolean;
}

type Route = "route" | "dev" | "ask";

export function useRubeira() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (route: Route, body: RubeiraQueryBody) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/rubeira/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`rubeira ${route} ${res.status}: ${text.slice(0, 200)}`);
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
