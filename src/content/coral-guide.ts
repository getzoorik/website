import { learnPath, routes } from "@/config/site";
import type { GuideContent } from "@/content/guide";

/**
 * `/coral-guide`: every string the Coral product guide prints. The PDF at
 * `/docs/coral-product-guide.pdf` was drawn from an earlier version of this
 * text; regenerate it when this copy changes.
 *
 * Laid out like the FAQ: eleven groups, 32 numbered rows. A section's opening
 * blocks are its first row, under a name of its own ("The four steps", "What
 * you need", "Step by step", "The components", "The pages", "The figures",
 * "The command"); its callout stays open over the rows. A section whose lede
 * is "" prints none, and opens on its callout or rows.
 *
 * ─── THE ANCHOR IDS ARE A CONTRACT ─────────────────────────────────────────
 * Other pages, the PDFs' readers and shared links point at these ids: the
 * groups keep the sections' ids and the rows the subsections', so a link made
 * before the rows still lands, and opens its row. Keep an id when its heading
 * changes. A cross-reference names its target by id, so it cannot point at a
 * group or a row that is not here.
 */

/** The groups' ids, in page order. */
export const coralGuideSectionIds = [
  "how-coral-works",
  "before-you-start",
  "connect-a-cluster",
  "what-gets-installed",
  "the-console",
  "workload-optimization",
  "node-optimization",
  "stay-in-control",
  "savings-and-figures",
  "security-and-data",
  "disconnect",
] as const;

/** The rows' ids, in page order: row N is the Nth. */
export const coralGuideRowIds = [
  "how-coral-works-the-four-steps",
  "two-engines",
  "before-you-start-what-you-need",
  "connect-a-cluster-step-by-step",
  "what-connect-asks-to-change",
  "what-gets-installed-the-components",
  "updates",
  "the-console-the-pages",
  "how-sizes-are-worked-out",
  "turn-it-on",
  "built-in-policies",
  "custom-policies",
  "how-a-workload-gets-its-policy",
  "status-words",
  "per-workload-settings",
  "hpas-and-vpas",
  "consolidation",
  "the-evictor",
  "how-pods-are-moved",
  "nodes-held",
  "rebalancing",
  "switches",
  "labels-and-annotations",
  "a-careful-start",
  "savings-and-figures-the-figures",
  "what-leaves-your-cluster",
  "what-never-leaves",
  "how-it-connects",
  "the-live-migration-daemon",
  "sign-in",
  "disconnect-the-command",
  "what-stays",
] as const;

export type CoralGuideAnchor =
  (typeof coralGuideSectionIds)[number] | (typeof coralGuideRowIds)[number];

