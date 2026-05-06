// Inline markdown renderer — zero dependency, narrow surface.
//
// Doctrine: output do modelo deve sentir-se sério e estilizado, não
// uma fita de texto. Suporta o subset que o planner do Gauntlet
// produz na prática:
//   * #, ##, ### headings (single-line)
//   * **bold**, *italic*, _italic_, `inline code`
//   * [text](url) links — opened with rel=noopener noreferrer
//   * ```fenced code blocks``` with optional language tag
//   * - or * unordered lists, 1. ordered lists
//   * > blockquote
//   * --- horizontal rule
//   * paragraphs separated by blank lines
//
// Out of scope (would bloat the bundle): tables, footnotes, autolinks,
// HTML passthrough. The capsule is small; prose stays small.
//
// Why hand-rolled instead of `marked` / `react-markdown`: those add
// 30–60 kB gzipped each. We render our own model output — every byte
// in the cápsula bundle is a byte the page has to download on every
// site mount.

import type { ReactNode } from 'react';

interface CodeBlock {
  kind: 'code';
  lang: string | null;
  body: string;
}

interface ProseBlock {
  kind: 'prose';
  body: string; // raw, including newlines
}

type Block = CodeBlock | ProseBlock;

// Split into top-level blocks: fenced code vs prose. Code fences win
// — anything between ``` and ``` is preserved verbatim, including
// blank lines, so prose-rendering doesn't accidentally re-format it.
function splitBlocks(src: string): Block[] {
  const out: Block[] = [];
  const lines = src.split('\n');
  let i = 0;
  let prose: string[] = [];

  function flushProse() {
    if (prose.length === 0) return;
    out.push({ kind: 'prose', body: prose.join('\n') });
    prose = [];
  }

  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```(\w[\w+-]*)?\s*$/);
    if (fence) {
      flushProse();
      const lang = fence[1] || null;
      i++;
      const start = i;
      while (i < lines.length && !lines[i].match(/^```\s*$/)) i++;
      const body = lines.slice(start, i).join('\n');
      out.push({ kind: 'code', lang, body });
      i++; // skip closing fence (or EOF)
      continue;
    }
    prose.push(line);
    i++;
  }
  flushProse();
  return out;
}

