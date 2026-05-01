# Design Tokens — Wave P-33

Single source of truth for every visual primitive in the Signal shell.
The TS modules under `src/design/*` own the data. The boot-time
`injectCssVariables()` call materialises that data into CSS custom
properties on `:root`, so the static stylesheet
(`src/styles/tokens.css`) and any inline `style={{ … "var(--…)" }}`
resolve through one and the same source.

```
┌──────────────────────────────────────────────────────────────────┐
│  src/design/tokens.ts       — space, radius, shadow, color,      │
│                               motion, font, track                │
│  src/design/typography.ts   — scale, weight, leading             │
│  src/design/css-vars.ts     — buildCssVariables() + inject…()    │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ▼ runtime (src/main.tsx → boot)
                  document.documentElement.style.setProperty(…)
                               │
                               ▼ cascade
        every component reads `var(--token-name)` exclusively
```

---

## Spacing — `--space-N`

| Token         | px  | Use                                           |
|---------------|-----|-----------------------------------------------|
| `--space-0`   | 0   | reset, no-gap rows                            |
| `--space-1`   | 8   | inline gap, dense lists (legacy canon)        |
| `--space-2`   | 12  | label ↔ control                                |
| `--space-3`   | 16  | card padding, control gap                     |
| `--space-4`   | 24  | panel gutter                                  |
| `--space-5`   | 32  | section break                                 |
| `--space-6`   | 48  | chamber padding                               |
| `--space-7`   | 64  | hero margin                                   |
| `--space-8`   | 32  | new ramp — alias of legacy 5                  |
| `--space-9`   | 40  | landing rail rhythm                           |
| `--space-10`  | 56  | hero block gutter                             |
| `--space-11`  | 72  | hero vertical                                 |
| `--space-12`  | 96  | landing top/bottom margin                     |

Note: `--space-1..7` keep their legacy pixel values for back-compat
(8 / 12 / 16 / 24 / 32 / 48 / 64). The new ramp adds the missing rungs
(0, then 32 → 96 in five steps) used by landing/hero surfaces.

---

## Radius — `--radius-*`

| Token            | px    | Use                                  |
|------------------|-------|--------------------------------------|
| `--radius-sm`    | 4     | chips, micro pills                   |
| `--radius-md`    | 6     | inputs, mid-density tiles            |
| `--radius-lg`    | 10    | cards, popovers                      |
| `--radius-full`  | 9999  | round buttons, status pills          |
| `--radius-control` | 16  | (legacy) control-sized surface       |
| `--radius-panel`   | 22  | (legacy) panel-sized surface         |
| `--radius-shell`   | 28  | (legacy) shell-sized surface         |

---

## Shadow — `--shadow-*`

| Token           | When                                      |
|-----------------|-------------------------------------------|
| `--shadow-sm`   | flat surface lift (1 px halo)             |
| `--shadow-md`   | floating card / panel                     |
| `--shadow-lg`   | modal / dropdown anchor                   |
| `--shadow-focus`| keyboard focus halo                       |
| `--shadow-soft` | (legacy) sm equivalent                    |
| `--shadow-panel`| (legacy) md equivalent                    |
| `--shadow-float`| (legacy) lg equivalent                    |

---

## Color — semantic

```
bg ────────── #08080a   page background
surface ───── #131316   card / panel
surface-soft  #1c1c20   elevated panel
border ────── rgba(255,255,255,.13)
border-soft   rgba(255,255,255,.07)
text-primary  #ffffff
text-muted ── #b0b0b8
text-ghost ── #3a3a42
accent ───── #ffffff
danger ───── #d4785a
warn ─────── #d8b058
ok ───────── #7ab48a
```

Theme switching (`[data-theme="light|sepia"]`) overrides these in
`tokens.css`; the TS layer ships dark as the default.

---

## Motion — duration & easing

| Token                       | Value                            | Use                            |
|-----------------------------|----------------------------------|--------------------------------|
| `--motion-duration-fast`    | 120 ms                           | hover, micro-tint              |
| `--motion-duration-normal`  | 200 ms                           | enter / exit                   |
| `--motion-duration-slow`    | 360 ms                           | layout reveal                  |
| `--motion-ease-out`         | cubic-bezier(0.2, 0, 0, 1)       | entries                        |
| `--motion-ease-inout`       | cubic-bezier(0.4, 0, 0.2, 1)     | in-place transforms            |
| `--motion-ease-spring`      | cubic-bezier(0.34, 1.56, 0.64, 1)| notification surfaces          |

Legacy `--dur-fast|normal|slow` and `--ease-swift` stay for back-compat.

---

## Typography — modular scale 1.125

| Token            | px  | Role                                             |
|------------------|-----|--------------------------------------------------|
| `--t-meta`       | 11  | tooltips, badges, dense meta                     |
| `--t-kicker`     | 12  | uppercase labels above headings                  |
| `--t-body`       | 14  | running text (default)                           |
| `--t-prominent`  | 16  | callouts, lead paragraphs                        |
| `--t-title`      | 20  | section titles                                   |
| `--t-display`    | 28  | chamber heads                                    |
| `--t-hero`       | 40  | landing hero                                     |
| `--t-micro`      | 9   | (legacy) corner annotations                      |

### Leading

| Token                | Value | Use                                      |
|----------------------|-------|------------------------------------------|
| `--leading-tight`    | 1.2   | display / kicker / single-line meta      |
| `--leading-normal`   | 1.5   | body, labels                             |
| `--leading-loose`    | 1.7   | long-form reads                          |

### Weight

| Token                | Value |
|----------------------|-------|
| `--weight-regular`   | 400   |
| `--weight-medium`    | 500   |

---

## Letter-spacing — `--track-*`

| Token            | em      | Role                              |
|------------------|---------|-----------------------------------|
| `--track-meta-new` |  0.06 | meta labels                       |
| `--track-body-new` | -0.005| body copy                         |
| `--track-display-new` | -0.01 | headlines                       |

Legacy `--track-tight|normal|meta|label|kicker` continue to work.

---

## Authoring rules

- Never inline a hex color, pixel size, ms value or radius. Reach for
  the matching `var(--…)` token or — if the value is genuinely new —
  add it to `src/design/tokens.ts` first.
- `npx tsc --noEmit` enforces the typed token shapes (`SpaceKey`,
  `RadiusKey`, …). If a key isn't in the union, the build fails.
- Theme variants only override the `color` group; structure is invariant.
