import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";

// Live repo/branch state from the workspace the brain is running over.
// Replaces the build-time env reads (VITE_SIGNAL_REPO / VITE_SIGNAL_BRANCH)
// the composer used to do — those were always stale and showed
// "unavailable" until someone remembered to set them.
//
// The endpoint (server.py /git/status) is read-only and never throws on
// non-repo workspaces — it just returns repo:null / branch:null with an
// `error` discriminator. The hook collapses unreachable / 5xx into the
// same null-state so the composer can render a single fallback path.

export interface GitStatus {
  repo: string | null;
  branch: string | null;
  head: string | null;
  dirty: boolean;
  ahead: number;
  behind: number;
  reachable: boolean;
  error: string | null;
}

const INITIAL: GitStatus = {
  repo: null,
  branch: null,
  head: null,
  dirty: false,
  ahead: 0,
  behind: 0,
  reachable: true,
  error: null,
};

interface GitStatusBody {
  repo?: string | null;
  branch?: string | null;
  head?: string | null;
  dirty?: boolean;
  ahead?: number;
  behind?: number;
  error?: string | null;
  message?: string | null;
}

export function useGitStatus(): GitStatus {
  const [status, setStatus] = useState<GitStatus>(INITIAL);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await signalFetch("/git/status", { signal: ac.signal });
        if (!res.ok) {
          setStatus({ ...INITIAL, error: `git_status:${res.status}` });
          return;
        }
        const body = (await res.json()) as GitStatusBody;
        setStatus({
          repo: body.repo ?? null,
          branch: body.branch ?? null,
          head: body.head ?? null,
          dirty: !!body.dirty,
          ahead: body.ahead ?? 0,
          behind: body.behind ?? 0,
          reachable: true,
          error: body.error ?? null,
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (isBackendUnreachable(e)) {
          setStatus({ ...INITIAL, reachable: false, error: "backend_unreachable" });
          return;
        }
        setStatus({ ...INITIAL, error: e instanceof Error ? e.message : String(e) });
      }
    })();
    return () => ac.abort();
  }, []);

  return status;
}
