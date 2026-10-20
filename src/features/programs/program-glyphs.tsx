/**
 * The gift on /referrals's third step (the mock's inline drawing in `referrals()`): a box with its ribbon and bow,
 * stroked in `currentColor`. `aria-hidden`: the step's own words say what it means. The page's other glyphs are the
 * site's (`assessment-marks`, `@/components/brand`, `Arrow`).
 */
export function GiftGlyph(): React.JSX.Element {
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
      <rect x="3" y="8" width="18" height="13" rx="1.5" />
      <path d="M12 8v13M3 12h18M12 8c-1.6-3.6-6-4.2-6-1.4C6 8 9 8 12 8zm0 0c1.6-3.6 6-4.2 6-1.4C18 8 15 8 12 8z" />
    </svg>
  );
}
