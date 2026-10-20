import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NamedText } from "@/components/primitives/named-text";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { Reveal } from "@/components/primitives/reveal";
import { site } from "@/config/site";
import { communityPage, type Community, type CommunityLogo } from "@/content/community";
import { products } from "@/content/products";
import { MediumMark, RedditMark } from "@/features/community/community-marks";
import { ArrowOutGlyph } from "@/features/documents/document-glyphs";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { LearnFrame, sectionClass } from "@/features/learn/learn-parts";
import { offSiteProps } from "@/lib/links";

/**
 * `/community`, Zoorik Community, on Learn's frame:
 *
 *   hero          the page's name, with no deck
 *   ours          r/zoorik on the white card and Zoorik News on Medium on the navy one, the closing row's pair (band)
 *   communities   FinOps and cloud cost communities: four groups of three tiles, each with its own logo and its own page
 *                 in a new tab, then the day they were checked and an address to suggest one
 *   more          More from Zoorik: /events and /design-partners
 *   closing row   the site's assessment row, as every Learn page ends
 *
 * Drawn on the server; the pair rises as it arrives, as the closing row's does on home.
 */

const { hero, ours, communities, more } = communityPage;

/** The names a page translator must leave alone in this page's lines. */
const NAMES = [site.name, products.coral.name, products.amoeba.name];

/** Where each logo file lives; the other marks are drawn in the page. */
const LOGO_FILES: Partial<Record<CommunityLogo, string>> = {
  "finops-foundation": "/community-logos/finops-foundation.svg",
  karpenter: "/community-logos/karpenter.svg",
  opencost: "/community-logos/opencost.svg",
};

/** A community's logo in the tile's icon slot (`dt-ic`), 28px. */
function Logo({
  logo,
  mark,
}: {
  readonly logo: CommunityLogo;
  /** Unique on the page: the Azure mark's gradients are named by it. */
  readonly mark: string;
}): React.JSX.Element {
  const className = "dt-ic cm-logo";
  if (logo === "reddit") return <RedditMark className={className} />;
  if (logo === "azure") return <AzureMark className={className} idSuffix={mark} />;
  if (logo === "aws") return <AwsMark className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a 28px logo file, drawn as the mock draws it
    <img
      className={className}
      src={LOGO_FILES[logo]}
      alt=""
      width={28}
      height={28}
      loading="lazy"
    />
  );
}

/** Our own two: r/zoorik (white) and Zoorik News on Medium (navy), on the band. */
function Ours(): React.JSX.Element {
  const { reddit, news } = ours;
  return (
    <section className="sec sec-band" id={ours.id} aria-label={ours.label}>
      <div className="wrap">
        <div className="as-grid">
          <Reveal className="as-card as-mini" order={0}>
            <RedditMark className="cm-own" />
            <h2 className="as-h">{reddit.title}</h2>
            <p>
              <NamedText text={reddit.line} name={NAMES} />
            </p>
            <a className="btn-ink" href={reddit.join.href} {...offSiteProps(reddit.join.href)}>
              {reddit.join.label} <ArrowOutGlyph />
              <NewTabHint href={reddit.join.href} />
            </a>
          </Reveal>
          <Reveal className="as-cal" order={1}>
            <MediumMark className="cm-own" />
            <h2 className="as-h">
              <NamedText text={news.title} name={NAMES} />
            </h2>
            <p>
              <NamedText text={news.line} name={NAMES} />
            </p>
            <a className="cta-go" href={news.subscribe.href} {...offSiteProps(news.subscribe.href)}>
              <span>
                {news.subscribe.label}
                <NewTabHint href={news.subscribe.href} />
              </span>
              <ExternalArrow />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CommunityTile({
  community,
  mark,
}: {
  readonly community: Community;
  readonly mark: string;
}): React.JSX.Element {
  return (
    <LinkTile
      href={community.href}
      icon={<Logo logo={community.logo} mark={mark} />}
      title={community.name}
      line={community.what}
    />
  );
}

/** The communities: each group's plain grey name, then its tiles; then the day they were checked. */
function Communities(): React.JSX.Element {
  const { note } = communities;
  return (
    <section className={sectionClass()} id={communities.id} aria-labelledby={`${communities.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${communities.id}-h`}>{communities.title}</h2>
        </div>
        {communities.groups.map((group) => (
          <div className="cm-sub" key={group.name}>
            <h3 className="cm-sl">{group.name}</h3>
            <div className="dt-grid">
              {group.communities.map((community, index) => (
                <CommunityTile
                  community={community}
                  mark={`cm-${group.name.toLowerCase()}-${index}`}
                  key={community.href}
                />
              ))}
            </div>
          </div>
        ))}
        <p className="cm-note">
          {note.before}
          {communities.checked}
          {note.ask}
          <a href={`mailto:${note.email}`}>{note.email}</a>
          {note.end}
        </p>
      </div>
    </section>
  );
}

/** More from Zoorik: two pages of this site, as the Read more tiles. */
function More(): React.JSX.Element {
  return (
    <section className={sectionClass()} id={more.id} aria-labelledby={`${more.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${more.id}-h`}>{named(more.title)}</h2>
        </div>
        <div className="dt-grid dt-2x2">
          {more.tiles.map((tile) => (
            <LinkTile
              key={tile.href}
              href={tile.href}
              title={tile.title}
              line={<NamedText text={tile.line} name={NAMES} />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommunityPage(): React.JSX.Element {
  return (
    <LearnFrame hero={{ title: named(hero.title) }}>
      <Ours />
      <Communities />
      <More />
    </LearnFrame>
  );
}
