// Wave P-45 — Segmented control atom.
//
// Inline-flex row of toggle buttons sharing a single value. Used by
// SettingsPage › preferences for theme/density/font/language and any
// future picker that needs N exclusive options on one row. Pure
// presentation; consumers own the value state.

interface Option<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface Props<T extends string> {
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
}

export default function Segmented<T extends string>({
  options, value, onChange, ariaLabel,
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{ display: "inline-flex", gap: 0, flexWrap: "wrap" }}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        const isFirst = i === 0;
        const isLast = i === options.length - 1;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            style={{
              padding: "var(--space-2) var(--space-3)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body-sec)",
              color: selected ? "var(--text-primary)" : "var(--text-muted)",
              border: "1px solid var(--border-soft)",
              borderRight: isLast ? "1px solid var(--border-soft)" : "none",
              borderRadius:
                isFirst ? "var(--radius-sm) 0 0 var(--radius-sm)" :
                isLast  ? "0 var(--radius-sm) var(--radius-sm) 0" : 0,
              background: selected
                ? "color-mix(in oklab, var(--text-primary) 8%, transparent)"
                : "transparent",
              cursor: o.disabled ? "not-allowed" : "pointer",
              opacity: o.disabled ? 0.5 : 1,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
