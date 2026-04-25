import { ReactNode } from "react";

// Wave-3 Surface layout — calm split. Left column is the creation
// panel (brief, mode / fidelity / design-system pickers, submit). Right
// column is the exploration rail (examples, templates, recent, search,
// library). Proportions follow the tokens.css canon; no local radius,
// spacing or type decisions here.

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export default function SurfaceLayout({ left, right }: Props) {
  return (
    <div
      data-chamber="surface"
      style={{
        display: "grid",
        // Sidebar is the cockpit — it carries the brief, the controls,
        // the doctrine state. Right is exploration. Asymmetry favours
        // the cockpit: ~44 / 56 split on wide screens, with a 480px
        // floor so segmented labels never truncate.
        gridTemplateColumns: "minmax(480px, 44%) minmax(0, 1fr)",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        height: "100%",
        minHeight: 0,
      }}
    >
      <aside
        data-surface-region="creation"
        style={{
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          overflow: "auto",
        }}
      >
        {left}
      </aside>
      <section
        data-surface-region="exploration"
        style={{
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {right}
      </section>
    </div>
  );
}
