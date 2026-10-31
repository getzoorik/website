import { amoebaDocs, glossaryPath, learnPath, routes } from "@/config/site";
import { amoebaGuideAndFaq } from "@/content/amoeba-page";
import { assessContent, assessmentHref } from "@/content/assess";
import { coralFaqTile } from "@/content/coral-page";
import { howItWorksSteps, type Step } from "@/content/how-it-works";
import type { ProductPageContent } from "@/content/product-page";
import type { Platform, ProductId } from "@/content/products";

/**
 * The four per-cloud pages: `/coral-for-aks`, `/coral-for-eks`, `/amoeba-for-azure` and `/amoeba-for-aws` (D227; owner,
 * 31 Oct 2026: "GO build all 10 at once !!!"). Every string they print, word for word from the checked drafts
 * (docs/website-seo/new-pages-2026-10-31/<slug>/page.md, each claim traced in its ledger.md; TEMPLATES.md's Cloud
 * template, CONSISTENCY.md's cross-page pass) and their mocks (ux-design/website/<slug>.html).
 *
 * 🔴 NO FIGURE, PRICE, VERSION, THRESHOLD, TIMING OR COUNT. A page with a gap says how the product works on that cloud
 * and claims no test. The step cards keep each product's own card names (`how-it-works.ts`, read, never copied), and
 * each says one line about the cloud in place of the figure, mark and key.
 *
 * Coral is AKS and EKS, never Windows or Linux; Amoeba is Windows and Linux VMs on Azure and AWS.
 *
 * The text is the drafts' small markup, drawn by `richText`: `code`, [text](href), **bold**, straight quotes curled,
 * the names kept out of translation. A Read more tile's line is plain text with its apostrophe already curled, as on
 * /coral and /amoeba.
 */

/** A step card's one line about the cloud, under the product's own card name. */
export interface CloudStep {
  readonly ordinal: string;
  readonly title: string;
  /** Amoeba's 02 keeps /amoeba's note: "Services restart at the switch". */
  readonly note?: string;
  readonly line: string;
}

/** The setup table: what connect (or onboarding) sets up, then what it is for. */
export interface CloudTable {
  readonly head: readonly [string, string];
  /** The columns' widths, as the mock's colgroup sets them. */
  readonly widths: readonly [string, string];
  readonly rows: readonly (readonly [string, string])[];
}

/** One question, closed, with its answer. */
export interface CloudQuestion {
  readonly question: string;
  readonly answer: string;
}

/** A Works with tile: the works-with page and one line on who does what. */
export interface CloudTile {
  readonly title: string;
  readonly href: string;
  readonly line: string;
}

interface CloudPageBase {
  readonly product: ProductId;
  /** The page's own address, from the one route table. */
  readonly path: `/${string}`;
  /**
   * The day the page's content last changed, for the sitemap's `lastmod` only: the page prints no date. Whoever
   * changes a page moves its date in the same PR; never the build's date.
   */
  readonly lastUpdated: string;
  readonly meta: {
    /** Goes through the layout's "%s | Zoorik" template; the card repeats it in full. */
    readonly title: string;
    readonly description: string;
  };
  readonly hero: {
    /** The footer label, over the h1 in the home hero's name line. */
    readonly eyebrow: string;
    /** The search phrase, and nothing else. */
    readonly title: string;
    readonly line: string;
    /** One button, same tab, to this product's assessment. */
    readonly cta: { readonly label: string; readonly href: string };
    readonly runsOn: { readonly label: string; readonly platforms: readonly Platform[] };
  };
  /** What <product> does on <cloud> (`#about`): two or three short paragraphs. */
  readonly about: { readonly title: string; readonly paragraphs: readonly string[] };
  /** How it works on <cloud> (`#how`, the page's one band): three cards. */
  readonly how: {
    readonly title: string;
    readonly steps: readonly [CloudStep, CloudStep, CloudStep];
  };
  /** What connect (or onboarding) sets up on <cloud> (`#setup`): the table, then what to know. */
  readonly setup: {
    readonly title: string;
    readonly table: CloudTable;
    readonly notes: readonly string[];
  };
  /** Questions about <product> on <cloud> (`#questions`). */
  readonly questions: { readonly title: string; readonly rows: readonly CloudQuestion[] };
  /** Read more (`#read-<product>`), drawn by /coral's and /amoeba's own row. */
  readonly readMore: ProductPageContent["readMore"];
}

