// ComputerUseGate — consent surface for computer-use actions.
//
// Doctrine: every actuation of the user's mouse / keyboard MUST flow
// through this gate before reaching the host OS. Adapter primitives in
// `ambient.computerUse` are unguarded by design so the gate stays the
// single shape that survives a future MCP migration — wire any new
// caller (manual slash, agent SSE stream, plugin) through here.
//
// v0 surface is intentionally minimal: a single pending action,
// approve/reject buttons, no batch / no timeout. Density grows in
// later commits (queue, "approve next N", auto-deny on idle, history)
// once the agent end-to-end exists. Premature richness here would
// freeze decisions before we know what the operator actually needs.

import { useCallback, useEffect, useState } from 'react';

import {
  type AmbientComputerUse,
  type ComputerUseButton,
} from './ambient';

// Discriminated union — each kind maps 1:1 to an adapter primitive.
// Optional `reason` is the human-friendly justification the agent (or
// the slash command) provides; surfaced on the gate so the operator
// understands the WHY, not just the WHAT.
export type ComputerUseAction =
  | { kind: 'move'; x: number; y: number; reason?: string }
  | { kind: 'click'; button: ComputerUseButton; reason?: string }
  | { kind: 'type'; text: string; reason?: string }
  | { kind: 'press'; key: string; reason?: string };

// Pure description for the gate label. Kept exported so a future
// "history of approvals" view can re-render past entries without
// re-implementing the formatter.
export function describeComputerUseAction(action: ComputerUseAction): string {
  switch (action.kind) {
    case 'move':
      return `Move cursor to (${action.x}, ${action.y})`;
    case 'click':
      return `Click ${action.button} mouse button`;
    case 'type': {
      const trimmed =
        action.text.length > 60
          ? `${action.text.slice(0, 57)}…`
          : action.text;
      return `Type "${trimmed}"`;
    }
    case 'press':
      return `Press key "${action.key}"`;
  }
}

// Single async dispatcher. Caller passes the adapter (so the gate
// component itself stays decoupled from the ambient instance) and the
// approved action; this routes to the right primitive. Errors bubble
// — caller is responsible for surfacing them in the UI.
export async function runComputerUseAction(
  adapter: AmbientComputerUse,
  action: ComputerUseAction,
): Promise<void> {
  switch (action.kind) {
    case 'move':
      return adapter.moveCursor(action.x, action.y);
    case 'click':
      return adapter.click(action.button);
    case 'type':
      return adapter.typeText(action.text);
    case 'press':
      return adapter.pressKey(action.key);
  }
}

// Hook the cápsula uses to wire the gate. Owns the pending-action
// state and the approve→execute pipeline so the cápsula's body stays
// thin (Lei do Capsule). Returns:
//   * `enqueue(action)` — call from anywhere (slash, future agent SSE)
//     to queue an action for operator review.
//   * `gateProps` — spread directly on `<ComputerUseGate {...} />`.
// `adapter` may be undefined (browser shell, computerUse capability
// off); enqueue becomes a no-op in that case so callers don't need to
// guard, but the slash builder already gates on capability for UX.
export function useComputerUseGate(adapter: AmbientComputerUse | undefined) {
  const [pending, setPending] = useState<ComputerUseAction | null>(null);

  const enqueue = useCallback((action: ComputerUseAction) => {
    setPending(action);
  }, []);

  const onApprove = useCallback(
    async (action: ComputerUseAction) => {
      setPending(null);
      if (!adapter) return;
      try {
        await runComputerUseAction(adapter, action);
      } catch (err) {
        console.warn('[gauntlet/cu] action failed:', err);
      }
    },
    [adapter],
  );

  const onReject = useCallback(() => setPending(null), []);

  return {
    enqueue,
    gateProps: { pending, onApprove, onReject } as ComputerUseGateProps,
  };
}

export interface ComputerUseGateProps {
  pending: ComputerUseAction | null;
  onApprove: (action: ComputerUseAction) => void;
  onReject: () => void;
}

export function ComputerUseGate({
  pending,
  onApprove,
  onReject,
}: ComputerUseGateProps) {
  // Esc → reject. Enter is left to the autoFocus on the approve button
  // so a careless key tap doesn't auto-approve a move action that lands
  // somewhere off-screen.
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onReject();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [pending, onReject]);

  if (!pending) return null;
  const description = describeComputerUseAction(pending);

  return (
    <div
      className="gauntlet-cu-gate"
      role="dialog"
      aria-modal="true"
      aria-label="Computer-use consent"
    >
      <div className="gauntlet-cu-gate__card">
        <div className="gauntlet-cu-gate__title">
          confirma a acção do computer-use
        </div>
        {pending.reason && (
          <div className="gauntlet-cu-gate__reason">{pending.reason}</div>
        )}
        <div className="gauntlet-cu-gate__action">{description}</div>
        <div className="gauntlet-cu-gate__buttons">
          <button
            type="button"
            className="gauntlet-cu-gate__reject"
            onClick={onReject}
          >
            rejeitar (Esc)
          </button>
          <button
            type="button"
            className="gauntlet-cu-gate__approve"
            onClick={() => onApprove(pending)}
            autoFocus
          >
            aprovar
          </button>
        </div>
      </div>
    </div>
  );
}

export const COMPUTER_USE_GATE_CSS = `
.gauntlet-cu-gate {
  position: absolute;
  inset: 0;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 9, 12, 0.72);
  backdrop-filter: blur(6px);
  animation: gauntlet-cu-gate-fade 160ms ease-out both;
}
@keyframes gauntlet-cu-gate-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.gauntlet-cu-gate__card {
  min-width: 280px;
  max-width: 460px;
  padding: 18px 20px 16px;
  border-radius: 14px;
  background: rgba(20, 22, 28, 0.96);
  color: rgba(232, 234, 240, 0.96);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gauntlet-cu-gate__title {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(190, 200, 220, 0.6);
}
.gauntlet-cu-gate__reason {
  font-size: 13px;
  line-height: 1.45;
  color: rgba(220, 226, 240, 0.85);
}
.gauntlet-cu-gate__action {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", monospace;
  background: rgba(255, 255, 255, 0.04);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.gauntlet-cu-gate__buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
}
.gauntlet-cu-gate__reject,
.gauntlet-cu-gate__approve {
  font: inherit;
  font-size: 13px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
}
.gauntlet-cu-gate__reject {
  background: transparent;
  color: rgba(220, 226, 240, 0.7);
  border-color: rgba(255, 255, 255, 0.12);
}
.gauntlet-cu-gate__reject:hover {
  background: rgba(255, 255, 255, 0.04);
}
.gauntlet-cu-gate__approve {
  background: rgba(96, 165, 250, 0.18);
  color: rgba(186, 212, 255, 0.98);
  border-color: rgba(96, 165, 250, 0.45);
}
.gauntlet-cu-gate__approve:hover {
  background: rgba(96, 165, 250, 0.26);
}
.gauntlet-cu-gate__approve:focus-visible,
.gauntlet-cu-gate__reject:focus-visible {
  outline: 2px solid rgba(186, 212, 255, 0.7);
  outline-offset: 2px;
}
`;
