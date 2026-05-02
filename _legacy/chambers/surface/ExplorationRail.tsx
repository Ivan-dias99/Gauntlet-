import { useEffect, useState } from "react";
import type { SurfaceBriefPayload, SurfacePlanPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface canvas — view router with four top-level tabs:
//   BRIEF · PLAN · FILES · WIREFRAMES
//
// BRIEF and PLAN are wired (read brief + plan from local state).
// FILES and WIREFRAMES are honest "not wired" — empty states declare
// the backend contracts pending. The 5 lens chips that briefly lived
// inline with these tabs moved up to the SurfaceWorkbench thin pill
// above the split; the canvas tab bar is now view-router-only, so
// territory state and view navigation no longer share a row.

type View = "brief" | "plan" | "files" | "wireframes";

const EXAMPLES = [
  { title: "Operational dashboard",     kind: "hi-fi",     tag: "analytics" },
  { title: "Onboarding flow — 3 steps", kind: "prototype", tag: "activation" },
  { title: "Governance settings pane",  kind: "hi-fi",     tag: "core" },
  { title: "Archive search & lineage",  kind: "prototype", tag: "archive" },
];

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  brief: SurfaceBriefPayload;
  promptDraft: string;
  onBriefChange: (patch: Partial<SurfaceBriefPayload>) => void;
  pending: boolean;
}

