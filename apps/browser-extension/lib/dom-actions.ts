// DOM actuator — the "execute where the user already is" half of the
// Gauntlet doctrine. The backend planner emits a typed list of these
// actions; this module runs them against the live page.
//
// Wire format mirrors backend/models.py::DomAction (discriminated on
// `type`). Keep the two in sync — adding a new action means touching
// both.

const ANCHOR_OUTLINE = '2px solid #d07a5a';
const ANCHOR_OUTLINE_OFFSET = '2px';
const FORBIDDEN_PREFIX = '#gauntlet-capsule-host';

export type DomAction =
  | { type: 'fill'; selector: string; value: string }
  | { type: 'click'; selector: string }
  | { type: 'highlight'; selector: string; duration_ms?: number }
  | { type: 'scroll_to'; selector: string };

export interface DomActionResult {
  action: DomAction;
  ok: boolean;
  error?: string;
}

export async function executeDomActions(
  actions: DomAction[],
): Promise<DomActionResult[]> {
  const out: DomActionResult[] = [];
  for (const action of actions) {
    try {
      assertSafe(action);
      await executeOne(action);
      out.push({ action, ok: true });
    } catch (err: unknown) {
      out.push({
        action,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return out;
}

// Reject anything that targets the capsule's own shadow host. Without
// this guard a misbehaving plan could try to click "Esc" on itself and
// dismiss the very surface that is about to execute the action.
function assertSafe(action: DomAction): void {
  const sel = action.selector;
  if (!sel || typeof sel !== 'string') {
    throw new Error('selector missing or not a string');
  }
  if (sel.includes(FORBIDDEN_PREFIX)) {
    throw new Error(`selector targets the Gauntlet capsule itself: ${sel}`);
  }
  // Validate it's a parseable CSS selector before reaching the DOM.
  try {
    document.querySelector(sel);
  } catch {
    throw new Error(`selector is not valid CSS: ${sel}`);
  }
}

async function executeOne(action: DomAction): Promise<void> {
  if (action.type === 'fill') {
    fillElement(action.selector, action.value);
    return;
  }
  if (action.type === 'click') {
    clickElement(action.selector);
    return;
  }
  if (action.type === 'highlight') {
    highlightElements(action.selector, action.duration_ms ?? 1500);
    return;
  }
  if (action.type === 'scroll_to') {
    scrollToElement(action.selector);
    return;
  }
  // Exhaustive — TS narrows away every variant above. If we reach here
  // it's a runtime payload mismatch (backend shipped a new action type
  // before the extension was updated).
  throw new Error(
    `unknown action type: ${(action as { type?: string }).type ?? '<missing>'}`,
  );
}

function fillElement(selector: string, value: string): void {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`selector not found: ${selector}`);

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    // React, Vue, Svelte and friends override the value setter with a
    // descriptor that tracks state. Setting el.value directly bypasses
    // that descriptor and the framework never sees the change. We set
    // through the prototype's native setter instead, then dispatch the
    // events the framework listens for.
    const proto =
      el instanceof HTMLInputElement
        ? HTMLInputElement.prototype
        : HTMLTextAreaElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) {
      setter.call(el, value);
    } else {
      el.value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }

  if (el instanceof HTMLSelectElement) {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      'value',
    )?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }

  if (el instanceof HTMLElement && el.isContentEditable) {
    el.focus();
    el.textContent = value;
    el.dispatchEvent(new InputEvent('input', { bubbles: true }));
    return;
  }

  throw new Error(`element at ${selector} is not fillable`);
}

function clickElement(selector: string): void {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`selector not found: ${selector}`);
  if (!(el instanceof HTMLElement)) {
    throw new Error(`element at ${selector} is not clickable`);
  }
  el.click();
}

function highlightElements(selector: string, durationMs: number): void {
  const els = document.querySelectorAll(selector);
  if (els.length === 0) throw new Error(`selector not found: ${selector}`);
  for (const el of Array.from(els)) {
    if (!(el instanceof HTMLElement)) continue;
    const prevOutline = el.style.outline;
    const prevOffset = el.style.outlineOffset;
    el.style.outline = ANCHOR_OUTLINE;
    el.style.outlineOffset = ANCHOR_OUTLINE_OFFSET;
    window.setTimeout(() => {
      el.style.outline = prevOutline;
      el.style.outlineOffset = prevOffset;
    }, durationMs);
  }
}

function scrollToElement(selector: string): void {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`selector not found: ${selector}`);
  if (!(el instanceof HTMLElement)) {
    throw new Error(`element at ${selector} cannot be scrolled to`);
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
