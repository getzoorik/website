/**
 * The one glyph /design-partners draws that no other surface has as a component: the sprite's `#i-check`, on What you
 * get's first card, at the sprite's own 2.3 stroke. `aria-hidden`: the card's title says what it means. The page's
 * other glyphs are the site's (`assessment-marks`, `brand-assets-glyphs`, `@/components/brand`, `Arrow`).
 */
export function CheckGlyph({ className }: { readonly className?: string }): React.JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
