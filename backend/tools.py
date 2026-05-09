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
import inspect
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
# Env precedence: GAUNTLET_* is canonical (per CLAUDE.md doctrine).
# SIGNAL_* and RUBERRA_* are honored as silent legacy fallbacks so
# existing deploys keep working through the v1.x compat window;
# scheduled for removal in v1.1.0. The _env() helper below reads
# GAUNTLET_FOO first, then SIGNAL_FOO, then RUBERRA_FOO.


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
        """Run the tool with timeout and error containment.

        Filters kwargs by the subclass's _run signature when _run lacks
        **kwargs. Without this, tools with typed args crash with a
        TypeError the moment the dispatcher (or a hallucinating model)
        adds an extra key — most concretely the dispatcher's `approved`
        flag for the require_approval gate. Tools that opt in to the
        flexible shape (GitHubTool, VercelTool with `**kwargs`) bypass
        the filter and see every key the caller passed."""
        try:
            forward = self._filter_run_kwargs(kwargs)
            return await asyncio.wait_for(
                self._run(**forward), timeout=self.timeout_s,
            )
        except asyncio.TimeoutError:
            return ToolResult(
                ok=False,
                content=f"Tool '{self.name}' timed out after {self.timeout_s}s",
            )
        except Exception as exc:  # noqa: BLE001
            logger.exception("Tool %s crashed", self.name)
            return ToolResult(ok=False, content=f"Tool '{self.name}' crashed: {exc}")

    def _filter_run_kwargs(self, kwargs: dict[str, Any]) -> dict[str, Any]:
        """Drop kwargs the subclass's _run can't accept.

        When _run declares **kwargs we forward everything verbatim.
        Otherwise we keep only the names that are explicit parameters
        of _run. Cached per-class because `inspect.signature` walks the
        MRO every call and the registry dispatches a lot."""
        cache = type(self).__dict__.get("_run_signature_cache")
        if cache is None:
            sig = inspect.signature(self._run)
            params = sig.parameters
            has_var_kw = any(
                p.kind == inspect.Parameter.VAR_KEYWORD for p in params.values()
            )
            accepted = (
                None
                if has_var_kw
                else frozenset(
                    name
                    for name, p in params.items()
                    if name != "self" and p.kind != inspect.Parameter.VAR_POSITIONAL
                )
            )
            cache = accepted
            # Cache on the class so subclasses don't all rebuild it.
            setattr(type(self), "_run_signature_cache", cache)
        if cache is None:
            return kwargs
        return {k: v for k, v in kwargs.items() if k in cache}

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
            "code": {
                "type": "string",
                "description": "Python source to execute",
                # Cap parse-time work. The 15 s wall-clock timeout bounds
                # execution; without a length cap, a 1 MB script could
                # spend most of that budget being parsed.
                "maxLength": 50_000,
            },
            "stdin": {
                "type": "string",
                "description": "Optional stdin payload",
                "maxLength": 50_000,
            },
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
                # Bound input size — a 4 KB command line is more than
                # any vetted binary needs.
                "maxLength": 4096,
            },
        },
        "required": ["command"],
    }
    timeout_s = 20.0

    @staticmethod
    def _check_argv_paths(argv: list[str]) -> Optional[str]:
        """shlex.split protects against shell metacharacter injection but
        doesn't validate argument *values*. ``cat ../../etc/passwd`` parses
        to ``["cat", "../../etc/passwd"]``; both tokens are individually
        clean, yet the path argument escapes the workspace. Reject any
        argument that contains a parent-dir traversal segment or a leading
        absolute path. Operators who legitimately need an absolute path
        should use the dedicated file tools (read_file / write_file),
        which go through ``_resolve_within_workspace``."""
        for arg in argv[1:]:
            if not arg:
                continue
            # Leading slash on POSIX or `X:\` on Windows-style paths.
            if arg.startswith("/") or (len(arg) > 2 and arg[1] == ":" and arg[2] in ("\\", "/")):
                return f"Argument escapes workspace (absolute path): {arg!r}"
            # Parent traversal anywhere in the value, including the
            # `./../foo` form that the workspace check on its own
            # would happily resolve outside.
            if ".." in arg.replace("\\", "/").split("/"):
                return f"Argument contains parent traversal: {arg!r}"
        return None

    async def _run(self, command: str) -> ToolResult:
        try:
            argv = shlex.split(command)
        except ValueError as exc:
            return ToolResult(ok=False, content=f"Invalid command: {exc}")
        rejection = _check_command_policy(argv)
        if rejection is not None:
            return ToolResult(ok=False, content=rejection)
        path_rejection = self._check_argv_paths(argv)
        if path_rejection is not None:
            return ToolResult(ok=False, content=path_rejection)
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
        "decision, a known failure pattern, a preference, ratified canon, "
        "or free-form note so future runs surface it as prior context. "
        "Scope=user is global; scope=project requires a project_id and "
        "only surfaces when that project is the active context."
    )
    mode = "draft"
    risk = "low"
    scopes = ("memory.write",)
    rollback_policy = "memory entries can be deleted via DELETE /memory/records/{id}"
    input_schema = {
        "type": "object",
        "properties": {
            "topic": {
                "type": "string",
                "description": "Short topic / handle (becomes the fingerprint key)",
                # Topic is a handle, not a body. Cap so the agent can't
                # smuggle a 10 MB blob through the topic field and bypass
                # the body cap.
                "maxLength": 256,
            },
            "body": {
                "type": "string",
                "description": "Free-form note body",
                # 10 KB covers every legitimate operator memory; anything
                # longer is the agent leaking context, not recording it.
                "maxLength": 10_000,
            },
            "kind": {
                "type": "string",
                "description": "note | decision | failure_pattern | preference | canon",
                "enum": ["note", "decision", "failure_pattern", "preference", "canon"],
            },
            "scope": {
                "type": "string",
                "description": "user (global) | project (scoped to project_id)",
                "enum": ["user", "project"],
            },
            "project_id": {
                "type": "string",
                "description": "Required when scope=project; ignored otherwise",
                "maxLength": 128,
            },
        },
        "required": ["topic", "body"],
    }

    async def _run(
        self,
        topic: str,
        body: str,
        kind: str = "note",
        scope: str = "user",
        project_id: Optional[str] = None,
    ) -> ToolResult:
        # Sprint 7 — backed by the memory_records store. Gives us
        # user/project scoping and the kind tag without bending
        # failure_memory's RefusalReason enum.
        from memory_records import memory_records_store  # local import — avoid cycle

        record = await memory_records_store.record(
            topic=topic,
            body=body,
            kind=kind,
            scope=scope,
            project_id=project_id,
        )
        return ToolResult(
            ok=True,
            content=(
                f"Saved memory ({kind}, scope={scope}"
                + (f", project={project_id}" if project_id else "")
                + f"): {topic} → {record.id}"
            ),
            metadata={
                "record_id": record.id,
                "kind": kind,
                "scope": scope,
                "project_id": project_id,
                "topic": topic,
                "times_seen": record.times_seen,
            },
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
            "project_id": {
                "type": "string",
                "description": "Optional — restrict to project-scoped records of this id",
            },
        },
        "required": ["query"],
    }

    async def _run(
        self,
        query: str,
        project_id: Optional[str] = None,
    ) -> ToolResult:
        from memory_records import memory_records_store  # local — avoid cycle

        matches = await memory_records_store.find_relevant(
            query=query,
            project_id=project_id,
            max_results=5,
        )
        if not matches:
            return ToolResult(
                ok=True,
                content=f"No memory entries match {query!r}",
                metadata={"matches": 0},
            )
        lines = [
            f"Found {len(matches)} memory entry(ies) for {query!r}"
            + (f" (project={project_id})" if project_id else "")
            + ":"
        ]
        for m in matches:
            lines.append(
                f"  · [{m.kind}/{m.scope}] {m.topic}"
                f"  (seen {m.times_seen}x)"
            )
            if m.body:
                lines.append(f"    body: {m.body[:300]}")
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
        "Inspect a GitHub repository — local git for read subcommands "
        "(remote/branch/log) and the GitHub REST API for repo-level "
        "queries. With a Personal Access Token in GITHUB_TOKEN the "
        "subcommands list_prs / get_pr / list_branches_remote / "
        "list_issues / get_issue read against api.github.com. "
        "Write subcommands (comment_pr, create_pr) require GITHUB_TOKEN "
        "AND require_approval=true on this tool's policy: setting "
        "GAUNTLET_AUTO_APPROVE=1 lets the agent run them autonomously, "
        "otherwise the dispatcher refuses with [approval_required]."
    )
    mode = "execute_with_approval"
    risk = "medium"
    scopes = ("git.read", "github.read", "github.write")
    rollback_policy = (
        "writes are not auto-rolled-back; comment_pr leaves an audit "
        "trail in the PR thread; create_pr can be closed manually if "
        "the agent created it in error"
    )
    timeout_s = 20.0
    input_schema = {
        "type": "object",
        "properties": {
            "subcommand": {
                "type": "string",
                "enum": [
                    "remote", "branch", "log",
                    "list_prs", "get_pr", "list_branches_remote",
                    "list_issues", "get_issue",
                    "comment_pr", "create_pr",
                ],
                "description": (
                    "Read: remote/branch/log (local git), "
                    "list_prs/get_pr/list_branches_remote/list_issues/"
                    "get_issue (GitHub API). Write: comment_pr, "
                    "create_pr (require GITHUB_TOKEN + approval)."
                ),
            },
            "owner": {
                "type": "string",
                "description": "GitHub owner/org (required for API subcommands)",
            },
            "repo": {
                "type": "string",
                "description": "Repository name (required for API subcommands)",
            },
            "number": {
                "type": "integer",
                "description": "PR or issue number (get_pr, get_issue, comment_pr)",
            },
            "body": {
                "type": "string",
                "description": "Comment body (comment_pr) or PR description (create_pr)",
            },
            "title": {
                "type": "string",
                "description": "PR title (create_pr)",
            },
            "head": {
                "type": "string",
                "description": "PR head branch — owner:branch or just branch (create_pr)",
            },
            "base": {
                "type": "string",
                "description": "PR base branch (create_pr); defaults to main",
            },
            "approved": {
                "type": "boolean",
                "description": (
                    "Set to true to bypass the require_approval gate. "
                    "Auto-true when GAUNTLET_AUTO_APPROVE=1."
                ),
            },
        },
        "required": ["subcommand"],
    }

    _LOCAL_SUBCOMMANDS = frozenset({"remote", "branch", "log"})
    _READ_API_SUBCOMMANDS = frozenset({
        "list_prs", "get_pr", "list_branches_remote",
        "list_issues", "get_issue",
    })
    _WRITE_API_SUBCOMMANDS = frozenset({"comment_pr", "create_pr"})

    async def _run(self, **kwargs: Any) -> ToolResult:
        subcommand = kwargs.get("subcommand")
        if not isinstance(subcommand, str):
            return ToolResult(ok=False, content="github: subcommand required")

        if subcommand in self._LOCAL_SUBCOMMANDS:
            return await self._run_local(subcommand)
        if subcommand in self._READ_API_SUBCOMMANDS:
            return await self._run_read_api(subcommand, kwargs)
        if subcommand in self._WRITE_API_SUBCOMMANDS:
            return await self._run_write_api(subcommand, kwargs)
        return ToolResult(ok=False, content=f"github: unknown subcommand '{subcommand}'")

    async def _run_local(self, subcommand: str) -> ToolResult:
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
            metadata={"subcommand": subcommand, "channel": "local"},
        )

    async def _run_read_api(self, subcommand: str, kwargs: dict) -> ToolResult:
        token = _env("GITHUB_TOKEN", "GAUNTLET_GITHUB_TOKEN", default="")
        if not token:
            return ToolResult(
                ok=False,
                content=(
                    f"github/{subcommand}: GITHUB_TOKEN not configured. "
                    "Set a Personal Access Token (read-only `repo` scope is "
                    "enough for read subcommands) and re-deploy."
                ),
            )
        owner = kwargs.get("owner")
        repo = kwargs.get("repo")
        if not owner or not repo:
            return ToolResult(
                ok=False,
                content=f"github/{subcommand}: owner + repo required",
            )
        path = self._read_api_path(subcommand, owner, repo, kwargs)
        if path is None:
            return ToolResult(
                ok=False,
                content=f"github/{subcommand}: missing required parameters",
            )
        return await _github_get(token, path, subcommand)

    @staticmethod
    def _read_api_path(
        subcommand: str, owner: str, repo: str, kwargs: dict,
    ) -> Optional[str]:
        if subcommand == "list_prs":
            return f"/repos/{owner}/{repo}/pulls?state=open&per_page=20"
        if subcommand == "get_pr":
            number = kwargs.get("number")
            if not isinstance(number, int):
                return None
            return f"/repos/{owner}/{repo}/pulls/{number}"
        if subcommand == "list_branches_remote":
            return f"/repos/{owner}/{repo}/branches?per_page=50"
        if subcommand == "list_issues":
            return f"/repos/{owner}/{repo}/issues?state=open&per_page=20"
        if subcommand == "get_issue":
            number = kwargs.get("number")
            if not isinstance(number, int):
                return None
            return f"/repos/{owner}/{repo}/issues/{number}"
        return None

    async def _run_write_api(self, subcommand: str, kwargs: dict) -> ToolResult:
        token = _env("GITHUB_TOKEN", "GAUNTLET_GITHUB_TOKEN", default="")
        if not token:
            return ToolResult(
                ok=False,
                content=(
                    f"github/{subcommand}: GITHUB_TOKEN not configured. "
                    "Write subcommands need a PAT with `repo` scope."
                ),
            )
        approved = bool(kwargs.get("approved")) or _auto_approved()
        if not approved:
            return ToolResult(
                ok=False,
                content=(
                    f"[approval_required] github/{subcommand} mutates the "
                    "remote repo. Re-call with approved=true after operator "
                    "confirms, or set GAUNTLET_AUTO_APPROVE=1 to bypass."
                ),
                metadata={"approval_required": True},
            )
        owner = kwargs.get("owner")
        repo = kwargs.get("repo")
        if not owner or not repo:
            return ToolResult(
                ok=False,
                content=f"github/{subcommand}: owner + repo required",
            )
        if subcommand == "comment_pr":
            number = kwargs.get("number")
            body = kwargs.get("body")
            if not isinstance(number, int) or not isinstance(body, str) or not body.strip():
                return ToolResult(
                    ok=False,
                    content="github/comment_pr: number + body required",
                )
            return await _github_post(
                token,
                f"/repos/{owner}/{repo}/issues/{number}/comments",
                {"body": body},
                subcommand,
            )
        if subcommand == "create_pr":
            title = kwargs.get("title")
            body = kwargs.get("body") or ""
            head = kwargs.get("head")
            base = kwargs.get("base") or "main"
            if not title or not head:
                return ToolResult(
                    ok=False,
                    content="github/create_pr: title + head required",
                )
            return await _github_post(
                token,
                f"/repos/{owner}/{repo}/pulls",
                {"title": title, "body": body, "head": head, "base": base},
                subcommand,
            )
        return ToolResult(
            ok=False,
            content=f"github: unsupported write subcommand '{subcommand}'",
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


# ── GitHub REST helpers ────────────────────────────────────────────────────

GITHUB_API_BASE = "https://api.github.com"
GITHUB_API_VERSION = "2022-11-28"


def _github_headers(token: str) -> dict[str, str]:
    return {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "User-Agent": "Gauntlet/1.0",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
    }


async def _github_get(token: str, path: str, subcommand: str) -> ToolResult:
    url = GITHUB_API_BASE + path
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_S) as client:
            resp = await client.get(url, headers=_github_headers(token))
    except httpx.HTTPError as exc:
        return ToolResult(
            ok=False,
            content=f"github/{subcommand}: {type(exc).__name__}: {exc}",
        )
    if resp.status_code >= 400:
        return ToolResult(
            ok=False,
            content=f"github/{subcommand}: HTTP {resp.status_code} — {resp.text[:300]}",
        )
    payload = _safe_json(resp)
    if payload is None:
        return ToolResult(
            ok=False,
            content=(
                f"github/{subcommand}: HTTP {resp.status_code} but body was "
                "not valid JSON; upstream may be misbehaving."
            ),
        )
    return ToolResult(
        ok=True,
        content=_summarize_github_payload(subcommand, payload),
        metadata={"subcommand": subcommand, "channel": "rest", "path": path},
    )


