/**
 * RUBERRA Lab — Discovery Home
 * Premium intelligence laboratory. Every element navigates somewhere real.
 */

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
export function LabDiscover({ onStartSession, navigate }: LabDiscoverProps) {
  const toolEcosystem = [
    {
      id: "t1",
      title: "Research Engine",
      subtitle: "Search, synthesize, cross-reference",
      itemCount: 8,
      invite: "Chamber chat with routing trace — start a live investigation thread.",
      icon: <Search size={14} color={R.lab} strokeWidth={1.5} />,
      onClick: () => { navigate("lab", "chat"); onStartSession(); },
    },
    {
      id: "t2",
      title: "Code Lab",
      subtitle: "Write, run, debug in isolation",
      itemCount: 12,
      invite: "Terminal-native surface with execution consequence strip.",
      icon: <Code2 size={14} color={R.lab} strokeWidth={1.5} />,
      onClick: () => navigate("lab", "code"),
    },
    {
      id: "t3",
      title: "Analysis Suite",
      subtitle: "Evidence, patterns, insights",
      itemCount: 6,
      invite: "Structured board for verdict blocks and metamorphic output.",
      icon: <BarChart2 size={14} color={R.lab} strokeWidth={1.5} />,
      onClick: () => navigate("lab", "analysis"),
    },
    {
      id: "t4",
      title: "Audit Framework",
      subtitle: "Verify, review, source-check",
      itemCount: 5,
      invite: "Archive of runs, objects, and continuity-linked memory.",
      icon: <FileSearch size={14} color={R.lab} strokeWidth={1.5} />,
      onClick: () => navigate("lab", "archive"),
    },
    {
      id: "t5",
      title: "Data Connectors",
      subtitle: "DB, APIs, live feeds",
      itemCount: 9,
      invite: "Domain detail with experiments wired to School and Creation.",
      icon: <Database size={14} color={R.lab} strokeWidth={1.5} />,
      onClick: () => navigate("lab", "domain", "data-arch"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        flex: 1,
        overflowY: "auto",
        paddingTop: "24px",
        paddingBottom: "40px",
        background: "var(--r-bg)",
        backgroundImage: `radial-gradient(var(--r-border-soft) 0.8px, transparent 0.8px)`,
        backgroundSize: "24px 24px",
        scrollbarWidth: "none",
      }}
    >
      {/* Hero — Active Investigation */}
      <FeaturedHero
        label="ACTIVE INVESTIGATION"
        badge="Open"
        title="Distributed Consensus Failure Modes"
        description="Analyzing failure taxonomy in Raft and Paxos under asymmetric partitions. Current context: 3 sources loaded, 2 hypotheses pending verification."
        meta="Research · Distributed Systems · Started 2h ago · 14 context items"
        accent="var(--chamber-lab)"
        accent={R.lab}
        accentLight="var(--chamber-lab-light)"
        ctaLabel="Continue investigation"
        onCta={() => navigate("lab", "experiment", "exp-raft")}
        secondaryLabel="New session"
        onSecondary={onStartSession}
        stats={[
          { label: "Open sessions", value: "3" },
          { label: "Artifacts", value: "12" },
          { label: "Findings", value: "7" },
        ]}
      />

      {/* Active experiments */}
      <DiscoveryRail
        label="Active Investigations"
        sublabel="Your open sessions"
        action={{ label: "View archive", onClick: () => navigate("lab", "archive") }}
      >
        {activeExperiments.map((e) => (
          <ExperimentCard
            key={e.id}
            title={e.title}
            type={e.type}
            domain={e.domain}
            tools={e.tools}
            complexity={e.complexity}
            pattern={e.pattern}
            preview={e.preview}
            onClick={() => navigate("lab", "experiment", e.navId)}
          />
        ))}
      </DiscoveryRail>

      {/* Signals rail */}
      <DiscoveryRail
        label="Signals"
        sublabel="High-relevance findings from active research areas"
        action={{ label: "Start Analysis", onClick: () => navigate("lab", "analysis") }}
        gap={10}
      >
        {signals.map((s) => (
          <SignalCard
            key={s.id}
            signal={s.signal}
            source={s.source}
            category={s.category}
            recency={s.recency}
            relevance={s.relevance}
            onClick={() => navigate("lab", "domain", s.domainId)}
          />
        ))}
      </DiscoveryRail>

      {/* Experiment templates */}
      <DiscoveryRail
        label="Experiment Templates"
        sublabel="Structured investigation frameworks"
        action={{ label: "Browse all", onClick: () => navigate("lab", "archive") }}
      >
        {experimentTemplates.map((e) => (
          <ExperimentCard
            key={e.id}
            title={e.title}
            type={e.type}
            domain={e.domain}
            tools={e.tools}
            complexity={e.complexity}
            pattern={e.pattern}
            preview={e.preview}
            onClick={() => navigate("lab", "experiment", e.navId)}
          />
        ))}
      </DiscoveryRail>

      {/* Tool ecosystem */}
      <DiscoveryRail
        label="Tool Ecosystem"
        sublabel="Lab-native investigation surfaces"
        action={{ label: "Code surface", onClick: () => navigate("lab", "code") }}
        gap={10}
      >
        {toolEcosystem.map((t) => (
          <CollectionCard
            key={t.id}
            title={t.title}
            subtitle={t.subtitle}
            itemCount={t.itemCount}
            accent="var(--chamber-lab)"
            accent={R.lab}
            accentLight="var(--chamber-lab-light)"
            tag="Tool"
            icon={t.icon}
            invite={t.invite}
            onClick={t.onClick}
          />
        ))}
      </DiscoveryRail>

      {/* Research areas — each navigates to domain detail */}
      <DiscoveryRail
        label="Research Domains"
        sublabel="Domain knowledge clusters — click to explore"
        action={{ label: "All domains", onClick: () => navigate("lab", "archive") }}
        gap={10}
      >
        {LAB_DOMAINS.map((d) => (
          <CollectionCard
            key={d.id}
            title={d.label}
            subtitle={d.tagline.length > 60 ? `${d.tagline.slice(0, 57)}…` : d.tagline}
            itemCount={d.researchCount}
            accent="var(--chamber-lab)"
            accent={R.lab}
            accentLight="var(--chamber-lab-light)"
            tag="Domain"
            icon={<Layers size={14} color={R.lab} strokeWidth={1.5} />}
            invite={`${d.experiments.length} seeded experiments · open domain board`}
            onClick={() => navigate("lab", "domain", d.id)}
          />
        ))}
      </DiscoveryRail>
    </motion.div>
  );
}