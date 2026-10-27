import type { ReactNode } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { AmoebaMark, CoralMark } from "@/components/brand/product-marks";
import { TurningMark } from "@/components/brand/turning-mark";
import { SiteNav } from "@/components/layout/site-nav";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { Reveal } from "@/components/primitives/reveal";
import {
  newsFromZoorik,
  newsPage,
  newsRadar,
  type NewsAnnouncement,
  type RadarItem,
} from "@/content/news";
import { products } from "@/content/products";
import { ValueLabMark } from "@/features/case-studies/value-lab-mark";
import { MediumMark } from "@/features/community/community-marks";
import { ArrowGlyph, ArrowOutGlyph } from "@/features/documents/document-glyphs";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import { newsDay, newsShortDay, radarMark, type RadarLogo } from "@/features/news/news-facts";
import { RadarStreams } from "@/features/news/radar-streams";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * `/news`, Zoorik News, in the site's own parts:
 *
 *   hero     the page's name and its deck
 *   latest   the newest announcement on the white card, flagged "Latest", beside the newsletter on the dark one: the
 *            closing row's pair, on the band
 *   zoorik   From Zoorik: the other announcements, as Read more tiles, each with its product's mark or ours
 *   radar    Zoorik Radar: its week, one row of chips for the three streams, each stream's items as tiles that open
 *            their source in a new tab, each with the source's logo, then what the Radar reads, and under it, small,
 *            the trademark line an announcement's company asks for (NVIDIA's, for NVIDIA Inception)
 *
 * Drawn on the server but for the chips (`RadarStreams`), which only hide streams, so the page reads whole without
 * scripting. The pair rises as it arrives, as the closing row's does on home. No closing assessment row, and the
 * follow links are the footer's.
 */

const { hero, latest, zoorik, radar } = newsPage;

/** Where each logo file lives; the cloud marks are drawn in the page. */
const LOGO_FILES: Record<Exclude<RadarLogo, "aws" | "azure">, string> = {
  karpenter: "/community-logos/karpenter.svg",
  "finops-foundation": "/community-logos/finops-foundation.svg",
};

/** An announcement's mark: its product's where the tag is a product, else the Zoorik mark, still. */
function TagMark({
  tag,
  className,
}: {
  readonly tag: string;
  readonly className: string;
}): React.JSX.Element {
  if (tag === products.coral.name) return <CoralMark className={className} />;
  if (tag === products.amoeba.name) return <AmoebaMark className={className} />;
  return <ValueLabMark className={className} />;
}

/** A Radar item's icon: its source's logo, 28px wide, or the source's monogram. */
function SourceMark({
  item,
  mark,
}: {
  readonly item: RadarItem;
  /** Unique on the page: the Azure mark's gradients are named by it. */
  readonly mark: string;
}): React.JSX.Element {
  const pick = radarMark(item);
  if ("monogram" in pick) {
    return (
      <span className="dt-ic nw-mono" aria-hidden="true">
        {pick.monogram}
      </span>
    );
  }
  if (pick.logo === "aws") return <AwsMark className="dt-ic nw-logo nw-aws" />;
  if (pick.logo === "azure") {
    return <AzureMark className="dt-ic nw-logo nw-azure" idSuffix={mark} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a 28px logo file, drawn as the mock draws it
    <img
      className="dt-ic nw-logo"
      src={LOGO_FILES[pick.logo]}
      alt=""
      width={28}
      height={28}
      loading="lazy"
    />
  );
}

/**
 * A tile that is one link (the site system's `.dt*` rules, as `LinkTile` draws them): the icon, the title, the line
 * where there is one, then the day and who it is from; the forward arrow to a page here, or the arrow out and the
 * hidden "(opens in a new tab)" to another site.
 */
function NewsTile({
  href,
  icon,
  title,
  line,
  date,
  from,
}: {
  readonly href: string;
  readonly icon: ReactNode;
  readonly title: ReactNode;
  readonly line?: ReactNode;
  readonly date: string;
  readonly from: ReactNode;
}): React.JSX.Element {
  return (
    <article className="dt nw-t">
      <a className="dt-a" href={href} {...offSiteProps(href)}>
        {icon}
        <span>
          <span className="dt-t">{title}</span>
          {line ? <span className="dt-l">{line}</span> : null}
          <span className="nw-m">
            <time dateTime={date}>{newsShortDay(date)}</time> · {from}
          </span>
        </span>
        {isOffSite(href) ? (
          <ArrowOutGlyph className="dt-go" />
        ) : (
          <ArrowGlyph className="dt-go" weight={2.2} />
        )}
        <NewTabHint href={href} />
      </a>
    </article>
  );
}

