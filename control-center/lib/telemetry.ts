// Wave 6a — fire-and-forget telemetry helper.
//
// Posts an event to `/telemetry/event` without ever throwing into the
// UI. Run-log writes are best-effort: if the backend is dormant or the
// endpoint rejects, the event is silently dropped. The chamber never
// blocks on instrumentation.
//
// Events fired by frontend (the 4 the backend can't see itself):
//   - truth_distillation_accepted     (Insight panel accept button)
//   - truth_distillation_marked_stale (panel mark-stale button)
//   - surface_seed_consumed            (Surface submit, seed had been pre-populated)
//   - terminal_seed_consumed           (Terminal apply-as-task button)
//   - intent_switch_guard_fired        (when the Guard ships in Wave 6b)
//
// The 5th event (truth_distillation_generated) is fired server-side
// from /insight/distill/stream when a `done` frame lands.

import { gauntletFetch } from "./gauntletApi";

export function fireTelemetry(
  event: string,
  missionId: string | null | undefined,
  payload: Record<string, unknown> = {},
): void {
  void gauntletFetch("/telemetry/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, mission_id: missionId ?? undefined, payload }),
  }).catch(() => {/* swallow — telemetry never fails the chamber */});
}
