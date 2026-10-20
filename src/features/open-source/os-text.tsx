import { Fragment, type ReactNode } from "react";

import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { codeBreaks } from "@/features/documents/prose";
import { named } from "@/features/legal/named";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * One run of the open-source pages' text, as the mocks' `inline()` sets it: `code` (with the docs' break points),
 * [text](href) (off-site in a new tab, with the arrow and the hint), **bold**, an address at zoorik.com as a mailto link,
 * the names kept out of translation, curly apostrophes and quotes, and a figure kept with its unit ("3&nbsp;working days"
 * stays as written: only days, hours, minutes and seconds, as `units()` does).
 */

const PIECE = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|\b[a-z]+@zoorik\.com\b)/;

/** The mocks' `curly()` and `units()` on plain text: ’ for an apostrophe, “…” for quotes, a figure kept with its unit. */
function typeset(text: string): string {
  return text
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/"([^"]*)"/g, "“$1”")
    .replace(/(\d) (days|hours|minutes|seconds|MiB|GiB|AM|PM|CPUs|h)(?![\w-])/g, "$1 $2");
}

function Plain({ text }: { readonly text: string }): ReactNode {
  return named(typeset(text));
}

export function OsText({ text }: { readonly text: string }): React.JSX.Element {
  const parts = text.split(PIECE);
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0)
          return <Fragment key={index}>{part ? <Plain text={part} /> : null}</Fragment>;
        if (part.startsWith("`")) return <code key={index}>{codeBreaks(part.slice(1, -1))}</code>;
        if (part.startsWith("**")) return <b key={index}>{named(part.slice(2, -2))}</b>;
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link as unknown as [string, string, string];
          return (
            <a href={href} key={index} {...offSiteProps(href)}>
              <OsText text={label} />
              {isOffSite(href) ? (
                <>
                  <ExternalArrow />
                  <NewTabHint href={href} />
                </>
              ) : null}
            </a>
          );
        }
        return (
          <a href={`mailto:${part}`} key={index}>
            {part}
          </a>
        );
      })}
    </>
  );
}
