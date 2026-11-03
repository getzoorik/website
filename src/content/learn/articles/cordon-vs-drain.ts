import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cordon-vs-drain/1";
import { figure as figure2 } from "@/features/learn/figures/cordon-vs-drain/2";

export const article: Article = {
  slug: "cordon-vs-drain",
  title: "kubectl cordon vs drain in Kubernetes",
  meta: "kubectl cordon vs drain: cordon keeps new pods off a node, drain also evicts running pods within their PDBs. When to use each, plus uncordon and taints.",
  h1: "kubectl cordon vs drain",
  deck: "Neither command removes the node. You pay for it until it is deleted.",
  card: "What cordon, drain and uncordon change on a node, and when a taint fits better.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  versus: ["Cordon", "Drain"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "prashant",
  cover: "/learn-covers/zoorik-learn-cordon-vs-drain-1200x630.webp",
  coverAlt:
    "Cordon vs drain in Kubernetes: a cordon turns new pods away, and a drain moves the pods off to be recreated elsewhere",
  short: [
    "A cordon keeps new pods off a node and leaves the running ones in place. A drain cordons the node, then evicts its pods within their ",
    { a: "PodDisruptionBudgets (PDBs)", href: "/learn/glossary/pod-disruption-budget" },
    ", so their controllers recreate them on other nodes.",
  ],
  sections: [
    {
      id: "what-is-cordon-in-kubernetes-running-pods",
      title: "What kubectl cordon does",
      blocks: [
        {
          kind: "p",
          text: "Take a node due for a kernel patch. It runs a DaemonSet log agent, a half-finished batch job and two web replicas under a PDB that lets one go at a time.",
        },
        {
          kind: "p",
          text: "Cordon it, and every pod keeps running. The batch job can finish with nothing new landing beside it, but the patch still waits.",
        },
        { kind: "h3", id: "what-a-cordon-changes", title: "What a cordon changes" },
        {
          kind: "p",
          text: [
            { code: "kubectl cordon" },
            " sets the node’s ",
            { code: "spec.unschedulable" },
            " field to ",
            { code: "true" },
            ". The scheduler then leaves the node out when it places new pods.",
          ],
        },
        {
          kind: "p",
          text: "Running pods aren’t affected. The Kubernetes docs call a cordon “a preparatory step before a node reboot or other maintenance.”",
        },
        { kind: "code", lang: "bash", code: "kubectl cordon <node-name>\nkubectl get nodes" },
        {
          kind: "p",
          text: [
            "The node then shows as ",
            { code: "Ready,SchedulingDisabled" },
            ". It is still Ready, since nothing is wrong with the machine.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            { code: "SchedulingDisabled" },
            " isn’t a node condition in the Kubernetes API. kubectl prints it because the cordon is recorded in the node’s spec.",
          ],
        },
        {
          kind: "p",
          text: [
            "To cordon several nodes, name them all in one command, separated by spaces. Microsoft’s guide to resizing an Azure Kubernetes Service (AKS) ",
            { a: "node pool", href: "/learn/glossary/node-pool" },
            " does this before it drains the old pool.",
          ],
        },
        {
          kind: "h3",
          id: "which-pods-still-land-on-a-cordoned",
          title: "Pods a cordon doesn’t stop",
        },
        { kind: "p", text: "Three kinds of pod can still land on a cordoned node:" },
        {
          kind: "ul",
          items: [
            [
              { b: [{ a: "DaemonSet", href: "/learn/glossary/daemonset" }, " pods."] },
              " Since Kubernetes 1.10, the DaemonSet controller gives each one a toleration for the built-in ",
              { code: "node.kubernetes.io/unschedulable" },
              " taint. Node agents for networking, storage or logs must run as long as the node does.",
            ],
            [
              { b: "Pods that tolerate that taint." },
              " A blanket toleration counts too: ",
              { code: "operator: Exists" },
              " with no key and no effect. The docs advise tolerating it only in DaemonSets.",
            ],
            [
              { b: ["Pods that set ", { code: "nodeName" }, "."] },
              " They bypass the scheduler, and with it the cordon.",
            ],
          ],
        },
      ],
    },
    {
      id: "kubectl-drain-cordons-the-node-then-evicts",
      title: "What kubectl drain does",
      blocks: [
        {
          kind: "p",
          text: "Drain the same node instead. The web replicas move to other nodes one at a time, and the batch job is evicted mid-run. Only the log agent stays.",
        },
        { kind: "code", lang: "bash", code: "kubectl drain --ignore-daemonsets <node-name>" },
        {
          kind: "p",
          text: [
            "When ",
            { code: "kubectl drain" },
            " returns without an error, every pod it handles has been evicted within its grace period and its ",
            { a: "PDB", href: "/learn/pod-disruption-budget-best-practices" },
            ". The docs then call it safe to power the node down, or delete its virtual machine.",
          ],
        },
        { kind: "h3", id: "how-drain-evicts-pods", title: "How drain evicts pods" },
        {
          kind: "p",
          text: "Drain first cordons the node, so no new pods arrive. Then it evicts each pod through the Eviction API. That API lets the containers shut down gracefully, and refuses any eviction that would break a PDB.",
        },
        {
          kind: "p",
          text: [
            "A refusal doesn’t end the drain. kubectl retries until the node’s pods are gone or ",
            { code: "--timeout" },
            " runs out, where zero means no limit.",
          ],
        },
        {
          kind: "h3",
          id: "pods-that-drains-defaults-wont-touch",
          title: "Pods drain won’t touch",
        },
        {
          kind: "p",
          text: "By default, drain checks for four kinds of pod before it evicts anything:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "DaemonSet pods." },
              " Drain won’t proceed without ",
              { code: "--ignore-daemonsets" },
              ". Even then it leaves them running, since their controller ignores the cordon and would recreate them on the same node.",
            ],
            [
              { b: "Pods with no controller." },
              " With no ReplicaSet, StatefulSet, Job, DaemonSet or ReplicationController behind them, nothing would recreate them. Drain deletes no pods at all unless you pass ",
              { code: "--force" },
              ".",
            ],
            [
              { b: "Pods with emptyDir volumes." },
              " Their local data is deleted with the drain, so drain continues only with ",
              { code: "--delete-emptydir-data" },
              ".",
            ],
            [
              { b: "Mirror pods." },
              " They can’t be deleted through the API server, so drain skips them.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Drain doesn’t uncordon the node afterwards. For the full procedure, with the replicas and budgets that keep apps serving, see ",
            {
              a: "how to drain a node without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "cordon-vs-drain",
      title: "Cordon vs drain",
      blocks: [
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Taints are the other way to keep pods off a node, so the table compares them too.",
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: [{ code: "kubectl cordon" }], width: "22%" },
            { label: [{ code: "kubectl drain" }], width: "25%" },
            { label: [{ code: "NoSchedule" }, " taint"], width: "16%" },
            { label: [{ code: "NoExecute" }, " taint"], width: "23%" },
          ],
          rows: [
            [
              "What it does",
              ["Sets ", { code: "spec.unschedulable" }],
              "Cordons, then evicts",
              "Adds a taint with your key",
              "Same, with the evicting effect",
            ],
            [
              "New pods",
              [
                "Kept off, except DaemonSet pods and pods that tolerate ",
                { code: "node.kubernetes.io/unschedulable" },
              ],
              "Kept off, as with cordon",
              "Kept off unless they tolerate the taint",
              "Kept off unless they tolerate the taint",
            ],
            [
              "Running pods",
              "Keep running",
              "Evicted, except DaemonSet and mirror pods",
              "Keep running",
              [
                "Evicted at once unless they tolerate it. Tolerating pods with ",
                { code: "tolerationSeconds" },
                " go when it runs out",
              ],
            ],
            [
              "PDBs",
              "Not involved",
              ["Respected, unless you pass ", { code: "--disable-eviction" }],
              "Not involved",
              "Bypassed: the pods are deleted",
            ],
            [
              "Undo",
              [{ code: "kubectl uncordon" }],
              [{ code: "kubectl uncordon" }, " (evicted pods don’t come back)"],
              "Remove the taint",
              "Remove the taint (evicted pods don’t come back)",
            ],
            [
              "Use it to",
              "Stop new work landing while you decide",
              "Empty a node to reboot, replace or remove it",
              "Reserve nodes for chosen workloads",
              "Clear a node of pods that must not run there",
            ],
          ],
        },
      ],
    },
    {
      id: "kubernetes-cordon-vs-taint-a-taint-can",
      title: "Cordon vs taint",
      blocks: [
        {
          kind: "p",
          text: "A taint is a mark on a node that repels pods, and a toleration lets a pod past it. You set the key, the value and one of three effects:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "NoSchedule" },
              ": no new pods unless they tolerate the taint. Running pods stay.",
            ],
            [
              { code: "PreferNoSchedule" },
              ": the control plane tries to keep pods that don’t tolerate it off the node, but the docs say “it is not guaranteed.”",
            ],
            [
              { code: "NoExecute" },
              ": running pods that don’t tolerate it are evicted at once. A pod that tolerates it stays, unless its toleration sets ",
              { code: "tolerationSeconds" },
              ". Then the node lifecycle controller evicts it when that time runs out.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl taint nodes <node-name> dedicated=<group>:NoSchedule\nkubectl taint nodes <node-name> dedicated=<group>:NoSchedule-",
        },
        {
          kind: "p",
          text: [
            "The trailing ",
            { code: "-" },
            " in the second command removes the taint. ",
            {
              a: "Kubernetes taints and tolerations",
              href: "/learn/kubernetes-taints-and-tolerations",
            },
            " covers how they match.",
          ],
        },
        {
          kind: "h3",
          id: "a-cordon-closes-a-node-a-taint",
          title: "Close or reserve a node",
        },
        {
          kind: "p",
          text: [
            "A cordon works like one fixed ",
            { code: "NoSchedule" },
            " taint: Kubernetes marks the node with ",
            { code: "node.kubernetes.io/unschedulable" },
            ". Only DaemonSet pods tolerate it by default, so the node closes to almost everything.",
          ],
        },
        {
          kind: "p",
          text: "A taint keeps out only the pods without a matching toleration. So it can reserve a node for some workloads rather than close it.",
        },
        {
          kind: "p",
          text: [
            "The docs’ dedicated-nodes example taints the nodes ",
            { code: "dedicated=groupName:NoSchedule" },
            " and gives one group’s pods the toleration. A matching node label and node affinity then keep that group on those nodes.",
          ],
        },
        { kind: "h3", id: "noexecute-taints-and-pdbs", title: "NoExecute taints and PDBs" },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A ",
            { code: "NoExecute" },
            " taint isn’t a faster drain. Its removals are deletions by the taint manager, not evictions through the Eviction API, so PDBs don’t apply.",
          ],
        },
        {
          kind: "p",
          text: [
            "On the node you’re patching, drain evicts one web replica. The PDB refuses the second eviction until the first one’s replacement is Ready on another node. A ",
            { code: "NoExecute" },
            " taint removes both at once: the outage a PDB exists to stop.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "kubectl-uncordon-reopens-the-node-to-new",
      title: "kubectl uncordon",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl uncordon <node-name>" },
            " sets ",
            { code: "spec.unschedulable" },
            " back to false, so the scheduler can place new pods on the node again.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pods a drain evicted stay on their new nodes. The node fills only as new pods are created, by rollouts, scale-ups and replacements. To spread running pods back out, use ",
            { a: "the Kubernetes descheduler", href: "/learn/kubernetes-descheduler" },
            ".",
          ],
        },
        { kind: "p", text: "Uncordon a node:" },
        {
          kind: "ul",
          items: [
            "After maintenance, if the node stays in the cluster.",
            "After a drain that failed or timed out, if you won’t retry it.",
            "After you cordoned it only to inspect it.",
          ],
        },
        {
          kind: "p",
          text: [
            "A cordon you didn’t make may be deliberate. An AKS node pool whose undrainable-node behavior is ",
            { code: "Cordon" },
            " cordons any node an upgrade can’t drain, and labels it ",
            { code: "kubernetes.azure.com/upgrade-status=Quarantined" },
            ". Microsoft’s fix starts by removing the PDB that blocked the drain, then the label.",
          ],
        },
      ],
    },
    {
      id: "when-to-cordon-and-drain-a-node",
      title: "When to use each",
      blocks: [
        { kind: "p", text: "Pick by what should happen to the pods already on the node:" },
        {
          kind: "ol",
          items: [
            [
              { b: "To let them finish, cordon." },
              " Once a long batch job ends, drain the node or remove it.",
            ],
            [
              { b: "To move them, drain." },
              " Do this to reboot, patch, replace or remove the node. The Kubernetes docs say to issue ",
              { code: "kubectl drain" },
              " for one node at a time. Drains for different nodes can still run in parallel, and each respects your PDBs.",
            ],
            [
              { b: "To retire a pool, cordon every node, then drain them one at a time." },
              " Cordoning first stops a pod evicted from one node landing on the next. On AKS, do this before you delete the pool, since AKS doesn’t cordon and drain it for you.",
            ],
            [
              { b: "To keep nodes for some workloads, taint them." },
              " Use ",
              { code: "NoSchedule" },
              " and give those workloads the toleration. Add node affinity if they must stay on those nodes.",
            ],
            [
              {
                b: [
                  "To clear pods off now, whatever their PDBs say, use a ",
                  { code: "NoExecute" },
                  " taint.",
                ],
              },
              " Every pod without a toleration goes at once.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-cordons-and-drains-nodes",
      title: "How Coral drains nodes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests to what each container uses, on AKS and Amazon Elastic Kubernetes Service (EKS). Its ",
            { a: "node optimization", href: "/coral-guide#consolidation" },
            " then removes the nodes those smaller requests leave spare.",
          ],
        },
        {
          kind: "p",
          text: [
            "That is where ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            " reduces your cloud cost: fewer machines run. Coral cordons and drains these nodes itself, without any downtime:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A fit check first." },
              " Every pod on the node must fit on another Ready node, with its affinity, taints, spread, ports and zones. The move must also respect PDBs and do-not-disrupt markers.",
            ],
            [
              { b: "One node at a time." },
              " Coral never drains nodes in bulk. A drain that can’t finish in time puts the node back into service.",
            ],
            [
              { b: "Pods move the first way that works." },
              " Warm handover starts a replacement on another node and evicts the old pod once the new one is Ready. Live migration checkpoints the pod and restores it on the other node, where both nodes support it. Otherwise Coral evicts the pod within its PDB.",
            ],
            [
              { b: "Your cordons stay yours." },
              " Coral skips cordoned, NotReady and deleting nodes, and never drains a node someone else cordoned.",
            ],
            [
              { b: "The empty node." },
              " After the “Wait before removing empty nodes” delay, Coral hands the node to your autoscaler, whose own timers decide when it goes. Coral deletes the machine itself only in fixed-size pools that nothing else manages.",
            ],
            [
              { b: "The pool minimum." },
              " By default, Coral may reduce a pool’s minimum when that minimum alone keeps an emptied node. Disconnecting Coral puts the old minimum back.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A pod marked ",
            { a: "do-not-disrupt", href: "/learn/safe-to-evict-do-not-disrupt" },
            " is never moved, and Coral keeps its node.",
          ],
        },
        { kind: "h3", id: "rebalancing-and-upgrades", title: "Rebalancing and upgrades" },
        {
          kind: "p",
          text: "Rebalancing replaces the nodes you choose with cheaper machines, and it never goes past a PDB. Each new copy must be Ready and serving before the old one goes. A node that can’t be emptied in time is kept.",
        },
        {
          kind: "p",
          text: [
            "Upgrades cordon and drain nodes of their own. During the upgrade window, we recommend pausing node optimization and the Evictor, which moves pods off lightly used nodes. ",
            {
              a: "The Coral FAQ",
              href: "/coral-faq#during-cluster-upgrades-is-optimization-paused",
            },
            " explains how Coral steps around an upgrade.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate it reduces AKS and EKS cost by 40–50%, a range rather than a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Nodes”",
      url: "https://kubernetes.io/docs/concepts/architecture/nodes/",
    },
    {
      publisher: "Kubernetes",
      title: "“kubectl drain”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
    },
    {
      publisher: "Kubernetes",
      title: "“Safely Drain a Node”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/",
    },
    {
      publisher: "Kubernetes",
      title: "“Taints and Tolerations”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
    },
    {
      publisher: "Kubernetes",
      title: "“Assigning Pods to Nodes”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/",
    },
    {
      publisher: "Kubernetes",
      title: "“Disruptions”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node Status”",
      url: "https://kubernetes.io/docs/reference/node/node-status/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Resize Node Pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/resize-node-pool",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Upgrade Options and Recommendations for Azure Kubernetes Service (AKS) Clusters”",
      url: "https://learn.microsoft.com/en-us/azure/aks/upgrade-options",
    },
  ],
  related: [
    {
      title: "kubectl drain without any downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "Kubernetes taints and tolerations",
      where: "Learn",
      href: "/learn/kubernetes-taints-and-tolerations",
    },
    {
      title: "Pod disruption budget best practices",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "Karpenter do-not-disrupt vs safe-to-evict",
      where: "Learn",
      href: "/learn/safe-to-evict-do-not-disrupt",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
  ],
};
