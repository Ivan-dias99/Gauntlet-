import { useEffect, useState } from "react";
import {
  signalFetch,
  isBackendUnreachable,
  parseBackendError,
  BackendError,
} from "../../lib/signalApi";
import type { SurfacePlanPayload } from "../../hooks/useSignal";

// P-15 — BuildSpec viewer.
//
// Surface generates a SurfacePlan today; nothing in the shell ever
// compiles it to scaffolds. This panel closes the loop with the
// /surface/build-spec endpoint shipped in #219 (Wave J,
// `compile_plan_to_spec`): the operator clicks "compile" and sees the
// per-component file paths + TSX scaffold previews Terminal would
// otherwise materialise blind.
//
// Pure compute on the backend — no provider call, no streaming. We
// POST once and render the JSON. Mirrors the inline-style grammar
// used by the other small Surface affordances (the real-badge banner,
// the error strip).

interface ComponentContract {
  name: string;
  file_path: string;
  kind: string;
  screen_name: string;
  props: string[];
  states: string[];
  acceptance: string[];
  scaffold_tsx: string;
}

interface BuildSpecResponse {
  source_plan_id: string;
  source_design_system: string;
  components: ComponentContract[];
  files_to_create: string[];
}

interface Props {
  plan: SurfacePlanPayload | null;
  missionId: string | null;
}

const SCAFFOLD_PREVIEW_LIMIT = 200;

export default function BuildSpecPanel({ plan, missionId }: Props) {
  const [spec, setSpec] = useState<BuildSpecResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  // Codex review (PR #255): when the plan reference changes (operator
  // edited the brief and re-rendered Surface), drop any prior spec
  // so the panel doesn't render a list of scaffolds that no longer
  // correspond to the current plan. Errors clear too — the previous
  // failure state isn't tied to the new plan either.
  useEffect(() => {
    setSpec(null);
    setErr(null);
    setOffline(false);
  }, [plan]);

  async function compile() {
    if (!plan || busy) return;
    setBusy(true);
    setErr(null);
    setOffline(false);
    // Codex review (PR #255): clear the previous spec so a failed
    // retry or a recompile after the plan changed never shows stale
    // scaffolds as if they were the current output.
    setSpec(null);
    try {
      const res = await signalFetch("/surface/build-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          project_id: missionId ?? "",
          output_dir: "src/components",
        }),
      });
      if (!res.ok) {
        const env = await parseBackendError(res);
        throw new BackendError(res.status, env, `surface/build-spec ${res.status}`);
      }
      const body = (await res.json()) as BuildSpecResponse;
      setSpec(body);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      if (isBackendUnreachable(e)) {
        setOffline(true);
        setErr(e.message);
      } else {
        setErr(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setBusy(false);
    }
  }

  const disabled = !plan || busy;

  return (
    <div data-surface-buildspec="root" style={shell}>
      <div style={headerRow}>
        <span style={kicker}>buildspec · spec-to-code</span>
        <button
          type="button"
          onClick={compile}
          disabled={disabled}
          style={disabled ? buttonDisabled : button}
          data-surface-buildspec-compile
        >
          {busy ? "a compilar…" : "↳ compilar"}
        </button>
      </div>

      {!plan && (
        <p style={hint}>
          gera um plano primeiro — o compilador converte os componentes em ficheiros TSX.
        </p>
      )}

      {plan && !spec && !busy && !err && (
        <p style={hint}>
          {plan.components.length} componente(s) prontos para compilar.
        </p>
      )}

      {busy && <p style={hint}>a chamar /surface/build-spec…</p>}

      {err && (
        <p style={offline ? errorOffline : errorBody} data-surface-buildspec-error>
          {err}
        </p>
      )}

      {spec && !busy && (
        <>
          <p style={summary} data-surface-buildspec-summary>
            {spec.components.length} components → {spec.files_to_create.length} files
          </p>
          <ul style={list}>
            {spec.components.map((c) => (
              <li key={c.file_path} style={item} data-surface-buildspec-item>
                <details>
                  <summary style={itemSummary}>
                    <span style={componentName}>{c.name}</span>
                    <span style={dot}>·</span>
                    <span style={componentMeta}>{c.kind}</span>
                    <span style={dot}>·</span>
                    <span style={componentPath}>{c.file_path}</span>
                  </summary>
                  <pre style={scaffoldPreview}>
                    {c.scaffold_tsx.length > SCAFFOLD_PREVIEW_LIMIT
                      ? c.scaffold_tsx.slice(0, SCAFFOLD_PREVIEW_LIMIT) + "…"
                      : c.scaffold_tsx}
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ── Styles (inline; matches the Surface chamber's small-affordance grammar) ──

const shell: React.CSSProperties = {
  margin: "0 var(--space-3) var(--space-2)",
  padding: "var(--space-2) var(--space-3)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-control)",
  background: "color-mix(in oklab, var(--accent) 4%, transparent)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const kicker: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta)",
  letterSpacing: "var(--track-meta)",
  textTransform: "uppercase",
  color: "var(--text-secondary)",
};

const button: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta)",
  letterSpacing: 1.5,
  textTransform: "uppercase",
  padding: "5px 12px",
  border: "1px solid var(--accent)",
  borderRadius: "var(--radius-full)",
  background: "color-mix(in oklab, var(--accent) 14%, transparent)",
  color: "var(--accent)",
  cursor: "pointer",
};

const buttonDisabled: React.CSSProperties = {
  ...button,
  opacity: 0.45,
  cursor: "not-allowed",
};

const hint: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta)",
  color: "var(--text-secondary)",
};

const summary: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-kicker)",
  color: "var(--text)",
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const item: React.CSSProperties = {
  padding: "6px 8px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-control)",
  background: "var(--surface)",
};

const itemSummary: React.CSSProperties = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-kicker)",
};

const componentName: React.CSSProperties = {
  color: "var(--text)",
  fontWeight: 600,
};

const componentMeta: React.CSSProperties = {
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  fontSize: "var(--t-meta)",
  letterSpacing: 1.2,
};

const componentPath: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "var(--t-meta)",
  overflowWrap: "anywhere",
};

const dot: React.CSSProperties = {
  color: "var(--text-secondary)",
  opacity: 0.6,
};

const scaffoldPreview: React.CSSProperties = {
  marginTop: 6,
  marginBottom: 0,
  padding: "8px 10px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-control)",
  background: "color-mix(in oklab, var(--text) 4%, transparent)",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta)",
  lineHeight: 1.45,
  color: "var(--text)",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

const errorBody: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta)",
  color: "var(--cc-err)",
};

const errorOffline: React.CSSProperties = {
  ...errorBody,
  color: "var(--cc-warn, #c08040)",
};
