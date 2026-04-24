import { useSpine } from "../../spine/SpineContext";

// Core instrumentation strip — sits between the ChamberHead and the
// tab band. Same material grammar as the Terminal WorkbenchStrip, but
// with Core's chamber DNA (§ glyph, green accent). Turns the Core
// chamber from a literary register into a real instrument: doctrine
// count · missions governed · last invocation · sync state.
//
// Every value reads from the spine. No prose, no narration.

function formatRelTime(ts: number, now: number): string {
  const diff = Math.max(0, now - ts);
  const s = Math.floor(diff / 1000);
  if (s < 45) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

function toRoman(n: number): string {
  if (n <= 0) return "0";
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let x = n;
  for (const [v, s] of map) {
    while (x >= v) { out += s; x -= v; }
  }
  return out;
}

export default function CoreInstrument() {
  const { state, principles, syncState } = useSpine();

  const totalMissions = state.missions.length;
  let missionsGoverned = 0;
  let lastAppliedAt: number | null = null;
  for (const m of state.missions) {
    const applied = m.events.filter((e) => e.type === "doctrine_applied");
    if (applied.length > 0) {
      missionsGoverned += 1;
      const last = applied[applied.length - 1];
      if (!lastAppliedAt || last.at > lastAppliedAt) lastAppliedAt = last.at;
    }
  }

  const ratified = principles.length;
  const now = Date.now();

  return (
    <div className="core-instrument" data-core-instrument>
      <span className="core-instrument-glyph" aria-hidden>§</span>
      <span className="core-instrument-label">DOUTRINA</span>

      <span className="core-instrument-sep" aria-hidden />

      <span className="core-instrument-field" title="artigos em vigor">
        <span className="core-instrument-field-label">em vigor</span>
        <span className="core-instrument-field-value">
          {ratified > 0 ? `${toRoman(ratified)} · ${ratified}` : "—"}
        </span>
      </span>

      <span className="core-instrument-sep" aria-hidden />

      <span className="core-instrument-field" title="missões que invocaram doutrina">
        <span className="core-instrument-field-label">governadas</span>
        <span className="core-instrument-field-value">
          {totalMissions > 0
            ? `${missionsGoverned} / ${totalMissions}`
            : "—"}
        </span>
      </span>

      <span className="core-instrument-sep" aria-hidden />

      <span className="core-instrument-field" title="última invocação registada">
        <span className="core-instrument-field-label">última</span>
        <span className="core-instrument-field-value">
          {lastAppliedAt ? formatRelTime(lastAppliedAt, now) : "—"}
        </span>
      </span>

      <span className="core-instrument-spacer" />

      <span
        className="core-instrument-sync"
        data-sync-state={syncState}
        title={`spine ${syncState}`}
      >
        <span className="core-instrument-sync-dot" aria-hidden />
        {syncState === "synced"
          ? "sincronizado"
          : syncState === "syncing"
          ? "a sincronizar"
          : "local"}
      </span>
    </div>
  );
}