async def _github_post(
    token: str, path: str, body: dict, subcommand: str,
) -> ToolResult:
    url = GITHUB_API_BASE + path
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_S) as client:
            resp = await client.post(
                url, headers=_github_headers(token), json=body,
            )
    except httpx.HTTPError as exc:
        return ToolResult(
            ok=False,
            content=f"github/{subcommand}: {type(exc).__name__}: {exc}",
        )
    if resp.status_code >= 400:
        return ToolResult(
            ok=False,
            content=f"github/{subcommand}: HTTP {resp.status_code} — {resp.text[:300]}",
        )
    payload = _safe_json(resp) if resp.content else {}
    if payload is None:
        return ToolResult(
            ok=False,
            content=(
                f"github/{subcommand}: HTTP {resp.status_code} but body was "
                "not valid JSON; the write may or may not have landed — "
                "verify on github.com."
            ),
        )
    out = _summarize_github_payload(subcommand, payload)
    return ToolResult(
        ok=True,
        content=out,
        metadata={
            "subcommand": subcommand,
            "channel": "rest",
            "path": path,
            "html_url": payload.get("html_url") if isinstance(payload, dict) else None,
        },
    )


def _safe_json(resp: httpx.Response) -> Any:
    """resp.json() but None on parse failure instead of an exception
    that crashes the agent loop. Used by the REST helpers below — a
    misbehaving upstream that returns HTML or a truncated body should
    surface as a clean tool refusal, not a stack trace."""
    try:
        return resp.json()
    except (ValueError, json.JSONDecodeError):
        return None


