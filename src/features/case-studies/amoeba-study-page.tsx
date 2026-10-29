import type { ReactNode } from "react";

import { amoebaStudy, type AmoebaStudySectionId } from "@/content/case-studies";
import {
  Bars,
  CardRow,
  DiskCard,
  ShareRing,
  Step,
  Steps,
  StudyBand,
  StudyFrame,
  StudyTable,
  Swap,
  Text,
  Three,
} from "@/features/case-studies/case-study-parts";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";

/**
 * `/value-lab/amoeba-lab-vms`: Amoeba on our own Azure lab VMs, the second Value Lab study, drawn with the Coral
 * study's parts in GiB (`case-study-parts.tsx`):
 *
 *   the hero        the kicker, the headline with its green line, the opening; no download (there is no PDF)
 *   the result band the date and "Published by Zoorik", the four figures in one line, what Amoeba is
 *   the frame       the six numbered sections, each name beside its text
 *   the closing row for Amoeba
 *
 * The drawings: the two VMs and their disks as cards (one square per 8 GiB, a run per disk), the move onto a pool as
 * a swap, the shrink's three disks, what the test app felt as bars in milliseconds (the slowest write at each row's
 * end), what we checked as a table, the pool before and after on one scale, the table and the share removed.
 *
 * A server component: the page is prerendered whole. Its only script is the chips' (on a phone).
 */
export function AmoebaStudyPage(): React.JSX.Element {
  const a = amoebaStudy;
  const { felt, checked } = a.through;
  const bodies: Record<AmoebaStudySectionId, ReactNode> = {
    "the-starting-point": (
      <>
        <p>{named(a.start.text)}</p>
        <CardRow className="cs-mrow is-2" label={a.start.label}>
          {a.start.vms.map((vm) => (
            <DiskCard card={vm} key={vm.name} />
          ))}
        </CardRow>
        <p className="cs-sum">
          <span>{a.start.when}</span>
          <b>{a.start.total}</b>
        </p>
      </>
    ),
    "connecting-amoeba": (
      <>
        {a.connect.text.map((line) => (
          <p key={line}>{named(line)}</p>
        ))}
        <Three cards={a.connect.features} />
      </>
    ),
    "what-amoeba-did": (
      <>
        <Step step={a.did.move}>
          <Swap
            label={a.did.swap.label}
            before={<DiskCard card={a.did.swap.before} />}
            after={<DiskCard card={a.did.swap.after} />}
          />
        </Step>
        <Step step={a.did.shrink}>
          <CardRow label={a.did.shrinkDisks.label}>
            {a.did.shrinkDisks.disks.map((disk) => (
              <DiskCard card={disk} key={disk.badge} />
            ))}
          </CardRow>
        </Step>
      </>
    ),
    "how-the-apps-and-data-came-through": (
      <>
        <p>{named(a.through.text)}</p>
        <Bars
          caption={felt.caption}
          unit={felt.unit}
          alt={felt.alt}
          className="cs-hb is-ms"
          rows={felt.stages.map((stage) => ({
            name: stage.name,
            value: stage.p99,
            label: `${stage.p99} ms`,
            after: `slowest ${stage.slowest.toLocaleString("en-US")} ms`,
          }))}
          up={felt.up}
        />
        <StudyTable
          caption={checked.caption}
          className="cs-tb is-wrap is-left"
          measure={checked.measure}
          columns={checked.columns}
          rows={checked.rows}
        />
        <div className="doc-call cs-means">
          <p>
            <Text text={a.through.means} />
          </p>
        </div>
      </>
    ),
    "how-they-stayed-safe": (
      <Three cards={a.safe.map((rule) => ({ icon: "safe" as const, ...rule }))} />
    ),
    "the-result": (
      <>
        <Steps {...a.result.pool} className="cs-wf is-3" />
        <div className="cs-two">
          <StudyTable
            caption={a.result.table.caption}
            className="cs-tb is-fit"
            columns={a.result.table.columns}
            rows={a.result.table.rows}
            cap={a.result.table.cap}
          />
          <ShareRing ring={a.result.share} />
        </div>
      </>
    ),
  };

  return (
    <DocumentPage
      hero={{
        kicker: named(a.hero.kicker),
        title: (
          <>
            {named(a.hero.title)} <span className="cs-g">{a.hero.titleGreen}</span>
          </>
        ),
        deck: <Text text={a.hero.deck} />,
        className: "cs-hero",
      }}
      product="amoeba"
    >
      <StudyBand band={a.band} />
      <StudyFrame
        sections={a.sections.map((section) => ({
          id: section.id,
          title: named(section.title),
          chip: section.title,
          body: bodies[section.id],
        }))}
        foot={<p className="cs-fine">{named(a.fine)}</p>}
      />
    </DocumentPage>
  );
}
