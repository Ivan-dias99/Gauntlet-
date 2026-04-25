import { useEffect, useRef, useState } from "react";
import type { SurfaceBriefPayload, SurfacePlanPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface canvas — view router with four top-level tabs:
//   BRIEF · PLAN · FILES · WIREFRAMES
//
// BRIEF and PLAN are wired (read brief + plan from local state).
// FILES and WIREFRAMES are honest "not wired" — empty states declare
// the backend contracts pending. The view router replaces the older
// gallery tab strip (Examples / Templates / Recent / Search / Library)
// with the workstation grammar Claude Design uses, but each surface
// is doctrinally honest: no fake files, no fake sketchbook, no fake
// component browser.
//
// Auto-default behavior:
//   · No plan → BRIEF (contract checklist)
//   · Plan arrives → switch to PLAN once
//   · User-driven nav after that
//
// The 5 lenses (Contract · DS · Layout · Components · States) live
// inline with the view tabs as a chip cluster on the right side.
// They were a separate top Workbench pill bar before; folding them
// into the canvas tab bar restores Photo 1's two-zone vertical
// (ChamberHead + split) without losing the territory state.

type View = "brief" | "plan" | "files" | "wireframes";
type Lens = null | "contract" | "ds" | "layout" | "components" | "states";

const EXAMPLES = [
  { title: "Operational dashboard",     kind: "hi-fi",     tag: "analytics" },
  { title: "Onboarding flow — 3 steps", kind: "prototype", tag: "activation" },
  { title: "Governance settings pane",  kind: "hi-fi",     tag: "core" },
  { title: "Archive search & lineage",  kind: "prototype", tag: "archive" },
];

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  brief: SurfaceBriefPayload;
  promptDraft: string;
  /** Reserved — the lens chips are read-only mirrors today. */
  onBriefChange?: (patch: Partial<SurfaceBriefPayload>) => void;
  /** Reserved — drives Contract lens transitions (draft→pending→ready). */
  pending?: boolean;
}