def _summarize_github_payload(subcommand: str, payload: Any) -> str:
    """Compact text rendering of a GitHub REST payload — full JSON would
    burn agent context. Falls back to truncated JSON for unrecognised
    shapes so the operator still sees something useful."""
    if subcommand in ("list_prs", "list_issues") and isinstance(payload, list):
        if not payload:
            return f"(no items for {subcommand})"
        lines = [f"Found {len(payload)} {subcommand[5:]}:"]
        for item in payload:
            lines.append(
                f"  · #{item.get('number')} {item.get('title', '(no title)')[:80]} "
                f"[{item.get('state', '?')}] by {item.get('user', {}).get('login', '?')}"
            )
        return "\n".join(lines)
    if subcommand == "list_branches_remote" and isinstance(payload, list):
        if not payload:
            return "(no branches)"
        return f"Branches ({len(payload)}):\n" + "\n".join(
            f"  · {b.get('name')}" for b in payload
        )
    if subcommand in ("get_pr", "get_issue") and isinstance(payload, dict):
        return (
            f"#{payload.get('number')} {payload.get('title', '(no title)')}\n"
            f"  state: {payload.get('state')}  by: {payload.get('user', {}).get('login', '?')}\n"
            f"  url: {payload.get('html_url')}\n"
            f"  body: {(payload.get('body') or '')[:600]}"
        )
    if subcommand == "comment_pr" and isinstance(payload, dict):
        return f"Comment posted: {payload.get('html_url')}"
    if subcommand == "create_pr" and isinstance(payload, dict):
        return (
            f"PR #{payload.get('number')} created: {payload.get('html_url')}"
        )
    # Fallback — short JSON
    text = json.dumps(payload, indent=2)
    return text[:1500] + ("…" if len(text) > 1500 else "")


