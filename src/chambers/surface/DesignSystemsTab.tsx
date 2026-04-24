// Wave-3 Design Systems tab — the library-management surface inside
// the right exploration rail. Two sections:
//
//   · Create new (a full-width row, calm not loud)
//   · Systems list (rows with status, default state, updated-at)
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
  updated: string;     // human-formatted, since W3 has no real time feed
  status: DSStatus;
  isDefault: boolean;
}

const SYSTEMS: SystemRow[] = [
  { id: "signal-canon",      name: "Signal Canon",       author: "Ivan Dias", updated: "há 5 dias",  status: "published", isDefault: true  },
  { id: "claude-design",     name: "Claude Design",      author: "Anthropic", updated: "há 2 dias",  status: "published", isDefault: false },
  { id: "archive-primitives",name: "Archive Primitives", author: "Ivan Dias", updated: "há 1 hora",  status: "draft",     isDefault: false },
  { id: "terminal-chrome",   name: "Terminal Chrome",    author: "Signal · core", updated: "há 3 dias", status: "published", isDefault: false },
];

export default function DesignSystemsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHeader kicker="— Sistemas de design" sub="activos · disponíveis · atribuíveis à geração" />

      <button
        type="button"
        data-ds-create
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          background: "var(--bg-surface)",
          border: "var(--border-soft)",
          borderRadius: "var(--radius-control)",
          cursor: "pointer",
          textAlign: "left",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: "var(--t-body)", color: "var(--text-primary)" }}>
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
            border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 34%, transparent)",
            background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 8%, transparent)",
          }}
        >
          + criar
        </span>
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "var(--border-soft)",
          borderRadius: "var(--radius-control)",
          overflow: "hidden",
          background: "var(--bg-surface)",
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
        o sistema "default" é aplicado automaticamente a cada nova surface.
      </p>
    </div>
  );
}

function Row({ row, last }: { row: SystemRow; last: boolean }) {
  return (
    <div
      data-ds-row
      data-ds-default={row.isDefault || undefined}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 14,
        padding: "12px 14px",
        borderBottom: last ? "none" : "var(--border-soft)",
        background: row.isDefault ? "var(--bg-elevated)" : "transparent",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--serif)",
              fontSize: "var(--t-body)",
              color: "var(--text-primary)",
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
                border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 36%, transparent)",
                background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 8%, transparent)",
              }}
            >
              default
            </span>
          )}
          <StatusDot status={row.status} />
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
              border: "var(--border-soft)",
              borderRadius: 999,
              padding: "3px 10px",
              cursor: "pointer",
            }}
          >
            tornar default
          </button>
        )}
        <button
          type="button"
          data-ds-open
          aria-label={`Abrir ${row.name}`}
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
          title="Abrir design system"
        >
          ↗
        </button>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: DSStatus }) {
  const published = status === "published";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-label)",
        color: "var(--text-muted)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: 999,
          background: published
            ? "color-mix(in oklab, var(--cc-ok) 80%, transparent)"
            : "color-mix(in oklab, var(--text-ghost) 60%, transparent)",
        }}
      />
      {status}
    </span>
  );
}

function SectionHeader({ kicker, sub }: { kicker: string; sub: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        {kicker}
      </span>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-label)",
          color: "var(--text-muted)",
        }}
      >
        {sub}
      </span>
    </div>
  );
}
