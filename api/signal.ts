// Vercel edge forwarder — proxies /api/signal/* to the Python backend.
//
// Env:
//   SIGNAL_BACKEND_URL — required (e.g. https://backend.up.railway.app)

import { forward } from "./_forwarder";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  return forward(req, /^\/api\/signal/);
}
