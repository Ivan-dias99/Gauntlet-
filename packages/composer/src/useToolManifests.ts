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
// built-in actions. Lives outside Capsule.tsx so the orchestrator stays
// under the Lei do Capsule budget (CLAUDE.md).
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
        if (!cancelled) setToolManifests(sanitizeToolManifests(tools));
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

// Defensive shape check — backend can be older, mocked, or compromised;
// the palette renders these strings as labels and we don't want a bad
// payload to crash render or surface arbitrary content from a non-typed
// field. Drops anything without a string `name`; keeps the rest as-is.
function sanitizeToolManifests(tools: unknown): ToolManifest[] {
  if (!Array.isArray(tools)) return [];
  return tools.filter(
    (t): t is ToolManifest => !!t && typeof t === 'object' && typeof (t as ToolManifest).name === 'string',
  );
}
