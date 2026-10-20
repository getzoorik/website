import type { JSX } from "react";

/**
 * /community's two marks that are not files: Reddit's (the footer's glyph, white on Reddit's orange), on r/zoorik's
 * card and on each subreddit's tile, and Medium's (the footer's, in the colour of its ground), on Zoorik News's card.
 * Both are decoration: the words beside them carry the names.
 */
interface MarkProps {
  readonly className: string;
}

export function RedditMark({ className }: MarkProps): JSX.Element {
  return (
    <svg className={className} data-mark="reddit" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#FF4500" />
      <g transform="translate(4.2 4.3) scale(.65)">
        <path
          d="M12 8.4l1.2-4.8 4.4 1"
          fill="none"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18.2" cy="4.8" r="1.7" fill="#fff" />
        <circle cx="4.3" cy="11.6" r="2.2" fill="#fff" />
        <circle cx="19.7" cy="11.6" r="2.2" fill="#fff" />
        <ellipse cx="12" cy="14.6" rx="8.4" ry="6" fill="#fff" />
        <circle cx="8.9" cy="13.6" r="1.3" fill="#FF4500" />
        <circle cx="15.1" cy="13.6" r="1.3" fill="#FF4500" />
        <path
          d="M8.8 16.9c1.9 1.3 4.5 1.3 6.4 0"
          fill="none"
          stroke="#FF4500"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function MediumMark({ className }: MarkProps): JSX.Element {
  return (
    <svg className={className} data-mark="medium" viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="6.8" cy="12" rx="6.8" ry="6.9" fill="currentColor" />
      <ellipse cx="17.4" cy="12" rx="3.4" ry="6.5" fill="currentColor" />
      <ellipse cx="22.4" cy="12" rx="1.2" ry="5.8" fill="currentColor" />
    </svg>
  );
}
