interface Ritual {
  id: string;
  label: string;
  // Visual hint of the slash form a future command would take. Cosmetic
  // only — onPick prefills `label`, not `kbd`, because the canon
  // SlashMenu does not register these as real actions.
  kbd: string;
  icon?: string;
}

interface EmptyStateProps {
  onPick: (prompt: string) => void;
}

const RITUALS: Ritual[] = [
  { id: 'resumir', label: 'Resumir página em 3 bullets',         kbd: '/resumir', icon: '+' },
  { id: 'traduz',  label: 'Traduzir seleção para EN',            kbd: '/traduz',  icon: '+' },
  { id: 'explica', label: 'Explicar como se eu tivesse 12 anos', kbd: '/explica', icon: '+' },
  { id: 'click',   label: 'Clicar elemento por selector',        kbd: '/click',   icon: '▸' },
];

export function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <section className="gx-empty" aria-labelledby="gx-empty-title">
      <p className="gx-empty__sub">Aether v1 · pronto na ponta do cursor</p>
      <h2 id="gx-empty-title" className="gx-empty__title">O que queres fazer?</h2>
      <div className="gx-empty__rituals">
        {RITUALS.map((r) => (
          <button
            key={r.id}
            type="button"
            className="gx-empty__ritual"
            onClick={() => onPick(r.label)}
          >
            <span className="gx-empty__ritual-icon" aria-hidden>{r.icon}</span>
            <span className="gx-empty__ritual-label">{r.label}</span>
            <span className="gx-empty__ritual-kbd">{r.kbd}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
