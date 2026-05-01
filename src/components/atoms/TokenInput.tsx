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

/** Visual mask helper — used by consumers to display stored tokens.
 *
 * Codex review #289 (P1) — the previous form revealed first 4 + last 4
 * unconditionally, so a 9-char token leaked 8 of its 9 characters in
 * plain view. Now: tokens of length ≤16 are fully masked, tokens 17-23
 * chars reveal only the last 4, and tokens ≥24 chars reveal 4+4
 * (the standard sk-XXXX...XXXX pattern). Always at least 8 mask dots so
 * a screenshot never exposes most of the secret.
 */
export function maskToken(key: string): string {
  const len = key.length;
  if (len === 0) return "";
  if (len <= 16) return "•".repeat(Math.max(8, len));
  if (len < 24) return `${"•".repeat(8)}${key.slice(-4)}`;
  return `${key.slice(0, 4)}${"•".repeat(Math.max(8, len - 8))}${key.slice(-4)}`;
}
