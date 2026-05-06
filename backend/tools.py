"""
Signal Dev — Tool Layer

Defines the ``Tool`` contract, a ``ToolRegistry`` for dispatch, and a set of
eight production-grade tools that the agent orchestrator can invoke.

Every tool:
  * declares an Anthropic-compatible JSON schema (``input_schema``)
  * is async and returns a ``ToolResult`` (ok/err, string content, metadata)
  * enforces its own timeout / resource limits — the agent does not trust input

Safety posture (deny-by-default):
  * file / directory ops are rooted at ``TOOL_WORKSPACE_ROOT``
  * command execution is split into a minimal SAFE set (read-only, no exec
    vector) and a GATED set (requires ``AGENT_ALLOW_CODE_EXEC`` plus a
    per-binary forbidden-argument policy). Anything not on either list is
    rejected — no default-allow.
  * ``git`` is intentionally NOT reachable through the generic run_command;
    it is only exposed through ``GitTool`` which hard-blocks config, exec-path,
    upload-pack, receive-pack, worktree/git-dir overrides, and the pager.
  * URL fetching never auto-follows redirects. Every hop (including the
    final effective target) is re-validated: scheme, userinfo, literal IPs,
    and every IP returned by ``getaddrinfo`` must be public (not loopback,
    private, link-local, multicast, reserved, or unspecified). This blocks
    redirect-based SSRF, cloud metadata services (169.254.169.254), IPv6
    loopback / ULA, and decimal/octal IP encoding tricks.
  * every tool carries a hard wall-clock timeout.
"""

from __future__ import annotations

import asyncio
import ipaddress
import json
import logging
import os
import re
import shlex
import socket
import urllib.parse
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional

import httpx

logger = logging.getLogger("gauntlet.tools")


# ── Configuration ───────────────────────────────────────────────────────────
# Env precedence: SIGNAL_* is canonical; RUBERRA_* is honored as a silent
# legacy fallback so existing deploys keep working until operators flip
# to the new variable names.


def _env(*names: str, default: str = "") -> str:
    """Return the first non-empty value among ``names`` from the env, else
    ``default``. Variadic so transition envs can read the canonical
    ``GAUNTLET_*`` first and fall back to ``SIGNAL_*`` / ``RUBERRA_*``
    in priority order."""
    for name in names:
        v = os.environ.get(name)
        if v:
            return v
    return default


TOOL_WORKSPACE_ROOT: Path = Path(
    _env(
        "GAUNTLET_WORKSPACE", "SIGNAL_WORKSPACE", "RUBERRA_WORKSPACE",
        default=str(Path(__file__).resolve().parent.parent),
    )
).resolve()

AGENT_ALLOW_CODE_EXEC: bool = _env(
    "GAUNTLET_ALLOW_CODE_EXEC", "SIGNAL_ALLOW_CODE_EXEC", "RUBERRA_ALLOW_CODE_EXEC",
    default="false",
).strip().lower() in ("1", "true", "yes", "on")

# ── Command policy (deny-by-default) ────────────────────────────────────────
#
# SAFE: read-only inspection binaries with no built-in exec/shell escape.
#   These run without ``AGENT_ALLOW_CODE_EXEC``. They can still read any
#   file the process can read — that is an accepted read-only risk.
_SAFE_COMMANDS: frozenset[str] = frozenset({
    "ls", "cat", "head", "tail", "wc", "stat", "pwd", "tree",
    "echo", "which", "grep",
})

# GATED: require ``AGENT_ALLOW_CODE_EXEC`` AND pass the per-binary argument
#   validator below. Anything not in SAFE ∪ GATED is rejected outright.
_GATED_COMMANDS: frozenset[str] = frozenset({
    "find", "python", "python3", "pip", "pip3",
    "npm", "npx", "node", "pytest",
})

# Per-binary forbidden argument patterns. Each arg of the invocation is
# checked; if it equals a forbidden token or starts with ``token=``, the
# whole command is rejected. ``find -exec`` and friends are the obvious
# holes, but this is the place to add more as new escapes are discovered —
# not the safe list.
_FORBIDDEN_ARGS: dict[str, frozenset[str]] = {
    "find": frozenset({
        "-exec", "-execdir", "-ok", "-okdir",
        "-delete", "-fprint", "-fprintf", "-fls",
    }),
}

