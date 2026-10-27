import { Fragment, type ReactNode } from "react";

import {
  caseStudy,
  type CaseStudyCostStep,
  type CaseStudyIcon,
  type CaseStudyMachine,
  type CaseStudyStep,
  type CaseStudyText,
} from "@/content/case-studies";
import { documents } from "@/content/documents";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { documentFacts } from "@/features/documents/document-facts";
import { DownloadGlyph } from "@/features/documents/document-glyphs";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { share } from "@/lib/share";

/**
 * `/value-lab/coral-dev-cluster`: the published PDF on the web.
 *
 * It opens with the result: the study, built from the PDF, with the download,
 * the four figures in one line, the cost chart in The result and the numbered
 * sections:
 *
 *   the hero        the PDF's kicker, headline and opening, its download at the right
 *   the result band the date and "Published by Zoorik", the four figures in one line, what Coral is
 *   the frame       /security's (`DocRows`, `frame="article"`): each of the PDF's six
 *                   sections, its number beside its name in the left column, beside its text
 *   the closing row for Coral, in place of the PDF's own call to action
 *
 * The drawings are the PDF's, in the site's figure style: the machines as cards
 * with their CPU as squares, what the apps reserve, the swap, how long each
 * single-copy app was down, the cost steps, the table and the share removed.
 * Each picture is one image to a screen reader, its words in its label.
 *
 * A server component: the page is prerendered whole, and the PDF's facts are
 * read from the file then. Its only script is the chips' (on a phone).
 */

/** A run of text: its product names kept out of translation, its bold runs bold. */
function Text({ text }: { readonly text: CaseStudyText }): ReactNode {
  if (typeof text === "string") return named(text);
  return text.map((piece, index) =>
    typeof piece === "string" ? (
      <Fragment key={index}>{named(piece)}</Fragment>
    ) : (
      <b key={index}>{named(piece.b)}</b>
    ),
  );
}

/** The PDF's own marks, one stroke icon each. */
const ICON_PATHS: Record<CaseStudyIcon, ReactNode> = {
  node: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  wl: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  rb: <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  safe: (
    <>
      <path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
};

function Icon({ icon }: { readonly icon: CaseStudyIcon }): React.JSX.Element {
  return (
    <svg
      className="cs-ic"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[icon]}
    </svg>
  );
}

/** One machine: its badge, name, what it is for, its CPU as squares, its monthly price. */
function Machine({ machine }: { readonly machine: CaseStudyMachine }): React.JSX.Element {
  return (
    <div className={`cs-mc is-${machine.tone}`}>
      <span className="cs-badge">{machine.badge}</span>
      <span className="cs-mn">{machine.name}</span>
      {machine.kind ? <span className="cs-mk">{named(machine.kind)}</span> : null}
      <span className="cs-cores" aria-hidden="true">
        {Array.from({ length: machine.cpu }, (_, core) => (
          <i key={core} />
        ))}
      </span>
      <span className="cs-mp">
        {machine.price}
        <small> a month</small>
      </span>
      {machine.note ? <span className="cs-mnote">{machine.note}</span> : null}
    </div>
  );
}

function Machines({ machines }: { readonly machines: readonly CaseStudyMachine[] }) {
  return (
    <div className="cs-mrow">
      {machines.map((machine, index) => (
        <Machine machine={machine} key={index} />
      ))}
    </div>
  );
}

/** Three cards: the features, or the safety rules, each its mark, its name and one line. */
function Three({
  cards,
}: {
  readonly cards: readonly {
    readonly icon: CaseStudyIcon;
    readonly title: string;
    readonly text: string;
  }[];
}): React.JSX.Element {
  return (
    <div className="cs-three">
      {cards.map((card) => (
        <div key={card.title}>
          <Icon icon={card.icon} />
          <b>{card.title}</b>
          <p>{named(card.text)}</p>
        </div>
      ))}
    </div>
  );
}

/** A step of "What Coral did": its head (mark, title, date), then its card with the picture and what it saved. */
function Step({
  step,
  children,
}: {
  readonly step: CaseStudyStep;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <>
      <div className="cs-chap">
        <span className="cs-ib">
          <Icon icon={step.icon} />
        </span>
        <h3 id={step.id}>{step.title}</h3>
        <span className="cs-date">{step.date}</span>
      </div>
      <div className="cs-stage">
        <p>
          <Text text={step.text} />
        </p>
        {children}
        <span className="cs-pill">{step.pill}</span>
      </div>
    </>
  );
}

