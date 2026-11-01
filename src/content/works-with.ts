import { routes } from "@/config/site";

/**
 * The six works-with pages (owner, 31 Oct 2026: "GO build all 10 at once !!!"; D227's addresses), one per tool Coral
 * works with, each in the footer's "Works with" list: /coral-works-with-cluster-autoscaler, -karpenter,
 * -aks-node-auto-provisioning, -keda, -helm and -terraform. One template draws all six (`WorksWithPage`): the eyebrow,
 * the h1 and the short answer, then Who does what, How they work together, what Coral leaves to the tool (What stays
 * yours on Helm and Terraform), Set up, Questions and Read more, each named after its pair ("Set up Coral with
 * Karpenter"; owner, 1 Nov 2026), then the closing row on Coral.
 *
 * Generated once from the checked drafts in `docs/website-seo/new-pages-2026-10-31/<slug>/page.md` through the mock's
 * own parser (`ux-design/website/_tools/ten_pages_mock.py`), so every string is the mock's: quotes and apostrophes as
 * it sets them, the meta descriptions as the drafts write them. Text is the drafts' markup-lite, set as the mock's
 * `inline()` sets it (`richText`): `code`, **bold** and [text](href).
 *
 * 🔴 KEEP EVERY LINE TRUE, AND CLAIM NO TEST. Every claim traces to a line the site already publishes (each draft's
 * `ledger.md`): the guide, the FAQ, the install guides, /trust. No figure, price, version, timing or internal name, and
 * no other cost-optimization vendor. Re-read the ledger before changing a line.
 */

/** The six pages print no day: the day their content last changed, for the sitemap. Move it in the PR that
 * changes it. */
export const worksWithLastUpdated = "1 November 2026";

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
  /** The h1 ("Coral works with Karpenter") and the short answer under it. */
  readonly hero: { readonly title: string; readonly deck: string };
  /** The names of the sections every page has, each naming its pair; the third's is `leaves.title`. */
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
  /** What Coral leaves to the tool, or What stays yours (Helm, Terraform), at `#leaves` either way. */
  readonly leaves: { readonly title: string; readonly items: readonly string[] };
  readonly setup: readonly string[];
  readonly questions: readonly WorksWithQuestion[];
  /** Each line a link, then what it holds. */
  readonly readMore: readonly string[];
}

export type WorksWithId =
  "clusterAutoscaler" | "karpenter" | "nodeAutoProvisioning" | "keda" | "helm" | "terraform";

