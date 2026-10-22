import { learnPath, routes } from "@/config/site";
import type { FaqSection } from "@/content/faq";

/**
 * `/coral/faq`: every string the page prints, verbatim from the approved mock:
 * the first group "About Coral" (8 questions), then the client FAQ, 8 groups
 * and 32 questions in all, and the two cards as callouts atop their groups. The
 * five answers that pointed at another question by its number restate the
 * point; the PDF keeps its own numbering.
 *
 * 🔴 CLIENT ANSWERS ONLY. Each question carries its short answer and nothing
 * else: the internal team's answers never reach this site.
 * `src/app/internal-docs.test.ts` fails if they come back.
 *
 * ─── THE IDS ARE A CONTRACT ────────────────────────────────────────────────
 * Group and question ids are fixed, so shared links keep working; the first
 * group moved the numbers, never the ids. Keep an id when its heading's wording
 * changes later.
 *
 * There is no FAQPage structured data.
 */

export const coralFaqQuestionIds = [
  "what-is-coral",
  "which-clusters-does-coral-work-on",
  "what-does-connecting-a-cluster-change",
  "what-leaves-my-cluster",
  "how-is-the-saving-worked-out",
  "do-i-need-coral-with-karpenter",
  "how-much-can-coral-save",
  "where-can-i-buy-coral",
  "is-the-recommendation-based-on-average",
  "how-much-history-is-needed-before",
  "cpu-is-100m-at-night-and",
  "a-workload-is-idle-for-6",
  "how-are-workloads-handled-that-spike",
  "how-does-coral-learn-black-friday",
  "a-workload-needs-4-cpus-during",
  "how-does-coral-decide-a-change",
  "is-there-a-warm-up-period",
  "memory-spikes-can-cause-oom-kills",
  "what-happens-if-an-optimized-pod",
  "if-optimization-causes-performance-degradation-how",
  "how-are-databases-kafka-elasticsearch-redis",
  "can-optimization-happen-without-downtime-for",
  "if-the-hpa-wants-to-scale",
  "could-reducing-cpu-requests-make-the",
  "does-optimization-ever-modify-hpa-minreplicas",
  "if-workload-optimization-reduces-requests-how",
  "how-do-you-make-sure-node",
  "how-much-spare-capacity-is-kept",
  "during-cluster-upgrades-is-optimization-paused",
  "how-does-coral-interact-with-cluster",
  "after-node-and-workload-optimization-move",
  "can-optimization-be-restricted-to-one",
] as const;

export type CoralFaqQuestionId = (typeof coralFaqQuestionIds)[number];

export const coralFaqPage = {
  path: routes.coralFaq,
  meta: {
    title: "Coral FAQ",
    description:
      "Answers on how Coral sizes CPU and memory requests, keeps workloads safe, works with HPA, KEDA, Karpenter, NAP and Cluster Autoscaler on AKS and EKS.",
  },
  /* The deck is the Docs hub tile's line, with a period. */
  hero: {
    title: "Coral FAQ",
    deck: "Sizing, safety, HPA, nodes and autoscalers.",
  },
  updated: "Updated 9 October 2026",
  /** The one download line after the last group: the FAQ's PDF, and no other. */
  download: { label: "FAQ PDF", document: "coral-faq" },
} as const;

