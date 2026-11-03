import { amoebaDocs, glossaryPath, learnPath, routes } from "@/config/site";
import { amoebaGuideAndFaq } from "@/content/amoeba-page";
import { assessContent, assessmentHref } from "@/content/assess";
import type { InstallCloud } from "@/content/coral-install";
import { coralFaqTile } from "@/content/coral-page";
import { howItWorksSteps, type Step } from "@/content/how-it-works";
import type { ProductPageContent, ReadMoreTile } from "@/content/product-page";
import type { Platform, ProductId } from "@/content/products";

/**
 * The four per-cloud pages: `/aks-cost-optimization`, `/eks-cost-optimization`, `/azure-managed-disk-cost-optimization`
 * and `/ebs-cost-optimization`. Each says what its product does on that cloud, how it works there, what connect (or
 * onboarding) sets up, and answers a buyer's questions. Rewritten at zero noise on 2 Nov 2026; every claim is checked
 * against the products' guides and FAQs.
 *
 * 🔴 NO FIGURE, PRICE, VERSION, THRESHOLD, TIMING OR COUNT, but for the safety snapshots' 7 days, which /security and
 * the terms print. A page says how the product works on that cloud and claims no test. The step cards keep each
 * product's own card names (`how-it-works.ts`, read, never copied), and each says one line about the cloud in place of
 * the figure, mark and key.
 *
 * Coral is AKS and EKS, never Windows or Linux; Amoeba is Windows and Linux VMs on Azure and AWS.
 *
 * The text is the small markup `richText` draws: `code`, [text](href), **bold**, straight quotes curled, the names kept
 * out of translation. A Read more tile's line is plain text with its apostrophe already curled, as on /coral and
 * /amoeba.
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
  /** The cluster's cloud: Install your way's Terraform card shows only its module (`coralInstall.terraform.modules`). */
  readonly cloud: InstallCloud;
  readonly worksWith: { readonly title: string; readonly tiles: readonly CloudTile[] };
  /** Its own name for /coral's Install your way, where it is not `coralInstall.title` (2 Nov 2026). */
  readonly installTitle?: string;
  /** A line under the closing row's "One PDF report…", to the pricing calculator. */
  readonly calculator?: string;
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

/** The four pages' date: the zero-noise rewrite of 2 Nov 2026. */
const NOV_3 = "3 November 2026";

/** The hero's button: the closing row's own words, to this product's assessment. */
const estimate = (product: ProductId) => ({
  label: assessContent.assessment.cta.label,
  href: assessmentHref(product),
});

/**
 * The three cards: this product's own names (and 02's note on Amoeba), read from `how-it-works.ts`, each with its line
 * for this cloud. `title03` names a third card that differs from the product page's.
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
/* What the works-with page says, as Install your way below already says how to install with Helm. */
const helmTile: CloudTile = {
  title: "Helm",
  href: routes.coralWorksWithHelm,
  line: "Coral never edits your charts or templates, so Argo CD and Flux see no drift.",
};

/** A Coral page's Read more tile to the Kubernetes guide, the same on AKS and EKS. */
const kubernetesGuideTile: ReadMoreTile = {
  kind: "page",
  title: "Kubernetes cost optimization",
  line: "Rebalance requests, then remove spare nodes",
  href: routes.kubernetesCostOptimization,
};

/** The Amoeba pages' paragraph after the move, the same on Azure and AWS. */
const AMOEBA_AFTER_MOVE =
  "The pool grows before it fills and shrinks when your data goes down, without any downtime. You pay for close to the data you hold.";

/** The Amoeba pages' note on when the move starts, the same on Azure and AWS. */
const AMOEBA_GO_AHEAD =
  "Onboarding is your go-ahead: the move starts by itself after the agent's first report.";

