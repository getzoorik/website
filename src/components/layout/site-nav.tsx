"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { BrandLogo } from "@/components/brand/brand-mark";
import { ProductMark } from "@/components/brand/product-marks";
import { NamedText } from "@/components/primitives/named-text";
import { NewTabHint } from "@/components/primitives/new-tab-hint";

import {
  menuLabelHref,
  navLinks,
  navLogin,
  navMenus,
  navState,
  primaryCta,
  site,
  type NavMenu,
  type NavMenuKey,
  type NavProductLink,
  type NavState,
} from "@/config/site";
import { products, type ProductId } from "@/content/products";
import { useNavSolid } from "@/hooks/use-nav-solid";
import { offSiteProps } from "@/lib/links";

/**
 * The top bar, its four menus and its mobile drawer.
 *
 * The bar: Coral · Amoeba · Assessment ▾ · Product guide ▾ · FAQ ▾ · Docs ▾ ·
 * Login · Book a demo. Each menu is a small white card under the bar with one
 * row per product; Docs adds a row to the whole hub, then the Learn row to the
 * articles. From 1000px down the links and menus give way to the toggle, and
 * the drawer lists the same things: the two product links, one group per menu
 * with the products as chips ("All" and "Learn" after them in Docs), then
 * Login.
 *
 * ─── WHY THIS IS A CLIENT COMPONENT AND THE REST OF THE PAGE IS NOT ─────────
 * Only the menus and the drawer hold state. Everything else on this site renders
 * on the server, so this is the one island — which is why the nav is its own
 * component rather than markup inside the page.
 *
 * ─── EVERY PAGE KNOWS ITS PLACE AT BUILD ───────────────────────────────────
 * What is current — a bar link, a menu's `.is-cur`, a row inside a menu, a
 * drawer chip — comes from the pathname (`navState` in the site config). The
 * pathname is known when the page is prerendered, so the HTML already carries
 * the right marks and every route stays static. One mark waits for the browser:
 * /assessment serves both products from one file, so its own row in the
 * Assessment menu, and its drawer chip, follow `html[data-ap]`, the product the
 * page has read from its address and keeps in step with its switch. A menu
 * button never takes `aria-current`: it is not a page.
 *
 * ─── THREE OF THE MENUS ARE A WORD AND A CHEVRON ───────────────────────────
 * Assessment, FAQ and Docs: the word is a link, and the chevron after it is a
 * button of its own that opens the menu ("Assessment menu" to a screen reader).
 * The word lands on Coral's page, the default, on every page, Amoeba's own
 * included — `/assessment?p=coral`, `/coral/faq`, `/docs#coral`
 * (`menuLabelHref`) — and the rows in the menu lead to each product's. One
 * control could not do both: a button that navigated would leave a keyboard no
 * way into the menu, and a link that opened a menu would leave a touch reader
 * no way to the page. Product guide stays one button that only opens its menu.
 * The word takes `aria-current` only when it leads to this very page (its path
 * whatever its hash, and on /assessment the product the page is on: `isPage`);
 * `.is-cur` marks the menu the page is in, on the word and the chevron alike.
 *
 * ─── THE MENUS ARE DISCLOSURES, NOT `role="menu"` ──────────────────────────
 * A button and a list of links. A click, Enter or
 * Space on the button — the chevron, where the word is a link — toggles one,
 * and opening one closes the others. With a mouse, hovering anywhere on it,
 * word included, opens it and leaving closes it 180ms later; a click in the
 * 400ms after a hover-open does not close what the reader is about to use.
 * Escape closes an open menu wherever focus is, and from inside it hands focus
 * back to its button (the mock's script heard Escape only inside the menu, which
 * left a hover-opened card over the page with no key to put it away); focus
 * leaving it, a click outside it, a click on one of its rows or its word (either
 * can be the page you are on) and a resize all close it. There are no arrow
 * keys and no roving tabindex: Tab goes word, chevron, then the rows when the
 * menu is open, and Tab past the last row closes the menu on its way to the
 * next item in the bar. Opening a menu never moves focus.
 *
 * ─── THE DRAWER CLOSES THE WAYS PEOPLE CLOSE MENUS ─────────────────────────
 * Following a link in it; Escape, which hands focus back to the toggle when
 * focus was in the drawer or on the toggle; a tap anywhere outside the bar; and
 * the bar widening past the breakpoint, where the CSS hides the drawer but the
 * toggle would still say "open". There is deliberately no focus trap: this does
 * not claim `aria-modal`, so it does not owe the trap that claim would require,
 * and a half-built trap is worse than none.
 *
 * ─── AND THE BAR GROUNDS ITSELF PAST THE HERO ──────────────────────────────
 * `useNavSolid`. This is legibility rather than polish: over the dark hero the
 * wordmark and links are white, and every section below is white, so a bar
 * that never flips is white type on white paper from the first scroll.
 *
 * ─── ONE ENTRY LEAVES THE SITE ─────────────────────────────────────────────
 * Book a demo is the calendar, so it alone opens in a new tab and says so to a
 * screen reader. In the bar it carries no arrow, as the mock draws it.
 *
 * ─── FOCUS IS NEVER HIDDEN UNDER THE BAR ───────────────────────────────────
 * The bar is fixed, so Shift+Tab back up a page could park the focused control
 * under it (WCAG 2.4.11). A focus that lands under the bar scrolls the page by
 * exactly as much as it must. `scroll-padding` would do it too, but it adds to
 * every section's own scroll margin and would double each anchor's landing.
 *
 * Plain anchors and literal class names throughout: this ships on every page
 * (no `next/link`, no `cn()`).
 */

