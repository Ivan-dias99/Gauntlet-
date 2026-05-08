// CompactContextSummary RTL — tiny no-selection readout. Asserts the
// values change with the snapshot's domSkeleton + pageText shapes
// and the screenshotEnabled prop.

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompactContextSummary } from './CompactContextSummary';
import { type SelectionSnapshot } from './types';

function snap(over: Partial<SelectionSnapshot> = {}): SelectionSnapshot {
  return {
    text: '',
    url: 'https://example.com',
    pageTitle: '',
    pageText: '',
    domSkeleton: '',
    bbox: null,
    ...over,
  } as SelectionSnapshot;
}

describe('<CompactContextSummary />', () => {
  it('reports "no" / "—" / "off" when nothing is captured', () => {
    render(<CompactContextSummary snapshot={snap()} screenshotEnabled={false} />);
    expect(screen.getByText('no')).toBeTruthy();
    expect(screen.getByText('—')).toBeTruthy();
    expect(screen.getByText('off')).toBeTruthy();
  });

  it('flips page captured to "yes" when pageText is non-empty', () => {
    render(
      <CompactContextSummary
        snapshot={snap({ pageText: 'something' })}
        screenshotEnabled={false}
      />,
    );
    expect(screen.getByText('yes')).toBeTruthy();
  });

  it('counts dom skeleton elements when it is a JSON array', () => {
    render(
      <CompactContextSummary
        snapshot={snap({ domSkeleton: JSON.stringify([{}, {}, {}, {}]) })}
        screenshotEnabled={false}
      />,
    );
    expect(screen.getByText('4 elements')).toBeTruthy();
  });

  it('falls back to "—" when domSkeleton is plain text (parse failure)', () => {
    render(
      <CompactContextSummary
        snapshot={snap({ domSkeleton: 'not-json' })}
        screenshotEnabled={false}
      />,
    );
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('reports screenshot "on" when the prop is true', () => {
    render(<CompactContextSummary snapshot={snap()} screenshotEnabled />);
    expect(screen.getByText('on')).toBeTruthy();
  });
});
