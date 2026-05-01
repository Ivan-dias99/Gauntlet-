// Wave P-44 — plugins page (real).
//
// Catalog of installable plugins + custom upload. "Installed" state
// lives in localStorage (signal:plugins:installed:v1) and the custom
// definitions in (signal:plugins:custom:v1). The catalog list is the
// canonical doctrine; custom plugins extend the registry per-operator.
//
// A plugin in Signal is a small JSON manifest:
//   { id, name, kind, description, scopes, author }
// kind ∈ "tool" | "webhook" | "ui" — defines where the runtime mounts
// the plugin (tool → agent loop allowlist · webhook → backend · ui →
// chamber surface). Real runtime mounting lands when the plugin host
// is implemented; for now Plugins page shows install/uninstall and
// validates the manifest shape on upload.

import { useEffect, useMemo, useRef, useState } from "react";

const INSTALLED_STORAGE = "signal:plugins:installed:v1";
const CUSTOM_STORAGE    = "signal:plugins:custom:v1";

type PluginKind = "tool" | "webhook" | "ui";

interface Plugin {
  id: string;
  name: string;
  kind: PluginKind;
  description: string;
  scopes: ReadonlyArray<string>;
  author?: string;
}

const CATALOG: ReadonlyArray<Plugin> = [
  {
    id: "github-actions-trigger",
    name: "GitHub Actions Trigger",
    kind: "tool",
    description: "Despoleta workflows do agent loop. Filtra por repo + branch + workflow.",
    scopes: ["github.actions"],
    author: "signal",
  },
  {
    id: "vercel-deploy-hook",
    name: "Vercel Deploy Hook",
    kind: "webhook",
    description: "Recebe events de deploy (queued/built/ready/error) e regista no spine.",
    scopes: ["vercel.deployments"],
    author: "signal",
  },
  {
    id: "custom-http-tool",
    name: "Custom HTTP Tool",
    kind: "tool",
    description: "Adiciona uma chamada HTTP arbitrária ao allowlist do agente. Headers + body declarados.",
    scopes: ["web.fetch"],
    author: "signal",
  },
  {
    id: "linear-issue-sync",
    name: "Linear Issue Sync",
    kind: "tool",
    description: "Cria/actualiza issues no Linear a partir do Terminal. Mapeia mission → projecto.",
    scopes: ["issue-tracker.read", "issue-tracker.create"],
    author: "signal",
  },
  {
    id: "datadog-logs-query",
    name: "Datadog Logs Query",
    kind: "tool",
    description: "Pesquisa logs estruturados via API. Resultados limitados a 200 linhas.",
    scopes: ["observability.logs"],
    author: "signal",
  },
  {
    id: "figma-frame-export",
    name: "Figma Frame Export",
    kind: "tool",
    description: "Exporta frames seleccionados como PNG/SVG e injecta no Surface workbench.",
    scopes: ["figma.files"],
    author: "signal",
  },
  {
    id: "browser-screenshot",
    name: "Browser Screenshot",
    kind: "tool",
    description: "Captura screenshot de uma URL via headless browser. Usa Browser Runtime connector.",
    scopes: ["browser-runtime.navigate"],
    author: "signal",
  },
  {
    id: "spine-snapshot-button",
    name: "Spine Snapshot Button",
    kind: "ui",
    description: "Botão flutuante na ribbon que cria um snapshot do spine sob demanda.",
    scopes: [],
    author: "signal",
  },
];

function loadInstalled(): Set<string> {
  try {
    const raw = localStorage.getItem(INSTALLED_STORAGE);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch { return new Set(); }
}

function saveInstalled(ids: Set<string>) {
  try { localStorage.setItem(INSTALLED_STORAGE, JSON.stringify(Array.from(ids))); } catch {}
}

function loadCustom(): Plugin[] {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE);
    return raw ? (JSON.parse(raw) as Plugin[]) : [];
  } catch { return []; }
}

function saveCustom(plugins: Plugin[]) {
  try { localStorage.setItem(CUSTOM_STORAGE, JSON.stringify(plugins)); } catch {}
}

