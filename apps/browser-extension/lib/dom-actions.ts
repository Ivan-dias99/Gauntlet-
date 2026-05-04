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

export interface DangerAssessment {
  danger: boolean;
  reason?: string;
}

// Heuristic flags for actions the user should explicitly confirm before
// the executor runs them. The assessor leans toward false positives —
// when in doubt, flag it. The cost of an extra confirmation click is a
// fraction of the cost of an unintended payment, deletion, or
// password-field overwrite. Caller (Capsule) is responsible for showing
// the warning and gating the Executar button.

const DANGER_SELECTOR_PATTERNS: RegExp[] = [
  /\bpassword\b/i,
  /\bdelete\b/i,
  /\bdestroy\b/i,
  /\bremove\b/i,
  /\bunsubscribe\b/i,
  /payment|checkout|billing/i,
  /credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i,
];

// Verb-as-button-text — matches the entire trimmed innerText (or a
// suffix/prefix like "Delete account") rather than substring so
// "Delete" flags but "Deleted at 12:00" doesn't.
const DANGER_VERBS = [
  'delete', 'remove', 'destroy', 'drop', 'discard',
  'apagar', 'eliminar', 'remover', 'destruir',
  'pay', 'buy', 'purchase', 'order', 'checkout',
  'pagar', 'comprar', 'encomendar',
  'confirm', 'submit', 'send', 'publish',
  'enviar', 'confirmar', 'publicar',
  'transfer', 'withdraw', 'transferir', 'levantar',
  'cancel subscription', 'cancelar subscrição', 'cancelar assinatura',
];

const FILL_VALUE_DANGER_LEN = 5000;

export function assessDanger(action: DomAction): DangerAssessment {
  // Read-only / visual actions are always safe.
  if (action.type === 'highlight' || action.type === 'scroll_to') {
    return { danger: false };
  }

  const sel = action.selector;
  for (const re of DANGER_SELECTOR_PATTERNS) {
    if (re.test(sel)) {
      return { danger: true, reason: `selector matches /${re.source}/` };
    }
  }

  let el: Element | null = null;
  try {
    el = document.querySelector(sel);
  } catch {
    // Invalid CSS — let the executor's own validation surface this.
  }

  if (action.type === 'fill') {
    if (el instanceof HTMLInputElement && el.type === 'password') {
      return { danger: true, reason: 'password field' };
    }
    if (
      el instanceof HTMLInputElement &&
      (el.autocomplete?.includes('cc-') ?? false)
    ) {
      return { danger: true, reason: 'credit-card autocomplete' };
    }
    if (action.value.length > FILL_VALUE_DANGER_LEN) {
      return { danger: true, reason: 'unusually long value' };
    }
    return { danger: false };
  }

  if (action.type === 'click') {
    if (el instanceof HTMLButtonElement && el.type === 'submit') {
      return { danger: true, reason: 'submit button' };
    }
    if (
      el instanceof HTMLInputElement &&
      (el.type === 'submit' || el.type === 'reset')
    ) {
      return { danger: true, reason: `${el.type} button` };
    }
    if (el instanceof HTMLElement) {
      const text = (el.innerText ?? '').trim().toLowerCase();
      if (text) {
        for (const verb of DANGER_VERBS) {
          if (
            text === verb ||
            text.startsWith(verb + ' ') ||
            text.endsWith(' ' + verb) ||
            text.includes(' ' + verb + ' ')
          ) {
            return { danger: true, reason: `action label: "${verb}"` };
          }
        }
      }
    }
    return { danger: false };
  }

  return { danger: false };
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
    // events the framework listens for. Focus before the change and
    // blur after — many forms gate validation on focus/blur, not just
    // input/change, so without them we silently skip required-field
    // checks and the user submits a form that "looks" filled but
    // hasn't been validated.
    el.focus({ preventScroll: true });
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
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    return;
  }

  if (el instanceof HTMLSelectElement) {
    el.focus({ preventScroll: true });
    const setter = Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      'value',
    )?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
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
  // el.click() alone fires only the synthetic `click` event. Many
  // modern UI libraries (Radix, Headless UI, Tailwind UI, ProseMirror,
  // shadcn/ui) attach handlers to pointerdown / mousedown instead and
  // ignore click. The full sequence — pointerdown, mousedown, focus,
  // pointerup, mouseup, then native click() — covers both styles. We
  // dispatch from the element's own bounding rect so coordinate-based
  // listeners (e.g. drag-to-select on canvases) get sane values.
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const init: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y,
    button: 0,
    buttons: 1,
  };
  const pointerInit: PointerEventInit = {
    ...init,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
  };

  el.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
  el.dispatchEvent(new MouseEvent('mousedown', init));
  el.focus({ preventScroll: true });
  el.dispatchEvent(new PointerEvent('pointerup', pointerInit));
  el.dispatchEvent(new MouseEvent('mouseup', init));
  // Native click() runs the activation algorithm — handles links, form
  // submit buttons, label-for-input forwarding, etc. Skipping it would
  // break form submission, which the dispatched MouseEvent('click')
  // does NOT trigger because it's "untrusted".
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
