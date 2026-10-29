import type { ReactNode } from "react";

import { caseStudy, type CaseStudyCell } from "@/content/case-studies";
import { documents } from "@/content/documents";
import {
  Bars,
  CardRow,
  Icon,
  Machine,
  ShareRing,
  Step,
  Steps,
  StudyBand,
  StudyFrame,
  StudyTable,
  Swap,
  Text,
  Three,
} from "@/features/case-studies/case-study-parts";
import { documentFacts } from "@/features/documents/document-facts";
import { DownloadGlyph } from "@/features/documents/document-glyphs";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { share } from "@/lib/share";

/**
 * `/coral-value-lab`: the published PDF on the web.
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
 * Each picture is one image to a screen reader, its words in its label. The parts are the studies' own
 * (`case-study-parts.tsx`), shared with the Amoeba study.
 *
 * A server component: the page is prerendered whole, and the PDF's facts are
 * read from the file then. Its only script is the chips' (on a phone).
 */

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

/** How the apps came through: one bar per single-copy app, on one scale (the longest at 78% of the row). */
function Restarts(): React.JSX.Element {
  const { through } = caseStudy;
  const alt = `Seconds until back up, for each app that runs a single copy: ${through.apps
    .map((app) => `${app.name}, ${app.seconds} seconds`)
    .join("; ")}.`;
  return (
    <Bars
      caption={through.caption}
      unit={through.unit}
      alt={alt}
      rows={through.apps.map((app) => ({
        name: app.name,
        value: app.seconds,
        label: `${app.seconds} s`,
      }))}
      up={<Text text={through.twoCopies} />}
    />
  );
}

/** The result's table and the share of the bill removed, side by side. */
function BeforeAfter(): React.JSX.Element {
  const { table, share: removed } = caseStudy.result;
  return (
    <div className="cs-two">
      <StudyTable
        caption={table.caption}
        measure={table.measure}
        columns={table.columns}
        rows={table.rows.map(([measure, before, now, difference]) => ({
          name: measure,
          cells: [
            { text: before },
            { text: now },
            { text: difference, tone: "good" },
          ] satisfies CaseStudyCell[],
        }))}
      />
      <ShareRing ring={removed} />
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
        <CardRow>
          {c.start.machines.map((machine, index) => (
            <Machine machine={machine} key={index} />
          ))}
        </CardRow>
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
          <CardRow>
            {c.did.nodeMachines.map((machine, index) => (
              <Machine machine={machine} key={index} />
            ))}
          </CardRow>
        </Step>
        <Step step={c.did.workload}>
          <Reserve />
        </Step>
        <Step step={c.did.rebalance}>
          <Swap
            before={<Machine machine={c.did.swap.before} />}
            after={<Machine machine={c.did.swap.after} />}
          />
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
        <Steps {...c.result.costs} />
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
      <StudyBand band={c.band} />

      <StudyFrame
        sections={c.sections.map((section) => ({
          id: section.id,
          title: section.title,
          chip: section.title,
          body: bodies[section.id],
        }))}
        foot={<p className="cs-fine">{named(c.fine)}</p>}
      />
    </DocumentPage>
  );
}
