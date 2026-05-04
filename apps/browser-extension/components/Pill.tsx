// Pill — Gauntlet's "sempre presente" surface.
//
// Tiny clickable mark in the bottom-right corner, mounted by the
// content script on every page load. Click expands into the full
// Capsule. Right-click hides the pill on the current domain.
// Drag-from-pill repositions it anywhere on the viewport (saved to
// chrome.storage so the pill remembers across tabs/sessions).
//
// Doctrine: cápsula mínima que segue o cursor — the pill is the
// resting state. Without it Gauntlet is invisible until the user
// remembers the hotkey, which is no different from a standalone app.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type PillPosition,
  writePillPosition,
} from '../lib/pill-prefs';

export interface PillProps {
  position: PillPosition;
  onClick: () => void;
  onDismissDomain: () => void;
}

// Drag is "armed" only after the pointer moves more than this many
// pixels from the press origin. Below the threshold we treat the
// gesture as a click. Without it every click would also trigger a
// no-op drag and feel laggy.
const DRAG_THRESHOLD_PX = 4;

export function Pill({ position, onClick, onDismissDomain }: PillProps) {
  const [pos, setPos] = useState<PillPosition>(position);
  const dragStateRef = useRef<{
    pressX: number;
    pressY: number;
    startBottom: number;
    startRight: number;
    armed: boolean;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync incoming prop changes (e.g. App finished loading prefs from
  // storage after the initial render). Only when the prop actually
  // moves — otherwise dragging would be fought by every re-render.
  useEffect(() => {
    setPos(position);
  }, [position.bottom, position.right]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>) => {
      // Right-click is dismiss, handled separately. Don't start a drag.
      if (ev.button !== 0) return;
      buttonRef.current?.setPointerCapture(ev.pointerId);
      dragStateRef.current = {
        pressX: ev.clientX,
        pressY: ev.clientY,
        startBottom: pos.bottom,
        startRight: pos.right,
        armed: false,
      };
    },
    [pos.bottom, pos.right],
  );

  const onPointerMove = useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      const dx = ev.clientX - drag.pressX;
      const dy = ev.clientY - drag.pressY;
      if (
        !drag.armed &&
        Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD_PX
      ) {
        return;
      }
      drag.armed = true;
      // The pill is anchored bottom-right, so a positive dx (pointer
      // moved right) shrinks `right` (pulls the pill rightward) and a
      // positive dy (pointer moved down) shrinks `bottom`.
      setPos({
        right: drag.startRight - dx,
        bottom: drag.startBottom - dy,
      });
    },
    [],
  );

  const onPointerUp = useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>) => {
      const drag = dragStateRef.current;
      dragStateRef.current = null;
      try {
        buttonRef.current?.releasePointerCapture(ev.pointerId);
      } catch {
        // Capture already released — ignore.
      }
      if (!drag) return;
      if (drag.armed) {
        // It was a real drag — persist the new position and skip the
        // click handler so the capsule doesn't pop on drop.
        void writePillPosition(pos);
        return;
      }
      onClick();
    },
    [pos, onClick],
  );

  const onContextMenu = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const host = (() => {
        try {
          return window.location.hostname;
        } catch {
          return '';
        }
      })();
      const ok = window.confirm(
        host
          ? `Esconder o Gauntlet em ${host}? Voltas a activar nas definições da extensão.`
          : 'Esconder o Gauntlet neste site?',
      );
      if (ok) onDismissDomain();
    },
    [onDismissDomain],
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      className="gauntlet-pill"
      style={{ bottom: `${pos.bottom}px`, right: `${pos.right}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={onContextMenu}
      aria-label="Summon Gauntlet capsule"
      title="Click: abrir · Drag: mover · Right-click: esconder neste domínio"
    >
      <span className="gauntlet-pill__mark" aria-hidden>
        <span className="gauntlet-pill__dot" />
      </span>
    </button>
  );
}

// Colocated CSS so the content script can inject one stylesheet into
// the shadow root and have both pill + capsule styled correctly. Keep
// the visual coherent with the capsule's brand mark — same ember, same
// pulse — so the transition pill → capsule reads as the same object
// expanding, not two separate widgets.
export const PILL_CSS = `
@keyframes gauntlet-pill-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.18); }
}
@keyframes gauntlet-pill-rise {
  0%   { opacity: 0; transform: translateY(8px) scale(0.85); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}

.gauntlet-pill {
  position: fixed;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  background: rgba(14, 16, 22, 0.92);
  border: 1px solid rgba(208, 122, 90, 0.45);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 22px rgba(208, 122, 90, 0.30),
    0 8px 20px rgba(0, 0, 0, 0.45);
  backdrop-filter: saturate(1.4) blur(20px);
  -webkit-backdrop-filter: saturate(1.4) blur(20px);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 2147483647;
  transition:
    transform 160ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms ease;
  animation: gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}
.gauntlet-pill:hover {
  transform: translateY(-2px);
  border-color: rgba(208, 122, 90, 0.65);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 30px rgba(208, 122, 90, 0.55),
    0 12px 28px rgba(0, 0, 0, 0.55);
}
.gauntlet-pill:active {
  cursor: grabbing;
  transform: translateY(0) scale(0.96);
}
.gauntlet-pill:focus-visible {
  outline: 2px solid rgba(208, 122, 90, 0.7);
  outline-offset: 3px;
}
.gauntlet-pill__mark {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(208, 122, 90, 0.95), rgba(208, 122, 90, 0.45) 60%, transparent 100%),
    #1a1d26;
  border: 1px solid rgba(208, 122, 90, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.gauntlet-pill__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #f4c4ad;
  box-shadow: 0 0 8px rgba(244, 196, 173, 0.85);
  animation: gauntlet-pill-pulse 2.4s ease-in-out infinite;
}
`;
