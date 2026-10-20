import { PlatformMark } from "@/components/brand/platform-mark";
import { platformLabel, type Platform } from "@/content/products";

/**
 * A chip row: a muted label, then 28px capsules, as the home page's "Runs on"
 * rows and the product heroes draw it.
 *
 * ─── LIST MARKUP UNDER THE MOCK'S CLASSES ──────────────────────────────────
 * The mocks write `span.chips-g > span.chip`, which a screen reader runs
 * together into one string. This is the same row as a list labelled by its
 * label: `div.chips > span.chips-l[id] + ul.chips-g[role=list][aria-labelledby]
 * > li.chip`, so it is heard as "Runs on, list, 2 items". The classes are the
 * mock's, so every rule in the site system applies unchanged; Tailwind's
 * preflight already zeroes the list's margin, padding and markers, and measured
 * against the mock with that base layer every chip box is identical at 1440,
 * 390 and 320.
 *
 * 🔴 `role="list"` STAYS EXPLICIT. Safari drops a list's semantics once
 * `list-style:none` takes its markers away; the role puts them back.
 *
 * 🔴 `id` IS THE CALLER'S, AND UNIQUE ON ITS PAGE. Two rows on one page (home
 * has Coral's and Amoeba's) each name their own label. It also suffixes the
 * Azure mark's gradient ids, which must be unique in the document too.
 */

/** A chip: a platform, drawn with its mark, or a plain word. */
export type ChipItem = Platform | { readonly text: string };

export interface ChipsProps {
  /** The label's id, unique on the page; the list is labelled by it. */
  readonly id: string;
  readonly label: string;
  readonly items: readonly ChipItem[];
}

export function Chips({ id, label, items }: ChipsProps): React.JSX.Element {
  return (
    <div className="chips">
      <span className="chips-l" id={id}>
        {label}
      </span>
      <ul className="chips-g" role="list" aria-labelledby={id}>
        {items.map((item) =>
          typeof item === "string" ? (
            <li className="chip" key={item}>
              <PlatformMark platform={item} idSuffix={`${id}-${item}`} />
              {platformLabel[item]}
            </li>
          ) : (
            <li className="chip" key={item.text}>
              {item.text}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
