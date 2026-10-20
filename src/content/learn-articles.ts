import { routes } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * Learn: the first three articles, every string verbatim from the approved
 * mocks. The articles' drafts were edited into these mocks, and the mock wins
 * where the two differ: "right-size" became "rebalance" in the VPA article.
 *
 * The fourth, "How Poor Infrastructure Architecture Quietly Increases Your
 * Cloud Bill", is first published here, and Medium copies it later with a
 * canonical link to this page. Its source is the approved post, and every word
 * is as written there, its Title Case h1 included; the site only links words
 * already in it. An essay rather than an explainer, it has no short answer, no
 * help box and no sources: its opening stands under the byline (`lead`), and
 * its author's line closes it.
 *
 * Each is published by Zoorik. The first three name no author; the fourth is
 * published under its author's name, Vineet, and its byline reads "By Vineet,
 * infrastructure engineer · Published by Zoorik".
 *
 * ─── PLAIN DATA, ONE SMALL MARKUP ──────────────────────────────────────────
 * As the guides do it: a run of text is a string, or a list of pieces where a
 * piece is bold or inline code. Product names are written plainly; the page
 * keeps each one out of translation (`named()`), as the mocks mark them. The
 * curly quotes, the "×" and "÷", the dashes and the no-break space between a
 * figure and its unit ("3 days") are the mocks' own.
 *
 * ─── THE ANCHOR IDS ARE ADDRESSES ──────────────────────────────────────────
 * An article keeps its hash (`hashKeepingRoutes`), so each section's id, and
 * the VPA article's two h3 ids, are shared addresses. They are the mocks'
 * (the heading's first seven words): keep an id when its heading changes.
 */

export type ArticleId =
  | "vpa-vs-hpa"
  | "coral-and-native-autoscalers"
  | "shrink-azure-managed-disk"
  | "poor-architecture-cloud-bill";

/** One piece of a run of text: plain, bold, inline code, or a link on words already in it. */
export type ArticleInline =
  | string
  | { readonly b: string }
  | { readonly code: string }
  | { readonly a: string; readonly href: string };

/** A run of text: one string, or pieces. */
export type ArticleText = string | readonly ArticleInline[];

/** The VPA article's still diagrams, drawn in `src/features/learn`. */
export type ArticleFigureId = "vpa-hpa-pair" | "hpa-example" | "requests" | "clash" | "order";

export interface ArticleColumn {
  readonly label: string;
  /** The column's share of the table, as the mock sets it. */
  readonly width: string;
}

export type ArticleBlock =
  | { readonly kind: "p"; readonly text: ArticleText }
  | { readonly kind: "ul"; readonly items: readonly ArticleText[] }
  /** Numbered steps, in the guide's accent numerals. */
  | { readonly kind: "steps"; readonly items: readonly ArticleText[] }
  | {
      readonly kind: "table";
      readonly columns: readonly ArticleColumn[];
      /** One string per cell, in column order. */
      readonly rows: readonly (readonly string[])[];
    }
  /** A formula on its own line, set as code. */
  | { readonly kind: "formula"; readonly code: string }
  /** A part of a section, with an id of its own: a shared address ("What is the VPA?"). */
  | { readonly kind: "h3"; readonly id: string; readonly title: string }
  | { readonly kind: "figure"; readonly figure: ArticleFigureId }
  /** A picture the article carries as a file in `public/articles/`, with its caption.
   *  `srcset` offers smaller copies by width (the infographic's 700 and 1400). */
  | {
      readonly kind: "image";
      readonly src: string;
      readonly srcset?: string;
      readonly alt: string;
      readonly caption: string;
      readonly width: number;
      readonly height: number;
    }
  /** The question an essay turns on, set apart. */
  | { readonly kind: "quote"; readonly text: ArticleText }
  /** A line in italics, as the source sets it: fine print, or the author's closing line. */
  | { readonly kind: "note"; readonly text: ArticleText };

export interface ArticleSection {
  readonly id: string;
  readonly title: string;
  readonly blocks: readonly ArticleBlock[];
}

/** A step of the strip under the short answer, its icon by name. */
export interface ArticleStripStep {
  readonly icon: "pod-v" | "pods" | "check";
  readonly text: string;
}

/**
 * A source: its publisher and its title when the article names them; an
 * article that names neither prints the address (the autoscalers article).
 */
export interface ArticleSource {
  readonly publisher?: string;
  readonly title?: string;
  readonly url: `https://${string}`;
}

/** A Related tile: the target's title, and where it lives ("Learn", "Coral FAQ"). */
export interface ArticleRelated {
  readonly title: string;
  readonly where: string;
  readonly href: string;
}

export interface Article {
  readonly id: ArticleId;
  readonly route: string;
  /** Its first line ("Updated 9 October 2026"): the byline, its /learn row, the sitemap and the structured data read it. */
  readonly updated: string;
  /**
   * The person it is published under, where there is one (only the fourth
   * article): the byline adds "By <name>, <role>", the name a link to their
   * profile in a new tab, and the structured data makes them its author.
   */
  readonly author?: {
    readonly name: string;
    readonly role: string;
    readonly url: `https://${string}`;
  };
  /** The product the article leads to: its help box, its assessment and its closing row. */
  readonly product: ProductId;
  /** The `<title>` (through the site's template) and the description. */
  readonly meta: { readonly title: string; readonly description: string };
  readonly hero: { readonly title: string; readonly deck: string };
  /** The line under the title on the /learn hub. */
  readonly card: string;
  /** The answer after "Short answer.", first in the column. An essay has none. */
  readonly short?: string;
  readonly strip?: readonly ArticleStripStep[];
  /** An essay's opening before its first heading, under the byline in place of the short answer. */
  readonly lead?: readonly ArticleBlock[];
  readonly sections: readonly ArticleSection[];
  /** "How Coral helps": one paragraph and two links. An essay has none. */
  readonly help?: {
    readonly title: string;
    readonly text: string;
    readonly links: readonly { readonly label: string; readonly href: string }[];
  };
  /** An essay that cites none has no Sources line. */
  readonly sources?: readonly ArticleSource[];
  readonly related: readonly ArticleRelated[];
}

/** The byline's words after each article's own date (`Article.updated`): its author, where it has one, and who publishes it. */
export const articleByline = {
  author: " · By ",
  by: " · Published by ",
  publisher: { text: "Zoorik", href: routes.about },
} as const;

export const articleWords = {
  short: "Short answer.",
  sources: "Sources: ",
  related: "Related",
} as const;

/**
 * The articles, in the order they were published. The /learn hub groups them
 * (Cloud cost, Kubernetes, Block storage: `learnGroups` in `learn.ts`), and
 * `articleOrder` below follows the hub.
 */
export const articles: Readonly<Record<ArticleId, Article>> = {
  "vpa-vs-hpa": {
    id: "vpa-vs-hpa",
    route: routes.learnVpaVsHpa,
    updated: "Updated 9 October 2026",
    product: "coral",
    meta: {
      title: "VPA vs HPA: rebalance first, then scale out",
      description:
        "The VPA sets how much CPU and memory a pod requests; the HPA sets how many pods run. Why they clash on CPU, and why rebalancing comes first.",
    },
    hero: {
      title: "VPA vs HPA: rebalance first, then scale out",
      deck: "What each Kubernetes autoscaler changes, why they clash on CPU, and the order that works.",
    },
    card: "What each autoscaler changes, why they clash on CPU, and the order that works.",
    short:
      "The Vertical Pod Autoscaler (VPA) changes how much CPU and memory each pod requests. The Horizontal Pod Autoscaler (HPA) changes how many pods run. On the same CPU or memory metric they clash, because the HPA measures load against the request the VPA keeps moving. Size requests to real use first, then let the HPA scale out.",
    strip: [
      { icon: "pod-v", text: "VPA sizes each pod" },
      { icon: "pods", text: "HPA sets pod count" },
      { icon: "check", text: "Rebalance first, then scale" },
    ],
    sections: [
      {
        id: "what-are-the-vpa-and-the-hpa",
        title: "What are the VPA and the HPA?",
        blocks: [
          { kind: "figure", figure: "vpa-hpa-pair" },
          { kind: "h3", id: "what-is-the-vpa", title: "What is the VPA?" },
          {
            kind: "p",
            text: [
              "The Vertical Pod Autoscaler (VPA) is an open-source add-on from the Kubernetes autoscaler project. It sets the CPU and memory requests of a workload’s containers to match the use it measures, and keeps each container’s limit in the same ratio to its request. You attach it to a workload, such as a Deployment, with a ",
              { code: "VerticalPodAutoscaler" },
              " object.",
            ],
          },
          {
            kind: "p",
            text: "It isn’t part of core Kubernetes. On AKS it comes preconfigured in AKS Automatic, and you enable it yourself in AKS Standard. On EKS you deploy it from the autoscaler project, with Metrics Server installed.",
          },
          { kind: "p", text: "Three components do the work:" },
          {
            kind: "ul",
            items: [
              [
                { b: "Recommender:" },
                " reads each container’s current and past use, and its out-of-memory kills, and works out a target request.",
              ],
              [
                { b: "Updater:" },
                " finds pods whose requests are out of date and evicts them, so their controller recreates them.",
              ],
              [
                { b: "Admission controller:" },
                " a webhook that writes the target requests into each pod as it is created.",
              ],
            ],
          },
          { kind: "p", text: "What happens to running pods depends on its update mode:" },
          {
            kind: "ul",
            items: [
              [{ b: "Off:" }, " it only recommends. You read the targets in the VPA object."],
              [
                { b: "Initial:" },
                " it sets requests when a pod is created, and never changes them later.",
              ],
              [
                { b: "Recreate:" },
                " it evicts pods whose requests differ enough from the target, and they come back at the new size, within their PodDisruptionBudget.",
              ],
              [
                { b: "InPlaceOrRecreate:" },
                " it changes requests without restarting the pod where the cluster supports in-place resize, and evicts the pod where it can’t. The older Auto mode now means Recreate.",
              ],
            ],
          },
          {
            kind: "p",
            text: "The VPA does one job well: it makes requests match use. It doesn’t add pods when load grows past what one pod can serve, and it doesn’t remove nodes.",
          },
          { kind: "h3", id: "what-is-the-hpa", title: "What is the HPA?" },
          {
            kind: "p",
            text: [
              "The Horizontal Pod Autoscaler (HPA) is built into Kubernetes. It is an API object, the ",
              { code: "HorizontalPodAutoscaler" },
              ", and a controller that runs in the cluster’s control plane. It scales a workload out and in: it changes the replica count of a Deployment, StatefulSet or other scalable workload to hold a metric at a target. It can’t scale a DaemonSet, which runs one pod on each node.",
            ],
          },
          {
            kind: "p",
            text: "Every 15\u00a0seconds by default, the controller reads the metric and works out how many pods the workload needs. For CPU and memory the metric is utilization: usage divided by the request, read through the Kubernetes resource metrics API, which Metrics Server usually serves. Its core rule is:",
          },
          {
            kind: "formula",
            code: "desiredReplicas = ceil(currentReplicas × currentMetric ÷ targetMetric)",
          },
          {
            kind: "p",
            text: "With a 70% CPU target, 4 pods running at 140% of their request become 8.",
          },
          { kind: "figure", figure: "hpa-example" },
          {
            kind: "p",
            text: "The HPA can also scale on custom and external metrics, such as requests per second or queue length. KEDA builds on it: a KEDA ScaledObject creates and drives an HPA from event sources, and can scale a workload to zero.",
          },
          {
            kind: "p",
            text: "The HPA does one job well: it matches the number of pods to load. It takes each pod’s request as given.",
          },
        ],
      },
      {
        id: "requests-decide-what-you-pay-for",
        title: "Requests decide what you pay for",
        blocks: [
          {
            kind: "p",
            text: "Every container can set a CPU and a memory request. The scheduler places pods by their requests, not by their use: a node is full when the requests on it add up to its allocatable capacity, even if the processes on it are idle. The Cluster Autoscaler, Node Auto Provisioning (NAP) and Karpenter count requests the same way when they decide how many nodes you need. A request set “to be safe” at four times real use keeps nodes running that do almost nothing, and you pay for those nodes.",
          },
          { kind: "figure", figure: "requests" },
          {
            kind: "p",
            text: "Limits are different. A memory limit is the point where the container is OOM-killed, and a CPU limit is where it is throttled.",
          },
        ],
      },
      {
        id: "why-they-clash-on-cpu",
        title: "Why they clash on CPU",
        blocks: [
          {
            kind: "p",
            text: "Run both on the same metric and they feed each other. Say a pod uses 200m of a 500m CPU request: 40% utilization. The VPA lowers the request to 250m. The HPA now reads the same load as 80% and, with a 70% target, adds pods. The new pods share the load, each pod uses less, and the VPA lowers the request again. The two controllers chase each other, and the replica count reflects the last request change more than real load.",
          },
          { kind: "figure", figure: "clash" },
          {
            kind: "p",
            text: "That’s why the VPA’s own documentation says not to use it with the HPA on the same resource metric, CPU or memory. The usual workarounds are to run the HPA on a custom or external metric while the VPA sizes CPU and memory, or to keep the VPA in Off mode and set requests from its targets by hand.",
          },
        ],
      },
      {
        id: "rebalance-first-then-scale-out",
        title: "Rebalance first, then scale out",
        blocks: [
          {
            kind: "p",
            text: "The HPA’s arithmetic is only as good as the request under it, so the order matters.",
          },
          { kind: "figure", figure: "order" },
          {
            kind: "steps",
            items: [
              [
                { b: "Size requests to measured use:" },
                " a high percentile of CPU over several days plus headroom, and the peak of memory. Leave limits alone until you know why they were set.",
              ],
              [
                { b: "Then set the HPA target." },
                " With honest requests, 70% utilization means 70% of what a pod really needs, and the HPA scales out when load really grows.",
              ],
              [
                { b: "Then let the node autoscaler remove what’s left." },
                " Smaller requests fit on fewer nodes, and the Cluster Autoscaler, NAP or Karpenter can remove the empty ones.",
              ],
            ],
          },
          {
            kind: "p",
            text: "Cutting requests saves nothing on its own. The bill falls when nodes go.",
          },
        ],
      },
      {
        id: "where-coral-fits",
        title: "Where Coral fits",
        blocks: [
          {
            kind: "p",
            text: "Coral does the VPA’s job and works with the HPA, so you don’t have to choose between them.",
          },
          {
            kind: "ul",
            items: [
              [
                { b: "Rebalancing." },
                " Coral sets requests with its own recommender and webhook. It doesn’t run the VPA. On the default balanced policy, the CPU request is the 80th percentile of the last 3\u00a0days plus 10%, and memory is the highest use in the last 8\u00a0days plus 10%. Your manifests and Git stay as they are: a webhook sizes pods as they start, and it fails open. With automation on, Coral switches an active VPA to Off and restores it when you switch automation off or disconnect.",
              ],
              [
                { b: "HPA-aware sizing." },
                " The HPA decides how many pods run, and Coral decides how big each pod is. For a workload with a CPU-based HPA, Coral replays the last 3\u00a0days of load through that HPA’s own settings before it picks a request. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. While the HPA is scaling up and below its max, Coral holds back its surge and CPU-pressure raises, and pauses pod replacements until every pod is Ready. An OOM kill still raises memory at once.",
              ],
              [
                { b: "HPAs it manages." },
                " With automation on and the Optimization type “Both”, Coral creates an HPA, with ",
                { code: "minReplicas" },
                " of 2 or more, for an eligible Deployment or Argo Rollout that has none. Eligible means 24\u00a0hours of history, at least 100m CPU per pod and 2 or more ready replicas. It takes over hand-made HPAs that nothing else manages, keeps your ",
                { code: "minReplicas" },
                ", only raises ",
                { code: "maxReplicas" },
                ", and restores your values when it hands them back. Workload optimization never changes HPAs that Helm, Argo CD, Flux, KEDA or kubectl apply manage.",
              ],
              [
                { b: "Opt-in." },
                " Coral only recommends until “Automatically optimize” is on for a policy or a workload.",
              ],
            ],
          },
        ],
      },
    ],
    help: {
      title: "How Coral helps",
      text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
      links: [
        { label: "Kubernetes cost optimization with Coral", href: routes.coral },
        { label: "Estimate your saving", href: `${routes.assessment}?p=coral` },
      ],
    },
    sources: [
      {
        publisher: "Kubernetes",
        title: "“Horizontal Pod Autoscaling”",
        url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
      },
      {
        publisher: "Vertical Pod Autoscaler",
        title: "known limitations",
        url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/known-limitations.md",
      },
      {
        publisher: "Vertical Pod Autoscaler",
        title: "update modes",
        url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/quickstart.md",
      },
      {
        publisher: "Microsoft Learn",
        title: "“Vertical Pod Autoscaling in Azure Kubernetes Service”",
        url: "https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler",
      },
      {
        publisher: "Amazon EKS",
        title: "“Adjust pod resources with Vertical Pod Autoscaler”",
        url: "https://docs.aws.amazon.com/eks/latest/userguide/vertical-pod-autoscaler.html",
      },
    ],
    related: [
      {
        title: "Coral and the native Kubernetes autoscalers",
        where: "Learn",
        href: routes.learnCoralAutoscalers,
      },
      {
        title: "Working with HPA",
        where: "Coral FAQ",
        href: `${routes.coralFaq}#working-with-hpa`,
      },
      {
        title: "HPAs and VPAs",
        where: "Coral product guide",
        href: `${routes.coralGuide}#hpas-and-vpas`,
      },
    ],
  },
  "coral-and-native-autoscalers": {
    id: "coral-and-native-autoscalers",
    route: routes.learnCoralAutoscalers,
    updated: "Updated 9 October 2026",
    product: "coral",
    meta: {
      title: "Coral and the native Kubernetes autoscalers",
      description:
        "What VPA, HPA, KEDA, Cluster Autoscaler, NAP and Karpenter each do on AKS and EKS, what Coral adds, and how they work together.",
    },
    hero: {
      title: "Coral and the native Kubernetes autoscalers",
      deck: "What VPA, HPA, KEDA, the Cluster Autoscaler, NAP and Karpenter each do, and what Coral adds.",
    },
    card: "VPA, HPA, KEDA, Cluster Autoscaler, NAP and Karpenter, and what Coral adds.",
    short:
      "Kubernetes’ own autoscalers each change one thing: the VPA sizes pods, the HPA and KEDA set the pod count, and the Cluster Autoscaler, NAP and Karpenter add and remove nodes. Coral doesn’t replace them. It sizes requests to real use, drains spare nodes for your node autoscaler to remove, and shows what each change saves at list price.",
    sections: [
      {
        id: "what-each-autoscaler-does",
        title: "What each autoscaler does",
        blocks: [
          {
            kind: "table",
            columns: [
              { label: "Autoscaler", width: "28%" },
              { label: "What it changes", width: "34%" },
              { label: "What it decides from", width: "38%" },
            ],
            rows: [
              [
                "Vertical Pod Autoscaler (VPA)",
                "Each pod’s CPU and memory requests",
                "Each container’s usage history",
              ],
              [
                "Horizontal Pod Autoscaler (HPA)",
                "The number of pods",
                "Usage divided by request, or custom and external metrics",
              ],
              [
                "KEDA",
                "The number of pods, down to zero",
                "Event sources such as queues, through an HPA it manages",
              ],
              [
                "Cluster Autoscaler",
                "The number of nodes in node groups of fixed machine types",
                "Pending pods, to add nodes; pod requests against node capacity, to remove them",
              ],
              [
                "Node Auto Provisioning (NAP), on AKS",
                "Nodes and their VM sizes",
                "Pending pods’ requests. It also consolidates nodes, and it is built on Karpenter.",
              ],
              [
                "Karpenter, on EKS",
                "Nodes and their instance types",
                "Pending pods’ requests. It also consolidates nodes.",
              ],
            ],
          },
          {
            kind: "p",
            text: "Every node autoscaler here counts requests, not use. A request set far above real use keeps a node alive.",
          },
        ],
      },
      {
        id: "what-coral-does-with-each",
        title: "What Coral does with each",
        blocks: [
          {
            kind: "table",
            columns: [
              { label: "Autoscaler", width: "24%" },
              { label: "With Coral", width: "76%" },
            ],
            rows: [
              [
                "VPA",
                "Coral does the VPA’s job with its own recommender and webhook, and doesn’t run the VPA. With automation on, it switches an active VPA to Off and restores it when you switch automation off or disconnect. It never fights a VPA.",
              ],
              [
                "HPA",
                "The HPA keeps deciding how many pods run, and Coral decides how big each pod is. For a CPU-based HPA, Coral replays 3\u00a0days of load through the HPA’s settings before it lowers a request. With automation on and the Optimization type “Both”, it creates HPAs for eligible Deployments and Argo Rollouts, and takes over hand-made ones that nothing else manages.",
              ],
              [
                "KEDA",
                "Workload optimization never creates, takes over or edits a KEDA-owned HPA or ScaledObject. KEDA keeps the scaling.",
              ],
              [
                "Cluster Autoscaler",
                "Coral drains spare nodes one at a time, and the Cluster Autoscaler removes them. With only the Cluster Autoscaler, Coral removes nodes but never changes their size.",
              ],
              [
                "NAP",
                "Coral sizes requests so NAP needs fewer or smaller VMs. With NAP, Coral can also move work to smaller or cheaper machines. Pools NAP already consolidates are left to it.",
              ],
              [
                "Karpenter",
                "Coral sizes requests so Karpenter needs fewer or smaller instances. With Karpenter, Coral can also move work to smaller or cheaper machines. Pools Karpenter already consolidates are left to it.",
              ],
              [
                "No autoscaler",
                "Connect sets up NAP on AKS (with Azure CNI) or Karpenter on EKS, with your approval. Until an autoscaler exists, nothing adds nodes.",
              ],
            ],
          },
        ],
      },
      {
        id: "what-coral-adds",
        title: "What Coral adds",
        blocks: [
          {
            kind: "ul",
            items: [
              "Requests sized from measured use, by policy or per workload, without editing manifests or Git.",
              "HPA-aware sizing: a smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
              "Safe node draining: a scheduler check on the live cluster, one node at a time, within PodDisruptionBudgets.",
              "Fast raises after OOM kills, failing probes and CPU pressure.",
              "A cost view at list price: what each node and workload costs, what can be recovered, and a cluster score of 10 × optimal ÷ current cost.",
              "Nodes held, each with its reason and its fix.",
              [
                "It honours the markers you already use: ",
                { code: "karpenter.sh/do-not-disrupt" },
                " and ",
                { code: "cluster-autoscaler.kubernetes.io/safe-to-evict" },
                ".",
              ],
            ],
          },
        ],
      },
      {
        id: "how-they-work-together-in-a-surge",
        title: "How they work together in a surge",
        blocks: [
          {
            kind: "p",
            text: "Load rises and the HPA adds pods. While the HPA is scaling up and below its max, Coral holds back its own surge and CPU-pressure raises, and pauses pod replacements until every pod is Ready; an OOM kill still raises memory at once. Pods that don’t fit stay pending, and your node autoscaler adds nodes. Karpenter and NAP can pick bigger machines. Coral keeps no idle spare nodes: the headroom sits inside each pod’s request. When load falls, the HPA removes pods, Coral drains the nodes that empty out, and your autoscaler removes them.",
          },
        ],
      },
      {
        id: "what-coral-doesnt-do",
        title: "What Coral doesn’t do",
        blocks: [
          {
            kind: "ul",
            items: [
              "Create machines for demand, or change your autoscaler’s settings.",
              "Edit your manifests, pod templates or Git sources.",
              "Forecast. Coral reacts to live usage, and its longest look-back is 8\u00a0days. For a known event, set minimums, or pause node optimization and the Evictor.",
              "Read latency or error rates. It reacts to OOM kills, failing probes and CPU pressure.",
              "Lower the CPU or memory limits of regular pods.",
            ],
          },
        ],
      },
    ],
    help: {
      title: "How Coral helps",
      text: "Coral sizes requests to real use on AKS and EKS, works with your HPA, and drains spare nodes for your autoscaler to remove. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
      links: [
        { label: "Kubernetes cost optimization with Coral", href: routes.coral },
        { label: "Estimate your saving", href: `${routes.assessment}?p=coral` },
      ],
    },
    /* The article names no titles for its sources, so each prints its address. */
    sources: [
      { url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" },
      { url: "https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler" },
      { url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md" },
      { url: "https://keda.sh/docs/" },
      { url: "https://karpenter.sh/docs/" },
      { url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning" },
    ],
    related: [
      {
        title: "VPA vs HPA: rebalance first, then scale out",
        where: "Learn",
        href: routes.learnVpaVsHpa,
      },
      {
        title: "Nodes and spare capacity",
        where: "Coral FAQ",
        href: `${routes.coralFaq}#nodes-and-spare-capacity`,
      },
      {
        title: "Labels and annotations",
        where: "Coral product guide",
        href: `${routes.coralGuide}#labels-and-annotations`,
      },
    ],
  },
  "shrink-azure-managed-disk": {
    id: "shrink-azure-managed-disk",
    route: routes.learnShrinkAzureDisk,
    updated: "Updated 9 October 2026",
    product: "amoeba",
    meta: {
      title: "Can you shrink an Azure managed disk?",
      description:
        "No, not in place: Azure managed disks and Amazon EBS volumes only grow. The manual copy route, its downtime, and how Amoeba resizes a pool online.",
    },
    hero: {
      title: "Can you shrink an Azure managed disk?",
      deck: "Not in place. What works instead, what it costs you, and how Amoeba does it online.",
    },
    /* The /learn card's line (the hub mock's, in the house words: Amoeba rightsizes, autonomously, without any downtime). */
    card: "Not in place. The manual copy route, and how Amoeba rightsizes a pool autonomously, without any downtime.",
    short:
      "No, not in place. Azure lets you make a managed disk larger but never smaller: Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss.” To pay for less space, you copy the data to a new, smaller disk and switch over. Amazon Elastic Block Store (EBS) volumes work the same way.",
    sections: [
      {
        id: "why-the-space-you-bought-stays-on",
        title: "Why the space you bought stays on the bill",
        blocks: [
          {
            kind: "p",
            text: "A managed disk is billed on the size you provision, not on the data it holds. Premium SSD and Standard SSD are billed by size tier, so a 512\u00a0GiB Premium SSD costs the same whether it holds 500\u00a0GiB or 5\u00a0GiB. Premium SSD v2 is billed for the GiB you provision, plus any IOPS and throughput above its included 3,000 IOPS and 125 MB/s.",
          },
          {
            kind: "p",
            text: "Disks grow for good reasons: a migration, a bulk import, a log spike, a busy season. Growing is easy. Azure can expand many data disks without stopping the VM, and you then grow the partition and the filesystem. When the data shrinks again, the space stays, and so does the charge.",
          },
          {
            kind: "p",
            text: "The worked example on the Amoeba page shows the effect: a Linux VM with four 512\u00a0GiB Premium SSD data disks, 2,048\u00a0GiB in all, holding 1,000\u00a0GiB of data. More than half of what is billed is empty.",
          },
        ],
      },
      {
        id: "why-a-disk-cant-shrink-in-place",
        title: "Why a disk can’t shrink in place",
        blocks: [
          {
            kind: "p",
            text: "A disk is a block device, and the filesystem on it can place data in any block, including the last ones. Cutting the end off the device would cut through that data. Shrinking safely means the filesystem first moves its data away from the end, and Azure can’t do that from outside your VM. Some filesystems can’t shrink at all: XFS can only grow.",
          },
        ],
      },
      {
        id: "the-manual-route-copy-to-a-smaller",
        title: "The manual route: copy to a smaller disk",
        blocks: [
          { kind: "p", text: "For a data disk on a Linux VM, the usual route is a copy:" },
          {
            kind: "steps",
            items: [
              "Create a managed disk at the size you want and attach it to the VM.",
              "Partition it, create a filesystem and mount it at a temporary path.",
              ["Copy the data with ", { code: "rsync" }, " while the application keeps running."],
              "Stop every service that writes to the old mount.",
              ["Run ", { code: "rsync" }, " again to copy what changed since the first pass."],
              [
                "Point ",
                { code: "/etc/fstab" },
                " at the new disk’s UUID and mount it at the old path.",
              ],
              "Start the services and check them.",
              "Snapshot the old disk, detach it, and delete it when you no longer need it.",
            ],
          },
          { kind: "p", text: "What it costs you:" },
          {
            kind: "ul",
            items: [
              "Downtime from step 4 to step 7, for every service on that mount.",
              [
                "Risk: a mistake in ",
                { code: "/etc/fstab" },
                " can stop the VM from booting, so add the ",
                { code: "nofail" },
                " option and test a reboot.",
              ],
              "Both disks on the bill while you work.",
              "A new fixed size. When the data grows, you expand again. When it shrinks, you copy again.",
            ],
          },
          {
            kind: "p",
            text: "This covers data disks. Shrinking an OS disk is a harder job, and Amoeba works on data disks only.",
          },
        ],
      },
      {
        id: "how-amoeba-does-it-online",
        title: "How Amoeba does it online",
        blocks: [
          {
            kind: "p",
            text: "Amoeba turns the copy into a one-time move, then resizes online from there.",
          },
          {
            kind: "ul",
            items: [
              [
                { b: "The pool." },
                " Amoeba installs its agent through Azure Run Command and builds one pool beside your disks, sized to the data on the VM’s data mounts plus 20%, and at least 50\u00a0GiB larger than the data. The pool is one btrfs filesystem across several managed disks, and each data mount keeps its path.",
              ],
              [
                { b: "The copy." },
                " The agent copies each data mount onto the pool inside the VM, then copies what changed until the pool has caught up. The copy slows down or waits when the VM’s disks are busy.",
              ],
              [
                { b: "The switch." },
                " The agent stops the systemd services that hold the data mounts open, checks that nothing is left to copy, backs up ",
                { code: "/etc/fstab" },
                " and mounts the pool at the same paths. Then it starts the services again. That restart is the service interruption. It happens again only if you go back or Amoeba retries a failed switch.",
              ],
              [
                { b: "The soak." },
                " For 48\u00a0hours Amoeba watches the pool, and “Go back” returns the VM to its source disks. After the soak, each source disk is snapshotted, then deleted once its snapshot is complete. The snapshot is kept for 7\u00a0days.",
              ],
              [
                { b: "After the move." },
                " When data grows, Amoeba adds a disk to the pool, or grows one in place, without unmounting. When data shrinks, it moves one disk’s data onto the others, checks it, removes the disk from the filesystem, then detaches and deletes it, which stops its billing. A disk leaves the pool only when it is empty.",
              ],
            ],
          },
          {
            kind: "p",
            text: "On Linux, Amoeba needs systemd, kernel 5.14 or later, btrfs, and a VM size with at least 8 data-disk slots. VMs in the Red Hat family are not moved.",
          },
        ],
      },
      {
        id: "what-about-amazon-ebs",
        title: "What about Amazon EBS?",
        blocks: [
          {
            kind: "p",
            text: "The same rule holds on AWS. Elastic Volumes let you increase an EBS volume’s size, change its type or adjust its performance while it stays attached, but not decrease its size. The manual route above works the same way.",
          },
          {
            kind: "p",
            text: "Amoeba does the same job on AWS. It pools the non-root EBS data volumes of running EC2 instances onto gp3 volumes in the instance’s Availability Zone, installs its agent through AWS Systems Manager, and takes an EBS snapshot of each source volume before deleting it.",
          },
        ],
      },
    ],
    help: {
      title: "How Amoeba helps",
      text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then expands and shrinks it online, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment reads your Azure VMs and managed disks and works out your own figure.",
      links: [
        { label: "Block storage cost optimization with Amoeba", href: routes.amoeba },
        { label: "Estimate your saving", href: `${routes.assessment}?p=amoeba` },
      ],
    },
    sources: [
      {
        publisher: "Microsoft Learn",
        title: "“Expand virtual hard disks on a Linux VM”",
        url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
      },
      {
        publisher: "Microsoft Learn",
        title: "“Azure managed disk types”",
        url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
      },
      {
        publisher: "AWS",
        title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
        url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
      },
    ],
    related: [
      {
        title: "How the pool is sized",
        where: "Amoeba product guide",
        href: `${routes.amoebaGuide}#how-the-pool-is-sized`,
      },
      {
        title: "Is there downtime?",
        where: "Amoeba FAQ",
        href: `${routes.amoebaFaq}#is-there-downtime`,
      },
      {
        title: "Can a shrink lose data?",
        where: "Amoeba FAQ",
        href: `${routes.amoebaFaq}#can-a-shrink-lose-data`,
      },
    ],
  },
  "poor-architecture-cloud-bill": {
    id: "poor-architecture-cloud-bill",
    route: routes.learnPoorArchitecture,
    updated: "Updated 14 October 2026",
    author: {
      name: "Vineet",
      role: "Infrastructure engineer",
      url: "https://www.linkedin.com/in/yadavvineet/",
    },
    product: "coral",
    meta: {
      title: "How poor architecture increases your cloud bill",
      description:
        "Cloud waste is often an architecture problem, not a billing problem: VMs vs containers, where poor design adds cost, and how one client cut compute 44%.",
    },
    hero: {
      title: "How Poor Infrastructure Architecture Quietly Increases Your Cloud Bill",
      deck: "Why cloud waste is often an architecture problem, not a billing problem.",
    },
    card: "Why cloud waste is often an architecture problem, not a billing problem.",
    lead: [
      {
        kind: "p",
        text: "Cloud cost optimization is not just about choosing cheaper resources. It starts with making better architectural decisions.",
      },
      {
        kind: "p",
        text: "During a recent cloud cost optimization engagement, we came across an interesting infrastructure decision: instead of deploying containerized applications, the client was running workloads on virtual machines (VMs).",
      },
      {
        kind: "p",
        text: "At first glance, there was nothing obviously wrong with this setup. The applications were running, the infrastructure was available, and the workloads were being served.",
      },
      {
        kind: "p",
        text: "But when we looked at the architecture from a cost optimization perspective, an important question came up:",
      },
      {
        kind: "quote",
        text: "Are we paying for the computing power our applications actually need, or are we paying for the way we chose to architect them?",
      },
      { kind: "p", text: "That question is at the heart of cloud cost optimization." },
      {
        kind: "image",
        src: "/articles/vm-vs-kubernetes-cloud-cost-infographic.webp",
        srcset:
          "/articles/vm-vs-kubernetes-cloud-cost-infographic-700.webp 700w, /articles/vm-vs-kubernetes-cloud-cost-infographic.webp 1400w",
        alt: "Infographic comparing the VM approach, where each app runs on its own VM with fixed resources even when idle, with the Kubernetes approach, where containers share a compute pool, plus when to use each.",
        caption:
          "Dedicated VMs versus containers on a shared compute pool, and when each one fits.",
        width: 1400,
        height: 933,
      },
    ],
    sections: [
      {
        id: "the-hidden-cost-of-architectural-decisions",
        title: "The hidden cost of architectural decisions",
        blocks: [
          {
            kind: "p",
            text: "Cloud providers make it easy to provision infrastructure. You can spin up a VM in minutes, increase its CPU and memory, and deploy your application.",
          },
          {
            kind: "p",
            text: "The problem is that provisioning infrastructure is easy. Designing it efficiently is much harder.",
          },
          {
            kind: "p",
            text: "Consider a typical application deployed on virtual machines. You provision a VM with 8 vCPUs and 32 GB of RAM to handle peak traffic. However, during most of the day, the application uses only a fraction of those resources. You continue paying for the provisioned capacity even when the workload does not fully use it.",
          },
          {
            kind: "p",
            text: "Now imagine several applications, each running on its own VM with individually allocated resources and limited flexibility to scale.",
          },
          {
            kind: "p",
            text: "Over time, unused capacity accumulates. Development and testing environments remain running. Scaling becomes a manual exercise. Teams provision additional infrastructure to handle traffic spikes but rarely revisit their original allocations.",
          },
          {
            kind: "p",
            text: "Individually, these decisions might appear reasonable. Collectively, they can become a significant source of cloud waste.",
          },
          {
            kind: "p",
            text: "The issue is not necessarily the VM itself. It is the architecture and operating model surrounding it.",
          },
        ],
      },
      {
        id: "vms-versus-containers-understanding-the-architectural-trade-off",
        title: "VMs versus containers: understanding the architectural trade-off",
        blocks: [
          {
            kind: "p",
            text: "A VM runs its own operating system environment on virtualized infrastructure. A container packages an application and its dependencies while sharing the host operating system’s kernel. This difference creates opportunities for more efficient resource utilization.",
          },
          {
            kind: "p",
            text: "With a VM-centric architecture, teams often allocate resources to individual application environments. Depending on the design, that capacity may remain reserved even when the application is idle.",
          },
          {
            kind: "p",
            text: "With a containerized architecture, multiple application containers can run on a shared pool of compute resources. An orchestrator such as Kubernetes can schedule workloads according to their resource requests, constraints and availability requirements.",
          },
          {
            kind: "image",
            src: "/articles/dedicated-vms-vs-shared-pool.svg",
            alt: "Five apps, each on its own mostly idle VM, compared with the same five apps sharing one pool of capacity with headroom, so fewer machines are needed.",
            caption:
              "The same five apps on dedicated VMs, and on a shared pool sized for their combined demand. Illustration, not to scale.",
            width: 1400,
            height: 720,
          },
          { kind: "p", text: "This can enable:" },
          {
            kind: "ul",
            items: [
              [
                { b: "Better resource utilization:" },
                " multiple workloads can share the underlying compute capacity.",
              ],
              [
                { b: "More flexible scaling:" },
                " applications can scale independently based on demand.",
              ],
              [
                { b: "Improved workload placement:" },
                " an orchestrator can schedule containers across available nodes.",
              ],
              [
                { b: "More consistent deployments:" },
                " standardized packaging simplifies application delivery across environments.",
              ],
              [
                { b: "Greater visibility:" },
                " resource requests, limits and workload metrics help teams identify overprovisioning.",
              ],
            ],
          },
          { kind: "p", text: "However, containers do not automatically reduce cloud costs." },
          {
            kind: "p",
            text: "A poorly configured Kubernetes cluster with oversized nodes, excessive replicas, unrealistic resource requests and idle environments can cost more than a well-designed VM-based architecture. The most common form of this waste is resource requests: pods reserving more CPU and memory than they ever use, so the cluster keeps buying nodes for capacity nobody consumes.",
          },
          {
            kind: "p",
            text: [
              "We see this in our own environment too. ",
              {
                a: "On our own Kubernetes development cluster",
                href: routes.caseStudyCoralDevCluster,
              },
              ", the applications were reserving almost twice the CPU they actually needed. Right-sizing their requests, removing an idle node and rebalancing onto a cheaper machine ",
              {
                a: "cut the cluster’s machine bill by 58% in eight days",
                href: routes.caseStudyCoralDevCluster,
              },
              ".",
            ],
          },
          {
            kind: "p",
            text: "The goal is not to replace every VM with a container. The goal is to select an architecture that matches the workload and uses provisioned resources efficiently.",
          },
        ],
      },
      {
        id: "where-poor-architecture-translates-into-higher-costs",
        title: "Where poor architecture translates into higher costs",
        blocks: [
          {
            kind: "h3",
            id: "overprovisioning-compute-and-storage",
            title: "1. Overprovisioning compute and storage",
          },
          {
            kind: "p",
            text: "When applications are sized for their theoretical peak requirements instead of measured demand, organizations often pay for capacity that remains unused.",
          },
          {
            kind: "p",
            text: "For example, an application might require substantial resources during a short processing window but consume very little for the rest of the day. A permanently oversized VM can be an inefficient solution for that workload. Depending on the application’s characteristics, alternatives could include smaller, right-sized VMs, scheduled scaling, containers or serverless compute.",
          },
          {
            kind: "p",
            text: [
              "The same pattern shows up in storage. Disks are often sized for the largest dataset a team expects, and ",
              {
                a: "Azure managed disks and AWS EBS volumes can grow but cannot be shrunk in place",
                href: routes.learnShrinkAzureDisk,
              },
              ". Capacity bought for a one-time peak can stay on the bill for years.",
            ],
          },
          { kind: "p", text: "The right answer comes from workload analysis, not assumptions." },
          {
            kind: "h3",
            id: "running-workloads-in-isolation-when-they-could",
            title: "2. Running workloads in isolation when they could share capacity",
          },
          {
            kind: "p",
            text: "Deploying every application on a separate VM can make sense when isolation, security, licensing or operational requirements demand it.",
          },
          {
            kind: "p",
            text: "But when workloads are compatible and have complementary resource patterns, dedicated infrastructure may introduce unnecessary fragmentation. Containerization can allow multiple workloads to share a compute pool while retaining application-level separation.",
          },
          {
            kind: "p",
            text: "The potential savings come from reducing unused capacity and improving packing efficiency, not simply from using containers.",
          },
          {
            kind: "h3",
            id: "scaling-infrastructure-instead-of-optimizing-applications",
            title: "3. Scaling infrastructure instead of optimizing applications",
          },
          {
            kind: "p",
            text: "Sometimes the easiest response to performance issues is to increase CPU and memory.",
          },
          {
            kind: "p",
            text: "But what if the real problem is inefficient database queries, memory leaks, excessive logging, unnecessary background processing or poor caching?",
          },
          {
            kind: "p",
            text: "Adding infrastructure may temporarily improve performance, but it can also hide the underlying issue and increase recurring costs. An engineering-led cost review should examine application performance alongside infrastructure utilization.",
          },
          {
            kind: "h3",
            id: "ignoring-non-production-environments",
            title: "4. Ignoring non-production environments",
          },
          {
            kind: "p",
            text: "Development, QA, staging and temporary testing environments can quietly consume resources around the clock.",
          },
          {
            kind: "p",
            text: "If those environments do not need to run continuously, scheduled shutdowns, automated environment provisioning and cleanup policies can deliver savings without changing the production architecture. This is often one of the simplest opportunities to investigate before undertaking a major migration.",
          },
          {
            kind: "h3",
            id: "designing-for-peak-traffic-without-a-scaling",
            title: "5. Designing for peak traffic without a scaling strategy",
          },
          {
            kind: "p",
            text: "Production systems must handle traffic spikes, but keeping enough infrastructure running for the absolute peak at all times may be unnecessarily expensive.",
          },
          {
            kind: "p",
            text: "Depending on the workload, horizontal scaling, autoscaling, queue-based processing and asynchronous execution can help align capacity with actual demand. The architecture must still preserve availability, acceptable latency and resilience during scaling events.",
          },
          { kind: "p", text: "Cost optimization should never mean compromising reliability." },
        ],
      },
      {
        id: "how-we-approach-cloud-cost-optimization-as",
        title: "How we approach cloud cost optimization as engineers",
        blocks: [
          {
            kind: "p",
            text: "When investigating an infrastructure bill, the first step should not be to start changing VM sizes or migrating applications. It should be to understand the relationship between architecture, workload behavior and spending.",
          },
          { kind: "p", text: "Our engineering approach follows a few fundamental steps." },
          { kind: "h3", id: "establish-a-baseline", title: "1. Establish a baseline" },
          {
            kind: "p",
            text: "Review cloud expenditure, compute utilization, CPU and memory metrics, traffic patterns, storage, network charges and environment-level spending. Identify which workloads contribute most to the bill and when their resource consumption actually occurs.",
          },
          { kind: "h3", id: "understand-the-workload", title: "2. Understand the workload" },
          {
            kind: "p",
            text: "Determine whether the application is CPU-intensive, memory-intensive, traffic-driven, batch-oriented or continuously running. A stateless web service, a stateful database and a nightly batch-processing job should not automatically receive the same infrastructure design.",
          },
          {
            kind: "h3",
            id: "compare-realistic-architecture-options",
            title: "3. Compare realistic architecture options",
          },
          {
            kind: "p",
            text: "Evaluate whether the workload is best suited to VMs, containers, managed container platforms, serverless services or a hybrid approach. Include migration effort, platform operating costs, licensing, observability, networking, security and operational complexity in the comparison.",
          },
          { kind: "h3", id: "model-the-expected-savings", title: "4. Model the expected savings" },
          {
            kind: "p",
            text: "Estimate the difference between the existing setup and the proposed architecture. Account for actual resource demand, high availability, autoscaling headroom, idle capacity and any additional platform costs.",
          },
          {
            kind: "p",
            text: "Avoid comparing only the price of one VM with the price of a container. They are not equivalent units of infrastructure.",
          },
          {
            kind: "h3",
            id: "validate-through-measurement",
            title: "5. Validate through measurement",
          },
          {
            kind: "p",
            text: "Run a representative workload test or controlled pilot where possible. Compare cost per request, cost per transaction, resource utilization, latency, error rates and availability.",
          },
          {
            kind: "p",
            text: "A lower monthly bill is useful. A lower cost while maintaining the required service level is a much stronger result.",
          },
          {
            kind: "h3",
            id: "prevent-the-same-waste-from-returning",
            title: "6. Prevent the same waste from returning",
          },
          {
            kind: "p",
            text: "Introduce resource tagging, budgets, utilization alerts, right-sizing reviews, autoscaling policies and infrastructure standards. Cost optimization should become part of the engineering lifecycle rather than a one-time exercise.",
          },
        ],
      },
      {
        id: "what-we-found-in-that-engagement",
        title: "What we found in that engagement",
        blocks: [
          {
            kind: "p",
            text: "The client was running 12 applications on 18 VMs: six customer-facing services on two VMs each, four internal services on one VM each, and two databases. The services ran on 4 vCPU, 16 GB general-purpose machines and the databases on 8 vCPU, 32 GB ones. Over 30 days, their average CPU utilization was 11% and memory utilization 31%.",
          },
          {
            kind: "p",
            text: "We moved the 16 service VMs onto one managed Kubernetes cluster of four 8 vCPU, 32 GB nodes spread across availability zones, with each service sized from its measured usage and the customer-facing ones scaling out on demand. The two databases stayed on VMs, moving to memory-optimized 4 vCPU machines with the same 32 GB of RAM.",
          },
          {
            kind: "p",
            text: "The monthly compute bill, at on-demand prices, went from about $2,800 to about $1,560, a 44% reduction, while p95 latency, error rates and availability stayed within the client’s targets through a two-week side-by-side pilot.",
          },
          {
            kind: "note",
            text: "Figures are rounded, and some details are changed to keep the client anonymous.",
          },
        ],
      },
      {
        id: "the-bigger-lesson-cloud-waste-is-often",
        title: "The bigger lesson: cloud waste is often an architecture problem",
        blocks: [
          {
            kind: "p",
            text: "Cloud cost optimization is frequently treated as a finance exercise: review the bill, find expensive services, and negotiate or purchase discounts.",
          },
          {
            kind: "p",
            text: "Those activities can help, but they do not address every source of waste. Discounts can reduce the price of infrastructure. They cannot fix an application that has been overprovisioned for years. Monitoring can expose unused capacity. It cannot, by itself, redesign the system that created that capacity.",
          },
          {
            kind: "p",
            text: "The more sustainable approach is to bring engineering, architecture and FinOps together. Engineers understand how workloads behave. Architects determine how systems should be structured. FinOps helps connect technical decisions to business outcomes.",
          },
          {
            kind: "p",
            text: "When these perspectives work together, cloud cost optimization becomes an ongoing engineering discipline.",
          },
        ],
      },
      {
        id: "final-thoughts",
        title: "Final thoughts",
        blocks: [
          {
            kind: "p",
            text: "The lesson from our client engagement was not that VMs are bad or that containers are always better. It was that infrastructure decisions deserve to be challenged continuously.",
          },
          {
            kind: "p",
            text: "Why does this application need this much compute? Could workloads share resources safely? Does capacity need to run all day? Is the system scaling because demand has increased, or because the application itself is inefficient?",
          },
          {
            kind: "p",
            text: "These questions can reveal opportunities that are easy to miss when cloud cost optimization begins and ends with the billing dashboard.",
          },
          {
            kind: "p",
            text: "The most effective cloud cost optimization often starts before the next resource is provisioned, with a better architectural decision.",
          },
          {
            kind: "p",
            text: "What has your experience been? Have you seen cloud costs increase because of architectural decisions that initially seemed perfectly reasonable? We would love to hear your perspective.",
          },
          {
            kind: "note",
            text: [
              "Vineet is an infrastructure engineer at Zoorik and led the client engagement described here. Zoorik builds Kubernetes and block storage cost optimization for Azure and AWS. To see where your own cloud spend is going, try the free assessment at ",
              { a: "zoorik.com/assessment", href: routes.assessment },
              ".",
            ],
          },
        ],
      },
    ],
    related: [
      {
        title: "How we reduced our own cluster’s machine bill by 58%",
        where: "Case study",
        href: routes.caseStudyCoralDevCluster,
      },
      {
        title: "Can you shrink an Azure managed disk?",
        where: "Learn",
        href: routes.learnShrinkAzureDisk,
      },
      {
        title: "VPA vs HPA: rebalance first, then scale out",
        where: "Learn",
        href: routes.learnVpaVsHpa,
      },
    ],
  },
};

/** The /learn hub's order: Cloud cost, Kubernetes, Block storage. */
export const articleOrder: readonly ArticleId[] = [
  "poor-architecture-cloud-bill",
  "vpa-vs-hpa",
  "coral-and-native-autoscalers",
  "shrink-azure-managed-disk",
];
