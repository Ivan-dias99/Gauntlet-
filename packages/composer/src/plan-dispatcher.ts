// Plan dispatcher — agent-emitted DomAction[] → DomActionResult[].
//
// Doctrine: agent plans can target either the page DOM or the host
// ambient (shell, filesystem, computer-use). DOM actions go through
// `ambient.domActions.execute` in batch (executor decides ordering
// across them); ambient actions (shell.run, fs.read, fs.write) route
// to `ambient.shellExec` / `ambient.filesystem` directly; computer_use
// actions ARE NOT executed here — they are handed to the consent gate
// (ComputerUseGate) via the `enqueueComputerUseAction` callback and
// the operator's approve/reject decides whether the OS sees the
// synthetic input. Each step returns a typed `DomActionResult` so the
// existing renderer + ledger are unchanged.
//
// Pure async function — no React, no hooks. Capsule wraps it in a
// useCallback bound to the current ambient.

import { type Ambient } from './ambient';
import {
  type ComputerUseAction,
  type ComputerUseOutcome,
} from './ComputerUseGate';
import { type DomAction, type DomActionResult } from './dom-actions';

export interface DispatchPlanOptions {
  // Wave 4 — the consent gate's enqueue callback (returned by
  // `useComputerUseGate(ambient.computerUse).enqueue`). Returns a
  // Promise that resolves once the operator decides AND the adapter
  // fires (or fails). The dispatcher awaits per action so the run
  // ledger row carries the actual OS-level outcome — not a stale
  // "queued" stamp written before the actuation.
  enqueueComputerUseAction?: (
    action: ComputerUseAction,
  ) => Promise<ComputerUseOutcome>;
}

export async function dispatchPlan(
  ambient: Ambient,
  actions: DomAction[],
  options: DispatchPlanOptions = {},
): Promise<DomActionResult[]> {
  const out: DomActionResult[] = [];
  // Group consecutive DOM actions to preserve the existing batch
  // semantics (executor decides ordering across DOM actions). Mixed
  // sequences just walk one at a time.
  let domBatch: DomAction[] = [];
  const flushDomBatch = async () => {
    if (domBatch.length === 0) return;
    if (!ambient.domActions?.execute) {
      for (const a of domBatch) {
        out.push({
          action: a,
          ok: false,
          error: 'shell does not support DOM actions',
        });
      }
      domBatch = [];
      return;
    }
    const results = await ambient.domActions.execute(domBatch);
    out.push(...results);
    domBatch = [];
  };
  for (const action of actions) {
    if (action.type === 'shell.run') {
      await flushDomBatch();
      if (!ambient.shellExec) {
        out.push({
          action,
          ok: false,
          error: 'shell.run requires a desktop ambient with shellExec',
        });
        continue;
      }
      try {
        const r = await ambient.shellExec.run(action.cmd, action.args, action.cwd);
        out.push({
          action,
          ok: r.exitCode === 0,
          error: r.exitCode === 0 ? undefined : r.stderr || `exit ${r.exitCode}`,
          output: {
            stdout: r.stdout,
            stderr: r.stderr,
            exitCode: r.exitCode,
            durationMs: r.durationMs,
          },
        });
      } catch (err) {
        out.push({
          action,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else if (action.type === 'fs.read') {
      await flushDomBatch();
      if (!ambient.filesystem?.readTextFile) {
        out.push({
          action,
          ok: false,
          error: 'fs.read requires a desktop ambient with filesystem',
        });
        continue;
      }
      try {
        const text = await ambient.filesystem.readTextFile(action.path);
        out.push({
          action,
          ok: true,
          output: { text, bytes: new TextEncoder().encode(text).length },
        });
      } catch (err) {
        out.push({
          action,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else if (action.type === 'fs.write') {
      await flushDomBatch();
      if (!ambient.filesystem?.writeTextFile) {
        out.push({
          action,
          ok: false,
          error: 'fs.write requires a desktop ambient with filesystem',
        });
        continue;
      }
      try {
        const bytes = await ambient.filesystem.writeTextFile(
          action.path,
          action.content,
        );
        out.push({ action, ok: true, output: { bytes } });
      } catch (err) {
        out.push({
          action,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else if (action.type === 'computer_use') {
      await flushDomBatch();
      // No `ambient.computerUse` adapter (browser shell, capability
      // off) — surface a typed unsupported result instead of silently
      // dropping. Operator sees the gap in the plan ledger.
      if (!ambient.computerUse || !options.enqueueComputerUseAction) {
        out.push({
          action,
          ok: false,
          error:
            'computer_use requires a desktop ambient with computerUse adapter and an active consent gate',
        });
        continue;
      }
      // Enqueue through the gate and AWAIT the verdict. The gate
      // resolves the promise on approve+adapter-fire (ok:true), on
      // approve+adapter-throw (ok:false with error), or on reject
      // (ok:false, error: "rejected by operator"). The ledger row
      // therefore reflects the actual OS-level outcome. A rejected
      // sequence early-terminates: the gate's onReject already drained
      // ALL pending entries, so subsequent enqueues for this batch
      // would block forever — we mark the rest as cancelled and bail.
      const outcome = await options.enqueueComputerUseAction(action.action);
      if (outcome.ok) {
        out.push({
          action,
          ok: true,
          output: { text: `${action.action.kind} executed via consent gate` },
        });
      } else {
        out.push({ action, ok: false, error: outcome.error ?? 'gate denied' });
        if (outcome.error === 'rejected by operator') {
          // Cancel the remainder of THIS plan — model planned a
          // sequence and the operator broke it; running follow-ups
          // (a click after a rejected move, e.g.) would land at the
          // wrong cursor position. Stamp every skipped entry so the
          // ledger + cápsula result list show WHY they didn't run.
          const idx = actions.indexOf(action);
          for (let j = idx + 1; j < actions.length; j++) {
            out.push({
              action: actions[j],
              ok: false,
              error: 'cancelled — sequence rejected at earlier action',
            });
          }
          break;
        }
      }
    } else {
      domBatch.push(action);
    }
  }
  await flushDomBatch();
  return out;
}
