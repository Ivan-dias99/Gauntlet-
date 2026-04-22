// Vercel edge forwarder — proxies /api/signal/* to the Python backend.
//
// Canonical forwarder as of Wave 0. The legacy alias at api/ruberra.ts
// shares this implementation via api/_forwarder.ts and will be removed
// in Wave 8 once the compatibility window closes.
//
// Env:
//   SIGNAL_BACKEND_URL   — preferred (e.g. https://backend.up.railway.app)
//   RUBERRA_BACKEND_URL  — legacy fallback, still honored during compat
//
// Routing: this file is registered at /api/signal. All sub-paths
// (/api/signal/foo, /api/signal/foo/bar, …) reach it via the rewrite
// declared in vercel.json.

import { forward } from "./_forwarder";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  return forward(req, /^\/api\/signal/);
}
