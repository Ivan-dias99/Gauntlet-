import { useEffect, useState } from 'react';
import { type ComposerClient } from './composer-client';
import { swallow } from './helpers';
import { type PillPrefs } from './pill-prefs';
import { type ToolManifest } from './types';

export interface UseToolManifestsResult {
  toolManifests: ToolManifest[];
  paletteRecent: string[];
  setPaletteRecent: React.Dispatch<React.SetStateAction<string[]>>;
}

// useToolManifests — fetches the tool manifests + recently-used ids on
// mount. Failure leaves the lists empty so the palette still renders
// the built-in actions. Extracted from Capsule to keep the orchestrator
// under the Lei do Capsule budget.
export function useToolManifests(
  client: ComposerClient,
  prefs: PillPrefs,
): UseToolManifestsResult {
  const [toolManifests, setToolManifests] = useState<ToolManifest[]>([]);
  const [paletteRecent, setPaletteRecent] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void client
      .getToolManifests()
      .then((tools) => {
        if (!cancelled) setToolManifests(tools);
      })
      .catch(swallow);
    void prefs
      .readPaletteRecent()
      .then((recent) => {
        if (!cancelled) setPaletteRecent(recent);
      })
      .catch(swallow);
    return () => {
      cancelled = true;
    };
  }, [client, prefs]);

  return { toolManifests, paletteRecent, setPaletteRecent };
}
