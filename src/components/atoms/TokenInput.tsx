// Wave P-45 — TokenInput atom.
//
// Password-style input with reveal/hide toggle and a controlled value.
// Used by SettingsPage › api-keys and ConnectorsPage detail. Honest
// affordance: the masked state is visual only — the underlying string
// is always the same.

import { useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function TokenInput({
  value, onChange, onSubmit, placeholder = "••••••••", ariaLabel, disabled, autoFocus,
}: Props) {
  const [reveal, setReveal] = useState(false);
  return (
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      <input
        type={reveal ? "text" : "password"}
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        spellCheck={false}
        autoComplete="off"
        style={{
          flex: 1,
          padding: "var(--space-2)",
          fontFamily: "var(--mono)",
          fontSize: "var(--t-body)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-surface, transparent)",
          color: "var(--text-primary)",
        }}
      />
      <button
        type="button"
        onClick={() => setReveal((r) => !r)}
        disabled={disabled}
        className="btn"
        style={{ padding: "var(--space-2) var(--space-3)" }}
      >
        {reveal ? "ocultar" : "revelar"}
      </button>
    </div>
  );
}

/** Visual mask helper — used by consumers to display stored tokens. */
export function maskToken(key: string): string {
  if (key.length <= 8) return "•".repeat(key.length);
  return `${key.slice(0, 4)}${"•".repeat(8)}${key.slice(-4)}`;
}
