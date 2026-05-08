// ShellPanel — operator-driven shell quick action.
//
// Doctrine: A3 manual surface. The agent loop does not yet emit shell
// tool calls; this panel exists so the capability is at least
// exercisable from the cápsula. Operator types one command, hits run,
// sees output. Allowlist enforcement happens in the Rust side
// (run_shell command) — the panel does no validation of its own.
//
// Owns: shellCommand input, shellResult panel, shellRunning gate.
// Caller owns: whether the panel is mounted at all (Capsule toggles
// shellPanelOpen and only mounts ShellPanel when shellExec is wired).

import { useCallback, useState } from 'react';
import { type Ambient } from './ambient';

type ShellExec = NonNullable<Ambient['shellExec']>;

interface ShellResult {
  cmd: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
}

export interface ShellPanelProps {
  shellExec: ShellExec;
}

export function ShellPanel({ shellExec }: ShellPanelProps) {
  const [shellCommand, setShellCommand] = useState('');
  const [shellResult, setShellResult] = useState<ShellResult | null>(null);
  const [shellRunning, setShellRunning] = useState(false);

  const runShellCommand = useCallback(async () => {
    const trimmed = shellCommand.trim();
    if (!trimmed) return;
    // Parse first token as binary, rest as args. Quotes are NOT
    // honoured — this is intentionally simple. The Rust side enforces
    // allowlist by basename, so quoted paths wouldn't help anyway.
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    setShellRunning(true);
    setShellResult(null);
    try {
      const r = await shellExec.run(cmd, args);
      setShellResult({
        cmd: trimmed,
        stdout: r.stdout,
        stderr: r.stderr,
        exitCode: r.exitCode,
        durationMs: r.durationMs,
      });
    } catch (err) {
      setShellResult({
        cmd: trimmed,
        stdout: '',
        stderr: err instanceof Error ? err.message : String(err),
        exitCode: null,
        durationMs: 0,
      });
    } finally {
      setShellRunning(false);
    }
  }, [shellExec, shellCommand]);

  return (
    <div className="gauntlet-capsule__shell-panel">
      <div className="gauntlet-capsule__shell-row">
        <span className="gauntlet-capsule__shell-prompt" aria-hidden>$</span>
        <input
          type="text"
          className="gauntlet-capsule__shell-input"
          placeholder="git status — comandos da allowlist"
          value={shellCommand}
          onChange={(ev) => setShellCommand(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' && !ev.shiftKey) {
              ev.preventDefault();
              void runShellCommand();
            }
          }}
          disabled={shellRunning}
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="button"
          className="gauntlet-capsule__shell-run"
          onClick={() => void runShellCommand()}
          disabled={shellRunning || !shellCommand.trim()}
        >
          {shellRunning ? '…' : 'Executar'}
        </button>
      </div>
      {shellResult && (
        <div className="gauntlet-capsule__shell-output">
          <div className="gauntlet-capsule__shell-meta">
            <span className="gauntlet-capsule__shell-meta-cmd">
              $ {shellResult.cmd}
            </span>
            <span className="gauntlet-capsule__shell-meta-stat">
              {shellResult.exitCode === null
                ? 'erro'
                : `exit ${shellResult.exitCode}`}
              {' · '}
              {shellResult.durationMs} ms
            </span>
          </div>
          {shellResult.stdout && (
            <pre className="gauntlet-capsule__shell-stdout">
              {shellResult.stdout}
            </pre>
          )}
          {shellResult.stderr && (
            <pre className="gauntlet-capsule__shell-stderr">
              {shellResult.stderr}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
