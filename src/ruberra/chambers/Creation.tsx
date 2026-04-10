// Ruberra — Creation chamber.
// Directive composition (text + scope + risk + acceptance), execution,
// and artifact review. No fake terminal. Law of Consequence enforced.

import { useState } from "react";
import { emit, useProjection } from "../spine/store";
import { runRuntime } from "../spine/runtime-fabric";
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

// Deterministic token-overlap heuristic — same pattern as store.ts captureMemory.
// Returns true if 2+ tokens (length > 4) from the directive appear in the canon text.
function matchesCanon(directiveText: string, scopeText: string, canonText: string): boolean {
  const needle = `${directiveText} ${scopeText}`.toLowerCase();
  const tokens = needle.split(/\s+/).filter((w) => w.length > 4);
  if (tokens.length === 0) return false;
  const hay = canonText.toLowerCase();
  return tokens.filter((w) => hay.includes(w)).length >= 2;
}

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
  // Running executions for the active thread — drives the forge-local
  // live signal. Idle ⇒ empty ⇒ signal hidden. No new state, no new events.
  const runningExecutions = activeThread
    ? executions.filter((x) => x.status === "running")
    : [];
  const directives = p.directives.filter(
    (d) => activeThread && d.thread === activeThread.id,
  );

  // Canon constraint signal — hardened canon in this repo that overlaps current composition.
  // Empty when forge is blank, when no canon exists, or when no overlap is found.
  const repoCanon = p.canon.filter(
    (c) => c.state === "hardened" && c.repo === activeThread?.repo,
  );
  const canonConstraints =
    text.trim() || scope.trim()
      ? repoCanon.filter((c) => matchesCanon(text, scope, c.text))
      : [];

  // Retained consequence — memory auto-captured from accepted artifact reviews in this thread.
  // Filter is deterministic: thread-scoped, non-revoked, system-generated "artifact accepted:" prefix.
  const threadMemory = activeThread
    ? p.memory.filter(
        (m) =>
          m.thread === activeThread.id &&
          m.text.startsWith("artifact accepted:") &&
          m.state !== "revoked",
      )
    : [];

  // Open contradiction warning — unresolved contradictions in the projection.
  // Note: Contradiction type carries no repo field in the current projection;
  // all unresolved contradictions are shown. In single-repo sessions this is exact.
  const openContradictions = p.contradictions.filter((c) => !c.resolved);

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

      // Clear the local composition buffers immediately
      setText("");
      setScope("");
      setAcceptance("");

      // Trigger the execution through the runtime fabric
      // This is the new centralized hinge that handles simulation/reality.
      await runRuntime(
        {
          prompt: String(d.payload.text ?? ""),
          threadId: activeThread.id,
          directiveId: d.id,
        },
        {
          provider: "openai", // Default provider for now
          model: "gpt-5.4-creator"
        }
      );
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
      <header className="rb-chamber-header rb-chamber-header--forge">
        <h1 className="rb-chamber-title">Creation</h1>
        <div className="rb-chamber-gravity-bar">
          <span className="rb-chamber-gravity-text rb-gravity--primary">Architect Forge</span>
          <span className="rb-gravity-sep">·</span>
          <span className="rb-chamber-gravity-text">Concept → Directive → Artifact → Review</span>
          {directives.length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text">{directives.length} directives</span>
            </>
          )}
          {executions.filter(x => x.status === "running").length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--warn">executing</span>
            </>
          )}
          {artifacts.filter(a => a.review === "pending").length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--warn">{artifacts.filter(a => a.review === "pending").length} pending review</span>
            </>
          )}
          {activeThread && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-thread-context-intent">
                {activeThread.intent.length > 44
                  ? activeThread.intent.slice(0, 44) + "…"
                  : activeThread.intent}
              </span>
              <span className={`rb-badge ${
                activeThread.state === "open"              ? "ok"
                : activeThread.state === "executing"       ? "warn"
                : activeThread.state === "awaiting-review" ? "warn"
                : activeThread.state === "closed"          ? "bad"
                : ""
              }`}>
                {activeThread.state}
              </span>
            </>
          )}
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
          {/* Relay — explicit concept-to-build stage indicator */}
          <div className="rb-relay">
            <div className="rb-relay-label">relay</div>
            <div className="rb-relay-stages">
              {([
                { id: "concept", label: "Concept", done: !!activeThread },
                { id: "directive", label: "Directive", done: directives.length > 0 },
                { id: "execute", label: "Execute", done: executions.filter(x => x.status === "succeeded").length > 0 },
                { id: "review", label: "Review", done: artifacts.filter(a => a.review !== "pending").length > 0 },
              ] as const).map((stage, i, arr) => (
                <div key={stage.id} className={`rb-relay-stage${stage.done ? " rb-relay-stage--done" : ""}`}>
                  <span className="rb-relay-stage-label">{stage.label}</span>
                  {i < arr.length - 1 && <span className="rb-relay-arrow">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Directive Forge — the hinge */}
          <div className={`rb-directive-forge${canCompose ? " rb-directive-forge--ready" : ""}`}>
            <div className="rb-forge-title">Directive Forge</div>

            {/* Thread Record — prior consequence context before next composition */}
            {directives.length > 0 && (
              <div className="rb-thread-record">
                <div className="rb-thread-record-label">thread record</div>
                {directives.map((d) => {
                  const linked = artifacts.filter((a) => a.directive === d.id);
                  return (
                    <div key={d.id} className="rb-thread-record-row">
                      <div className="rb-row" style={{ gap: 6, flexWrap: "wrap" }}>
                        <span className={`rb-badge ${d.status === "accepted" ? "ok" : "bad"}`}>
                          {d.status}
                        </span>
                        <span className={`rb-badge ${d.risk}`}>{d.risk}</span>
                        <span className="rb-thread-record-text">
                          {d.text.length > 60 ? d.text.slice(0, 60) + "…" : d.text}
                        </span>
                      </div>
                      {d.status === "rejected" && d.reason && (
                        <div className="rb-thread-record-sub">↳ {d.reason}</div>
                      )}
                      {linked.map((a) => (
                        <div key={a.id} className="rb-thread-record-chain">
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
                          <span className="rb-thread-record-artifact">
                            {a.title.length > 40 ? a.title.slice(0, 40) + "…" : a.title}
                          </span>
                          {a.commitRef && (
                            <span className="rb-thread-record-ref">
                              #{a.commitRef.slice(0, 7)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Canon Constraint Signal — matching hardened canon for this repo */}
            {canonConstraints.length > 0 && (
              <div className="rb-canon-constraint">
                <div className="rb-canon-constraint-label">canon constraint</div>
                {canonConstraints.map((c) => (
                  <div key={c.id} className="rb-canon-constraint-entry">
                    {c.text.length > 80 ? c.text.slice(0, 80) + "…" : c.text}
                  </div>
                ))}
              </div>
            )}

            {/* Retained Consequence — prior artifact-review memory for this thread */}
            {threadMemory.length > 0 && (
              <div className="rb-forge-memory">
                <div className="rb-forge-memory-label">retained consequence</div>
                {threadMemory.map((m) => (
                  <div key={m.id} className="rb-forge-memory-entry">
                    {m.text.length > 80 ? m.text.slice(0, 80) + "…" : m.text}
                  </div>
                ))}
              </div>
            )}

            {/* Contradiction Warning — unresolved tension before hinge crossing */}
            {openContradictions.length > 0 && (
              <div className="rb-forge-contradiction">
                <div className="rb-forge-contradiction-label">
                  unresolved · {openContradictions.length}
                </div>
                {openContradictions.map((c) => (
                  <div key={c.id} className="rb-forge-contradiction-entry">
                    {c.text.length > 80 ? c.text.slice(0, 80) + "…" : c.text}
                  </div>
                ))}
              </div>
            )}

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

            {/* Live execution signal — loop-local, silent when idle.
                Shown only while at least one execution is running for the
                active thread. Disappears automatically on succeed/fail. */}
            {runningExecutions.length > 0 && (
              <div
                className="rb-forge-exec-signal"
                role="status"
                aria-live="polite"
              >
                <span className="rb-forge-exec-dot" aria-hidden="true" />
                <span className="rb-forge-exec-label">executing</span>
                <span className="rb-forge-exec-target">
                  {runningExecutions[0].label.length > 48
                    ? runningExecutions[0].label.slice(0, 48) + "…"
                    : runningExecutions[0].label}
                </span>
                {runningExecutions.length > 1 && (
                  <span className="rb-forge-exec-count">
                    +{runningExecutions.length - 1}
                  </span>
                )}
              </div>
            )}

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

          <div className="rb-trace">
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

          <div className={`rb-trace${activeThread.state === "executing" ? " rb-trace--executing" : ""}`}>
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

          <div className={`rb-trace${activeThread.state === "awaiting-review" ? " rb-trace--review" : ""}`}>
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
                  .map((a) => {
                    const hasEvidence = !!(a.files?.length || a.diff || a.commitRef);
                    return (
                      <li key={a.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {/* Header: status badge + title */}
                        <div className="rb-row" style={{ justifyContent: "space-between", gap: 12 }}>
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
                          </span>
                        </div>

                        {/* Consequence evidence — only when payload exists */}
                        {hasEvidence && (
                          <div className="rb-artifact-evidence">
                            {a.files && a.files.length > 0 && (
                              <div>
                                <div className="rb-artifact-evidence-label">affected files</div>
                                <div className="rb-artifact-files">
                                  {a.files.map((f) => (
                                    <span key={f}>{f}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {a.diff && (
                              <div>
                                <div className="rb-artifact-evidence-label">changes</div>
                                <pre className="rb-artifact-diff">{a.diff}</pre>
                              </div>
                            )}
                            {a.commitRef && (
                              <div className="rb-artifact-commit-ref">ref: {a.commitRef}</div>
                            )}
                          </div>
                        )}

                        {/* Review reason — shown after judgment */}
                        {a.reviewReason && (
                          <div style={{ fontSize: 10, color: "var(--rb-ink-mute)" }}>
                            {a.reviewReason}
                          </div>
                        )}

                        {/* Actions — Accept / Reject / Commit */}
                        <div className="rb-row">
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
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
