// Wave P-36 — State primitives barrel.
//
// Single import surface for empty / error / loading shapes used across
// chambers. The grammar guide lives at docs/EMPTY_STATES.md.

export { default as EmptyState } from "./EmptyState";
export { default as ErrorState, type ErrorSeverity } from "./ErrorState";
export { default as LoadingState } from "./LoadingState";
export { default as SkeletonPanel } from "./SkeletonPanel";
export { default as BackendUnreachableState } from "./BackendUnreachableState";
