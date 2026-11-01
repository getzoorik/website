import { routes } from "@/config/site";
import { caseStudy, type CaseStudyCostStep } from "@/content/case-studies";

/**
 * The case study band on the home page: after the why points, in the logo's navy,
 * the study's headline beside its cost chart.
 *
 * 🔴 EVERY FIGURE IS THE STUDY'S. The headline, the chart's caption and unit, and its
 * four steps (each figure, name and date, and the scale they stand on) are read from
 * `caseStudy`, so the band cannot print a number the study does not. Only the band's own
 * words live here: the eyebrow, the line, the button, and how the chart is said to a
 * screen reader, which the mock words its own way ("$154.76 today.", where the study's
 * picture says "today, 12 Oct.").
 */

const { costs } = caseStudy.result;

/** The mock's words for each step but the last, in the chart's order; "today" needs no date. */
const SAID = ["when Coral was connected on", "from node optimization on", "from rebalancing on"];

/** One step as the mock says it: a drop is "minus", never a sign read aloud. */
const say = (step: CaseStudyCostStep, index: number): string => {
  const figure = step.label.replace("−", "minus ");
  return step.kind === "end" ? `${figure} today` : `${figure} ${SAID[index]} ${step.date}`;
};

export const caseBand = {
  /** "Value Lab · Coral", beside Coral's mark (our own cluster is labelled a lab result; client studies will read "Customer"); the name is kept out of translation. */
  eyebrow: "Value Lab · Coral",
  /** The study's own headline, its second half on a line of its own in the good green. */
  title: caseStudy.hero.title,
  titleGreen: caseStudy.hero.titleGreen,
  line: "On Zoorik’s own development cluster, eight days from connecting Coral to the result.",
  /** Same tab, to the study, ending on the plain arrow. */
  cta: { label: "Read the Coral Value Lab study", href: routes.caseStudyCoralDevCluster },
  chart: {
    caption: costs.caption,
    unit: costs.unit,
    /** The scale's top: the bill when Coral was connected is the full height. */
    top: costs.top,
    steps: costs.steps,
    alt: `${costs.caption}: ${costs.steps.map(say).join("; ")}.`,
  },
} as const;