/** The Amoeba pages' questions that hold on both clouds. */
const amoebaDowntime: CloudQuestion = {
  question: "Is there any downtime?",
  answer:
    "Amoeba grows and shrinks the pool without any downtime: it stays mounted and your services keep running. Only the move onto the pool restarts the services that use the moved mounts, at the switch. The switch runs by itself once the copy has caught up. If it fails, Amoeba puts the original mounts back and tries again.",
};
const amoebaShrinks: CloudQuestion = {
  question: "Do shrinks wait for me?",
  answer:
    'Only if you choose. Each VM has one setting, "When Zoorik shrinks": in "Auto" shrinks run on their own, and in "Manual" each one waits for you. Expands always run on their own.',
};

/** `/aks-cost-optimization`: Coral on Azure Kubernetes Service. */
export const aksCostOptimizationPage: CoralCloudPage = {
  product: "coral",
  path: routes.aksCostOptimization,
  lastUpdated: NOV_3,
  cloud: "aks",
  meta: {
    title: "AKS cost optimization",
    description:
      "Coral reduces AKS costs without any downtime: it rebalances pod requests to real use and removes spare nodes, with the Cluster Autoscaler or NAP.",
  },
  hero: {
    eyebrow: "Coral for AKS",
    title: "AKS cost optimization",
    line: "Coral rebalances your AKS workloads and removes the nodes you don't need, without any downtime or code changes.",
    cta: estimate("coral"),
    runsOn: { label: "Runs on", platforms: ["aks"] },
  },
  about: {
    title: "How Coral reduces AKS costs",
    paragraphs: [
      "Coral rebalances CPU and memory requests to what your containers really use, so the same work fits on fewer nodes. Then it removes the nodes your Azure Kubernetes Service (AKS) cluster doesn't need, one at a time.",
      "The Cluster Autoscaler or node auto provisioning (NAP) still adds nodes when demand grows: Coral never creates machines itself. The Horizontal Pod Autoscaler and KEDA still set how many pods run.",
      'Node optimization starts at connect, and you can switch it off for any node pool. Requests change only after you switch on "Automatically optimize".',
    ],
  },
  how: {
    title: "How it works",
    steps: cards("coral", [
      "One command in zoorikctl, our command-line tool, installs the agent and creates its managed identity. It uses your `az` sign-in, lists every Azure change and asks once.",
      "Coral prices every node and workload at Azure list price for your region, and shows the capacity you hold against real use.",
      "Coral rebalances requests to real use, then removes spare nodes one at a time.",
    ]),
  },
  setup: {
    title: "What connect sets up",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          "The Coral agent, its webhook and the live-migration daemon",
          "They run in your cluster. They read usage, set new pods' requests as they start, and make the changes your settings allow.",
        ],
        [
          "A managed identity, with a role on this cluster only",
          "Lets Coral remove the machines it has emptied. Where a pool's minimum alone keeps an emptied machine, it can reduce that minimum.",
        ],
        [
          "Workload identity and the OIDC issuer, if they are off",
          "Let the agent use that identity through Microsoft Entra ID, with no secret or key.",
        ],
        [
          "NAP, only if the cluster has no autoscaler",
          "Run by AKS. It launches nodes when pods are waiting, and removes spare ones.",
        ],
      ],
    },
    notes: [
      "The OIDC issuer can't be turned off once it is on.",
      "NAP needs Azure CNI. On a kubenet cluster it can't be set up, so nothing adds nodes until you add an autoscaler.",
      "Run connect with `--dry-run` first. It prints every Azure change and every object it would install, and changes nothing.",
      "If you decline the cloud changes, the agent still installs, and pools run by an autoscaler are optimized as usual.",
    ],
  },
  worksWith: {
    title: "Works with",
    tiles: [
      {
        title: "AKS node auto provisioning",
        href: routes.coralWorksWithNodeAutoProvisioning,
        line: "NAP launches and removes machines, and Coral rebalances the pods they run.",
      },
      clusterAutoscalerTile,
      kedaTile,
      helmTile,
      {
        title: "Terraform",
        href: routes.coralWorksWithTerraform,
        line: "Tell Terraform to ignore the node pool fields Coral changes, so an apply doesn't undo them.",
      },
    ],
  },
  questions: {
    title: "Questions",
    rows: [
      {
        question: "Does Coral replace the Cluster Autoscaler or NAP?",
        answer:
          "No. They still decide how many nodes run, and NAP also picks the machines. Coral rebalances the requests they read, so the same work fits on fewer nodes and NAP can choose smaller ones.",
      },
      {
        question: "What if my AKS cluster has no autoscaler?",
        answer:
          "Connect offers to turn on NAP, if the cluster uses Azure CNI, and asks you first. In fixed-size pools, Coral deletes the machines it empties once you allow node removal. Until an autoscaler runs, nothing adds nodes when demand grows.",
      },
      {
        question: "Can Coral move work to cheaper machines?",
        answer:
          "Yes, when NAP runs. You choose the nodes to replace. Coral picks cheaper machines that still fit the work, and NAP launches them. With only the Cluster Autoscaler, Coral removes nodes and keeps each pool's VM size.",
      },
      {
        question: "What do I need to connect a cluster?",
        answer:
          "Cluster-admin on the cluster, and the Azure CLI (`az`), signed in. On the cluster's subscription: Owner, or Contributor with User Access Administrator.",
      },
      {
        question: "How do I remove Coral's Azure access?",
        answer:
          "Remove the role assignment, and node removal stops once Azure applies it. `zoorikctl cluster disconnect` also offers to remove the identity it created. Workload identity and the OIDC issuer stay on.",
      },
    ],
  },
  readMore: {
    title: "Coral docs and guides",
    allDocs: { label: "All docs", href: `${routes.docs}#coral` },
    tiles: [
      {
        kind: "page",
        title: "Product guide",
        line: "What connect changes in Azure",
        href: `${routes.coralGuide}#connect-a-cluster`,
      },
      /* /coral's own FAQ tile, read, never copied. */
      coralFaqTile,
      kubernetesGuideTile,
      {
        kind: "page",
        title: "Cluster Autoscaler not scaling down",
        line: "What keeps a node running, and the fix",
        href: learnPath("cluster-autoscaler-not-scaling-down"),
      },
      {
        kind: "page",
        title: "AKS pricing calculator",
        line: "What an AKS node costs a month, at list price",
        href: routes.eksAndAksPricingCalculator,
      },
    ],
  },
};

