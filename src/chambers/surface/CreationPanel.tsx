import { useEffect, useRef, useState } from "react";
import type { SurfaceBriefPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface studio panel — Archive-style structural hierarchy.
//
// The cockpit pill grammar (.term-command + traffic-lights + glyph id
// row) was retired here: the Workbench above already declares the
// chamber's identity, and the cockpit is a form, not a command bar.
// Form structure mirrors the Archive's RunList container — clean
// bordered panel, sections separated by hairlines, label above
// control, generous internal padding.
//
// Workflow order (intent before configuration):
//   1. Brief         — what to build
//   2. Output        — shape (prototype / deck / template / other)
//   3. Fidelity      — wireframe / hi-fi
//   4. Design system — pick or none
//   5. CTA           — "Formar contrato visual" (full-width, labelled)
//
// Visual references attach is anchored to the brief section. Handoff
// sits beside the CTA. Mock banner declares posture at the very top.
// Doctrine preserved: the plan generator is mock until the provider
// lands; mock declaration is permanent.

export const MODE_KEYS: Array<SurfaceBriefPayload["mode"]> = [
  "prototype", "slide_deck", "from_template", "other",
];
export const FIDELITY_KEYS: Array<SurfaceBriefPayload["fidelity"]> = [
  "wireframe", "hi-fi",
];

// Canned design systems — picker lives here. Real catalogue lands
// when Core/Routing exposes /design-systems.
const DESIGN_SYSTEMS = [
  "Signal Canon",
  "Claude Design",
  "Material You",
  "Tailwind UI",
  "Shadcn UI",
  "Radix Primitives",
] as const;

interface Props {
  brief: SurfaceBriefPayload;
  onBriefChange: (patch: Partial<SurfaceBriefPayload>) => void;
  prompt: string;
  onPromptChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  /** When true, mock declaration appears at the top of the panel. */
  mockBanner?: boolean;
  /**
   * When true, design_system becomes a hard prerequisite for submit.
   * Wave 5 backend refuses (frame `error` / `surface_design_system_required`)
   * when the brief lacks one and the real provider path is active. The
   * panel mirrors that requirement here so the user is gated by UI
   * instead of seeing a backend error envelope. Defaults to true so a
   * deploy with a real key never falls through to a refusal envelope.
   */
  requireDesignSystem?: boolean;
  principlesCount?: number;
  hasPlan?: boolean;
}

export default function CreationPanel({
  brief, onBriefChange, prompt, onPromptChange, onSubmit, pending, mockBanner,
  requireDesignSystem = true,
  principlesCount = 0, hasPlan = false,
}: Props) {
  const copy = useCopy();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [flyout, setFlyout] = useState<null | "refs" | "handoff">(null);

  // Click-outside dismisses any open flyout.
  useEffect(() => {
    if (!flyout) return;
    function onDoc(e: MouseEvent) {
      const el = panelRef.current;
      if (el && !el.contains(e.target as Node)) setFlyout(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [flyout]);

  const dsMissing = requireDesignSystem && !(brief.design_system ?? "").trim();
  const canSubmit = prompt.trim().length > 0 && !pending && !dsMissing;

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

  return (
    <div ref={panelRef} className="surface-cockpit" data-state={pending ? "pending" : undefined}>
      {/* Mock banner — top declaration when backend is in mock mode. */}
      {mockBanner && (
        <div className="surface-cockpit-banner" data-surface-mock-banner>
          <span className="surface-mock-banner-dot" aria-hidden />
          <span>{copy.surfaceStudioMockBanner}</span>
        </div>
      )}

      {/* Section 1 — Brief. Label above textarea, refs paperclip
          anchored to the textarea's right edge. */}
      <section className="surface-cockpit-section">
        <span className="surface-cockpit-label">{copy.surfaceStudioBriefLabel}</span>
        <div className="surface-cockpit-brief">
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (canSubmit) onSubmit();
              }
            }}
            placeholder={pending ? copy.surfaceStudioGenerating : copy.surfaceStudioBriefPlaceholder}
            className="surface-cockpit-brief-input"
            spellCheck={false}
            aria-label={copy.surfaceStudioBriefLabel}
          />
          <button
            type="button"
            className="term-tool surface-cockpit-refs"
            data-wired="false"
            data-active={flyout === "refs" ? "true" : undefined}
            onClick={() => setFlyout(flyout === "refs" ? null : "refs")}
            title={copy.surfaceComposerRefsLabel}
            aria-label="visual references"
          >
            <IconRefs />
          </button>
        </div>
        {flyout === "refs" && (
          <NotWiredPopover
            title={copy.surfaceComposerRefsLabel}
            body={copy.surfaceComposerRefsBody}
            contract={copy.surfaceComposerRefsContract}
          />
        )}
      </section>

      {/* Section 2 — Output mode. */}
      <section className="surface-cockpit-section">
        <span className="surface-cockpit-label">{copy.surfaceComposerOutputModeLabel}</span>
        <div className="surface-segmented" role="tablist" aria-label="output mode">
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
      </section>

      {/* Section 3 — Fidelity. */}
      <section className="surface-cockpit-section">
        <span className="surface-cockpit-label">{copy.surfaceStudioFidelityLabel}</span>
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
      </section>

      {/* Section 4 — Design system. Required marker appears next to the
          label when Wave-5 real-path gating is on; the chip itself
          inherits the surface error tone via data-required-missing
          to mirror the disabled CTA without inventing new chrome. */}
      <section className="surface-cockpit-section">
        <span className="surface-cockpit-label">
          {copy.surfaceStudioDsLabel}
          {requireDesignSystem && (
            <span
              data-required
              style={{
                marginLeft: 8,
                fontSize: "var(--t-meta)",
                letterSpacing: "var(--track-meta)",
                color: dsMissing ? "var(--cc-err)" : "var(--text-ghost)",
                textTransform: "uppercase",
              }}
            >
              · {copy.surfaceStudioDsRequired}
            </span>
          )}
        </span>
        <span className="surface-ds-chip" data-required-missing={dsMissing ? "true" : undefined}>
          <span
            className="surface-ds-chip-value"
            data-empty={brief.design_system ? undefined : "true"}
          >
            {brief.design_system ?? copy.surfaceStudioDsEmpty}
          </span>
          <span className="surface-ds-chip-caret" aria-hidden>▾</span>
          <select
            className="surface-ds-native"
            value={brief.design_system ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onBriefChange({ design_system: v === "" ? null : v });
            }}
            aria-label={copy.surfaceStudioDsLabel}
          >
            <option value="">{copy.surfaceStudioDsEmpty}</option>
            {DESIGN_SYSTEMS.map((ds) => (
              <option key={ds} value={ds}>{ds}</option>
            ))}
          </select>
        </span>
      </section>

      {/* Section 5 — Footer with primary CTA + Handoff secondary +
          principles + ⌘+Enter hint. */}
      <footer className="surface-cockpit-footer">
        <div className="surface-cta-row">
          <button
            type="button"
            className="surface-cta-primary"
            onClick={onSubmit}
            disabled={!canSubmit}
            title={
              pending
                ? copy.surfaceStudioGenerating
                : dsMissing
                  ? copy.surfaceStudioDsBlockedHint
                  : copy.surfaceCtaForm
            }
            aria-label={
              pending
                ? copy.surfaceStudioGenerating
                : dsMissing
                  ? copy.surfaceStudioDsBlockedHint
                  : copy.surfaceCtaForm
            }
          >
            <span className="surface-cta-glyph" aria-hidden>
              {pending ? <span style={{ fontSize: "var(--t-body)", lineHeight: 1 }}>…</span> : <IconSend />}
            </span>
            <span className="surface-cta-label">
              {pending ? copy.surfaceStudioGenerating : copy.surfaceCtaForm}
            </span>
            <span className="surface-cta-hint" aria-hidden>{copy.surfaceCtaFormHint}</span>
          </button>
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
        {flyout === "handoff" && (
          <NotWiredPopover
            title={copy.surfaceComposerHandoffLabel}
            body={copy.surfaceComposerHandoffBody}
            contract={copy.surfaceComposerHandoffContract}
          />
        )}
        {principlesCount > 0 && (
          <span className="surface-cockpit-doctrine" title="princípios em vigor">
            <span className="surface-cockpit-doctrine-glyph" aria-hidden>§</span>
            <span>{principlesCount}</span>
          </span>
        )}
      </footer>

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
function IconRefs() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
function IconHandoff() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

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
      style={{ marginTop: 8 }}
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
