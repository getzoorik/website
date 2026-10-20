import { coralGuide } from "@/content/coral-guide";
import { GuidePage } from "@/features/doc-rows/guide-rows";

/**
 * `/coral/guide`, the Coral product guide on the web, drawn from
 * `src/content/coral-guide.ts` in the FAQ's layout (`GuidePage`): the hero with
 * the guide's PDF, the Updated line and the summary, eleven groups of numbered
 * rows, and Coral's closing row.
 */
export function CoralGuide(): React.JSX.Element {
  return <GuidePage guide={coralGuide} product="coral" />;
}
