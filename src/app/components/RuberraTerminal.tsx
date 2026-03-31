/**
 * RUBERRA Terminal — elite execution surface
 * Warm-dark, semantic, structured. Machine-grade precision.
 * Used in: Lab Code view, Creation Build view
 */

import { useRef, useEffect, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Message } from "./shell-types";
import { ModelSelector } from "./ModelSelector";
import { type ChamberTab, type TaskType } from "./model-orchestration";

// ─── Terminal Color System ────────────────────────────────────────────────────

const T = {
  bg:       "var(--rt-bg)",
  surface:  "var(--rt-surface)",
  line:     "var(--rt-border)",
  line2:    "var(--rt-border2)",
  text:     "var(--rt-text)",
  dim:      "var(--rt-dim)",
  dim2:     "var(--rt-dim2)",
  green:    "var(--rt-ok)",
  greenBg:  "var(--rt-okBg)",
  red:      "var(--rt-err)",
  redBg:    "var(--rt-errBg)",
  amber:    "var(--rt-amber)",
  amberDim: "var(--rt-amberDim)",
  amberBg:  "var(--rt-amberBg)",
  pink:     "var(--rt-pink)",
  cyan:     "var(--rt-cyan)",
  purple:   "var(--rt-purple)",
  number:   "var(--rt-number)",
  op:       "var(--rt-ok)",
  prompt:   "var(--rt-text)",
} as const;

// ─── Syntax Highlighter ───────────────────────────────────────────────────────

const KEYWORDS = new Set([
  "import","export","from","as","const","let","var","function","class","return",
  "if","else","for","while","do","switch","case","break","continue","new","this",
  "null","undefined","true","false","void","typeof","instanceof","in","of",
  "type","interface","extends","implements","async","await","try","catch","throw",
  "default","delete","enum","abstract","static","public","private","protected",
  "readonly","namespace","module","declare","yield","super","with",
]);

interface Token { text: string; color: string; }

function tokenizeLine(raw: string): Token[] {
  if (!raw.trim()) return [{ text: raw, color: T.text }];

  const tokens: Token[] = [];
  let i = 0;

  while (i < raw.length) {
    if (raw[i] === "/" && raw[i + 1] === "/") {
      tokens.push({ text: raw.slice(i), color: T.dim });
      break;
    }
    if (raw[i] === "#") {
      tokens.push({ text: raw.slice(i), color: T.dim });
      break;
    }
    if (raw[i] === '"' || raw[i] === "'" || raw[i] === "`") {
      const q = raw[i];
      let j = i + 1;
      while (j < raw.length && raw[j] !== q) {
        if (raw[j] === "\\") j++;
        j++;
      }
      j++;
      tokens.push({ text: raw.slice(i, j), color: T.amber });
      i = j;
      continue;
    }
    if (/\d/.test(raw[i]) && (i === 0 || /[\s,=(:+\-*/<>[\{]/.test(raw[i - 1]))) {
      let j = i;
      while (j < raw.length && /[\d._xXa-fA-FbBoO]/.test(raw[j])) j++;
      tokens.push({ text: raw.slice(i, j), color: T.number });
      i = j;
      continue;
    }
    if (/[a-zA-Z_$]/.test(raw[i])) {
      let j = i;
      while (j < raw.length && /[a-zA-Z0-9_$]/.test(raw[j])) j++;
      const word = raw.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, color: T.pink });
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ text: word, color: T.purple });
      } else {
        tokens.push({ text: word, color: T.text });
      }
      i = j;
      continue;
    }
    if (/[=<>!+\-*/%&|^?:,;.[\]{}()]/.test(raw[i])) {
      tokens.push({ text: raw[i], color: T.dim });
      i++;
      continue;
    }
    tokens.push({ text: raw[i], color: T.text });
    i++;
  }
  return tokens;
}

