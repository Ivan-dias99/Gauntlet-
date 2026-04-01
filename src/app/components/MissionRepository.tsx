/**
 * RUBERRA — Mission Repository
 * Stack 02 · Mission Substrate · Visible Shell
 *
 * The mission is the root object of work in Ruberra.
 * This surface is the sovereign repository of all missions.
 * It is NOT a project list. It is NOT a dashboard.
 * It is the consequence-bearing mission organ of the organism.
 *
 * Antigravity law:
 * - No table. No grid of cards. One dense, ledger-weight list.
 * - Status is textual, monospace — not colored badges.
 * - Chamber lead is signaled via a 5px accent dot only.
 * - "Birth" action is inline — no modal, no wizard.
 * - Empty state is honest and action-bearing.
 */

import { useState } from "react";
import {
  type Mission,
  type MissionChamberLead,
  type MissionStatus,
  createMission,
  getActiveMissions,
  MISSION_STATUS_LABEL,
  MISSION_STATUS_COLOR,
  CHAMBER_ACCENT,
} from "../dna/mission-substrate";
import { type NavFn } from "./shell-types";

// ─── Chamber tab → view root ──────────────────────────────────────────────────

const CHAMBER_DEFAULT_VIEW: Record<MissionChamberLead, string> = {
  lab:      "home",
  school:   "home",
  creation: "home",
};

// ─── Birth form ───────────────────────────────────────────────────────────────

