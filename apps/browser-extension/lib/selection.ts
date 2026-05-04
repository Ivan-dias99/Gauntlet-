// Selection helpers. The capsule asks for a snapshot of "what is the user
// pointing at right now" — selection text, page identity, a bounded slice
// of visible page text, and the bounding box of the selection so an
// in-page overlay can anchor itself to the cursor.
//
// All accessors are wrapped in try/catch because content scripts run on
// every page and some pages have hostile or unusual DOMs (PDF viewers,
// `about:blank` iframes, sandboxed roots) that can throw on the simplest
// access.

const PAGE_TEXT_LIMIT = 5000;
const DOM_SKELETON_LIMIT = 4000;
const DOM_SKELETON_MAX_INPUTS = 60;
const DOM_SKELETON_MAX_CONTROLS = 60;

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectionSnapshot {
  text: string;
  url: string;
  pageTitle: string;
  pageText: string;
  domSkeleton: string;
  bbox: SelectionRect | null;
}

export function readSelectionSnapshot(): SelectionSnapshot {
  return {
    text: readSelectionText(),
    url: safeReadUrl(),
    pageTitle: safeReadTitle(),
    pageText: readPageText(),
    domSkeleton: readDomSkeleton(),
    bbox: readSelectionBbox(),
  };
}

function readSelectionText(): string {
  try {
    const sel = window.getSelection();
    return sel ? sel.toString().trim() : '';
  } catch {
    return '';
  }
}

function safeReadUrl(): string {
  try {
    return window.location.href;
  } catch {
    return '';
  }
}

function safeReadTitle(): string {
  try {
    return document.title ?? '';
  } catch {
    return '';
  }
}

function readPageText(): string {
  try {
    const body = document.body;
    if (!body) return '';
    const raw = body.innerText ?? '';
    if (raw.length <= PAGE_TEXT_LIMIT) return raw;
    return raw.slice(0, PAGE_TEXT_LIMIT) + '…';
  } catch {
    return '';
  }
}

// A compact listing of the page's fillable + clickable elements with
// their CSS selectors. The DOM-action planner needs real selectors —
// without this listing the model hallucinates CSS and the executor
// fails on every selector lookup.
//
// Format is one element per line:
//   input#email[type="email"]  -- placeholder/label
//   button#submit  -- "Send"
//   a#nav-home  -- "Home" (→ /home)
//
// Capped element counts and overall byte length so a giant page
// (Notion, Twitter timelines, infinite-scroll pages) still fits.
function readDomSkeleton(): string {
  try {
    const out: string[] = [];
    const inputs = document.querySelectorAll(
      'input, textarea, select, [contenteditable="true"]',
    );
    let inputCount = 0;
    for (const el of Array.from(inputs)) {
      if (inputCount++ >= DOM_SKELETON_MAX_INPUTS) break;
      out.push(describeInput(el));
    }
    const controls = document.querySelectorAll('button, a[href]');
    let controlCount = 0;
    for (const el of Array.from(controls)) {
      if (controlCount++ >= DOM_SKELETON_MAX_CONTROLS) break;
      out.push(describeControl(el));
    }
    let blob = out.join('\n');
    if (blob.length > DOM_SKELETON_LIMIT) {
      blob = blob.slice(0, DOM_SKELETON_LIMIT) + '…';
    }
    return blob;
  } catch {
    return '';
  }
}

function describeInput(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.getAttribute('id');
  const name = el.getAttribute('name');
  const type = el.getAttribute('type');
  const placeholder = el.getAttribute('placeholder') ?? '';
  const ariaLabel = el.getAttribute('aria-label') ?? '';
  const sel = id
    ? `${tag}#${id}`
    : name
      ? `${tag}[name="${name}"]`
      : type
        ? `${tag}[type="${type}"]`
        : tag;
  const label = (placeholder || ariaLabel || '').trim().slice(0, 80);
  return label ? `${sel}  -- ${label}` : sel;
}

function describeControl(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.getAttribute('id');
  const sel = id ? `${tag}#${id}` : tag;
  const text = (el as HTMLElement).innerText?.trim().slice(0, 80) ?? '';
  if (tag === 'a') {
    const href = (el as HTMLAnchorElement).getAttribute('href') ?? '';
    const trimmedHref = href.length > 80 ? href.slice(0, 80) + '…' : href;
    return text || trimmedHref
      ? `${sel}  -- ${text}${trimmedHref ? ` (→ ${trimmedHref})` : ''}`
      : sel;
  }
  return text ? `${sel}  -- ${text}` : sel;
}

function readSelectionBbox(): SelectionRect | null {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };
  } catch {
    return null;
  }
}
