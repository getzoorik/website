"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { anchorAliases, hashKeepingRoutes } from "@/config/site";

/**
 * In-page links keep the address bar clean. One page, one URL.
 *
 * Ported from the mock's own handler (`index.html`, "in-page links keep the
 * address bar clean"), which the first pass of the port missed: a nav click
 * scrolls to the section and the hash never lands in the location, so the
 * address people copy, bookmark and share is always `zoorik.com` — never
 * `zoorik.com/#coral`. A link that still arrives with a hash from
 * somewhere else scrolls once, then drops it.
 *
 * ─── ONE DELEGATED LISTENER, NOT AN onClick ON EVERY ANCHOR ────────────────
 * The in-page anchors are spread across the nav, the drawer, the footer, the
 * hero and three section CTAs, and every one of them takes its href from a
 * content module — so a per-anchor handler would be eight edits, would turn
 * four server components into client ones, and would still miss the ninth
 * anchor somebody adds next month. Delegating from `document` is one place,
 * and it covers markup that does not exist yet.
 *
 * ─── THE ANCHORS STAY ANCHORS ──────────────────────────────────────────────
 * Nothing here replaces `<a href="#...">` with a button. The href is what makes
 * the link right-clickable, what a crawler follows to find the section, and
 * what still works with this script blocked — the page then behaves exactly as
 * it did before, hash and all. This is an enhancement on top of markup that is
 * already correct, not the mechanism the navigation depends on.
 *
 * ─── AND IT DOES NOT RE-SCROLL AN INBOUND HASH, WHICH THE MOCK HAS TO ──────
 * The mock's script runs while the document is still parsing, so it strips the
 * hash BEFORE the browser can act on it — and then has to perform that scroll
 * itself. An effect runs after both the browser's fragment scroll (on a full
 * load) and the router's (on a client-side navigation), so by the time this
 * code sees the hash the reader is already in the right place and there is
 * nothing to reproduce. Scrolling again here is not merely redundant: measured
 * against the mock's own target, the second scroll LOST the position the first
 * one had got exactly right. Removing the hash afterwards does not undo a
 * scroll that has already happened.
 *
 * The ordering that makes that safe is React's, not luck: the router scrolls in
 * a layout effect and this is a passive one, so it always runs second.
 *
 * ─── EXCEPT A RENAMED ANCHOR, WHICH NOTHING ELSE CAN SCROLL ────────────────
 * `#elastic` and `#kubernetes` were the product sections' ids before the
 * products were named Amoeba and Coral, and links to them are still out there.
 * They name no element now, so the browser scrolls nowhere and the reader would
 * land on the hero. `anchorAliases` maps each to its new id, and this is the one
 * inbound case where this component performs the scroll itself.
 *
 * ─── AND THE LONG DOCUMENTS KEEP THEIR HASH ────────────────────────────────
 * On the four guides and FAQs and the two legal pages (`hashKeepingRoutes`, the
 * mocks' `data-keep-hash`) a reader shares the section they are reading. There a click
 * scrolls the same way and then WRITES `#id` to the address, and an inbound
 * hash is left where it is: the browser's own fragment scroll has already
 * landed it under the bar (the sections carry `scroll-margin-top`). Still
 * `replaceState`, so Back leaves the page rather than walking back through the
 * contents.
 */
export function InPageLinks(): null {
  /* 🔴 NOT A BARE MOUNT EFFECT. The root layout — and so this component —
     SURVIVES a client-side navigation, so a mount-only effect would clean the
     hash on a full page load and never again. `/login`'s "Book a demo" points
     at `/#contact`, which is exactly that navigation: the reader would land on
     the contact section with `#contact` sitting in the bar, which is the thing
     this component exists to prevent. The pathname is the signal that a new
     page has arrived. */
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* `/coral/guide/` and `/coral/guide` are one page. */
    const here = (pathname ?? window.location.pathname).replace(/(.)\/$/, "$1");
    const keepHash = hashKeepingRoutes.includes(here);

    /* Drop the hash without navigating. `replaceState` rather than `pushState`
       so the Back button still leaves the site instead of walking a reader back
       through every section they scrolled to. */
    const dropHash = () => {
      if (keepHash || !window.location.hash) return;
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      /* A modified click is a request to open elsewhere, and a handler that
         already called preventDefault has its own plan. */
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const id = anchor.getAttribute("href")!.slice(1);
      /* A bare `#` is a placeholder for a page that does not exist yet (the
         footer's legal links were, until /privacy). Left alone it scrolls the
         reader to the top of the page for no reason and writes a `#` to the
         address bar; it should do nothing until it points somewhere. */
      if (!id) {
        event.preventDefault();
        return;
      }

      const section = document.getElementById(anchorAliases.get(id) ?? id);
      /* An id that is not on this page is not ours to intercept — let the
         browser do whatever it does with a broken fragment. */
      if (!section) return;

      event.preventDefault();
      /* A jump of more than two screens lands at once: a smooth scroll that far
         runs past a second, and interface motion should stay well under that. */
      const far = Math.abs(section.getBoundingClientRect().top) > 2 * window.innerHeight;
      section.scrollIntoView({ behavior: reduced || far ? "auto" : "smooth", block: "start" });
      /* 🔴 AND MOVE FOCUS, WHICH THE MOCK DOES NOT. Following a hash natively
         moves focus to the target; intercepting the click takes that away, so a
         keyboard reader who activates "Coral" lands with focus still on
         the nav and has to tab through the whole bar again to reach the section
         they just asked for. `tabindex="-1"` makes the section focusable
         WITHOUT putting it in the tab order, and `preventScroll` stops the
         focus call from jumping the page the smooth scroll is still animating. */
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
      if (keepHash) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#${id}`,
        );
      } else {
        dropHash();
      }
    };

    document.addEventListener("click", onClick);

    /* A hash that arrived from somewhere else — an old bookmark, a search
       result, the login page's "Book a demo". The reader has already been
       scrolled to it by the browser or the router; all that is left is to take
       it out of the address bar, so the URL matches every other way of
       arriving here. An old anchor is the exception: it named no element, so
       nothing has scrolled yet, and the jump is instant because that is what
       the browser's own fragment scroll would have been. */
    const followAlias = () => {
      const alias = anchorAliases.get(window.location.hash.slice(1));
      if (!alias) return false;
      document.getElementById(alias)?.scrollIntoView({ behavior: "auto", block: "start" });
      return true;
    };
    followAlias();
    dropHash();

    /* An old link pasted into the bar of a tab already on this page is a
       same-document hash change: no reload, so the code above never sees it.
       Only an old anchor is handled here; any other hash change is the
       browser's, as it was. */
    const onHashChange = () => {
      if (followAlias()) dropHash();
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