/** In the footer's order. */
export const worksWithPages: Readonly<Record<WorksWithId, WorksWithCopy>> = {
  clusterAutoscaler: {
    route: routes.coralWorksWithClusterAutoscaler,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Cluster Autoscaler and Coral on AKS and EKS",
      description:
        "On AKS and EKS, Coral rebalances pod requests and empties spare nodes one at a time. The Cluster Autoscaler adds nodes and removes the ones Coral empties.",
    },
    hero: {
      title: "Coral works with Cluster Autoscaler",
      deck: "The Cluster Autoscaler adds nodes for pods that can’t be scheduled, and removes underused nodes whose pods fit elsewhere. To reduce cost, Coral rebalances CPU and memory requests to real use and empties spare nodes one at a time. The autoscaler removes them, and Coral never adds nodes for demand, so the two don’t fight.",
    },
    sections: {
      who: "What the Kubernetes Cluster Autoscaler does, and what Coral does",
      together: "How Coral and the Cluster Autoscaler work together",
      setup: "Set up Coral with the Cluster Autoscaler",
      questions: "Questions about Coral and the Cluster Autoscaler",
      readMore: "More on the Cluster Autoscaler and Coral",
    },
    who: {
      tool: "Cluster Autoscaler",
      rows: [
        [
          "Pod CPU and memory requests",
          "Uses them to decide which nodes can go. It doesn’t change them.",
          "Rebalances each container’s CPU and memory requests to real use.",
        ],
        [
          "Adding nodes",
          "Grows a node pool or Auto Scaling group when pods can’t be scheduled.",
          "Never adds nodes for demand.",
        ],
        [
          "Removing spare nodes",
          "Removes an underused node whose pods fit elsewhere, on its own timers.",
          "Empties spare nodes one at a time, then hands each one to the autoscaler.",
        ],
        [
          "Pool minimums",
          "Keeps each pool at or above its minimum.",
          "By default, may reduce a minimum that alone keeps an emptied node. It never raises a count.",
        ],
        [
          "Moving work to cheaper machines",
          "Picks only among the node groups you set up.",
          "Needs Karpenter or AKS node auto provisioning (NAP), not the Cluster Autoscaler alone.",
        ],
      ],
    },
    together: [
      "When you switch on “Automatically optimize”, Coral rebalances each container’s requests to what it really uses.",
      "Before it drains a node, Coral checks on the live cluster that every pod fits on another node.",
      "Coral cordons and drains one node at a time, within your PodDisruptionBudgets.",
      "After the wait set in “Wait before removing empty nodes”, Coral hands the empty node to the Cluster Autoscaler.",
      "The autoscaler’s own timers decide when that node goes, and it adds nodes again when demand grows.",
    ],
    leaves: {
      title: "What Coral leaves to the Cluster Autoscaler",
      items: [
        "**Adding nodes.** Scale-up belongs to the autoscaler. Coral never adds capacity for demand.",
        "**Deleting the nodes it runs.** Coral empties a node and hands it over. The autoscaler deletes it.",
        "**When an empty node goes.** The autoscaler’s own timers decide.",
        "**Room for future growth.** It is the autoscaler’s job. Coral keeps no idle spare nodes.",
      ],
    },
    setup: [
      "**Your autoscaler stays.** Connect sets up NAP or Karpenter only on a cluster with no autoscaler. With the Cluster Autoscaler in place, it adds neither.",
      "**Permission to remove nodes.** If you decline it at connect, pools the Cluster Autoscaler runs are optimized as usual. Fixed-size pools wait until you run `zoorikctl cluster grant-node-deletion`.",
      "**Pool minimums.** That permission lets Coral reduce a pool’s minimum when that minimum alone keeps an emptied node. Our Terraform modules can leave this out.",
      "**Node pools in Terraform.** Tell Terraform to ignore what the agent changes, or each apply undoes it. [Your own node pool code](/docs/install-coral-with-terraform#your-own-node-pool-code) shows how.",
      "**A careful start.** Node optimization and the Evictor, which moves pods off lightly used nodes, start at connect. Put the Evictor in “Dry run”, and switch off the node pools you don’t want touched.",
    ],
    questions: [
      {
        question: "Does the Cluster Autoscaler use requests or actual usage?",
        answer: [
          "Requests. It adds nodes for pods that can’t be scheduled, and removes underused nodes whose pods fit elsewhere, judging both from the pods’ CPU and memory requests, not their real use. It doesn’t change the requests: Coral rebalances them to real use.",
        ],
      },
      {
        question: "Will Coral fight my Cluster Autoscaler?",
        answer: [
          "No. Scale-up stays the autoscaler’s job, and Coral never adds nodes for demand. Coral empties spare nodes, and the autoscaler’s own timers decide when each one goes.",
        ],
      },
      {
        question: "Can Coral move work to cheaper machines with only the Cluster Autoscaler?",
        answer: [
          "No. That needs Karpenter or NAP, and connect sets one up only on a cluster with no autoscaler. With only the Cluster Autoscaler, Coral removes nodes but never changes their size.",
        ],
      },
      {
        question: "Does Coral change my Cluster Autoscaler’s minimums?",
        answer: [
          "By default, Coral may reduce a pool’s minimum when that minimum alone keeps a node it has emptied. It never raises a count, and disconnect puts the old minimum back. Our Terraform modules can leave out the permission to change a minimum.",
        ],
      },
      {
        question: "What about pools the Cluster Autoscaler doesn’t run?",
        answer: [
          "In a fixed-size pool that nothing else manages, Coral deletes the emptied machine itself. It needs the permission to remove nodes, which connect asks for.",
        ],
      },
      {
        question: "What happens in a sudden surge?",
        answer: [
          "The HPA adds pods, and pending pods trigger the Cluster Autoscaler to add nodes. Coral keeps no idle spare nodes, so the headroom sits inside each pod’s request.",
        ],
      },
    ],
    readMore: [
      "[Coral product guide: Node optimization](/coral-guide#node-optimization): how Coral empties nodes, and who removes them.",
      "[Coral FAQ: How does Coral interact with Cluster Autoscaler or Karpenter decisions?](/coral-faq#how-does-coral-interact-with-cluster): who adds nodes, and who removes the ones Coral empties.",
      "[Cluster Autoscaler not scaling down: what keeps nodes running](/learn/cluster-autoscaler-not-scaling-down): why an underused node stays, and the fix.",
      "[Coral works with AKS node auto provisioning](/coral-works-with-aks-node-auto-provisioning): how rebalancing uses NAP on AKS.",
      "[Coral works with Karpenter](/coral-works-with-karpenter): how rebalancing uses Karpenter on EKS.",
    ],
  },
  karpenter: {
    route: routes.coralWorksWithKarpenter,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with Karpenter",
      description:
        "Karpenter picks machines; Coral rebalances pod requests so Karpenter can run fewer or smaller nodes. How they work together on EKS, and what Coral leaves alone.",
    },
    hero: {
      title: "Coral works with Karpenter",
      deck: "On EKS, Karpenter chooses, launches and removes the machines your pods need. To reduce cost, Coral rebalances each pod’s CPU and memory requests to real use, so Karpenter can run fewer or smaller nodes. Coral never changes your Karpenter settings and never adds nodes for demand, so the two don’t fight.",
    },
    sections: {
      who: "Who does what: Coral and Karpenter",
      together: "How Coral and Karpenter work together",
      setup: "Set up Coral with Karpenter",
      questions: "Questions about Coral and Karpenter",
      readMore: "More on Karpenter and Coral",
    },
    who: {
      tool: "Karpenter",
      rows: [
        [
          "Pod CPU and memory requests",
          "Uses them to pick machines, but doesn’t change them.",
          "Rebalances them to real use, once you switch on “Automatically optimize”.",
        ],
        [
          "Adding nodes",
          "Launches machines that fit the pods’ requests.",
          "Never adds nodes for demand.",
        ],
        [
          "Removing spare nodes",
          "Consolidates the pools it is set to consolidate.",
          "Leaves those pools to Karpenter. In other pools, it empties spare nodes for your autoscaler to remove.",
        ],
        [
          "Moving work to cheaper machines",
          "Launches the new machines.",
          "Plans the move, creates fixed-size NodePools for it, then drains and removes the old nodes.",
        ],
        [
          "Keeping a marked pod or node",
          "Honours `karpenter.sh/do-not-disrupt`.",
          "Honours it on pods and nodes: a marked pod is never moved and keeps its node, and a marked node is kept.",
        ],
      ],
    },
    together: [
      "Coral rebalances each pod’s CPU and memory requests to real use, once you switch on “Automatically optimize”.",
      "With smaller requests, Karpenter can run fewer or smaller nodes in the pools it consolidates.",
      "In other pools, Coral empties spare nodes one at a time, and your autoscaler removes them.",
      "When a rebalance moves work to cheaper machines, Coral creates fixed-size NodePools, and Karpenter launches the new machines in them.",
      "Coral then drains and removes the old nodes one by one, and the new NodePools stay after the run.",
    ],
    leaves: {
      title: "What Coral leaves to Karpenter",
      items: [
        "**Your NodePools and node classes.** Coral changes only the NodePools it creates for rebalancing.",
        "**Adding capacity.** Scale-up stays with Karpenter. In a surge, it can pick bigger machines again.",
        "**Consolidation.** Pools that Karpenter already consolidates are left to it.",
        "**When a spare node goes.** Outside a rebalance, Coral hands an empty node to Karpenter, and Karpenter’s own settings decide when it goes.",
      ],
    },
    setup: [
      "**Karpenter already runs on the cluster.** Connect leaves it as it is. It sets up only what every EKS connect sets up, listed on [Coral for EKS](/eks-cost-optimization#setup).",
      "**The cluster has no node autoscaler.** Connect sets up Karpenter with your approval, or you run `zoorikctl cluster prepare` later. It lists every cloud change and asks before it makes one, and `--dry-run` changes nothing.",
      "**What it sets up.** In AWS: IAM roles, an SQS queue with EventBridge rules, discovery tags, an access entry and Pod Identity. In the cluster: Karpenter, its node classes and a default NodePool.",
      "**What you need for that.** Helm, and the AWS rights for SQS, EventBridge and cluster updates, besides the IAM rights every EKS connect needs.",
      "**Clusters that use only aws-auth.** If connect or `zoorikctl cluster prepare` installs Karpenter, it switches authentication to API_AND_CONFIG_MAP, and that can’t be undone.",
    ],
    questions: [
      {
        question: "Do I need Coral if I already run Karpenter?",
        answer: [
          "They do different jobs. Karpenter chooses and removes machines from pod requests, but doesn’t change the requests. Coral rebalances requests to real use, so the same Karpenter can run fewer or smaller nodes.",
        ],
      },
      {
        question: "What does a rebalance need on EKS?",
        answer: [
          "Karpenter, Node optimization switched on, and the permission to remove nodes, which connect asks for. With only the [Cluster Autoscaler](/coral-works-with-cluster-autoscaler), Coral removes nodes but never changes their size.",
        ],
      },
      {
        question: "What happens in a surge after Coral moves work to smaller machines?",
        answer: [
          "Coral never adds capacity for demand. Your HPA adds pods, the pending pods trigger Karpenter, and Karpenter can pick bigger machines.",
        ],
      },
      {
        question: "Does Coral respect `karpenter.sh/do-not-disrupt`?",
        answer: [
          "Yes. A pod with it is never moved and its node is kept, and a node with it is kept. [The safe-to-evict and do-not-disrupt annotations explained](/learn/safe-to-evict-do-not-disrupt) shows which tool reads which marker.",
        ],
      },
      {
        question: "What stays if I disconnect?",
        answer: [
          "Karpenter stays, if connect set it up. So do Coral’s `zoorik-base` node class and its rebalancing NodePools.",
        ],
      },
    ],
    readMore: [
      "[Coral product guide: Rebalancing](/coral-guide#rebalancing): what a rebalance needs, and how it runs.",
      "[Coral FAQ: Do I need Coral with Karpenter or NAP?](/coral-faq#do-i-need-coral-with-karpenter): the short answer, with more on autoscalers.",
      "[KEDA vs Karpenter: pods, nodes and the requests in between](/learn/keda-vs-karpenter): what each one scales, and where Coral fits.",
      "[Coral works with AKS node auto provisioning](/coral-works-with-aks-node-auto-provisioning): the same story on AKS, where NAP runs Karpenter for you.",
      "[Coral works with KEDA](/coral-works-with-keda): KEDA sets the pod count, and Coral each pod’s size.",
    ],
  },
  nodeAutoProvisioning: {
    route: routes.coralWorksWithNodeAutoProvisioning,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with AKS node auto provisioning",
      description:
        "AKS node auto provisioning (NAP) launches nodes; Coral rebalances the pod requests NAP reads. What connect turns on, and how Coral moves work to cheaper nodes.",
    },
    hero: {
      title: "Coral works with AKS node auto provisioning",
      deck: "AKS node auto provisioning (NAP) adds nodes from pod requests, picks each machine, and consolidates the pools it runs. To reduce cost, Coral rebalances those requests to real use, so NAP can run fewer or smaller nodes. Coral leaves NAP to consolidate its own pools and never adds nodes for demand, so the two don’t fight.",
    },
    sections: {
      who: "Who does what: Coral and NAP",
      together: "How Coral and NAP work together",
      setup: "Set up Coral with NAP",
      questions: "Questions about Coral and NAP",
      readMore: "More on NAP and Coral",
    },
    who: {
      tool: "NAP",
      rows: [
        [
          "Pod CPU and memory requests",
          "Reads them to choose machines. It doesn’t change them.",
          "Rebalances each container’s CPU and memory requests to real use.",
        ],
        [
          "Adding nodes",
          "Launches machines chosen to fit pending pods.",
          "Never adds nodes for demand.",
        ],
        [
          "Removing spare nodes",
          "Consolidates the pools it is set to consolidate.",
          "Leaves those pools to NAP. In other pools, it empties spare nodes for your autoscaler to remove.",
        ],
        [
          "Moving work to cheaper machines",
          "Launches the new machines.",
          "Plans the move, creates fixed-size NodePools for it, then drains and removes the old nodes.",
        ],
      ],
    },
    together: [
      "When you switch on “Automatically optimize”, Coral rebalances each container’s requests to what it really uses.",
      "With smaller requests, NAP can run fewer or smaller nodes in the pools it consolidates.",
      "To move work to cheaper machines, you choose the nodes to replace, and Coral’s plan compares the cost before and after.",
      "When a rebalance runs, Coral creates fixed-size NodePools, and NAP launches the cheaper machines in them.",
      "Coral then drains and removes the old nodes one by one, and the new NodePools stay after the run.",
    ],
    leaves: {
      title: "What Coral leaves to NAP",
      items: [
        "**Adding nodes.** Scale-up belongs to NAP, and in a surge it can pick bigger machines.",
        "**Consolidating its pools.** Pools NAP already consolidates are left to it.",
        "**Launching machines.** Coral never creates machines itself, even in a rebalance.",
        "**Your NodePools and node classes.** Coral changes only the NodePools it creates for rebalancing.",
      ],
    },
    setup: [
      "**A cluster with no autoscaler.** Connect turns on NAP and adds Coral’s node class `zoorik-base`. It lists every cloud change and asks before it makes one.",
      "**Azure CNI.** NAP needs Azure CNI networking, not kubenet. On kubenet with no autoscaler, nothing adds nodes until you set one up.",
      "**A cluster with the Cluster Autoscaler.** Connect leaves the Cluster Autoscaler in place and doesn’t turn on NAP. It sets up only what every AKS connect sets up, listed on [Coral for AKS](/aks-cost-optimization#setup).",
      "**Workload identity.** For the permission to remove nodes, connect turns on workload identity and the OIDC issuer if they are off. The OIDC issuer can’t be turned off again.",
      "**Setting up NAP later.** If you decline the cloud changes at connect, `zoorikctl cluster prepare` sets up NAP when you are ready.",
    ],
    questions: [
      {
        question: "Do I need Coral if I run NAP?",
        answer: [
          "They do different jobs. NAP chooses and removes machines from pod requests, but doesn’t change the requests. Coral rebalances them to real use, so NAP can run fewer or smaller nodes.",
        ],
      },
      {
        question: "Is NAP the same as Karpenter?",
        answer: [
          "NAP runs Karpenter for you on AKS. Coral treats both the same way: it leaves them to consolidate their own pools, and either one launches the machines a rebalance needs.",
        ],
      },
      {
        question: "My AKS cluster runs the Cluster Autoscaler. Will connect turn on NAP?",
        answer: [
          "No. Connect turns on NAP only on a cluster with no autoscaler. Coral still rebalances requests and removes nodes, but moving work to cheaper machines needs NAP or Karpenter.",
        ],
      },
      {
        question: "What does rebalancing need on AKS?",
        answer: [
          "NAP or Karpenter, Node optimization switched on, and the permission to remove nodes. Coral picks the cheaper machines, and NAP launches them.",
        ],
      },
      {
        question: "What stays if I disconnect?",
        answer: [
          "The NAP that connect set up stays, and so do Coral’s `zoorik-base` node class and its rebalancing NodePools. Workload identity and the OIDC issuer stay too.",
        ],
      },
    ],
    readMore: [
      "[Coral product guide: Rebalancing](/coral-guide#rebalancing): what a rebalance needs, and how it runs.",
      "[Coral FAQ: Do I need Coral with Karpenter or NAP?](/coral-faq#do-i-need-coral-with-karpenter): the short answer, with more on autoscalers.",
      "[AKS node auto provisioning (NAP): how to enable it](/learn/aks-node-auto-provisioning): what NAP is, and how to enable or disable it.",
      "[HPA vs VPA vs Cluster Autoscaler: what each one scales](/learn/hpa-vs-vpa-vs-cluster-autoscaler): pods, requests and nodes, plus Karpenter.",
      "[Coral works with Cluster Autoscaler](/coral-works-with-cluster-autoscaler): Coral empties spare nodes, and the Cluster Autoscaler removes them.",
      "[Coral works with Karpenter](/coral-works-with-karpenter): the same story on EKS, with Karpenter itself.",
    ],
  },
  keda: {
    route: routes.coralWorksWithKeda,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with KEDA",
      description:
        "On AKS and EKS, KEDA sets how many pods run and Coral rebalances each pod's CPU and memory requests. See how they work together and what Coral leaves to KEDA.",
    },
    hero: {
      title: "Coral works with KEDA",
      deck: "On AKS and EKS, KEDA decides how many pods run, from events or from CPU and memory. Coral rebalances how much CPU and memory each pod requests, so your pods fit on fewer or smaller nodes. The two don’t fight: Coral never takes over or changes KEDA’s HPA, and changes your ScaledObject only in a rebalance onto cheaper machines.",
    },
    sections: {
      who: "Who does what: Coral and KEDA",
      together: "How Coral and KEDA work together",
      setup: "Set up Coral with KEDA",
      questions: "Questions about Coral and KEDA",
      readMore: "More on KEDA and Coral",
    },
    who: {
      tool: "KEDA",
      rows: [
        [
          "Setting how many pods run",
          "Sets the count from its triggers, down to zero, through the HPA it creates.",
          "Never takes over or changes that HPA.",
        ],
        [
          "Pod CPU and memory requests",
          "Doesn’t change them.",
          "Rebalances them to real use, once you switch on “Automatically optimize”.",
        ],
        [
          "Running the workload’s HPA",
          "Creates and runs its own.",
          "Creates none of its own for a workload KEDA scales.",
        ],
        [
          "Starting a new copy before a pod moves in a rebalance onto cheaper machines",
          "Passes Coral’s raised minimum to its HPA, which adds the new copy.",
          "Can raise the ScaledObject’s minimum while a pod moves, so a new copy runs healthy on another node first.",
        ],
        [
          "Removing spare nodes",
          "Doesn’t add or remove nodes.",
          "Empties spare nodes so your node autoscaler can remove them.",
        ],
      ],
    },
    together: [
      "KEDA reads its triggers and sets how many pods run, through the HPA it creates.",
      "Coral reads your ScaledObjects, so it knows which HPAs KEDA owns and leaves them alone.",
      "Once you switch on “Automatically optimize”, Coral rebalances each pod’s CPU and memory requests to real use.",
      "With a CPU trigger, unless the ScaledObject is paused, Coral replays recent load through its settings before it picks the CPU request.",
      "In a rebalance onto cheaper machines, Coral can raise the ScaledObject’s minimum, so a new copy runs healthy on another node before the old pod stops.",
    ],
    leaves: {
      title: "What Coral leaves to KEDA",
      items: [
        "**How many pods run, scaling to zero included.** Coral never takes over, converts or changes the HPA that KEDA creates.",
        "**Your triggers and every other ScaledObject setting.** Coral changes only the minimum and maximum, and only during a rebalance onto cheaper machines.",
        "**Your Git.** Coral never edits Git or your workload’s template.",
      ],
    },
    setup: [
      "**Nothing to install for KEDA.** Connect lets the agent read your ScaledObjects and, in a rebalance onto cheaper machines, change only their minimum and maximum. Admission policies limit what the agent may change.",
      "**Pod sizing is opt-in.** Coral only recommends until you switch on “Automatically optimize” for a policy or a workload.",
      "**A rebalance onto cheaper machines needs [Karpenter](/coral-works-with-karpenter) or [AKS node auto provisioning (NAP)](/coral-works-with-aks-node-auto-provisioning).** It also needs Node optimization on and the permission to remove nodes.",
    ],
    questions: [
      {
        question: "Will Coral and KEDA fight over the replica count?",
        answer: [
          "No. KEDA decides how many pods run, and Coral decides how big each pod is. Coral never takes over or changes the HPA that KEDA creates.",
        ],
      },
      {
        question: "Does Coral ever change my ScaledObject?",
        answer: [
          "Only during a rebalance onto cheaper machines, and only its minimum and maximum. To move a pod, Coral can raise the minimum, so a new copy runs healthy on another node before the old pod stops. Then it puts your values back.",
        ],
      },
      {
        question: "Could smaller requests make KEDA add more pods?",
        answer: [
          "It could, with a CPU or memory trigger on utilization, since the same load reads as higher use of a smaller request. For a CPU trigger on a ScaledObject that isn’t paused, Coral replays recent load through its settings. In that replay, a smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
        ],
      },
      {
        question: "Does Coral create its own HPA for a KEDA workload?",
        answer: [
          "No. Coral creates an HPA only for a Deployment or Argo Rollout that has none, and never for one KEDA scales.",
        ],
      },
      {
        question: "What happens to KEDA’s pods when Coral empties a spare node?",
        answer: [
          "Outside a rebalance onto cheaper machines, Coral moves them without starting a new copy first, so a pod can get a short restart. To prevent that, mark the pod `karpenter.sh/do-not-disrupt`, which also keeps its node.",
        ],
      },
    ],
    readMore: [
      "[Coral product guide: HPAs and VPAs](/coral-guide#hpas-and-vpas): which HPAs Coral creates, takes over or leaves alone.",
      "[Coral FAQ: Working with HPA](/coral-faq#working-with-hpa): who wins when the HPA and Coral both act.",
      "[KEDA vs Karpenter: pods, nodes and the requests in between](/learn/keda-vs-karpenter): what each one scales, and where Coral fits.",
      "[What is Kubernetes HPA (Horizontal Pod Autoscaler)?](/learn/glossary/horizontal-pod-autoscaler): the autoscaler that KEDA creates and drives.",
      "[Coral works with Karpenter](/coral-works-with-karpenter): how Coral and Karpenter share the nodes on EKS.",
    ],
  },
  helm: {
    route: routes.coralWorksWithHelm,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with Helm",
      description:
        "Install Coral's agent with Helm, Argo CD or Flux, and upgrade it when you choose. Coral rebalances what your charts deploy and never edits your templates.",
    },
    hero: {
      title: "Coral works with Helm",
      deck: "Helm installs your charts and can install Coral’s agent, which then upgrades only when you choose. Coral rebalances the workloads your charts deploy and never edits your templates. Once you switch on “Automatically optimize”, it sizes each pod as it starts.",
    },
    sections: {
      who: "Who does what: Coral and Helm",
      together: "How Coral and Helm work together",
      setup: "Set up Coral with Helm",
      questions: "Questions about Coral and Helm",
      readMore: "More on Helm and Coral",
    },
    who: {
      tool: "Helm",
      rows: [
        [
          "Installing Coral’s agent",
          "Installs it from the coral-agent chart, also through Argo CD or Flux.",
          "Registers the cluster and starts reading it.",
        ],
        [
          "Upgrading Coral’s agent",
          "Moves it to a newer release when you upgrade the chart.",
          "Doesn’t update an agent that Helm manages.",
        ],
        ["Your workload templates", "Applies your charts as you wrote them.", "Never edits them."],
        [
          "Pod CPU and memory requests",
          "Your templates set them.",
          "Rebalances each container’s CPU and memory requests to real use, once you switch on “Automatically optimize”.",
        ],
        ["HPAs in your charts", "Creates and updates them.", "Never takes one over."],
      ],
    },
    together: [
      "You install Coral’s agent from its Helm chart, by hand or through Argo CD or Flux.",
      "Helm deploys your own charts as usual, with the requests you wrote.",
      "Once you switch on “Automatically optimize”, Coral’s webhook sizes each new pod as it starts.",
      "Running pods are resized in place, or restarted one at a time.",
      "When you want a newer agent, you upgrade its release to a newer chart version.",
    ],
    leaves: {
      title: "What stays yours",
      items: [
        "**Your templates.** Coral never edits Git or your workload’s template. With automation off, new pods start at the size your chart sets.",
        "**Your HPAs.** Coral takes over only HPAs that nothing else manages, so it never takes over one from your chart.",
        "**Your replica count.** Coral’s one change to a Deployment is a temporary extra replica, so a new pod is Ready before the old one goes. It skips that for pods an HPA scales, and when Argo CD or Flux own the replica count.",
        "**Coral’s settings, if you keep them in your chart.** Add Coral’s `coral.zoorik.com/configuration` annotation to a workload in your chart. That workload is then managed from its manifest, and its console controls are locked.",
        "**When the agent upgrades.** An agent that Helm, Argo CD or Flux manages doesn’t update itself.",
      ],
    },
    setup: [
      "**Get a connect token** from the Connect dialog in the Coral console. Coral is in early access.",
      "**Install the chart** as [Install Coral with Helm](/docs/install-coral-with-helm) shows. It installs the same agent that a zoorikctl connect does.",
      "**Add Coral’s cloud identity** if you want Coral to remove machines. Our [Terraform modules](/coral-works-with-terraform) create it as code, or zoorikctl creates it from the command line. Without it, the agent still installs, and pools that an autoscaler runs are optimized as usual.",
      "**With Argo CD,** ignore the fields that Coral’s own parts write after the install. The [Helm install guide](/docs/install-coral-with-helm#with-argo-cd-or-flux) lists them.",
      "**Connected with zoorikctl already?** Disconnect first, then install the chart with a new connect token. Helm can’t take over the objects zoorikctl created.",
    ],
    questions: [
      {
        question: "Does Coral edit my charts or templates?",
        answer: [
          "No. Coral never edits Git or your workload’s template. It sets sizes on pods as they’re created, or resizes running pods in place, so Argo CD and Flux see no drift.",
        ],
      },
      {
        question: "Will Coral add HPAs that my chart doesn’t have?",
        answer: [
          "It can: with automation on, Coral creates an HPA for an eligible Deployment or Argo Rollout that has none. To size pods only, set the policy’s Optimization type to “Vertical”. Switching automation off removes the HPAs Coral created.",
        ],
      },
      {
        question: "Does a CPU or memory limit in my chart cap Coral?",
        answer: [
          "No. Where your limit sits below the new request, Coral raises the pod’s limit. A maximum in a policy or in the workload’s Coral annotation does cap it, and so do the namespace’s LimitRange and ResourceQuota.",
        ],
      },
      {
        question: "Can my chart keep a workload out of Coral’s sizing?",
        answer: [
          'Yes. Add the label `coral.zoorik.com/ignore: "true"` to the workload, its pod template or its namespace. Coral then doesn’t size its pods or manage its HPAs, but the pods can still move between nodes.',
        ],
      },
      {
        question: "How do I remove Coral if I installed it with Helm?",
        answer: [
          "Uninstalling the release removes what the chart installed, except Coral’s CRDs. It doesn’t undo what the agent changed on nodes and workloads, such as Coral’s taints on nodes and the HPAs it manages. To undo those too, [disconnect the cluster](/coral-guide#disconnect) with zoorikctl.",
        ],
      },
    ],
    readMore: [
      "[Install Coral with Helm](/docs/install-coral-with-helm): the chart, its values, Argo CD and upgrades.",
      "[Coral product guide: Workload optimization](/coral-guide#workload-optimization): how sizes are worked out and applied, and how Coral treats HPAs.",
      "[Coral FAQ: Does Coral change my Git or GitOps manifests?](/coral-faq#does-coral-change-my-git-or): why Argo CD and Flux see no drift.",
      "[What are resource requests in Kubernetes?](/learn/glossary/kubernetes-resource-requests): what Coral sizes, and why requests set your cloud cost.",
      "[Coral works with Terraform](/coral-works-with-terraform): Coral’s cloud permissions as code.",
    ],
  },
  terraform: {
    route: routes.coralWorksWithTerraform,
    lastUpdated: worksWithLastUpdated,
    meta: {
      title: "Coral works with Terraform",
      description:
        "Create Coral's cloud permissions for AKS and EKS with our Terraform modules. See which node pool fields Coral changes, so each apply doesn't undo them.",
    },
    hero: {
      title: "Coral works with Terraform",
      deck: "Terraform keeps your cloud as code, and our modules add Coral’s cloud permissions to it. Coral then rebalances your workloads and nodes, without editing your workloads’ templates. Where Coral changes a node pool field that Terraform manages, you tell Terraform to ignore it.",
    },
    sections: {
      who: "Who does what: Coral and Terraform",
      together: "How Coral and Terraform work together",
      setup: "Set up Coral with Terraform",
      questions: "Questions about Coral and Terraform",
      readMore: "More on Terraform and Coral",
    },
    who: {
      tool: "Terraform",
      rows: [
        [
          "Coral’s cloud identity and permissions",
          "Our modules create them as code, one cluster at a time.",
          "Uses them to remove machines it has emptied.",
        ],
        [
          "Installing Coral’s agent",
          "The module’s output goes into the Helm chart, which installs the agent.",
          "Registers the cluster and starts reading it.",
        ],
        [
          "Node pools",
          "Creates them and sets each pool’s minimum.",
          "Empties spare nodes, and may reduce a minimum that alone keeps an emptied node.",
        ],
        ["Adding nodes", "Can set up the autoscaler that does it.", "Never adds nodes for demand."],
        ["Your workload specs", "Applies them as you wrote them.", "Never edits them."],
      ],
    },
    together: [
      "You apply our module for AKS or EKS, which creates Coral’s identity and its permissions on one cluster.",
      "You install the agent with the Helm chart, with the module’s output in its values.",
      "Coral empties the nodes you don’t need, one at a time, and sizes pods to real use once you switch on “Automatically optimize”.",
      "Your autoscaler removes each emptied node, and Coral deletes a machine itself only in fixed-size pools that nothing else manages.",
      "If a pool’s minimum alone keeps an emptied node, Coral can reduce that minimum, and it records the old one in tags.",
    ],
    leaves: {
      title: "What stays yours",
      items: [
        "**Your workload specs.** Coral never edits Git or your workload’s template. It sets sizes on pods as they start, or resizes running pods in place.",
        "**Scale-up.** Coral never adds nodes for demand. That stays with your Karpenter, AKS node auto provisioning (NAP) or Cluster Autoscaler.",
        "**Your Karpenter and NAP NodePools.** Coral changes only the NodePools it creates for rebalancing, and those stay after the run.",
        "**Your pool minimums, if you choose.** Our modules can leave out the permission to change a minimum. Otherwise Coral may reduce one, and a disconnect puts it back.",
        "**The rest of your cloud.** Coral’s identity has no secret or key, and its changes are limited to one cluster.",
      ],
    },
    setup: [
      "**Pick the module** for AKS or EKS. Both are open source, on the Terraform Registry. They create the same identity, role and permissions as zoorikctl, with the same names, so zoorikctl sees them as done.",
      "**On AKS,** turn on the cluster’s OIDC issuer and workload identity before you apply.",
      "**On EKS,** choose Pod Identity or IRSA. With Pod Identity, apply the module before you install the agent, so the agent gets its credentials when it starts.",
      "**Install the agent** with the Helm chart and the module’s output, as [Install Coral with Terraform + Helm](/docs/install-coral-with-terraform) shows.",
      "**Ignore Coral’s fields** in your own node pool code, as [Install Coral with Terraform + Helm](/docs/install-coral-with-terraform#your-own-node-pool-code) shows. Otherwise each apply undoes them.",
    ],
    questions: [
      {
        question: "What do Coral’s Terraform modules create?",
        answer: [
          "On AKS, a managed identity with its federated credential, and an assignment of Coral’s custom role on that cluster only. One module call in each tenant also creates the role, and the calls for other clusters reuse it. On EKS, an IAM role with its policy, and a Pod Identity association unless you choose IRSA.",
        ],
      },
      {
        question: "Will `terraform apply` undo what Coral changes?",
        answer: [
          "It can, on node pools that Terraform manages. Coral may reduce a pool’s minimum and, on EKS, a group’s desired size, and it records the old minimum in tags. Tell Terraform to ignore those fields, as [Install Coral with Terraform + Helm](/docs/install-coral-with-terraform#your-own-node-pool-code) shows.",
        ],
      },
      {
        question: "Can I keep every pool minimum as I set it?",
        answer: [
          "Yes. Our modules for AKS and EKS can leave out the permission to change a minimum. Coral then removes emptied machines but doesn’t reduce a minimum.",
        ],
      },
      {
        question: "Do I need Terraform to use Coral?",
        answer: [
          "No. zoorikctl creates the same identity and permissions when it connects a cluster, and asks before every cloud change. The modules are for teams that keep cloud permissions as code.",
        ],
      },
      {
        question: "How do I revoke Coral’s cloud access?",
        answer: [
          "Remove the role assignment or the policy. Node removal stops once your cloud applies the change. The [Trust center](/trust#access) lists what the identity may do.",
        ],
      },
    ],
    readMore: [
      "[Install Coral with Terraform + Helm](/docs/install-coral-with-terraform): the modules, then the agent.",
      "[Coral product guide: Node optimization](/coral-guide#node-optimization): how Coral empties nodes, and who removes them.",
      "[Coral FAQ: Nodes and spare capacity](/coral-faq#nodes-and-spare-capacity): when nodes go, and how much room is kept.",
      "[What is a node pool in Kubernetes?](/learn/glossary/node-pool): node pools on AKS and node groups on EKS.",
      "[Coral works with Helm](/coral-works-with-helm): how Coral fits a Helm workflow.",
    ],
  },
};