/** The 8 groups and 32 questions, About Coral first, then the PDF's order. */
export const coralFaqSections: readonly FaqSection<CoralFaqQuestionId>[] = [
  {
    id: "about-coral",
    title: "About Coral",
    questions: [
      {
        id: "what-is-coral",
        question: "What is Coral?",
        short: [
          "Coral is Kubernetes cost optimization for Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS).",
          "It sizes each container’s CPU and memory requests to what it really uses, and drains spare nodes one at a time so your autoscaler can remove them. No code changes.",
          [
            "More on the product page: ",
            { href: routes.coral, text: "Kubernetes cost optimization on AKS and EKS" },
            ".",
          ],
        ],
      },
      {
        id: "which-clusters-does-coral-work-on",
        question: "Which clusters does Coral work on?",
        short: [
          "AKS and EKS on Kubernetes 1.30 or later, with at least one Linux node (amd64 or arm64).",
          "Running pods are resized in place on 1.33+ nodes. On older nodes they restart one at a time.",
          "Windows nodes are listed and costed, but their workloads are not right-sized.",
        ],
      },
      {
        id: "what-does-connecting-a-cluster-change",
        question: "What does connecting a cluster change?",
        short: [
          "One zoorikctl command installs the agent, its webhook and a node daemon, two CRDs and admission policies.",
          "In your cloud it creates one identity: on AKS, a role on that cluster that can read it and delete its machines; on EKS, an IAM role that can only terminate instances in its Auto Scaling groups. If the cluster has no autoscaler, it sets up NAP on AKS or Karpenter on EKS, with your approval.",
          "On AKS, connect turns on workload identity and the OIDC issuer if they are off, and the OIDC issuer can’t be turned off again. On an EKS cluster that uses only aws-auth, installing Karpenter switches authentication to API_AND_CONFIG_MAP for good.",
          [
            "It lists every cloud change and asks once. ",
            { code: "--dry-run" },
            " prints everything and changes nothing.",
          ],
          "Node optimization and the Evictor start at connect. Pod sizing waits until you switch on “Automatically optimize”.",
        ],
      },
      {
        id: "what-leaves-my-cluster",
        question: "What leaves my cluster?",
        short: [
          "Per-container usage summaries and an inventory every 5\u00a0minutes, events with pod and node names, and a heartbeat every 60\u00a0seconds.",
          "No env var values, commands, image names or request payloads. The agent can’t read your Secrets or ConfigMaps.",
          [
            "Details: ",
            {
              href: `${routes.coralGuide}#what-leaves-your-cluster`,
              text: "What leaves your cluster",
            },
            ".",
          ],
        ],
      },
      {
        id: "how-is-the-saving-worked-out",
        question: "How is the saving worked out?",
        short: [
          "At your cloud’s published list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out.",
          "A smaller request reaches your bill when the freed capacity lets a node go.",
          "Every figure says where it comes from. Until data exists, figures read “Calculating”.",
        ],
      },
      {
        id: "do-i-need-coral-with-karpenter",
        question: "Do I need Coral with Karpenter or NAP?",
        short: [
          "They do a different job. Karpenter and NAP choose and remove machines from pod requests; they don’t change the requests.",
          "Coral sizes requests to real use, so the same autoscaler can run fewer or smaller nodes. Pools that Karpenter or NAP consolidate are left to them.",
          [
            "Compared in full: ",
            {
              href: learnPath("hpa-vs-vpa-vs-cluster-autoscaler"),
              text: "HPA vs VPA vs Cluster Autoscaler",
            },
            ".",
          ],
        ],
      },
      {
        id: "how-much-can-coral-save",
        question: "How much can Coral save?",
        short: [
          "We estimate 40–50% off AKS and EKS cost. It is an estimated range, not a promise.",
          [
            "The ",
            { href: `${routes.assessment}?p=coral`, text: "free AKS and EKS cost assessment" },
            " works out your own figure from your clusters, at list price.",
          ],
        ],
      },
      {
        id: "where-can-i-buy-coral",
        question: "Where can I buy Coral?",
        short: [
          "Coral is available in AWS Marketplace and Microsoft Marketplace.",
          "If you pay for Coral, the price, billing period and payment terms are in your order or your marketplace purchase.",
        ],
      },
    ],
  },
  {
    id: "how-coral-sizes-workloads",
    title: "How Coral sizes workloads",
    callout: {
      title: "Pod sizing is opt-in",
      text: [
        "Coral only recommends until you turn on ",
        { b: "“Automatically optimize”" },
        " for a policy or a workload.",
      ],
    },
    questions: [
      {
        id: "is-the-recommendation-based-on-average",
        question: "Is the recommendation based on Average, P95, P99, Max, or a mix?",
        short: [
          [
            { b: "CPU:" },
            " a percentile of the last 3\u00a0days (P80 by default), plus 10% headroom.",
          ],
          "With a CPU-based HPA, the CPU request comes from replaying 3\u00a0days of load through your HPA instead.",
          [
            { b: "Memory:" },
            " the peak of the last 8\u00a0days, plus 10% headroom, because running out of memory kills the container.",
          ],
          "During a surge or CPU pressure, the CPU target is raised for a while, up to P99.",
          "You can change the target per workload or in a custom policy, up to P99.9 or max.",
        ],
      },
      {
        id: "how-much-history-is-needed-before",
        question: "How much history is needed before the first recommendation?",
        short: [
          "A first recommendation appears within the first hour.",
          "It is trusted after 24\u00a0hours of data. Jobs and CronJobs need 3 runs.",
          "The window then grows to 3\u00a0days for CPU and 8\u00a0days for memory.",
        ],
      },
      {
        id: "cpu-is-100m-at-night-and",
        question:
          "CPU is 100m at night and 2000m from 10\u00a0AM to 2\u00a0PM. What does Coral recommend?",
        short: [
          "Without an HPA, the base request sits near the night level: the 4 busy hours are only 17% of the day, and P80 leaves out the busiest 20%.",
          "At 10\u00a0AM Coral detects the surge within minutes and raises the request. It drops back a few hours after the peak.",
          "With a CPU-based HPA, Coral sizes the CPU request by replaying 3\u00a0days of load through your HPA instead.",
          "To reserve 2000m all day, use the Stability policy or set a CPU minimum.",
        ],
      },
      {
        id: "a-workload-is-idle-for-6",
        question:
          "A workload is idle for 6\u00a0days and busy every Monday. Will Coral cut resources before Monday?",
        short: [
          [
            { b: "Memory: no." },
            " Coral keeps last Monday’s peak, because it looks back 8\u00a0days (unless more than about 10% of the data is missing).",
          ],
          [
            { b: "CPU: yes." },
            " A short Monday peak doesn’t hold the CPU request up, so it returns to the idle level after the peak.",
          ],
          "On Monday Coral starts raising CPU within minutes. To be ready from the first minute, set a CPU minimum.",
        ],
      },
      {
        id: "how-are-workloads-handled-that-spike",
        question: "How are workloads handled that spike only at month-end or quarter-end?",
        short: [
          "Coral looks back at most 8\u00a0days, so it doesn’t remember last month’s peak.",
          "When the spike comes, Coral raises CPU within minutes, and raises memory after any OOM kill.",
          "For known month-end workloads, set minimums or use a more conservative policy.",
        ],
      },
      {
        id: "how-does-coral-learn-black-friday",
        question: "How does Coral learn Black Friday, Diwali or holiday traffic patterns?",
        short: [
          "It doesn’t forecast or use a calendar. It reacts to live usage.",
          "Your HPA adds pods, your autoscaler adds nodes, and Coral raises requests that run hot.",
          "Before a known event, set minimums on critical workloads.",
          "For the event window, pause node optimization and the Evictor.",
        ],
      },
      {
        id: "a-workload-needs-4-cpus-during",
        question:
          "A workload needs 4\u00a0CPUs during startup but only 500m afterwards. How is it handled?",
        short: [
          "By default Coral ignores the first 2\u00a0minutes of CPU after a container starts, so the request ends up near 500m.",
          "Startup can still go above the request, using free CPU on the node, because Coral doesn’t lower CPU limits on regular pods.",
          "If startup must be fast, set a CPU minimum or use a policy that counts startup CPU.",
          "Guaranteed StatefulSet pods and workloads with a CPU-based HPA are sized differently.",
        ],
      },
    ],
  },
  {
    id: "safety-memory-and-rollback",
    title: "Safety, memory and rollback",
    questions: [
      {
        id: "how-does-coral-decide-a-change",
        question: "How does Coral decide a change is safe to apply automatically?",
        short: [
          "Only workloads with “Automatically optimize” on are changed. Zoorik’s own namespace is never changed.",
          "Through a policy, cuts in the first 24\u00a0hours of data are capped at 10%, 25%, then 35%. After that Coral needs at least 90% of the expected samples.",
          "Every change respects your minimums, LimitRanges and quotas. Routine changes under 10% are skipped.",
          "Pods are resized in place where possible. Otherwise they are replaced one at a time, within your PDBs.",
        ],
      },
      {
        id: "is-there-a-warm-up-period",
        question: "Is there a warm-up period before automation?",
        short: [
          "For pod sizing, yes. When you turn it on through a policy, cuts in the first 24\u00a0hours of data are capped at 10%, then 25%, then 35%.",
          "Workloads that already have 24\u00a0hours of good data get the full recommendation straight away.",
          "Turning on a single workload directly skips this warm-up.",
          "Node optimization has no warm-up. It starts at install.",
        ],
      },
      {
        id: "memory-spikes-can-cause-oom-kills",
        question: "Memory spikes can cause OOM kills. How much safety buffer is kept?",
        short: [
          "Memory is set from the highest usage of the last 8\u00a0days, plus 10% (15 to 25% on some other policies).",
          "Coral never lowers a memory limit on regular pods, so a container with a limit is OOM-killed at the same point.",
          "A container with no memory limit can be evicted sooner if the node runs short of memory.",
          "If an OOM kill still happens, Coral raises that container’s memory straight away, by 20% per kill and at least 100\u00a0MiB.",
        ],
      },
      {
        id: "what-happens-if-an-optimized-pod",
        question: "What happens if an optimized pod starts getting OOM-killed?",
        short: [
          "Coral raises that container’s memory by 20% per OOM kill (at least 100\u00a0MiB), straight away.",
          "Crash-looping pods are recreated at the new size, and the extra margin fades over 24\u00a0hours.",
          "Raises stop at 2.5× the base size. If the kills look like a memory leak, Coral stops raising and holds that cap for 24\u00a0hours.",
        ],
      },
      {
        id: "if-optimization-causes-performance-degradation-how",
        question:
          "If optimization causes performance degradation, how is it rolled back automatically?",
        short: [
          "OOM kills, failing probes and CPU pressure make Coral raise requests back up automatically.",
          "If a pod can’t be scheduled at its new size, Coral caps the request to fit.",
          "A replacement pod that isn’t Ready within 10\u00a0minutes goes back to its original size (except in StatefulSets).",
          "Coral doesn’t read latency or error rates.",
          "To roll back by hand, turn automation off. New pods start at your manifest’s size; running pods keep theirs until they restart.",
        ],
      },
    ],
  },
  {
    id: "stateful-and-single-replica-workloads",
    title: "Stateful and single-replica workloads",
    questions: [
      {
        id: "how-are-databases-kafka-elasticsearch-redis",
        question: "How are databases, Kafka, Elasticsearch, Redis and StatefulSets optimized?",
        short: [
          "Coral changes only CPU and memory, never app settings such as JVM heap or Redis maxmemory.",
          "StatefulSet pods are resized in place, or replaced one at a time, highest ordinal first, within the PDB.",
          "When a node is removed, a StatefulSet pod gets a short restart within its PDB. Nodes with local data or do-not-disrupt pods are kept.",
          "For a careful start, put databases on the Read-only policy and mark them do-not-disrupt.",
        ],
      },
      {
        id: "can-optimization-happen-without-downtime-for",
        question:
          "Can optimization happen without downtime for applications that have only one replica?",
        short: [
          "Usually, yes. Coral resizes the pod in place (Kubernetes 1.33+), or starts a new pod and waits until it’s Ready before removing the old one.",
          "Where that isn’t safe (for example Recreate strategy or a ReadWriteOnce volume), the new size waits for the pod’s next natural restart.",
          "When a node is removed, a pod whose replacement can’t start first gets a short restart. Mark it do-not-disrupt to prevent that.",
        ],
      },
    ],
  },
  {
    id: "working-with-hpa",
    title: "Working with HPA",
    questions: [
      {
        id: "if-the-hpa-wants-to-scale",
        question:
          "If the HPA wants to scale up while Coral wants to reduce CPU requests, which one wins?",
        short: [
          "There is no conflict. The HPA decides how many pods run, and Coral decides how big each pod is.",
          "While the HPA is scaling and below its max, Coral holds back its surge and CPU-pressure raises (OOM raises still apply), and pauses pod replacements until every pod is Ready.",
          "For CPU-based HPAs, Coral picks the request by replaying the last 3\u00a0days of load through your HPA’s own settings.",
        ],
      },
      {
        id: "could-reducing-cpu-requests-make-the",
        question: "Could reducing CPU requests make the HPA scale more aggressively?",
        short: [
          "It could, because HPA utilization is usage divided by request.",
          "So for workloads with a CPU-based HPA, Coral replays the last 3\u00a0days of load through your HPA’s own settings.",
          "A smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
        ],
      },
      {
        id: "does-optimization-ever-modify-hpa-minreplicas",
        question: "Does optimization ever modify HPA minReplicas or maxReplicas?",
        short: [
          "Only on HPAs Coral manages: ones it creates for safe Deployments, with minReplicas of 2 or more, and ones you created by hand that it takes over.",
          "On an HPA it takes over, Coral keeps minReplicas, only raises maxReplicas, and restores your values when it lets go.",
          "An HPA that Coral creates can scale a steady Deployment down to its minimum.",
          "It never changes min or max on HPAs from Helm, Argo CD, Flux, KEDA or kubectl apply.",
        ],
      },
    ],
  },
  {
    id: "nodes-and-spare-capacity",
    title: "Nodes and spare capacity",
    callout: {
      title: "Node optimization is on from install",
      text: "Removing spare nodes starts at install, through node optimization and the Evictor (which empties nodes for your autoscaler to delete). Switch both off, put the Evictor in dry-run, or limit them to chosen node pools.",
    },
    questions: [
      {
        id: "if-workload-optimization-reduces-requests-how",
        question:
          "If workload optimization reduces requests, how soon are nodes consolidated and removed?",
        short: [
          "Within minutes of the running pods carrying the smaller requests. Coral checks every 5\u00a0minutes and drains nodes gradually, never in bulk.",
          "An emptied node waits 5\u00a0minutes (you can change this), then your autoscaler deletes it. Coral deletes it itself only in fixed-size pools that nothing else manages.",
          "Pools that Karpenter or NAP already consolidates are left to them.",
        ],
      },
      {
        id: "how-do-you-make-sure-node",
        question:
          "How do you make sure node consolidation doesn’t cause scheduling failures later?",
        short: [
          "Before draining, Coral simulates the scheduler on the live cluster. Every pod must fit elsewhere, with its affinity, taints, spread, ports and zones.",
          "It respects PDBs, do-not-disrupt and your autoscaler’s minimum pool size.",
          "Room for future growth is your autoscaler’s job.",
          "Known gap: per-node disk-attach limits aren’t checked yet.",
        ],
      },
      {
        id: "how-much-spare-capacity-is-kept",
        question: "How much spare capacity is kept for sudden workload growth?",
        short: [
          "Coral keeps no idle spare nodes. The headroom sits inside each pod’s request.",
          "Sudden growth is handled by your autoscaler adding nodes.",
          "To keep warm spare capacity, run a low-priority placeholder deployment. Put it on the Read-only policy so Coral doesn’t shrink it.",
        ],
      },
      {
        id: "during-cluster-upgrades-is-optimization-paused",
        question: "During cluster upgrades, is optimization paused or does it continue?",
        short: [
          "It continues, but steps around the upgrade. It skips cordoned, NotReady or deleting nodes, and never drains a node someone else cordoned.",
          "We recommend pausing node optimization and the Evictor during the upgrade window.",
        ],
      },
    ],
  },
  {
    id: "autoscalers-and-traffic-surges",
    title: "Autoscalers and traffic surges",
    questions: [
      {
        id: "how-does-coral-interact-with-cluster",
        question: "How does Coral interact with Cluster Autoscaler or Karpenter decisions?",
        short: [
          "Coral never changes your autoscaler’s settings and never adds nodes for demand.",
          "Karpenter, NAP or the Cluster Autoscaler deletes the nodes Coral empties, within your autoscaler’s minimums.",
          "Pools that Karpenter or NAP already consolidates are left to them. Coral deletes VMs itself only in fixed-size pools that nothing else manages.",
        ],
      },
      {
        id: "after-node-and-workload-optimization-move",
        question:
          "After node and workload optimization move us from larger machines to smaller ones, how do we get back to bigger machines in a sudden surge?",
        short: [
          "Coral never adds capacity for demand. Scale-up belongs to your Karpenter, NAP or Cluster Autoscaler, and Coral doesn’t change or fight it.",
          "In a surge, the HPA adds pods, pending pods trigger your autoscaler, and Karpenter or NAP can pick bigger machines.",
          "If you have no autoscaler, we set up NAP (AKS) or Karpenter (EKS) during onboarding, with your approval.",
          "If one can’t be set up (for example AKS with kubenet networking), nothing adds nodes until an autoscaler exists.",
          "Coral moves workloads to smaller machine types only with Karpenter or NAP. With only the Cluster Autoscaler, Coral removes nodes but never changes their size.",
        ],
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    questions: [
      {
        id: "can-optimization-be-restricted-to-one",
        question: "Can optimization be restricted to one namespace or application first?",
        short: [
          "Yes. Create a policy with automation on and assign it to a namespace or by labels. Everything else stays recommendation-only.",
          "That policy can also create HPAs. Turn HPA optimization off in it if you want sizing only.",
          "Node optimization is scoped by node pool, not namespace. Enable only the pools you want, and start with the Evictor in dry-run.",
        ],
      },
    ],
  },
];
