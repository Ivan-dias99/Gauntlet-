import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";

// Wave P-35 — Command Palette (⌘K / Ctrl+K).
//
// Native-DOM implementation. No `cmdk`, no `react-aria`, no fuzzy-search
// dependency: a substring match against `title + hint` is enough for the
// seeded command set and keeps the bundle untouched. The palette is
// mounted unconditionally by Shell.tsx; the component is responsible
// for its own keyboard listener and visibility state via `open` /
// `onClose` props so the parent never has to know the rendering
// details.
//
// Keyboard contract (mirrors docs/KEYBOARD.md):
//   ↑/↓        — move selection
//   Enter      — execute selected command
//   Esc        — close palette
//   any typing — focus stays on input (no global Tab capture)
//
// Commands are pure data + a `run` thunk. Side-effects flow through
// three channels:
//   1. SpineContext mutators (mission lifecycle, task state)
//   2. `signal:chamber` CustomEvent for tab switches (the existing
//      cross-chamber handoff bus; see Shell.tsx).
//   3. `signal:nav` CustomEvent for in-chamber jumps (search runs,
//      open spine snapshot, open diagnostics, promote distillation).
//      Chambers can subscribe to this and decide what to focus.

export type Command = {
  id: string;
  title: string;
  hint: string;
  run: () => void;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

function dispatchChamber(c: Chamber) {
  window.dispatchEvent(new CustomEvent("signal:chamber", { detail: c }));
}

function dispatchNav(target: string) {
  // Sub-chamber navigation hint. Subscribers (Core / Archive / Insight)
  // listen for the `target` strings they care about. Unrecognised
  // values are silently ignored — palette stays useful even before
  // every chamber has wired its handler.
  window.dispatchEvent(new CustomEvent("signal:nav", { detail: target }));
}

export default function CommandPalette({ open, onClose }: Props) {
  const {
    activeMission,
    clearActiveMission,
    setTaskState,
    updateTruthDistillationStatus,
  } = useSpine();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Build the canonical command list. Memoised against the active
  // mission so "pause active task" and "promote distillation" can
  // target real ids, not stale closures.
  const commands: Command[] = useMemo(() => {
    const chamberSwitches: Command[] = (
      ["insight", "surface", "terminal", "archive", "core"] as Chamber[]
    ).map((c) => ({
      id: `switch-${c}`,
      title: `switch to ${c}`,
      hint: "navigation",
      run: () => dispatchChamber(c),
    }));

    const missionAndTask: Command[] = [
      {
        id: "new-mission",
        title: "new mission",
        hint: "drops the active pointer; next composer submit creates a fresh mission",
        run: () => {
          clearActiveMission();
          dispatchChamber("insight");
        },
      },
      {
        id: "pause-active-task",
        title: "pause active task",
        hint: activeMission
          ? `mission: ${activeMission.title}`
          : "no active mission",
        run: () => {
          if (!activeMission) return;
          const running = activeMission.tasks.find((t) => t.state === "running");
          if (!running) return;
          setTaskState(running.id, "paused", {
            pauseReason: "manual via cmdk",
            pausedAt: Date.now(),
          });
        },
      },
      {
        id: "resume-task",
        title: "resume task",
        hint: activeMission
          ? `mission: ${activeMission.title}`
          : "no active mission",
        run: () => {
          if (!activeMission) return;
          // Pick the most-recently-paused task so the operator does not
          // have to disambiguate. If none, no-op silently.
          const paused = [...activeMission.tasks]
            .filter((t) => t.state === "paused")
            .sort((a, b) => (b.pausedAt ?? 0) - (a.pausedAt ?? 0))[0];
          if (!paused) return;
          setTaskState(paused.id, "running");
        },
      },
      {
        id: "promote-distillation",
        title: "promote distillation",
        hint: "approve latest draft on the active mission",
        run: () => {
          if (!activeMission) return;
          const latest = [...(activeMission.truthDistillations ?? [])]
            .filter((d) => d.status === "draft")
            .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))[0];
          if (!latest) {
            // No draft to promote — surface the panel instead so the
            // operator can generate one.
            dispatchChamber("insight");
            dispatchNav("insight:distillation");
            return;
          }
          updateTruthDistillationStatus(activeMission.id, latest.id, "approved");
        },
      },
    ];

    const navigation: Command[] = [
      {
        id: "open-spine-snapshot",
        title: "open spine snapshot",
        hint: "core · spine snapshot",
        run: () => {
          dispatchChamber("core");
          dispatchNav("core:spine-snapshot");
        },
      },
      {
        id: "copy-spine-json",
        title: "copy spine JSON",
        hint: "clipboard · raw spine state",
        run: async () => {
          try {
            const raw = localStorage.getItem("signal:spine") ?? "{}";
            await navigator.clipboard.writeText(raw);
          } catch {
            // Clipboard refused (insecure context, permission denied) —
            // fall back to a console payload so the operator can still
            // grab it. No alert(): palette closes on Enter, alert
            // would steal focus and confuse the keyboard contract.
            // eslint-disable-next-line no-console
            console.warn("[cmdk] clipboard unavailable; spine JSON below");
            // eslint-disable-next-line no-console
            console.log(localStorage.getItem("signal:spine"));
          }
        },
      },
      {
        id: "search-runs",
        title: "search runs",
        hint: "archive · run list filter",
        run: () => {
          dispatchChamber("archive");
          dispatchNav("archive:search");
        },
      },
      {
        id: "open-diagnostics",
        title: "open diagnostics",
        hint: "core · /diagnostics snapshot",
        run: () => {
          dispatchChamber("core");
          dispatchNav("core:diagnostics");
        },
      },
    ];

    return [...chamberSwitches, ...missionAndTask, ...navigation];
  }, [activeMission, clearActiveMission, setTaskState, updateTruthDistillationStatus]);

  // Substring filter — case-insensitive, matches against title or
  // hint. Empty query returns the full canonical list, in canonical
  // order.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q),
    );
  }, [query, commands]);

  // Reset selection when the filtered list changes shape, otherwise the
  // highlight can land on an empty index.
  useEffect(() => {
    setSelected(0);
  }, [query, open]);

  // Reset query whenever the palette closes so a re-open always starts
  // empty. Done in a separate effect so we do not race the visibility
  // animation.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Auto-focus the input when the palette opens.
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Keep the selected item visible inside the scrollable list. Native
  // scrollIntoView with block: "nearest" handles both up and down moves
  // without yanking the page.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.querySelector<HTMLLIElement>(
      `[data-cmdk-index="${selected}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [selected, open, filtered.length]);

  const execute = useCallback(
    (cmd: Command | undefined) => {
      if (!cmd) return;
      // Close first so the chamber a command lands on owns its own
      // focus restoration (e.g. the run-list filter input). Otherwise
      // we would race the unmount and the focus would never settle.
      onClose();
      // Defer the run by a tick — after the modal scrim is gone and
      // React has flushed the close. Cheaper than useLayoutEffect dance.
      setTimeout(() => {
        try {
          cmd.run();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("[cmdk] command failed", cmd.id, err);
        }
      }, 0);
    },
    [onClose],
  );

  // Collect focusable descendants of the dialog in DOM order. Used by
  // the Tab focus trap below. We intentionally exclude `[tabindex="-1"]`
  // because those are programmatic-focus-only (e.g. the listbox itself).
  // Disabled / hidden controls are filtered out by `offsetParent` —
  // anything not laid out cannot receive focus anyway.
  const collectFocusable = useCallback((): HTMLElement[] => {
    const root = panelRef.current;
    if (!root) return [];
    const sel =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])';
    return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
  }, []);

  // Local key handler on the panel: Enter executes, arrow keys move,
  // Esc closes, Tab is trapped inside the dialog. We intentionally do
  // not stopPropagation on Esc so any higher-level listener (Shell
  // already has none) could still react, but we do preventDefault so
  // the browser does not interpret it as a form-cancel inside the
  // input.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Tab") {
      // WCAG 2.4.3 — keyboard focus must stay inside an aria-modal
      // dialog. Wrap from last → first on Tab and first → last on
      // Shift+Tab. If the active element somehow escaped the panel
      // already, snap back to the input.
      const focusables = collectFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panelRef.current?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !panelRef.current?.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) =>
        filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length,
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      execute(filtered[selected]);
      return;
    }
  };

  if (!open) return null;

  return (
    <div
      className="cmdk-scrim"
      role="presentation"
      onClick={(e) => {
        // Close when clicking the scrim, not when clicking the panel.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmdk-input-label"
        onKeyDown={onKeyDown}
      >
        <label
          id="cmdk-input-label"
          style={{
            position: "absolute",
            left: -10000,
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          Command palette
        </label>
        <input
          ref={inputRef}
          className="cmdk-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type a command…"
          aria-label="command palette search"
          aria-controls="cmdk-list"
          aria-activedescendant={
            filtered[selected] ? `cmdk-item-${filtered[selected].id}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
        />
        {filtered.length === 0 ? (
          <div className="cmdk-empty">no commands match</div>
        ) : (
          <ul
            ref={listRef}
            id="cmdk-list"
            className="cmdk-list"
            role="listbox"
            aria-label="commands"
          >
            {filtered.map((cmd, i) => (
              <li
                key={cmd.id}
                id={`cmdk-item-${cmd.id}`}
                data-cmdk-index={i}
                data-selected={i === selected ? "true" : "false"}
                className="cmdk-item"
                role="option"
                aria-selected={i === selected}
                onMouseEnter={() => setSelected(i)}
                onClick={() => execute(cmd)}
              >
                <span className="cmdk-item-title">{cmd.title}</span>
                <span className="cmdk-item-hint">{cmd.hint}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="cmdk-footer" aria-hidden>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>Enter</kbd> execute
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
