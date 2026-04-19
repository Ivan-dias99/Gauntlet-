"""
Ruberra — MCP (Model Context Protocol) client adapter.

Loads one or more MCP servers from configuration and exposes their
tools to Ruberra's ``ToolRegistry`` as regular ``Tool`` instances. The
agent loop then discovers them through the same Anthropic tool-use
contract, indistinguishable from Ruberra's built-in tools apart from a
``mcp__<server>__<name>`` prefix.

Config
------
Set ``RUBERRA_MCP_CONFIG`` to a JSON file path. Shape::

    {
      "servers": [
        {
          "name": "fs",
          "transport": "stdio",
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
          "env": {"NODE_ENV": "production"}
        },
        {
          "name": "web",
          "transport": "sse",
          "url": "https://mcp.example.com/sse"
        }
      ]
    }

Missing file or absent env var = no-op (zero MCP tools registered).

Lifecycle
---------
Each server session is held open for the lifetime of the Ruberra
process. Sessions are closed in the app's shutdown lifecycle hook.
"""

from __future__ import annotations

import json
import logging
import os
from contextlib import AsyncExitStack
from pathlib import Path
from typing import Any, Optional

from tools import (
    MAX_OUTPUT_CHARS,
    Tool,
    ToolRegistry,
    ToolResult,
)

logger = logging.getLogger("ruberra.mcp")

MCP_CONFIG_ENV = "RUBERRA_MCP_CONFIG"


# ── Config loading ──────────────────────────────────────────────────────────


def _load_config() -> list[dict[str, Any]]:
    path = os.environ.get(MCP_CONFIG_ENV)
    if not path:
        return []
    p = Path(path)
    if not p.is_file():
        logger.warning("MCP config %s not found", path)
        return []
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        logger.error("MCP config %s invalid JSON: %s", path, exc)
        return []
    servers = data.get("servers") or []
    if not isinstance(servers, list):
        logger.error("MCP config .servers must be a list")
        return []
    return servers


# ── MCP-wrapped Tool ────────────────────────────────────────────────────────


class MCPTool(Tool):
    """A single MCP server tool exposed as a Ruberra ``Tool``.

    The MCP session is held by the manager; this wrapper holds only
    references and performs the call. Timeouts inherit from the base
    ``Tool.execute`` wrapper.
    """

    def __init__(
        self,
        *,
        server_name: str,
        remote_name: str,
        description: str,
        input_schema: dict[str, Any],
        session: Any,  # mcp.ClientSession
    ) -> None:
        # Prefix so MCP tools never collide with built-ins.
        self.name = f"mcp__{server_name}__{remote_name}"
        self.description = description or f"MCP tool {remote_name} from {server_name}"
        self.input_schema = input_schema or {"type": "object", "properties": {}}
        self._server_name = server_name
        self._remote_name = remote_name
        self._session = session

    async def _run(self, **kwargs: Any) -> ToolResult:
        try:
            result = await self._session.call_tool(self._remote_name, kwargs or None)
        except Exception as exc:  # noqa: BLE001
            return ToolResult(ok=False, content=f"mcp call failed: {exc}")
        parts: list[str] = []
        for block in getattr(result, "content", []) or []:
            btype = getattr(block, "type", None)
            if btype == "text":
                parts.append(getattr(block, "text", "") or "")
            else:
                # resource / image / audio blocks — render a stub
                parts.append(f"[mcp:{btype}]")
        body = "\n".join(parts).strip() or "(empty mcp response)"
        if len(body) > MAX_OUTPUT_CHARS:
            body = body[:MAX_OUTPUT_CHARS] + "\n…[truncated]"
        is_error = bool(getattr(result, "isError", False))
        return ToolResult(ok=not is_error, content=body)


# ── Manager ─────────────────────────────────────────────────────────────────


class MCPManager:
    """Owns all MCP client sessions for the lifetime of the process."""

    def __init__(self) -> None:
        self._stack: Optional[AsyncExitStack] = None
        self._tools: list[MCPTool] = []
        self._server_count: int = 0

    async def start(self, registry: ToolRegistry) -> None:
        """Load config, connect to every declared server, and register
        their tools into ``registry``. Safe to call when no config or
        the ``mcp`` package is missing — logs and returns."""
        servers = _load_config()
        if not servers:
            logger.info("MCP disabled (no %s or empty config)", MCP_CONFIG_ENV)
            return

        try:
            from mcp import ClientSession
            from mcp.client.stdio import StdioServerParameters, stdio_client
            from mcp.client.sse import sse_client
        except ImportError:
            logger.warning(
                "MCP config present but ``mcp`` package not installed; "
                "add ``mcp`` to requirements.txt"
            )
            return

        self._stack = AsyncExitStack()
        await self._stack.__aenter__()

        for cfg in servers:
            name = str(cfg.get("name") or "").strip() or "unnamed"
            transport = str(cfg.get("transport") or "stdio").lower()
            try:
                if transport == "stdio":
                    params = StdioServerParameters(
                        command=str(cfg.get("command") or ""),
                        args=list(cfg.get("args") or []),
                        env=dict(cfg.get("env") or {}) or None,
                    )
                    streams = await self._stack.enter_async_context(
                        stdio_client(params)
                    )
                elif transport in ("sse", "http"):
                    streams = await self._stack.enter_async_context(
                        sse_client(str(cfg.get("url") or ""))
                    )
                else:
                    logger.warning("MCP server %s: unknown transport %r", name, transport)
                    continue

                read, write = streams[0], streams[1]
                session = await self._stack.enter_async_context(
                    ClientSession(read, write)
                )
                await session.initialize()

                tools_result = await session.list_tools()
                for t in getattr(tools_result, "tools", []) or []:
                    adapter = MCPTool(
                        server_name=name,
                        remote_name=t.name,
                        description=t.description or "",
                        input_schema=t.inputSchema or {"type": "object", "properties": {}},
                        session=session,
                    )
                    registry.register(adapter)
                    self._tools.append(adapter)
                self._server_count += 1
                logger.info(
                    "MCP server %s (%s) connected, %d tools registered",
                    name, transport, len(tools_result.tools or []),
                )
            except Exception as exc:  # noqa: BLE001
                logger.exception("MCP server %s failed to connect: %s", name, exc)

    async def stop(self) -> None:
        """Close all MCP sessions."""
        if self._stack is not None:
            await self._stack.__aexit__(None, None, None)
            self._stack = None

    @property
    def tool_count(self) -> int:
        return len(self._tools)

    @property
    def server_count(self) -> int:
        return self._server_count


mcp_manager = MCPManager()
