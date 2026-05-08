// Capsule placement — pure geometry, no React, no DOM.
//
// The capsule is always a floating, viewport-safe shape. computePosition
// picks the best side relative to the anchor (below/above, right/left)
// and clamps the final corner so the capsule never spills off-screen.
//
// The width/height come from CSS (clamp(560,72vw,820) × clamp(420,72vh,560))
// so we estimate the rendered size from the viewport here. That's good
// enough for placement: the precise final size is set by the browser
// after layout, and the clamp leaves a 16px viewport pad on every side.
//
// Kept pure (no React, no DOM access) so it stays unit-testable and
// reusable from popup-window callers / smoke tests.

import { type SelectionRect } from './types';

const VIEWPORT_PAD = 16;
const ANCHOR_GAP = 12;

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface CapsuleSize {
  width: number;
  height: number;
}

export type CapsulePlacement = 'above' | 'below' | 'right' | 'left' | 'center';

export interface CapsulePosition {
  top: number;
  left: number;
  placement: CapsulePlacement;
}

// Mirror of the CSS clamps in CAPSULE_CSS — kept in lockstep so the
// placement maths matches the actually-rendered capsule. If you tweak
// either, tweak both.
export function estimateCapsuleSize(vw: number, vh: number): CapsuleSize {
  const small = vw <= 600;
  if (small) {
    return {
      width: Math.max(0, vw - 24),
      height: Math.max(0, vh - 24),
    };
  }
  const width = clamp(0.72 * vw, 560, 820);
  const height = clamp(0.72 * vh, 420, 560);
  return { width, height };
}

export function computeCapsulePosition(
  anchor: SelectionRect | null,
  viewport: ViewportSize,
  capsule: CapsuleSize,
): CapsulePosition {
  // No anchor → center. Caller should use the centered class instead of
  // the inline style, but we still return a sensible top/left so this
  // function stays usable in tests / popup-window callers.
  if (!anchor) {
    return {
      top: Math.max(VIEWPORT_PAD, Math.floor((viewport.height - capsule.height) / 2)),
      left: Math.max(VIEWPORT_PAD, Math.floor((viewport.width - capsule.width) / 2)),
      placement: 'center',
    };
  }

  // Available space on each side of the anchor, accounting for the
  // viewport padding.
  const roomBelow = viewport.height - (anchor.y + anchor.height) - ANCHOR_GAP - VIEWPORT_PAD;
  const roomAbove = anchor.y - ANCHOR_GAP - VIEWPORT_PAD;
  const roomRight = viewport.width - (anchor.x + anchor.width) - ANCHOR_GAP - VIEWPORT_PAD;
  const roomLeft = anchor.x - ANCHOR_GAP - VIEWPORT_PAD;

  const fitsBelow = roomBelow >= capsule.height;
  const fitsAbove = roomAbove >= capsule.height;
  const fitsRight = roomRight >= capsule.width;
  const fitsLeft = roomLeft >= capsule.width;

  let placement: CapsulePlacement;
  let top: number;
  let left: number;

  if (fitsBelow) {
    placement = 'below';
    top = anchor.y + anchor.height + ANCHOR_GAP;
    // Horizontal: prefer left-aligned with the anchor, but shift left
    // when that would push past the right edge.
    left = anchor.x;
  } else if (fitsAbove) {
    placement = 'above';
    top = anchor.y - ANCHOR_GAP - capsule.height;
    left = anchor.x;
  } else if (fitsRight) {
    placement = 'right';
    left = anchor.x + anchor.width + ANCHOR_GAP;
    // Centre vertically on the anchor so the capsule reads as
    // "next to" rather than "below and to the right of".
    top = Math.floor(anchor.y + anchor.height / 2 - capsule.height / 2);
  } else if (fitsLeft) {
    placement = 'left';
    left = anchor.x - ANCHOR_GAP - capsule.width;
    top = Math.floor(anchor.y + anchor.height / 2 - capsule.height / 2);
  } else {
    // No side fits — center the capsule. This happens on tight viewports
    // or when the anchor sits dead-centre with the capsule larger than
    // any quadrant. Internal scrolling handles the rest.
    placement = 'center';
    top = Math.floor((viewport.height - capsule.height) / 2);
    left = Math.floor((viewport.width - capsule.width) / 2);
  }

  // Final clamp — never let the corner overflow the viewport. The CSS
  // max-height/width keep the rendered size <= the viewport minus the
  // pad, so this is safe even when the chosen side was tight.
  const maxTop = viewport.height - capsule.height - VIEWPORT_PAD;
  const maxLeft = viewport.width - capsule.width - VIEWPORT_PAD;
  top = clamp(top, VIEWPORT_PAD, Math.max(VIEWPORT_PAD, maxTop));
  left = clamp(left, VIEWPORT_PAD, Math.max(VIEWPORT_PAD, maxLeft));

  return { top, left, placement };
}
