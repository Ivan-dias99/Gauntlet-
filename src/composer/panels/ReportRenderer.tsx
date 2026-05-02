// Wave 6 — report renderer.
//
// Pure-CSS, zero-dep renderer for the markdown-shaped output the brain
// returns when intent === "create_report" (or any artifact whose
// content reads like a structured doc). Parses the artifact line by
// line into blocks and renders each block with a dedicated component.
//
// Block kinds recognised:
//   - heading (#, ##, ###, ####)
//   - paragraph
//   - bullet list (- or *)
//   - ordered list (1. 2. 3.)
//   - table (| col | col |) with optional header separator (| --- |)
//   - blockquote (>)
//   - code block (``` … ```)
//   - thematic break (---)
//
// Two analytical primitives layered on top of the markdown layer:
//
//   1. KPI tile — a header at level 2 or 3 followed immediately by a
//      paragraph that begins with a bold token (**...**) or a token
//      that looks like a value ($, %, big number, "up X%"). The pair
//      collapses into a tile with the value prominent and the header
//      as label.
//
//   2. Bar chart — any table with exactly 2 columns where the right
//      column parses entirely as numbers gets a chart rendered above
//      the table itself, scaled proportionally.
//
// Inline formatting is intentionally minimal: bold (**…** or __…__),
// italic (*…* or _…_), and inline code (`…`). No links / images / HTML.

import type { CSSProperties, ReactNode } from "react";

// ─── Block types ────────────────────────────────────────────────────

type Block =
  | { kind: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "ulist"; items: string[] }
  | { kind: "olist"; items: string[] }
  | { kind: "table"; header: string[]; rows: string[][] }
  | { kind: "blockquote"; text: string }
  | { kind: "code"; lang: string | null; lines: string[] }
  | { kind: "hr" };

// ─── Parser ─────────────────────────────────────────────────────────

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const out: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip blank
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || null;
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing fence
      out.push({ kind: "code", lang, lines: buf });
      continue;
    }

    // Thematic break
    if (/^---+\s*$/.test(line) || /^\*\*\*+\s*$/.test(line)) {
      out.push({ kind: "hr" });
      i++;
      continue;
    }

    // Heading
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3 | 4;
      out.push({ kind: "heading", level, text: heading[2].trim() });
      i++;
      continue;
    }

    // Table — current line and the line after look like | … |.
    if (line.trim().startsWith("|") && i + 1 < lines.length && lines[i + 1].trim().startsWith("|")) {
      const headerCells = parseTableRow(line);
      // Second line should be the separator row (--- or :---)
      const sep = lines[i + 1].trim();
      const isSeparator = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(sep);
      if (isSeparator && headerCells.length > 0) {
        const rows: string[][] = [];
        i += 2;
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          rows.push(parseTableRow(lines[i]));
          i++;
        }
        out.push({ kind: "table", header: headerCells, rows });
        continue;
      }
    }

    // Blockquote
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push({ kind: "blockquote", text: buf.join(" ") });
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      out.push({ kind: "ulist", items });
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      out.push({ kind: "olist", items });
      continue;
    }

    // Paragraph — gather until blank line / next block-starter
    const buf: string[] = [line];
    i++;
    while (i < lines.length) {
      const next = lines[i];
      if (
        next.trim() === "" ||
        /^#{1,4}\s+/.test(next) ||
        next.startsWith("```") ||
        next.startsWith(">") ||
        /^\s*[-*]\s+/.test(next) ||
        /^\s*\d+\.\s+/.test(next) ||
        next.trim().startsWith("|") ||
        /^---+\s*$/.test(next) ||
        /^\*\*\*+\s*$/.test(next)
      ) {
        break;
      }
      buf.push(next);
      i++;
    }
    out.push({ kind: "paragraph", text: buf.join(" ").trim() });
  }

  return out;
}

function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

// ─── KPI detection ──────────────────────────────────────────────────
//
// Walk the parsed blocks; when a heading (level 2 or 3) is followed
// immediately by a paragraph whose text reads like a value (starts
// with a $ or %, contains a number, etc.), pair them as a KPI tile.