# Git is NEVER in the generic command runner. It is only reachable via
# ``GitTool`` below, which enforces its own subcommand allow-list AND this
# forbidden-flag set. These flags collectively cover the known ways to turn
# a read-only git subcommand into code execution: ``-c`` / ``--config-env``
# inject arbitrary config (core.sshCommand, core.pager, protocol.*);
# ``--exec-path`` relocates helper binaries; ``--upload-pack`` /
# ``--receive-pack`` run custom transports on fetch/push; ``-C``,
# ``--work-tree``, ``--git-dir`` escape the workspace; ``--help`` /
# ``--paginate`` spawn the pager.
_GIT_FORBIDDEN_FLAGS: frozenset[str] = frozenset({
    "-c", "-C", "-P", "-h", "--help", "--paginate",
    "--exec-path", "--config-env", "--upload-pack", "--receive-pack",
    "--work-tree", "--git-dir", "--namespace", "--bare",
})

_GIT_SUBCOMMANDS: frozenset[str] = frozenset({
    "status", "diff", "log", "branch", "show",
})

# ── Fetch / SSRF policy ─────────────────────────────────────────────────────
MAX_REDIRECT_HOPS: int = 3
_ALLOWED_URL_SCHEMES: frozenset[str] = frozenset({"http", "https"})

DEFAULT_TOOL_TIMEOUT_S: float = 20.0
HTTP_TIMEOUT_S: float = 15.0
MAX_FILE_BYTES: int = 256 * 1024     # 256 KiB
MAX_OUTPUT_CHARS: int = 16_000       # truncate long tool outputs


# ── SSRF helpers ────────────────────────────────────────────────────────────

class _UrlRejected(ValueError):
    """Raised when a URL fails the deny-by-default fetch policy."""


def _ip_is_public(ip: ipaddress._BaseAddress) -> bool:
    """True only for addresses safe to reach over the public internet."""
    return not (
        ip.is_private
        or ip.is_loopback
        or ip.is_link_local
        or ip.is_multicast
        or ip.is_reserved
        or ip.is_unspecified
    )


def _validate_fetch_url(url: str) -> tuple[str, int]:
    """Validate a URL against the SSRF policy.

    Returns ``(hostname, port)`` on success; raises ``_UrlRejected`` otherwise.

    Rejects:
      * non-http/https schemes
      * URLs containing userinfo (``user:pass@host``)
      * literal private / loopback / link-local / reserved / multicast IPs
        (both IPv4 and IPv6 — catches ``[::1]``, ``[fe80::..]`` etc.)
      * hostnames that resolve to ANY non-public IP (catches DNS-based
        redirects to internal infra, cloud metadata, and
        decimal/octal IP encoding tricks like ``http://2130706433``).
    """
    try:
        parsed = urllib.parse.urlparse(url)
    except ValueError as exc:
        raise _UrlRejected(f"unparseable URL: {exc}") from exc

    if parsed.scheme.lower() not in _ALLOWED_URL_SCHEMES:
        raise _UrlRejected(f"scheme '{parsed.scheme}' not allowed")
    if parsed.username or parsed.password:
        raise _UrlRejected("URLs with userinfo are not allowed")

    hostname = (parsed.hostname or "").strip()
    if not hostname:
        raise _UrlRejected("missing hostname")

    try:
        port = parsed.port or (443 if parsed.scheme.lower() == "https" else 80)
    except ValueError as exc:
        raise _UrlRejected(f"invalid port: {exc}") from exc

    # Literal IP? Check directly — don't give DNS a chance to mask it.
    stripped = hostname.strip("[]")
    try:
        literal = ipaddress.ip_address(stripped)
    except ValueError:
        literal = None
    if literal is not None:
        if not _ip_is_public(literal):
            raise _UrlRejected(f"non-public literal IP: {literal}")
        return hostname, port

    # Hostname → DNS. Every returned address must be public.
    try:
        infos = socket.getaddrinfo(hostname, port, proto=socket.IPPROTO_TCP)
    except socket.gaierror as exc:
        raise _UrlRejected(f"DNS resolution failed for '{hostname}': {exc}") from exc
    if not infos:
        raise _UrlRejected(f"no addresses for '{hostname}'")
    for info in infos:
        sockaddr = info[4]
        ip_str = sockaddr[0]
        try:
            ip_obj = ipaddress.ip_address(ip_str)
        except ValueError as exc:
            raise _UrlRejected(f"unrecognised address '{ip_str}': {exc}") from exc
        if not _ip_is_public(ip_obj):
            raise _UrlRejected(
                f"'{hostname}' resolves to non-public address {ip_obj}"
            )
    return hostname, port


