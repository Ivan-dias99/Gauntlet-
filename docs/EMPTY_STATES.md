# Empty / error / loading states — grammar guide

Wave P-36 turned every "nothing here yet", "still loading" and "something
broke" surface in the shell into a small set of designed primitives. This
document is the contract every chamber follows when it renders one of
them.

## Primitives

All live under `src/shell/states/` and re-export from
`src/shell/states/index.ts`:

| Component                  | Use when                                                                 |
| -------------------------- | ------------------------------------------------------------------------ |
| `EmptyState`               | A list / panel has no data yet for legitimate reasons.                   |
| `LoadingState`             | Inline shimmer for a small placeholder (one row, one meta line).         |
| `SkeletonPanel`            | Whole panel shape is loading — header line + body lines + meta row.      |
| `ErrorState`               | A render or fetch failed. Pick one of three severities (see below).      |
| `BackendUnreachableState`  | Specifically when `BackendUnreachableError` was caught.                  |

The `ChamberErrorBoundary` (`src/shell/ChamberErrorBoundary.tsx`) wraps
each chamber root in `Shell.tsx` and catches React render exceptions
with `<ErrorState severity="full" />` automatically — call sites do not
re-implement that.

## Empty-state grammar

Every empty state must follow this shape:

1. **Glyph** — exactly one ASCII character (`○`, `·`, `↪`, `✕`, `…`).
   No emoji, no icon font, no PNG.
2. **One short sentence** — present tense, factual, lowercase.
3. **Optional one CTA** — short imperative verb phrase, lowercase.

### Voice

* Terse and factual. `nenhuma missão` — not `Você ainda não tem missões!`
* No exclamation marks. Ever.
* No `oops`, `hmm`, `desculpa`, `ainda não`, `por favor`, `clica aqui`.
* No decorative emoji.
* Lowercase. Capitalise only proper nouns and acronyms.
* Portuguese first; English fallback only when it's a genuine technical
  term the operator already knows (`HTTP`, `JSON`, `URL`).

### Examples

Good:

```tsx
<EmptyState glyph="○" message="spine vazio — nenhuma missão registada" actionLabel="nova missão" onAction={createMission} />
<EmptyState glyph="·" message="doutrina ainda não governou pedidos nesta missão" />
<EmptyState glyph="↪" message="sem handoffs pendentes para esta câmara" />
```

Bad:

```tsx
{/* exclamation, decorative emoji, apologetic tone, multiple sentences */}
<EmptyState glyph="🙁" message="Oops! Você ainda não tem nenhuma missão. Crie uma agora!" />
{/* uppercase, generic */}
<EmptyState glyph="X" message="EMPTY" />
{/* no glyph, no shape */}
<div>nenhum dado</div>
```

## Error states

`ErrorState` has three severities. Pick the one that matches the blast
radius of the failure:

* **`silent`** — one inline line of muted copy. The rest of the panel
  works. Use it for non-blocking degradation (e.g. one row failed to
  render, the rest of the table is fine).
* **`banner`** — full-width bordered banner pinned at the top of a
  panel. Recoverable failure where the panel can still function. Always
  pass `onRetry` so the operator can re-trigger the fetch.
* **`full`** — replaces the panel content entirely. The failure left
  nothing meaningful to show. Always pass `onRetry`. The
  `ChamberErrorBoundary` uses this severity automatically.

Never pass `(e as Error).message` straight into `message`. Map the
exception to a one-line cause first; pass the raw message in `detail`
when it adds diagnostic value (edge codes, stack hints).

For backend-unreachable errors, prefer `BackendUnreachableState` —
it interprets `BackendUnreachableError.reason` into a friendly
cause + actionable fix table without each chamber re-implementing it.

## Loading states

* `LoadingState` — one inline shimmer block. Pass `lines` to set how
  many. The last line is rendered narrower so the row reads as text,
  not as bars.
* `SkeletonPanel` — full panel shape (`.panel` class), header + body +
  meta. Use it whenever a chamber panel is mounted but waiting on data,
  so the layout doesn't reflow when the real content arrives.

Both honour `prefers-reduced-motion` automatically through the global
rule in `src/styles/tokens.css` — no per-call gate needed.

## Optimistic UI

When a destructive action commits to a store (e.g. handoff
`consumir`), hide the row immediately via local state, commit second,
and roll back on error. `HandoffInbox.tsx` is the reference
implementation.
