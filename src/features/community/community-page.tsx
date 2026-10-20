import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { communityPage } from "@/content/community";
import { events } from "@/content/events";
import { CommunityEvents } from "@/features/community/community-events";
import { upcoming } from "@/features/events/event-facts";
import { named } from "@/features/legal/named";
import { LearnFrame, LearnSection, sectionClass } from "@/features/learn/learn-parts";
import { offSiteProps } from "@/lib/links";

/**
 * `/community`, Zoorik Community, on Learn's frame:
 *
 *   hero                   the page's name and its deck
 *   r/zoorik               the navy panel: Join r/zoorik (a new tab), this week's Zoorik Radar on /news, and a drawing of
 *                          four threads beside them
 *   Zoorik everywhere      the eight places Zoorik posts, each with our handle there (band)
 *   Events                 the next three big events, with /events's rules, and the link to /events
 *   The wider community    six communities, each in a new tab (band)
 *   closing card           Want to shape what we build? A link to /design-partners
 *   closing row            the site's assessment row, as every Learn page ends
 *
 * Drawn on the server. One island: the events drop one that has ended in the reader's browser (`CommunityEvents`).
 * The mock has no motion but the links' hover; no figure but the design partners' places (`designPartnerPlaces`).
 */

const { hero, reddit, channels, wider, shape } = communityPage;

/** The r/zoorik panel's drawing: four threads, each its title bar and its shorter line, as widths in %. */
const THREADS = [
  [78, 52],
  [64, 40],
  [86, 58],
  [58, 34],
] as const;

/**
 * The events the page follows (`communityPage.events.names`, the event's name before its year) still to come on
 * `today`, with their days known, in /events's order. All of them go to the card, which shows the first few, so one
 * that ends in the reader's browser makes room for the next.
 */
export function communityEvents(today: string) {
  const { names } = communityPage.events;
  return upcoming(events, today).filter(
    (event) => event.startDate.length === 10 && names.includes(event.name.split(" 20")[0]!),
  );
}

/** An off-site link's arrow and what a screen reader hears, after its words. */
function Out({ href }: { readonly href: string }): React.JSX.Element {
  return (
    <>
      <ExternalArrow />
      <NewTabHint href={href} />
    </>
  );
}

function Reddit(): React.JSX.Element {
  const { join, radar } = reddit;
  return (
    <section className={sectionClass()} id={reddit.id} aria-labelledby={`${reddit.id}-h`}>
      <div className="wrap">
        <div className="cm-rd">
          <div className="cm-rdc">
            <p className="cm-k">{reddit.kicker}</p>
            <h2 id={`${reddit.id}-h`}>{reddit.title}</h2>
            <p>{named(reddit.line)}</p>
            <div className="cm-acts">
              <a className="cm-btn" href={join.href} {...offSiteProps(join.href)}>
                {join.label} <Out href={join.href} />
              </a>
              <a className="cm-btn2" href={radar.href}>
                {radar.label} <Arrow />
              </a>
            </div>
          </div>
          <div className="cm-feed" aria-hidden="true">
            {THREADS.map(([title, line], k) => (
              <span className="cm-th" key={k}>
                <i className="cm-up" />
                <span>
                  <b style={{ width: `${title}%` }} />
                  <em style={{ width: `${line}%` }} />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Zoorik everywhere: each place a card, its name and the arrow, then our handle there and what we post. The handle and
 * the line are set as the mock sets them, with no name kept from translation: `.cm-ch span` sizes every span in the
 * card, so a `named()` span inside would print smaller.
 */
function Channels(): React.JSX.Element {
  return (
    <LearnSection id={channels.id} title={named(channels.title)} lede={channels.lede} band>
      <div className="cm-ch">
        {channels.links.map((link) => (
          <a key={link.name} href={link.href} {...offSiteProps(link.href)}>
            <b>
              {link.name} <ExternalArrow />
            </b>
            <span>{link.handle}</span>
            <small>{link.what}</small>
            <NewTabHint href={link.href} />
          </a>
        ))}
      </div>
    </LearnSection>
  );
}

function Events({ buildDay }: { readonly buildDay: string }): React.JSX.Element {
  const { id, title, lede, count, all } = communityPage.events;
  return (
    <LearnSection id={id} title={title} lede={lede}>
      <CommunityEvents
        events={communityEvents(buildDay)}
        buildDay={buildDay}
        count={count}
        all={all}
      />
    </LearnSection>
  );
}

function Wider(): React.JSX.Element {
  return (
    <LearnSection id={wider.id} title={wider.title} lede={wider.lede} band>
      <div className="cm-list">
        {wider.links.map((link) => (
          <a className="cm-c" key={link.name} href={link.url} {...offSiteProps(link.url)}>
            <b>
              {link.name} <ExternalArrow />
            </b>
            <small>{link.line}</small>
            <NewTabHint href={link.url} />
          </a>
        ))}
      </div>
    </LearnSection>
  );
}

/** The closing card, one link to /design-partners. No id and no heading, as the mock draws it. */
function Shape(): React.JSX.Element {
  return (
    <section className={sectionClass()}>
      <div className="wrap">
        <a className="cm-shape" href={shape.href}>
          <span>
            <b>{shape.title}</b>
            <small>{named(shape.line)}</small>
          </span>
          <span className="fx-read">
            {shape.go} <Arrow />
          </span>
        </a>
      </div>
    </section>
  );
}

export function CommunityPage({
  buildDay,
}: {
  /** The build's day ("2026-10-19"), which trims the events. */
  readonly buildDay: string;
}): React.JSX.Element {
  return (
    <LearnFrame hero={{ title: named(hero.title), deck: named(hero.deck) }}>
      <Reddit />
      <Channels />
      <Events buildDay={buildDay} />
      <Wider />
      <Shape />
    </LearnFrame>
  );
}