function SyntaxLine({ text, color }: { text: string; color?: string }) {
  if (color) {
    return <span style={{ color }}>{text}</span>;
  }
  const tokens = tokenizeLine(text);
  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i} style={{ color: tok.color }}>{tok.text}</span>
      ))}
    </>
  );
}

// ─── Block Types ──────────────────────────────────────────────────────────────

type TerminalBlock =
  | { kind: "prompt";    content: string }
  | { kind: "operation"; verb: string; target: string; sub?: string }
  | { kind: "tree";      lines: { prefix: string; text: string; color?: string }[] }
  | { kind: "code";      lang: string; filename?: string; lines: string[] }
  | { kind: "diff";      removed: string; added: string }
  | { kind: "text";      lines: string[] }
  | { kind: "status";    text: string; elapsed?: string; tokens?: string; variant: "working" | "done" | "error" }
  | { kind: "divider";   label: string };

// ─── Content parser ───────────────────────────────────────────────────────────

function inferVerb(content: string): string {
  const c = content.toLowerCase();
  if (c.includes("analyz"))   return "Analyze";
  if (c.includes("research")) return "Research";
  if (c.includes("generat") || c.includes("creat")) return "Generate";
  if (c.includes("build"))    return "Build";
  if (c.includes("audit"))    return "Audit";
  if (c.includes("simulat"))  return "Simulate";
  if (c.includes("compil") || c.includes("code") || c.includes("write")) return "Write";
  if (c.includes("read") || c.includes("search")) return "Read";
  return "Process";
}

function splitByCodeFences(content: string): { type: "text" | "code"; text: string; lang?: string }[] {
  const parts: { type: "text" | "code"; text: string; lang?: string }[] = [];
  const re = /```([a-z]*)\n([\s\S]*?)```/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", text: content.slice(last, match.index) });
    }
    parts.push({ type: "code", lang: match[1] || "text", text: match[2] });
    last = match.index + match[0].length;
  }
  if (last < content.length) {
    parts.push({ type: "text", text: content.slice(last) });
  }
  return parts;
}

