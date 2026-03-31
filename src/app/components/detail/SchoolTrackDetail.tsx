/**
 * RUBERRA School — Track / Curriculum Detail View
 */
import { type NavFn } from "../shell-types";
import { getTrack, getDomain, getBlueprint } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, Tag, DetailPage, PrimaryAction, SecondaryAction } from "./DetailShared";

interface Props {
  trackId:     string;
  navigate:    NavFn;
  onStartChat: (prompt: string) => void;
}

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  done:        { color: "var(--r-ok)",     label: "Done"        },
  "in-progress":{ color: "var(--r-accent)", label: "In Progress" },
  available:   { color: "var(--r-subtext)",label: "Available"   },
  locked:      { color: "var(--r-dim)",    label: "Locked"      },
};

export function SchoolTrackDetail({ trackId, navigate, onStartChat }: Props) {
  const track = getTrack(trackId);
  if (!track) return null;

  const doneCount = track.lessons.filter(l => l.status === "done").length;
  const progressPct = Math.round((doneCount / track.lessons.length) * 100);

  return (
    <DetailPage>
      <Breadcrumb
        items={[
          { label: "School", tab: "school", view: "home" },
          { label: track.title, tab: "school", view: "track", id: trackId },
        ]}
        onNavigate={navigate}
      />

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--r-ok)", background: "color-mix(in srgb, var(--r-ok) 10%, var(--r-surface))", padding: "2px 6px", borderRadius: "3px" }}>
            Track
          </span>
          <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{track.level}</span>
        </div>
        <h1 style={{ fontSize: "17px", fontWeight: 600, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {track.title}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 14px", lineHeight: 1.65 }}>
          {track.tagline}
        </p>
        {/* Progress bar */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{doneCount} / {track.lessons.length} lessons</span>
            <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-ok)" }}>{progressPct}%</span>
          </div>
          <div style={{ height: "2px", background: "var(--r-border)", borderRadius: "1px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--r-ok)", borderRadius: "1px", transition: "width 0.6s ease" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif" }}>{track.lessonCount} lessons</span>
          <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif" }}>{track.duration}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <PrimaryAction
          label={track.lessons.find(l => l.status === "in-progress") ? "Continue track" : "Start track"}
          onClick={() => {
            navigate("school", "chat");
            onStartChat(`I want to study the track "${track.title}". ${track.tagline} Please start with the key concepts and structure a learning plan.`);
          }}
        />
        <SecondaryAction label="Open Library" onClick={() => navigate("school", "library")} />
      </div>

      {/* Curriculum / Lessons */}
      <div style={{ marginBottom: "28px" }}>
        <SectionHead label="Curriculum" count={track.lessons.length} />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "15px", top: "8px", bottom: "8px", width: "1px", background: "var(--r-border-soft)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {track.lessons.map((lesson, i) => {
              const s = STATUS_STYLE[lesson.status];
              const isLocked = lesson.status === "locked";
              return (
                <button
                  key={lesson.id}
                  onClick={() => !isLocked && navigate("school", "lesson", lesson.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px 10px 36px",
                    border: "1px solid var(--r-border)",
                    borderRadius: "6px",
                    background: lesson.status === "in-progress" ? "color-mix(in srgb, var(--r-ok) 4%, var(--r-surface))" : "var(--r-surface)",
                    cursor: isLocked ? "default" : "pointer",
                    outline: "none",
                    textAlign: "left",
                    opacity: isLocked ? 0.55 : 1,
                    transition: "background 0.1s ease",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (!isLocked) (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
                  onMouseLeave={e => { if (!isLocked) (e.currentTarget as HTMLElement).style.background = lesson.status === "in-progress" ? "color-mix(in srgb, var(--r-ok) 4%, var(--r-surface))" : "var(--r-surface)"; }}
                >
                  {/* Status dot */}
                  <span
                    style={{
                      position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: lesson.status === "done" ? s.color : "var(--r-surface)",
                      border: `2px solid ${s.color}`,
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {lesson.status === "done" && (
                      <svg width="5" height="5" viewBox="0 0 6 6" fill="none">
                        <path d="M1 3l1.5 1.5 2.5-3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: lesson.status === "in-progress" ? 500 : 400, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lesson.title}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "monospace" }}>{lesson.duration}</span>
                    {lesson.status === "in-progress" && (
                      <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-ok)", letterSpacing: "0.06em" }}>CURRENT</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cross-chamber: Lab */}
      {track.linkedDomains.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Related Lab domains" count={track.linkedDomains.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {track.linkedDomains.map(did => {
              const d = getDomain(did);
              if (!d) return null;
              return (
                <XChamberLink
                  key={did}
                  chamber="lab"
                  label="Lab · Domain"
                  title={d.label}
                  subtitle={d.tagline.slice(0, 70)}
                  navigate={navigate}
                  tab="lab"
                  view="domain"
                  id={did}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Cross-chamber: Creation */}
      {track.linkedBlueprints.length > 0 && (
        <div>
          <SectionHead label="Related Creation blueprints" count={track.linkedBlueprints.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {track.linkedBlueprints.map(bid => {
              const bp = getBlueprint(bid);
              if (!bp) return null;
              return (
                <XChamberLink
                  key={bid}
                  chamber="creation"
                  label="Creation · Blueprint"
                  title={bp.title}
                  subtitle={bp.category + " · " + bp.outputType}
                  navigate={navigate}
                  tab="creation"
                  view="blueprint"
                  id={bid}
                />
              );
            })}
          </div>
        </div>
      )}
    </DetailPage>
  );
}
