"""
Signal — Figma REST API client (Wave P-27).

Thin async wrapper over api.figma.com. Three calls cover the import
surface we need today:

  - get_file              → /v1/files/{file_key}
  - get_file_styles       → /v1/files/{file_key}/styles
  - get_local_variables   → /v1/files/{file_key}/variables/local

Auth is the Figma personal access token, sent in the X-Figma-Token
header. The token is supplied per-call (the caller pulls it from
config or a request body) so the client itself stays stateless and
easy to test.

Errors are surfaced as RuntimeError with a short, log-safe excerpt of
the response body — Figma error responses often include the file key,
which we don't want spilling into a 500 stack trace upstream. The
caller decides whether to swallow or propagate.

This module deliberately does NOT touch figma_tokens.py — that file
owns the parser. Wave P-27 only adds the network edge.
"""

from __future__ import annotations

from typing import Any

import httpx


_BASE_URL = "https://api.figma.com/v1"
_TIMEOUT_SECONDS = 20.0


def _headers(token: str) -> dict[str, str]:
    """Build the auth header. Single source of truth so a future swap
    to OAuth bearer tokens only touches this function."""
    return {"X-Figma-Token": token}


async def _get_json(url: str, *, token: str) -> dict[str, Any]:
    """GET `url` with the Figma auth header and a 20s timeout, decode
    JSON on 2xx, raise RuntimeError on anything else.

    The error message is intentionally truncated to 200 chars — Figma
    sometimes echoes the request URL (which contains the file key)
    into the error body, and we don't want that bleeding into logs."""
    async with httpx.AsyncClient(timeout=_TIMEOUT_SECONDS) as client:
        resp = await client.get(url, headers=_headers(token))
    if resp.status_code < 200 or resp.status_code >= 300:
        text = resp.text or ""
        raise RuntimeError(f"figma api: {resp.status_code} {text[:200]}")
    return resp.json()


async def get_file(*, token: str, file_key: str) -> dict[str, Any]:
    """Fetch the full file body. Used for canonical token import
    (styles + meta.variables walked by figma_tokens.py)."""
    return await _get_json(f"{_BASE_URL}/files/{file_key}", token=token)


async def get_file_styles(*, token: str, file_key: str) -> dict[str, Any]:
    """Fetch the file's published styles map. Lighter than get_file
    when the caller only needs paint/text style names + ids."""
    return await _get_json(f"{_BASE_URL}/files/{file_key}/styles", token=token)


async def get_local_variables(*, token: str, file_key: str) -> dict[str, Any]:
    """Fetch the file's local variable collections (Variables API).

    Response shape: `{ "meta": { "variables": {...},
    "variableCollections": {...} } }`. figma_tokens.tokens_from_figma_json
    already knows how to walk that structure, so callers can pass the
    raw response straight through if they want a normalised TokenSet."""
    return await _get_json(
        f"{_BASE_URL}/files/{file_key}/variables/local",
        token=token,
    )
