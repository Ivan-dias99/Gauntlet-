// buildPaletteActions tests — sister of buildSlashActions, factories
// the ⌘K palette's action list from capability flags + plan + tool
// manifests + callbacks. The wrap() helper folds the close +
// noteUse housekeeping into every entry's run().

import { describe, expect, it, vi } from 'vitest';
import { type Ambient } from './ambient';
import {
  buildPaletteActions,
  type BuildPaletteActionsArgs,
} from './CommandPalette';
import {
  DEFAULT_COMPOSER_SETTINGS,
  type DomPlanResult,
  type SelectionSnapshot,
  type ToolManifest,
} from './types';

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

function args(over: Partial<BuildPaletteActionsArgs> = {}): BuildPaletteActionsArgs {
  return {
    ambient: { capabilities: caps() } as Ambient,
    plan: null,
    snapshot: { url: '', pageTitle: '', text: '' } as SelectionSnapshot,
    userInput: '',
    settings: DEFAULT_COMPOSER_SETTINGS,
    toolManifests: [],
    shellPanelOpen: false,
    noteUse: vi.fn(),
    closePalette: vi.fn(),
    insertToolPrefix: vi.fn(),
    focusInput: vi.fn(),
    copyCompose: vi.fn(),
    saveToMemory: vi.fn(),
    attachLocalFile: vi.fn(),
    attachScreenCapture: vi.fn(),
    toggleShellPanel: vi.fn(),
    saveComposeToDisk: vi.fn(),
    refreshSnapshot: vi.fn(),
    clearInput: vi.fn(),
    dismiss: vi.fn(),
    ...over,
  };
}

describe('buildPaletteActions', () => {
  it('always emits focus / copy / save / reread / clear / dismiss', () => {
    const out = buildPaletteActions(args());
    const ids = out.map((a) => a.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'focus',
        'copy',
        'save',
        'reread',
        'clear',
        'dismiss',
      ]),
    );
  });

  it('disables copy when there is no compose answer', () => {
    const out = buildPaletteActions(args({ plan: null }));
    const copy = out.find((a) => a.id === 'copy')!;
    expect(copy.disabled).toBe(true);
  });

  it('enables copy once plan.compose is present', () => {
    const out = buildPaletteActions(
      args({
        plan: { actions: [], compose: 'hello' } as unknown as DomPlanResult,
      }),
    );
    const copy = out.find((a) => a.id === 'copy')!;
    expect(copy.disabled).toBe(false);
  });

  it('disables save when there is nothing to save (no compose, no selection, no input)', () => {
    const out = buildPaletteActions(args());
    const save = out.find((a) => a.id === 'save')!;
    expect(save.disabled).toBe(true);
  });

  it('enables save once any of compose / snapshot.text / userInput is non-empty', () => {
    const out = buildPaletteActions(args({ userInput: 'hi' }));
    expect(out.find((a) => a.id === 'save')!.disabled).toBe(false);
  });

  it('hides attach-file / attach-screen / shell-toggle when caps are off', () => {
    const out = buildPaletteActions(args());
    const ids = out.map((a) => a.id);
    expect(ids).not.toContain('attach-file');
    expect(ids).not.toContain('attach-screen');
    expect(ids).not.toContain('shell-toggle');
    expect(ids).not.toContain('save-disk');
  });

  it('shows shell-toggle with the right label tied to shellPanelOpen', () => {
    const closed = buildPaletteActions(
      args({
        ambient: {
          capabilities: caps({ shellExecute: true }),
          shellExec: { run: vi.fn() } as unknown as Ambient['shellExec'],
        } as Ambient,
        shellPanelOpen: false,
      }),
    ).find((a) => a.id === 'shell-toggle')!;
    expect(closed.label).toBe('Abrir shell rápida');

    const opened = buildPaletteActions(
      args({
        ambient: {
          capabilities: caps({ shellExecute: true }),
          shellExec: { run: vi.fn() } as unknown as Ambient['shellExec'],
        } as Ambient,
        shellPanelOpen: true,
      }),
    ).find((a) => a.id === 'shell-toggle')!;
    expect(opened.label).toBe('Fechar shell rápida');
  });

  it('appends one tool entry per allowed manifest, prefixed `tool:`', () => {
    const manifest = (name: string): ToolManifest =>
      ({
        name,
        description: `${name} desc`,
        mode: 'execute',
        risk: 'low',
        version: '1',
      }) as unknown as ToolManifest;
    const out = buildPaletteActions(
      args({
        toolManifests: [manifest('read_file'), manifest('git')],
      }),
    );
    const toolIds = out.filter((a) => a.group === 'tool').map((a) => a.id);
    expect(toolIds).toEqual(['tool:read_file', 'tool:git']);
  });

  it('respects tool_policies.allowed=false to filter out a tool', () => {
    const manifest = {
      name: 'read_file',
      description: '',
      mode: 'execute',
      risk: 'low',
      version: '1',
    } as unknown as ToolManifest;
    const out = buildPaletteActions(
      args({
        toolManifests: [manifest],
        settings: {
          ...DEFAULT_COMPOSER_SETTINGS,
          tool_policies: { read_file: { allowed: false } } as never,
        },
      }),
    );
    expect(out.find((a) => a.id === 'tool:read_file')).toBeFalsy();
  });

  it('wrap() invokes noteUse + closePalette before the per-entry handler', () => {
    const noteUse = vi.fn();
    const closePalette = vi.fn();
    const focusInput = vi.fn();
    const out = buildPaletteActions(
      args({ noteUse, closePalette, focusInput }),
    );
    out.find((a) => a.id === 'focus')!.run();
    expect(noteUse).toHaveBeenCalledWith('focus');
    expect(closePalette).toHaveBeenCalledTimes(1);
    expect(focusInput).toHaveBeenCalledTimes(1);
  });
});
