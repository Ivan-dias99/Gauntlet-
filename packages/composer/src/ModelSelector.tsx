// ModelSelector — compact chip in the cápsula header that shows the
// active model's provider mark and label. Clicking opens a popover
// grid of every model the gateway knows about (read from
// /gateway/catalogue), with the selected one carrying a cyan glow +
// slow breath. Selection persists via ambient.storage as
// `gauntlet:model_pinned` and is threaded into composer-client's
// detectIntent() call as `model_override`.
//
// Doctrine notes:
//   * Lives outside Capsule.tsx (Capsule Law — budget descending).
//   * Uses Aether v4 tokens only (--gx-* via class names in capsule.css).
//   * Selected micro-reaction = breath via gauntlet-cap-pulse keyframe;
//     hover scale via --gx-dur-fast; reduced-motion collapses both.
//   * Models with available=false render greyed + non-clickable + a
//     mono "no key" tag so the operator sees the gating reason.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComposerClient, ModelCatalogueEntry } from './composer-client';
import type { AmbientStorage } from './ambient';
import { getProviderFamily, getProviderLabel, ModelLogo } from './ModelLogos';

const STORAGE_KEY = 'gauntlet:model_pinned';

export interface ModelSelectorProps {
  client: ComposerClient;
  pinned: string | null;
  onPin: (modelId: string | null) => void;
}

export function ModelSelector({ client, pinned, onPin }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [catalogue, setCatalogue] = useState<ModelCatalogueEntry[] | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // One-shot fetch on mount. The catalogue is process-stable; we don't
  // poll. If the backend is unreachable, the chip silently degrades to
  // showing the pinned id (or "auto") and the popover reports the failure.
  useEffect(() => {
    let cancelled = false;
    void client.getModelCatalogue().then((res) => {
      if (cancelled) return;
      setCatalogue(res.models);
      setActiveProvider(res.active_provider);
    }).catch(() => { if (!cancelled) setCatalogue([]); });
    return () => { cancelled = true; };
  }, [client]);

  // Click-outside + Escape close the popover. We don't trap focus —
  // this is a quick toggle, not a modal; pressing Escape inside the
  // input shouldn't be hijacked.
  useEffect(() => {
    if (!open) return;
    const onDoc = (ev: MouseEvent) => {
      if (!wrapRef.current?.contains(ev.target as Node)) setOpen(false);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const activeEntry = pinned
    ? catalogue?.find((m) => m.model_id === pinned) ?? null
    : null;
  const chipModelId = activeEntry?.model_id ?? 'auto';
  const chipFamily = activeEntry ? getProviderFamily(activeEntry.model_id) : 'unknown';
  const chipLabel = activeEntry ? shortName(activeEntry.model_id) : 'auto';

  const choose = useCallback((modelId: string | null) => {
    onPin(modelId);
    setOpen(false);
  }, [onPin]);

  return (
    <div className="gauntlet-model-selector" ref={wrapRef}>
      <button
        type="button"
        className={`gauntlet-model-chip${activeEntry ? ' gauntlet-model-chip--pinned' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={activeEntry ? `Modelo fixado: ${chipModelId}` : 'Escolher modelo (auto)'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="gauntlet-model-chip__mark" aria-hidden>
          <ModelLogo family={chipFamily} size={14} />
        </span>
        <span className="gauntlet-model-chip__label">{chipLabel}</span>
        <span className="gauntlet-model-chip__caret" aria-hidden>▾</span>
      </button>

      {open && (
        <div
          className="gauntlet-model-pop"
          role="dialog"
          aria-label="Selecionar modelo"
        >
          <header className="gauntlet-model-pop__head">
            <span className="gauntlet-model-pop__eyebrow">modelos · gateway</span>
            <button
              type="button"
              className="gauntlet-model-pop__auto"
              onClick={() => choose(null)}
              title="Deixar o gateway escolher por intent"
            >
              auto {pinned === null ? '·' : ''}
            </button>
          </header>
          <div className="gauntlet-model-pop__grid">
            {(catalogue ?? []).map((m) => {
              const family = getProviderFamily(m.model_id);
              const isPinned = m.model_id === pinned;
              const disabled = !m.available;
              return (
                <button
                  key={m.model_id}
                  type="button"
                  className={[
                    'gauntlet-model-card',
                    isPinned ? 'gauntlet-model-card--pinned' : '',
                    disabled ? 'gauntlet-model-card--disabled' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => !disabled && choose(m.model_id)}
                  disabled={disabled}
                  aria-pressed={isPinned}
                  title={
                    disabled
                      ? `${m.model_id} · ${getProviderLabel(family)} key não está setada neste backend`
                      : m.notes || m.model_id
                  }
                >
                  <span className="gauntlet-model-card__mark" aria-hidden>
                    <ModelLogo family={family} size={22} title={getProviderLabel(family)} />
                  </span>
                  <span className="gauntlet-model-card__name">{shortName(m.model_id)}</span>
                  <span className="gauntlet-model-card__provider">
                    {getProviderLabel(family)}
                    {disabled && ' · sem chave'}
                  </span>
                </button>
              );
            })}
            {catalogue !== null && catalogue.length === 0 && (
              <p className="gauntlet-model-pop__empty">
                catálogo vazio — backend offline ou /gateway/catalogue indisponível
              </p>
            )}
          </div>
          {activeProvider && (
            <footer className="gauntlet-model-pop__foot">
              backend activo: <strong>{activeProvider}</strong>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

// usePinnedModel — load + persist the operator's choice via the
// shell-provided storage adapter (chrome.storage / Tauri store).
// Returned tuple matches React.useState so Capsule.tsx adopts it
// without ceremony.
export function usePinnedModel(
  storage: AmbientStorage,
): [string | null, (next: string | null) => void] {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    void storage.get<string>(STORAGE_KEY).then((v) => {
      if (typeof v === 'string' && v.length > 0) setValue(v);
    });
  }, [storage]);
  const set = useCallback((next: string | null) => {
    setValue(next);
    if (next === null) void storage.remove(STORAGE_KEY);
    else void storage.set(STORAGE_KEY, next);
  }, [storage]);
  return [value, set];
}

// Trim provider prefix so the chip stays narrow. `openai/gpt-oss-120b`
// → `gpt-oss-120b`, `claude-sonnet-4-6` stays as-is (already short).
function shortName(modelId: string): string {
  const slash = modelId.lastIndexOf('/');
  return slash >= 0 ? modelId.slice(slash + 1) : modelId;
}
