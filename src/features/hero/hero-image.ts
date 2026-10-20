import hero960 from "@/features/hero/hero-racks-graded-960.webp";
import hero1200 from "@/features/hero/hero-racks-graded.webp";

/**
 * The hero photograph as the heroes draw it: the 1200 px frame, and the same
 * frame at 960 px (WebP quality 80, the source's own) for a 1x screen.
 *
 * `sizes` is the width the photo is drawn at, which is not always its box's
 * width: it covers a square frame into `.hero-photo`, so a box taller than wide
 * draws it at the box's height. On a phone that is up to 840 px (/coral at
 * 320 px wide), so a 2x phone still takes the 1200 frame, as it does today.
 * Wider, the box follows hero.css: 82% to 1080 px, then `min(70%, 1160px)`,
 * whose 1160 px cap starts at 1657 px (1160 / 0.7). Every hero box is at least
 * ~590 px tall, so no frame narrower than 960 would ever be the right one.
 */
export const heroPhoto = {
  src: hero1200.src,
  srcSet: `${hero960.src} ${hero960.width}w, ${hero1200.src} ${hero1200.width}w`,
  sizes: "(max-width: 760px) 840px, (max-width: 1080px) 82vw, (max-width: 1657px) 70vw, 1160px",
} as const;
