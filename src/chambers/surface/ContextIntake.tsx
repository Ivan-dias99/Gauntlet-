import { useState, type CSSProperties } from "react";

// Wave-3 Surface context intake. Six intake rows the user can attach
// before asking for a plan: screenshot, codebase, figma file, reference
// project, asset upload, skill / design-system binding. Attached items
// sit as removable chips below the intake list.
//
// Each kind carries a fixed semantic colour — not a chamber-DNA
// borrowing, a real functional palette:
//
//   screenshot → cc-info  (muted blue · visual / reference signal)
//   codebase   → ember    (warm rose · import / source signal)
//   figma      → cc-err   (muted red-rose · origin / frame signal)
//   reference  → accent   (copper · continuity signal)
//   asset      → accent-dim (warm graphite · material pack signal)
//   skill/DS   → terminal-ok (sage · capability / canon signal)
//
// The intake itself is a shell — no real upload, no SSE. Stubs are
// generated locally so the whole creation flow can be demoed offline
// and so Wave-5 can plug the connector layer in without redesigning
// the surface panel.

export type ContextKind =
  | "screenshot"
  | "codebase"
  | "figma"
  | "reference"
  | "asset"
  | "skill";

export interface ContextItem {
  id: string;
  kind: ContextKind;
  label: string;
}

interface IntakeAction {
  kind: ContextKind;
  label: string;
  sub: string;
  glyph: string;
  tone: string; // CSS token expression; resolves per theme
}

// Semantic tones — only tokens, no hex. Every mode inherits the
// correct translation because these variables are defined per theme
// in tokens.css.
const INTAKE: IntakeAction[] = [
  { kind: "screenshot", label: "Adicionar screenshot",   sub: "captura · UI · referência visual",                glyph: "▦", tone: "var(--cc-info)" },
  { kind: "codebase",   label: "Anexar codebase",        sub: "pasta frontend · design system · repositório",    glyph: "❘❘",tone: "var(--ember)" },
  { kind: "figma",      label: "Arrastar ficheiro Figma", sub: "frames · componentes · origem visual",            glyph: "◇", tone: "var(--cc-err)" },
  { kind: "reference",  label: "Referenciar projeto",    sub: "outra surface · missão anterior · padrão a seguir", glyph: "↻", tone: "var(--accent)" },
  { kind: "asset",      label: "Carregar assets",        sub: "imagens · ícones · tipografia · texturas",         glyph: "◎", tone: "var(--accent-dim)" },
  { kind: "skill",      label: "Skills · design system", sub: "animar · protótipo · deck · wireframe · DS",       glyph: "✦", tone: "var(--terminal-ok)" },
];

// Kind → tone lookup for chip rendering, so attached chips inherit
// the same semantic palette as the row that created them.
const TONE_BY_KIND: Record<ContextKind, string> = INTAKE.reduce((a, r) => {
  a[r.kind] = r.tone;
  return a;
}, {} as Record<ContextKind, string>);

interface Props {
  items: ContextItem[];
  onAttach: (kind: ContextKind) => void;
  onDetach: (id: string) => void;
}

export default function ContextIntake({ items, onAttach, onDetach }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Label>Contexto</Label>
      <div
        data-surface-intake
        role="group"
        aria-label="Intake de contexto da Surface"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {INTAKE.map((row) => (
          <IntakeRow key={row.kind} row={row} onClick={() => onAttach(row.kind)} />
        ))}
      </div>

      {items.length > 0 && (
        <div
          data-surface-attached
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            paddingTop: 6,
            borderTop: "var(--border-soft)",
          }}
        >
          {items.map((it) => (
            <AttachedChip key={it.id} item={it} onRemove={() => onDetach(it.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function IntakeRow({ row, onClick }: { row: IntakeAction; onClick: () => void }) {
  const [hover, setHover] = useState(false);

  const bg = hover ? "var(--bg-elevated)" : "var(--bg-surface)";
  const borderColor = hover
    ? `color-mix(in oklab, ${row.tone} 36%, var(--border-color-soft))`
    : "var(--border-color-soft)";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-intake-kind={row.kind}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "30px 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "9px 12px 9px 14px",
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-control)",
        cursor: "pointer",
        textAlign: "left",
        color: "var(--text-primary)",
        transition:
          "background var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift)",
      }}
    >
      {/* Left accent rail — appears on hover only, semantic tone */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 6,
          bottom: 6,
          left: 4,
          width: 2,
          borderRadius: 2,
          background: hover
            ? `color-mix(in oklab, ${row.tone} 72%, transparent)`
            : "transparent",
          transition: "background var(--dur-fast) var(--ease-swift)",
        }}
      />
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          borderRadius: 7,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: `color-mix(in oklab, ${row.tone} 82%, var(--text-primary))`,
          background: `color-mix(in oklab, ${row.tone} 12%, var(--bg-input))`,
          border: `1px solid color-mix(in oklab, ${row.tone} 36%, transparent)`,
          boxShadow: `inset 0 1px 0 color-mix(in oklab, ${row.tone} 16%, transparent)`,
        }}
      >
        {row.glyph}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.sub}
        </span>
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: hover
            ? `color-mix(in oklab, ${row.tone} 80%, var(--text-primary))`
            : "var(--text-ghost)",
          borderRadius: 999,
          transition: "color var(--dur-fast) var(--ease-swift)",
        }}
      >
        +
      </span>
    </button>
  );
}

function AttachedChip({ item, onRemove }: { item: ContextItem; onRemove: () => void }) {
  const tone = TONE_BY_KIND[item.kind];
  const chipStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 4px 3px 9px",
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "var(--track-label)",
    textTransform: "uppercase",
    color: "var(--text-primary)",
    background: `color-mix(in oklab, ${tone} 8%, var(--bg-elevated))`,
    border: `1px solid color-mix(in oklab, ${tone} 32%, var(--border-color-soft))`,
    borderRadius: 999,
    lineHeight: 1.4,
  };
  return (
    <span style={chipStyle}>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 5,
          height: 5,
          borderRadius: 999,
          background: `color-mix(in oklab, ${tone} 80%, transparent)`,
        }}
      />
      <span style={{ color: "var(--text-muted)" }}>{KIND_ABBR[item.kind]}</span>
      <span>{item.label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${item.label}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          marginLeft: 2,
          border: "none",
          background: "transparent",
          color: "var(--text-ghost)",
          cursor: "pointer",
          fontFamily: "var(--mono)",
          fontSize: 10,
          borderRadius: 999,
        }}
      >
        ×
      </button>
    </span>
  );
}

const KIND_ABBR: Record<ContextKind, string> = {
  screenshot: "SHOT",
  codebase:   "CODE",
  figma:      "FIG",
  reference:  "REF",
  asset:      "AST",
  skill:      "DS",
};

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

// Default label factory for stub items. The content model in the brief
// describes richer ContextItem shapes (screenshot metadata, figma URL,
// codebase root). W3 keeps only the kind + a human label so the surface
// can demonstrate the wiring without pretending to have real upload IO.
export function defaultItemLabel(kind: ContextKind): string {
  switch (kind) {
    case "screenshot": return "captura · sem ficheiro";
    case "codebase":   return "pasta · por ligar";
    case "figma":      return "ficheiro .fig · por arrastar";
    case "reference":  return "projecto · por escolher";
    case "asset":      return "asset · por enviar";
    case "skill":      return "skill · por atribuir";
  }
}

