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
import { useCopy } from "../i18n/copy";

interface Props {
  open: boolean;
  onClose: () => void;
  chamber: Chamber;
}

export default function TweaksPanel({ open, onClose, chamber }: Props) {
  const { values, set, reset } = useTweaks();
  const { resetAll } = useSpine();
  const copy = useCopy();

  if (!open) return null;

  return (
    <div
      className="fadeIn"
      role="dialog"
      aria-label={copy.tweaksTitle}
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 30,
        width: 320,
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-3)",
        boxShadow: "var(--shadow-panel)",
        fontFamily: "var(--sans)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "var(--space-3)",
        }}
      >
        <span
          style={{
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-kicker)",
            color: "var(--accent)",
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
          }}
        >
          {copy.tweaksTitle}
        </span>
        <button
          onClick={onClose}
          style={{
            fontSize: "var(--t-micro)",
            color: "var(--text-muted)",
            fontFamily: "var(--mono)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
          }}
        >
          {copy.tweaksClose}
        </button>
      </div>

      <Segmented
        label="Theme"
        value={values.theme}
        options={[
          ["dark", "DARK"],
          ["light", "LIGHT"],
          ["sepia", "SEPIA"],
        ] as Array<[Theme, string]>}
        onChange={(v) => set("theme", v)}
      />

      <Segmented
        label="Mono"
        value={values.mono}
        options={[
          ["jetbrains", "JETBRAINS"],
          ["ibm", "IBM PLEX"],
        ] as Array<[Mono, string]>}
        onChange={(v) => set("mono", v)}
      />

      <Segmented
        label="Sans"
        value={values.sans}
        options={[
          ["inter", "INTER"],
          ["plex", "PLEX"],
          ["system", "SYSTEM"],
        ] as Array<[Sans, string]>}
        onChange={(v) => set("sans", v)}
      />

      <Segmented
        label="Density"
        value={values.density}
        options={[
          ["compact", "DENSE"],
          ["comfortable", "NORMAL"],
          ["spacious", "WIDE"],
        ] as Array<[Density, string]>}
        onChange={(v) => set("density", v)}
      />

      <Row label="Accent">
        <div style={{ display: "flex", gap: 8 }}>
          {ACCENT_SWATCHES.map((s) => (
            <Swatch
              key={s.key}
              color={s.color}
              active={values.accent === s.key}
              onClick={() => set("accent", s.key as AccentKey)}
            />
          ))}
        </div>
      </Row>

      <Segmented
        label="Language"
        value={values.lang}
        options={[
          ["pt", "PT"],
          ["en", "EN"],
        ] as Array<[Lang, string]>}
        onChange={(v) => set("lang", v)}
      />

      {chamber === "Creation" && (
        <Segmented
          label="Creation layout"
          value={values.creationLayout}
          options={[
            ["terminal", "TERMINAL"],
            ["kanban", "KANBAN"],
          ] as Array<[CreationLayout, string]>}
          onChange={(v) => set("creationLayout", v)}
        />
      )}
      {chamber === "Memory" && (
        <Segmented
          label="Memory layout"
          value={values.memoryLayout}
          options={[
            ["log", "LOG"],
            ["timeline", "TIMELINE"],
          ] as Array<[MemoryLayout, string]>}
          onChange={(v) => set("memoryLayout", v)}
        />
      )}
      {chamber === "School" && (
        <Segmented
          label="School layout"
          value={values.schoolLayout}
          options={[
            ["numbered", "NUMBERED"],
            ["tablets", "TABLETS"],
          ] as Array<[SchoolLayout, string]>}
          onChange={(v) => set("schoolLayout", v)}
        />
      )}

      <div style={{
        display: "flex",
        gap: "var(--space-3)",
        marginTop: "var(--space-3)",
        paddingTop: "var(--space-2)",
        borderTop: "var(--border-soft)",
      }}>
        <button
          onClick={reset}
          style={{
            fontSize: "var(--t-micro)",
            color: "var(--text-muted)",
            fontFamily: "var(--mono)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
          }}
        >
          {copy.resetTweaks}
        </button>
        <button
          onClick={() => {
            if (confirm(copy.resetSpineConfirm)) {
              resetAll();
            }
          }}
          style={{
            fontSize: "var(--t-micro)",
            color: "var(--cc-err)",
            fontFamily: "var(--mono)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
          }}
        >
          {copy.resetSpine}
        </button>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="control-row">
      <span className="control-row-label">{label}</span>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<[T, string]>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="control-row">
      <span className="control-row-label">{label}</span>
      <div className="segmented" role="radiogroup" aria-label={label}>
        {options.map(([k, l]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={value === k}
            data-active={value === k ? "true" : undefined}
            onClick={() => onChange(k)}
            className="segmented-opt"
          >
            {l}
          </button>
        ))}
      </div>
    </div>
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
      aria-pressed={active}
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: color,
        border: active ? "2px solid var(--accent)" : "var(--border-soft)",
        boxShadow: active ? "0 0 0 2px var(--bg-elevated)" : "none",
        cursor: "pointer",
        padding: 0,
      }}
    />
  );
}
