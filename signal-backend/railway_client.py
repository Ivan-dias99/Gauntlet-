"""
Signal — Railway GraphQL client (Wave P-26).

Thin async wrapper around Railway's public GraphQL API at
`https://backboard.railway.com/graphql/v2`. Two read-only queries the
operator surface needs first: list services in a project, list
deployments for a service+environment.

Design notes:
  - GraphQL strings are inline triple-quoted constants. The schema
    evolves; keeping them adjacent to the call sites makes a future
    swap a one-file edit instead of a hunt across modules.
  - Defensive parsing: every response field is read with `.get(...)`
    chains and `or []`/`or {}` guards. Railway has and will rename
    fields; a missing key should return an empty list, never crash.
  - Errors are uniform: any non-200, transport failure, or GraphQL
    `errors[]` payload is normalized into
    `RuntimeError("railway gql: {status} | {error_msg}")`. Callers
    decide whether to translate to a 502 / fallback envelope.
  - Timeout is 15s, applied at the httpx client level, so a hung
    Railway upstream can never block a request thread indefinitely.
  - No retry / backoff in v1. Single-shot fetch; the caller already
    runs under `record_route` so failures show up on the dashboard.
"""

from __future__ import annotations

from typing import Any

import httpx


RAILWAY_GQL_ENDPOINT = "https://backboard.railway.com/graphql/v2"
_TIMEOUT_S = 15.0


# ── GraphQL queries ─────────────────────────────────────────────────────────

_LIST_SERVICES_QUERY = """
query ListServices($id: String!) {
  project(id: $id) {
    services {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}
"""

_LIST_DEPLOYMENTS_QUERY = """
query ListDeployments($serviceId: String!, $environmentId: String!, $limit: Int!) {
  deployments(
    first: $limit
    input: { serviceId: $serviceId, environmentId: $environmentId }
  ) {
    edges {
      node {
        id
        status
        createdAt
        staticUrl
        url
        meta
      }
    }
  }
}
"""


# ── Core transport ──────────────────────────────────────────────────────────


async def _gql(
    *,
    token: str,
    query: str,
    variables: dict | None = None,
) -> dict:
    """POST a GraphQL query against Railway and return the `data` payload.

    Raises RuntimeError on transport failure, non-2xx status, or any
    GraphQL `errors[]` array. The error string is shaped as
    `"railway gql: {status} | {error_msg}"` so callers can route on it.
    """
    payload = {"query": query, "variables": variables or {}}
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT_S) as client:
            resp = await client.post(
                RAILWAY_GQL_ENDPOINT,
                json=payload,
                headers=headers,
            )
    except httpx.HTTPError as exc:
        raise RuntimeError(f"railway gql: 0 | {type(exc).__name__}: {exc}") from exc

    status = resp.status_code
    if status < 200 or status >= 300:
        # Pull a body snippet for triage without dumping arbitrary bytes
        # into the error message.
        try:
            body = resp.text[:500]
        except Exception:  # noqa: BLE001
            body = "<unreadable body>"
        raise RuntimeError(f"railway gql: {status} | {body}")

    try:
        body_json: dict = resp.json()
    except ValueError as exc:
        raise RuntimeError(f"railway gql: {status} | non-json body: {exc}") from exc

    errors = body_json.get("errors")
    if errors:
        # GraphQL spec: errors is a list of {message, ...}. Join messages
        # with `; ` so the operator sees every reason at once instead of
        # whichever happened to land first.
        try:
            msgs = "; ".join(
                str(e.get("message") or e) for e in errors if e is not None
            )
        except Exception:  # noqa: BLE001
            msgs = str(errors)
        raise RuntimeError(f"railway gql: {status} | {msgs}")

    data = body_json.get("data")
    if not isinstance(data, dict):
        # `data` can legitimately be null when GraphQL returns only
        # errors, but we've already raised above. A non-dict here is a
        # protocol-level surprise — surface it loudly.
        raise RuntimeError(f"railway gql: {status} | missing data field")
    return data


# ── Service helpers ─────────────────────────────────────────────────────────


async def list_services(*, token: str, project_id: str) -> list[dict]:
    """Return services for `project_id` as a list of `{id, name}` dicts.

    Defensive on every level — if Railway returns a project with no
    services, or an unexpected shape, the result is an empty list, not
    an exception. Transport / GraphQL errors still raise from `_gql`.
    """
    data = await _gql(
        token=token,
        query=_LIST_SERVICES_QUERY,
        variables={"id": project_id},
    )
    project = data.get("project") or {}
    services = project.get("services") or {}
    edges = services.get("edges") or []
    out: list[dict] = []
    for edge in edges:
        if not isinstance(edge, dict):
            continue
        node = edge.get("node")
        if not isinstance(node, dict):
            continue
        out.append({
            "id": node.get("id"),
            "name": node.get("name"),
        })
    return out


async def list_deployments(
    *,
    token: str,
    service_id: str,
    environment_id: str,
    limit: int = 20,
) -> list[dict]:
    """Return up to `limit` deployments for a service+environment pair.

    Each entry is a flat dict carrying the most common triage fields
    (id, status, createdAt, url, staticUrl, meta). Fields absent from
    the upstream response come back as `None`. Empty / missing edges
    yield an empty list.
    """
    # Clamp limit defensively. Railway's schema accepts ints; we don't
    # want a caller to accidentally request 10k deployments and pin the
    # event loop on a giant payload.
    safe_limit = max(1, min(int(limit or 20), 100))
    data = await _gql(
        token=token,
        query=_LIST_DEPLOYMENTS_QUERY,
        variables={
            "serviceId": service_id,
            "environmentId": environment_id,
            "limit": safe_limit,
        },
    )
    deployments = data.get("deployments") or {}
    edges = deployments.get("edges") or []
    out: list[dict] = []
    for edge in edges:
        if not isinstance(edge, dict):
            continue
        node = edge.get("node")
        if not isinstance(node, dict):
            continue
        out.append({
            "id": node.get("id"),
            "status": node.get("status"),
            "created_at": node.get("createdAt"),
            "url": node.get("url"),
            "static_url": node.get("staticUrl"),
            "meta": node.get("meta"),
        })
    return out


__all__ = [
    "RAILWAY_GQL_ENDPOINT",
    "_gql",
    "list_services",
    "list_deployments",
]
