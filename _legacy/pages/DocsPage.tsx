// Wave P-39a — docs page scaffold.
//
// Links to the markdown files at repo root + docs/. Operator-facing
// reading list of doctrine, runbook, voice, design tokens, etc.

const DOC_LINKS = [
  { href: "/docs/RUNBOOK", label: "RUNBOOK", note: "boot · cutover · backup" },
  { href: "/docs/FIRST_MISSION", label: "primeira missão", note: "5-min walkthrough" },
  { href: "/docs/VOICE", label: "voice", note: "doutrina de copy" },
  { href: "/docs/DESIGN_TOKENS", label: "design tokens", note: "single source of truth" },
  { href: "/docs/MOTION", label: "motion", note: "view transitions + curves" },
  { href: "/docs/A11Y_AUDIT", label: "a11y audit", note: "WCAG contrastes" },
  { href: "/docs/KEYBOARD", label: "keyboard map", note: "atalhos globais" },
  { href: "/docs/INFORMATION_ARCHITECTURE", label: "IA", note: "estrutura de páginas" },
] as const;

export default function DocsPage() {
  return (
    <section
      data-page="docs"
      style={{ padding: "var(--space-6)", maxWidth: 720, margin: "0 auto" }}
    >
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)", margin: 0 }}>
        docs
      </h2>
      <p className="kicker" data-tone="ghost">leitura operacional</p>
      <ul
        style={{
          listStyle: "none",
          margin: "var(--space-4) 0 0",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {DOC_LINKS.map((d) => (
          <li
            key={d.href}
            style={{
              padding: "var(--space-2)",
              borderTop: "1px solid var(--border-soft)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body)",
            }}
          >
            <span>{d.label}</span>
            <span
              className="kicker"
              data-tone="ghost"
              style={{ marginLeft: "var(--space-2)" }}
            >
              {d.note}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
