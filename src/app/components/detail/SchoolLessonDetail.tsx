/**
 * RUBERRA School — Lesson Detail View
 */
import { type NavFn } from "../shell-types";
import { getLesson, getExperiment, getBlueprint } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, DetailPage, PrimaryAction, SecondaryAction, EmptyDetail } from "./DetailShared";

interface Props { lessonId: string; navigate: NavFn; onStartChat: (p: string) => void; }

export function SchoolLessonDetail({ lessonId, navigate, onStartChat }: Props) {
  const result = getLesson(lessonId);
  if (!result) return <EmptyDetail onBack={() => navigate("school", "home")} label="Lesson not found" />;
  const { lesson, track } = result;

  const nextLesson = track.lessons[track.lessons.findIndex(l => l.id === lessonId) + 1];

  return (
    <DetailPage>
      <Breadcrumb
        items={[
          { label: "School", tab: "school", view: "home" },
          { label: track.title, tab: "school", view: "track", id: track.id },
          { label: lesson.title.slice(0, 28) + (lesson.title.length > 28 ? "…" : ""), tab: "school", view: "lesson", id: lessonId },
        ]}
        onNavigate={navigate}
      />

      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--r-ok)", background: "color-mix(in srgb, var(--r-ok) 10%, var(--r-surface))", padding: "2px 6px", borderRadius: "2px" }}>
            Lesson · {track.title}
          </span>
          <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{lesson.duration}</span>
        </div>
        <h1 style={{ fontSize: "17px", fontWeight: 600, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {lesson.title}
        </h1>
        <p style={{ fontSize: "12px", color: "var(--r-dim)", fontFamily: "monospace", margin: 0 }}>
          Status: <span style={{ color: lesson.status === "done" ? "var(--r-ok)" : lesson.status === "in-progress" ? "var(--r-accent)" : "var(--r-subtext)" }}>
            {lesson.status.replace("-", " ")}
          </span>
        </p>
      </div>

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
    </DetailPage>
  );
}
