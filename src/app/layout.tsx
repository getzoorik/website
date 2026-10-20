import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { Clarity } from "@/components/analytics/clarity";
import { InPageLinks } from "@/components/layout/in-page-links";
import { site } from "@/config/site";
import { baseOpenGraph, baseTwitter } from "@/config/social";

import "./globals.css";

/**
 * The two faces the mock uses.
 *
 * 🔴 LOADED THROUGH next/font, NOT THE MOCK'S <link> TO fonts.googleapis.com.
 * That link is render-blocking and puts a third party on the critical path of
 * every page load; next/font downloads at BUILD time and self-hosts, so the
 * bytes come from our own origin and there is no preconnect to arrange.
 *
 * 🔴 AND THEY ARE BOUND TO THE TOKENS BY VARIABLE, NEVER BY NAME. next/font
 * registers a HASHED family, so the mock's `--sans:"Inter",…` would never match
 * it: the stack would fall straight through to the system face. It looks correct
 * on any machine with Inter installed — including the one it was built on — and
 * ships as system type for everyone else. The `--font-*` variables below are
 * what `tokens.css` actually resolves.
 */
/* 🔴 THE VARIABLE FONT, BECAUSE OF 450. The mock sets Inter at 400, 450, 500
   and 600: the nav links and How it works' sub-lines sit at 450, between
   regular and medium. next/font only takes the static hundreds for Inter, so
   `"450"` in a weight list is a build error, not a fourth file; the variable
   font carries the whole axis in one file and serves 450 as itself. Listing
   400/500/600 instead would let every 450 fall back to 400 and read a shade
   too light, on every machine, with nothing to say why. */
const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-inter",
});

/* Not preloaded: the home page sets no mono text, and two font preloads there
   competed with the hero image. The face still loads, on demand, where it is
   used (the /assessment command box, the documents' command wells). /login
   sets none. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
  variable: "--font-plex-mono",
});

/* 🔴 NO `alternates` HERE. Metadata is inherited, so a layout canonical would land
   on /login and on the 404 page. Each indexed page sets its own. */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: site.titleTemplate },
  description: site.description,
  /* Index and follow, with a large image preview and no cap on a snippet's length. A
     noindex page sets its own robots: /login, and the 404. */
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  openGraph: baseOpenGraph,
  twitter: baseTwitter,
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* The font classes go on <html>, which is where the token layer reads their
       variables from. On <body> they would be one level below the `:root` block
       that consumes them, so `--sans` would resolve to nothing and every
       declaration using it would be dropped — silently, with the page rendering
       in the browser default.
       `suppressHydrationWarning` is for /assessment's first-paint script, which
       sets `data-ap` and `data-ac` on <html> before React hydrates it. It covers
       <html>'s own attributes only; a mismatch anywhere below still warns. */
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        {/* Site-wide, not page-wide: "an in-page anchor never writes to the
            address bar" is a rule about this site, and a page added later
            should not have to remember to opt in. Renders nothing. */}
        <InPageLinks />
        {children}
        {/* Every page, /login and the 404 included. The snippet itself does
            nothing anywhere but zoorik.com, and nothing before the page has
            loaded. */}
        <Clarity />
      </body>
    </html>
  );
}
