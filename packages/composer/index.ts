// Gauntlet Composer — public surface.
//
// One Composer. Two ambients (web extension + desktop Tauri). Anything
// imported from outside this package goes through here.

export { Capsule, CAPSULE_CSS } from "./Capsule";
export type { CapsuleProps } from "./Capsule";

export { Pill, PILL_CSS } from "./Pill";
export type { PillPosition, PillProps } from "./Pill";

export {
  ComposerClient,
  ComposerError,
  composeOnce,
  DEFAULT_COMPOSER_SETTINGS,
} from "./ComposerClient";
export type {
  ApplyResult,
  ComposeResult,
  ComposerArtifact,
  ComposerClientOptions,
  ComposerSettings,
  ContextCaptureRequest,
  ContextCaptureResponse,
  ContextSource,
  DomPlanResult,
  DomainPolicy,
  ActionPolicy,
  ExecutedActionRecord,
  ExecutionReportRequest,
  ExecutionReportResponse,
  ExecutionStatus,
  IntentResult,
  PreviewResult,
} from "./ComposerClient";

export type {
  Ambient,
  AmbientCapabilities,
  AmbientStorage,
  AmbientTransport,
  ContextSnapshot,
  Runtime,
  SseCallbacks,
} from "./ambient";

export type { SelectionRect } from "./selection-types";

export type {
  DomAction,
  DomActionResult,
  DangerAssessment,
} from "./dom-actions";
export { assessDanger, assessSequenceDanger, executeDomActions } from "./dom-actions";

export { Markdown } from "./markdown";

export { isVoiceSupported, startVoice } from "./voice";
export type { VoiceCallbacks, VoiceSession } from "./voice";
