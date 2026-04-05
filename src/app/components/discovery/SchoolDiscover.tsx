/**
 * RUBERRA School — Discovery Home
 * Premium infinite learning universe. Every element navigates somewhere real.
 */

import { motion } from "motion/react";
import {
  BookOpen,
  Map,
  Layers,
  GraduationCap,
  Briefcase,
  Globe,
  Cpu,
  TrendingUp,
  Code2,
  BarChart2,
  PenLine,
} from "lucide-react";
import { R } from "../tokens";
import { CollectionCard, CourseCard, RoleCard } from "../ContentCard";
import { DiscoveryRail, FeaturedHero } from "../DiscoveryRail";
import { type NavFn } from "../shell-types";
import { SCHOOL_TRACKS, SCHOOL_ROLES, getTrack } from "../product-data";

interface SchoolDiscoverProps {
  onEnterLesson: () => void;
  navigate:      NavFn;
}

// ─── Data (with trackId for routing) ─────────────────────────────────────────
const continueCourses = [
  {
    id: 1,
    trackId: "ai-engineering",
    title: "AI Systems Engineering",
    type: "Track",
    lessons: 9,
    duration: "5h 20m",
    level: "Expert",
    progress: 44,
    pattern: "grid" as const,
    preview: "Structured progression from LLM fundamentals through RAG, eval harnesses, and production serving posture.",
  },
  {
    id: 2,
    trackId: "distributed-arch",
    title: "Distributed Architecture",
    type: "Track",
    lessons: 8,
    duration: "4h 40m",
    level: "Advanced",
    progress: 25,
    pattern: "lines" as const,
    preview: "CAP → consensus → event sourcing with Lab experiments wired for verification blocks.",
  },
];

const recommendedCourses = [
  {
    id: 3,
    trackId: "security-crypto",
    title: "Security & Cryptography",
    type: "Track",
    lessons: 7,
    duration: "4h 10m",
    level: "Expert",
    pattern: "dots" as const,
    preview: "Applied crypto through ZK and TLS with Creation blueprints for hardened gateways.",
  },
  {
    id: 4,
    trackId: "data-science",
    title: "Data Science & ML",
    type: "Track",
    lessons: 10,
    duration: "6h 20m",
    level: "Advanced",
    pattern: "grid" as const,
    preview: "Mesh, streaming, and feature-store lessons tied to pipeline and agent outputs.",
  },
  {
    id: 5,
    trackId: "product-engineering",
    title: "Product Engineering",
    type: "Track",
    lessons: 7,
    duration: "3h 50m",
    level: "Advanced",
    pattern: "lines" as const,
    preview: "State machines, APIs, and interface systems — each lesson links Lab + Creation artifacts.",
  },
  {
    id: 6,
    trackId: "research-methods",
    title: "Research Methodology",
    type: "Track",
    lessons: 6,
    duration: "3h 30m",
    level: "Advanced",
    pattern: "dots" as const,
    preview: "Evidence hierarchies and analytical writing routed into deep-dive and exec-brief templates.",
  },
];

const deepStudyAreas = [
  {
    id: "d1",
    trackId: "distributed-arch",
    title: "CAP Theorem Revisited",
    type: "Deep Study",
    lessons: 3,
    duration: "1h 10m",
    level: "Expert",
    pattern: "dots" as const,
    preview: "PACELC framing with partition behavior you can defend in a School lesson + Lab verdict.",
  },
  {
    id: "d2",
    trackId: "distributed-arch",
    title: "Consensus Algorithms",
    type: "Deep Study",
    lessons: 4,
    duration: "2h",
    level: "Expert",
    pattern: "grid" as const,
    preview: "Raft/Paxos trade space mapped to event-driven Creation blueprints.",
  },
  {
    id: "d3",
    trackId: "ai-engineering",
    title: "LLM Evaluation Frameworks",
    type: "Visual Explainer",
    lessons: 2,
    duration: "40m",
    level: "Advanced",
    pattern: "lines" as const,
    preview: "Quality and safety gates that feed directly into agent orchestration steps.",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
import { useState } from "react";
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

export function SchoolDiscover({ onEnterLesson, navigate }: SchoolDiscoverProps) {
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

        <ChamberNavGroup title="Library">
          <EntityRow title="Tracks" type="Open" onClick={() => navigate("school", "browse")} />
          <EntityRow title="Roles" type="Open" onClick={() => navigate("school", "role", "ai-engineer")} />
          <EntityRow title="Deep Study" type="Open" onClick={() => navigate("school", "library")} />
        </ChamberNavGroup>

        <div style={{ marginTop: "32px" }}>
          <DirectiveStack
            directives={[
              { id: "1", text: "Mastery check required before advancing tracks", priority: "high" },
              { id: "2", text: "Link all new lessons to active Lab traces", priority: "normal" }
            ]}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <ContextBand chamber="school" pressure={0} state="Learning" />

          <div style={{ margin: "24px 0" }}>
            <EntityTitleBlock 
              title="School Domain: AI Systems Engineering" 
              type="Root Track" 
              status={<StateBadge state="Active" color="var(--chamber-school)" />} 
              accent="var(--chamber-school)"
            />
            <EntitySummaryBlock>
              This chamber currently holds 2 active learning threads in continuous progression. Evaluation infrastructure and distributed logic are the primary focal points.
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
              <p style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", textTransform: "uppercase", marginBottom: "12px" }}>Active Learning Threads</p>
              {continueCourses.map(c => (
                <div key={c.id} style={{ marginBottom: "8px" }}>
                  <EntityRow 
                    title={c.title} 
                    type={c.type} 
                    meta={<StateBadge state={`${c.progress}%`} color="var(--chamber-school)" />}
                    onClick={() => navigate("school", "track", c.trackId)} 
                  />
                </div>
              ))}

              <div style={{ marginTop: "32px" }}>
                <p style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", textTransform: "uppercase", marginBottom: "12px" }}>Key Study Objects</p>
                {deepStudyAreas.map(d => (
                  <EntityRow 
                    key={d.id} 
                    title={d.title} 
                    type="Study Object" 
                    meta={d.level}
                    onClick={() => navigate("school", "track", d.trackId)} 
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
                  { id: "e1", desc: "Completed Lesson: RAG Pipelines", time: "1h ago", type: "canon" },
                  { id: "e2", desc: "Opened new thread in AI Systems Engineering", time: "3h ago", type: "mutate" },
                  { id: "e3", desc: "Viewed Distributed Architecture outline", time: "Yesterday", type: "view" },
                ]}
              />
            </div>
          )}

          {activeTab === "campaigns" && (
            <div>
              <EntityRow title="Mastery: System Design Interviews" type="Campaign" meta={<StateBadge state="Active" color="var(--r-ok)" />} />
              <EntityRow title="Track: Applied Cryptography" type="Campaign" meta={<StateBadge state="Pending" />} />
            </div>
          )}

          {activeTab === "artifacts" && (
            <div>
              <RelationshipList
                title="Recent Artifacts"
                items={[
                  { id: "a1", label: "CAP Theorem Notes.md" },
                  { id: "a2", label: "System Design Mock.pdf" },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}