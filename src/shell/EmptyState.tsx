import { CSSProperties } from "react";

type Tone = "default" | "warn";

interface Props {
  glyph?: string;
  kicker?: string;
  body: string;
  hint?: string;
  tone?: Tone;
  style?: CSSProperties;
}

const TONE_KICKER: Record<Tone, string> = {
  default: "var(--text-ghost)",
  warn: "var(--cc-warn)",
};

export default function EmptyState({
  glyph,
  kicker,
  body,
  hint,
  tone = "default",
  style,
}: Props) {
  return (
    <div
      data-empty-state
      data-empty-tone={tone}
      style={{
        alignSelf: "center",
        textAlign: "center",
        maxWidth: 520,
        ...style,
      }}
    >
      {glyph && (
        <div
          data-empty-glyph
          aria-hidden
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 52,
            color: "var(--text-ghost)",
            marginBottom: 24,
            opacity: 0.55,
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {glyph}
        </div>
      )}
      {kicker && (
        <div
          data-empty-kicker
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: ".4em",
            color: TONE_KICKER[tone],
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {kicker}
        </div>
      )}
      <div
        data-empty-body
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontStyle: "italic",
          fontSize: 20,
          lineHeight: 1.4,
          color: "var(--text-muted)",
          letterSpacing: "-0.005em",
        }}
      >
        {body}
      </div>
      {hint && (
        <div
          data-empty-hint
          style={{
            marginTop: 24,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: 1.5,
            color: "var(--text-ghost)",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
