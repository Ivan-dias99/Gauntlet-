import { useEffect, useRef } from "react";
import type { SurfaceBriefPayload } from "../../hooks/useRuberra";

// Wave-3 left-side creation panel. Four controls:
//   - ModeSelector (prototype / slide deck / from template / other)
//   - FidelitySelector (wireframe / hi-fi)
//   - DesignSystemPicker (list of canned DSes; optional in W3, mandatory in W5)
//   - Brief textarea + submit

export const MODES: Array<{ key: SurfaceBriefPayload["mode"]; label: string }> = [
  { key: "prototype",     label: "Protótipo" },
  { key: "slide_deck",    label: "Slide deck" },
  { key: "from_template", label: "A partir de template" },
  { key: "other",         label: "Outro" },
];

export const FIDELITIES: Array<{ key: SurfaceBriefPayload["fidelity"]; label: string }> = [
  { key: "wireframe", label: "Wireframe" },
  { key: "hi-fi",     label: "Alta fidelidade" },
];

// Canned design systems. Real catalogue comes from Core (Wave 4) / the
// archive connector layer. Kept small and uncontroversial in W3.
export const DESIGN_SYSTEMS = [
  "Signal Canon",
  "Claude Design",
  "Material You",
  "Tailwind UI",
  "Shadcn UI",
  "Radix Primitives",
  "—",
] as const;

interface Props {
  brief: SurfaceBriefPayload;
  onBriefChange: (patch: Partial<SurfaceBriefPayload>) => void;
  prompt: string;
  onPromptChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  mockBanner?: boolean;
}

export default function CreationPanel({
  brief, onBriefChange, prompt, onPromptChange, onSubmit, pending, mockBanner,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea within reasonable bounds (same pattern as School).
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [prompt]);

  const canSubmit = prompt.trim().length > 0 && !pending;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        padding: "var(--space-3)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
      }}
    >
      {mockBanner && (
        <div
          data-surface-mock-banner
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--cc-warn)",
            padding: "6px 10px",
            border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
            borderRadius: "var(--radius-control)",
            background: "color-mix(in oklab, var(--cc-warn) 6%, transparent)",
            lineHeight: 1.4,
          }}
        >
          mock · nenhum provider foi chamado · plano canned
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label>Modo</Label>
        <Segmented
          value={brief.mode}
          options={MODES}
          onChange={(v) => onBriefChange({ mode: v })}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label>Fidelidade</Label>
        <Segmented
          value={brief.fidelity}
          options={FIDELITIES}
          onChange={(v) => onBriefChange({ fidelity: v })}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label>Design system</Label>
        <select
          value={brief.design_system ?? "—"}
          onChange={(e) => {
            const v = e.target.value;
            onBriefChange({ design_system: v === "—" ? null : v });
          }}
          style={{
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            padding: "8px 10px",
            background: "var(--bg-input)",
            color: "var(--text-primary)",
            border: "var(--border-mid)",
            borderRadius: "var(--radius-control)",
          }}
        >
          {DESIGN_SYSTEMS.map((ds) => (
            <option key={ds} value={ds}>{ds === "—" ? "— sem design system" : ds}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label>Brief</Label>
        <textarea
          ref={textareaRef}
          rows={3}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              if (canSubmit) onSubmit();
            }
          }}
          placeholder="Descreve a superfície — propósito, utilizador, restrições…"
          style={{
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body)",
            lineHeight: "var(--lh-body)",
            padding: "10px 12px",
            minHeight: 72,
            maxHeight: 240,
            resize: "none",
            background: "var(--bg-input)",
            color: "var(--text-primary)",
            border: "var(--border-mid)",
            borderRadius: "var(--radius-control)",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          data-surface-submit
          className="btn-chip"
          data-variant="sans"
          style={{ opacity: canSubmit ? 1 : 0.5 }}
        >
          {pending ? "a gerar…" : "Gerar plano"}
        </button>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          ⌘/Ctrl + Enter
        </span>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "var(--t-micro)",
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}
    >
      {children}
    </span>
  );
}

interface SegmentedProps<V extends string> {
  value: V;
  options: Array<{ key: V; label: string }>;
  onChange: (v: V) => void;
}

function Segmented<V extends string>({ value, options, onChange }: SegmentedProps<V>) {
  return (
    <div
      role="tablist"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        border: "var(--border-mid)",
        borderRadius: "var(--radius-control)",
        padding: 2,
        background: "var(--bg-input)",
      }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.key)}
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              padding: "6px 8px",
              background: active ? "var(--bg-elevated)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              border: active ? "var(--border-soft)" : "1px solid transparent",
              borderRadius: "calc(var(--radius-control) - 2px)",
              cursor: "pointer",
              transition: "background var(--dur-fast) var(--ease-swift), color var(--dur-fast) var(--ease-swift)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