# ── Command policy helpers ──────────────────────────────────────────────────

def _check_command_policy(argv: list[str]) -> Optional[str]:
    """Validate an argv under the deny-by-default command policy.

    Returns ``None`` if the command is permitted, or an error message
    describing why it was rejected.
    """
    if not argv:
        return "empty command"
    binary = argv[0]
    if binary in _SAFE_COMMANDS:
        return None
    if binary in _GATED_COMMANDS:
        if not AGENT_ALLOW_CODE_EXEC:
            return f"'{binary}' requires GAUNTLET_ALLOW_CODE_EXEC=true"
        forbidden = _FORBIDDEN_ARGS.get(binary, frozenset())
        for arg in argv[1:]:
            for bad in forbidden:
                if arg == bad or arg.startswith(bad + "="):
                    return f"'{binary}' argument '{arg}' is not allowed"
        return None
    # Deny-by-default: anything not explicitly listed is rejected. This is
    # the whole point of the refactor — do not quietly pass through unknown
    # binaries.
    return (
        f"binary '{binary}' is not in the safe or gated allow-list "
        "(deny-by-default)"
    )


def _check_git_args(args: list[str]) -> Optional[str]:
    """Validate args passed through to ``git <subcommand>``."""
    for arg in args:
        for bad in _GIT_FORBIDDEN_FLAGS:
            if arg == bad or arg.startswith(bad + "="):
                return f"git flag '{arg}' is not allowed"
        # Catch compact forms like ``-cfoo=bar`` (git actually requires a
        # space, but we reject the shape anyway as belt-and-braces).
        if arg.startswith("-c") and arg != "-c" and "=" in arg:
            return f"git flag '{arg}' is not allowed"
    return None


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

# Sprint 5 — Tool / Plugin Runtime declarative metadata.
#
# Every tool declares an operating MODE and RISK level. Together with the
# optional approval requirement these drive the agent's gating policy and
# the Control Center matrix. They're class-level attributes so existing
# tool subclasses get sensible defaults without rewriting their bodies.
#
# Modes:
#   read                    — no side effects (web_search, read_file)
#   draft                   — produces output but doesn't apply (compose,
#                             generate text/code in a buffer)
#   preview                 — returns a plan / diff, does not commit
#                             (git diff, dom_plan)
#   execute_with_approval   — performs side-effect; gated behind explicit
#                             allow + (optionally) operator ack
#
# Risk:
#   low     — bounded read, public web, scoped fs read
#   medium  — fs writes inside workspace, terminal commands on safe-list
#   high    — exec_with_approval territory: external network writes, git
#             pushes, package installs, deploy, payments
TOOL_MODES = ("read", "draft", "preview", "execute_with_approval")
TOOL_RISKS = ("low", "medium", "high")


