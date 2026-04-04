/**
 * RUBERRA Lab — Domain Detail View
 * Every element leads somewhere real.
 */
import { type NavFn } from "../shell-types";
import { getDomain } from "../product-data";
import { getTrack } from "../product-data";
import { getBlueprint } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, Tag, DetailPage, PrimaryAction, SecondaryAction, EmptyDetail } from "./DetailShared";

interface Props {
  domainId: string;
  navigate: NavFn;
  onStartChat: (prompt: string) => void;
}

const COMPLEXITY_COLOR = { Low: "var(--r-ok)", Medium: "var(--r-warn)", High: "var(--r-err)" } as const;

export function LabDomainDetail({ domainId, navigate, onStartChat }: Props) {
  const domain = getDomain(domainId);
  if (!domain) return <EmptyDetail onBack={() => navigate("lab", "home")} label="Domain not found" />;

  return (
    <DetailPage>
      <Breadcrumb
        items={[
          { label: "Lab", tab: "lab", view: "home" },
          { label: domain.label, tab: "lab", view: "domain", id: domainId },
        ]}
        onNavigate={navigate}
      />

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "10px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--r-accent)", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-accent)" }}>
                Research Domain
              </span>
            </div>
            <h1 style={{ fontSize: "18px", fontWeight: 600, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: "8px" }}>
              {domain.label}
            </h1>
            <p style={{ fontSize: "13px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: 1.6 }}>
              {domain.tagline}
            </p>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <span style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: 500, color: "var(--r-text)", display: "block", lineHeight: 1.1 }}>
              {domain.researchCount}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)", letterSpacing: "0.08em" }}>research items</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          {domain.experiments.map(e => (
            <Tag key={e.id} label={e.type} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <PrimaryAction
          label="Start investigation"
          onClick={() => {
            navigate("lab", "chat");
            onStartChat(`Let's investigate ${domain.label}. Provide a structured overview of the key concepts, current state of research, and the most important open questions.`);
          }}
        />
        <SecondaryAction
          label="Open Analysis"
          onClick={() => navigate("lab", "analysis")}
        />
        <SecondaryAction
          label="Code surface"
          onClick={() => navigate("lab", "code")}
        />
      </div>

      {/* Experiments */}
      <div style={{ marginBottom: "28px" }}>
        <SectionHead label="Experiments in this domain" count={domain.experiments.length} />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {domain.experiments.map(exp => (
            <button
              key={exp.id}
              onClick={() => navigate("lab", "experiment", exp.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                border: "1px solid var(--r-border)",
                borderRadius: "2px",
                background: "var(--r-surface)",
                cursor: "pointer",
                outline: "none",
                textAlign: "left",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-surface)"; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {exp.title}
                  </span>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: COMPLEXITY_COLOR[exp.complexity], flexShrink: 0 }}>
                    {exp.complexity}
                  </span>
                </div>
                <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {exp.desc}
                </p>
              </div>
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {exp.tools.slice(0, 2).map(t => (
                  <span key={t} style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", background: "var(--r-rail)", border: "1px solid var(--r-border)", padding: "2px 5px", borderRadius: "2px" }}>
                    {t}
                  </span>
                ))}
              </div>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M1 5h8M5 1l4 4-4 4" stroke="var(--r-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Cross-chamber: School */}
      {domain.linkedTracks.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Related School tracks" count={domain.linkedTracks.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {domain.linkedTracks.map(tid => {
              const track = getTrack(tid);
              if (!track) return null;
              return (
                <XChamberLink
                  key={tid}
                  chamber="school"
                  label="School · Track"
                  title={track.title}
                  subtitle={`${track.lessonCount} lessons · ${track.duration} · ${track.level}`}
                  navigate={navigate}
                  tab="school"
                  view="track"
                  id={tid}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Cross-chamber: Creation */}
      {domain.linkedBlueprints.length > 0 && (
        <div>
          <SectionHead label="Related Creation blueprints" count={domain.linkedBlueprints.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {domain.linkedBlueprints.map(bid => {
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
