# Ready-to-post PR review comments (#251–#254)

Date: 2026-04-30 (UTC)

> I could not post directly on GitHub from this workspace (no remote/auth session available), so below are the exact review comments to paste on each PR.

---

## PR #254 — feat(core): observability snapshot dashboard in System tab
**Suggested decision:** ✅ Approve with 2 nits

**Comment to post:**
Great addition. The System tab already has a diagnostics section (`/diagnostics snapshot`) and this dashboard direction fits the current chamber contract.

Two nits before merge:
1. Please ensure all displayed timestamps are UTC-labelled or explicitly localised (to avoid operator confusion during incidents).
2. Add a tiny contract test to guard dashboard fields against backend drift (missing keys/nulls), since this panel is operationally critical.

---

## PR #253 — feat(surface-final): "report this" issue draft form after select_element
**Suggested decision:** ⚠️ Request changes

**Comment to post (blocking):**
Love the flow, but I need one blocking improvement before approval:

- Add anti-duplication/idempotency handling for repeated submits (double-click / retry / flaky network). Without this, users can generate duplicate issue drafts.

Also recommended (non-blocking):
- Validate minimum structured payload (selected element id, context excerpt, user note) and return typed error envelope on invalid draft input.

---

## PR #252 — feat(core): connector status panel in System tab
**Suggested decision:** ✅ Approve with nits

**Comment to post:**
Solid UX improvement and consistent with the current “honest not-wired vs wired” posture in the app.

Nits:
1. Standardise connector state names (`ok/warn/error/unavailable`) across UI and API to avoid future mapping drift.
2. Add a fallback rendering path for partial payloads so one broken connector doesn’t blank the full panel.

---

## PR #251 — feat(insight): citation trust badges panel
**Suggested decision:** ⚠️ Request changes

**Comment to post (blocking):**
Good feature, but I need evidence of quality gates before merging:

- Please add a small evaluation set (golden samples) and report precision/recall (or at least precision@k) for the badge classification logic.

Why blocking: trust badges can create false confidence if extraction/linking quality regresses silently.

Non-blocking suggestion:
- Expose a “why this badge” tooltip with compact rationale (source count, agreement strength, recency/conflict flags).

---

## Consolidated status
- **Approve:** #254, #252
- **Request changes:** #253, #251