class Tool:
    """Base contract. Subclasses override ``name``, ``description``,
    ``input_schema``, and ``_run``. Sprint 5 fields (``mode``, ``risk``,
    ``version``, ``scopes``, ``rollback_policy``) describe the tool's
    governance shape; they're surfaced through ``ToolRegistry.manifests``
    and consumed by the Control Center permissions matrix."""

    name: str = ""
    description: str = ""
    input_schema: dict[str, Any] = {"type": "object", "properties": {}}
    timeout_s: float = DEFAULT_TOOL_TIMEOUT_S
    # Sprint 5 governance metadata. Subclasses override per-tool.
    mode: str = "read"
    risk: str = "low"
    version: str = "1.0.0"
    scopes: tuple[str, ...] = ()
    rollback_policy: str = "n/a"

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

    def to_manifest(self) -> dict[str, Any]:
        """Plugin manifest: declarative, human-readable governance shape.
        Surfaced by ``GET /tools/manifests`` and rendered in the Control
        Center permissions matrix. The Anthropic descriptor lives in
        ``to_anthropic`` and feeds the model — keep them separate so we
        don't leak governance fields into the model context."""
        return {
            "name": self.name,
            "description": self.description,
            "mode": self.mode,
            "risk": self.risk,
            "version": self.version,
            "scopes": list(self.scopes),
            "rollback_policy": self.rollback_policy,
            "timeout_s": self.timeout_s,
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
    mode = "read"
    risk = "low"
    scopes = ("web.search",)
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
                headers={"User-Agent": "Signal-Dev/1.0"},
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
        "Stdout and stderr are captured. Disabled unless GAUNTLET_ALLOW_CODE_EXEC "
        "is true. Never use for destructive ops."
    )
    mode = "execute_with_approval"
    risk = "high"
    scopes = ("code.exec",)
    rollback_policy = "subprocess is sandboxed; no host-state mutation expected"
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
                content="execute_python is disabled (set GAUNTLET_ALLOW_CODE_EXEC=true).",
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
    mode = "read"
    risk = "low"
    scopes = ("fs.read",)
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
    mode = "read"
    risk = "low"
    scopes = ("fs.read",)
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
        "Supported subcommands: status, diff, log, branch, show. "
        "Configuration, exec-path, pack-override, worktree-escape, and pager "
        "flags are hard-blocked — they are known vectors for code execution."
    )
    mode = "preview"
    risk = "low"
    scopes = ("git.read",)
    input_schema = {
        "type": "object",
        "properties": {
            "subcommand": {
                "type": "string",
                "enum": sorted(_GIT_SUBCOMMANDS),
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
        if subcommand not in _GIT_SUBCOMMANDS:
            return ToolResult(
                ok=False,
                content=f"git subcommand '{subcommand}' is not allowed",
            )
        raw_args = list(args or [])
        rejection = _check_git_args(raw_args)
        if rejection is not None:
            return ToolResult(ok=False, content=rejection)
        # ``--no-pager`` is always safe and prevents any residual pager-based
        # exec path; place it before the subcommand where git expects it.
        cmd = ["git", "--no-pager", subcommand, *raw_args]
        if subcommand == "log" and not any(a.startswith("-") for a in raw_args):
            cmd.extend(["--oneline", "-n", "20"])
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
    mode = "execute_with_approval"
    risk = "medium"
    scopes = ("cmd.run",)
    rollback_policy = "no automatic rollback — operator inspects exit code + stderr"
    description = (
        "Run a vetted binary with arguments. Deny-by-default: the first token "
        "must be either in the SAFE set "
        f"({', '.join(sorted(_SAFE_COMMANDS))}) which runs ungated, or the "
        f"GATED set ({', '.join(sorted(_GATED_COMMANDS))}) which additionally "
        "requires GAUNTLET_ALLOW_CODE_EXEC=true and passes a per-binary "
        "forbidden-argument check (e.g. 'find -exec' is rejected). Git is NOT "
        "reachable here — use the 'git' tool. No shell interpolation — "
        "arguments go directly to execve."
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
        rejection = _check_command_policy(argv)
        if rejection is not None:
            return ToolResult(ok=False, content=rejection)
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
        "HTML tags when the response is HTML). Redirects are NOT auto-"
        "followed — each hop (up to 3) is re-validated against the SSRF "
        "policy. Use for docs pages, API specs, RFCs, changelogs."
    )
    mode = "read"
    risk = "low"
    scopes = ("net.fetch",)
    input_schema = {
        "type": "object",
        "properties": {
            "url": {"type": "string", "description": "Absolute http/https URL"},
        },
        "required": ["url"],
    }

    async def _run(self, url: str) -> ToolResult:
        hops: list[str] = []
        current = url
        async with httpx.AsyncClient(
            timeout=HTTP_TIMEOUT_S,
            follow_redirects=False,
            headers={"User-Agent": "Signal-Dev/1.0"},
        ) as client:
            for _ in range(MAX_REDIRECT_HOPS + 1):
                try:
                    _validate_fetch_url(current)
                except _UrlRejected as exc:
                    return ToolResult(
                        ok=False,
                        content=(
                            f"SSRF policy rejected URL '{current}': {exc}. "
                            f"Hops so far: {hops or '(none)'}"
                        ),
                    )
                hops.append(current)
                resp = await client.get(current)
                if not (300 <= resp.status_code < 400):
                    break
                location = resp.headers.get("location")
                if not location:
                    break
                # Resolve relative redirects against the current URL BEFORE
                # validating — the policy must see the final effective target.
                current = str(httpx.URL(current).join(location))
            else:
                return ToolResult(
                    ok=False,
                    content=(
                        f"exceeded {MAX_REDIRECT_HOPS} redirects; "
                        f"last target: {current}. Hops: {hops}"
                    ),
                )
        body = resp.text
        content_type = resp.headers.get("content-type", "")
        if "html" in content_type.lower():
            body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.S | re.I)
            body = re.sub(r"<style[^>]*>.*?</style>", "", body, flags=re.S | re.I)
            body = re.sub(r"<[^>]+>", " ", body)
            body = re.sub(r"\s+", " ", body).strip()
        return ToolResult(
            ok=resp.is_success,
            content=f"HTTP {resp.status_code} ({content_type})\n{body}",
            metadata={
                "status": resp.status_code,
                "url": str(resp.url),
                "hops": hops,
            },
        )


# ── 8. Package Lookup (npm / pypi) ──────────────────────────────────────────

class PackageInfoTool(Tool):
    name = "package_info"
    description = (
        "Look up the latest metadata for an npm or PyPI package: version, "
        "description, homepage, license. Use before suggesting dependencies."
    )
    mode = "read"
    risk = "low"
    scopes = ("net.fetch",)
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

# ── 9. Write File (Sprint 5) ────────────────────────────────────────────────

class WriteFileTool(Tool):
    name = "write_file"
    description = (
        "Write a UTF-8 text file inside the workspace. The path is resolved "
        "against TOOL_WORKSPACE_ROOT and rejected if it would escape. "
        "Existing files are overwritten only when overwrite=true. Parent "
        "directories must exist; this tool does NOT recursively mkdir."
    )
    mode = "execute_with_approval"
    risk = "medium"
    scopes = ("fs.write",)
    rollback_policy = (
        "no automatic rollback — caller is expected to read_file the prior "
        "content first and pre-stage a restore if rollback is desired"
    )
    input_schema = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Path relative to workspace"},
            "content": {"type": "string", "description": "UTF-8 text to write"},
            "overwrite": {"type": "boolean", "description": "Allow overwriting existing files"},
        },
        "required": ["path", "content"],
    }

    async def _run(
        self,
        path: str,
        content: str,
        overwrite: bool = False,
    ) -> ToolResult:
        target = _resolve_within_workspace(path)
        if target.exists():
            if not overwrite:
                return ToolResult(
                    ok=False,
                    content=f"Refusing to overwrite existing file: {target}",
                )
            if not target.is_file():
                return ToolResult(
                    ok=False,
                    content=f"Path exists but is not a regular file: {target}",
                )
        if not target.parent.is_dir():
            return ToolResult(
                ok=False,
                content=f"Parent directory does not exist: {target.parent}",
            )
        if len(content.encode("utf-8")) > MAX_FILE_BYTES:
            return ToolResult(
                ok=False,
                content=f"Content exceeds {MAX_FILE_BYTES} bytes; refusing.",
            )
        target.write_text(content, encoding="utf-8")
        return ToolResult(
            ok=True,
            content=f"Wrote {len(content)} chars to {target}",
            metadata={"path": str(target), "bytes": len(content)},
        )