function BirthForm({
  onBirth,
  onCancel,
}: {
  onBirth: (m: Mission) => void;
  onCancel: () => void;
}) {
  const [name,         setName]         = useState("");
  const [chamberLead,  setChamberLead]  = useState<MissionChamberLead>("lab");
  const [outcome,      setOutcome]      = useState("");
  const [scope,        setScope]        = useState("");

  const canSubmit = name.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    onBirth(createMission({
      name:             name.trim(),
      chamberLead,
      outcomeStatement: outcome.trim(),
      scope:            scope.trim(),
    }));
  }

  const inputStyle: React.CSSProperties = {
    width:        "100%",
    background:   "var(--r-bg)",
    border:       "1px solid var(--r-border)",
    borderRadius: "5px",
    padding:      "7px 10px",
    fontSize:     "12px",
    fontFamily:   "'Inter', system-ui, sans-serif",
    color:        "var(--r-text)",
    outline:      "none",
    boxSizing:    "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize:     "9px",
    fontFamily:   "'JetBrains Mono', monospace",
    letterSpacing:"0.09em",
    textTransform:"uppercase",
    color:        "var(--r-dim)",
    marginBottom: "4px",
    display:      "block",
  };

  const CHAMBERS: MissionChamberLead[] = ["lab", "school", "creation"];

  return (
    <div style={{
      margin:       "0 0 1px",
      padding:      "16px 14px 14px",
      borderBottom: "1px solid var(--r-border)",
      background:   "color-mix(in srgb, var(--r-surface) 60%, var(--r-bg))",
    }}>
      <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-dim)", margin: "0 0 14px" }}>
        Birth a mission
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>Mission name *</label>
          <input
            style={inputStyle}
            placeholder="What is this mission called?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && canSubmit) handleSubmit(); }}
            autoFocus
          />
        </div>

        {/* Chamber lead */}
        <div>
          <label style={labelStyle}>Chamber lead</label>
          <div style={{ display: "flex", gap: "6px" }}>
            {CHAMBERS.map((c) => {
              const active = chamberLead === c;
              return (
                <button
                  key={c}
                  onClick={() => setChamberLead(c)}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "5px",
                    padding:      "5px 11px",
                    borderRadius: "5px",
                    border:       active
                      ? `1px solid color-mix(in srgb, ${CHAMBER_ACCENT[c]} 45%, var(--r-border))`
                      : "1px solid var(--r-border)",
                    background:   active
                      ? `color-mix(in srgb, ${CHAMBER_ACCENT[c]} 10%, var(--r-surface))`
                      : "transparent",
                    cursor:       "pointer",
                    outline:      "none",
                    fontSize:     "11px",
                    fontFamily:   "'Inter', system-ui, sans-serif",
                    color:        active ? "var(--r-text)" : "var(--r-subtext)",
                    fontWeight:   active ? 500 : 400,
                    transition:   "all 0.12s ease",
                  }}
                >
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: CHAMBER_ACCENT[c], flexShrink: 0 }} />
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Outcome */}
        <div>
          <label style={labelStyle}>Outcome (optional)</label>
          <input
            style={inputStyle}
            placeholder="What does success look like?"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
          />
        </div>

        {/* Scope */}
        <div>
          <label style={labelStyle}>Scope boundary (optional)</label>
          <input
            style={inputStyle}
            placeholder="What is explicitly owned — and what is not?"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            padding:      "7px 16px",
            borderRadius: "5px",
            border:       "1px solid color-mix(in srgb, var(--r-text) 20%, var(--r-border))",
            background:   canSubmit ? "var(--r-text)" : "var(--r-surface)",
            color:        canSubmit ? "var(--r-bg)" : "var(--r-dim)",
            fontSize:     "11px",
            fontFamily:   "'Inter', system-ui, sans-serif",
            fontWeight:   500,
            cursor:       canSubmit ? "pointer" : "not-allowed",
            outline:      "none",
            transition:   "all 0.12s ease",
          }}
        >
          Birth mission
        </button>
        <button
          onClick={onCancel}
          style={{
            padding:      "7px 14px",
            borderRadius: "5px",
            border:       "1px solid var(--r-border)",
            background:   "transparent",
            color:        "var(--r-subtext)",
            fontSize:     "11px",
            fontFamily:   "'Inter', system-ui, sans-serif",
            cursor:       "pointer",
            outline:      "none",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Mission row ──────────────────────────────────────────────────────────────

function MissionRow({
  mission,
  navigate,
  onActivate,
}: {
  mission:    Mission;
  navigate:   NavFn;
  onActivate?: (missionId: string) => void;
}) {
  const status = mission.ledger.currentState;
  const { chamberLead, name, outcomeStatement } = mission.identity;
  const runCount    = mission.ledger.runHistory.length;
  const artifactCount = mission.artifacts.artifacts.length;

  function handleEnter() {
    onActivate?.(mission.id);
    navigate(chamberLead, CHAMBER_DEFAULT_VIEW[chamberLead]);
  }

  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "space-between",
        gap:            "12px",
        padding:        "11px 14px",
        borderBottom:   "1px solid var(--r-border-soft)",
        transition:     "background 0.10s ease",
        cursor:         "default",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {/* Left: identity */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", minWidth: 0, flex: 1 }}>
        {/* Chamber accent dot */}
        <div style={{
          width:      "5px",
          height:     "5px",
          borderRadius:"50%",
          background: CHAMBER_ACCENT[chamberLead],
          flexShrink: 0,
          marginTop:  "5px",
        }} />

        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize:     "12px",
            fontWeight:   500,
            color:        "var(--r-text)",
            fontFamily:   "'Inter', system-ui, sans-serif",
            margin:       "0 0 2px",
            letterSpacing:"-0.005em",
            lineHeight:   "1.3",
          }}>
            {name}
          </p>

          {outcomeStatement && (
            <p style={{
              fontSize:   "11px",
              color:      "var(--r-subtext)",
              fontFamily: "'Inter', system-ui, sans-serif",
              margin:     "0 0 5px",
              lineHeight: "1.45",
            }}>
              {outcomeStatement}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{
              fontSize:     "9px",
              fontFamily:   "'JetBrains Mono', monospace",
              letterSpacing:"0.09em",
              color:        MISSION_STATUS_COLOR[status],
              textTransform:"lowercase",
            }}>
              {MISSION_STATUS_LABEL[status]}
            </span>
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", color: "var(--r-dim)", textTransform: "lowercase" }}>
              {chamberLead}
            </span>
            {runCount > 0 && (
              <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", color: "var(--r-dim)" }}>
                {runCount} run{runCount !== 1 ? "s" : ""}
              </span>
            )}
            {artifactCount > 0 && (
              <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", color: "var(--r-dim)" }}>
                {artifactCount} artifact{artifactCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: enter action */}
      <button
        onClick={handleEnter}
        style={{
          padding:      "4px 11px",
          borderRadius: "5px",
          border:       "1px solid var(--r-border)",
          background:   "transparent",
          color:        "var(--r-subtext)",
          fontSize:     "10px",
          fontFamily:   "'JetBrains Mono', monospace",
          letterSpacing:"0.05em",
          cursor:       "pointer",
          outline:      "none",
          flexShrink:   0,
          transition:   "all 0.10s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.color       = "var(--r-text)";
          el.style.borderColor = `color-mix(in srgb, ${CHAMBER_ACCENT[chamberLead]} 40%, var(--r-border))`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.color       = "var(--r-subtext)";
          el.style.borderColor = "var(--r-border)";
        }}
      >
        enter →
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface MissionRepositoryProps {
  missions:   Mission[];
  onUpsert:   (m: Mission) => void;
  onActivate?: (missionId: string) => void;
  navigate:   NavFn;
}

export function MissionRepository({ missions, onUpsert, onActivate, navigate }: MissionRepositoryProps) {
  const [birthing, setBirthing] = useState(false);

  const active = getActiveMissions(missions);
  const completed = missions.filter(
    (m) => m.ledger.currentState === "completed" || m.ledger.currentState === "archived",
  );

  function handleBirth(m: Mission) {
    onUpsert(m);
    setBirthing(false);
    onActivate?.(m.id);
    navigate(m.identity.chamberLead, CHAMBER_DEFAULT_VIEW[m.identity.chamberLead]);
  }

  return (
    <div style={{ borderBottom: "1px solid var(--r-border)" }}>
      {/* Header */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "10px 14px 9px",
        borderBottom:   "1px solid var(--r-border-soft)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontSize:     "9px",
            fontFamily:   "'JetBrains Mono', monospace",
            letterSpacing:"0.11em",
            textTransform:"uppercase",
            color:        "var(--r-dim)",
          }}>
            Mission Repository
          </span>
          {missions.length > 0 && (
            <span style={{
              fontSize:     "9px",
              fontFamily:   "'JetBrains Mono', monospace",
              color:        "var(--r-dim)",
              background:   "var(--r-elevated)",
              border:       "1px solid var(--r-border-soft)",
              borderRadius: "3px",
              padding:      "1px 5px",
              letterSpacing:"0.04em",
            }}>
              {missions.length}
            </span>
          )}
        </div>
        {!birthing && (
          <button
            onClick={() => setBirthing(true)}
            style={{
              padding:      "4px 11px",
              borderRadius: "5px",
              border:       "1px solid var(--r-border)",
              background:   "transparent",
              color:        "var(--r-subtext)",
              fontSize:     "10px",
              fontFamily:   "'JetBrains Mono', monospace",
              letterSpacing:"0.05em",
              cursor:       "pointer",
              outline:      "none",
              transition:   "all 0.10s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color       = "var(--r-text)";
              el.style.borderColor = "color-mix(in srgb, var(--r-text) 30%, var(--r-border))";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color       = "var(--r-subtext)";
              el.style.borderColor = "var(--r-border)";
            }}
          >
            + birth
          </button>
        )}
      </div>

      {/* Birth form */}
      {birthing && (
        <BirthForm
          onBirth={handleBirth}
          onCancel={() => setBirthing(false)}
        />
      )}

      {/* Active missions */}
      {active.length > 0 && (
        <div>
          {active.map((m) => (
            <MissionRow key={m.id} mission={m} navigate={navigate} onActivate={onActivate} />
          ))}
        </div>
      )}

      {/* Completed / archived missions — collapsed digest */}
      {completed.length > 0 && (
        <div>
          <div style={{ padding: "7px 14px 6px", borderTop: active.length > 0 ? "1px solid var(--r-border-soft)" : "none" }}>
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--r-dim)" }}>
              closed · {completed.length}
            </span>
          </div>
          {completed.map((m) => (
            <MissionRow key={m.id} mission={m} navigate={navigate} onActivate={onActivate} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {missions.length === 0 && !birthing && (
        <div style={{ padding: "20px 14px 18px" }}>
          <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--r-dim)", margin: "0 0 6px" }}>
            No missions yet
          </p>
          <p style={{ fontSize: "12px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.5", margin: "0 0 12px", maxWidth: "380px" }}>
            A mission is the root unit of work in Ruberra. All runs, outputs, and memory bind to it.
            Birth a mission to begin.
          </p>
          <button
            onClick={() => setBirthing(true)}
            style={{
              padding:      "7px 16px",
              borderRadius: "5px",
              border:       "1px solid color-mix(in srgb, var(--r-text) 18%, var(--r-border))",
              background:   "var(--r-text)",
              color:        "var(--r-bg)",
              fontSize:     "11px",
              fontFamily:   "'Inter', system-ui, sans-serif",
              fontWeight:   500,
              cursor:       "pointer",
              outline:      "none",
            }}
          >
            Birth first mission
          </button>
        </div>
      )}
    </div>
  );
}
