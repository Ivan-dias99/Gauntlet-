import { type Phase } from './useStreamingPlan';

export interface ShortcutHint {
  kbd: string;
  label: string;
  tone?: 'default' | 'primary' | 'danger';
}

type StatusTone = 'idle' | 'thinking' | 'ok' | 'err' | 'danger';

interface ShortcutBarProps {
  phase: Phase;
  // Capsule sets this true while a sensitive plan is on-screen so the
  // hint set narrows to the confirm/cancel pair.
  dangerGateOpen?: boolean;
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

// Record forces exhaustive coverage at compile time — a new Phase added
// to useStreamingPlan must add an entry here, no silent fallback.
const STATUS_BY_PHASE: Record<Phase, { status: string; tone: StatusTone }> = {
  idle:       { status: 'pronto',        tone: 'idle' },
  planning:   { status: 'a pensar…',     tone: 'thinking' },
  streaming:  { status: 'a responder…',  tone: 'thinking' },
  plan_ready: { status: 'plano pronto',  tone: 'ok' },
  executing:  { status: 'a executar…',   tone: 'thinking' },
  executed:   { status: 'concluído',     tone: 'ok' },
  error:      { status: 'erro',          tone: 'err' },
};

function statusFor(phase: Phase, danger: boolean): { status: string; tone: StatusTone } {
  return danger ? { status: 'acção sensível', tone: 'danger' } : STATUS_BY_PHASE[phase];
}

export function ShortcutBar({ phase, dangerGateOpen = false }: ShortcutBarProps) {
  const { status, tone } = statusFor(phase, dangerGateOpen);
  const hints = dangerGateOpen ? DANGER_HINTS : DEFAULT_HINTS;
  return (
    <div className="gx-shortcut-bar">
      {/* Live region scoped to the status text only — re-announcing the
          full hint set on every phase flip is noisy for screen readers. */}
      <span className="gx-shortcut-bar__status" data-tone={tone} role="status" aria-live="polite">
        <span className="gx-shortcut-bar__dot" aria-hidden />
        {status}
      </span>
      <span className="gx-shortcut-bar__sep" aria-hidden />
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
