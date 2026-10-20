/**
 * The Zoorik mark and wordmark, brand 2.0, as the brand kit's parts write them.
 * Every number below is theirs; this file only gives them names.
 *
 * ─── THE MARK ──────────────────────────────────────────────────────────────
 * Fifteen squares round a solid core of radius 104 on the 512 canvas: ten on
 * the outer ring at radius 210, of side 42, or 50 for the five whose spoke has
 * no inner square ("lone squares"), and five of side 34 on the inner ring at
 * radius 144.46. One colour throughout: the core is no longer the accent.
 *
 * ─── THE WORD ──────────────────────────────────────────────────────────────
 * "zoorik" as outlines, so the logo needs no font: six glyph paths, each
 * placed by its own transform in the lockup's box.
 */

/** One square: x, y, side, turn, and the centre it turns about. */
export type MarkSquare = readonly [
  x: string,
  y: string,
  side: string,
  angle: string,
  cx: string,
  cy: string,
];

/** The outer ring: ten squares at radius 210 (42, or 50 where the spoke has no inner square). */
export const MARK_OUTER: readonly MarkSquare[] = [
  ["235.00", "25.00", "42.0", "-45.00", "256.00", "46.00"],
  ["107.57", "61.11", "50.0", "-81.00", "132.57", "86.11"],
  ["35.28", "170.11", "42.0", "-117.00", "56.28", "191.11"],
  ["31.28", "295.89", "50.0", "-153.00", "56.28", "320.89"],
  ["111.57", "404.89", "42.0", "-189.00", "132.57", "425.89"],
  ["231.00", "441.00", "50.0", "-225.00", "256.00", "466.00"],
  ["358.43", "404.89", "42.0", "-261.00", "379.43", "425.89"],
  ["430.72", "295.89", "50.0", "-297.00", "455.72", "320.89"],
  ["434.72", "170.11", "42.0", "-333.00", "455.72", "191.11"],
  ["354.43", "61.11", "50.0", "-369.00", "379.43", "86.11"],
];

/** The inner ring: five squares of 34 at radius 144.46. */
export const MARK_INNER: readonly MarkSquare[] = [
  ["239.00", "94.54", "34.0", "-45.00", "256.00", "111.54"],
  ["101.61", "194.36", "34.0", "-117.00", "118.61", "211.36"],
  ["154.09", "355.87", "34.0", "-189.00", "171.09", "372.87"],
  ["323.91", "355.87", "34.0", "-261.00", "340.91", "372.87"],
  ["376.39", "194.36", "34.0", "-333.00", "393.39", "211.36"],
];

/** The core, solid, at the canvas centre. */
export const MARK_CORE = { cx: "256", cy: "256", r: "104" } as const;

/**
 * The lockup's box: the mark sits in a 100-unit square at its left (its own
 * box the mark's ink, 16.302 16.302 479.397 479.397), and the word follows it. The
 * box's ratio, width over height, is 4.0088.
 */
export const LOCKUP = {
  viewBox: "-1.180 -56.424 431.363 107.604",
  mark: { x: "0", y: "-50", width: "100", height: "100", viewBox: "16.302 16.302 479.397 479.397" },
} as const;

/** The mark alone, in the same box the lockup gives it (the free assessment's card). */
export const MARK_VIEWBOX = "16.302 16.302 479.397 479.397";

/** "zoorik", one path per glyph: its placement, then its outline. */
export const WORDMARK: readonly (readonly [transform: string, d: string])[] = [
  [
    "translate(133.600 28.026) scale(0.105960 -0.105960)",
    "M421 529V437L165 100H426L413 0H18V92L275 429H40V529Z",
  ],
  [
    "translate(179.799 28.026) scale(0.105960 -0.105960)",
    "M541 265Q541 182 511.0 118.5Q481 55 425.0 20.0Q369 -15 292 -15Q175 -15 109.0 59.5Q43 134 43 265Q43 348 73.0 411.0Q103 474 159.5 509.0Q216 544 293 544Q410 544 475.5 469.5Q541 395 541 265ZM178 265Q178 171 206.5 126.5Q235 82 292 82Q349 82 377.5 127.0Q406 172 406 265Q406 358 377.5 402.5Q349 447 293 447Q178 447 178 265Z",
  ],
  [
    "translate(241.150 28.026) scale(0.105960 -0.105960)",
    "M541 265Q541 182 511.0 118.5Q481 55 425.0 20.0Q369 -15 292 -15Q175 -15 109.0 59.5Q43 134 43 265Q43 348 73.0 411.0Q103 474 159.5 509.0Q216 544 293 544Q410 544 475.5 469.5Q541 395 541 265ZM178 265Q178 171 206.5 126.5Q235 82 292 82Q349 82 377.5 127.0Q406 172 406 265Q406 358 377.5 402.5Q349 447 293 447Q178 447 178 265Z",
  ],
  [
    "translate(302.501 28.026) scale(0.105960 -0.105960)",
    "M391 536 369 412Q345 418 322 418Q275 418 248.0 384.5Q221 351 205 282V0H77V529H188L200 425Q219 482 255.0 512.5Q291 543 338 543Q367 543 391 536Z",
  ],
  [
    "translate(343.719 28.026) scale(0.105960 -0.105960)",
    "M205 529V0H77V529ZM221 719Q221 686 198.5 664.0Q176 642 140 642Q105 642 82.5 664.0Q60 686 60 719Q60 752 82.5 774.5Q105 797 140 797Q176 797 198.5 774.5Q221 752 221 719Z",
  ],
  [
    "translate(373.070 28.026) scale(0.105960 -0.105960)",
    "M205 755V0H77V741ZM522 529 346 296 539 0H392L210 289L387 529Z",
  ],
];
