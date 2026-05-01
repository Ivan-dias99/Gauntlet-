// Wave P-39a — settings page scaffold.
//
// /settings/:section ─→ preferences | api-keys | connectors | language
// Real content lands in P-43.

import { useParams, Link } from "react-router-dom";

const SECTIONS = [
  { key: "preferences", label: "preferências" },
  { key: "api-keys", label: "api keys" },
  { key: "connectors", label: "conectores" },
  { key: "language", label: "idioma" },
] as const;

export default function SettingsPage() {
  const { section = "preferences" } = useParams<{ section?: string }>();
  return (
    <section
      data-page="settings"
      style={{
        padding: "var(--space-6)",
        maxWidth: 1080,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "var(--space-6)",
      }}
    >
      <aside data-settings-nav>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          {SECTIONS.map((s) => (
            <li key={s.key}>
              <Link
                to={`/settings/${s.key}`}
                className="btn"
                data-active={section === s.key ? "true" : undefined}
                style={{ display: "block", padding: "var(--space-2)" }}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <article data-settings-section={section}>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "var(--t-title)",
            margin: 0,
          }}
        >
          {SECTIONS.find((s) => s.key === section)?.label ?? "secção"}
        </h2>
        <p className="kicker" data-tone="ghost">
          P-43 · em construção
        </p>
      </article>
    </section>
  );
}
