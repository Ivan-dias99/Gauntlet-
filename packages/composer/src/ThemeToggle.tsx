import { type CapsuleTheme } from './pill-prefs';

interface ThemeToggleProps {
  theme: CapsuleTheme;
  onChange: (next: CapsuleTheme) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const next: CapsuleTheme = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      type="button"
      className="gx-theme-toggle"
      data-theme={theme}
      onClick={() => onChange(next)}
      aria-label={`Tema ${theme === 'light' ? 'claro' : 'escuro'} — alternar`}
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
