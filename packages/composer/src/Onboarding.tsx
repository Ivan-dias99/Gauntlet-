// Onboarding — 3-step intro shown the first time the cápsula opens.
//
// The cápsula already has zero chrome, so an in-cápsula tour beats a
// modal: we paint a soft overlay that walks the operator through the
// three core moves (input · slash commands · esc dismisses) and then
// flips the `gauntlet:onboarding_done` pref so it never returns.
//
// Doctrine: minimal. Three short cards, one CTA, dismissable on Esc.
// No screenshots, no GIFs — the cápsula itself is the demo, the cards
// just label the parts.

import { useEffect, useState } from 'react';

export interface OnboardingProps {
  onDone: () => void;
}

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Aponta. Pede. Recebe.',
    body:
      'O Gauntlet vive na ponta do cursor. Selecciona o que te interessa na página e abre a cápsula. O contexto vai com o pedido — não precisas de explicar onde estás.',
  },
  {
    title: 'Comandos rápidos',
    body:
      'Escreve “/” para abrir a paleta com slash commands e tools registadas. Setas para navegar, Enter para correr. Sem mouse necessário.',
  },
  {
    title: 'Sempre disponível, nunca no caminho',
    body:
      'Esc fecha. A pill fica como âncora silenciosa. Atalho para reabrir: Alt+Space (browser) ou Ctrl+Shift+Space (desktop). Boa caça.',
  },
];

export function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDone();
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        setStep((s) => (s + 1 < STEPS.length ? s + 1 : -1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStep((s) => Math.max(0, s - 1));
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onDone]);

  useEffect(() => {
    if (step === -1) onDone();
  }, [step, onDone]);

  if (step < 0 || step >= STEPS.length) return null;
  const { title, body } = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="gauntlet-onboarding" role="dialog" aria-label="Gauntlet onboarding">
      <div className="gauntlet-onboarding__card">
        <div className="gauntlet-onboarding__step">
          {step + 1} / {STEPS.length}
        </div>
        <div className="gauntlet-onboarding__title">{title}</div>
        <div className="gauntlet-onboarding__body">{body}</div>
        <div className="gauntlet-onboarding__actions">
          <button
            type="button"
            className="gauntlet-onboarding__skip"
            onClick={onDone}
          >
            saltar
          </button>
          <button
            type="button"
            className="gauntlet-onboarding__next"
            onClick={() => (isLast ? onDone() : setStep(step + 1))}
            autoFocus
          >
            {isLast ? 'começar' : 'próximo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const ONBOARDING_CSS = `
.gauntlet-onboarding {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 18, 24, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: gauntlet-onboarding-fade 220ms ease-out both;
  border-radius: inherit;
}
.gauntlet-onboarding__card {
  width: min(420px, calc(100% - 32px));
  padding: 22px 22px 18px;
  background: var(--gx-bg, #fbf7ee);
  color: var(--gx-fg, #232026);
  border: 1px solid var(--gx-border-mid, rgba(0,0,0,0.12));
  border-radius: 12px;
  box-shadow: 0 18px 48px rgba(0,0,0,0.32);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.gauntlet-onboarding__step {
  font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gx-text-muted, rgba(0,0,0,0.55));
  margin-bottom: 10px;
}
.gauntlet-onboarding__title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  line-height: 1.2;
  margin-bottom: 10px;
  color: var(--gx-fg, #232026);
}
.gauntlet-onboarding__body {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--gx-fg-soft, rgba(0,0,0,0.78));
  margin-bottom: 18px;
}
.gauntlet-onboarding__actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.gauntlet-onboarding__skip,
.gauntlet-onboarding__next {
  font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: lowercase;
  border: 1px solid var(--gx-border-mid, rgba(0,0,0,0.18));
  background: transparent;
  color: var(--gx-fg, #232026);
  border-radius: 999px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}
.gauntlet-onboarding__next {
  background: var(--gx-ember, #d07a5a);
  border-color: var(--gx-ember, #d07a5a);
  color: #fff;
}
.gauntlet-onboarding__next:hover {
  filter: brightness(1.08);
}
.gauntlet-onboarding__skip:hover {
  background: rgba(0,0,0,0.04);
}
@keyframes gauntlet-onboarding-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;
