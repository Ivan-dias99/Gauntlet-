import { useEffect, useState } from "react";
import type { SurfaceBriefPayload, SurfacePlanPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface canvas — Visual Contract Engine view router.
//
// The six canonical stages of the contract progression:
//   BRIEF · CONTRACT · PLAN · ARTBOARD · COMPONENTS · SEAL
//
// Plus the existing FILES / WIREFRAMES "not wired" tabs preserved from
// canon for backwards compatibility (they still declare the backend
// contracts pending).
//
// Stages BRIEF and CONTRACT are always available. PLAN / ARTBOARD /
// COMPONENTS / SEAL appear only after a plan envelope arrives. SEAL is
// active when an artifact has been accepted for the active mission.
// The 5 lens chips that lived inline with these tabs moved up to the
// SurfaceWorkbench thin pill above the split; the canvas tab bar is
// now view-router-only.

type View =
  | "brief"
  | "contract"
  | "plan"
  | "artboard"
  | "components"
  | "seal"
  | "files";

// Canned examples grid retired: Surface is a visual contract
// workstation, not a template marketplace. The brief view now reads
// only the operational checklist of the active brief.

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  brief: SurfaceBriefPayload;
  promptDraft: string;
  // Pre-existing canon parity: SurfaceLayout passes these so the rail
  // can read pending state and handle brief patches when the contract
  // checklist becomes interactive in a later wave. Kept optional so the
  // canonical caller path keeps compiling.
  pending?: boolean;
  onBriefChange?: (patch: Partial<SurfaceBriefPayload>) => void;
  // When the operator has explicitly sealed the plan as a mission
  // artifact, the SEAL stage activates. Optional so the canonical
  // caller path keeps compiling.
  sealed?: boolean;
  onSeal?: () => void;
}