interface KpiTile {
  label: string;
  value: string;
  trail?: string; // "+12% YoY" sort of thing if present after the value
}

function extractKpis(blocks: Block[]): { kpis: KpiTile[]; rest: Block[] } {
  const kpis: KpiTile[] = [];
  const rest: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.kind === "heading" && (b.level === 2 || b.level === 3)) {
      const next = blocks[i + 1];
      if (next && next.kind === "paragraph" && looksLikeKpiValue(next.text)) {
        const { value, trail } = splitKpi(next.text);
        kpis.push({ label: b.text, value, trail });
        i++; // consume the paragraph
        continue;
      }
    }
    rest.push(b);
  }
  return { kpis, rest };
}

function looksLikeKpiValue(text: string): boolean {
  // Bold value: **$24.8M** or **56.3%**
  if (/^\*\*[^*]+\*\*/.test(text.trim())) return true;
  // Bare value: $24.8M, 56.3%, 1,234, +12.5%
  if (/^[$+\-]?[\d.,]+[a-zA-Z%]*\b/.test(text.trim())) return true;
  return false;
}

function splitKpi(text: string): { value: string; trail?: string } {
  // Strip the value portion: bolded segment OR first run of value chars,
  // then return the rest as trail.
  const bold = text.match(/^\*\*([^*]+)\*\*\s*(.*)$/);
  if (bold) {
    return { value: bold[1].trim(), trail: bold[2].trim() || undefined };
  }
  const m = text.match(/^([$+\-]?[\d.,]+[a-zA-Z%]*)\s*(.*)$/);
  if (m) {
    return { value: m[1], trail: m[2].trim() || undefined };
  }
  return { value: text };
}

// ─── Bar chart from 2-column numeric tables ─────────────────────────

function tableLooksNumeric(t: { header: string[]; rows: string[][] }): boolean {
  if (t.header.length !== 2) return false;
  if (t.rows.length < 2) return false;
  return t.rows.every((r) => {
    if (r.length < 2) return false;
    const n = parseFloat(r[1].replace(/[^\d.\-]/g, ""));
    return Number.isFinite(n);
  });
}

function rowsToBars(rows: string[][]): { label: string; value: number; raw: string }[] {
  return rows.map((r) => ({
    label: r[0],
    value: parseFloat(r[1].replace(/[^\d.\-]/g, "")) || 0,
    raw: r[1],
  }));
}

// ─── Inline formatter ───────────────────────────────────────────────

function renderInline(text: string): ReactNode[] {
  // Tokenise on inline markers: **bold**, __bold__, *em*, _em_, `code`.
  // Approach: find earliest match across markers, emit text + element,
  // recurse on the tail. Pure left-to-right, no AST.
  const out: ReactNode[] = [];
  let cursor = 0;
  const re = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > cursor) {
      out.push(text.slice(cursor, match.index));
    }
    const tok = match[1];
    if (tok.startsWith("**") || tok.startsWith("__")) {
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      out.push(
        <code
          key={key++}
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.92em",
            background: "var(--bg-elevated, #131316)",
            padding: "1px 5px",
            borderRadius: 3,
          }}
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      out.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    }
    cursor = match.index + tok.length;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

// ─── Renderer ───────────────────────────────────────────────────────

interface Props {
  content: string;
  /** Maximum vertical size before scroll (px). */
  maxHeight?: number;
}

const sectionGap = 14;

const headingStyle = (level: 1 | 2 | 3 | 4): CSSProperties => ({
  margin: 0,
  fontFamily: level <= 2 ? "var(--serif)" : "var(--sans)",
  fontWeight: level === 1 ? 400 : level === 2 ? 500 : 600,
  fontSize: level === 1 ? 24 : level === 2 ? 18 : level === 3 ? 14 : 13,
  letterSpacing: level >= 3 ? "var(--track-meta)" : "normal",
  textTransform: level >= 3 ? "uppercase" : "none",
  color: "var(--text-primary)",
});

const paragraphStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.65,
  color: "var(--text-primary)",
};

