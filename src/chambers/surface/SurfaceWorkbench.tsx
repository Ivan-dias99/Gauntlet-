import { useEffect, useRef, useState } from "react";
import type { SurfaceBriefPayload, SurfacePlanPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface Workbench — full pill (Photo 2 grammar): glyph block,
// STUDIO label, MISSION caret, italic status, 5 lens chips.

type Lens = null | "contract" | "ds" | "layout" | "components" | "states";

interface Props {
  brief: SurfaceBriefPayload;
  plan: SurfacePlanPayload | null;
  promptDraft: string;
  pending: boolean;
  missionTitle: string | null;
  onMissionMenu?: () => void;
}

export default function SurfaceWorkbench({
  brief, plan, promptDraft, pending, missionTitle, onMissionMenu,
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

  const hasMission = !!missionTitle;
  const missionLabel = hasMission && missionTitle
    ? missionTitle.length > 24 ? missionTitle.slice(0, 21).trimEnd() + "…" : missionTitle
    : null;

  const contractState = (() => {
    if (plan) return plan.mock === false ? "sealed" : "valid";
    if (pending) return "draft";
    if (promptDraft.trim().length > 0) return "draft";
    return "idle";
  })();
  const contractValue = (() => {
    switch (contractState) {
      case "sealed": return copy.surfaceWbContractSealed;
      case "valid":  return copy.surfaceWbContractValid;
      case "draft":  return copy.surfaceWbContractDraft;
      default:       return copy.surfaceWbContractIdle;
    }
  })();
  const dsValue = brief.design_system ?? copy.surfaceWbValueIdle;
  const componentsValue = plan ? `${plan.components.length}` : copy.surfaceWbValueIdle;

  const statusText = pending
    ? copy.surfaceStudioStatusPending
    : plan
      ? copy.surfaceStudioStatusReady
      : promptDraft.trim().length > 0
        ? copy.surfaceStudioStatusBriefing
        : copy.surfaceStudioStatusIdle;

  return (
    <div ref={stripRef} className="term-workbench-strip" data-surface-workbench>
      <span className="term-workbench-icon" aria-hidden>
        <IconStudio />
      </span>
      <span className="term-workbench-label">{copy.surfaceStudioLabel}</span>

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
          icon={<IconContract />}
          label={copy.surfaceWbContractLabel}
          value={contractValue}
          active={lens === "contract"}
          wired={true}
          onClick={() => setLens(lens === "contract" ? null : "contract")}
        />
        <LensButton
          icon={<IconDs />}
          label={copy.surfaceWbDsLabel}
          value={dsValue}
          active={lens === "ds"}
          wired={!!brief.design_system}
          onClick={() => setLens(lens === "ds" ? null : "ds")}
        />
        <LensButton
          icon={<IconLayout />}
          label={copy.surfaceWbLayoutLabel}
          value={copy.surfaceWbValueIdle}
          active={lens === "layout"}
          wired={false}
          onClick={() => setLens(lens === "layout" ? null : "layout")}
        />
        <LensButton
          icon={<IconComponents />}
          label={copy.surfaceWbComponentsLabel}
          value={componentsValue}
          active={lens === "components"}
          wired={!!plan}
          onClick={() => setLens(lens === "components" ? null : "components")}
        />
        <LensButton
          icon={<IconStates />}
          label={copy.surfaceWbStatesLabel}
          value={copy.surfaceWbValueIdle}
          active={lens === "states"}
          wired={false}
          onClick={() => setLens(lens === "states" ? null : "states")}
        />
      </div>

      {lens && (
        <div className="term-workbench-flyout-anchor">
          {lens === "contract" && (
            <LensFlyout
              title={copy.surfaceWbContractLabel}
              body={copy.surfaceWbContractBody}
              contract={copy.surfaceWbContractContract}
              wired={true}
            />
          )}
          {lens === "ds" && (
            <LensFlyout
              title={copy.surfaceWbDsLabel}
              body={brief.design_system
                ? `${brief.design_system} · ${copy.surfaceWbDsBody}`
                : copy.surfaceWbDsBody}
              contract={copy.surfaceWbDsContract}
              wired={!!brief.design_system}
            />
          )}
          {lens === "layout" && (
            <LensFlyout
              title={copy.surfaceWbLayoutLabel}
              body={copy.surfaceWbLayoutBody}
              contract={copy.surfaceWbLayoutContract}
              wired={false}
            />
          )}
          {lens === "components" && (
            <LensFlyout
              title={copy.surfaceWbComponentsLabel}
              body={copy.surfaceWbComponentsBody}
              contract={copy.surfaceWbComponentsContract}
              wired={!!plan}
            />
          )}
          {lens === "states" && (
            <LensFlyout
              title={copy.surfaceWbStatesLabel}
              body={copy.surfaceWbStatesBody}
              contract={copy.surfaceWbStatesContract}
              wired={false}
            />
          )}
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
  const handleClick = wired ? onClick : undefined;
  const tooltip = wired ? label : `${label} · backend pending`;
  return (
    <button
      type="button"
      className="term-wb-lens"
      data-active={active ? "true" : undefined}
      data-wired={wired ? "true" : "false"}
      onClick={handleClick}
      disabled={!wired}
      aria-disabled={!wired ? "true" : undefined}
      title={tooltip}
    >
      <span className="term-wb-lens-icon" aria-hidden>{icon}</span>
      <span className="term-wb-lens-label">{label}</span>
      <span className="term-wb-lens-value">{value}</span>
    </button>
  );
}

function LensFlyout({
  title, body, contract, wired,
}: {
  title: string;
  body: string;
  contract: string;
  wired: boolean;
}) {
  return (
    <div className="term-flyout" data-tone={wired ? undefined : "not-wired"} role="menu">
      <div className="term-flyout-head">
        <span>{title}{wired ? " · wired" : " · not wired"}</span>
      </div>
      <div className="term-flyout-body">
        <p className="term-flyout-prose">{body}</p>
        <p className="term-flyout-contract" aria-label="backend contract">
          <span className="term-flyout-contract-label">{wired ? "source" : "contract"}</span>
          <code>{contract}</code>
        </p>
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

function IconStudio() {
  return (
    <svg {...SVG} strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" opacity="0.85" />
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
function IconContract() {
  return (
    <svg {...SVG}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <circle cx="12" cy="15" r="2" />
    </svg>
  );
}
function IconDs() {
  return (
    <svg {...SVG}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}
function IconLayout() {
  return (
    <svg {...SVG}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M3 12h6" />
    </svg>
  );
}
function IconComponents() {
  return (
    <svg {...SVG}>
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <rect x="7" y="7" width="14" height="14" rx="2" />
    </svg>
  );
}
function IconStates() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    </svg>
  );
}
