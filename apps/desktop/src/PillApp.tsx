// Desktop pill — slim component that lives in the pill Tauri window.
//
// The pill window itself is small (220x56) and transparent. This
// component only paints the resting visual (a circular ember dot with
// halo) and dispatches click → show_capsule. Right-click hides the
// pill window so the operator can collapse to "tray-only" mode.
//
// We intentionally do NOT reuse the shared <Pill /> from
// @gauntlet/composer here: that component owns viewport-magnetism,
// drag, and per-domain dismiss, all of which are page-DOM concepts.
// On desktop the WINDOW is the pill; the OS handles drag (via
// data-tauri-drag-region) and there is no domain to dismiss against.

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export function PillApp() {
  const [phase, setPhase] = useState<"idle" | "active">("idle");

  useEffect(() => {
    // Mirror the cápsula phase the main window broadcasts so the dot
    // pulses while a plan is in flight. The capsule emits a
    // `gauntlet:phase` CustomEvent on its own window — for a Tauri
    // multi-window setup we'd route through the events plugin; until
    // that's wired we stay in the local "idle" state and let the click
    // be the only feedback path. Cheap, honest.
    const t = setInterval(() => setPhase("idle"), 30_000);
    return () => clearInterval(t);
  }, []);

  const summon = async () => {
    setPhase("active");
    try {
      await invoke<void>("show_capsule");
    } catch {
      // best-effort
    }
    setTimeout(() => setPhase("idle"), 800);
  };

  const dismissPill = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await invoke<void>("hide_pill");
    } catch {
      // best-effort
    }
  };

  return (
    <div
      className={`gauntlet-desktop-pill ${phase === "active" ? "is-active" : ""}`}
      data-tauri-drag-region
      onClick={summon}
      onContextMenu={dismissPill}
      title="Gauntlet — clica para abrir, botão direito para esconder"
    >
      <div className="gauntlet-desktop-pill__halo" data-tauri-drag-region />
      <div className="gauntlet-desktop-pill__dot" />
      <div className="gauntlet-desktop-pill__label" data-tauri-drag-region>
        gauntlet
      </div>
    </div>
  );
}
