import { useEffect, useRef, useState } from "react";
import type { SurfaceBriefPayload, SurfacePlanPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface Workbench — lens-only pill above the split.
//
// Reborn from the retired identity-bar version (which duplicated
// mission identity 3-4× per screen). This pass keeps only what was
// honest: the 5 lenses on the visual territory. No glyph, no STUDIO
// label, no mission caret, no italic status — those bits already
// live on the canon ribbon (mission pill) and the chamber head
// (chamber identity).
//
// Why bring it back at all:
//   · The lenses NEED a framed container to read as instruments,
//     not as button decorations next to view tabs.
//   · A thin pill above the split keeps Photo 1's two-column
//     cockpit/canvas dimensions intact while restoring Photo 2's
//     workbench presence.
//
// Lens posture (same as before):
//   · Contract  (wired): idle / draft / valid / sealed
//   · DS        (wired when picked): brief.design_system
//   · Layout    (not wired): backend pending
//   · Components(wired when plan): plan.components.length
//   · States    (not wired): backend pending

type Lens = null | "contract" | "ds" | "layout" | "components" | "states";

interface Props {
  brief: SurfaceBriefPayload;
  plan: SurfacePlanPayload | null;
  promptDraft: string;
  pending: boolean;
}

export default function SurfaceWorkbench({
  brief, plan, promptDraft, pending,
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

  // Contract state derives from brief + plan + pending.
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

  return (
    <div ref={stripRef} className="surface-workbench" data-surface-workbench>
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

      {lens && (
        <div className="surface-workbench-flyout-anchor">
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
  width: 12,
  height: 12,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.85,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

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
