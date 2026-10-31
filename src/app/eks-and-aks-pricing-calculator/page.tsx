import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { nodeCalculator, nodeCalculatorUi } from "@/content/calculators";
import { CalculatorPage } from "@/features/calculators/calculator-page";
import { NodeCalculator } from "@/features/calculators/node-calculator";
import { nodeReferenceTables } from "@/features/calculators/reference-tables";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/calculators.css";

/**
 * `/eks-and-aks-pricing-calculator`: a node's monthly list price on AKS or EKS, and how much of it pods can use.
 * Indexed, listed in the sitemap, and prerendered at build like every page here; the calculator is its one client
 * island. At the site's root (owner, 30 Oct 2026: "At the root"), linked from Cloud cost optimization tools' Free
 * calculators and from the footer's Resources column, after Cloud cost optimization tools (owner, 30 Oct 2026).
 */
/* Its title goes through the layout's template: "Kubernetes node cost calculator | Zoorik". */
export const metadata: Metadata = documentMetadata(
  routes.eksAndAksPricingCalculator,
  nodeCalculator.meta,
);

export default function EksAndAksPricingCalculator(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.eksAndAksPricingCalculator)} />
      <CalculatorPage
        copy={nodeCalculator}
        product="coral"
        tablesLabel={nodeCalculatorUi.tables}
        tables={nodeReferenceTables()}
      >
        <NodeCalculator />
      </CalculatorPage>
    </>
  );
}
