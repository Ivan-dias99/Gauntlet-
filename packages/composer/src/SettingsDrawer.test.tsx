// SettingsDrawer RTL — settings panel that lives inside the cápsula's
// left column. Owns its toggles + dismissed-domains list locally,
// reads/writes through PillPrefs.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SettingsDrawer } from './SettingsDrawer';
import { type PillPrefs } from './pill-prefs';

function makePrefs(over: Partial<PillPrefs> = {}): PillPrefs {
  // Defaults — every read resolves to the conservative value the
  // SettingsDrawer would render with on a fresh install.
  return {
    readPosition: vi.fn(async () => ({ bottom: 16, right: 16 })),
    writePosition: vi.fn(async () => undefined),
    readDismissedDomains: vi.fn(async () => []),
    addDismissedDomain: vi.fn(async () => undefined),
    restoreDomain: vi.fn(async () => undefined),
    readScreenshotEnabled: vi.fn(async () => false),
    writeScreenshotEnabled: vi.fn(async () => undefined),
    readTheme: vi.fn(async () => 'light'),
    writeTheme: vi.fn(async () => undefined),
    readPaletteRecent: vi.fn(async () => []),
    notePaletteUse: vi.fn(async () => undefined),
    readPillMode: vi.fn(async () => 'corner'),
    writePillMode: vi.fn(async () => undefined),
    readTtsEnabled: vi.fn(async () => false),
    writeTtsEnabled: vi.fn(async () => undefined),
    readOnboardingDone: vi.fn(async () => true),
    writeOnboardingDone: vi.fn(async () => undefined),
    ...over,
  } as PillPrefs;
}

function defaults(over: Record<string, unknown> = {}) {
  return {
    onClose: vi.fn(),
    showScreenshot: false,
    prefs: makePrefs(),
    showDismissedDomains: false,
    theme: 'light' as const,
    onChangeTheme: vi.fn(),
    showPillMode: false,
    ...over,
  };
}

describe('<SettingsDrawer />', () => {
  it('always renders the título "definições"', () => {
    render(<SettingsDrawer {...defaults()} />);
    expect(screen.getByText('definições')).toBeTruthy();
  });

  it('fires onClose when × is clicked', () => {
    const onClose = vi.fn();
    render(<SettingsDrawer {...defaults({ onClose })} />);
    fireEvent.click(screen.getByLabelText('Fechar definições'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the theme switch and fires onChangeTheme', () => {
    const onChangeTheme = vi.fn();
    render(<SettingsDrawer {...defaults({ onChangeTheme })} />);
    fireEvent.click(screen.getByText('night premium'));
    expect(onChangeTheme).toHaveBeenCalledWith('dark');
  });

  it('hides the screenshot toggle when showScreenshot=false', () => {
    render(<SettingsDrawer {...defaults()} />);
    expect(screen.queryByText(/incluir screenshot/i)).toBeNull();
  });

  it('shows the screenshot toggle when showScreenshot=true', () => {
    render(<SettingsDrawer {...defaults({ showScreenshot: true })} />);
    expect(screen.getByText(/incluir screenshot/i)).toBeTruthy();
  });

  it('writes screenshotEnabled when the checkbox is clicked', async () => {
    const prefs = makePrefs();
    render(
      <SettingsDrawer {...defaults({ prefs, showScreenshot: true })} />,
    );
    const cb = (await screen.findByRole('checkbox', {
      name: /incluir screenshot/i,
    })) as HTMLInputElement;
    fireEvent.click(cb);
    await waitFor(() =>
      expect(prefs.writeScreenshotEnabled).toHaveBeenCalledWith(true),
    );
  });

  it('hides pill-mode switch when showPillMode=false', () => {
    render(<SettingsDrawer {...defaults()} />);
    expect(screen.queryByText('resting corner')).toBeNull();
  });

  it('renders pill-mode switch when showPillMode=true', () => {
    render(<SettingsDrawer {...defaults({ showPillMode: true })} />);
    expect(screen.getByText('resting corner')).toBeTruthy();
    expect(screen.getByText('cursor pill')).toBeTruthy();
  });

  it('lists dismissed domains and restores via prefs.restoreDomain', async () => {
    const prefs = makePrefs({
      readDismissedDomains: vi.fn(async () => ['github.com', 'mail.google.com']),
    });
    render(
      <SettingsDrawer
        {...defaults({ prefs, showDismissedDomains: true })}
      />,
    );
    await screen.findByText('github.com');
    await screen.findByText('mail.google.com');
    fireEvent.click(screen.getAllByText('restaurar')[0]);
    await waitFor(() =>
      expect(prefs.restoreDomain).toHaveBeenCalledWith('github.com'),
    );
  });
});
