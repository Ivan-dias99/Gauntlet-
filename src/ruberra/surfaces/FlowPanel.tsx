// Ruberra — Flow Engine Panel
// Define multi-step directive flows, monitor step completion, abort.
// W10 flow system made real.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";
import type { DirectiveRisk } from "../spine/projections";

interface StepDraft {
  directiveText: string;
  scope: string;
  risk: DirectiveRisk;
}

export function FlowPanel() {
  const p = useProjection();
  const activeThread = p.threads.find((t) => t.id === p.activeThread);
  const threadFlows = activeThread
    ? p.flows.filter((f) => f.thread === activeThread.id)
    : [];

  const [flowName, setFlowName] = useState("");
  const [steps, setSteps] = useState<StepDraft[]>([
    { directiveText: "", scope: "", risk: "reversible" },
  ]);
  const [err, setErr] = useState<string | null>(null);

  function addStep() {
    setSteps((s) => [...s, { directiveText: "", scope: "", risk: "reversible" }]);
  }

  function removeStep(idx: number) {
    setSteps((s) => s.filter((_, i) => i !== idx));
  }

  function updateStep(idx: number, field: keyof StepDraft, value: string) {
    setSteps((s) =>
      s.map((step, i) =>
        i === idx ? { ...step, [field]: value } : step
      )
    );
  }

  async function handleDefine() {
    if (!activeThread || !flowName.trim()) return;
    const validSteps = steps.filter((s) => s.directiveText.trim());
    if (validSteps.length === 0) return;
    setErr(null);
    try {
      await emit.defineFlow(activeThread.id, flowName.trim(), validSteps);
      setFlowName("");
      setSteps([{ directiveText: "", scope: "", risk: "reversible" }]);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function handleStepComplete(flowId: string, outcome: "succeeded" | "failed") {
    setErr(null);
    try {
      await emit.completeFlowStep(flowId, outcome);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function handleFlowComplete(flowId: string, outcome: "completed" | "aborted") {
    setErr(null);
    try {
      await emit.completeFlow(flowId, outcome);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  if (!activeThread) {
    return (
      <div className="rb-flow-panel">
        <div className="rb-unavail"><strong>no active thread</strong> Open a thread to define flows.</div>
      </div>
    );
  }

  return (
    <div className="rb-flow-panel">
      <div className="rb-flow-panel-header">
        <span className="rb-flow-panel-title">Flow Engine</span>
        <span className="rb-flow-panel-count">
          {threadFlows.filter((f) => f.status === "active").length} active
        </span>
      </div>

      {threadFlows.length > 0 && (
        <div className="rb-flow-list">
          {threadFlows.map((flow) => (
            <div key={flow.id} className={`rb-flow-card rb-flow-card--${flow.status}`}>
              <div className="rb-flow-card-header">
                <span className="rb-flow-card-name">{flow.name}</span>
                <span className={`rb-badge ${flow.status === "active" ? "warn" : flow.status === "completed" ? "ok" : "bad"}`}>
                  {flow.status}
                </span>
              </div>
              <div className="rb-flow-card-steps">
                {flow.steps.map((step, i) => (
                  <div
                    key={i}
                    className={`rb-flow-card-step${
                      step.status === "succeeded" ? " done" :
                      step.status === "failed" ? " failed" :
                      i === flow.currentStep && flow.status === "active" ? " current" : ""
                    }`}
                  >
                    <span className="rb-flow-card-step-num">{i + 1}</span>
                    <span className="rb-flow-card-step-text">{step.directiveText}</span>
                    <span className={`rb-badge ${
                      step.status === "succeeded" ? "ok" :
                      step.status === "failed" ? "bad" :
                      step.status === "executing" ? "warn" : ""
                    }`}>
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
              {flow.status === "active" && (
                <div className="rb-flow-card-actions">
                  <button
                    className="rb-btn primary"
                    onClick={() => handleStepComplete(flow.id, "succeeded")}
                    type="button"
                  >
                    Step Succeeded
                  </button>
                  <button
                    className="rb-btn"
                    onClick={() => handleStepComplete(flow.id, "failed")}
                    type="button"
                  >
                    Step Failed
                  </button>
                  <button
                    className="rb-btn"
                    onClick={() => handleFlowComplete(flow.id, "aborted")}
                    type="button"
                  >
                    Abort Flow
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rb-flow-define">
        <div className="rb-flow-define-title">Define New Flow</div>
        <div className="rb-field-group">
          <label className="rb-field-label">Flow Name</label>
          <input
            className="rb-input"
            placeholder="deployment pipeline, refactor sequence..."
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
          />
        </div>

        <div className="rb-flow-steps-editor">
          {steps.map((step, i) => (
            <div key={i} className="rb-flow-step-draft">
              <div className="rb-flow-step-draft-num">{i + 1}</div>
              <div className="rb-flow-step-draft-fields">
                <input
                  className="rb-input"
                  placeholder="directive text"
                  value={step.directiveText}
                  onChange={(e) => updateStep(i, "directiveText", e.target.value)}
                />
                <input
                  className="rb-input"
                  placeholder="scope"
                  value={step.scope}
                  onChange={(e) => updateStep(i, "scope", e.target.value)}
                />
                <select
                  className="rb-input"
                  value={step.risk}
                  onChange={(e) => updateStep(i, "risk", e.target.value)}
                >
                  <option value="reversible">reversible</option>
                  <option value="consequential">consequential</option>
                  <option value="destructive">destructive</option>
                </select>
              </div>
              {steps.length > 1 && (
                <button
                  className="rb-btn"
                  onClick={() => removeStep(i)}
                  type="button"
                  style={{ alignSelf: "center" }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="rb-flow-define-actions">
          <button className="rb-btn" onClick={addStep} type="button">
            + Add Step
          </button>
          <button
            className="rb-btn primary"
            disabled={!flowName.trim() || !steps.some((s) => s.directiveText.trim())}
            onClick={handleDefine}
            type="button"
          >
            Define Flow
          </button>
        </div>
      </div>

      {err && <div className="rb-unavail" style={{ marginTop: 8 }}><strong>refused</strong> {err}</div>}
    </div>
  );
}
