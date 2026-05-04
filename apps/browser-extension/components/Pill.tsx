// Pill — Gauntlet's "sempre presente" surface.
//
// Tiny clickable mark in the bottom-right corner, mounted by the
// content script on every page load. Click expands into the full
// Capsule. Doctrine: cápsula mínima que segue o cursor — the pill is
// the resting state of that cápsula. Without this surface Gauntlet is
// invisible until the user remembers the hotkey, which is no different
// from a standalone app.

export interface PillProps {
  onClick: () => void;
}

export function Pill({ onClick }: PillProps) {
  return (
    <button
      type="button"
      className="gauntlet-pill"
      onClick={onClick}
      aria-label="Summon Gauntlet capsule"
      title="Gauntlet — clica ou Ctrl+Shift+Space"
    >
      <span className="gauntlet-pill__mark" aria-hidden>
        <span className="gauntlet-pill__dot" />
      </span>
    </button>
  );
}

// Colocated CSS so the content script can inject one stylesheet into
// the shadow root and have both pill + capsule styled correctly. Keep
// the visual coherent with the capsule's brand mark — same ember, same
// pulse — so the transition pill → capsule reads as the same object
// expanding, not two separate widgets.
export const PILL_CSS = `
@keyframes gauntlet-pill-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.18); }
}
@keyframes gauntlet-pill-rise {
  0%   { opacity: 0; transform: translateY(8px) scale(0.85); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}

.gauntlet-pill {
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  background: rgba(14, 16, 22, 0.92);
  border: 1px solid rgba(208, 122, 90, 0.45);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 22px rgba(208, 122, 90, 0.30),
    0 8px 20px rgba(0, 0, 0, 0.45);
  backdrop-filter: saturate(1.4) blur(20px);
  -webkit-backdrop-filter: saturate(1.4) blur(20px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 2147483647;
  transition:
    transform 160ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms ease;
  animation: gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-pill:hover {
  transform: translateY(-2px);
  border-color: rgba(208, 122, 90, 0.65);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 30px rgba(208, 122, 90, 0.55),
    0 12px 28px rgba(0, 0, 0, 0.55);
}
.gauntlet-pill:focus-visible {
  outline: 2px solid rgba(208, 122, 90, 0.7);
  outline-offset: 3px;
}
.gauntlet-pill__mark {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(208, 122, 90, 0.95), rgba(208, 122, 90, 0.45) 60%, transparent 100%),
    #1a1d26;
  border: 1px solid rgba(208, 122, 90, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}
.gauntlet-pill__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #f4c4ad;
  box-shadow: 0 0 8px rgba(244, 196, 173, 0.85);
  animation: gauntlet-pill-pulse 2.4s ease-in-out infinite;
}
`;
