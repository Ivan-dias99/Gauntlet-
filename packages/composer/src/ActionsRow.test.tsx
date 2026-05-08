// ActionsRow RTL — covers the bottom button row's capability gating
// and the press-and-hold mic semantics.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ActionsRow } from './ActionsRow';

function defaults(over: Record<string, unknown> = {}) {
  return {
    busy: false,
    canSubmit: true,
    submitRipple: 0,
    submitLabel: 'idle' as const,
    showAttachFile: false,
    showAttachScreen: false,
    showVoice: false,
    voiceActive: false,
    onAttachFile: vi.fn(),
    onAttachScreen: vi.fn(),
    onVoiceStart: vi.fn(),
    onVoiceStop: vi.fn(),
    ...over,
  };
}

describe('<ActionsRow />', () => {
  it('always renders the keyboard hint and submit button', () => {
    render(<ActionsRow {...defaults()} />);
    expect(screen.getByText('↵')).toBeTruthy();
    expect(screen.getByText('⌘K')).toBeTruthy();
    expect(screen.getByText('Enviar')).toBeTruthy();
  });

  it('disables submit when canSubmit is false', () => {
    render(<ActionsRow {...defaults({ canSubmit: false })} />);
    const btn = screen.getByText('Enviar').closest('button')!;
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('renders "a pensar" / "a escrever" labels driven by submitLabel', () => {
    const { rerender } = render(
      <ActionsRow {...defaults({ submitLabel: 'thinking', busy: true })} />,
    );
    expect(screen.getByText('a pensar')).toBeTruthy();
    rerender(<ActionsRow {...defaults({ submitLabel: 'streaming', busy: true })} />);
    expect(screen.getByText('a escrever')).toBeTruthy();
  });

  it('hides anexar / ecrã / voice buttons when their show flags are false', () => {
    render(<ActionsRow {...defaults()} />);
    expect(screen.queryByText('anexar')).toBeNull();
    expect(screen.queryByText('ecrã')).toBeNull();
    expect(screen.queryByText('voz')).toBeNull();
  });

  it('shows anexar + fires onAttachFile on click', () => {
    const onAttachFile = vi.fn();
    render(<ActionsRow {...defaults({ showAttachFile: true, onAttachFile })} />);
    fireEvent.click(screen.getByText('anexar'));
    expect(onAttachFile).toHaveBeenCalledTimes(1);
  });

  it('shows ecrã + fires onAttachScreen on click', () => {
    const onAttachScreen = vi.fn();
    render(<ActionsRow {...defaults({ showAttachScreen: true, onAttachScreen })} />);
    fireEvent.click(screen.getByText('ecrã'));
    expect(onAttachScreen).toHaveBeenCalledTimes(1);
  });

  it('shows mic with "voz" label and toggles to "a ouvir" while active', () => {
    const { rerender } = render(
      <ActionsRow {...defaults({ showVoice: true })} />,
    );
    expect(screen.getByText('voz')).toBeTruthy();
    rerender(<ActionsRow {...defaults({ showVoice: true, voiceActive: true })} />);
    expect(screen.getByText('a ouvir')).toBeTruthy();
  });

  it('press-and-hold: pointerDown → onVoiceStart, pointerUp → onVoiceStop', () => {
    const onVoiceStart = vi.fn();
    const onVoiceStop = vi.fn();
    render(
      <ActionsRow
        {...defaults({
          showVoice: true,
          onVoiceStart,
          onVoiceStop,
        })}
      />,
    );
    const mic = screen.getByText('voz').closest('button')!;
    fireEvent.pointerDown(mic);
    expect(onVoiceStart).toHaveBeenCalledTimes(1);
    fireEvent.pointerUp(mic);
    expect(onVoiceStop).toHaveBeenCalledTimes(1);
  });

  it('pointerLeave only stops voice when active', () => {
    const onVoiceStop = vi.fn();
    const { rerender, container } = render(
      <ActionsRow {...defaults({ showVoice: true, onVoiceStop })} />,
    );
    let mic = container.querySelector('.gauntlet-capsule__voice')!;
    fireEvent.pointerLeave(mic);
    expect(onVoiceStop).not.toHaveBeenCalled();

    rerender(
      <ActionsRow
        {...defaults({ showVoice: true, voiceActive: true, onVoiceStop })}
      />,
    );
    mic = container.querySelector('.gauntlet-capsule__voice')!;
    fireEvent.pointerLeave(mic);
    expect(onVoiceStop).toHaveBeenCalledTimes(1);
  });

  it('disables anexar / ecrã / mic while busy', () => {
    render(
      <ActionsRow
        {...defaults({
          busy: true,
          showAttachFile: true,
          showAttachScreen: true,
          showVoice: true,
        })}
      />,
    );
    expect(
      screen.getByText('anexar').closest('button')!.hasAttribute('disabled'),
    ).toBe(true);
    expect(
      screen.getByText('ecrã').closest('button')!.hasAttribute('disabled'),
    ).toBe(true);
    expect(
      screen.getByText('voz').closest('button')!.hasAttribute('disabled'),
    ).toBe(true);
  });
});
