import { useEffect, useRef, useState } from "react";
import type { Mission, Principle } from "../../spine/types";
import type { LiveState, VerdictState } from "./helpers";
import { useCopy } from "../../i18n/copy";

// Insight Workbench — horizontal pill above the thread.
//
// Sibling of Terminal's WorkbenchStrip and Surface's workbench. Same
// material recipe (.term-workbench-strip class), Insight DNA tone.
// Carries chamber identity (※ INSIGHT · MISSION ▾ · italic status)
// and 5 lenses on the evidence territory:
//
//   · Triad      — 3 parallel analyses state (idle / x/3 / done)
//   · Judge      — verdict (idle / high / low)
//   · Divergence — count of points where the 3 answers disagreed
//   · Memory     — has this question failed before? (clean / failed)
//   · Doctrine   — principles in scope (count)
//
// All five lenses are WIRED — they read live + lastVerdict +
// principles directly from the chamber state. No "not wired" stubs;
// Insight has all its territory locally available in real time.

type Lens = null | "triad" | "judge" | "divergence" | "memory" | "doctrine";

interface Props {
  mission: Mission | null;
  principles: Principle[];
  live: LiveState;
  pending: boolean;
  lastVerdict: VerdictState | null;
  onMissionMenu?: () => void;
}

export default function InsightWorkbench({
  mission, principles, live, pending, lastVerdict, onMissionMenu,
}: Props) {
  const copy = useCopy();
  const [lens, setLens] = useState<Lens>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lens) return;
    function onDoc(e: MouseEvent) {
      const el = stripRef.current;
      if (el && !el.contains(e.target as Node)) setLens(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [lens]);

  const hasMission = !!mission;
  const missionLabel = mission?.title
    ? mission.title.length > 24 ? mission.title.slice(0, 21).trimEnd() + "…" : mission.title
    : null;

  // ── Lens values (all wired, derived from local state) ─────────────
  const triadValue = pending && live.triadTotal > 0
    ? `${live.triadCompleted}/${live.triadTotal}`
    : lastVerdict
      ? "done"
      : copy.insightWbValueIdle;

  const judgeValue = pending
    ? copy.insightWbValueIdle
    : lastVerdict?.confidence === "high"
      ? copy.insightWbJudgeHigh
      : lastVerdict?.confidence === "low"
        ? copy.insightWbJudgeLow
        : copy.insightWbJudgeIdle;

  const divergenceValue = lastVerdict
    ? `${lastVerdict.divergenceCount}`
    : copy.insightWbValueIdle;

  const memoryValue = lastVerdict
    ? lastVerdict.priorFailure ? copy.insightWbMemoryFailed : copy.insightWbMemoryClean
    : copy.insightWbValueIdle;

  const doctrineValue = principles.length > 0
    ? `${principles.length}`
    : copy.insightWbValueIdle;

  // ── Status text (italic narrator) ─────────────────────────────────
  const statusText = pending
    ? copy.insightWbStatusRunning
    : lastVerdict?.refused
      ? copy.insightWbStatusRefused
      : lastVerdict
        ? copy.insightWbStatusVerdict
        : copy.insightWbStatusIdle;

  return (
    <div ref={stripRef} className="term-workbench-strip" data-insight-workbench>
      <span className="term-workbench-icon" aria-hidden>
        <IconInsight />
      </span>
      <span className="term-workbench-label">{copy.insightWbLabel}</span>

      {hasMission ? (
        <>
          <span className="term-workbench-sep" aria-hidden />
          <button
            type="button"
            className="term-workbench-mission"
            onClick={onMissionMenu}
            title={copy.switchMission}
          >
            <span className="term-workbench-mission-label">{copy.wbMissionLabel}</span>
            <span className="term-workbench-mission-value">{missionLabel}</span>
            <span className="term-workbench-mission-caret" aria-hidden>
              <IconCaret />
            </span>
          </button>
        </>
      ) : (
        <>
          <span className="term-workbench-sep" aria-hidden />
          <span className="term-workbench-mission-null">{copy.wbMissionNull}</span>
        </>
      )}

      <span className="term-workbench-sep" aria-hidden />
      <span className="term-workbench-status" title={statusText}>
        {statusText}
      </span>

      <div className="term-workbench-lenses">
        <LensButton
          icon={<IconTriad />}
          label={copy.insightWbTriadLabel}
          value={triadValue}
          active={lens === "triad"}
          wired={true}
          onClick={() => setLens(lens === "triad" ? null : "triad")}
        />
        <LensButton
          icon={<IconJudge />}
          label={copy.insightWbJudgeLabel}
          value={judgeValue}
          active={lens === "judge"}
          wired={!!lastVerdict}
          onClick={() => setLens(lens === "judge" ? null : "judge")}
        />
        <LensButton
          icon={<IconDivergence />}
          label={copy.insightWbDivergenceLabel}
          value={divergenceValue}
          active={lens === "divergence"}
          wired={!!lastVerdict}
          onClick={() => setLens(lens === "divergence" ? null : "divergence")}
        />
        <LensButton
          icon={<IconMemory />}
          label={copy.insightWbMemoryLabel}
          value={memoryValue}
          active={lens === "memory"}
          wired={!!lastVerdict}
          onClick={() => setLens(lens === "memory" ? null : "memory")}
        />
        <LensButton
          icon={<IconDoctrine />}
          label={copy.insightWbDoctrineLabel}
          value={doctrineValue}
          active={lens === "doctrine"}
          wired={principles.length > 0}
          onClick={() => setLens(lens === "doctrine" ? null : "doctrine")}
        />
      </div>

      {lens && (
        <div className="term-workbench-flyout-anchor">
          {lens === "triad"      && <LensFlyout title={copy.insightWbTriadLabel}      body={copy.insightWbTriadBody}      wired={true} />}
          {lens === "judge"      && <LensFlyout title={copy.insightWbJudgeLabel}      body={copy.insightWbJudgeBody}      wired={!!lastVerdict} />}
          {lens === "divergence" && <LensFlyout title={copy.insightWbDivergenceLabel} body={copy.insightWbDivergenceBody} wired={!!lastVerdict} />}
          {lens === "memory"     && <LensFlyout title={copy.insightWbMemoryLabel}     body={copy.insightWbMemoryBody}     wired={!!lastVerdict} />}
          {lens === "doctrine"   && <LensFlyout title={copy.insightWbDoctrineLabel}   body={copy.insightWbDoctrineBody}   wired={principles.length > 0} />}
        </div>
      )}
    </div>
  );
}

