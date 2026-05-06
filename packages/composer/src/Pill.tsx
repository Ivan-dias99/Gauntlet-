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
import { type PillMode, type PillPosition } from './pill-prefs';

export interface PillProps {
  position: PillPosition;
  onClick: () => void;
  onDismissDomain: () => void;
  // Persist a new position after the user finished a drag. Wired by
  // the host shell to ambient.storage via createPillPrefs — keeps the
  // Pill component shell-agnostic.
  onPersistPosition: (pos: PillPosition) => void;
  // Transient feedback after the cápsula closes following an
  // executed plan. The pill flashes green/red for ~1.4s so the user
  // gets ambient confirmation that the action actually landed.
  flash?: 'ok' | 'fail' | null;
  // Phase mirror — the pill carries the cápsula's current phase color
  // so it visually communicates work-in-progress even after dismiss.
  // Set by App via the gauntlet:phase event broadcast from Capsule.
  phase?: 'idle' | 'planning' | 'streaming' | 'plan_ready' | 'executing' | 'executed' | 'error' | null;
  // True when the user has a non-empty selection on the page. The pill
  // pulses slightly stronger so the operator senses "context is ready"
  // before they even open the cápsula. Set by App via selectionchange.
  hasContext?: boolean;
  // True when the backend last failed — the pill carries a soft red ring
  // so the operator knows summoning will land in a degraded state.
  disconnected?: boolean;
  // 'corner' (default): pill rests at saved position, click summons,
  // drag repositions, magnet attracts on proximity.
  // 'cursor': OS cursor is hidden across the page; the pill becomes
  // the visual pointer, follows the cursor 1:1, and the operator
  // summons the cápsula via the keyboard shortcut.
  mode?: PillMode;
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

// Magnet — within this radius of the pill, the pill drifts toward the
// cursor by up to MAGNET_PULL_PX. Outside the radius it returns to
// rest. Doctrine: "alive and subtly magnetic, without being annoying"
// — never chase the cursor, never aggressive bounce.
const MAGNET_RADIUS_PX = 180;
const MAGNET_PULL_MIN_PX = 8;
const MAGNET_PULL_MAX_PX = 24;

export function Pill({
  position,
  onClick,
  onDismissDomain,
  onPersistPosition,
  flash,
  phase,
  hasContext,
  disconnected,
  mode = 'corner',
}: PillProps) {
  const [pos, setPos] = useState<PillPosition>(position);
  const [idle, setIdle] = useState(false);
  const [magnet, setMagnet] = useState<{ dx: number; dy: number; near: boolean }>({
    dx: 0,
    dy: 0,
    near: false,
  });
  // Cursor-mode pointer position (viewport coords, top-left). Tracked
  // separately from `pos` (which is the corner-mode bottom-right
  // anchor) so flipping modes doesn't fight the existing drag/magnet.
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [overInteractive, setOverInteractive] = useState(false);
  const [cmdHeld, setCmdHeld] = useState(false);
  const dragStateRef = useRef<{
    pressX: number;
    pressY: number;
    startBottom: number;
    startRight: number;
    armed: boolean;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const idleTimerRef = useRef<number | null>(null);
  // Magnet plumbing — rAF-throttled so we don't write transform on
  // every mousemove, and the latest cursor coords are kept in a ref so
  // the rAF callback closes over fresh data without re-binding.
  const magnetRafRef = useRef<number | null>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);

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

  // Cursor-mode — pill becomes the visual pointer.
  //
  // The OS cursor is hidden across the page via a global stylesheet;
  // pointermove is tracked at frame rate and the pill renders at the
  // cursor coordinates. Interactive elements under the pointer get a
  // subtle morph so the operator senses click affordance even without
  // the OS hand-cursor. cmd/ctrl held = "ready to invoke" expand.
  //
  // Drag and magnet are bypassed in this mode; the keyboard shortcut
  // is the only summoning gesture.
  useEffect(() => {
    if (mode !== 'cursor') {
      setCursorPos(null);
      setOverInteractive(false);
      setCmdHeld(false);
      return;
    }

    // Inject a stylesheet that hides every cursor on the page. We
    // attach it to the host page's <html>, not our shadow root, because
    // `cursor: none` on the shadow host doesn't reach descendants in
    // the host page.
    const style = document.createElement('style');
    style.id = 'gauntlet-pill-cursor-style';
    style.textContent = `
      html, body, * { cursor: none !important; }
    `;
    document.documentElement.appendChild(style);

    let raf: number | null = null;
    let latest: { x: number; y: number } | null = null;

    function pump() {
      raf = null;
      if (!latest) return;
      setCursorPos(latest);
      // Detect interactive element under the pointer. document.elementFromPoint
      // returns the topmost element including elements inside our own shadow
      // host — but we've set pointer-events: none on the pill in cursor mode
      // so the pill itself isn't picked.
      const el = document.elementFromPoint(latest.x, latest.y) as Element | null;
      const interactive = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, [contenteditable=""], [contenteditable="true"]',
      );
      setOverInteractive((prev) => (prev === interactive ? prev : interactive));
    }

    function onMove(ev: PointerEvent) {
      latest = { x: ev.clientX, y: ev.clientY };
      if (raf == null) raf = window.requestAnimationFrame(pump);
    }
    function onKeyDown(ev: KeyboardEvent) {
      if (ev.metaKey || ev.ctrlKey) setCmdHeld(true);
    }
    function onKeyUp(ev: KeyboardEvent) {
      if (!ev.metaKey && !ev.ctrlKey) setCmdHeld(false);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('keyup', onKeyUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (raf != null) cancelAnimationFrame(raf);
      style.remove();
      setCursorPos(null);
      setOverInteractive(false);
      setCmdHeld(false);
    };
  }, [mode]);

  // Magnet — passive pointermove updates the cursor ref; a single rAF
  // pumps the React state at frame rate so we never thrash transforms.
  // Effect bails out during drag (the dragger needs full control of
  // the pill's position).
  useEffect(() => {
    function onPointer(ev: PointerEvent) {
      cursorRef.current = { x: ev.clientX, y: ev.clientY };
      if (magnetRafRef.current != null) return;
      magnetRafRef.current = window.requestAnimationFrame(() => {
        magnetRafRef.current = null;
        if (dragStateRef.current) return;
        const cursor = cursorRef.current;
        if (!cursor) return;
        const btn = buttonRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cursor.x - cx;
        const dy = cursor.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > MAGNET_RADIUS_PX || dist < 1) {
          setMagnet((prev) =>
            prev.dx === 0 && prev.dy === 0 && !prev.near
              ? prev
              : { dx: 0, dy: 0, near: false },
          );
          return;
        }
        // Linear pull from MIN at the radius edge to MAX at the centre.
        const t = 1 - dist / MAGNET_RADIUS_PX;
        const pull =
          MAGNET_PULL_MIN_PX + (MAGNET_PULL_MAX_PX - MAGNET_PULL_MIN_PX) * t;
        const ux = dx / dist;
        const uy = dy / dist;
        setMagnet({ dx: ux * pull, dy: uy * pull, near: true });
      });
    }
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
      if (magnetRafRef.current != null) {
        cancelAnimationFrame(magnetRafRef.current);
        magnetRafRef.current = null;
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
        onPersistPosition(pos);
        return;
      }
      onClick();
    },
    [pos, onClick, onPersistPosition],
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

  // Resolve flash → success/error class names. Both names exist in CSS
  // so legacy --flash-* selectors still trigger the same animations.
  const flashClass =
    flash === 'ok'
      ? 'gauntlet-pill--success'
      : flash === 'fail'
        ? 'gauntlet-pill--error'
        : '';
  const isCursorMode = mode === 'cursor';
  const className = [
    'gauntlet-pill',
    idle && !isCursorMode ? 'gauntlet-pill--idle' : '',
    !isCursorMode && magnet.near ? 'gauntlet-pill--near-cursor' : '',
    hasContext ? 'gauntlet-pill--context' : '',
    disconnected ? 'gauntlet-pill--disconnected' : '',
    flashClass,
    phase && phase !== 'idle' ? `gauntlet-pill--phase-${phase}` : '',
    isCursorMode ? 'gauntlet-pill--cursor-mode' : '',
    isCursorMode && overInteractive ? 'gauntlet-pill--over-interactive' : '',
    isCursorMode && cmdHeld ? 'gauntlet-pill--cmd-held' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Position style — corner mode uses bottom/right + magnet transform;
  // cursor mode uses top/left from the latest pointer coords with a
  // small offset so the pill points at the cursor tip rather than
  // centring on it.
  const styleProps: React.CSSProperties = isCursorMode
    ? cursorPos
      ? {
          top: `${cursorPos.y - 6}px`,
          left: `${cursorPos.x + 4}px`,
          right: 'auto',
          bottom: 'auto',
          // Pill must not intercept page clicks — it IS the cursor.
          // The keyboard shortcut summons the cápsula in this mode.
          pointerEvents: 'none',
        }
      : {
          // Pre-pointermove (just entered cursor mode): keep the pill
          // visible at last-known corner so the operator sees it
          // morphing instead of disappearing.
          bottom: `${pos.bottom}px`,
          right: `${pos.right}px`,
          pointerEvents: 'none',
        }
    : {
        bottom: `${pos.bottom}px`,
        right: `${pos.right}px`,
        // Magnet offset via transform — never touches layout, stays on
        // the compositor thread. Drag clears the offset implicitly by
        // gating the rAF write.
        transform:
          magnet.dx !== 0 || magnet.dy !== 0
            ? `translate3d(${magnet.dx}px, ${magnet.dy}px, 0)`
            : undefined,
      };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={className}
      style={styleProps}
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
  /* Transform transition tuned for the magnet — short enough to feel
     responsive, long enough to read as motion rather than a snap. */
  transition:
    transform 220ms cubic-bezier(0.2, 0, 0, 1),
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
.gauntlet-pill--flash-ok,
.gauntlet-pill--success {
  border-color: rgba(122, 180, 138, 0.85) !important;
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-flash-ok 1400ms ease-out 1;
}
.gauntlet-pill--flash-fail,
.gauntlet-pill--error {
  border-color: rgba(212, 96, 60, 0.85) !important;
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-flash-fail 600ms ease-in-out 1;
}

/* Near-cursor — subtle visual confirmation when the pill drifts toward
   the cursor. Brighter ring + slight upscale; never aggressive. */
.gauntlet-pill--near-cursor {
  border-color: rgba(208, 122, 90, 0.75);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 22px rgba(208, 122, 90, 0.55),
    0 6px 18px rgba(0, 0, 0, 0.50);
}
.gauntlet-pill--near-cursor .gauntlet-pill__dot {
  animation-duration: 1.6s;
}

/* Context detected — a non-empty selection on the page. Slightly
   stronger pulse so the operator senses "ready" without reading. */
.gauntlet-pill--context {
  border-color: rgba(208, 122, 90, 0.80);
}
.gauntlet-pill--context .gauntlet-pill__dot {
  animation-duration: 1.4s;
  background: #ffd2b6;
}

/* Disconnected — backend last failed. A soft red ring states the pill
   is "live" but the brain isn't reachable. Doctrine: never silent. */
.gauntlet-pill--disconnected {
  border-color: rgba(212, 96, 60, 0.65) !important;
  box-shadow:
    0 0 0 1px rgba(212, 96, 60, 0.25),
    0 0 12px rgba(212, 96, 60, 0.40),
    0 4px 12px rgba(0, 0, 0, 0.40);
}
.gauntlet-pill--disconnected .gauntlet-pill__dot {
  background: #f1a4ad;
  box-shadow: 0 0 6px rgba(241, 164, 173, 0.85);
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

/* ── Cursor-mode — pill becomes the visual cursor ────────────────────────
   The component flips top/left + pointer-events: none in JS; CSS
   tightens the visual: smaller resting size (cursor needs to feel
   precise, not chunky), softer glow, transition tuned for follow
   smoothness. The OS cursor itself is hidden via a stylesheet
   injected on <html> by the component. */
.gauntlet-pill--cursor-mode {
  width: 14px;
  height: 14px;
  /* Position transitions are killed in cursor mode — top/left jumps
     pixel-accurate per rAF tick, no easing. Other transitions stay so
     the morph between states (interactive / cmd held) feels live. */
  transition:
    width 200ms cubic-bezier(0.2, 0, 0, 1),
    height 200ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms ease,
    box-shadow 200ms ease,
    opacity 200ms ease;
  animation: none;
}
.gauntlet-pill--cursor-mode .gauntlet-pill__mark {
  width: 6px;
  height: 6px;
  border-radius: 2px;
}
.gauntlet-pill--cursor-mode .gauntlet-pill__dot {
  width: 2px;
  height: 2px;
}

/* Over an interactive element — Pill morphs to a slightly larger ring
   with stronger ember glow so the operator senses click affordance. */
.gauntlet-pill--over-interactive {
  width: 22px;
  height: 22px;
  border-color: rgba(208, 122, 90, 0.85);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.35),
    0 0 18px rgba(208, 122, 90, 0.55),
    0 4px 10px rgba(0, 0, 0, 0.30);
}

/* Cmd / Ctrl held — "ready to invoke" expand. The keyboard shortcut
   is the summon path in cursor mode; this state confirms the
   modifier is registered before the operator commits. */
.gauntlet-pill--cmd-held {
  width: 26px;
  height: 26px;
  border-color: rgba(208, 122, 90, 1);
  box-shadow:
    0 0 0 2px rgba(208, 122, 90, 0.45),
    0 0 28px rgba(208, 122, 90, 0.65);
}
.gauntlet-pill--cmd-held .gauntlet-pill__mark {
  width: 10px;
  height: 10px;
}
`;
