# Ruberra Core Law Pack

## 1) Single Runtime Truth
- `runtime-fabric.ts` is the only persisted authority for continuity, signals, rewards, connectors, plugins, AI settings, and workspace truth.
- UI surfaces read from runtime state first; seeded data is fallback only.

## 2) Lifecycle Law
- Every run must bind to one continuity item.
- Continuity state transitions are explicit: `in_progress -> paused/resumed/blocked/completed -> transferred/exported/archived`.
- Continuity must keep `linkedObjectId` for profile/archive traceability.

## 3) Chamber Consequence Law
- School, Lab, and Creation outputs must generate consequence objects/signals.
- Completed work must expose transfer and export routes.

## 4) Ledger Law
- Profile is the sovereign ledger surface for active/paused/completed work, memory, rewards, settings, connectors/plugins, and recommendations.
- Profile actions mutate runtime truth (not local view-only state).

## 5) Search Law
- Search uses a canonical index built from objects + continuity + signals.
- Search result routes must resolve to real chamber/profile destinations.

## 6) Anti-Drift Law
- No duplicate runtime authorities.
- No decorative controls without functional side effects.
- No chamber route without continuity or object consequence.
