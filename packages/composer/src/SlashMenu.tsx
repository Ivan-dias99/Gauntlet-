// SlashMenu — inline dropdown that surfaces slash quick actions when
// the input starts with `/`. Pure presentational; the Capsule owns
// the action list, the active-index highlight and the run callback.
//
// Empty `matches` renders nothing (the cápsula keeps the textarea
// flush against the actions row). The cursor is purely visual — the
// caller decides which entry to run on Enter via `activeIndex`.

import { type Ambient } from './ambient';
import { type DomPlanResult } from './types';

export interface SlashAction {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export interface BuildSlashActionsArgs {
  ambient: Ambient;
  plan: DomPlanResult | null;
  shellPanelOpen: boolean;
  attachLocalFile: () => void;
  attachScreenCapture: () => void;
  saveComposeToDisk: () => void;
  toggleShellPanel: () => void;
  clearInput: () => void;
  dismiss: () => void;
  openPalette: () => void;
}

// Build the slash action list given the current capabilities + plan.
// Pulled out of Capsule.tsx so the giant capability-gated list lives
// next to the SlashMenu it feeds. Caller wraps in useMemo with the
// right dependency array.
export function buildSlashActions({
  ambient,
  plan,
  shellPanelOpen,
  attachLocalFile,
  attachScreenCapture,
  saveComposeToDisk,
  toggleShellPanel,
  clearInput,
  dismiss,
  openPalette,
}: BuildSlashActionsArgs): SlashAction[] {
  const list: SlashAction[] = [];
  if (ambient.capabilities.filesystemRead && ambient.filesystem) {
    list.push({
      id: 'anexar',
      label: '/anexar',
      hint: 'Anexar ficheiro local',
      run: attachLocalFile,
    });
  }
  if (ambient.capabilities.screenCapture && ambient.screenshot?.captureScreen) {
    list.push({
      id: 'ecra',
      label: '/ecrã',
      hint: 'Capturar ecrã inteiro',
      run: attachScreenCapture,
    });
  }
  if (ambient.capabilities.shellExecute && ambient.shellExec) {
    list.push({
      id: 'shell',
      label: '/shell',
      hint: shellPanelOpen ? 'Fechar shell rápida' : 'Abrir shell rápida',
      run: toggleShellPanel,
    });
  }
  if (
    ambient.capabilities.filesystemWrite &&
    ambient.filesystem?.writeTextFile &&
    plan?.compose
  ) {
    list.push({
      id: 'guardar',
      label: '/guardar',
      hint: 'Guardar resposta para ficheiro',
      run: saveComposeToDisk,
    });
  }
  list.push({
    id: 'limpar',
    label: '/limpar',
    hint: 'Esvaziar input',
    run: clearInput,
  });
  list.push({
    id: 'fechar',
    label: '/fechar',
    hint: 'Dispensar cápsula',
    run: dismiss,
  });
  list.push({
    id: 'palette',
    label: '/palette',
    hint: 'Abrir command palette completa (⌘K)',
    run: openPalette,
  });
  return list;
}

export interface SlashMenuProps {
  matches: SlashAction[];
  activeIndex: number;
  onHover: (index: number) => void;
  onPick: (index: number) => void;
}

export function SlashMenu({ matches, activeIndex, onHover, onPick }: SlashMenuProps) {
  if (matches.length === 0) return null;
  return (
    <div className="gauntlet-capsule__slash" role="listbox">
      {matches.map((a, i) => (
        <button
          key={a.id}
          type="button"
          role="option"
          aria-selected={i === activeIndex}
          className={`gauntlet-capsule__slash-item${
            i === activeIndex ? ' gauntlet-capsule__slash-item--active' : ''
          }`}
          onMouseEnter={() => onHover(i)}
          onClick={() => onPick(i)}
        >
          <span className="gauntlet-capsule__slash-label">{a.label}</span>
          <span className="gauntlet-capsule__slash-hint">{a.hint}</span>
        </button>
      ))}
    </div>
  );
}
