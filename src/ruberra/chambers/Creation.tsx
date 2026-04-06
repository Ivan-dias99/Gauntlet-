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

const RISK_INFO: Record<Risk, { descriptor: string; colorClass: string }> = {
  reversible:   { descriptor: "can be undone — consequence is bounded",           colorClass: "ok"   },
  consequential: { descriptor: "has lasting effect — not silently reversible",    colorClass: "warn" },
  destructive:  { descriptor: "irreversible — requires explicit confirmation",    colorClass: "bad"  },
};

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
    <section className="rb-chamber rb-chamber--creation">
      <header className="rb-chamber-header">
        <h1 className="rb-chamber-title">Creation</h1>
        <div className="rb-chamber-gravity-bar">
          <span className="rb-chamber-gravity-text">Consequence · Forge artifacts</span>
        </div>
        <div className="rb-chamber-accent-line" />
      </header>

      {!activeThread ? (
        <Unavailable
          title="no active thread"
          reason="Creation forges through a thread. Open one from the left rail."
          remediation="State an intent to begin the loop."
        />
      ) : (
        <>
          {/* Directive Forge — the hinge */}
          <div className={`rb-directive-forge${canCompose ? " rb-directive-forge--ready" : ""}`}>
            <div className="rb-forge-title">Directive Forge</div>

            {/* Intent — primary statement */}
            <div className="rb-field-group">
              <label className="rb-field-label">Directive</label>
              <textarea
                className={`rb-directive-input${ambiguous ? " ambiguous" : ""}`}
                placeholder="what changes in the repo?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {ambiguous && (
                <div className="rb-forge-warn">
                  ◐ unresolved {"{{placeholders}}"} — resolve before acceptance
                </div>
              )}
            </div>

            {/* Scope — boundary declaration */}
            <div className="rb-field-group">
              <label className="rb-field-label">Scope</label>
              <input
                className="rb-scope-input"
                placeholder="file set, canon scope, or repo-wide"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              />
            </div>

            {/* Risk — severity gauge */}
            <div className="rb-field-group">
              <label className="rb-field-label">Risk</label>
              <div className="rb-risk-selector" role="group" aria-label="Risk level">
                {(["reversible", "consequential", "destructive"] as Risk[]).map((r) => (
                  <button
                    key={r}
                    data-risk={r}
                    className={`rb-risk-btn${risk === r ? " selected" : ""}`}
                    onClick={() => setRisk(r)}
                    type="button"
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className={`rb-risk-descriptor ${RISK_INFO[risk].colorClass}`}>
                {RISK_INFO[risk].descriptor}
              </div>
            </div>

            {/* Acceptance Criterion — signed commitment */}
            <div className="rb-field-group">
              <label className="rb-field-label">Acceptance Criterion</label>
              <input
                className={`rb-acceptance-field${acceptance.trim() ? " signed" : ""}`}
                placeholder="how we know it is done"
                value={acceptance}
                onChange={(e) => setAcceptance(e.target.value)}
              />
            </div>

            {/* Threshold — the crossing */}
            <div className="rb-threshold">
              <button
                className={`rb-threshold-btn${canCompose ? " ready" : ""}`}
                disabled={!canCompose}
                onClick={runDirective}
                type="button"
              >
                Accept · Execute
              </button>
              <button
                className="rb-threshold-reject"
                disabled={!text.trim()}
                onClick={rejectDraft}
                type="button"
              >
                Reject
              </button>
            </div>

            {err && (
              <div className="rb-unavail" style={{ marginTop: 12 }}>
                <strong>refused</strong>
                {err}
              </div>
            )}
            {!EXEC_BACKEND && (
              <div style={{ marginTop: 12 }}>
                <Unavailable
                  title="execution unbound"
                  reason="No execution backend is bound to this shell."
                  remediation="Set VITE_RUBERRA_EXEC_URL and reload to enable forging."
                />
              </div>
            )}
          </div>

          <div className="rb-panel">
            <h2>Directive Ledger</h2>
            {directives.length === 0 ? (
              <div className="rb-unavail">
                <strong>no directives</strong>
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
                      <span className={`rb-badge ${d.risk}`}>{d.risk}</span>
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
