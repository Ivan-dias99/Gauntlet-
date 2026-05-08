// ShellPanel RTL — covers the input → run → result flow plus the
// disabled/loading states. Caller feeds `ambient.shellExec.run`; the
// panel owns command + result + running locally.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ShellPanel } from './ShellPanel';

describe('<ShellPanel />', () => {
  it('disables run button when input is empty', () => {
    render(<ShellPanel shellExec={{ run: vi.fn() }} />);
    const btn = screen.getByText('Executar').closest('button')!;
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('parses cmd + args from the input and calls shellExec.run', async () => {
    const run = vi.fn(async () => ({
      stdout: 'on branch main',
      stderr: '',
      exitCode: 0,
      durationMs: 12,
    }));
    render(<ShellPanel shellExec={{ run }} />);
    const input = screen.getByPlaceholderText(
      /git status/,
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'git status --porcelain' } });
    fireEvent.click(screen.getByText('Executar'));
    await waitFor(() => expect(run).toHaveBeenCalled());
    expect(run).toHaveBeenCalledWith('git', ['status', '--porcelain']);
  });

  it('renders stdout + exit-code line after a successful run', async () => {
    const run = vi.fn(async () => ({
      stdout: 'on branch main',
      stderr: '',
      exitCode: 0,
      durationMs: 5,
    }));
    render(<ShellPanel shellExec={{ run }} />);
    fireEvent.change(screen.getByPlaceholderText(/git status/), {
      target: { value: 'git status' },
    });
    fireEvent.click(screen.getByText('Executar'));
    await screen.findByText('on branch main');
    expect(screen.getByText(/exit 0/)).toBeTruthy();
    expect(screen.getByText(/5 ms/)).toBeTruthy();
  });

  it('renders stderr + "erro" tag when run() throws', async () => {
    const run = vi.fn(async () => {
      throw new Error('boom');
    });
    render(<ShellPanel shellExec={{ run }} />);
    fireEvent.change(screen.getByPlaceholderText(/git status/), {
      target: { value: 'badcmd' },
    });
    fireEvent.click(screen.getByText('Executar'));
    await screen.findByText('boom');
    expect(screen.getByText(/erro/)).toBeTruthy();
  });

  it('submits on Enter (no shift) without a button click', async () => {
    const run = vi.fn(async () => ({
      stdout: 'ok',
      stderr: '',
      exitCode: 0,
      durationMs: 1,
    }));
    render(<ShellPanel shellExec={{ run }} />);
    const input = screen.getByPlaceholderText(/git status/);
    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(run).toHaveBeenCalled());
    expect(run).toHaveBeenCalledWith('pwd', []);
  });

  it('does NOT submit on Shift+Enter', () => {
    const run = vi.fn();
    render(<ShellPanel shellExec={{ run }} />);
    const input = screen.getByPlaceholderText(/git status/);
    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(run).not.toHaveBeenCalled();
  });
});
