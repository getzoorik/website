import type { ReactNode } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ProductMark } from "@/components/brand/product-marks";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { marketplaces, type MarketplaceId } from "@/config/marketplaces";
import { agentChart, openSourceLinks } from "@/config/open-source";
import { assessmentProducts } from "@/content/assessment";
import { offersContent } from "@/content/offers";
import { partnersPage, type PartnerCover } from "@/content/partners";
import { productOrder } from "@/content/products";
import { savingsFigures, savingsQualifier } from "@/content/savings";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import {
  ProgramClose,
  ProgramHero,
  studyFigures,
  Terminal,
  vars,
} from "@/features/programs/program-parts";
import { ProgramsMotion } from "@/features/programs/programs-motion";

/**
 * `/partners`, on /about's frame:
 *
 *   hero                     Coming soon, Partner program, the line, a ready email and "What you can use today" (#today)
 *   What you bring           the navy panel: the home page's three estimated ranges on one 0 to 100% scale, the
 *                            qualifier, and the case study's −58%; the ranges grow once in view
 *   Who it is for            three cards, each under its drawn cover: a plan, a fleet, the two marketplaces
 *   What you can use today   the assessment's two commands, the Helm chart, the Terraform module, the marketplaces
 *                            (band), whose card links to /marketplaces: "Where to find us"
 *   close                    "Want to partner with us?" and a ready email
 *
 * No terms, no commission, no figure of our own making: the program has none yet, and every figure here is read from
 * its source. No closing assessment row (the mock ends on the close). One island moves the page (`ProgramsMotion`).
 */

const { hero, offer, who, today, close } = partnersPage;

/**
 * A range's two ends, read from its printed form ("40–50%" is 40 and 50), so the band can never disagree with the
 * figure beside it. A range written any other way fails the build rather than drawing a wrong band.
 */
function rangeOf(range: string): { readonly low: number; readonly high: number } {
  const ends = /^(\d+)–(\d+)%$/.exec(range);
  if (!ends) throw new Error(`/partners cannot draw the range "${range}" on its scale.`);
  return { low: Number(ends[1]), high: Number(ends[2]) };
}

/** A marketplace's mark, as the mock's sprite draws it; the Azure mark's gradients take the surface's own ids. */
const STORE_MARKS: Readonly<Record<MarketplaceId, (surface: string) => ReactNode>> = {
  aws: () => <AwsMark className="pv-mk" />,
  microsoft: (surface) => <AzureMark idSuffix={surface} className="pv-mk" />,
};

/** The two marketplaces as white chips on navy, each its mark and its store's own name. */
function Stores({ surface }: { readonly surface: string }): React.JSX.Element {
  return (
    <>
      {marketplaces.map((store) => (
        <span key={store.id}>
          {STORE_MARKS[store.id](`${surface}-${store.id}`)} {store.name}
        </span>
      ))}
    </>
  );
}

/**
 * What you bring: the navy panel. Each row is a range from `savings.ts` (the home page's), its band placed on the
 * home page's axis (`offers.ts`), its figure said as it is meant ("40 to 50 percent"). The qualifier follows them, as
 * it follows every set of savings figures on the site.
 */