const blockquoteStyle: CSSProperties = {
  margin: 0,
  padding: "8px 14px",
  borderLeft: "3px solid color-mix(in oklab, var(--accent, #4a7cff) 60%, transparent)",
  background: "var(--bg-elevated, #131316)",
  fontStyle: "italic",
  color: "var(--text-secondary, var(--text-muted))",
  fontSize: 13,
  lineHeight: 1.6,
};

const codeBlockStyle: CSSProperties = {
  margin: 0,
  background: "var(--bg, #08080a)",
  border: "var(--border-soft)",
  borderRadius: 6,
  padding: "10px 12px",
  fontFamily: "var(--mono)",
  fontSize: 12,
  color: "var(--text-primary)",
  whiteSpace: "pre",
  overflowX: "auto",
};

export default function ReportRenderer({ content, maxHeight = 520 }: Props) {
  const blocksRaw = parseBlocks(content);
  const { kpis, rest } = extractKpis(blocksRaw);

  return (
    <div
      style={{
        background: "var(--bg, #08080a)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "18px 20px",
        maxHeight,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: sectionGap,
      }}
      data-report-renderer
    >
      {kpis.length > 0 && <KpiRow kpis={kpis} />}
      {rest.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "heading":
      return <h3 style={headingStyle(block.level)}>{renderInline(block.text)}</h3>;
    case "paragraph":
      return <p style={paragraphStyle}>{renderInline(block.text)}</p>;
    case "ulist":
      return (
        <ul style={{ margin: 0, paddingLeft: 22, fontSize: 13, lineHeight: 1.7, color: "var(--text-primary)" }}>
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      );
    case "olist":
      return (
        <ol style={{ margin: 0, paddingLeft: 22, fontSize: 13, lineHeight: 1.7, color: "var(--text-primary)" }}>
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ol>
      );
    case "blockquote":
      return <blockquote style={blockquoteStyle}>{renderInline(block.text)}</blockquote>;
    case "code":
      return (
        <pre style={codeBlockStyle}>
          {block.lang && (
            <span
              style={{
                display: "block",
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {block.lang}
            </span>
          )}
          {block.lines.join("\n")}
        </pre>
      );
    case "table":
      return <TableView header={block.header} rows={block.rows} />;
    case "hr":
      return (
        <hr
          style={{
            margin: "4px 0",
            border: "none",
            borderTop: "var(--border-soft)",
          }}
        />
      );
  }
}

function KpiRow({ kpis }: { kpis: KpiTile[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${kpis.length > 4 ? 160 : 200}px, 1fr))`,
        gap: 10,
      }}
      data-kpi-row
    >
      {kpis.map((k, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-elevated, #131316)",
            border: "var(--border-soft)",
            borderRadius: 8,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {k.label}
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 22, color: "var(--text-primary)" }}>
            {k.value}
          </span>
          {k.trail && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
              {renderInline(k.trail)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function TableView({ header, rows }: { header: string[]; rows: string[][] }) {
  const isNumeric = tableLooksNumeric({ header, rows });
  const bars = isNumeric ? rowsToBars(rows) : null;
  const max = bars ? Math.max(...bars.map((b) => Math.abs(b.value)), 1) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {bars && (
        <div
          data-bar-chart
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: "10px 12px",
            background: "var(--bg-elevated, #131316)",
            borderRadius: 6,
          }}
        >
          {bars.map((b, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(120px, 200px) 1fr 80px",
                gap: 12,
                alignItems: "center",
                fontSize: 12,
                fontFamily: "var(--mono)",
              }}
            >
              <span style={{ color: "var(--text-primary)" }}>{b.label}</span>
              <div
                aria-hidden
                style={{
                  height: 8,
                  borderRadius: 2,
                  background: "color-mix(in oklab, var(--accent, #4a7cff) 60%, transparent)",
                  width: `${(Math.abs(b.value) / max) * 100}%`,
                  minWidth: 2,
                }}
              />
              <span style={{ color: "var(--text-muted)", textAlign: "right" }}>{b.raw}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--mono)" }}>
          <thead>
            <tr>
              {header.map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    color: "var(--text-muted)",
                    borderBottom: "var(--border-soft)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: "var(--border-soft)" }}>
                {r.map((c, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "6px 10px",
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {renderInline(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
