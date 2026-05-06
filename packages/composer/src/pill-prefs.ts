// Pill preferences — shell-agnostic via Ambient.storage.
//
// Three concerns live here:
//   * pillPosition — where the pill sits (browser only; desktop doesn't
//     render the pill).
//   * dismissedDomains — hostnames where the pill should not mount
//     (browser only).
//   * screenshotEnabled — opt-in viewport screenshot (both shells).
//
// The cápsula and pill consume these through
// createPillPrefs(ambient.storage) instead of touching chrome.storage
// or localStorage directly. The factory parameter is named `store`
// (not `storage`) to avoid colliding with WXT's auto-import of
// `wxt/storage` — same shape, different identifier.

import type { AmbientStorage } from './ambient';

const KEY_POSITION = 'gauntlet:pill_position';
const KEY_DISMISSED = 'gauntlet:dismissed_domains';
const KEY_SCREENSHOT_ENABLED = 'gauntlet:screenshot_enabled';

export interface PillPosition {
  bottom: number;
  right: number;
}

export const DEFAULT_PILL_POSITION: PillPosition = { bottom: 16, right: 16 };

// Keep the pill on-screen even when the viewport is tiny or the user
// somehow persisted a wild position. The pill itself is 18px wide at
// rest; we always want at least 4px of it visible.
function clampPosition(pos: PillPosition): PillPosition {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const PILL = 18;
  const MIN_VISIBLE = 4;
  const maxRight = vw - MIN_VISIBLE;
  const maxBottom = vh - MIN_VISIBLE;
  return {
    right: Math.max(-(PILL - MIN_VISIBLE), Math.min(maxRight, pos.right)),
    bottom: Math.max(-(PILL - MIN_VISIBLE), Math.min(maxBottom, pos.bottom)),
  };
}

export interface PillPrefs {
  readPillPosition(): Promise<PillPosition>;
  writePillPosition(pos: PillPosition): Promise<void>;
  readDismissedDomains(): Promise<string[]>;
  dismissDomain(hostname: string): Promise<void>;
  restoreDomain(hostname: string): Promise<void>;
  isDomainDismissed(hostname: string): Promise<boolean>;
  readScreenshotEnabled(): Promise<boolean>;
  writeScreenshotEnabled(enabled: boolean): Promise<void>;
}

export function createPillPrefs(store: AmbientStorage): PillPrefs {
  return {
    async readPillPosition() {
      const raw = await store.get<PillPosition>(KEY_POSITION);
      if (
        raw &&
        typeof raw === 'object' &&
        typeof raw.bottom === 'number' &&
        typeof raw.right === 'number'
      ) {
        return clampPosition(raw);
      }
      return DEFAULT_PILL_POSITION;
    },
    async writePillPosition(pos) {
      await store.set(KEY_POSITION, clampPosition(pos));
    },
    async readDismissedDomains() {
      const raw = await store.get<string[]>(KEY_DISMISSED);
      if (Array.isArray(raw)) {
        return raw.filter((x): x is string => typeof x === 'string');
      }
      return [];
    },
    async dismissDomain(hostname) {
      if (!hostname) return;
      const current = await this.readDismissedDomains();
      if (current.includes(hostname)) return;
      await store.set(KEY_DISMISSED, [...current, hostname]);
    },
    async restoreDomain(hostname) {
      if (!hostname) return;
      const current = await this.readDismissedDomains();
      const next = current.filter((h) => h !== hostname);
      if (next.length === current.length) return;
      await store.set(KEY_DISMISSED, next);
    },
    async isDomainDismissed(hostname) {
      if (!hostname) return false;
      const current = await this.readDismissedDomains();
      return current.includes(hostname);
    },
    async readScreenshotEnabled() {
      const raw = await store.get<boolean>(KEY_SCREENSHOT_ENABLED);
      return raw === true;
    },
    async writeScreenshotEnabled(enabled) {
      await store.set(KEY_SCREENSHOT_ENABLED, !!enabled);
    },
  };
}