/** Coral's pages: the works-with tiles, then /coral's Install your way. */
export interface CoralCloudPage extends CloudPageBase {
  readonly product: "coral";
  readonly worksWith: { readonly title: string; readonly tiles: readonly CloudTile[] };
}

/** Amoeba's pages: what the VMs need, in the guides' frame with the setup and the questions. */
export interface AmoebaCloudPage extends CloudPageBase {
  readonly product: "amoeba";
  readonly needs: {
    readonly title: string;
    readonly items: readonly string[];
    readonly after: string;
  };
}

export type CloudPageContent = CoralCloudPage | AmoebaCloudPage;

/** The four pages' date: built 31 Oct 2026. */
const BUILT = "31 October 2026";

/** The hero's button: the closing row's own words, to this product's assessment. */
const estimate = (product: ProductId) => ({
  label: assessContent.assessment.cta.label,
  href: assessmentHref(product),
});

/**
 * The three cards: this product's own names (and 02's note on Amoeba), read from `how-it-works.ts`, each with the
 * draft's line for this cloud. `title03` is the draft's name for a third card that differs from the product page's.
 */
function cards(
  product: ProductId,
  lines: readonly [string, string, string],
  title03?: string,
): readonly [CloudStep, CloudStep, CloudStep] {
  const [one, two, three] = howItWorksSteps[product];
  const card = (step: Step, line: string, title = step.title): CloudStep => ({
    ordinal: step.ordinal,
    title,
    ...(step.note ? { note: step.note } : {}),
    line,
  });
  return [card(one, lines[0]), card(two, lines[1]), card(three, lines[2], title03)];
}

/** The setup table's head and widths, the same on all four. */
const SETUP_HEAD: CloudTable["head"] = ["What", "What it is for"];
const SETUP_WIDTHS: CloudTable["widths"] = ["36%", "64%"];

/** The Works with tiles both Coral pages share, after each cloud's own autoscaler. */
const clusterAutoscalerTile: CloudTile = {
  title: "Cluster Autoscaler",
  href: routes.coralWorksWithClusterAutoscaler,
  line: "Coral empties spare nodes, and the Cluster Autoscaler removes them.",
};
const kedaTile: CloudTile = {
  title: "KEDA",
  href: routes.coralWorksWithKeda,
  line: "KEDA sets how many pods run, and Coral sets how big each one is.",
};
const helmTile: CloudTile = {
  title: "Helm",
  href: routes.coralWorksWithHelm,
  line: "Install the agent with our Helm chart, for teams on Helm, Argo CD or Flux.",
};

