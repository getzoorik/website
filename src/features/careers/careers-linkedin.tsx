import { careers } from "@/content/careers";
import { LINKEDIN_PATH } from "@/features/footer/footer-marks";

/**
 * LinkedIn's lockup, where /careers says "Follow us on LinkedIn" (owner, 25 Oct 2026: "instead of writing linkedin
 * use their beautiful logo", "it will be like Linked {logo}"): the word "Linked" in the line's own type at weight
 * 700, then the blue "in" box (LinkedIn blue #0A66C2, the white "in" the footer's own path), one cap-height tall on
 * the baseline (careers.css, `.cq-lockup`). The lockup is hidden from the ear, which hears the name, "LinkedIn".
 *
 * It follows "Follow us on " inside its link, in the hero's quiet line and on the close's wire button.
 */
export function CareersLinkedIn(): React.JSX.Element {
  const { word, name } = careers.hero.follow;
  return (
    <>
      <span className="cq-lockup" aria-hidden="true">
        <span className="cq-lkw">{word}</span>
        <svg className="cq-li" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="3.5" fill="#0A66C2" />
          <path fill="#FFFFFF" transform="translate(3.3 3.2) scale(.73)" d={LINKEDIN_PATH} />
        </svg>
      </span>
      <span className="sr-only">{name}</span>
    </>
  );
}
