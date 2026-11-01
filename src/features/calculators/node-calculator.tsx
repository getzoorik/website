"use client";

import { useEffect, useRef, useState } from "react";

import {
  eksNoteFigure,
  nodeCalculator,
  nodeCalculatorUi,
  sizeKindNames,
} from "@/content/calculators";
import { cloudPrices, eniFacts, regionNames } from "@/content/cloud-prices";
import { ChevronGlyph } from "@/features/documents/document-glyphs";
import { richText } from "@/features/documents/rich-text";
import {
  amount,
  has,
  nodeCost,
  nodeSizes,
  parseNumberInput,
  share,
  unitPrice,
  usd,
  type Cloud,
  type NodeInputError,
  type SizeKind,
} from "@/lib/cloud-cost-calc";

import { CalcNumber, CalcRow, CalcSelect, CalcSwitch } from "./calc-parts";

/**
 * The node calculator: the form on the white card, the result on the dark one. Cloud, region, VM size and nodes, and
 * on AKS the max pods per node under More settings; the result is the monthly cost for all the nodes, then what pods
 * can use on each node and across them all. Every figure is `nodeCost` on the dated list prices
 * (`@/content/cloud-prices`); nothing is stored and nothing is sent.
 *
 * A field that is blank, not whole or out of range shows its message under it, and the result shows that message in
 * place of every figure (a blank field is never read as 0). On EKS the memory pods can use is not published per
 * instance type, so its row gives way to the note that says why, with what Kubernetes keeps for the chosen size.
 *
 * Drawn on the server at the defaults (three Standard_D4s_v5 nodes in East US), so the page reads whole without
 * scripting; the controls take over once it loads.
 */

const ui = nodeCalculatorUi;

/** Each cloud's first region and size. */
const DEFAULTS: Readonly<Record<Cloud, { readonly region: string; readonly size: string }>> = {
  azure: { region: "eastus", size: "Standard_D4s_v5" },
  aws: { region: "us-east-1", size: "m6i.xlarge" },
};

const KINDS: readonly SizeKind[] = ["general", "compute", "memory"];

/** Which field each message belongs to, and its words (the draft's, in its order). */
const MESSAGES: Partial<
  Record<NodeInputError, { readonly field: "nodes" | "maxpods"; readonly text: string }>
> = {
  "nodes-must-be-a-whole-number-from-1": { field: "nodes", text: nodeCalculator.messages[0] },
  "max-pods-out-of-range": { field: "maxpods", text: nodeCalculator.messages[1] },
  "aks-node-pool-needs-room-for-30-pods": { field: "maxpods", text: nodeCalculator.messages[2] },
};

/** The EKS note around its one figure, which follows the chosen size. */
const [noteBefore, noteAfter] = nodeCalculator.eksNote.split(eksNoteFigure) as [string, string];

const regionsOf = (cloud: Cloud): readonly string[] =>
  cloud === "azure" ? cloudPrices.azure.regions : cloudPrices.aws.regions;

