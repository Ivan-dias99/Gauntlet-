"""
Signal — Terminal chamber (Wave 5).

Code · execution · patches · tool use. Dispatches to the agent loop.
Has access to the full tool registry (filesystem, command, vcs,
network). The gated tools (run_command's GATED binaries, execute_python)
still honor AGENT_ALLOW_CODE_EXEC — chamber allowlist does not
override the global code-exec gate.

Prompt body inherits doctrine.AGENT_SYSTEM_PROMPT verbatim in Wave 5.
Future waves may introduce a Terminal-specific planning preface.
"""

from __future__ import annotations

from doctrine import AGENT_SYSTEM_PROMPT as _DOCTRINE_AGENT

SYSTEM_PROMPT = _DOCTRINE_AGENT
TEMPERATURE = 0.2
ALLOWED_TOOLS: tuple[str, ...] = (
    "read_file",
    "list_directory",
    "run_command",
    "execute_python",
    "git",
    "web_fetch",
    "web_search",
    "package_info",
)