/** `/coral-for-aks`: docs/website-seo/new-pages-2026-10-31/coral-for-aks/page.md. */
export const coralForAksPage: CoralCloudPage = {
  product: "coral",
  path: routes.coralForAks,
  lastUpdated: BUILT,
  meta: {
    title: "AKS cost optimization",
    description:
      "AKS cost optimization with Coral: it rebalances your cluster, sizes pods to real use, and empties spare nodes for the Cluster Autoscaler or NAP to remove.",
  },
  hero: {
    eyebrow: "Coral for AKS",
    title: "AKS cost optimization",
    line: "Stop paying for idle AKS capacity. Coral rebalances your workloads and removes the spare nodes in your node pools, with no code changes.",
    cta: estimate("coral"),
    runsOn: { label: "Runs on", platforms: ["aks"] },
  },
  about: {
    title: "What Coral does on AKS",
    paragraphs: [
      "Coral rebalances Azure Kubernetes Service (AKS) clusters. It sizes CPU and memory requests to what your containers really use. It also empties spare nodes one at a time, so the Cluster Autoscaler or AKS node auto provisioning (NAP) can remove them.",
      "Adding nodes for demand stays with the Cluster Autoscaler or NAP, and Coral never creates machines itself. With NAP, Coral can also move work onto cheaper machines that NAP launches. The Horizontal Pod Autoscaler and KEDA keep setting how many pods run.",
      'You stay in control. Node optimization is on from install, and you can switch off any node pool it should leave alone. Pod sizing waits until you switch on "Automatically optimize".',
    ],
  },
  how: {
    title: "How it works on AKS",
    steps: cards("coral", [
      "One command in zoorikctl, our command-line tool, installs the agent and creates its managed identity in your Azure account. It uses your own `az` sign-in, and asks before every Azure change.",
      "Coral prices every node and workload from Azure's published rates for your region. You see the capacity you hold against what really runs.",
      "Coral sizes requests to real use and empties spare nodes. The Cluster Autoscaler or NAP then removes them from your node pools.",
    ]),
  },
  setup: {
    title: "What connect sets up on AKS",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          "The Coral agent, its webhook and a node daemon",
          "They run inside your cluster. They read usage, size new pods as they start and make the changes your settings allow.",
        ],
        [
          "A managed identity, with a role on this cluster only",
          "It lets Coral remove the machines it has emptied. It can also reduce a pool's minimum when that minimum alone keeps an emptied machine.",
        ],
        [
          "Workload identity and the OIDC issuer, if they are off",
          "They let the agent use that identity through Microsoft Entra ID, with no secret or key.",
        ],
        [
          "NAP, only if the cluster has no autoscaler",
          "AKS runs it for you. It launches nodes when pods are waiting, and removes the spare ones.",
        ],
      ],
    },
    notes: [
      "The OIDC issuer can't be turned off again once it is on.",
      "NAP needs Azure CNI networking. On a kubenet cluster it can't be set up, so nothing adds nodes until an autoscaler exists.",
      "Run connect with `--dry-run` first. It prints each Azure change and each object the agent setup installs, and changes nothing. If you decline a change, the agent still installs.",
    ],
  },
  worksWith: {
    title: "Works with",
    tiles: [
      {
        title: "AKS node auto provisioning",
        href: routes.coralWorksWithNodeAutoProvisioning,
        line: "NAP launches and removes machines, and Coral sizes the pods they run.",
      },
      clusterAutoscalerTile,
      kedaTile,
      helmTile,
      {
        title: "Terraform",
        href: routes.coralWorksWithTerraform,
        line: "Create Coral's Azure permissions as code with our Terraform module.",
      },
    ],
  },
  questions: {
    title: "Questions about Coral on AKS",
    rows: [
      {
        question: "Does Coral replace the Cluster Autoscaler or NAP?",
        answer:
          "No. The Cluster Autoscaler decides how many nodes each pool has, and NAP also picks the machines. Coral sizes the pod requests they read, so the same work can fit on fewer nodes, and NAP can choose smaller ones.",
      },
      {
        question: "What if my AKS cluster has no autoscaler?",
        answer:
          "Connect offers to turn on NAP, if the cluster uses Azure CNI, and asks you first. In fixed-size pools that nothing else manages, Coral deletes the machines it empties, once you give it the permission to remove nodes. Until an autoscaler runs, nothing adds nodes when demand grows.",
      },
      {
        question: "Can Coral move my workloads to cheaper machines on AKS?",
        answer:
          "Yes, when NAP runs. You choose the nodes to replace, Coral's plan picks cheaper machines that still fit the work, and NAP launches them. With only the Cluster Autoscaler, Coral removes nodes but keeps each pool's VM size.",
      },
      {
        question: "What do I need on Azure to connect a cluster?",
        answer:
          "Cluster-admin on the cluster, and the Azure CLI (`az`), signed in. On the cluster's subscription, you need the Owner role, or Contributor with User Access Administrator.",
      },
      {
        question: "How do I remove Coral's Azure access?",
        answer:
          "Remove the role assignment, and node removal stops once Azure applies the change. `zoorikctl cluster disconnect` also offers to remove the identity it created. Workload identity and the OIDC issuer stay on.",
      },
    ],
  },
  readMore: {
    title: "Read more",
    allDocs: { label: "All docs", href: `${routes.docs}#coral` },
    tiles: [
      {
        kind: "page",
        title: "Product guide",
        line: "Connect a cluster, and what it changes in Azure",
        href: `${routes.coralGuide}#connect-a-cluster`,
      },
      /* /coral's own FAQ tile, read, never copied. */
      coralFaqTile,
      {
        kind: "page",
        title: "How to reduce Kubernetes cost",
        line: "Rebalance requests to real use, then let spare nodes go",
        href: learnPath("reduce-kubernetes-cost"),
      },
      {
        kind: "page",
        title: "Cluster Autoscaler not scaling down",
        line: "Why a node stays on AKS or EKS, and the fix",
        href: learnPath("cluster-autoscaler-not-scaling-down"),
      },
    ],
  },
};

