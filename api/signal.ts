// Vercel edge forwarder — proxies /api/signal/* to the Python backend.
//
// Env:
//   SIGNAL_BACKEND_URL  — required (e.g. https://backend.up.railway.app)
//
// Routing: this file is registered at /api/signal. All sub-paths
// (/api/signal/foo, /api/signal/foo/bar, …) reach it via the rewrite
// declared in vercel.json.

import { forward } from "./_forwarder";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  return forward(req, /^\/api\/signal/);
}
