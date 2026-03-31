# Ruberra Bastion Engine

## Purpose
The Bastion Engine is the runtime guardrail layer that prevents chaos, state drift, and fake UI surfaces.

## Engine Pillars
1. **State Integrity**: runtime load/save + migration-safe defaults.
2. **Consequence Emission**: every meaningful lifecycle transition emits signal/reward/transfer consequence.
3. **Resume Safety**: paused/blocked runs are resumable from profile ledger.
4. **Routing Integrity**: all recommendations/search entries carry actionable routes.
5. **Connector/Plugin Reality**: connectors and plugins are persisted runtime entities with status and toggle state.

## Enforcement Rules
- Never mutate chamber consequence outside runtime-fabric helpers.
- Never add profile controls that do not patch runtime state.
- Prefer typed runtime helpers over ad-hoc component state mutations.
