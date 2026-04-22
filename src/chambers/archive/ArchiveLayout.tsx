import { ReactNode } from "react";

// Wave post-8 — Archive layout mirrors Surface's split grammar.
// Left column is retrieval (search + ledger). Right column is detail
// (selected run + linked artifact + provenance). Tokens come from the
// canon; no local spacing / radius decisions here.

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export default function ArchiveLayout({ left, right }: Props) {
  return (
    <div
      data-chamber="archive"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(360px, 480px) 1fr",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        height: "100%",
        minHeight: 0,
      }}
    >
      <aside
        data-archive-region="ledger"
        style={{
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          overflow: "hidden",
        }}
      >
        {left}
      </aside>
      <section
        data-archive-region="detail"
        style={{
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {right}
      </section>
    </div>
  );
}
