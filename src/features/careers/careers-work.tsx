import { careers } from "@/content/careers";
import { WorkDrawing } from "@/features/careers/careers-work-drawings";
import { CareersWorkMotion } from "@/features/careers/careers-work-motion";

/**
 * How we work (option A, 24 Oct 2026): the heading alone, then four habits, each one outlined card holding its
 * drawing and its title.
 *
 * The habit's sentence left the screen, not the page: it is the card's name for a screen reader (`role="img"`,
 * `aria-label`, "<title>. <body>"), word for word, so the section still says it; the caption is hidden from a
 * screen reader so the title is not read twice.
 *
 * A server component. The drawings loop only while their card is on screen, which is the one thing that needs the
 * browser (`CareersWorkMotion`).
 */
export function CareersWork(): React.JSX.Element {
  const { work } = careers;
  return (
    <section className="sec" id={work.id} aria-labelledby={`${work.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${work.id}-h`}>{work.title}</h2>
        </div>
        <div className="cq-work">
          {work.habits.map((habit) => (
            <figure
              className="cq-wk"
              role="img"
              aria-label={`${habit.title}. ${habit.body}`}
              key={habit.drawing}
            >
              <WorkDrawing drawing={habit.drawing} />
              <figcaption aria-hidden="true">{habit.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <CareersWorkMotion />
    </section>
  );
}
