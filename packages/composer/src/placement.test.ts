// Pure-geometry tests — no React, no DOM. Exercises the placement
// decisions the cápsula relies on every render to stay viewport-safe.

import { describe, expect, it } from 'vitest';
import {
  computeCapsulePosition,
  estimateCapsuleSize,
  type CapsuleSize,
  type ViewportSize,
} from './placement';

const VP: ViewportSize = { width: 1280, height: 800 };
const SMALL_CAP: CapsuleSize = { width: 560, height: 420 };

describe('estimateCapsuleSize', () => {
  it('clamps to the small-screen branch when viewport <= 600', () => {
    const s = estimateCapsuleSize(400, 300);
    expect(s.width).toBe(376); // 400 - 24
    expect(s.height).toBe(276); // 300 - 24
  });

  it('returns the desktop clamps for typical viewports', () => {
    const s = estimateCapsuleSize(1280, 800);
    // 0.72 * 1280 = 921.6 → clamped to 820 max
    expect(s.width).toBe(820);
    // 0.72 * 800 = 576 → clamped to 560 max
    expect(s.height).toBe(560);
  });

  it('floors at the minimum even on tiny non-small viewports', () => {
    const s = estimateCapsuleSize(700, 700);
    // 0.72 * 700 = 504 → clamped up to 560
    expect(s.width).toBe(560);
    expect(s.height).toBe(504);
  });
});

describe('computeCapsulePosition', () => {
  it('centers when the anchor is null', () => {
    const pos = computeCapsulePosition(null, VP, SMALL_CAP);
    expect(pos.placement).toBe('center');
    // (800 - 420) / 2 = 190
    expect(pos.top).toBe(190);
    expect(pos.left).toBe(360);
  });

  it('places below when there is room beneath the anchor', () => {
    const anchor = { x: 100, y: 100, width: 200, height: 30 };
    const pos = computeCapsulePosition(anchor, VP, SMALL_CAP);
    expect(pos.placement).toBe('below');
    expect(pos.top).toBe(142); // anchor.y + anchor.height + ANCHOR_GAP(12)
    expect(pos.left).toBe(100); // aligned to anchor.x
  });

  it('places above when the anchor sits at the bottom of the viewport', () => {
    const anchor = { x: 100, y: 720, width: 200, height: 30 };
    const pos = computeCapsulePosition(anchor, VP, SMALL_CAP);
    expect(pos.placement).toBe('above');
    // top = anchor.y - ANCHOR_GAP(12) - capsule.height(420) = 288
    expect(pos.top).toBe(288);
  });

  it('clamps the corner so the capsule never spills off-screen', () => {
    // Anchor near the right edge — below is fine but the left needs clamping.
    const anchor = { x: 1200, y: 50, width: 60, height: 30 };
    const pos = computeCapsulePosition(anchor, VP, SMALL_CAP);
    // Whatever the placement chosen, the top-left corner stays in pad.
    expect(pos.top).toBeGreaterThanOrEqual(16);
    expect(pos.left).toBeGreaterThanOrEqual(16);
    // And max corner does not push the capsule past the viewport.
    expect(pos.top + SMALL_CAP.height).toBeLessThanOrEqual(VP.height);
    expect(pos.left + SMALL_CAP.width).toBeLessThanOrEqual(VP.width);
  });

  it('falls back to center when no side fits', () => {
    // Bigger capsule than any quadrant of the viewport — every side fails.
    const tinyVp: ViewportSize = { width: 600, height: 400 };
    const big: CapsuleSize = { width: 540, height: 360 };
    const anchor = { x: 280, y: 180, width: 40, height: 40 };
    const pos = computeCapsulePosition(anchor, tinyVp, big);
    expect(pos.placement).toBe('center');
  });
});
