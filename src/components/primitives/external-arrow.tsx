/**
 * The small up-right arrow after a link that leaves the site.
 *
 * It is the eye's half of the new-tab warning; `NewTabHint` is the ear's, and a
 * link that opens a new tab carries both. Two links carry the hint without the
 * arrow, as the mocks draw them: the bar's Book a demo and /design-partners's
 * Book a call. An address in the middle of a sentence has the arrow too (the
 * privacy policy's).
 *
 * Sized and set on its line by `.ext` in the site system: 12px with 2px of
 * room, `display:inline`, so in plain text it stays beside the word. Inside a
 * button, `.alink` or a footer link the surface's own `svg` rule wins, which is
 * why the same arrow measures 12, 14 or 16px by where it sits.
 */
export function ExternalArrow(): React.JSX.Element {
  return (
    <svg
      className="ext"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
