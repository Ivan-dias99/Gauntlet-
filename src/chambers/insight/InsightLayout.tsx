import { ReactNode } from "react";

// Insight split — conversation-first column on the left, doctrine /
// mission / verdict-trail rail on the right. Mirrors the structural
// grammar Surface and Archive already share (SurfaceLayout,
// ArchiveLayout): chamber-head sits above, the layout owns horizontal
// breath, the left column scrolls, the right column carries the rail.
//
// Proportions: left expands, right is a fixed 280-320px so the rail
// stays calm without competing with the thread for gravity.

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export default function InsightLayout({ left, right }: Props) {
  return (
    <div
      data-insight-layout
      style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(280px, 320px)",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        height: "100%",
        minHeight: 0,
      }}
    >
      <section
        data-insight-region="conversation"
        style={{
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {left}
      </section>
      <aside
        data-insight-region="rail"
        style={{
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {right}
      </aside>
    </div>
  );
}
