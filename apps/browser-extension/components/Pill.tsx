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
  // Transient feedback after the cápsula closes following an
  // executed plan. The pill flashes green/red for ~1.4s so the user
  // gets ambient confirmation that the action actually landed.
  flash?: 'ok' | 'fail' | null;
  // Phase mirror — the pill carries the cápsula's current phase color
  // so it visually communicates work-in-progress even after dismiss.
  // Set by App via the gauntlet:phase event broadcast from Capsule.
  phase?: 'idle' | 'planning' | 'streaming' | 'plan_ready' | 'executing' | 'executed' | 'error' | null;
}

// Drag is "armed" only after the pointer moves more than this many
// pixels from the press origin. Below the threshold we treat the
// gesture as a click. Without it every click would also trigger a
// no-op drag and feel laggy.
const DRAG_THRESHOLD_PX = 4;

// After this many ms with no pointer movement on the page, the pill
// fades and the dot stops pulsing. The doctrine ("personalidade tem
// custo, cada animação tem de servir o flow") says we should not burn
// ink while the user is concentrated. Any mousemove resets the timer;
// hovering over the pill cancels the idle state outright.
const IDLE_AFTER_MS = 30_000;

export function Pill({ position, onClick, onDismissDomain, flash, phase }: PillProps) {
  const [pos, setPos] = useState<PillPosition>(position);
  const [idle, setIdle] = useState(false);
  const dragStateRef = useRef<{
    pressX: number;
    pressY: number;
    startBottom: number;
    startRight: number;
    armed: boolean;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const idleTimerRef = useRef<number | null>(null);

  // Sync incoming prop changes (e.g. App finished loading prefs from
  // storage after the initial render). Only when the prop actually
  // moves — otherwise dragging would be fought by every re-render.
  useEffect(() => {
    setPos(position);
  }, [position.bottom, position.right]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mousemove anywhere on the page resets the idle timer. Pointer
  // entering / leaving the pill itself short-circuits the timer too.
  // We keep the listener passive so we never fight scroll handlers.
  useEffect(() => {
    function reset() {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
      setIdle((prev) => (prev ? false : prev));
      idleTimerRef.current = window.setTimeout(() => {
        setIdle(true);
      }, IDLE_AFTER_MS);
    }
    reset();
    window.addEventListener('mousemove', reset, { passive: true });
    window.addEventListener('keydown', reset, { passive: true });
    return () => {
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown', reset);
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

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
          ? `Esconder o Gauntlet em ${host}? Restauras na cápsula → "···" → restaurar.`
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
      className={`gauntlet-pill${idle ? ' gauntlet-pill--idle' : ''}${
        flash ? ` gauntlet-pill--flash-${flash}` : ''
      }${
        phase && phase !== 'idle' ? ` gauntlet-pill--phase-${phase}` : ''
      }`}
      style={{ bottom: `${pos.bottom}px`, right: `${pos.right}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerEnter={() => setIdle(false)}
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
  width: 18px;
  height: 18px;
  padding: 0;
  border-radius: 50%;
  background: rgba(14, 16, 22, 0.92);
  border: 1px solid rgba(208, 122, 90, 0.45);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 14px rgba(208, 122, 90, 0.28),
    0 4px 12px rgba(0, 0, 0, 0.40);
  backdrop-filter: saturate(1.4) blur(16px);
  -webkit-backdrop-filter: saturate(1.4) blur(16px);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 2147483647;
  transition:
    transform 160ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms ease,
    opacity 600ms ease,
    width 200ms cubic-bezier(0.2, 0, 0, 1),
    height 200ms cubic-bezier(0.2, 0, 0, 1);
  animation: gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}
.gauntlet-pill:hover {
  width: 24px;
  height: 24px;
  transform: translateY(-2px);
  border-color: rgba(208, 122, 90, 0.65);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 26px rgba(208, 122, 90, 0.55),
    0 8px 22px rgba(0, 0, 0, 0.55);
}
.gauntlet-pill:active {
  cursor: grabbing;
  transform: translateY(0) scale(0.94);
}
.gauntlet-pill:focus-visible {
  outline: 2px solid rgba(208, 122, 90, 0.7);
  outline-offset: 3px;
}
/* Idle: dim and quiet. Activity (mousemove, hover, keydown) brings
   the pill back to full presence in the same tick the listener fires. */
.gauntlet-pill--idle {
  opacity: 0.32;
}
.gauntlet-pill--idle .gauntlet-pill__dot {
  animation-play-state: paused;
}
@keyframes gauntlet-pill-flash-ok {
  0%   { box-shadow: 0 0 0 0 rgba(122, 180, 138, 0.85); transform: scale(1); }
  40%  { box-shadow: 0 0 0 12px rgba(122, 180, 138, 0); transform: scale(1.18); }
  100% { box-shadow: 0 0 0 0 rgba(122, 180, 138, 0); transform: scale(1); }
}
@keyframes gauntlet-pill-flash-fail {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-3px) rotate(-4deg); }
  40%      { transform: translateX(3px)  rotate(4deg); }
  60%      { transform: translateX(-2px) rotate(-2deg); }
  80%      { transform: translateX(2px)  rotate(2deg); }
}
.gauntlet-pill--flash-ok {
  border-color: rgba(122, 180, 138, 0.85) !important;
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-flash-ok 1400ms ease-out 1;
}
.gauntlet-pill--flash-fail {
  border-color: rgba(212, 96, 60, 0.85) !important;
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-flash-fail 600ms ease-in-out 1;
}
.gauntlet-pill__mark {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 3px;
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
  width: 2.5px;
  height: 2.5px;
  border-radius: 50%;
  background: #f4c4ad;
  box-shadow: 0 0 6px rgba(244, 196, 173, 0.85);
  animation: gauntlet-pill-pulse 2.4s ease-in-out infinite;
}

/* ── Breathing ring — sempre presente, never noisy ────────────────────────
   A slow outward halo that doesn't compete with content. Different from
   the dot pulse: this is the pill's "I am here" signal even in idle. */
@keyframes gauntlet-pill-breathe {
  0%, 100% { box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 14px rgba(208, 122, 90, 0.22),
    0 4px 12px rgba(0, 0, 0, 0.40); }
  50%      { box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 22px rgba(208, 122, 90, 0.42),
    0 4px 14px rgba(0, 0, 0, 0.40); }
}
.gauntlet-pill {
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-breathe 4.6s ease-in-out 320ms infinite;
}
.gauntlet-pill--idle { animation-play-state: running, paused; }

/* ── Phase-reactive ring — mirrors the cápsula's ambient glow ────────────
   App listens to the gauntlet:phase event from Capsule and forwards
   the value as a prop. Each non-idle phase paints a distinct halo so
   the operator's eye catches "the model is working" from across the
   page even after they dismissed the cápsula. */
@keyframes gauntlet-pill-phase-spin {
  to { transform: rotate(360deg); }
}
.gauntlet-pill--phase-planning,
.gauntlet-pill--phase-streaming,
.gauntlet-pill--phase-executing {
  width: 22px;
  height: 22px;
}
.gauntlet-pill--phase-planning::after,
.gauntlet-pill--phase-streaming::after,
.gauntlet-pill--phase-plan_ready::after,
.gauntlet-pill--phase-executing::after,
.gauntlet-pill--phase-executed::after,
.gauntlet-pill--phase-error::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  pointer-events: none;
  border: 2px solid var(--gauntlet-pill-phase-color, transparent);
  animation: gauntlet-pill-phase-spin 6s linear infinite;
  box-shadow: 0 0 12px var(--gauntlet-pill-phase-color, transparent);
}
.gauntlet-pill--phase-planning  { --gauntlet-pill-phase-color: rgba(244, 196, 86, 0.65); }
.gauntlet-pill--phase-streaming { --gauntlet-pill-phase-color: rgba(208, 122, 90, 0.75); }
.gauntlet-pill--phase-plan_ready{ --gauntlet-pill-phase-color: rgba(208, 122, 90, 0.45); }
.gauntlet-pill--phase-executing { --gauntlet-pill-phase-color: rgba(98, 130, 200, 0.65); }
.gauntlet-pill--phase-executed  { --gauntlet-pill-phase-color: rgba(122, 180, 138, 0.65); }
.gauntlet-pill--phase-error     { --gauntlet-pill-phase-color: rgba(212, 96, 60, 0.75); }

/* ── Summon swoop — click animation ────────────────────────────────────── */
@keyframes gauntlet-pill-summon {
  0%   { transform: scale(1); }
  50%  { transform: scale(0.78); box-shadow: 0 0 0 6px rgba(208, 122, 90, 0.35); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
}
.gauntlet-pill--summoning {
  animation: gauntlet-pill-summon 240ms ease-out;
}
`;
