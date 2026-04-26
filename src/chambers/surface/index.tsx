import { useRef, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import {
  useSignal,
  type SurfaceBriefPayload,
  type SurfaceEvent,
  type SurfacePlanPayload,
} from "../../hooks/useSignal";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { useCopy } from "../../i18n/copy";
import ChamberHead from "../../shell/ChamberHead";
import DormantPanel from "../../shell/DormantPanel";
import SurfaceLayout from "./SurfaceLayout";
import SurfaceWorkbench from "./SurfaceWorkbench";
import CreationPanel from "./CreationPanel";
import ExplorationRail from "./ExplorationRail";
import {
  validateMissionTitle,
  explainMissionRejection,
  type MissionRejectionReason,
} from "../../spine/validation";

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
  const { activeMission, createMission, addNoteToMission, acceptArtifact, principles } = useSpine();
  const { streamSurface, pending, unreachable } = useSignal();
  const backend = useBackendStatus();
  const copy = useCopy();
  const [planSealed, setPlanSealed] = useState(false);

  const [brief, setBrief] = useState<SurfaceBriefPayload>(DEFAULT_BRIEF);
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<SurfacePlanPayload | null>(null);
  const [planIsMock, setPlanIsMock] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [missionRejection, setMissionRejection] = useState<MissionRejectionReason | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const patchBrief = (p: Partial<SurfaceBriefPayload>) =>
    setBrief((b) => ({ ...b, ...p }));

  async function submit() {
    const v = prompt.trim();
    if (!v || pending) return;
    setErr(null);

    // First-send mission creation — Surface mirrors Insight's implicit-
    // mission pattern. New Surface missions are stored with chamber
    // "surface" so the mission pill shows the right origin.
    let missionId = activeMission?.id;
    if (!missionId) {
      const title = v.length > 64 ? v.slice(0, 61).trimEnd() + "…" : v;
      const verdict = validateMissionTitle(title);
      if (!verdict.ok) {
        setMissionRejection(verdict.reason);
        return;
      }
      setMissionRejection(null);
      missionId = createMission(title, "surface");
    }
    addNoteToMission(missionId, v, "user");

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
          setErr(ev.message);
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
              <CreationPanel
                brief={brief}
                onBriefChange={patchBrief}
                prompt={prompt}
                onPromptChange={setPrompt}
                onSubmit={submit}
                pending={pending}
                mockBanner={mockBannerVisible}
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
              {missionRejection !== null && (
                <div
                  role="alert"
                  data-mission-rejection
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-body-sec)",
                    color: "var(--cc-warn)",
                    padding: "8px 12px",
                    border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
                    borderRadius: "var(--radius-control)",
                  }}
                >
                  missão não ratificada · {explainMissionRejection(missionRejection)}
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
              sealed={planSealed}
              onSeal={
                plan && activeMission
                  ? () => {
                      const screenSummary = plan.screens.map((s) => s.name).join(", ");
                      acceptArtifact(activeMission.id, {
                        taskTitle: `Surface plan — ${plan.mode} / ${plan.fidelity}`,
                        answer: `${plan.screens.length} telas · ${plan.components.length} componentes\n${screenSummary}`,
                        terminatedEarly: planIsMock,
                        acceptedAt: Date.now(),
                        toolCount: plan.components.length,
                        terminationReason: planIsMock ? "surface_mock" : null,
                      });
                      setPlanSealed(true);
                    }
                  : undefined
              }
            />
          }
        />
      </div>
    </div>
  );
}
