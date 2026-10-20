"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { MarketCloud, ToolKind } from "@/content/learn-market";

/**
 * Cloud cost optimization tools' filter (the mock's `<script id="learn-v2-mk">`): the kind and cloud chips pick the
 * tiles. One state for the section, held here and read by the small islands that draw what it changes; every tile is
 * drawn on the server (`children`), and these draw only the element around it, so they can hide it. Nothing is stored
 * (the privacy policy: the site's code uses no browser storage): a reload starts on All and All clouds. With scripting
 * off every tile shows, and the chips stay as drawn.
 *
 * ─── WHAT THE CHIPS DO, AS THE MOCK'S SCRIPT ────────────────────────────────
 * A tile shows when the chosen kind is its own (or All) and the chosen cloud is one of its clouds (or All clouds). A
 * kind's group hides when none of its tiles shows. The chips press themselves (`aria-pressed`). "No tool matches."
 * shows when the chips leave no tile, and its button clears both.
 */

/** What a tile is filed under: its kind and the clouds it names. */
export interface Filed {
  readonly kind: ToolKind;
  readonly clouds: readonly MarketCloud[];
}

interface Picked {
  /** "" is All, as the mock's `data-tk=""`. */
  readonly kind: ToolKind | "";
  /** "" is All clouds, as the mock's `data-tc=""`. */
  readonly cloud: MarketCloud | "";
}

interface FilterValue {
  readonly picked: Picked;
  readonly pick: (next: Partial<Picked>) => void;
  readonly shows: (tile: Filed) => boolean;
}

const FilterContext = createContext<FilterValue | null>(null);

function useFilter(): FilterValue {
  const value = useContext(FilterContext);
  if (!value) throw new Error("A tools filter island is drawn outside <ToolsFilter>.");
  return value;
}

const ALL: Picked = { kind: "", cloud: "" };

/** The section's filter state, around the chips, the groups and the empty line. */
export function ToolsFilter({ children }: { readonly children: ReactNode }): React.JSX.Element {
  const [picked, setPicked] = useState<Picked>(ALL);
  const value: FilterValue = {
    picked,
    pick: (next) => setPicked((current) => ({ ...current, ...next })),
    shows: (tile) =>
      (!picked.kind || tile.kind === picked.kind) &&
      (!picked.cloud || tile.clouds.includes(picked.cloud)),
  };
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

/** The two rows of chips (`.tl-f`): the kinds, then the clouds; one pressed in each. */
export function ToolChips({
  kinds,
  clouds,
}: {
  readonly kinds: {
    readonly label: string;
    readonly all: string;
    readonly each: readonly { readonly kind: ToolKind; readonly label: string }[];
  };
  readonly clouds: {
    readonly label: string;
    readonly all: string;
    readonly each: readonly MarketCloud[];
  };
}): React.JSX.Element {
  const { picked, pick } = useFilter();
  return (
    <div className="tl-f">
      <div className="lv-chips" role="group" aria-label={kinds.label}>
        {[{ kind: "" as const, label: kinds.all }, ...kinds.each].map((entry) => (
          <button
            type="button"
            data-tk={entry.kind}
            aria-pressed={picked.kind === entry.kind}
            onClick={() => pick({ kind: entry.kind })}
            key={entry.kind}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="lv-chips" role="group" aria-label={clouds.label}>
        {[
          { cloud: "" as const, label: clouds.all },
          ...clouds.each.map((cloud) => ({ cloud, label: cloud })),
        ].map((entry) => (
          <button
            type="button"
            data-tc={entry.cloud.toLowerCase()}
            aria-pressed={picked.cloud === entry.cloud}
            onClick={() => pick({ cloud: entry.cloud })}
            key={entry.cloud}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A kind's group (`.tl-g`): its name and its tiles, hidden when none of them shows. */
export function ToolGroup({
  kind,
  tiles,
  children,
}: {
  readonly kind: ToolKind;
  readonly tiles: readonly Filed[];
  readonly children: ReactNode;
}): React.JSX.Element {
  const { shows } = useFilter();
  return (
    <div className="tl-g" data-k={kind} hidden={!tiles.some(shows)}>
      {children}
    </div>
  );
}

/** A tool's tile (`article.dt.tl`), hidden when the chips leave it out. */
export function ToolTile({
  tile,
  children,
}: {
  readonly tile: Filed;
  readonly children: ReactNode;
}): React.JSX.Element {
  const { shows } = useFilter();
  return (
    <article
      className="dt tl"
      data-k={tile.kind}
      data-c={tile.clouds.map((cloud) => cloud.toLowerCase()).join(" ")}
      hidden={!shows(tile)}
    >
      {children}
    </article>
  );
}

/** "No tool matches.", shown when the chips leave no tile, with the button that clears them. */
export function NoTool({
  tiles,
  line,
  reset,
}: {
  readonly tiles: readonly Filed[];
  readonly line: string;
  readonly reset: string;
}): React.JSX.Element {
  const { shows, pick } = useFilter();
  return (
    <p className="tl-none" hidden={tiles.some(shows)}>
      {line}
      <button type="button" className="lv-reset" onClick={() => pick(ALL)}>
        {reset}
      </button>
    </p>
  );
}
