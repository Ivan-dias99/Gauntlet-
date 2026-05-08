// CommandPalette — extracted from Capsule.tsx as part of Wave 2 PR-1.
//
// Doctrine: the Composer is the user's centre of experience and grows
// dense by design — but density at the product level must not collapse
// into a god-component. Each feature lives in its own module under
// packages/composer/src/. The Capsule orchestrates and mounts; modules
// like this one own their UI, state and helpers.
//
// This module owns:
//   * PaletteAction        — the wire shape every entry must satisfy
//   * fuzzyScore           — the local fuzzy matcher (substring wins,
//                            else cheapest order-preserving match)
//   * CommandPalette       — the ⌘K dialog (filter + list + keyboard)
//
// What stays in the Capsule: the actions array, recents persistence,
// open/close state and the keyboard shortcut binding. Those depend on
// Capsule-level state (plan, snapshot, ambient capabilities, tool
// manifests) and have no business living here.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface PaletteAction {
  id: string;
  label: string;
  shortcut: string;
  disabled?: boolean;
  // Optional metadata for tool entries — drives the badges + description
  // line below the label. Action entries leave these undefined.
  description?: string;
  group?: 'action' | 'tool';
  mode?: string;
  risk?: string;
  requiresApproval?: boolean;
  run: () => void;
}

// Fuzzy scorer — substring match wins; otherwise score by how cheaply
// the query characters can be found in order in the candidate. Higher
// score = better match. Returns -1 when no order-preserving match
// exists, which the caller filters out.
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 1000 - t.indexOf(q);
  let qi = 0;
  let runs = 0;
  let lastMatch = -2;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      if (i !== lastMatch + 1) runs++;
      lastMatch = i;
      qi++;
    }
  }
  if (qi < q.length) return -1;
  // Fewer "runs" = chars came in sequence, which we prefer.
  return 500 - runs * 10 - (t.length - q.length);
}

export interface CommandPaletteProps {
  actions: PaletteAction[];
  onClose: () => void;
  recentIds: string[];
}

export function CommandPalette({ actions, onClose, recentIds }: CommandPaletteProps) {
  const [filter, setFilter] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Score + sort: empty filter promotes recents to the top of each
  // group; non-empty filter ranks by fuzzy match across all entries.
  const visible = useMemo(() => {
    if (!filter) {
      const recentRank = new Map(recentIds.map((id, i) => [id, i]));
      const score = (a: PaletteAction) => {
        const r = recentRank.get(a.id);
        return r === undefined ? recentIds.length : r;
      };
      const sorted = [...actions].sort((a, b) => {
        const sa = score(a);
        const sb = score(b);
        if (sa !== sb) return sa - sb;
        // Stable-ish secondary sort: actions before tools, then label.
        const groupOrder = (g?: string) => (g === 'tool' ? 1 : 0);
        const ga = groupOrder(a.group);
        const gb = groupOrder(b.group);
        if (ga !== gb) return ga - gb;
        return a.label.localeCompare(b.label);
      });
      return sorted;
    }
    const scored = actions
      .map((a) => {
        const haystack = `${a.label} ${a.id} ${a.description ?? ''}`;
        return { a, score: fuzzyScore(filter, haystack) };
      })
      .filter((x) => x.score >= 0)
      .sort((x, y) => y.score - x.score)
      .map((x) => x.a);
    return scored;
  }, [actions, filter, recentIds]);

  useEffect(() => {
    if (cursor >= visible.length) setCursor(0);
  }, [visible.length, cursor]);

  const onKey = useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        setCursor((c) => Math.min(c + 1, visible.length - 1));
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (ev.key === 'Enter') {
        ev.preventDefault();
        const action = visible[cursor];
        if (action && !action.disabled) action.run();
      }
    },
    [visible, cursor],
  );

  return (
    <div className="gauntlet-capsule__palette" role="dialog" aria-label="Command palette">
      <div className="gauntlet-capsule__palette-scrim" onClick={onClose} />
      <div className="gauntlet-capsule__palette-panel" onKeyDown={onKey}>
        <input
          ref={inputRef}
          className="gauntlet-capsule__palette-input"
          type="text"
          placeholder="comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
        />
        <ul className="gauntlet-capsule__palette-list" role="listbox">
          {visible.length === 0 ? (
            <li className="gauntlet-capsule__palette-empty">sem resultados</li>
          ) : (
            visible.map((a, i) => (
              <li
                key={a.id}
                role="option"
                aria-selected={i === cursor}
                aria-disabled={a.disabled}
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  if (!a.disabled) a.run();
                }}
                className={`gauntlet-capsule__palette-item${
                  i === cursor ? ' gauntlet-capsule__palette-item--active' : ''
                }${a.disabled ? ' gauntlet-capsule__palette-item--disabled' : ''}${
                  a.group === 'tool' ? ' gauntlet-capsule__palette-item--tool' : ''
                }`}
              >
                <div className="gauntlet-capsule__palette-main">
                  <span className="gauntlet-capsule__palette-label">{a.label}</span>
                  {a.description && (
                    <span className="gauntlet-capsule__palette-desc">{a.description}</span>
                  )}
                </div>
                <div className="gauntlet-capsule__palette-meta">
                  {a.mode && (
                    <span
                      className={`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${a.mode}`}
                      title={`mode: ${a.mode}`}
                    >
                      {a.mode}
                    </span>
                  )}
                  {a.risk && a.risk !== 'low' && (
                    <span
                      className={`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${a.risk}`}
                      title={`risk: ${a.risk}`}
                    >
                      {a.risk}
                    </span>
                  )}
                  {a.requiresApproval && (
                    <span
                      className="gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval"
                      title="requires explicit approval before running"
                    >
                      approval
                    </span>
                  )}
                  {a.shortcut && (
                    <span className="gauntlet-capsule__palette-shortcut">{a.shortcut}</span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
