import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ProductMark } from "@/components/brand/product-marks";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { contactEmail } from "@/config/site";
import {
  alternativesPages,
  cloudCostToolsPage,
  versusPages,
  versusRoute,
} from "@/content/learn-compare";
import {
  marketActs,
  marketChecked,
  shownGroups,
  type MarketActs,
  type MarketCloud,
  type ToolKind,
} from "@/content/learn-market";
import {
  NoTool,
  ToolChips,
  ToolGroup,
  ToolsFilter,
  ToolTile,
  type Filed,
} from "@/features/cloud-cost-tools/tools-filter";
import { ArrowGlyph, ArrowOutGlyph } from "@/features/documents/document-glyphs";
import { LinkTile } from "@/features/documents/link-tile";
import { LearnFrame, sectionClass } from "@/features/learn/learn-parts";
import { marketOurs, marketTool } from "@/features/learn/market-rows";
import { named } from "@/features/legal/named";
import { offSiteProps } from "@/lib/links";

/**
 * `/cloud-cost-optimization-tools`, Cloud cost optimization tools, on Learn's frame:
 *
 *   hero    the page's name and its line
 *   tools   Tools that reduce cloud cost: the kind and cloud chips, then each kind's name over its tiles (Coral and
 *           Amoeba first in theirs, with their marks; every other tool by name, with its initial in place of a logo),
 *           each with its short line, how it acts and its clouds; then the note with the day they were checked
 *   ours    Compare Coral and Amoeba, on the band: the live versus pages and the alternatives pages, two by two
 *   closing row
 *
 * Every name, line and fact is read from `learn-market.ts` and `learn-compare.ts`, so the page and the pages under
 * /compare never disagree; nothing here spells a competitor. Drawn on the server; the chips are the one client island
 * (`tools-filter.tsx`), and with scripting off every tile shows.
 */

const { hero, tools, ours } = cloudCostToolsPage;

/** How a tile says a tool acts: the mock's class for each way (`mk-auto` for a tool that acts on its own). */
const ACTS_CLASS: Readonly<Record<MarketActs, string>> = {
  "changes infrastructure": "mk-auto",
  recommends: "mk-rec",
  reports: "mk-rep",
  mixed: "mk-mix",
};

/** The clouds a tile can name and a chip can pick, in this order. */
const CLOUDS: readonly MarketCloud[] = ["Azure", "AWS"];

/** A tile's name: the tool's, without a long bracket after it (a short one, as "(VPA)", stays). */
const tileName = (name: string): string =>
  name.replace(/\s*\(([^)]*)\)\s*$/, (whole, inside: string) => (inside.length <= 5 ? whole : ""));

interface Tile extends Filed {
  readonly key: string;
  readonly name: string;
  readonly href: string;
  /** Its full checked line, the short line's title. */
  readonly line: string;
  readonly short: string;
  readonly acts: MarketActs;
  readonly googleCloud: boolean;
  /** Coral or Amoeba, drawn with its mark; any other tool with its initial. */
  readonly product?: "coral" | "amoeba";
}

/** Each kind's tiles: Coral or Amoeba first, then its tools in order, each read from the market data. */
const groups = shownGroups.map((group) => {
  const tiles: Tile[] = [];
  if (group.ours) {
    const own = marketOurs(group.ours.product);
    tiles.push({
      key: own.name,
      kind: group.kind,
      clouds: own.clouds,
      name: own.name,
      href: own.href,
      line: own.line,
      short: group.ours.short,
      acts: own.acts,
      googleCloud: false,
      product: group.ours.product,
    });
  }
  for (const shown of group.tools) {
    const tool = marketTool(shown.name);
    tiles.push({
      key: tool.name,
      kind: group.kind,
      clouds: tool.clouds,
      name: tileName(tool.name),
      href: tool.url,
      line: tool.line,
      short: shown.short,
      acts: tool.acts,
      googleCloud: shown.googleCloud,
    });
  }
  return { kind: group.kind, label: group.label, tiles };
});

const everyTile: readonly Tile[] = groups.flatMap((group) => group.tiles);

