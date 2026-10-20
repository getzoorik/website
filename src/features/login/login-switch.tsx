"use client";

import { useSyncExternalStore, type MouseEvent } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { routes } from "@/config/site";
import { assessmentHref } from "@/content/assess";
import { loginCopy } from "@/content/login";
import { productOrder, products, type ProductId } from "@/content/products";
import { addressFor, isProduct } from "@/lib/product-choice";

/* The page's product is `html[data-ap]`: the first-paint script sets it from `?p=` before paint, and the switch
   moves it. The sheet places the thumb and shows the one card from it, so this island only names the current link
   and points the estimate at the same product. Coral on the server, so the prerender and its hydration agree. */
function watchProduct(onChange: () => void): () => void {
  const watcher = new MutationObserver(onChange);
  watcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ap"] });
  return () => watcher.disconnect();
}

function readProduct(): ProductId {
  const ap = document.documentElement.getAttribute("data-ap");
  return isProduct(ap) ? ap : "coral";
}

const productOnServer = (): ProductId => "coral";

const useLoginProduct = (): ProductId =>
  useSyncExternalStore(watchProduct, readProduct, productOnServer);

/**
 * The product switch: Coral | Amoeba, each with its mark and what it works on, a black thumb
 * under the chosen one. Each item is a real link (`/login?p=amoeba`), so it works without script and opens a new tab
 * on a modified click; an ordinary click changes the page in place, and the address follows with `replaceState` (a
 * choice is not a page to go Back to).
 */
export function LoginSwitch(): React.JSX.Element {
  const product = useLoginProduct();

  const choose = (event: MouseEvent<HTMLAnchorElement>, next: ProductId) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    if (next === product) return;
    document.documentElement.setAttribute("data-ap", next);
    const { pathname, search, hash } = window.location;
    window.history.replaceState(null, "", addressFor(next, pathname, search, hash));
  };

  return (
    <nav className="lg-switch" aria-label={loginCopy.switchLabel}>
      {productOrder.map((id) => (
        <a
          key={id}
          href={`${routes.login}?p=${id}`}
          data-p={id}
          aria-current={id === product ? "page" : undefined}
          onClick={(event) => choose(event, id)}
        >
          <ProductMark product={id} />
          <span translate="no">{products[id].name}</span>
          <small>{products[id].kind}</small>
        </a>
      ))}
    </nav>
  );
}

/** "estimate your saving", on the product the page is on. */
export function EstimateLink({ text }: { readonly text: string }): React.JSX.Element {
  return (
    <a className="lk" href={assessmentHref(useLoginProduct())}>
      {text}
    </a>
  );
}
