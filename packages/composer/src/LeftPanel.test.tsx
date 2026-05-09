// LeftPanel RTL — brand header + settings drawer slot + context
// readout. Capsule-level integration is covered through the
// settingsDrawer ReactNode prop.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LeftPanel } from './LeftPanel';
import { type SelectionSnapshot } from './types';

function snap(over: Partial<SelectionSnapshot> = {}): SelectionSnapshot {
  return {
    text: '',
    url: 'https://example.com/page',
    pageTitle: 'Example Page',
    pageText: '',
    domSkeleton: '',
    bbox: null,
    ...over,
  } as SelectionSnapshot;
}

function defaults(over: Record<string, unknown> = {}) {
  return {
    snapshot: snap(),
    settingsOpen: false,
    onToggleSettings: vi.fn(),
    onDismiss: vi.fn(),
    settingsDrawer: <div data-testid="drawer">drawer-here</div>,
    screenshotEnabled: false,
    onRefreshSnapshot: vi.fn(),
    ...over,
  };
}

describe('<LeftPanel />', () => {
  it('renders the GAUNTLET brand and tagline', () => {
    render(<LeftPanel {...defaults()} />);
    expect(screen.getByText('GAUNTLET')).toBeTruthy();
    expect(screen.getByText('cursor · capsule')).toBeTruthy();
  });

  it('shows the page title (or url fallback) in the context meta', () => {
    render(<LeftPanel {...defaults()} />);
    expect(screen.getByText('Example Page')).toBeTruthy();
  });

  it('hides the URL chip when snapshot.url is a desktop:// placeholder with no title', () => {
    render(
      <LeftPanel
        {...defaults({
          snapshot: snap({ url: 'desktop://capsule', pageTitle: '' }),
        })}
      />,
    );
    expect(screen.queryByText('desktop://capsule')).toBeNull();
  });

  it('renders the model chip when modelUsed is supplied', () => {
    render(<LeftPanel {...defaults({ modelUsed: 'mock-model', latencyMs: 12 })} />);
    expect(screen.getByText('mock-model')).toBeTruthy();
  });

  it('mounts the settingsDrawer slot only when settingsOpen', () => {
    const { rerender } = render(<LeftPanel {...defaults()} />);
    expect(screen.queryByTestId('drawer')).toBeNull();
    rerender(<LeftPanel {...defaults({ settingsOpen: true })} />);
    expect(screen.getByTestId('drawer')).toBeTruthy();
  });

  it('fires onToggleSettings on the ··· button and onDismiss on esc', () => {
    const onToggleSettings = vi.fn();
    const onDismiss = vi.fn();
    render(
      <LeftPanel
        {...defaults({ onToggleSettings, onDismiss })}
      />,
    );
    fireEvent.click(screen.getByLabelText('Definições'));
    expect(onToggleSettings).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText('Dismiss capsule (Esc)'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders the selection text in a <pre> when snapshot.text is non-empty', () => {
    render(
      <LeftPanel
        {...defaults({ snapshot: snap({ text: 'selected words' }) })}
      />,
    );
    expect(screen.getByText('selected words')).toBeTruthy();
  });

  it('falls back to CompactContextSummary when there is no selection', () => {
    render(<LeftPanel {...defaults()} />);
    // CompactContextSummary renders an aria-label="context" list.
    expect(screen.getByLabelText('context')).toBeTruthy();
  });

  it('fires onRefreshSnapshot when re-read is clicked', () => {
    const onRefreshSnapshot = vi.fn();
    render(<LeftPanel {...defaults({ onRefreshSnapshot })} />);
    fireEvent.click(screen.getByText('re-read'));
    expect(onRefreshSnapshot).toHaveBeenCalledTimes(1);
  });
});