def _auto_approved() -> bool:
    """Sprint 5 close — when GAUNTLET_AUTO_APPROVE is truthy, tools that
    declare require_approval=true treat every call as approved. Useful
    for trusted single-operator deploys; otherwise the agent must pass
    approved=true (which the cápsula's danger gate sets after operator
    confirmation — see Capsule.tsx:executeDomActions and the
    'Confirmo, executar mesmo assim' checkbox)."""
    raw = _env("GAUNTLET_AUTO_APPROVE", default="").strip().lower()
    return raw in ("1", "true", "yes", "on")


# ── 12. Vercel (real REST client) ──────────────────────────────────────────
#
# Reads VERCEL_TOKEN at call time (so rotating the env doesn't require a
# backend restart). Three read subcommands are unconditionally callable
# once the token is set; redeploy is gated by the require_approval
# envelope (no destructive default, GAUNTLET_AUTO_APPROVE=1 bypasses).

class VercelTool(Tool):
    name = "vercel"
    description = (
        "Vercel deploy operations via the REST API. Read subcommands: "
        "list_projects, list_deployments (latest 10), get_deployment "
        "(by id), get_build_logs (by deployment id). Write: redeploy "
        "(creates a new deployment from an existing target). All write "
        "subcommands require approved=true (or GAUNTLET_AUTO_APPROVE=1). "
        "VERCEL_TEAM_ID env scopes API calls to a team when set."
    )
    mode = "execute_with_approval"
    risk = "high"
    scopes = ("vercel.read", "vercel.write")
    rollback_policy = (
        "vercel deployments are immutable; rollback = promote a previous "
        "deployment via 'redeploy' on its target, or via the Vercel "
        "dashboard. Auto-rollback isn't safe — old deployments may have "
        "been deleted."
    )
    timeout_s = 20.0
    input_schema = {
        "type": "object",
        "properties": {
            "subcommand": {
                "type": "string",
                "enum": [
                    "list_projects", "list_deployments",
                    "get_deployment", "get_build_logs",
                    "redeploy",
                ],
            },
            "deployment_id": {
                "type": "string",
                "description": "Deployment id (get_deployment, get_build_logs, redeploy)",
            },
            "project_id": {
                "type": "string",
                "description": "Filter list_deployments by project (optional)",
            },
            "approved": {
                "type": "boolean",
                "description": (
                    "Set to true to bypass require_approval for write "
                    "subcommands. Auto-true when GAUNTLET_AUTO_APPROVE=1."
                ),
            },
        },
        "required": ["subcommand"],
    }

    _READ_SUBCOMMANDS = frozenset({
        "list_projects", "list_deployments",
        "get_deployment", "get_build_logs",
    })
    _WRITE_SUBCOMMANDS = frozenset({"redeploy"})

    async def _run(self, **kwargs: Any) -> ToolResult:
        subcommand = kwargs.get("subcommand")
        if not isinstance(subcommand, str):
            return ToolResult(ok=False, content="vercel: subcommand required")

        token = _env("VERCEL_TOKEN", default="")
        if not token:
            return ToolResult(
                ok=False,
                content=(
                    f"vercel/{subcommand}: VERCEL_TOKEN not configured. "
                    "Create a token at https://vercel.com/account/tokens "
                    "and set VERCEL_TOKEN on the backend."
                ),
                metadata={"subcommand": subcommand, "configured": False},
            )

        team_id = _env("VERCEL_TEAM_ID", default="").strip() or None

        if subcommand in self._WRITE_SUBCOMMANDS:
            approved = bool(kwargs.get("approved")) or _auto_approved()
            if not approved:
                return ToolResult(
                    ok=False,
                    content=(
                        f"[approval_required] vercel/{subcommand} mutates "
                        "production deployments. Re-call with approved=true "
                        "after operator confirms, or set "
                        "GAUNTLET_AUTO_APPROVE=1."
                    ),
                    metadata={"approval_required": True},
                )

        if subcommand == "list_projects":
            return await _vercel_get(token, team_id, "/v9/projects?limit=20", subcommand)
        if subcommand == "list_deployments":
            project_id = kwargs.get("project_id")
            qs = "?limit=10" + (f"&projectId={project_id}" if project_id else "")
            return await _vercel_get(token, team_id, f"/v6/deployments{qs}", subcommand)
        if subcommand == "get_deployment":
            deployment_id = kwargs.get("deployment_id")
            if not deployment_id:
                return ToolResult(ok=False, content="vercel/get_deployment: deployment_id required")
            return await _vercel_get(
                token, team_id, f"/v13/deployments/{deployment_id}", subcommand,
            )
        if subcommand == "get_build_logs":
            deployment_id = kwargs.get("deployment_id")
            if not deployment_id:
                return ToolResult(ok=False, content="vercel/get_build_logs: deployment_id required")
            return await _vercel_get(
                token, team_id, f"/v3/deployments/{deployment_id}/events", subcommand,
            )
        if subcommand == "redeploy":
            deployment_id = kwargs.get("deployment_id")
            if not deployment_id:
                return ToolResult(ok=False, content="vercel/redeploy: deployment_id required")
            return await _vercel_post(
                token, team_id, "/v13/deployments",
                {"deploymentId": deployment_id},
                subcommand,
            )
        return ToolResult(ok=False, content=f"vercel: unknown subcommand '{subcommand}'")


