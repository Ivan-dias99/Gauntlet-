// Wave 7 — design tokens renderer.
//
// Visualises a TokenSet (the shape /design/figma/import returns):
//   - Colors → square swatches with hex value + name + description
//   - Spacings → name + horizontal ruler proportional to value_px
//   - Types → live type specimen (the actual family/weight/size)
//   - Radii → square preview applying the radius value
//   - Raw warnings → muted list at bottom (parser limitations are
//     diagnostic info, not errors — figma_tokens.py emits these for
//     unresolved aliases / styles requiring node walks)

import type { CSSProperties } from "react";
import type { TokenSet, ColorToken, SpacingToken, TypeToken, RadiusToken } from "../types";
import Pill from "../../components/atoms/Pill";

interface Props {
  tokens: TokenSet;
}

export default function TokensRenderer({ tokens }: Props) {
  const sectionTitle: CSSProperties = {
    margin: "0 0 8px",
    fontFamily: "var(--mono)",
    fontSize: "var(--t-meta)",
    letterSpacing: "var(--track-meta)",
    textTransform: "uppercase",
    color: "var(--text-primary)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingBottom: 8,
          borderBottom: "var(--border-soft)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: 16,
            color: "var(--text-primary)",
          }}
        >
          {tokens.name}
        </h3>
        <Pill tone="ghost">file · {tokens.source_file_id}</Pill>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          imported · {new Date(tokens.imported_at).toLocaleString()}
        </span>
      </header>

      <Counts tokens={tokens} />

      {tokens.colors.length > 0 && (
        <section>
          <p style={sectionTitle}>Colors · {tokens.colors.length}</p>
          <ColorGrid colors={tokens.colors} />
        </section>
      )}

      {tokens.spacings.length > 0 && (
        <section>
          <p style={sectionTitle}>Spacings · {tokens.spacings.length}</p>
          <SpacingList spacings={tokens.spacings} />
        </section>
      )}

      {tokens.types.length > 0 && (
        <section>
          <p style={sectionTitle}>Types · {tokens.types.length}</p>
          <TypeList types={tokens.types} />
        </section>
      )}

      {tokens.radii.length > 0 && (
        <section>
          <p style={sectionTitle}>Radii · {tokens.radii.length}</p>
          <RadiusGrid radii={tokens.radii} />
        </section>
      )}

      {tokens.raw_warnings.length > 0 && (
        <section>
          <p style={sectionTitle}>Parser warnings · {tokens.raw_warnings.length}</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--mono)",
              lineHeight: 1.7,
            }}
          >
            {tokens.raw_warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Counts({ tokens }: { tokens: TokenSet }) {
  const counts: Array<[string, number]> = [
    ["colors",   tokens.colors.length],
    ["spacings", tokens.spacings.length],
    ["types",    tokens.types.length],
    ["radii",    tokens.radii.length],
    ["warnings", tokens.raw_warnings.length],
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {counts.map(([label, n]) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {label}
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 18, color: "var(--text-primary)" }}>
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}

function ColorGrid({ colors }: { colors: ColorToken[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 10,
      }}
    >
      {colors.map((c, i) => (
        <div
          key={`${c.name}-${i}`}
          style={{
            background: "var(--bg-elevated, #131316)",
            border: "var(--border-soft)",
            borderRadius: 6,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
          title={c.description ?? c.value_hex}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1.6 / 1",
              borderRadius: 4,
              background: c.value_hex,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text-primary)",
                wordBreak: "break-word",
              }}
            >
              {c.name}
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
              {c.value_hex}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacingList({ spacings }: { spacings: SpacingToken[] }) {
  // Find the max for proportional ruler scaling. Cap at 96 so a token
  // with value 256 doesn't dwarf the 4px tokens.
  const cap = 96;
  const max = Math.min(cap, Math.max(...spacings.map((s) => s.value_px), 1));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {spacings.map((s, i) => {
        const px = Math.min(s.value_px, cap);
        const pct = max > 0 ? (px / max) * 100 : 0;
        return (
          <div
            key={`${s.name}-${i}`}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(120px, 200px) 1fr 60px",
              gap: 12,
              alignItems: "center",
              padding: "6px 8px",
              background: "var(--bg-elevated, #131316)",
              borderRadius: 4,
            }}
          >
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-primary)" }}>
              {s.name}
            </span>
            <div
              aria-hidden
              style={{
                height: 8,
                background: "color-mix(in oklab, var(--accent, #4a7cff) 60%, transparent)",
                borderRadius: 2,
                width: `${pct}%`,
                minWidth: 2,
              }}
            />
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text-muted)",
                textAlign: "right",
              }}
            >
              {s.value_px}px
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TypeList({ types }: { types: TypeToken[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {types.map((t, i) => (
        <div
          key={`${t.name}-${i}`}
          style={{
            background: "var(--bg-elevated, #131316)",
            border: "var(--border-soft)",
            borderRadius: 6,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-primary)" }}>
              {t.name}
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
              {t.family} · w{t.weight} · {t.size_px}px / {t.line_height_px}px
            </span>
          </header>
          <p
            style={{
              margin: 0,
              fontFamily: t.family || "inherit",
              fontWeight: t.weight,
              fontSize: Math.min(t.size_px, 28),
              lineHeight: `${Math.min(t.line_height_px, 36)}px`,
              color: "var(--text-primary)",
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      ))}
    </div>
  );
}

function RadiusGrid({ radii }: { radii: RadiusToken[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
        gap: 10,
      }}
    >
      {radii.map((r, i) => (
        <div
          key={`${r.name}-${i}`}
          style={{
            background: "var(--bg-elevated, #131316)",
            border: "var(--border-soft)",
            borderRadius: 6,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              background: "color-mix(in oklab, var(--accent, #4a7cff) 35%, var(--bg-surface))",
              borderRadius: Math.min(r.value_px, 30),
              border: "1px solid color-mix(in oklab, var(--accent, #4a7cff) 50%, transparent)",
            }}
          />
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-primary)", textAlign: "center" }}>
            {r.name}
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
            {r.value_px}px
          </span>
        </div>
      ))}
    </div>
  );
}
