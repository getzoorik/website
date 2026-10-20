import type { ReactNode } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { ChannelButtons } from "@/components/primitives/install-buttons";
import { MarketplaceButtons } from "@/components/primitives/marketplace-buttons";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { aboutChannels } from "@/config/open-source";
import { routes } from "@/config/site";
import { about, type AboutFact, type AboutMilestone, type AboutSection } from "@/content/about";
import { footerSocialLinks } from "@/content/footer";
import { products } from "@/content/products";
import { DocumentPage } from "@/features/documents/document-page";
import { LinkTile } from "@/features/documents/link-tile";
import { SocialMark } from "@/features/footer/footer-marks";
import { named } from "@/features/legal/named";
import { NEW_TAB_HINT, isOffSite, offSiteProps } from "@/lib/links";

/**
 * `/about`: the utility hero, then the
 * live site's own sections at the full width, each a section head over its
 * content as on the home page, and the closing row for both products.
 *
 *   What we build   the line on what Zoorik does, then one tile per product
 *   How we build    the home page's four cards, a tick for each (on the band)
 *   Company         the facts, four to a row on a wide screen
 *   Milestones      four dated facts on a line, each with its page (on the
 *                   band)
 *   Find us         the two stores as buttons, the social row, where Zoorik
 *                   is published (Homebrew, Scoop, PyPI, Artifact Hub, the
 *                   Terraform Registry and GitHub) across the width, and
 *                   Zoorik on the web: six profiles and the way to
 *                   /marketplaces
 *
 * No founders. A server component with nothing that moves:
 * the page is prerendered whole and ships no script of its own.
 */

function Section({
  section,
  lede,
  band,
  children,
}: {
  readonly section: AboutSection;
  readonly lede?: string;
  /** The grey band the home page draws its cards on. */
  readonly band?: boolean;
  readonly children: ReactNode;
}): React.JSX.Element {
  const headingId = `${section.id}-h`;
  return (
    <section className={band ? "sec sec-band" : "sec"} id={section.id} aria-labelledby={headingId}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={headingId}>{section.title}</h2>
          {lede ? <p>{named(lede)}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/** The tick on each "How we build" card, where the home page's cards draw a figure. */
function Tick(): React.JSX.Element {
  return (
    <span className="ab-tick" aria-hidden="true">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8.4l3.2 3.2L13 4.8" />
      </svg>
    </span>
  );
}

/** A link in running text: the mailto in place, an address in a new tab with its arrow and its warning. */
function TextLink({ text, href }: { readonly text: string; readonly href: string }) {
  return (
    <a href={href} {...offSiteProps(href)}>
      {text}
      {isOffSite(href) ? <ExternalArrow /> : null}
      <NewTabHint href={href} />
    </a>
  );
}

function FactValue({ value }: { readonly value: AboutFact["value"] }): React.JSX.Element {
  return typeof value === "string" ? <>{named(value)}</> : <TextLink {...value} />;
}

/** Milestones: the date in the left column, the dot on the line, what happened and its page on the right. */
function Milestones({ items }: { readonly items: readonly AboutMilestone[] }): React.JSX.Element {
  return (
    <ol className="ab-ms">
      {items.map((item) => (
        <li key={item.title}>
          <time dateTime={item.date.iso}>{item.date.text}</time>
          <div>
            <h3>{named(item.title)}</h3>
            <p>
              {/* The space before the link ends the line's own text, as the mock writes it. */}
              {named(item.link ? `${item.line} ` : item.line)}
              {item.link ? (
                <>
                  <a href={item.link.href}>{item.link.text}</a>.
                </>
              ) : null}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function AboutPage(): React.JSX.Element {
  const { what, how, company, milestones, find } = about;
  const social = find.social.flatMap(
    (platform) => footerSocialLinks.find((link) => link.platform === platform) ?? [],
  );

  return (
    <DocumentPage hero={{ title: named(about.hero.title), deck: named(about.hero.deck) }}>
      <Section section={what.section} lede={what.lede}>
        <div className="dt-grid ab-prods">
          {what.products.map((product) => (
            <LinkTile
              key={product}
              href={routes[product]}
              icon={<ProductMark product={product} className="dt-ic" />}
              title={<span translate="no">{products[product].name}</span>}
              line={products[product].descriptor}
            />
          ))}
        </div>
      </Section>

      <Section section={how.section} band>
        <div className="pls ab-how">
          {how.cards.map((card) => (
            <article className="pl" key={card.title}>
              <Tick />
              <h3>{card.title}</h3>
              <p>{named(card.body)}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section section={company.section}>
        <dl className="ab-facts">
          {company.facts.map((fact) => (
            <div className={fact.wide ? "ab-f is-wide" : "ab-f"} key={fact.term}>
              <dt>{fact.term}</dt>
              <dd>
                <FactValue value={fact.value} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section section={milestones.section} band>
        <Milestones items={milestones.items} />
      </Section>

      <Section section={find.section}>
        <div className="ab-find">
          <div className="pl">
            <h3>{find.stores}</h3>
            <MarketplaceButtons className="ab-mb" idSuffix="about" />
          </div>
          <div className="pl">
            <h3>{find.follow}</h3>
            <div className="ab-social">
              {social.map((link) => (
                <a
                  className="soc"
                  key={link.platform}
                  href={link.href}
                  {...offSiteProps(link.href)}
                  aria-label={isOffSite(link.href) ? link.label + NEW_TAB_HINT : link.label}
                >
                  <SocialMark platform={link.platform} />
                </a>
              ))}
            </div>
            <p>
              {find.note.before}
              <TextLink {...find.note.learn} />
              {find.note.between}
              <TextLink {...find.note.medium} />
              {find.note.after}
            </p>
          </div>
          <div className="pl ab-pub">
            <h3>{find.published}</h3>
            <ChannelButtons className="ab-pb" items={aboutChannels} />
          </div>
          <div className="pl ab-pub ab-web">
            <h3>{named(find.web.title)}</h3>
            <div className="ab-wl">
              {find.web.links.map((link) => (
                <a className="ab-wb" key={link.name} href={link.href} {...offSiteProps(link.href)}>
                  <b>{link.name}</b>
                  <small>{named(link.line)}</small>
                  <NewTabHint href={link.href} />
                </a>
              ))}
            </div>
            <p className="ab-all">
              <a href={find.web.all.href}>{find.web.all.text}</a>
            </p>
          </div>
        </div>
      </Section>
    </DocumentPage>
  );
}
