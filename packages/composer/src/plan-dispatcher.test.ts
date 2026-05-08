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
    } as Partial<Ambient>);

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
    } as Partial<Ambient>);
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
    } as Partial<Ambient>);

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
