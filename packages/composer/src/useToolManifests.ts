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

// Failure leaves the lists empty so the palette still renders the
// built-in actions.
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
