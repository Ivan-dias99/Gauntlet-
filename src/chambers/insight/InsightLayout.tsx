import { ReactNode } from "react";

// Insight workstation split — control/context rail on the LEFT, primary
// conversation/work region on the RIGHT. Same grammar as every serious
// AI workstation: support is where your eyes scan first, the main
// workspace dominates the reading area. Surface, Terminal and Archive
// already carry this grammar; Insight now aligns to it.
//
// Proportions: rail minmax(300px, 360px) — tighter than before because
// the conversation now needs the full reading width. Below 300 the
// meta-grid clips; above 360 the rail steals thread breathing room.

interface Props {
  rail: ReactNode;
  main: ReactNode;
}

export default function InsightLayout({ rail, main }: Props) {
  return (
    <div
      data-insight-layout
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(300px, 360px) 1fr",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        height: "100%",
        minHeight: 0,
      }}
    >
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
        {rail}
      </aside>
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
        {main}
      </section>
    </div>
  );
}
