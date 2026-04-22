import { CSSProperties } from "react";
import { useCopy } from "../i18n/copy";

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

export default function ErrorPanel({ severity, title, message, onDismiss, style }: Props) {
  const copy = useCopy();
  const accent = SEVERITY_TOKEN[severity];
  const severityKicker =
    severity === "critical" ? copy.severityCritical :
    severity === "warn" ? copy.severityWarn :
    copy.severityInfo;
  return (
    <div
      data-error-panel
      data-error-severity={severity}
      className="toolRise"
      style={{
        background: "var(--bg-input)",
        border: "1px solid var(--border-color-soft)",
        borderLeft: `2px solid ${accent}`,
        borderRadius: "var(--radius-control)",
        padding: "12px 16px",
        fontFamily: "var(--mono)",
        maxWidth: 720,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 8,
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
          {severityKicker}{title ? ` · ${title}` : ""}
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            title={copy.dismiss}
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
