/**
 * RUBERRA Terminal — elite execution surface
 * Warm-dark, semantic, structured. Machine-grade precision.
 * Used in: Lab Code view, Creation Build view
 */

import { useRef, useEffect, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { type Message, type MessageExecutionTrace } from "./shell-types";
import { ExecutionConsequenceStrip } from "./ExecutionConsequenceStrip";
import { ModelSelector } from "./ModelSelector";
import { type ChamberTab, type TaskType } from "./model-orchestration";
import { getExecutionTruth, TIER_LABEL, TIER_COLOR } from "./sovereign-runtime";
import { getPioneerFromRuntimeId } from "./pioneer-registry";
import { StructuralGridBg } from "./OrganismMotifs";

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
  | { kind: "text";      lines: string[]; layer?: "RESULT" | "WARN" | "HANDOFF" }
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
        const joined = textLines.join(" ").toLowerCase();
        const textLayer: "RESULT" | "WARN" | "HANDOFF" | undefined =
          /\b(handoff|forwarding|passing to|transfer)\b/.test(joined) ? "HANDOFF"
          : /\b(warn|caution|alert|danger|risk)\b/.test(joined) ? "WARN"
          : /\b(result|output|finding|verdict|conclusion|answer)\b/.test(joined) ? "RESULT"
          : undefined;
        blocks.push({ kind: "text", lines: textLines, layer: textLayer });
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
    <div style={{ marginBottom: "10px", paddingBottom: "8px", borderBottom: `1px solid ${T.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <TerminalLayerBadge layer="TRACE" color={T.dim} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", lineHeight: 1.55, letterSpacing: "0.01em" }}>
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
        margin: "12px 0 16px",
        border: `1px solid ${T.line}`,
        borderRadius: "2px",
        overflow: "hidden",
        background: T.surface,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
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
          <TerminalLayerBadge layer={lang === "diff" || lang === "patch" ? "DIFF" : "ARTIFACT"} color={lang === "diff" || lang === "patch" ? T.green : T.cyan} />
          <span style={{ color: T.dim, fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
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

const LAYER_COLOR: Record<string, string> = { RESULT: T.cyan, WARN: T.amber, HANDOFF: T.green };

function BlockText({ lines, layer }: { lines: string[]; layer?: "RESULT" | "WARN" | "HANDOFF" }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {layer && (
        <div style={{ marginBottom: "5px" }}>
          <TerminalLayerBadge layer={layer} color={LAYER_COLOR[layer] ?? T.dim} />
        </div>
      )}
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
                  ? <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: T.amber, background: T.surface, padding: "0 4px", borderRadius: "2px", border: `1px solid ${T.line2}` }}>{p.slice(1, -1)}</span>
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
    <div style={{ margin: "6px 0 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
        <TerminalLayerBadge layer="DIFF" color={T.green} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: T.dim }}>
          {removedLines.length} removed · {addedLines.length} added
        </span>
      </div>
      <div style={{ border: `1px solid ${T.line2}`, borderRadius: "2px", overflow: "hidden", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
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

// Terminal layer badge for typed output
function TerminalLayerBadge({ layer, color }: { layer: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "7px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color,
        border: `1px solid color-mix(in srgb, ${color} 28%, ${T.line})`,
        borderRadius: "2px",
        padding: "1px 5px",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {layer}
    </span>
  );
}

// Operational state labels for terminal
const TERMINAL_STATE_LABEL: Record<string, { label: string; color: string }> = {
  Thinking:  { label: "ROUTING",    color: T.amberDim },
  Streaming: { label: "STREAMING",  color: T.amberDim },
  Routing:   { label: "ROUTING",    color: T.amberDim },
  Analyzing: { label: "ANALYZING",  color: T.amberDim },
  Building:  { label: "BUILDING",   color: T.cyan },
  Validating:{ label: "VALIDATING", color: T.amberDim },
  Done:      { label: "SETTLED",    color: T.green },
  Error:     { label: "ERROR",      color: T.red },
};

function BlockStatus({ text, elapsed, tokens, variant }: {
  text: string; elapsed?: string; tokens?: string; variant: "working" | "done" | "error";
}) {
  const stateInfo = TERMINAL_STATE_LABEL[text] ?? {
    label: text.toUpperCase(),
    color: variant === "done" ? T.green : variant === "error" ? T.red : T.amberDim,
  };
  const color  = stateInfo.color;
  const label  = stateInfo.label;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0 8px", padding: "6px 12px", background: variant === "working" ? `color-mix(in srgb, ${T.amber} 5%, transparent)` : T.bg, borderRadius: "2px", border: `1px solid ${T.line}` }}>
      <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.11em", textTransform: "uppercase", userSelect: "none" }}>
        {label}
      </span>
      {variant === "working" && (
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "4px", height: "4px", borderRadius: "50%", background: color, display: "inline-block" }}
        />
      )}
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
    case "text":      return <BlockText      key={idx} lines={block.lines} layer={block.layer} />;
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
              borderRadius: "2px",
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
  chamberAccentVar?: string;
  /** Mission binding — shown in execution trace when a mission is active */
  missionName?: string;
  inputLocked?: boolean;
  lockLabel?: string;
}

export function RuberraTerminal({
  messages, isLoading, draft, onDraftChange, onSend, onCancel,
  chamberLabel, chamber, task, modelId, onTaskChange, onModelChange, placeholder = "Enter directive…", elapsedLabel,
  chamberAccentVar = "var(--chamber-creation)", missionName, inputLocked = false, lockLabel,
}: RuberraTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  function submit() {
    const text = draft.trim();
    if (!text || isLoading || inputLocked) return;
    onDraftChange("");
    onSend(text);
  }

  const allBlocks: TerminalBlock[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const isLastAssistant = msg.role === "assistant" && i === messages.length - 1;
    const streaming = isLastAssistant && isLoading;
    const parsed = parseMessage(msg, chamberLabel, streaming);
    allBlocks.push(...parsed);
  }

  const lastTrace: MessageExecutionTrace | undefined = [...messages].reverse().find((m) => m.role === "assistant" && m.execution_trace)?.execution_trace;
  const execTruth = getExecutionTruth(chamber);
  const leadShort =
    lastTrace?.leadPioneerId != null
      ? getPioneerFromRuntimeId(lastTrace.leadPioneerId)?.short_role ?? lastTrace.leadPioneerId
      : undefined;
  const hasArtifactMutation = chamber === "creation" && (lastTrace?.executionResults ?? []).some((r) =>
    /artifact|build|package|finalize/i.test(r.phase) || /artifact|build|package/i.test(r.summary)
  );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: T.bg,
        fontFamily: "'JetBrains Mono', monospace",
        position: "relative",
      }}
    >
      {/* Structural grid — same mother surface as landing */}
      <StructuralGridBg opacity={0.08} />

      {/* Terminal command strip — chamber · mission · EI · provider/model · runtime state */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 16px",
          height: "36px",
          background: `color-mix(in srgb, ${chamberAccentVar} 8%, ${T.surface})`,
          borderBottom: `1px solid color-mix(in srgb, ${chamberAccentVar} 22%, ${T.line})`,
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: chamberAccentVar, opacity: 0.9 }} />
        {/* Chamber accent anchor */}
        <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: chamberAccentVar, letterSpacing: "0.14em", textTransform: "uppercase", userSelect: "none", fontWeight: 700, flexShrink: 0, paddingLeft: "8px" }}>
          {chamber}
        </span>
        <span style={{ color: T.line2, fontSize: "9px", userSelect: "none", flexShrink: 0 }}>·</span>

        {/* Model / provider */}
        <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: T.dim, letterSpacing: "0.03em", userSelect: "none", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px" }}>
          {modelId}
          {lastTrace?.providerId ? ` · ${lastTrace.providerId}` : ""}
        </span>

        {/* Mission binding */}
        {missionName && (
          <>
            <span style={{ color: T.line2, fontSize: "9px", userSelect: "none", flexShrink: 0 }}>·</span>
            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: T.dim, letterSpacing: "0.03em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
              {missionName}
            </span>
          </>
        )}
        {!missionName && <div style={{ flex: 1 }} />}

        {/* Runtime state — live when executing */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}
          >
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "4px", height: "4px", borderRadius: "50%", background: chamberAccentVar, display: "inline-block" }}
            />
            <span style={{ fontSize: "7.5px", fontFamily: "'JetBrains Mono', monospace", color: chamberAccentVar, letterSpacing: "0.11em", textTransform: "uppercase", userSelect: "none" }}>
              {allBlocks.length > 1 ? "STREAMING" : "ROUTING"}
            </span>
          </motion.div>
        )}

        {/* Model selector — always present, right-anchored */}
        <ModelSelector
          chamber={chamber}
          task={task}
          modelId={modelId}
          onTaskChange={onTaskChange}
          onModelChange={onModelChange}
          mode="terminal"
        />
      </div>

      {lastTrace && (
        <div style={{ padding: "8px 16px 0", flexShrink: 0, background: T.bg, borderBottom: `1px solid ${T.line}` }}>
          <ExecutionConsequenceStrip
            trace={lastTrace}
            accent={chamberAccentVar}
            compact
            showResultDepth={5}
            leadPioneerShort={leadShort}
            giName={lastTrace.giLabel ?? lastTrace.giId}
            tierLabel={TIER_LABEL[execTruth.tier]}
            tierColor={TIER_COLOR[execTruth.tier]}
            modelTruthLabel={execTruth.tier_label}
            missionName={missionName}
            artifactDiff={hasArtifactMutation ? { summary: lastTrace.executionResults.slice(-1)[0]?.summary ?? "artifact mutation captured" } : undefined}
          />
        </div>
      )}

      {/* Output area */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 20px 12px",
          background: T.bg,
          position: "relative",
        }}
      >
        {messages.length === 0 && !isLoading ? (
          <div style={{ paddingTop: "40px", maxWidth: "560px" }}>
            {/* Ambient glow */}
            <div style={{
              position: "absolute",
              top: "30px",
              left: 0,
              right: 0,
              height: "200px",
              background: `radial-gradient(ellipse at 30% 0%, color-mix(in srgb, ${chamberAccentVar} 14%, transparent) 0%, transparent 65%)`,
              pointerEvents: "none",
            }} />
            <p style={{ margin: "0 0 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.14em", color: chamberAccentVar, textTransform: "uppercase", opacity: 0.85, position: "relative" }}>
              Execution field · ready
            </p>
            <p style={{ margin: "0 0 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: T.text, lineHeight: 1.6, letterSpacing: "0.01em", fontWeight: 500, position: "relative" }}>
              Directives compile here. Output groups by operation, prose, and fenced code—no theater, no noise.
            </p>
            <div style={{ padding: "14px 16px", border: `1px solid color-mix(in srgb, ${chamberAccentVar} 20%, ${T.line})`, borderRadius: "2px", background: T.surface, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: chamberAccentVar, borderRadius: "2px 0 0 2px" }} />
              {missionName && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", paddingLeft: "6px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.12em", color: chamberAccentVar, textTransform: "uppercase", userSelect: "none", fontWeight: 600 }}>MISSION</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{missionName}</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: T.dim, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", paddingLeft: "6px" }}>
                <span style={{ color: T.amber, fontSize: "14px", lineHeight: 1 }}>›</span>
                <span>{placeholder}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  style={{ display: "inline-block", width: "7px", height: "13px", background: T.amber, verticalAlign: "middle", borderRadius: "1px", opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {allBlocks.map((block, i) => (
              <div key={i} style={{ marginBottom: "2px" }}>{renderBlock(block, i)}</div>
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
        disabled={isLoading || inputLocked}
        placeholder={inputLocked ? (lockLabel ?? placeholder) : placeholder}
      />
    </div>
  );
}
