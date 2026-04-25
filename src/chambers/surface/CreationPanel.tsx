import { useEffect, useRef, useState } from "react";
import type { SurfaceBriefPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface studio panel — cockpit grammar applied to the design
// workstation. Reuses the .term-command pill (workbench-strip family)
// for the outer shell, the id row, the input row and the rail.
//
// Composer scope (after the F4 separation):
//   · Output Mode  (was "Mode" — renamed; values still pinned to
//                   backend SurfaceBriefPayload literal)
//   · Fidelity     (Wireframe / Hi-fi)
//   · Brief Input  (multi-line, dominant)
//   · Visual Refs  (honest "not wired")
//   · Generate     (live; runs the mock pipeline)
//   · Handoff      (honest "not wired" — preview / send to Terminal /
//                   archive lands when the handoff endpoints exist)
//
// Design System moved out — it now lives on the Surface Workbench
// (DS Lens) above. Single source of truth for the active DS pick.
//
// Doctrine: the plan generator is mock until the provider lands. The
// mock declaration is permanent inside the rail.

// Mode / fidelity catalogues are wired to copy.ts at render time so
// labels respect the active locale (PT / EN). The keys themselves are
// stable contract values that travel to the backend.
export const MODE_KEYS: Array<SurfaceBriefPayload["mode"]> = [
  "prototype", "slide_deck", "from_template", "other",
];
export const FIDELITY_KEYS: Array<SurfaceBriefPayload["fidelity"]> = [
  "wireframe", "hi-fi",
];

// Canned DESIGN_SYSTEMS catalogue moved to SurfaceWorkbench when the
// DS pick became part of the DS Lens.

interface Props {
  brief: SurfaceBriefPayload;
  onBriefChange: (patch: Partial<SurfaceBriefPayload>) => void;
  prompt: string;
  onPromptChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  /** When true, mock declaration appears in-rail (always when backend is mock). */
  mockBanner?: boolean;
  missionTitle?: string | null;
  principlesCount?: number;
  hasPlan?: boolean;
}

export default function CreationPanel({
  brief, onBriefChange, prompt, onPromptChange, onSubmit, pending, mockBanner,
  missionTitle, principlesCount = 0, hasPlan = false,
}: Props) {
  const copy = useCopy();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [flyout, setFlyout] = useState<null | "refs" | "handoff">(null);

  // Auto-grow is handled by flex:1 on the input row in [data-chamber=
  // surface] context — the textarea fills the cockpit's remaining
  // vertical space. Manual scrollHeight tracking conflicts with flex,
  // so the JS auto-grow that lived here was retired.

  // Click-outside dismisses any open flyout (Refs / Handoff).
  useEffect(() => {
    if (!flyout) return;
    function onDoc(e: MouseEvent) {
      const el = composerRef.current;
      if (el && !el.contains(e.target as Node)) setFlyout(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [flyout]);

  const canSubmit = prompt.trim().length > 0 && !pending;
  const missionLabel = missionTitle
    ? missionTitle.length > 22 ? missionTitle.slice(0, 19).trimEnd() + "…" : missionTitle
    : null;

  const modeLabels: Record<SurfaceBriefPayload["mode"], string> = {
    prototype:     copy.surfaceModePrototype,
    slide_deck:    copy.surfaceModeSlideDeck,
    from_template: copy.surfaceModeFromTemplate,
    other:         copy.surfaceModeOther,
  };
  const fidelityLabels: Record<SurfaceBriefPayload["fidelity"], string> = {
    wireframe: copy.surfaceFidelityWireframe,
    "hi-fi":   copy.surfaceFidelityHiFi,
  };

  const status = pending
    ? copy.surfaceStudioStatusPending
    : hasPlan
      ? copy.surfaceStudioStatusReady
      : prompt.trim().length > 0
        ? copy.surfaceStudioStatusBriefing
        : copy.surfaceStudioStatusIdle;

  return (
    <div
      ref={composerRef}
      className="term-command"
      data-focused={focused ? "true" : undefined}
      data-state={pending ? "pending" : undefined}
    >
      {/* Identity row — STUDIO posture, sibling of TERMINAL on the
          composer above. Same dots, glyph block, label, mission caret,
          italic status. The chamber-DNA cascade colours the prompt
          glyph and active selections in Surface accent. */}
      <div className="term-command-id">
        <span className="term-command-dots" aria-hidden>
          <span /><span /><span />
        </span>
        <span className="term-command-glyph" aria-hidden>
          <IconStudio />
        </span>
        <span className="term-command-id-label">{copy.surfaceStudioLabel}</span>
        {missionLabel ? (
          <>
            <span className="term-command-id-sep" aria-hidden />
            <span className="term-command-id-mission">
              <span className="term-command-id-mission-label">mission</span>
              <span className="term-command-id-mission-value">{missionLabel}</span>
              <span className="term-command-id-mission-caret" aria-hidden>
                <IconCaret />
              </span>
            </span>
          </>
        ) : (
          <>
            <span className="term-command-id-sep" aria-hidden />
            <span className="term-command-id-mission-null">no mission</span>
          </>
        )}
        <span className="term-command-id-sep" aria-hidden />
        <span className="term-command-id-status" title={status}>{status}</span>
      </div>

      {/* Mock banner — always-on declaration when backend is in mock
          mode. Honest, calm, one-line. */}
      {mockBanner && (
        <span className="surface-mock-banner" data-surface-mock-banner>
          <span className="surface-mock-banner-dot" aria-hidden />
          {copy.surfaceStudioMockBanner}
        </span>
      )}

      {/* Brief-shaping zone — three labelled rows. Each label is mono
          uppercase ghost; each control is a single dense row that
          carries the chamber-DNA accent on the active state. */}
      <div className="surface-controls">
        <div className="surface-controls-row">
          <span className="surface-controls-label">{copy.surfaceComposerOutputModeLabel}</span>
          <div className="surface-segmented" role="tablist" aria-label="mode">
            {MODE_KEYS.map((key) => (
              <button
                key={key}
                role="tab"
                className="surface-segmented-opt"
                data-active={brief.mode === key ? "true" : undefined}
                aria-selected={brief.mode === key}
                onClick={() => onBriefChange({ mode: key })}
              >
                {modeLabels[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-controls-row">
          <span className="surface-controls-label">{copy.surfaceStudioFidelityLabel}</span>
          <div className="surface-segmented" role="tablist" aria-label="fidelity">
            {FIDELITY_KEYS.map((key) => (
              <button
                key={key}
                role="tab"
                className="surface-segmented-opt"
                data-active={brief.fidelity === key ? "true" : undefined}
                aria-selected={brief.fidelity === key}
                onClick={() => onBriefChange({ fidelity: key })}
              >
                {fidelityLabels[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Design System row removed — DS pick now lives inside the
            SurfaceWorkbench's DS Lens above. Single source of truth. */}
      </div>

      {/* Brief input row — dominant zone. ◐ glyph parallels the $
          prompt of the Terminal composer; both inherit chamber-DNA. */}
      <div className="term-command-input-row">
        <span className="term-command-input-prompt" aria-hidden>◐</span>
        <textarea
          ref={textareaRef}
          rows={3}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              if (canSubmit) onSubmit();
            }
          }}
          placeholder={pending ? copy.surfaceStudioGenerating : copy.surfaceStudioBriefPlaceholder}
          className="term-command-input"
          spellCheck={false}
          aria-label={copy.surfaceStudioBriefLabel}
          style={{
            // Vertical sizing handled by flex:1 in tokens.css; only
            // typography lives inline here.
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body)",
            lineHeight: "var(--lh-body)",
          }}
        />
        <div className="surface-composer-actions">
          {/* Visual References Attach — honest "not wired". The flyout
              names the upload endpoint pending. */}
          <button
            type="button"
            className="term-tool"
            data-wired="false"
            data-active={flyout === "refs" ? "true" : undefined}
            onClick={() => setFlyout(flyout === "refs" ? null : "refs")}
            title={copy.surfaceComposerRefsLabel}
            aria-label="visual references"
          >
            <IconRefs />
          </button>
          {/* Generate — live; runs the mock pipeline. */}
          <button
            type="button"
            className="surface-generate"
            onClick={onSubmit}
            disabled={!canSubmit}
            title={pending ? copy.surfaceStudioGenerating : copy.surfaceStudioGenerate}
            aria-label={pending ? copy.surfaceStudioGenerating : copy.surfaceStudioGenerate}
          >
            {pending ? <span style={{ fontSize: 13, lineHeight: 1 }}>…</span> : <IconSend />}
          </button>
          {/* Handoff — honest "not wired" (preview / send to Terminal /
              archive). Lights only when a plan exists, but the action
              itself is gated on backend endpoints. */}
          <button
            type="button"
            className="term-tool"
            data-wired="false"
            data-active={flyout === "handoff" ? "true" : undefined}
            onClick={() => setFlyout(flyout === "handoff" ? null : "handoff")}
            disabled={!hasPlan}
            title={copy.surfaceComposerHandoffLabel}
            aria-label="handoff"
          >
            <IconHandoff />
          </button>
        </div>
      </div>

      {flyout === "refs" && (
        <NotWiredPopover
          title={copy.surfaceComposerRefsLabel}
          body={copy.surfaceComposerRefsBody}
          contract={copy.surfaceComposerRefsContract}
        />
      )}
      {flyout === "handoff" && (
        <NotWiredPopover
          title={copy.surfaceComposerHandoffLabel}
          body={copy.surfaceComposerHandoffBody}
          contract={copy.surfaceComposerHandoffContract}
        />
      )}

      {/* Rail — backend posture · doctrine count · ⌘+Enter hint. The
          generate button moved up to the input row (parallels send
          on Terminal); the rail stays informational. */}
      <div className="term-command-rail">
        {principlesCount > 0 && (
          <span
            className="term-rail-chip"
            title="princípios em vigor que viajam com cada plano"
          >
            <span className="term-rail-glyph" aria-hidden>§</span>
            <span className="term-rail-value">{principlesCount}</span>
          </span>
        )}
        <span className="term-rail-spacer" />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          ⌘/Ctrl + Enter
        </span>
      </div>

      {pending && <div className="thinking-strip" aria-hidden />}
    </div>
  );
}

// ——— Icons ———

const SVG_PROPS = {
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

// Studio glyph — half-circle, mirroring the --ch-surface-glyph "◐" so
// Surface's iconographic identity reads in two places: the prompt
// prefix and the id glyph block.
function IconStudio() {
  return (
    <svg {...SVG_PROPS} strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}
function IconCaret() {
  return (
    <svg {...SVG_PROPS} width={10} height={10}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg
      width={13} height={13} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.25}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}
// Visual refs — paperclip; reads as "attach external material".
function IconRefs() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
// Handoff — arrow exiting a box; reads as "ship the contract out".
function IconHandoff() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

// Honest "not wired" popover — body says exactly what is missing and
// the contract pending. Anchored below the input row.
function NotWiredPopover({
  title, body, contract,
}: {
  title: string;
  body: string;
  contract: string;
}) {
  return (
    <div
      className="term-flyout"
      data-tone="not-wired"
      role="menu"
      style={{ margin: "0 12px 8px" }}
    >
      <div className="term-flyout-head"><span>{title}</span></div>
      <div className="term-flyout-body">
        <p className="term-flyout-prose">{body}</p>
        <p className="term-flyout-contract" aria-label="backend contract">
          <span className="term-flyout-contract-label">contract</span>
          <code>{contract}</code>
        </p>
      </div>
    </div>
  );
}