# ── Vercel REST helpers ────────────────────────────────────────────────────

VERCEL_API_BASE = "https://api.vercel.com"


def _vercel_headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "User-Agent": "Gauntlet/1.0",
        "Content-Type": "application/json",
    }


def _vercel_url(path: str, team_id: Optional[str]) -> str:
    if team_id:
        sep = "&" if "?" in path else "?"
        return f"{VERCEL_API_BASE}{path}{sep}teamId={team_id}"
    return VERCEL_API_BASE + path


async def _vercel_get(
    token: str, team_id: Optional[str], path: str, subcommand: str,
) -> ToolResult:
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_S) as client:
            resp = await client.get(
                _vercel_url(path, team_id),
                headers=_vercel_headers(token),
            )
    except httpx.HTTPError as exc:
        return ToolResult(
            ok=False,
            content=f"vercel/{subcommand}: {type(exc).__name__}: {exc}",
        )
    if resp.status_code >= 400:
        return ToolResult(
            ok=False,
            content=f"vercel/{subcommand}: HTTP {resp.status_code} — {resp.text[:300]}",
        )
    payload = _safe_json(resp)
    if payload is None:
        return ToolResult(
            ok=False,
            content=(
                f"vercel/{subcommand}: HTTP {resp.status_code} but body was "
                "not valid JSON; upstream may be misbehaving."
            ),
        )
    return ToolResult(
        ok=True,
        content=_summarize_vercel_payload(subcommand, payload),
        metadata={"subcommand": subcommand, "path": path},
    )


