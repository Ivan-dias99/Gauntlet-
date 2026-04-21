import { CSSProperties, ReactNode } from "react";
import { useCopy } from "../i18n/copy";

interface Props {
  title?: string;
  detail?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

// DormantPanel is the calm degraded-state primitive for chambers whose
// backend is unreachable. Not an error — the archive still exists, the
// shell still works; only the live pipeline is quiet. Tone is neutral.
//
// Trigger source: isBackendUnreachable(err) from src/lib/ruberraApi. This
// component NEVER tries to classify the error itself. Callers decide.
export default function DormantPanel({ title, detail, action, style }: Props) {
  const copy = useCopy();
  return (
    <div data-dormant-panel style={style}>
      <div data-dormant-kicker>
        {copy.dormantKicker}
        {title ? ` · ${title}` : ""}
      </div>
      <div data-dormant-body>{detail}</div>
      {action && <div data-dormant-action>{action}</div>}
    </div>
  );
}
