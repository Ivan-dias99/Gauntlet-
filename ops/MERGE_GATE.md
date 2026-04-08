# Merge Gate

**Type:** Fixed  
**Applies to:** All PRs targeting `main`  
**Override:** Not permitted without founding operator approval

---

## Required checks (all must pass)

### 1. Scope compliance
- [ ] PR touches only what its title/branch prefix declares
- [ ] No product/runtime changes in a governance PR
- [ ] No governance changes in a product PR

### 2. Document integrity
- [ ] No modifications to `ops/CANONICAL_TRUTH.md` without explicit operator sign-off
- [ ] No modifications to `RUBERRA_FOUNDER_SIGNATURE_LAW.md` without explicit operator sign-off
- [ ] `ops/MILESTONE_TRACKER.md` reflects current state if this PR closes a milestone item

### 3. Structural rules
- [ ] Branch name matches prefix convention (`feat/`, `fix/`, `chore/`, `claude/`)
- [ ] Commit messages are descriptive (not "wip", "update", "fix")
- [ ] No force-push to main

### 4. Handoff
- [ ] If this is the last PR in a session, `ops/HANDOFF.md` has been updated

---

## Prefix conventions

| Prefix | Use |
|--------|-----|
| `feat/` | New user-facing capability |
| `fix/` | Bug fix |
| `chore/` | Non-product change (ops, deps, config) |
| `security/` | Security hardening |
| `claude/` | Agent-generated branch |

---

## Enforcement

This gate is enforced by operator review.  
Automated CI may be added in M2.  
A PR that fails any gate item is held — not rejected — until the item is resolved.
