import { useEffect, useRef, useState } from "react";
import type { Copy } from "./helpers";

// Terminal command input — the single canonical terminal surface of
// the chamber. Absorbs the chrome that used to live in the decorative
// top exec-shell: traffic-light dots on the chrome bar, shell path
// (signal · ~/mission), phase pill (READY / EXEC), and the real
// signal@local:~/mission$ prompt on the body row. There is no second
// ornamental terminal window anywhere in the chamber — this is it.

interface Props {
  copy: Copy;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  missionTitle?: string | null;
}

export default function ExecutionComposer({
  copy, value, onChange, onSubmit, pending, missionTitle,
}: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  const canSubmit = value.trim().length > 0 && !pending;
  const pathLabel = missionTitle
    ? missionTitle.length > 48 ? missionTitle.slice(0, 45).trimEnd() + "…" : missionTitle
    : "~/mission";

  return (
    <div
      data-architect-input="comando"
      data-architect-input-state={focused ? "focused" : "idle"}
      style={{ margin: "0 clamp(20px, 5vw, 64px) var(--space-3)" }}
    >
      <div
        className="term-command"
        data-focused={focused ? "true" : undefined}
        data-state={pending ? "pending" : undefined}
      >
        <div className="term-command-chrome">
          <span className="term-command-dots" aria-hidden>
            <span /><span /><span />
          </span>
          <span className="term-command-path">
            <strong>signal</strong>
            <span style={{ color: "var(--text-muted)" }}> · </span>
            <span style={{ color: "var(--cc-path)" }}>{pathLabel}</span>
          </span>
          <span className="term-command-phase">
            {pending ? "exec" : "ready"}
          </span>
        </div>

        <div className="term-command-body">
          <span className="term-command-prompt" aria-hidden>
            <span className="term-command-prompt-user">signal@local</span>
            <span className="term-command-prompt-sep">:</span>
            <span className="term-command-prompt-path">~/mission</span>
            <span className="term-command-prompt-sep">$</span>
          </span>
          <input
            ref={inputRef}
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSubmit()}
            placeholder={pending ? copy.creationRunning : copy.creationPlaceholder}
            disabled={pending}
            className="term-command-input"
            spellCheck={false}
            autoComplete="off"
            aria-label={copy.creationInputVoice}
          />
          <button
            type="button"
            className="term-command-send"
            data-state={pending ? "pending" : undefined}
            onClick={onSubmit}
            disabled={!canSubmit}
            title={pending ? "a executar" : "executar"}
            aria-label={pending ? "a executar" : "executar"}
          >
            {pending ? "…" : "↵"}
          </button>
        </div>

        {pending && <div className="thinking-strip" aria-hidden />}
      </div>
    </div>
  );
}
