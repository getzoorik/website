import type { ReactNode } from "react";

import type { LearnSubject } from "@/content/learn";
import { named } from "@/features/legal/named";

/**
 * A Learn card's inside (the mock's `cover()`, `card()`, `vs_card()` and `alt_card()`): the navy cover, drawn with
 * its subject's motif and tagged with its subject, or a comparison's two sides; then the title, the line and the
 * card's foot (its date). /learn's cards and /compare's comparison cards draw it; the link
 * around it is the page's (`FindableCard` on /learn). Server components.
 */

/**
 * The subject's motif, drawn as the mock draws it for the card's place `k` (each grid counts from its own start):
 * the bill's line for Cloud cost, twelve machines with three in use for Kubernetes, three disks part full for Block
 * storage. The figures are the mock's sums, in the same floating point, so each bar ends where the mock's does.
 */
export function CoverArt({
  subject,
  k,
}: {
  readonly subject: LearnSubject;
  readonly k: number;
}): React.JSX.Element {
  if (subject === "cloud") {
    const points = [
      [0, 30 + ((k * 7) % 12)],
      [25, 26 + ((k * 5) % 10)],
      [50, 44],
      [75, 58 + ((k * 3) % 8)],
      [100, 70],
    ]
      .map(([x, y]) => `${Math.trunc(x! * 2.4)},${y}`)
      .join(" ");
    return (
      <svg className="lv-art" viewBox="0 0 240 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points} fill="none" stroke="#5FE3B5" strokeWidth={2.5} />
        <polyline points={`${points} 240,100 0,100`} fill="rgba(95,227,181,.12)" stroke="none" />
      </svg>
    );
  }
  if (subject === "k8s") {
    const on = new Set([(k + 2) % 12, (k + 5) % 12, (k + 9) % 12]);
    return (
      <div className="lv-art lv-grid" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i className={on.has(i) ? "on" : ""} key={i} />
        ))}
      </div>
    );
  }
  const used = [0.38, 0.62, 0.24, 0.5][k % 4]!;
  return (
    <div className="lv-art lv-disks" aria-hidden="true">
      {[0, 0.14, -0.08].map((d) => (
        <span key={d}>
          <i style={{ width: `${Math.trunc(100 * Math.min(0.92, used + d))}%` }} />
        </span>
      ))}
    </div>
  );
}

/** A card's inside: its cover (the motif or the two sides, then the subject's tag), then its body. */
export function CardBody({
  subject,
  tag,
  k,
  versus,
  vs,
  title,
  line,
  foot,
}: {
  readonly subject: LearnSubject;
  /** The subject's name, the tag on the cover. */
  readonly tag: string;
  /** The card's place in its grid, which picks the motif's variant. */
  readonly k: number;
  /** A comparison's two sides, drawn in place of the motif. */
  readonly versus?: readonly [string, string];
  /** The word between the two sides. */
  readonly vs: string;
  readonly title: string;
  readonly line: string;
  readonly foot: ReactNode;
}): React.JSX.Element {
  return (
    <>
      {versus ? (
        <span className={`lv-cover lv-c-${subject} lv-vs`}>
          <b>{named(versus[0])}</b>
          <i>{vs}</i>
          <b>{named(versus[1])}</b>
          <span className="lv-tag">{tag}</span>
        </span>
      ) : (
        <span className={`lv-cover lv-c-${subject}`}>
          <CoverArt subject={subject} k={k} />
          <span className="lv-tag">{tag}</span>
        </span>
      )}
      <span className="lv-cb">
        <b>{named(title)}</b>
        <small>{named(line)}</small>
        {foot}
      </span>
    </>
  );
}
