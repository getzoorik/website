import { TurningMark } from "@/components/brand/turning-mark";
import { ProductMark } from "@/components/brand/product-marks";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import type { TopicPage as TopicContent } from "@/content/topic-pages";
import { AssessSection } from "@/features/assess/assess-section";
import { DocRows, UnnumberedRow } from "@/features/doc-rows/doc-rows";
import { plainText, richText } from "@/features/documents/rich-text";
import { ProseBlocks, proseText, ReadMoreRow } from "@/features/documents/prose-blocks";
import { FooterSection } from "@/features/footer/footer-section";
import { HeroPhoto } from "@/features/hero/hero-photo";
import heroImage from "@/features/hero/hero-racks-graded.webp";
import { sectionSlug } from "@/features/open-source/os-guide-page";

/**
 * A Topic page: `/azure-cost-optimization` and `/aws-cost-optimization` are this template with two contents
 * (`topic-pages.ts`), as their mocks draw it (`azure-cost-optimization.html`, four_pages_mock.py).
 *
 * ─── THE ORDER ─────────────────────────────────────────────────────────────
 * Hero (the cloud pages' ground: the glow, the turning mark and the racks photo; the cloud as the eyebrow, the h1,
 * the short answer as the line and Estimate your saving, with no chips) → the Learn frame (each section's name beside
 * its text from 981px; on a phone the row of names, which names the band and the questions too) → Where Coral and
 * Amoeba fit (the page's one band: the two product cards, then the lines under them) → the questions in the frame
 * again → Read more → the closing row, naming both products.
 *
 * ─── REUSED, NOT COPIED ────────────────────────────────────────────────────
 * The bar, the turning mark, the photo, the frame and its chips, the docs table, the question rows and their folds,
 * the cards (`.pl`), the doc tiles, the closing row and the footer are the site's own. The cloud pages' sheet
 * (cloud-page.css) carries the photo, the line, the eyebrow and the question rows' two rules through `cl-hero`; this
 * page's own sheet (topic-page.css) holds only the h1's measure, the band and the link box's space.
 *
 * ─── STATIC ────────────────────────────────────────────────────────────────
 * A server component with no request data, so each page is prerendered at build. The islands (the bar, the photo's
 * fallback, the chips, the folds) hydrate on top.
 */

/** The ids of the band and the questions, which the first frame's chips name too. */
const BAND = "coral-and-amoeba";
const QUESTIONS = "questions";

/** The hero: the ground, the eyebrow over the h1, the line, one button. */
function TopicHero({ content }: { readonly content: TopicContent }): React.JSX.Element {
  const { hero } = content;
  return (
    <header className="hero pp-hero cl-hero tp-hero" id="top">
      <TurningMark />
      <HeroPhoto
        src={heroImage.src}
        className="hero-photo"
        width={heroImage.width}
        height={heroImage.height}
      />
      <div className="wrap hero-in">
        <p className="hero-ey">{richText(hero.eyebrow)}</p>
        <h1>{hero.title}</h1>
        <p className="hero-sub">{richText(hero.line)}</p>
        <div className="hero-cta">
          <a className="btn btn-light" href={hero.cta.href}>
            {hero.cta.label} <Arrow />
          </a>
        </div>
      </div>
    </header>
  );
}

/** Where Coral and Amoeba fit (`#coral-and-amoeba`, the band): the lead, the two cards, then the lines under them. */
function TopicProducts({ content }: { readonly content: TopicContent }): React.JSX.Element {
  const { title, lead, cards, notes } = content.products;
  return (
    <section className="sec sec-band" id={BAND} aria-labelledby={`${BAND}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${BAND}-h`}>{richText(title)}</h2>
          <p>{richText(lead)}</p>
        </div>
        <div className="tp-prods">
          {cards.map((card) => (
            <article className="pl" key={card.product}>
              <div className="tp-ph">
                <ProductMark product={card.product} />
                <h3>{richText(card.title)}</h3>
              </div>
              {card.paragraphs.map((paragraph) => (
                <p key={paragraph}>{proseText(paragraph)}</p>
              ))}
              <a className="alink" href={card.link.href}>
                <span>{richText(card.link.label)}</span>
                <Arrow />
              </a>
            </article>
          ))}
        </div>
        <div className="pp-prose">
          {notes.map((note) => (
            <p key={note}>{proseText(note)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TopicPage({ content }: { readonly content: TopicContent }): React.JSX.Element {
  const { sections, products, questions, readMore } = content;
  return (
    <>
      <JsonLd data={pageStructuredData(content.path)} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <TopicHero content={content} />
        <DocRows
          frame="article"
          folds={false}
          chips={[
            ...sections.map((section) => ({ id: section.id, label: plainText(section.title) })),
            { id: BAND, label: plainText(products.title) },
            { id: QUESTIONS, label: plainText(questions.title) },
          ]}
          groups={sections.map((section) => ({
            id: section.id,
            title: richText(section.title),
            chip: plainText(section.title),
            body: <ProseBlocks blocks={section.blocks} />,
          }))}
        />
        <TopicProducts content={content} />
        <DocRows
          frame="article"
          folds={false}
          chips={[]}
          groups={[
            {
              id: QUESTIONS,
              title: richText(questions.title),
              chip: plainText(questions.title),
              unnumbered: true,
              rows: questions.rows.map((row) => (
                <UnnumberedRow
                  id={sectionSlug(row.question)}
                  title={richText(row.question)}
                  key={row.question}
                >
                  <p>{proseText(row.answer)}</p>
                </UnnumberedRow>
              )),
            },
          ]}
        />
        <ReadMoreRow title={readMore.title} tiles={readMore.tiles} />
        <AssessSection reveal={false} />
      </main>
      <FooterSection />
    </>
  );
}
