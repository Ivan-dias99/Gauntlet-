/**
 * RUBERRA Content Card System
 * Modular card families for all three chambers.
 * Premium, mineral, typographic-first.
 */

import React from "react";
import { ChevronRight, Clock, BookOpen, Layers, Zap, Beaker, BarChart2, Lock } from "lucide-react";
import { R } from "./tokens";

// ─── Card Visual Area ─────────────────────────────────────────────────────────
// Generates a subtle chamber-tinted visual placeholder
interface CardVisualProps {
  accent: string;
  accentLight: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  pattern?: "grid" | "lines" | "dots" | "solid";
}

export function CardVisual({
  accent,
  accentLight,
  icon,
  size = "md",
  pattern = "solid",
}: CardVisualProps) {
  const heights = { sm: "80px", md: "108px", lg: "140px" };

  return (
    <div
      style={{
        width: "100%",
        height: heights[size],
        background: accentLight,
        borderRadius: `${R.r.lg} ${R.r.lg} 0 0`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Subtle pattern layer */}
      {pattern === "grid" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(color-mix(in srgb, ${accent} 14%, transparent) 1px, transparent 1px),
              linear-gradient(90deg, color-mix(in srgb, ${accent} 14%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "16px 16px",
          }}
        />
      )}
      {pattern === "lines" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 6px,
              color-mix(in srgb, ${accent} 10%, transparent) 6px,
              color-mix(in srgb, ${accent} 10%, transparent) 7px
            )`,
          }}
        />
      )}
      {pattern === "dots" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle, color-mix(in srgb, ${accent} 16%, transparent) 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        />
      )}

      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "48px",
          height: "48px",
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          borderRadius: "48px 0 0 0",
        }}
      />

      {/* Icon */}
      {icon && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "32px",
            height: "32px",
            borderRadius: "2px",
            background: `color-mix(in srgb, ${accent} 18%, var(--r-surface))`,
            border: `1px solid color-mix(in srgb, ${accent} 28%, var(--r-border))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}

// ─── Base Card Shell ───────────────────────────────────────────────────────────
interface CardShellProps {
  onClick?: () => void;
  children: React.ReactNode;
  width?: number | string;
  style?: React.CSSProperties;
}

export function CardShell({ onClick, children, width = 220, style }: CardShellProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        flexShrink: 0,
        borderRadius: R.r.xl,
        border: `1px solid ${hovered ? "var(--r-border)" : "var(--r-border-soft)"}`,
        background: "var(--r-surface)",
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered
          ? "0 4px 14px color-mix(in srgb, var(--r-text) 7%, transparent), 0 1px 4px color-mix(in srgb, var(--r-text) 5%, transparent)"
          : "0 1px 2px color-mix(in srgb, var(--r-text) 5%, transparent)",
        transform: hovered && onClick ? "translateY(-1px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Card Body ─────────────────────────────────────────────────────────────────
export function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  );
}

// ─── Card Tag ─────────────────────────────────────────────────────────────────
export function CardTag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px 7px",
        borderRadius: R.r.sm,
        background: `color-mix(in srgb, ${color} 14%, var(--r-surface))`,
        border: `1px solid color-mix(in srgb, ${color} 26%, var(--r-border))`,
        ...R.t.label,
        color,
        fontFamily: "'Inter', sans-serif",
        marginBottom: "7px",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