export default function ExplorationRail({
  plan, mock, brief, promptDraft, sealed, onSeal,
}: Props) {
  const copy = useCopy();
  const [view, setView] = useState<View>("brief");
  const [planSeen, setPlanSeen] = useState(false);

  // Auto-switch to ARTBOARD the first time a plan arrives so the user
  // sees the structured output immediately. Then the user owns nav.
  useEffect(() => {
    if (plan && !planSeen) {
      setView("artboard");
      setPlanSeen(true);
    }
    if (!plan && planSeen) {
      setPlanSeen(false);
    }
  }, [plan, planSeen]);

  // Stage progression: BRIEF + CONTRACT are always reachable. The
  // post-generation stages (PLAN, ARTBOARD, COMPONENTS, SEAL) become
  // available only when their backing data exists. Files and
  // Wireframes are preserved from canon as "not wired" forwards.
  const tabs: Array<{ key: View; label: string; wired: boolean }> = [
    { key: "brief",     label: "Brief",     wired: true },
    { key: "contract",  label: "Contract",  wired: true },
    ...(plan
      ? ([
          { key: "plan" as View,       label: "Plan",       wired: true },
          { key: "artboard" as View,   label: "Artboard",   wired: true },
          { key: "components" as View, label: "Components", wired: true },
          {
            key: "seal" as View,
            label: "Seal",
            wired: !!onSeal,
          },
          { key: "files" as View,      label: copy.surfaceCanvasTabFiles, wired: true },
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
        {view === "brief"      && <BriefView brief={brief} promptDraft={promptDraft} copy={copy} />}
        {view === "contract"   && <ContractView brief={brief} promptDraft={promptDraft} />}
        {view === "plan"       && <PlanView plan={plan} mock={mock} copy={copy} />}
        {view === "artboard"   && plan && <ArtboardStageView plan={plan} mock={mock} />}
        {view === "components" && plan && <ComponentsStageView plan={plan} mock={mock} />}
        {view === "seal"       && plan && (
          <SealStageView
            plan={plan}
            mock={mock}
            sealed={!!sealed}
            onSeal={onSeal}
          />
        )}
        {view === "files"      && <FilesView plan={plan} mock={mock} copy={copy} />}
      </div>
    </div>
  );
}

// ——— Views ———

function BriefView({
  brief, promptDraft, copy,
}: {
  brief: SurfaceBriefPayload;
  promptDraft: string;
  copy: ReturnType<typeof useCopy>;
}) {
  const checklist: Array<{ key: string; label: string; done: boolean }> = [
    { key: "intent",   label: copy.surfaceContractFieldIntent,   done: promptDraft.trim().length > 0 },
    { key: "output",   label: copy.surfaceContractFieldOutput,   done: !!brief.mode },
    { key: "fidelity", label: copy.surfaceContractFieldFidelity, done: !!brief.fidelity },
    { key: "ds",       label: copy.surfaceContractFieldDs,       done: !!brief.design_system },
  ];
  const allChecked = checklist.every((row) => row.done);

  return (
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
              borderRadius: 999,
            }}
          >
            mock
          </span>
        )}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: 10,
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
              borderRadius: 999,
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

// Wireframes view retired (it lived as dead code: the tab bar never
// included it once the visual contract engine landed). The
// surfaceWireframes* copy keys remain in the i18n table for the
// canon SurfaceWorkbench lens that still references them.

// (Lens chip + flyout + icons live in SurfaceWorkbench now — the
// canvas tab bar carries view navigation only.)

// ── Stage views (Brief/Contract/Plan/Artboard/Components/Seal) ─────────────
//
// Pure-additive: stages render data the chamber already owns (brief +
// plan). No fake wiring, no canned content. Mock badge stays honest
// when the plan came back with mock=true.

function ContractView({
  brief, promptDraft,
}: {
  brief: SurfaceBriefPayload;
  promptDraft: string;
}) {
  const items = [
    { label: "intent · brief escrito",                       satisfied: promptDraft.trim().length > 0 },
    { label: "output · prototype / deck / template / other", satisfied: !!brief.mode },
    { label: "fidelity · wireframe / hi-fi",                 satisfied: !!brief.fidelity },
    {
      label: brief.design_system
        ? `design system · ${brief.design_system}`
        : "design system · escolhe ou declara 'sem DS'",
      satisfied: !!brief.design_system,
    },
  ];
  const allSatisfied = items.every((i) => i.satisfied);

  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 14 }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        — Contract {allSatisfied ? "ready" : "blocked"}
      </span>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--serif)",
          fontSize: 18,
          lineHeight: 1.4,
          color: "var(--text-primary)",
        }}
      >
        {allSatisfied
          ? "Contrato fechado. Submete o brief para gerar o plano."
          : "Forma o contrato à esquerda. Cada linha por marcar mantém o brief bloqueado."}
      </p>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {items.map((it) => (
          <li
            key={it.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body-sec)",
              color: it.satisfied ? "var(--text-secondary)" : "var(--text-muted)",
              opacity: it.satisfied ? 1 : 0.7,
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: 3,
                border: it.satisfied
                  ? "1px solid color-mix(in oklab, var(--cc-ok) 60%, transparent)"
                  : "1px solid var(--border-mid)",
                color: "var(--cc-ok)",
                fontSize: 11,
                lineHeight: 1,
              }}
            >
              {it.satisfied ? "✓" : ""}
            </span>
            <span>{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArtboardStageView({
  plan, mock,
}: {
  plan: SurfacePlanPayload;
  mock: boolean;
}) {
  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          — Artboard
        </span>
        <span style={{ flex: 1 }} aria-hidden />
        {mock && <MockBadgeStage />}
      </div>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 18,
          color: "var(--text-primary)",
          lineHeight: 1.4,
        }}
      >
        {plan.screens.length} {plan.screens.length === 1 ? "tela" : "telas"} · {plan.mode} · {plan.fidelity}
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {plan.screens.map((s) => (
          <div
            key={s.name}
            style={{
              padding: 12,
              border: "var(--border-soft)",
              borderRadius: "var(--radius-control)",
              background: "var(--bg-elevated)",
            }}
          >
            <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)" }}>
              {s.name}
            </div>
            <div style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)", marginTop: 4 }}>
              {s.purpose}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentsStageView({
  plan, mock,
}: {
  plan: SurfacePlanPayload;
  mock: boolean;
}) {
  const byScreen = new Map<string, typeof plan.components>();
  for (const c of plan.components) {
    const arr = byScreen.get(c.screen) ?? [];
    arr.push(c);
    byScreen.set(c.screen, arr);
  }
  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          — Components
        </span>
        <span style={{ flex: 1 }} aria-hidden />
        {mock && <MockBadgeStage />}
      </div>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 18,
          color: "var(--text-primary)",
          lineHeight: 1.4,
        }}
      >
        {plan.components.length} componente{plan.components.length === 1 ? "" : "s"} ·{" "}
        {byScreen.size} tela{byScreen.size === 1 ? "" : "s"}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.screens.map((s) => {
          const items = byScreen.get(s.name) ?? [];
          if (items.length === 0) return null;
          return (
            <div
              key={s.name}
              style={{
                padding: 10,
                border: "var(--border-soft)",
                borderRadius: "var(--radius-control)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-label)",
                  textTransform: "uppercase",
                  color: "var(--text-ghost)",
                  marginBottom: 6,
                }}
              >
                {s.name}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 6,
                }}
              >
                {items.map((c) => (
                  <li
                    key={`${c.screen}:${c.name}`}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-body-sec)",
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "var(--text-ghost)" }}>{c.kind}</span>
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SealStageView({
  plan, mock, sealed, onSeal,
}: {
  plan: SurfacePlanPayload;
  mock: boolean;
  sealed: boolean;
  onSeal: (() => void) | undefined;
}) {
  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          — Seal
        </span>
        <span style={{ flex: 1 }} aria-hidden />
        {mock && <MockBadgeStage />}
      </div>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 18,
          color: "var(--text-primary)",
          lineHeight: 1.4,
        }}
      >
        {sealed
          ? "Plano selado · artifact gravado na missão."
          : "Aceitar o plano grava-o como artifact da missão activa."}
      </span>
      <div
        style={{
          padding: 12,
          border: sealed
            ? "1px solid color-mix(in oklab, var(--cc-ok) 36%, transparent)"
            : "var(--border-soft)",
          borderRadius: "var(--radius-control)",
          background: sealed
            ? "color-mix(in oklab, var(--cc-ok) 6%, transparent)"
            : "var(--bg-elevated)",
          fontFamily: "var(--mono)",
          fontSize: "var(--t-body-sec)",
          color: "var(--text-secondary)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div>{plan.screens.length} telas · {plan.components.length} componentes</div>
        <div style={{ color: "var(--text-muted)" }}>
          DS: {plan.design_system_binding ?? "—"}
        </div>
      </div>
      {!sealed && onSeal && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onSeal}
            className="btn-chip"
            data-variant="ok"
            title="Aceitar plano e gravar artifact na missão"
          >
            Selar plano →
          </button>
        </div>
      )}
      {!onSeal && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-ghost)",
          }}
        >
          missão activa exigida para selar.
        </div>
      )}
    </div>
  );
}

function MockBadgeStage() {
  return (
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
        borderRadius: 999,
      }}
    >
      mock
    </span>
  );
}
