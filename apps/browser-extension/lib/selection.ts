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
  bbox: SelectionRect | null;
}

export function readSelectionSnapshot(): SelectionSnapshot {
  return {
    text: readSelectionText(),
    url: safeReadUrl(),
    pageTitle: safeReadTitle(),
    pageText: readPageText(),
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
