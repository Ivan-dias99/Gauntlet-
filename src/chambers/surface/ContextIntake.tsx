import type { CSSProperties } from "react";

// Wave-3 Surface context intake. Six intake rows the user can attach
// before asking for a plan: screenshot, codebase, figma file, reference
// project, asset upload, skill / design-system binding. Attached items
// sit as removable chips below the intake list.
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
  dna: string; // color-mix anchor
}

// Glyphs stay monospace-safe — no icon font, nothing to download. The
// anchor colours resolve through color-mix over the chamber DNA so the
// intake inherits the palette when it lands on Sepia / Dark.
const INTAKE: IntakeAction[] = [
  { kind: "screenshot", label: "Adicionar screenshot", sub: "capturar estado · UI · referência visual",       glyph: "▦", dna: "var(--ch-insight, var(--accent))" },
  { kind: "codebase",   label: "Anexar codebase",      sub: "pasta frontend · design system · repositório",    glyph: "❘❘",dna: "var(--ch-terminal, var(--accent))" },
  { kind: "figma",      label: "Arrastar ficheiro Figma",sub: "frames · componentes · referência de origem",   glyph: "◇", dna: "var(--ch-archive, var(--accent))" },
  { kind: "reference",  label: "Referenciar projeto",  sub: "outra surface · missão anterior · padrão a seguir", glyph: "↻", dna: "var(--ch-surface, var(--accent))" },
  { kind: "asset",      label: "Carregar assets",      sub: "imagens · ícones · tipografia · texturas",         glyph: "◎", dna: "var(--ch-core, var(--accent))" },
  { kind: "skill",      label: "Skills · design system",sub: "animar · protótipo · deck · wireframe · DS",      glyph: "✦", dna: "var(--ch-surface, var(--accent))" },
];

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
          gap: 6,
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
            paddingTop: 4,
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
  return (
    <button
      type="button"
      onClick={onClick}
      data-intake-kind={row.kind}
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr auto",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-control)",
        cursor: "pointer",
        textAlign: "left",
        color: "var(--text-primary)",
        transition:
          "background var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), transform var(--dur-fast) var(--ease-swift)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
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
          borderRadius: 999,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: `color-mix(in oklab, ${row.dna} 90%, var(--text-primary))`,
          background: `color-mix(in oklab, ${row.dna} 14%, var(--bg-elevated))`,
          border: `1px solid color-mix(in oklab, ${row.dna} 34%, transparent)`,
        }}
      >
        {row.glyph}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            color: "var(--text-primary)",
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            color: "var(--text-ghost)",
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
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          color: "var(--text-ghost)",
          letterSpacing: "var(--track-label)",
        }}
      >
        +
      </span>
    </button>
  );
}

function AttachedChip({ item, onRemove }: { item: ContextItem; onRemove: () => void }) {
  const chipStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 4px 3px 8px",
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "var(--track-label)",
    textTransform: "uppercase",
    color: "var(--text-primary)",
    background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 8%, var(--bg-elevated))",
    border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 28%, var(--border-color-soft))",
    borderRadius: 999,
    lineHeight: 1.4,
  };
  return (
    <span style={chipStyle}>
      <span style={{ color: "var(--text-ghost)" }}>{KIND_ABBR[item.kind]}</span>
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