function parseMessage(msg: Message, chamberLabel: string, isStreaming: boolean): TerminalBlock[] {
  const blocks: TerminalBlock[] = [];

  if (msg.role === "user") {
    blocks.push({ kind: "prompt", content: msg.content });
    return blocks;
  }

  if (!msg.content && isStreaming) {
    blocks.push({ kind: "status", text: "Thinking", variant: "working" });
    return blocks;
  }

  const verb = inferVerb(msg.content);
  blocks.push({ kind: "operation", verb, target: chamberLabel });

  const parts = splitByCodeFences(msg.content);

  for (const part of parts) {
    if (part.type === "code") {
      const codeLines = part.text.trimEnd().split("\n");
      blocks.push({ kind: "code", lang: part.lang ?? "text", lines: codeLines });
    } else {
      const lines = part.text.split("\n");
      const textLines: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();

        if (/^#{1,3}\s/.test(trimmed)) {
          if (textLines.length > 0) {
            blocks.push({ kind: "text", lines: [...textLines] });
            textLines.length = 0;
          }
          blocks.push({ kind: "divider", label: trimmed.replace(/^#+\s/, "") });
          continue;
        }

        textLines.push(line);
      }

      if (textLines.some(l => l.trim())) {
        blocks.push({ kind: "text", lines: textLines });
      }
    }
  }

  if (isStreaming) {
    blocks.push({ kind: "status", text: "Streaming", variant: "working" });
  }

  return blocks;
}

// ─── Block Renderers ──────────────────────────────────────────────────────────

function BlockPrompt({ content }: { content: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "14px", alignItems: "flex-start" }}>
      <span
        style={{
          color: T.amber,
          fontSize: "13px",
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: "0px",
          flexShrink: 0,
          userSelect: "none",
          opacity: 0.8,
        }}
      >
        ›
      </span>
      <span
        style={{
          color: T.text,
          fontSize: "13px",
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {content}
      </span>
    </div>
  );
}

function BlockOperation({ verb, target, sub }: { verb: string; target: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "6px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: T.green, fontSize: "10px", lineHeight: 1, flexShrink: 0 }}
        >
          ●
        </motion.span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", lineHeight: 1.5 }}>
          <span style={{ color: T.text, fontWeight: 500 }}>{verb}</span>
          <span style={{ color: T.dim }}>{"("}</span>
          <span style={{ color: T.cyan }}>{target}</span>
          <span style={{ color: T.dim }}>{")"}</span>
        </span>
      </div>
      {sub && (
        <div style={{ paddingLeft: "19px", marginTop: "2px" }}>
          <span style={{ color: T.dim2, fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>└ </span>
          <span style={{ color: T.dim, fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>{sub}</span>
        </div>
      )}
    </div>
  );
}

function BlockCode({ lines, lang, filename }: { lines: string[]; lang: string; filename?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const isLong = lines.length > 18;

  return (
    <div
      style={{
        margin: "8px 0 14px",
        border: `1px solid ${T.line2}`,
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      {/* Code header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 12px",
          background: T.surface,
          borderBottom: `1px solid ${T.line}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            {[T.dim2, T.dim2, T.dim2].map((c, i) => (
              <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c, display: "inline-block", opacity: 0.7 }} />
            ))}
          </div>
          <span style={{ color: T.dim, fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {lang || "text"}
          </span>
          {filename && (
            <span style={{ color: T.cyan, fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>{filename}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: T.dim2 }}>
            {lines.length} lines
          </span>
          {isLong && (
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: T.amber,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
                padding: 0,
                letterSpacing: "0.05em",
                transition: "opacity 0.1s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {collapsed ? "expand" : "collapse"}
            </button>
          )}
        </div>
      </div>
      {/* Code body */}
      {!collapsed && (
        <div style={{ overflowX: "auto", padding: "10px 0" }}>
          {(isLong ? lines.slice(0, 26) : lines).map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                paddingRight: "16px",
                minHeight: "19px",
              }}
            >
              <span
                style={{
                  width: "38px",
                  flexShrink: 0,
                  textAlign: "right",
                  paddingRight: "14px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: T.dim2,
                  userSelect: "none",
                  lineHeight: "19px",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  lineHeight: "19px",
                  whiteSpace: "pre",
                  flex: 1,
                }}
              >
                <SyntaxLine text={line} />
              </span>
            </div>
          ))}
          {isLong && !collapsed && lines.length > 26 && (
            <div style={{ padding: "4px 0 0 38px" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: T.dim }}>
                … {lines.length - 26} more lines
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BlockText({ lines }: { lines: string[] }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: "5px" }} />;

        const doneMatch  = trimmed.match(/^\[x\]\s+(.+)/i);
        const todoMatch  = trimmed.match(/^\[ \]\s+(.+)/);
        const bulletMatch= trimmed.match(/^[-*•]\s+(.+)/);
        const treeMatch  = trimmed.match(/^(└|├|─)\s*/);

        if (doneMatch) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", marginBottom: "3px", paddingLeft: "2px" }}>
              <span style={{ color: T.green, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "2.5px" }}>✓</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.dim, lineHeight: "1.55", textDecoration: "line-through" }}>{doneMatch[1]}</span>
            </div>
          );
        }
        if (todoMatch) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", marginBottom: "3px", paddingLeft: "2px" }}>
              <span style={{ color: T.dim2, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "2.5px", border: `1px solid ${T.dim2}`, width: "10px", height: "10px", borderRadius: "2px", display: "inline-block" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.text, lineHeight: "1.55" }}>{todoMatch[1]}</span>
            </div>
          );
        }
        if (bulletMatch) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", marginBottom: "3px" }}>
              <span style={{ color: T.dim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "3px" }}>–</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.text, lineHeight: "1.6" }}>
                <SyntaxLine text={bulletMatch[1]} />
              </span>
            </div>
          );
        }
        if (treeMatch) {
          return (
            <div key={i} style={{ paddingLeft: "16px" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.dim }}>{trimmed}</span>
            </div>
          );
        }

        // Bold text
        const boldLine = trimmed.replace(/\*\*(.+?)\*\*/g, "__BOLD:$1__");
        if (boldLine.includes("__BOLD:")) {
          const parts = boldLine.split(/(__BOLD:.+?__)/).filter(Boolean);
          return (
            <div key={i} style={{ marginBottom: "2px" }}>
              {parts.map((p, j) => {
                const m = p.match(/^__BOLD:(.+)__$/);
                return m
                  ? <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.text, fontWeight: 700 }}>{m[1]}</span>
                  : <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.text, lineHeight: "1.6" }}>{p}</span>;
              })}
            </div>
          );
        }

        // Inline code
        const hasInlineCode = trimmed.includes("`");
        if (hasInlineCode) {
          const inlineParts = trimmed.split(/(`[^`]+`)/g);
          return (
            <div key={i} style={{ marginBottom: "2px", lineHeight: "1.65" }}>
              {inlineParts.map((p, j) =>
                p.startsWith("`") && p.endsWith("`")
                  ? <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.amber, background: T.surface, padding: "0 4px", borderRadius: "3px", border: `1px solid ${T.line2}` }}>{p.slice(1, -1)}</span>
                  : <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.text }}>{p}</span>
              )}
            </div>
          );
        }

        return (
          <div key={i} style={{ marginBottom: "2px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.text, lineHeight: "1.65" }}>{trimmed}</span>
          </div>
        );
      })}
    </div>
  );
}

function BlockDiff({ removed, added }: { removed: string; added: string }) {
  const removedLines = removed.split("\n").filter(Boolean);
  const addedLines   = added.split("\n").filter(Boolean);
  const maxLen = Math.max(removedLines.length, addedLines.length);

  return (
    <div style={{ margin: "6px 0 12px", border: `1px solid ${T.line2}`, borderRadius: "5px", overflow: "hidden", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
      {Array.from({ length: maxLen }, (_, i) => (
        <div key={i}>
          {removedLines[i] !== undefined && (
            <div style={{ display: "flex", background: T.redBg, padding: "2px 12px" }}>
              <span style={{ color: T.red, width: "18px", flexShrink: 0, userSelect: "none" }}>–</span>
              <SyntaxLine text={removedLines[i]} color={T.red} />
            </div>
          )}
          {addedLines[i] !== undefined && (
            <div style={{ display: "flex", background: T.greenBg, padding: "2px 12px" }}>
              <span style={{ color: T.green, width: "18px", flexShrink: 0, userSelect: "none" }}>+</span>
              <SyntaxLine text={addedLines[i]} color={T.green} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BlockDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0 8px", userSelect: "none" }}>
      <div style={{ height: "1px", width: "14px", background: T.line2, flexShrink: 0 }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: T.dim, whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: T.line2 }} />
    </div>
  );
}

function BlockStatus({ text, elapsed, tokens, variant }: {
  text: string; elapsed?: string; tokens?: string; variant: "working" | "done" | "error";
}) {
  const color  = variant === "done" ? T.green : variant === "error" ? T.red : T.amber;
  const prefix = variant === "done" ? "✓" : variant === "error" ? "✗" : "◎";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0 6px", padding: "5px 10px", background: variant === "working" ? T.amberBg : "transparent", borderRadius: "4px", border: `1px solid ${T.line2}` }}>
      {variant === "working" ? (
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
          style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", userSelect: "none" }}
        >
          {prefix}
        </motion.span>
      ) : (
        <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", userSelect: "none" }}>{prefix}</span>
      )}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", color }}>
        {text}
        {variant === "working" && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          >
            …
          </motion.span>
        )}
      </span>
      {(elapsed || tokens) && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: T.dim, marginLeft: "2px" }}>
          ({[elapsed, tokens ? `↑ ${tokens}` : null].filter(Boolean).join(" · ")})
        </span>
      )}
    </div>
  );
}

function renderBlock(block: TerminalBlock, idx: number): React.ReactNode {
  switch (block.kind) {
    case "prompt":    return <BlockPrompt    key={idx} content={block.content} />;
    case "operation": return <BlockOperation key={idx} verb={block.verb} target={block.target} sub={block.sub} />;
    case "code":      return <BlockCode      key={idx} lines={block.lines} lang={block.lang} filename={block.filename} />;
    case "diff":      return <BlockDiff      key={idx} removed={block.removed} added={block.added} />;
    case "text":      return <BlockText      key={idx} lines={block.lines} />;
    case "status":    return <BlockStatus    key={idx} text={block.text} elapsed={block.elapsed} tokens={block.tokens} variant={block.variant} />;
    case "divider":   return <BlockDivider   key={idx} label={block.label} />;
    default:          return null;
  }
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function BlinkCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      style={{
        display: "inline-block",
        width: "7px",
        height: "14px",
        background: T.text,
        verticalAlign: "middle",
        marginLeft: "1px",
        borderRadius: "1px",
        opacity: 0.85,
      }}
    />
  );
}

// ─── Input area ───────────────────────────────────────────────────────────────

function TerminalInput({
  value, onChange, onSubmit, onCancel, disabled, placeholder,
}: {
  value:       string;
  onChange:    (v: string) => void;
  onSubmit:    () => void;
  onCancel:    () => void;
  disabled:    boolean;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  return (
    <div
      style={{
        borderTop: `1px solid ${T.line}`,
        background: T.bg,
        flexShrink: 0,
      }}
    >
      {/* Prompt line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          gap: "10px",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            color: T.amber,
            flexShrink: 0,
            userSelect: "none",
            opacity: 0.8,
          }}
        >
          ›
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey && value.trim()) { e.preventDefault(); onSubmit(); }
            if (e.key === "Escape" && disabled) onCancel();
          }}
          disabled={disabled}
          placeholder={disabled ? "" : placeholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            color: T.text,
            caretColor: T.amber,
            letterSpacing: "0.01em",
          }}
        />
        {disabled && <BlinkCursor />}
      </div>
      {/* Footer hint */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px 9px",
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: T.dim, letterSpacing: "0.05em" }}>
          {disabled ? (
            <button
              onClick={onCancel}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: T.amberDim,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
                padding: 0,
                letterSpacing: "0.05em",
                transition: "color 0.1s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.amber; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.amberDim; }}
            >
              esc to interrupt
            </button>
          ) : (
            "↵ execute  ·  esc to cancel"
          )}
        </span>
        {!disabled && value.trim() && (
          <button
            onClick={onSubmit}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              color: T.green,
              background: "transparent",
              border: `1px solid ${T.dim2}`,
              cursor: "pointer",
              outline: "none",
              padding: "2px 10px",
              borderRadius: "3px",
              letterSpacing: "0.07em",
              transition: "border-color 0.1s ease, color 0.1s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = T.green;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = T.dim2;
            }}
          >
            execute
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Terminal Component ──────────────────────────────────────────────────

export interface RuberraTerminalProps {
  messages:     Message[];
  isLoading:    boolean;
  draft:        string;
  onDraftChange:(v: string) => void;
  onSend:       (v: string) => void;
  onCancel:     () => void;
  chamberLabel: string;
  chamber: ChamberTab;
  task: TaskType;
  modelId: string;
  onTaskChange: (task: TaskType) => void;
  onModelChange: (modelId: string) => void;
  placeholder?: string;
  elapsedLabel?: string;
}

export function RuberraTerminal({
  messages, isLoading, draft, onDraftChange, onSend, onCancel,
  chamberLabel, chamber, task, modelId, onTaskChange, onModelChange, placeholder = "Enter directive…", elapsedLabel,
}: RuberraTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  function submit() {
    const text = draft.trim();
    if (!text || isLoading) return;
    onDraftChange("");
    onSend(text);
  }

  const allBlocks: TerminalBlock[] = [];

  if (messages.length === 0 && !isLoading) {
    allBlocks.push({
      kind: "status",
      text: `RUBERRA · ${chamberLabel.toUpperCase()} TERMINAL`,
      variant: "done",
    });
    allBlocks.push({ kind: "divider", label: "Ready" });
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const isLastAssistant = msg.role === "assistant" && i === messages.length - 1;
    const streaming = isLastAssistant && isLoading;
    const parsed = parseMessage(msg, chamberLabel, streaming);
    allBlocks.push(...parsed);
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: T.bg,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Terminal header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          height: "34px",
          background: T.surface,
          borderBottom: `1px solid ${T.line}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {/* macOS-style traffic lights */}
          {(["#3D3A36", "#3D3A36", "#3D3A36"] as const).map((c, i) => (
            <span
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: c,
                display: "inline-block",
                border: "0.5px solid rgba(255,255,255,0.04)",
              }}
            />
          ))}
          <span style={{ marginLeft: "4px", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: T.dim, letterSpacing: "0.05em", userSelect: "none" }}>
            {chamberLabel.toLowerCase()}
          </span>
        </div>

        {/* Center label */}
        <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: T.dim2, letterSpacing: "0.06em", userSelect: "none", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {messages.length > 0 ? `${messages.filter(m => m.role === "user").length} commands` : "ready"}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ModelSelector
            chamber={chamber}
            task={task}
            modelId={modelId}
            onTaskChange={onTaskChange}
            onModelChange={onModelChange}
            mode="terminal"
          />
          {isLoading && (
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "9px", fontFamily: "monospace", color: T.amber, letterSpacing: "0.06em" }}
            >
              running
            </motion.span>
          )}
