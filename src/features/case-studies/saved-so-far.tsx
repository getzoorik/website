"use client";

import { useEffect, useRef } from "react";

/** A monthly figure as the hub prints it: "$213.89". */
export const dollars = (value: number): string =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Value Lab's "Saved so far" figure. The page is drawn with the real figure, so a reader without scripting, and a
 * crawler, reads it; once loaded it counts up once from $0.00 to that figure in 1.2s, easing out. Reduced motion shows
 * it at once. Nothing is stored.
 */
export function SavedSoFar({ value }: { readonly value: number }): React.JSX.Element {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const figure = ref.current;
    if (!figure || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let start: number | null = null;
    let frame = 0;
    figure.textContent = dollars(0);
    const step = (now: number) => {
      start ??= now;
      const k = Math.min(1, (now - start) / 1200);
      figure.textContent = dollars(value * (1 - Math.pow(1 - k, 3)));
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      figure.textContent = dollars(value);
    };
  }, [value]);
  return <b ref={ref}>{dollars(value)}</b>;
}
