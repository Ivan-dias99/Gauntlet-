// Studio primitives — extracted from the legacy ControlLayout so the
// pages migrated into /composer/* can share the same SurfaceHeader,
// Panel, and Kv visual chrome without depending on the deleted layout.
//
// Behaviour-identical to the originals — same styling, same prop
// shape. The file lives in shell/ because it belongs to the studio
// surface and the studio is now the single house.

import type { ReactNode } from "react";

interface SurfaceHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function SurfaceHeader({ title, subtitle, actions }: SurfaceHeaderProps) {
  return (
    <header
      style={{
        marginBottom: 24,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: "var(--t-section)",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "6px 0 0",
              color: "var(--text-secondary)",
              fontSize: 13,
              maxWidth: 720,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </header>
  );
}

interface PanelProps {
  children: ReactNode;
  title?: string;
  hint?: string;
}

export function Panel({ children, title, hint }: PanelProps) {
  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "16px 18px",
        marginBottom: 16,
      }}
    >
      {(title || hint) && (
        <header style={{ marginBottom: 12 }}>
          {title && (
            <h2
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--text-primary)",
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                fontFamily: "var(--mono)",
              }}
            >
              {title}
            </h2>
          )}
          {hint && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {hint}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

export function Kv({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <dl
      style={{
        margin: 0,
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        rowGap: 8,
        columnGap: 16,
        fontSize: 13,
      }}
    >
      {rows.map(([k, v]) => (
        <RowPair key={k} k={k} v={v} />
      ))}
    </dl>
  );
}

function RowPair({ k, v }: { k: string; v: ReactNode }) {
  return (
    <>
      <dt style={{ color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 12 }}>
        {k}
      </dt>
      <dd style={{ margin: 0, color: "var(--text-primary)" }}>{v}</dd>
    </>
  );
}
