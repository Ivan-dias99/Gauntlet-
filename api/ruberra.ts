// Vercel edge forwarder — /api/ruberra/* → Python backend.
//
// LEGACY alias kept during the Wave-0 → Wave-8 compatibility window. New
// callers should reach the backend through /api/signal/*. The canonical
// implementation lives in api/signal.ts; both routes share the same
// forward() helper in api/_forwarder.ts so the behavior, the typed
// unreachable contract, and the dual unreachable headers stay identical.
//
// This file will be removed in Wave 8 alongside the rest of the
// ruberra-namespace shims. Do not add new logic here.

import { forward } from "./_forwarder";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  return forward(req, /^\/api\/ruberra/);
}