/** `/eks-cost-optimization`: Coral on Amazon Elastic Kubernetes Service. */
export const eksCostOptimizationPage: CoralCloudPage = {
  product: "coral",
  path: routes.eksCostOptimization,
  lastUpdated: NOV_3,
  cloud: "eks",
  meta: {
    title: "EKS cost optimization",
    description:
      "Coral reduces EKS costs without any downtime: it rebalances pod requests to real use and removes spare EC2 nodes, with Karpenter or the Cluster Autoscaler.",
  },
  hero: {
    eyebrow: "Coral for EKS",
    title: "EKS cost optimization",
    line: "Coral rebalances your EKS workloads and removes the EC2 nodes you don't need, without any downtime or code changes.",
    cta: estimate("coral"),
    runsOn: { label: "Runs on", platforms: ["eks"] },
  },
  about: {
    title: "How Coral reduces EKS costs",
    paragraphs: [
      "Coral rebalances CPU and memory requests to what your containers really use, so the same work fits on fewer EC2 instances. Then it removes the nodes your Amazon Elastic Kubernetes Service (EKS) cluster doesn't need, one at a time.",
      "Karpenter or the Cluster Autoscaler still adds nodes when demand grows: Coral never creates machines itself. The Horizontal Pod Autoscaler and KEDA still set how many pods run.",
      'Node optimization starts at connect, and you can switch it off for any node pool. Requests change only after you switch on "Automatically optimize".',
    ],
  },
  how: {
    title: "How it works",
    steps: cards("coral", [
      "Run zoorikctl, our command-line tool, with your `aws` sign-in. It lists every AWS change and asks once, then installs the agent with its EKS Pod Identity role.",
      "Coral shows every EKS node and workload, and the capacity you hold beyond what your pods really use.",
      "Coral rebalances requests, then drains spare EC2 nodes within your PodDisruptionBudgets and removes them.",
    ]),
  },
  setup: {
    title: "What connect sets up",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          "The Coral agent, its webhook and the live-migration daemon",
          "They run in your cluster. They read usage, set new pods' requests as they start, and make the changes your settings allow.",
        ],
        [
          "An IAM role, bound with EKS Pod Identity",
          "Lets Coral terminate instances only in this cluster's Auto Scaling groups. Where a group's minimum alone keeps an emptied instance, it can reduce that minimum.",
        ],
        [
          "The EKS Pod Identity Agent add-on, if it is missing",
          "Gives the agent temporary credentials for that role, with no stored key.",
        ],
        [
          "Karpenter, only if the cluster has no autoscaler",
          "Launches EC2 instances when pods are waiting, and terminates spare ones. Connect also creates what it needs in AWS, such as IAM roles, an SQS queue and discovery tags.",
        ],
      ],
    },
    notes: [
      "If connect installs Karpenter on a cluster that uses only aws-auth, it switches authentication to API_AND_CONFIG_MAP. That can't be undone.",
      "Run connect with `--dry-run` first. It prints every AWS change and every object it would install, and changes nothing.",
      "If you decline the cloud changes, the agent still installs, and pools run by an autoscaler are optimized as usual.",
    ],
  },
  worksWith: {
    title: "Works with",
    tiles: [
      {
        title: "Karpenter",
        href: routes.coralWorksWithKarpenter,
        line: "Karpenter picks the EC2 instances, and Coral rebalances the pods that run on them.",
      },
      clusterAutoscalerTile,
      kedaTile,
      helmTile,
      {
        title: "Terraform",
        href: routes.coralWorksWithTerraform,
        line: "Tell Terraform to ignore the node group fields Coral changes, so an apply doesn't undo them.",
      },
    ],
  },
  calculator: `Or see what an EKS node costs a month in our [pricing calculator](${routes.eksAndAksPricingCalculator}).`,
  questions: {
    title: "Questions",
    rows: [
      {
        question: "Does Coral replace Karpenter or the Cluster Autoscaler?",
        answer:
          "No. Both still add machines: Karpenter picks EC2 instances from pod requests, and the Cluster Autoscaler scales your Auto Scaling groups. Once Coral rebalances those requests, both can run fewer instances, and Karpenter can pick smaller ones.",
      },
      {
        question: "What if my EKS cluster has no autoscaler?",
        answer:
          "Connect offers to install Karpenter and, once you say yes, creates what it needs in AWS. In Auto Scaling groups that nothing else scales, Coral terminates the instances it empties, once you allow node removal. Until an autoscaler runs, nothing adds instances when demand grows.",
      },
      {
        question: "Can Coral move pods to cheaper instances?",
        answer:
          "Yes, with Karpenter. You choose the nodes to replace. Coral creates fixed-size NodePools of cheaper instances that still fit your pods, and Karpenter launches them. With only the Cluster Autoscaler, Coral removes nodes and keeps each group's instance types.",
      },
      {
        question: "What do I need to connect a cluster?",
        answer:
          "Cluster-admin, and the AWS CLI (`aws`), signed in. Your AWS identity must be able to create IAM roles and EKS Pod Identity associations. If connect installs Karpenter, you also need Helm, and permission for SQS, EventBridge and cluster updates.",
      },
      {
        question: "Can I use IRSA instead of EKS Pod Identity?",
        answer: `Yes. Connect sets up EKS Pod Identity, and [our Terraform module for AWS](${routes.docsInstallTerraform}) can set the role up for IRSA instead.`,
      },
    ],
  },
  readMore: {
    title: "Coral docs and guides",
    allDocs: { label: "All docs", href: `${routes.docs}#coral` },
    tiles: [
      {
        kind: "page",
        title: "Product guide",
        line: "What connect changes in AWS",
        href: `${routes.coralGuide}#connect-a-cluster`,
      },
      /* /coral's own FAQ tile, read, never copied. */
      coralFaqTile,
      kubernetesGuideTile,
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

/** Both Amoeba pages' third card: /amoeba's says "Resize without any downtime", which these pages' hero already says. */
const AMOEBA_03 = "Rightsize the pool";

/** `/azure-managed-disk-cost-optimization`: Amoeba on Azure managed disks. */
export const azureManagedDiskCostOptimizationPage: AmoebaCloudPage = {
  product: "amoeba",
  path: routes.azureManagedDiskCostOptimization,
  lastUpdated: NOV_3,
  meta: {
    title: "Azure managed disk cost optimization",
    description:
      "Amoeba reduces Azure managed disk costs on Windows and Linux VMs. It moves data disks onto one btrfs pool, then rightsizes it without any downtime.",
  },
  hero: {
    eyebrow: "Amoeba for Azure",
    title: "Azure managed disk cost optimization",
    line: "Amoeba rightsizes the managed data disks on your Azure VMs to fit your data, without any downtime.",
    cta: estimate("amoeba"),
    runsOn: { label: "Runs on", platforms: ["azure", "windows", "linux"] },
  },
  about: {
    title: "How Amoeba reduces Azure disk costs",
    paragraphs: [
      "An Azure managed disk can grow but never shrink. You pay for its provisioned size, however much data it holds.",
      "Amoeba moves a VM's data disks onto one btrfs pool. The pool is sized from your peak use and recent growth, with room to grow, not from the old disks' size.",
      AMOEBA_AFTER_MOVE,
    ],
  },
  how: {
    title: "How it works",
    steps: cards(
      "amoeba",
      [
        "Connect your Azure directory once, with a script in Azure Cloud Shell. Then pick your VMs, and Amoeba installs its agent through Azure Run Command.",
        "Amoeba copies your data onto a pool of managed disks while your services run. Then each mount switches to the pool, at the same path.",
        "Amoeba grows or adds disks before the pool fills. When your data goes down and stays down, it removes one disk at a time. The pool stays mounted.",
      ],
      AMOEBA_03,
    ),
  },
  setup: {
    title: "What onboarding sets up",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          'The role "Zoorik Storage Operator"',
          "A custom role for Zoorik's app, on each subscription you connect. It can read every resource, update VMs, run commands on them, and create and delete disks and snapshots.",
        ],
        [
          "Zoorik's app in your directory",
          "The identity that holds the role. The connect script adds it.",
        ],
        [
          "The agent on each VM",
          "Installed through Azure Run Command. It reports the VM's disks and mounts, and runs the move, expands and shrinks.",
        ],
        [
          "Pool disks",
          "The managed disks that hold your data after the move. Amoeba adds, grows and removes them as the pool changes size.",
        ],
        [
          "Safety snapshots",
          "An incremental snapshot of each source disk, in the disk's resource group, taken before the disk is deleted. Deleted after 7 days.",
        ],
      ],
    },
    notes: [
      "The role is the limit of what Zoorik can do in your Azure. A permission added to it later reaches your subscription only when you run the script again.",
      AMOEBA_GO_AHEAD,
      "A move only goes forward. Amoeba deletes a source disk only after its snapshot succeeds.",
    ],
  },
  needs: {
    title: "What your VMs need",
    items: [
      "A running VM with at least one data disk, its data on mounted filesystems.",
      "A few free data-disk slots, since the pool's disks attach beside the old ones during the move. With too few, Amoeba declines the VM and says why.",
      "Outbound access to Zoorik, and to the hosts the agent downloads from.",
      "On Linux: a recent kernel with btrfs, and every process that keeps a data mount open running as a systemd service. Install rsync, btrfs-progs and psmisc first: the installer doesn't add them.",
      "No Azure Disk Encryption: VMs that use it are not moved as they are.",
    ],
    after: `To connect, you need the rights to add Zoorik's app to your directory, create a custom role and assign it on each subscription. The [product guide](${routes.amoebaGuide}#before-you-start) has the full list.`,
  },
  questions: {
    title: "Questions",
    rows: [
      {
        question: "Which Azure disks does Amoeba work on?",
        answer: `The managed data disks of running Windows and Linux VMs. Amoeba never touches the OS disk. On AWS, it works with EBS volumes: see [EBS cost optimization](${routes.ebsCostOptimization}).`,
      },
      {
        question: "Which disk type does the pool use?",
        answer:
          "Premium SSD v2 where the VM's region and zone offer it, and Premium SSD where they don't. Data on Standard SSD, Standard HDD or Ultra Disk moves to the pool's type, which can cost more per GiB than Standard disks. Zone-redundant (ZRS) disks move to a locally redundant pool and lose zone redundancy.",
      },
      amoebaDowntime,
      amoebaShrinks,
      {
        question: "Do I pay for both sets of disks during the move?",
        answer:
          "Yes, but only while the move runs. Each source disk is deleted once the switch is checked. Then you pay for its snapshot for the 7 days it's kept.",
      },
      {
        question: "How is the saving worked out?",
        answer:
          "At Azure's public list price for the disk type and region, against the source disks. A saving can be negative, for example when a pool grows past the disks it replaced. Amoeba shows it as it is.",
      },
    ],
  },
  readMore: {
    title: "Amoeba docs and guides",
    allDocs: { label: "All docs", href: `${routes.docs}#amoeba` },
    tiles: [
      /* /amoeba's guide and FAQ tiles, behind its flag: drawn only while both are published. */
      ...(amoebaDocs ? amoebaGuideAndFaq : []),
      {
        kind: "page",
        title: "Azure disk reservations: are they worth it?",
        line: "When a reservation pays, and what to do first",
        href: learnPath("azure-disk-reservations"),
      },
      {
        kind: "page",
        title: "Shrinking an Azure managed disk",
        line: "Why it can’t, and what works",
        href: learnPath("shrink-azure-managed-disk"),
      },
      {
        kind: "page",
        title: "Azure disk pricing",
        line: "What a managed disk costs a month, at list price",
        href: routes.ebsAndAzureDiskPricing,
      },
    ],
  },
};

