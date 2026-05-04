// context-extractor.ts — rich page context for the DOM-action planner.
//
// Three extractors live here:
//   extractDomSkeleton()  — JSON listing of interactive + landmark elements
//                           with CSS selectors, visibility, and depth.
//   extractPageText()     — cleaned visible text, capped at 5 000 chars.
//   captureScreenshot()   — asks the background service worker to call
//                           chrome.tabs.captureVisibleTab and returns the
//                           data URL (or null on failure / opt-out).
//
// All three are best-effort: they return empty/null rather than throwing
// so a hostile or unusual DOM never breaks the capsule mount path.
//
// Doctrine: the backend's /composer/context route reads
//   metadata.page_text      — plain string
//   metadata.dom_skeleton   — JSON string (DomSkeletonResult)
//   metadata.screenshot_data_url — data URL string
// This module is the single source of truth for producing those values.

// ---------------------------------------------------------------------------
// DOM Skeleton
// ---------------------------------------------------------------------------

const DOM_SKELETON_MAX_ELEMENTS = 100;

// Tags we never want in the skeleton — they carry no interactive value
// and would waste token budget.
const SKIP_TAGS = new Set([
  'script', 'style', 'meta', 'link', 'noscript',
  'head', 'html', 'br', 'hr', 'wbr',
]);

// Gauntlet's own shadow host id — never include our own UI in the skeleton.
const GAUNTLET_HOST_ID = 'gauntlet-capsule-host';

export interface DomSkeletonElement {
  selector: string;
  tag: string;
  // Present on <input> / <select> / <textarea>
  type?: string;
  // Hint text visible to the user (placeholder, aria-label, title)
  placeholder?: string;
  // Visible inner text, first 50 chars
  text?: string;
  // True when the element is in the viewport and not hidden
  visible: boolean;
  // DOM depth from <body>
  depth: number;
}

export interface DomSkeletonResult {
  elements: DomSkeletonElement[];
}

// Build the most specific stable CSS selector we can for an element.
// Priority: id > name attribute > type attribute > class combo > bare tag.
// We deliberately avoid nth-child / positional selectors — they break the
// moment the page re-renders a list item.
function buildSelector(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.getAttribute('id');
  if (id && !id.startsWith('gauntlet-')) {
    return `${tag}#${CSS.escape(id)}`;
  }
  const name = el.getAttribute('name');
  if (name) {
    return `${tag}[name="${name}"]`;
  }
  const type = el.getAttribute('type');
  if (type) {
    return `${tag}[type="${type}"]`;
  }
  // Use up to two meaningful class names (skip utility/state classes that
  // are too volatile to be useful selectors).
  const classes = Array.from(el.classList)
    .filter((c) => c.length > 2 && !c.startsWith('is-') && !c.startsWith('has-'))
    .slice(0, 2);
  if (classes.length > 0) {
    return `${tag}.${classes.map((c) => CSS.escape(c)).join('.')}`;
  }
  return tag;
}

