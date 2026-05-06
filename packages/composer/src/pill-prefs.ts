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
const KEY_THEME = 'gauntlet:theme';
const KEY_PALETTE_RECENT = 'gauntlet:palette_recent';
const KEY_PILL_MODE = 'gauntlet:pill_mode';
const PALETTE_RECENT_MAX = 8;

export type CapsuleTheme = 'light' | 'dark';
export const DEFAULT_CAPSULE_THEME: CapsuleTheme = 'light';

// Pill mode — corner is the safe legacy (bottom-right resting state,
// click to summon). Cursor is the doctrine-literal mode where the OS
// cursor is hidden and the pill becomes the visual pointer; the
// operator summons the cápsula via the keyboard shortcut.
export type PillMode = 'corner' | 'cursor';
export const DEFAULT_PILL_MODE: PillMode = 'corner';

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
  readTheme(): Promise<CapsuleTheme>;
  writeTheme(theme: CapsuleTheme): Promise<void>;
  readPaletteRecent(): Promise<string[]>;
  notePaletteUse(id: string): Promise<void>;
  readPillMode(): Promise<PillMode>;
  writePillMode(mode: PillMode): Promise<void>;
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
    async readTheme() {
      const raw = await store.get<CapsuleTheme>(KEY_THEME);
      return raw === 'dark' || raw === 'light' ? raw : DEFAULT_CAPSULE_THEME;
    },
    async writeTheme(theme) {
      await store.set(KEY_THEME, theme);
    },
    async readPaletteRecent() {
      const raw = await store.get<string[]>(KEY_PALETTE_RECENT);
      if (!Array.isArray(raw)) return [];
      return raw.filter((x): x is string => typeof x === 'string').slice(0, PALETTE_RECENT_MAX);
    },
    async notePaletteUse(id) {
      if (!id) return;
      const current = await this.readPaletteRecent();
      const next = [id, ...current.filter((x) => x !== id)].slice(0, PALETTE_RECENT_MAX);
      await store.set(KEY_PALETTE_RECENT, next);
    },
    async readPillMode() {
      const raw = await store.get<PillMode>(KEY_PILL_MODE);
      return raw === 'cursor' || raw === 'corner' ? raw : DEFAULT_PILL_MODE;
    },
    async writePillMode(mode) {
      await store.set(KEY_PILL_MODE, mode);
    },
  };
}
