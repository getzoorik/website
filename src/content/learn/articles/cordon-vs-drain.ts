import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cordon-vs-drain/1";
import { figure as figure2 } from "@/features/learn/figures/cordon-vs-drain/2";

export const article: Article = {
  slug: "cordon-vs-drain",
  title: "kubectl cordon vs drain: what each does to a node",
  meta: "kubectl cordon vs drain: cordon stops new pods landing on a node, drain evicts the running ones within their PDBs. What kubectl uncordon and taints do.",
  h1: "kubectl cordon vs drain in Kubernetes: what each does to a node",
  deck: "Cordon stops new pods arriving. Drain also moves the pods already there. Where uncordon and taints fit.",
  card: "What kubectl cordon, drain and uncordon each change on a node, and when a taint is the better tool.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  versus: ["Cordon", "Drain"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "prashant",
  cover: "/learn-covers/zoorik-learn-cordon-vs-drain-1200x630.webp",
  coverAlt:
    "Cordon vs drain in Kubernetes: cordon turns new pods away, and drain moves the pods off to be recreated elsewhere",
  short: [
    "kubectl cordon vs drain comes down to the pods already on the node: a cordon leaves them running, and a drain evicts them. Both mark the node unschedulable, and a drain evicts each pod within its ",
    { a: "PodDisruptionBudget (PDB)", href: "/learn/glossary/pod-disruption-budget" },
    ", so its controller recreates it on another node.",
  ],
  sections: [
    {
      id: "what-is-cordon-in-kubernetes-running-pods",
      title: "What kubectl cordon does: running pods stay, new ones are kept off the node",
      blocks: [
        {
          kind: "p",
          text: "Picture a node due for a kernel patch. A half-finished nightly batch job runs on it, beside a DaemonSet log agent. So do two replicas of a web app, under a PDB that lets one go at a time.",
        },
        {
          kind: "p",
          text: "Cordon it, and the batch job finishes with nothing new landing beside it. The web replicas stay too, so the patch waits. The node is still a running virtual machine (VM) that you pay for.",
        },
        { kind: "h3", id: "what-a-cordon-changes", title: "What a cordon changes" },
        {
          kind: "p",
          text: [
            "To cordon a node is to mark it unschedulable. The ",
            { code: "kubectl cordon" },
            " command sets the Node object’s ",
            { code: "spec.unschedulable" },
            " field to ",
            { code: "true" },
            ". From then on, the scheduler leaves that node out whenever it places a new pod.",
          ],
        },
        {
          kind: "p",
          text: "The Kubernetes docs are exact about the limit. Marking a node unschedulable “does not affect existing Pods on the Node,” they say. They call it “a preparatory step before a node reboot or other maintenance.”",
        },
        { kind: "code", lang: "bash", code: "kubectl cordon <node-name>\nkubectl get nodes" },
        {
          kind: "p",
          text: [
            "After the cordon, the second command lists the node’s status as ",
            { code: "Ready,SchedulingDisabled" },
            ". It’s still Ready, since nothing is wrong with the machine.",
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
          title: "Which pods still land on a cordoned node",
        },
        {
          kind: "p",
          text: [
            { a: "DaemonSet", href: "/learn/glossary/daemonset" },
            " pods still land on a cordoned node. The DaemonSet controller gives every one a toleration for the built-in ",
            { code: "node.kubernetes.io/unschedulable" },
            " taint, since Kubernetes 1.10. Node-local agents for networking, storage or logs have to run for as long as the node does.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            { code: "SchedulingDisabled" },
            " isn’t a real node condition in the Kubernetes API: kubectl prints it because the cordon is recorded in the node’s spec. Two more kinds of pod get past a cordon.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pods that tolerate the unschedulable taint themselves get past it, including through a blanket toleration (",
            { code: "operator: Exists" },
            " with no key and no effect). The Safely Drain a Node page says to avoid tolerating it in anything but a DaemonSet.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pods that set ",
            { code: "nodeName" },
            " directly bypass the scheduler altogether. They’re bound to that node even though it’s cordoned.",
          ],
        },
      ],
    },
    {
      id: "kubectl-drain-cordons-the-node-then-evicts",
      title: "kubectl drain cordons the node, then evicts its pods within their PDBs",
      blocks: [
        {
          kind: "p",
          text: "Drain the same node instead. The web replicas move to other nodes one at a time, and the batch job is evicted mid-run. Only the log agent stays.",
        },
        {
          kind: "p",
          text: [
            "When ",
            { code: "kubectl drain" },
            " returns without an error, every pod it handles has been evicted. Each eviction stayed within the pod’s grace period and its ",
            { a: "PDB", href: "/learn/pod-disruption-budget-best-practices" },
            ". The Kubernetes docs then call it safe to power down the machine or delete its VM.",
          ],
        },
        { kind: "h3", id: "how-drain-evicts-pods", title: "How drain evicts pods" },
        {
          kind: "p",
          text: "Drain begins with a cordon: “The given node will be marked unschedulable to prevent new pods from arriving.”",
        },
        {
          kind: "p",
          text: "Then drain evicts each pod through the Eviction API. That API lets the pod’s containers terminate gracefully. It refuses any eviction that would break the pod’s PDB.",
        },
        {
          kind: "p",
          text: "A refusal doesn’t end the drain. The Disruptions page says kubectl “periodically retries all failed requests” until the node’s pods are gone or a configurable timeout is reached. Microsoft’s example shows kubectl printing “will retry after 5s”.",
        },
        {
          kind: "p",
          text: [
            "You set that timeout with ",
            { code: "--timeout" },
            ", where zero “means infinite”.",
          ],
        },
        {
          kind: "h3",
          id: "pods-that-drains-defaults-wont-touch",
          title: "Pods that drain’s defaults won’t touch",
        },
        { kind: "p", text: "Before it evicts anything, drain checks for four kinds of pod:" },
        {
          kind: "ul",
          items: [
            [
              { b: "DaemonSet pods." },
              " Drain won’t proceed without ",
              { code: "--ignore-daemonsets" },
              ". Even with it, drain leaves them running: the DaemonSet controller ignores the cordon and would recreate them on the same node.",
            ],
            [
              { b: "Pods with no controller." },
              " No ReplicaSet, StatefulSet, Job, DaemonSet or ReplicationController stands behind them, so nothing would recreate one that was deleted. Drain deletes no pods at all unless you pass ",
              { code: "--force" },
              ", which deletes these ones anyway.",
            ],
            [
              { b: "Pods with emptyDir volumes." },
              " Their local data is deleted when the node is drained. The ",
              { code: "--delete-emptydir-data" },
              " flag lets drain continue anyway.",
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
            "Drain doesn’t uncordon the node afterwards. Putting it back into service is a separate ",
            { code: "kubectl uncordon" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "For the full procedure, see ",
            {
              a: "how to drain a Kubernetes node without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            ". It adds the replicas and budgets that keep apps serving. Every kubectl command and flag here follows the docs for Kubernetes 1.37, the current release in October 2026.",
          ],
        },
      ],
    },
    {
      id: "cordon-vs-drain",
      title: "Cordon vs drain: the running pods decide",
      blocks: [
        {
          kind: "p",
          text: "In the table below, the running-pods row settles kubectl drain vs cordon. A cordon leaves those pods running. A drain evicts all but DaemonSet and mirror pods, and uncordon reopens the node without bringing any evicted pod back.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Taints get two columns because they’re the other way to keep pods off a node.",
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
              "What it changes",
              ["Sets ", { code: "spec.unschedulable" }],
              "Cordons, then evicts",
              "Adds a taint with a key you choose",
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
              "Same, and evicted pods don’t come back",
            ],
            [
              "Use it to",
              "Stop new work landing before you decide",
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
      title: "Kubernetes cordon vs taint: a taint can reserve a node",
      blocks: [
        {
          kind: "p",
          text: "A taint is a mark on a node that repels pods. A toleration on a pod lets that pod past it. You choose the key, the value and one of three effects:",
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
              ": the control plane tries to keep untolerating pods off the node, but the docs say “it is not guaranteed.”",
            ],
            [
              { code: "NoExecute" },
              ": running pods without a matching toleration are evicted immediately. A pod that tolerates it without ",
              { code: "tolerationSeconds" },
              " stays for good. One with ",
              { code: "tolerationSeconds" },
              " stays that long, then the node lifecycle controller evicts it.",
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
          text: ["The second command, with the trailing ", { code: "-" }, ", removes the taint."],
        },
        {
          kind: "h3",
          id: "a-cordon-closes-a-node-a-taint",
          title: "A cordon closes a node, a taint can reserve it",
        },
        {
          kind: "p",
          text: [
            "Cordon works like one fixed ",
            { code: "NoSchedule" },
            " taint. Kubernetes’ node controller marks an unschedulable node with ",
            { code: "node.kubernetes.io/unschedulable" },
            ". By default only DaemonSet pods tolerate it, so a cordon closes the node to almost everything.",
          ],
        },
        {
          kind: "p",
          text: "A taint is the finer control. It keeps out only the pods without a matching toleration, so it can reserve a node rather than close it.",
        },
        {
          kind: "p",
          text: [
            "The docs’ dedicated-nodes example gives the nodes ",
            { code: "dedicated=groupName:NoSchedule" },
            " and one group’s pods the toleration. It then adds a matching node label and node affinity to keep that group on those nodes.",
          ],
        },
        { kind: "h3", id: "noexecute-taints-and-pdbs", title: "NoExecute taints and PDBs" },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A ",
            { code: "NoExecute" },
            " taint isn’t a faster drain. Kubernetes records its removals as deletions by the taint manager, a different path from the Eviction API that drain uses.",
          ],
        },
        {
          kind: "p",
          text: [
            "The Disruptions page notes that deleting pods bypasses PodDisruptionBudgets. A ",
            { code: "NoExecute" },
            " taint can therefore remove every replica on the node in one go. That’s the outage a PDB exists to stop.",
          ],
        },
        {
          kind: "p",
          text: [
            "On the node you’re patching, drain evicts one web replica. The budget refuses the second eviction until the first one’s replacement is Ready on another node. A ",
            { code: "NoExecute" },
            " taint removes both at once.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "kubectl-uncordon-reopens-the-node-to-new",
      title: "kubectl uncordon reopens the node to new pods only",
      blocks: [
        {
          kind: "p",
          text: [
            "Running ",
            { code: "kubectl uncordon <node-name>" },
            " sets ",
            { code: "spec.unschedulable" },
            " back to false. The Safely Drain a Node page says it tells Kubernetes “that it can resume scheduling new pods onto the node.”",
          ],
        },
        {
          kind: "p",
          text: "New is the word to watch. The pods a drain evicted were recreated on other nodes, and they stay there. So an uncordoned node fills up only as new pods are created, from rollouts, scale-ups and replaced pods.",
        },
        {
          kind: "p",
          text: [
            "Spreading running pods back out is a job for ",
            { a: "the Kubernetes descheduler", href: "/learn/kubernetes-descheduler" },
            ".",
          ],
        },
        { kind: "p", text: "Uncordon a node in three cases:" },
        {
          kind: "ul",
          items: [
            "After maintenance on a node you kept in the cluster.",
            "After a drain that failed or timed out, when you won’t retry it.",
            "After you cordoned a node only to look at it.",
          ],
        },
        {
          kind: "p",
          text: [
            "A cordon you didn’t make may be deliberate. On AKS, you can set a node pool’s undrainable-node behavior to ",
            { code: "Cordon" },
            ". Then an upgrade that can’t drain a node cordons it and labels it ",
            { code: "kubernetes.azure.com/upgrade-status=Quarantined" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s steps for it begin with removing the PDB that blocked the drain, and then that label.",
        },
      ],
    },
    {
      id: "when-to-cordon-and-drain-a-node",
      title: "When to cordon and drain a node in Kubernetes",
      blocks: [
        { kind: "p", text: "Pick by what should happen to the pods already on the node:" },
        {
          kind: "ol",
          items: [
            [
              { b: "To let them finish where they are, cordon." },
              " Once a long batch job ends, you drain the node or remove it.",
            ],
            [
              { b: "To move them so you can reboot, patch, replace or remove the node, drain." },
              " The Kubernetes guide says to issue ",
              { code: "kubectl drain" },
              " for one node at a time. Drains for different nodes can still run in parallel, in separate terminals, and respect your PDBs.",
            ],
            [
              {
                b: "To retire a whole pool, cordon every node in it, then drain them one at a time.",
              },
              " Cordoning first means a pod evicted from the first node can’t land on the second. On AKS, do this before you delete the node pool. Microsoft notes that “When you delete a node pool, AKS doesn’t perform cordon and drain.”",
            ],
            [
              { b: "To keep nodes for some workloads only, taint them." },
              " Use ",
              { code: "NoSchedule" },
              " and give those workloads the toleration. Add node affinity if they must stay on those nodes too.",
            ],
            [
              {
                b: [
                  "To make pods without a toleration leave now, whatever their budgets say, use a ",
                  { code: "NoExecute" },
                  " taint.",
                ],
              },
              " They all go at once, and no PDB paces them.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-cordons-and-drains-nodes",
      title: "How Coral cordons and drains nodes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and Amazon Elastic Kubernetes Service (EKS). It rebalances CPU and memory requests to what each container uses. Its ",
            { a: "node optimization", href: "/coral-guide#consolidation" },
            " then empties the nodes those smaller requests leave spare, so your autoscaler can remove them.",
          ],
        },
        {
          kind: "p",
          text: [
            "That’s where ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            " reduces your cloud cost: fewer machines run. Coral cordons and drains those nodes itself, under five rules:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A fit check first." },
              " Before it moves anything, Coral checks the live cluster. Every pod on the node must fit on another Ready node, with its affinity, taints, spread, ports and zones. The move must also respect PDBs and do-not-disrupt markers. By default, Coral may reduce a pool’s minimum when that minimum alone keeps a node it has emptied, and disconnect puts the old minimum back.",
            ],
            [
              { b: "One node at a time." },
              " Coral never cordons or drains nodes in bulk. Where it can, it starts a replacement pod on another node and evicts the old one once the replacement is Ready. Otherwise it evicts within the pod’s PDB.",
            ],
            [
              { b: "A time limit." },
              " If a drain can’t finish in time, the node goes back into service.",
            ],
            [
              { b: "Your cordons stay yours." },
              " Coral skips cordoned, NotReady and deleting nodes. It never drains a node someone else cordoned.",
            ],
            [
              { b: "The empty node." },
              " After the delay in the “Wait before removing empty nodes” setting, Coral hands the node to your autoscaler. The autoscaler’s own timers decide when it goes. Coral deletes the machine itself only in fixed-size pools that nothing else manages.",
            ],
          ],
        },
        { kind: "h3", id: "when-a-pod-still-restarts", title: "When a pod still restarts" },
        {
          kind: "p",
          text: [
            "When a node is removed, a pod whose replacement can’t start first gets a short restart. Marking it ",
            { a: "do-not-disrupt", href: "/learn/safe-to-evict-do-not-disrupt" },
            " prevents that, at the cost of keeping its node.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster on 6 October, Coral removed a spare 4-CPU worker on its own in under 10\u00a0minutes. Apps that run a single copy restarted once on another machine. Every app was running again afterwards, as ",
            { a: "the Coral Value Lab study", href: "/coral-value-lab" },
            " shows.",
          ],
        },
        { kind: "h3", id: "rebalancing-and-upgrades", title: "Rebalancing and upgrades" },
        {
          kind: "p",
          text: "Rebalancing replaces the nodes you choose with cheaper machines, and it never goes past a PDB. Each replacement copy must stay Ready and serving, with no restarts, before the old one goes. A node that can’t be emptied in time is kept.",
        },
        {
          kind: "p",
          text: [
            "Upgrades cordon and drain nodes of their own. During the upgrade window, we recommend pausing node optimization and the Evictor, the part of Coral that moves pods off lightly used nodes. ",
            {
              a: "The Coral FAQ",
              href: "/coral-faq#during-cluster-upgrades-is-optimization-paused",
            },
            " explains how optimization steps around an upgrade.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      title: "How to drain a Kubernetes node without downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "Pod disruption budget best practices for AKS and EKS",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "The safe-to-evict and do-not-disrupt annotations explained",
      where: "Learn",
      href: "/learn/safe-to-evict-do-not-disrupt",
    },
    {
      title: "Kubernetes descheduler: what it moves and when to use it",
      where: "Learn",
      href: "/learn/kubernetes-descheduler",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
  ],
};
