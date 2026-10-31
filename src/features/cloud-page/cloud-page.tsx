import type { ReactNode } from "react";

import { TurningMark } from "@/components/brand/turning-mark";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { Chips } from "@/components/primitives/chips";
import { Reveal } from "@/components/primitives/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import type { AmoebaCloudPage, CloudPageContent, CoralCloudPage } from "@/content/cloud-pages";
import { AssessSection } from "@/features/assess/assess-section";
import { UnnumberedRow } from "@/features/doc-rows/doc-rows";
import { DocumentFolds } from "@/features/documents/document-folds";
import { LinkTile } from "@/features/documents/link-tile";
import { DocTable } from "@/features/documents/prose";
import { richText } from "@/features/documents/rich-text";
import { FooterSection } from "@/features/footer/footer-section";
import { HeroPhoto } from "@/features/hero/hero-photo";
import heroImage from "@/features/hero/hero-racks-graded.webp";
import { StepCard } from "@/features/how-it-works/how-it-works-section";
import { sectionSlug } from "@/features/open-source/os-guide-page";
import { InstallYourWay } from "@/features/product-page/install-your-way";
import { ReadMore } from "@/features/product-page/read-more";

/**
 * A per-cloud page: `/aks-cost-optimization`, `/eks-cost-optimization`, `/azure-managed-disk-cost-optimization` and
 * `/ebs-cost-optimization` are this template with four contents (`cloud-pages.ts`), TEMPLATES.md's Cloud template as
 * the mocks draw it (`aks-cost-optimization.html`…).
 *
 * ─── THE ORDER ─────────────────────────────────────────────────────────────
 * Hero (the product hero's ground: the glow, the turning mark and the racks photo; the footer label as the eyebrow,
 * the search phrase, one line, Estimate your saving and the Runs on chips) → What <product> does on <cloud> (/coral's
 * "What is Coral?" text column alone) → How it works on <cloud> (the page's one band: the product's three cards, one
 * line each) → the guides' sections (the name in the rail, the text in the docs column, framed as /pricing frames its
 * questions): what connect or onboarding sets up, then on Amoeba what the VMs need and the questions → on Coral, Works
 * with (a tile for each works-with page), /coral's Install your way, then the questions → Read more → the closing row.
 * Two white sections in a row share one gap (the site system's `.sec + .sec`).
 *
 * ─── REUSED, NOT COPIED ────────────────────────────────────────────────────
 * The bar, the turning mark, the photo, the chips, the step cards, the docs table, the question rows and their folds,
 * the doc tiles, Install your way, Read more, the closing row and the footer are the site's own components. This
 * page's sheet (cloud-page.css) holds only what the site's sheets don't: the photo's box, the hero line's wrap, the
 * eyebrow, the About column, the cards' line and the question rows' two rules.
 *
 * ─── LEFT OUT, ON PURPOSE ──────────────────────────────────────────────────
 * No film band, Watch button, badges, offering rows, marketplace line, "Compatible with" row or range card: a step
 * card has no figure, mark or key, and nothing on the page is a figure or a price.
 *
 * ─── STATIC ────────────────────────────────────────────────────────────────
 * A server component with no request data, so each page is prerendered at build. The islands (the bar, the reveals,
 * the photo's fallback, Install your way's switch and copy, the folds) hydrate on top.
 */

/** The hero: the ground, the eyebrow over the h1, the line, one button, then the Runs on chips. */
function CloudHero({ content }: { readonly content: CloudPageContent }): React.JSX.Element {
  const { hero } = content;
  return (
    <header className="hero pp-hero cl-hero" id="top">
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
        <div className="hero-chips">
          <Chips id="hero-runs" label={hero.runsOn.label} items={hero.runsOn.platforms} />
        </div>
      </div>
    </header>
  );
}

