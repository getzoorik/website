import { routes } from "@/config/site";

/**
 * The six works-with pages, one per tool Coral works with, each in the footer's "Works with" list:
 * /coral-works-with-cluster-autoscaler, -karpenter, -aks-node-auto-provisioning, -keda, -helm and -terraform. One
 * template draws all six (`WorksWithPage`): the eyebrow, the h1 and one line under it, then Who does what, How they
 * work together, What stays yours (Helm and Terraform only), Setup, Questions and Read more, then the closing row on
 * Coral.
 *
 * Rewritten on 2 Nov 2026 to the zero-noise standard: each fact once per page, short plain section names (the h1
 * already names the pair), one line under the h1. Text is markup-lite, set by `richText`: `code`, **bold** and
 * [text](href).
 *
 * 🔴 KEEP EVERY LINE TRUE, AND CLAIM NO TEST. Every claim traces to a line the site already publishes: the Coral guide,
 * the Coral FAQ, the install guides, the cloud pages, /trust. No figure, price, version, timing or internal name, and
 * no other cost-optimization vendor.
 */

/** The six pages print no day: the day their content last changed, for the sitemap. Move it in the PR that changes
 * it; a page changed on its own carries its own day. */
export const worksWithLastUpdated = "3 November 2026";

/** The words every works-with page shares: the eyebrow over the h1, and Who does what's first column. */
export const worksWith = {
  eyebrow: "Works with",
  job: "Job",
} as const;

/** A question and its answer's paragraphs. */
export interface WorksWithQuestion {
  readonly question: string;
  readonly answer: readonly string[];
}

export interface WorksWithCopy {
  readonly route: string;
  /** The day the page's content last changed, for the sitemap (the page prints none). */
  readonly lastUpdated: string;
  /** The `<title>` (through the site's "%s | Zoorik" template) and the description. */
  readonly meta: { readonly title: string; readonly description: string };
  /** The h1 ("Coral works with Karpenter") and the one line under it. */
  readonly hero: { readonly title: string; readonly deck: string };
  /** The names of the sections every page has; the optional third's is `leaves.title`. */
  readonly sections: {
    readonly who: string;
    readonly together: string;
    readonly setup: string;
    readonly questions: string;
    readonly readMore: string;
  };
  /** Who does what: the tool's column ("Cluster Autoscaler", "NAP"), and each row's job, the tool's part and
   * Coral's. */
  readonly who: {
    readonly tool: string;
    readonly rows: readonly (readonly [string, string, string])[];
  };
  /** How they work together: the numbered steps. */
  readonly together: readonly string[];
  /** What stays yours, at `#leaves`: only on Helm and Terraform (2 Nov 2026). On the other four pages each line
   * repeated the table or the questions, so its facts moved there. */
  readonly leaves?: { readonly title: string; readonly items: readonly string[] };
  readonly setup: readonly string[];
  readonly questions: readonly WorksWithQuestion[];
  /** Each line a link, then what it holds. */
  readonly readMore: readonly string[];
}

export type WorksWithId =
  "clusterAutoscaler" | "karpenter" | "nodeAutoProvisioning" | "keda" | "helm" | "terraform";

/** The section names every page shares: the h1 already names the pair. */
const sections = {
  who: "Who does what",
  together: "How they work together",
  setup: "Setup",
  questions: "Questions",
  readMore: "Read more",
} as const;

/** The answer Karpenter and NAP share on `karpenter.sh/do-not-disrupt`. */
const doNotDisrupt: WorksWithQuestion = {
  question: "Does Coral respect `karpenter.sh/do-not-disrupt`?",
  answer: [
    "Yes. Coral never moves a marked pod and keeps its node, and it keeps a marked node. See [which tool reads which marker](/learn/safe-to-evict-do-not-disrupt).",
  ],
};

