// Wave P-34 — motion + microinteraction primitives.
//
// Goal: replace the codebase's "static enterprise" feel with deliberate
// motion. Every state change earns an entry/exit. Reduced-motion users
// see no animation.
//
// Constraints:
//   - Zero animation libraries — pure CSS + the View Transitions API.
//   - All consumers gate on useReducedMotion(): when true, fall back to
//     instant state changes (no animation, no transition).
//   - The animations themselves live in CSS classes declared in
//     src/styles/tokens.css (motion-fade-in, motion-slide-in-top,
//     motion-press, motion-cross-fade). This module exposes only the
//     React-side glue: a hook, a stagger primitive, and a View
//     Transitions helper.
//
// Token reference (src/styles/tokens.css):
//   --motion-duration-fast:   120ms   (presses, color crossfades)
//   --motion-duration-normal: 200ms   (chamber/panel mounts)
//   --motion-duration-slow:   360ms   (long fades, hero entries)
//   --motion-easing-out:      cubic-bezier(0.2, 0, 0, 1)
//   --motion-easing-in-out:   cubic-bezier(0.4, 0, 0.2, 1)
//   --motion-easing-spring:   cubic-bezier(0.5, 1.5, 0.5, 1)
//
// Note: this file deliberately uses React.createElement instead of JSX
// so the .ts extension stays valid (React JSX requires .tsx). Callers
// import { Stagger } and use it as a normal React component.

import {
  Children,
  Fragment,
  cloneElement,
  createElement,
  isValidElement,
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * useReducedMotion — returns true when the user has asked the OS to
 * reduce motion. SSR-safe (returns true while window is unavailable
 * because the safest default is "no animation"). Subscribes to the
 * media query so a runtime preference change flips state without a
 * reload.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return true;
    }
    try {
      return window.matchMedia(REDUCED_MOTION_QUERY).matches;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(REDUCED_MOTION_QUERY);
    } catch {
      return;
    }
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    // addEventListener is the modern API; older Safari shipped
    // addListener. Try modern first, fall back, then bail.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    const legacyMql = mql as MediaQueryList & {
      addListener?: (l: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (l: (e: MediaQueryListEvent) => void) => void;
    };
    if (typeof legacyMql.addListener === "function") {
      legacyMql.addListener(onChange);
      return () => legacyMql.removeListener?.(onChange);
    }
    return;
  }, []);

  return reduced;
}

/**
 * runViewTransition — wrapper around the View Transitions API
 * (Chromium-only at time of writing). When the API is unavailable, or
 * the user prefers reduced motion, the callback runs synchronously
 * with no animation. Callers should treat the return value as
 * fire-and-forget; the state update inside the callback is what makes
 * the transition snapshot make sense.
 *
 * React 18 commit guarantee: state updates are batched and committed
 * asynchronously by default. View Transitions snapshot the "new" DOM
 * after the callback returns, so a deferred React commit would be
 * captured stale or partial. We wrap `update` in `flushSync` so React
 * commits the DOM synchronously inside the transition callback,
 * before the snapshot is taken.
 */
type StartViewTransition = (cb: () => void) => unknown;

export function runViewTransition(update: () => void, opts?: { reduced?: boolean }): void {
  if (opts?.reduced) {
    update();
    return;
  }
  if (typeof document === "undefined") {
    update();
    return;
  }
  const doc = document as Document & { startViewTransition?: StartViewTransition };
  if (typeof doc.startViewTransition === "function") {
    try {
      doc.startViewTransition(() => {
        flushSync(update);
      });
      return;
    } catch {
      // Fall through to the synchronous path on any error so we never
      // strand the caller without the state update.
    }
  }
  update();
}

/**
 * <Stagger> — applies a CSS animation-delay to each direct child so
 * a mounted list animates in sequence. Pure presentational: callers
 * still own the entry animation (typically `motion-fade-in` or
 * `motion-slide-in-top` on the children themselves). The stagger
 * collapses to zero when the user prefers reduced motion.
 *
 * Usage:
 *   <Stagger step={40}>
 *     <Panel className="motion-fade-in" />
 *     <Panel className="motion-fade-in" />
 *   </Stagger>
 *
 * Children must accept a `style` prop (HTML elements and most
 * components do). Non-element children are passed through unchanged.
 */
export interface StaggerProps {
  /** Children to stagger. Each direct child gets a delay. */
  children: ReactNode;
  /** Delay between each child, in ms. Default 40ms. */
  step?: number;
  /** Initial offset for the first child, in ms. Default 0. */
  start?: number;
  /** Force-disable the stagger (e.g. during a re-render). */
  disabled?: boolean;
}

export function Stagger({ children, step = 40, start = 0, disabled }: StaggerProps) {
  const reduced = useReducedMotion();
  const off = disabled || reduced;
  let i = 0;
  const mapped = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const delay = off ? 0 : start + i * step;
    i += 1;
    const element = child as ReactElement<{ style?: CSSProperties }>;
    const prevStyle = element.props.style ?? {};
    const nextStyle: CSSProperties = {
      ...prevStyle,
      animationDelay: `${delay}ms`,
    };
    return cloneElement(element, { style: nextStyle });
  });
  return createElement(Fragment, null, mapped);
}