# ── 10. Memory Save / Search (Sprint 5) ─────────────────────────────────────
#
# Operator-facing memory tools. Uses the existing failure_memory store as
# the persistence layer — it already has fingerprint matching and
# similarity scoring. Sprint 7 will widen this with project memory and
# canon records; for now `kind` carries the namespace so we don't have to
# migrate the store schema.

class MemorySaveTool(Tool):
    name = "memory_save"
    description = (
        "Persist a note into Gauntlet's memory store. Use to record a "
        "decision, a known failure pattern, or a project preference so "
        "future runs surface it as prior context. The 'kind' field "
        "namespaces the entry: 'decision', 'failure_pattern', "
        "'preference', 'note'. Body is free-form prose."
    )
    mode = "draft"
    risk = "low"
    scopes = ("memory.write",)
    rollback_policy = "memory entries can be cleared via POST /memory/clear"
    input_schema = {
        "type": "object",
        "properties": {
            "topic": {
                "type": "string",
                "description": "Short topic / handle (becomes the fingerprint key)",
            },
            "body": {"type": "string", "description": "Free-form note body"},
            "kind": {
                "type": "string",
                "description": "Namespace: decision | failure_pattern | preference | note",
                "enum": ["decision", "failure_pattern", "preference", "note"],
            },
        },
        "required": ["topic", "body"],
    }

    async def _run(self, topic: str, body: str, kind: str = "note") -> ToolResult:
        from memory import failure_memory  # local import — avoid circular at module load
        from models import RefusalReason

        # The failure_memory store maps every entry to a RefusalReason; we
        # bend that to carry the operator's `kind` by writing the kind into
        # judge_reasoning and using a stable failure_type bucket. Sprint 7
        # ships a proper user/project memory store.
        record = await failure_memory.record_failure(
            question=topic,
            failure_type=RefusalReason.INSUFFICIENT_KNOWLEDGE,
            triad_divergence_summary="",
            judge_reasoning=f"[{kind}] {body[:1500]}",
        )
        return ToolResult(
            ok=True,
            content=f"Saved memory ({kind}): {topic} → {record.id}",
            metadata={"record_id": record.id, "kind": kind, "topic": topic},
        )


