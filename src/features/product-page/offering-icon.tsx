import type { JSX } from "react";

import type { OfferingIcon as OfferingIconKey } from "@/content/product-page";

/**
 * The offering icons, verbatim from the mocks. Not a library set: each path is
 * the mock's.
 *
 * One drawing per offering, used twice: in the hero's tag and in the 40px tile
 * of its row under "What you get", so the eye matches the two. The size is the
 * surface's (`.offer svg` 18px, `.flist-i svg` 20px), and the ink is
 * `currentColor`. Always `aria-hidden`: the label beside it is the name.
 */
const PATHS: Record<OfferingIconKey, JSX.Element> = {
  monitor: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </>
  ),
  reco: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.6V17h5.2v-1.5c0-.6.3-1.2.9-1.6A6 6 0 0 0 12 3z" />
    </>
  ),
  workload: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  node: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </>
  ),
  savings: (
    <>
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M15 17h6v-6" />
    </>
  ),
  storage: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="2.8" />
      <path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13" />
      <path d="M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8" />
    </>
  ),
};

export function OfferingIcon({ icon }: { readonly icon: OfferingIconKey }): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[icon]}
    </svg>
  );
}
