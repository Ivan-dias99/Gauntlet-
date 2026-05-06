// Pill preferences — small typed wrapper over chrome.storage.local.
//
// Two concerns live here:
//   * pillPosition — where the pill sits on screen, in viewport
//     coordinates of the bottom-right corner (so it follows the right
//     edge on resize). Persisted globally across all tabs.
//   * dismissedDomains — hostnames where the pill should not mount at
//     all. Right-click → dismiss adds the current hostname here. The
//     content script reads this list before building the shadow host
//     so we don't even pay the React mount cost on opted-out sites.
//
// chrome.storage.local is async and survives across tabs / sessions
// without any sync penalty. Don't use localStorage — that's the host
// page's storage, scoped per-origin, which would partition the prefs
// across sites and let pages snoop on what we wrote.

import type { PillPosition } from '@gauntlet/composer';

export type { PillPosition };

const KEY_POSITION = 'gauntlet:pill_position';
const KEY_DISMISSED = 'gauntlet:dismissed_domains';
const KEY_SCREENSHOT_ENABLED = 'gauntlet:screenshot_enabled';

export const DEFAULT_PILL_POSITION: PillPosition = { bottom: 16, right: 16 };

export async function readPillPosition(): Promise<PillPosition> {
  try {
    const got = await chrome.storage.local.get(KEY_POSITION);
    const raw = got[KEY_POSITION];
    if (
      raw &&
      typeof raw === 'object' &&
      typeof (raw as PillPosition).bottom === 'number' &&
      typeof (raw as PillPosition).right === 'number'
    ) {
      return clampPosition(raw as PillPosition);
    }
  } catch {
    // chrome.storage unavailable (extremely rare — happens in some
    // privacy modes or when permissions weren't granted). Fall through
    // to defaults rather than blocking the pill from appearing.
  }
  return DEFAULT_PILL_POSITION;
}

export async function writePillPosition(pos: PillPosition): Promise<void> {
  try {
    await chrome.storage.local.set({ [KEY_POSITION]: clampPosition(pos) });
  } catch {
    // Persist failure is non-fatal — the pill keeps the position
    // in memory until the next page load.
  }
}

export async function readDismissedDomains(): Promise<string[]> {
  try {
    const got = await chrome.storage.local.get(KEY_DISMISSED);
    const raw = got[KEY_DISMISSED];
    if (Array.isArray(raw)) {
      return raw.filter((x): x is string => typeof x === 'string');
    }
  } catch {
    // See note above.
  }
  return [];
}

export async function dismissDomain(hostname: string): Promise<void> {
  if (!hostname) return;
  const current = await readDismissedDomains();
  if (current.includes(hostname)) return;
  try {
    await chrome.storage.local.set({
      [KEY_DISMISSED]: [...current, hostname],
    });
  } catch {
    // Non-fatal.
  }
}

export async function restoreDomain(hostname: string): Promise<void> {
  if (!hostname) return;
  const current = await readDismissedDomains();
  const next = current.filter((h) => h !== hostname);
  if (next.length === current.length) return;
  try {
    await chrome.storage.local.set({ [KEY_DISMISSED]: next });
  } catch {
    // Non-fatal — caller will see stale state until next read.
  }
}

export async function isDomainDismissed(hostname: string): Promise<boolean> {
  if (!hostname) return false;
  const current = await readDismissedDomains();
  return current.includes(hostname);
}

// Screenshot capture is privacy-sensitive — a viewport snapshot can
// contain passwords, private DMs, banking balances. Off by default;
// the user opts in once via the settings drawer and the preference
// applies to every subsequent summon.
export async function readScreenshotEnabled(): Promise<boolean> {
  try {
    const got = await chrome.storage.local.get(KEY_SCREENSHOT_ENABLED);
    return got[KEY_SCREENSHOT_ENABLED] === true;
  } catch {
    return false;
  }
}

export async function writeScreenshotEnabled(enabled: boolean): Promise<void> {
  try {
    await chrome.storage.local.set({ [KEY_SCREENSHOT_ENABLED]: !!enabled });
  } catch {
    // Non-fatal.
  }
}

// Keep the pill on-screen even when the viewport is tiny or the user
// somehow persisted a wild position. The pill itself is 18px wide at
// rest (24px on hover, but base position is what's stored); we always
// want at least 4px of it visible.
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
