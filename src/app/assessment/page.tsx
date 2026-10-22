import type { Metadata } from "next";
import type { JSX } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { pageTitle, routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { assessmentCopy } from "@/content/assessment";
import { AssessmentPage } from "@/features/assessment/assessment-page";

import "@/styles/assessment.css";

/**
 * `/assessment` — the free cloud cost assessment: choose Coral or Amoeba, run two lines in Cloud Shell or a
 * terminal, and get one PDF report.
 *
 * ─── THE ROUTE IS `/assessment`, AND NEVER ANYTHING UNDER `/assess/` ───────
 * Cloudflare redirects every `/assess/<name>` to `<name>.py` in the public
 * assessment repo. That redirect served the one-line commands this page used to
 * print (`zoorik.com/assess/k8s` and `zoorik.com/assess/disks`), and it means a
 * page under that path can never be reached: the edge answers before this app
 * is asked.
 *
 * ─── INDEXED, UNLIKE `/login` ──────────────────────────────────────────────
 * This is a page a prospect should be able to land on from a search: it is the
 * shortest route from "how much would this save me" to a number.
 *
 * Statically rendered. `?p=` preselects a product, and it is read in the browser
 * rather than on the server, precisely so that the page stays one prerendered
 * file instead of a response computed per request.
 */
const { title, description } = assessmentCopy.meta;

/* The canonical also folds `?p=` into one URL: it is read in the browser and
   serves the same HTML. */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: routes.assessment },
  openGraph: pageOpenGraph(routes.assessment, { title: pageTitle(title), description }),
};

export default function Assessment(): JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.assessment)} />
      <AssessmentPage />
    </>
  );
}