/** `/coral-for-eks`: docs/website-seo/new-pages-2026-10-31/coral-for-eks/page.md. */
export const coralForEksPage: CoralCloudPage = {
  product: "coral",
  path: routes.coralForEks,
  lastUpdated: BUILT,
  meta: {
    title: "EKS cost optimization",
    description:
      "EKS cost optimization with Coral: it rebalances your cluster, sizes pods to real use, and empties spare nodes for Karpenter or the Cluster Autoscaler to remove.",
  },
  hero: {
    eyebrow: "Coral for EKS",
    title: "EKS cost optimization",
    line: "Stop paying for idle EC2 instances in your EKS clusters. Coral rebalances your workloads so spare nodes can go, with no code changes.",
    cta: estimate("coral"),
    runsOn: { label: "Runs on", platforms: ["eks"] },
  },
  about: {
    title: "What Coral does on EKS",
    paragraphs: [
      "Coral rebalances Amazon Elastic Kubernetes Service (EKS) clusters. It sizes pod requests to real use, so fewer EC2 instances can carry the same work. It also empties spare instances one at a time.",
      "On EKS, Karpenter or the Cluster Autoscaler still adds instances when demand grows. Coral never creates machines itself. With Karpenter, a rebalance can also move work onto cheaper EC2 instances that Karpenter launches.",
      'Nothing changes pod sizes until you switch on "Automatically optimize". Node optimization starts at connect, and you pick the node pools it works on.',
    ],
  },
  how: {
    title: "How it works on EKS",
    steps: cards("coral", [
      "Sign in with the AWS CLI and run zoorikctl, our command-line tool. It installs the agent, binds its IAM role with EKS Pod Identity, and asks before every AWS change.",
      "Coral lists each EKS node and workload. You see how much capacity you hold beyond what your pods really use.",
      "Coral empties spare EC2 nodes one at a time, even before pod sizing is switched on. Karpenter or the Cluster Autoscaler then terminates them.",
    ]),
  },
  setup: {
    title: "What connect sets up on EKS",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          "The Coral agent, its webhook and a node daemon",
          "They run inside your cluster. They read usage, size new pods as they start and make the changes your settings allow.",
        ],
        [
          "An IAM role, bound with EKS Pod Identity",
          "It lets Coral terminate instances only in this cluster's Auto Scaling groups. If a group's minimum size is all that keeps an emptied instance, Coral may reduce that minimum.",
        ],
        [
          "The EKS Pod Identity Agent add-on, if it is missing",
          "It gives the agent temporary credentials for that role, with no stored key.",
        ],
        [
          "Karpenter, only if the cluster has no autoscaler",
          "It launches EC2 instances when pods are waiting, and terminates spare ones itself. Connect also creates what Karpenter needs in AWS, such as its IAM roles, an SQS queue and discovery tags.",
        ],
      ],
    },
    notes: [
      "If connect installs Karpenter on a cluster that uses only aws-auth, it switches authentication to API_AND_CONFIG_MAP. That can't be undone.",
      "With `--dry-run`, zoorikctl prints every AWS command and every object it would add to the cluster, and changes nothing.",
      "If you decline the cloud changes, the agent still installs, and pools an autoscaler runs are optimized as usual.",
    ],
  },
  worksWith: {
    title: "Works with",
    tiles: [
      {
        title: "Karpenter",
        href: routes.coralWorksWithKarpenter,
        line: "Karpenter picks the EC2 instances, and Coral sizes the pods that run on them.",
      },
      clusterAutoscalerTile,
      kedaTile,
      helmTile,
      {
        title: "Terraform",
        href: routes.coralWorksWithTerraform,
        line: "Create Coral's AWS permissions as code with our Terraform module.",
      },
    ],
  },
  questions: {
    title: "Questions about Coral on EKS",
    rows: [
      {
        question: "Does Coral replace Karpenter or the Cluster Autoscaler?",
        answer:
          "No. Karpenter picks EC2 instances from pod requests, and the Cluster Autoscaler scales your Auto Scaling groups. Once Coral sizes those requests to real use, both can run fewer instances, and Karpenter can pick smaller ones.",
      },
      {
        question: "What if my EKS cluster has no autoscaler?",
        answer:
          "Connect offers to install Karpenter and, once you say yes, creates what it needs in AWS. If you allow node removal, Coral terminates the instances it empties in Auto Scaling groups that nothing else scales. Until an autoscaler runs, no instances are added when demand grows.",
      },
      {
        question: "Can Coral move my pods to cheaper EC2 instances?",
        answer:
          "Rebalancing needs Karpenter. Coral creates fixed-size NodePools of cheaper instances that still fit your pods, and Karpenter launches them in place of the nodes you choose. With only the Cluster Autoscaler, Coral removes nodes and keeps each group's instance types.",
      },
      {
        question: "What do I need on AWS to connect a cluster?",
        answer:
          "The AWS CLI (`aws`), signed in, plus cluster-admin. Your AWS identity must be allowed to create IAM roles and EKS Pod Identity associations. If connect installs Karpenter, you also need Helm, and permission for SQS, EventBridge and cluster updates.",
      },
      {
        question: "Can I use IRSA instead of EKS Pod Identity?",
        answer: `Yes. Connect sets up EKS Pod Identity, and [our Terraform module for AWS](${routes.docsInstallTerraform}) can set the role up for IRSA instead.`,
      },
    ],
  },
  readMore: {
    title: "Read more",
    allDocs: { label: "All docs", href: `${routes.docs}#coral` },
    tiles: [
      {
        kind: "page",
        title: "Product guide",
        line: "What connect changes in your AWS account",
        href: `${routes.coralGuide}#connect-a-cluster`,
      },
      /* /coral's own FAQ tile, read, never copied. */
      coralFaqTile,
      {
        kind: "page",
        title: "How to change an EKS node group instance type",
        line: "New node group, drain within PDBs, then delete",
        href: learnPath("change-eks-node-group-instance-type"),
      },
      {
        kind: "page",
        title: "KEDA vs Karpenter",
        line: "Pods, nodes and the requests in between",
        href: learnPath("keda-vs-karpenter"),
      },
    ],
  },
};

