import { useEffect, useRef, useState } from "react";
import type { SurfaceBriefPayload } from "../../hooks/useSignal";
import ContextIntake, { type ContextItem, type ContextKind } from "./ContextIntake";
import FidelityTiles from "./FidelityTiles";

// Wave-3 left-side intake console. The chamber's creation field.
// Sections, top-to-bottom:
//   · mock banner (when backend is mock or plan was canned)
//   · Modo          — segmented, 4 options
//   · Fidelidade    — visual tiles with inline SVG thumbs
//   · Design system — canon selector row, status dot when attached
//   · Contexto      — intake rows (screenshot / codebase / figma / ref /
//                     asset / skill) and attached chips
//   · Brief         — purpose / users / constraints, with DNA indent
//   · Gerar         — full-width editorial action + 3-dot readiness strip
//
// Material discipline: every sub-surface uses --bg-surface /
// --bg-elevated / --bg-input from the active chamber DNA so white /
// sepia / dark flow without local colour decisions. The console itself
// carries a second, DNA-tinted outer ring so it reads as a Signal
// object rather than a plain bordered box.

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
  const [briefFocus, setBriefFocus] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [prompt]);

  const canSubmit = prompt.trim().length > 0 && !pending;
  const ctxCount = contextItems.length;
  const briefReady = prompt.trim().length > 0;
  const dsReady = Boolean(brief.design_system);
  const chars = prompt.length;

  return (
    <div
      data-surface-console
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        padding: "var(--space-4)",
        border: "var(--border-mid)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        // Layered gravity: inner top highlight + outer DNA ring + main shadow.
        // Together they give the Terminal-grade object authority without
        // adding visual noise.
        boxShadow: [
          "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 5%, transparent)",
          "0 0 0 1px color-mix(in oklab, var(--chamber-dna, var(--accent)) 10%, transparent)",
          "var(--shadow-panel)",
        ].join(", "),
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
        <label
          data-surface-ds-selector
          data-attached={dsReady || undefined}
          style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr auto",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            background: "var(--bg-elevated)",
            border: dsReady
              ? "1px solid color-mix(in oklab, var(--terminal-ok) 40%, var(--border-color-soft))"
              : "var(--border-soft)",
            borderRadius: "var(--radius-control)",
            cursor: "pointer",
            boxShadow: dsReady
              ? "inset 0 0 0 1px color-mix(in oklab, var(--terminal-ok) 18%, transparent)"
              : "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 4%, transparent)",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 7,
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--chamber-dna, var(--accent))",
              background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 12%, var(--bg-input))",
              border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 32%, transparent)",
              boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--chamber-dna, var(--accent)) 18%, transparent)",
            }}
          >
            ◐
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
            <select
              value={brief.design_system ?? "—"}
              onChange={(e) => {
                const v = e.target.value;
                onBriefChange({ design_system: v === "—" ? null : v });
              }}
              style={{
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body-sec)",
                padding: 0,
                background: "transparent",
                color: "var(--text-primary)",
                border: "none",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
                lineHeight: 1.3,
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
                color: "var(--text-ghost)",
              }}
            >
              {dsReady ? "canon atribuído · gera sob esta gramática" : "sem canon · gera em estilo neutro"}
            </span>
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: dsReady ? "var(--terminal-ok)" : "var(--text-ghost)",
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: 999,
                background: dsReady
                  ? "color-mix(in oklab, var(--terminal-ok) 80%, transparent)"
                  : "color-mix(in oklab, var(--text-ghost) 50%, transparent)",
                boxShadow: dsReady
                  ? "0 0 0 3px color-mix(in oklab, var(--terminal-ok) 16%, transparent)"
                  : "none",
              }}
            />
            {dsReady ? "activo" : "nenhum"}
          </span>
        </label>
      </Section>

      <ContextIntake
        items={contextItems}
        onAttach={onAttachContext}
        onDetach={onDetachContext}
      />

      <Section label="Brief">
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-control)",
            background: "var(--bg-input)",
            border: briefFocus
              ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 46%, var(--border-color-mid))"
              : "var(--border-mid)",
            boxShadow: briefFocus
              ? "0 0 0 3px color-mix(in oklab, var(--chamber-dna, var(--accent)) 10%, transparent)"
              : "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 3%, transparent)",
            transition:
              "border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-fast) var(--ease-swift)",
          }}
        >
          {/* DNA indent rail — a calm visual anchor on the left edge */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 8,
              bottom: 8,
              left: 5,
              width: 2,
              borderRadius: 2,
              background: briefReady
                ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 55%, transparent)"
                : "color-mix(in oklab, var(--text-ghost) 28%, transparent)",
              transition: "background var(--dur-fast) var(--ease-swift)",
            }}
          />
          <textarea
            ref={textareaRef}
            rows={3}
            value={prompt}
            onFocus={() => setBriefFocus(true)}
            onBlur={() => setBriefFocus(false)}
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
              padding: "12px 12px 22px 16px",
              minHeight: 96,
              maxHeight: 240,
              resize: "none",
              background: "transparent",
              color: "var(--text-primary)",
              border: "none",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
              display: "block",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 10,
              bottom: 6,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-label)",
              color: "var(--text-ghost)",
              pointerEvents: "none",
            }}
          >
            {chars > 0 ? `${chars} car.` : "brief vazio"}
          </span>
        </div>
      </Section>

      {/* Generate action — editorial outline, DNA glyph in a circle,
          full-width. Readiness meta below as a 3-dot semantic strip. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 2 }}>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          data-surface-submit
          data-ready={canSubmit || undefined}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "11px 12px",
            fontFamily: "var(--serif)",
            fontSize: "var(--t-body)",
            fontWeight: 500,
            color: canSubmit ? "var(--text-primary)" : "var(--text-muted)",
            background: canSubmit
              ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 10%, var(--bg-elevated))"
              : "var(--bg-elevated)",
            border: canSubmit
              ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 52%, var(--border-color-mid))"
              : "var(--border-soft)",
            borderRadius: "var(--radius-control)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            boxShadow: canSubmit
              ? [
                  "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 6%, transparent)",
                  "0 0 0 3px color-mix(in oklab, var(--chamber-dna, var(--accent)) 10%, transparent)",
                  "0 6px 18px color-mix(in oklab, var(--chamber-dna, var(--accent)) 18%, transparent)",
                ].join(", ")
              : "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 3%, transparent)",
            transition:
              "background var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-med) var(--ease-swift)",
            textAlign: "left",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 999,
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: canSubmit ? "var(--chamber-dna, var(--accent))" : "var(--text-ghost)",
              background: canSubmit
                ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 16%, var(--bg-surface))"
                : "var(--bg-surface)",
              border: canSubmit
                ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 46%, transparent)"
                : "var(--border-soft)",
              boxShadow: canSubmit
                ? "0 0 12px color-mix(in oklab, var(--chamber-dna, var(--accent)) 26%, transparent)"
                : "none",
              flex: "none",
            }}
          >
            ▷
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span>{pending ? "a gerar surface…" : "Gerar surface"}</span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "var(--track-label)",
                color: "var(--text-ghost)",
              }}
            >
              {pending
                ? "stream aberta · aguarda plano"
                : canSubmit
                  ? "pronto a enviar · ⌘/Ctrl + Enter"
                  : "adiciona contexto ou escreve brief"}
            </span>
          </span>
        </button>

        {/* Readiness strip — 3 semantic dots, a calm checklist of the
            system's current state. Dots fill sage-green when satisfied. */}
        <div
          data-surface-readiness
          role="status"
          aria-label="Estado da surface"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 2px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          <ReadyDot on={ctxCount > 0} label={ctxCount > 0 ? `${ctxCount} em contexto` : "sem contexto"} />
          <ReadyDot on={briefReady} label={briefReady ? "brief ok" : "brief por escrever"} />
          <ReadyDot on={dsReady}    label={dsReady ? "canon atribuído" : "sem canon"} />
        </div>
      </div>
    </div>
  );
}

