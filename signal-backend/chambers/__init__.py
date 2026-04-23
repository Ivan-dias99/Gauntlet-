"""
Signal — Chamber profile scaffolding (Wave 1).

Introduces the canonical five-chamber taxonomy on the backend side:

    insight · surface · terminal · archive · core

This module exists as scaffolding only in Wave 1. Profiles carry a
routing decision (dispatch) plus empty slots for system_prompt,
allowed_tools, temperature and max_tokens. The engine falls back to the
existing globals whenever a profile field is None/empty, so the triad
and agent pipelines behave byte-for-byte identically when a chamber is
attached to a query.

Wave 5 is where profiles gain real prompts, tool allowlists and output
contracts. Nothing in this file is user-facing today.
"""

from chambers.profiles import (
    ChamberKey,
    ChamberProfile,
    PROFILES,
    get_profile,
)

__all__ = ["ChamberKey", "ChamberProfile", "PROFILES", "get_profile"]
