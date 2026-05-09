// SettingsDrawer — extracted from Capsule.tsx as part of Wave 2 PR-2.
//
// Doctrine: o utilizador vive no Composer. Settings open inside the
// cápsula's left panel (next to context) so changing a knob does not
// kick the user into a separate Control Center surface. The drawer
// owns its own state (the toggles it surfaces) and persists through
// `PillPrefs`. Capsule passes ambient capability flags down so the
// drawer renders only the sections that make sense in the current
// shell (screenshot toggle hidden in popup window; pill-mode hidden
// on shells without a pill surface; dismiss-domain hidden on desktop).

import { useCallback, useEffect, useState } from 'react';
import { type CapsuleTheme, type PillPrefs } from './pill-prefs';

export interface SettingsDrawerProps {
  onClose: () => void;
  // Only the in-page surface has a real tab to screenshot. The popup
  // window would capture itself, which is useless and visually
  // recursive — hide the toggle there.
  showScreenshot: boolean;
  prefs: PillPrefs;
  // Browser shows the per-domain hide list; desktop hides this whole
  // section because there are no domains.
  showDismissedDomains: boolean;
  theme: CapsuleTheme;
  onChangeTheme: (theme: CapsuleTheme) => void;
  // Show the pill-mode toggle only on shells that actually render a pill.
  showPillMode: boolean;
}

