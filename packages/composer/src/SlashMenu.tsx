// SlashMenu — inline dropdown that surfaces slash quick actions when
// the input starts with `/`. Pure presentational; the Capsule owns
// the action list, the active-index highlight and the run callback.
//
// Empty `matches` renders nothing (the cápsula keeps the textarea
// flush against the actions row). The cursor is purely visual — the
// caller decides which entry to run on Enter via `activeIndex`.

import { type Ambient } from './ambient';
import { type ComputerUseAction } from './ComputerUseGate';
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
  // Optional — present iff the shell exposes ambient.computerUse.
  // The slash item is hidden otherwise (browser shell, Wayland-only
  // desktop session). Calling enqueues an action through the Capsule's
  // ComputerUseGate; nothing fires before the operator approves.
  enqueueComputerUseAction?: (action: ComputerUseAction) => void;
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
  enqueueComputerUseAction,
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
  if (
    ambient.capabilities.computerUse &&
    ambient.computerUse &&
    enqueueComputerUseAction
  ) {
    // Smoke test trigger — enqueues a known-safe move-to-(400,300)
    // action so the operator can verify the gate end-to-end before
    // the agent is plugged into computer-use. Removed once the agent
    // path lands.
    list.push({
      id: 'cu-test',
      label: '/cu',
      hint: 'Teste computer-use: mover cursor para o centro do ecrã',
      run: () => {
        // Adaptativo ao viewport — antes era hardcoded em (400, 300)
        // que assume ecrã ≥ 800x600. `window.innerWidth / 2` faz a
        // pill aterrar no centro independentemente da resolução.
        // Fallback de segurança caso `window` não esteja disponível
        // (SSR / happy-dom edge case): (400, 300) original.
        const cx =
          typeof window !== 'undefined' && window.innerWidth
            ? Math.round(window.innerWidth / 2)
            : 400;
        const cy =
          typeof window !== 'undefined' && window.innerHeight
            ? Math.round(window.innerHeight / 2)
            : 300;
        enqueueComputerUseAction({
          kind: 'move',
          x: cx,
          y: cy,
          reason: 'Smoke test do gate de computer-use (slash /cu).',
        });
      },
    });
  }
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
