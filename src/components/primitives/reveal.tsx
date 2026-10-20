"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * The page's one reveal: an element rises into place the first time it is
 * scrolled into view.
 *
 * ─── ONE IMPLEMENTATION, AND THAT IS THE POINT ─────────────────────────────
 * Three sections each arrived with their own copy of this — three observers,
 * three staggers, three names for `data-i`. They were not identical, which is
 * how a page ends up with two reveal speeds nobody chose. The mock has exactly
 * one `.rise` and one observer; so does this.
 *
 * ─── THE STAGGER IS CLAMPED, AND THE CLAMP IS LOAD-BEARING ─────────────────
 * Carried from the mock verbatim, with its reasoning: 8 stops at 44ms is a
 * 308ms tail and reads as craft; 18 stops at 120ms is 2040ms and reads as a
 * slow page. The rule is "cap the stagger — clamp, do not trust the markup".
 * At this page's 80ms clock a 350ms tail is 4.4 steps, so the ceiling is 4.
 * Nothing reaches it today; the clamp is here so the day someone adds a sixth
 * staggered child the page does not quietly become slow.
 *
 * ─── NO FAILSAFE TIMEOUT, DELIBERATELY ─────────────────────────────────────
 * The mock deleted its 2600ms fallback rather than retuning it, and the reason
 * survives the port: `.rise` holds no offset in its base rule, so an element
 * whose observer never fires is already in its final position. The only thing a
 * timeout could still do is start an animation on something the reader finished
 * reading two seconds ago.
 */

/** The motion system's clock. Kept in step with `--z-step` in the sheet. */
const STEP_MS = 80;
const MAX_STEP = 4;

/** The mock's own margin: fire slightly before the element reaches the fold. */
const ROOT_MARGIN = "0px 0px -6% 0px";

export interface RevealProps {
  readonly children: ReactNode;
  /**
   * Reveal ORDER, not a delay. Both product sections index by role, so the
   * copy column is 0 and the console beside it is 1 — the numbers say what
   * arrives first, and the clock lives here.
   */
  readonly order?: number;
  /** The element to render. The mock reveals divs, section heads, list items
   *  and the By design cards, which are articles. */
  readonly as?: "div" | "header" | "section" | "article" | "li" | "p" | "ul";
  readonly className?: string;
  /**
   * The one attribute a revealed element carries in the mock besides its
   * class: the dark contact card is `#contact`. It is named rather than spread
   * from `...rest`, so this stays a reveal and does not become a second way to
   * write a div.
   */
  readonly id?: string;
  /** Inline declarations, for the sites where the MOCK carries them. */
  readonly style?: CSSProperties;
}

export function Reveal({
  children,
  style,
  order = 0,
  as: Tag = "div",
  className,
  id,
}: RevealProps): React.JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = usePrefersReducedMotion();

  const step = Math.min(Math.max(order, 0), MAX_STEP);
  /* 🔴 THE STAGGER DELAYS THE CLASS, NEVER THE ANIMATION, and the sheet is
     emphatic about why: it carries "NO animation-delay AND NO
     animation-fill-mode, deliberately". With a fill mode the FROM state applies
     through the delay, so a staggered element jumps 16px DOWN at reveal and
     sits there for its whole delay before rising — a dwell that reads as two
     events rather than one arrival. Moving the clock to the observer means a
     waiting element waits at the position the markup authored.

     Reduced motion still SETS, it just does not wait: the class is what puts
     the element in its end state, so skipping it would strand the reader
     looking at content that never arrives. */
  const delayMs = reduced ? 0 : step * STEP_MS;

  useEffect(() => {
    const el = ref.current;
    /* Nothing to observe once it has fired, and nothing to clean up: the
       observer disconnects itself below. */
    if (el === null || shown) return;

    /* 🔴 NO FALLBACK BRANCH FOR A MISSING IntersectionObserver, AND NONE IS
       NEEDED. `.rise` holds no offset in its base rule — the sheet deleted it
       deliberately — so an element that never receives `.set` is ALREADY in its
       authored position. Without an observer the copy simply does not animate,
       which is the correct degradation and the reason a `setShown(true)` here
       would be both redundant and a cascading render. */
    if (typeof IntersectionObserver === "undefined") return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry === undefined || !entry.isIntersecting) return;
        io.unobserve(entry.target);
        if (delayMs === 0) {
          setShown(true);
          return;
        }
        timer = setTimeout(() => setShown(true), delayMs);
      },
      { rootMargin: ROOT_MARGIN },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [shown, delayMs]);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={[className, "rise", shown ? "set" : undefined].filter(Boolean).join(" ")}
      style={style}
      /* `data-i` is ORDER and is omitted at 0, exactly as the mock authors it —
         the sheet's selectors key off its presence. */
      data-i={step === 0 ? undefined : step}
    >
      {children}
    </Tag>
  );
}
