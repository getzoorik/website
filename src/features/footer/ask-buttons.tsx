"use client";

import { usePathname } from "next/navigation";

import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { site } from "@/config/site";
import { askAssistants, askQuestion, footerAsk } from "@/content/footer";
import { AskMark } from "@/features/footer/footer-marks";
import { offSiteProps } from "@/lib/links";

/**
 * "Ask about Zoorik on" (owner, 23 Oct 2026): the Install from row's buttons, one per AI assistant, each opening it
 * with this page's own question typed in (`askQuestion`). The footer is a server component shared by every page, so
 * this one leaf reads the pathname, as `HomeAwareLink` does; the pathname is known at build, so every page prerenders
 * with its own question. `titles` is each page's printed title, by path, from the structured data.
 *
 * `usePathname` is null outside the app router (a unit test rendering the footer on its own), which reads as home.
 */
export function AskButtons({
  titles,
}: {
  readonly titles: Readonly<Record<string, string>>;
}): React.JSX.Element {
  const path = (usePathname() ?? "/").replace(/(.)\/$/, "$1");
  const question = askQuestion(path, titles[path]);
  return (
    <div className="mkt-btns foot-ask">
      <span className="mkt-on">
        {footerAsk.lead}
        <span translate="no">{site.name}</span>
        {footerAsk.tail}
      </span>
      {askAssistants.map((assistant) => {
        const href = assistant.base + encodeURIComponent(question);
        return (
          <a className="mkt-b" key={assistant.id} href={href} {...offSiteProps(href)}>
            <AskMark assistant={assistant.id} />
            <span>{assistant.name}</span>
            <NewTabHint href={href} />
            <ExternalArrow />
          </a>
        );
      })}
    </div>
  );
}
