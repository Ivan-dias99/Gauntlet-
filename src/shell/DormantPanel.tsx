import { CSSProperties, ReactNode } from "react";
import { useCopy } from "../i18n/copy";

interface Props {
  title?: string;
  detail?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

// DormantPanel is the calm degraded-state primitive for chambers whose
// backend is unreachable. Not an error — the archive still exists, the shell
// still works; only the live pipeline is quiet. Tone is neutral, not red.
export default function DormantPanel({ title, detail, action, style }: Props) {
  const copy = useCopy();
  return (
    <div
      data-dormant-panel
      style={{
        background: "var(--bg-input)",
        border: "1px solid var(--border-subtle)",
        borderLeft: "2px solid var(--text-ghost)",
        borderRadius: 12,
        padding: "14px 18px",
        fontFamily: "var(--mono)",
        maxWidth: 560,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        ...style,
      }}
    >
      <div
        data-dormant-kicker
        style={{
          fontSize: 9,
          color: "var(--text-ghost)",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {copy.dormantKicker}
        {title ? ` · ${title}` : ""}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.55,
        }}
      >
        {detail ?? copy.dormantDetail}
      </div>
      {action && <div style={{ marginTop: 2 }}>{action}</div>}
    </div>
  );
}

// Classify a fetch error / http status as "backend unreachable" vs real
// application error. Unreachable = dormant state; everything else surfaces
// through ErrorPanel so genuine 4xx/5xx bugs stay visible.
export function isBackendOffline(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  if (/failed to fetch|NetworkError|network request failed/i.test(msg)) return true;
  if (/\b(404|500|502|503|504)\b/.test(msg)) return true;
  if (/backend_unreachable|RUBERRA_BACKEND_URL/i.test(msg)) return true;
  return false;
}
