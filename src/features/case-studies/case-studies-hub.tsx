import { Arrow } from "@/components/primitives/arrow";
import { caseStudiesHub, type CaseStudyCard } from "@/content/case-studies";
import { documents } from "@/content/documents";
import { productOrder, products } from "@/content/products";
import { CaseStudiesLibrary } from "@/features/case-studies/case-studies-library";
import { documentFacts } from "@/features/documents/document-facts";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";

/**
 * `/case-studies`: the library.
 *
 *   hero                  the utility hero: Case studies, and what they are
 *   the library           one card per study (`caseStudiesHub.studies`): the
 *                         cover (the big figure, the bill before and after as
 *                         two bars on one scale), then the kicker, the title,
 *                         the line, the tags, "Read the case study" and the
 *                         PDF; then "Your cluster next", the free assessment
 *   How we write them     three cards, on the band
 *   the closing row       for Coral
 *
 * The product filter over the library is drawn only once the studies cover two
 * products (`CaseStudiesLibrary`, the page's one client island); with one, as
 * today, there is none. Nothing on the page rises into place, as the mock
 * draws it: the only motion is the cards' hover, and it is off under reduced
 * motion.
 *
 * The cover is the same link as the title, so it is hidden from a screen
 * reader and the keyboard, as the mock marks it: the title is the card's one
 * named link to the study.
 */

export interface CaseStudiesHubProps {
  /** The studies to list; the content's list by default. A test passes a second product's study to see the filter. */
  readonly studies?: readonly CaseStudyCard[];
}

/** The mock's download mark on the PDF button: stroke 2.2, its own arrow. */
function PdfGlyph(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </svg>
  );
}

/** A card's inside: the cover, then the body. The `<article>` around it is the library's. */
function StudyCard({ study }: { readonly study: CaseStudyCard }): React.JSX.Element {
  const { card } = caseStudiesHub;
  /* The bill after, as a share of the bill before: the second bar's width, to a tenth as the mock prints it. */
  const after = `${((study.after.value / study.before.value) * 100).toFixed(1)}%`;
  const document = study.document ? documents[study.document] : undefined;
  return (
    <>
      <a className="cx-cover" href={study.href} aria-hidden="true" tabIndex={-1}>
        <span className="cx-big">{study.figure}</span>
        <span className="cx-bars">
          <span className="cx-b1">
            <i style={{ width: "100%" }} />
            <em>{study.before.label}</em>
          </span>
          <span className="cx-b2">
            <i style={{ width: after }} />
            <em>{study.after.label}</em>
          </span>
        </span>
        <span className="cx-cap">{study.cap}</span>
      </a>
      <div className="cx-cbody">
        <p className="cx-kick">{named(study.kicker)}</p>
        <h3>
          <a href={study.href}>{study.title}</a>
        </h3>
        <p className="cx-line">{named(study.line)}</p>
        <div className="cx-chips">
          {study.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="cx-cfoot">
          <a className="cx-read" href={study.href}>
            {card.read} <Arrow />
          </a>
          {document?.released ? (
            <a
              className="cx-pdf"
              href={document.pdf}
              download
              aria-label={`Download ${document.spokenName}, ${documentFacts(document.id).spoken}`}
            >
              <PdfGlyph /> {card.pdf}
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function CaseStudiesHub({
  studies = caseStudiesHub.studies,
}: CaseStudiesHubProps = {}): React.JSX.Element {
  const hub = caseStudiesHub;
  const covered = productOrder.filter((id) => studies.some((study) => study.product === id));
  return (
    <DocumentPage
      hero={{ title: named(hub.hero.title), deck: named(hub.hero.deck) }}
      product="coral"
    >
      <section className="sec cx-sec" aria-label={hub.label}>
        <div className="wrap">
          <CaseStudiesLibrary
            products={covered.map((id) => ({ id, name: products[id].name }))}
            cards={studies.map((study) => ({
              key: study.href,
              product: study.product,
              children: <StudyCard study={study} />,
            }))}
            next={
              <a className="cx-next" href={hub.next.href}>
                <span className="cx-plus" aria-hidden="true">
                  +
                </span>
                <h3>{hub.next.title}</h3>
                <p>{hub.next.body}</p>
                <span className="cx-read">
                  {hub.next.go} <Arrow />
                </span>
              </a>
            }
            filter={hub.filter}
          />
        </div>
      </section>
      <section className="sec sec-band" id={hub.trust.id} aria-labelledby={`${hub.trust.id}-h`}>
        <div className="wrap">
          <div className="sec-head">
            <h2 id={`${hub.trust.id}-h`}>{hub.trust.title}</h2>
          </div>
          <div className="cx-trust">
            {hub.trust.items.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DocumentPage>
  );
}
