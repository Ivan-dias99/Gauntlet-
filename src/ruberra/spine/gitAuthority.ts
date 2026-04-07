// Ruberra — Git Authority Seam
// Materializes repo binding as a real git verification.
// Degraded-honest: if backend is unbound, returns ok:false with clear message.
// No fake verification. Either the backend confirms .git exists or it does not.

const EXEC_BACKEND = (import.meta as any).env?.VITE_RUBERRA_EXEC_URL as
  | string
  | undefined;

export interface GitVerifyResult {
  ok: boolean;
  message: string;
  branch?: string;
}

export async function verifyRepo(repoPath: string): Promise<GitVerifyResult> {
  if (!EXEC_BACKEND) {
    return { ok: false, message: "execution backend unbound — repo unverified" };
  }

  const base = EXEC_BACKEND.replace(/\/exec$/, "");
  try {
    const res = await fetch(`${base}/git/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ repoPath }),
    });
    if (!res.ok) {
      return { ok: false, message: `backend error ${res.status}` };
    }
    return (await res.json()) as GitVerifyResult;
  } catch (e) {
    return { ok: false, message: `verification unreachable: ${(e as Error).message}` };
  }
}
