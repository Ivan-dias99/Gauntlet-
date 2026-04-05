/**
 * RUBERRA School — Role / Career Path Detail View
 */
import { type NavFn } from "../shell-types";
import { getRole, getTrack, getDomain, getBlueprint } from "../product-data";
import { Breadcrumb, XChamberLink, SectionHead, PrimaryAction, SecondaryAction, EmptyDetail, ObjectDetailSurface } from "./DetailShared";

interface Props { roleId: string; navigate: NavFn; onStartChat: (p: string) => void; }

const DEMAND_COLOR: Record<string, string> = {
  Critical: "var(--r-err)",
  High:     "var(--r-warn)",
  Emerging: "var(--r-ok)",
};

export function SchoolRoleDetail({ roleId, navigate, onStartChat }: Props) {
  const role = getRole(roleId);
  if (!role) return <EmptyDetail onBack={() => navigate("school", "home")} label="Role not found" />;

  return (
    <ObjectDetailSurface
      identity={{ title: role.title, type: "School Career Role", id: roleId }}
      state={{ status: `${role.demand} demand`, canon: "active", statusColor: DEMAND_COLOR[role.demand] }}
      missionBinding={{ chamber: "School", text: role.desc }}
      directiveRelevance={[
        { id: "d1", text: "Master this role to unlock corresponding creation permissions.", priority: "normal" },
      ]}
      aiReasoning={`Career Path Profile: Requires mastering ${role.requiredTracks.length} tracks to qualify for high-level operations in ${role.domain}.`}
      consequenceTrace={[]}
      meshRelations={
        role.skills.map(s => ({ id: s, label: "Required Skill" }))
      }
    >
      <Breadcrumb
        items={[
          { label: "School", tab: "school", view: "home" },
          { label: "Roles", tab: "school", view: "browse" },
          { label: role.title, tab: "school", view: "role", id: roleId },
        ]}
        onNavigate={navigate}
      />

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        <PrimaryAction
          label="Build this career path"
          onClick={() => {
            navigate("school", "chat");
            onStartChat(`I want to build toward the role of ${role.title}. My focus domain is ${role.domain}. Create a personalized learning roadmap with milestones.`);
          }}
        />
        <SecondaryAction label="Browse all roles" onClick={() => navigate("school", "browse")} />
      </div>

      {/* Required tracks */}
      <div style={{ marginBottom: "24px" }}>
        <SectionHead label="Required learning tracks" count={role.requiredTracks.length} />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {role.requiredTracks.map(tid => {
            const t = getTrack(tid);
            if (!t) return null;
            const done = t.lessons.filter(l => l.status === "done").length;
            const pct  = Math.round((done / t.lessons.length) * 100);
            return (
              <button
                key={tid}
                onClick={() => navigate("school", "track", tid)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", cursor: "pointer", outline: "none", textAlign: "left", transition: "background 0.1s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-surface)"; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                    <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-ok)", flexShrink: 0 }}>{pct}%</span>
                  </div>
                  <div style={{ height: "2px", background: "var(--r-border)", borderRadius: "1px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--r-ok)", borderRadius: "1px" }} />
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", display: "block", marginTop: "4px" }}>
                    {t.lessonCount} lessons · {t.duration} · {t.level}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab domains */}
      {role.linkedDomains.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <SectionHead label="Practice in Lab" count={role.linkedDomains.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {role.linkedDomains.map(did => {
              const d = getDomain(did);
              if (!d) return null;
              return (
                <XChamberLink key={did} chamber="lab" label="Lab · Domain" title={d.label} subtitle={d.tagline.slice(0, 60)} navigate={navigate} tab="lab" view="domain" id={did} />
              );
            })}
          </div>
        </div>
      )}

      {/* Creation blueprints */}
      {role.linkedBlueprints.length > 0 && (
        <div>
          <SectionHead label="Build artifacts for this role" count={role.linkedBlueprints.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {role.linkedBlueprints.map(bid => {
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
