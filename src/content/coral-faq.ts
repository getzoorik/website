import { learnPath, routes } from "@/config/site";
import type { FaqSection } from "@/content/faq";

/**
 * `/coral-faq`: every string the page prints. The first group "About Coral"
 * (8 questions), then the client FAQ, 8 groups and 36 questions in all, and
 * the two callouts atop their groups. No answer points at another question by
 * its number; the PDF keeps its own numbering.
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
  "what-does-each-coral-policy-do",
  "how-much-history-is-needed-before",
  "cpu-is-100m-at-night-and",
  "a-workload-is-idle-for-6",
  "how-are-workloads-handled-that-spike",
  "how-does-coral-learn-black-friday",
  "a-workload-needs-4-cpus-during",
  "how-does-coral-decide-a-change",
  "how-does-a-change-reach-the",
  "is-there-a-warm-up-period",
  "memory-spikes-can-cause-oom-kills",
  "what-happens-if-an-optimized-pod",
  "if-optimization-causes-performance-degradation-how",
  "does-coral-change-my-git-or",
  "how-are-databases-kafka-elasticsearch-redis",
  "can-optimization-happen-without-downtime-for",
  "if-the-hpa-wants-to-scale",
  "could-reducing-cpu-requests-make-the",
  "does-optimization-ever-modify-hpa-minreplicas",
  "what-happens-when-demand-goes-past",
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
      "How Coral rebalances requests and nodes on AKS and EKS, keeps workloads safe, and works with HPA, KEDA, Karpenter, NAP and the Cluster Autoscaler.",
  },
  /* The deck is the Docs hub tile's line, with a period. */
  hero: {
    title: "Coral FAQ",
    deck: "Sizing, safety, HPA, nodes and autoscalers.",
  },
  updated: "Updated 8 November 2026",
  /** The one download line after the last group: the FAQ's PDF, and no other. */
  download: { label: "FAQ PDF", document: "coral-faq" },
} as const;

