import { statusPage, statusUpdated } from "@/content/status";
import { DocumentPage } from "@/features/documents/document-page";
import { richText } from "@/features/documents/rich-text";

/**
 * `/status`: the dark hero, then the overall line on its green band with the day it was last updated, then Coral and
 * Amoeba side by side (stacked on a phone), each listing its console and features with their state, and the line on
 * reporting a problem. The state is written as well as coloured. No closing assessment row: a reader here has come to
 * check something, not to buy. A server component: every word is fixed at build, and the page ships no script of its
 * own.
 */

const { hero, overall, state, products, help } = statusPage;

export function StatusPage(): React.JSX.Element {
  return (
    <DocumentPage
      hero={{ title: richText(hero.title), deck: richText(hero.deck) }}
      assessmentRow={false}
    >
      <div className="sec st-sec">
        <div className="wrap">
          <div className="st-col">
            <div className="st-all">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="12" fill="currentColor" />
                <path
                  d="m7 12.5 3.4 3.4L17 9"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2>{overall}</h2>
              <p className="doc-updated">{statusUpdated}</p>
            </div>
            <div className="st-products">
              {products.map((product) => (
                <section aria-labelledby={`${product.id}-h`} key={product.id}>
                  <header className="st-head">
                    <h2 id={`${product.id}-h`}>{richText(product.name)}</h2>
                    <p>{richText(product.kind)}</p>
                  </header>
                  <ul className="st-rows">
                    {product.rows.map((row) => (
                      <li key={row}>
                        <span>{row}</span>
                        <span className="st-state">{state}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <p className="st-help">{richText(help)}</p>
          </div>
        </div>
      </div>
    </DocumentPage>
  );
}
