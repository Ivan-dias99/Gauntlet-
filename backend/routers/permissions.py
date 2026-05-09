"""Operator-driven permissions reset (danger zone)."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class _RevokeConfirmation(BaseModel):
    confirm: bool = False


@router.post("/permissions/revoke_all")
async def revoke_all_permissions(payload: _RevokeConfirmation):
    """Reset the per-domain, per-action and per-tool policy matrices to
    an empty state. The cápsula will start asking again on next use.
    Caps and screenshot defaults are preserved (operator UX, not
    permission grants). Requires `confirm: true`."""
    if not payload.confirm:
        return {"revoked": False, "message": "Confirmation required (confirm=true)"}
    from composer_settings import settings_store
    from models import ActionPolicy, ComposerSettings, DomainPolicy

    current = await settings_store.get()
    cleared = ComposerSettings(
        domains={},
        actions={},
        default_domain_policy=DomainPolicy(),
        default_action_policy=ActionPolicy(),
        tool_policies={},
        max_page_text_chars=current.max_page_text_chars,
        max_dom_skeleton_chars=current.max_dom_skeleton_chars,
        screenshot_default=current.screenshot_default,
        execution_reporting_required=current.execution_reporting_required,
    )
    await settings_store.replace(cleared)
    return {"revoked": True}
