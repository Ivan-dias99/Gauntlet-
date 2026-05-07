// Vercel edge forwarder — proxies /api/gauntlet/* to the Python backend.
//
// Env: GAUNTLET_BACKEND_URL (e.g. https://backend.up.railway.app).
//
// Routing: this file is registered at /api/gauntlet. All sub-paths
// (/api/gauntlet/foo, /api/gauntlet/foo/bar, …) reach it via the rewrite
// declared in vercel.json.

import { forward } from "./_forwarder";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  return forward(req, /^\/api\/gauntlet/);
}
