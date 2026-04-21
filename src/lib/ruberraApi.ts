// Ruberra backend base URL.
//
// Dev & same-origin prod → "/api/ruberra" (handled by Vite proxy / Vercel
// edge forwarder). Override with VITE_RUBERRA_API_BASE when the frontend
// needs to reach the Python backend directly (e.g. preview deploys, local
// dev against a remote backend).
const RAW_BASE =
  (import.meta.env.VITE_RUBERRA_API_BASE as string | undefined) ??
  "/api/ruberra";

const BASE = RAW_BASE.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  const tail = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${tail}`;
}

export const RUBERRA_API_BASE = BASE;