function isVisible(el: Element): boolean {
  try {
    const style = window.getComputedStyle(el);
    if (style.display === 'none') return false;
    if (style.visibility === 'hidden') return false;
    if (style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    // Element must overlap the viewport at least partially.
    if (rect.width === 0 && rect.height === 0) return false;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return false;
    if (rect.right < 0 || rect.left > window.innerWidth) return false;
    return true;
  } catch {
    return false;
  }
}

function domDepth(el: Element): number {
  let depth = 0;
  let node: Element | null = el;
  while (node && node !== document.body) {
    depth++;
    node = node.parentElement;
  }
  return depth;
}

function isInsideGauntlet(el: Element): boolean {
  // Walk up to see if we're inside the shadow host. Because our UI lives
  // in a shadow root, querySelector from the outside won't reach inside —
  // but the host element itself IS in the light DOM and we can detect it.
  let node: Element | null = el;
  while (node) {
    if (node.id === GAUNTLET_HOST_ID) return true;
    if (node.id?.startsWith('gauntlet-')) return true;
    node = node.parentElement;
  }
  return false;
}

function describeElement(el: Element): DomSkeletonElement | null {
  const tag = el.tagName.toLowerCase();
  if (SKIP_TAGS.has(tag)) return null;
  if (isInsideGauntlet(el)) return null;

  const selector = buildSelector(el);
  const visible = isVisible(el);
  const depth = domDepth(el);

  const entry: DomSkeletonElement = { selector, tag, visible, depth };

  // Type attribute (inputs, buttons)
  const type = el.getAttribute('type');
  if (type) entry.type = type;

  // Hint text: placeholder > aria-label > title
  const placeholder =
    el.getAttribute('placeholder') ||
    el.getAttribute('aria-label') ||
    el.getAttribute('title') ||
    '';
  if (placeholder) entry.placeholder = placeholder.trim().slice(0, 80);

  // Visible text content (buttons, links, labels)
  const innerText = (el as HTMLElement).innerText?.trim() ?? '';
  if (innerText && innerText.length > 0) {
    entry.text = innerText.slice(0, 50);
  }

  return entry;
}

// Selector for elements worth including in the skeleton. We want:
//   - All form controls (inputs, textareas, selects, contenteditable)
//   - Buttons and links (the things the planner will click)
//   - Landmark roles (nav, main, aside, header, footer) for orientation
//   - Elements with an id or name attribute (stable selectors)
const SKELETON_QUERY = [
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  'button',
  'a[href]',
  'label',
  '[role="button"]',
  '[role="link"]',
  '[role="textbox"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  'nav',
  'main',
  'form',
].join(', ');

export function extractDomSkeleton(): DomSkeletonResult {
  try {
    const elements: DomSkeletonElement[] = [];
    const seen = new Set<string>();

    const candidates = document.querySelectorAll(SKELETON_QUERY);
    for (const el of Array.from(candidates)) {
      if (elements.length >= DOM_SKELETON_MAX_ELEMENTS) break;
      const entry = describeElement(el);
      if (!entry) continue;
      // Deduplicate by selector — the same element can match multiple
      // parts of the compound query.
      if (seen.has(entry.selector)) continue;
      seen.add(entry.selector);
      elements.push(entry);
    }

    return { elements };
  } catch {
    return { elements: [] };
  }
}

// ---------------------------------------------------------------------------
// Page Text
// ---------------------------------------------------------------------------

const PAGE_TEXT_MAX_CHARS = 5000;

export function extractPageText(): string {
  try {
    const body = document.body;
    if (!body) return '';
    const raw = body.innerText ?? '';
    // Normalise: collapse runs of whitespace/blank lines to a single
    // newline so the model sees clean prose rather than a wall of
    // indentation from deeply nested layouts.
    const cleaned = raw
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Collapse 3+ consecutive newlines to 2 (preserve paragraph breaks)
      .replace(/\n{3,}/g, '\n\n')
      // Collapse horizontal whitespace runs (tabs, multiple spaces)
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    if (cleaned.length <= PAGE_TEXT_MAX_CHARS) return cleaned;
    return cleaned.slice(0, PAGE_TEXT_MAX_CHARS) + '…';
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Screenshot
// ---------------------------------------------------------------------------

const SCREENSHOT_MAX_BYTES = 1.5 * 1024 * 1024; // 1.5 MB encoded

// Asks the background service worker to capture the visible tab.
// Returns null when:
//   - the user has not opted in (screenshotEnabled = false)
//   - the background script returns an error (restricted tab, etc.)
//   - the resulting data URL exceeds the size cap
//   - chrome.runtime is unavailable (non-extension context)
export async function captureScreenshot(): Promise<string | null> {
  try {
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
      return null;
    }
    const reply = (await chrome.runtime.sendMessage({
      type: 'gauntlet:capture_screenshot',
    })) as { ok?: boolean; dataUrl?: string } | undefined;
    if (!reply?.ok || !reply.dataUrl) return null;
    // Guard against token-budget blowout from very large screenshots.
    if (reply.dataUrl.length > SCREENSHOT_MAX_BYTES) return null;
    return reply.dataUrl;
  } catch {
    return null;
  }
}