/** A tool's tile: its mark or initial, its name, its short line, how it acts and its clouds, then the arrow. */
function ToolTileBody({
  tile,
  index,
}: {
  readonly tile: Tile;
  readonly index: number;
}): React.JSX.Element {
  const { label } = marketActs[tile.acts];
  return (
    <a className="dt-a" href={tile.href} {...offSiteProps(tile.href)}>
      {tile.product ? (
        <ProductMark product={tile.product} className="tl-ours" />
      ) : (
        <span className="tl-mono" aria-hidden="true">
          {tile.name[0]}
        </span>
      )}
      <span>
        <span className="dt-t">{tile.product ? named(tile.name) : tile.name}</span>
        <span className="dt-l" title={tile.line}>
          {tile.product ? named(tile.short) : tile.short}
        </span>
        <span className="tl-meta">
          <span className={`mk-acts ${ACTS_CLASS[tile.acts]}`}>{label}</span>
          <span className="tl-cl">
            {CLOUDS.filter((cloud) => tile.clouds.includes(cloud)).map((cloud) =>
              cloud === "Azure" ? (
                <AzureMark idSuffix={`tl-${index}`} label={cloud} key={cloud} />
              ) : (
                <AwsMark className="aws" label={cloud} key={cloud} />
              ),
            )}
            {tile.googleCloud ? <small>{tools.googleCloud}</small> : null}
          </span>
        </span>
      </span>
      {tile.product ? (
        <ArrowGlyph className="dt-go" weight={2.2} />
      ) : (
        <ArrowOutGlyph className="dt-go" />
      )}
      <NewTabHint href={tile.href} />
    </a>
  );
}

/** Tools that reduce cloud cost: the chips, each kind's tiles, the empty line and the note. */
function Tools(): React.JSX.Element {
  const note = tools.note(marketChecked);
  const kinds: { kind: ToolKind; label: string }[] = groups.map(({ kind, label }) => ({
    kind,
    label,
  }));
  return (
    <section className={sectionClass()} id={tools.id} aria-labelledby={`${tools.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${tools.id}-h`}>{tools.title}</h2>
        </div>
        <div className="tl-wrap">
          <ToolsFilter>
            <ToolChips
              kinds={{ ...tools.kinds, each: kinds }}
              clouds={{ ...tools.clouds, each: CLOUDS }}
            />
            {groups.map((group) => (
              <ToolGroup kind={group.kind} tiles={group.tiles} key={group.kind}>
                <h3 className="cm-sl">{group.label}</h3>
                <div className="dt-grid">
                  {group.tiles.map((tile) => (
                    <ToolTile tile={tile} key={tile.key}>
                      <ToolTileBody tile={tile} index={everyTile.indexOf(tile)} />
                    </ToolTile>
                  ))}
                </div>
              </ToolGroup>
            ))}
            <NoTool tiles={everyTile} line={tools.none.line} reset={tools.none.reset} />
          </ToolsFilter>
          <p className="mk-note">
            {note.before}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            {note.after}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Compare Coral and Amoeba: the live versus pages, then the alternatives pages, as the Read more tiles. */
function Ours(): React.JSX.Element {
  return (
    <section className={sectionClass(true)} id={ours.id} aria-labelledby={`${ours.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${ours.id}-h`}>{named(ours.title)}</h2>
        </div>
        {/* `tl-2x2`: this page's two by two (cloud-cost-tools.css). */}
        <div className="dt-grid dt-2x2 tl-2x2">
          {versusPages.map((page) => (
            <LinkTile
              key={page.slug}
              href={versusRoute(page)}
              title={named(page.meta.title)}
              line={named(page.line)}
            />
          ))}
          {alternativesPages.map((page) => (
            <LinkTile
              key={page.route}
              href={page.route}
              title={named(page.h1)}
              line={named(page.line)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CloudCostTools(): React.JSX.Element {
  return (
    <LearnFrame hero={{ title: hero.title, deck: hero.deck }}>
      <Tools />
      <Ours />
    </LearnFrame>
  );
}
