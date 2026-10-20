import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { SiteNav } from "@/components/layout/site-nav";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { assessmentCopy, assessmentProducts } from "@/content/assessment";
import { documents } from "@/content/documents";
import { builtFor } from "@/content/footer";
import { productOrder, products, type ProductId } from "@/content/products";
import { AssessmentAfter, AssessmentFacts } from "@/features/assessment/assessment-choice";
import { AssessmentDemos, type DemoView } from "@/features/assessment/assessment-demos";
import { AssessmentRun, AssessmentSwitch } from "@/features/assessment/assessment-hero";
import {
  EyeGlyph,
  GitHubMark,
  PlayGlyph,
  PythonMark,
  SendGlyph,
  ShieldGlyph,
} from "@/features/assessment/assessment-marks";
import { AssessmentProvider } from "@/features/assessment/assessment-provider";
import { FIRST_PAINT_SCRIPT } from "@/features/assessment/first-paint";
import { documentFacts } from "@/features/documents/document-facts";
import { FooterSection } from "@/features/footer/footer-section";
import { offSiteProps } from "@/lib/links";

const { title, sub, get, what, after } = assessmentCopy;

/** A run as What you get draws it, with its report's facts read from the file at build ("2 pages · 138 KB"). */
function demoView(product: ProductId): DemoView {
  const { demo, run } = assessmentProducts[product];
  const { pages, bytes } = documentFacts(demo.document);
  const kb = Math.round(bytes / 1000);
  return {
    product,
    name: products[product].name,
    kind: products[product].kind,
    run,
    found: demo.found,
    saving: demo.saving,
    file: demo.file,
    download: demo.download,
    pdf: documents[demo.document].pdf,
    thumb: demo.thumb,
    facts: `${get.kind} · PDF · ${pages} pages · ${kb} KB`,
    spoken: `Download the ${products[product].name} example report, PDF, ${pages} pages, ${kb} KB`,
  };
}

/**
 * The whole of `/assessment`:
 *
 *   Hero           on the left "Built for Azure and AWS", the h1 and, under them, "Choose the assessment you want."
 *                  over the switch with categories; on the right, What you get's terminal with the chosen product's
 *                  one line to copy, how to sign in to the cloud and where Cloud Shell keeps the PDF, each cloud by its
 *                  mark. Dark, with no turning mark.
 *   What you get   Coral's run and Amoeba's run side by side, each typed once as it comes into view, then its example
 *                  report to download. Both always, whatever the switch says. The page's one tinted band.
 *   What it does   the navy band, three facts (Reads, Runs, only when, Sends), the GitHub and PyPI cards and
 *                  "Read-only · Sends nothing".
 *   After the run  "Send us your PDF" and "Book 30 minutes", then the code and how the estimate works.
 *
 * ─── A SERVER COMPONENT, WITH ISLANDS ──────────────────────────────────────
 * The provider holds the product; the switch, the run line, the two facts and After the run's product lines read it.
 * What you get's runs play on their own. Everything else is static.
 *
 * ─── THE FIRST-PAINT SCRIPT COMES FIRST ────────────────────────────────────
 * Ahead of the skip link, so it runs while the HTML parses, before the hero is painted (`first-paint.ts`). Every
 * link into this page is a plain `<a>`: a client-side navigation would never run the script.
 */
export function AssessmentPage(): React.JSX.Element {
  const demos = productOrder.map(demoView);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: FIRST_PAINT_SCRIPT }} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <AssessmentProvider>
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
                <div className="ax-pick">
                  <p className="ax-sub">{sub}</p>
                  <AssessmentSwitch />
                </div>
              </div>
              <AssessmentRun />
            </div>
          </header>

          <section className="sec sec-band ax-get" id="run" aria-labelledby="ax-get-h">
            <div className="wrap">
              <div className="ax-head">
                <h2 id="ax-get-h">{get.title}</h2>
              </div>
              <AssessmentDemos demos={demos} />
            </div>
          </section>

          <section className="sec ax-what oc" id="what-it-does" aria-labelledby="ax-what-h">
            <div className="wrap">
              <div className="ax-head">
                <h2 id="ax-what-h">{what.title}</h2>
              </div>
              <dl className="oc-facts">
                <div>
                  <dt>
                    <EyeGlyph />
                    {what.reads}
                  </dt>
                  <AssessmentFacts fact="reads" />
                </div>
                <div>
                  <dt>
                    <PlayGlyph />
                    {what.runs}
                  </dt>
                  <AssessmentFacts fact="runs" />
                </div>
                <div className="oc-send">
                  <dt>
                    <SendGlyph />
                    {what.sends}
                  </dt>
                  <dd>
                    <b>{what.nothing}</b>
                  </dd>
                </div>
              </dl>
              <div className="brs">
                {what.cards.map((card) => (
                  <a className="br" href={card.href} key={card.title} {...offSiteProps(card.href)}>
                    <span className="br-m">
                      {card.mark === "github" ? <GitHubMark /> : <PythonMark />}
                    </span>
                    <span className="br-t">
                      <b>{card.title}</b>
                      <span>{card.line}</span>
                    </span>
                    <ExternalArrow />
                    <NewTabHint href={card.href} />
                  </a>
                ))}
                <span className="ro">
                  <ShieldGlyph />
                  {what.trust}
                </span>
              </div>
            </div>
          </section>

          <section className="sec ax-after" id="after" aria-labelledby="ax-after-h">
            <div className="wrap">
              <div className="ax-head">
                <h2 id="ax-after-h">{after.title}</h2>
              </div>
              <AssessmentAfter />
            </div>
          </section>
        </AssessmentProvider>
      </main>
      <FooterSection />
    </>
  );
}
