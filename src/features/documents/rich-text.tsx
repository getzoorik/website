import { Fragment, type ReactNode } from "react";

import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * One run of a page's text in the small markup its draft is written in, set as the mocks' `inline()` sets it
 * (documents-mocks.py, which the 30 Oct 2026 pages are built with): `code` as it is, [text](href) (off-site in a new
 * tab, with the arrow and the hint; a page of the site or a mailto in place), **bold**, an address at zoorik.com as a
 * mailto link, curly apostrophes and quotes, the names kept out of translation, and a figure kept with its unit
 * ("24&nbsp;hours"). A link to an address whose text is the address itself is the address alone, as the drafts write
 * it and the mocks print it.
 *
 * /trust, /contact, /pricing and the two calculators draw their copy with it. Unlike `OsText`, inline code is not
 * broken at its dots and slashes: these mocks print it whole.
 */

const PIECE = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;
const EMAIL = /\b([a-z]+@zoorik\.com)\b/;
const BOLD = /\*\*(.+?)\*\*/;
const NAMES = /(?<![\w/.@#-])(Zoorik|Coral|Amoeba|zoorikctl)(?![\w@.-]*\.(?:com|py))\b/;
const UNIT = /(\d) (days|hours|minutes|seconds|MiB|GiB|AM|PM|CPUs|h)(?![\w-])/g;

/** The mocks' `curly()`: a quote that opens a run is “, every other ”; an apostrophe is ’. */
function curly(text: string): string {
  return text
    .replace(/(^|[\s([ ])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/'/g, "’");
}

/** A name kept out of translation, and every figure kept with its unit. */
function names(text: string): ReactNode[] {
  return text
    .replace(UNIT, "$1 $2")
    .split(NAMES)
    .map((part, index) =>
      index % 2 === 1 ? (
        <span translate="no" key={index}>
          {part}
        </span>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}

/** An address at zoorik.com as its mailto link; the rest as `names`. */
function mail(text: string): ReactNode[] {
  return text.split(EMAIL).map((part, index) =>
    index % 2 === 1 ? (
      <a href={`mailto:${part}`} key={index}>
        {part}
      </a>
    ) : (
      <Fragment key={index}>{names(part)}</Fragment>
    ),
  );
}

/** Plain text between the code and the links: quotes, then the bold runs, then the addresses and names. */
function plain(text: string): ReactNode[] {
  return curly(text)
    .split(BOLD)
    .map((part, index) =>
      index % 2 === 1 ? (
        <b key={index}>{mail(part)}</b>
      ) : (
        <Fragment key={index}>{mail(part)}</Fragment>
      ),
    );
}

/** A link whose text is its own address is the address alone: `[a@zoorik.com](mailto:a@zoorik.com)`. */
const bareAddresses = (text: string): string =>
  text.replace(/\[([a-z]+@zoorik\.com)\]\(mailto:\1\)/g, "$1");

export function richText(text: string): ReactNode {
  const parts = bareAddresses(text).split(PIECE);
  return parts.map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part ? plain(part) : null}</Fragment>;
    if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const [, label, href] = LINK.exec(part) as unknown as [string, string, string];
    return (
      <a href={href} key={index} {...offSiteProps(href)}>
        {richText(label)}
        {isOffSite(href) ? (
          <>
            <ExternalArrow />
            <NewTabHint href={href} />
          </>
        ) : null}
      </a>
    );
  });
}

export function RichText({ text }: { readonly text: string }): React.JSX.Element {
  return <>{richText(text)}</>;
}

/** A heading's text for the contents rail and the ids, as the mocks' `plain()`: no markup, curly quotes. */
export const plainText = (text: string): string => curly(text.replace(/[`*]/g, ""));
