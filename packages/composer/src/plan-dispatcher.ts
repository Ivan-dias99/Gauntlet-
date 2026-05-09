// Plan dispatcher — agent-emitted DomAction[] → DomActionResult[].
//
// Doctrine: agent plans can target either the page DOM or the host
// ambient (shell, filesystem). DOM actions go through
// `ambient.domActions.execute` in batch (executor decides ordering
// across them); ambient actions (shell.run, fs.read, fs.write) route
// to `ambient.shellExec` / `ambient.filesystem` directly. Each step
// returns a typed `DomActionResult` so the existing renderer + ledger
// are unchanged.
//
// Pure async function — no React, no hooks. Capsule wraps it in a
// useCallback bound to the current ambient.

import { type Ambient } from './ambient';
import { type DomAction, type DomActionResult } from './dom-actions';

export async function dispatchPlan(
  ambient: Ambient,
  actions: DomAction[],
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
    } else {
      domBatch.push(action);
    }
  }
  await flushDomBatch();
  return out;
}