/** The 8 groups and 36 questions, About Coral first, then the PDF's order. */
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
          "It rebalances CPU and memory requests to real use and removes the nodes you don’t need, without any downtime. No code changes.",
          ["More on the ", { href: routes.coral, text: "Coral product page" }, "."],
        ],
      },
      {
        id: "which-clusters-does-coral-work-on",
        question: "Which clusters does Coral work on?",
        short: [
          "AKS and EKS on Kubernetes 1.30 or later, with at least one Linux node (amd64 or arm64).",
          "On 1.33+ nodes, running pods are resized in place. On older nodes, they restart one at a time.",
          "Windows nodes are listed and costed. Coral doesn’t resize, rebalance or live-migrate their workloads.",
        ],
      },
      {
        id: "what-does-connecting-a-cluster-change",
        question: "What does connecting a cluster change?",
        short: [
          "One zoorikctl command installs the agent, its webhook, a node daemon, two CRDs and admission policies.",
          "It creates one cloud identity. On AKS, its role can read the cluster, delete its machines and reduce a pool’s minimum. On EKS, its IAM role can terminate instances in the cluster’s Auto Scaling groups and reduce their minimum.",
          "If the cluster has no node autoscaler, connect sets up NAP on AKS or Karpenter on EKS.",
          "On AKS, it turns on workload identity and the OIDC issuer if they are off. The OIDC issuer can’t be turned off again. On an EKS cluster that uses only aws-auth, installing Karpenter switches authentication to API_AND_CONFIG_MAP for good.",
          [
            "It lists every cloud change and asks once. ",
            { code: "--dry-run" },
            " shows them all and changes nothing.",
          ],
          "Node optimization and the Evictor start at connect. Pod sizing waits until you turn on “Automatically optimize”.",
        ],
      },
      {
        id: "what-leaves-my-cluster",
        question: "What leaves my cluster?",
        short: [
          "Usage summaries per container, an inventory of the cluster, events with pod and node names, and a regular heartbeat.",
          "No env var values, commands, image names or request payloads. The agent can’t read your Secrets or ConfigMaps.",
          [
            "The full list: ",
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
          "At your cloud’s list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out.",
          "A smaller request reduces your cloud cost only when the freed capacity lets a node go.",
          "Every figure shows where it comes from. Until there is data, figures read “Calculating”.",
        ],
      },
      {
        id: "do-i-need-coral-with-karpenter",
        question: "Do I need Coral with Karpenter or NAP?",
        short: [
          "They do different jobs. Karpenter and NAP choose and remove machines from pod requests. They don’t change the requests.",
          "Coral rebalances requests to real use, so the same autoscaler can run fewer or smaller nodes. Pools that Karpenter or NAP consolidate are left to them.",
          [
            "Compared in full: ",
            {
              href: learnPath("kubernetes-autoscaling"),
              text: "Kubernetes autoscaling",
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
          "In AWS Marketplace and Microsoft Marketplace.",
          "If you pay for Coral, your order or marketplace purchase sets the price, how often you pay and the payment terms.",
        ],
      },
    ],
  },
  {
    id: "how-coral-sizes-workloads",
    title: "Workload sizing",
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
        question: "Is sizing based on average, P95, P99 or max?",
        short: [
          [
            { b: "CPU:" },
            " a percentile of recent use, plus headroom. The default is P80 of the last 3\u00a0days, plus 10%.",
          ],
          "With a CPU-based HPA, Coral picks the CPU request by replaying recent load through your HPA’s own settings.",
          [
            { b: "Memory:" },
            " the highest use of the last 8\u00a0days, plus 10% by default. It uses the peak because running out of memory kills the container.",
          ],
          "During a surge or CPU pressure, Coral raises the CPU request for a while.",
          "A custom policy or a per-workload setting can target any percentile up to P99.9, or max.",
        ],
      },
      {
        id: "what-does-each-coral-policy-do",
        question: "What does each policy do?",
        short: [
          "A policy sets how Coral sizes CPU and memory requests. Six are built in. Memory is the highest use of the last 8\u00a0days, plus 10 to 20%.",
          [
            { b: "Balanced:" },
            " CPU at P80 of the last 3\u00a0days, plus 10%. The default for most workloads.",
          ],
          [{ b: "Stability:" }, " CPU at P90, plus 15%. For latency-sensitive apps."],
          [{ b: "Cost savings:" }, " CPU at P70, plus 10%. For dev and non-critical work."],
          [
            { b: "Burstable:" },
            " CPU at P60 of the last 8\u00a0days, plus 25%. The default for Jobs and CronJobs.",
          ],
          [
            { b: "Resiliency:" },
            " sizes like Balanced and keeps Guaranteed pods Guaranteed. The default for StatefulSets.",
          ],
          [
            { b: "Read-only:" },
            " recommends and never changes anything. Always used for Zoorik’s own namespace and for add-ons labelled ",
            { code: "addonmanager.kubernetes.io/mode: Reconcile" },
            ".",
          ],
          "You can give any of your workloads another policy, or create your own.",
        ],
      },
      {
        id: "how-much-history-is-needed-before",
        question: "How much history does Coral need?",
        short: [
          "A first recommendation appears within the first hour.",
          "Coral trusts it after 24\u00a0hours of data. Jobs and CronJobs need 3 runs.",
          "The look-back then grows to 3\u00a0days for CPU and 8\u00a0days for memory.",
        ],
      },
      {
        id: "cpu-is-100m-at-night-and",
        question: "What if CPU is 100m at night and 2000m from 10\u00a0AM to 2\u00a0PM?",
        short: [
          "Without an HPA, the request sits near the night level. The 4 busy hours are 17% of the day, and P80 leaves out the busiest 20%.",
          "At 10\u00a0AM, Coral sees the surge within minutes and raises the request. It drops back a few hours after the peak.",
          "With a CPU-based HPA, Coral sizes CPU by replaying recent load through your HPA instead.",
          "To reserve 2000m all day, set a CPU minimum or use the Stability policy.",
        ],
      },
      {
        id: "a-workload-is-idle-for-6",
        question: "Will Coral reduce a workload that is busy only on Mondays?",
        short: [
          [
            { b: "Memory: no." },
            " Coral sizes memory from the highest use of the last 8\u00a0days, so last Monday’s peak holds unless too much of that data is missing.",
          ],
          [
            { b: "CPU: yes." },
            " A short Monday peak doesn’t hold the CPU request up, so it drops to the idle level after the peak.",
          ],
          "On Monday, Coral raises CPU within minutes. To be ready from the first minute, set a CPU minimum.",
        ],
      },
      {
        id: "how-are-workloads-handled-that-spike",
        question: "What about month-end or quarter-end spikes?",
        short: [
          "Coral looks back at most 8\u00a0days, so it doesn’t remember last month’s peak.",
          "When the spike comes, Coral raises CPU within minutes, and memory after any OOM kill.",
          "For known month-end workloads, set minimums or use a more conservative policy.",
        ],
      },
      {
        id: "how-does-coral-learn-black-friday",
        question: "Does Coral plan for Black Friday or Diwali?",
        short: [
          "No. It doesn’t forecast or read a calendar. It reacts to live usage.",
          "Your HPA adds pods, your autoscaler adds nodes, and Coral raises requests that run hot.",
          "Before a known event, set minimums on critical workloads. Pause node optimization and the Evictor for the event window.",
        ],
      },
      {
        id: "a-workload-needs-4-cpus-during",
        question: "What if startup needs 4\u00a0CPUs, then only 500m?",
        short: [
          "By default, Coral leaves out CPU use just after a container starts, so the request lands near 500m.",
          "Startup can still use more than the request, from free CPU on the node, because Coral doesn’t reduce CPU limits on regular pods.",
          "If startup must be fast, set a CPU minimum or use a policy that counts startup CPU.",
          "Guaranteed StatefulSet pods and workloads with a CPU-based HPA are sized differently.",
        ],
      },
    ],
  },
  {
    id: "safety-memory-and-rollback",
    title: "Safety and rollback",
    questions: [
      {
        id: "how-does-coral-decide-a-change",
        question: "How does Coral decide a change is safe?",
        short: [
          "Coral changes only workloads with “Automatically optimize” on, and never Zoorik’s own namespace.",
          "Reductions start small while data builds up. After that, Coral applies a size only when it has enough data.",
          "Every change stays within your minimums, LimitRanges and quotas. Small routine changes are skipped.",
          "Pods are resized in place where possible. Otherwise they are replaced one at a time, within your PodDisruptionBudgets.",
        ],
      },
      {
        id: "how-does-a-change-reach-the",
        question: "How does a new size reach my pods?",
        short: [
          "New pods always start at the new size. Running pods are resized in place where the node allows it (Kubernetes 1.33+).",
          [
            { b: "Deployment:" },
            " otherwise one pod at a time, each after the last is Ready, within your PodDisruptionBudgets.",
          ],
          [
            { b: "StatefulSet:" },
            " one pod at a time, highest ordinal first, and never an extra pod.",
          ],
          [{ b: "DaemonSet:" }, " one node at a time."],
          [
            { b: "Job and CronJob:" },
            " a running job is left alone, and the next run gets the new size.",
          ],
          "Pods with no controller, and standalone ReplicaSets, aren’t resized.",
        ],
      },
      {
        id: "is-there-a-warm-up-period",
        question: "Is there a warm-up period?",
        short: [
          "For pod sizing, yes. When you turn on a policy, reductions start small while data builds up.",
          "Workloads that already have 24\u00a0hours of good data get the full recommendation at once.",
          "Turning on a single workload skips the warm-up.",
          "Node optimization has no warm-up. It starts at install.",
        ],
      },
      {
        id: "memory-spikes-can-cause-oom-kills",
        question: "How much memory headroom does Coral keep?",
        short: [
          "Memory is sized from the highest use of the last 8\u00a0days, plus 10% on Balanced and up to 20% on other policies.",
          "On the built-in policies, Coral never reduces the memory limit of a regular pod. So the limit at which a container is OOM-killed never goes down.",
          "A container with no memory limit can be evicted sooner if its node runs short of memory.",
          "If an OOM kill still happens, Coral raises that container’s memory straight away.",
        ],
      },
      {
        id: "what-happens-if-an-optimized-pod",
        question: "What if a pod gets OOM-killed?",
        short: [
          "Coral raises that container’s memory request straight away, and again with each further kill.",
          "A crash-looping pod is recreated at the new size. The extra memory fades once the kills stop.",
          "Raises stop at a cap. If the kills look like a memory leak, Coral stops raising and holds memory at the cap. A leak needs a fix in the app.",
          "With automation off, Coral records the kill and changes nothing.",
        ],
      },
      {
        id: "if-optimization-causes-performance-degradation-how",
        question: "How does rollback work?",
        short: [
          "Coral raises requests again by itself on OOM kills, failing probes and CPU pressure.",
          "If a pod can’t be scheduled at its new size, Coral caps the request to fit.",
          "A replacement pod that isn’t Ready in time goes back to its original size, except in StatefulSets.",
          "Coral doesn’t read latency or error rates.",
          "To roll back by hand, turn automation off. New pods start at your manifest’s size. Running pods keep theirs until they restart.",
        ],
      },
      {
        id: "does-coral-change-my-git-or",
        question: "Does Coral change my Git manifests?",
        short: [
          "No. Coral never edits Git or your workload’s template. It sizes pods as they are created, or resizes running pods in place, so Argo CD and Flux see no drift.",
          "Its one change to a Deployment, a temporary extra replica while a node drains, is skipped when Argo CD or Flux own the replica count.",
          "A limit in your manifest doesn’t cap Coral. Where it sits below the new request, Coral raises the pod’s limit above it. Without a limit, Coral adds none unless the namespace requires one.",
          "What caps Coral: a policy or annotation maximum, the namespace’s LimitRange and its ResourceQuota. The annotation can live in Git.",
        ],
      },
    ],
  },
  {
    id: "stateful-and-single-replica-workloads",
    title: "Stateful and single-replica apps",
    questions: [
      {
        id: "how-are-databases-kafka-elasticsearch-redis",
        question: "How does Coral handle databases and StatefulSets?",
        short: [
          "Coral changes only CPU and memory, never app settings such as JVM heap or Redis maxmemory.",
          "StatefulSet pods are resized in place, or replaced one at a time, highest ordinal first, within the PDB.",
          "When a node is removed, a StatefulSet pod moves by live migration where both nodes support it, or else by eviction within its PDB. Nodes with local data or do-not-disrupt pods are kept.",
          "For a careful start, put databases on the Read-only policy and mark them do-not-disrupt.",
        ],
      },
      {
        id: "can-optimization-happen-without-downtime-for",
        question: "Can single-replica apps be optimized without downtime?",
        short: [
          "Yes. Coral resizes the pod in place (Kubernetes 1.33+), or starts a new pod and waits until it is Ready before removing the old one.",
          "Where a new pod can’t start first, as with the Recreate strategy or a ReadWriteOnce volume, the new size waits for the pod’s next restart.",
          "When a node is removed, the pod moves by live migration where both nodes support it, or else by eviction. Mark it do-not-disrupt to keep it in place.",
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
        question: "Do Coral and the HPA conflict?",
        short: [
          "No. The HPA decides how many pods run. Coral decides how big each pod is.",
          "While the HPA is still scaling and below its max, Coral holds back its own CPU raises. OOM raises still apply.",
          "In that time, Coral also waits for every pod to be Ready before it replaces any.",
        ],
      },
      {
        id: "could-reducing-cpu-requests-make-the",
        question: "Can smaller requests make the HPA scale more?",
        short: [
          "They can. HPA utilization is usage divided by request, so the same load reads higher on a smaller request.",
          "So for a CPU-based HPA, Coral replays recent load through your HPA’s own settings before it picks the request.",
          "A smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
          "KEDA ScaledObjects with a CPU trigger get the same replay.",
        ],
      },
      {
        id: "does-optimization-ever-modify-hpa-minreplicas",
        question: "Does Coral change HPA minReplicas or maxReplicas?",
        short: [
          "Only on HPAs Coral manages: ones it creates for safe Deployments, with minReplicas of 2 or more, and hand-made ones it takes over.",
          "On an HPA it takes over, Coral keeps minReplicas, only raises maxReplicas, and restores your values when it hands it back.",
          "An HPA that Coral creates can scale a steady Deployment down to its minimum.",
          "Outside a rebalance’s warm handover, Coral never changes min or max on HPAs from Helm, KEDA or kubectl apply. It never changes them where Argo CD or Flux own the bounds.",
        ],
      },
      {
        id: "what-happens-when-demand-goes-past",
        question: "What if demand goes past maxReplicas?",
        short: [
          "Your maxReplicas stays. Coral never changes min or max on an HPA managed from Git.",
          "For a CPU-based HPA, Coral’s replay includes your max. When the HPA can’t add pods, each pod gets more CPU instead.",
          "Coral’s own CPU raises, held back while the HPA scales, resume once it reaches its max.",
          "Each raise stays within your LimitRange and ResourceQuota.",
        ],
      },
    ],
  },
  {
    id: "nodes-and-spare-capacity",
    title: "Nodes and spare capacity",
    callout: {
      title: "Node optimization is on from install",
      text: "Node optimization and the Evictor start at install. The Evictor empties nodes for your autoscaler to delete. Switch either off, run the Evictor in dry run, or limit both to chosen node pools.",
    },
    questions: [
      {
        id: "if-workload-optimization-reduces-requests-how",
        question: "How soon are spare nodes removed?",
        short: [
          "Within minutes of running pods taking the smaller requests. Coral drains one node at a time, never in bulk.",
          "An emptied node is kept for the “Wait before removing empty nodes” setting, 5\u00a0minutes by default. Then your autoscaler removes it on its own timers.",
          "Coral deletes a machine itself only in fixed-size pools that nothing else manages.",
        ],
      },
      {
        id: "how-do-you-make-sure-node",
        question: "How does Coral avoid scheduling failures?",
        short: [
          "Before draining a node, Coral simulates the scheduler on the live cluster. Every pod must fit elsewhere, with its affinity, taints, spread, ports and zones.",
          "It respects PodDisruptionBudgets and do-not-disrupt.",
          "Room for future growth is your autoscaler’s job.",
          "Not checked yet: per-node disk-attach limits.",
        ],
      },
      {
        id: "how-much-spare-capacity-is-kept",
        question: "How much spare capacity does Coral keep?",
        short: [
          "No idle spare nodes. The headroom sits inside each pod’s request, and your autoscaler adds nodes for sudden growth.",
          "To keep warm spare capacity, run a low-priority placeholder deployment on the Read-only policy, so Coral doesn’t shrink it.",
          [
            "How to set one up: ",
            {
              href: learnPath("cluster-autoscaler-overprovisioning"),
              text: "Cluster Autoscaler overprovisioning",
            },
            ".",
          ],
        ],
      },
      {
        id: "during-cluster-upgrades-is-optimization-paused",
        question: "Does Coral pause during cluster upgrades?",
        short: [
          "No, it works around the upgrade. It skips cordoned, NotReady or deleting nodes, and never drains a node someone else cordoned.",
          "We recommend pausing node optimization and the Evictor for the upgrade window.",
        ],
      },
    ],
  },
  {
    id: "autoscalers-and-traffic-surges",
    title: "Autoscalers and surges",
    questions: [
      {
        id: "how-does-coral-interact-with-cluster",
        question: "How does Coral work with Karpenter or the Cluster Autoscaler?",
        short: [
          "Coral empties nodes, and Karpenter, NAP or the Cluster Autoscaler deletes them.",
          "Coral never adds nodes for demand and never raises a pool’s minimum.",
          "By default, it may reduce a pool’s minimum when that alone keeps an emptied node. Disconnect puts the old minimum back.",
          "Pools that Karpenter or NAP already consolidate are left to them. Coral deletes nodes itself only in fixed-size pools that nothing else manages.",
        ],
      },
      {
        id: "after-node-and-workload-optimization-move",
        question: "How do we get bigger machines back in a surge?",
        short: [
          "Your node autoscaler adds them. Coral never adds capacity for demand, and doesn’t change or fight scale-up.",
          "In a surge, the HPA adds pods, pending pods trigger your autoscaler, and Karpenter or NAP can pick bigger machines.",
          "If you have no autoscaler, connect sets up NAP (AKS) or Karpenter (EKS), with your approval. Where one can’t be set up, such as AKS with kubenet networking, nothing adds nodes until an autoscaler exists.",
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
        question: "Can I start with one namespace or app?",
        short: [
          "Yes. Create a policy with automation on, and assign it to a namespace or by labels. Everything else stays recommendation-only.",
          "That policy can also create HPAs. Set its Optimization type to “Vertical” to size pods only.",
          "Node optimization works by node pool, not namespace. Turn on only the pools you want, and start the Evictor in dry run.",
        ],
      },
    ],
  },
];
