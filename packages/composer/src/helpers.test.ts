// Pure helper tests — truncate + extractPartialCompose + describeAction.
// These are the JSON streaming + plan rendering helpers; if they break,
// the cápsula either over-truncates user content or fails to surface a
// partial compose stream as it arrives.

import { describe, expect, it } from 'vitest';
import { describeAction, extractPartialCompose, truncate } from './helpers';

describe('truncate', () => {
  it('returns input unchanged when under the cap', () => {
    expect(truncate('hello', 100)).toBe('hello');
    expect(truncate('', 5)).toBe('');
  });

  it('appends an ellipsis when over the cap', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
  });

  it('honours an exact-length input as in-bounds', () => {
    expect(truncate('exact', 5)).toBe('exact');
  });
});

describe('extractPartialCompose', () => {
  it('returns null when the buffer has no compose key', () => {
    expect(extractPartialCompose('{"actions":[')).toBeNull();
    expect(extractPartialCompose('')).toBeNull();
  });

  it('extracts a partial compose value mid-stream', () => {
    const buffer = '{"compose":"Hello, ';
    expect(extractPartialCompose(buffer)).toBe('Hello, ');
  });

  it('decodes \\n / \\t / \\" / \\\\ escapes during streaming', () => {
    const buffer = '{"compose":"line1\\nline2\\twith \\"quote\\" and \\\\slash';
    const out = extractPartialCompose(buffer)!;
    expect(out).toContain('line1\nline2');
    expect(out).toContain('\twith "quote"');
    expect(out).toContain('\\slash');
  });

  it('drops a trailing lone backslash that could start the next escape', () => {
    const buffer = '{"compose":"Hello\\';
    expect(extractPartialCompose(buffer)).toBe('Hello');
  });

  it('keeps a fully-formed escaped backslash intact', () => {
    const buffer = '{"compose":"path: C:\\\\Users';
    expect(extractPartialCompose(buffer)).toBe('path: C:\\Users');
  });
});

describe('describeAction', () => {
  it('renders fill with truncated value', () => {
    const out = describeAction({
      type: 'fill',
      selector: 'input#email',
      value: 'a'.repeat(120),
    });
    expect(out).toContain('fill input#email');
    expect(out).toContain('…'); // truncated past 80 chars
  });

  it('renders click with the selector', () => {
    expect(
      describeAction({ type: 'click', selector: 'button.submit' }),
    ).toBe('click button.submit');
  });

  it('renders shell.run with cmd + args + cwd', () => {
    const out = describeAction({
      type: 'shell.run',
      cmd: 'git',
      args: ['status'],
      cwd: '/repo',
    });
    expect(out).toBe('shell: git status (cwd: /repo)');
  });

  it('renders fs.write with byte length', () => {
    const out = describeAction({
      type: 'fs.write',
      path: '/tmp/x.txt',
      content: 'hello',
    });
    expect(out).toBe('fs.write /tmp/x.txt (5 chars)');
  });
});
