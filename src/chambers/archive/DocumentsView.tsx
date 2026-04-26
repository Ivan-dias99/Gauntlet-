import type { Artifact, Mission, Principle } from "../../spine/types";
import type { RunRecord } from "./helpers";

// Archive · Documents.
//
// Read-only aggregate of every persisted body Signal already owns,
// shaped as four document classes:
//
//   1. Artifacts     — accepted task/plan outputs (from spine missions)
//   2. Decisions     — refused runs that left a judgment trace
//   3. Doctrine      — Operator Constitution + System Doctrine reminder
//   4. Run summaries — recent done runs as sealed answers
//
// No fake wiki entries. If a section is empty, it says so honestly.
// Pure-additive: this is a NEW file rendered inside Archive's existing
// shell; the canonical RunList / RunDetail layout is preserved as the
// Runs sub-tab.

interface DocumentItem {
  id: string;
  title: string;
  meta: string;
  body: string;
  origin: string;
}

interface Props {
  missions: Mission[];
  principles: Principle[];
  runs: RunRecord[] | null;
}

export default function DocumentsView({ missions, principles, runs }: Props) {
  const artifacts = collectArtifacts(missions);
  const decisions = collectDecisions(runs ?? []);
  const doctrine = collectDoctrine(principles);
  const summaries = collectRunSummaries(runs ?? []);

  return (
    <div
      data-archive-documents
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          — Documents
        </span>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: 18,
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          Tudo o que Signal já gravou — agrupado em quatro classes vinculantes.
          Sem wiki fictícia, sem páginas vazias.
        </span>
      </header>

      <DocSection
        title="Artifacts"
        sub={`${artifacts.length} aceite${artifacts.length === 1 ? "" : "s"}`}
        empty="Nenhum artifact aceite. Sela um plano em Surface ou aceita um output em Terminal."
        items={artifacts}
      />
      <DocSection
        title="Decisions"
        sub={`${decisions.length} juízo${decisions.length === 1 ? "" : "s"} preservados`}
        empty="Sem juízos arquivados. Cada recusa do triad cai aqui com a razão registada."
        items={decisions}
      />
      <DocSection
        title="Doctrine"
        sub={`Operator Constitution: ${principles.length} · System Doctrine: backend-canonical`}
        empty="Sem princípios do operador. System Doctrine continua activa em Core › Policies."
        items={doctrine}
      />
      <DocSection
        title="Run summaries"
        sub={`${summaries.length} run${summaries.length === 1 ? "" : "s"} recentes`}
        empty="Sem runs gravados. Submete uma pergunta ou tarefa para começar."
        items={summaries}
      />
    </div>
  );
}

function collectArtifacts(missions: Mission[]): DocumentItem[] {
  const out: DocumentItem[] = [];
  for (const m of missions) {
    const list: Artifact[] = m.artifacts.length
      ? m.artifacts
      : m.lastArtifact
        ? [m.lastArtifact]
        : [];
    for (const a of list) {
      out.push({
        id: `artifact:${m.id}:${a.id}`,
        title: a.taskTitle,
        meta: `${m.title} · ${new Date(a.acceptedAt).toLocaleString([], {
          day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
        })}${a.terminatedEarly ? " · parcial" : ""}`,
        body: a.answer || "(sem corpo registado)",
        origin: a.terminationReason ? `term: ${a.terminationReason}` : "accepted",
      });
    }
  }
  out.sort((a, b) => b.id.localeCompare(a.id));
  return out;
}

function collectDecisions(runs: RunRecord[]): DocumentItem[] {
  return runs
    .filter((r) => r.refused)
    .map((r) => {
      const body = r.judge_reasoning?.trim()
        || "Recusa sem juízo registado · provenance degradada.";
      return {
        id: `decision:${r.id}`,
        title: r.question.slice(0, 80) + (r.question.length > 80 ? "…" : ""),
        meta: `${r.route} · ${new Date(r.timestamp).toLocaleString([], {
          day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
        })}`,
        body,
        origin: r.confidence ?? "low",
      };
    });
}

function collectDoctrine(operator: Principle[]): DocumentItem[] {
  return operator.map((p) => ({
    id: `doctrine-operator:${p.id}`,
    title: p.text.slice(0, 80) + (p.text.length > 80 ? "…" : ""),
    meta: `Operator Constitution · ${new Date(p.createdAt).toLocaleDateString([], {
      day: "2-digit", month: "2-digit", year: "numeric",
    })}`,
    body: p.text,
    origin: "spine.principles",
  }));
}

function collectRunSummaries(runs: RunRecord[]): DocumentItem[] {
  return runs
    .filter((r) => !r.refused && (r.answer ?? "").trim().length > 0)
    .slice(0, 12)
    .map((r) => ({
      id: `run:${r.id}`,
      title: r.question.slice(0, 80) + (r.question.length > 80 ? "…" : ""),
      meta: `${r.route}${r.confidence ? ` · ${r.confidence}` : ""} · ${new Date(r.timestamp).toLocaleString([], {
        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
      })}`,
      body: (r.answer ?? "").length > 600
        ? (r.answer ?? "").slice(0, 600) + "…"
        : (r.answer ?? ""),
      origin: `${r.input_tokens} in · ${r.output_tokens} out · ${r.processing_time_ms} ms`,
    }));
}

function DocSection({
  title, sub, empty, items,
}: {
  title: string;
  sub: string;
  empty: string;
  items: DocumentItem[];
}) {
  return (
    <section className="panel" data-rank="primary">
      <div className="panel-head">
        <span className="panel-title">{title}</span>
        <span className="panel-sub">{sub}</span>
      </div>
      {items.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
            lineHeight: 1.55,
          }}
        >
          {empty}
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {items.slice(0, 8).map((it) => (
            <li
              key={it.id}
              style={{
                padding: "8px 10px",
                border: "var(--border-soft)",
                borderRadius: "var(--radius-control)",
                background: "var(--bg-elevated)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "var(--t-body)",
                    color: "var(--text-primary)",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.title}
                </span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text-ghost)",
                    flexShrink: 0,
                  }}
                >
                  {it.origin}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "var(--track-meta)",
                  color: "var(--text-muted)",
                }}
              >
                {it.meta}
              </span>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--sans)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {it.body.length > 240 ? it.body.slice(0, 240) + "…" : it.body}
              </p>
            </li>
          ))}
          {items.length > 8 && (
            <li
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text-ghost)",
                paddingLeft: 4,
              }}
            >
              + {items.length - 8} mais
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
