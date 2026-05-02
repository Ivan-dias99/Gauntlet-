import { CSSProperties, ReactNode } from "react";
import { useCopy } from "../i18n/copy";

export type ErrorSeverity = "critical" | "warn" | "info";

interface Props {
  severity: ErrorSeverity;
  title?: string;
  message: string;
  onDismiss?: () => void;
  action?: ReactNode;
  style?: CSSProperties;
}

// The shared error-card primitive renders severity via data-severity and
// --tone. No inline color decisions here — the canon owns the treatment
// so error, warn and info read as the same family across every chamber.
export default function ErrorPanel({
  severity, title, message, onDismiss, action, style,
}: Props) {
  const copy = useCopy();
  const severityKicker =
    severity === "critical" ? copy.severityCritical :
    severity === "warn" ? copy.severityWarn :
    copy.severityInfo;
  return (
    <div
      data-error-panel
      data-error-severity={severity}
      className="error-card toolRise"
      data-severity={severity}
      style={style}
    >
      <div className="error-card-head">
        <span data-error-kicker className="kicker">
          {severityKicker}{title ? ` · ${title}` : ""}
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            title={copy.dismiss}
            className="error-card-dismiss"
            aria-label={copy.dismiss}
          >
            ✕
          </button>
        )}
      </div>
      <div data-error-message className="error-card-body">
        {message}
      </div>
      {action && <div className="error-card-actions">{action}</div>}
    </div>
  );
}
