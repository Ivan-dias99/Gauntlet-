"""
Signal — Insight chamber (Wave 5).

Reasoning · evidence pressure · direction. Dispatches to the self-
consistency triad + judge. No tool use at this chamber. Wave-1
scaffolding deferred the prompt to the global SYSTEM_PROMPT; Wave 5
makes it chamber-scoped. The prompt body is intentionally identical
to doctrine.SYSTEM_PROMPT in this wave — Insight is the chamber that
inherits the original paranoid core. Future waves may sharpen the
"press assumptions" voice.
"""

from __future__ import annotations

from doctrine import SYSTEM_PROMPT as _DOCTRINE_SYSTEM

SYSTEM_PROMPT = _DOCTRINE_SYSTEM
TEMPERATURE = 0.15  # Matches TRIAD_TEMPERATURE default.
ALLOWED_TOOLS: tuple[str, ...] = ()  # No tool use — triad path only.
