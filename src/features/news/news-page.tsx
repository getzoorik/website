import { TurningMark } from "@/components/brand/turning-mark";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { newsFromZoorik, newsPage, newsRadar, type NewsAnnouncement } from "@/content/news";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import { newsDay } from "@/features/news/news-facts";
import { NewsRadar } from "@/features/news/news-radar";
import { offSiteProps } from "@/lib/links";

/**
 * `/news`, Zoorik News, drawn on /learn's frame: the utility hero with the page's name, its deck and the links to
 * each part; From Zoorik, the newest announcement on the navy panel and the others beside it; Zoorik Radar on the
 * band, the week's head and its three streams; then the newsletter row. No closing assessment row: the mock draws
 * none, so the page ends on the newsletter and the footer.
 *
 * Drawn on the server, with no island: the mock has no script. Its one motion, the radar's sweep, is the sheet's
 * (news.css), as is the hero's turning mark (the site system); reduced motion stills both.
 */

/** An announcement's tag and day (`.nz-meta`). */
function Meta({ item }: { readonly item: NewsAnnouncement }): React.JSX.Element {
  return (
    <p className="nz-meta">
      <span className="nz-tag">{named(item.tag)}</span>
      <time dateTime={item.date}>{newsDay(item.date)}</time>
    </p>
  );
}

/**
 * From Zoorik: the newest announcement on the navy panel with its button, the others in a
 * column beside it with a plain link. Each link is a page of this site. The link's words are one span, so a product's
 * name kept out of translation (`named()`) never splits them into flex items of their own.
 */
function FromZoorik(): React.JSX.Element {
  const [first, ...rest] = newsFromZoorik as [NewsAnnouncement, ...NewsAnnouncement[]];
  return (
    <div className="nz-grid">
      <article className="nz-feat">
        <Meta item={first} />
        <h3>{named(first.title)}</h3>
        <p className="nz-line">{named(first.line)}</p>
        <a className="nz-cta" href={first.href}>
          <span>{named(first.cta)}</span> <Arrow />
        </a>
      </article>
      <div className="nz-side">
        {rest.map((item) => (
          <article className="nz-card" key={item.href}>
            <Meta item={item} />
            <h3>{named(item.title)}</h3>
            <p className="nz-line">{named(item.line)}</p>
            <a className="nz-link" href={item.href}>
              <span>{named(item.cta)}</span> <Arrow />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

/** An off-site link of the newsletter row: its words, the arrow, and what a screen reader hears. */
function Out({
  className,
  link,
}: {
  readonly className?: string;
  readonly link: { readonly label: string; readonly href: string };
}): React.JSX.Element {
  return (
    <a className={className} href={link.href} {...offSiteProps(link.href)}>
      {link.label} <ExternalArrow />
      <NewTabHint href={link.href} />
    </a>
  );
}

/**
 * The closing row: the navy panel, "Get Zoorik News by email" with the link to subscribe on
 * Medium and Substack beside it, then where else we post. Links only: no form, no third-party script.
 */
function Newsletter(): React.JSX.Element {
  const { newsletter } = newsPage;
  return (
    <div className="nw-sub">
      <div className="nw-subc">
        <p className="nr-eyebrow">{newsletter.eyebrow}</p>
        <h2>{named(newsletter.title)}</h2>
        <p>{named(newsletter.lede)}</p>
        <div className="nw-subacts">
          <Out className="nz-cta" link={newsletter.subscribe} />
          <Out className="nw-alt" link={newsletter.alt} />
        </div>
      </div>
      <div className="nw-fl">
        <p>{newsletter.follow}</p>
        {newsletter.links.map((link) => (
          <Out link={link} key={link.label} />
        ))}
      </div>
    </div>
  );
}

export function NewsPage(): React.JSX.Element {
  const { hero, jump, zoorik, radar } = newsPage;
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
            {/* The links' words as one run of text each, as the mock writes them: split at the brand's name
                (`named()`), a pill's measured width moves by a fraction of a pixel, and the pills after it with it. */}
            <nav className="nw-jump" aria-label={jump}>
              <a href={`#${zoorik.id}`}>{zoorik.title}</a>
              {newsRadar.streams.map((stream) => (
                <a href={`#${radar.id}-${stream.id}`} key={stream.id}>
                  {stream.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className="sec nw-sec" id={zoorik.id} aria-labelledby={`${zoorik.id}-h`}>
          <div className="wrap">
            <div className="nw-h">
              <h2 id={`${zoorik.id}-h`}>{named(zoorik.title)}</h2>
              <p>{zoorik.lede}</p>
            </div>
            <FromZoorik />
          </div>
        </section>

        <section className="sec sec-band nw-sec" id={radar.id} aria-labelledby={`${radar.id}-h`}>
          <div className="wrap">
            <NewsRadar />
          </div>
        </section>

        <section className="sec nw-sec">
          <div className="wrap">
            <Newsletter />
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
