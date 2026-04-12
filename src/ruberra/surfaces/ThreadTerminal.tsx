import type {
  Artifact,
  Directive,
  Execution,
  Thread,
  Contradiction,
} from "../spine/projections";

interface ThreadTerminalProps {
  title: string;
  thread: Thread;
  directives: Directive[];
  executions: Execution[];
  artifacts: Artifact[];
  contradictions?: Contradiction[];
}

export function ThreadTerminal({
  title,
  thread,
  directives,
  executions,
  artifacts,
  contradictions = [],
}: ThreadTerminalProps) {
  const lastDirective = directives[directives.length - 1];
  const lastExecution = executions[executions.length - 1];
  const lastArtifact = artifacts[artifacts.length - 1];
  const runningExec = executions.filter((x) => x.status === "running");
  const running = runningExec.length;
  const failed = executions.filter((x) => x.status === "failed").length;
  const pending = artifacts.filter((a) => a.review === "pending").length;
  const pulseExec = runningExec[0] ?? lastExecution;
  const progressPct =
    pulseExec?.status === "running" && typeof pulseExec.progressValue === "number"
      ? Math.min(100, Math.max(0, pulseExec.progressValue))
      : null;

  return (
    <div className="rb-thread-terminal">
      <div className="rb-thread-terminal-head">
        <div className="rb-thread-terminal-lights" aria-hidden="true">
          <span className={running > 0 ? "live" : ""} />
          <span />
          <span />
        </div>
        <span className="rb-thread-terminal-title">{title}</span>
        <span className="rb-thread-terminal-meta">
          {thread.intent.length > 28 ? thread.intent.slice(0, 28) + "…" : thread.intent}
        </span>
      </div>

      <div className="rb-thread-terminal-body">
        <div className="rb-thread-terminal-line">
          <span className="rb-thread-terminal-prefix">●</span>
          <span className="rb-thread-terminal-verb">thread</span>
          <span className="rb-thread-terminal-dim">({thread.state})</span>
        </div>

        {lastDirective && (
          <div className="rb-thread-terminal-line rb-thread-terminal-line--block">
            <span className="rb-thread-terminal-prefix">›</span>
            <span className="rb-thread-terminal-kv">
              <span className="rb-thread-terminal-dim">directive</span>
              <span className="rb-thread-terminal-text">
                {lastDirective.text.length > 72 ? lastDirective.text.slice(0, 72) + "…" : lastDirective.text}
              </span>
            </span>
          </div>
        )}

        {pulseExec && (
          <div className="rb-thread-terminal-line rb-thread-terminal-line--block">
            <span className="rb-thread-terminal-prefix">◎</span>
            <span className="rb-thread-terminal-kv">
              <span className="rb-thread-terminal-dim">execution</span>
              <span className={`rb-thread-terminal-status rb-thread-terminal-status--${pulseExec.status}`}>
                {pulseExec.status}
              </span>
              <span className="rb-thread-terminal-text">
                {pulseExec.label.length > 60 ? pulseExec.label.slice(0, 60) + "…" : pulseExec.label}
              </span>
              {pulseExec.progressMessage && pulseExec.status === "running" && (
                <span className="rb-thread-terminal-progress-msg">{pulseExec.progressMessage}</span>
              )}
            </span>
          </div>
        )}

        {progressPct !== null && (
          <div className="rb-thread-terminal-progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="rb-thread-terminal-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        )}

        {lastArtifact && (
          <div className="rb-thread-terminal-line rb-thread-terminal-line--block">
            <span className="rb-thread-terminal-prefix">◇</span>
            <span className="rb-thread-terminal-kv">
              <span className="rb-thread-terminal-dim">artifact</span>
              <span className={`rb-thread-terminal-status rb-thread-terminal-status--${lastArtifact.review}`}>
                {lastArtifact.committed ? "committed" : lastArtifact.review}
              </span>
              <span className="rb-thread-terminal-text">
                {lastArtifact.title.length > 56 ? lastArtifact.title.slice(0, 56) + "…" : lastArtifact.title}
              </span>
            </span>
          </div>
        )}

        <div className="rb-thread-terminal-divider" />

        <div className="rb-thread-terminal-summary">
          <span className="rb-thread-terminal-chip">{directives.length} dir</span>
          <span className="rb-thread-terminal-chip">{executions.length} exec</span>
          <span className="rb-thread-terminal-chip">{artifacts.length} art</span>
          {running > 0 && <span className="rb-thread-terminal-chip warn">{running} live</span>}
          {failed > 0 && <span className="rb-thread-terminal-chip bad">{failed} fail</span>}
          {pending > 0 && <span className="rb-thread-terminal-chip gold">{pending} review</span>}
          {contradictions.length > 0 && <span className="rb-thread-terminal-chip bad">{contradictions.length} tension</span>}
        </div>
      </div>
    </div>
  );
}