export default function PluginsPage() {
  const [installed, setInstalled] = useState<Set<string>>(loadInstalled);
  const [custom, setCustom] = useState<Plugin[]>(loadCustom);
  const [filter, setFilter] = useState<"all" | PluginKind>("all");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const all = useMemo<Plugin[]>(() => [...CATALOG, ...custom], [custom]);
  const filtered = useMemo(
    () => filter === "all" ? all : all.filter((p) => p.kind === filter),
    [all, filter],
  );

  const toggle = (id: string) => {
    setInstalled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveInstalled(next);
      return next;
    });
  };

  const removeCustom = (id: string) => {
    const updated = custom.filter((p) => p.id !== id);
    setCustom(updated);
    saveCustom(updated);
    setInstalled((prev) => {
      const next = new Set(prev);
      next.delete(id);
      saveInstalled(next);
      return next;
    });
  };

  const handleUpload = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const validated = validateManifest(parsed);
        if ("error" in validated) {
          setUploadError(validated.error);
          return;
        }
        const plugin = validated.plugin;
        if (CATALOG.some((p) => p.id === plugin.id)) {
          setUploadError(`já existe um plugin com id "${plugin.id}"`);
          return;
        }
        // Codex review #288 (P2): the previous code closed over `custom`
        // from render time. Back-to-back uploads could pass the
        // duplicate-id check against stale state and overwrite each
        // other. Use the functional updater so the collision check + the
        // append both run against the latest state.
        let collided = false;
        setCustom((prev) => {
          if (prev.some((p) => p.id === plugin.id)) {
            collided = true;
            return prev;
          }
          const next = [...prev, plugin];
          saveCustom(next);
          return next;
        });
        if (collided) {
          setUploadError(`já existe um plugin com id "${plugin.id}"`);
          return;
        }
        setUploadSuccess(`${plugin.name} (${plugin.id}) registado`);
      } catch (e) {
        setUploadError(`JSON inválido: ${e instanceof Error ? e.message : String(e)}`);
      }
    };
    reader.onerror = () => setUploadError("falha a ler ficheiro");
    reader.readAsText(file);
  };

  const installedCount = installed.size;

  return (
    <section
      data-page="plugins"
      style={{
        padding: "var(--space-6)",
        maxWidth: 1080,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      <header style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)", margin: 0 }}>
          plugins
        </h2>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-meta)",
            color: "var(--text-muted)",
          }}
        >
          {installedCount} instalado{installedCount === 1 ? "" : "s"} · {all.length} no catálogo
        </span>
      </header>

      <p style={{ color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.55, margin: 0 }}>
        plugin = manifesto JSON: <code>id · name · kind · scopes</code>. três tipos:
        {" "}<strong>tool</strong> (entra no allowlist do agente),{" "}
        <strong>webhook</strong> (escuta no backend),{" "}
        <strong>ui</strong> (monta surface na chamber).
      </p>

      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {(["all", "tool", "webhook", "ui"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            style={{
              padding: "var(--space-1) var(--space-3)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              border: "1px solid var(--border-soft)",
              borderRadius: "var(--radius-sm)",
              background: filter === k
                ? "color-mix(in oklab, var(--text-primary) 8%, transparent)"
                : "transparent",
              color: filter === k ? "var(--text-primary)" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            {k === "all" ? "todos" : k}
          </button>
        ))}
      </div>

      {/* Catalog grid */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {filtered.map((p) => {
          const isInstalled = installed.has(p.id);
          const isCustom = custom.some((c) => c.id === p.id);
          return (
            <li
              key={p.id}
              data-plugin-id={p.id}
              data-plugin-kind={p.kind}
              data-installed={isInstalled ? "true" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                padding: "var(--space-3)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-surface, transparent)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: "var(--t-body)" }}>{p.name}</span>
                <span
                  className="kicker"
                  data-tone="ghost"
                  style={{
                    fontSize: "var(--t-meta)",
                    padding: "1px 6px",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  {p.kind}
                </span>
                {isCustom && (
                  <span
                    className="kicker"
                    data-tone="warn"
                    style={{ fontSize: "var(--t-meta)", marginLeft: "auto" }}
                  >
                    custom
                  </span>
                )}
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--t-body-sec)", margin: 0 }}>
                {p.description}
              </p>
              {p.scopes.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.scopes.map((s) => (
                    <code
                      key={s}
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "var(--t-meta)",
                        padding: "1px 6px",
                        background: "color-mix(in oklab, var(--text-primary) 5%, transparent)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {s}
                    </code>
                  ))}
                </div>
              )}
              <div style={{ marginTop: "auto", display: "flex", gap: "var(--space-2)" }}>
                <button
                  type="button"
                  className="btn"
                  data-action={isInstalled ? undefined : "primary"}
                  onClick={() => toggle(p.id)}
                  style={{
                    padding: "var(--space-1) var(--space-3)",
                    fontSize: "var(--t-body-sec)",
                  }}
                >
                  {isInstalled ? "desinstalar" : "instalar"}
                </button>
                {isCustom && (
                  <button
                    type="button"
                    className="btn"
                    data-tone="danger"
                    onClick={() => removeCustom(p.id)}
                    style={{
                      padding: "var(--space-1) var(--space-3)",
                      fontSize: "var(--t-body-sec)",
                    }}
                  >
                    remover do catálogo
                  </button>
                )}
                {p.author && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-meta)",
                      color: "var(--text-muted)",
                      alignSelf: "center",
                    }}
                  >
                    {p.author}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Custom upload */}
      <section
        data-plugin-upload
        style={{
          padding: "var(--space-4)",
          border: "1px dashed var(--border-soft)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          — carregar plugin custom
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--t-body-sec)", margin: 0 }}>
          ficheiro .json com o manifesto. campos obrigatórios:{" "}
          <code>id, name, kind ∈ tool|webhook|ui, description</code>.
          opcional: <code>scopes[], author</code>.
        </p>
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            style={{ flex: 1, fontFamily: "var(--mono)", fontSize: "var(--t-body-sec)" }}
          />
        </div>
        {uploadError && (
          <div
            data-upload-state="err"
            style={{
              padding: "var(--space-2)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              border: "1px solid color-mix(in oklab, var(--danger, #d04a4a) 60%, transparent)",
              borderRadius: "var(--radius-sm)",
              color: "color-mix(in oklab, var(--danger, #d04a4a) 90%, var(--text-primary))",
            }}
          >
            ✕ {uploadError}
          </div>
        )}
        {uploadSuccess && (
          <div
            data-upload-state="ok"
            style={{
              padding: "var(--space-2)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              border: "1px solid color-mix(in oklab, var(--ok, #4a8c5d) 60%, transparent)",
              borderRadius: "var(--radius-sm)",
              color: "color-mix(in oklab, var(--ok, #4a8c5d) 90%, var(--text-primary))",
            }}
          >
            ✓ {uploadSuccess}
          </div>
        )}
      </section>
    </section>
  );
}

function validateManifest(raw: unknown): { plugin: Plugin } | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "manifesto não é um objecto" };
  const m = raw as Record<string, unknown>;
  if (typeof m.id !== "string" || !m.id.trim()) return { error: "id em falta" };
  if (typeof m.name !== "string" || !m.name.trim()) return { error: "name em falta" };
  if (typeof m.description !== "string") return { error: "description em falta" };
  if (m.kind !== "tool" && m.kind !== "webhook" && m.kind !== "ui") {
    return { error: `kind inválido: "${String(m.kind)}" — esperado tool|webhook|ui` };
  }
  const scopes = Array.isArray(m.scopes) ? m.scopes.filter((s): s is string => typeof s === "string") : [];
  return {
    plugin: {
      id: m.id.trim(),
      name: m.name.trim(),
      kind: m.kind,
      description: m.description,
      scopes,
      author: typeof m.author === "string" ? m.author : undefined,
    },
  };
}