export default function ExplorationRail({
  plan, mock, brief, promptDraft, pending = false,
}: Props) {
  const copy = useCopy();
  const [view, setView] = useState<View>("brief");
  const [planSeen, setPlanSeen] = useState(false);
  const [lens, setLens] = useState<Lens>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  // Click-outside dismisses any open lens flyout.
  useEffect(() => {
    if (!lens) return;
    function onDoc(e: MouseEvent) {
      const el = shellRef.current;
      if (el && !el.contains(e.target as Node)) setLens(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [lens]);

  // Auto-switch to PLAN view the first time a plan arrives. After
  // that the user owns navigation.
  useEffect(() => {
    if (plan && !planSeen) {
      setView("plan");
      setPlanSeen(true);
    }
    if (!plan && planSeen) {
      setPlanSeen(false);
    }
  }, [plan, planSeen]);

  const tabs: Array<{ key: View; label: string; wired: boolean }> = [
    { key: "brief",      label: copy.surfaceCanvasTabBrief,      wired: true  },
    { key: "plan",       label: copy.surfaceCanvasTabPlan,       wired: !!plan },
    { key: "files",      label: copy.surfaceCanvasTabFiles,      wired: false },
    { key: "wireframes", label: copy.surfaceCanvasTabWireframes, wired: false },
  ];

  // Lens values — derived from brief + plan + pending. Same posture
  // the SurfaceWorkbench used to render before its pill bar was
  // retired. Contract is wired (idle/draft/valid/sealed); DS and
  // Components are wired when their underlying field has a value;
  // Layout and States are honest "not wired" until the design backend
  // exposes /design/layout and /design/states.
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
    <div ref={shellRef} className="surface-rail-shell">
      {/* Canvas tab bar — view tabs on the left, lens chips on the
          right. Single horizontal row; the orphan Workbench pill is
          gone. Two zones vertical (ChamberHead + split) restored. */}
      <div className="surface-canvas-tabs" role="tablist">
        <div className="surface-canvas-tabs-views">
          {tabs.map((t) => {
            const active = t.key === view;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                data-active={active ? "true" : undefined}
                data-wired={t.wired ? "true" : "false"}
                onClick={() => setView(t.key)}
                className="surface-canvas-tab"
                title={t.wired ? t.label : `${t.label} · not wired`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="surface-canvas-tabs-lenses" role="toolbar" aria-label="lenses">
          <CanvasLens
            icon={<IconContract />}
            label={copy.surfaceWbContractLabel}
            value={contractValue}
            active={lens === "contract"}
            wired={true}
            onClick={() => setLens(lens === "contract" ? null : "contract")}
          />
          <CanvasLens
            icon={<IconDs />}
            label={copy.surfaceWbDsLabel}
            value={dsValue}
            active={lens === "ds"}
            wired={!!brief.design_system}
            onClick={() => setLens(lens === "ds" ? null : "ds")}
          />
          <CanvasLens
            icon={<IconLayout />}
            label={copy.surfaceWbLayoutLabel}
            value={copy.surfaceWbValueIdle}
            active={lens === "layout"}
            wired={false}
            onClick={() => setLens(lens === "layout" ? null : "layout")}
          />
          <CanvasLens
            icon={<IconComponents />}
            label={copy.surfaceWbComponentsLabel}
            value={componentsValue}
            active={lens === "components"}
            wired={!!plan}
            onClick={() => setLens(lens === "components" ? null : "components")}
          />
          <CanvasLens
            icon={<IconStates />}
            label={copy.surfaceWbStatesLabel}
            value={copy.surfaceWbValueIdle}
            active={lens === "states"}
            wired={false}
            onClick={() => setLens(lens === "states" ? null : "states")}
          />
        </div>
      </div>

      {lens && (
        <div className="surface-canvas-lens-flyout">
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

      <div className="surface-canvas-view">
        {view === "brief"      && <BriefView brief={brief} promptDraft={promptDraft} copy={copy} />}
        {view === "plan"       && <PlanView plan={plan} mock={mock} copy={copy} />}
        {view === "files"      && <FilesView copy={copy} />}
        {view === "wireframes" && <WireframesView copy={copy} />}
      </div>
    </div>
  );
}

// ——— Views ———

function BriefView({
  brief, promptDraft, copy,
}: {
  brief: SurfaceBriefPayload;
  promptDraft: string;
  copy: ReturnType<typeof useCopy>;
}) {
  const checklist: Array<{ key: string; label: string; done: boolean }> = [
    { key: "intent",   label: copy.surfaceContractFieldIntent,   done: promptDraft.trim().length > 0 },
    { key: "output",   label: copy.surfaceContractFieldOutput,   done: !!brief.mode },
    { key: "fidelity", label: copy.surfaceContractFieldFidelity, done: !!brief.fidelity },
    { key: "ds",       label: copy.surfaceContractFieldDs,       done: !!brief.design_system },
  ];
  const allChecked = checklist.every((row) => row.done);

  return (
    <>
      <div className="surface-rail-hero" data-state={allChecked ? "ready" : "blocked"}>
        <span className="surface-rail-hero-kicker">
          {allChecked ? copy.surfaceRailEmptyKicker : copy.surfaceContractBlockedKicker}
        </span>
        <p className="surface-rail-hero-body">
          {allChecked ? copy.surfaceRailEmptyBody : copy.surfaceContractBlockedBody}
        </p>
        <ul className="surface-contract-checklist" aria-label="contract fields">
          {checklist.map((row) => (
            <li
              key={row.key}
              className="surface-contract-row"
              data-done={row.done ? "true" : undefined}
            >
              <span className="surface-contract-box" aria-hidden>
                {row.done ? "✓" : ""}
              </span>
              <span className="surface-contract-label">{row.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface-rail-shortcut-kicker">
        <span className="surface-rail-shortcut-label">{copy.surfaceExamplesKicker}</span>
        <span className="surface-rail-shortcut-hint">{copy.surfaceExamplesHint}</span>
      </div>
      <div className="surface-rail-body">
        <div className="surface-rail-grid">
          {EXAMPLES.map((it) => (
            <button
              key={it.title}
              className="surface-rail-card"
              type="button"
              aria-label={`${it.title} · ${it.kind}`}
            >
              <div className="surface-rail-card-title">{it.title}</div>
              <div className="surface-rail-card-meta">
                <span className="surface-rail-card-kind" data-kind={it.kind}>{it.kind}</span>
                <span className="surface-rail-card-tag">· {it.tag}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function PlanView({
  plan, mock, copy,
}: {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  copy: ReturnType<typeof useCopy>;
}) {
  if (!plan) {
    return (
      <div className="surface-canvas-empty">
        <span className="surface-canvas-empty-kicker">{copy.surfacePlanEmptyKicker}</span>
        <p className="surface-canvas-empty-body">{copy.surfacePlanEmptyBody}</p>
      </div>
    );
  }
  return (
    <div
      data-surface-plan-preview
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "var(--space-3) var(--space-4)",
        background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 3%, var(--bg-elevated))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--chamber-dna, var(--accent))",
            fontWeight: 500,
          }}
        >
          — Plano gerado
        </span>
        {mock && (
          <span
            data-mock-badge
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--cc-warn)",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: 999,
            }}
          >
            mock
          </span>
        )}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "var(--track-meta)",
          }}
        >
          {plan.mode} · {plan.fidelity} · {plan.design_system_binding ?? "no DS"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        {plan.screens.map((s) => {
          const componentCount = plan.components.filter((c) => c.screen === s.name).length;
          return (
            <div
              key={s.name}
              className="surface-rail-card"
              style={{ cursor: "default" }}
            >
              <div className="surface-rail-card-title">{s.name}</div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-muted)",
                  lineHeight: 1.45,
                }}
              >
                {s.purpose}
              </div>
              <div className="surface-rail-card-meta">
                <span className="surface-rail-card-kind">{componentCount} components</span>
              </div>
            </div>
          );
        })}
      </div>
      {plan.notes.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            lineHeight: 1.5,
          }}
        >
          {plan.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilesView({
  copy,
}: {
  copy: ReturnType<typeof useCopy>;
}) {
  return (
    <div className="surface-canvas-empty">
      <span className="surface-canvas-empty-kicker">{copy.surfaceFilesEmptyKicker}</span>
      <p className="surface-canvas-empty-body">{copy.surfaceFilesEmptyBody}</p>
      {/* Skeleton sections — visible scaffold of the future file
          browser. PAGES / COMPONENTS / UPLOADS each show as a labelled
          empty zone; the user sees the future shape without Signal
          inventing fake entries. */}
      <div className="surface-files-stubs">
        <div className="surface-files-stub" aria-disabled="true">
          <span className="surface-files-stub-label">{copy.surfaceFilesPagesLabel}</span>
          <span className="surface-files-stub-state">—</span>
        </div>
        <div className="surface-files-stub" aria-disabled="true">
          <span className="surface-files-stub-label">{copy.surfaceFilesComponentsLabel}</span>
          <span className="surface-files-stub-state">—</span>
        </div>
        <div className="surface-files-stub" aria-disabled="true">
          <span className="surface-files-stub-label">{copy.surfaceFilesUploadsLabel}</span>
          <span className="surface-files-stub-state">—</span>
        </div>
      </div>
      <p className="surface-canvas-empty-contract" aria-label="backend contract">
        <span className="surface-canvas-empty-contract-label">contract</span>
        <code>{copy.surfaceFilesEmptyContract}</code>
      </p>
    </div>
  );
}

function WireframesView({
  copy,
}: {
  copy: ReturnType<typeof useCopy>;
}) {
  return (
    <div className="surface-canvas-empty">
      <span className="surface-canvas-empty-kicker">{copy.surfaceWireframesEmptyKicker}</span>
      <p className="surface-canvas-empty-body">{copy.surfaceWireframesEmptyBody}</p>
      <p className="surface-canvas-empty-contract" aria-label="backend contract">
        <span className="surface-canvas-empty-contract-label">contract</span>
        <code>{copy.surfaceWireframesEmptyContract}</code>
      </p>
    </div>
  );
}

// ——— Lens chip + flyout (folded in from the retired SurfaceWorkbench) ———

function CanvasLens({
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

// ——— Lens icon set (mirrors the retired SurfaceWorkbench) ———

const LENS_SVG = {
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
    <svg {...LENS_SVG}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <circle cx="12" cy="15" r="2" />
    </svg>
  );
}
function IconDs() {
  return (
    <svg {...LENS_SVG}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}
function IconLayout() {
  return (
    <svg {...LENS_SVG}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M3 12h6" />
    </svg>
  );
}
function IconComponents() {
  return (
    <svg {...LENS_SVG}>
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <rect x="7" y="7" width="14" height="14" rx="2" />
    </svg>
  );
}
function IconStates() {
  return (
    <svg {...LENS_SVG}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    </svg>
  );
}
