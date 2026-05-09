// AttachmentChips RTL — pure presentational, asserts the chip
// rendering + size formatting + onRemove plumbing.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AttachmentChips } from './AttachmentChips';
import { type Attachment } from './types';

function file(over: Partial<Attachment> = {}): Attachment {
  return {
    id: 'a1',
    kind: 'text',
    name: 'note.txt',
    mime: 'text/plain',
    bytes: 42,
    text: 'hello',
    ...over,
  } as Attachment;
}

describe('<AttachmentChips />', () => {
  it('renders nothing when the list is empty', () => {
    const { container } = render(
      <AttachmentChips attachments={[]} onRemove={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders one chip per attachment with name + size', () => {
    render(
      <AttachmentChips
        attachments={[
          file({ id: 'a', name: 'short.txt', bytes: 250 }),
          file({ id: 'b', name: 'medium.txt', bytes: 5000 }),
          file({ id: 'c', name: 'big.png', kind: 'image', bytes: 2_500_000 }),
        ]}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.getByText('short.txt')).toBeTruthy();
    expect(screen.getByText('250 B')).toBeTruthy();
    expect(screen.getByText('5 KB')).toBeTruthy();
    expect(screen.getByText('2.4 MB')).toBeTruthy();
  });

  it('calls onRemove with the attachment id when × is clicked', () => {
    const onRemove = vi.fn();
    render(
      <AttachmentChips
        attachments={[file({ id: 'xyz', name: 'doc.txt' })]}
        onRemove={onRemove}
      />,
    );
    fireEvent.click(screen.getByLabelText('Remover doc.txt'));
    expect(onRemove).toHaveBeenCalledWith('xyz');
  });
});
