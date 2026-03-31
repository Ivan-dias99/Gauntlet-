/**
 * RUBERRA Creation — Blueprint Detail View
 */
import { type NavFn } from "../shell-types";
import { getBlueprint, getTrack, getDomain, getEngine } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, Tag, DetailPage, PrimaryAction, SecondaryAction, EmptyDetail } from "./DetailShared";

interface Props { blueprintId: string; navigate: NavFn; onStartChat: (p: string) => void; }

export function CreationBlueprintDetail({ blueprintId, navigate, onStartChat }: Props) {
  const bp = getBlueprint(blueprintId);
  if (!bp) return <EmptyDetail onBack={() => navigate("creation", "home")} label="Blueprint not found" />;

  return (
    <DetailPage>
      <Breadcrumb
        items={[
          { label: "Creation", tab: "creation", view: "home" },
          { label: bp.title.slice(0, 28) + (bp.title.length > 28 ? "…" : ""), tab: "creation", view: "blueprint", id: blueprintId },
        ]}
        onNavigate={navigate}
      />

      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--r-warn)", background: "color-mix(in srgb, var(--r-warn) 10%, var(--r-surface))", padding: "2px 6px", borderRadius: "3px" }}>
            Blueprint
          </span>
          <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{bp.category} · {bp.outputType}</span>
        </div>
        <h1 style={{ fontSize: "17px", fontWeight: 600, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {bp.title}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 12px", lineHeight: 1.65 }}>
          {bp.desc}
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {bp.tags.map(t => <Tag key={t} label={t} />)}
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <PrimaryAction
          label="Build with this blueprint"
          onClick={() => {
            navigate("creation", "terminal");
            onStartChat(`Use the "${bp.title}" blueprint. ${bp.desc}`);
          }}
        />
        <SecondaryAction label="Open in Chat" onClick={() => {
          navigate("creation", "chat");
          onStartChat(`I want to create a "${bp.title}". ${bp.desc} Guide me through this.`);
        }} />
      </div>

      {/* Build steps */}
      <div style={{ marginBottom: "28px" }}>
        <SectionHead label="Build steps" count={bp.steps.length} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {bp.steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "10px 14px",
                border: "1px solid var(--r-border)",
                borderBottom: i < bp.steps.length - 1 ? "none" : "1px solid var(--r-border)",
                borderRadius: i === 0 ? "6px 6px 0 0" : i === bp.steps.length - 1 ? "0 0 6px 6px" : "0",
                background: "var(--r-surface)",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--r-border)",
                  background: "var(--r-rail)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "9px",
                  fontFamily: "monospace",
                  color: "var(--r-subtext)",
                  marginTop: "1px",
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.55 }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Linked engines */}
      {bp.linkedEngines.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Recommended engines" count={bp.linkedEngines.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {bp.linkedEngines.map(eid => {
              const eng = getEngine(eid);
              if (!eng) return null;
              return (
                <button
                  key={eid}
                  onClick={() => navigate("creation", "engine", eid)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "10px 14px", border: "1px solid var(--r-border)", borderRadius: "6px", background: "var(--r-surface)", cursor: "pointer", outline: "none", textAlign: "left", transition: "background 0.1s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-surface)"; }}
                >
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 2px", letterSpacing: "-0.01em" }}>{eng.title}</p>
                    <p style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0 }}>{eng.desc}</p>
                  </div>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", flexShrink: 0 }}>{eng.templateCount} templates</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* School tracks */}
      {bp.linkedTracks.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Learn the prerequisites" count={bp.linkedTracks.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {bp.linkedTracks.map(tid => {
              const t = getTrack(tid);
              if (!t) return null;
              return (
                <XChamberLink key={tid} chamber="school" label="School · Track" title={t.title} subtitle={`${t.lessonCount} lessons · ${t.level}`} navigate={navigate} tab="school" view="track" id={tid} />
              );
            })}
          </div>
        </div>
      )}

      {/* Lab domains */}
      {bp.linkedDomains.length > 0 && (
        <div>
          <SectionHead label="Validate with Lab research" count={bp.linkedDomains.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {bp.linkedDomains.map(did => {
              const d = getDomain(did);
              if (!d) return null;
              return (
                <XChamberLink key={did} chamber="lab" label="Lab · Domain" title={d.label} subtitle={d.tagline.slice(0, 65)} navigate={navigate} tab="lab" view="domain" id={did} />
              );
            })}
          </div>
        </div>
      )}
    </DetailPage>
  );
}
