// Compact context summary — extracted from Capsule.tsx as part of
// Wave 2 PR-3. Renders the bulleted readout shown in the no-selection
// state (selection / page / DOM / screenshot). Replaces a giant
// empty-selection block with a tight readout — context still visible,
// but it doesn't dominate the layout.

import { type SelectionSnapshot } from './types';

export interface CompactContextSummaryProps {
  snapshot: SelectionSnapshot;
  screenshotEnabled: boolean;
}

export function CompactContextSummary({
  snapshot,
  screenshotEnabled,
}: CompactContextSummaryProps) {
  const domCount = (() => {
    if (!snapshot.domSkeleton) return 0;
    try {
      const parsed = JSON.parse(snapshot.domSkeleton);
      if (Array.isArray(parsed)) return parsed.length;
    } catch {
      // domSkeleton arrived as plain text — fall through to 0.
    }
    return 0;
  })();
  const pageCaptured = !!snapshot.pageText;
  return (
    <ul className="gauntlet-capsule__context-summary" aria-label="context">
      <li>
        <span className="gauntlet-capsule__context-key">selection</span>
        <span className="gauntlet-capsule__context-val gauntlet-capsule__context-val--muted">
          none
        </span>
      </li>
      <li>
        <span className="gauntlet-capsule__context-key">page captured</span>
        <span className="gauntlet-capsule__context-val">
          {pageCaptured ? 'yes' : 'no'}
        </span>
      </li>
      <li>
        <span className="gauntlet-capsule__context-key">DOM captured</span>
        <span className="gauntlet-capsule__context-val">
          {domCount > 0 ? `${domCount} elements` : '—'}
        </span>
      </li>
      <li>
        <span className="gauntlet-capsule__context-key">screenshot</span>
        <span className="gauntlet-capsule__context-val">
          {screenshotEnabled ? 'on' : 'off'}
        </span>
      </li>
    </ul>
  );
}
