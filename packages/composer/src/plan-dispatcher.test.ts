// Plan dispatcher tests — exercises the routing matrix:
// DOM actions → ambient.domActions.execute (batched);
// shell.run → ambient.shellExec.run;
// fs.read / fs.write → ambient.filesystem.{read,write}TextFile.
// Missing adapters surface as typed `ok: false` results, not throws.

import { describe, expect, it, vi } from 'vitest';
import { type Ambient } from './ambient';
import { type DomAction, type DomActionResult } from './dom-actions';
import { dispatchPlan } from './plan-dispatcher';

function makeAmbient(overrides: Partial<Ambient> = {}): Ambient {
  return {
    shell: 'browser',
    capabilities: {} as Ambient['capabilities'],
    transport: { fetchJson: vi.fn() } as unknown as Ambient['transport'],
    storage: {} as Ambient['storage'],
    selection: { read: vi.fn(() => null) } as unknown as Ambient['selection'],
    ...overrides,
  } as Ambient;
}

describe('dispatchPlan', () => {
  it('routes DOM actions through ambient.domActions in a single batch', async () => {
    const execute = vi.fn(
      async (acts: DomAction[]): Promise<DomActionResult[]> =>
        acts.map((a) => ({ action: a, ok: true })),
    );
    const ambient = makeAmbient({
      domActions: { execute },
    } as unknown as Partial<Ambient>);

    const actions: DomAction[] = [
      { type: 'highlight', selector: '#a' },
      { type: 'click', selector: '#b' },
      { type: 'fill', selector: '#c', value: 'x' },
    ];
    const out = await dispatchPlan(ambient, actions);

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(actions);
    expect(out).toHaveLength(3);
    expect(out.every((r) => r.ok)).toBe(true);
  });

  it('returns typed ok:false for DOM actions when ambient has no executor', async () => {
    const ambient = makeAmbient();
    const out = await dispatchPlan(ambient, [
      { type: 'click', selector: '#x' },
    ]);
    expect(out[0].ok).toBe(false);
    expect(out[0].error).toContain('does not support DOM actions');
  });

  it('routes shell.run through ambient.shellExec', async () => {
    const run = vi.fn(async () => ({
      stdout: 'ok',
      stderr: '',
      exitCode: 0,
      durationMs: 12,
    }));
    const ambient = makeAmbient({ shellExec: { run } } as Partial<Ambient>);
    const out = await dispatchPlan(ambient, [
      { type: 'shell.run', cmd: 'git', args: ['status'] },
    ]);
    expect(run).toHaveBeenCalledWith('git', ['status'], undefined);
    expect(out[0].ok).toBe(true);
    expect(out[0].output?.stdout).toBe('ok');
  });

  it('flags shell.run as ok:false when exit code is non-zero', async () => {
    const run = vi.fn(async () => ({
      stdout: '',
      stderr: 'boom',
      exitCode: 1,
      durationMs: 5,
    }));
    const ambient = makeAmbient({ shellExec: { run } } as Partial<Ambient>);
    const out = await dispatchPlan(ambient, [
      { type: 'shell.run', cmd: 'git', args: ['nope'] },
    ]);
    expect(out[0].ok).toBe(false);
    expect(out[0].error).toBe('boom');
  });

  it('returns typed ok:false for shell.run when ambient has no shellExec', async () => {
    const ambient = makeAmbient();
    const out = await dispatchPlan(ambient, [
      { type: 'shell.run', cmd: 'ls', args: [] },
    ]);
    expect(out[0].ok).toBe(false);
    expect(out[0].error).toContain('shell.run requires');
  });

  it('routes fs.read / fs.write through ambient.filesystem', async () => {
    const readTextFile = vi.fn(async () => 'hello');
    const writeTextFile = vi.fn(async () => 5);
    const ambient = makeAmbient({
      filesystem: { readTextFile, writeTextFile },
    } as unknown as Partial<Ambient>);
    const out = await dispatchPlan(ambient, [
      { type: 'fs.read', path: '/a.txt' },
      { type: 'fs.write', path: '/b.txt', content: 'hello' },
    ]);
    expect(readTextFile).toHaveBeenCalledWith('/a.txt');
    expect(writeTextFile).toHaveBeenCalledWith('/b.txt', 'hello');
    expect(out[0].ok).toBe(true);
    expect(out[0].output?.text).toBe('hello');
    expect(out[1].ok).toBe(true);
    expect(out[1].output?.bytes).toBe(5);
  });

  it('records ok:true when the consent gate approves and the adapter fires', async () => {
    // Wave 4 contract: enqueueComputerUseAction returns a Promise that
    // resolves with the gate's verdict (ok=true after approve+adapter
    // success). The dispatcher awaits it so the row in `out` reflects
    // the actual OS-level outcome — not the old "queued" stamp written
    // before the actuation.
    const enqueue = vi.fn().mockResolvedValue({ ok: true });
    const ambient = makeAmbient({
      computerUse: {
        moveCursor: vi.fn(),
        click: vi.fn(),
        typeText: vi.fn(),
        pressKey: vi.fn(),
      },
    } as unknown as Partial<Ambient>);

    const out = await dispatchPlan(
      ambient,
      [
        {
          type: 'computer_use',
          action: { kind: 'move', x: 100, y: 200, reason: 'centre' },
        },
      ],
      { enqueueComputerUseAction: enqueue },
    );

    expect(enqueue).toHaveBeenCalledTimes(1);
    expect(enqueue).toHaveBeenCalledWith({
      kind: 'move', x: 100, y: 200, reason: 'centre',
    });
    expect(out[0].ok).toBe(true);
    expect(out[0].output?.text).toContain('move executed');
  });

  it('records ok:false with the gate error when the adapter throws', async () => {
    const enqueue = vi.fn().mockResolvedValue({
      ok: false, error: 'enigo: Wayland not supported',
    });
    const ambient = makeAmbient({
      computerUse: {
        moveCursor: vi.fn(), click: vi.fn(),
        typeText: vi.fn(), pressKey: vi.fn(),
      },
    } as unknown as Partial<Ambient>);

    const out = await dispatchPlan(
      ambient,
      [{ type: 'computer_use', action: { kind: 'click', button: 'left' } }],
      { enqueueComputerUseAction: enqueue },
    );
    expect(out[0].ok).toBe(false);
    expect(out[0].error).toContain('Wayland');
  });

  it('cancels the remainder of the plan when the operator rejects mid-sequence', async () => {
    // Sequence: move → click → type. Operator rejects the move; click +
    // type get stamped as cancelled so the run ledger shows them as
    // "did not run because the operator rejected an earlier step".
    const enqueue = vi.fn()
      .mockResolvedValueOnce({ ok: false, error: 'rejected by operator' });
    const ambient = makeAmbient({
      computerUse: {
        moveCursor: vi.fn(), click: vi.fn(),
        typeText: vi.fn(), pressKey: vi.fn(),
      },
    } as unknown as Partial<Ambient>);

    const out = await dispatchPlan(
      ambient,
      [
        { type: 'computer_use', action: { kind: 'move', x: 1, y: 2 } },
        { type: 'computer_use', action: { kind: 'click', button: 'left' } },
        { type: 'computer_use', action: { kind: 'type', text: 'hi' } },
      ],
      { enqueueComputerUseAction: enqueue },
    );
    // Only the first action hit the gate — onReject in the gate drained
    // the queue, so the dispatcher must not even await for #2 / #3.
    expect(enqueue).toHaveBeenCalledTimes(1);
    expect(out).toHaveLength(3);
    expect(out[0].ok).toBe(false);
    expect(out[0].error).toBe('rejected by operator');
    expect(out[1].ok).toBe(false);
    expect(out[1].error).toContain('cancelled');
    expect(out[2].ok).toBe(false);
    expect(out[2].error).toContain('cancelled');
  });

  it('returns typed ok:false for computer_use when no enqueue callback is provided', async () => {
    // Capsule passes `enqueueComputerUseAction` only when the gate is
    // wired; if it is missing the dispatcher should NOT silently skip
    // the action — it should surface so the operator sees the gap.
    const ambient = makeAmbient({
      computerUse: {
        moveCursor: vi.fn(),
        click: vi.fn(),
        typeText: vi.fn(),
        pressKey: vi.fn(),
      },
    } as unknown as Partial<Ambient>);
    const out = await dispatchPlan(ambient, [
      { type: 'computer_use', action: { kind: 'click', button: 'left' } },
    ]);
    expect(out[0].ok).toBe(false);
    expect(out[0].error).toContain('computer_use');
  });

  it('returns typed ok:false for computer_use when ambient has no computerUse adapter', async () => {
    // Browser shell — capability is false, no adapter injected. The
    // enqueue callback may still arrive (Capsule passes one only when
    // ambient.computerUse exists, but a misconfigured caller might),
    // so guard against that too.
    const enqueue = vi.fn().mockResolvedValue({ ok: true });
    const ambient = makeAmbient();
    const out = await dispatchPlan(
      ambient,
      [{ type: 'computer_use', action: { kind: 'press', key: 'Enter' } }],
      { enqueueComputerUseAction: enqueue },
    );
    expect(out[0].ok).toBe(false);
    expect(out[0].error).toContain('computer_use');
    expect(enqueue).not.toHaveBeenCalled();
  });

  it('flushes the DOM batch when a computer_use action interleaves', async () => {
    const execute = vi.fn(
      async (acts: DomAction[]): Promise<DomActionResult[]> =>
        acts.map((a) => ({ action: a, ok: true })),
    );
    const enqueue = vi.fn().mockResolvedValue({ ok: true });
    const ambient = makeAmbient({
      domActions: { execute },
      computerUse: {
        moveCursor: vi.fn(),
        click: vi.fn(),
        typeText: vi.fn(),
        pressKey: vi.fn(),
      },
    } as unknown as Partial<Ambient>);

    await dispatchPlan(
      ambient,
      [
        { type: 'highlight', selector: '#a' },
        {
          type: 'computer_use',
          action: { kind: 'click', button: 'left' },
        },
        { type: 'click', selector: '#b' },
      ],
      { enqueueComputerUseAction: enqueue },
    );

    // Two DOM batches around the computer_use enqueue.
    expect(execute).toHaveBeenCalledTimes(2);
    expect(enqueue).toHaveBeenCalledTimes(1);
  });

  it('flushes the DOM batch when an ambient action interleaves', async () => {
    const execute = vi.fn(
      async (acts: DomAction[]): Promise<DomActionResult[]> =>
        acts.map((a) => ({ action: a, ok: true })),
    );
    const run = vi.fn(async () => ({
      stdout: 'ok',
      stderr: '',
      exitCode: 0,
      durationMs: 1,
    }));
    const ambient = makeAmbient({
      domActions: { execute },
      shellExec: { run },
    } as unknown as Partial<Ambient>);

    await dispatchPlan(ambient, [
      { type: 'highlight', selector: '#a' },
      { type: 'click', selector: '#b' },
      { type: 'shell.run', cmd: 'git', args: ['status'] },
      { type: 'fill', selector: '#c', value: 'x' },
    ]);

    // Two DOM batches: [highlight, click] then [fill]; one shell call between.
    expect(execute).toHaveBeenCalledTimes(2);
    expect(execute.mock.calls[0][0]).toHaveLength(2);
    expect(execute.mock.calls[1][0]).toHaveLength(1);
    expect(run).toHaveBeenCalledTimes(1);
  });
});