// ─── Card Title ───────────────────────────────────────────────────────────────
export function CardTitle({
  children,
  lines = 2,
}: {
  children: React.ReactNode;
  lines?: number;
}) {
  return (
    <p
      style={{
        ...R.t.uiMed,
        color: R.ink,
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.4",
        marginBottom: "6px",
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {children}
    </p>
  );
}

// ─── Card Meta ────────────────────────────────────────────────────────────────
export function CardMeta({ items }: { items: { icon?: React.ReactNode; label: string }[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <div
              style={{
                width: "2px",
                height: "2px",
                borderRadius: "50%",
                background: R.ink5,
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            {item.icon}
            <span
              style={{
                ...R.t.micro,
                color: R.ink4,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {item.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Card Progress ────────────────────────────────────────────────────────────
export function CardProgress({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label?: string;
}) {
  return (
    <div style={{ marginTop: "10px" }}>
      <div
        style={{
          height: "2px",
          background: R.hairline,
          borderRadius: "2px",
          overflow: "hidden",
          marginBottom: label ? "4px" : "0",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: "2px",
          }}
        />
      </div>
      {label && (
        <span
          style={{
            ...R.t.micro,
            color: R.ink4,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Specific Card Families ────────────────────────────────────────────────────

// COURSE CARD (School)
interface CourseCardProps {
  title: string;
  type: string;
  lessons: number;
  duration: string;
  level: string;
  progress?: number;
  locked?: boolean;
  /** One-line learning invitation — structured path, not filler */
  preview?: string;
  onClick?: () => void;
  pattern?: "grid" | "lines" | "dots" | "solid";
}

export function CourseCard({
  title,
  type,
  lessons,
  duration,
  level,
  progress,
  locked,
  preview,
  onClick,
  pattern = "grid",
}: CourseCardProps) {
  const accent = "var(--chamber-school)";
  const accentLight = "var(--chamber-school-light)";
  return (
    <CardShell onClick={!locked ? onClick : undefined} width={228}>
      <CardVisual
        accent={accent}
        accentLight={accentLight}
        pattern={pattern}
        icon={
          locked ? (
            <Lock size={14} color={R.school} strokeWidth={1.5} />
          ) : (
            <BookOpen size={14} color={R.school} strokeWidth={1.5} />
          )
        }
        size="md"
      />
      <CardBody>
        <CardTag label={type} color={accent} />
        <CardTitle>{title}</CardTitle>
        {preview && (
          <p
            style={{
              ...R.t.micro,
              color: R.ink3,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.45,
              margin: "0 0 8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {preview}
          </p>
        )}
        <CardMeta
          items={[
            {
              icon: <Layers size={9} color={R.ink5} strokeWidth={1.5} />,
              label: `${lessons} lessons`,
            },
            { icon: <Clock size={9} color={R.ink5} strokeWidth={1.5} />, label: duration },
            { label: level },
          ]}
        />
        {progress !== undefined && (
          <CardProgress
            value={progress}
            color={accent}
            label={progress > 0 ? `${progress}% complete` : "Not started"}
          />
        )}
        {locked && (
          <div
            style={{
              marginTop: "8px",
              padding: "3px 8px",
              borderRadius: R.r.sm,
              background: 'var(--r-elevated)',
              ...R.t.micro,
              color: R.ink5,
              fontFamily: "'Inter', sans-serif",
              display: "inline-block",
            }}
          >
            Complete prior module to unlock
          </div>
        )}
      </CardBody>
    </CardShell>
  );
}

// EXPERIMENT CARD (Lab)
interface ExperimentCardProps {
  title: string;
  type: string;
  domain: string;
  tools: string[];
  complexity: "Low" | "Medium" | "High";
  /** One-line invitation — real substance, not generic */
  preview?: string;
  onClick?: () => void;
  pattern?: "grid" | "lines" | "dots" | "solid";
}

export function ExperimentCard({
  title,
  type,
  domain,
  tools,
  complexity,
  preview,
  onClick,
  pattern = "dots",
}: ExperimentCardProps) {
  const accent = "var(--chamber-lab)";
  const accentLight = "var(--chamber-lab-light)";
  const complexityColor =
    complexity === "High" ? "var(--chamber-creation)" : complexity === "Medium" ? accent : R.ink4;
  const invite = preview ?? `${domain} · ${tools.slice(0, 2).join(" · ")}`;
  return (
    <CardShell onClick={onClick} width={228}>
      <CardVisual
        accent={accent}
        accentLight={accentLight}
        pattern={pattern}
        icon={<BarChart2 size={14} color={R.lab} strokeWidth={1.5} />}
        size="md"
      />
      <CardBody>
        <CardTag label={type} color={accent} />
        <CardTitle>{title}</CardTitle>
        <p
          style={{
            ...R.t.micro,
            color: R.ink3,
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.45,
            margin: "0 0 8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {invite}
        </p>
        <div style={{ marginBottom: "6px" }}>
          <span
            style={{
              ...R.t.micro,
              color: R.ink5,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            {domain}
          </span>
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "auto" }}>
          {tools.map((t) => (
            <span
              key={t}
              style={{
                padding: "1px 6px",
                borderRadius: R.r.sm,
                border: `1px solid ${R.hairline}`,
                background: 'var(--r-elevated)',
                ...R.t.micro,
                color: R.ink4,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              padding: "1px 6px",
              borderRadius: R.r.sm,
                border: `1px solid color-mix(in srgb, ${complexityColor} 22%, var(--r-border))`,
                background: `color-mix(in srgb, ${complexityColor} 10%, var(--r-surface))`,
              ...R.t.micro,
              color: complexityColor,
              fontFamily: "'Inter', sans-serif",
              marginLeft: "auto",
            }}
          >
            {complexity}
          </span>
        </div>
      </CardBody>
    </CardShell>
  );
}

// BLUEPRINT CARD (Creation)
interface BlueprintCardProps {
  title: string;
  type: string;
  outputType: string;
  description: string;
  tags: string[];
  /** Terminal-native path hint (e.g. blueprint → execution field) */
  artifactPath?: string;
  onClick?: () => void;
  pattern?: "grid" | "lines" | "dots" | "solid";
}

export function BlueprintCard({
  title,
  type,
  outputType,
  description,
  tags,
  artifactPath,
  onClick,
  pattern = "lines",
}: BlueprintCardProps) {
  const accent = "var(--chamber-creation)";
  const accentLight = "var(--chamber-creation-light)";
  return (
    <CardShell onClick={onClick} width={228}>
      <CardVisual
        accent={accent}
        accentLight={accentLight}
        pattern={pattern}
        icon={<Zap size={14} color={R.creation} strokeWidth={1.5} />}
        size="md"
      />
      <CardBody>
        <CardTag label={type} color={accent} />
        <CardTitle>{title}</CardTitle>
        <p
          style={{
            ...R.t.micro,
            color: R.ink4,
            fontFamily: "'Inter', sans-serif",
            lineHeight: "1.5",
            marginBottom: "8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        {artifactPath && (
          <p
            style={{
              ...R.t.micro,
              color: accent,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
              margin: "0 0 8px",
              opacity: 0.9,
            }}
          >
            {artifactPath}
          </p>
        )}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "auto" }}>
          {tags.map((t) => (
            <span
              key={t}
              style={{
                padding: "1px 6px",
                borderRadius: R.r.sm,
                border: `1px solid ${R.hairline}`,
                background: 'var(--r-elevated)',
                ...R.t.micro,
                color: R.ink4,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </CardBody>
    </CardShell>
  );
}

// COLLECTION CARD (wide, for featured rails)
interface CollectionCardProps {
  title: string;
  subtitle: string;
  itemCount: number;
  accent: string;
  accentLight: string;
  tag: string;
  icon: React.ReactNode;
  /** Short invitation line under subtitle */
  invite?: string;
  onClick?: () => void;
}

export function CollectionCard({
  title,
  subtitle,
  itemCount,
  accent,
  accentLight,
  tag,
  icon,
  invite,
  onClick,
}: CollectionCardProps) {
  return (
    <CardShell onClick={onClick} width={280}>
      <CardVisual
        accent={accent}
        accentLight={accentLight}
        pattern="grid"
        icon={icon}
        size="sm"
      />
      <CardBody>
        <CardTag label={tag} color={accent} />
        <CardTitle lines={1}>{title}</CardTitle>
        <p
          style={{
            ...R.t.micro,
            color: R.ink4,
            fontFamily: "'Inter', sans-serif",
            marginBottom: invite ? "4px" : "8px",
          }}
        >
          {subtitle}
        </p>
        {invite && (
          <p
            style={{
              ...R.t.micro,
              color: R.ink3,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.45,
              margin: "0 0 8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {invite}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              ...R.t.micro,
              color: R.ink4,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {itemCount} items
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              ...R.t.micro,
              color: accent,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            Explore
            <ChevronRight size={10} color={accent} strokeWidth={2} />
          </div>
        </div>
      </CardBody>
    </CardShell>
  );
}

// ROLE / TRACK CARD (for future roles, career paths)
interface RoleCardProps {
  role: string;
  domain: string;
  skills: string[];
  demand: "Emerging" | "High" | "Critical";
  /** Role pathway substance */
  preview?: string;
  onClick?: () => void;
}

export function RoleCard({ role, domain, skills, demand, preview, onClick }: RoleCardProps) {
  const demandColor =
    demand === "Critical" ? "var(--r-warn)" : demand === "High" ? "var(--chamber-school)" : R.ink3;

  return (
    <CardShell onClick={onClick} width={216}>
      <CardBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              padding: "2px 7px",
              borderRadius: R.r.sm,
              background: `color-mix(in srgb, ${demandColor} 12%, var(--r-surface))`,
              border: `1px solid color-mix(in srgb, ${demandColor} 22%, var(--r-border))`,
              ...R.t.label,
              color: demandColor,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {demand}
          </span>
        </div>
        <CardTitle lines={2}>{role}</CardTitle>
        <p
          style={{
            ...R.t.micro,
            color: R.ink4,
            fontFamily: "'Inter', sans-serif",
            marginBottom: preview ? "6px" : "10px",
          }}
        >
          {domain}
        </p>
        {preview && (
          <p
            style={{
              ...R.t.micro,
              color: R.ink3,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.45,
              margin: "0 0 10px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {preview}
          </p>
        )}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {skills.slice(0, 3).map((s) => (
            <span
              key={s}
              style={{
                padding: "1px 6px",
                borderRadius: R.r.sm,
                border: `1px solid ${R.hairline}`,
                background: 'var(--r-elevated)',
                ...R.t.micro,
                color: R.ink4,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </CardBody>
    </CardShell>
  );
}

// SIGNAL CARD (Lab — ambient intelligence signals)
interface SignalCardProps {
  signal: string;
  source: string;
  category: string;
  recency: string;
  relevance: "High" | "Medium" | "Low";
  onClick?: () => void;
}

export function SignalCard({
  signal,
  source,
  category,
  recency,
  relevance,
  onClick,
}: SignalCardProps) {
  const labAccent = "var(--chamber-lab)";
  const relevanceColor =
    relevance === "High" ? labAccent : relevance === "Medium" ? "var(--chamber-school)" : R.ink4;

  return (
    <CardShell onClick={onClick} width={248}>
      <CardBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <CardTag label={category} color={labAccent} />
          <span
            style={{
              ...R.t.micro,
              color: R.ink5,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {recency}
          </span>
        </div>
        <p
          style={{
            ...R.t.body,
            color: "var(--r-text)",
            fontFamily: "'Inter', sans-serif",
            lineHeight: "1.52",
            marginBottom: "6px",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {signal}
        </p>
        <p
          style={{
            ...R.t.micro,
            color: labAccent,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.05em",
            margin: "0 0 10px",
            opacity: 0.85,
          }}
        >
          Trace in domain →
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "8px",
            borderTop: "1px solid var(--r-border-soft)",
          }}
        >
          <span
            style={{
              ...R.t.micro,
              color: R.ink4,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.03em",
            }}
          >
            {source}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: relevanceColor,
              }}
            />
            <span
              style={{
                ...R.t.micro,
                color: relevanceColor,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {relevance} relevance
            </span>
          </div>
        </div>
      </CardBody>
    </CardShell>
  );
}
