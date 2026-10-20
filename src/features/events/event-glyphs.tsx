/**
 * /events's two glyphs, drawn as the mock draws them. Each is `aria-hidden`: the place and "Details" are set in text
 * beside them. Size comes from the page's sheet (`.ev-pin`, `.ev-chev`); the new-tab arrow is the site's own
 * (`ExternalArrow`).
 */

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** A map pin: where the event is. */
export function PinGlyph(): React.JSX.Element {
  return (
    <svg className="ev-pin" viewBox="0 0 24 24" {...line} strokeWidth={2} aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/** A chevron down, turned up while the Details are open. */
export function ChevronGlyph(): React.JSX.Element {
  return (
    <svg className="ev-chev" viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
