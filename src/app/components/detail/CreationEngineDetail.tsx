/**
 * RUBERRA Creation — Engine Detail View
 */
import { type NavFn } from "../shell-types";
import { getEngine, getBlueprint } from "../product-data";
import { Breadcrumb, SectionHead, PrimaryAction, SecondaryAction, EmptyDetail, ObjectDetailSurface } from "./DetailShared";

interface Props { engineId: string; navigate: NavFn; onStartChat: (p: string) => void; }

export function CreationEngineDetail({ engineId, navigate, onStartChat }: Props) {
  const engine = getEngine(engineId);
  if (!engine) return <EmptyDetail onBack={() => navigate("creation", "home")} label="Engine not found" />;

  return (
    <ObjectDetailSurface
      identity={{ title: engine.title, type: "Creation Engine", id: engineId }}
      state={{ status: `${engine.templateCount} Templates`, canon: "active", statusColor: "var(--r-warn)" }}
      missionBinding={{ chamber: "Creation", text: engine.desc }}
      directiveRelevance={[
        { id: "d1", text: "Enforce strict interface stability when compiling with this engine", priority: "high" },
      ]}
      aiReasoning={`Engine Profile: Contains ${engine.templateCount} structural execution templates.`}
      consequenceTrace={[]}
      meshRelations={
        engine.linkedBlueprints.map(bid => ({ id: bid, label: "Compatible Blueprint" }))
      }
    >
      <Breadcrumb
        items={[
          { label: "Creation", tab: "creation", view: "home" },
          { label: engine.title, tab: "creation", view: "engine", id: engineId },
        ]}
        onNavigate={navigate}
      />

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
    </ObjectDetailSurface>
  );
}
