"""
Signal — Vercel API client (Wave P-25).

Thin async wrapper over the Vercel REST API. Two read-only verbs for
now: ``list_deployments`` and ``get_deployment``. The audit flagged
Vercel as a 🟡 stub — config-only detection without an actual API
integration; this module is the integration the endpoints in
server.py mount.

Constraints:

- httpx-based, async-only. server.py never imports httpx directly;
  the dep stays scoped to this module so the HTTP plumbing is one
  swap away from a different transport.
- Bearer auth, 15s timeout. No retries on this v1 — Vercel's API is
  stable enough that the read endpoints either answer or fail loudly,
  and a silent retry would mask outages from the operator.
- Non-2xx responses raise ``RuntimeError`` with the upstream status
  + a truncated body so the operator gets a useful trace without
  leaking a token (Vercel never echoes the bearer back, but we still
  cap at 200 chars to stay defensive).
"""

from __future__ import annotations

from typing import Any

import httpx

# ── Constants ───────────────────────────────────────────────────────────────

_API_BASE = "https://api.vercel.com"
_TIMEOUT_SECONDS = 15.0


def _auth_headers(token: str) -> dict[str, str]:
    """Bearer envelope. Trim whitespace because pasted tokens often
    arrive with a trailing newline that breaks the header parser."""
    return {
        "Authorization": f"Bearer {token.strip()}",
        "Accept": "application/json",
    }


def _raise_for_status(resp: httpx.Response) -> None:
    """RuntimeError with status + truncated body. Mirrors the wording
    chosen across the rest of Signal's external clients so the
    operator sees a consistent prefix in the logs."""
    if 200 <= resp.status_code < 300:
        return
    text = resp.text or ""
    raise RuntimeError(f"vercel api: {resp.status_code} {text[:200]}")


# ── Public API ──────────────────────────────────────────────────────────────


async def list_deployments(
    *,
    token: str,
    project: str | None = None,
    team: str | None = None,
    limit: int = 20,
) -> list[dict[str, Any]]:
    """List recent deployments.

    GET ``/v6/deployments`` — Vercel's stable listing endpoint. Params:

    - ``limit``: 1–100 (Vercel caps at 100; we forward the caller's
      value verbatim and let Vercel reject out-of-range values).
    - ``projectId``: optional project scope.
    - ``teamId``: optional team scope (required for team-owned
      projects — without it the call returns 403).
    """
    params: dict[str, str] = {"limit": str(int(limit))}
    if project:
        params["projectId"] = project
    if team:
        params["teamId"] = team

    async with httpx.AsyncClient(timeout=_TIMEOUT_SECONDS) as client:
        resp = await client.get(
            f"{_API_BASE}/v6/deployments",
            params=params,
            headers=_auth_headers(token),
        )
    _raise_for_status(resp)
    body = resp.json()
    # Vercel returns ``{"deployments": [...], "pagination": {...}}``.
    # Be defensive: a future API version that returns a bare list still
    # works without a crash.
    if isinstance(body, dict):
        deployments = body.get("deployments") or []
    elif isinstance(body, list):
        deployments = body
    else:
        deployments = []
    return list(deployments)


async def get_deployment(
    *,
    token: str,
    id: str,
    team: str | None = None,
) -> dict[str, Any]:
    """Fetch a single deployment by id (or url).

    GET ``/v13/deployments/{id}`` — Vercel's current detail endpoint.
    The path id can be either the ``dpl_*`` deployment id or the host
    name (``my-project-abc123.vercel.app``); Vercel resolves both."""
    params: dict[str, str] = {}
    if team:
        params["teamId"] = team

    async with httpx.AsyncClient(timeout=_TIMEOUT_SECONDS) as client:
        resp = await client.get(
            f"{_API_BASE}/v13/deployments/{id}",
            params=params or None,
            headers=_auth_headers(token),
        )
    _raise_for_status(resp)
    body = resp.json()
    if not isinstance(body, dict):
        # Defensive: the v13 contract is an object, but if Vercel ever
        # changes shape we surface the raw body inside an envelope so
        # the caller doesn't crash on ``.get(...)``.
        return {"raw": body}
    return body
