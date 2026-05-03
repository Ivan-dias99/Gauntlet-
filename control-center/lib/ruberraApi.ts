// Ruberra → Signal compatibility shim.
//
// As of Wave 0 the canonical client lives in ./signalApi. This module
// re-exports the same surface under the legacy names so every existing
// caller (spine/client.ts, hooks/useRuberra.ts, hooks/useBackendStatus.ts,
// chambers/Memory.tsx, spine/SpineContext.tsx) keeps compiling and
// behaving identically during the Wave-0 → Wave-8 compatibility window.
//
// Do NOT add new logic here. New code should import from
// "../lib/signalApi" directly. This file is removed in Wave 8 once all
// call sites have migrated.

export {
  BackendError,
  BackendUnreachableError,
  isBackendError,
  isBackendUnreachable,
  parseBackendError,
  apiUrl,
  UNREACHABLE_VALUE,
  type BackendErrorEnvelope,
} from "./signalApi";

import {
  SIGNAL_API_BASE,
  UNREACHABLE_HEADER as SIGNAL_UNREACHABLE_HEADER,
  signalFetch,
} from "./signalApi";

// Legacy names preserved for existing imports.
export const RUBERRA_API_BASE = SIGNAL_API_BASE;
export const UNREACHABLE_HEADER = SIGNAL_UNREACHABLE_HEADER;
export const ruberraFetch = signalFetch;
