import type { HiringStep } from "@/content/careers";

/**
 * How we hire's glyphs, as the mock draws them: the icon over each step (`motion_parts.py`, `HIRE_ICON`) and
 * the mark in each step's mode pill (the approved page's `WRITE` and `VIDEO`, the same document and video call).
 * Decoration only: each is `aria-hidden`, and the words beside it carry the meaning.
 */

const DOCUMENT = (
  <>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M10 12h5M10 16h5" />
  </>
);

const VIDEO = (
  <>
    <rect x="3" y="6" width="13" height="12" rx="2" />
    <path d="M16 10.5l5-3v9l-5-3" />
  </>
);

const ICONS: Record<HiringStep["icon"], React.JSX.Element> = {
  document: DOCUMENT,
  video: VIDEO,
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />,
  checklist: <path d="M4 7h2M4 12h2M4 17h2M9 7h11M9 12h11M9 17h11" />,
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5M14.5 14.4c.6-.3 1.3-.5 2-.5 2.4 0 4.2 1.8 4.6 4.6" />
    </>
  ),
  offer: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 14l2 2 4-4" />
    </>
  ),
};

const MODES: Record<HiringStep["mode"], React.JSX.Element> = {
  "In writing": DOCUMENT,
  "Video call": VIDEO,
};

/** The step's icon on its 40px tile, lit while the marker is on its step (`.is-at`). */
export function StepIcon({ icon }: { readonly icon: HiringStep["icon"] }): React.JSX.Element {
  return (
    <span className="cq-hi" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[icon]}
      </svg>
    </span>
  );
}

/** How the step happens, before its words in the pill. */
export function ModeGlyph({ mode }: { readonly mode: HiringStep["mode"] }): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {MODES[mode]}
    </svg>
  );
}
