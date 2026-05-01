import { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import CanonRibbon, { CHAMBERS } from "./CanonRibbon";
import CommandPalette from "./CommandPalette";
import Landing from "../landing/Landing";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";
import Insight from "../chambers/insight";
import Terminal from "../chambers/terminal";
import Archive from "../chambers/archive";
import Core from "../chambers/core";
import Surface from "../chambers/surface";
import ChamberErrorBoundary from "./ChamberErrorBoundary";
import { runViewTransition, useReducedMotion } from "../lib/motion";
import { useCopy } from "../i18n/copy";
import { useTweaks, DENSITY_CYCLE, DENSITY_LABEL } from "../tweaks/TweaksContext";

const ENTERED_KEY = "signal:entered";

// Wave P-37 — viewport breakpoint at which the canon ribbon collapses
// the chamber switcher into a drawer. 720px keeps tablet portrait on
// the desktop layout and only kicks in on phone-class widths.
const MOBILE_BREAKPOINT = "(max-width: 720px)";

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.matchMedia(MOBILE_BREAKPOINT).matches; }
    catch { return false; }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    let mq: MediaQueryList;
    try { mq = window.matchMedia(MOBILE_BREAKPOINT); }
    catch { return; }
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    // Safari < 14 used addListener; modern browsers expose addEventListener.
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);
  return isMobile;
}

// Wave P-36 — every chamber renders inside its own error boundary so a
// crash in one doesn't take the shell down. The boundary key includes
// the chamber id so switching tabs after a crash remounts cleanly.

// Wave-2: shell is stripped of landing, ritual entry, and tweak-panel
// gates. Boot opens directly on the active chamber with its composer
// focused. First-send inside Insight creates a mission implicitly (see
// Lab.tsx). VisionLanding and RitualEntry have been deleted; TweaksPanel
// has been demoted (the TweaksContext provider still applies theme /
// density at mount — user-facing controls return in Core, Wave 4).

function renderChamber(c: Chamber) {
  switch (c) {
    case "insight":  return <Insight />;
    case "terminal": return <Terminal />;
    case "archive":  return <Archive />;
    case "core":     return <Core />;
    case "surface":  return <Surface />;
  }
}

