import { amoebaGuide } from "@/content/amoeba-guide";
import { GuidePage } from "@/features/doc-rows/guide-rows";

/**
 * `/amoeba-guide`, the Amoeba product guide on the web, drawn from
 * `src/content/amoeba-guide.ts` in the FAQ's layout, as the Coral guide is
 * (`GuidePage`): the hero (no PDF yet), the Updated line and the summary,
 * eleven groups of numbered rows with the facts still to come as placeholders,
 * and Amoeba's closing row.
 */
export function AmoebaGuide(): React.JSX.Element {
  return <GuidePage guide={amoebaGuide} product="amoeba" />;
}
