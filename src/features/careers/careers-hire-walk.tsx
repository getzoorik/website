"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * How we hire's marker (the mock's script): it walks the six steps, one every
 * 1.6s, while at least 30% of the steps are in view, and lights the step it is
 * on (`.is-at`, its icon in the accent). It rests where it was when they leave
 * and walks on from there when they come back.
 *
 * The island is the steps' own box (`.cq-hire`); the track and the steps inside
 * it are the server's. The first step is lit in the markup, so the page reads
 * the same before this runs, under reduced motion (where it never walks) and
 * with scripting off.
 */

const AT = "is-at";
/** How long the marker rests on each step. */
const STEP_MS = 1600;
/** The mock's threshold: the marker walks once 30% of the steps are in view. */
const IN_VIEW = 0.3;

export function CareersHireWalk({ children }: { readonly children: ReactNode }): React.JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  /** The step the marker is on, kept across a pause. */
  const at = useRef(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const hire = root.current;
    if (!hire || reduced || typeof IntersectionObserver === "undefined") return;
    const steps = [...hire.querySelectorAll<HTMLElement>(".cq-steps > li")];
    const track = hire.querySelector<HTMLElement>(".cq-track");
    let walk: ReturnType<typeof setInterval> | undefined;
    const step = () => {
      at.current = (at.current + 1) % steps.length;
      steps.forEach((li, i) => li.classList.toggle(AT, i === at.current));
      track?.style.setProperty("--at", String(at.current));
    };
    const watch = new IntersectionObserver(
      (entries) => {
        clearInterval(walk);
        if (entries[entries.length - 1]?.isIntersecting) walk = setInterval(step, STEP_MS);
      },
      { threshold: IN_VIEW },
    );
    watch.observe(hire);
    return () => {
      watch.disconnect();
      clearInterval(walk);
    };
  }, [reduced]);

  return (
    <div className="cq-hire" ref={root}>
      {children}
    </div>
  );
}
