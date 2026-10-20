"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { ProductId } from "@/content/products";
import { addressFor, productFromQuery } from "@/lib/product-choice";

export interface Assessment {
  /** The product the page is on: `?p=`, Coral by default, or the switch once the reader uses it. */
  readonly product: ProductId;
  /**
   * False on the server and in the render that hydrates; true from the render after. Until then the page draws each
   * product's words and lets the first-paint attribute on `<html>` pick (`first-paint.ts`).
   */
  readonly arrived: boolean;
  readonly chooseProduct: (product: ProductId) => void;
}

const AssessmentContext = createContext<Assessment | null>(null);

function subscribeToHistory(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

const subscribeToNothing = () => () => {};

/**
 * The page's one choice, shared by the hero's switch, the run line, What it does and After the run.
 *
 * ─── THE ADDRESS IS READ IN THE BROWSER, NEVER ON THE SERVER ───────────────
 * The route is one prerendered file (per-request rendering on the Worker once caused an outage). The query string
 * is read through `useSyncExternalStore`, whose server snapshot is empty: the page is prerendered on Coral, hydrates
 * as that, and re-renders with the real address straight after, in the same commit that drops the first-paint
 * copies, so nothing visibly changes.
 *
 * ─── THE SWITCH CHANGES THE PAGE IN PLACE, AND THE ADDRESS FOLLOWS ─────────
 * A new product rewrites the address with `replaceState` (never `pushState`: a choice is not a page to go Back to),
 * keeping any other parameter, so a copied link reopens the same product. An older link's `?c=` (the cloud tabs are
 * gone) still opens the page, and the address drops it on arrival. Nothing is stored.
 */
export function AssessmentProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const query = useSyncExternalStore(
    subscribeToHistory,
    () => window.location.search,
    () => "",
  );
  const arrived = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const [own, setOwn] = useState<ProductId | null>(null);
  const product = own ?? productFromQuery(query);

  /* `html[data-ap]` stays the product the page is on after the first paint too, so the header, which sits outside
     this provider, marks that product's row in its Assessment menu and drawer (site-nav.tsx). */
  useEffect(() => {
    if (arrived) document.documentElement.setAttribute("data-ap", product);
  }, [arrived, product]);

  useEffect(() => {
    const { pathname, search, hash } = window.location;
    if (new URLSearchParams(search).has("c")) {
      window.history.replaceState(
        null,
        "",
        addressFor(productFromQuery(search), pathname, search, hash),
      );
    }
  }, []);

  const value = useMemo<Assessment>(
    () => ({
      product,
      arrived,
      chooseProduct: (next) => {
        if (next === product) return;
        setOwn(next);
        const { pathname, search, hash } = window.location;
        window.history.replaceState(null, "", addressFor(next, pathname, search, hash));
      },
    }),
    [product, arrived],
  );

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment(): Assessment {
  const assessment = useContext(AssessmentContext);
  if (!assessment) throw new Error("useAssessment needs an <AssessmentProvider> above it");
  return assessment;
}
