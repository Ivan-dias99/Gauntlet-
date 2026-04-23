import { ReactNode } from "react";

// Insight split — conversation-first column on the left, rail with
// mission · chamber status · doctrine · verdict trail on the right.
// Mirrors the structural grammar Surface and Archive already share
// (SurfaceLayout, ArchiveLayout): chamber-head sits above, the layout
// owns horizontal breath, the left column scrolls, the right column
// carries the rail.
//
// Proportions: left expands for reading comfort, right is 340–400px —
// tuned up from the earlier 280–320 so the rail carries operational
// weight parity with Surface's exploration rail and Archive's run
// detail. Below that minimum the chamber-status MetaGrid clips; above
// the maximum the thread loses reading width.

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
        gridTemplateColumns: "1fr minmax(340px, 400px)",
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
