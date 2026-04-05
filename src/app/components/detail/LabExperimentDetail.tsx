/**
 * RUBERRA Lab — Experiment Detail View
 */
import { type NavFn } from "../shell-types";
import { getExperiment, getDomain, getLesson, getBlueprint } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, Tag, PrimaryAction, SecondaryAction, EmptyDetail, ObjectDetailSurface } from "./DetailShared";

interface Props {
  experimentId: string;
  navigate:     NavFn;
  onStartChat:  (prompt: string) => void;
}

const COMPLEXITY_COLOR = { Low: "var(--r-ok)", Medium: "var(--r-warn)", High: "var(--r-err)" } as const;

export function LabExperimentDetail({ experimentId, navigate, onStartChat }: Props) {
  const exp = getExperiment(experimentId);
  if (!exp) return <EmptyDetail onBack={() => navigate("lab", "home")} label="Experiment not found" />;
  const domain = getDomain(exp.domainId);

  return (
    <ObjectDetailSurface
      identity={{ title: exp.title, type: exp.type, id: experimentId }}
      state={{ status: "Active", canon: "active", statusColor: COMPLEXITY_COLOR[exp.complexity] }}
      missionBinding={{ chamber: "Lab", text: exp.desc }}
      directiveRelevance={[
        { id: "d1", text: "Validate hypothesis before creation phase", priority: "high" }
      ]}
      consequenceTrace={[
        { id: "c1", desc: "Experiment initialized", time: "2h ago", type: "mutate" }
      ]}
      meshRelations={[
        { id: "m1", label: "Lab Domain: " + (domain?.label || exp.domainId) }
      ]}
    >
      <Breadcrumb
        items={[
          { label: "Lab",            tab: "lab", view: "home" },
          { label: domain?.label ?? exp.domainId, tab: "lab", view: "domain", id: exp.domainId },
          { label: exp.title.slice(0, 30) + (exp.title.length > 30 ? "…" : ""), tab: "lab", view: "experiment", id: experimentId },
        ]}
        onNavigate={navigate}
      />

      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {exp.tools.map(t => <Tag key={t} label={t} />)}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <PrimaryAction
          label="Run this experiment"
          onClick={() => {
            navigate("lab", "chat");
            onStartChat(`I want to run an experiment on: ${exp.title}. Here's the context: ${exp.desc}. Please help me structure this investigation.`);
          }}
        />
        <SecondaryAction label="Open in Analysis" onClick={() => navigate("lab", "analysis")} />
        <SecondaryAction label="Open in Code" onClick={() => navigate("lab", "code")} />
      </div>

      {/* Related school lessons */}
      {exp.linkedLessons.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Prerequisite School lessons" count={exp.linkedLessons.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {exp.linkedLessons.map(lid => {
              const result = getLesson(lid);
              if (!result) return null;
              return (
                <XChamberLink
                  key={lid}
                  chamber="school"
                  label={`School · ${result.track.title}`}
                  title={result.lesson.title}
                  subtitle={result.lesson.duration + " · " + result.lesson.status}
                  navigate={navigate}
                  tab="school"
                  view="lesson"
                  id={lid}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Related creation blueprints */}
      {exp.linkedBlueprints.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Related Creation blueprints" count={exp.linkedBlueprints.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {exp.linkedBlueprints.map(bid => {
              const bp = getBlueprint(bid);
              if (!bp) return null;
              return (
                <XChamberLink
                  key={bid}
                  chamber="creation"
                  label="Creation · Blueprint"
                  title={bp.title}
                  subtitle={bp.category}
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

      {/* Other experiments in domain */}
      {domain && domain.experiments.filter(e => e.id !== experimentId).length > 0 && (
        <div>
          <SectionHead label="Other experiments in this domain" />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {domain.experiments.filter(e => e.id !== experimentId).map(e => (
              <button
                key={e.id}
                onClick={() => navigate("lab", "experiment", e.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "10px 14px", border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", cursor: "pointer", outline: "none", textAlign: "left", transition: "background 0.1s ease" }}
                onMouseEnter={e2 => { (e2.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
                onMouseLeave={e2 => { (e2.currentTarget as HTMLElement).style.background = "var(--r-surface)"; }}
              >
                <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.title}
                </span>
                <span style={{ fontSize: "8px", fontFamily: "monospace", color: COMPLEXITY_COLOR[e.complexity], flexShrink: 0 }}>{e.complexity}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </ObjectDetailSurface>
  );
}
