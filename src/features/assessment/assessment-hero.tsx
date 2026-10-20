"use client";

import { useEffect, useRef, useState } from "react";

import { ProductSwitch } from "@/components/primitives/product-switch";
import { clarityEvent, clarityEvents } from "@/components/analytics/clarity-events";
import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ProductMark } from "@/components/brand/product-marks";
import { assessmentHref } from "@/content/assess";
import {
  assessmentCopy,
  assessmentProducts,
  type HintPart,
  type HintRun,
} from "@/content/assessment";
import { CopyGlyph, TickGlyph } from "@/features/assessment/assessment-marks";
import type { ProductId } from "@/content/products";
import { useAssessment } from "@/features/assessment/assessment-provider";
import { PRODUCTS, bootAttr } from "@/features/assessment/first-paint";
import { useCopyCommand } from "@/hooks/use-copy-command";

const { run } = assessmentCopy;

/**
 * The hero's switch: the one place the product is set. An item is a real link (`/assessment?p=amoeba`), so it works
 * without script and opens a new tab on a modified click; an ordinary click switches the page in place.
 */
export function AssessmentSwitch(): React.JSX.Element {
  const { product, arrived, chooseProduct } = useAssessment();
  return (
    <ProductSwitch
      current={product}
      href={assessmentHref}
      onSelect={chooseProduct}
      attrs={bootAttr(arrived)}
    />
  );
}

/** One product's line to copy: its mark, a muted `$ `, the command, and its Copy button. */
function RunLine({
  product,
  onLive,
}: {
  readonly product: ProductId;
  readonly onLive: (text: string) => void;
}): React.JSX.Element {
  const { run: command, copy: label } = assessmentProducts[product];
  const pre = useRef<HTMLPreElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  /* A copy that worked names itself to Clarity (privacy policy §4.6: that a command was copied, not what); a
     blocked one is not counted, since nothing was copied. */
  const { state, copy } = useCopyCommand(command, pre, button, () =>
    clarityEvent(clarityEvents.commandCopied),
  );
  const done = state === "done";

  useEffect(() => {
    onLive(state === "done" ? run.copied : state === "blocked" ? run.blocked : "");
  }, [state, onLive]);

  return (
    <li data-p={product}>
      <span className="ax-pm" aria-hidden="true">
        <ProductMark product={product} />
      </span>
      <pre ref={pre} translate="no">
        <i aria-hidden="true">$ </i>
        {command}
      </pre>
      <button
        ref={button}
        className="ax-copy"
        type="button"
        aria-label={label}
        data-done={done ? "" : undefined}
        onClick={copy}
      >
        <CopyGlyph className="c1" />
        <TickGlyph className="c2" />
        <span>{done ? run.copied : run.copy}</span>
      </button>
    </li>
  );
}

/** A line under the command: its runs, and each cloud's runs under its mark, the cloud's name kept for the ear. */
function Hint({ parts }: { readonly parts: readonly HintPart[] }): React.JSX.Element {
  const run = (part: HintRun, key: number) =>
    part.code ? (
      <code translate="no" key={key}>
        {part.text}
      </code>
    ) : part.bold ? (
      <b key={key}>{part.text}</b>
    ) : (
      <span key={key}>{part.text}</span>
    );
  return (
    <p className="ax-under">
      {parts.map((part, index) =>
        "cloud" in part ? (
          <span className="ax-cl" key={index}>
            {part.cloud === "azure" ? (
              <AzureMark idSuffix={`ax-cl-${index}-${parts.length}`} className="az" />
            ) : (
              <AwsMark className="aws" />
            )}
            <span className="sr-only">{part.cloud === "azure" ? "Azure: " : "AWS: "}</span>
            {part.runs.map(run)}
          </span>
        ) : (
          run(part, index)
        ),
      )}
    </p>
  );
}

/**
 * The hero's right side: What you get's terminal, its bar and the chosen
 * product's one line, `npx -y zoorik assess coral` or `… amoeba`, its product mark under the bar's first dot and Copy
 * the one white button; then how to sign in to the cloud, and where Cloud Shell keeps the PDF. Both lines are in the
 * page; the sheet shows the one `html[data-ap]` names, so the first paint and the switch pick it with no script of
 * their own. A copy turns its button to a tick and "Copied" for 1.6s; with no clipboard the line is selected instead,
 * and the live region says to copy it with the keyboard (`useCopyCommand`).
 */
export function AssessmentRun(): React.JSX.Element {
  const [live, setLive] = useState("");

  return (
    <div className="ax-hero-r">
      <div className="ax-hero-run">
        <div className="ax-term ax-cmds">
          <div className="ax-term-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{run.bar}</span>
          </div>
          <ol className="ax-lines" role="list">
            {PRODUCTS.map((product) => (
              <RunLine product={product} onLive={setLive} key={product} />
            ))}
          </ol>
        </div>
        <Hint parts={run.signIn} />
        <Hint parts={run.under} />
        <span className="sr-only" aria-live="polite">
          {live}
        </span>
      </div>
    </div>
  );
}
