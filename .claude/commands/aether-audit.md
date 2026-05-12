---
description: Audit packages/composer/src/ for hard-coded values that should be Aether tokens. Reports drift from ADR-0005 canon.
allowed-tools:
  - Bash(grep *)
  - Bash(rg *)
  - Bash(find *)
  - Bash(cat *)
---

# /aether-audit

Find hard-coded visual values in the shared Composer that should be reading Aether v1 tokens (`--gx-*` or `--gauntlet-*`). Per ADR-0005, every visual constant in `packages/composer/src/` reads from a token — no hex, no `px`, no `rem`, no `cubic-bezier`, no font family inline.

## What gets flagged

| Category | Pattern | Why flagged |
|---|---|---|
| Hex colors | `#[0-9a-fA-F]{3,8}` | Must be a token (`var(--gx-bg)`, `var(--gx-ember)`, etc.) |
| RGB / RGBA | `rgba?\(...\)` | Same reason |
| HSL / HSLA | `hsla?\(...\)` | Same reason |
| Pixel sizes (in style props) | `:\s*\d+px` (font-size, padding, margin, radius) | Use spacing / type / radius tokens |
| Rem sizes | `:\s*[\d.]+rem` | Use type scale tokens |
| Font families | `font-family:\s*"[^"]*"` | Only Fraunces / Inter / JetBrains Mono — via `--gx-font-{display,sans,mono}` |
| Custom cubic-bezier | `cubic-bezier\([^)]+\)` outside `aether.css` / `capsule.css.ts` | Use `--gx-ease-{out,in-out,spring}` |
| Duration | `\d+ms` in style/transition | Use `--gx-dur-{fast,normal,slow}` |

**Exclusions** (these may legitimately have raw values):
- `packages/composer/src/capsule.css.ts` — defines the tokens themselves
- `control-center/styles/tokens.css` — defines the tokens
- `control-center/design/` — typed token graph

## Steps

1. Grep for hex colors in shared composer:

```bash
echo "── HEX COLORS ──"
grep -rnE '#[0-9a-fA-F]{3,8}\b' packages/composer/src/ \
  --include='*.tsx' --include='*.ts' \
  | grep -v 'capsule.css.ts' \
  | grep -v -E '/\*.*#[0-9a-fA-F]+.*\*/' \
  | head -40
```

2. Grep for rgb/rgba/hsl/hsla:

```bash
echo "── RGB/RGBA/HSL/HSLA ──"
grep -rnE 'rgba?\(|hsla?\(' packages/composer/src/ \
  --include='*.tsx' --include='*.ts' \
  | grep -v 'capsule.css.ts' \
  | head -30
```

3. Grep for hard-coded pixel values in style props:

```bash
echo "── INLINE PX SIZES ──"
grep -rnE 'style=\{?\{[^}]*:\s*[''"]?\d+px' packages/composer/src/ \
  --include='*.tsx' \
  | head -30
```

4. Grep for non-canonical font families:

```bash
echo "── FONTS (must be Fraunces / Inter / JetBrains Mono only) ──"
grep -rnE 'font-family|fontFamily' packages/composer/src/ \
  --include='*.tsx' --include='*.ts' \
  | grep -v 'capsule.css.ts' \
  | grep -v -E '(Fraunces|Inter|JetBrains Mono)' \
  | head -20
```

5. Grep for inline cubic-bezier outside the canon files:

```bash
echo "── INLINE CUBIC-BEZIER ──"
grep -rnE 'cubic-bezier' packages/composer/src/ \
  --include='*.tsx' --include='*.ts' \
  | grep -v 'capsule.css.ts' \
  | head -10
```

6. Grep for hard-coded transition durations in style props:

```bash
echo "── INLINE DURATIONS ──"
grep -rnE 'transition|animation' packages/composer/src/ \
  --include='*.tsx' --include='*.ts' \
  | grep -vE '\-\-gx\-dur|var\(--gx' \
  | grep -vE 'capsule\.css\.ts' \
  | grep -vE '/\*.*\*/' \
  | head -20
```

7. Aggregate the report:

```
AETHER AUDIT · packages/composer/src/
  hex colors:        <N> hits
  rgb/hsl:           <N> hits
  inline px:         <N> hits
  non-canon fonts:   <N> hits
  inline beziers:    <N> hits
  inline durations:  <N> hits
  --------------------------------
  total drift:       <SUM>

  verdict: <CLEAN | DRIFT-FOUND>

  [if DRIFT-FOUND]
  per-file breakdown (top offenders):
    packages/composer/src/<file>.tsx       <count> hits
    packages/composer/src/<file>.tsx       <count> hits

  next move:
    1. Open each flagged file
    2. Replace hard-coded values with the appropriate Aether token
       (see ADR-0005 for the token surface)
    3. Re-run /aether-audit until verdict = CLEAN
```

## When to suggest invoking

- After any visual change to `packages/composer/src/`
- When `aether-guardian` agent flags a token drift
- Before opening a PR touching shared composer
- As part of `/release-prep` — token integrity is a release gate

## Closure

Not closed until verdict = CLEAN. Hard-coded values that "look fine on the screenshot" are tomorrow's token drift. Audit before commit.

## Anti-patterns

- "It's just one color, who cares" — Aether canon has zero second brand color (ADR-0005)
- "It's faster to inline" — token reference is also one identifier; same speed
- "The Storybook examples don't need to read from tokens" — they do; Storybook is the design system's own showcase
- Adjusting the audit script to silence findings — fix the code, not the audit
