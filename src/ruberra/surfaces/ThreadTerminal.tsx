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
  const running = executions.filter((x) => x.status === "running").length;
  const failed = executions.filter((x) => x.status === "failed").length;
  const pending = artifacts.filter((a) => a.review === "pending").length;

  return (
    <div className="rb-thread-terminal">
      <div className="rb-thread-terminal-head">
        <div className="rb-thread-terminal-lights" aria-hidden="true">
          <span />
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
          <div className="rb-thread-terminal-line">
            <span className="rb-thread-terminal-prefix">›</span>
            <span className="rb-thread-terminal-dim">directive</span>
            <span className="rb-thread-terminal-text">
              {lastDirective.text.length > 72 ? lastDirective.text.slice(0, 72) + "…" : lastDirective.text}
            </span>
          </div>
        )}

        {lastExecution && (
          <div className="rb-thread-terminal-line">
            <span className="rb-thread-terminal-prefix">◎</span>
            <span className="rb-thread-terminal-dim">execution</span>
            <span className={`rb-thread-terminal-status rb-thread-terminal-status--${lastExecution.status}`}>
              {lastExecution.status}
            </span>
            <span className="rb-thread-terminal-text">
              {lastExecution.label.length > 60 ? lastExecution.label.slice(0, 60) + "…" : lastExecution.label}
            </span>
          </div>
        )}

        {lastArtifact && (
          <div className="rb-thread-terminal-line">
            <span className="rb-thread-terminal-prefix">◇</span>
            <span className="rb-thread-terminal-dim">artifact</span>
            <span className={`rb-thread-terminal-status rb-thread-terminal-status--${lastArtifact.review}`}>
              {lastArtifact.committed ? "committed" : lastArtifact.review}
            </span>
            <span className="rb-thread-terminal-text">
              {lastArtifact.title.length > 56 ? lastArtifact.title.slice(0, 56) + "…" : lastArtifact.title}
            </span>
          </div>
        )}

        <div className="rb-thread-terminal-divider" />

        <div className="rb-thread-terminal-summary">
          <span>{directives.length} directives</span>
          <span>{executions.length} executions</span>
          <span>{artifacts.length} artifacts</span>
          {running > 0 && <span className="warn">{running} running</span>}
          {failed > 0 && <span className="bad">{failed} failed</span>}
          {pending > 0 && <span className="gold">{pending} review</span>}
          {contradictions.length > 0 && <span className="bad">{contradictions.length} tension</span>}
        </div>
      </div>
    </div>
  );
}
