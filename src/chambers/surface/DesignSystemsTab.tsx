import { useState } from "react";

// Wave-3 Design Systems tab — the library-management surface inside
// the right exploration rail. Three parts:
//
//   · Section header  (editorial kicker + sub)
//   · Create row      (outline action, DNA glyph, editorial voice)
//   · Systems list    (rows with status, default canon, quiet controls)
//
// Data is canned in W3. The real catalogue comes from Core › Routing
// (Wave 4) and from the archive connector layer. When that lands, the
// rows below become the projection; the shape of the section doesn't
// need to change.

type DSStatus = "published" | "draft";

interface SystemRow {
  id: string;
  name: string;
  author: string;
  updated: string;
  status: DSStatus;
  isDefault: boolean;
}

const SYSTEMS: SystemRow[] = [
  { id: "signal-canon",       name: "Signal Canon",       author: "Ivan Dias",       updated: "há 5 dias",  status: "published", isDefault: true  },
  { id: "claude-design",      name: "Claude Design",      author: "Anthropic",       updated: "há 2 dias",  status: "published", isDefault: false },
  { id: "archive-primitives", name: "Archive Primitives", author: "Ivan Dias",       updated: "há 1 hora",  status: "draft",     isDefault: false },
  { id: "terminal-chrome",    name: "Terminal Chrome",    author: "Signal · core",   updated: "há 3 dias",  status: "published", isDefault: false },
];

export default function DesignSystemsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Header />

      <CreateRow />

      <div
        role="list"
        style={{
          display: "flex",
          flexDirection: "column",
          border: "var(--border-soft)",
          borderRadius: "var(--radius-control)",
          overflow: "hidden",
          background: "var(--bg-surface)",
          boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 4%, transparent)",
        }}
      >
        {SYSTEMS.map((s, i) => (
          <Row key={s.id} row={s} last={i === SYSTEMS.length - 1} />
        ))}
      </div>

      <p
        style={{
          margin: 0,
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-label)",
          color: "var(--text-ghost)",
        }}
      >
        o sistema marcado <span style={{ color: "var(--chamber-dna, var(--accent))" }}>default</span> é aplicado automaticamente a cada nova surface.
      </p>
    </div>
  );
}

function Header() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        — sistemas de design
      </span>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 20,
          color: "var(--text-primary)",
          letterSpacing: "-0.005em",
          fontWeight: 500,
        }}
      >
        Canon da chamber.
      </span>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: "var(--t-body-sec)",
          color: "var(--text-muted)",
          lineHeight: 1.5,
          maxWidth: 520,
        }}
      >
        Os design systems publicados podem ser atribuídos a qualquer surface.
        O sistema default entra em vigor quando o utilizador não escolhe um explicitamente.
      </span>
    </div>
  );
}

function CreateRow() {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      data-ds-create
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "36px 1fr auto",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: hover
          ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 6%, var(--bg-elevated))"
          : "var(--bg-surface)",
        border: hover
          ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 38%, var(--border-color-soft))"
          : "var(--border-soft)",
        borderRadius: "var(--radius-control)",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: hover
          ? "0 4px 14px color-mix(in oklab, var(--chamber-dna, var(--accent)) 10%, transparent)"
          : "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 3%, transparent)",
        transition:
          "background var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-med) var(--ease-swift)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 999,
          fontFamily: "var(--mono)",
          fontSize: 14,
          color: "var(--chamber-dna, var(--accent))",
          background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 14%, var(--bg-input))",
          border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 40%, transparent)",
          boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--chamber-dna, var(--accent)) 20%, transparent)",
        }}
      >
        +
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: 16,
            color: "var(--text-primary)",
            fontWeight: 500,
          }}
        >
          Criar novo design system
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            color: "var(--text-ghost)",
          }}
        >
          ensinar ao Signal a marca · o produto · a gramática visual
        </span>
      </span>
      <span
        aria-hidden
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--chamber-dna, var(--accent))",
          padding: "4px 10px",
          borderRadius: 999,
          border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 40%, transparent)",
          background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 8%, transparent)",
        }}
      >
        criar →
      </span>
    </button>
  );
}

function Row({ row, last }: { row: SystemRow; last: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      role="listitem"
      data-ds-row
      data-ds-default={row.isDefault || undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 14,
        padding: row.isDefault ? "14px 16px 14px 18px" : "13px 16px",
        borderBottom: last ? "none" : "var(--border-soft)",
        background: row.isDefault
          ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 4%, var(--bg-elevated))"
          : hover
            ? "var(--bg-elevated)"
            : "transparent",
        transition:
          "background var(--dur-fast) var(--ease-swift)",
      }}
    >
      {/* Canon rail — permanent on default, hover elsewhere */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 10,
          bottom: 10,
          left: 4,
          width: 2,
          borderRadius: 2,
          background: row.isDefault
            ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 72%, transparent)"
            : hover
              ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 42%, transparent)"
              : "transparent",
          transition: "background var(--dur-fast) var(--ease-swift)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--serif)",
              fontSize: 16,
              color: "var(--text-primary)",
              fontWeight: row.isDefault ? 500 : 400,
            }}
          >
            {row.name}
          </span>
          {row.isDefault && (
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "var(--track-label)",
                textTransform: "uppercase",
                color: "var(--chamber-dna, var(--accent))",
                padding: "1px 8px",
                borderRadius: 999,
                border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 46%, transparent)",
                background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 10%, transparent)",
              }}
            >
              default
            </span>
          )}
          <StatusPill status={row.status} />
        </div>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            color: "var(--text-ghost)",
          }}
        >
          {row.author} · {row.updated}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!row.isDefault && (
          <button
            type="button"
            data-ds-make-default
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              background: "transparent",
              border: "1px solid color-mix(in oklab, var(--text-ghost) 32%, transparent)",
              borderRadius: 999,
              padding: "4px 11px",
              cursor: "pointer",
              transition:
                "color var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift), background var(--dur-fast) var(--ease-swift)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = "var(--chamber-dna, var(--accent))";
              el.style.borderColor = "color-mix(in oklab, var(--chamber-dna, var(--accent)) 46%, transparent)";
              el.style.background = "color-mix(in oklab, var(--chamber-dna, var(--accent)) 8%, transparent)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = "var(--text-muted)";
              el.style.borderColor = "color-mix(in oklab, var(--text-ghost) 32%, transparent)";
              el.style.background = "transparent";
            }}
          >
            tornar default
          </button>
        )}
        <button
          type="button"
          data-ds-open
          aria-label={`Abrir ${row.name}`}
          title="Abrir design system"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            background: "transparent",
            border: "var(--border-soft)",
            borderRadius: 999,
            color: "var(--text-muted)",
            cursor: "pointer",
            fontFamily: "var(--mono)",
            fontSize: 12,
          }}
        >
          ↗
        </button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: DSStatus }) {
  const published = status === "published";
  const tone = published ? "var(--terminal-ok)" : "var(--accent-dim)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: `color-mix(in oklab, ${tone} 80%, var(--text-muted))`,
        padding: "1px 8px",
        borderRadius: 999,
        border: `1px solid color-mix(in oklab, ${tone} 32%, transparent)`,
        background: `color-mix(in oklab, ${tone} 6%, transparent)`,
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 5,
          height: 5,
          borderRadius: 999,
          background: `color-mix(in oklab, ${tone} 78%, transparent)`,
        }}
      />
      {status}
    </span>
  );
}
