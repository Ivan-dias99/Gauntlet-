import { useRef, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import {
  useSignal,
  type SurfaceBriefPayload,
  type SurfaceEvent,
  type SurfacePlanPayload,
} from "../../hooks/useSignal";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import ChamberHead from "../../shell/ChamberHead";
import DormantPanel from "../../shell/DormantPanel";
import SurfaceLayout from "./SurfaceLayout";
import CreationPanel from "./CreationPanel";
import ExplorationRail from "./ExplorationRail";
import { type ContextItem, type ContextKind, defaultItemLabel } from "./ContextIntake";

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
  const { activeMission, createMission, addNoteToMission } = useSpine();
  const { streamSurface, pending, unreachable } = useSignal();
  const backend = useBackendStatus();

  const [brief, setBrief] = useState<SurfaceBriefPayload>(DEFAULT_BRIEF);
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<SurfacePlanPayload | null>(null);
  const [planIsMock, setPlanIsMock] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  // Context intake. Session-only in W3; the connector layer (Wave 5)
  // will project real uploads / repo links / figma files into the same
  // shape without touching this component.
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  // Rail jump — "ver todos" on the DS row pivots the right rail to
  // the Design Systems tab. Implemented as a monotonic nonce so each
  // click re-fires the useEffect on the rail (otherwise setting the
  // same target twice is a no-op). The rail reads target + nonce; user
  // tab picks aren't touched.
  const [railJumpNonce, setRailJumpNonce] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const patchBrief = (p: Partial<SurfaceBriefPayload>) =>
    setBrief((b) => ({ ...b, ...p }));

  const attachContext = (kind: ContextKind) => {
    setContextItems((prev) => [
      ...prev,
      {
        id: `${kind}-${Date.now().toString(36)}-${prev.length}`,
        kind,
        label: defaultItemLabel(kind),
      },
    ]);
  };

  const detachContext = (id: string) => {
    setContextItems((prev) => prev.filter((c) => c.id !== id));
  };

  const openSystems = () => {
    setRailJumpNonce((n) => n + 1);
  };

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
      <SurfaceLayout
        left={
          <>
            <ChamberHead
              kicker="— SURFACE"
              tagline="Workstation de design · modo · fidelidade · design system"
              mock={mockBannerVisible}
            />
            <CreationPanel
              brief={brief}
              onBriefChange={patchBrief}
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={submit}
              pending={pending}
              mockBanner={mockBannerVisible}
              contextItems={contextItems}
              onAttachContext={attachContext}
              onDetachContext={detachContext}
              onOpenSystems={openSystems}
            />
            {unreachable && (
              <DormantPanel detail="Backend de Surface inacessível. Os modos, a fidelidade e o design system ficam guardados localmente; a geração do plano fica suspensa até o backend voltar." />
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
        right={<ExplorationRail plan={plan} mock={planIsMock} jumpNonce={railJumpNonce} jumpTo="systems" />}
      />
    </div>
  );
}
