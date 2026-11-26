import { Fragment } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { SiteNav } from "@/components/layout/site-nav";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { assessmentCopy, type TextRun } from "@/content/assessment";
import { documents } from "@/content/documents";
import { builtFor } from "@/content/footer";
import { products } from "@/content/products";
import { AssessmentDemo, type DemoFile } from "@/features/assessment/assessment-demos";
import { AssessmentCommand } from "@/features/assessment/assessment-hero";
import { GitHubMark, MailGlyph } from "@/features/assessment/assessment-marks";
import { documentFacts } from "@/features/documents/document-facts";
import { FooterSection } from "@/features/footer/footer-section";
import { offSiteProps } from "@/lib/links";

const { title, lead, get, what, before, after } = assessmentCopy;

/** The example report under the run, its pages and size read from the file at build ("PDF · 4 pages · 219 KB"). */
function exampleFile(): DemoFile {
  const { pages, bytes } = documentFacts(get.document);
  const kb = Math.round(bytes / 1000);
  return {
    pdf: documents[get.document].pdf,
    facts: `PDF · ${pages} pages · ${kb} KB`,
    spoken: `Download ${documents[get.document].spokenName}, PDF, ${pages} pages, ${kb} KB`,
  };
}

/** A fact's runs, each code run set as code. */
function Runs({ runs }: { readonly runs: readonly TextRun[] }): React.JSX.Element {
  return (
    <>
      {runs.map((part, index) =>
        part.code ? (
          <code translate="no" key={index}>
            {part.text}
          </code>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * The whole of `/assessment`:
 *
 *   Hero              on the left "Built for Azure and AWS", the h1 and its one line (the site's hero deck); on the
 *                     right the one command to copy, in What you get's terminal. Dark, with no turning mark.
 *   What you get      from 1100px the heading on the left and, on the right, the run, typed once as it comes into
 *                     view, and the example report to download, so the run stands right under the hero's command.
 *                     The page's one tinted band.
 *   What it does      the navy band, three facts (Reads, Runs, Sends), and under "Nothing." the code on GitHub.
 *   Before you run it three questions, each with its answer under a hairline: how long a run takes, the access it
 *                     needs and how the saving is worked out.
 *   After the run     "Send us your PDF" and "Book 30 minutes".
 *
 * A server component with two islands: the command's Copy, and the run.
 */
export function AssessmentPage(): React.JSX.Element {
  const mail = `mailto:${after.send.email}?subject=${encodeURIComponent(after.send.subject)}`;

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <header className="hero doc-hero ax-hero" id="top">
          <div className="wrap hero-in ax-hero-in">
            <div className="ax-hero-t">
              <div className="hero-badges">
                <p className="az-badge hero-badge">
                  {/* The footer draws the same badge: its own gradient ids keep the page free of duplicates. */}
                  <AzureMark idSuffix="ax-hero" className="az-mark" />{" "}
                  <AwsMark crop="badge" className="az-mark az-aws" /> {builtFor.common.label}{" "}
                  <b>{builtFor.common.platforms}</b>
                </p>
              </div>
              <h1>{title}</h1>
              <p className="doc-deck ax-lead">{lead}</p>
            </div>
            <AssessmentCommand />
          </div>
        </header>

        <section className="sec sec-band ax-get" id="run" aria-labelledby="ax-get-h">
          <div className="wrap">
            <div className="ax-get-in" id="ax-demos">
              <div className="ax-head">
                <h2 id="ax-get-h">{get.title}</h2>
              </div>
              <AssessmentDemo file={exampleFile()} />
            </div>
          </div>
        </section>

        <section className="sec ax-what oc" id="what-it-does" aria-labelledby="ax-what-h">
          <div className="wrap">
            <div className="ax-head">
              <h2 id="ax-what-h">{what.title}</h2>
            </div>
            <dl className="oc-facts">
              <div>
                <dt>{what.reads.title}</dt>
                <dd>{what.reads.text}</dd>
              </div>
              <div>
                <dt>{what.runs.title}</dt>
                <dd>
                  <Runs runs={what.runs.text} />
                </dd>
              </div>
              <div className="oc-send">
                <dt>{what.sends.title}</dt>
                <dd>
                  <b>{what.sends.nothing}</b>
                  <a className="br" href={what.code.href} {...offSiteProps(what.code.href)}>
                    <span className="br-m">
                      <GitHubMark />
                    </span>
                    <span className="br-t">
                      <b>{what.code.title}</b>
                      <span>
                        {what.code.line}
                        <span className="br-dot"> · </span>
                        <span className="br-lic">{what.code.license}</span>
                      </span>
                    </span>
                    <ExternalArrow />
                    <NewTabHint href={what.code.href} />
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="sec ax-before" id={before.id} aria-labelledby="ax-before-h">
          <div className="wrap">
            <div className="ax-head">
              <h2 id="ax-before-h">{before.title}</h2>
            </div>
            <div className="ax-qs">
              {before.questions.map((question) => (
                <div className="ax-q" key={question.title}>
                  <h3>{question.title}</h3>
                  <div className="ax-a">
                    {"items" in question ? (
                      <ul>
                        {question.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        {question.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        {question.link ? (
                          <p>
                            <a
                              className="alink"
                              href={question.link.href}
                              {...offSiteProps(question.link.href)}
                            >
                              <span>{question.link.text}</span>
                              <ExternalArrow />
                              <NewTabHint href={question.link.href} />
                            </a>
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec ax-after" id="after" aria-labelledby="ax-after-h">
          <div className="wrap">
            <div className="ax-head">
              <h2 id="ax-after-h">{after.title}</h2>
            </div>
            <div className="as-grid">
              <div className="as-card as-mini">
                <h3 className="as-h">{after.send.title}</h3>
                <p>{after.send.reply}</p>
                <a className="btn-ink" href={mail}>
                  <MailGlyph />
                  <span>{after.send.button}</span>
                </a>
              </div>
              <div className="as-cal">
                <h3 className="as-h">{after.book.title}</h3>
                <p>
                  {after.book.line}
                  {after.book.both.map((id, index) => (
                    <Fragment key={id}>
                      {index > 0 ? " and " : null}
                      <span translate="no">{products[id].name}</span>
                    </Fragment>
                  ))}
                  .
                </p>
                <a className="cta-go" href={after.book.href} {...offSiteProps(after.book.href)}>
                  {after.book.cta}
                  <ExternalArrow />
                  <NewTabHint href={after.book.href} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
