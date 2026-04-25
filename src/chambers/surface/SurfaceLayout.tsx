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
        // Hierarchy by occupation: canvas (right) is primary —
        // contract preview / plan / files / wireframes; cockpit (left)
        // is medium — formation form. Workbench pill above is third
        // (lens-only thin strip). Wide-screen split favours the canvas
        // ~60/40 with a 360px sidebar floor so segmented labels still
        // breathe.
        gridTemplateColumns: "minmax(360px, 40%) minmax(0, 1fr)",
        gap: "var(--space-4)",
        padding: "0 var(--space-4) var(--space-4)",
        flex: 1,
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
