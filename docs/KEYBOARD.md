# Signal — keyboard map

Keyboard-first contract. Every action documented here is reachable
without the mouse. Wave P-35 introduced the universal focus-visible ring
and the ⌘K command palette; the shortcuts that pre-existed (Alt+digits)
are kept verbatim so muscle memory survives the wave.

## Global

| Key             | Action                                              | Owner                  |
| --------------- | --------------------------------------------------- | ---------------------- |
| `Tab`           | Move focus to next focusable element (DOM order)    | browser default        |
| `Shift+Tab`     | Move focus to previous focusable element            | browser default        |
| `Enter`         | Activate focused button / link                      | browser default        |
| `Space`         | Activate focused button / `role="button"`           | browser default        |
| `Escape`        | Close active modal, command palette, or overlay     | each modal owns its own listener |
| `Cmd+K` / `Ctrl+K` | Toggle command palette                            | `Shell.tsx`            |
| `Alt+1`…`Alt+5` | Jump to chamber (insight, surface, terminal, archive, core) | `Shell.tsx` |

Skip-link (`Skip to main`) becomes visible the first time the user
presses `Tab` after a page load. Pressing `Enter` on it skips the ribbon
and lands focus on `<main>`.

## Command Palette (⌘K)

| Key            | Action                                  |
| -------------- | --------------------------------------- |
| `↑` / `↓`      | Move selection                          |
| `Enter`        | Execute selected command                |
| `Esc`          | Close palette                           |
| typing         | Substring filter on title and hint      |
| click on scrim | Close palette                           |

Seeded commands:

- `switch to insight` / `surface` / `terminal` / `archive` / `core`
- `new mission` — clears active mission pointer; next composer submit
  creates a fresh mission
- `pause active task` — pauses the most-recently-running task on the
  active mission
- `resume task` — resumes the most-recently-paused task on the active
  mission
- `promote distillation` — approves the latest draft distillation on the
  active mission (or jumps to the panel if there is no draft)
- `open spine snapshot` — switches to Core, signals snapshot focus
- `copy spine JSON` — writes the raw spine state to the clipboard
- `search runs` — switches to Archive, signals search focus
- `open diagnostics` — switches to Core, signals diagnostics focus

## Modals

Modal dialogs (`role="dialog"`, `aria-modal="true"`) trap focus inside
themselves until closed. Each registers its own `keydown` listener and
removes it on unmount; there is no global modal stack to fight over `Esc`.

The element-pick overlay (Surface Final) closes on `Esc` via its own
listener; it does not interfere with the palette because the palette is
either not mounted (preview iframe) or the overlay only opens after the
palette has closed.

## Focus-visible ring

All interactive elements receive a 2px solid ring in `--accent` colour
on keyboard focus, with a 2px offset and 4px radius. The ring is
suppressed on mouse focus (`:focus:not(:focus-visible)`). Custom
overrides (`outline: none`) are forbidden in chamber code; if a panel
needs a different shape, restyle the ring inside `:focus-visible`,
never strip it.
