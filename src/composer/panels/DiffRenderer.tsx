// Wave 3 — minimal CSS-based diff + code renderer.
//
// Zero deps. Recognises two shapes:
//   1. Unified diff (lines starting with `+++`, `---`, `@@`, `+`, `-`, ` `):
//      tone-codes added/removed/context lines; renders hunk headers in a
//      muted accent color. This is the format the backend's spec_to_code
//      and code_patch artifacts return.
//   2. Plain code (no diff markers): renders as a monospace block with
//      line numbers and zebra striping; no syntax highlighting (Wave 4+
//      brings prism/shiki when we accept a runtime-cost dep).
//
// Detection: any line starting with `@@ ` OR a pair of `--- ... / +++ ...`
// markers within the first 6 lines triggers diff mode. Otherwise plain.

import type { CSSProperties } from "react";

type LineKind = "add" | "remove" | "hunk" | "file" | "context";

interface DiffLine {
  kind: LineKind;
  text: string;
  oldNo: number | null;
  newNo: number | null;
}

function detectDiff(content: string): boolean {
  const head = content.split("\n", 6).join("\n");
  if (/^@@ /m.test(head)) return true;
  if (/^--- /m.test(head) && /^\+\+\+ /m.test(head)) return true;
  return false;
}

function parseDiff(content: string): DiffLine[] {
  const out: DiffLine[] = [];
  let oldNo = 0;
  let newNo = 0;
  for (const raw of content.split("\n")) {
    if (raw.startsWith("@@")) {
      // @@ -oldStart,oldCount +newStart,newCount @@
      const m = raw.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (m) {
        oldNo = Number(m[1]);
        newNo = Number(m[2]);
      }
      out.push({ kind: "hunk", text: raw, oldNo: null, newNo: null });
      continue;
    }
    if (raw.startsWith("---") || raw.startsWith("+++")) {
      out.push({ kind: "file", text: raw, oldNo: null, newNo: null });
      continue;
    }
    if (raw.startsWith("+")) {
      out.push({ kind: "add", text: raw.slice(1), oldNo: null, newNo: newNo++ });
      continue;
    }
    if (raw.startsWith("-")) {
      out.push({ kind: "remove", text: raw.slice(1), oldNo: oldNo++, newNo: null });
      continue;
    }
    out.push({
      kind: "context",
      text: raw.startsWith(" ") ? raw.slice(1) : raw,
      oldNo: oldNo++,
      newNo: newNo++,
    });
  }
  return out;
}

const KIND_BG: Record<LineKind, string> = {
  add:     "color-mix(in oklab, var(--ok, #4a8c5d) 14%, transparent)",
  remove:  "color-mix(in oklab, var(--danger, #d04a4a) 14%, transparent)",
  hunk:    "color-mix(in oklab, var(--accent, #4a7cff) 10%, transparent)",
  file:    "var(--bg-elevated, #131316)",
  context: "transparent",
};

const KIND_FG: Record<LineKind, string> = {
  add:     "color-mix(in oklab, var(--ok, #4a8c5d) 95%, var(--text-primary))",
  remove:  "color-mix(in oklab, var(--danger, #d04a4a) 95%, var(--text-primary))",
  hunk:    "var(--text-muted)",
  file:    "var(--text-muted)",
  context: "var(--text-primary)",
};

const KIND_GLYPH: Record<LineKind, string> = {
  add:     "+",
  remove:  "−",
  hunk:    "@",
  file:    "·",
  context: " ",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "var(--mono)",
  fontSize: 12,
  lineHeight: 1.55,
};

const gutterStyle: CSSProperties = {
  width: 32,
  textAlign: "right",
  padding: "0 6px",
  color: "var(--text-muted)",
  userSelect: "none",
  background: "var(--bg, #08080a)",
  borderRight: "var(--border-soft)",
  whiteSpace: "nowrap",
};

const glyphStyle: CSSProperties = {
  width: 18,
  textAlign: "center",
  padding: "0 4px",
  userSelect: "none",
};

const textCellStyle: CSSProperties = {
  padding: "0 8px",
  whiteSpace: "pre",
  wordBreak: "normal",
  overflowWrap: "normal",
};

export interface DiffRendererProps {
  content: string;
  /** Optional dedicated diff field; falls back to content. */
  diff?: string;
  /** Outer max-height to stay scrollable inside narrow canvases. */
  maxHeight?: number;
}

export default function DiffRenderer({ content, diff, maxHeight = 420 }: DiffRendererProps) {
  const source = diff && diff.length > 0 ? diff : content;
  const isDiff = detectDiff(source);

  const wrap: CSSProperties = {
    background: "var(--bg, #08080a)",
    border: "var(--border-soft)",
    borderRadius: "var(--radius-md, 8px)",
    maxHeight,
    overflow: "auto",
  };

  if (!isDiff) {
    const lines = source.split("\n");
    return (
      <div style={wrap} data-renderer="code">
        <table style={tableStyle}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} style={{ background: i % 2 === 1 ? "var(--bg-surface)" : "transparent" }}>
                <td style={gutterStyle}>{i + 1}</td>
                <td style={{ ...textCellStyle, color: "var(--text-primary)" }}>{line || " "}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const parsed = parseDiff(source);
  return (
    <div style={wrap} data-renderer="diff">
      <table style={tableStyle}>
        <tbody>
          {parsed.map((line, i) => (
            <tr key={i} style={{ background: KIND_BG[line.kind] }}>
              <td style={gutterStyle}>{line.oldNo ?? ""}</td>
              <td style={gutterStyle}>{line.newNo ?? ""}</td>
              <td style={{ ...glyphStyle, color: KIND_FG[line.kind] }}>{KIND_GLYPH[line.kind]}</td>
              <td style={{ ...textCellStyle, color: KIND_FG[line.kind] }}>{line.text || " "}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
