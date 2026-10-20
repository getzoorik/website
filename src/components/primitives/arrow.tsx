/**
 * The arrow a same-tab call to action ends on, as the mocks draw it:
 * "Estimate your saving →".
 *
 * Stroke 2.2, as every mock draws it; the older components drew theirs at 2.5.
 * Sized by the surface it sits in (16px in the site system's buttons), and it
 * moves 2px right on hover and 3px on keyboard focus by the buttons' own rules.
 * A link that leaves the site ends on `ExternalArrow` instead.
 */
export function Arrow(): React.JSX.Element {
  return (
    <svg
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
  );
}
