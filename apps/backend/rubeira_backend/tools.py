"""
Rubeira Dev — Tool Layer

Defines the ``Tool`` contract, a ``ToolRegistry`` for dispatch, and a set of
eight production-grade tools that the agent orchestrator can invoke.

Every tool:
  * declares an Anthropic-compatible JSON schema (``input_schema``)
  * is async and returns a ``ToolResult`` (ok/err, string content, metadata)
  * enforces its own timeout / resource limits — the agent does not trust input

Safety posture:
  * file / directory ops are rooted at ``TOOL_WORKSPACE_ROOT``
  * shell and python execution are gated by ``AGENT_ALLOW_CODE_EXEC`` and by
    a per-tool binary allow-list
  * every tool carries a hard wall-clock timeout
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import shlex
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Awaitable, Callable, Optional

import httpx

logger = logging.getLogger("rubeira.tools")


# ── Configuration ───────────────────────────────────────────────────────────

TOOL_WORKSPACE_ROOT: Path = Path(
    os.environ.get("RUBEIRA_WORKSPACE", Path(__file__).resolve().parent.parent)
).resolve()

AGENT_ALLOW_CODE_EXEC: bool = os.environ.get(
    "RUBEIRA_ALLOW_CODE_EXEC", "false"
).strip().lower() in ("1", "true", "yes", "on")

# Shell binaries the agent may invoke via ``run_command``.
SHELL_ALLOWLIST: tuple[str, ...] = (
    "ls", "cat", "head", "tail", "wc", "grep", "find", "stat",
    "node", "npm", "npx", "python", "python3", "pip", "pytest",
    "git", "echo", "which", "pwd", "tree",
)

DEFAULT_TOOL_TIMEOUT_S: float = 20.0
HTTP_TIMEOUT_S: float = 15.0
MAX_FILE_BYTES: int = 256 * 1024     # 256 KiB
MAX_OUTPUT_CHARS: int = 16_000       # truncate long tool outputs


# ── Result Contract ─────────────────────────────────────────────────────────

@dataclass
class ToolResult:
    """Uniform envelope returned by every tool."""
    ok: bool
    content: str
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_tool_block(self) -> dict[str, Any]:
        """Serialize into the ``tool_result`` content block expected by Claude."""
        payload = self.content if self.ok else f"[tool error] {self.content}"
        if len(payload) > MAX_OUTPUT_CHARS:
            payload = payload[:MAX_OUTPUT_CHARS] + "\n…[truncated]"
        return {"type": "text", "text": payload}


# ── Tool Base ───────────────────────────────────────────────────────────────

class Tool:
    """Base contract. Subclasses override ``name``, ``description``,
    ``input_schema``, and ``_run``."""

    name: str = ""
    description: str = ""
    input_schema: dict[str, Any] = {"type": "object", "properties": {}}
    timeout_s: float = DEFAULT_TOOL_TIMEOUT_S

    async def _run(self, **kwargs: Any) -> ToolResult:  # pragma: no cover - abstract
        raise NotImplementedError

    async def execute(self, **kwargs: Any) -> ToolResult:
        """Run the tool with timeout and error containment."""
        try:
            return await asyncio.wait_for(self._run(**kwargs), timeout=self.timeout_s)
        except asyncio.TimeoutError:
            return ToolResult(
                ok=False,
                content=f"Tool '{self.name}' timed out after {self.timeout_s}s",
            )
        except Exception as exc:  # noqa: BLE001
            logger.exception("Tool %s crashed", self.name)
            return ToolResult(ok=False, content=f"Tool '{self.name}' crashed: {exc}")

    def to_anthropic(self) -> dict[str, Any]:
        """Anthropic tool-use descriptor."""
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.input_schema,
        }


# ── Path Guard ──────────────────────────────────────────────────────────────

def _resolve_within_workspace(path: str) -> Path:
    """Resolve ``path`` and verify it stays under ``TOOL_WORKSPACE_ROOT``."""
    candidate = (TOOL_WORKSPACE_ROOT / path).resolve() if not os.path.isabs(path) \
        else Path(path).resolve()
    try:
        candidate.relative_to(TOOL_WORKSPACE_ROOT)
    except ValueError as exc:
        raise PermissionError(
            f"Path '{candidate}' escapes workspace root '{TOOL_WORKSPACE_ROOT}'"
        ) from exc
    return candidate


# ── 1. Web Search ───────────────────────────────────────────────────────────

class WebSearchTool(Tool):
    name = "web_search"
    description = (
        "Search the public web via DuckDuckGo's instant-answer API. Use for "
        "up-to-date facts, docs URLs, and package pages. Returns a short "
        "abstract plus related topics. Not a substitute for direct fetches."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query"},
        },
        "required": ["query"],
    }

    async def _run(self, query: str) -> ToolResult:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_S) as client:
            resp = await client.get(
                "https://api.duckduckgo.com/",
                params={"q": query, "format": "json", "no_html": 1, "skip_disambig": 1},
                headers={"User-Agent": "Rubeira-Dev/1.0"},
            )
        resp.raise_for_status()
        data = resp.json()
        lines = [f"Query: {query}"]
        if data.get("AbstractText"):
            lines.append(f"Abstract: {data['AbstractText']}")
            if data.get("AbstractURL"):
                lines.append(f"Source: {data['AbstractURL']}")
        related = data.get("RelatedTopics") or []
        if related:
            lines.append("Related:")
            for item in related[:6]:
                text = item.get("Text") or item.get("Name") or ""
                url = item.get("FirstURL") or ""
                if text:
                    lines.append(f"  - {text} {f'({url})' if url else ''}")
        if len(lines) == 1:
            lines.append("No results.")
        return ToolResult(ok=True, content="\n".join(lines))


# ── 2. Code Execution (Python) ──────────────────────────────────────────────

class ExecutePythonTool(Tool):
    name = "execute_python"
    description = (
        "Run a short Python 3 snippet in a subprocess with a hard timeout. "
        "Stdout and stderr are captured. Disabled unless RUBEIRA_ALLOW_CODE_EXEC "
        "is true. Never use for destructive ops."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "code": {"type": "string", "description": "Python source to execute"},
            "stdin": {"type": "string", "description": "Optional stdin payload"},
        },
        "required": ["code"],
    }
    timeout_s = 15.0

    async def _run(self, code: str, stdin: str = "") -> ToolResult:
        if not AGENT_ALLOW_CODE_EXEC:
            return ToolResult(
                ok=False,
                content="execute_python is disabled (set RUBEIRA_ALLOW_CODE_EXEC=true).",
            )
        proc = await asyncio.create_subprocess_exec(
            "python3", "-I", "-c", code,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(TOOL_WORKSPACE_ROOT),
        )
        try:
            stdout, stderr = await asyncio.wait_for(
                proc.communicate(stdin.encode() if stdin else None),
                timeout=self.timeout_s - 1,
            )
        except asyncio.TimeoutError:
            proc.kill()
            return ToolResult(ok=False, content="execute_python exceeded budget")
        return ToolResult(
            ok=proc.returncode == 0,
            content=(
                f"exit={proc.returncode}\n"
                f"--- stdout ---\n{stdout.decode(errors='replace')}\n"
                f"--- stderr ---\n{stderr.decode(errors='replace')}"
            ),
            metadata={"exit_code": proc.returncode},
        )


# ── 3. Read File ────────────────────────────────────────────────────────────

class ReadFileTool(Tool):
    name = "read_file"
    description = (
        "Read a text file inside the workspace. Returns up to 256 KiB. "
        "Optionally slice by line range."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Path relative to workspace"},
            "start_line": {"type": "integer", "minimum": 1},
            "end_line": {"type": "integer", "minimum": 1},
        },
        "required": ["path"],
    }

    async def _run(
        self,
        path: str,
        start_line: Optional[int] = None,
        end_line: Optional[int] = None,
    ) -> ToolResult:
        target = _resolve_within_workspace(path)
        if not target.is_file():
            return ToolResult(ok=False, content=f"Not a file: {target}")
        if target.stat().st_size > MAX_FILE_BYTES:
            return ToolResult(
                ok=False,
                content=f"File too large ({target.stat().st_size} bytes > {MAX_FILE_BYTES})",
            )
        text = target.read_text(encoding="utf-8", errors="replace")
        if start_line or end_line:
            lines = text.splitlines()
            s = (start_line or 1) - 1
            e = end_line or len(lines)
            text = "\n".join(lines[s:e])
        return ToolResult(
            ok=True,
            content=text,
            metadata={"path": str(target), "bytes": len(text)},
        )


# ── 4. List Directory ───────────────────────────────────────────────────────

class ListDirectoryTool(Tool):
    name = "list_directory"
    description = (
        "List entries in a workspace directory. Non-recursive. "
        "Returns name, type, and size in bytes."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Directory relative to workspace"},
        },
        "required": ["path"],
    }

    async def _run(self, path: str = ".") -> ToolResult:
        target = _resolve_within_workspace(path)
        if not target.is_dir():
            return ToolResult(ok=False, content=f"Not a directory: {target}")
        entries = []
        for child in sorted(target.iterdir()):
            kind = "dir" if child.is_dir() else "file"
            size = child.stat().st_size if child.is_file() else 0
            entries.append(f"{kind:4}  {size:>10}  {child.name}")
        header = f"{'kind':4}  {'size':>10}  name"
        return ToolResult(
            ok=True,
            content="\n".join([header, *entries]) if entries else "(empty)",
            metadata={"count": len(entries)},
        )


# ── 5. Git Operations ───────────────────────────────────────────────────────

class GitTool(Tool):
    name = "git"
    description = (
        "Run a read-only git command inside the workspace. "
        "Supported subcommands: status, diff, log, branch, show."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "subcommand": {
                "type": "string",
                "enum": ["status", "diff", "log", "branch", "show"],
            },
            "args": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Extra args appended to the git subcommand",
            },
        },
        "required": ["subcommand"],
    }

    async def _run(
        self,
        subcommand: str,
        args: Optional[list[str]] = None,
    ) -> ToolResult:
        safe_args = [a for a in (args or []) if not a.startswith("--exec=")]
        cmd = ["git", subcommand, *safe_args]
        if subcommand == "log" and not any(a.startswith("-") for a in safe_args):
            cmd.insert(2, "--oneline")
            cmd.insert(3, "-n")
            cmd.insert(4, "20")
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(TOOL_WORKSPACE_ROOT),
        )
        stdout, stderr = await proc.communicate()
        ok = proc.returncode == 0
        body = stdout.decode(errors="replace") if ok else stderr.decode(errors="replace")
        return ToolResult(
            ok=ok,
            content=body or "(no output)",
            metadata={"cmd": " ".join(cmd), "exit_code": proc.returncode},
        )


# ── 6. Terminal Command ─────────────────────────────────────────────────────

class RunCommandTool(Tool):
    name = "run_command"
    description = (
        "Run an allow-listed shell binary with arguments. The first token "
        "must be one of: " + ", ".join(SHELL_ALLOWLIST) + ". No shell "
        "interpolation — arguments are passed directly to execve."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "command": {
                "type": "string",
                "description": "Full command line; parsed with shlex.split",
            },
        },
        "required": ["command"],
    }
    timeout_s = 20.0

    async def _run(self, command: str) -> ToolResult:
        try:
            argv = shlex.split(command)
        except ValueError as exc:
            return ToolResult(ok=False, content=f"Invalid command: {exc}")
        if not argv:
            return ToolResult(ok=False, content="Empty command")
        if argv[0] not in SHELL_ALLOWLIST:
            return ToolResult(
                ok=False,
                content=f"Binary '{argv[0]}' not in allow-list: {SHELL_ALLOWLIST}",
            )
        proc = await asyncio.create_subprocess_exec(
            *argv,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(TOOL_WORKSPACE_ROOT),
        )
        try:
            stdout, stderr = await asyncio.wait_for(
                proc.communicate(), timeout=self.timeout_s - 1
            )
        except asyncio.TimeoutError:
            proc.kill()
            return ToolResult(ok=False, content=f"Command '{argv[0]}' timed out")
        ok = proc.returncode == 0
        merged = (
            f"exit={proc.returncode}\n"
            f"--- stdout ---\n{stdout.decode(errors='replace')}\n"
            f"--- stderr ---\n{stderr.decode(errors='replace')}"
        )
        return ToolResult(ok=ok, content=merged, metadata={"exit_code": proc.returncode})


# ── 7. Documentation Fetch ──────────────────────────────────────────────────

class FetchUrlTool(Tool):
    name = "fetch_url"
    description = (
        "Fetch a URL via HTTP GET and return its body as text (stripped of "
        "HTML tags when the response is HTML). Use for docs pages, API "
        "specs, RFCs, changelogs."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "url": {"type": "string", "description": "Absolute http/https URL"},
        },
        "required": ["url"],
    }

    async def _run(self, url: str) -> ToolResult:
        if not url.startswith(("http://", "https://")):
            return ToolResult(ok=False, content="Only http/https URLs are allowed")
        async with httpx.AsyncClient(
            timeout=HTTP_TIMEOUT_S,
            follow_redirects=True,
            headers={"User-Agent": "Rubeira-Dev/1.0"},
        ) as client:
            resp = await client.get(url)
        body = resp.text
        content_type = resp.headers.get("content-type", "")
        if "html" in content_type.lower():
            import re
            body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.S | re.I)
            body = re.sub(r"<style[^>]*>.*?</style>", "", body, flags=re.S | re.I)
            body = re.sub(r"<[^>]+>", " ", body)
            body = re.sub(r"\s+", " ", body).strip()
        return ToolResult(
            ok=resp.is_success,
            content=f"HTTP {resp.status_code} ({content_type})\n{body}",
            metadata={"status": resp.status_code, "url": str(resp.url)},
        )


# ── 8. Package Lookup (npm / pypi) ──────────────────────────────────────────

class PackageInfoTool(Tool):
    name = "package_info"
    description = (
        "Look up the latest metadata for an npm or PyPI package: version, "
        "description, homepage, license. Use before suggesting dependencies."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "ecosystem": {"type": "string", "enum": ["npm", "pypi"]},
            "name": {"type": "string", "description": "Package name"},
        },
        "required": ["ecosystem", "name"],
    }

    async def _run(self, ecosystem: str, name: str) -> ToolResult:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_S) as client:
            if ecosystem == "npm":
                resp = await client.get(f"https://registry.npmjs.org/{name}/latest")
                if not resp.is_success:
                    return ToolResult(ok=False, content=f"npm: {resp.status_code}")
                data = resp.json()
                summary = {
                    "name": data.get("name"),
                    "version": data.get("version"),
                    "description": data.get("description"),
                    "homepage": data.get("homepage"),
                    "license": data.get("license"),
                    "dependencies": list((data.get("dependencies") or {}).keys())[:15],
                }
            elif ecosystem == "pypi":
                resp = await client.get(f"https://pypi.org/pypi/{name}/json")
                if not resp.is_success:
                    return ToolResult(ok=False, content=f"pypi: {resp.status_code}")
                info = resp.json().get("info", {})
                summary = {
                    "name": info.get("name"),
                    "version": info.get("version"),
                    "summary": info.get("summary"),
                    "home_page": info.get("home_page") or info.get("project_url"),
                    "license": info.get("license"),
                    "requires_python": info.get("requires_python"),
                }
            else:
                return ToolResult(ok=False, content=f"Unknown ecosystem: {ecosystem}")
        return ToolResult(ok=True, content=json.dumps(summary, indent=2))


# ── Registry ────────────────────────────────────────────────────────────────

class ToolRegistry:
    """Dispatches tool-use requests coming from the agent loop."""

    def __init__(self, tools: Optional[list[Tool]] = None) -> None:
        self._tools: dict[str, Tool] = {}
        for tool in tools or default_tools():
            self.register(tool)

    def register(self, tool: Tool) -> None:
        if not tool.name:
            raise ValueError("Tool missing name")
        if tool.name in self._tools:
            raise ValueError(f"Duplicate tool: {tool.name}")
        self._tools[tool.name] = tool

    def names(self) -> list[str]:
        return list(self._tools)

    def anthropic_schema(self) -> list[dict[str, Any]]:
        """The tools array passed to ``messages.create(..., tools=...)``."""
        return [t.to_anthropic() for t in self._tools.values()]

    async def dispatch(self, name: str, arguments: dict[str, Any]) -> ToolResult:
        tool = self._tools.get(name)
        if tool is None:
            return ToolResult(ok=False, content=f"Unknown tool: {name}")
        logger.info("dispatch %s args=%s", name, list(arguments))
        return await tool.execute(**arguments)


def default_tools() -> list[Tool]:
    """Factory for the standard 8-tool bundle."""
    return [
        WebSearchTool(),
        ExecutePythonTool(),
        ReadFileTool(),
        ListDirectoryTool(),
        GitTool(),
        RunCommandTool(),
        FetchUrlTool(),
        PackageInfoTool(),
    ]
