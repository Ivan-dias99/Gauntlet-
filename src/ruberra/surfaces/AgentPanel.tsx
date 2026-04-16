// Ruberra — Agent Management Surface
// Register agents, view capabilities, assign to directives.
// W10 agent system made real.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";
import { repoAgents } from "../spine/projections";
import type { AgentCapability } from "../spine/projections";
import { RuledPrompt } from "../trust/RuledPrompt";

const ALL_CAPS: AgentCapability[] = ["execute", "review", "propose", "canon", "observe"];

export function AgentPanel() {
  const p = useProjection();
  const [name, setName] = useState("");
  const [caps, setCaps] = useState<Set<AgentCapability>>(new Set(["execute"]));
  const [err, setErr] = useState<string | null>(null);

  const agents = p.activeRepo ? repoAgents(p, p.activeRepo) : [];
  const unassigned = p.directives.filter(
    (d) =>
      d.status === "accepted" &&
      !p.assignments.some((a) => a.directiveId === d.id)
  );

  async function handleRegister() {
    if (!name.trim() || caps.size === 0) return;
    setErr(null);
    try {
      await emit.registerAgent(name.trim(), Array.from(caps));
      setName("");
      setCaps(new Set(["execute"]));
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function handleAssign(directiveId: string) {
    if (agents.length === 0) return;
    const executors = agents.filter((a) => a.capabilities.includes("execute"));
    if (executors.length === 0) {
      setErr("No agents with 'execute' capability registered");
      return;
    }
    if (executors.length === 1) {
      try {
        await emit.assignDirective(directiveId, executors[0].id);
      } catch (e) {
        setErr((e as Error).message);
      }
      return;
    }
    // Multiple executors — ask which one
    const choice = await RuledPrompt.ask(
      `Assign to which agent? (${executors.map((a) => a.name).join(", ")})`,
      { label: "agent name" }
    );
    if (!choice) return;
    const agent = executors.find((a) => a.name.toLowerCase() === choice.trim().toLowerCase());
    if (!agent) {
      setErr(`Agent "${choice}" not found`);
      return;
    }
    try {
      await emit.assignDirective(directiveId, agent.id);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  return (
    <div className="rb-agent-panel">
      <div className="rb-agent-panel-header">
        <span className="rb-agent-panel-title">Agent Registry</span>
        <span className="rb-agent-panel-count">{agents.length} registered</span>
      </div>

      {agents.length > 0 && (
        <div className="rb-agent-list">
          {agents.map((a) => (
            <div key={a.id} className="rb-agent-card">
              <div className="rb-agent-card-name">{a.name}</div>
              <div className="rb-agent-card-caps">
                {a.capabilities.map((c) => (
                  <span key={c} className="rb-badge">{c}</span>
                ))}
              </div>
              <div className="rb-agent-card-ts">
                registered {new Date(a.registeredAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rb-agent-register">
        <div className="rb-agent-register-title">Register Agent</div>
        <div className="rb-field-group">
          <label className="rb-field-label">Name</label>
          <input
            className="rb-input"
            placeholder="agent name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="rb-field-group">
          <label className="rb-field-label">Capabilities</label>
          <div className="rb-agent-caps-selector">
            {ALL_CAPS.map((c) => (
              <button
                key={c}
                className={`rb-agent-cap-btn${caps.has(c) ? " active" : ""}`}
                onClick={() => {
                  const next = new Set(caps);
                  if (next.has(c)) next.delete(c);
                  else next.add(c);
                  setCaps(next);
                }}
                type="button"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <button
          className="rb-btn primary"
          disabled={!name.trim() || caps.size === 0}
          onClick={handleRegister}
          type="button"
        >
          Register
        </button>
      </div>

      {unassigned.length > 0 && (
        <div className="rb-agent-assign">
          <div className="rb-agent-assign-title">
            Unassigned Directives · {unassigned.length}
          </div>
          {unassigned.slice(0, 5).map((d) => (
            <div key={d.id} className="rb-agent-assign-row">
              <span className="rb-agent-assign-text">
                {d.text.length > 50 ? d.text.slice(0, 50) + "…" : d.text}
              </span>
              <button
                className="rb-btn"
                onClick={() => handleAssign(d.id)}
                disabled={agents.filter((a) => a.capabilities.includes("execute")).length === 0}
                type="button"
              >
                Assign
              </button>
            </div>
          ))}
        </div>
      )}

      {err && <div className="rb-unavail" style={{ marginTop: 8 }}><strong>refused</strong> {err}</div>}
    </div>
  );
}
