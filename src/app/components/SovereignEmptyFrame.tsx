/**
 * RUBERRA — Chamber-native empty surfaces (mother shell, not SaaS voids)
 */

import type { ReactNode } from "react";

export function SovereignEmptyFrame({
  accentVar,
  kicker,
  title,
  body,
  actions,
  align = "center",
}: {
  accentVar: string;
  kicker:    string;
  title:     string;
  body:      string;
  actions?:  ReactNode;
  align?:    "center" | "left";
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "stretch",
        textAlign: align === "center" ? "center" : "left",
        maxWidth: align === "center" ? "420px" : "520px",
        margin: align === "center" ? "0 auto" : "0",
        padding: align === "center" ? "32px 20px 28px" : "20px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          width: "100%",
          borderRadius: "12px",
          border: "1px solid var(--r-border-soft)",
          background: "var(--r-surface)",
          boxShadow: "0 2px 14px color-mix(in srgb, var(--r-text) 4%, transparent)",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "3px", flexShrink: 0, background: accentVar, opacity: 0.9 }} aria-hidden />
        <div style={{ flex: 1, padding: "18px 18px 16px", minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 6px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.11em",
              textTransform: "uppercase",
              color: "var(--r-dim)",
            }}
          >
            {kicker}
          </p>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--r-text)",
              fontFamily: "'Inter', system-ui, sans-serif",
              lineHeight: 1.35,
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: "12px",
              lineHeight: 1.62,
              color: "var(--r-subtext)",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            {body}
          </p>
          {actions && <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: align === "center" ? "center" : "flex-start" }}>{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export function emptyActionBtn(onClick: () => void, label: string, accentVar: string) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: "10px",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.06em",
        padding: "6px 12px",
        borderRadius: "2px",
        border: `1px solid color-mix(in srgb, ${accentVar} 35%, var(--r-border))`,
        background: "color-mix(in srgb, var(--r-elevated) 100%, transparent)",
        color: "var(--r-text)",
        cursor: "pointer",
        outline: "none",
        transition: "border-color 0.12s ease, background 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}
