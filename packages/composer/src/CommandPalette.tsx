// CommandPalette — extracted from Capsule.tsx as part of Wave 2 PR-1.
//
// Doctrine: the Composer is the user's centre of experience and grows
// dense by design — but density at the product level must not collapse
// into a god-component. Each feature lives in its own module under
// packages/composer/src/. The Capsule orchestrates and mounts; modules
// like this one own their UI, state and helpers.
//
// This module owns:
//   * PaletteAction        — the wire shape every entry must satisfy
//   * fuzzyScore           — the local fuzzy matcher (substring wins,
//                            else cheapest order-preserving match)
//   * CommandPalette       — the ⌘K dialog (filter + list + keyboard)
//
// What stays in the Capsule: the actions array, recents persistence,
// open/close state and the keyboard shortcut binding. Those depend on
// Capsule-level state (plan, snapshot, ambient capabilities, tool
// manifests) and have no business living here.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Ambient } from './ambient';
import { type DomPlanResult, type SelectionSnapshot, type ComposerSettings, type ToolManifest } from './types';

export interface PaletteAction {
  id: string;
  label: string;
  shortcut: string;
  disabled?: boolean;
  // Optional metadata for tool entries — drives the badges + description
  // line below the label. Action entries leave these undefined.
  description?: string;
  group?: 'action' | 'tool';
  mode?: string;
  risk?: string;
  requiresApproval?: boolean;
  run: () => void;
}

export interface BuildPaletteActionsArgs {
  ambient: Ambient;
  plan: DomPlanResult | null;
  snapshot: SelectionSnapshot;
  userInput: string;
  settings: ComposerSettings;
  toolManifests: ToolManifest[];
  shellPanelOpen: boolean;
  // Callbacks — Capsule wraps each in `noteUse` + `setPaletteOpen(false)`
  // before invoking the underlying handler so the palette closes and
  // the recents list updates uniformly across every entry.
  noteUse: (id: string) => void;
  closePalette: () => void;
  insertToolPrefix: (toolName: string) => void;
  focusInput: () => void;
  copyCompose: () => void;
  saveToMemory: () => void;
  attachLocalFile: () => void;
  attachScreenCapture: () => void;
  toggleShellPanel: () => void;
  saveComposeToDisk: () => void;
  refreshSnapshot: () => void;
  clearInput: () => void;
  dismiss: () => void;
}

// Build the palette's action list. Mirrors `buildSlashActions` in
// SlashMenu.tsx — pulls the giant inline IIFE out of Capsule.tsx so
// the rendering logic for the palette and the action assembly live
// next to each other.
export function buildPaletteActions(args: BuildPaletteActionsArgs): PaletteAction[] {
  const {
    ambient,
    plan,
    snapshot,
    userInput,
    settings,
    toolManifests,
    shellPanelOpen,
    noteUse,
    closePalette,
    insertToolPrefix,
    focusInput,
    copyCompose,
    saveToMemory,
    attachLocalFile,
    attachScreenCapture,
    toggleShellPanel,
    saveComposeToDisk,
    refreshSnapshot,
    clearInput,
    dismiss,
  } = args;

  // Wrap each entry's run() to fold in the close + noteUse housekeeping
  // so the call sites below stay readable.
  const wrap = (id: string, fn: () => void) => () => {
    noteUse(id);
    closePalette();
    fn();
  };

  const builtIns: PaletteAction[] = [
    {
      id: 'focus',
      label: 'Focar input',
      shortcut: '↵',
      group: 'action',
      run: wrap('focus', focusInput),
    },
    {
      id: 'copy',
      label: 'Copiar resposta',
      shortcut: '⌘C',
      group: 'action',
      disabled: !plan?.compose,
      run: wrap('copy', copyCompose),
    },
    {
      id: 'save',
      label: 'Guardar em memória',
      shortcut: 'S',
      group: 'action',
      disabled: !plan?.compose && !snapshot.text && !userInput.trim(),
      run: wrap('save', saveToMemory),
    },
    // A1/A2/A3 — capability-gated so ⌘K only lists what the current
    // shell actually supports.
    ...(ambient.capabilities.filesystemRead && ambient.filesystem
      ? [
          {
            id: 'attach-file',
            label: 'Anexar ficheiro local',
            description: 'Abre o file picker e anexa o conteúdo ao prompt',
            shortcut: '',
            group: 'action' as const,
            run: wrap('attach-file', attachLocalFile),
          },
        ]
      : []),
    ...(ambient.capabilities.screenCapture && ambient.screenshot?.captureScreen
      ? [
          {
            id: 'attach-screen',
            label: 'Capturar ecrã inteiro',
            description: 'Anexa um screenshot do ecrã primário',
            shortcut: '',
            group: 'action' as const,
            run: wrap('attach-screen', attachScreenCapture),
          },
        ]
      : []),
    ...(ambient.capabilities.shellExecute && ambient.shellExec
      ? [
          {
            id: 'shell-toggle',
            label: shellPanelOpen ? 'Fechar shell rápida' : 'Abrir shell rápida',
            description: 'Painel inline para correr comandos da allowlist',
            shortcut: '',
            group: 'action' as const,
            run: wrap('shell-toggle', toggleShellPanel),
          },
        ]
      : []),
    ...(ambient.capabilities.filesystemWrite && ambient.filesystem?.writeTextFile
      ? [
          {
            id: 'save-disk',
            label: 'Guardar resposta em ficheiro',
            description: 'Save dialog → escreve compose para o disco',
            shortcut: '',
            group: 'action' as const,
            disabled: !plan?.compose,
            run: wrap('save-disk', saveComposeToDisk),
          },
        ]
      : []),
    {
      id: 'reread',
      label: 'Re-ler contexto',
      shortcut: 'R',
      group: 'action',
      run: wrap('reread', refreshSnapshot),
    },
    {
      id: 'clear',
      label: 'Limpar input',
      shortcut: 'X',
      group: 'action',
      disabled: !userInput,
      run: wrap('clear', clearInput),
    },
    {
      id: 'dismiss',
      label: 'Fechar cápsula',
      shortcut: 'Esc',
      group: 'action',
      run: wrap('dismiss', dismiss),
    },
  ];

  const allowedTools = toolManifests.filter((t) => {
    const policy = settings.tool_policies?.[t.name];
    return !policy || policy.allowed !== false;
  });
  const toolEntries: PaletteAction[] = allowedTools.map((t) => ({
    id: `tool:${t.name}`,
    label: t.name,
    description: t.description,
    shortcut: '',
    group: 'tool',
    mode: t.mode,
    risk: t.risk,
    requiresApproval: settings.tool_policies?.[t.name]?.require_approval === true,
    run: wrap(`tool:${t.name}`, () => insertToolPrefix(t.name)),
  }));

  return [...builtIns, ...toolEntries];
}