/** What <product> does on <cloud> (`#about`): /coral's "What is Coral?" column, its paragraphs all in view. */
function CloudAbout({ content }: { readonly content: CloudPageContent }): React.JSX.Element {
  const { about } = content;
  return (
    <section className="sec" id="about" aria-labelledby="about-h">
      <div className="wrap">
        <Reveal className="pp-def-t">
          <h2 id="about-h">{richText(about.title)}</h2>
          <div className="pp-prose">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{richText(paragraph)}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** How it works on <cloud> (`#how`, the band): the product's three cards, each with its one line. */
function CloudHow({ content }: { readonly content: CloudPageContent }): React.JSX.Element {
  const { how } = content;
  return (
    <section className="sec sec-band" id="how">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>{how.title}</h2>
        </Reveal>
        <div className="steps">
          {how.steps.map(({ line, ...head }, index) => (
            <StepCard step={{ ...head, line: richText(line) }} order={index} key={head.ordinal} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** The guides' frame around the sections that follow each other (`.sec.doc-body > .wrap > .doc-main.fq-main`). */
function DocFrame({ children }: { readonly children: ReactNode }): React.JSX.Element {
  return (
    <div className="sec doc-body">
      <div className="wrap">
        <article className="doc-main fq-main">{children}</article>
      </div>
    </div>
  );
}

/** One of the guides' sections: its name in the rail, its text in the docs column. */
function DocSection({
  id,
  title,
  rows,
  children,
}: {
  readonly id: string;
  readonly title: string;
  /** The question rows: /pricing's (`pr-faq`), and not set as prose. */
  readonly rows?: boolean;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <section className={rows ? "fq-sec pr-faq" : "fq-sec"} id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{richText(title)}</h2>
      <div className={rows ? "fq-sec-b" : "fq-sec-b doc-prose"}>{children}</div>
    </section>
  );
}

function List({ items }: { readonly items: readonly string[] }): React.JSX.Element {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{richText(item)}</li>
      ))}
    </ul>
  );
}

/** What connect (or onboarding) sets up (`#setup`): the docs table, stacked on a phone, then what to know. */
function Setup({ content }: { readonly content: CloudPageContent }): React.JSX.Element {
  const { title, table, notes } = content.setup;
  return (
    <DocSection id="setup" title={title}>
      <DocTable
        className="nw-tbl"
        columns={table.head.map((label, index) => ({ label, width: table.widths[index] }))}
        rows={table.rows.map((cells) => cells.map((cell) => richText(cell)))}
      />
      <List items={notes} />
    </DocSection>
  );
}

/** What your VMs need (`#needs`, Amoeba): the list, then where the full list is. */
function Needs({ content }: { readonly content: AmoebaCloudPage }): React.JSX.Element {
  const { title, items, after } = content.needs;
  return (
    <DocSection id="needs" title={title}>
      <List items={items} />
      <p>{richText(after)}</p>
    </DocSection>
  );
}

/** The questions (`#questions`): /pricing's rows, the FAQ's with no number column, closed; a link to one opens it. */
function Questions({ content }: { readonly content: CloudPageContent }): React.JSX.Element {
  const { title, rows } = content.questions;
  return (
    <DocSection id="questions" title={title} rows>
      <div className="fq-list">
        {rows.map((row) => (
          <UnnumberedRow
            id={sectionSlug(row.question)}
            title={richText(row.question)}
            key={row.question}
          >
            <p>{richText(row.answer)}</p>
          </UnnumberedRow>
        ))}
      </div>
      <DocumentFolds />
    </DocSection>
  );
}

/** Works with (`#works-with`, Coral): a tile for each works-with page that applies on this cloud. */
function WorksWith({ content }: { readonly content: CoralCloudPage }): React.JSX.Element {
  const { title, tiles } = content.worksWith;
  return (
    <section className="sec" id="works-with" aria-labelledby="works-with-h">
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id="works-with-h">{title}</h2>
        </div>
        <div className="dt-grid">
          {tiles.map((tile) => (
            <LinkTile
              href={tile.href}
              title={tile.title}
              line={richText(tile.line)}
              key={tile.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The middle of the page. On Coral: the setup in the guides' frame, then Works with and Install your way, then the
 * questions in the frame again. On Amoeba: the setup, what the VMs need and the questions, one after another in one
 * frame, as /security's sections sit in theirs.
 */
function CloudBody({ content }: { readonly content: CloudPageContent }): React.JSX.Element {
  if (content.product === "coral") {
    return (
      <>
        <DocFrame>
          <Setup content={content} />
        </DocFrame>
        <WorksWith content={content} />
        <InstallYourWay />
        <DocFrame>
          <Questions content={content} />
        </DocFrame>
      </>
    );
  }
  return (
    <DocFrame>
      <Setup content={content} />
      <Needs content={content} />
      <Questions content={content} />
    </DocFrame>
  );
}

export function CloudPage({ content }: { readonly content: CloudPageContent }): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(content.path)} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <CloudHero content={content} />
        <CloudAbout content={content} />
        <CloudHow content={content} />
        <CloudBody content={content} />
        <ReadMore content={content} />
        <AssessSection product={content.product} />
      </main>
      <FooterSection />
    </>
  );
}