// Inline-formatting tokens. Order matters: longer / more specific
// patterns first so `**bold**` is not parsed as two `*italic*`s.
const INLINE_PATTERNS: Array<[RegExp, (m: RegExpMatchArray, key: number) => ReactNode]> = [
  [
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,
    (m, k) => (
      <a
        key={`a-${k}`}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="gauntlet-md__link"
      >
        {m[1]}
      </a>
    ),
  ],
  [
    /`([^`]+)`/,
    (m, k) => (
      <code key={`c-${k}`} className="gauntlet-md__inline-code">
        {m[1]}
      </code>
    ),
  ],
  [
    /\*\*([^*]+)\*\*/,
    (m, k) => (
      <strong key={`b-${k}`} className="gauntlet-md__strong">
        {m[1]}
      </strong>
    ),
  ],
  [
    /\*([^*]+)\*/,
    (m, k) => (
      <em key={`i-${k}`} className="gauntlet-md__em">
        {m[1]}
      </em>
    ),
  ],
  [
    /_([^_]+)_/,
    (m, k) => (
      <em key={`u-${k}`} className="gauntlet-md__em">
        {m[1]}
      </em>
    ),
  ],
];

// Walk a single line, emitting React nodes for runs of plain text and
// each matching inline pattern. Single-pass: we look for the earliest
// match across all patterns, render it, then continue from after it.
function renderInline(line: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;
  let counter = 0;
  while (cursor < line.length) {
    let earliest: { idx: number; match: RegExpMatchArray; render: (m: RegExpMatchArray, k: number) => ReactNode } | null = null;
    for (const [re, render] of INLINE_PATTERNS) {
      const slice = line.slice(cursor);
      const m = slice.match(re);
      if (!m || m.index === undefined) continue;
      if (earliest === null || m.index < earliest.idx) {
        earliest = { idx: m.index, match: m, render };
      }
    }
    if (earliest === null) {
      out.push(line.slice(cursor));
      break;
    }
    if (earliest.idx > 0) {
      out.push(line.slice(cursor, cursor + earliest.idx));
    }
    out.push(earliest.render(earliest.match, keyBase * 100 + counter));
    counter++;
    cursor += earliest.idx + earliest.match[0].length;
  }
  return out;
}

// Render a contiguous block of prose (no code fences inside).
function renderProse(src: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  const lines = src.split('\n');
  let i = 0;
  let key = keyBase;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Headings (must come before paragraph)
    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const tag = (`h${level}` as 'h1' | 'h2' | 'h3');
      const Tag = tag;
      out.push(
        <Tag key={`h-${key++}`} className={`gauntlet-md__h gauntlet-md__h${level}`}>
          {renderInline(heading[2], key++)}
        </Tag>,
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      out.push(<hr key={`hr-${key++}`} className="gauntlet-md__hr" />);
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      out.push(
        <blockquote key={`q-${key++}`} className="gauntlet-md__quote">
          {renderInline(quoteLines.join(' '), key++)}
        </blockquote>,
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      out.push(
        <ul key={`ul-${key++}`} className="gauntlet-md__list">
          {items.map((it, n) => (
            <li key={n} className="gauntlet-md__li">
              {renderInline(it, key++)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      out.push(
        <ol key={`ol-${key++}`} className="gauntlet-md__list">
          {items.map((it, n) => (
            <li key={n} className="gauntlet-md__li">
              {renderInline(it, key++)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph — coalesce until blank line / structural pivot
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      const t = l.trim();
      if (!t) break;
      if (/^(#{1,3})\s+/.test(t)) break;
      if (/^---+$/.test(t) || /^\*\*\*+$/.test(t)) break;
      if (t.startsWith('>')) break;
      if (/^[-*]\s+/.test(t)) break;
      if (/^\d+\.\s+/.test(t)) break;
      paraLines.push(l);
      i++;
    }
    out.push(
      <p key={`p-${key++}`} className="gauntlet-md__p">
        {renderInline(paraLines.join(' '), key++)}
      </p>,
    );
  }

  return out;
}

export interface MarkdownProps {
  source: string;
  // When provided, code blocks render with a copy button that calls
  // back so the host can flash a "copiado" pill. Falls back to
  // navigator.clipboard.writeText silently when unset.
  onCopyBlock?: (body: string) => void;
}

export function Markdown({ source, onCopyBlock }: MarkdownProps) {
  const blocks = splitBlocks(source);
  return (
    <div className="gauntlet-md">
      {blocks.map((b, i) =>
        b.kind === 'code' ? (
          <CodeBlockView
            key={`cb-${i}`}
            lang={b.lang}
            body={b.body}
            onCopy={onCopyBlock}
          />
        ) : (
          <div key={`pb-${i}`} className="gauntlet-md__prose">
            {renderProse(b.body, i * 1000)}
          </div>
        ),
      )}
    </div>
  );
}

// Lightweight syntax highlighter — zero dependency. Three families
// cover ~95% of the code the cápsula renders in practice: python,
// typescript/javascript, shell (bash + powershell). Anything else
// falls through to plain text. The mistakes we accept are rare nested
// strings and nested block comments — better-than-marker rendering at
// near-zero bundle cost. Token kinds map to the --gx-code-* CSS vars
// so themes (light flagship + night premium) stay in lockstep.

type SyntaxKind = 'k' | 's' | 'n' | 'c' | 'f' | 'p';
interface SyntaxToken {
  kind: SyntaxKind;
  text: string;
}

interface LangSpec {
  keywords: Set<string>;
  // Per-character comment lead. Returns the index AFTER the comment if
  // a comment starts at i, otherwise -1.
  matchComment: (src: string, i: number) => number;
}

const PY_KEYWORDS = new Set([
  'def','class','if','elif','else','for','while','return','import','from',
  'as','with','try','except','finally','raise','pass','break','continue',
  'in','is','not','and','or','lambda','yield','async','await','global',
  'nonlocal','True','False','None','self','cls','print',
]);

const TS_KEYWORDS = new Set([
  'function','const','let','var','if','else','return','class','export',
  'import','from','as','default','async','await','for','while','try',
  'catch','finally','throw','new','this','super','extends','implements',
  'interface','type','enum','public','private','protected','readonly',
  'static','typeof','instanceof','in','of','null','undefined','true',
  'false','void','switch','case','break','continue','do','yield',
]);

const SH_KEYWORDS = new Set([
  'cd','ls','cat','rm','mv','cp','mkdir','touch','grep','sed','awk',
  'export','source','if','then','else','elif','fi','for','while','do',
  'done','case','esac','exit','npm','npx','git','python','node','tsc',
  'make','vite','wxt','set','get','start-process','select-string',
]);

function commentHashLine(src: string, i: number): number {
  if (src[i] !== '#') return -1;
  const end = src.indexOf('\n', i);
  return end === -1 ? src.length : end;
}

function commentSlashOrBlock(src: string, i: number): number {
  if (src[i] !== '/') return -1;
  if (src[i + 1] === '/') {
    const end = src.indexOf('\n', i);
    return end === -1 ? src.length : end;
  }
  if (src[i + 1] === '*') {
    const end = src.indexOf('*/', i + 2);
    return end === -1 ? src.length : end + 2;
  }
  return -1;
}

const LANG_PY: LangSpec = { keywords: PY_KEYWORDS, matchComment: commentHashLine };
const LANG_TS: LangSpec = { keywords: TS_KEYWORDS, matchComment: commentSlashOrBlock };
const LANG_SH: LangSpec = { keywords: SH_KEYWORDS, matchComment: commentHashLine };

function pickLang(label: string | null): LangSpec | null {
  if (!label) return null;
  const k = label.toLowerCase();
  if (
    k === 'py' || k === 'python' || k === 'python3' ||
    k === 'ipython' || k === 'pycon'
  ) return LANG_PY;
  if (
    k === 'ts' || k === 'tsx' || k === 'typescript' ||
    k === 'js' || k === 'jsx' || k === 'javascript' || k === 'mjs' ||
    k === 'json' || k === 'json5'
  ) return LANG_TS;
  if (
    k === 'sh' || k === 'bash' || k === 'zsh' || k === 'shell' ||
    k === 'powershell' || k === 'ps' || k === 'ps1' || k === 'console'
  ) return LANG_SH;
  return null;
}

function isIdentStart(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_' || ch === '$';
}
function isIdentCont(ch: string): boolean {
  return isIdentStart(ch) || (ch >= '0' && ch <= '9');
}
function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function tokenize(src: string, lang: LangSpec): SyntaxToken[] {
  const out: SyntaxToken[] = [];
  let plain = '';
  function flushPlain() {
    if (plain) {
      out.push({ kind: 'p', text: plain });
      plain = '';
    }
  }
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    // Comment
    const commentEnd = lang.matchComment(src, i);
    if (commentEnd !== -1) {
      flushPlain();
      out.push({ kind: 'c', text: src.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }
    // Triple-quoted string (python)
    if (lang === LANG_PY && (src.startsWith('"""', i) || src.startsWith("'''", i))) {
      flushPlain();
      const q = src.slice(i, i + 3);
      let end = src.indexOf(q, i + 3);
      end = end === -1 ? src.length : end + 3;
      out.push({ kind: 's', text: src.slice(i, end) });
      i = end;
      continue;
    }
    // Regular string (single, double, backtick)
    if (ch === '"' || ch === "'" || ch === '`') {
      flushPlain();
      let j = i + 1;
      while (j < src.length && src[j] !== ch) {
        if (src[j] === '\\') {
          j += 2;
          continue;
        }
        if (src[j] === '\n' && ch !== '`') break; // unterminated single/double — recover
        j++;
      }
      const stop = j < src.length ? j + 1 : j;
      out.push({ kind: 's', text: src.slice(i, stop) });
      i = stop;
      continue;
    }
    // Number
    if (isDigit(ch)) {
      flushPlain();
      let j = i;
      while (j < src.length && (isDigit(src[j]) || src[j] === '.' || src[j] === '_')) j++;
      // Optional exponent / unit (e.g. 1e-5, 12px)
      if (j < src.length && (src[j] === 'e' || src[j] === 'E')) {
        j++;
        if (j < src.length && (src[j] === '+' || src[j] === '-')) j++;
        while (j < src.length && isDigit(src[j])) j++;
      }
      out.push({ kind: 'n', text: src.slice(i, j) });
      i = j;
      continue;
    }
    // Identifier / keyword / function call
    if (isIdentStart(ch)) {
      flushPlain();
      let j = i + 1;
      while (j < src.length && isIdentCont(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < src.length && src[k] === ' ') k++;
      const isFn = src[k] === '(';
      let kind: SyntaxKind = 'p';
      if (lang.keywords.has(word)) kind = 'k';
      else if (isFn) kind = 'f';
      out.push({ kind, text: word });
      i = j;
      continue;
    }
    // Anything else — append to plain run.
    plain += ch;
    i++;
  }
  flushPlain();
  return out;
}

function CodeBlockView({
  lang,
  body,
  onCopy,
}: {
  lang: string | null;
  body: string;
  onCopy?: (body: string) => void;
}) {
  const handleCopy = () => {
    void navigator.clipboard.writeText(body).catch(() => {
      // Clipboard write blocked (some sandboxed iframes do this).
      // Caller's flash will simply not fire — silent degrade.
    });
    onCopy?.(body);
  };
  const langSpec = pickLang(lang);
  const tokens = langSpec ? tokenize(body, langSpec) : null;
  return (
    <figure className="gauntlet-md__code">
      <header className="gauntlet-md__code-meta">
        <span className="gauntlet-md__code-lang">{lang ?? 'code'}</span>
        <button
          type="button"
          className="gauntlet-md__code-copy"
          onClick={handleCopy}
          aria-label="copy code"
        >
          copy
        </button>
      </header>
      <pre className="gauntlet-md__code-body">
        {tokens ? (
          <code>
            {tokens.map((t, idx) => (
              <span
                key={idx}
                className={`gauntlet-md__tok gauntlet-md__tok--${t.kind}`}
              >
                {t.text}
              </span>
            ))}
          </code>
        ) : (
          <code>{body}</code>
        )}
      </pre>
    </figure>
  );
}
