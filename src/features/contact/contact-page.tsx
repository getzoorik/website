import type { ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { Reveal } from "@/components/primitives/reveal";
import { marketplaces } from "@/config/marketplaces";
import { contactPage, grievanceOfficer, type ContactTopic } from "@/content/contact";
import { footerSocialLinks } from "@/content/footer";
import { ValueLabMark } from "@/features/case-studies/value-lab-mark";
import { DocumentPage } from "@/features/documents/document-page";
import { richText } from "@/features/documents/rich-text";
import { SocialMark } from "@/features/footer/footer-marks";
import { MailGlyph } from "@/features/programs/program-glyphs";
import { ProgramPair, ProgramSection } from "@/features/programs/program-parts";
import { NEW_TAB_HINT, isOffSite, offSiteProps } from "@/lib/links";

/**
 * `/contact`, on /partners' frame:
 *
 *   hero                        the title and one line
 *   the pair                    on the band: Book a demo on the white card, Email on the navy one
 *   What to write to us about   three groups, each topic as the guides' summary rows (its name, then its text and
 *                               links); the grievance officer, as /privacy names them, closes Security and privacy
 *   Company details             /about's company facts, on the band, then the line on writing by post
 *   Follow us, and buy          the footer's social row, and Zoorik's own page in each store with the way to every
 *                               listing, as /about's Find us draws its cards
 *
 * No phone, no form, no chat, and no closing assessment row: the call and the email are the page's first band. The
 * pair rises as it arrives; nothing else moves. A server component.
 */

const { hero, call, email, topics, company, follow, buy } = contactPage;

/** A list of company facts, /about's (`ab-facts`): a wide fact takes two columns where four sit in a row. */
export function Facts({
  facts,
}: {
  readonly facts: readonly {
    readonly term: string;
    readonly value: string;
    readonly wide?: true;
  }[];
}): React.JSX.Element {
  return (
    <dl className="ab-facts">
      {facts.map((fact) => (
        <div className={fact.wide ? "ab-f is-wide" : "ab-f"} key={fact.term}>
          <dt>{richText(fact.term)}</dt>
          <dd>{richText(fact.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A group's topics as the guides' summary: each topic's name, then its text and the links listed under it. */
function Topics({ items }: { readonly items: readonly ContactTopic[] }): React.JSX.Element {
  return (
    <dl className="doc-sum">
      {items.map((topic) => (
        <div key={topic.term}>
          <dt>{richText(topic.term)}</dt>
          <dd>
            <p>{richText(topic.text)}</p>
            {topic.list ? (
              <ul>
                {topic.list.map((line) => (
                  <li key={line}>{richText(line)}</li>
                ))}
              </ul>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A button that leaves the site, as the bar's Book a demo: its words, the hidden hint, then the arrow out. */
export function OffSiteButton({
  className,
  href,
  children,
}: {
  readonly className: string;
  readonly href: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <a className={className} href={href} {...offSiteProps(href)}>
      {children}
      <NewTabHint href={href} /> <ExternalArrow />
    </a>
  );
}

function Pair(): React.JSX.Element {
  return (
    <ProgramPair>
      <Reveal className="as-card as-mini cp-w" order={0}>
        <ValueLabMark className="cp-own cp-own-l" />
        <h2 className="as-h">{call.title}</h2>
        <p>{richText(call.line)}</p>
        <OffSiteButton className="btn-ink" href={call.go.href}>
          {call.go.label}
        </OffSiteButton>
      </Reveal>
      <Reveal className="as-cal cp-d" order={1}>
        <MailGlyph className="cp-own" />
        <h2 className="as-h">{email.title}</h2>
        <p>{richText(email.line)}</p>
        <a className="cta-go" href={email.go.href}>
          <span>{email.go.label}</span>
          <ExternalArrow />
        </a>
        <p className="cta-fine">{richText(email.fine)}</p>
      </Reveal>
    </ProgramPair>
  );
}

/** Zoorik's own page in each store, by the store's name in full: text only, no store logo. */
export function StoreButtons({
  stores,
}: {
  readonly stores: readonly { readonly name: ReactNode; readonly href: string }[];
}): React.JSX.Element {
  return (
    <>
      {stores.map((store) => (
        <a key={store.href} className="mkt-b" href={store.href} {...offSiteProps(store.href)}>
          <span>{store.name}</span>
          <NewTabHint href={store.href} />
          <ExternalArrow />
        </a>
      ))}
    </>
  );
}

/** The way to every listing, review site and registry. */
export function AllMarketplaces({
  all,
}: {
  readonly all: { readonly text: string; readonly href: string };
}): React.JSX.Element {
  return (
    <a className="cp-all" href={all.href}>
      {all.text} <Arrow />
    </a>
  );
}

export function ContactPage(): React.JSX.Element {
  return (
    <DocumentPage
      hero={{ title: richText(hero.title), deck: richText(hero.deck) }}
      assessmentRow={false}
    >
      <Pair />

      <ProgramSection id={topics.id} title={topics.title}>
        <div className="ct-col">
          {topics.groups.map((group) => (
            <div className="ct-g" key={group.title}>
              <h3>{richText(group.title)}</h3>
              <Topics items={group.topics} />
              {"grievance" in group ? (
                <>
                  <h4>{richText(grievanceOfficer.title)}</h4>
                  <p>{richText(grievanceOfficer.line)}</p>
                  <Facts facts={grievanceOfficer.facts} />
                  <p>{richText(grievanceOfficer.after)}</p>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </ProgramSection>

      <section className="sec sec-band" id={company.id} aria-labelledby={`${company.id}-h`}>
        <div className="wrap">
          <div className="sec-head">
            <h2 id={`${company.id}-h`}>{company.title}</h2>
          </div>
          <div className="ct-g">
            <Facts facts={company.facts} />
            <p>{richText(company.after)}</p>
          </div>
        </div>
      </section>

      <section className="sec" id="follow" aria-label={follow.label}>
        <div className="wrap">
          <div className="ab-find">
            <div className="pl">
              <h2>{follow.title}</h2>
              <div className="ab-social">
                {footerSocialLinks.map((link) => (
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
            </div>
            <div className="pl">
              <h2>{buy.title}</h2>
              <p>{richText(buy.line)}</p>
              <div className="mkt-btns">
                <StoreButtons
                  stores={marketplaces.map((store) => ({ name: store.name, href: store.profile }))}
                />
              </div>
              <AllMarketplaces all={buy.all} />
            </div>
          </div>
        </div>
      </section>
    </DocumentPage>
  );
}
