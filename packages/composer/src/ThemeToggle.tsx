import { type CapsuleTheme } from './pill-prefs';

interface ThemeToggleProps {
  theme: CapsuleTheme;
  onToggle: () => void;
}

// ThemeToggle — light/dark switch pill. Sits in the LeftPanel header
// actions beside settings + close. Aether v2 port from preview Lovable.
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="gx-theme-toggle"
      data-theme={theme}
      onClick={onToggle}
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
