"use client";

import { useState } from "react";

import { diskCalculator, diskCalculatorUi, roundUpLine } from "@/content/calculators";
import { cloudPrices, regionNames } from "@/content/cloud-prices";
import { richText } from "@/features/documents/rich-text";
import {
  amount,
  azureDiskCost,
  azureTiers,
  ebsDiskCost,
  ebsPrice,
  parseNumberInput,
  share,
  unitPrice,
  usd,
  type AzureDiskType,
  type Cloud,
  type DiskInputError,
  type EbsVolumeType,
} from "@/lib/cloud-cost-calc";

import { CalcNumber, CalcRow, CalcSelect, CalcSwitch } from "./calc-parts";

/**
 * The disk calculator: the form on the white card, the result on the dark one. Cloud, region, disk type, the disk's
 * size and the space its files use; the result is what the disk costs a month and what its empty space costs, then
 * the tier Azure prices it as, the price used, the empty space, and on Azure the tier's space above the disk's size.
 * Every figure is `azureDiskCost` or `ebsDiskCost` on the dated list prices (`@/content/cloud-prices`); nothing is
 * stored and nothing is sent.
 *
 * A size that is blank, not whole or out of the disk type's range, or a used space that is blank or below 0, shows
 * its message under its field and in place of every figure. Used space above the disk's size still shows the
 * figures, empty space at 0, with the line that says so under the field.
 *
 * Drawn on the server at the defaults (a 200 GiB Standard SSD in East US, 50 GiB used), so the page reads whole
 * without scripting; the controls take over once it loads.
 */

const ui = diskCalculatorUi;

type DiskType = AzureDiskType | EbsVolumeType;

const DEFAULTS: Readonly<Record<Cloud, { readonly region: string; readonly type: DiskType }>> = {
  azure: { region: "eastus", type: "standard-ssd" },
  aws: { region: "us-east-1", type: "gp3" },
};

const TYPES: Readonly<Record<Cloud, readonly (readonly [DiskType, string])[]>> = {
  azure: [
    ["premium-ssd", ui.type.azure["premium-ssd"]],
    ["standard-ssd", ui.type.azure["standard-ssd"]],
  ],
  aws: [
    ["gp3", ui.type.aws.gp3],
    ["gp2", ui.type.aws.gp2],
  ],
};

/** The draft's messages, in its order: a size that is not whole, each type's range, then the used space. */
const [WHOLE, AZURE_RANGE, GP3_RANGE, GP2_RANGE, USED] = diskCalculator.messages as unknown as [
  string,
  string,
  string,
  string,
  string,
];

/** The message an error shows, and the field it belongs to. */
function messageOf(
  error: DiskInputError,
  cloud: Cloud,
  type: DiskType,
): { readonly field: "size" | "used"; readonly text: string } {
  if (error === "used-must-be-a-number-from-0") return { field: "used", text: USED };
  if (error === "size-out-of-range") {
    return {
      field: "size",
      text: cloud === "azure" ? AZURE_RANGE : type === "gp3" ? GP3_RANGE : GP2_RANGE,
    };
  }
  return { field: "size", text: WHOLE };
}

const regionsOf = (cloud: Cloud): readonly string[] =>
  cloud === "azure" ? cloudPrices.azure.regions : cloudPrices.aws.regions;

export function DiskCalculator(): React.JSX.Element {
  const [cloud, setCloud] = useState<Cloud>("azure");
  const [region, setRegion] = useState(DEFAULTS.azure.region);
  const [type, setType] = useState<DiskType>(DEFAULTS.azure.type);
  const [sizeText, setSizeText] = useState<string>(ui.size.start);
  const [usedText, setUsedText] = useState<string>(ui.used.start);

  const input = { provisionedGib: parseNumberInput(sizeText), usedGib: parseNumberInput(usedText) };
  const result =
    cloud === "azure"
      ? azureDiskCost(input, azureTiers(cloudPrices, region, type as AzureDiskType))
      : ebsDiskCost(
          input,
          type as EbsVolumeType,
          ebsPrice(cloudPrices, region, type as EbsVolumeType),
        );
  const error = "error" in result ? messageOf(result.error, cloud, type) : null;
  const ok = "error" in result ? null : result;
  const message = (field: "size" | "used"): string | null =>
    error?.field === field
      ? error.text
      : field === "used" && ok?.usedAboveSize
        ? diskCalculator.overLine
        : null;
  const up = cloud === "azure" && ok !== null && (ok.roundUpGib ?? 0) > 0;

  const chooseCloud = (next: Cloud) => {
    setCloud(next);
    setRegion(DEFAULTS[next].region);
    setType(DEFAULTS[next].type);
  };

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
          onChange={setRegion}
        />
        <CalcSwitch
          name="type"
          label={ui.type.label}
          options={TYPES[cloud]}
          value={type}
          onChange={setType}
        />
        <CalcNumber
          id="size"
          label={ui.size.label}
          unit={ui.size.unit}
          value={sizeText}
          message={message("size")}
          help={richText(diskCalculator.help[cloud])}
          onChange={setSizeText}
        />
        <CalcNumber
          id="used"
          label={ui.used.label}
          unit={ui.used.unit}
          value={usedText}
          message={message("used")}
          help={richText(diskCalculator.help.used)}
          onChange={setUsedText}
        />
      </form>
      <div className="as-cal calc-r" id="calc-result" aria-live="polite">
        <div className="calc-ok" hidden={!ok}>
          {ok ? (
            <>
              <div className="calc-two">
                <div>
                  <p className="calc-k">{ui.cost}</p>
                  <p className="calc-n">
                    <b id="o-cost">{usd(ok.usdPerMonth)}</b>
                    {ui.aMonth}
                  </p>
                </div>
                <div>
                  <p className="calc-k">{ui.emptyCost}</p>
                  <p className="calc-n">
                    <b id="o-ecost">{usd(ok.emptyUsdPerMonth)}</b>
                    {ui.aMonth}
                  </p>
                </div>
              </div>
              <dl className="calc-rows">
                <CalcRow id="o-tier" rowId term={ui.pricedAs} hidden={cloud !== "azure"}>
                  {cloud === "azure" ? `${ok.tier} · ${amount(ok.pricedGib)} GiB` : ""}
                </CalcRow>
                <CalcRow id="o-price" term={ui.priceUsed}>
                  {cloud === "azure"
                    ? `${usd(ok.usdPerMonth)} a month`
                    : `${unitPrice(ebsPrice(cloudPrices, region, type as EbsVolumeType))} per GB-month`}
                </CalcRow>
                <CalcRow id="o-empty" term={ui.empty}>
                  {`${amount(ok.emptyGib)} GiB (${share(ok.emptyShare)})`}
                </CalcRow>
                <CalcRow id="o-up" rowId term={ui.up} hidden={!up}>
                  {up
                    ? `${amount(ok.roundUpGib ?? 0)} GiB, ${usd(ok.roundUpUsdPerMonth ?? 0)} a month`
                    : ""}
                </CalcRow>
              </dl>
              <p className="calc-note" id="o-upline" hidden={!up}>
                {up
                  ? roundUpLine(
                      ok.tier ?? "",
                      amount(ok.pricedGib),
                      amount(ok.roundUpGib ?? 0),
                      usd(ok.roundUpUsdPerMonth ?? 0),
                    )
                  : ""}
              </p>
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
