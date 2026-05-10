// LeftPanel — the cápsula's brand + context column (header with the
// Gauntlet mark and settings/close buttons, optional settings drawer
// slot, and the context readout — current selection or a compact
// summary when there is none).
//
// Pure presentational. Capsule wires the callbacks and decides what
// to render in the settings slot. The settings drawer is passed as a
// ReactNode (rather than props) so the LeftPanel doesn't need to know
// the drawer's contract.

import { type ReactNode } from 'react';
import { CompactContextSummary } from './CompactContextSummary';
import { truncate } from './helpers';
import { type CapsuleTheme } from './pill-prefs';
import { ThemeToggle } from './ThemeToggle';
import { type SelectionSnapshot } from './types';

export interface LeftPanelProps {
  snapshot: SelectionSnapshot;
  modelUsed?: string;
  latencyMs?: number;
  settingsOpen: boolean;
  onToggleSettings: () => void;
  onDismiss: () => void;
  // Slot for the SettingsDrawer (when settingsOpen). Capsule decides
  // which props to pass to the drawer; we just mount whatever it
  // hands over.
  settingsDrawer: ReactNode;
  screenshotEnabled: boolean;
  onRefreshSnapshot: () => void;
  theme: CapsuleTheme;
  onChangeTheme: (next: CapsuleTheme) => void;
}

export function LeftPanel({
  snapshot,
  modelUsed,
  latencyMs,
  settingsOpen,
  onToggleSettings,
  onDismiss,
  settingsDrawer,
  screenshotEnabled,
  onRefreshSnapshot,
  theme,
  onChangeTheme,
}: LeftPanelProps) {
  return (
    <div className="gauntlet-capsule__panel gauntlet-capsule__panel--left">
      <header className="gauntlet-capsule__header">
        <div className="gauntlet-capsule__brand-block">
          <span className="gauntlet-capsule__mark" aria-hidden>
            <span className="gauntlet-capsule__mark-dot" />
          </span>
          <div className="gauntlet-capsule__brand-text">
            <span className="gauntlet-capsule__brand">GAUNTLET</span>
            <span className="gauntlet-capsule__tagline">cursor · capsule</span>
          </div>
        </div>
        <div className="gauntlet-capsule__header-actions">
          <ThemeToggle theme={theme} onChangeTheme={onChangeTheme} />
          <button
            type="button"
            className="gauntlet-capsule__settings-btn"
            onClick={onToggleSettings}
            aria-label="Definições"
            aria-expanded={settingsOpen}
            title="Definições"
          >
            <span aria-hidden>···</span>
          </button>
          <button
            type="button"
            className="gauntlet-capsule__close"
            onClick={onDismiss}
            aria-label="Dismiss capsule (Esc)"
          >
            <span aria-hidden>esc</span>
          </button>
        </div>
      </header>

      {settingsOpen && settingsDrawer}

      <section className="gauntlet-capsule__context">
        <div className="gauntlet-capsule__context-meta">
          {/* Shell label removido por doutrina de paridade — o
              utilizador não deve nunca sentir que está em "dois
              composers diferentes". Chrome igual em ambos os shells;
              ambient.shell mantém-se internamente para diagnostics,
              só não é renderizado.
              URL placeholder do desktop (`desktop://capsule`,
              `desktop://unknown`) também não aparece — esconde
              contexto vazio em vez de o expor como UI. Quando há um
              app real em foco o pageTitle preenche-se sozinho. */}
          {(() => {
            const isDesktopPlaceholder = snapshot.url.startsWith('desktop://');
            const display = isDesktopPlaceholder
              ? snapshot.pageTitle?.trim() || ''
              : snapshot.pageTitle || snapshot.url;
            if (!display) return null;
            return (
              <span className="gauntlet-capsule__url" title={snapshot.url}>
                {display}
              </span>
            );
          })()}
          {modelUsed && (
            <span
              className="gauntlet-capsule__model-chip"
              title={`Modelo usado · ${latencyMs ?? 0} ms`}
            >
              <span className="gauntlet-capsule__model-chip-dot" aria-hidden />
              {modelUsed}
            </span>
          )}
          <button
            type="button"
            className="gauntlet-capsule__refresh"
            onClick={onRefreshSnapshot}
            title="Re-read current selection"
          >
            re-read
          </button>
        </div>
        {snapshot.text ? (
          <pre className="gauntlet-capsule__selection">{truncate(snapshot.text, 600)}</pre>
        ) : (
          <CompactContextSummary
            snapshot={snapshot}
            screenshotEnabled={screenshotEnabled}
          />
        )}
      </section>
    </div>
  );
}
