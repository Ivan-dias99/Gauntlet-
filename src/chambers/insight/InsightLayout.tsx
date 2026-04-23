import { ReactNode } from "react";

// Insight central column — no split, no side rail. A single vertical
// shell that stretches to chamber height, centers its content at 780
// max-width, and anchors the composer at the bottom. The context strip
// is rendered inside this layout so it lives integrated with the
// chamber head rather than as separate furniture.

interface Props {
  strip: ReactNode;
  scroll: ReactNode;
  floor: ReactNode;
}

export default function InsightLayout({ strip, scroll, floor }: Props) {
  return (
    <div data-insight-layout className="insight-center">
      {strip}
      <div className="insight-center-scroll">{scroll}</div>
      <div className="insight-center-floor">{floor}</div>
    </div>
  );
}
