// Wave P-39a — connectors page scaffold.
//
// Lists the 10 connectors from the doctrine matrix. Each card surfaces
// status (configured · unconfigured · degraded). Real content in P-44.

import { useParams } from "react-router-dom";

const CONNECTORS = [
  { id: "github", label: "GitHub" },
  { id: "vercel", label: "Vercel" },
  { id: "railway", label: "Railway" },
  { id: "postgres", label: "Postgres" },
  { id: "web", label: "Web · Research" },
  { id: "model-gateway", label: "Model Gateway" },
  { id: "browser-runtime", label: "Browser Runtime" },
  { id: "figma", label: "Figma" },
  { id: "issue-tracker", label: "Issue Tracker" },
  { id: "observability", label: "Observability" },
] as const;

export default function ConnectorsPage() {
  const { id } = useParams<{ id?: string }>();
  if (id) {
    const connector = CONNECTORS.find((c) => c.id === id);
    return (
      <section data-page="connector-detail" style={{ padding: "var(--space-6)", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)", margin: 0 }}>
          {connector?.label ?? id}
        </h2>
        <p className="kicker" data-tone="ghost">setup · status · token — P-44</p>
      </section>
    );
  }
  return (
    <section
      data-page="connectors"
      style={{
        padding: "var(--space-6)",
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)", margin: 0 }}>
        conectores
      </h2>
      <p className="kicker" data-tone="ghost">10 integrações · status em P-44</p>
      <ul
        style={{
          listStyle: "none",
          margin: "var(--space-4) 0 0",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {CONNECTORS.map((c) => (
          <li
            key={c.id}
            data-connector-card={c.id}
            style={{
              padding: "var(--space-3)",
              border: "1px solid var(--border-soft)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body)",
            }}
          >
            {c.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
