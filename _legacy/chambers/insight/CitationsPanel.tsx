// Wave P-11 — Citation trust badge UI.
//
// Wave G (#226) shipped extract_citations + score_domain on the
// backend; #236 wires the citations event after every research tool
// result. The chamber received the events but never rendered them.
// This panel makes the trust trail visible: one row per cited URL
// with the per-domain trust score (high / medium / low / unknown)
// rendered as a colored pill.
//
// Mounted in Insight below the Thread so the operator can audit the
// sources that informed the answer.

import type { CitationPayload, CitationTrust } from "../../hooks/useSignal";
import { EmptyState } from "../../shell/states";

interface Props {
  citations: CitationPayload[];
  /**
   * Wave P-36 — render the canonical EmptyState when the list is empty.
   * Default `false` keeps the historical no-op behaviour so callers that
   * mount CitationsPanel unconditionally still collapse to nothing when
   * the agent loop produced no citations.
   */
  showEmpty?: boolean;
}

const TRUST_LABEL: Record<CitationTrust, string> = {
  high: "fonte alta",
  medium: "fonte média",
  low: "fonte baixa",
  unknown: "fonte ?",
};

const TRUST_TONE: Record<CitationTrust, string> = {
  high: "ok",
  medium: "warn",
  low: "danger",
  unknown: "ghost",
};

export default function CitationsPanel({ citations, showEmpty = false }: Props) {
  if (citations.length === 0) {
    if (!showEmpty) return null;
    return (
      <EmptyState
        glyph="·"
        message="sem fontes citadas neste turno"
        style={{ margin: "var(--space-2) auto 0", maxWidth: 780 }}
      />
    );
  }

  // Dedupe by URL — the same source may be cited by multiple tool
  // results in a single run. Keep the first occurrence's trust score
  // (extraction is heuristic, late records aren't more authoritative).
  const seen = new Set<string>();
  const unique = citations.filter((c) => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });

  const trustCounts: Record<CitationTrust, number> = {
    high: 0, medium: 0, low: 0, unknown: 0,
  };
  for (const c of unique) trustCounts[c.trust] = (trustCounts[c.trust] ?? 0) + 1;

  return (
    <section
      data-citations-panel
      style={{
        margin: "var(--space-2) auto 0",
        maxWidth: 780,
        padding: "var(--space-2) var(--space-3)",
        borderRadius: "var(--radius-md)",
        border: "1px solid currentColor",
        opacity: 0.88,
        fontSize: "0.85em",
      }}
      aria-label="fontes citadas"
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontSize: "0.8em",
          }}
        >
          ↪ {unique.length} fonte{unique.length === 1 ? "" : "s"}
        </span>
        <span style={{ fontSize: "0.75em", opacity: 0.7 }}>
          {Object.entries(trustCounts)
            .filter(([, n]) => n > 0)
            .map(([k, n]) => `${n} ${k}`)
            .join(" · ")}
        </span>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {unique.map((c) => (
          <li
            key={c.url}
            data-citation-trust={c.trust}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "baseline",
              padding: "2px 0",
            }}
          >
            <span
              data-trust-pill={c.trust}
              data-tone={TRUST_TONE[c.trust]}
              title={TRUST_LABEL[c.trust]}
              style={{
                fontSize: "0.7em",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "1px 6px",
                borderRadius: "var(--radius-full)",
                border: "1px solid currentColor",
                opacity: 0.7,
                whiteSpace: "nowrap",
              }}
            >
              {c.trust}
            </span>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
                borderBottom: "1px solid currentColor",
                opacity: 0.85,
                wordBreak: "break-all",
              }}
            >
              {c.domain || c.url}
            </a>
            {c.snippet && (
              <span style={{ opacity: 0.6, fontSize: "0.85em", flex: 1 }}>
                {c.snippet.slice(0, 80)}
                {c.snippet.length > 80 ? "…" : ""}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
