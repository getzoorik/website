import { Fragment, type ReactNode } from "react";

/**
 * The names a page translator must leave alone. "Coral" would become a colour
 * and "Amoeba" a dictionary word; the legal mocks mark every one
 * `translate="no"`, in headings, lists and labels as much as in running text.
 * Matched whole and case-sensitively, so `zoorik.com` and `coral.zoorik.com`
 * are left as they are. Callers never pass inline code through it.
 */
const NAMES = /\b(Zoorik|Coral|Amoeba|zoorikctl)\b/;

/** A plain string, its product names kept out of translation. */
export function named(text: string): ReactNode {
  /* A capturing split: the names land at the odd indexes. */
  const parts = text.split(NAMES);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span translate="no" key={index}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
