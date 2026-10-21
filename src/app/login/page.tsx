import type { Metadata, Viewport } from "next";
import type { JSX } from "react";

import { pageTitle, routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { LoginScreen } from "@/features/login/login-screen";

import "@/styles/login.css";

/**
 * `/login` — the product chooser.
 *
 * ─── NOINDEX, ON PURPOSE ───────────────────────────────────────────────────
 * This page ranks for nothing and helps no one arriving from a search: it is a
 * signpost for people who already have an account, and a search result landing
 * a prospect here instead of on the home page is a worse first visit than none.
 * The consoles it points at are noindex for their own reasons.
 *
 * Statically rendered — the console URL is a build-time constant, so there is
 * nothing here to compute per request.
 */
const title = "Sign in";
const description = "Choose a Zoorik product to sign in to.";

/* No canonical: the page is noindex, and robots.ts must still let crawlers fetch it
   so they can read that tag. */
export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  openGraph: pageOpenGraph(routes.login, { title: pageTitle(title), description }),
};

/* The panel's ground, `--ground`, as `login.html` sets it: the one page whose
   theme colour is not the brand navy the layout gives every other page. */
export const viewport: Viewport = {
  themeColor: "#0B0D14",
};

export default function LoginPage(): JSX.Element {
  return <LoginScreen />;
}
