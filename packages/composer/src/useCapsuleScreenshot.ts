// Capsule screenshot bootstrap — fire-and-forget viewport capture on
// mount when the pref is on. Extracted from Capsule.tsx during the
// v1 polish pass to keep `Capsule.tsx` under the Wave 2 800-line
// budget; the logic itself (pref source order, capability check,
// graceful failure) is unchanged.
//
// Pref source order:
//   1. Local toggle (chrome.storage.local) — explicit user choice wins.
//   2. Backend settings.screenshot_default — operator-set default.
// Skipped in popup mode (no executor) — capturing there returns a
// screenshot of the popup window itself, which is useless and
// visually recursive.

import { useEffect, useState } from 'react';
import { type Ambient } from './ambient';
import { type PillPrefs } from './pill-prefs';

export interface UseCapsuleScreenshotArgs {
  ambient: Ambient;
  prefs: PillPrefs;
  // Source-of-truth ordering matters: the local pref WINS unless it is
  // false, in which case the operator-side default kicks in. Passing
  // `settings.screenshot_default` as a primitive boolean keeps the
  // effect dependency narrow (no whole-settings re-run on every change).
  screenshotDefault: boolean;
}

export function useCapsuleScreenshot({
  ambient,
  prefs,
  screenshotDefault,
}: UseCapsuleScreenshotArgs): string | null {
  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    // Skip when the host shell can't capture (desktop default, browser
    // popup window) — both screenshot capability and a working
    // screenshot adapter must be present.
    if (!ambient.capabilities.screenshot || !ambient.screenshot) return;
    let cancelled = false;
    void prefs
      .readScreenshotEnabled()
      .then((enabledLocal) => {
        // The local pref defaults to false in pill-prefs. If the
        // operator-side default is true, we honor it as the boot value
        // unless the user already toggled it locally. To avoid a third
        // tri-state pref we treat "local was never set" the same as
        // "local is false" — operator default only applies when local
        // is false. That biases toward minimal screenshot capture
        // (privacy wins on draws).
        const enabled = enabledLocal || screenshotDefault;
        if (cancelled || !enabled) return;
        void ambient
          .screenshot!.capture()
          .then((dataUrl) => {
            if (cancelled || !dataUrl) return;
            setScreenshot(dataUrl);
          })
          .catch(() => {
            // Silent — screenshot is opt-in and best-effort.
          });
      })
      .catch(() => {
        // Pref read failed (storage unavailable / corrupted) — stay
        // off so privacy wins on draws.
      });
    return () => {
      cancelled = true;
    };
  }, [ambient, prefs, screenshotDefault]);

  return screenshot;
}
