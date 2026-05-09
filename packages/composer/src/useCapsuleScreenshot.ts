// Capsule screenshot bootstrap — fire-and-forget viewport capture
// on mount when the pref is on. Pref source order: local toggle wins;
// `settings.screenshot_default` only kicks in when the local pref is
// false, biasing toward minimal capture (privacy wins on draws).

import { useEffect, useState } from 'react';
import { type Ambient } from './ambient';
import { type PillPrefs } from './pill-prefs';
import { swallow } from './helpers';

export interface UseCapsuleScreenshotArgs {
  ambient: Ambient;
  prefs: PillPrefs;
  screenshotDefault: boolean;
}

export function useCapsuleScreenshot({
  ambient,
  prefs,
  screenshotDefault,
}: UseCapsuleScreenshotArgs): string | null {
  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    if (!ambient.capabilities.screenshot || !ambient.screenshot) return;
    let cancelled = false;
    void prefs
      .readScreenshotEnabled()
      .then((enabledLocal) => {
        const enabled = enabledLocal || screenshotDefault;
        if (cancelled || !enabled) return;
        void ambient
          .screenshot!.capture()
          .then((dataUrl) => {
            if (cancelled || !dataUrl) return;
            setScreenshot(dataUrl);
          })
          .catch(swallow);
      })
      .catch(swallow);
    return () => {
      cancelled = true;
    };
  }, [ambient, prefs, screenshotDefault]);

  return screenshot;
}
