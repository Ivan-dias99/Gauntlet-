/**
 * RUBERRA Creation — Engine Detail View
 */
import { type NavFn } from "../shell-types";
import { getEngine, getBlueprint } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, DetailPage, PrimaryAction, SecondaryAction, EmptyDetail } from "./DetailShared";

interface Props { engineId: string; navigate: NavFn; onStartChat: (p: string) => void; }

export function CreationEngineDetail({ engineId, navigate, onStartChat }: Props) {
  const engine = getEngine(engineId);
  if (!engine) return <EmptyDetail onBack={() => navigate("creation", "home")} label="Engine not found" />;

  return (
    <DetailPage>
      <Breadcrumb
        items={[
          { label: "Creation", tab: "creation", view: "home" },
          { label: engine.title, tab: "creation", view: "engine", id: engineId },
        ]}
        onNavigate={navigate}
      />

      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--r-warn)", background: "color-mix(in srgb, var(--r-warn) 10%, var(--r-surface))", padding: "2px 6px", borderRadius: "2px" }}>
            Engine
          </span>
          <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{engine.templateCount} templates</span>
        </div>
        <h1 style={{ fontSize: "17px", fontWeight: 600, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {engine.title}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: 1.65 }}>
          {engine.desc}
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <PrimaryAction
          label="Open engine"
          onClick={() => {
            navigate("creation", "terminal");
          }}
        />
        <SecondaryAction label="Start in Chat" onClick={() => {
          navigate("creation", "chat");
          onStartChat(`I want to use the ${engine.title} to create something. ${engine.desc} Help me get started.`);
        }} />
      </div>

      {/* Compatible blueprints */}
      {engine.linkedBlueprints.length > 0 && (
        <div>
          <SectionHead label="Compatible blueprints" count={engine.linkedBlueprints.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {engine.linkedBlueprints.map(bid => {
              const bp = getBlueprint(bid);
              if (!bp) return null;
              return (
                <button
                  key={bid}
                  onClick={() => navigate("creation", "blueprint", bid)}
                  style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", cursor: "pointer", outline: "none", textAlign: "left", transition: "background 0.1s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-surface)"; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 3px", letterSpacing: "-0.01em" }}>{bp.title}</p>
                    <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{bp.desc}</p>
                  </div>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", flexShrink: 0, marginTop: "2px" }}>{bp.category}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </DetailPage>
  );
}
