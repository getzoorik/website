import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { diskCalculator, diskCalculatorUi } from "@/content/calculators";
import { CalculatorPage } from "@/features/calculators/calculator-page";
import { DiskCalculator } from "@/features/calculators/disk-calculator";
import { diskReferenceTables } from "@/features/calculators/reference-tables";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/calculators.css";

/**
 * `/ebs-and-azure-disk-pricing`: what an Azure managed disk or an EBS volume costs a month, and what its empty space
 * costs. Indexed, listed in the sitemap, and prerendered at build like every page here; the calculator is its one
 * client island. At the site's root (owner, 30 Oct 2026: "At the root"), linked from Cloud cost optimization tools'
 * Free calculators and from the footer's Resources column, after EKS and AKS pricing calculator (owner, 30 Oct 2026).
 */
/* Its title goes through the layout's template: "EBS pricing and Azure disk pricing calculator | Zoorik". */
export const metadata: Metadata = documentMetadata(
  routes.ebsAndAzureDiskPricing,
  diskCalculator.meta,
);

export default function EbsAndAzureDiskPricing(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.ebsAndAzureDiskPricing)} />
      <CalculatorPage
        copy={diskCalculator}
        product="amoeba"
        tablesLabel={diskCalculatorUi.tables}
        tables={diskReferenceTables()}
      >
        <DiskCalculator />
      </CalculatorPage>
    </>
  );
}