// ——— Primitives ———

function LensButton({
  icon, label, value, active, wired, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  wired: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="term-wb-lens"
      data-active={active ? "true" : undefined}
      data-wired={wired ? "true" : "false"}
      onClick={onClick}
      title={label}
    >
      <span className="term-wb-lens-icon" aria-hidden>{icon}</span>
      <span className="term-wb-lens-label">{label}</span>
      <span className="term-wb-lens-value">{value}</span>
    </button>
  );
}

function LensFlyout({
  title, body, wired,
}: {
  title: string;
  body: string;
  wired: boolean;
}) {
  return (
    <div className="term-flyout" data-tone={wired ? undefined : "not-wired"} role="menu">
      <div className="term-flyout-head">
        <span>{title}{wired ? " · live" : " · idle"}</span>
      </div>
      <div className="term-flyout-body">
        <p className="term-flyout-prose">{body}</p>
      </div>
    </div>
  );
}

// ——— Icons ———

const SVG = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconInsight() {
  return (
    <svg {...SVG} strokeWidth={2}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M5.6 5.6l2 2" />
      <path d="M16.4 16.4l2 2" />
      <path d="M16.4 5.6l2-2" />
      <path d="M5.6 16.4l-2 2" />
    </svg>
  );
}
function IconCaret() {
  return (
    <svg {...SVG} width={10} height={10}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function IconTriad() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M12 8.5v6" />
      <path d="m9 14 6 0" />
    </svg>
  );
}
function IconJudge() {
  return (
    <svg {...SVG}>
      <path d="M12 3v18" />
      <path d="M5 7l7-2 7 2" />
      <path d="M5 7l-2 6h6z" />
      <path d="M19 7l2 6h-6z" />
    </svg>
  );
}
function IconDivergence() {
  return (
    <svg {...SVG}>
      <path d="M12 3v6" />
      <path d="M12 9l-6 12" />
      <path d="M12 9l6 12" />
      <circle cx="12" cy="3" r="0.5" fill="currentColor" />
    </svg>
  );
}
function IconMemory() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <path d="M12 12l-3-2" />
    </svg>
  );
}
function IconDoctrine() {
  return (
    <svg {...SVG}>
      <path d="M5 4h11a3 3 0 0 1 3 3v13" />
      <path d="M5 4v13a3 3 0 0 0 3 3h11" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
    </svg>
  );
}
