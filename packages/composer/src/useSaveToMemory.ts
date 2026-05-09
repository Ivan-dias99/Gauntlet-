// useSaveToMemory — extracted from Capsule.tsx (Wave 2 refactor).
//
// Wraps the POST /memory/records call so the cápsula can save the
// current compose response (or selection) as an operator note without
// the orchestrator owning the network shape. Failures surface via the
// onError callback so the caller controls UI placement; success pings
// onSaved so the caller can flash a transient confirmation.
//
// Doctrine: each feature lives in its own seam. Capsule.tsx is the
// orchestrator, not the implementation.

import { useCallback } from 'react';
import type { ComposerClient } from './composer-client';
import type { Ambient } from './ambient';
import type { SelectionSnapshot } from './types';

export interface SaveableComposePlan {
  compose?: string;
}

export interface UseSaveToMemoryArgs {
  ambient: Ambient;
  client: ComposerClient;
  plan: SaveableComposePlan | null;
  snapshot: SelectionSnapshot;
  userInput: string;
  onSaved: (label: string) => void;
  onError: (message: string) => void;
}

export function useSaveToMemory({
  ambient,
  client,
  plan,
  snapshot,
  userInput,
  onSaved,
  onError,
}: UseSaveToMemoryArgs): () => Promise<void> {
  return useCallback(async () => {
    const body = plan?.compose || snapshot.text || userInput.trim();
    if (!body) {
      onError('Nada para guardar — escreve um pedido ou recebe uma resposta.');
      return;
    }
    const topic =
      (userInput.trim() || snapshot.pageTitle || 'cápsula note').slice(0, 200);
    try {
      // Goes through ambient.transport so the request originates from
      // the right origin in each shell (chrome-extension:// proxied
      // through the service worker; direct fetch on desktop).
      await ambient.transport.fetchJson(
        'POST',
        `${client.backendUrl}/memory/records`,
        { topic, body, kind: 'note', scope: 'user' },
      );
      onSaved('saved');
    } catch (err) {
      onError(
        err instanceof Error ? `memória: ${err.message}` : 'memória: falhou',
      );
    }
  }, [ambient, client, plan, snapshot, userInput, onSaved, onError]);
}