/** `/ebs-cost-optimization`: Amoeba on Amazon EBS. It says how Amoeba works on AWS and claims nothing more. */
export const ebsCostOptimizationPage: AmoebaCloudPage = {
  product: "amoeba",
  path: routes.ebsCostOptimization,
  lastUpdated: NOV_3,
  meta: {
    title: "EBS cost optimization",
    description:
      "Amoeba reduces Amazon EBS costs on Windows and Linux EC2 instances. It moves data volumes onto one gp3 pool, then rightsizes it without any downtime.",
  },
  hero: {
    eyebrow: "Amoeba for AWS",
    title: "EBS cost optimization",
    line: "Amoeba rightsizes the EBS data volumes on your EC2 instances to fit your data, without any downtime.",
    cta: estimate("amoeba"),
    runsOn: { label: "Runs on", platforms: ["aws", "windows", "linux"] },
  },
  about: {
    title: "How Amoeba reduces EBS costs",
    paragraphs: [
      "AWS charges for an EBS volume's full size, per GB-month. A volume can grow but never shrink, so it costs the same however little data it holds.",
      "Amoeba moves an instance's data volumes onto one btrfs pool of gp3 volumes, in the same Availability Zone. The pool is sized from your peak use and recent growth, with room to grow, not from the old volumes' size.",
      AMOEBA_AFTER_MOVE,
    ],
  },
  how: {
    title: "How it works",
    steps: cards(
      "amoeba",
      [
        "Enter your AWS account ID, then run a script in AWS CloudShell. Pick your instances, and Amoeba installs its agent through AWS Systems Manager.",
        "Amoeba copies your data onto a pool of gp3 volumes while your services run. Then each mount switches to the pool, at the same path.",
        "Amoeba grows or adds gp3 volumes before the pool fills. When your data goes down and stays down, it removes one volume at a time. The pool stays mounted.",
      ],
      AMOEBA_03,
    ),
  },
  setup: {
    title: "What onboarding sets up",
    table: {
      head: SETUP_HEAD,
      widths: SETUP_WIDTHS,
      rows: [
        [
          "The IAM role ZoorikStorageOperator",
          "Created by the CloudShell script. It can read EC2 and Systems Manager, and run commands through Systems Manager. It can create, modify, attach, detach and delete volumes, and create and delete snapshots.",
        ],
        [
          "The agent on each instance",
          "Installed through AWS Systems Manager. It reports the instance's disks and mounts, and runs the move, expands and shrinks.",
        ],
        [
          "Pool volumes",
          "The gp3 volumes that hold your data after the move, in the instance's Availability Zone. Amoeba adds, grows and removes them as the pool changes size.",
        ],
        [
          "Safety snapshots",
          "An EBS snapshot of each source volume, taken before the volume is deleted. Deleted after 7 days.",
        ],
      ],
    },
    notes: [
      "The role trusts Zoorik's AWS account only with your organisation's external ID. Zoorik's own AWS identity can only assume roles named ZoorikStorageOperator and read AWS prices.",
      "New pool volumes take the KMS key of the first encrypted source volume, so encryption at rest carries over.",
      "Systems Manager keeps each command's history in your account.",
      AMOEBA_GO_AHEAD,
      "A move only goes forward. Amoeba deletes a source volume only after its snapshot succeeds.",
    ],
  },
  needs: {
    title: "What your instances need",
    items: [
      "A running EC2 instance with at least one EBS data volume, its data on mounted filesystems.",
      "Management by AWS Systems Manager, with the SSM agent connected.",
      "A Nitro instance type that exposes EBS as NVMe.",
      "A few free volume attachment slots, since the pool's volumes attach beside the old ones during the move. With too few, Amoeba declines the instance and says why.",
      "Outbound access to Zoorik, and to the hosts the agent downloads from.",
      "On Linux: a recent kernel with btrfs, and every process that keeps a data mount open running as a systemd service. Install rsync, btrfs-progs and psmisc first: the installer doesn't add them.",
    ],
    after: `The [product guide](${routes.amoebaGuide}#before-you-start) has the full list.`,
  },
  questions: {
    title: "Questions",
    rows: [
      {
        question: "Which EBS volumes does Amoeba work on?",
        answer: `The non-root EBS data volumes of running EC2 instances, on Windows and Linux. Amoeba never touches the root volume. On Azure, it works with managed disks: see [Azure managed disk cost optimization](${routes.azureManagedDiskCostOptimization}).`,
      },
      {
        question: "Which volume type does the pool use?",
        answer:
          "The pool uses gp3 volumes. Each gets at least the baseline performance gp3 includes, and more when the instance's load needs it.",
      },
      amoebaDowntime,
      amoebaShrinks,
      {
        question: "Do I pay for both sets of volumes during the move?",
        answer:
          "Yes, but only while the move runs. Each source volume is deleted once the switch is checked. Then you pay for its snapshot for the 7 days it's kept.",
      },
      {
        question: "How is the saving worked out?",
        answer:
          "At list price from the AWS Price List API, against the source volumes. A saving can be negative, for example when a pool grows past the volumes it replaced. Amoeba shows it as it is.",
      },
    ],
  },
  readMore: {
    title: "Amoeba docs and guides",
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
        line: "The volume type Amoeba’s pool uses",
        href: glossaryPath("ebs-gp3"),
      },
      {
        kind: "page",
        title: "Amazon EBS pricing",
        line: "What an EBS volume costs a month, at list price",
        href: routes.ebsAndAzureDiskPricing,
      },
    ],
  },
};

/** The four, in the footer's order: Coral's two, then Amoeba's. The sitemap reads each page's path and date here. */
export const cloudPages: readonly CloudPageContent[] = [
  aksCostOptimizationPage,
  eksCostOptimizationPage,
  azureManagedDiskCostOptimizationPage,
  ebsCostOptimizationPage,
];
