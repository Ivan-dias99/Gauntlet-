import { useEffect, useRef, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import { activeTruthDistillation } from "../../spine/types";
import { fireTelemetry } from "../../lib/telemetry";
import {
  useSignal,
  type SurfaceBriefPayload,
  type SurfaceEvent,
  type SurfacePlanPayload,
} from "../../hooks/useSignal";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { useCopy } from "../../i18n/copy";
import ChamberHead from "../../shell/ChamberHead";
import HandoffInbox from "../../shell/HandoffInbox";
import DormantPanel from "../../shell/DormantPanel";
import SurfaceLayout from "./SurfaceLayout";
import SurfaceWorkbench from "./SurfaceWorkbench";
import CreationPanel from "./CreationPanel";
import ExplorationRail from "./ExplorationRail";

// Surface chamber — design workstation.
//
// Real shell, mock backend. The mock flag is surfaced in the UI on two
// places: the creation panel banner and the plan-preview badge. No
// silent pretend-AI.

const DEFAULT_BRIEF: SurfaceBriefPayload = {
  mode: "prototype",
  fidelity: "hi-fi",
  design_system: null,
};

export default function Surface() {
  const { activeMission, createMission, addNoteToMission, principles } = useSpine();
  const { streamSurface, pending, unreachable } = useSignal();
  const backend = useBackendStatus();
  const copy = useCopy();

  const [brief, setBrief] = useState<SurfaceBriefPayload>(DEFAULT_BRIEF);
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<SurfacePlanPayload | null>(null);
  const [planIsMock, setPlanIsMock] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  // Wave 6a — track which mission we already seeded for, so the
  // pre-populate effect doesn't fight the user every time they edit
  // the prompt or switch back to the chamber. Seeds apply once per
  // mission unless the active distillation version changes.
  const [seededFor, setSeededFor] = useState<{ missionId: string; version: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Wave 6a — Surface seed consumer. Pre-populate brief.question and
  // optional hints from the active TruthDistillation when:
  //   1. There is an active distillation (`approved` preferred, else `draft`)
  //   2. We haven't yet seeded for this (mission, version) tuple
  //   3. The user hasn't typed anything yet (no clobbering live input)
  // Editing the seed afterwards is honest — telemetry will record
  // "edited" vs "kept" when the user submits.
  useEffect(() => {
    if (!activeMission) return;
    const distillation = activeTruthDistillation(activeMission);
    if (!distillation || !distillation.surfaceSeed) return;
    const tuple = { missionId: activeMission.id, version: distillation.version };
    if (
      seededFor &&
      seededFor.missionId === tuple.missionId &&
      seededFor.version === tuple.version
    ) return;
    if (prompt.trim().length > 0) return;
    setPrompt(distillation.surfaceSeed.question);
    if (distillation.surfaceSeed.designSystemSuggestion) {
      setBrief((b) => ({
        ...b,
        design_system: b.design_system ?? distillation.surfaceSeed!.designSystemSuggestion ?? null,
      }));
    }
    if (distillation.surfaceSeed.fidelityHint) {
      setBrief((b) => ({ ...b, fidelity: distillation.surfaceSeed!.fidelityHint! }));
    }
    setSeededFor(tuple);
  }, [activeMission, prompt, seededFor]);

  const patchBrief = (p: Partial<SurfaceBriefPayload>) =>
    setBrief((b) => ({ ...b, ...p }));

  async function submit() {
    const v = prompt.trim();
    if (!v || pending) return;
    // Wave 5: design_system is a hard prerequisite on the real path.
    // CreationPanel disables the CTA but ⌘+Enter from the textarea
    // bypasses that, so we re-check here. Defensive — a reach to the
    // backend that ends in `surface_design_system_required` would be
    // wasted round-trip + a confusing ErrorPanel.
    if (!(brief.design_system ?? "").trim()) {
      setErr(copy.surfaceStudioDsBlockedHint);
      return;
    }
    setErr(null);

    // First-send mission creation — Surface mirrors Insight's implicit-
    // mission pattern. New Surface missions are stored with chamber
    // "surface" so the mission pill shows the right origin.
    let missionId = activeMission?.id;
    if (!missionId) {
      const title = v.length > 64 ? v.slice(0, 61).trimEnd() + "…" : v;
      missionId = createMission(title, "surface");
    }
    addNoteToMission(missionId, v, "user");

    // Wave 6a — surface_seed_consumed telemetry. We seeded if there
    // was an active distillation when the user landed on this chamber.
    // Action: kept (submit text == seed text), edited (different),
    // ignored (no seed but submit happened anyway → no event).
    const distillation = activeTruthDistillation(activeMission);
    if (distillation?.surfaceSeed) {
      const seedQuestion = distillation.surfaceSeed.question.trim();
      const action =
        v === seedQuestion ? "kept" :
        seedQuestion && v.toLowerCase().includes(seedQuestion.slice(0, 30).toLowerCase()) ? "edited" :
        "edited";
      fireTelemetry("surface_seed_consumed", missionId, {
        action,
        distillationVersion: distillation.version,
      });
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    let receivedPlan: SurfacePlanPayload | null = null;
    let mock = true;

    await streamSurface(
      {
        question: v,
        mission_id: missionId,
        chamber: "surface",
        surface: brief,
      },
      (ev: SurfaceEvent) => {
        if (ev.type === "error") {
          // Map typed backend error codes to localized chamber copy.
          // Unknown codes fall through to the raw message so we never
          // silently swallow a new failure mode the shell hasn't
          // learned about yet.
          const tag = ev.error;
          const localized =
            tag === "surface_design_system_required" ? copy.surfaceErrDesignSystemRequired
            : tag === "surface_provider_error"        ? copy.surfaceErrProvider
            : tag === "surface_no_tool_use"           ? copy.surfaceErrNoToolUse
            : tag === "surface_validation_failed"     ? copy.surfaceErrValidation
            : null;
          setErr(localized ?? ev.message);
          return;
        }
        if (ev.type === "surface_plan") {
          receivedPlan = ev.plan;
          setPlan(ev.plan);
          setPlanIsMock(ev.plan.mock !== false);
        }
        if (ev.type === "done") {
          mock = ev.mock !== false;
          const planFromDone = ev.plan ?? receivedPlan;
          if (planFromDone) {
            setPlan(planFromDone);
            setPlanIsMock(mock);
          }
          if (missionId && ev.answer) {
            addNoteToMission(missionId, ev.answer, "ai");
          }
        }
      },
      ac.signal,
    );
  }

  const mockBannerVisible = backend.mode === "mock" || planIsMock;

  return (
    <div className="chamber-shell" data-chamber="surface" style={{ height: "100%" }}>
      <ChamberHead
        kicker="— SURFACE"
        tagline={copy.chambers.surface.sub}
        mock={mockBannerVisible}
      />
      <HandoffInbox chamber="surface" />
      <div className="chamber-body" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
        {/* Two vertical zones: ChamberHead → split. The Workbench pill
            sits at the top of the LEFT column (above the cockpit
            builder), so the right canvas can rise to the top of the
            chamber-body and use the full vertical space — no full-width
            strip stealing height from the output. The workbench keeps
            all chrome / lens chips / mission caret intact; only its
            spatial home moved. */}
        <SurfaceLayout
          left={
            <>
              <SurfaceWorkbench
                brief={brief}
                plan={plan}
                promptDraft={prompt}
                pending={pending}
                missionTitle={activeMission?.title ?? null}
              />
              {/* Wave 5: promote a "real generation" badge when the
                  current plan came back from the provider path
                  (mock=false). The mock case is already declared by
                  the CreationPanel's existing mockBanner. */}
              {plan && !planIsMock && (
                <div
                  data-surface-real-badge
                  style={{
                    margin: "0 var(--space-3) var(--space-2)",
                    padding: "6px 10px",
                    border: "1px solid color-mix(in oklab, var(--cc-ok, #2e9c5e) 32%, transparent)",
                    borderRadius: "var(--radius-control)",
                    background: "color-mix(in oklab, var(--cc-ok, #2e9c5e) 10%, transparent)",
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-meta)",
                    letterSpacing: "var(--track-meta)",
                    color: "var(--cc-ok, #2e9c5e)",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--cc-ok, #2e9c5e)",
                    }}
                  />
                  {copy.surfaceStudioRealBadge}
                </div>
              )}
              <CreationPanel
                brief={brief}
                onBriefChange={patchBrief}
                prompt={prompt}
                onPromptChange={setPrompt}
                onSubmit={submit}
                pending={pending}
                mockBanner={mockBannerVisible}
                requireDesignSystem
                principlesCount={principles.length}
                hasPlan={!!plan}
              />
              {unreachable && (
                <DormantPanel detail={copy.dormantSurface} />
              )}
              {err && !unreachable && (
                <div
                  data-surface-error
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-meta)",
                    color: "var(--cc-err)",
                    padding: "6px 10px",
                    border: "1px solid color-mix(in oklab, var(--cc-err) 36%, transparent)",
                    borderRadius: "var(--radius-control)",
                  }}
                >
                  {err}
                </div>
              )}
            </>
          }
          right={
            <ExplorationRail
              plan={plan}
              mock={planIsMock}
              brief={brief}
              promptDraft={prompt}
              onBriefChange={patchBrief}
              pending={pending}
            />
          }
        />
      </div>
    </div>
  );
}