export default function Shell() {
  const { activeMission } = useSpine();
  const copy = useCopy();
  const { values: tweaks, set: setTweak } = useTweaks();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<Chamber>(activeMission?.chamber ?? "insight");
  const [entered, setEntered] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ENTERED_KEY) === "true";
    } catch (e) {
      console.warn("[shell] localStorage.getItem failed — assuming not entered:", e);
      return false;
    }
  });
  const reduced = useReducedMotion();
  // Wave P-35 — command palette visibility lives at the shell because
  // ⌘K must work from any chamber. The palette closes itself; the
  // shell only owns the open boolean.
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Wave P-37 — Drawer open state. Closed by default. Auto-closes when
  // the viewport widens past the mobile breakpoint so the operator
  // never lands on a desktop layout with a stale overlay still up.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hamburgerReturnRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isMobile && drawerOpen) setDrawerOpen(false);
  }, [isMobile, drawerOpen]);

  // Drawer keyboard contract: Esc closes, focus returns to whoever
  // opened it (the hamburger). Existing chamber Alt+[1-5] shortcuts and
  // mission ⌘ navigation keep working — the drawer is layered above,
  // not a replacement for global keys. Focus restoration is handled by
  // a dedicated effect below so it runs AFTER the wrapper is un-inerted
  // (otherwise focus() would silently fail on the inert hamburger).
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  // Move focus into the drawer's first interactive child on open so a
  // keyboard user can immediately Tab through chamber options.
  useEffect(() => {
    if (!drawerOpen) return;
    const root = drawerRef.current;
    if (!root) return;
    const first = root.querySelector<HTMLElement>("[data-drawer-first]");
    first?.focus();
  }, [drawerOpen]);

  // Wave P-37 a11y fix — when the drawer is closed it stays mounted
  // (off-screen via CSS) so the slide transition keeps working. Without
  // `inert`, focusable children would still be reachable by Tab and
  // would still leak into the accessibility tree on browsers that don't
  // honor `aria-hidden` strictly. Toggle the native HTMLElement.inert
  // property directly so we don't depend on React 18 serializing an
  // `inert` attribute it doesn't yet recognize. useLayoutEffect runs
  // before the browser paints, so the closed drawer is already inert
  // on first render — no flash of focusable hidden controls.
  useLayoutEffect(() => {
    const root = drawerRef.current;
    if (!root) return;
    root.inert = !drawerOpen;
  }, [drawerOpen]);

  // Wave P-37 round-3 a11y fix — when the drawer is open, the rest of
  // the shell (ribbon + main chamber) must be removed from the focus
  // order and the a11y tree. role="dialog" + aria-modal="true" only
  // *advertises* modality; without `inert` on the background, Tab still
  // walks into ribbon/chamber controls. Toggle the native HTMLElement
  // .inert property on the non-drawer wrapper. useLayoutEffect runs
  // before paint so there's no flash where background is focusable
  // while the drawer is being opened.
  useLayoutEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    wrap.inert = drawerOpen;
  }, [drawerOpen]);

  // Restore focus to the hamburger after the drawer closes. Runs in a
  // post-commit effect so it executes AFTER the layout effect above has
  // un-inerted the wrapper — focusing an inert ancestor's child is a
  // no-op, so doing this synchronously inside the Esc handler would
  // silently fail. The wasOpenRef gate ensures we don't steal focus on
  // first render when drawerOpen starts false.
  useEffect(() => {
    if (drawerOpen) {
      wasOpenRef.current = true;
      return;
    }
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    hamburgerReturnRef.current?.focus();
  }, [drawerOpen]);

  function openDrawer() {
    hamburgerReturnRef.current = document.activeElement as HTMLElement | null;
    setDrawerOpen(true);
  }

  function enterSignal() {
    try {
      localStorage.setItem(ENTERED_KEY, "true");
    } catch (e) {
      console.warn("[shell] localStorage.setItem failed — entered flag not persisted:", e);
    }
    setEntered(true);
  }

  // Wave P-34 — Chamber switch entry/exit motion.
  //
  // Every setActiveTab call funnels through runViewTransition so the
  // browser snapshots the outgoing chamber, runs the React re-render
  // inside the snapshot frame, and crossfades to the new chamber.
  // Chromium uses ::view-transition-old/new (styled in tokens.css);
  // browsers without the API silently no-op and the chamber swaps
  // instantly. Reduced-motion users bypass the snapshot entirely.
  const switchChamber = useCallback(
    (next: Chamber) => {
      runViewTransition(() => setActiveTab(next), { reduced });
    },
    [reduced],
  );

  function pickChamberFromDrawer(c: Chamber) {
    switchChamber(c);
    setDrawerOpen(false);
  }

  // Follow the active mission's chamber whenever the user switches missions
  // (via the ribbon dropdown). A fresh mission created by Insight first-send
  // lands as chamber="insight", keeping the user in place.
  useEffect(() => {
    if (activeMission) switchChamber(activeMission.chamber);
  }, [activeMission?.id, switchChamber]);

  // Cross-chamber handoff — chambers can request a chamber switch by
  // dispatching `signal:chamber` with a Chamber detail. The legacy
  // `ruberra:chamber` event is still accepted during the Wave-0 → Wave-8
  // compatibility window so call sites can migrate gradually.
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Chamber>;
      if (ce.detail) switchChamber(ce.detail);
    };
    window.addEventListener("signal:chamber", handler);
    window.addEventListener("ruberra:chamber", handler);
    return () => {
      window.removeEventListener("signal:chamber", handler);
      window.removeEventListener("ruberra:chamber", handler);
    };
  }, [switchChamber]);

  // Wave-7 keyboard shortcut: Alt+[1-5] switches chambers.
  // Index order mirrors the ribbon (insight, surface, terminal, archive, core).
  // Ignored when the user is typing — textarea / input / contenteditable
  // targets do not steal focus, and Alt is Option on macOS which avoids
  // the Cmd+K palette territory (Wave P-35 owns ⌘K below).
  useEffect(() => {
    const ORDER: Chamber[] = ["insight", "surface", "terminal", "archive", "core"];
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      const idx = Number(e.key) - 1;
      if (Number.isInteger(idx) && idx >= 0 && idx < ORDER.length) {
        e.preventDefault();
        switchChamber(ORDER[idx]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [switchChamber]);

  // Wave P-35 — ⌘K / Ctrl+K toggles the command palette anywhere, even
  // mid-typing. Browsers default-bind ⌘K to focus the URL bar; calling
  // preventDefault is what reclaims it. Esc-to-close is owned by the
  // palette itself (it has its own keydown handler) so the shell does
  // not double-handle the close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!entered) {
    return <Landing onEnter={enterSignal} />;
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--bg)",
        position: "relative",
      }}
    >
      {/* Wave P-37 round-3 — non-drawer content lives inside this
          wrapper so we can flip HTMLElement.inert on the whole subtree
          while the mobile drawer is open. The drawer + scrim are
          siblings (outside this wrapper) so they remain focusable and
          the dialog stays operable. The wrapper owns the column flex
          layout that previously sat on the outer container — keeping it
          on a real (non `display: contents`) box avoids known inert +
          display:contents browser quirks. */}
      <div
        ref={wrapperRef}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Wave P-35 — WCAG 2.4.1 skip-link. Hidden until keyboard focus
            pulls it back into view. Lives inside the inert wrapper so
            it correctly disappears from the focus order when the mobile
            drawer is open (operator should be focused on the dialog). */}
        <a href="#main" className="skip-link">
          Skip to main
        </a>
        <CanonRibbon
          active={activeTab}
          onSelect={switchChamber}
          isMobile={isMobile}
          onOpenDrawer={openDrawer}
        />
        {/* tabIndex={-1} makes <main> programmatically focusable so the
            skip-link's #main anchor activation actually moves keyboard
            focus here (the next Tab then continues from inside main
            instead of bouncing back to the ribbon). The element stays
            out of the normal Tab order because tabIndex is negative. */}
        <main
          id="main"
          tabIndex={-1}
          style={{
            flex: 1,
            overflow: "auto",
            outline: "none",
            // Wave P-34 — name the <main> region so the View Transitions
            // API can crossfade just the chamber body when state we
            // mutate is scoped here (e.g. mission switch). The root
            // pseudo (::view-transition-old/new(root)) still snapshots
            // the whole viewport for full chamber swaps.
            // viewTransitionName isn't in @types/react yet; cast via
            // an index signature so the property still serialises onto
            // the inline style attribute.
            ...({ viewTransitionName: "chamber" } as Record<string, string>),
          }}
        >
          <ChamberErrorBoundary key={activeTab} chamber={activeTab}>
            {renderChamber(activeTab)}
          </ChamberErrorBoundary>
        </main>
      </div>
      {/* Wave P-35 — Command palette. Sits outside the inert wrapper so
          it stays interactive even when the mobile drawer is open. */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
      {isMobile && (
        <>
          {/* Wave P-37 — Mobile drawer. Slides from the left and contains
              the chamber switcher + density toggle. The dimmed scrim
              dismisses on click; Esc dismisses via the keyboard contract
              installed above. The drawer never renders on desktop, so
              keyboard nav on wide viewports is untouched. */}
          <div
            className="mobile-drawer-scrim"
            data-open={drawerOpen ? "true" : undefined}
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside
            ref={drawerRef}
            className="mobile-drawer"
            data-open={drawerOpen ? "true" : undefined}
            role="dialog"
            aria-modal="true"
            aria-label="Câmaras"
            aria-hidden={!drawerOpen}
          >
            <div className="mobile-drawer-head">
              <span className="mobile-drawer-title">Câmaras</span>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
              >
                ✕
              </button>
            </div>
            <nav className="mobile-drawer-nav" aria-label="Câmaras">
              {CHAMBERS.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  className="mobile-drawer-item"
                  data-active={activeTab === c ? "true" : undefined}
                  data-drawer-first={i === 0 ? "true" : undefined}
                  onClick={() => pickChamberFromDrawer(c)}
                  aria-current={activeTab === c ? "page" : undefined}
                >
                  {copy.chambers[c].label}
                </button>
              ))}
            </nav>
            <div className="mobile-drawer-controls">
              <span className="mobile-drawer-section-label">Densidade</span>
              <div className="mobile-drawer-density">
                {DENSITY_CYCLE.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className="mobile-drawer-density-pill"
                    data-active={tweaks.density === d ? "true" : undefined}
                    onClick={() => setTweak("density", d)}
                    aria-pressed={tweaks.density === d}
                  >
                    {DENSITY_LABEL[d]}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