function Offer(): React.JSX.Element {
  return (
    <section className="sec pv-sec" id={offer.id} aria-labelledby={`${offer.id}-h`}>
      <div className="wrap">
        <div className="pv-panel pv-anim pv-offer">
          <div className="pv-phead">
            <p className="pv-eyebrow">{offer.eyebrow}</p>
            <h2 id={`${offer.id}-h`}>{offer.title}</h2>
            <p>{named(offer.lede)}</p>
          </div>
          <div className="pv-ranges">
            <div className="pv-scale" aria-hidden="true">
              {offersContent.axis.ticks.map((tick) => (
                <span key={tick}>{`${tick}%`}</span>
              ))}
            </div>
            {offer.rows.map((row, i) => {
              const { range, spoken } = savingsFigures[row.figure];
              const { low, high } = rangeOf(range);
              return (
                <div
                  className="pv-rg"
                  style={vars({ "--a": low, "--b": high, "--i": i })}
                  key={row.figure}
                >
                  <div className="pv-rl">
                    {row.figure === "both" ? (
                      <span className="pv-both" aria-hidden="true">
                        {productOrder.map((id) => (
                          <ProductMark product={id} className="pv-wic" key={id} />
                        ))}
                      </span>
                    ) : (
                      <ProductMark product={row.figure} className="pv-wic" />
                    )}
                    <span>
                      <b>{named(row.name)}</b>
                      <small>{row.of}</small>
                    </span>
                  </div>
                  <div className="pv-track">
                    <i />
                  </div>
                  <b className="pv-rv" role="img" aria-label={spoken}>
                    {range}
                  </b>
                </div>
              );
            })}
          </div>
          <div className="pv-ofoot">
            <span>{savingsQualifier}</span>
            <a href={studyFigures.href}>
              {studyFigures.figure}
              {offer.study} <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Where a fleet's machines are lit: five of twenty-one, a drawing, not a figure. */
const FLEET_ON = new Set([2, 7, 9, 13, 18]);
/** Where the plan's six machines sit, in percent of the cover (two of them lit by the sheet). */
const PLAN = [
  [18, 30],
  [42, 22],
  [66, 34],
  [30, 62],
  [56, 66],
  [80, 58],
] as const;

/** Each card's cover, drawn on navy: a consultant's plan, a provider's fleet, the two marketplaces. */
const COVERS: Readonly<Record<PartnerCover, () => React.JSX.Element>> = {
  plan: () => (
    <div className="pv-cv pv-cv-plan" aria-hidden="true">
      {PLAN.map(([x, y]) => (
        <i style={vars({ "--x": x, "--y": y })} key={`${x} ${y}`} />
      ))}
    </div>
  ),
  fleet: () => (
    <div className="pv-cv pv-cv-fleet" aria-hidden="true">
      {Array.from({ length: 21 }, (_, k) => (
        <i className={FLEET_ON.has(k) ? "on" : undefined} key={k} />
      ))}
    </div>
  ),
  market: () => (
    <div className="pv-cv pv-cv-mkt" aria-hidden="true">
      <Stores surface="pv-cv" />
    </div>
  ),
};

function Who(): React.JSX.Element {
  return (
    <section className="sec" id={who.id} aria-labelledby={`${who.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${who.id}-h`}>{who.title}</h2>
        </div>
        <div className="pv-wgrid">
          {who.cards.map((card) => {
            const Cover = COVERS[card.cover];
            return (
              <article className="pv-wcard" key={card.cover}>
                <Cover />
                <div className="pv-wb">
                  <h3>{card.title}</h3>
                  <p>{named(card.body)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** One tool in What you can use today: its picture on the left, its name, line and way in on the right. */
function Kit({
  picture,
  title,
  body,
  go,
  href,
  className = "pv-kit",
}: {
  readonly picture: ReactNode;
  readonly title: string;
  readonly body: ReactNode;
  readonly go: string;
  readonly href: string;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <article className={className}>
      {picture}
      <div className="pv-kb">
        <h3>{title}</h3>
        <p>{body}</p>
        <a className="pv-go dark" href={href}>
          {go} <Arrow />
        </a>
      </div>
    </article>
  );
}

/** The AKS module's address on the Terraform Registry, as a module block's `source` names it. */
const terraformSource = openSourceLinks.terraformAks.replace(
  "https://registry.terraform.io/modules/",
  "",
);

/**
 * What you can use today: the assessment's two commands (`assessment.ts`), the Helm install of the chart and the AKS
 * module block (`open-source.ts`), and the two marketplaces (`marketplaces.ts`).
 */
function Today(): React.JSX.Element {
  const { assessment, helm, terraform, marketplaces: stores } = today;
  return (
    <section className="sec sec-band" id={today.id} aria-labelledby={`${today.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${today.id}-h`}>{today.title}</h2>
          <p>{today.lede}</p>
        </div>
        <div className="pv-kits">
          <Kit
            {...assessment}
            picture={
              <Terminal
                title={today.terminal}
                lines={productOrder.map((id) => `$ ${assessmentProducts[id].run}`)}
              />
            }
          />
          <Kit
            {...helm}
            picture={
              <Terminal title={today.terminal} lines={[`$ ${helm.command}`, `    ${agentChart}`]} />
            }
          />
          <Kit
            {...terraform}
            picture={
              <Terminal
                title={terraform.file}
                lines={[`module "${terraform.module}" {`, `  source = "${terraformSource}"`, "}"]}
              />
            }
          />
          <Kit
            {...stores}
            body={named(stores.body)}
            className="pv-kit pv-kit-mkt"
            picture={
              <div className="pv-mkts">
                <Stores surface="pv-kit" />
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

export function PartnersPage(): React.JSX.Element {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="pv-main">
        <ProgramHero {...hero} />
        <Offer />
        <Who />
        <Today />
        <ProgramClose {...close} />
        <ProgramsMotion />
      </main>
      <FooterSection />
    </>
  );
}
