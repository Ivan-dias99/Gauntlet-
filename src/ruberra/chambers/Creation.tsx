// Ruberra — Creation chamber.
// Directive composition (text + scope + risk + acceptance), execution,
// and artifact review. No fake terminal. Law of Consequence enforced.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";
import { Unavailable } from "../trust/Unavailable";
import { RuledPrompt } from "../trust/RuledPrompt";

const EXEC_BACKEND = (import.meta as any).env?.VITE_RUBERRA_EXEC_URL as
  | string
  | undefined;

type Risk = "reversible" | "consequential" | "destructive";

export function CreationChamber() {
  const p = useProjection();
  const activeThread = p.threads.find((t) => t.id === p.activeThread);

  const [text, setText] = useState("");
  const [scope, setScope] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [risk, setRisk] = useState<Risk>("reversible");
  const [err, setErr] = useState<string | null>(null);

  const artifacts = p.artifacts.filter(
    (a) => !activeThread || a.thread === activeThread.id,
  );
  const executions = p.executions.filter(
    (x) => !activeThread || x.thread === activeThread.id,
  );
  const directives = p.directives.filter(
    (d) => activeThread && d.thread === activeThread.id,
  );

  const ambiguous = /\{\{[^}]+\}\}/.test(text);
  const canCompose =
    !!activeThread &&
    text.trim().length > 0 &&
    scope.trim().length > 0 &&
    acceptance.trim().length > 0 &&
    !ambiguous;

  async function runDirective() {
    if (!canCompose || !activeThread) return;
    setErr(null);
    try {
      if (risk === "destructive") {
        const ok = await RuledPrompt.confirm(
          `Destructive directive against ${activeThread.repo}. Confirm acceptance?`,
          { severity: "destructive" },
        );
        if (!ok) {
          await emit.nullConsequence(
            "directive.accept",
            "destructive confirmation declined",
          );
          return;
        }
      }
      const d = await emit.acceptDirective(activeThread.id, {
        text: text.trim(),
        scope: scope.trim(),
        risk,
        acceptance: acceptance.trim(),
      });
      const ex = await emit.startExecution(
        text.trim(),
        d.id,
        activeThread.id,
      );
      if (!EXEC_BACKEND) {
        await emit.failExecution(ex.id, "execution backend unbound");
        await emit.nullConsequence(
          "execution",
          "no backend bound — directive produced no artifact",
        );
        setText("");
        setScope("");
        setAcceptance("");
        return;
      }
      try {
        const res = await fetch(EXEC_BACKEND, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            repo: activeThread.repo,
            thread: activeThread.id,
            directive: { text: text.trim(), scope: scope.trim(), risk, acceptance: acceptance.trim() },
          }),
        });
        if (!res.ok) throw new Error(`backend ${res.status}`);
        const data = (await res.json()) as {
          artifacts?: { title: string }[];
          ok?: boolean;
        };
        const list = data.artifacts ?? [];
        for (const a of list) {
          await emit.generateArtifact(a.title, ex.id, activeThread.id, d.id);
        }
        if (list.length === 0) {
          await emit.nullConsequence("execution", "backend returned no artifacts");
        }
        if (data.ok === false) {
          await emit.failExecution(ex.id, "backend reported failure");
        } else {
          await emit.succeedExecution(ex.id);
        }
      } catch (fetchErr) {
        await emit.failExecution(ex.id, (fetchErr as Error).message);
      }
      setText("");
      setScope("");
      setAcceptance("");
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function rejectDraft() {
    if (!activeThread) return;
    const reason = await RuledPrompt.ask("Rejection reason (required):", { label: "reason" });
    if (!reason || !reason.trim()) return;
    try {
      await emit.rejectDirective(
        activeThread.id,
        {
          text: text.trim(),
          scope: scope.trim(),
          risk,
          acceptance: acceptance.trim(),
        },
        reason.trim(),
      );
      setText("");
      setScope("");
      setAcceptance("");
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function review(id: string, outcome: "accepted" | "rejected") {
    const reason = await RuledPrompt.ask(`Review ${outcome} — reason (required):`, { label: "reason" });
    if (!reason || !reason.trim()) return;
    try {
      await emit.reviewArtifact(id, outcome, reason.trim());
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  return (
    <section className="rb-chamber">
      <h1>Creation</h1>
      <div className="gravity">Gravity: Consequence · Forge artifacts</div>

      {!activeThread ? (
        <Unavailable
          title="no active thread"
          reason="Creation forges through a thread. Open one from the left rail."
          remediation="State an intent to begin the loop."
        />
      ) : (
        <>
          <div className="rb-panel">
            <h2>Directive Composition</h2>
            <div className="rb-col">
              <textarea
                className="rb-textarea"
                placeholder="what changes in the repo? (use no {{placeholders}})"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <input
                className="rb-input"
                placeholder="scope — file set, canon scope, or repo-wide"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              />
              <input
                className="rb-input"
                placeholder="acceptance criterion — how we know it is done"
                value={acceptance}
                onChange={(e) => setAcceptance(e.target.value)}
              />
              <div className="rb-row">
                <label
                  style={{
                    fontFamily: "var(--rb-mono)",
                    fontSize: 11,
                    color: "var(--rb-ink-mute)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  risk:
                </label>
                {(["reversible", "consequential", "destructive"] as Risk[]).map(
                  (r) => (
                    <button
                      key={r}
                      className={`rb-btn ${risk === r ? "primary" : ""}`}
                      onClick={() => setRisk(r)}
                    >
                      {r}
                    </button>
                  ),
                )}
              </div>
              {ambiguous && (
                <Unavailable
                  title="ambiguity detected"
                  reason="Directive text contains unresolved {{placeholders}}."
                  remediation="Resolve all placeholders before acceptance."
                />
              )}
              <div className="rb-row">
                <button
                  className="rb-btn primary"
                  disabled={!canCompose}
                  onClick={runDirective}
                >
                  Accept · Execute
                </button>
                <button
                  className="rb-btn"
                  disabled={!text.trim()}
                  onClick={rejectDraft}
                >
                  Reject
                </button>
              </div>
              {err && (
                <div className="rb-unavail">
                  <strong>refused</strong>
                  {err}
                </div>
              )}
              {!EXEC_BACKEND && (
                <Unavailable
                  title="execution unbound"
                  reason="No execution backend is bound to this shell."
                  remediation="Set VITE_RUBERRA_EXEC_URL and reload to enable forging."
                />
              )}
            </div>
          </div>

          <div className="rb-panel">
            <h2>Directive Ledger</h2>
            {directives.length === 0 ? (
              <div className="rb-unavail">
                <strong>no directives</strong>
                Compose one above.
              </div>
            ) : (
              <ul className="rb-list">
                {directives
                  .slice()
                  .reverse()
                  .map((d) => (
                    <li key={d.id}>
                      <span
                        className={`rb-badge ${
                          d.status === "accepted" ? "ok" : "bad"
                        }`}
                      >
                        {d.status}
                      </span>
                      <span className="rb-badge">{d.risk}</span>
                      <span className="rb-badge">scope: {d.scope}</span>
                      {d.text}
                      {d.reason ? (
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--rb-ink-mute)",
                            marginTop: 4,
                          }}
                        >
                          reason: {d.reason}
                        </div>
                      ) : null}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="rb-panel">
            <h2>Executions</h2>
            {executions.length === 0 ? (
              <div className="rb-unavail">
                <strong>no executions</strong>
                Accept a directive to produce consequence.
              </div>
            ) : (
              <ul className="rb-list">
                {executions
                  .slice()
                  .reverse()
                  .map((x) => (
                    <li key={x.id}>
                      <span
                        className={`rb-badge ${
                          x.status === "succeeded"
                            ? "ok"
                            : x.status === "failed"
                              ? "bad"
                              : "warn"
                        }`}
                      >
                        {x.status}
                      </span>
                      {x.label}
                      {x.reason ? ` — ${x.reason}` : ""}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="rb-panel">
            <h2>Artifacts — Review &amp; Commit</h2>
            {artifacts.length === 0 ? (
              <div className="rb-unavail">
                <strong>no artifacts</strong>
                Executions will yield artifacts or an explicit null-artifact.
              </div>
            ) : (
              <ul className="rb-list">
                {artifacts
                  .slice()
                  .reverse()
                  .map((a) => (
                    <li
                      key={a.id}
                      className="rb-row"
                      style={{ justifyContent: "space-between", gap: 12 }}
                    >
                      <span>
                        <span
                          className={`rb-badge ${
                            a.committed
                              ? "ok"
                              : a.review === "accepted"
                                ? "ok"
                                : a.review === "rejected"
                                  ? "bad"
                                  : "warn"
                          }`}
                        >
                          {a.committed ? "committed" : a.review}
                        </span>
                        {a.title}
                        {a.reviewReason ? (
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--rb-ink-mute)",
                              marginTop: 4,
                            }}
                          >
                            {a.reviewReason}
                          </div>
                        ) : null}
                      </span>
                      <span className="rb-row">
                        {a.review === "pending" && (
                          <>
                            <button
                              className="rb-btn"
                              onClick={() => review(a.id, "accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className="rb-btn"
                              onClick={() => review(a.id, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {a.review === "accepted" && !a.committed && (
                          <button
                            className="rb-btn primary"
                            onClick={() => emit.commitArtifact(a.id)}
                          >
                            Commit
                          </button>
                        )}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