function ReadyDot({ on, label }: { on: boolean; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: 999,
          background: on
            ? "color-mix(in oklab, var(--terminal-ok) 82%, transparent)"
            : "transparent",
          border: on
            ? "1px solid color-mix(in oklab, var(--terminal-ok) 82%, transparent)"
            : "1px solid color-mix(in oklab, var(--text-ghost) 45%, transparent)",
          boxShadow: on
            ? "0 0 0 3px color-mix(in oklab, var(--terminal-ok) 14%, transparent)"
            : "none",
        }}
      />
      <span style={{ color: on ? "var(--text-muted)" : "var(--text-ghost)" }}>
        {label}
      </span>
    </span>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
        boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 3%, transparent)",
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
              position: "relative",
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              padding: "7px 8px",
              background: active ? "var(--bg-elevated)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              border: active
                ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 36%, var(--border-color-soft))"
                : "1px solid transparent",
              borderRadius: "calc(var(--radius-control) - 3px)",
              cursor: "pointer",
              boxShadow: active
                ? "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 6%, transparent), 0 1px 3px color-mix(in oklab, var(--chamber-dna, var(--accent)) 12%, transparent)"
                : "none",
              transition:
                "background var(--dur-fast) var(--ease-swift), color var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-fast) var(--ease-swift)",
            }}
          >
            {active && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  bottom: 2,
                  height: 2,
                  borderRadius: 2,
                  background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 50%, transparent)",
                }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
