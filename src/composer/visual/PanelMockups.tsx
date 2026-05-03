// Wave 8b — mini-mockups inside each side panel. One small visual
// preview per mode so the canonical surface reads as "every panel is
// already a product", not a wireframe of empty cards.
//
// Each mockup is pure CSS / SVG, scaled to fit ~220×100 px. Content is
// illustrative placeholder — generic shapes that evoke the mode's UI
// without claiming to be live data. Real content lives inside each
// canvas (CodeCanvas, DesignCanvas, …); these mockups are the
// "thumbnail" version shown around the perimeter.

import type { CSSProperties, ReactNode } from "react";
import type { ComposerMode } from "../types";
import Icon from "./Icons";

const wrapStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "6px 2px 0",
  minHeight: 0,
  overflow: "hidden",
};

const tinyText = (color = "rgba(168,179,200,0.55)"): CSSProperties => ({
  height: 6,
  borderRadius: 2,
  background: color,
});

const tile = (size = 14): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: 3,
  background: "rgba(94,165,255,0.18)",
  border: "1px solid rgba(94,165,255,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const card = (extra?: CSSProperties): CSSProperties => ({
  background: "rgba(13,19,34,0.55)",
  border: "1px solid rgba(120,180,255,0.18)",
  borderRadius: 4,
  padding: "5px 7px",
  ...extra,
});

export default function PanelMockup({ mode }: { mode: ComposerMode }) {
  return <div style={wrapStyle}>{render(mode)}</div>;
}

function render(mode: ComposerMode): ReactNode {
  switch (mode) {
    case "idle":     return <IdleMockup />;
    case "context":  return <ContextMockup />;
    case "compose":  return null; // compose is the central canvas, not a side panel
    case "code":     return <CodeMockup />;
    case "design":   return <DesignMockup />;
    case "analysis": return <AnalysisMockup />;
    case "memory":   return <MemoryMockup />;
    case "apply":    return <ApplyMockup />;
    case "route":    return <RouteMockup />;
  }
}

// ─── 1 IDLE ─────────────────────────────────────────────────────────────
function IdleMockup() {
  return (
    <div
      style={{
        position: "relative",
        height: 76,
        background:
          "radial-gradient(circle at 70% 60%, rgba(94,165,255,0.10) 0%, transparent 55%)",
        borderRadius: 6,
        opacity: 0.9,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 18,
          left: 30,
          color: "rgba(168,179,200,0.5)",
          filter: "drop-shadow(0 0 4px rgba(94,165,255,0.25))",
        }}
      >
        <Icon name="cursor" size={20} strokeWidth={1.2} />
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 38,
          left: 56,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #ffffff, rgba(94,165,255,0.9) 60%, transparent)",
          boxShadow: "0 0 8px rgba(94,165,255,0.5)",
        }}
      />
    </div>
  );
}

// ─── 2 CONTEXT ──────────────────────────────────────────────────────────
function ContextMockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "2px 2px" }}>
      <div style={tinyText()} />
      <div
        style={{
          ...tinyText("rgba(94,165,255,0.45)"),
          width: "78%",
          boxShadow: "0 0 8px rgba(94,165,255,0.18)",
        }}
      />
      <div style={{ ...tinyText(), width: "92%" }} />
      <div style={{ ...tinyText(), width: "60%" }} />
      <div
        style={{
          ...card({ marginTop: 6, alignSelf: "center", padding: "3px 8px" }),
          background: "rgba(94,165,255,0.18)",
          borderColor: "rgba(94,165,255,0.45)",
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: "var(--text-secondary)",
          letterSpacing: "0.05em",
        }}
      >
        turn this into a route
      </div>
    </div>
  );
}

// ─── 4 CODE ─────────────────────────────────────────────────────────────
function CodeMockup() {
  const line = (color: string, width: string) => (
    <div style={{ height: 4, borderRadius: 1, background: color, width }} />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", gap: 4 }}>
        <span style={{ ...card({ padding: "2px 6px" }), fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-secondary)" }}>
          file.ts
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-ghost)", padding: "2px 6px" }}>
          db.ts
        </span>
      </div>
      <div style={{ ...card({ padding: "6px 8px" }), display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-ghost)", width: 8, textAlign: "right" }}>1</span>
          {line("rgba(94,165,255,0.55)", "60%")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-ghost)", width: 8, textAlign: "right" }}>2</span>
          {line("rgba(168,179,200,0.45)", "75%")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(77,214,164,0.08)", marginLeft: -8, marginRight: -8, paddingLeft: 8, paddingRight: 8 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(77,214,164,0.8)", width: 8, textAlign: "right" }}>+</span>
          {line("rgba(77,214,164,0.55)", "55%")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-ghost)", width: 8, textAlign: "right" }}>4</span>
          {line("rgba(168,179,200,0.45)", "40%")}
        </div>
      </div>
    </div>
  );
}

