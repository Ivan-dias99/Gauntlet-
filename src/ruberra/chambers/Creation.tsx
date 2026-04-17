// Ruberra — Creation chamber.
// Directive composition (text + scope + risk + acceptance), execution,
// and artifact review. No fake terminal. Law of Consequence enforced.

import { useState } from "react";
import { emit, useProjection } from "../spine/store";
import { revokedCanonWithDependents, conceptAncestry, pendingProposals, activeFlow, nextFlowStep, directiveAgent } from "../spine/projections";
import { runRuntime, getRuntimeConfig } from "../spine/runtime-fabric";
import { Unavailable } from "../trust/Unavailable";
import { RuledPrompt } from "../trust/RuledPrompt";
import { ThreadTerminal } from "../surfaces/ThreadTerminal";

const EXEC_BACKEND = (import.meta as any).env?.VITE_RUBERRA_EXEC_URL as
  | string
  | undefined;

type Risk = "reversible" | "consequential" | "destructive";

const RISK_INFO: Record<Risk, { descriptor: string; colorClass: string }> = {
  reversible:   { descriptor: "can be undone — consequence is bounded",           colorClass: "ok"   },
  consequential: { descriptor: "has lasting effect — not silently reversible",    colorClass: "warn" },
  destructive:  { descriptor: "irreversible — requires explicit confirmation",    colorClass: "bad"  },
};

function matchesCanon(directiveText: string, scopeText: string, canonText: string): boolean {
  const needle = `${directiveText} ${scopeText}`.toLowerCase();
  const tokens = needle.split(/\s+/).filter((w) => w.length > 4);
  if (tokens.length === 0) return false;
  const hay = canonText.toLowerCase();
  return tokens.filter((w) => hay.includes(w)).length >= 2;
}

function renderDiff(diff?: string) {
  if (!diff) return null;
  return (
    <pre className="rb-artifact-diff">
      {diff.split("\n").map((line, i) => {
        const cls = line.startsWith("+")
          ? "rb-diff-add"
          : line.startsWith("-")
            ? "rb-diff-del"
            : line.startsWith("@@")
              ? "rb-diff-hunk"
              : "";
        return <span key={i} className={cls}>{line}{"\n"}</span>;
      })}
    </pre>
  );
}

