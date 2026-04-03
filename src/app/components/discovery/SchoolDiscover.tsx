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
export function SchoolDiscover({ onEnterLesson, navigate }: SchoolDiscoverProps) {
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
        backgroundImage: `
          linear-gradient(var(--r-border-soft) 1px, transparent 1px),
          linear-gradient(90deg, var(--r-border-soft) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        scrollbarWidth: "none",
      }}
    >
      {/* Hero — Continue Learning */}
      <FeaturedHero
        label="CONTINUE LEARNING"
        badge="In Progress"
        title="AI Systems Engineering"
        description="Lesson 3 of 9 — Evaluation Frameworks for LLMs. Learn how to build principled evaluation infrastructure for language model quality and safety."
        meta="AI Systems Engineering · Lesson 3 · 44% complete"
        accent="var(--chamber-school)"
        accentLight="var(--chamber-school-light)"
        ctaLabel="Resume lesson"
        onCta={() => navigate("school", "lesson", "lesson-evals")}
        secondaryLabel="View curriculum"
        onSecondary={() => navigate("school", "track", "ai-engineering")}
        stats={[
          { label: "Lessons done", value: "2" },
          { label: "Tracks active", value: "2" },
          { label: "Progress", value: "44%" },
        ]}
      />

      {/* Continue Learning — real tracks */}
      <DiscoveryRail
        label="Continue Learning"
        sublabel="Pick up where you left off"
        action={{ label: "All tracks", onClick: () => navigate("school", "browse") }}
      >
        {continueCourses.map((c) => (
          <CourseCard
            key={c.id}
            title={c.title}
            type={c.type}
            lessons={c.lessons}
            duration={c.duration}
            level={c.level}
            progress={c.progress}
            pattern={c.pattern}
            preview={c.preview ?? getTrack(c.trackId)?.tagline}
            onClick={() => navigate("school", "track", c.trackId)}
          />
        ))}
      </DiscoveryRail>

      {/* Recommended */}
      <DiscoveryRail
        label="Recommended for You"
        sublabel="Based on your learning path"
        action={{ label: "See all", onClick: () => navigate("school", "browse") }}
      >
        {recommendedCourses.map((c) => (
          <CourseCard
            key={c.id}
            title={c.title}
            type={c.type}
            lessons={c.lessons}
            duration={c.duration}
            level={c.level}
            pattern={c.pattern}
            preview={c.preview ?? getTrack(c.trackId)?.tagline}
            onClick={() => navigate("school", "track", c.trackId)}
          />
        ))}
      </DiscoveryRail>

      {/* Collections/Tracks — all SCHOOL_TRACKS */}
      <DiscoveryRail
        label="Learning Tracks"
        sublabel="Curated progression paths"
        action={{ label: "Browse all tracks", onClick: () => navigate("school", "browse") }}
        gap={10}
      >
        {SCHOOL_TRACKS.map((t) => (
          <CollectionCard
            key={t.id}
            title={t.title}
            subtitle={t.tagline.length > 55 ? `${t.tagline.slice(0, 52)}…` : t.tagline}
            itemCount={t.lessonCount}
            accent="var(--chamber-school)"
            accentLight="var(--chamber-school-light)"
            tag="Track"
            icon={<Layers size={14} color={R.school} strokeWidth={1.5} />}
            invite={t.lessons[0] ? `Starts · ${t.lessons[0].title}` : undefined}
            onClick={() => navigate("school", "track", t.id)}
          />
        ))}
      </DiscoveryRail>

      {/* Future Roles — all SCHOOL_ROLES */}
      <DiscoveryRail
        label="Future Role Tracks"
        sublabel="AI-era careers and pathways"
        action={{ label: "Explore all roles", onClick: () => navigate("school", "browse") }}
      >
        {SCHOOL_ROLES.map((r) => (
          <RoleCard
            key={r.id}
            role={r.title}
            domain={r.domain}
            skills={r.skills}
            demand={r.demand}
            preview={r.desc.length > 120 ? `${r.desc.slice(0, 117)}…` : r.desc}
            onClick={() => navigate("school", "role", r.id)}
          />
        ))}
      </DiscoveryRail>

      {/* Deep Study */}
      <DiscoveryRail
        label="Deep Study"
        sublabel="Expert-grade deep dives"
        action={{ label: "View library", onClick: () => navigate("school", "library") }}
      >
        {deepStudyAreas.map((c) => (
          <CourseCard
            key={c.id}
            title={c.title}
            type={c.type}
            lessons={c.lessons}
            duration={c.duration}
            level={c.level}
            pattern={c.pattern}
            preview={c.preview}
            onClick={() => navigate("school", "track", c.trackId)}
          />
        ))}
      </DiscoveryRail>
    </motion.div>
  );
}