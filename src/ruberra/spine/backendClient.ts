// Ruberra — thin client for the canonical Python backend.
// Maps UI actions to FastAPI endpoints in apps/backend/rubeira_backend/server.py.
// Response shapes mirror apps/backend/rubeira_backend/models.py.

const BACKEND_URL: string =
  (import.meta as any).env?.VITE_BACKEND_URL ?? "http://localhost:8000";

export type Confidence = "high" | "medium" | "low";

export type RubeiraQuery = {
  question: string;
  context?: string;
  force_cautious?: boolean;
};

export type TriadResult = {
  id: string;
  timestamp: string;
  answer: string | null;
  refused: boolean;
  refusal_message: string | null;
  refusal_reason: string | null;
  confidence: Confidence;
  confidence_explanation: string;
  triad_agreement: string;
  judge_reasoning: string;
  total_input_tokens: number;
  total_output_tokens: number;
  triad_call_count: number;
  processing_time_ms: number;
  matched_prior_failure: boolean;
  prior_failure_note: string | null;
};

export type AgentResult = Record<string, unknown>;

export type RouteResponse =
  | { route: "triad"; result: TriadResult }
  | { route: "agent"; result: AgentResult };

export type DevResponse = AgentResult;

export class BackendError extends Error {
  readonly status: number;
  readonly body: string;
  constructor(status: number, body: string) {
    super(`Backend ${status}: ${body.slice(0, 200)}`);
    this.status = status;
    this.body = body;
  }
}

async function post<T>(path: string, body: RubeiraQuery): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new BackendError(res.status, text);
  }
  return res.json() as Promise<T>;
}

export function routeToBackend(
  prompt: string,
  opts: { context?: string; forceCautious?: boolean } = {},
): Promise<RouteResponse> {
  return post<RouteResponse>("/route", {
    question: prompt,
    context: opts.context,
    force_cautious: opts.forceCautious ?? false,
  });
}

export function devTask(
  prompt: string,
  opts: { context?: string } = {},
): Promise<DevResponse> {
  return post<DevResponse>("/dev", {
    question: prompt,
    context: opts.context,
  });
}

export { BACKEND_URL };