/** The latest announcement (white) and the newsletter (dark), on the band. */
function Latest({ item }: { readonly item: NewsAnnouncement }): React.JSX.Element {
  const { newsletter } = latest;
  return (
    <section className="sec sec-band" id={latest.id} aria-label={latest.label}>
      <div className="wrap">
        <div className="as-grid">
          <Reveal className="as-card as-mini nw-fc" order={0}>
            <span className="nw-flag">{latest.flag}</span>
            <TagMark tag={item.tag} className="nw-own nw-own-l" />
            <p className="nw-meta">
              <time dateTime={item.date}>{newsDay(item.date)}</time> · {named(item.tag)}
            </p>
            <h2 className="as-h">{named(item.title)}</h2>
            <p>{named(item.line)}</p>
            <a className="btn-ink" href={item.href}>
              {named(item.cta)} <ArrowGlyph weight={2.2} />
            </a>
          </Reveal>
          <Reveal className="as-cal" order={1}>
            <MediumMark className="nw-own" />
            <h2 className="as-h">{named(newsletter.title)}</h2>
            <p>{named(newsletter.line)}</p>
            <a
              className="cta-go"
              href={newsletter.subscribe.href}
              {...offSiteProps(newsletter.subscribe.href)}
            >
              <span>
                {newsletter.subscribe.label}
                <NewTabHint href={newsletter.subscribe.href} />
              </span>
              <ExternalArrow />
            </a>
            <p className="cta-fine">
              {newsletter.alt.before}
              <a href={newsletter.alt.href} {...offSiteProps(newsletter.alt.href)}>
                {newsletter.alt.label}
                <NewTabHint href={newsletter.alt.href} />
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** From Zoorik: the announcements after the latest, each a page of this site. None, no section. */
function FromZoorik({
  items,
}: {
  readonly items: readonly NewsAnnouncement[];
}): React.JSX.Element | null {
  if (items.length === 0) return null;
  return (
    <section className="sec nw-sec" id={zoorik.id} aria-labelledby={`${zoorik.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${zoorik.id}-h`}>{named(zoorik.title)}</h2>
        </div>
        <div className="dt-grid">
          {items.map((item) => (
            <NewsTile
              key={item.href}
              href={item.href}
              icon={<TagMark tag={item.tag} className="dt-ic nw-logo" />}
              title={named(item.title)}
              line={named(item.line)}
              date={item.date}
              from={named(item.tag)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* The trademark lines the announcements carry, each once: the page's last words, small. */
const trademarks = [...new Set(newsFromZoorik.flatMap((item) => (item.legal ? [item.legal] : [])))];

/** Zoorik Radar: its week, the stream chips and each stream's tiles, then what it reads, then the trademark lines. */
function Radar(): React.JSX.Element {
  return (
    <section className="sec nw-sec" id={radar.id} aria-labelledby={`${radar.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${radar.id}-h`}>{named(radar.title)}</h2>
          <p>{radar.week(newsDay(newsRadar.week))}</p>
        </div>
        <RadarStreams
          label={radar.chips.label}
          all={radar.chips.all}
          streams={newsRadar.streams.map((stream) => ({
            id: stream.id,
            label: stream.label,
            body: (
              <div className="dt-grid">
                {stream.items.map((item, index) => (
                  <NewsTile
                    key={item.url}
                    href={item.url}
                    icon={<SourceMark item={item} mark={`nw-${stream.id}-${index}`} />}
                    title={item.title}
                    date={item.date}
                    from={item.source}
                  />
                ))}
              </div>
            ),
          }))}
        />
        <p className="nw-note">{radar.note(newsRadar.window)}</p>
        {trademarks.map((line) => (
          <p className="nw-tm" key={line}>
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}

export function NewsPage(): React.JSX.Element {
  const [first, ...rest] = newsFromZoorik as readonly [NewsAnnouncement, ...NewsAnnouncement[]];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <header className="hero doc-hero" id="top">
          <TurningMark />
          <div className="wrap hero-in">
            <h1>{named(hero.title)}</h1>
            <p className="doc-deck">{hero.deck}</p>
          </div>
        </header>
        <Latest item={first} />
        <FromZoorik items={rest} />
        <Radar />
      </main>
      <FooterSection />
    </>
  );
}
