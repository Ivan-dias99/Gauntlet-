import { useEffect, useRef } from "react";
import type { SurfaceBriefPayload } from "../../hooks/useSignal";
import ContextIntake, { type ContextItem, type ContextKind } from "./ContextIntake";
import FidelityTiles from "./FidelityTiles";

// Wave-3 left-side intake console. The chamber's creation field.
// Sections, top-to-bottom:
//   · mock banner (when backend is mock or plan was canned)
//   · Modo          — segmented, 4 options
//   · Fidelidade    — visual tiles with inline SVG thumbs
//   · Design system — active system row + "ver todos"
//   · Contexto      — intake rows (screenshot / codebase / figma / ref /
//                     asset / skill) and attached chips
//   · Brief         — purpose / users / constraints
//   · Gerar plano   — full-width primary, with ⌘/Ctrl + Enter hint
//
// Material discipline: every sub-surface uses --bg-surface /
// --bg-elevated / --bg-input from the active chamber DNA so white /
// sepia / dark flow without local colour decisions.

export const MODES: Array<{ key: SurfaceBriefPayload["mode"]; label: string }> = [
  { key: "prototype",     label: "Protótipo" },
  { key: "slide_deck",    label: "Slide deck" },
  { key: "from_template", label: "A partir de template" },
  { key: "other",         label: "Outro" },
];

// Canned design systems. Real catalogue comes from Core (Wave 4) / the
// archive connector layer. Kept small and uncontroversial in W3.
export const DESIGN_SYSTEMS = [
  "Signal Canon",
  "Claude Design",
  "Archive Primitives",
  "Terminal Chrome",
  "Material You",
  "Tailwind UI",
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
  contextItems: ContextItem[];
  onAttachContext: (kind: ContextKind) => void;
  onDetachContext: (id: string) => void;
  onOpenSystems: () => void;
}

export default function CreationPanel({
  brief, onBriefChange, prompt, onPromptChange, onSubmit, pending, mockBanner,
  contextItems, onAttachContext, onDetachContext, onOpenSystems,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [prompt]);

  const canSubmit = prompt.trim().length > 0 && !pending;
  const ctxCount = contextItems.length;
  const readySignal = prompt.trim().length > 0 || ctxCount > 0;

  return (
    <div
      data-surface-console
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        padding: "var(--space-4)",
        border: "var(--border-mid)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        boxShadow: "var(--shadow-panel)",
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

      <Section label="Modo">
        <Segmented
          value={brief.mode}
          options={MODES}
          onChange={(v) => onBriefChange({ mode: v })}
        />
      </Section>

      <Section label="Fidelidade">
        <FidelityTiles
          value={brief.fidelity}
          onChange={(v) => onBriefChange({ fidelity: v })}
        />
      </Section>

      <Section
        label="Design system"
        right={
          <button
            type="button"
            onClick={onOpenSystems}
            data-surface-open-systems
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            → ver todos
          </button>
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr auto",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            background: "var(--bg-elevated)",
            border: "var(--border-soft)",
            borderRadius: "var(--radius-control)",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: 6,
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--chamber-dna, var(--accent))",
              background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 14%, var(--bg-input))",
              border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 30%, transparent)",
            }}
          >
            ◐
          </span>
          <select
            value={brief.design_system ?? "—"}
            onChange={(e) => {
              const v = e.target.value;
              onBriefChange({ design_system: v === "—" ? null : v });
            }}
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              padding: "4px 0",
              background: "transparent",
              color: "var(--text-primary)",
              border: "none",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            {DESIGN_SYSTEMS.map((ds) => (
              <option key={ds} value={ds}>
                {ds === "—" ? "— sem design system" : ds}
              </option>
            ))}
          </select>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: brief.design_system ? "var(--chamber-dna, var(--accent))" : "var(--text-ghost)",
            }}
          >
            {brief.design_system ? "activo" : "nenhum"}
          </span>
        </div>
      </Section>

      <ContextIntake
        items={contextItems}
        onAttach={onAttachContext}
        onDetach={onDetachContext}
      />

      <Section label="Brief">
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
          placeholder="Propósito · utilizadores · restrições · resultado desejado…"
          style={{
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body)",
            lineHeight: "var(--lh-body)",
            padding: "10px 12px",
            minHeight: 88,
            maxHeight: 240,
            resize: "none",
            background: "var(--bg-input)",
            color: "var(--text-primary)",
            border: "var(--border-mid)",
            borderRadius: "var(--radius-control)",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </Section>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          paddingTop: 4,
        }}
      >
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          data-surface-submit
          data-ready={readySignal || undefined}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "12px 14px",
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body)",
            fontWeight: 500,
            color: canSubmit ? "#fff" : "var(--text-muted)",
            background: canSubmit
              ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 92%, transparent)"
              : "var(--bg-elevated)",
            border: canSubmit
              ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 72%, transparent)"
              : "var(--border-soft)",
            borderRadius: "var(--radius-control)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            boxShadow: canSubmit
              ? "0 1px 0 color-mix(in oklab, #000 14%, transparent), 0 8px 24px color-mix(in oklab, var(--chamber-dna, var(--accent)) 22%, transparent)"
              : "none",
            transition:
              "background var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-fast) var(--ease-swift)",
          }}
        >
          <span aria-hidden style={{ fontFamily: "var(--mono)", fontSize: 12 }}>▷</span>
          {pending ? "a gerar…" : "Gerar surface"}
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          <span>
            {ctxCount > 0
              ? `${ctxCount} em contexto · brief ${prompt.trim() ? "ok" : "por escrever"}`
              : prompt.trim()
                ? "brief ok · sem contexto anexado"
                : "adiciona contexto ou escreve brief"}
          </span>
          <span>⌘/Ctrl + Enter</span>
        </div>
      </div>
    </div>
  );
}

function Section({
  label, right, children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <Label>{label}</Label>
        {right}
      </div>
      {children}
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
        border: "var(--border-soft)",
        borderRadius: "var(--radius-control)",
        padding: 3,
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
              padding: "7px 8px",
              background: active ? "var(--bg-elevated)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              border: active
                ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 28%, var(--border-color-soft))"
                : "1px solid transparent",
              borderRadius: "calc(var(--radius-control) - 3px)",
              cursor: "pointer",
              transition:
                "background var(--dur-fast) var(--ease-swift), color var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
