// SlashMenu — inline dropdown that surfaces slash quick actions when
// the input starts with `/`. Pure presentational; the Capsule owns
// the action list, the active-index highlight and the run callback.
//
// Empty `matches` renders nothing (the cápsula keeps the textarea
// flush against the actions row). The cursor is purely visual — the
// caller decides which entry to run on Enter via `activeIndex`.

export interface SlashAction {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export interface SlashMenuProps {
  matches: SlashAction[];
  activeIndex: number;
  onHover: (index: number) => void;
  onPick: (index: number) => void;
}

export function SlashMenu({ matches, activeIndex, onHover, onPick }: SlashMenuProps) {
  if (matches.length === 0) return null;
  return (
    <div className="gauntlet-capsule__slash" role="listbox">
      {matches.map((a, i) => (
        <button
          key={a.id}
          type="button"
          role="option"
          aria-selected={i === activeIndex}
          className={`gauntlet-capsule__slash-item${
            i === activeIndex ? ' gauntlet-capsule__slash-item--active' : ''
          }`}
          onMouseEnter={() => onHover(i)}
          onClick={() => onPick(i)}
        >
          <span className="gauntlet-capsule__slash-label">{a.label}</span>
          <span className="gauntlet-capsule__slash-hint">{a.hint}</span>
        </button>
      ))}
    </div>
  );
}