/** What the apps reserve: before and now, each resource on its own scale, "now" in the accent. */
function Reserve(): React.JSX.Element {
  const { reserve } = caseStudy.did;
  return (
    <div className="cs-reserve" role="img" aria-label={reserve.alt}>
      {reserve.resources.map((resource) => (
        <div key={resource.name}>
          <p className="cs-rh">
            <span>{resource.name}</span>
            <b>{resource.less}</b>
          </p>
          <p className="cs-rr">
            <span>{reserve.before}</span>
            <i>
              <b style={{ width: "100%" }} />
            </i>
            <span>{resource.before.label}</span>
          </p>
          <p className="cs-rr is-now">
            <span>{reserve.now}</span>
            <i>
              <b style={{ width: share(resource.now.value, resource.before.value, 1) }} />
            </i>
            <span>{resource.now.label}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

/** The swap: the old worker, an arrow, the new one. */
function Swap(): React.JSX.Element {
  const { swap } = caseStudy.did;
  return (
    <div className="cs-swap">
      <Machine machine={swap.before} />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
      <Machine machine={swap.after} />
    </div>
  );
}

/** How the apps came through: one bar per single-copy app, on one scale (the longest at 78% of the row). */
function Restarts(): React.JSX.Element {
  const { through } = caseStudy;
  const longest = Math.max(...through.apps.map((app) => app.seconds));
  const alt = `Seconds until back up, for each app that runs a single copy: ${through.apps
    .map((app) => `${app.name}, ${app.seconds} seconds`)
    .join("; ")}.`;
  return (
    <figure className="cs-fig">
      <figcaption className="cs-fh">
        <span>{through.caption}</span>
        <small>{through.unit}</small>
      </figcaption>
      <div className="cs-hb" role="img" aria-label={alt}>
        <div>
          {through.apps.map((app) => (
            <p className="cs-hr" key={app.name}>
              <span className="cs-hl">{app.name}</span>
              <span className="cs-ht">
                <i style={{ width: `${((app.seconds / longest) * 78).toFixed(1)}%` }} />
                <b>{`${app.seconds} s`}</b>
              </span>
            </p>
          ))}
        </div>
      </div>
      <p className="cs-up">
        <Text text={through.twoCopies} />
      </p>
    </figure>
  );
}

const BAR: Record<CaseStudyCostStep["kind"], string> = {
  start: "cs-bar is-start",
  drop: "cs-bar is-drop",
  end: "cs-bar is-end",
};

/** The cost steps: the connected bill, the two drops and today's bill, each bar on the connected bill's scale. */
function CostSteps(): React.JSX.Element {
  const { costs } = caseStudy.result;
  return (
    <figure className="cs-fig">
      <figcaption className="cs-fh">
        <span>{costs.caption}</span>
        <small>{costs.unit}</small>
      </figcaption>
      <div className="cs-wf" role="img" aria-label={costs.alt}>
        {costs.steps.map((step) => (
          <div className="cs-col" key={step.name}>
            <div className="cs-plot">
              <span
                className={BAR[step.kind]}
                style={{
                  bottom: share(step.from, costs.top, 2),
                  height: share(step.amount, costs.top, 2),
                }}
              >
                <b>{step.label}</b>
              </span>
            </div>
            <p className="cs-x">
              {step.name}
              <small>{step.date}</small>
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

/** The result's table and the share of the bill removed, side by side. */
function BeforeAfter(): React.JSX.Element {
  const { table, share: removed } = caseStudy.result;
  const ring = 2 * Math.PI * 56;
  const arc = (ring * removed.removed) / removed.of;
  return (
    <div className="cs-two">
      <figure className="cs-fig">
        <figcaption className="cs-fh">{table.caption}</figcaption>
        <table className="cs-tb">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">{table.measure}</span>
              </th>
              {table.columns.map((column) => (
                <th scope="col" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([measure, before, now, difference]) => (
              <tr key={measure}>
                <th scope="row">{measure}</th>
                <td>{before}</td>
                <td>{now}</td>
                <td className="cs-g">{difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
      <figure className="cs-fig cs-donut-card">
        <figcaption className="cs-fh">{removed.caption}</figcaption>
        <svg className="cs-donut" viewBox="0 0 150 150" role="img" aria-label={removed.alt}>
          <circle cx="75" cy="75" r="56" fill="none" stroke="#E4E7F2" strokeWidth={16} />
          <circle
            cx="75"
            cy="75"
            r="56"
            fill="none"
            stroke="#12A97A"
            strokeWidth={16}
            strokeDasharray={`${arc.toFixed(2)} ${ring.toFixed(2)}`}
            transform="rotate(-90 75 75)"
          />
          <text x="75" y="82" textAnchor="middle" className="cs-dv">
            {removed.value}
          </text>
          <text x="75" y="100" textAnchor="middle" className="cs-ds">
            {removed.word}
          </text>
        </svg>
        <p className="cs-cap">{removed.line}</p>
      </figure>
    </div>
  );
}

/** The card at the end: the PDF, the whole card one link. */
function Download(): React.JSX.Element {
  const document = documents[caseStudy.document];
  const facts = documentFacts(caseStudy.document);
  return (
    <a
      className="cs-dl"
      href={document.pdf}
      download
      aria-label={`Download ${document.spokenName}, ${facts.spoken}`}
    >
      <span className="cs-ib">
        <Icon icon="doc" />
      </span>
      <span>
        <span className="cs-dl-t">{caseStudy.end.title}</span>
        <span className="cs-dl-f">
          {caseStudy.end.kind}
          {facts.short}
        </span>
      </span>
      <span className="cs-dl-go" aria-hidden="true">
        {caseStudy.end.go}
        <DownloadGlyph />
      </span>
    </a>
  );
}

export function CaseStudyPage(): React.JSX.Element {
  const c = caseStudy;
  const bodies: Record<(typeof c.sections)[number]["id"], ReactNode> = {
    "the-starting-point": (
      <>
        <p>{named(c.start.text)}</p>
        <Machines machines={c.start.machines} />
        <p className="cs-sum">
          <span>{c.start.when}</span>
          <b>{c.start.total}</b>
        </p>
      </>
    ),
    "connecting-coral": (
      <>
        <p>
          <Text text={c.connect.text} />
        </p>
        <Three cards={c.connect.features} />
      </>
    ),
    "what-coral-did": (
      <>
        <Step step={c.did.node}>
          <Machines machines={c.did.nodeMachines} />
        </Step>
        <Step step={c.did.workload}>
          <Reserve />
        </Step>
        <Step step={c.did.rebalance}>
          <Swap />
        </Step>
      </>
    ),
    "how-the-apps-came-through": (
      <>
        <p>{named(c.through.text)}</p>
        <Restarts />
        <div className="doc-call cs-means">
          <p>
            <Text text={c.through.means} />
          </p>
        </div>
      </>
    ),
    "how-the-apps-stayed-safe": (
      <Three cards={c.safe.map((rule) => ({ icon: "safe" as const, ...rule }))} />
    ),
    "the-result": (
      <>
        <CostSteps />
        <BeforeAfter />
        <Download />
      </>
    ),
  };

  return (
    <DocumentPage
      hero={{
        kicker: named(c.hero.kicker),
        title: (
          <>
            {c.hero.title} <span className="cs-g">{c.hero.titleGreen}</span>
          </>
        ),
        deck: <Text text={c.hero.deck} />,
        className: "cs-hero",
        downloads: [{ label: c.hero.download, document: c.document }],
      }}
      product="coral"
    >
      <section className="cs-band" aria-label={c.band.label}>
        <div className="wrap">
          <div className="cs-band-in">
            <p className="doc-updated">
              {c.band.date}
              {c.band.by}
              <a href={c.band.publisher.href}>{c.band.publisher.text}</a>
            </p>
            <div className="cs-stats">
              {c.band.stats.map((stat) => (
                <p className="cs-stat" key={stat.value}>
                  <span className={stat.good ? "cs-v is-good" : "cs-v"}>{stat.value}</span>
                  <span className="cs-k">{named(stat.label)}</span>
                </p>
              ))}
            </div>
            <div className="doc-call">
              <p>
                <Text text={c.band.about} />
              </p>
            </div>
          </div>
        </div>
      </section>

      <DocRows
        frame="article"
        groups={c.sections.map((section, index) => ({
          id: section.id,
          /* The PDF's number beside the section's name, the number hidden from a screen reader. */
          title: (
            <>
              <span className="cs-no" aria-hidden="true">
                {index + 1}
              </span>
              <span>{section.title}</span>
            </>
          ),
          chip: section.title,
          body: bodies[section.id],
        }))}
        foot={<p className="cs-fine">{named(c.fine)}</p>}
      />
    </DocumentPage>
  );
}
