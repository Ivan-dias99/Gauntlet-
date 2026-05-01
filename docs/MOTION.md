# Motion grammar (Wave P-34)

Signal moves on purpose. Every state change earns an entry/exit; every
press has feedback. Reduced-motion users see nothing animate.

This document is the canon. Reach for these tokens, classes, and
primitives instead of inventing local timing.

---

## 1. Tokens

Declared in `src/styles/tokens.css` under `:root`:

| Token                       | Value                              | Use                                  |
| --------------------------- | ---------------------------------- | ------------------------------------ |
| `--motion-duration-fast`    | `120ms`                            | Press feedback, color crossfades     |
| `--motion-duration-normal`  | `200ms`                            | Chamber/panel mounts, fades          |
| `--motion-duration-slow`    | `360ms`                            | Hero entries, big lift transitions   |
| `--motion-easing-out`       | `cubic-bezier(0.2, 0, 0, 1)`       | Entries (decelerate to rest)         |
| `--motion-easing-in-out`    | `cubic-bezier(0.4, 0, 0.2, 1)`     | In-place transforms, color shifts    |
| `--motion-easing-spring`    | `cubic-bezier(0.5, 1.5, 0.5, 1)`   | Notifications, attention surfaces    |

The legacy `--ease-swift` / `--dur-fast` / `--dur-normal` / `--dur-slow`
triple stays for back-compat. New surfaces should reach for the
`--motion-*` names so the diff matches the vocabulary in this doc.

---

## 2. Curves — when to pick which

- **`out`** — anything that enters from offscreen / nothing. Decelerates
  to rest. Used by `motion-fade-in`, `motion-fade-up`. Reads as
  "settling into place".
- **`in-out`** — anything that swaps in place (color, opacity crossfade
  on a mounted element). Symmetric. Used by `motion-cross-fade`, the
  status pill recolour, view-transition pseudo-elements.
- **`spring`** — attention surfaces only. The slight overshoot makes
  notifications announce themselves. Used by `motion-slide-in-top` for
  the handoff inbox. Avoid on chrome that mounts on every navigation —
  spring overshoot reads as childish noise when it fires constantly.

---

## 3. Durations — when to pick which

- **`fast` (120ms)** — feedback that must read as instant: button
  presses, hover-state transitions, status colour flips.
- **`normal` (200ms)** — UI surface mounts: chambers, panels,
  notifications, full-page transitions. Long enough to read as
  intentional, short enough not to feel slow.
- **`slow` (360ms)** — only for hero / landing entries that own the
  viewport. Inside a working chamber, `slow` feels sluggish.

---

## 4. CSS classes

Declared near the bottom of `src/styles/tokens.css`. All gate on
`prefers-reduced-motion: reduce` (the global reset earlier in the
file collapses every animation to 0.01ms; the dedicated kill switch
at the bottom of the file restates `animation: none` per-class for
clarity).

| Class                     | Effect                                                         |
| ------------------------- | -------------------------------------------------------------- |
| `motion-fade-in`          | opacity 0 → 1, 200ms, ease-out                                 |
| `motion-fade-up`          | opacity 0 + translateY(4px) → rest, 200ms, ease-out            |
| `motion-slide-in-top`     | opacity 0 + translateY(-12px) → rest, 200ms, ease-spring       |
| `motion-cross-fade`       | opacity 0 → 1, 120ms, ease-in-out (use with `key` to retrigger)|
| `motion-press`            | transform: scale(0.97) on `:active`, 120ms, ease-out           |

Plus implicit:

- `.btn`, `.btn-ghost`, `.btn-icon`, `.btn-chip`, and any
  `[data-action]` element get the press affordance automatically.
- `[data-mission-status-pill]` gets a 120ms colour transition so
  status flips read as a recolour, not a jump-cut.

---

## 5. React glue (`src/lib/motion.ts`)

```ts
import { useReducedMotion, runViewTransition, Stagger } from "../lib/motion";
```

### `useReducedMotion(): boolean`

Reads `matchMedia("(prefers-reduced-motion: reduce)")` and subscribes
to changes. Defaults to `true` when `window` is unavailable (the
safer default — don't animate things you can't measure).

```tsx
const reduced = useReducedMotion();
if (reduced) return <PlainBanner />;
return <AnimatedBanner />;
```

### `runViewTransition(update, { reduced? })`

Wraps the View Transitions API. On Chromium it snapshots the DOM,
runs the React state update inside the transition, and crossfades.
On Firefox/Safari it runs the update synchronously (no transition).
When the user prefers reduced motion, callers can pass `{ reduced:
true }` to bypass the snapshot entirely.

```tsx
const reduced = useReducedMotion();
const switchChamber = useCallback(
  (next: Chamber) => {
    runViewTransition(() => setActiveTab(next), { reduced });
  },
  [reduced],
);
```

### `<Stagger step={40} start={0}>...</Stagger>`

Applies a CSS `animation-delay` to each direct child so a mounted
list animates in sequence. Pure presentational — children own the
entry animation (typically `motion-fade-up`). Stagger collapses to
zero when the user prefers reduced motion.

```tsx
<Stagger step={40}>
  <div className="motion-fade-up"><PanelA /></div>
  <div className="motion-fade-up"><PanelB /></div>
  <div className="motion-fade-up"><PanelC /></div>
</Stagger>
```

---

## 6. Where motion lives in the shell

| Surface              | Trigger                         | Class / API                          |
| -------------------- | ------------------------------- | ------------------------------------ |
| Chamber switch       | `setActiveTab` in `Shell.tsx`   | `runViewTransition` + `::view-transition-*(root)` |
| Mission switch       | mission id key on pill title    | `motion-cross-fade` + `key={id}`     |
| Status pill flip     | `[data-mission-status-pill]`    | implicit colour transition           |
| Handoff inbox mount  | `<HandoffInbox>` section mount  | `motion-slide-in-top`                |
| Core panel mount     | `<Core>` tab body, keyed by tab | `motion-fade-up` + `<Stagger>`       |
| Button press         | `:active` on `.btn` / `[data-action]` | global `transform: scale(0.97)` |

---

## 7. Anti-patterns

- Don't import a JS animation library. The codebase ships zero
  animation deps. CSS + the View Transitions API cover everything.
- Don't animate `width` / `height` / `margin`. Use `transform` (the
  GPU-cheap subset). Layout-driving animation is what makes static
  enterprise apps feel laggy.
- Don't use the `spring` curve on chrome that re-mounts often. The
  overshoot is a one-shot; on a chamber switch every 5 seconds it
  reads as motion sickness.
- Don't bake duration / easing into inline `style`. Reach for the
  CSS variables so theming and reduced-motion overrides keep working.
- Don't forget `key={...}` when retriggering an entry animation. CSS
  animations only run on mount; remounting is the trigger.
