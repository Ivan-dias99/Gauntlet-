// Wave P-43 — operator profile (real).
//
// Identity card · stats · recent missions. Display name lives in
// localStorage (single-tenant client side); avatar is the monogram of
// the initials. Stats and recent missions are derived live from the
// SpineContext: missions, artifacts (sealed runs), principles
// (operator-authored doctrine), runs in the last 7 days.

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { ACCENT_SWATCHES, useTweaks, type AccentKey } from "../tweaks/TweaksContext";

const PROFILE_STORAGE = "signal:profile:v1";

interface Profile {
  displayName: string;
  updatedAt: number;
}

const DEFAULT_PROFILE: Profile = {
  displayName: "operador",
  updatedAt: Date.now(),
};

export default function ProfilePage() {
  const { state, principles } = useSpine();
  const { values: tweaks, set: setTweak } = useTweaks();

  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE);
      return raw ? { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as Partial<Profile>) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.displayName);

  useEffect(() => {
    try { localStorage.setItem(PROFILE_STORAGE, JSON.stringify(profile)); } catch {}
  }, [profile]);

  const stats = useMemo(() => {
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    let artifactsTotal = 0;
    let runsLast7d = 0;
    for (const m of state.missions) {
      artifactsTotal += m.artifacts.length;
      for (const a of m.artifacts) {
        if (now - a.acceptedAt < SEVEN_DAYS) runsLast7d++;
      }
    }
    return {
      missions: state.missions.length,
      artifacts: artifactsTotal,
      principles: principles.length,
      runs7d: runsLast7d,
    };
  }, [state.missions, principles]);

  const recentMissions = useMemo(
    () =>
      [...state.missions]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 6),
    [state.missions],
  );

  const monogram = (profile.displayName.trim()[0] ?? "?").toUpperCase();

  const saveName = () => {
    const next = draftName.trim() || "operador";
    setProfile((p) => ({ ...p, displayName: next, updatedAt: Date.now() }));
    setEditing(false);
  };

  return (
    <section
      data-page="profile"
      style={{
        padding: "var(--space-6)",
        maxWidth: 880,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      {/* Identity card */}
      <header
        data-profile-identity
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          padding: "var(--space-4)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)",
          background: "var(--bg-surface, transparent)",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-full)",
            background: ACCENT_SWATCHES.find((a) => a.key === tweaks.accent)?.color ?? "var(--text-primary)",
            color: "var(--bg, #0a0a0a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--serif)",
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          {monogram}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {editing ? (
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") {
                    setDraftName(profile.displayName);
                    setEditing(false);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "var(--space-2)",
                  fontFamily: "var(--serif)",
                  fontSize: "var(--t-title)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent",
                  color: "var(--text-primary)",
                }}
              />
              <button type="button" className="btn" onClick={saveName}>guardar</button>
            </div>
          ) : (
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--serif)",
                fontSize: "var(--t-title)",
                fontWeight: 500,
              }}
            >
              {profile.displayName}
            </h1>
          )}
          <span className="kicker" data-tone="ghost">
            sovereign operator · perfil local · sem servidor
          </span>
          {!editing && (
            <button
              type="button"
              onClick={() => { setDraftName(profile.displayName); setEditing(true); }}
              style={{
                alignSelf: "flex-start",
                marginTop: "var(--space-1)",
                padding: 0,
                background: "transparent",
                border: 0,
                fontFamily: "var(--mono)",
                fontSize: "var(--t-meta)",
                color: "var(--text-muted)",
                cursor: "pointer",
                borderBottom: "1px dotted currentColor",
              }}
            >
              editar nome
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            className="kicker"
            data-tone="ghost"
            style={{ fontFamily: "var(--mono)", fontSize: "var(--t-meta)" }}
          >
            acento
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {ACCENT_SWATCHES.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => setTweak("accent", a.key as AccentKey)}
                aria-label={`acento ${a.key}`}
                aria-pressed={tweaks.accent === a.key}
                style={{
                  width: 18,
                  height: 18,
                  padding: 0,
                  borderRadius: "var(--radius-full)",
                  border: tweaks.accent === a.key
                    ? "2px solid var(--text-primary)"
                    : "1px solid var(--border-soft)",
                  background: a.color,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Stats grid */}
      <section data-profile-stats>
        <h2
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 var(--space-2)",
          }}
        >
          — estatísticas
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "var(--space-2)",
          }}
        >
          <StatCard label="missões"        value={stats.missions} />
          <StatCard label="artefatos"       value={stats.artifacts} note="selados" />
          <StatCard label="princípios"      value={stats.principles} note="doutrina" />
          <StatCard label="runs últimos 7d" value={stats.runs7d} />
        </div>
      </section>

      {/* Recent missions */}
      <section data-profile-history>
        <h2
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 var(--space-2)",
          }}
        >
          — missões recentes
        </h2>
        {recentMissions.length === 0 ? (
          <div
            style={{
              padding: "var(--space-3)",
              border: "1px dashed var(--border-soft)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body-sec)",
            }}
          >
            sem missões — abra uma câmara para começar.{" "}
            <Link to="/chambers/insight" style={{ color: "var(--text-primary)" }}>
              ir para Insight →
            </Link>
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
            {recentMissions.map((m) => {
              const taskCount = m.tasks.length;
              const doneCount = m.tasks.filter((t) => t.state === "done").length;
              return (
                <li
                  key={m.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto auto",
                    alignItems: "baseline",
                    gap: "var(--space-3)",
                    padding: "var(--space-2) 0",
                    borderTop: "1px solid var(--border-soft)",
                  }}
                >
                  <span
                    className="kicker"
                    data-tone="ghost"
                    style={{ fontFamily: "var(--mono)", fontSize: "var(--t-meta)", minWidth: 60 }}
                  >
                    {m.chamber}
                  </span>
                  <Link
                    to={`/chambers/${m.chamber}`}
                    style={{ color: "var(--text-primary)", textDecoration: "none" }}
                  >
                    {m.title}
                  </Link>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-meta)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {doneCount}/{taskCount} task{taskCount === 1 ? "" : "s"}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-meta)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {fmtAge(m.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}

function StatCard({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div
      style={{
        padding: "var(--space-3)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-surface, transparent)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-meta)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-display)",
          fontWeight: 500,
          color: "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      {note && (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            color: "var(--text-muted)",
          }}
        >
          {note}
        </span>
      )}
    </div>
  );
}

function fmtAge(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "agora";
  const m = Math.round(diff / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}
