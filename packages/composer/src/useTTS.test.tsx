// useTTS tests — renderHook around the speech-synthesis lifecycle.
// We stub window.speechSynthesis + SpeechSynthesisUtterance with vi
// mocks so the hook drives a deterministic surface without going
// through happy-dom's partial Speech API support.

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type PillPrefs } from './pill-prefs';
import { useTTS } from './useTTS';

interface FakeSpeech {
  cancel: ReturnType<typeof vi.fn>;
  speak: ReturnType<typeof vi.fn>;
}

declare global {
  // happy-dom defines this; we replace it per-test.
  // eslint-disable-next-line no-var
  var SpeechSynthesisUtterance: typeof window.SpeechSynthesisUtterance;
}

function fakePrefs(initial = false): {
  prefs: PillPrefs;
  ttsSpy: ReturnType<typeof vi.fn>;
} {
  const ttsSpy = vi.fn(async () => initial);
  return {
    prefs: {
      readPosition: vi.fn(),
      writePosition: vi.fn(),
      readDismissedDomains: vi.fn(),
      addDismissedDomain: vi.fn(),
      restoreDomain: vi.fn(),
      readScreenshotEnabled: vi.fn(),
      writeScreenshotEnabled: vi.fn(),
      readTheme: vi.fn(),
      writeTheme: vi.fn(),
      readPaletteRecent: vi.fn(),
      notePaletteUse: vi.fn(),
      readPillMode: vi.fn(),
      writePillMode: vi.fn(),
      readTtsEnabled: ttsSpy,
      writeTtsEnabled: vi.fn(),
      readOnboardingDone: vi.fn(),
      writeOnboardingDone: vi.fn(),
    } as unknown as PillPrefs,
    ttsSpy,
  };
}

let speech: FakeSpeech;

beforeEach(() => {
  speech = { cancel: vi.fn(), speak: vi.fn() };
  Object.defineProperty(window, 'speechSynthesis', {
    value: speech,
    configurable: true,
  });
  // SpeechSynthesisUtterance — minimal class with the props the hook sets.
  class FakeUtterance {
    text: string;
    rate = 1;
    pitch = 1;
    constructor(text: string) {
      this.text = text;
    }
  }
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: FakeUtterance,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTTS', () => {
  it('loads the persisted toggle on mount via prefs.readTtsEnabled', async () => {
    const { prefs, ttsSpy } = fakePrefs(true);
    const { result } = renderHook(() =>
      useTTS({ prefs, isPlanReady: false, planCompose: undefined }),
    );
    // Effect resolves the prefs read in a microtask. Flush it.
    await act(async () => {
      await Promise.resolve();
    });
    expect(ttsSpy).toHaveBeenCalled();
    expect(result.current.enabled).toBe(true);
  });

  it('does NOT speak when enabled=false even if isPlanReady', async () => {
    const { prefs } = fakePrefs(false);
    renderHook(() =>
      useTTS({
        prefs,
        isPlanReady: true,
        planCompose: 'hello',
      }),
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it('speaks once when enabled flips on with a plan-ready compose string', async () => {
    const { prefs } = fakePrefs(true);
    const { rerender } = renderHook(
      (props: { isPlanReady: boolean; planCompose: string | undefined }) =>
        useTTS({ prefs, ...props }),
      { initialProps: { isPlanReady: false, planCompose: undefined } },
    );
    await act(async () => {
      await Promise.resolve();
    });
    rerender({ isPlanReady: true, planCompose: 'final answer' });
    await act(async () => {
      await Promise.resolve();
    });
    expect(speech.speak).toHaveBeenCalledTimes(1);
  });

  it('skips re-speaking the same text on a re-render', async () => {
    const { prefs } = fakePrefs(true);
    const { rerender } = renderHook(
      (props: { isPlanReady: boolean; planCompose: string | undefined }) =>
        useTTS({ prefs, ...props }),
      { initialProps: { isPlanReady: true, planCompose: 'one' } },
    );
    await act(async () => {
      await Promise.resolve();
    });
    rerender({ isPlanReady: true, planCompose: 'one' });
    await act(async () => {
      await Promise.resolve();
    });
    expect(speech.speak).toHaveBeenCalledTimes(1);
  });

  it('cancel() clears in-flight utterance and resets the spoken guard', async () => {
    const { prefs } = fakePrefs(true);
    const { result, rerender } = renderHook(
      (props: { isPlanReady: boolean; planCompose: string | undefined }) =>
        useTTS({ prefs, ...props }),
      { initialProps: { isPlanReady: true, planCompose: 'first' } },
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(speech.speak).toHaveBeenCalledTimes(1);

    act(() => result.current.cancel());
    expect(speech.cancel).toHaveBeenCalled();

    // After cancel(), the hook lets the SAME text speak again — but
    // the speak effect only re-runs when one of [enabled, isPlanReady,
    // planCompose] changes. Round-trip through a different plan
    // value to drive a re-evaluation, then back to the original.
    rerender({ isPlanReady: true, planCompose: 'second' });
    await act(async () => {
      await Promise.resolve();
    });
    rerender({ isPlanReady: true, planCompose: 'first' });
    await act(async () => {
      await Promise.resolve();
    });
    expect(speech.speak).toHaveBeenCalledTimes(3);
  });

  it('listens to the gauntlet:tts window event for live sync', async () => {
    const { prefs } = fakePrefs(false);
    const { result } = renderHook(() =>
      useTTS({ prefs, isPlanReady: false, planCompose: undefined }),
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.enabled).toBe(false);
    act(() => {
      window.dispatchEvent(
        new CustomEvent('gauntlet:tts', { detail: { enabled: true } }),
      );
    });
    expect(result.current.enabled).toBe(true);
  });
});
