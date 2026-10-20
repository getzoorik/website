import type { JSX } from "react";

import { clarityEvents } from "@/components/analytics/clarity-events";
import { calendarUrl, contactEmail, site } from "@/config/site";

/** The Clarity project for zoorik.com, created from Bing Webmaster Tools. Not a secret: every page carries it. */
export const CLARITY_PROJECT_ID = "yt6entshui";

/** The one host that records. Read from `site.url`, so it cannot drift from the canonical host. */
export const CLARITY_HOST = new URL(site.url).hostname;

/**
 * Microsoft's install snippet, unchanged, inside two guards of ours.
 *
 * 🔴 ONLY ON zoorik.com, DECIDED IN THE BROWSER. Every page is one prerendered
 * file, served byte for byte by `next start`, `opennextjs-cloudflare preview`, a
 * workers.dev URL and production. A build-time switch could not tell them apart
 * without a second build; `location.hostname` can, so local runs, previews and
 * Lighthouse on localhost never reach the live project. The alias hosts never
 * get here: next.config.ts 308s them to zoorik.com first.
 *
 * 🔴 NOT BEFORE THE PAGE HAS LOADED. Nothing of Clarity's is requested until
 * the window's `load` event and an idle moment after it, so its script never
 * competes with the stylesheet, the hero image or hydration. The cost is the
 * reader who leaves in the first second or two: they are not recorded.
 *
 * 🔴 THE SNIPPET, NEVER A BARE `src`. The file at clarity.ms/tag/<id> is a
 * loader whose first statement calls `window.clarity(…)`; it needs the queue
 * the snippet defines, and throws a TypeError without it.
 *
 * 🔴 TWO CLICKS NAMED, AS PRIVACY POLICY §4.6 SAYS. With the queue defined,
 * one click listener of ours names a click on a link to the calendar
 * (`book_demo_clicked`) or to founders@ (`email_clicked`): the name only. It
 * lives here, not in a component, so it costs no JavaScript chunk, and it
 * starts when Clarity does. The third event, a copied assessment command, is
 * named by the copy button itself, once the copy has worked (`clarityEvent`).
 */
export const claritySnippet =
  `if(location.hostname===${JSON.stringify(CLARITY_HOST)}){window.addEventListener("load",function(){` +
  `var go=function(){` +
  `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};` +
  `t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";` +
  `y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})` +
  `(window,document,"clarity","script",${JSON.stringify(CLARITY_PROJECT_ID)});` +
  `document.addEventListener("click",function(e){` +
  `var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;` +
  `var h=a.getAttribute("href"),` +
  `n=h.indexOf(${JSON.stringify(calendarUrl)})===0?${JSON.stringify(clarityEvents.bookDemoClicked)}:` +
  `h===${JSON.stringify(`mailto:${contactEmail}`)}?${JSON.stringify(clarityEvents.emailClicked)}:"";` +
  `if(n)window.clarity("event",n);},true);};` +
  `"requestIdleCallback" in window?window.requestIdleCallback(go):window.setTimeout(go,1);});}`;

/**
 * The element's id. 🔴 NEVER "clarity": an element id is also a property of
 * `window`, so `<script id="clarity">` makes `window.clarity` that element, the
 * snippet's `c[a]=c[a]||…` keeps it, and the loader dies calling it. Seen in a
 * real browser. The test environment has no named access, so a test can only
 * check the rendered id (clarity.test.tsx does), not reproduce the failure.
 */
export const CLARITY_SCRIPT_ID = "ms-clarity";

/**
 * Microsoft Clarity: heatmaps and session recordings.
 *
 * ─── A PLAIN <script>, NOT next/script ─────────────────────────────────────
 * Rendered by this server component straight into the prerendered HTML, where
 * the browser runs it as the parser reaches it. next/script is a client
 * component: importing it into the root layout adds a chunk of first-party
 * JavaScript to every page, and in local Lighthouse runs (mobile, three each)
 * that moved the home page's LCP from 3.16 s to 3.31 s. This adds about 270
 * bytes of gzipped HTML and no JavaScript of ours.
 *
 * It runs once per page load. The root layout survives client-side navigation,
 * and Clarity follows those navigations itself through the history API.
 */
export function Clarity(): JSX.Element {
  return <script id={CLARITY_SCRIPT_ID} dangerouslySetInnerHTML={{ __html: claritySnippet }} />;
}