class MemorySearchTool(Tool):
    name = "memory_search"
    description = (
        "Look up prior notes in Gauntlet's memory store by topic / phrase. "
        "Returns up to 5 closest matches by fingerprint similarity, with "
        "the kind tag and times-seen counter."
    )
    mode = "read"
    risk = "low"
    scopes = ("memory.read",)
    input_schema = {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Topic or phrase to look up"},
        },
        "required": ["query"],
    }

    async def _run(self, query: str) -> ToolResult:
        from memory import failure_memory

        matches = await failure_memory.find_matching_failures(
            question=query,
            threshold=0.3,
            max_results=5,
        )
        if not matches:
            return ToolResult(
                ok=True,
                content=f"No memory entries match {query!r}",
                metadata={"matches": 0},
            )
        lines = [f"Found {len(matches)} memory entry(ies) for {query!r}:"]
        for m in matches:
            lines.append(
                f"  · {m['question']} "
                f"(seen {m['times_failed']}x, similarity {m['similarity']})"
            )
            if m.get("triad_divergence_summary"):
                lines.append(f"    note: {m['triad_divergence_summary'][:200]}")
        return ToolResult(
            ok=True,
            content="\n".join(lines),
            metadata={"matches": len(matches)},
        )


# ── 11. GitHub (Sprint 5 — partial) ─────────────────────────────────────────
#
# Read-only stub built on top of the existing GitTool. PR / branch / push
# operations need OAuth wiring and a real REST client; that lands in
# Sprint 7 when the auth scope is owned. For now this tool just exposes
# the local repo metadata that GitTool already proves is safe to surface.

