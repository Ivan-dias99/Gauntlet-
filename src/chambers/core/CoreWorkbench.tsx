import { useEffect, useRef, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { useCopy } from "../../i18n/copy";

// Core Workbench — horizontal pill above the sub-tab band.
//
// Sibling family of the Terminal / Surface / Insight workbenches —
// same .term-workbench-strip recipe, Core DNA tone (--ch-core =
// terminal-ok green). Reads system telemetry directly from spine +
// backend status, so all five lenses are wired in real time.
//
// Lenses (governance state at a glance):
//   · Chambers — 5 (the canonical taxonomy, static)
//   · Tools    — 7 (Terminal allowlist; other chambers triad-only)
//   · Doctrine — N principles in vigor (live from spine)
//   · Backend  — mock / live (live from useBackendStatus)
//   · Spine    — synced / syncing / local (live from useSpine)
//
// Status text narrates the wave-5 read-only posture: editing of
// profiles, allowlists and budgets lands in wave 7 (per the
// chambers/core.py SYSTEM_PROMPT). Honest about the contract.

type Lens = null | "chambers" | "tools" | "doctrine" | "backend" | "spine";

const CHAMBERS_COUNT = 5;
const TERMINAL_TOOLS_COUNT = 7;

export default function CoreWorkbench() {
  const copy = useCopy();
  const { principles, syncState } = useSpine();
  const backend = useBackendStatus();
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

  const backendValue = backend.mode === "mock"
    ? copy.coreWbBackendMock
    : copy.coreWbBackendLive;
  const spineValue =
    syncState === "synced"  ? copy.coreWbSpineSynced  :
    syncState === "syncing" ? copy.coreWbSpineSyncing :
    copy.coreWbSpineLocal;

  return (
    <div ref={stripRef} className="term-workbench-strip" data-core-workbench>
      <span className="term-workbench-icon" aria-hidden>
        <IconCore />
      </span>
      <span className="term-workbench-label">{copy.coreWbLabel}</span>

      <span className="term-workbench-sep" aria-hidden />
      <span className="term-workbench-status" title={copy.coreWbStatusReadOnly}>
        {copy.coreWbStatusReadOnly}
      </span>

      <div className="term-workbench-lenses">
        <LensButton
          icon={<IconChambers />}
          label={copy.coreWbChambersLabel}
          value={`${CHAMBERS_COUNT}`}
          active={lens === "chambers"}
          wired={true}
          onClick={() => setLens(lens === "chambers" ? null : "chambers")}
        />
        <LensButton
          icon={<IconTools />}
          label={copy.coreWbToolsLabel}
          value={`${TERMINAL_TOOLS_COUNT}`}
          active={lens === "tools"}
          wired={true}
          onClick={() => setLens(lens === "tools" ? null : "tools")}
        />
        <LensButton
          icon={<IconDoctrine />}
          label={copy.coreWbDoctrineLabel}
          value={principles.length > 0 ? `${principles.length}` : copy.coreWbValueIdle}
          active={lens === "doctrine"}
          wired={principles.length > 0}
          onClick={() => setLens(lens === "doctrine" ? null : "doctrine")}
        />
        <LensButton
          icon={<IconBackend />}
          label={copy.coreWbBackendLabel}
          value={backendValue}
          active={lens === "backend"}
          wired={true}
          tone={backend.mode === "mock" ? "warn" : "ok"}
          onClick={() => setLens(lens === "backend" ? null : "backend")}
        />
        <LensButton
          icon={<IconSpine />}
          label={copy.coreWbSpineLabel}
          value={spineValue}
          active={lens === "spine"}
          wired={true}
          tone={syncState === "synced" ? "ok" : syncState === "syncing" ? "info" : "warn"}
          onClick={() => setLens(lens === "spine" ? null : "spine")}
        />
      </div>

      {lens && (
        <div className="term-workbench-flyout-anchor">
          {lens === "chambers" && <LensFlyout title={copy.coreWbChambersLabel} body={copy.coreWbChambersBody} />}
          {lens === "tools"    && <LensFlyout title={copy.coreWbToolsLabel}    body={copy.coreWbToolsBody} />}
          {lens === "doctrine" && <LensFlyout title={copy.coreWbDoctrineLabel} body={copy.coreWbDoctrineBody} />}
          {lens === "backend"  && <LensFlyout title={copy.coreWbBackendLabel}  body={copy.coreWbBackendBody} />}
          {lens === "spine"    && <LensFlyout title={copy.coreWbSpineLabel}    body={copy.coreWbSpineBody} />}
        </div>
      )}
    </div>
  );
}

// ——— Primitives ———

function LensButton({
  icon, label, value, active, wired, tone, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  wired: boolean;
  tone?: "ok" | "warn" | "info";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="term-wb-lens"
      data-active={active ? "true" : undefined}
      data-wired={wired ? "true" : "false"}
      data-tone={tone}
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
  title, body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="term-flyout" role="menu">
      <div className="term-flyout-head">
        <span>{title} · live</span>
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

// Core glyph — section sign § evoked geometrically as two
// interlocked S-curves. Honors the --ch-core-glyph token.
function IconCore() {
  return (
    <svg {...SVG} strokeWidth={2}>
      <path d="M16 7a4 4 0 0 0-4-2 4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 2 4 4 0 0 1-4-2" />
    </svg>
  );
}
function IconChambers() {
  return (
    <svg {...SVG}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}
function IconTools() {
  return (
    <svg {...SVG}>
      <path d="M14.7 6.3a4 4 0 1 0 5.3 5.3L22 10a8 8 0 0 1-10.5 10.5l-8-8A8 8 0 0 1 14 2l-1.7 1.7a4 4 0 0 0 2.4 2.6" />
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
function IconBackend() {
  return (
    <svg {...SVG}>
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
      <circle cx="7" cy="7" r="0.5" fill="currentColor" />
      <circle cx="7" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}
function IconSpine() {
  return (
    <svg {...SVG}>
      <path d="M12 3v18" />
      <path d="M7 7h10" />
      <path d="M7 12h10" />
      <path d="M7 17h10" />
    </svg>
  );
}