async def _vercel_post(
    token: str, team_id: Optional[str], path: str, body: dict, subcommand: str,
) -> ToolResult:
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_S) as client:
            resp = await client.post(
                _vercel_url(path, team_id),
                headers=_vercel_headers(token),
                json=body,
            )
    except httpx.HTTPError as exc:
        return ToolResult(
            ok=False,
            content=f"vercel/{subcommand}: {type(exc).__name__}: {exc}",
        )
    if resp.status_code >= 400:
        return ToolResult(
            ok=False,
            content=f"vercel/{subcommand}: HTTP {resp.status_code} — {resp.text[:300]}",
        )
    payload = _safe_json(resp)
    if payload is None:
        return ToolResult(
            ok=False,
            content=(
                f"vercel/{subcommand}: HTTP {resp.status_code} but body was "
                "not valid JSON; the write may or may not have landed — "
                "verify on vercel.com."
            ),
        )
    return ToolResult(
        ok=True,
        content=_summarize_vercel_payload(subcommand, payload),
        metadata={"subcommand": subcommand, "path": path},
    )


def _summarize_vercel_payload(subcommand: str, payload: Any) -> str:
    if subcommand == "list_projects" and isinstance(payload, dict):
        items = payload.get("projects") or []
        if not items:
            return "(no projects)"
        return f"{len(items)} project(s):\n" + "\n".join(
            f"  · {p.get('name')} (id={p.get('id')})" for p in items
        )
    if subcommand == "list_deployments" and isinstance(payload, dict):
        items = payload.get("deployments") or []
        if not items:
            return "(no deployments)"
        lines = [f"{len(items)} deployment(s):"]
        for d in items:
            lines.append(
                f"  · {d.get('uid')} state={d.get('state')} "
                f"target={d.get('target') or 'preview'} url={d.get('url') or ''}"
            )
        return "\n".join(lines)
    if subcommand == "get_deployment" and isinstance(payload, dict):
        return (
            f"deployment {payload.get('id') or payload.get('uid')}\n"
            f"  url:    {payload.get('url')}\n"
            f"  state:  {payload.get('readyState') or payload.get('state')}\n"
            f"  target: {payload.get('target') or 'preview'}\n"
            f"  source: {(payload.get('source') or {}).get('type', '?')}"
        )
    if subcommand == "get_build_logs" and isinstance(payload, list):
        if not payload:
            return "(no log events)"
        lines = [f"{len(payload)} log event(s):"]
        for ev in payload[-30:]:
            ts = ev.get("created") or ev.get("date") or ""
            text = ev.get("text") or ev.get("payload") or ""
            if isinstance(text, dict):
                text = json.dumps(text)
            lines.append(f"  [{ts}] {str(text)[:200]}")
        return "\n".join(lines)
    if subcommand == "redeploy" and isinstance(payload, dict):
        return (
            f"redeployed: id={payload.get('id') or payload.get('uid')} "
            f"url={payload.get('url')}"
        )
    text = json.dumps(payload, indent=2)
    return text[:1500] + ("…" if len(text) > 1500 else "")


