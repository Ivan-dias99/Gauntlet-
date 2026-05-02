import { CSSProperties, ReactNode } from "react";
import { useCopy } from "../i18n/copy";

interface Props {
  title?: string;
  detail?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

// Dormant is a sibling of ErrorPanel on the shared .error-card primitive.
// Severity "dormant" reads ghost-toned — not red, not warn — because the
// archive still exists and the shell still works; only the live pipeline
// is quiet. The data-dormant-* attributes are retained for any caller
// that was keying selectors off them.
export default function DormantPanel({ title, detail, action, style }: Props) {
  const copy = useCopy();
  return (
    <div
      data-dormant-panel
      data-error-panel
      className="error-card"
      data-severity="dormant"
      style={style}
    >
      <div className="error-card-head">
        <span data-dormant-kicker className="kicker">
          {copy.dormantKicker}
          {title ? ` · ${title}` : ""}
        </span>
      </div>
      {detail && (
        <div data-dormant-body className="error-card-body">
          {detail}
        </div>
      )}
      {action && (
        <div data-dormant-action className="error-card-actions">
          {action}
        </div>
      )}
    </div>
  );
}
