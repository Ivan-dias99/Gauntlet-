# MERGE DISCIPLINE

This file defines the non-negotiable merge law for Ruberra.

## Core law

GitHub-facing work is not complete when code exists on a branch.
It is complete only when one of these is true:

1. merged into `main`
2. selectively harvested into `main`, then old PR explicitly closed as superseded
3. explicitly closed as obsolete, duplicate, fossil, or invalid

## Invalid end-state

The following state is forbidden:
- open PR floating after substance already converged
- unresolved conflict left for Ivan to handle manually
- draft PR left alive as museum residue
- preview treated as alternate website truth
- branch reported as done while repo state remains dirty

## Lane responsibility

The lane that authored the PR owns merge closure.
That lane must:
- reconcile against current `main`
- resolve conflicts
- merge cleanly, or
- explicitly close / supersede / archive the PR

## Copilot merge hygiene role

Copilot support lane is responsible for GitHub hygiene pressure:
- detect stale PRs
- detect conflict against current `main`
- push merge/harvest/close decision to completion
- prevent PR residue from surviving as false progress

## Brain law

If a PR touches founder intent, security, authority, or high-consequence structure, the relevant Ivan Brain nodes must be consulted before merge.