# ── ComputerUseTool ─────────────────────────────────────────────────────────
#
# Phase 3 MVP (commit 4/N). The agent declares the *intent* to actuate the
# user's mouse / keyboard; the actual side effect happens client-side, gated
# by the cápsula's ComputerUseGate. This shape gives the operator one place
# to disable computer-use for the agent (Control Center → tool_policies →
# computer_use → off) without touching desktop binaries — same governance
# surface as every other tool.
#
# Why no server-side execution: the backend can run on Railway (no display,
# no input devices) or locally (could shell out to xdotool / pyautogui), and
# we want a single contract regardless. The tool returns a marker `ToolResult`
# whose `metadata.client_action` carries the action shape; the cápsula's
# plan-dispatcher (follow-up commit 5/N) intercepts the tool_use frame in the
# SSE stream and routes it through `enqueueComputerUseAction` BEFORE the
# tool ever reaches `_run`. When the cápsula does not intercept (e.g. the
# operator is testing the tool from a non-cápsula client), `_run` returns
# the marker so the agent loop can continue without a hang.
#
# `mode = "execute_with_approval"` and `risk = "high"` because nothing about
# moving a mouse or sending keystrokes on the operator's host is low-risk;
# the gate UI is the approval path (operator inspects + clicks "aprovar").
# `scopes = ("computer.use",)` is informational — Control Center surfaces it.
class ComputerUseTool(Tool):
    name = "computer_use"
    mode = "execute_with_approval"
    risk = "high"
    scopes = ("computer.use",)
    rollback_policy = (
        "no automatic rollback — the operator's host OS owns the resulting "
        "state (cursor position, focused window, typed text). Rollback is "
        "the operator's job (Ctrl+Z, etc)."
    )
    description = (
        "Drive the operator's mouse and keyboard on the desktop shell. "
        "Each call describes ONE primitive action; chain calls for "
        "click-after-move, type-after-focus, etc. Every call is gated "
        "client-side: the cápsula renders a consent modal showing the "
        "described action and only fires the OS event after the operator "
        "approves. Available actions:\n"
        "  - move(x, y)          — absolute screen coordinate\n"
        "  - click(button)       — left | right | middle (current cursor)\n"
        "  - type(text)          — type plain text (≤ 10 000 chars)\n"
        "  - press(key)          — single named key (Enter, Tab, Escape, "
        "arrows, …) or single Unicode character\n"
        "Browser shells return an error envelope; this tool only operates "
        "on the desktop. macOS prompts for Accessibility permission on "
        "first call; Wayland sessions return 'not supported'."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "action": {
                "type": "string",
                "enum": ["move", "click", "type", "press"],
                "description": "Which primitive to invoke",
            },
            "x": {
                "type": "integer",
                "description": "Absolute screen X (action=move only)",
            },
            "y": {
                "type": "integer",
                "description": "Absolute screen Y (action=move only)",
            },
            "button": {
                "type": "string",
                "enum": ["left", "right", "middle"],
                "description": "Mouse button (action=click only)",
            },
            "text": {
                "type": "string",
                "description": "Text payload (action=type only, ≤ 10 000 chars)",
            },
            "key": {
                "type": "string",
                "description": "Key name or single char (action=press only)",
            },
            "reason": {
                "type": "string",
                "description": (
                    "One-line human justification surfaced verbatim on the "
                    "consent gate ('clicking the Send button')."
                ),
            },
        },
        "required": ["action"],
    }
    timeout_s = 5.0

    async def _run(self, **kwargs: Any) -> ToolResult:
        action = (kwargs.get("action") or "").strip()
        if action not in {"move", "click", "type", "press"}:
            return ToolResult(
                ok=False,
                content=f"computer_use: unknown action '{action}'",
            )

        # Build the client-action envelope. Each shape mirrors the JS
        # `ComputerUseAction` discriminated union 1:1 so the cápsula
        # dispatcher (commit 5/N) can hand it to `enqueueComputerUseAction`
        # without remapping.
        envelope: dict[str, Any] = {"kind": action}
        if action == "move":
            x = kwargs.get("x")
            y = kwargs.get("y")
            if not isinstance(x, int) or not isinstance(y, int):
                return ToolResult(
                    ok=False,
                    content="computer_use(move): integer 'x' and 'y' are required",
                )
            envelope["x"] = x
            envelope["y"] = y
        elif action == "click":
            button = kwargs.get("button") or "left"
            if button not in {"left", "right", "middle"}:
                return ToolResult(
                    ok=False,
                    content=f"computer_use(click): bad button '{button}'",
                )
            envelope["button"] = button
        elif action == "type":
            text = kwargs.get("text")
            if not isinstance(text, str) or not text:
                return ToolResult(
                    ok=False,
                    content="computer_use(type): non-empty 'text' string is required",
                )
            if len(text) > 10_000:
                return ToolResult(
                    ok=False,
                    content=(
                        f"computer_use(type): text too long ({len(text)} > 10000)"
                    ),
                )
            envelope["text"] = text
        elif action == "press":
            key = kwargs.get("key")
            if not isinstance(key, str) or not key:
                return ToolResult(
                    ok=False,
                    content="computer_use(press): non-empty 'key' string is required",
                )
            envelope["key"] = key

        reason = kwargs.get("reason")
        if isinstance(reason, str) and reason:
            envelope["reason"] = reason

        # Marker result — when the cápsula intercepts (commit 5/N) it
        # never sees this body because the tool_use frame is handled
        # before reaching _run. When the agent runs against a non-cápsula
        # client (CLI test, future MCP host), the body is informational
        # so the agent loop can continue.
        return ToolResult(
            ok=True,
            content=(
                f"queued computer-use {action}; awaiting operator approval "
                "via the cápsula consent gate"
            ),
            metadata={"client_action": envelope},
        )