// Fuzzy scorer — substring match wins; otherwise score by how cheaply
// the query characters can be found in order in the candidate. Higher
// score = better match. Returns -1 when no order-preserving match
// exists, which the caller filters out.
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 1000 - t.indexOf(q);
  let qi = 0;
  let runs = 0;
  let lastMatch = -2;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      if (i !== lastMatch + 1) runs++;
      lastMatch = i;
      qi++;
    }
  }
  if (qi < q.length) return -1;
  // Fewer "runs" = chars came in sequence, which we prefer.
  return 500 - runs * 10 - (t.length - q.length);
}

export interface CommandPaletteProps {
  actions: PaletteAction[];
  onClose: () => void;
  recentIds: string[];
}

export function CommandPalette({ actions, onClose, recentIds }: CommandPaletteProps) {
  const [filter, setFilter] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Score + sort: empty filter promotes recents to the top of each
  // group; non-empty filter ranks by fuzzy match across all entries.
  const visible = useMemo(() => {
    if (!filter) {
      const recentRank = new Map(recentIds.map((id, i) => [id, i]));
      const score = (a: PaletteAction) => {
        const r = recentRank.get(a.id);
        return r === undefined ? recentIds.length : r;
      };
      const sorted = [...actions].sort((a, b) => {
        const sa = score(a);
        const sb = score(b);
        if (sa !== sb) return sa - sb;
        // Stable-ish secondary sort: actions before tools, then label.
        const groupOrder = (g?: string) => (g === 'tool' ? 1 : 0);
        const ga = groupOrder(a.group);
        const gb = groupOrder(b.group);
        if (ga !== gb) return ga - gb;
        return a.label.localeCompare(b.label);
      });
      return sorted;
    }
    const scored = actions
      .map((a) => {
        const haystack = `${a.label} ${a.id} ${a.description ?? ''}`;
        return { a, score: fuzzyScore(filter, haystack) };
      })
      .filter((x) => x.score >= 0)
      .sort((x, y) => y.score - x.score)
      .map((x) => x.a);
    return scored;
  }, [actions, filter, recentIds]);

  useEffect(() => {
    if (cursor >= visible.length) setCursor(0);
  }, [visible.length, cursor]);

  const onKey = useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        setCursor((c) => Math.min(c + 1, visible.length - 1));
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (ev.key === 'Enter') {
        ev.preventDefault();
        const action = visible[cursor];
        if (action && !action.disabled) action.run();
      }
    },
    [visible, cursor],
  );

  return (
    <div className="gauntlet-capsule__palette" role="dialog" aria-label="Command palette">
      <div className="gauntlet-capsule__palette-scrim" onClick={onClose} />
      <div className="gauntlet-capsule__palette-panel" onKeyDown={onKey}>
        <input
          ref={inputRef}
          className="gauntlet-capsule__palette-input"
          type="text"
          placeholder="comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
        />
        <ul className="gauntlet-capsule__palette-list" role="listbox">
          {visible.length === 0 ? (
            <li className="gauntlet-capsule__palette-empty">sem resultados</li>
          ) : (
            visible.map((a, i) => (
              <li
                key={a.id}
                role="option"
                aria-selected={i === cursor}
                aria-disabled={a.disabled}
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  if (!a.disabled) a.run();
                }}
                className={`gauntlet-capsule__palette-item${
                  i === cursor ? ' gauntlet-capsule__palette-item--active' : ''
                }${a.disabled ? ' gauntlet-capsule__palette-item--disabled' : ''}${
                  a.group === 'tool' ? ' gauntlet-capsule__palette-item--tool' : ''
                }`}
              >
                <div className="gauntlet-capsule__palette-main">
                  <span className="gauntlet-capsule__palette-label">{a.label}</span>
                  {a.description && (
                    <span className="gauntlet-capsule__palette-desc">{a.description}</span>
                  )}
                </div>
                <div className="gauntlet-capsule__palette-meta">
                  {a.mode && (
                    <span
                      className={`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${a.mode}`}
                      title={`mode: ${a.mode}`}
                    >
                      {a.mode}
                    </span>
                  )}
                  {a.risk && a.risk !== 'low' && (
                    <span
                      className={`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${a.risk}`}
                      title={`risk: ${a.risk}`}
                    >
                      {a.risk}
                    </span>
                  )}
                  {a.requiresApproval && (
                    <span
                      className="gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval"
                      title="requires explicit approval before running"
                    >
                      approval
                    </span>
                  )}
                  {a.shortcut && (
                    <span className="gauntlet-capsule__palette-shortcut">{a.shortcut}</span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
