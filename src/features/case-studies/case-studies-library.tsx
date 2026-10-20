"use client";

import { useState, type ReactNode } from "react";

import type { ProductId } from "@/content/products";

/**
 * The library's grid and its product filter (the mock's `HUB_JS`): the one
 * client island on `/case-studies`.
 *
 * The filter is drawn only when the studies cover two products or more; with
 * one it is not in the page at all, and the grid is just the cards. A chip
 * presses itself and releases the others (`aria-pressed`), hides the cards of
 * every other product (`hidden`) and says how many are left in the live count.
 * "All" shows them all again. Nothing is stored: a reload starts on All.
 *
 * Each card's inside is drawn on the server (`children`); this draws only the
 * `<article>` around it, so it can hide it. "Your cluster next" (`next`) is
 * never filtered.
 */

export interface LibraryCard {
  readonly key: string;
  readonly product: ProductId;
  readonly children: ReactNode;
}

export interface CaseStudiesLibraryProps {
  /** The products the studies cover, in the site's order, each with its name. */
  readonly products: readonly { readonly id: ProductId; readonly name: string }[];
  readonly cards: readonly LibraryCard[];
  readonly next: ReactNode;
  readonly filter: {
    readonly label: string;
    readonly all: string;
    readonly one: string;
    readonly many: string;
  };
}

export function CaseStudiesLibrary({
  products,
  cards,
  next,
  filter,
}: CaseStudiesLibraryProps): React.JSX.Element {
  /* "" is All, as the mock's `data-p=""`. */
  const [chosen, setChosen] = useState<ProductId | "">("");
  const shows = (product: ProductId): boolean => chosen === "" || product === chosen;
  const count = cards.filter((card) => shows(card.product)).length;

  return (
    <>
      {products.length > 1 ? (
        <div className="cx-filter" role="group" aria-label={filter.label}>
          <button
            type="button"
            data-p=""
            aria-pressed={chosen === ""}
            onClick={() => setChosen("")}
          >
            {filter.all}
          </button>
          {products.map((product) => (
            <button
              type="button"
              data-p={product.id}
              aria-pressed={chosen === product.id}
              onClick={() => setChosen(product.id)}
              key={product.id}
            >
              <span translate="no">{product.name}</span>
            </button>
          ))}
          <span className="cx-count" aria-live="polite">
            {`${count} ${count === 1 ? filter.one : filter.many}`}
          </span>
        </div>
      ) : null}
      <div className="cx-grid">
        {cards.map((card) => (
          <article
            className="cx-card"
            data-p={card.product}
            hidden={!shows(card.product)}
            key={card.key}
          >
            {card.children}
          </article>
        ))}
        {next}
      </div>
    </>
  );
}