/** Where the drawer stops existing: the CSS shows the toggle up to 1000px. */
const WIDE_QUERY = "(min-width:1001px)";
/** Only a pointer that can hover opens a menu by hovering. */
const HOVER_QUERY = "(hover:hover) and (pointer:fine)";
/** How long a menu waits after the pointer leaves, so a pointer crossing the gap keeps it. */
const LEAVE_MS = 180;
/** A click this soon after a hover-open is the same intent, not a request to close. */
const HOVER_GRACE_MS = 400;
/** The least room a menu keeps from the viewport's right edge. */
const EDGE = 16;

const ddId = (key: NavMenuKey) => `nvm-${key}`;

/**
 * Whether a word's address is the page itself: the same path, whatever its hash
 * (`/docs#coral` on /docs), and, where it names a product (`?p=coral`), the
 * product the page is on, which only /assessment's own row knows (`navState`).
 * On Amoeba's assessment the word, which leads to Coral's, is not this page.
 */
function isPage(href: string, pathname: string, state: NavState): boolean {
  const [path, query = ""] = href.replace(/#.*$/, "").split("?");
  if (path !== pathname.replace(/(.)\/$/, "$1")) return false;
  const product = new URLSearchParams(query).get("p");
  return product === null || state.here?.product === product;
}

/* The product /assessment is on: `html[data-ap]`, which its first-paint script
   sets before the page paints and the page keeps in step with its switch
   (`first-paint.ts`). Absent on every other page with this bar (/login sets it
   too, and draws no bar). Read after hydration only, so
   the prerendered bar and the render that hydrates it agree. */
function watchAssessing(onChange: () => void): () => void {
  const watcher = new MutationObserver(onChange);
  watcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ap"] });
  return () => watcher.disconnect();
}

const isProductId = (value: string | null): value is ProductId =>
  value !== null && Object.prototype.hasOwnProperty.call(products, value);

function readAssessing(): ProductId | null {
  const ap = document.documentElement.getAttribute("data-ap");
  return isProductId(ap) ? ap : null;
}

const assessingOnServer = (): ProductId | null => null;

/** The chevron after a menu's word. */
function Chevron(): React.JSX.Element {
  return (
    <svg className="nv-chev" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

/** One of the two product links ahead of the menus, in the bar or in the drawer. */
function NavEntry({
  link,
  state,
  onFollow,
}: {
  link: NavProductLink;
  state: NavState;
  onFollow?: () => void;
}) {
  return (
    <a
      className="nav-prod"
      href={link.href}
      onClick={onFollow}
      aria-current={state.current === link.key ? "page" : undefined}
      translate="no"
    >
      <ProductMark product={link.product} />
      {link.label}
    </a>
  );
}

/** Whether a menu row, its Learn row, or its foot row (`product` undefined), is the page itself. */
const isHere = (state: NavState, menu: NavMenuKey, product?: ProductId | "learn" | "open") =>
  state.here?.menu === menu && state.here.product === product;

/** The Learn row's open book: the site's own line icon, in
 *  the accent, in the 20px slot the product marks take. */
function BookIcon(): React.JSX.Element {
  return (
    <svg
      className="nv-mk nv-ic"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 6.5c-1.6-1.3-4.2-2-7.5-2v13c3.3 0 5.9.7 7.5 2 1.6-1.3 4.2-2 7.5-2v-13c-3.3 0-5.9.7-7.5 2z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

/** The Open source row's code brackets, in the same slot and colour as the book. */
function CodeIcon(): React.JSX.Element {
  return (
    <svg
      className="nv-mk nv-ic"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.4 5.5l-2.8 13" />
    </svg>
  );
}

/** The rows of one menu: a product mark, its name and its line; then the foot
 *  row; then, in Docs, the Learn row under its own hairline and the Open source row under it. */
function MenuRows({ menu, state }: { menu: NavMenu; state: NavState }) {
  return (
    <>
      {menu.rows.map((row) => (
        <a
          className="nv-item"
          key={row.product}
          href={row.href}
          aria-current={isHere(state, menu.key, row.product) ? "page" : undefined}
        >
          <ProductMark product={row.product} className="nv-mk" />
          <span>
            <b>
              <span translate="no">{products[row.product].name}</span>
            </b>
            <small>{row.line}</small>
          </span>
        </a>
      ))}
      {menu.all ? (
        <a
          className="nv-item nv-foot"
          href={menu.all.href}
          aria-current={isHere(state, menu.key) ? "page" : undefined}
        >
          <span>
            <b>{menu.all.label}</b>
          </span>
          <svg
            className="nv-go"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      ) : null}
      {menu.learn ? (
        <a
          className="nv-item nv-learn"
          href={menu.learn.href}
          aria-current={isHere(state, menu.key, "learn") ? "page" : undefined}
        >
          <BookIcon />
          <span>
            <b>
              <NamedText text={menu.learn.label} name={site.name} />
            </b>
            <small>{menu.learn.line}</small>
          </span>
        </a>
      ) : null}
      {menu.open ? (
        <a
          className="nv-item nv-learn"
          href={menu.open.href}
          aria-current={isHere(state, menu.key, "open") ? "page" : undefined}
        >
          <CodeIcon />
          <span>
            <b>{menu.open.label}</b>
            <small>{menu.open.line}</small>
          </span>
        </a>
      ) : null}
    </>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<NavMenuKey | null>(null);
  const dropId = useId();
  const barRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  /* The open menu, readable by the listeners below the moment it changes: a
     click can follow a hover-open before React has rendered it. */
  const menuRef = useRef<NavMenuKey | null>(null);
  const dds = useRef(new Map<NavMenuKey, HTMLDivElement>());
  const leaveTimers = useRef(new Map<NavMenuKey, number>());
  /* The menu a hover has just opened, for the 400ms in which a click keeps it,
     and the timer that ends those 400ms. */
  const hoverOpened = useRef<NavMenuKey | null>(null);
  const graceTimer = useRef(0);
  /* `usePathname` can be null outside the app router (a unit test rendering the
     bar on its own); treat that as the home page. */
  const pathname = usePathname() ?? "/";
  const home = pathname === "/";
  const assessing = useSyncExternalStore(watchAssessing, readAssessing, assessingOnServer);
  const state = navState(pathname, assessing);
  /* The bar grounds itself once the hero is behind us. Without it the white
     wordmark and white links carry on over every white section below. */
  const solid = useNavSolid();

  const show = (key: NavMenuKey | null) => {
    menuRef.current = key;
    setMenu(key);
  };

  const shut = (key: NavMenuKey, back = false) => {
    if (menuRef.current !== key) return;
    show(null);
    hoverOpened.current = null;
    if (back) dds.current.get(key)?.querySelector<HTMLButtonElement>(".nv-btn")?.focus();
  };

  /* A menu never runs off the right edge: measured once it is shown, and shifted
     left by exactly its overflow. It is in use (measured): with the
     product lines the cards are 383px wide (Docs 355px), so Docs is shifted at
     every bar width up to 1440 (53px at 1001, 14px at 1440) and FAQ below about
     1200 (18px at 1001). Assessment and Product guide always fit. */
  useLayoutEffect(() => {
    if (!menu) return;
    const card = document.getElementById(ddId(menu));
    if (!card) return;
    card.style.marginLeft = "";
    const over = card.getBoundingClientRect().right - (document.documentElement.clientWidth - EDGE);
    if (over > 0) card.style.marginLeft = `${-over}px`;
  }, [menu]);

  useEffect(() => {
    const timers = leaveTimers.current;
    const grace = graceTimer;
    const onClick = (e: MouseEvent) => {
      const key = menuRef.current;
      if (!key || !(e.target instanceof Node)) return;
      if (!dds.current.get(key)?.contains(e.target)) shut(key);
    };
    const onResize = () => {
      if (menuRef.current) shut(menuRef.current);
    };
    /* Escape closes the open menu wherever focus is, so one a hover opened
       over the page can be put away without moving the pointer (WCAG 1.4.13).
       Focus goes back to the menu's button only from inside the menu; from
       anywhere else it stays where it was. */
    const onKey = (e: KeyboardEvent) => {
      const key = menuRef.current;
      if (e.key !== "Escape" || !key) return;
      shut(key, !!dds.current.get(key)?.contains(document.activeElement));
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      for (const timer of timers.values()) window.clearTimeout(timer);
      window.clearTimeout(grace.current);
    };
    /* `shut` reads only refs, so the listeners never go stale. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const active = document.activeElement;
      const inside = active === toggleRef.current || !!dropRef.current?.contains(active);
      setOpen(false);
      if (inside) toggleRef.current?.focus();
    };
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Node && barRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const wide = window.matchMedia(WIDE_QUERY);
    const onWide = (m: MediaQueryListEvent) => {
      if (m.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const bar = barRef.current;
      const target = e.target;
      if (!bar || !(target instanceof HTMLElement)) return;
      /* The bar and the skip link are above it by design; a section given
         `tabindex="-1"` by an in-page jump has already been scrolled to. */
      if (target.closest(".nav, .skip") || target.getAttribute("tabindex") === "-1") return;
      try {
        if (!target.matches(":focus-visible")) return;
      } catch {
        /* An engine without :focus-visible: keep going, a keyboard is likely. */
      }
      const rect = target.getBoundingClientRect();
      const barBottom = bar.getBoundingClientRect().bottom;
      if (rect.bottom > 0 && rect.top < barBottom + 8) {
        window.scrollBy(0, rect.top - barBottom - 16);
      }
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  /** The menu's handlers, one set per dropdown. */
  const menuHandlers = (key: NavMenuKey) => ({
    onButtonClick: () => {
      if (menuRef.current !== key) {
        show(key);
        return;
      }
      /* The click that lands just after a hover-open is the reader reaching for
         what they already see; it keeps the menu. */
      if (hoverOpened.current === key) {
        hoverOpened.current = null;
        return;
      }
      shut(key);
    },
    onMouseEnter: () => {
      if (!window.matchMedia(HOVER_QUERY).matches) return;
      window.clearTimeout(leaveTimers.current.get(key));
      if (menuRef.current === key) return;
      show(key);
      hoverOpened.current = key;
      /* Each hover-open gets its own 400ms. The mock leaves the last one's timer
         running, so one that fires late can end the next hover's window early:
         hover, leave and come back inside 400ms, click, and the menu closes. */
      window.clearTimeout(graceTimer.current);
      graceTimer.current = window.setTimeout(() => {
        if (hoverOpened.current === key) hoverOpened.current = null;
      }, HOVER_GRACE_MS);
    },
    onMouseLeave: () => {
      if (!window.matchMedia(HOVER_QUERY).matches) return;
      leaveTimers.current.set(
        key,
        window.setTimeout(() => shut(key), LEAVE_MS),
      );
    },
    /* Focus moving somewhere outside the dropdown closes it. Focus going
       nowhere (`relatedTarget` null, a click on blank page) does not: the
       outside click does that. */
    onBlur: (e: ReactFocusEvent<HTMLDivElement>) => {
      if (e.relatedTarget instanceof Node && !e.currentTarget.contains(e.relatedTarget)) shut(key);
    },
    /* A row closes its menu too, the page's own row included, where following
       it goes nowhere new. Focus stays where the browser puts it. */
    onMenuClick: (e: ReactMouseEvent<HTMLDivElement>) => {
      if (e.target instanceof Element && e.target.closest("a")) shut(key);
    },
    /* So does the word, which a hover has usually opened the menu under: on
       /docs, Docs' word is an in-page jump to `#coral`, and the menu would
       otherwise stay over the section it lands on. */
    onLabelClick: () => shut(key),
  });

  const closeDrawer = () => setOpen(false);

  return (
    <nav ref={barRef} className={solid ? "nav solid" : "nav"} aria-label="Main">
      <div className="wrap nav-in">
        <a
          className="brand"
          href={home ? "#top" : "/"}
          aria-label={home ? `${site.name}, back to top` : `${site.name} home`}
        >
          {/* The lockup draws the name in outlines (brand 2.0); the link reads it from its label,
              and the hidden span keeps it as text for anything that reads the markup. */}
          <BrandLogo />
          <span className="sr-only" translate="no">
            {site.name}
          </span>
        </a>
        <div className="nav-links">
          {navLinks.map((link) => (
            <NavEntry key={link.key} link={link} state={state} />
          ))}
          {navMenus.map((item) => {
            const on = menu === item.key;
            const cur = state.current === item.key;
            const h = menuHandlers(item.key);
            const href = item.labelLink ? menuLabelHref(item) : undefined;
            return (
              <div
                className={href ? "nv-dd nv-split" : "nv-dd"}
                key={item.key}
                ref={(el) => {
                  if (el) dds.current.set(item.key, el);
                  else dds.current.delete(item.key);
                }}
                onMouseEnter={h.onMouseEnter}
                onMouseLeave={h.onMouseLeave}
                onBlur={h.onBlur}
              >
                {href ? (
                  <>
                    {/* The word, a link; then the chevron, the menu's button. */}
                    <a
                      className={cur ? "nv-lbl is-cur" : "nv-lbl"}
                      href={href}
                      aria-current={isPage(href, pathname, state) ? "page" : undefined}
                      onClick={h.onLabelClick}
                    >
                      {item.label}
                    </a>
                    <button
                      className={cur ? "nv-btn nv-tog is-cur" : "nv-btn nv-tog"}
                      type="button"
                      aria-label={`${item.label} menu`}
                      aria-expanded={on}
                      aria-controls={ddId(item.key)}
                      onClick={h.onButtonClick}
                    >
                      <Chevron />
                    </button>
                  </>
                ) : (
                  <button
                    className={cur ? "nv-btn is-cur" : "nv-btn"}
                    type="button"
                    aria-expanded={on}
                    aria-controls={ddId(item.key)}
                    onClick={h.onButtonClick}
                  >
                    <span>{item.label}</span>
                    <Chevron />
                  </button>
                )}
                {/* Rendered closed, `hidden`, so the prerendered page carries
                    every row for crawlers and no open card. */}
                <div className="nv-menu" id={ddId(item.key)} hidden={!on} onClick={h.onMenuClick}>
                  <MenuRows menu={item} state={state} />
                </div>
              </div>
            );
          })}
          <a
            className="nav-opt"
            href={navLogin.href}
            aria-current={state.current === navLogin.key ? "page" : undefined}
          >
            {navLogin.label}
          </a>
          <a className="btn btn-solid" href={primaryCta.href} {...offSiteProps(primaryCta.href)}>
            {primaryCta.label}
            <NewTabHint href={primaryCta.href} />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={dropId}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path className="nt-open" d="M4 7h16M4 12h16M4 17h16" />
              <path className="nt-close" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
      {/* 🔴 THE SPACE IS THE CLASS. `nav-drop${"open"}` concatenates to
          `nav-dropopen`, which matches nothing — the drawer silently never
          opens, and it shipped that way once. Two class names, joined. */}
      <div ref={dropRef} className={open ? "nav-drop open" : "nav-drop"} id={dropId}>
        <div className="wrap">
          {navLinks.map((link) => (
            <NavEntry key={link.key} link={link} state={state} onFollow={closeDrawer} />
          ))}
          {navMenus.map((item) => (
            <div className="nd-grp" key={item.key}>
              {/* A label, not a heading: the drawer is one list of places. */}
              <p className="nd-h">{item.label}</p>
              <div className="nd-row">
                {item.rows.map((row) => (
                  <a
                    key={row.product}
                    href={row.href}
                    aria-current={isHere(state, item.key, row.product) ? "page" : undefined}
                    translate="no"
                    onClick={closeDrawer}
                  >
                    <ProductMark product={row.product} />
                    {products[row.product].name}
                  </a>
                ))}
                {item.all ? (
                  <a
                    href={item.all.href}
                    aria-current={isHere(state, item.key) ? "page" : undefined}
                    onClick={closeDrawer}
                  >
                    {item.all.chip}
                  </a>
                ) : null}
                {item.learn ? (
                  <a
                    href={item.learn.href}
                    aria-current={isHere(state, item.key, "learn") ? "page" : undefined}
                    onClick={closeDrawer}
                  >
                    <NamedText text={item.learn.label} name={site.name} />
                  </a>
                ) : null}
                {item.open ? (
                  <a
                    href={item.open.href}
                    aria-current={isHere(state, item.key, "open") ? "page" : undefined}
                    onClick={closeDrawer}
                  >
                    {item.open.label}
                  </a>
                ) : null}
              </div>
            </div>
          ))}
          <a
            href={navLogin.href}
            aria-current={state.current === navLogin.key ? "page" : undefined}
            onClick={closeDrawer}
          >
            {navLogin.label}
          </a>
        </div>
      </div>
    </nav>
  );
}