export function NodeCalculator(): React.JSX.Element {
  const [cloud, setCloud] = useState<Cloud>("azure");
  const [region, setRegion] = useState(DEFAULTS.azure.region);
  const [sizeName, setSizeName] = useState(DEFAULTS.azure.size);
  const [nodesText, setNodesText] = useState<string>(ui.nodes.start);
  const [maxPodsText, setMaxPodsText] = useState<string>(ui.maxPods.start);
  const more = useRef<HTMLDetailsElement>(null);

  const sizes = nodeSizes(cloudPrices, eniFacts, cloud, region);
  const pick = sizes.find((each) => each.size.name === sizeName) ?? sizes[0]!;
  const nodes = parseNumberInput(nodesText);
  const result = nodeCost({
    size: pick.size,
    usdPerHour: pick.usdPerHour,
    nodes,
    maxPods: cloud === "azure" ? parseNumberInput(maxPodsText) : undefined,
  });
  const error = "error" in result ? MESSAGES[result.error] : undefined;
  const failed = "error" in result;

  /* A max pods message opens More settings, so the field it names is in view: after every render while it stands, as
     the mock's render() does, so a reader who closes the fold sees it again on the next input. */
  useEffect(() => {
    if (error?.field === "maxpods" && more.current) more.current.open = true;
  });

  const chooseCloud = (next: Cloud) => {
    setCloud(next);
    setRegion(DEFAULTS[next].region);
    setSizeName(DEFAULTS[next].size);
  };
  /* A size the new region does not list falls back to the cloud's first. */
  const chooseRegion = (next: string) => {
    setRegion(next);
    if (
      !nodeSizes(cloudPrices, eniFacts, cloud, next).some((each) => each.size.name === sizeName)
    ) {
      setSizeName(DEFAULTS[cloud].size);
    }
  };

  const message = (field: "nodes" | "maxpods") => (error?.field === field ? error.text : null);
  const ok = "error" in result ? null : result;
  const size = pick.size;

  return (
    <div className="calc-grid">
      <form
        className="as-card calc-form"
        id="calc-form"
        noValidate
        onSubmit={(event) => event.preventDefault()}
      >
        <CalcSwitch
          name="cloud"
          label={ui.cloud.label}
          options={[
            ["azure", ui.cloud.azure],
            ["aws", ui.cloud.aws],
          ]}
          value={cloud}
          onChange={chooseCloud}
        />
        <CalcSelect
          id="region"
          label={ui.region}
          value={region}
          groups={[
            { options: regionsOf(cloud).map((each) => [each, regionNames[each]!] as const) },
          ]}
          onChange={chooseRegion}
        />
        <CalcSelect
          id="size"
          label={ui.size}
          value={pick.size.name}
          groups={KINDS.map((kind) => ({
            label: sizeKindNames[kind],
            options: sizes
              .filter((each) => each.size.kind === kind)
              .map(
                (each) =>
                  [
                    each.size.name,
                    `${each.size.name} · ${each.size.vcpu} vCPUs · ${amount(each.size.memoryGib)} GiB`,
                  ] as const,
              ),
          }))}
          onChange={setSizeName}
        />
        <CalcNumber
          id="nodes"
          label={ui.nodes.label}
          unit={ui.nodes.unit}
          value={nodesText}
          message={message("nodes")}
          whole
          onChange={setNodesText}
        />
        <details className="calc-more" id="more" hidden={cloud !== "azure"} ref={more}>
          <summary>
            {ui.more}
            <ChevronGlyph className="fq-chev" />
          </summary>
          <CalcNumber
            id="maxpods"
            label={ui.maxPods.label}
            unit={ui.maxPods.unit}
            value={maxPodsText}
            message={message("maxpods")}
            help={richText(nodeCalculator.maxPodsHelp)}
            whole
            onChange={setMaxPodsText}
          />
        </details>
      </form>
      <div className="as-cal calc-r" id="calc-result" aria-live="polite">
        <div className="calc-ok" hidden={failed}>
          {ok ? (
            <>
              <p className="calc-k">{ui.total.label}</p>
              <p className="calc-n">
                <b id="o-total">{usd(ok.usdPerMonth)}</b>
                {ui.total.after}
              </p>
              <dl className="calc-rows">
                <CalcRow
                  id="o-node"
                  term={ui.perNodeCost}
                >{`${usd(ok.usdPerMonthPerNode)} a month`}</CalcRow>
                <CalcRow
                  id="o-hour"
                  term={ui.listPrice}
                >{`${unitPrice(ok.usdPerHour)} an hour`}</CalcRow>
              </dl>
              <h3>{ui.perNode}</h3>
              <dl className="calc-rows">
                {has(ok.perNode.cpuVcpu) && has(ok.perNode.cpuShare) ? (
                  <CalcRow id="o-cpu" term={ui.cpu}>
                    {`${amount(ok.perNode.cpuVcpu.value)} of ${size.vcpu} vCPUs (${share(ok.perNode.cpuShare.value)})`}
                  </CalcRow>
                ) : null}
                <CalcRow id="o-mem" rowId term={ui.memory} hidden={!has(ok.perNode.memoryGib)}>
                  {has(ok.perNode.memoryGib) && has(ok.perNode.memoryShare)
                    ? `${amount(ok.perNode.memoryGib.value)} of ${amount(size.memoryGib)} GiB (${share(ok.perNode.memoryShare.value)})`
                    : ""}
                </CalcRow>
                {has(ok.reserved.cpuMillicores) && has(ok.reserved.memoryGib) ? (
                  <CalcRow id="o-keep" term={ui.keeps}>
                    {`${amount(ok.reserved.cpuMillicores.value / 1000)} vCPU and ${amount(ok.reserved.memoryGib.value)} GiB`}
                  </CalcRow>
                ) : null}
                {has(ok.maxPods) ? (
                  <CalcRow id="o-pods" term={ui.pods}>{`${ok.maxPods.value} pods`}</CalcRow>
                ) : null}
              </dl>
              <p className="calc-note" id="o-eks" hidden={has(ok.perNode.memoryGib)}>
                {!has(ok.perNode.memoryGib) && has(ok.reserved.memoryGib) ? (
                  <>
                    {richText(noteBefore)}
                    {`${amount(ok.reserved.memoryGib.value)} GiB`}
                    {richText(noteAfter)}
                  </>
                ) : null}
              </p>
              <h3 id="o-all-h">{ui.across(nodes)}</h3>
              <dl className="calc-rows">
                <CalcRow id="o-tv" term={ui.vcpus}>{`${amount(ok.total.vcpu)} vCPUs`}</CalcRow>
                <CalcRow
                  id="o-tm"
                  term={ui.memoryTotal}
                >{`${amount(ok.total.memoryGib)} GiB`}</CalcRow>
                {has(ok.total.podsCpuVcpu) ? (
                  <CalcRow
                    id="o-tc"
                    term={ui.cpu}
                  >{`${amount(ok.total.podsCpuVcpu.value)} vCPUs`}</CalcRow>
                ) : null}
                <CalcRow id="o-tpm" term={ui.memory}>
                  {has(ok.total.podsMemoryGib)
                    ? `${amount(ok.total.podsMemoryGib.value)} GiB`
                    : ui.notShown}
                </CalcRow>
              </dl>
            </>
          ) : null}
        </div>
        <div className="calc-stop" id="calc-stop" hidden={!error}>
          {error?.text ?? ""}
        </div>
      </div>
    </div>
  );
}
