import { useEffect } from 'react';
import { type Phase } from './useStreamingPlan';

// Broadcasts the capsule's current phase as a window event so the Pill
// can mirror the colour after dismiss. Lives outside Capsule.tsx so the
// orchestrator stays under the Lei do Capsule budget (CLAUDE.md).
export function usePhaseBroadcast(phase: Phase): void {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('gauntlet:phase', { detail: { phase } }),
    );
  }, [phase]);
}
