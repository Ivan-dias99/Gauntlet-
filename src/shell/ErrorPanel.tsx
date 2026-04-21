import { CSSProperties } from "react";

export type ErrorSeverity = "critical" | "warn" | "info";

interface Props {
  severity: ErrorSeverity;
  title?: string;
  message: string;
  onDismiss?: () => void;
  style?: CSSProperties;
}

const SEVERITY_TOKEN: Record<ErrorSeverity, string> = {
  critical: "var(--cc-err)",
  warn: "var(--cc-warn)",
  info: "var(--cc-info)",
};

const SEVERITY_KICKER: Record<ErrorSeverity, string> = {
  critical: "— CRÍTICO",
  warn: "— AVISO",
  info: "— INFO",
};

export default function ErrorPanel({ severity, title, message, onDismiss, style }: Props) {
  const accent = SEVERITY_TOKEN[severity];
  return (
    <div
      data-error-panel
      data-error-severity={severity}
      className="toolRise"
      style={{
        background: "var(--bg-input)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `2px solid ${accent}`,
        borderRadius: 12,
        padding: "12px 16px",
        fontFamily: "var(--mono)",
        maxWidth: 720,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          data-error-kicker
          style={{
            fontSize: 9,
            color: accent,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {SEVERITY_KICKER[severity]}{title ? ` · ${title}` : ""}
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            title="dispensar"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-ghost)",
              fontSize: 11,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>
      <div
        data-error-message
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          whiteSpace: "pre-wrap",
          lineHeight: 1.55,
        }}
      >
        {message}
      </div>
    </div>
  );
}
