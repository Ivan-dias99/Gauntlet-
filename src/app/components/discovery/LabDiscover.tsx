/**
 * RUBERRA Lab — Discovery Home
 * Premium intelligence laboratory. Every element navigates somewhere real.
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  BarChart2,
  Code2,
  FileSearch,
  Database,
  GitBranch,
  Layers,
  Cpu,
  Terminal,
} from "lucide-react";
import { R } from "../tokens";
import { CollectionCard, ExperimentCard, SignalCard } from "../ContentCard";
import { DiscoveryRail, FeaturedHero } from "../DiscoveryRail";
import { type NavFn } from "../shell-types";
import { LAB_DOMAINS } from "../product-data";

interface LabDiscoverProps {
  onStartSession: () => void;
  navigate: NavFn;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const activeExperiments = [
  {
    id: 1,
    navId: "exp-raft",
    title: "Distributed Consensus Failure Modes",
    type: "Research",
    domain: "Systems Engineering",
    tools: ["Analysis", "Research"],
    complexity: "High" as const,
    pattern: "dots" as const,
    preview: "Partition scenarios, leader election windows, and quorum math you can cite in a verdict block.",
  },
  {
    id: 2,
    navId: "exp-cqrs",
    title: "CQRS vs Event Sourcing: Trade-off Matrix",
    type: "Analysis",
    domain: "Architecture",
    tools: ["Compare", "Audit"],
    complexity: "Medium" as const,
    pattern: "grid" as const,
    preview: "When to split read/write models vs when event logs become the operational bottleneck.",
  },
];

const experimentTemplates = [
  {
    id: 3,
    navId: "exp-replica",
    title: "Read Replica Diminishing Returns",
    type: "Experiment",
    domain: "Distributed Systems",
    tools: ["Simulate", "Code"],
    complexity: "Medium" as const,
    pattern: "lines" as const,
    preview: "Model staleness budgets vs replica count—where latency wins stop paying for redundancy.",
  },
  {
    id: 4,
    navId: "exp-rag",
    title: "RAG vs Fine-tuning Decision Matrix",
    type: "Analysis",
    domain: "AI Systems",
    tools: ["Framework", "Analysis"],
    complexity: "High" as const,
    pattern: "dots" as const,
    preview: "Grounding, update cadence, and cost curves in one matrix for leadership-ready output.",
  },
  {
    id: 5,
    navId: "exp-slo",
    title: "SLO Definition & Error Budget",
    type: "Framework",
    domain: "Reliability",
    tools: ["Framework", "Analysis"],
    complexity: "Low" as const,
    pattern: "solid" as const,
    preview: "Tie user-visible targets to error budgets so incidents have a numerical guardrail.",
  },
  {
    id: 6,
    navId: "exp-chaos",
    title: "Chaos Experiment Design",
    type: "Experiment",
    domain: "Reliability",
    tools: ["Simulate", "Research"],
    complexity: "High" as const,
    pattern: "grid" as const,
    preview: "Hypothesis → blast radius → rollback signal. Built for execution blocks, not slides.",
  },
];

const signals = [
  {
    id: "s1",
    domainId: "dist-systems",
    signal: "Event-driven architectures show 3.4× lower operational coupling in systems above 50 service boundaries, compared to RPC-first designs.",
    source: "ACM Queue",
    category: "Architecture",
    recency: "2d ago",
    relevance: "High" as const,
  },
  {
    id: "s2",
    domainId: "dist-systems",
    signal: "Raft consensus latency under leader failure exceeds Paxos by a predictable 1.5–2× election timeout window — a known and acceptable trade-off.",
    source: "OSDI Paper",
    category: "Consensus",
    recency: "4d ago",
    relevance: "High" as const,
  },
  {
    id: "s3",
    domainId: "reliability",
    signal: "Service meshes introduce ~0.5ms of overhead per hop in mTLS mode. Teams adopting sidecar injection report 12% increase in debuggability.",
    source: "CNCF Report",
    category: "Observability",
    recency: "1w ago",
    relevance: "Medium" as const,
  },
  {
    id: "s4",
    domainId: "data-arch",
    signal: "Read replicas beyond the third replica provide diminishing returns in eventual consistency scenarios with <300ms acceptable staleness.",
    source: "Benchmark",
    category: "Data",
    recency: "5d ago",
    relevance: "Medium" as const,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
import {
  EntityTitleBlock,
  EntitySummaryBlock,
  RelationshipList,
  EntityRow,
  TabSet,
  ChamberNavGroup,
  ContextBand,
  DirectiveStack,
  ConsequenceLog,
  StateBadge
} from "../SystemComponents";

export function LabDiscover({ onStartSession, navigate }: LabDiscoverProps) {
  const [activeTab, setActiveTab] = useState("threads");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        flex: 1,
        display: "flex",
        background: "var(--r-bg)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar - Local Navigation & Directives */}
      <div style={{ width: "260px", borderRight: "1px solid var(--r-border)", padding: "24px 16px", overflowY: "auto" }}>
        <ChamberNavGroup title="Views">
          <EntityRow title="Active Threads" type="⌘ 1" onClick={() => setActiveTab("threads")} />
          <EntityRow title="Campaigns" type="⌘ 2" onClick={() => setActiveTab("campaigns")} />
          <EntityRow title="Memory Timeline" type="⌘ 3" onClick={() => setActiveTab("memory")} />
        </ChamberNavGroup>

        <ChamberNavGroup title="Tool Ecosystem">
          <EntityRow title="Research Engine" type="Open" onClick={() => navigate("lab", "chat")} />
          <EntityRow title="Code Lab" type="Open" onClick={() => navigate("lab", "code")} />
          <EntityRow title="Analysis Suite" type="Open" onClick={() => navigate("lab", "analysis")} />
        </ChamberNavGroup>

        <div style={{ marginTop: "32px" }}>
          <DirectiveStack
            directives={[
              { id: "1", text: "Enforce empirical citation on all consensus proofs", priority: "high" },
              { id: "2", text: "Reject generic architecture unbacked by runtime load traces", priority: "normal" }
            ]}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <ContextBand chamber="lab" pressure={3} state="Nominal" />

          <div style={{ margin: "24px 0" }}>
            <EntityTitleBlock 
              title="Lab Domain: Systems Engineering" 
              type="Root Domain" 
              status={<StateBadge state="Active" color="var(--chamber-lab)" />} 
              accent="var(--chamber-lab)"
            />
            <EntitySummaryBlock>
              This chamber currently holds 3 active threads investigating consensus failures under partition scenarios. Evidence compilation is underway.
            </EntitySummaryBlock>
          </div>

          <TabSet 
            tabs={[
              { id: "threads", label: "Active Threads" },
              { id: "campaigns", label: "Campaigns" },
              { id: "memory", label: "Memory" },
              { id: "artifacts", label: "Artifacts" }
            ]}
            active={activeTab}
            onSelect={setActiveTab}
          />

          {activeTab === "threads" && (
            <div>
              <p style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", textTransform: "uppercase", marginBottom: "12px" }}>Active Investigation Threads</p>
              {activeExperiments.map(e => (
                <div key={e.id} style={{ marginBottom: "8px" }}>
                  <EntityRow 
                    title={e.title} 
                    type={e.type} 
                    meta={<StateBadge state="In Progress" color="var(--r-warn)" />}
                    onClick={() => navigate("lab", "experiment", e.navId)} 
                  />
                </div>
              ))}

              <div style={{ marginTop: "32px" }}>
                <p style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", textTransform: "uppercase", marginBottom: "12px" }}>Key Objects</p>
                {signals.slice(0,2).map(s => (
                  <EntityRow 
                    key={s.id} 
                    title={s.category} 
                    type="Signal" 
                    meta={s.relevance}
                    onClick={() => navigate("lab", "domain", s.domainId)} 
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "memory" && (
            <div>
              <p style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", textTransform: "uppercase", marginBottom: "12px" }}>Consequence Log & Recent Changes</p>
              <ConsequenceLog 
                events={[
                  { id: "e1", desc: "Canonized consensus failure hypothesis into active thread", time: "2m ago", type: "canon" },
                  { id: "e2", desc: "Mutated context of Raft experiment with new OSDI citation", time: "14m ago", type: "mutate" },
                  { id: "e3", desc: "Executed Code Lab simulation of partition latency", time: "1h ago", type: "view" },
                ]}
              />
            </div>
          )}

          {activeTab === "campaigns" && (
            <div>
              <EntityRow title="Research: Asymmetric Partition Recovery" type="Campaign" meta={<StateBadge state="Active" color="var(--r-ok)" />} />
              <EntityRow title="Audit: Event Store Latency Budgets" type="Campaign" meta={<StateBadge state="Pending" />} />
            </div>
          )}

          {activeTab === "artifacts" && (
            <div>
              <RelationshipList
                title="Recent Artifacts"
                items={[
                  { id: "a1", label: "Raft/Paxos Decision Matrix.md" },
                  { id: "a2", label: "CAP Theorem Explainer.pdf" },
                  { id: "a3", label: "Latency Test Simulation.js" },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}