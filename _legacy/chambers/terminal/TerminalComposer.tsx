// Wave P-43.6 — TerminalComposer.
//
// Replaces the legacy 600-line ExecutionComposer chrome with the
// target Lovable layout:
//
//   [▲ REPO ONLINE] [<> repo-name] [↳ branch] [+ ADD]
//   [textarea full-width                                       ↑ send]
//   [aceitar edições  ≡  +  🎤]                  [OPUS 4.7 · 1M · ●]
//
// Inner submit/streaming/tool-allowlist logic stays where it is —
// this is a new visual shell that talks to the same input/onSubmit
// the chamber already passes around. The component is intentionally
// minimal so it reads as Signal, not as a re-skin of the legacy
// composer.

import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  /** Live repo state from useGitStatus — repo name, branch, reachable. */
  repoName: string | null;
  branch: string | null;
  repoReachable: boolean;
  /** Model attribution shown bottom-right ("OPUS 4.7", "SONNET 4.6", ...). */
  modelLabel: string;
  /** Context window cap for the model ("1M", "200K", ...). */
  contextWindow: string;
  /** Backend mode → status dot tone. */
  backendMode: "live" | "mock" | "down";
  /** Optional placeholder override; defaults to a calm imperative. */
  placeholder?: string;
}

export default function TerminalComposer({
  value, onChange, onSubmit, pending,
  repoName, branch, repoReachable,
  modelLabel, contextWindow, backendMode,
  placeholder = "Describe a task or ask a question",
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!pending) textareaRef.current?.focus();
  }, [pending]);

  // Auto-grow the textarea up to a sensible cap (matches the target's
  // single-line-then-grow behaviour). Pure DOM measure; no library.
  function autosize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }
  useEffect(autosize, [value]);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim() && !pending) {
      e.preventDefault();
      onSubmit();
    }
  }

  const canSubmit = value.trim().length > 0 && !pending;

  const repoLabel = repoName
    ? repoName.length > 30 ? repoName.slice(0, 27) + "…" : repoName
    : "(no repo)";
  const branchLabel = branch ?? "—";
  const repoStatusTone = !repoReachable ? "down" : "online";
  const repoStatusLabel = !repoReachable ? "REPO OFFLINE" : "REPO ONLINE";

  return (
    <div className="tcomp" data-pending={pending ? "true" : undefined}>
      {/* Context attachment chips */}
      <div className="tcomp-context" aria-label="Context">
        <span className="tcomp-chip" data-tone={repoStatusTone}>
          <span className="tcomp-chip-glyph" aria-hidden>△</span>
          <span className="tcomp-chip-label">{repoStatusLabel}</span>
        </span>
        <span className="tcomp-chip" title={repoName ?? undefined}>
          <span className="tcomp-chip-glyph" aria-hidden>{"<>"}</span>
          <span className="tcomp-chip-label">{repoLabel.toUpperCase()}</span>
        </span>
        <span className="tcomp-chip">
          <span className="tcomp-chip-glyph" aria-hidden>↳</span>
          <span className="tcomp-chip-label">{branchLabel.toUpperCase()}</span>
        </span>
        <button type="button" className="tcomp-chip" data-action="add">
          <span className="tcomp-chip-glyph" aria-hidden>+</span>
          <span className="tcomp-chip-label">ADD</span>
        </button>
      </div>

      {/* Input row */}
      <div className="tcomp-input-row">
        <textarea
          ref={textareaRef}
          className="tcomp-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={pending}
        />
        <button
          type="button"
          className="tcomp-send"
          data-state={pending ? "pending" : canSubmit ? "ready" : "idle"}
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Send"
          title="Send (⌘↵)"
        >
          <span aria-hidden>↑</span>
        </button>
      </div>

      {/* Footer row */}
      <div className="tcomp-foot">
        <div className="tcomp-foot-left">
          <span className="tcomp-foot-label">accept edits</span>
          <button type="button" className="tcomp-foot-icon" aria-label="Toggle edit mode" title="Toggle edit mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="M4 6 H20 M4 12 H20 M4 18 H20" />
            </svg>
          </button>
          <button type="button" className="tcomp-foot-icon" aria-label="Add context" title="Add context">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="M12 5 V19 M5 12 H19" />
            </svg>
          </button>
          <button type="button" className="tcomp-foot-icon" aria-label="Voice" title="Voice (coming soon)" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <rect x="9" y="3" width="6" height="12" rx="3" />
              <path d="M5 11 a7 7 0 0 0 14 0 M12 18 V21" />
            </svg>
          </button>
        </div>
        <div className="tcomp-foot-right">
          <span className="tcomp-model">{modelLabel}</span>
          <span aria-hidden className="tcomp-foot-sep">·</span>
          <span className="tcomp-context-window">{contextWindow}</span>
          <span aria-hidden className="tcomp-foot-sep">·</span>
          <span
            aria-hidden
            className="tcomp-status-dot"
            data-tone={backendMode}
          />
        </div>
      </div>
    </div>
  );
}