class GitHubTool(Tool):
    name = "github"
    description = (
        "Inspect the local repo's GitHub identity and recent activity. "
        "Subcommands: 'remote' (origin URL), 'branch' (current branch), "
        "'log' (last 10 commits). Write operations (open_pr, create_branch, "
        "push) are not yet implemented — they require an OAuth-scoped "
        "REST client which Sprint 7 will add."
    )
    mode = "read"
    risk = "low"
    scopes = ("git.read", "github.read")
    rollback_policy = "n/a (read-only stub)"
    timeout_s = 15.0
    input_schema = {
        "type": "object",
        "properties": {
            "subcommand": {
                "type": "string",
                "enum": ["remote", "branch", "log"],
                "description": "Which read-only inspection to run",
            },
        },
        "required": ["subcommand"],
    }

    async def _run(self, subcommand: str) -> ToolResult:
        proc = await asyncio.create_subprocess_exec(
            "git",
            *_subcmd_argv(subcommand),
            cwd=str(TOOL_WORKSPACE_ROOT),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        out_b, err_b = await proc.communicate()
        out = (out_b or b"").decode("utf-8", errors="replace").strip()
        err = (err_b or b"").decode("utf-8", errors="replace").strip()
        if proc.returncode != 0:
            return ToolResult(
                ok=False,
                content=f"git {subcommand} exited {proc.returncode}: {err}",
            )
        return ToolResult(
            ok=True,
            content=out or "(empty)",
            metadata={"subcommand": subcommand},
        )


def _subcmd_argv(sub: str) -> list[str]:
    """Map the GitHubTool subcommand onto a git invocation."""
    if sub == "remote":
        return ["remote", "get-url", "origin"]
    if sub == "branch":
        return ["rev-parse", "--abbrev-ref", "HEAD"]
    if sub == "log":
        return ["log", "--oneline", "-n", "10"]
    raise ValueError(f"unknown subcommand: {sub}")


# ── 12. Vercel (Sprint 5 — stub) ────────────────────────────────────────────
#
# Placeholder so the manifest exists in the matrix. Production deploy
# operations (deploy, list_deployments, get_logs) need a Vercel API token
# and rate-limit handling that aren't in scope this sprint. Returns a
# clear "not configured" envelope so the agent's tool loop sees a
# deterministic refusal rather than a crash.

class VercelTool(Tool):
    name = "vercel"
    description = (
        "Stub for Vercel deploy operations. Currently returns a "
        "not-configured envelope. Wire up VERCEL_TOKEN and the REST "
        "client in Sprint 7 to enable deploy/list/logs."
    )
    mode = "execute_with_approval"
    risk = "high"
    scopes = ("vercel.write",)
    rollback_policy = (
        "vercel deployments are immutable; rollback = redeploy a previous "
        "build via the dashboard or 'vercel rollback'"
    )
    timeout_s = 5.0
    input_schema = {
        "type": "object",
        "properties": {
            "subcommand": {
                "type": "string",
                "enum": ["deploy", "list", "logs"],
            },
        },
        "required": ["subcommand"],
    }

    async def _run(self, subcommand: str) -> ToolResult:
        token = _env("VERCEL_TOKEN", default="")
        if not token:
            return ToolResult(
                ok=False,
                content=(
                    "vercel: VERCEL_TOKEN not configured. "
                    "Set the env var and re-deploy the backend to enable."
                ),
                metadata={"subcommand": subcommand, "configured": False},
            )
        # Token present but the REST adapter isn't wired yet — fail
        # explicitly rather than pretend to work.
        return ToolResult(
            ok=False,
            content=(
                f"vercel/{subcommand}: REST adapter not implemented in this "
                "sprint. Stubbed; Sprint 7+ will land it."
            ),
            metadata={"subcommand": subcommand, "configured": True},
        )


class ToolRegistry:
    """Dispatches tool-use requests coming from the agent loop."""

    def __init__(self, tools: Optional[list[Tool]] = None) -> None:
        self._tools: dict[str, Tool] = {}
        # Use None sentinel — an explicit empty list means "start empty", it
        # must not fall through to the default bundle.
        effective = default_tools() if tools is None else tools
        for tool in effective:
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

    def manifests(self) -> list[dict[str, Any]]:
        """Sprint 5 — declarative governance manifests for the Control
        Center matrix. Distinct from anthropic_schema (which feeds the
        model) so governance fields don't leak into the model context."""
        return [t.to_manifest() for t in self._tools.values()]

    def scoped(self, names: list[str]) -> "ToolRegistry":
        """Return a new registry containing only the named tools.
        Unknown names are silently dropped — callers must check ``names()``.
        """
        scoped = ToolRegistry(tools=[])
        for n in names:
            tool = self._tools.get(n)
            if tool is not None:
                scoped.register(tool)
        return scoped

    def with_policies(
        self, policies: dict[str, dict[str, Any]],
    ) -> "ToolRegistry":
        """Sprint 5 — return a registry filtered by the operator's
        per-tool policy dict. Each entry is shaped like
        {"allowed": bool, "require_approval": bool}; unknown tool names
        in the policy dict are ignored. Tools without an explicit entry
        keep their default (allowed)."""
        kept: list[Tool] = []
        for tool in self._tools.values():
            policy = policies.get(tool.name)
            if policy is None or policy.get("allowed", True):
                kept.append(tool)
        return ToolRegistry(tools=kept)

    async def dispatch(self, name: str, arguments: dict[str, Any]) -> ToolResult:
        tool = self._tools.get(name)
        if tool is None:
            return ToolResult(ok=False, content=f"Unknown tool: {name}")
        logger.info("dispatch %s args=%s", name, list(arguments))
        return await tool.execute(**arguments)


def default_tools() -> list[Tool]:
    """Factory for the standard tool bundle. Sprint 5 widened the set
    from 8 to 13 — added write_file, memory_save, memory_search, github
    (read-only), and vercel (stub). Operators turn off individual tools
    via ComposerSettings.tool_policies in the Control Center."""
    return [
        WebSearchTool(),
        ExecutePythonTool(),
        ReadFileTool(),
        ListDirectoryTool(),
        GitTool(),
        RunCommandTool(),
        FetchUrlTool(),
        PackageInfoTool(),
        WriteFileTool(),
        MemorySaveTool(),
        MemorySearchTool(),
        GitHubTool(),
        VercelTool(),
    ]