export function SettingsDrawer({
  onClose,
  showScreenshot,
  prefs,
  showDismissedDomains,
  theme,
  onChangeTheme,
  showPillMode,
}: SettingsDrawerProps) {
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenshotEnabled, setScreenshotEnabled] = useState(false);
  const [pillMode, setPillModeState] = useState<'corner' | 'cursor'>('corner');
  const [ttsEnabledLocal, setTtsEnabledLocal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (showDismissedDomains) {
      void prefs.readDismissedDomains().then((list) => {
        if (cancelled) return;
        setDomains(list);
      });
    }
    void prefs.readScreenshotEnabled().then((enabled) => {
      if (cancelled) return;
      setScreenshotEnabled(enabled);
      setLoading(false);
    });
    void prefs.readPillMode().then((m) => {
      if (!cancelled) setPillModeState(m);
    });
    void prefs.readTtsEnabled().then((b) => {
      if (!cancelled) setTtsEnabledLocal(b);
    });
    return () => {
      cancelled = true;
    };
  }, [prefs, showDismissedDomains]);

  const togglePillMode = useCallback(
    async (next: 'corner' | 'cursor') => {
      setPillModeState(next);
      await prefs.writePillMode(next);
      // Live broadcast so App.tsx flips the pill without a reload.
      window.dispatchEvent(
        new CustomEvent('gauntlet:pill-mode', { detail: { mode: next } }),
      );
    },
    [prefs],
  );

  const toggleTts = useCallback(
    async (enabled: boolean) => {
      setTtsEnabledLocal(enabled);
      await prefs.writeTtsEnabled(enabled);
      // Cancel any speaking voice when the operator turns TTS off mid-read.
      if (!enabled) {
        try {
          window.speechSynthesis?.cancel();
        } catch {
          // ignore
        }
      }
      window.dispatchEvent(
        new CustomEvent('gauntlet:tts', { detail: { enabled } }),
      );
    },
    [prefs],
  );

  const restore = useCallback(
    async (host: string) => {
      await prefs.restoreDomain(host);
      setDomains((prev) => prev.filter((h) => h !== host));
    },
    [prefs],
  );

  const toggleScreenshot = useCallback(
    async (enabled: boolean) => {
      setScreenshotEnabled(enabled);
      await prefs.writeScreenshotEnabled(enabled);
    },
    [prefs],
  );

  return (
    <section className="gauntlet-capsule__settings" role="region" aria-label="Definições">
      <header className="gauntlet-capsule__settings-header">
        <span className="gauntlet-capsule__settings-title">definições</span>
        <button
          type="button"
          className="gauntlet-capsule__settings-close"
          onClick={onClose}
          aria-label="Fechar definições"
        >
          ×
        </button>
      </header>

      <div className="gauntlet-capsule__settings-section">
        <span className="gauntlet-capsule__settings-subtitle">aparência</span>
        <div className="gauntlet-capsule__theme-switch" role="radiogroup" aria-label="tema">
          <button
            type="button"
            className={`gauntlet-capsule__theme-option${
              theme === 'light' ? ' gauntlet-capsule__theme-option--active' : ''
            }`}
            onClick={() => onChangeTheme('light')}
            role="radio"
            aria-checked={theme === 'light'}
          >
            <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light" aria-hidden />
            <span>flagship light</span>
          </button>
          <button
            type="button"
            className={`gauntlet-capsule__theme-option${
              theme === 'dark' ? ' gauntlet-capsule__theme-option--active' : ''
            }`}
            onClick={() => onChangeTheme('dark')}
            role="radio"
            aria-checked={theme === 'dark'}
          >
            <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark" aria-hidden />
            <span>night premium</span>
          </button>
        </div>
      </div>

      {showPillMode && (
        <div className="gauntlet-capsule__settings-section">
          <span className="gauntlet-capsule__settings-subtitle">pill</span>
          <div className="gauntlet-capsule__theme-switch" role="radiogroup" aria-label="pill mode">
            <button
              type="button"
              className={`gauntlet-capsule__theme-option${
                pillMode === 'corner' ? ' gauntlet-capsule__theme-option--active' : ''
              }`}
              onClick={() => void togglePillMode('corner')}
              role="radio"
              aria-checked={pillMode === 'corner'}
            >
              <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner" aria-hidden />
              <span>resting corner</span>
            </button>
            <button
              type="button"
              className={`gauntlet-capsule__theme-option${
                pillMode === 'cursor' ? ' gauntlet-capsule__theme-option--active' : ''
              }`}
              onClick={() => void togglePillMode('cursor')}
              role="radio"
              aria-checked={pillMode === 'cursor'}
            >
              <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor" aria-hidden />
              <span>cursor pill</span>
            </button>
          </div>
        </div>
      )}

      {showScreenshot && (
        <div className="gauntlet-capsule__settings-section">
          <label className="gauntlet-capsule__settings-toggle">
            <input
              type="checkbox"
              checked={screenshotEnabled}
              onChange={(ev) => void toggleScreenshot(ev.target.checked)}
            />
            <span className="gauntlet-capsule__settings-toggle-label">
              <strong>incluir screenshot</strong>
              <small>
                o modelo vê a página visível. útil para layouts e imagens, exposição
                de senhas/DMs visíveis. opt-in.
              </small>
            </span>
          </label>
        </div>
      )}

      <div className="gauntlet-capsule__settings-section">
        <label className="gauntlet-capsule__settings-toggle">
          <input
            type="checkbox"
            checked={ttsEnabledLocal}
            onChange={(ev) => void toggleTts(ev.target.checked)}
          />
          <span className="gauntlet-capsule__settings-toggle-label">
            <strong>ler resposta em voz alta</strong>
            <small>
              quando o modelo termina, a cápsula fala a resposta via Web Speech.
              cancela ao submeter outro pedido ou fechar a cápsula.
            </small>
          </span>
        </label>
      </div>

      <div className="gauntlet-capsule__settings-section">
        <span className="gauntlet-capsule__settings-subtitle">domínios escondidos</span>
        {loading ? (
          <p className="gauntlet-capsule__settings-empty">a carregar…</p>
        ) : domains.length === 0 ? (
          <p className="gauntlet-capsule__settings-empty">
            nenhum — clica direito no pill em qualquer site para o esconder.
          </p>
        ) : (
          <ul className="gauntlet-capsule__settings-list">
            {domains.map((host) => (
              <li key={host} className="gauntlet-capsule__settings-row">
                <span className="gauntlet-capsule__settings-host">{host}</span>
                <button
                  type="button"
                  className="gauntlet-capsule__settings-restore"
                  onClick={() => void restore(host)}
                >
                  restaurar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