export const coralGuide: GuideContent<CoralGuideAnchor> = {
  meta: {
    title: "Coral product guide",
    description:
      "Connect AKS or EKS to Coral: what it installs, how it rebalances requests and nodes, what data it sends, and how you stay in control.",
  },
  hero: {
    title: "Coral product guide",
    deck: "Connect an AKS or EKS cluster, see what Coral changes, and stay in control.",
    downloads: [{ label: "PDF", document: "coral-guide" }],
  },
  updated: "Updated 3 November 2026",
  /* The product page first, then what Coral does, what it never does, and how
     you stay in control. */
  summary: [
    {
      term: "Product page",
      text: [[{ href: routes.coral, text: "Coral for AKS and EKS" }]],
    },
    {
      term: "What Coral does",
      text: [
        "Rebalances CPU and memory requests to real use, removes the nodes you don’t need, and moves work to cheaper machines.",
      ],
    },
    {
      term: "What Coral never does",
      text: [
        "Create machines itself, change your pod templates or Git sources, or read Secrets or pod logs through the Kubernetes API.",
      ],
    },
    {
      term: "You stay in control",
      text: [
        "Nothing is resized until you switch on “Automatically optimize”.",
        [
          "Node optimization and the Evictor start at install. For a careful start, see ",
          { ref: "stay-in-control", text: "“Stay in control”" },
          ".",
        ],
      ],
    },
  ],
  sections: [
    {
      id: "how-coral-works",
      title: "How Coral works",
      lede: "Coral rebalances requests and nodes so you pay for what you use. Cost monitoring is always on.",
      rows: [
        {
          id: "how-coral-works-the-four-steps",
          title: "The four steps",
          body: [
            {
              kind: "steps",
              steps: [
                {
                  title: "Connect",
                  body: [
                    {
                      kind: "p",
                      text: "One command installs the Coral agent. It asks before it changes anything in your cloud.",
                    },
                  ],
                },
                {
                  title: "Watch",
                  body: [
                    {
                      kind: "p",
                      text: "The agent reads usage and sends summaries to Zoorik. Figures appear within minutes.",
                    },
                  ],
                },
                {
                  title: "Recommend",
                  body: [
                    {
                      kind: "p",
                      text: "Coral works out the request each workload needs, the nodes you don’t need, and the saving.",
                    },
                  ],
                },
                {
                  title: "Optimize",
                  body: [
                    {
                      kind: "p",
                      text: "Coral removes the nodes you don’t need. With automation on, it also applies the new requests.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "two-engines",
          title: "Two engines",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Engine", width: "24%" },
                { label: "What it does", width: "44%" },
                { label: "How it starts", width: "32%" },
              ],
              rows: [
                [
                  "Workload optimization",
                  "Rebalances each container’s CPU and memory requests to real use, and can manage HPAs.",
                  "Recommendations only, until you switch on “Automatically optimize”.",
                ],
                [
                  "Node optimization",
                  "Removes the nodes you don’t need, and moves work to cheaper machines when you ask.",
                  "On from install, with the Evictor, which moves pods off lightly used nodes.",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "before-you-start",
      title: "Before you start",
      lede: "",
      rows: [
        {
          id: "before-you-start-what-you-need",
          title: "What you need",
          body: [
            {
              kind: "table",
              columns: [
                { label: "You need", width: "26%" },
                { label: "Details", width: "74%" },
              ],
              rows: [
                [
                  "A supported cluster",
                  "AKS or EKS on Kubernetes 1.30 or later, with at least one Linux node (amd64 or arm64). Windows nodes are listed and costed, but their workloads are not resized, rebalanced or live-migrated. Other clusters connect as “Local”, without cloud prices.",
                ],
                [
                  "Nodes on 1.33 or later",
                  "Only to resize running pods in place. On older nodes, Coral applies a new size by restarting pods one at a time, within their PodDisruptionBudget.",
                ],
                ["Cluster access", "cluster-admin, through a kubeconfig context."],
                [
                  "Command-line tools",
                  "The Azure CLI (az) for AKS, or the AWS CLI (aws) for EKS, signed in. Helm 3.8 or later, only if Karpenter has to be installed.",
                ],
                [
                  "Cloud rights",
                  "AKS: Owner, or Contributor with User Access Administrator, on the cluster’s subscription. EKS: rights to create IAM roles and EKS Pod Identity associations, plus SQS, EventBridge and cluster updates if Karpenter is installed.",
                ],
                [
                  "Network",
                  "Outbound HTTPS to Zoorik, and to ghcr.io and pkg-containers.githubusercontent.com for images. For node removal, also to Azure Resource Manager and Entra ID, or AWS STS and Auto Scaling.",
                ],
                [
                  "A console account",
                  "Sign-in with Microsoft or Google, with permission to connect clusters.",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "connect-a-cluster",
      title: "Connect a cluster",
      lede: "",
      callouts: [
        {
          kind: "callout",
          title: "Review it first",
          body: [
            {
              kind: "p",
              text: [
                "Add ",
                { code: "--dry-run" },
                " to print every cloud command and every object the setup installs, without changing anything.",
              ],
            },
          ],
        },
      ],
      rows: [
        {
          id: "connect-a-cluster-step-by-step",
          title: "Step by step",
          body: [
            {
              kind: "steps",
              steps: [
                {
                  title: "Sign in",
                  body: [
                    {
                      kind: "p",
                      text: [
                        "Go to ",
                        { code: "zoorik.com/login" },
                        ", choose Coral, and continue with Microsoft or Google.",
                      ],
                    },
                  ],
                },
                {
                  title: "Open “Connect cluster”",
                  body: [
                    {
                      kind: "p",
                      text: [
                        "On Overview, click “Connect cluster”. Node optimization and Workload optimization start on. Workload optimization only recommends until you switch on “Automatically optimize”. For a careful start, read ",
                        { ref: "stay-in-control", text: "“Stay in control”" },
                        " first.",
                      ],
                    },
                  ],
                },
                {
                  title: "Install zoorikctl",
                  body: [
                    { kind: "p", text: "zoorikctl is Zoorik’s command-line tool." },
                    {
                      kind: "os",
                      options: [
                        {
                          os: "mac",
                          name: "macOS",
                          prompt: "$ ",
                          lines: [
                            "brew tap getzoorik/tap",
                            "brew trust getzoorik/tap",
                            "brew install zoorikctl",
                          ],
                        },
                        {
                          os: "linux",
                          name: "Linux",
                          prompt: "$ ",
                          lines: ["curl -fsSL https://get.zoorik.com/linux | sh"],
                        },
                        {
                          os: "windows",
                          name: "Windows",
                          prompt: "PS> ",
                          lines: ["irm https://get.zoorik.com/windows.ps1 | iex"],
                        },
                      ],
                    },
                  ],
                },
                {
                  title: "Run the connect command",
                  body: [
                    {
                      kind: "p",
                      text: [
                        "Copy it from the dialog, and add ",
                        { code: "--kube-context <name>" },
                        " to pick the cluster. The connect token works once and expires after one hour.",
                      ],
                    },
                    {
                      kind: "well",
                      lines: [
                        'zoorikctl cluster connect --connect-token="zoorik_v1_…" --api-region="us"',
                      ],
                      prompt: "$ ",
                    },
                  ],
                },
                {
                  title: "Approve the cloud changes",
                  body: [
                    {
                      kind: "p",
                      text: "zoorikctl lists every cloud change and asks once. It then installs the agent and waits for it to register. The cluster appears on Overview, with its figures within minutes.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "what-connect-asks-to-change",
          title: "Cloud changes",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Change", width: "24%" },
                { label: "When", width: "18%" },
                { label: "What it sets up", width: "58%" },
              ],
              rows: [
                [
                  "Permission to remove nodes on AKS",
                  "Every AKS connect",
                  "A managed identity, zoorik-agent-<cluster>, with the role “Zoorik Node Removal v2” on this cluster only. The role can read the cluster, its pools and machines, and delete machines. It can also reduce a pool’s minimum when that minimum alone keeps an emptied machine. Workload identity and the OIDC issuer are turned on if they are off.",
                ],
                [
                  "Permission to remove nodes on EKS",
                  "Every EKS connect",
                  "An IAM role, zoorik-agent-<cluster>, bound with EKS Pod Identity. It can terminate instances only in this cluster’s Auto Scaling groups and reduce the minimum of this cluster’s groups. It can read Auto Scaling groups and instances across your account. The Pod Identity Agent add-on is added if missing.",
                ],
                [
                  "Node autoscaler on AKS",
                  "Only if the cluster has none",
                  "Turns on node auto provisioning (NAP), which needs Azure CNI (not kubenet). Adds the node class zoorik-base.",
                ],
                [
                  "Node autoscaler on EKS",
                  "Only if the cluster has none",
                  "Karpenter 1.8.1, the node classes zoorik-base and default, and a default NodePool. Also two IAM roles, Pod Identity, an access entry, an SQS queue with EventBridge rules, and discovery tags on the subnets and security group.",
                ],
              ],
            },
            {
              kind: "ul",
              items: [
                "On AKS, the OIDC issuer can’t be turned off once it is on.",
                "On an EKS cluster that uses only aws-auth, installing Karpenter switches authentication to API_AND_CONFIG_MAP. This can’t be undone.",
                [
                  "If you decline the cloud changes, the agent still installs. Pools run by an autoscaler are optimized as usual. Fixed-size pools wait until you run ",
                  { code: "zoorikctl cluster grant-node-deletion" },
                  ".",
                ],
                ["To set up an autoscaler later, run ", { code: "zoorikctl cluster prepare" }, "."],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "what-gets-installed",
      title: "What gets installed",
      lede: "Everything the agent setup installs carries the label app.kubernetes.io/part-of=zoorik-agent.",
      rows: [
        {
          id: "what-gets-installed-the-components",
          title: "The components",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Component", width: "30%" },
                { label: "What it does", width: "70%" },
              ],
              rows: [
                [
                  ["zoorik-agent", { sub: "Deployment, namespace zoorik-agent" }],
                  "Reads the cluster, sends usage summaries and carries out Coral’s changes. Runs as non-root, with a read-only filesystem.",
                ],
                [
                  ["zoorik-agent-webhook", { sub: "Deployment" }],
                  "Sizes new pods as they start. It fails open, so it never blocks a pod from starting. It refuses hand edits and deletes of the HPAs Coral manages: change those through the policy or “Hand back”.",
                ],
                [
                  ["zoorik-node", { sub: "DaemonSet, namespace zoorik-node" }],
                  "The live-migration daemon, on every Linux node. It checkpoints a pod and restores it on another node. It runs privileged (root, host PID, SYS_ADMIN) and installs CRIU, the open-source checkpoint and restore tool, at /usr/local/bin/criu.",
                ],
                [
                  "CRDs and admission policies",
                  "recommendations.coral.zoorik.com and actionrequests.coral.zoorik.com hold Coral’s recommendations and action requests. Admission policies limit what the agent may change.",
                ],
              ],
            },
            {
              kind: "p",
              text: "Rebalancing pools come later, labelled coral.zoorik.com/owned-by=rebalancing.",
            },
          ],
        },
        {
          id: "updates",
          title: "Updates",
          body: [
            {
              kind: "ul",
              items: [
                "The agent updates itself to each Zoorik release, and rolls back a failed update.",
                "It can’t widen its own permissions. A release that needs more shows “Re-run connect” on the Dashboard’s “Agent release” card.",
                "If Argo CD, Flux or Helm manages the agent, it doesn’t update itself.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "the-console",
      title: "The console",
      lede: "Pick a cluster on Overview to open its pages.",
      rows: [
        {
          id: "the-console-the-pages",
          title: "The pages",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Page", width: "30%" },
                { label: "What it is for", width: "70%" },
              ],
              rows: [
                [
                  [{ b: "Overview" }],
                  "Every connected cluster, with its running cost, what is recoverable and its score. “Connect cluster” starts here.",
                ],
                [
                  [{ b: "Dashboard" }],
                  "The cluster’s status, capacity, nodes, pods, OOM kills and agent release.",
                ],
                [
                  [{ b: "Optimization constraints" }],
                  "Workload setups that make optimization risky, such as health probes, PodDisruptionBudgets and topology spread, with a fix for each. Advisory only.",
                ],
              ],
            },
            { kind: "subhead", title: "Workload optimization" },
            {
              kind: "table",
              columns: [
                { label: "Page", width: "30%" },
                { label: "What it is for", width: "70%" },
              ],
              rows: [
                [
                  "Optimization",
                  "Each workload’s request against its recommendation, with confidence, saving and status. Switch on “Automatically optimize” for one workload.",
                ],
                [
                  "Scaling policies",
                  "Built-in and custom policies. Switch on “Automatically optimize” for a policy.",
                ],
                ["Impact", "The value of requests already reduced by resizing, at list price."],
                ["Event log", "Everything Coral did or saw, newest first."],
              ],
              continuation: true,
            },
            { kind: "subhead", title: "Node optimization" },
            {
              kind: "table",
              columns: [
                { label: "Page", width: "30%" },
                { label: "What it is for", width: "70%" },
              ],
              rows: [
                [
                  "Node list",
                  "Every node and its cost, and the nodes held, with the reason for each.",
                ],
                ["Rebalancing", "Plan, run and schedule moves to cheaper machines."],
                [
                  "Configuration",
                  "“Wait before removing empty nodes”, and a switch for each node pool.",
                ],
                [
                  "Container live migration",
                  "Pods moved by warm handover while nodes drain, and what each move saved. Checkpoint moves are not counted here.",
                ],
              ],
              continuation: true,
            },
            { kind: "subhead", title: "Cluster" },
            {
              kind: "table",
              columns: [
                { label: "Page", width: "30%" },
                { label: "What it is for", width: "70%" },
              ],
              rows: [
                [
                  "Settings",
                  "The Workload optimization, Node optimization and Evictor switches, and “What this cluster supports”.",
                ],
              ],
              continuation: true,
            },
            {
              kind: "p",
              text: "While data arrives, pages show “Waiting for the agent’s first report…”, then “Calculating”. They update by themselves.",
            },
          ],
        },
      ],
    },
    {
      id: "workload-optimization",
      title: "Workload optimization",
      lede: "Coral rebalances each container’s CPU and memory requests under its workload’s scaling policy.",
      rows: [
        {
          id: "how-sizes-are-worked-out",
          title: "How sizing works",
          body: [
            {
              kind: "ul",
              items: [
                [
                  { b: "CPU:" },
                  " a percentile of recent use, plus extra room. The balanced policy uses the 80th percentile (P80) of the last 3 days, plus 10%.",
                ],
                [
                  { b: "Memory:" },
                  " the highest recent use, plus extra room. The balanced policy uses the highest use in the last 8 days, plus 10%.",
                ],
                "A usage surge or an OOM kill raises the request within minutes.",
                "With a CPU-based HPA, Coral picks the CPU request by replaying past load through your HPA’s own settings.",
                "On the built-in policies, Coral never reduces a CPU or memory limit, except to keep Guaranteed pods Guaranteed.",
                "Your manifest never changes. Coral sizes pods as they start. It applies a new size by resizing running pods in place on 1.33+ nodes, or else by restarting them one at a time.",
              ],
            },
          ],
        },
        {
          id: "turn-it-on",
          title: "Turn on automation",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Where", width: "24%" },
                { label: "How", width: "36%" },
                { label: "What happens", width: "40%" },
              ],
              rows: [
                [
                  "On a policy (recommended)",
                  "Scaling policies → switch on “Automatically optimize” → “Start optimizing”.",
                  "Reductions start small while data builds up. After that, Coral applies a size only when it has enough data.",
                ],
                [
                  "On one workload",
                  "Optimization → the workload’s “Automatically optimize” → On.",
                  "Applies at once, with no wait for confidence.",
                ],
              ],
            },
          ],
        },
        {
          id: "built-in-policies",
          title: "Built-in policies",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Policy", width: "17%" },
                { label: "Use it for", width: "48%" },
                { label: "Sizing", width: "35%" },
              ],
              rows: [
                [
                  "balanced",
                  "Most apps. The default for Deployments, DaemonSets and Argo Rollouts.",
                  "CPU P80 + 10%, memory peak + 10%",
                ],
                [
                  "resiliency",
                  "Databases and stateful apps. The default for StatefulSets.",
                  "Like balanced, and keeps Guaranteed pods Guaranteed",
                ],
                [
                  "stability",
                  "Latency-sensitive apps.",
                  "CPU P90 + 15%, memory peak + 15%, one pod at a time",
                ],
                ["cost-savings", "Dev and non-critical work.", "CPU P70 + 10%"],
                [
                  "burstable",
                  "Jobs, CronJobs and spiky work. The default for Jobs and CronJobs.",
                  "CPU P60 of 8 days + 25%, memory peak + 20%",
                ],
                [
                  "readonly",
                  "Recommendations only. Always used for Zoorik’s own namespace.",
                  "None",
                ],
              ],
            },
            {
              kind: "ul",
              items: [
                "Every built-in policy except readonly has the Optimization type “Both”: it sizes pods and manages HPAs.",
                "On a built-in policy, you can change only “Automatically optimize” and the Optimization type. Set the type to “Vertical” to size pods only. For anything else, use “Duplicate…”.",
              ],
            },
          ],
        },
        {
          id: "custom-policies",
          title: "Custom policies",
          body: [
            {
              kind: "ol",
              items: [
                [
                  "Go to ",
                  { b: "Scaling policies" },
                  " and click ",
                  { b: "Create scaling policy" },
                  ". It starts as a copy of balanced.",
                ],
                {
                  text: [{ b: "Settings." }, " Name the policy, then set:"],
                  body: [
                    {
                      kind: "ul",
                      items: [
                        [
                          { b: "Automatically optimize." },
                          " On: Coral resizes the workloads that get this policy. Off: recommendations only.",
                        ],
                        [
                          { b: "Optimization type." },
                          " Vertical sizes pods only. Both also manages HPAs.",
                        ],
                        [
                          { b: "CPU." },
                          " The percentile to size for: P80 means the app used this much or less 80% of the time. Go higher, up to P99.9 or max, for more room. Go below P80 to save more. Also set the extra room, and how far back Coral looks: 3 hours to 8 days.",
                        ],
                        [
                          { b: "Memory." },
                          " By default, the most the app has used, plus extra room.",
                        ],
                        [{ b: "Minimums and maximums, limits, startup CPU and rollout." }],
                        [
                          { b: "Guaranteed pods." },
                          " Kept Guaranteed by changing requests and limits together.",
                        ],
                        [
                          { b: "HPA converter." },
                          " If your HPA scales on a percentage of CPU, Coral changes its target to a fixed amount, so smaller pods don’t make it add pods.",
                        ],
                      ],
                    },
                  ],
                },
                {
                  text: [
                    { b: "Assignment rules." },
                    " Add one or more rules. A workload matches a rule only if it fits every field you filled in:",
                  ],
                  body: [
                    {
                      kind: "ul",
                      items: [
                        [
                          { b: "Namespaces:" },
                          " names or patterns that match the whole name, for example ",
                          { code: "prod-.*" },
                        ],
                        [{ b: "Namespace labels" }],
                        [{ b: "Workload kinds:" }, " tick none for any kind"],
                        [{ b: "Workload labels" }],
                      ],
                    },
                    {
                      kind: "p",
                      text: "A workload only needs to match one rule. The preview shows which workloads match.",
                    },
                  ],
                },
                [
                  { b: "Review" },
                  ", then create. Matching workloads move to the policy within the hour.",
                ],
              ],
            },
            {
              kind: "ul",
              items: [
                "Custom policies are checked from top to bottom, and the first match wins. You can change the order later.",
                "A policy picked for a workload, or named in its annotation, stays. Rules don’t change it.",
                "To make Coral leave workloads alone, create a policy with “Automatically optimize” off and a rule that matches them.",
                "For a new workload, Coral reduces requests step by step while it learns, only as far as its data allows. If a workload needs more, it gets more at once.",
              ],
            },
          ],
        },
        {
          id: "how-a-workload-gets-its-policy",
          title: "Which policy applies",
          body: [
            { kind: "p", text: "Coral uses the first of these that applies:" },
            {
              kind: "ol",
              items: [
                "Zoorik’s own namespace, and add-ons labelled addonmanager.kubernetes.io/mode: Reconcile, always get readonly. Other kube-system workloads, EKS add-ons included, go on down this list.",
                [
                  "A policy named in the workload’s coral.zoorik.com/configuration annotation (see ",
                  { ref: "per-workload-settings", text: "Per-workload settings" },
                  ").",
                ],
                "A policy picked on the workload’s page.",
                "The first custom policy whose rules match.",
                "The default for its kind.",
              ],
            },
          ],
        },
        {
          id: "status-words",
          title: "Workload statuses",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Status", width: "30%" },
                { label: "Meaning", width: "70%" },
              ],
              rows: [
                ["Applied", "Pods run at the recommended size."],
                ["Applying", "Coral is rolling out the new size."],
                ["At next restart", "The new size applies when the pod next restarts."],
                ["Waiting for confidence", "Automation is on. Coral is waiting for enough data."],
                ["Recommendation only", "Coral works out sizes but doesn’t apply them."],
                ["No data yet", "No usage has arrived for this workload yet."],
                ["Blocked", "Coral can’t apply right now, and retries by itself."],
                [
                  "Stopped",
                  "A safety hold has frozen sizing, for example after repeated OOM kills.",
                ],
                ["Not supported", "Coral can’t size this workload. The page shows why."],
              ],
            },
          ],
        },
        {
          id: "per-workload-settings",
          title: "Per-workload settings",
          body: [
            {
              kind: "p",
              text: [
                "Add the ",
                { code: "coral.zoorik.com/configuration" },
                " annotation to the workload. Set only what you want to change.",
              ],
            },
            {
              kind: "well",
              lines: [
                "metadata:",
                "  annotations:",
                "    coral.zoorik.com/configuration: |",
                "      scalingPolicyName: stability",
                "      vertical:",
                "        optimization: on",
                "        cpu:",
                "          target: p95",
                "          min: 250m",
                "        memory:",
                "          max: 4Gi",
                "        excludedContainers:",
                "          - istio-proxy",
                "      horizontal:",
                "        optimization: off",
              ],
              yaml: true,
            },
            {
              kind: "p",
              text: "A workload with this annotation is managed from its manifest, so its console controls are locked.",
            },
          ],
        },
        {
          id: "hpas-and-vpas",
          title: "HPAs and VPAs",
          body: [
            {
              kind: "ul",
              items: [
                "Coral creates an HPA only for a Deployment or Argo Rollout that has none. It needs enough history, enough CPU per pod and two or more ready replicas. The new HPA keeps at least two replicas.",
                "It takes over only HPAs nothing else manages. It keeps minReplicas, only raises maxReplicas, and restores your values on “Hand back”.",
                "Outside a rebalance’s warm handover, it never changes HPAs from Helm, KEDA or kubectl apply, or HPAs whose bounds Argo CD or Flux own.",
                "With automation on, Coral switches an active VPA to Off, and restores it when you switch automation off.",
                "Switching automation off removes the HPAs Coral created and hands back the ones it took over.",
              ],
            },
          ],
        },
      ],
      related: [
        {
          text: "HPA vs VPA in Kubernetes",
          href: learnPath("vpa-vs-hpa"),
        },
        {
          text: "Kubernetes autoscaling",
          href: learnPath("kubernetes-autoscaling"),
        },
      ],
    },
    {
      id: "node-optimization",
      title: "Node optimization",
      lede: "",
      rows: [
        {
          id: "consolidation",
          title: "Consolidation",
          body: [
            {
              kind: "ul",
              items: [
                "Coral uses pod requests to work out how many nodes each pool needs. Every pool keeps at least one node.",
                "Before it moves anything, the agent checks on the live cluster that every pod on the node fits on another Ready node.",
                "It cordons and drains one node at a time. If a drain can’t finish in time, the node goes back into service.",
                "Once “Wait before removing empty nodes” has passed, Coral hands the empty node to your autoscaler, whose own timers decide when it goes. Coral deletes a machine itself only in fixed-size pools that nothing else manages.",
                "Pools that Karpenter or NAP already consolidate are left to them.",
              ],
            },
          ],
        },
        {
          id: "the-evictor",
          title: "The Evictor",
          body: [
            {
              kind: "ul",
              items: [
                "Moves pods off lightly used nodes, in pools where empty nodes get removed. It never deletes a machine, and never overrides a PodDisruptionBudget.",
                "Runs inside your cluster from install, with its own switch in Settings → General. Switching off Node optimization doesn’t stop it.",
                "In “Dry run”, it lists the nodes it would empty in the Event log, and moves no pod.",
              ],
            },
          ],
        },
        {
          id: "how-pods-are-moved",
          title: "How pods are moved",
          body: [
            { kind: "p", text: "Coral moves a pod in the first of these ways that works:" },
            {
              kind: "ol",
              items: [
                [
                  { b: "Warm handover:" },
                  " a replacement pod starts on another node and becomes Ready, then the old pod is evicted.",
                ],
                [
                  { b: "Live migration:" },
                  " where both nodes passed a live-migration check, the pod is checkpointed and restored on the other node. Clients see a short pause, longer for pods with more memory.",
                ],
                [{ b: "Eviction:" }, " within the pod’s PodDisruptionBudget."],
              ],
            },
            {
              kind: "p",
              text: "Warm handover covers pods of Deployments and Argo Rollouts, even with one replica. It isn’t used for:",
            },
            {
              kind: "ul",
              items: [
                "The Recreate strategy.",
                "Replica counts set by Argo CD or Flux.",
                "Pods with ReadWriteOnce volumes.",
                "GPU pods.",
                "HPA-scaled apps, except in a rebalance.",
              ],
            },
            {
              kind: "p",
              text: "These pods, and pods of other kinds such as StatefulSets, move by live migration where both nodes support it, or else by eviction.",
            },
          ],
        },
        {
          id: "nodes-held",
          title: "Nodes held",
          body: [
            {
              kind: "p",
              text: "A held node is one Coral won’t empty, because a pod on it can’t move safely. Node list → “What’s holding them” gives each reason and its fix. The common ones:",
            },
            {
              kind: "table",
              columns: [
                { label: "Reason", width: "50%" },
                { label: "Fix", width: "50%" },
              ],
              rows: [
                [
                  "The PodDisruptionBudget allows no disruption.",
                  "Add replicas, or relax the PodDisruptionBudget.",
                ],
                [
                  "A kube-system pod has no PodDisruptionBudget.",
                  "Add one that allows at least one disruption.",
                ],
                [
                  "Data on the node’s own disk (hostPath).",
                  "Move the data to a persistent volume, or mark the pod safe to evict.",
                ],
                ["Nothing would recreate the pod.", "Run it under a Deployment or StatefulSet."],
                [
                  "Marked do-not-disrupt, not safe to evict, or excluded.",
                  "Remove the marker if moving it is fine.",
                ],
              ],
            },
          ],
        },
        {
          id: "rebalancing",
          title: "Rebalancing",
          body: [
            {
              kind: "p",
              text: "Rebalancing replaces the nodes you choose with cheaper machines that still fit the work.",
            },
            {
              kind: "ul",
              items: [
                [
                  { b: "Needs:" },
                  " Karpenter or NAP, Node optimization on, and permission to remove nodes.",
                ],
                [
                  { b: "Steps:" },
                  " “Prepare new plan” → choose nodes → “Generate plan” → compare current and rebalanced cost → “Rebalance”. A plan expires after one hour.",
                ],
                [
                  { b: "How it runs:" },
                  " Coral creates fixed-size NodePools named zoorik-rb-…, and your Karpenter or NAP launches the new machines. The old nodes are then drained and removed one by one. The new pools stay after the run.",
                ],
                [
                  { b: "Schedules:" },
                  " a schedule checks every day at 02:00 UTC, and starts a rebalance when its savings target is met.",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stay-in-control",
      title: "Stay in control",
      lede: "Every engine has its own switch, and any pod or node can be protected.",
      rows: [
        {
          id: "switches",
          title: "Switches",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Switch", width: "24%" },
                { label: "Where", width: "24%" },
                { label: "Default", width: "13%" },
                { label: "When it is off", width: "39%" },
              ],
              rows: [
                [
                  "Automatically optimize",
                  "Scaling policies, or a workload",
                  "Off",
                  "Recommendations only.",
                ],
                [
                  "Workload optimization",
                  "Settings",
                  "On",
                  "Nothing is resized or scaled. Recommendations still show.",
                ],
                [
                  "Node optimization",
                  "Settings",
                  "On",
                  "No node removal is planned, and steps under way are cancelled. The Evictor keeps running.",
                ],
                [
                  "Evictor",
                  "Settings → General",
                  "On",
                  "The Evictor moves no pods. Consolidation still drains nodes while Node optimization is on.",
                ],
                [
                  "Node pool “Enabled”",
                  "Configuration → Node pools",
                  "On",
                  "Coral leaves the pool’s nodes alone, except in a rebalance you start.",
                ],
                [
                  "Wait before removing empty nodes",
                  "Configuration → Node scaling",
                  "5 minutes",
                  "Not a switch. Set it from 0 minutes to 7 days.",
                ],
              ],
            },
          ],
        },
        {
          id: "labels-and-annotations",
          title: "Labels and annotations",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Key", width: "35%" },
                { label: "Value", width: "10%" },
                { label: "Type, on", width: "24%" },
                { label: "Effect", width: "31%" },
              ],
              rows: [
                [
                  [{ code: "coral.zoorik.com/ignore" }],
                  [{ code: '"true"' }],
                  "Label: namespace, workload or pod template",
                  "Coral never changes its sizes or HPAs.",
                ],
                [
                  [{ code: "coral.zoorik.com/configuration" }],
                  "Settings",
                  "Annotation: workload",
                  [{ ref: "per-workload-settings", text: "Per-workload settings" }, "."],
                ],
                [
                  [{ code: "karpenter.sh/do-not-disrupt" }],
                  [{ code: '"true"' }],
                  "Annotation: pod or node",
                  "On a pod: never moved, and its node is kept. On a node: the node is kept.",
                ],
                [
                  [{ code: "cluster-autoscaler.kubernetes.io/safe-to-evict" }],
                  [{ code: '"false"' }],
                  "Annotation: pod",
                  "Never moved, and its node is kept.",
                ],
                [
                  [{ code: "coral.zoorik.com/removal-disabled" }],
                  [{ code: '"true"' }],
                  "Label or annotation: node or pod",
                  "Kept out of every Coral move.",
                ],
                [
                  [{ code: "coral.zoorik.com/live-migration" }],
                  [{ code: "disabled" }],
                  "Annotation: pod",
                  "No live migration. The pod can still move by handover or eviction.",
                ],
                [
                  [{ code: "coral.zoorik.com/ignore-optimization-constraints" }],
                  [{ code: '"true"' }],
                  "Annotation: pod template",
                  "Hidden from Optimization constraints only.",
                ],
              ],
            },
            {
              kind: "ul",
              items: [
                "A PodDisruptionBudget that allows no disruption keeps its pods, and their node, in place for consolidation, the Evictor and rebalances.",
                "The ignore label stops workload changes only (sizes and HPAs), not node moves.",
              ],
            },
          ],
        },
        {
          id: "a-careful-start",
          title: "A careful start",
          body: [
            {
              kind: "ol",
              items: [
                "For recommendations only at first, switch off Node optimization in the Connect dialog. The Evictor still starts with the agent and can move pods, so do step 2 as soon as the cluster appears.",
                "In Settings, open the Evictor’s “Advanced settings” and tick “Dry run”.",
                "In Configuration → Node pools, switch off the pools you want left alone.",
                "Create a scaling policy for one namespace, set its Optimization type to “Vertical”, and switch on “Automatically optimize”.",
                "Watch the Event log and the Impact page. Then widen step by step: more namespaces, more node pools, and Node optimization back on.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "savings-and-figures",
      title: "Savings and figures",
      lede: "Every figure says where it comes from. Coral never shows a made-up number.",
      rows: [
        {
          id: "savings-and-figures-the-figures",
          title: "The figures",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Figure", width: "34%" },
                { label: "Where", width: "16%" },
                { label: "What it means", width: "50%" },
              ],
              rows: [
                [
                  "Running cost today, At the optimum, Recoverable",
                  "Overview",
                  "Monthly cost now, after optimization, and the difference.",
                ],
                [
                  "Score",
                  "Overview",
                  "10 × optimal ÷ current monthly cost. 10 means nothing is left to recover.",
                ],
                [
                  "Estimated monthly savings",
                  "Optimization",
                  "The compute saved if every recommendation is applied.",
                ],
                [
                  "Already removed",
                  "Impact",
                  "The list-price value of the requests resizing has already reduced. Your cloud cost falls once the freed capacity lets nodes go.",
                ],
                [
                  "Fleet cost, Unclaimed capacity, Nodes held",
                  "Node list",
                  "Each node’s monthly price, the capacity no pod has claimed, and the nodes Coral can’t empty.",
                ],
              ],
            },
            {
              kind: "ul",
              items: [
                "Prices are the cloud’s published list price for the region, refreshed nightly. Spot nodes use the spot rate.",
                "Discounts, reservations and savings plans are not included. A month is 730 hours.",
                "Until data exists, figures read “Calculating” or “Fetching prices”.",
              ],
            },
          ],
        },
      ],
      related: [{ text: "Free AKS and EKS cost assessment", href: `${routes.assessment}?p=coral` }],
    },
    {
      id: "security-and-data",
      title: "Security and data",
      lede: "The agent sends summaries to Zoorik. Zoorik’s replies carry instructions, recommendations and updates.",
      rows: [
        {
          id: "what-leaves-your-cluster",
          title: "What leaves your cluster",
          body: [
            {
              kind: "ul",
              items: [
                "Usage summaries per container: CPU, memory, OOM kills, probe failures and CPU pressure.",
                "An inventory: nodes, namespaces, workloads with their requests and limits, autoscalers, PodDisruptionBudgets, quotas, and workload and namespace labels.",
                "Events, with pod and node names: OOM kills, probe failures, spot interruptions, and Coral’s own actions, including the pods the Evictor moved.",
                "A regular heartbeat.",
                "At registration, the cloud account: the Azure subscription and resource group, or the AWS account and region.",
              ],
            },
          ],
        },
        {
          id: "what-never-leaves",
          title: "What never leaves",
          body: [
            {
              kind: "ul",
              items: [
                "The agent can’t read your Secrets or ConfigMaps, and has no pods/log, pods/exec or pods/portforward permission.",
                "It holds get on nodes/proxy to read kubelet metrics. That permission can also reach the kubelet’s log and exec endpoints, which Coral never calls.",
                "No env var values, commands, image names or request payloads are sent. The only event text sent is the message when a quota, a limit range or an admission policy stops a pod being created.",
              ],
            },
          ],
        },
        {
          id: "how-it-connects",
          title: "How it connects",
          body: [
            {
              kind: "ul",
              items: [
                "The agent opens every connection to Zoorik, over HTTPS, and accepts none from outside the cluster. Inside it, the API server calls the webhook, and the node daemons talk to each other over mutual TLS.",
                "The agent swaps the one-time connect token for a cluster credential that rotates by itself.",
                "Admission policies limit the agent’s changes. For example, it may change only the HPAs and NodePools Coral manages.",
              ],
            },
          ],
        },
        {
          id: "the-live-migration-daemon",
          title: "Live-migration checkpoints",
          body: [
            {
              kind: "p",
              text: "A checkpoint holds the pod’s memory, secrets included. It stays inside your cluster, moves between the two nodes over mutual TLS, and is deleted when the move ends.",
            },
          ],
        },
        {
          id: "sign-in",
          title: "Sign-in",
          body: [
            {
              kind: "p",
              text: "Zoorik never sees your Microsoft or Google password. A session ends after 30 minutes of inactivity, or after 12 hours.",
            },
          ],
        },
      ],
    },
    {
      id: "disconnect",
      title: "Disconnect",
      lede: "Disconnect from the command line, with your own credentials.",
      rows: [
        {
          id: "disconnect-the-command",
          title: "The command",
          body: [
            {
              kind: "well",
              lines: ["zoorikctl cluster disconnect --kube-context <name>"],
              prompt: "$ ",
            },
            {
              kind: "ul",
              items: [
                ["Add ", { code: "--dry-run" }, " to see everything it would remove first."],
                "It works even if the agent is down, and is safe to run again.",
                "It removes the agent, the webhook, the live-migration daemon, Coral’s roles, policies and CRDs, and Coral’s taints and annotations on nodes.",
                "It deletes the HPAs Coral created, hands back the ones it took over, and restores the VPAs it switched off.",
                "It offers to remove the cloud identity and role assignment it created.",
                "Running pods keep their current sizes until they restart.",
              ],
            },
          ],
        },
        {
          id: "what-stays",
          title: "What stays",
          body: [
            {
              kind: "ul",
              items: [
                "The node autoscaler set up during connect.",
                "Coral’s zoorik-base node class and zoorik-rb-… rebalancing pools.",
                "CRIU on the nodes, and the folder /var/lib/zoorik/checkpoints, which can hold a checkpoint from an interrupted move. Delete that folder yourself.",
                "The “Zoorik Node Removal v2” role definition, workload identity, the OIDC issuer and the Pod Identity Agent add-on.",
                "The cluster’s entry in the console, shown as “Not reporting”, and the data Zoorik has already received.",
              ],
            },
          ],
        },
      ],
    },
  ],
};
