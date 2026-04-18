import { ReactNode } from "react";
import {
  useTweaks,
  ACCENT_SWATCHES,
  AccentKey,
  Theme,
  Mono,
  Sans,
  Density,
  Lang,
  CreationLayout,
  MemoryLayout,
  SchoolLayout,
} from "../tweaks/TweaksContext";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";

interface Props {
  open: boolean;
  onClose: () => void;
  chamber: Chamber;
}

export default function TweaksPanel({ open, onClose, chamber }: Props) {
  const { values, set, reset } = useTweaks();
  const { resetAll } = useSpine();

  if (!open) return null;

  return (
    <div
      className="fadeIn"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 30,
        width: 300,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
        boxShadow: "var(--shadow-md)",
        fontFamily: "var(--sans)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "var(--accent)",
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
          }}
        >
          Tweaks
        </span>
        <button
          onClick={onClose}
          style={{
            fontSize: 10,
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
            letterSpacing: 1,
          }}
        >
          CLOSE ×
        </button>
      </div>

      <Row label="Theme">
        {(["dark", "light", "sepia"] as Theme[]).map((t) => (
          <Chip key={t} active={values.theme === t} onClick={() => set("theme", t)}>
            {t.toUpperCase()}
          </Chip>
        ))}
      </Row>

      <Row label="Mono">
        {(
          [
            ["jetbrains", "JetBrains"],
            ["ibm", "IBM Plex"],
          ] as [Mono, string][]
        ).map(([k, l]) => (
          <Chip key={k} active={values.mono === k} onClick={() => set("mono", k)}>
            {l}
          </Chip>
        ))}
      </Row>

      <Row label="Sans">
        {(
          [
            ["inter", "Inter"],
            ["plex", "IBM Plex Sans"],
            ["system", "System"],
          ] as [Sans, string][]
        ).map(([k, l]) => (
          <Chip key={k} active={values.sans === k} onClick={() => set("sans", k)}>
            {l}
          </Chip>
        ))}
      </Row>

      <Row label="Density">
        {(
          [
            ["compact", "DENSE"],
            ["comfortable", "NORMAL"],
            ["spacious", "WIDE"],
          ] as [Density, string][]
        ).map(([k, l]) => (
          <Chip key={k} active={values.density === k} onClick={() => set("density", k)}>
            {l}
          </Chip>
        ))}
      </Row>

      <Row label="Accent">
        {ACCENT_SWATCHES.map((s) => (
          <Swatch
            key={s.key}
            color={s.color}
            active={values.accent === s.key}
            onClick={() => set("accent", s.key as AccentKey)}
          />
        ))}
      </Row>

      <Row label="Language">
        {(
          [
            ["pt", "PT"],
            ["en", "EN"],
          ] as [Lang, string][]
        ).map(([k, l]) => (
          <Chip key={k} active={values.lang === k} onClick={() => set("lang", k)}>
            {l}
          </Chip>
        ))}
      </Row>

      <div style={{ height: 1, background: "var(--border-subtle)", margin: "10px 0 12px" }} />

      <Row label={`${chamber} layout`}>
        {chamber === "Lab" && <Chip active onClick={() => {}}>chat</Chip>}
        {chamber === "Creation" &&
          (["terminal", "kanban"] as CreationLayout[]).map((l) => (
            <Chip
              key={l}
              active={values.creationLayout === l}
              onClick={() => set("creationLayout", l)}
            >
              {l}
            </Chip>
          ))}
        {chamber === "Memory" &&
          (["log", "timeline"] as MemoryLayout[]).map((l) => (
            <Chip
              key={l}
              active={values.memoryLayout === l}
              onClick={() => set("memoryLayout", l)}
            >
              {l}
            </Chip>
          ))}
        {chamber === "School" &&
          (["numbered", "tablets"] as SchoolLayout[]).map((l) => (
            <Chip
              key={l}
              active={values.schoolLayout === l}
              onClick={() => set("schoolLayout", l)}
            >
              {l}
            </Chip>
          ))}
      </Row>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button
          onClick={reset}
          style={{
            fontSize: 10,
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          reset tweaks
        </button>
        <button
          onClick={() => {
            if (confirm("Reset spine? Missões, notas, tarefas e princípios serão apagados.")) {
              resetAll();
            }
          }}
          style={{
            fontSize: 10,
            color: "var(--cc-err)",
            fontFamily: "var(--mono)",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          reset spine
        </button>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "var(--text-ghost)",
          fontFamily: "var(--mono)",
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 10,
        letterSpacing: 1,
        fontFamily: "var(--mono)",
        padding: "4px 10px",
        color: active ? "var(--accent)" : "var(--text-muted)",
        background: active ? "var(--accent-glow)" : "transparent",
        border: `1px solid ${active ? "var(--accent-dim)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        textTransform: "uppercase",
        transition: "all .15s",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Swatch({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="accent"
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: color,
        border: active ? "2px solid var(--accent)" : "1px solid var(--border)",
        boxShadow: active ? "0 0 0 2px var(--bg)" : "none",
        cursor: "pointer",
        padding: 0,
      }}
    />
  );
}
