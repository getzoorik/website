import type { ReactNode } from "react";

import { NewTabHint } from "@/components/primitives/new-tab-hint";
import {
  marketActs,
  marketGroups,
  marketHead,
  type MarketActs,
  type MarketCloud,
  type MarketOurs,
  type MarketTool,
} from "@/content/learn-market";
import type { ProductId } from "@/content/products";
import { OutGlyph } from "@/features/learn/learn-parts";
import { named } from "@/features/legal/named";
import { offSiteProps } from "@/lib/links";

/**
 * A market list's pieces (on /compare's market map and the alternatives pages): the column heads, our product's navy
 * row, a tool's row, how it acts and its clouds. Every name and line is read from `learn-market.ts`; nothing here
 * spells one. Server components.
 */

/** A tool of the market by the name the market gives it; a name it does not hold fails the build. */
export function marketTool(name: string): MarketTool {
  for (const group of marketGroups) {
    const tool = group.tools.find((entry) => entry.name === name);
    if (tool) return tool;
  }
  throw new Error(`The market data holds no tool named "${name}".`);
}

/** Coral's or Amoeba's own row in its group; a product the market data does not place fails the build. */
export function marketOurs(product: ProductId): MarketOurs {
  const ours = marketGroups.find((group) => group.ours?.product === product)?.ours;
  if (!ours) throw new Error(`The market data has no row for ${product}.`);
  return ours;
}

/** How it acts, as a chip: `mk-acts mk-<key>` (the mock's class pair, `mk-acts mk-acts` for a tool that acts). */
export function ActsChip({ acts }: { readonly acts: MarketActs }): React.JSX.Element {
  const { key, label } = marketActs[acts];
  return <span className={`mk-acts mk-${key}`}>{label}</span>;
}

/** The clouds it names, Azure then AWS. */
export function Clouds({ clouds }: { readonly clouds: readonly MarketCloud[] }): React.JSX.Element {
  return (
    <>
      {clouds.map((cloud) => (
        <span className="mk-cl" key={cloud}>
          {cloud}
        </span>
      ))}
    </>
  );
}

/** The column heads over a list, for the eye only: each row's cells say what they are. */
export function MarketHead(): React.JSX.Element {
  return (
    <div className="mk-headrow" aria-hidden="true">
      {marketHead.map((head) => (
        <span key={head}>{head}</span>
      ))}
    </div>
  );
}

/** Coral or Amoeba, first and on navy, its name linking to its own page. */
export function OursRow({ ours }: { readonly ours: MarketOurs }): React.JSX.Element {
  return (
    <li className="mk-row mk-ours">
      <span className="mk-n">
        {/* One span around the name, so `named()`'s parts stay one item of this flex link. */}
        <a className="mk-l" href={ours.href}>
          <span>{named(ours.name)}</span>
        </a>
        <small>{named(ours.company)}</small>
      </span>
      <span className="mk-w">{named(ours.line)}</span>
      <span className="mk-a">
        <ActsChip acts={ours.acts} />
      </span>
      <span className="mk-c">
        <Clouds clouds={ours.clouds} />
      </span>
    </li>
  );
}

/**
 * A tool's row: its name linking to its own page in a new tab, its owner, its line, how it acts and its clouds, and
 * `after` the clouds (an alternatives page's link to a live versus page).
 */
export function ToolRow({
  tool,
  after,
}: {
  readonly tool: MarketTool;
  readonly after?: ReactNode;
}): React.JSX.Element {
  return (
    <li className="mk-row">
      <span className="mk-n">
        <a className="mk-l" href={tool.url} {...offSiteProps(tool.url)}>
          {tool.name}
          <OutGlyph />
          <NewTabHint href={tool.url} />
        </a>
        <small>{tool.company}</small>
      </span>
      <span className="mk-w">{tool.line}</span>
      <span className="mk-a">
        <ActsChip acts={tool.acts} />
      </span>
      <span className="mk-c">
        <Clouds clouds={tool.clouds} />
        {after}
      </span>
    </li>
  );
}
