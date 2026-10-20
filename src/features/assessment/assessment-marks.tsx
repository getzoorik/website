import type { JSX } from "react";

/**
 * The glyphs the assessment page draws, verbatim from the mock's sprite (`#i-tick`, `#i-copy`, `#i-mail`,
 * `#i-eye`, `#i-play`, `#i-send`, `#i-shield`, `#i-down`), and the two marks on What
 * it does' cards: GitHub's (Simple Icons, CC0) and Python's. Each
 * paints in `currentColor` (Python's in its own two colours) and is `aria-hidden`: every one sits beside a text
 * label, or inside a control that names itself. The documents' wells draw the same tick and copy glyphs.
 *
 * The product and cloud marks and the new-tab arrow are NOT here; other pages
 * draw them too, so they come from `@/components/brand` and
 * `@/components/primitives/external-arrow`.
 */

interface GlyphProps {
  readonly className?: string;
}

/** A done step, a chosen card, a copied command. */
export function TickGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.5 8.3 2.9 2.9 6.1-6.4" />
    </svg>
  );
}

export function CopyGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function MailGlyph(): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" />
    </svg>
  );
}

/** A 24-unit line glyph from the sprite, at the sprite's 1.7 stroke. */
function Line({
  className,
  children,
}: GlyphProps & { readonly children: React.ReactNode }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const EyeGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </Line>
);

export const PlayGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.8v6.4l5-3.2z" />
  </Line>
);

export const SendGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <path d="M21 3.5 10.5 14M21 3.5 14.5 21l-4-7-7-4z" />
  </Line>
);

export const ShieldGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <path d="M12 3.5 5 6.2v5.3c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6.2z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Line>
);

/** The sprite's `#i-down`, at its own 2 stroke. */
export function DownGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
    </svg>
  );
}

/** GitHub's mark (Simple Icons, CC0), as the mock's card draws it. */
export function GitHubMark(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  );
}

/** Python's two-colour mark (the PSF's), as the mock's PyPI card draws it. One per page: its two
 *  gradient ids are its own. */
export function PythonMark(): JSX.Element {
  return (
    <svg viewBox="0.21 -0.077 110 110" width="28" height="28" aria-hidden="true">
      <linearGradient
        id="ax-py-a"
        gradientUnits="userSpaceOnUse"
        x1="63.8159"
        y1="56.6829"
        x2="118.4934"
        y2="1.8225"
        gradientTransform="matrix(1 0 0 -1 -53.2974 66.4321)"
      >
        <stop offset="0" stopColor="#387EB8" />
        <stop offset="1" stopColor="#366994" />
      </linearGradient>
      <path
        fill="url(#ax-py-a)"
        d="M55.023-0.077c-25.971,0-26.25,10.081-26.25,12.156c0,3.148,0,12.594,0,12.594h26.75v3.781 c0,0-27.852,0-37.375,0c-7.949,0-17.938,4.833-17.938,26.25c0,19.673,7.792,27.281,15.656,27.281c2.335,0,9.344,0,9.344,0 s0-9.765,0-13.125c0-5.491,2.721-15.656,15.406-15.656c15.91,0,19.971,0,26.531,0c3.902,0,14.906-1.696,14.906-14.406 c0-13.452,0-17.89,0-24.219C82.054,11.426,81.515-0.077,55.023-0.077z M40.273,8.392c2.662,0,4.813,2.15,4.813,4.813 c0,2.661-2.151,4.813-4.813,4.813s-4.813-2.151-4.813-4.813C35.46,10.542,37.611,8.392,40.273,8.392z"
      />
      <linearGradient
        id="ax-py-b"
        gradientUnits="userSpaceOnUse"
        x1="97.0444"
        y1="21.6321"
        x2="155.6665"
        y2="-34.5308"
        gradientTransform="matrix(1 0 0 -1 -53.2974 66.4321)"
      >
        <stop offset="0" stopColor="#FFE052" />
        <stop offset="1" stopColor="#FFC331" />
      </linearGradient>
      <path
        fill="url(#ax-py-b)"
        d="M55.397,109.923c25.959,0,26.282-10.271,26.282-12.156c0-3.148,0-12.594,0-12.594H54.897v-3.781 c0,0,28.032,0,37.375,0c8.009,0,17.938-4.954,17.938-26.25c0-23.322-10.538-27.281-15.656-27.281c-2.336,0-9.344,0-9.344,0 s0,10.216,0,13.125c0,5.491-2.631,15.656-15.406,15.656c-15.91,0-19.476,0-26.532,0c-3.892,0-14.906,1.896-14.906,14.406 c0,14.475,0,18.265,0,24.219C28.366,100.497,31.562,109.923,55.397,109.923z M70.148,101.454c-2.662,0-4.813-2.151-4.813-4.813 s2.15-4.813,4.813-4.813c2.661,0,4.813,2.151,4.813,4.813S72.809,101.454,70.148,101.454z"
      />
    </svg>
  );
}