/** In the footer's order. */
export const worksWithPages: Readonly<Record<WorksWithId, WorksWithCopy>> = {
  clusterAutoscaler: {
    route: routes.coralWorksWithClusterAutoscaler,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Cluster Autoscaler on EKS and AKS with Coral",
      description:
        "How the Kubernetes Cluster Autoscaler and Coral work together on EKS and AKS: Coral empties spare nodes, and the autoscaler removes them.",
    },
    hero: {
      title: "Coral works with Cluster Autoscaler",
      deck: "On EKS and AKS, Coral empties spare nodes and the Cluster Autoscaler removes them. Coral never adds nodes.",
    },
    sections,
    who: {
      tool: "Cluster Autoscaler",
      rows: [
        [
          "Pod requests",
          "Reads them to decide which nodes to add or remove.",
          "Rebalances them to real use.",
        ],
        [
          "Adding nodes",
          "Grows a node pool or Auto Scaling group when pods can’t be scheduled.",
          "Never adds nodes.",
        ],
        [
          "Removing spare nodes",
          "Removes an underused node whose pods fit elsewhere, on its own timers.",
          "Empties spare nodes one at a time and hands each one to the autoscaler.",
        ],
        [
          "Pool minimums",
          "Keeps each pool at or above its minimum.",
          "By default, may reduce a minimum that alone keeps an emptied node. Never raises one, and disconnect puts it back.",
        ],
        [
          "Moving to cheaper machines",
          "Picks only among the node groups you set up.",
          "Needs Karpenter or AKS node auto provisioning (NAP). With only the Cluster Autoscaler, Coral keeps each pool’s machine size.",
        ],
      ],
    },
    together: [
      "Switch on “Automatically optimize”, and Coral rebalances each container’s CPU and memory requests to real use.",
      "Coral checks on the live cluster that every pod on a spare node fits on another node.",
      "It drains one node at a time, within your PodDisruptionBudgets.",
      "After the “Wait before removing empty nodes” delay, it hands the empty node to the Cluster Autoscaler, whose own timers decide when it goes.",
    ],
    setup: [
      "**Your autoscaler stays.** Connect leaves the Cluster Autoscaler in place. It sets up NAP or Karpenter only on a cluster with no autoscaler.",
      "**Permission to remove nodes.** Without it, pools the Cluster Autoscaler runs are still optimized. Fixed-size pools wait for `zoorikctl cluster grant-node-deletion`.",
      "**Terraform.** [Our modules](/coral-works-with-terraform) can leave out the permission to change a minimum. If Terraform manages your node pools, tell it to ignore what the agent changes, as [the install guide](/docs/install-coral-with-terraform#your-own-node-pool-code) shows.",
      "**A careful start.** Node optimization and the Evictor, which moves pods off lightly used nodes, start at connect. Turn on the Evictor’s “Dry run” and switch off the pools you want left alone.",
    ],
    questions: [
      {
        question: "Does the Cluster Autoscaler use requests or actual usage?",
        answer: [
          "Requests. It adds nodes for pods that can’t be scheduled, and removes underused nodes whose pods fit elsewhere, judging both by CPU and memory requests. Oversized requests keep nodes running until Coral rebalances them.",
        ],
      },
      {
        question: "What about pools the Cluster Autoscaler doesn’t run?",
        answer: [
          "In a fixed-size pool that nothing else manages, Coral deletes the emptied machine itself.",
        ],
      },
      {
        question: "What happens in a sudden surge?",
        answer: [
          "The HPA adds pods, and the pending pods make the Cluster Autoscaler add nodes. Coral keeps no idle spare nodes: the headroom sits inside each pod’s request.",
        ],
      },
    ],
    readMore: [
      "[Coral guide: Node optimization](/coral-guide#node-optimization): how Coral empties nodes and who removes them.",
      "[Cluster Autoscaler not scaling down](/learn/cluster-autoscaler-not-scaling-down): why an underused node stays, and the fix.",
      "[Karpenter vs Cluster Autoscaler](/learn/karpenter-vs-cluster-autoscaler): which autoscaler to run on EKS or AKS.",
      "[Coral works with Karpenter](/coral-works-with-karpenter): moving work to cheaper machines on EKS.",
      "[Coral works with AKS node auto provisioning](/coral-works-with-aks-node-auto-provisioning): moving work to cheaper machines on AKS.",
    ],
  },
  karpenter: {
    route: routes.coralWorksWithKarpenter,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with Karpenter",
      description:
        "Karpenter launches machines to fit pod requests. Coral rebalances those requests to real use, so Karpenter can run fewer or smaller nodes on EKS.",
    },
    hero: {
      title: "Coral works with Karpenter",
      deck: "Karpenter picks machines from pod requests. Coral rebalances those requests to real use, so Karpenter can run fewer or smaller nodes.",
    },
    sections,
    who: {
      tool: "Karpenter",
      rows: [
        ["Pod requests", "Reads them to pick machines.", "Rebalances them to real use."],
        ["Adding nodes", "Launches machines for pending pods.", "Never adds nodes for demand."],
        [
          "Removing spare nodes",
          "Consolidates the pools it is set to consolidate.",
          "Leaves those pools to Karpenter. In other pools, empties spare nodes for your autoscaler to remove.",
        ],
        [
          "Moving to cheaper machines",
          "Launches the new machines.",
          "Plans the move, adds fixed-size NodePools, then drains and removes the old nodes.",
        ],
        [
          "NodePools and node classes",
          "Uses yours as you set them.",
          "Never changes yours. Changes only the NodePools it adds for a rebalance.",
        ],
      ],
    },
    together: [
      "Switch on “Automatically optimize”, and Coral rebalances each pod’s CPU and memory requests to real use.",
      "With smaller requests, Karpenter can consolidate its pools onto fewer or smaller nodes.",
      "To move work to cheaper machines, choose the nodes to replace. Coral’s plan shows the cost before and after.",
      "Coral adds fixed-size NodePools, Karpenter launches the machines, and Coral drains and removes the old nodes one by one.",
    ],
    setup: [
      "**Karpenter already runs.** Connect leaves it as it is and adds only [the permission to remove nodes](/eks-cost-optimization#setup), as on every EKS cluster.",
      "**No node autoscaler.** Connect offers to install Karpenter. It lists every cloud change and asks first, and `--dry-run` changes nothing. You can also run `zoorikctl cluster prepare` later.",
      "**What that install adds.** In AWS: IAM roles, an SQS queue with EventBridge rules, discovery tags, an access entry and Pod Identity. In the cluster: Karpenter, its node classes and a default NodePool.",
      "**What it needs.** Helm, and AWS rights for SQS, EventBridge and cluster updates, on top of the IAM rights every EKS connect needs.",
      "**Clusters on aws-auth only.** Installing Karpenter switches authentication to `API_AND_CONFIG_MAP`, and that can’t be undone.",
    ],
    questions: [
      {
        question: "What does a rebalance need on EKS?",
        answer: [
          "Karpenter, Node optimization on, and the permission to remove nodes, which connect asks for. With only the [Cluster Autoscaler](/coral-works-with-cluster-autoscaler), Coral removes nodes but keeps their size.",
        ],
      },
      {
        question: "Can Karpenter pick bigger machines in a surge?",
        answer: [
          "Yes. Your HPA adds pods, the pending pods trigger Karpenter, and it can pick bigger machines. Coral never adds capacity for demand.",
        ],
      },
      doNotDisrupt,
      {
        question: "What stays after disconnect?",
        answer: [
          "Karpenter stays if connect installed it, and so do Coral’s `zoorik-base` node class and rebalancing NodePools.",
        ],
      },
    ],
    readMore: [
      "[Coral guide: Rebalancing](/coral-guide#rebalancing): what a rebalance needs and how it runs.",
      "[What is Karpenter](/learn/what-is-karpenter): how it picks and removes nodes.",
      "[Karpenter consolidation](/learn/karpenter-consolidation): its policies, budgets and limits.",
      "[Coral works with AKS node auto provisioning](/coral-works-with-aks-node-auto-provisioning): the same on AKS, where NAP runs Karpenter for you.",
      "[Coral works with KEDA](/coral-works-with-keda): KEDA sets the pod count, and Coral each pod’s requests.",
    ],
  },
  nodeAutoProvisioning: {
    route: routes.coralWorksWithNodeAutoProvisioning,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with AKS node auto provisioning",
      description:
        "AKS node auto provisioning (NAP) picks machines from pod requests. Coral rebalances those requests to real use, so NAP can run fewer or smaller nodes.",
    },
    hero: {
      title: "Coral works with AKS node auto provisioning",
      deck: "Node auto provisioning (NAP) runs Karpenter for you. Coral rebalances the pod requests it reads, so NAP can run fewer or smaller nodes.",
    },
    sections,
    who: {
      tool: "NAP",
      rows: [
        ["Pod requests", "Reads them to pick machines.", "Rebalances them to real use."],
        ["Adding nodes", "Launches machines for pending pods.", "Never adds nodes for demand."],
        [
          "Removing spare nodes",
          "Consolidates the pools it is set to consolidate.",
          "Leaves those pools to NAP. In other pools, empties spare nodes for your autoscaler to remove.",
        ],
        [
          "Moving to cheaper machines",
          "Launches the new machines.",
          "Plans the move, adds fixed-size NodePools, then drains and removes the old nodes.",
        ],
        [
          "NodePools and node classes",
          "Uses yours as you set them.",
          "Never changes yours. Changes only the NodePools it adds for a rebalance.",
        ],
      ],
    },
    together: [
      "Switch on “Automatically optimize”, and Coral rebalances each container’s CPU and memory requests to real use.",
      "With smaller requests, NAP can consolidate its pools onto fewer or smaller nodes.",
      "To move work to cheaper machines, choose the nodes to replace. Coral’s plan shows the cost before and after.",
      "Coral adds fixed-size NodePools, NAP launches the machines, and Coral drains and removes the old nodes one by one.",
    ],
    setup: [
      "**No autoscaler yet.** Connect offers to turn on NAP and adds Coral’s node class `zoorik-base`. It lists every cloud change and asks first.",
      "**Azure CNI.** NAP needs Azure CNI networking, not kubenet. On kubenet with no autoscaler, nothing adds nodes until you set one up.",
      "**Cluster Autoscaler already runs.** Connect leaves it in place, doesn’t turn on NAP, and sets up only [the permission to remove nodes](/aks-cost-optimization#setup). Moving work to cheaper machines then needs NAP or Karpenter.",
      "**Workload identity.** For the permission to remove nodes, connect turns on workload identity and the OIDC issuer if they are off. The OIDC issuer can’t be turned off again.",
      "**Turn on NAP later.** If you decline at connect, `zoorikctl cluster prepare` turns it on when you are ready.",
    ],
    questions: [
      {
        question: "What does a rebalance need on AKS?",
        answer: [
          "NAP or Karpenter, Node optimization on, and the permission to remove nodes, which connect asks for.",
        ],
      },
      {
        question: "Can NAP pick bigger machines in a surge?",
        answer: [
          "Yes. Your HPA adds pods, the pending pods trigger NAP, and it can pick bigger machines. Coral never adds capacity for demand.",
        ],
      },
      doNotDisrupt,
      {
        question: "What stays after disconnect?",
        answer: [
          "NAP stays if connect turned it on, and so do Coral’s `zoorik-base` node class and rebalancing NodePools. Workload identity and the OIDC issuer stay on too.",
        ],
      },
    ],
    readMore: [
      "[Coral guide: Rebalancing](/coral-guide#rebalancing): what a rebalance needs and how it runs.",
      "[AKS node auto provisioning](/learn/aks-node-auto-provisioning): what NAP is, and how to turn it on or off.",
      "[Coral works with Cluster Autoscaler](/coral-works-with-cluster-autoscaler): for AKS clusters that run it.",
      "[Coral works with Karpenter](/coral-works-with-karpenter): the same on EKS.",
    ],
  },
  keda: {
    route: routes.coralWorksWithKeda,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with KEDA",
      description:
        "KEDA sets how many pods run. Coral rebalances each pod's CPU and memory requests and never takes over the HPA that KEDA creates.",
    },
    hero: {
      title: "Coral works with KEDA",
      deck: "KEDA sets how many pods run. Coral rebalances each pod’s CPU and memory requests, so the pods fit on fewer nodes.",
    },
    sections,
    who: {
      tool: "KEDA",
      rows: [
        [
          "Pod count",
          "Sets it from its triggers through the HPA it creates, and can scale to zero.",
          "Never takes over or changes KEDA’s HPA, and adds no HPA of its own.",
        ],
        ["Pod requests", "Doesn’t change them.", "Rebalances them to real use."],
        [
          "Moving a pod in a rebalance",
          "Its HPA starts a new copy when Coral raises the minimum.",
          "Raises the ScaledObject’s minimum while the pod moves, so a new copy is healthy on another node first. Then puts it back.",
        ],
        [
          "Spare nodes",
          "Doesn’t add or remove nodes.",
          "Empties them for your node autoscaler to remove.",
        ],
      ],
    },
    together: [
      "KEDA reads its triggers and sets the pod count through the HPA it creates.",
      "Coral reads your ScaledObjects, so it knows which HPAs KEDA owns and leaves them alone.",
      "With “Automatically optimize” on, Coral rebalances each pod’s CPU and memory requests to real use.",
    ],
    setup: [
      "**Nothing to install for KEDA.** Connect lets the agent read your ScaledObjects and, in a rebalance, change only their minimum and maximum. Admission policies limit what the agent may change.",
      "**Automation is opt-in.** Coral only recommends until you switch on “Automatically optimize” for a policy or a workload.",
      "**Rebalancing needs [Karpenter](/coral-works-with-karpenter) or [AKS node auto provisioning (NAP)](/coral-works-with-aks-node-auto-provisioning).** It also needs Node optimization on and the permission to remove nodes.",
    ],
    questions: [
      {
        question: "Does Coral change my ScaledObject?",
        answer: [
          "Only in a rebalance onto cheaper machines, and only its minimum and maximum, which it then puts back. Your triggers, other settings and Git stay as they are.",
        ],
      },
      {
        question: "Could smaller requests make KEDA add pods?",
        answer: [
          "It could, with a CPU or memory trigger on utilization. The same load then reads as higher use of a smaller request. For a CPU trigger on a ScaledObject that isn’t paused, Coral first replays recent load through its settings. A smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
        ],
      },
      {
        question: "What happens to KEDA’s pods when Coral empties a node?",
        answer: [
          "Outside a rebalance, Coral moves them by live migration where it can, or evicts them within their PodDisruptionBudget. To keep a pod and its node in place, mark the pod `karpenter.sh/do-not-disrupt`.",
        ],
      },
    ],
    readMore: [
      "[Coral guide: HPAs and VPAs](/coral-guide#hpas-and-vpas): which HPAs Coral creates, takes over or leaves alone.",
      "[What is KEDA](/learn/what-is-keda): scalers, ScaledObjects and scaling to zero.",
      "[Kubernetes HPA](/learn/glossary/horizontal-pod-autoscaler): the autoscaler KEDA creates and drives.",
      "[KEDA vs Karpenter](/learn/keda-vs-karpenter): pods, nodes and the requests in between.",
      "[Coral works with Karpenter](/coral-works-with-karpenter): how Coral and Karpenter share the nodes.",
    ],
  },
  helm: {
    route: routes.coralWorksWithHelm,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with Helm",
      description:
        "Install Coral's agent with Helm, Argo CD or Flux. Coral rebalances what your charts deploy and never edits your templates, so GitOps sees no drift.",
    },
    hero: {
      title: "Coral works with Helm",
      deck: "Install the agent from our Helm chart. Coral rebalances what your charts deploy and never edits your templates.",
    },
    sections,
    who: {
      tool: "Helm",
      rows: [
        [
          "Installing the agent",
          "Installs the coral-agent chart, by hand or through Argo CD or Flux.",
          "Registers the cluster and starts reading it.",
        ],
        [
          "Upgrading the agent",
          "Moves it to a newer release when you upgrade the chart.",
          "Doesn’t update an agent that Helm manages.",
        ],
        ["Your templates", "Applies them as you wrote them.", "Never edits them."],
        [
          "Pod requests",
          "Your templates set them.",
          "Rebalances them to real use, once you switch on “Automatically optimize”.",
        ],
        [
          "HPAs in your charts",
          "Creates and updates them.",
          "Never takes one over. A rebalance may raise its minimum while a pod moves, then puts it back.",
        ],
      ],
    },
    together: [
      "Helm deploys your charts as usual, with the requests you wrote.",
      "With “Automatically optimize” on, Coral’s webhook sets each new pod’s requests as it starts.",
      "Running pods are resized in place, or restarted one at a time within their PodDisruptionBudget.",
      "Your charts and Git keep their own values, so Argo CD and Flux see no drift.",
    ],
    leaves: {
      title: "What stays yours",
      items: [
        "**Your chart’s sizes.** With automation off, new pods start at the requests your chart sets.",
        "**Your replica count.** Coral’s one change to a Deployment is a temporary extra replica, so a new pod is Ready before the old one goes. It skips this when an HPA scales the pods, or when Argo CD or Flux own the count.",
        "**Coral’s settings, in your chart.** Add the `coral.zoorik.com/configuration` annotation to a workload. It is then managed from its manifest, and its console controls are locked.",
      ],
    },
    setup: [
      "**Get a connect token** from the Connect dialog in the Coral console. Coral is in early access, so book a demo for an account.",
      "**Install the chart** as [Install Coral with Helm](/docs/install-coral-with-helm) shows. It installs the same agent as a `zoorikctl` connect.",
      "**Add the cloud identity** if Coral should remove machines. [Our Terraform modules](/coral-works-with-terraform) or `zoorikctl` create it. Without it, pools an autoscaler runs are still optimized.",
      "**On Argo CD,** ignore the fields Coral’s parts write after the install. [The Helm guide](/docs/install-coral-with-helm#with-argo-cd-or-flux) lists them.",
      "**Connected with zoorikctl already?** Disconnect first, then install the chart with a new token. Helm can’t take over objects `zoorikctl` created.",
    ],
    questions: [
      {
        question: "Will Coral add HPAs my chart doesn’t have?",
        answer: [
          "It can. With automation on, Coral creates an HPA for an eligible Deployment or Argo Rollout that has none. To rebalance requests only, set the policy’s Optimization type to “Vertical”. Switching automation off removes the HPAs Coral created.",
        ],
      },
      {
        question: "Does a limit in my chart cap Coral?",
        answer: [
          "No. Where your CPU or memory limit sits below the new request, Coral raises the pod’s limit. A maximum in a policy or in Coral’s annotation does cap it, as do the namespace’s LimitRange and ResourceQuota.",
        ],
      },
      {
        question: "Can my chart keep a workload out of Coral?",
        answer: [
          'Yes. Add the label `coral.zoorik.com/ignore: "true"` to the workload, its pod template or its namespace. Coral then leaves its requests and HPAs alone, but its pods can still move between nodes.',
        ],
      },
      {
        question: "How do you uninstall Coral?",
        answer: [
          "`helm uninstall` removes what the chart installed, except Coral’s CRDs. To undo what the agent changed on nodes and workloads, such as taints and the HPAs it manages, [disconnect the cluster](/coral-guide#disconnect) with `zoorikctl`.",
        ],
      },
    ],
    readMore: [
      "[Install Coral with Helm](/docs/install-coral-with-helm): the chart, its values, Argo CD and upgrades.",
      "[Coral guide: Workload optimization](/coral-guide#workload-optimization): how requests are worked out and applied.",
      "[Kubernetes resource requests](/learn/glossary/kubernetes-resource-requests): what Coral rebalances, and why they set your cloud cost.",
      "[Coral works with Terraform](/coral-works-with-terraform): Coral’s cloud permissions as code.",
    ],
  },
  terraform: {
    route: routes.coralWorksWithTerraform,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with Terraform",
      description:
        "Create Coral's cloud permissions for AKS and EKS with our Terraform modules, and keep terraform apply from undoing Coral's node pool changes.",
    },
    hero: {
      title: "Coral works with Terraform",
      deck: "Our modules create Coral’s cloud permissions as code. Tell Terraform to ignore the node pool fields Coral changes.",
    },
    sections,
    who: {
      tool: "Terraform",
      rows: [
        [
          "Coral’s cloud identity",
          "Our modules create it as code, one cluster at a time.",
          "Uses it to remove machines it has emptied.",
        ],
        [
          "Installing the agent",
          "The module’s output goes into the Helm chart’s values.",
          "Registers the cluster and starts reading it.",
        ],
        [
          "Node pools",
          "Creates them and sets each pool’s minimum.",
          "Empties spare nodes, and may reduce a minimum that alone keeps an emptied node.",
        ],
      ],
    },
    together: [
      "Apply our module for AKS or EKS. It creates Coral’s identity and its permissions on one cluster.",
      "Install the agent with the Helm chart, with the module’s output in its values.",
      "Coral empties spare nodes one at a time, and your autoscaler removes them. In fixed-size pools that nothing else manages, Coral deletes the machine itself.",
    ],
    leaves: {
      title: "What stays yours",
      items: [
        "**Your workloads.** Coral never edits Git or your workload’s template. It sets requests on pods as they start, or resizes running pods in place.",
        "**Scale-up.** Coral never adds nodes for demand. That stays with your Karpenter, AKS node auto provisioning or Cluster Autoscaler.",
        "**Your own NodePools.** Coral changes only the NodePools it adds for a rebalance.",
        "**Pool minimums, if you choose.** The modules can leave out the permission to change a minimum. Otherwise Coral may reduce one, and disconnect puts it back.",
        "**The rest of your cloud.** Coral’s identity has no secret or key, and its changes are limited to one cluster.",
      ],
    },
    setup: [
      "**Pick the module** for AKS or EKS, open source on the Terraform Registry. It creates the same identity, role and permissions as `zoorikctl`, with the same names, so `zoorikctl` sees them as done.",
      "**On AKS,** turn on the cluster’s OIDC issuer and workload identity before you apply.",
      "**On EKS,** choose Pod Identity or IRSA. With Pod Identity, apply the module before you install the agent, so the agent gets its credentials when it starts.",
      "**Install the agent** with the Helm chart and the module’s output, as [Install Coral with Terraform + Helm](/docs/install-coral-with-terraform) shows.",
      "**Ignore Coral’s fields** in your own node pool code, or each apply undoes them. [The install guide](/docs/install-coral-with-terraform#your-own-node-pool-code) lists them.",
    ],
    questions: [
      {
        question: "What do Coral’s Terraform modules create?",
        answer: [
          "On AKS, a managed identity with its federated credential, and Coral’s custom role assigned on that cluster only. One module call per tenant creates the role, and other clusters reuse it. On EKS, an IAM role with its policy, and a Pod Identity association unless you choose IRSA.",
        ],
      },
      {
        question: "Will `terraform apply` undo what Coral changes?",
        answer: [
          "It can, on node pools Terraform manages. Coral may reduce a pool’s minimum and, on EKS, a group’s desired size, and it records the old minimum in tags. Tell Terraform to ignore those fields.",
        ],
      },
      {
        question: "Does Coral need Terraform?",
        answer: [
          "No. `zoorikctl` creates the same identity and permissions when it connects a cluster. It lists every cloud change and asks once. The modules are for teams that keep cloud permissions as code.",
        ],
      },
      {
        question: "How do you revoke Coral’s cloud access?",
        answer: [
          "Remove the role assignment or the policy. Node removal stops once your cloud applies the change. The [Trust center](/trust#access) lists what the identity may do.",
        ],
      },
    ],
    readMore: [
      "[Install Coral with Terraform + Helm](/docs/install-coral-with-terraform): the modules, then the agent.",
      "[Coral guide: Node optimization](/coral-guide#node-optimization): how Coral empties nodes and who removes them.",
      "[Node pools](/learn/glossary/node-pool): node pools on AKS and node groups on EKS.",
      "[Coral works with Helm](/coral-works-with-helm): the agent’s chart, with Argo CD or Flux.",
    ],
  },
};
