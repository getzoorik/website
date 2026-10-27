/**
 * The programs Zoorik is a member of: /about shows each one's badge under the Company facts (`#programs`), and /news
 * announced each one. Shared by both pages, so the badge and the trademark line are written once.
 *
 * 🔴 THE PROGRAM'S OWN BADGE AND WORDS. The badge is the program's file, unchanged: never recoloured, cropped or
 * redrawn. The trademark line is copied exactly from NVIDIA's "Required Legal Attribution", year included. In a
 * sentence it is "the NVIDIA Inception program", in a title "NVIDIA Inception Program"; never "Inception" alone,
 * "partner", "backed by" or "endorsed by".
 */

/** NVIDIA's trademark line, wherever the page names the program or shows its badge. */
export const nvidiaInceptionLegal =
  "© 2025 NVIDIA, the NVIDIA logo, and NVIDIA Inception are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries.";

/**
 * One program: its name, its badge (the file under /badges/ and the size it is drawn at), the line and the trademark
 * line; then, for the structured data's `memberOf`, the program's own page and the company that runs it, with that
 * company's Wikidata entry.
 */
export interface Membership {
  readonly name: string;
  readonly badge: {
    readonly src: `/badges/${string}.svg`;
    readonly width: number;
    readonly height: number;
  };
  readonly line: string;
  readonly legal: string;
  readonly url: string;
  readonly host: {
    readonly name: string;
    readonly url: string;
    readonly wikidata: string;
  };
}

/**
 * NVIDIA Inception (accepted 27 October 2026): the member badge in colour, from the program's portal. Its viewBox is
 * 500.4288 × 216 with the badge's own clear space inside, so 200px wide is 86px high.
 */
export const memberships: readonly Membership[] = [
  {
    name: "NVIDIA Inception Program",
    badge: { src: "/badges/nvidia-inception-program-badge.svg", width: 200, height: 86 },
    line: "Zoorik is a member of the NVIDIA Inception program.",
    legal: nvidiaInceptionLegal,
    url: "https://www.nvidia.com/en-us/startups/",
    host: {
      name: "NVIDIA",
      url: "https://www.nvidia.com/",
      wikidata: "https://www.wikidata.org/wiki/Q182477",
    },
  },
];
