// StreamingState RTL — covers both rendering modes (skeleton +
// streaming-compose) and the chunk-counter live region.

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StreamingState } from './StreamingState';

describe('<StreamingState />', () => {
  it('renders the skeleton card when mode is "skeleton"', () => {
    const { container } = render(<StreamingState mode="skeleton" />);
    expect(container.querySelector('.gauntlet-capsule__skeleton')).toBeTruthy();
    expect(
      container.querySelectorAll('.gauntlet-capsule__skeleton-line').length,
    ).toBe(3);
  });

  it('renders the partial compose preview + chunk count + caret', () => {
    render(
      <StreamingState
        mode="streaming-compose"
        partialCompose="Hello, "
        tokensStreamed={7}
      />,
    );
    expect(screen.getByText(/Hello,/)).toBeTruthy();
    expect(screen.getByText(/7 chunks/)).toBeTruthy();
    expect(screen.getByText('a escrever…')).toBeTruthy();
    expect(screen.getByText('▍')).toBeTruthy();
  });

  it('falls back to 0 chunks when tokensStreamed is missing', () => {
    render(<StreamingState mode="streaming-compose" partialCompose="hi" />);
    expect(screen.getByText(/0 chunks/)).toBeTruthy();
  });
});
