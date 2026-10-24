import { careers } from "@/content/careers";
import { ModeGlyph, StepIcon } from "@/features/careers/careers-hire-icons";
import { CareersHireWalk } from "@/features/careers/careers-hire-walk";

/**
 * How we hire (option A, 24 Oct 2026), on the flat band: the heading and its lede, then the six steps under one
 * hairline. Each step is its icon, its number in mono, how it happens as a pill ("In writing", "Video call"), its
 * name and one line; no step is set apart in the accent.
 *
 * A server component. A marker walks the hairline, lighting each step's icon in turn, while the steps are on
 * screen (`CareersHireWalk`, the steps' own box); the first step is lit in the markup.
 */
export function CareersHire(): React.JSX.Element {
  const { hire } = careers;
  return (
    <section className="sec sec-band cq-band" id={hire.id} aria-labelledby={`${hire.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${hire.id}-h`}>{hire.title}</h2>
          <p>{hire.lede}</p>
        </div>
        <CareersHireWalk>
          <div className="cq-track" aria-hidden="true">
            <i />
          </div>
          <ol className="cq-steps">
            {hire.steps.map((step, n) => (
              <li className={n === 0 ? "is-at" : undefined} key={step.title}>
                <StepIcon icon={step.icon} />
                <span className="cq-n">{String(n + 1).padStart(2, "0")}</span>
                <span className="cq-mode">
                  <ModeGlyph mode={step.mode} />
                  {step.mode}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </CareersHireWalk>
      </div>
    </section>
  );
}
