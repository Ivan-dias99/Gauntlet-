/**
 * RUBERRA School — Lesson Detail View
 */
import { type NavFn } from "../shell-types";
import { getLesson, getExperiment, getBlueprint } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, PrimaryAction, SecondaryAction, EmptyDetail, ObjectDetailSurface } from "./DetailShared";

interface Props { lessonId: string; navigate: NavFn; onStartChat: (p: string) => void; }

export function SchoolLessonDetail({ lessonId, navigate, onStartChat }: Props) {
  const result = getLesson(lessonId);
  if (!result) return <EmptyDetail onBack={() => navigate("school", "home")} label="Lesson not found" />;
  const { lesson, track } = result;

  const nextLesson = track.lessons[track.lessons.findIndex(l => l.id === lessonId) + 1];

  return (
    <ObjectDetailSurface
      identity={{ title: lesson.title, type: "School Lesson", id: lessonId }}
      state={{ 
        status: lesson.status.replace("-", " "), 
        canon: lesson.status === "done" ? "canonical" : "draft", 
        statusColor: lesson.status === "done" ? "var(--r-ok)" : lesson.status === "in-progress" ? "var(--r-accent)" : "var(--r-dim)" 
      }}
      missionBinding={{ chamber: "School", text: `Duration: ${lesson.duration} · Track: ${track.title}` }}
      directiveRelevance={[
        { id: "d1", text: "Ensure full conceptual mastery before practical transfer.", priority: "normal" },
      ]}
      aiReasoning={`Lesson Profile: Part of the ${track.title} track. Recommended study duration: ${lesson.duration}.`}
      consequenceTrace={[]}
      meshRelations={[
        { id: track.id, label: "Parent Track" },
        ...lesson.linkedExperiments.map(eid => ({ id: eid, label: "Practical Lab" })),
        ...lesson.linkedBlueprints.map(bid => ({ id: bid, label: "Practical Build" }))
      ]}
    >
      <Breadcrumb
        items={[
          { label: "School", tab: "school", view: "home" },
          { label: track.title, tab: "school", view: "track", id: track.id },
          { label: lesson.title.slice(0, 28) + (lesson.title.length > 28 ? "…" : ""), tab: "school", view: "lesson", id: lessonId },
        ]}
        onNavigate={navigate}
      />

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <PrimaryAction
          label={lesson.status === "in-progress" ? "Continue lesson" : "Start lesson"}
          onClick={() => {
            navigate("school", "chat");
            onStartChat(`I want to study: "${lesson.title}" from the ${track.title} track. Please teach me this topic systematically from first principles.`);
          }}
        />
        <SecondaryAction label="View curriculum" onClick={() => navigate("school", "track", track.id)} />
      </div>

      {/* Next lesson */}
      {nextLesson && (
        <div style={{ marginBottom: "24px" }}>
          <SectionHead label="Next in track" />
          <button
            onClick={() => nextLesson.status !== "locked" && navigate("school", "lesson", nextLesson.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", cursor: nextLesson.status === "locked" ? "default" : "pointer", outline: "none", textAlign: "left", opacity: nextLesson.status === "locked" ? 0.5 : 1 }}
          >
            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>{nextLesson.title}</span>
            <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{nextLesson.duration}</span>
          </button>
        </div>
      )}

      {/* Lab links */}
      {lesson.linkedExperiments.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Practice in Lab" count={lesson.linkedExperiments.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {lesson.linkedExperiments.map(eid => {
              const exp = getExperiment(eid);
              if (!exp) return null;
              return (
                <XChamberLink key={eid} chamber="lab" label="Lab · Experiment" title={exp.title} subtitle={exp.desc.slice(0, 70)} navigate={navigate} tab="lab" view="experiment" id={eid} />
              );
            })}
          </div>
        </div>
      )}

      {/* Creation links */}
      {lesson.linkedBlueprints.length > 0 && (
        <div>
          <SectionHead label="Build with this knowledge" count={lesson.linkedBlueprints.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {lesson.linkedBlueprints.map(bid => {
              const bp = getBlueprint(bid);
              if (!bp) return null;
              return (
                <XChamberLink key={bid} chamber="creation" label="Creation · Blueprint" title={bp.title} subtitle={bp.category} navigate={navigate} tab="creation" view="blueprint" id={bid} />
              );
            })}
          </div>
        </div>
      )}
    </ObjectDetailSurface>
  );
}
