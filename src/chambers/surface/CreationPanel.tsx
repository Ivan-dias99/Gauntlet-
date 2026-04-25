import { useEffect, useRef, useState } from "react";
import type { SurfaceBriefPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface studio panel — cockpit grammar applied to the design
// workstation. Reuses the .term-command pill (workbench-strip family)
// for the outer shell, the id row, the input row and the rail. The
// brief-shaping zone (mode · fidelity · design system) lives in
// .surface-controls between the id row and the brief textarea.
//
// Doctrine carried: the chamber's plan generator is mock until the
// provider lands. The mock declaration is permanent inside the rail —
// not a dismissible banner — so the user always sees the truth.
//
// Idle target ~360px tall when no DS picked yet.

export const MODES: Array<{ key: SurfaceBriefPayload["mode"]; label: string }> = [
  { key: "prototype",     label: "Protótipo" },
  { key: "slide_deck",    label: "Slide deck" },
  { key: "from_template", label: "Template" },
  { key: "other",         label: "Outro" },
];

export const FIDELITIES: Array<{ key: SurfaceBriefPayload["fidelity"]; label: string }> = [
  { key: "wireframe", label: "Wireframe" },
  { key: "hi-fi",     label: "Alta fidelidade" },
];

// Canned design systems. Real catalogue comes from Core (Wave 4) / the
// archive connector layer. Kept short, honest, declarable.
export const DESIGN_SYSTEMS = [
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
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 96), 240)}px`;
  }, [prompt]);

  const canSubmit = prompt.trim().length > 0 && !pending;
  const missionLabel = missionTitle
    ? missionTitle.length > 22 ? missionTitle.slice(0, 19).trimEnd() + "…" : missionTitle
    : null;

  const status = pending
    ? copy.surfaceStudioStatusPending
    : hasPlan
      ? copy.surfaceStudioStatusReady
      : prompt.trim().length > 0
        ? copy.surfaceStudioStatusBriefing
        : copy.surfaceStudioStatusIdle;

  return (
    <div
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
          <span className="surface-controls-label">{copy.surfaceStudioModeLabel}</span>
          <div className="surface-segmented" role="tablist" aria-label="mode">
            {MODES.map((m) => (
              <button
                key={m.key}
                role="tab"
                className="surface-segmented-opt"
                data-active={brief.mode === m.key ? "true" : undefined}
                aria-selected={brief.mode === m.key}
                onClick={() => onBriefChange({ mode: m.key })}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-controls-row">
          <span className="surface-controls-label">{copy.surfaceStudioFidelityLabel}</span>
          <div className="surface-segmented" role="tablist" aria-label="fidelity">
            {FIDELITIES.map((f) => (
              <button
                key={f.key}
                role="tab"
                className="surface-segmented-opt"
                data-active={brief.fidelity === f.key ? "true" : undefined}
                aria-selected={brief.fidelity === f.key}
                onClick={() => onBriefChange({ fidelity: f.key })}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-controls-row">
          <span className="surface-controls-label">{copy.surfaceStudioDsLabel}</span>
          <span className="surface-ds-chip">
            <span
              className="surface-ds-chip-value"
              data-empty={brief.design_system ? undefined : "true"}
            >
              {brief.design_system ?? copy.surfaceStudioDsEmpty}
            </span>
            <span className="surface-ds-chip-caret" aria-hidden>
              <IconCaret />
            </span>
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
        </div>
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
            minHeight: 96,
            maxHeight: 240,
            resize: "none",
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body)",
            lineHeight: "var(--lh-body)",
          }}
        />
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
      </div>

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
