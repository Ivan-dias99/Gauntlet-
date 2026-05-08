// buildSlashActions tests — capability-gated action factory used by
// the inline `/` dropdown. The function is pure: feed it ambient
// flags + plan + callbacks and it returns the SlashAction[] the menu
// renders.

import { describe, expect, it, vi } from 'vitest';
import { type Ambient } from './ambient';
import { buildSlashActions, type BuildSlashActionsArgs } from './SlashMenu';
import { type DomPlanResult } from './types';

function caps(over: Partial<Ambient['capabilities']> = {}): Ambient['capabilities'] {
  return {
    domExecution: false,
    screenshot: false,
    dismissDomain: false,
    pillSurface: false,
    remoteVoice: false,
    filesystemRead: false,
    filesystemWrite: false,
    screenCapture: false,
    shellExecute: false,
    ...over,
  } as Ambient['capabilities'];
}

function noopArgs(): BuildSlashActionsArgs {
  return {
    ambient: { capabilities: caps() } as Ambient,
    plan: null,
    shellPanelOpen: false,
    attachLocalFile: vi.fn(),
    attachScreenCapture: vi.fn(),
    saveComposeToDisk: vi.fn(),
    toggleShellPanel: vi.fn(),
    clearInput: vi.fn(),
    dismiss: vi.fn(),
    openPalette: vi.fn(),
  };
}

describe('buildSlashActions', () => {
  it('always includes /limpar /fechar /palette', () => {
    const out = buildSlashActions(noopArgs());
    const ids = out.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(['limpar', 'fechar', 'palette']));
  });

  it('hides anexar / ecrã / shell / guardar when ambient lacks the capability', () => {
    const out = buildSlashActions(noopArgs());
    const ids = out.map((a) => a.id);
    expect(ids).not.toContain('anexar');
    expect(ids).not.toContain('ecra');
    expect(ids).not.toContain('shell');
    expect(ids).not.toContain('guardar');
  });

  it('shows /anexar when filesystemRead + filesystem are wired', () => {
    const out = buildSlashActions({
      ...noopArgs(),
      ambient: {
        capabilities: caps({ filesystemRead: true }),
        filesystem: {} as Ambient['filesystem'],
      } as Ambient,
    });
    expect(out.find((a) => a.id === 'anexar')).toBeTruthy();
  });

  it('shows /ecrã only when screenCapture + captureScreen are wired', () => {
    const out = buildSlashActions({
      ...noopArgs(),
      ambient: {
        capabilities: caps({ screenCapture: true }),
        screenshot: { captureScreen: vi.fn() } as unknown as Ambient['screenshot'],
      } as Ambient,
    });
    expect(out.find((a) => a.id === 'ecra')).toBeTruthy();
  });

  it('hides /guardar when there is no compose answer', () => {
    const out = buildSlashActions({
      ...noopArgs(),
      ambient: {
        capabilities: caps({ filesystemWrite: true }),
        filesystem: { writeTextFile: vi.fn() } as unknown as Ambient['filesystem'],
      } as Ambient,
      plan: { actions: [], compose: '' } as unknown as DomPlanResult,
    });
    expect(out.find((a) => a.id === 'guardar')).toBeFalsy();
  });

  it('shows /guardar when filesystemWrite + writeTextFile + plan.compose all present', () => {
    const out = buildSlashActions({
      ...noopArgs(),
      ambient: {
        capabilities: caps({ filesystemWrite: true }),
        filesystem: { writeTextFile: vi.fn() } as unknown as Ambient['filesystem'],
      } as Ambient,
      plan: { actions: [], compose: 'hello' } as unknown as DomPlanResult,
    });
    expect(out.find((a) => a.id === 'guardar')).toBeTruthy();
  });

  it('toggleShellPanel hint flips with shellPanelOpen', () => {
    const argsClosed: BuildSlashActionsArgs = {
      ...noopArgs(),
      ambient: {
        capabilities: caps({ shellExecute: true }),
        shellExec: { run: vi.fn() } as unknown as Ambient['shellExec'],
      } as Ambient,
      shellPanelOpen: false,
    };
    const closed = buildSlashActions(argsClosed).find((a) => a.id === 'shell')!;
    expect(closed.hint).toBe('Abrir shell rápida');

    const opened = buildSlashActions({ ...argsClosed, shellPanelOpen: true }).find(
      (a) => a.id === 'shell',
    )!;
    expect(opened.hint).toBe('Fechar shell rápida');
  });

  it('run() callbacks delegate to the supplied handlers', () => {
    const args = {
      ...noopArgs(),
      ambient: {
        capabilities: caps({ filesystemRead: true }),
        filesystem: {} as Ambient['filesystem'],
      } as Ambient,
    };
    buildSlashActions(args).find((a) => a.id === 'anexar')!.run();
    expect(args.attachLocalFile).toHaveBeenCalledTimes(1);
    buildSlashActions(args).find((a) => a.id === 'limpar')!.run();
    expect(args.clearInput).toHaveBeenCalledTimes(1);
    buildSlashActions(args).find((a) => a.id === 'fechar')!.run();
    expect(args.dismiss).toHaveBeenCalledTimes(1);
    buildSlashActions(args).find((a) => a.id === 'palette')!.run();
    expect(args.openPalette).toHaveBeenCalledTimes(1);
  });
});
