import type { JSX } from "react";

import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { channels, installChannels, type ChannelId, type ChannelItem } from "@/config/open-source";
import { offSiteProps } from "@/lib/links";

/**
 * Where Zoorik is published, as buttons in the stores' style: a line icon in the muted colour, the name (a qualifier
 * after " · ", quieter) and the new-tab arrow. The footer's "Install from" row, /open-source's "Published on" strip
 * and /about's card all draw from here, so the three never drift. The site's own icons, not the channels' marks, as
 * with the stores. GitHub takes the social row's own mark.
 */
export function ChannelButtons({
  className,
  items,
  label,
}: {
  readonly className: string;
  readonly items: readonly ChannelItem[];
  /** A lead-in ("Install from", "Published on") where no heading says it. */
  readonly label?: string;
}): JSX.Element {
  return (
    <div className={`mkt-btns ${className}`}>
      {label ? <span className="mkt-on">{label}</span> : null}
      {items.map((item) => {
        const href = item.href ?? channels[item.id].href;
        return (
          <a className="mkt-b" key={item.id} href={href} {...offSiteProps(href)}>
            <ChannelIcon channel={item.id} />
            <span>
              {channels[item.id].name}
              {item.qualifier ? <span className="mkt-q"> · {item.qualifier}</span> : null}
            </span>
            <NewTabHint href={href} />
            <ExternalArrow />
          </a>
        );
      })}
    </div>
  );
}

/** The footer's "Install from" row: Homebrew, Scoop, PyPI, Artifact Hub and the Terraform Registry. */
export function InstallButtons({
  className,
  label,
}: {
  readonly className: string;
  readonly label?: string;
}): JSX.Element {
  return <ChannelButtons className={className} items={installChannels} label={label} />;
}

/**
 * Each channel's 24-unit line icon, verbatim from the mock: a mug for Homebrew, an ice-cream scoop for Scoop, a carton
 * for PyPI, a package for Artifact Hub, three layers for the Terraform Registry. The five fill the box alike, so none
 * reads lighter. GitHub is the social mark, filled.
 */
const LINE_PATHS: Record<Exclude<ChannelId, "github">, readonly string[]> = {
  homebrew: [
    "M4.5 8.5h11V18a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 18z",
    "M15.5 10.5h1.75a2.75 2.75 0 0 1 0 5.5H15.5",
    "M4.5 8.5c0-1.9 1.4-3.2 3.1-3.2.6-1.1 1.7-1.8 2.9-1.8 1.9 0 3.4 1.4 3.4 3.1.9.3 1.6 1 1.6 1.9",
    "M8.5 12v5M11.5 12v5",
  ],
  scoop: [
    "M2 12.25h13a6.5 8 0 0 1-13 0z",
    "M3.9 12.25a4.6 6 0 0 1 9.2 0",
    "M6.4 9.2a2.4 2.4 0 0 1 2.1-1.5",
    "M15 12.25l2.3-2.95M17.3 9.3l2.6-3.4a1.75 1.75 0 0 1 2.8 2.1l-2.6 3.4a1.75 1.75 0 0 1-2.8-2.1z",
  ],
  pypi: [
    "M4 9h16v9.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z",
    "M4 9l2.1-4.1a1.5 1.5 0 0 1 1.3-.9h9.2a1.5 1.5 0 0 1 1.3.9L20 9",
    "M12 4v5M7.5 16h3.5",
  ],
  "artifact-hub": ["M12 3.2 4.2 7.1v9.8L12 20.8l7.8-3.9V7.1z", "M4.2 7.1 12 11l7.8-3.9M12 11v9.8"],
  "terraform-registry": [
    "M12 3.5 3.5 8 12 12.5 20.5 8z",
    "M3.5 12 12 16.5 20.5 12",
    "M3.5 16 12 20.5 20.5 16",
  ],
};

const GITHUB_PATH =
  "M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z";

function ChannelIcon({ channel }: { readonly channel: ChannelId }): JSX.Element {
  if (channel === "github") {
    return (
      <svg className="mkt-mk mkt-ln" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={GITHUB_PATH} />
      </svg>
    );
  }
  return (
    <svg
      className="mkt-mk mkt-ln"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {LINE_PATHS[channel].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
