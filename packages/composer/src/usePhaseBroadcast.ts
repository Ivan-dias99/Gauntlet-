import { useEffect } from 'react';
import { type Phase } from './useStreamingPlan';

// Broadcasts the capsule's current phase as a window event so the Pill
// (rendered by App after dismiss) can mirror the colour. Extracted from
// Capsule to keep the orchestrator under the Lei do Capsule budget.
export function usePhaseBroadcast(phase: Phase): void {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('gauntlet:phase', { detail: { phase } }),
    );
  }, [phase]);
}
