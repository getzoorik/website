import type { CareerValueId } from "@/content/careers";
import { scene as collaboration } from "@/features/careers/scenes/collaboration";
import { scene as diversity } from "@/features/careers/scenes/diversity";
import { scene as efficiency } from "@/features/careers/scenes/efficiency";
import { scene as iteration } from "@/features/careers/scenes/iteration";
import { scene as results } from "@/features/careers/scenes/results";
import { scene as transparency } from "@/features/careers/scenes/transparency";

/**
 * Our values' six scenes, one per value (owner, 25 Oct 2026: "our own images with little bit motions or
 * anything"), drawn for Zoorik in one kit (the proposal's `scenes/kit.py`): an isometric floor on the brand
 * navy, faceless figures with bone heads, one warm object per scene, and calm loops.
 *
 *   Collaboration           four people round a table each bring a block to one golden block
 *   Results for customers   the bill stack is half its old height, the customer cheers, the servers stay green
 *   Efficiency              two people strain at boxes while one rolls a ball well ahead
 *   Diversity, inclusion    six different people, each raising a hand in turn, linked to one tile
 *     and belonging
 *   Iteration               people climb a stair of small blocks while one sets the next block
 *   Transparency            people round a giant magnifying glass over one open page
 *
 * Each is its `scenes/<key>.html`'s `<svg>`, verbatim (`./scenes/<key>.ts`), drawn as written: one 480×270
 * canvas that names itself for a screen reader (`role="img"` and its `aria-label`). Every motion lives in
 * careers-scenes.css, scoped to the scene's own class (`.sc-<key>`).
 *
 * Keyed by value, a Record, so a new `CareerValueId` without its scene is a compile error here.
 */
const SCENES: Record<CareerValueId, string> = {
  collaboration,
  results,
  efficiency,
  diversity,
  iteration,
  transparency,
};

/** The scene of one value, in its panel's box. */
export function ValueScene({ id }: { readonly id: CareerValueId }): React.JSX.Element {
  return <div className="cq-scene" dangerouslySetInnerHTML={{ __html: SCENES[id] }} />;
}
