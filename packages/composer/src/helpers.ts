// Capsule helpers — pure utilities (no React, no hooks, no DOM access
// beyond what the inputs already represent). Kept in their own module
// so the Capsule stays an orchestrator and these stay unit-testable.

import { type Attachment, type ContextCaptureRequest, type SelectionSnapshot } from './types';
import { type DomAction } from './dom-actions';

export function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + '…';
}

// Use as `.catch(swallow)` for read-side promises whose only failure
// mode is "keep the existing default". Centralised so future telemetry
// (Sentry, OpenTelemetry) gets one hook to wire.
export function swallow(_e: unknown): void {}

// Pull a partial `compose` value out of a streaming JSON buffer.
// Returns null if the response does not look like a compose case
// (e.g., the model started with `{"actions":[…`). Handles the most
// common JSON escape sequences inside the partial string. The buffer
// can end mid-escape (`...He\` waiting for the next char); we drop a
// trailing lone backslash so the rendered text stays clean.
export function extractPartialCompose(buffer: string): string | null {
  const match = buffer.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (!match) return null;
  let raw = match[1];
  // Drop a dangling backslash that could be the start of the next
  // escape sequence we haven't received yet.
  if (raw.endsWith('\\') && !raw.endsWith('\\\\')) {
    raw = raw.slice(0, -1);
  }
  return raw
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

// Carry the live page text, DOM skeleton and selection bbox through
// metadata so the backend (and the DOM-action planner in particular)
// has real selectors and live page context to work with. Backwards
// compatible: /composer/context ignores unknown metadata keys.
export function buildCapture(
  snapshot: SelectionSnapshot,
  screenshotDataUrl: string | null,
  attachments: Attachment[],
  shell: 'browser' | 'desktop',
): ContextCaptureRequest {
  const metadata: Record<string, unknown> = {};
  if (snapshot.pageText) metadata.page_text = snapshot.pageText;
  if (snapshot.domSkeleton) metadata.dom_skeleton = snapshot.domSkeleton;
  if (snapshot.bbox) metadata.selection_bbox = snapshot.bbox;
  if (screenshotDataUrl) metadata.screenshot_data_url = screenshotDataUrl;
  // Multimodal — image attachments ship through metadata so the backend
  // can reconstruct Anthropic content blocks. Text attachments stay
  // inlined into user_input (composeUserInputWithAttachments) since
  // they're already cheap to embed in a single string.
  const imageAttachments = attachments.filter(
    (a) => a.kind === 'image' && a.base64,
  );
  if (imageAttachments.length > 0) {
    metadata.attachments = imageAttachments.map((a) => ({
      name: a.name,
      mime: a.mime,
      base64: a.base64,
      bytes: a.bytes,
    }));
  }
  return {
    source: shell,
    url: snapshot.url,
    page_title: snapshot.pageTitle,
    selection: snapshot.text || undefined,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}

export function describeAction(action: DomAction): string {
  switch (action.type) {
    case 'fill':
      return `fill ${action.selector} ← "${truncate(action.value, 80)}"`;
    case 'click':
      return `click ${action.selector}`;
    case 'highlight':
      return `highlight ${action.selector}`;
    case 'scroll_to':
      return `scroll to ${action.selector}`;
    case 'shell.run': {
      const argline = (action.args ?? []).join(' ');
      const cwd = action.cwd ? ` (cwd: ${action.cwd})` : '';
      return `shell: ${action.cmd}${argline ? ` ${argline}` : ''}${cwd}`;
    }
    case 'fs.read':
      return `fs.read ${action.path}`;
    case 'fs.write':
      return `fs.write ${action.path} (${action.content.length} chars)`;
  }
}