// ─── 5 DESIGN ───────────────────────────────────────────────────────────
function DesignMockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          ...card(),
          height: 38,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          justifyContent: "center",
        }}
      >
        <div style={{ ...tinyText("rgba(168,179,200,0.5)"), width: "55%", height: 5 }} />
        <div style={{ ...tinyText("rgba(168,179,200,0.35)"), width: "85%", height: 3 }} />
        <div style={{ ...tinyText("rgba(168,179,200,0.35)"), width: "70%", height: 3 }} />
        <div
          style={{
            marginTop: 2,
            alignSelf: "flex-start",
            background: "rgba(94,165,255,0.45)",
            borderRadius: 2,
            width: 28,
            height: 6,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
        {["#5ea5ff", "#4dd6a4", "#f0b65f", "#ff6e87", "#a8b3c8"].map((c) => (
          <span
            key={c}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: c,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: `0 0 6px ${c}55`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 6 ANALYSIS ─────────────────────────────────────────────────────────
function AnalysisMockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", gap: 4 }}>
        <KpiTile label="rev"    value="$24M" />
        <KpiTile label="margin" value="56%"  />
      </div>
      <div style={{ ...card({ padding: "5px 7px" }), display: "flex", alignItems: "flex-end", gap: 4, height: 30 }}>
        {[40, 65, 50, 78, 92].map((h, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: "linear-gradient(180deg, rgba(94,165,255,0.85), rgba(94,165,255,0.35))",
              borderRadius: "1px 1px 0 0",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function KpiTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ ...card({ padding: "4px 6px", flex: 1 }), display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

// ─── 7 MEMORY ───────────────────────────────────────────────────────────
function MemoryMockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {["canon", "memory", "knowledge"].map((label, i) => (
        <div
          key={label}
          style={{
            ...card({ padding: "3px 6px" }),
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              background: i === 0 ? "rgba(94,165,255,0.7)" : "transparent",
              border: "1px solid rgba(94,165,255,0.45)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
            {label}
          </span>
        </div>
      ))}
      <div
        style={{
          alignSelf: "flex-end",
          background: "rgba(94,165,255,0.25)",
          border: "1px solid rgba(94,165,255,0.5)",
          borderRadius: 3,
          padding: "2px 10px",
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: "var(--text-primary)",
          letterSpacing: "0.05em",
        }}
      >
        save
      </div>
    </div>
  );
}

// ─── 8 APPLY ────────────────────────────────────────────────────────────
function ApplyMockup() {
  const files: Array<[string, string]> = [
    ["index", "html"],
    ["styles", "css"],
    ["app", "tsx"],
    ["tokens", "json"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        4 files · ready
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {files.map(([name, ext]) => (
          <div
            key={`${name}.${ext}`}
            style={{
              ...card({ padding: "3px 6px" }),
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--mono)",
              fontSize: 9,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(77,214,164,0.7)",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "var(--text-secondary)" }}>{name}</span>
            <span style={{ color: "var(--text-ghost)" }}>·</span>
            <span style={{ color: "var(--text-muted)", marginLeft: "auto" }}>{ext}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 9 ROUTE ────────────────────────────────────────────────────────────
function RouteMockup() {
  const tools: Array<{ name: "tab-code" | "tab-web" | "tab-image" | "tab-terminal" | "tab-memory" | "tab-analysis"; label: string }> = [
    { name: "tab-code",     label: "code"     },
    { name: "tab-web",      label: "web"      },
    { name: "tab-image",    label: "image"    },
    { name: "tab-terminal", label: "term"     },
    { name: "tab-memory",   label: "memory"   },
    { name: "tab-analysis", label: "anal"     },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
      {tools.map((t) => (
        <div
          key={t.name}
          style={{
            ...card({ padding: "4px 0" }),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span style={{ color: "rgba(94,165,255,0.85)", display: "inline-flex" }}>
            <Icon name={t.name} size={12} strokeWidth={1.4} />
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-muted)" }}>
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}