<<<<<<< HEAD
          <span style={{ fontSize: "9px", fontFamily: "monospace", color: T.dim2 }}>
            {messages.length > 0 ? `${messages.filter(m => m.role === "assistant").length} outputs` : "0 outputs"}
          </span>
=======
>>>>>>> ca5d59d51630247def9bae5d1d5c2b54a5f2af7e
          <AnimatePresence>
            {isLoading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: T.amber, letterSpacing: "0.07em" }}
              >
                running
              </motion.span>
            )}
          </AnimatePresence>
          <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: T.dim2 }}>
            {messages.filter(m => m.role === "assistant").length} outputs
          </span>
        </div>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 18px 8px",
        }}
      >
        {messages.length === 0 && !isLoading ? (
          <div style={{ paddingTop: "28px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: T.green, fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
              >
                ●
              </motion.span>
              <span style={{ color: T.dim, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.04em" }}>
                RUBERRA {chamberLabel.toUpperCase()} TERMINAL
              </span>
            </div>
            <div style={{ paddingLeft: "19px" }}>
              <span style={{ color: T.dim2, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>└ </span>
              <span style={{ color: T.dim2, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>{placeholder}</span>
            </div>
            <div style={{ height: "10px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: T.dim2, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", paddingLeft: "2px" }}>
              <span>›</span>
              <span style={{ color: T.amberDim }}>ready for directive</span>
              <BlinkCursor />
            </div>
          </div>
        ) : (
          <div>
            {allBlocks.map((block, i) => (
              <div key={i}>{renderBlock(block, i)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <TerminalInput
        value={draft}
        onChange={onDraftChange}
        onSubmit={submit}
        onCancel={onCancel}
        disabled={isLoading}
        placeholder={placeholder}
      />
    </div>
  );
}
