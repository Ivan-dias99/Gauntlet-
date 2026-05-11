import { type CapsuleTheme } from './pill-prefs';

interface ThemeToggleProps {
  theme: CapsuleTheme;
  onChangeTheme: (next: CapsuleTheme) => void;
}

export function ThemeToggle({ theme, onChangeTheme }: ThemeToggleProps) {
  const next: CapsuleTheme = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      type="button"
      className="gx-theme-toggle"
      data-theme={theme}
      // aria-pressed exposes the on/off state machine-readably so AT
      // doesn't have to parse the label. true = dark is active.
      aria-pressed={theme === 'dark'}
      onClick={() => onChangeTheme(next)}
      aria-label={`Mudar para tema ${next === 'light' ? 'claro' : 'escuro'}`}
      title={`Tema · ${theme}`}
    >
      <span className="gx-theme-toggle__track">
        <span className="gx-theme-toggle__thumb" />
        <span className="gx-theme-toggle__icon" data-pos="left" aria-hidden>☼</span>
        <span className="gx-theme-toggle__icon" data-pos="right" aria-hidden>☾</span>
      </span>
    </button>
  );
}
