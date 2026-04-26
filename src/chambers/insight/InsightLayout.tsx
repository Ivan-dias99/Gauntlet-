import { ReactNode } from "react";

// Insight central column — single vertical shell, 780px content
// width. The workbench pill sits at the top (chamber identity +
// 5 lenses), the thread shell hosts the conversation, and the
// composer anchors at the floor. Doctrinally single-column:
// Insight is one question → one verdict, not a workbench split.

interface Props {
  workbench: ReactNode;
  scroll: ReactNode;
  floor: ReactNode;
}

export default function InsightLayout({ workbench, scroll, floor }: Props) {
  return (
    <div data-insight-layout className="insight-center">
      {workbench}
      <div className="insight-center-scroll">
        <div className="insight-thread-shell">{scroll}</div>
      </div>
      <div className="insight-center-floor">{floor}</div>
    </div>
  );
}
