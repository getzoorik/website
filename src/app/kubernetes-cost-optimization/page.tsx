import type { Metadata } from "next";

import { routes } from "@/config/site";
import { articleServedAt } from "@/content/learn/published";
import { articleMetadata, LearnArticleDocument } from "@/features/learn/article-route";

import "@/styles/article.css";

/**
 * `/kubernetes-cost-optimization`: the Kubernetes pillar, the Learn article reduce-kubernetes-cost, at the address of
 * its search (D230, owner, 1 Nov 2026). The same page and metadata as every /learn/<slug>; its old address there is a
 * 301 here. Its file names this address (`route`), and a build with no published article at it fails.
 */
const article = articleServedAt(routes.kubernetesCostOptimization);

export const metadata: Metadata = articleMetadata(article);

export default function KubernetesCostOptimization(): React.JSX.Element {
  return <LearnArticleDocument article={article} />;
}
