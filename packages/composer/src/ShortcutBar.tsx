import { type Phase } from './useStreamingPlan';

export interface ShortcutHint {
  kbd: string;
  label: string;
  tone?: 'default' | 'primary' | 'danger';
}

type StatusTone = 'idle' | 'thinking' | 'ok' | 'err' | 'danger';

interface ShortcutBarProps {
  phase: Phase;
  // When true, the danger-gate is open and the bar advertises the
  // sensitive-action shortcuts (Confirm / Cancel) instead of the idle
  // hint set. Capsule passes this whenever a sensitive plan is on-screen.
  dangerGateOpen?: boolean;
}

interface StatusFor {
  status: string;
  tone: StatusTone;
}

const DEFAULT_HINTS: ShortcutHint[] = [
  { kbd: '/', label: 'comandos' },
  { kbd: '↑', label: 'último prompt' },
  { kbd: '⌘K', label: 'palette' },
  { kbd: 'esc', label: 'recolhe' },
];

const DANGER_HINTS: ShortcutHint[] = [
  { kbd: '⏎', label: 'executar com cuidado', tone: 'primary' },
  { kbd: 'esc', label: 'cancelar', tone: 'danger' },
];

function statusFor(phase: Phase, danger: boolean): StatusFor {
  if (danger) return { status: 'acção sensível', tone: 'danger' };
  switch (phase) {
    case 'planning':  return { status: 'a pensar…',     tone: 'thinking' };
    case 'streaming': return { status: 'a responder…',  tone: 'thinking' };
    case 'executing': return { status: 'a executar…',   tone: 'thinking' };
    case 'executed':  return { status: 'concluído',     tone: 'ok' };
    case 'error':     return { status: 'erro',          tone: 'err' };
    case 'plan_ready':return { status: 'plano pronto',  tone: 'ok' };
    default:          return { status: 'pronto',        tone: 'idle' };
  }
}

// ShortcutBar — persistent contextual hint strip. Sits between the
// composer body and the action row, exposing only the shortcuts that
// matter for the current phase. Status dot on the left signals the
// system breathing state. Aether v2 port from preview Lovable.
export function ShortcutBar({ phase, dangerGateOpen = false }: ShortcutBarProps) {
  const { status, tone } = statusFor(phase, dangerGateOpen);
  const hints = dangerGateOpen ? DANGER_HINTS : DEFAULT_HINTS;
  return (
    <div className="gx-shortcut-bar" role="status" aria-live="polite">
      <span className="gx-shortcut-bar__status" data-tone={tone}>
        <span className="gx-shortcut-bar__dot" />
        {status}
      </span>
      <span className="gx-shortcut-bar__sep" />
      <div className="gx-shortcut-bar__hints">
        {hints.map((h) => (
          <span key={h.label} className="gx-shortcut-bar__hint" data-tone={h.tone ?? 'default'}>
            <span className="gx-shortcut-bar__kbd">{h.kbd}</span>
            <span>{h.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