/** Both Amoeba pages' cards: /amoeba's 01 and 02 (with its note), and the drafts' name for 03 (ledger X1: /amoeba's
 *  "Resize online" is not this page's word). */
const AMOEBA_03 = "Rightsize the pool";

/** `/amoeba-for-azure`: docs/website-seo/new-pages-2026-10-31/amoeba-for-azure/page.md. */
export const amoebaForAzurePage: AmoebaCloudPage = {
  product: "amoeba",
  path: routes.amoebaForAzure,
  lastUpdated: BUILT,
  meta: {
    title: "Azure managed disk cost optimization",
    description:
      "Reduce Azure managed disk cost on Windows and Linux VMs. Amoeba moves data disks onto one pool sized to your data, then grows and shrinks it with your data.",
  },
  hero: {
    eyebrow: "Amoeba for Azure",
    title: "Azure managed disk cost optimization",
    line: "Stop paying for empty disk space. Amoeba rightsizes the Azure managed data disks on your Windows and Linux VMs, autonomously.",
    cta: estimate("amoeba"),
    runsOn: { label: "Runs on", platforms: ["azure", "windows", "linux"] },
  },
  about: {
    title: "What Amoeba does on Azure",
    paragraphs: [
      "Amoeba rightsizes your data disks to reduce your Azure managed disk cost. A managed disk can be made larger, but not smaller. So you pay for the size you provisioned, however much data it holds.",
      "Amoeba moves a VM's data disks onto one pool of Premium SSD v2 disks. Where the region or zone doesn't offer Premium SSD v2, it uses Premium SSD. It sizes the pool from your peak use and recent growth, with room to grow, not from the size of the old disks.",
      "The services that use the data mounts restart at the switch onto the pool. After that, the pool changes size while they run, and you pay for close to the data you hold.",
    ],
  },
  how: {
    title: "How it works on Azure",
    steps: cards(
      "amoeba",
      [
        "Connect your Azure directory once, with a script you run in Azure Cloud Shell. Then pick your VMs, and Amoeba installs its agent through Azure Run Command.",
        "Amoeba copies your data onto one pool of managed disks while your services run. Then each mount switches to the pool, at the same path.",
        "Before the pool fills, Amoeba grows its managed disks in place, or adds a disk while the VM has a free slot. When your data goes down and stays down, it takes one disk out at a time. The pool stays mounted while it changes.",
      ],
      AMOEBA_03,
    ),
  },
  setup: {
    title: "What onboarding sets up on Azure",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          'The role "Zoorik Storage Operator"',
          "A custom role, assigned to Zoorik's app on each subscription you connect. It can read every resource, update VMs, run commands on them, and create and delete disks and snapshots.",
        ],
        [
          "Zoorik's app in your directory",
          "The identity that holds the role. The connect script adds it to your directory.",
        ],
        [
          "The agent on each VM",
          "Installed through Azure Run Command when you onboard the VM. It reports the VM's disks and mounts to Zoorik, and carries out the move, the expands and the shrinks.",
        ],
        [
          "Pool disks",
          "The managed disks that hold your data after the move. Amoeba adds, grows and removes them as the pool expands and shrinks.",
        ],
        [
          "Safety snapshots",
          "One incremental snapshot of each source disk, in the disk's own resource group. Taken before Amoeba deletes the disk, and deleted after a few days.",
        ],
      ],
    },
    notes: [
      "The role is the limit on what Zoorik can do in your Azure. A permission added to the role later reaches your subscription only when you run the script again.",
      "Onboarding is your go-ahead. After the agent's first report, the move starts by itself.",
      "A move only goes forward. Amoeba deletes a source disk only after its own snapshot has succeeded.",
    ],
  },
  needs: {
    title: "What your VMs need",
    items: [
      "A running VM with at least one data disk. The data must sit on mounted filesystems.",
      "A few free data-disk slots. The pool's disks attach beside the old ones during the move. With too few, Amoeba declines the VM and says why.",
      "Outbound access from the VM to Zoorik, and to the hosts the agent downloads from.",
      "On Linux: a recent kernel that supports btrfs. Every service that keeps a data mount open must run under systemd. The agent also needs rsync, btrfs-progs and psmisc, which the installer doesn't add.",
      "VMs that use Azure Disk Encryption are not moved as they are.",
    ],
    after: `To connect, you need the rights to add Zoorik's app to your directory, create a custom role and assign it on each subscription. The [product guide](${routes.amoebaGuide}#before-you-start) has the full list.`,
  },
  questions: {
    title: "Questions about Amoeba on Azure",
    rows: [
      {
        question: "Which Azure disks does Amoeba work on?",
        answer: `The managed data disks of running Windows and Linux VMs. Amoeba never touches the OS disk. On AWS, it works with Amazon EBS volumes: see [Amoeba for AWS](${routes.amoebaForAws}).`,
      },
      {
        question: "Which Azure disk type does Amoeba's pool use?",
        answer:
          "Premium SSD v2 where the VM's region and zone offer it, and Premium SSD where they don't. Data on Standard SSD, Standard HDD or Ultra Disk moves to the pool's type, which can cost more than Standard disks. Zone-redundant (ZRS) disks map to a locally redundant pool, so the data loses zone redundancy.",
      },
      {
        question: "Is there downtime on Azure?",
        answer:
          "Only at the switch. Once the copy onto the pool has caught up, the switch runs by itself, and the services that use those mounts stop and start again. After that, expands and shrinks run while your services keep working.",
      },
      {
        question: "Do shrinks wait for me?",
        answer:
          'Only if you choose. Each VM has one setting, "When Zoorik shrinks": in "Auto" shrinks run on their own, and in "Manual" each one waits for you. Expands run on their own, whatever the setting.',
      },
      {
        question: "How is the saving worked out on Azure?",
        answer:
          "At Azure's public list price for the disk type and region, measured against the source disks. A saving can be negative, for example when a pool has grown past the disks it replaced. Amoeba shows it as it is.",
      },
    ],
  },
  readMore: {
    title: "Read more",
    allDocs: { label: "All docs", href: `${routes.docs}#amoeba` },
    tiles: [
      /* /amoeba's guide and FAQ tiles, behind its flag: drawn only while both are published. */
      ...(amoebaDocs ? amoebaGuideAndFaq : []),
      {
        kind: "page",
        title: "Azure disk cost optimization",
        line: "What a managed disk is charged for, and how to pay for your data",
        href: learnPath("azure-disk-cost-optimization"),
      },
      {
        kind: "page",
        title: "Shrinking an Azure managed disk",
        line: "Why it can’t, and what works",
        href: learnPath("shrink-azure-managed-disk"),
      },
    ],
  },
};

