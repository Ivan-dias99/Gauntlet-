interface Ritual {
  id: string;
  label: string;
  hint: string;
  icon?: string;
}

interface EmptyStateProps {
  // Picked ritual fires the slash hint as user input. Capsule wires
  // this to setUserInput + focus, so the operator gets a head-start
  // on the most common flows when there's nothing on-screen yet.
  onPick: (hint: string) => void;
}

const RITUALS: Ritual[] = [
  { id: 'resumir', label: 'Resumir página em 3 bullets',     hint: '/resumir', icon: '+' },
  { id: 'traduz',  label: 'Traduzir seleção para EN',        hint: '/traduz',  icon: '+' },
  { id: 'explica', label: 'Explicar como se eu tivesse 12 anos', hint: '/explica', icon: '+' },
  { id: 'click',   label: 'Clicar elemento por selector',    hint: '/click',   icon: '▸' },
];

// EmptyState — first-look surface when phase=idle and nothing is on
// screen yet. Display title in serif Fraunces, mono kicker, four
// rituals as ghost rows that bloom on hover/focus. Aether v2 port.
export function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <section className="gx-empty" aria-labelledby="gx-empty-title">
      <p className="gx-empty__sub">Aether v1 · pronto na ponta do cursor</p>
      <h2 id="gx-empty-title" className="gx-empty__title">O que queres fazer?</h2>
      <div className="gx-empty__rituals" role="list">
        {RITUALS.map((r) => (
          <button
            key={r.id}
            type="button"
            role="listitem"
            className="gx-empty__ritual"
            onClick={() => onPick(r.hint)}
          >
            <span className="gx-empty__ritual-icon" aria-hidden>{r.icon}</span>
            <span className="gx-empty__ritual-label">{r.label}</span>
            <span className="gx-empty__ritual-kbd">{r.hint}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
