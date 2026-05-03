// Vercel edge forwarder — proxies /api/gauntlet/* to the Python backend.
//
// Canonical forwarder. Legacy aliases at api/signal.ts and api/ruberra.ts
// share this implementation via api/_forwarder.ts and will be removed
// once the canonical name lands in every deployed env.
//
// Env:
//   GAUNTLET_BACKEND_URL — preferred (e.g. https://backend.up.railway.app)
//   SIGNAL_BACKEND_URL   — legacy fallback
//   RUBERRA_BACKEND_URL  — older legacy fallback
//
// Routing: this file is registered at /api/gauntlet. All sub-paths
// (/api/gauntlet/foo, /api/gauntlet/foo/bar, …) reach it via the rewrite
// declared in vercel.json.

import { forward } from "./_forwarder";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  return forward(req, /^\/api\/gauntlet/);
}