/** `/amoeba-for-aws`: docs/website-seo/new-pages-2026-10-31/amoeba-for-aws/page.md. Amoeba on AWS is built, and the
 *  page says how it works and claims nothing more (ledger X4). */
export const amoebaForAwsPage: AmoebaCloudPage = {
  product: "amoeba",
  path: routes.amoebaForAws,
  lastUpdated: BUILT,
  meta: {
    title: "EBS cost optimization",
    description:
      "Reduce Amazon EBS cost on EC2 instances. Amoeba moves data volumes onto one pool of gp3 volumes sized to your data, then grows and shrinks it with your data.",
  },
  hero: {
    eyebrow: "Amoeba for AWS",
    title: "EBS cost optimization",
    line: "Stop paying for empty EBS space. Amoeba rightsizes the data volumes on your Windows and Linux EC2 instances, autonomously.",
    cta: estimate("amoeba"),
    runsOn: { label: "Runs on", platforms: ["aws", "windows", "linux"] },
  },
  about: {
    title: "What Amoeba does on AWS",
    paragraphs: [
      "Amoeba rightsizes the EBS data volumes on your EC2 instances to reduce your EBS cost. AWS lets you grow an EBS volume but never shrink it, and charges per GB-month for its full size. So a volume costs the same, however little data it holds.",
      "Amoeba moves an instance's data volumes onto one pool of gp3 volumes, in the same Availability Zone. The pool is sized to your data, with room to grow. Encrypted data stays encrypted, with the KMS key of the first encrypted source volume.",
      "When each mount switches to the gp3 pool, the services that use it stop and start again. After that, Amoeba adds, grows and removes gp3 volumes while your services run.",
    ],
  },
  how: {
    title: "How it works on AWS",
    steps: cards(
      "amoeba",
      [
        "Enter your AWS account ID, then run a script in AWS CloudShell. Pick your instances, and Amoeba installs its agent through AWS Systems Manager.",
        "While your services keep running, Amoeba copies the data to a pool of gp3 volumes in the instance's Availability Zone. Each mount then moves to the pool and keeps its path.",
        "Amoeba adds or grows gp3 volumes before the pool fills. If your data shrinks and stays smaller, it removes one volume at a time, and the pool stays mounted throughout.",
      ],
      AMOEBA_03,
    ),
  },
  setup: {
    title: "What onboarding sets up on AWS",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          "The IAM role ZoorikStorageOperator",
          "Created by the script you run in AWS CloudShell. It can read EC2 and Systems Manager, and run commands through Systems Manager. It can also create, modify, attach, detach and delete volumes, and create and delete snapshots.",
        ],
        [
          "The agent on each instance",
          "Amoeba installs it through AWS Systems Manager when you onboard the instance. It tells Zoorik which disks and mounts the instance has, and runs the move and every expand and shrink.",
        ],
        [
          "Pool volumes",
          "The gp3 volumes in the instance's Availability Zone. After the move they hold your data, and Amoeba adds, grows or removes them as the pool changes size.",
        ],
        [
          "Safety snapshots",
          "An EBS snapshot of each source volume. Taken before Amoeba deletes the volume, and kept for a few days.",
        ],
      ],
    },
    notes: [
      "The role trusts Zoorik's AWS account only with your organisation's external ID. Zoorik's own AWS identity may only assume roles named ZoorikStorageOperator, and read AWS prices.",
      "New pool volumes take the KMS key of the first encrypted source volume, so encryption at rest carries over.",
      "Systems Manager keeps each command's history in your account.",
    ],
  },
  needs: {
    title: "What your VMs need",
    items: [
      "A running EC2 instance with at least one EBS data volume. The data must sit on mounted filesystems.",
      "The instance is managed by AWS Systems Manager, with the SSM agent connected.",
      "A Nitro instance type that exposes EBS as NVMe.",
      "Spare volume attachment slots, since the pool's volumes attach next to the old ones during the move. If there are too few, Amoeba declines the instance and says why.",
      "Network access out to Zoorik, and to the hosts the agent downloads from.",
      "On Linux, the instance needs a recent kernel with btrfs support, and every service that holds a data mount open running under systemd. It also needs rsync, btrfs-progs and psmisc installed first: the installer doesn't add them.",
    ],
    after: `The [product guide](${routes.amoebaGuide}#before-you-start) has the full list.`,
  },
  questions: {
    title: "Questions about Amoeba on AWS",
    rows: [
      {
        question: "Which EBS volumes does Amoeba work on?",
        answer: `The non-root EBS data volumes of running EC2 instances, on Windows and Linux. Amoeba never touches the root volume. On Azure, it works with managed disks: see [Amoeba for Azure](${routes.amoebaForAzure}).`,
      },
      {
        question: "Which EBS volume type does Amoeba's pool use?",
        answer:
          "The pool uses gp3 volumes, in the instance's Availability Zone. Each instance gets one pool. Each pool volume gets at least the baseline performance gp3 includes, and more when the instance's own load needs it.",
      },
      {
        question: "Do my services on EC2 go down during the move?",
        answer:
          "Only at the switch. Amoeba copies the data while your services run, then switches each mount to the gp3 pool by itself once the copy has caught up. The services using those mounts restart then, and again only if a failed switch is retried, never for an expand or shrink.",
      },
      {
        question: "Do I pay for both sets of volumes during the move?",
        answer:
          "Yes, but only while the move runs. The source volumes are deleted once the switch is checked. Then you pay for their snapshots for the few days they're kept.",
      },
      {
        question: "How is the saving worked out on AWS?",
        answer:
          "At list price from the AWS Price List API, measured against the source volumes. AWS charges for EBS per GB-month. A saving can be negative, and Amoeba shows it as it is.",
      },
    ],
  },
  readMore: {
    title: "Read more",
    allDocs: { label: "All docs", href: `${routes.docs}#amoeba` },
    tiles: [
      /* /amoeba's guide and FAQ tiles, behind its flag: drawn only while both are published. */
      ...(amoebaDocs ? amoebaGuideAndFaq : []),
      {
        kind: "page",
        title: "How to check EBS volume usage",
        line: "Used space against the size you pay for",
        href: learnPath("check-ebs-volume-usage"),
      },
      {
        kind: "page",
        title: "What is gp3 in AWS?",
        line: "The volume type Amoeba’s pool uses on AWS",
        href: glossaryPath("ebs-gp3"),
      },
    ],
  },
};

/** The four, in the footer's order: Coral's two, then Amoeba's. The sitemap reads each page's path and date here. */
export const cloudPages: readonly CloudPageContent[] = [
  coralForAksPage,
  coralForEksPage,
  amoebaForAzurePage,
  amoebaForAwsPage,
];