export function CreationChamber() {
  const p = useProjection();
  const activeThread = p.threads.find((t) => t.id === p.activeThread);

  const [conceptTitle, setConceptTitle] = useState("");
  const [conceptHypothesis, setConceptHypothesis] = useState("");
  const [promotingConceptId, setPromotingConceptId] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [scope, setScope] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [risk, setRisk] = useState<Risk>("reversible");
  const [err, setErr] = useState<string | null>(null);

  const concepts = p.concepts.filter((c) => activeThread && c.thread === activeThread.id);
  const artifacts = p.artifacts.filter((a) => !activeThread || a.thread === activeThread.id);
  const executions = p.executions.filter((x) => !activeThread || x.thread === activeThread.id);
  const runningExecutions = activeThread ? executions.filter((x) => x.status === "running") : [];
  const directives = p.directives.filter((d) => activeThread && d.thread === activeThread.id);

  const repoCanon = p.canon.filter((c) => c.state === "hardened" && c.repo === activeThread?.repo);
  const canonConstraints = text.trim() || scope.trim() ? repoCanon.filter((c) => matchesCanon(text, scope, c.text)) : [];

  const revokedDeps = activeThread ? revokedCanonWithDependents(p).filter((d) => d.threadId === activeThread.id) : [];

  const threadMemory = activeThread
    ? p.memory.filter((m) => m.thread === activeThread.id && (m.text.startsWith("artifact accepted:") || m.text.startsWith("artifact rejected:")) && m.state !== "revoked")
    : [];

  const openContradictions = p.contradictions.filter((c) => !c.resolved && (!c.repo || c.repo === p.activeRepo));

  const proposals = activeThread ? pendingProposals(p, activeThread.id) : [];
  const flow = activeThread ? activeFlow(p, activeThread.id) : undefined;
  const flowNext = flow ? nextFlowStep(flow) : undefined;

  const ambiguous = /\{\{[^}]+\}\}/.test(text);
  const canCompose = !!activeThread && text.trim().length > 0 && scope.trim().length > 0 && acceptance.trim().length > 0 && !ambiguous;

  async function runDirective() {
    if (!canCompose || !activeThread) return;
    setErr(null);
    try {
      if (risk === "destructive") {
        const ok = await RuledPrompt.confirm(`Destructive directive against ${activeThread.repo}. Confirm acceptance?`, { severity: "destructive" });
        if (!ok) {
          await emit.nullConsequence("directive.accept", "destructive confirmation declined");
          return;
        }
      }

      const d = await emit.acceptDirective(activeThread.id, {
        text: text.trim(),
        scope: scope.trim(),
        risk,
        acceptance: acceptance.trim(),
        ...(promotingConceptId ? { conceptId: promotingConceptId } : {}),
      });
      setPromotingConceptId(null);
      setText("");
      setScope("");
      setAcceptance("");

      const config = getRuntimeConfig();
      await runRuntime(
        { prompt: String(d.payload.text ?? ""), threadId: activeThread.id, directiveId: d.id },
        config ?? undefined,
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
        { text: text.trim(), scope: scope.trim(), risk, acceptance: acceptance.trim() },
        reason.trim(),
      );
      setText("");
      setScope("");
      setAcceptance("");
      setPromotingConceptId(null);
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

  const acceptedDirectiveCount = directives.filter((d) => d.status === "accepted").length;
  const pendingReviewCount = artifacts.filter((a) => a.review === "pending").length;

  return (
    <section className="rb-chamber rb-chamber--creation">
      <header className="rb-chamber-header rb-chamber-header--forge">
        <div className="rb-forge-sigil" aria-hidden="true" />
        <h1 className="rb-chamber-title">Creation</h1>
        <div className="rb-chamber-gravity-bar">
          <span className="rb-chamber-gravity-text rb-gravity--primary">Architect Forge</span>
          <span className="rb-gravity-sep">·</span>
          <span className="rb-chamber-gravity-text">Directive pressure · Consequence loop</span>
          {acceptedDirectiveCount > 0 && <><span className="rb-gravity-sep">·</span><span className="rb-chamber-gravity-text rb-gravity--forge">{acceptedDirectiveCount} accepted</span></>}
          {pendingReviewCount > 0 && <><span className="rb-gravity-sep">·</span><span className="rb-chamber-gravity-text rb-gravity--warn">{pendingReviewCount} awaiting review</span></>}
          {activeThread && <><span className="rb-gravity-sep">·</span><span className="rb-thread-context-intent">{activeThread.intent.length > 44 ? activeThread.intent.slice(0, 44) + "…" : activeThread.intent}</span><span className={`rb-badge ${activeThread.state === "open" ? "ok" : activeThread.state === "executing" ? "warn" : activeThread.state === "awaiting-review" ? "warn" : activeThread.state === "closed" ? "bad" : ""}`}>{activeThread.state}</span></>}
        </div>
        <div className="rb-chamber-accent-line" />
      </header>

      {!activeThread ? (
        <Unavailable
          title="forge idle — no active thread"
          reason="The architect forge requires a thread. Bind a repo and open a thread from the thread rail to begin the consequence loop."
          remediation="State an intent. Every directive must carry a thread."
        />
      ) : (
        <>
          <div className="rb-forge-workplace">
            <div className="rb-forge-side rb-forge-side--upstream" aria-label="Upstream work">
              <div className="rb-relay-chain" aria-label="Concept-to-build relay">
            <div className={`rb-relay-node${concepts.length > 0 ? " reached" : ""}${concepts.length > 0 && !concepts.some(c => !c.promoted) && directives.length === 0 ? " active" : ""}`}>
              <span className="rb-relay-node-label">Concept</span>
              {concepts.filter(c => !c.promoted).length > 0 && <span className="rb-relay-count">{concepts.filter(c => !c.promoted).length}</span>}
            </div>
            <div className="rb-relay-arrow">→</div>
            <div className={`rb-relay-node${directives.filter(d => d.status === "accepted").length > 0 ? " reached" : ""}${activeThread?.state === "executing" ? " active" : ""}`}>
              <span className="rb-relay-node-label">Directive</span>
              {acceptedDirectiveCount > 0 && <span className="rb-relay-count">{acceptedDirectiveCount}</span>}
            </div>
            <div className="rb-relay-arrow">→</div>
            <div className={`rb-relay-node${artifacts.length > 0 ? " reached" : ""}${activeThread?.state === "executing" ? " active" : ""}`}>
              <span className="rb-relay-node-label">Artifact</span>
              {artifacts.filter(a => !a.committed).length > 0 && <span className="rb-relay-count">{artifacts.filter(a => !a.committed).length}</span>}
            </div>
            <div className="rb-relay-arrow">→</div>
            <div className={`rb-relay-node${artifacts.some(a => a.review !== "pending") ? " reached" : ""}${activeThread?.state === "awaiting-review" ? " active" : ""}`}>
              <span className="rb-relay-node-label">Review</span>
              {pendingReviewCount > 0 && <span className="rb-relay-count rb-relay-count--warn">{pendingReviewCount}</span>}
            </div>
          </div>

          {proposals.length > 0 && (
            <div className="rb-proposal-surface">
              <div className="rb-proposal-surface-label">proposed directives · {proposals.length}</div>
              {proposals.map((prop) => (
                <div key={prop.id} className="rb-proposal-card">
                  <div className="rb-proposal-card-header">
                    <span className="rb-proposal-agent-badge">{prop.proposedBy}</span>
                    <span className={`rb-badge ${prop.risk}`}>{prop.risk}</span>
                  </div>
                  <div className="rb-proposal-card-text">{prop.text}</div>
                  <div className="rb-proposal-card-scope">{prop.scope}</div>
                  <div className="rb-proposal-card-rationale">↳ {prop.rationale}</div>
                  <div className="rb-proposal-actions">
                    <button className="rb-btn primary" onClick={() => emit.acceptProposal(prop.id)}>Accept → Directive</button>
                    <button className="rb-btn" onClick={async () => {
                      const reason = await RuledPrompt.ask("Dismiss reason (required):", { label: "reason" });
                      if (reason?.trim()) emit.dismissProposal(prop.id, reason.trim());
                    }}>Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {flow && (
            <div className="rb-flow-surface">
              <div className="rb-flow-surface-label">active flow · {flow.name}</div>
              <div className="rb-flow-steps">
                {flow.steps.map((step, i) => (
                  <div key={i} className={`rb-flow-step${step.status === "succeeded" ? " rb-flow-step--done" : step.status === "failed" ? " rb-flow-step--failed" : i === flow.currentStep ? " rb-flow-step--current" : ""}`}>
                    <span className="rb-flow-step-index">{i + 1}</span>
                    <span className="rb-flow-step-text">{step.directiveText}</span>
                    <span className={`rb-badge ${step.status === "succeeded" ? "ok" : step.status === "failed" ? "bad" : step.status === "executing" ? "warn" : ""}`}>{step.status}</span>
                  </div>
                ))}
              </div>
              {flowNext && (
                <div className="rb-flow-next">
                  <span className="rb-flow-next-label">next →</span>
                  <span className="rb-flow-next-text">{flowNext.directiveText}</span>
                </div>
              )}
            </div>
          )}

          <div className="rb-concept-station">
            <div className="rb-concept-station-title">Concept Station</div>

            {concepts.filter(c => !c.promoted).length > 0 && (
              <div className="rb-concept-list">
                {concepts.filter(c => !c.promoted).map(concept => {
                  const inheritance = conceptAncestry(p, concept.id);
                  return (
                    <div key={concept.id} className="rb-concept-item">
                      <div className="rb-concept-item-title">{concept.title}</div>
                      <div className="rb-concept-item-hypothesis">{concept.hypothesis}</div>
                      {inheritance.length > 0 && (
                        <div className="rb-concept-inheritance">
                          <div className="rb-concept-inheritance-label">inherited intelligence · {inheritance.length}</div>
                          {inheritance.slice(0, 3).map(c => (
                            <div key={c.id} className="rb-concept-inheritance-entry"><span className="dot" />{c.text.length > 70 ? c.text.slice(0, 70) + "…" : c.text}</div>
                          ))}
                        </div>
                      )}
                      <button className="rb-btn primary" onClick={() => { setText(concept.hypothesis); setScope(concept.title); setPromotingConceptId(concept.id); }}>
                        Promote → Directive
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="rb-concept-compose">
              <div className="rb-field-group">
                <label className="rb-field-label">Concept Title</label>
                <input className="rb-scope-input" placeholder="what is the architect proposing?" value={conceptTitle} onChange={(e) => setConceptTitle(e.target.value)} />
              </div>
              <div className="rb-field-group">
                <label className="rb-field-label">Hypothesis</label>
                <textarea className="rb-directive-input" placeholder="what change is this concept testing or asserting?" value={conceptHypothesis} onChange={(e) => setConceptHypothesis(e.target.value)} />
              </div>
              <button className="rb-btn" disabled={!conceptTitle.trim() || !conceptHypothesis.trim()} onClick={async () => {
                if (!activeThread) return;
                try {
                  await emit.stateConcept(activeThread.id, conceptTitle.trim(), conceptHypothesis.trim());
                  setConceptTitle("");
                  setConceptHypothesis("");
                } catch (e) {
                  setErr((e as Error).message);
                }
              }}>State Concept</button>
            </div>
          </div>

            </div>

            <div className="rb-forge-pri" aria-label="Terminal and directive forge">
          <ThreadTerminal
            title="Creation Terminal"
            thread={activeThread}
            directives={directives}
            executions={executions}
            artifacts={artifacts}
            contradictions={openContradictions}
          />

          <div className={`rb-directive-forge${canCompose ? " rb-directive-forge--ready" : ""}${promotingConceptId ? " rb-directive-forge--from-concept" : ""}`}>
            <div className="rb-forge-title">Directive Forge{promotingConceptId && <span className="rb-forge-concept-origin">← concept</span>}</div>

            {directives.length > 0 && (
              <div className="rb-thread-record">
                <div className="rb-thread-record-label">thread record</div>
                {directives.map((d) => {
                  const linked = artifacts.filter((a) => a.directive === d.id);
                  const agent = directiveAgent(p, d.id);
                  return (
                    <div key={d.id} className="rb-thread-record-row">
                      <div className="rb-row" style={{ gap: 6, flexWrap: "wrap" }}>
                        <span className={`rb-badge ${d.status === "accepted" ? "ok" : "bad"}`}>{d.status}</span>
                        <span className={`rb-badge ${d.risk}`}>{d.risk}</span>
                        {agent && <span className="rb-agent-badge">{agent.name}</span>}
                        <span className="rb-thread-record-text">{d.text.length > 60 ? d.text.slice(0, 60) + "…" : d.text}</span>
                      </div>
                      {d.status === "rejected" && d.reason && <div className="rb-thread-record-sub">↳ {d.reason}</div>}
                      {linked.map((a) => (
                        <div key={a.id} className="rb-thread-record-chain">
                          <span className={`rb-badge ${a.committed ? "ok" : a.review === "accepted" ? "ok" : a.review === "rejected" ? "bad" : "warn"}`}>{a.committed ? "committed" : a.review}</span>
                          <span className="rb-thread-record-artifact">{a.title.length > 40 ? a.title.slice(0, 40) + "…" : a.title}</span>
                          {a.commitRef && <span className="rb-thread-record-ref">#{a.commitRef.slice(0, 7)}</span>}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {canonConstraints.length > 0 && <div className="rb-canon-constraint"><div className="rb-canon-constraint-label">canon constraint</div>{canonConstraints.map((c) => <div key={c.id} className="rb-canon-constraint-entry">{c.text.length > 80 ? c.text.slice(0, 80) + "…" : c.text}</div>)}</div>}

            {revokedDeps.length > 0 && <div className="rb-forge-revoked-deps"><div className="rb-forge-revoked-deps-label">revoked canon dependency · {revokedDeps.length}</div>{revokedDeps.slice(0, 3).map((d) => <div key={`${d.canonId}-${d.directiveId}`} className="rb-forge-revoked-deps-entry"><span className="rb-badge bad">revoked</span><span>{d.canonText.length > 50 ? d.canonText.slice(0, 50) + "…" : d.canonText}</span><span className="rb-forge-revoked-deps-arrow">→</span><span>{d.directiveText.length > 40 ? d.directiveText.slice(0, 40) + "…" : d.directiveText}</span></div>)}</div>}

            {threadMemory.length > 0 && <div className="rb-forge-memory"><div className="rb-forge-memory-label">retained consequence</div>{threadMemory.map((m) => <div key={m.id} className="rb-forge-memory-entry">{m.text.length > 80 ? m.text.slice(0, 80) + "…" : m.text}</div>)}</div>}

            {openContradictions.length > 0 && <div className="rb-forge-contradiction"><div className="rb-forge-contradiction-label">unresolved · {openContradictions.length}</div>{openContradictions.map((c) => <div key={c.id} className="rb-forge-contradiction-entry">{c.text.length > 80 ? c.text.slice(0, 80) + "…" : c.text}</div>)}</div>}

            <div className="rb-field-group">
              <label className="rb-field-label">Directive</label>
              <textarea className={`rb-directive-input${ambiguous ? " ambiguous" : ""}`} placeholder="the directive to be executed" value={text} onChange={(e) => setText(e.target.value)} />
              {ambiguous && <div className="rb-forge-warn">◐ unresolved {"{{placeholders}}"} — resolve before acceptance</div>}
            </div>

            <div className="rb-field-group">
              <label className="rb-field-label">Scope</label>
              <input className="rb-scope-input" placeholder="file set, canon scope, or repo-wide" value={scope} onChange={(e) => setScope(e.target.value)} />
            </div>

            <div className="rb-field-group">
              <label className="rb-field-label">Risk</label>
              <div className="rb-risk-selector" role="group" aria-label="Risk level">
                {(["reversible", "consequential", "destructive"] as Risk[]).map((r) => (
                  <button key={r} data-risk={r} className={`rb-risk-btn${risk === r ? " selected" : ""}`} onClick={() => setRisk(r)} type="button">{r}</button>
                ))}
              </div>
              <div className={`rb-risk-descriptor ${RISK_INFO[risk].colorClass}`}>{RISK_INFO[risk].descriptor}</div>
            </div>

            <div className="rb-field-group">
              <label className="rb-field-label">Acceptance Criterion</label>
              <input className={`rb-acceptance-field${acceptance.trim() ? " signed" : ""}`} placeholder="criterion for acceptance" value={acceptance} onChange={(e) => setAcceptance(e.target.value)} />
            </div>

            <div className="rb-threshold">
              <button className={`rb-threshold-btn${canCompose ? " ready" : ""}`} disabled={!canCompose} onClick={runDirective} type="button">Accept · Execute</button>
              <button className="rb-threshold-reject" disabled={!text.trim()} onClick={rejectDraft} type="button">Reject</button>
            </div>

            {runningExecutions.length > 0 && <div className="rb-forge-exec-signal" role="status" aria-live="polite"><span className="rb-forge-exec-dot" aria-hidden="true" /><span className="rb-forge-exec-label">executing</span><span className="rb-forge-exec-target">{runningExecutions[0].label.length > 48 ? runningExecutions[0].label.slice(0, 48) + "…" : runningExecutions[0].label}</span>{runningExecutions.length > 1 && <span className="rb-forge-exec-count">+{runningExecutions.length - 1}</span>}</div>}

            {err && <div className="rb-unavail" style={{ marginTop: 12 }}><strong>refused</strong>{err}</div>}
            {!getRuntimeConfig() && <div style={{ marginTop: 12 }}><Unavailable title="simulation mode" reason="No AI provider configured. Directives execute in simulation." remediation="Open Settings (⚙) to configure OpenAI, Anthropic, Ollama, or another provider." /></div>}
          </div>

            </div>
          </div>

          <div className="rb-trace">
            <h2>Directive Ledger</h2>
            {directives.length === 0 ? <div className="rb-unavail"><strong>no directives</strong></div> : <ul className="rb-list">{directives.slice().reverse().map((d) => <li key={d.id}><span className={`rb-badge ${d.status === "accepted" ? "ok" : "bad"}`}>{d.status}</span><span className={`rb-badge ${d.risk}`}>{d.risk}</span><span className="rb-badge">scope: {d.scope}</span>{d.text}{d.reason ? <div style={{ fontSize: 10, color: "var(--rb-ink-mute)", marginTop: 4 }}>reason: {d.reason}</div> : null}</li>)}</ul>}
          </div>

          <div className={`rb-trace${activeThread.state === "executing" ? " rb-trace--executing" : ""}`}>
            <h2>Execution Trace</h2>
            {executions.length === 0 ? <div className="rb-unavail"><strong>no executions</strong></div> : <ul className="rb-list">{executions.slice().reverse().map((x) => <li key={x.id} className="rb-exec-timeline-entry"><div className="rb-exec-timeline-row"><span className={`rb-exec-timeline-dot ${x.status === "succeeded" ? "ok" : x.status === "failed" ? "bad" : "running"}`} /><span className={`rb-badge ${x.status === "succeeded" ? "ok" : x.status === "failed" ? "bad" : "warn"}`}>{x.status}</span><span className="rb-exec-timeline-label">{x.label}</span></div><div className="rb-exec-timeline-meta"><span className="rb-exec-timeline-ts">{new Date(x.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>{x.endedAt && <span className="rb-exec-timeline-duration">{Math.round((x.endedAt - x.startedAt) / 1000)}s</span>}</div>{x.reason && <div className="rb-exec-timeline-reason">↳ {x.reason}</div>}{x.status === "failed" && <button className="rb-exec-retry-btn" onClick={() => emit.retryExecution(x.id)}>Retry</button>}</li>)}</ul>}
          </div>

          {(() => {
            const pending = artifacts.filter((a) => a.review === "pending");
            const reviewed = artifacts.filter((a) => a.review !== "pending");
            const directiveMap = new Map(directives.map((d) => [d.id, d]));
            return (
              <>
                {pending.length > 0 && <div className="rb-review-surface"><div className="rb-review-surface-header"><span className="rb-review-surface-label">Review Required</span><span className="rb-review-surface-count">{pending.length} pending</span></div>{pending.map((a) => { const originDirective = a.directive ? directiveMap.get(a.directive) : undefined; const hasEvidence = !!(a.files?.length || a.diff || a.commitRef); return <div key={a.id} className="rb-review-card"><div className="rb-review-card-title">{a.title}</div>{originDirective?.acceptance && <div className="rb-review-criterion"><span className="rb-review-criterion-label">criterion</span><span className="rb-review-criterion-text">{originDirective.acceptance}</span></div>}{hasEvidence && <div className="rb-artifact-evidence">{a.files && a.files.length > 0 && <div><div className="rb-artifact-evidence-label">affected files</div><div className="rb-artifact-files">{a.files.map((f) => <span key={f}>{f}</span>)}</div></div>}{a.diff && <div><div className="rb-artifact-evidence-label">changes</div>{renderDiff(a.diff)}</div>}{a.commitRef && <div className="rb-artifact-commit-ref">ref: {a.commitRef}</div>}</div>}<div className="rb-review-actions"><button className="rb-review-btn rb-review-btn--accept" onClick={() => review(a.id, "accepted")}>Accept</button><button className="rb-review-btn rb-review-btn--reject" onClick={() => review(a.id, "rejected")}>Reject</button></div></div>;})}</div>}
                {reviewed.length > 0 && <div className="rb-trace"><h2>Artifact History</h2><ul className="rb-list">{reviewed.slice().reverse().map((a) => { const hasEvidence = !!(a.files?.length || a.diff || a.commitRef); return <li key={a.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}><div className="rb-row" style={{ gap: 8, flexWrap: "wrap" }}><span className={`rb-badge ${a.committed ? "ok" : a.review === "accepted" ? "ok" : a.review === "rejected" ? "bad" : "warn"}`}>{a.committed ? "committed" : a.review}</span><span style={{ fontSize: 12, color: "var(--rb-ink-soft)" }}>{a.title}</span></div>{hasEvidence && <div className="rb-artifact-evidence">{a.commitRef && <div className="rb-artifact-commit-ref">ref: {a.commitRef}</div>}{a.diff && renderDiff(a.diff)}</div>}{a.reviewReason && <div style={{ fontSize: 10, color: "var(--rb-ink-mute)" }}>↳ {a.reviewReason}</div>}{a.review === "accepted" && !a.committed && <div><button className="rb-btn primary" onClick={() => emit.commitArtifact(a.id)}>Commit</button></div>}</li>;})}</ul></div>}
                {artifacts.length === 0 && <div className="rb-trace"><h2>Artifacts</h2><div className="rb-unavail"><strong>no artifacts</strong></div></div>}
              </>
            );
          })()}

        </>
      )}
    </section>
  );
}
