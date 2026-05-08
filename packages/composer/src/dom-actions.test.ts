// Danger-heuristic tests for the DomAction layer.
//
// These two functions are what flag a step in the plan UI before the
// operator clicks Executar. Regressions are real-world-safety issues:
// a missed flag is a payment that goes through without confirmation.
//
// Note: assessDanger consults the live DOM (document.querySelector) for
// some checks. Vitest runs under node here — those branches are
// exercised in browser-shell smoke tests. Here we cover the parts that
// rely only on the action shape (selector regex + value length + the
// shell.run / fs.write always-flagged paths).

import { describe, expect, it } from 'vitest';
import { assessDanger, assessSequenceDanger } from './dom-actions';

describe('assessDanger', () => {
  it('flags fills whose selector matches /password/', () => {
    const r = assessDanger({
      type: 'fill',
      selector: 'input[name="password"]',
      value: 'hunter2',
    });
    expect(r.danger).toBe(true);
  });

  it('flags clicks whose selector hits a destructive pattern', () => {
    expect(
      assessDanger({ type: 'click', selector: 'button.delete-account' }).danger,
    ).toBe(true);
    expect(
      assessDanger({ type: 'click', selector: 'a.unsubscribe' }).danger,
    ).toBe(true);
    expect(
      assessDanger({ type: 'click', selector: 'form.checkout button' }).danger,
    ).toBe(true);
  });

  it('flags shell.run unconditionally', () => {
    const r = assessDanger({
      type: 'shell.run',
      cmd: 'ls',
      args: ['-la'],
    });
    expect(r.danger).toBe(true);
    expect(r.reason).toContain('GAUNTLET_ALLOW_CODE_EXEC');
  });

  it('flags fs.write unconditionally', () => {
    const r = assessDanger({
      type: 'fs.write',
      path: '/tmp/x.txt',
      content: 'hello',
    });
    expect(r.danger).toBe(true);
  });

  it('clears fs.read (read-only)', () => {
    const r = assessDanger({ type: 'fs.read', path: '/tmp/x.txt' });
    expect(r.danger).toBe(false);
  });

  it('clears highlight + scroll_to (visual only)', () => {
    expect(assessDanger({ type: 'highlight', selector: 'h1' }).danger).toBe(false);
    expect(assessDanger({ type: 'scroll_to', selector: '#footer' }).danger).toBe(false);
  });

  it('flags fills with unusually long values', () => {
    const r = assessDanger({
      type: 'fill',
      selector: 'textarea.note',
      value: 'a'.repeat(6000),
    });
    expect(r.danger).toBe(true);
    expect(r.reason).toContain('unusually long');
  });
});

describe('assessSequenceDanger', () => {
  it('clears benign sequences (no fill or no click)', () => {
    const r = assessSequenceDanger([
      { type: 'highlight', selector: 'h1' },
      { type: 'scroll_to', selector: '#footer' },
    ]);
    expect(r.danger).toBe(false);
  });

  it('flags password fill followed by submit click (auto-submission)', () => {
    const r = assessSequenceDanger([
      { type: 'fill', selector: 'input[name="password"]', value: 'hunter2' },
      { type: 'click', selector: 'button[type="submit"]' },
    ]);
    expect(r.danger).toBe(true);
    expect(r.reason).toContain('cadeia destrutiva');
  });

  it('flags credit-card fill followed by purchase click', () => {
    const r = assessSequenceDanger([
      { type: 'fill', selector: 'input[name="ccnum"]', value: '4111-1111-1111-1111' },
      { type: 'click', selector: 'button.confirm-purchase' },
    ]);
    expect(r.danger).toBe(true);
  });

  it('clears email + submit (sensitive selector pattern not hit)', () => {
    const r = assessSequenceDanger([
      { type: 'fill', selector: 'input[name="email"]', value: 'a@b.c' },
      { type: 'click', selector: 'button[type="submit"]' },
    ]);
    expect(r.danger).toBe(false);
  });
});