class ToolRegistry:
    """Dispatches tool-use requests coming from the agent loop."""

    def __init__(self, tools: Optional[list[Tool]] = None) -> None:
        self._tools: dict[str, Tool] = {}
        # Set of tool names whose dispatch is gated by an explicit
        # approved=true (or GAUNTLET_AUTO_APPROVE env). Initialised
        # per-instance so a class-level mutable default can't leak
        # across registries — bug 2 from the post-Sprint-8 audit.
        self._approval_required: set[str] = set()
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
        keep their default (allowed). The require_approval flag is
        carried into the new registry's _approval_required set so
        dispatch can surface a [approval_required] envelope without
        running the tool — see dispatch() below."""
        kept: list[Tool] = []
        approval_required: set[str] = set()
        for tool in self._tools.values():
            policy = policies.get(tool.name)
            if policy is not None and not policy.get("allowed", True):
                continue
            kept.append(tool)
            if policy is not None and policy.get("require_approval", False):
                approval_required.add(tool.name)
        out = ToolRegistry(tools=kept)
        out._approval_required = approval_required
        return out

    async def dispatch(self, name: str, arguments: dict[str, Any]) -> ToolResult:
        tool = self._tools.get(name)
        if tool is None:
            return ToolResult(ok=False, content=f"Unknown tool: {name}")
        # Sprint 5 close — when this tool is in the policy's
        # require_approval set, gate the call. The agent sees a
        # deterministic refusal that names the requirement; the model
        # can then decide to ask the operator. GAUNTLET_AUTO_APPROVE
        # is the trusted-deploy bypass.
        if name in self._approval_required:
            approved = bool(arguments.get("approved")) or _auto_approved()
            if not approved:
                logger.info("dispatch %s blocked by require_approval policy", name)
                return ToolResult(
                    ok=False,
                    content=(
                        f"[approval_required] tool '{name}' requires "
                        "explicit operator approval. Re-call with "
                        "approved=true after confirmation, or set "
                        "GAUNTLET_AUTO_APPROVE=1 on a trusted deploy."
                    ),
                    metadata={"approval_required": True, "tool": name},
                )
        logger.info("dispatch %s args=%s", name, list(arguments))
        return await tool.execute(**arguments)


def default_tools() -> list[Tool]:
    """Factory for the standard tool bundle. Sprint 5 widened the set
    from 8 to 13 — added write_file, memory_save, memory_search, github
    (read-only), and vercel (stub). Operators turn off individual tools
    via ComposerSettings.tool_policies in the Control Center."""
    # NOTE: ComputerUseTool is intentionally NOT registered here. The
    # tool's `_run` returns a `client_action` envelope that requires
    # cápsula-side dispatch (the `useComputerUseGate` consent gate);
    # no agent flow currently consumes that metadata, so registering
    # it would tell the agent the action queued/succeeded when in
    # fact NOTHING happens (operator never sees a gate, no OS event
    # fires). Codex P1 review on PR #338 surfaced this — re-enable
    # the registration here when an agent flow gains a real client-
    # side dispatcher. The cápsula's plan-action wire (DomAction
    # type='computer_use' in models.py) is the path actually wired
    # today; that path does NOT touch this tool registry.
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