export default function ExplorationRail({
  plan, mock, brief, promptDraft, onBriefChange, pending,
}: Props) {
  const copy = useCopy();
  const [view, setView] = useState<View>("brief");
  const [planSeen, setPlanSeen] = useState(false);

  // Auto-switch to PLAN view the first time a plan arrives. After
  // that the user owns navigation.
  useEffect(() => {
    if (plan && !planSeen) {
      setView("plan");
      setPlanSeen(true);
    }
    if (!plan && planSeen) {
      setPlanSeen(false);
    }
  }, [plan, planSeen]);

  // Tabs: brief always; plan + files appear when a plan exists. Files
  // is now wired to derived mock artifacts from plan.screens until the
  // real /surface/files backend lands. Wireframes still pending.
  const tabs: Array<{ key: View; label: string; wired: boolean }> = [
    { key: "brief", label: copy.surfaceCanvasTabBrief, wired: true },
    ...(plan
      ? ([
          { key: "plan" as View, label: copy.surfaceCanvasTabPlan, wired: true },
          { key: "files" as View, label: copy.surfaceCanvasTabFiles, wired: true },
        ])
      : []),
  ];

  return (
    <div className="surface-rail-shell">
      {/* Canvas tab bar — view-router only. The 5 lens chips moved
          up to the SurfaceWorkbench thin pill above the split, so the
          tab bar carries one job (navigation), not two (navigation +
          territory state). */}
      <div className="surface-canvas-tabs" role="tablist">
        {tabs.map((t) => {
          const active = t.key === view;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              data-active={active ? "true" : undefined}
              data-wired={t.wired ? "true" : "false"}
              onClick={() => setView(t.key)}
              className="surface-canvas-tab"
              title={t.wired ? t.label : `${t.label} · not wired`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="surface-canvas-view">
        {view === "brief"      && (
          <BriefView
            brief={brief}
            promptDraft={promptDraft}
            copy={copy}
            onBriefChange={onBriefChange}
            pending={pending}
          />
        )}
        {view === "plan"       && <PlanView plan={plan} mock={mock} copy={copy} />}
        {view === "files"      && <FilesView plan={plan} mock={mock} copy={copy} />}
        {view === "wireframes" && <WireframesView copy={copy} />}
      </div>
    </div>
  );
}

// ——— Views ———

function BriefView({
  brief, promptDraft, copy, onBriefChange, pending,
}: {
  brief: SurfaceBriefPayload;
  promptDraft: string;
  copy: ReturnType<typeof useCopy>;
  onBriefChange: (patch: Partial<SurfaceBriefPayload>) => void;
  pending: boolean;
}) {
  const checklist: Array<{ key: string; label: string; done: boolean }> = [
    { key: "intent",   label: copy.surfaceContractFieldIntent,   done: promptDraft.trim().length > 0 },
    { key: "output",   label: copy.surfaceContractFieldOutput,   done: !!brief.mode },
    { key: "fidelity", label: copy.surfaceContractFieldFidelity, done: !!brief.fidelity },
    { key: "ds",       label: copy.surfaceContractFieldDs,       done: !!brief.design_system },
  ];
  const allChecked = checklist.every((row) => row.done);

  return (
    <>
      <div className="surface-rail-hero" data-state={allChecked ? "ready" : "blocked"}>
        <span className="surface-rail-hero-kicker">
          {allChecked ? copy.surfaceRailEmptyKicker : copy.surfaceContractBlockedKicker}
        </span>
        <p className="surface-rail-hero-body">
          {allChecked ? copy.surfaceRailEmptyBody : copy.surfaceContractBlockedBody}
        </p>
        <ul className="surface-contract-checklist" aria-label="contract fields">
          {checklist.map((row) => (
            <li
              key={row.key}
              className="surface-contract-row"
              data-done={row.done ? "true" : undefined}
            >
              <span className="surface-contract-box" aria-hidden>
                {row.done ? "✓" : ""}
              </span>
              <span className="surface-contract-label">{row.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface-rail-shortcut-kicker">
        <span className="surface-rail-shortcut-label">{copy.surfaceExamplesKicker}</span>
        <span className="surface-rail-shortcut-hint">{copy.surfaceExamplesHint}</span>
      </div>
      <div className="surface-rail-body">
        <div className="surface-rail-grid">
          {EXAMPLES.map((it) => (
            <button
              key={it.title}
              className="surface-rail-card"
              type="button"
              aria-label={`${it.title} · ${it.kind}`}
              disabled={pending}
              onClick={() => {
                onBriefChange({
                  fidelity: it.kind === "hi-fi" ? "hi-fi" : "wireframe",
                  mode: brief.mode === "other" ? "prototype" : brief.mode,
                });
              }}
            >
              <div className="surface-rail-card-title">{it.title}</div>
              <div className="surface-rail-card-meta">
                <span className="surface-rail-card-kind" data-kind={it.kind}>{it.kind}</span>
                <span className="surface-rail-card-tag">· {it.tag}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function PlanView({
  plan, mock, copy,
}: {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  copy: ReturnType<typeof useCopy>;
}) {
  if (!plan) {
    return (
      <div className="surface-canvas-empty">
        <span className="surface-canvas-empty-kicker">{copy.surfacePlanEmptyKicker}</span>
        <p className="surface-canvas-empty-body">{copy.surfacePlanEmptyBody}</p>
      </div>
    );
  }
  return (
    <div
      data-surface-plan-preview
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "var(--space-3) var(--space-4)",
        background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 3%, var(--bg-elevated))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--chamber-dna, var(--accent))",
            fontWeight: 500,
          }}
        >
          — Plano gerado
        </span>
        {mock && (
          <span
            data-mock-badge
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--cc-warn)",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: "var(--radius-full)",
            }}
          >
            mock
          </span>
        )}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            color: "var(--text-muted)",
            letterSpacing: "var(--track-meta)",
          }}
        >
          {plan.mode} · {plan.fidelity} · {plan.design_system_binding ?? "no DS"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        {plan.screens.map((s) => {
          const componentCount = plan.components.filter((c) => c.screen === s.name).length;
          return (
            <div
              key={s.name}
              className="surface-rail-card"
              style={{ cursor: "default" }}
            >
              <div className="surface-rail-card-title">{s.name}</div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-muted)",
                  lineHeight: 1.45,
                }}
              >
                {s.purpose}
              </div>
              <div className="surface-rail-card-meta">
                <span className="surface-rail-card-kind">{componentCount} components</span>
              </div>
            </div>
          );
        })}
      </div>
      {plan.notes.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            lineHeight: 1.5,
          }}
        >
          {plan.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Mock diff payload — derived from plan.screens until the real
// /surface/files backend lands. Each screen becomes one .tsx file with
// a small synthetic diff that demonstrates the work the AI did. When
// the real backend lights up, swap derivedFiles() for the wire payload.
type DiffLine = { type: "add" | "del" | "context"; text: string };
type FileDelta = {
  path: string;
  added: number;
  removed: number;
  status: "progress" | "unread" | "read" | "done";
  lines: DiffLine[];
};

function derivedFiles(plan: SurfacePlanPayload): FileDelta[] {
  return plan.screens.slice(0, 4).map((s, idx) => {
    const slug = s.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32) || `screen-${idx + 1}`;
    const componentCount = plan.components.filter((c) => c.screen === s.name).length;
    const status: FileDelta["status"] =
      idx === 0 ? "done" : idx === 1 ? "unread" : "read";
    return {
      path: `src/screens/${slug}.tsx`,
      added: 24 + componentCount * 6,
      removed: 4 + idx,
      status,
      lines: [
        { type: "context", text: `// ${s.name} — ${s.purpose.slice(0, 56)}` },
        { type: "del",     text: `export default function ${slug}() { return null }` },
        { type: "add",     text: `export default function ${slug}({ mission }: Props) {` },
        { type: "add",     text: `  const fields = ${componentCount}` },
        { type: "add",     text: `  return <Layout mission={mission}>{/* … */}</Layout>` },
        { type: "add",     text: `}` },
      ],
    };
  });
}

function FilesView({
  plan, mock, copy,
}: {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  copy: ReturnType<typeof useCopy>;
}) {
  if (!plan) {
    return (
      <div className="surface-canvas-empty">
        <span className="surface-canvas-empty-kicker">{copy.surfaceFilesEmptyKicker}</span>
        <p className="surface-canvas-empty-body">{copy.surfaceFilesEmptyBody}</p>
        <p className="surface-canvas-empty-contract" aria-label="backend contract">
          <span className="surface-canvas-empty-contract-label">contract</span>
          <code>{copy.surfaceFilesEmptyContract}</code>
        </p>
      </div>
    );
  }
  const files = derivedFiles(plan);
  const totalAdded = files.reduce((acc, f) => acc + f.added, 0);
  const totalRemoved = files.reduce((acc, f) => acc + f.removed, 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "var(--space-3) var(--space-4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          — {files.length} files edited
        </span>
        <span className="diff-file-counts">
          <span className="diff-count-add">+{totalAdded}</span>
          <span className="diff-count-del">−{totalRemoved}</span>
        </span>
        {mock && (
          <span
            data-mock-badge
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--cc-warn)",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: "var(--radius-full)",
            }}
          >
            mock
          </span>
        )}
      </div>
      <div className="diff-file-list">
        {files.map((f) => (
          <div key={f.path} className="diff-file">
            <div className="diff-file-head">
              <span className="diff-file-path">{f.path}</span>
              <span className="diff-file-counts">
                <span className="diff-count-add">+{f.added}</span>
                <span className="diff-count-del">−{f.removed}</span>
              </span>
              <span className="status-chip" data-state={f.status}>
                <span className="status-chip-glyph" aria-hidden />
                {statusLabel(f.status)}
              </span>
            </div>
            <div className="diff-body">
              {f.lines.map((ln, i) => (
                <div key={i} className="diff-line" data-type={ln.type}>
                  <span className="diff-line-prefix">
                    {ln.type === "add" ? "+" : ln.type === "del" ? "−" : " "}
                  </span>
                  <span>{ln.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function statusLabel(s: FileDelta["status"]): string {
  switch (s) {
    case "progress": return "in progress";
    case "unread":   return "unread";
    case "read":     return "read";
    case "done":     return "done";
  }
}

function WireframesView({
  copy,
}: {
  copy: ReturnType<typeof useCopy>;
}) {
  return (
    <div className="surface-canvas-empty">
      <span className="surface-canvas-empty-kicker">{copy.surfaceWireframesEmptyKicker}</span>
      <p className="surface-canvas-empty-body">{copy.surfaceWireframesEmptyBody}</p>
      <p className="surface-canvas-empty-contract" aria-label="backend contract">
        <span className="surface-canvas-empty-contract-label">contract</span>
        <code>{copy.surfaceWireframesEmptyContract}</code>
      </p>
    </div>
  );
}

// (Lens chip + flyout + icons live in SurfaceWorkbench now — the
// canvas tab bar carries view navigation only.)
