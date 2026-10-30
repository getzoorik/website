import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cordon-vs-drain/1";

export const article: Article = {
  slug: "cordon-vs-drain",
  title: "Cordon vs drain in Kubernetes: what each does",
  meta: "Cordon vs drain: cordon stops new pods landing on a node, drain evicts the running ones within their PDBs. What uncordon and taints do, and when to use each.",
  h1: "Cordon vs drain in Kubernetes: what each does to a node",
  deck: "Cordon stops new pods arriving. Drain also moves the pods already there. Where uncordon and taints fit.",
  card: "What kubectl cordon, drain and uncordon each change on a node, and when a taint is the better tool.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  versus: ["Cordon", "Drain"],
  published: "2026-11-18",
  updated: "2026-11-18",
  author: "prashant",
  short: [
    "Cordon vs drain comes down to the pods already on the node. ",
    { code: "kubectl cordon" },
    " marks a node unschedulable, so the scheduler places no new pods there, and the pods already running keep running. ",
    { code: "kubectl drain" },
    " cordons the node, then evicts its pods in a way that respects their PodDisruptionBudgets (PDBs), so their controllers recreate them on other nodes. ",
    { code: "kubectl uncordon" },
    " makes the node schedulable again, and nothing moves back on its own.",
  ],
  sections: [
    {
      id: "what-is-cordon-in-kubernetes",
      title: "What is cordon in Kubernetes?",
      blocks: [
        {
          kind: "p",
          text: [
            "To cordon a node is to mark it unschedulable. ",
            { code: "kubectl cordon" },
            " sets the Node object’s ",
            { code: "spec.unschedulable" },
            " field to ",
            { code: "true" },
            ", and from then on the scheduler leaves that node out whenever it places a new pod. The Kubernetes docs are exact about the limit: marking a node unschedulable “does not affect existing Pods on the Node.” Nothing running there stops.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl cordon <node-name>\nkubectl get nodes" },
        {
          kind: "p",
          text: [
            "After the cordon, the second command lists the node’s status as ",
            { code: "Ready,SchedulingDisabled" },
            ". The node stays Ready, since nothing is wrong with the machine. ",
            { code: "SchedulingDisabled" },
            " isn’t a real node condition in the Kubernetes API: kubectl prints it because the cordon is recorded in the node’s spec. To cordon several nodes, name them all in one command, space-separated, as Microsoft’s guide to resizing an Azure Kubernetes Service (AKS) node pool does before it drains the old pool.",
          ],
        },
        { kind: "p", text: "Three kinds of pod can still land on a cordoned node:" },
        {
          kind: "ul",
          items: [
            [
              "DaemonSet pods. The DaemonSet controller gives every DaemonSet pod a toleration for the built-in ",
              { code: "node.kubernetes.io/unschedulable" },
              " taint (since Kubernetes 1.10), because node-local agents for networking, storage or logs have to run for as long as the node does.",
            ],
            [
              "Pods that tolerate that taint themselves, including a blanket toleration (",
              { code: "operator: Exists" },
              " with no key and no effect). The Safely Drain a Node page says to avoid tolerating it in anything but a DaemonSet.",
            ],
            [
              "Pods that set ",
              { code: "nodeName" },
              " directly. They bypass the scheduler and are bound to that node even though it’s cordoned.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A cordon changes where new pods go, not how many machines you pay for: the node is still a running virtual machine (VM) on your bill. Its usual job, in the Nodes page’s words, is “a preparatory step before a node reboot or other maintenance.” You stop new work arriving, then decide what happens to the work already there.",
        },
      ],
    },
    {
      id: "what-kubectl-drain-adds-to-cordon",
      title: "What kubectl drain adds to cordon",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl drain" },
            " begins with the same step: “The given node will be marked unschedulable to prevent new pods from arriving.” Then it evicts each pod through the Eviction API, which lets the pod’s containers terminate gracefully and refuses any eviction that would break the pod’s ",
            { a: "PDB", href: "/learn/pod-disruption-budget-best-practices" },
            ". A refusal doesn’t end the drain. The Disruptions page says kubectl “periodically retries all failed requests” until the node’s pods are gone or a configurable timeout is reached, and Microsoft’s example shows it printing “will retry after 5s”. You set that timeout with ",
            { code: "--timeout" },
            ", where zero “means infinite”.",
          ],
        },
        {
          kind: "p",
          text: "Before it evicts anything, drain checks the node for four kinds of pod that its defaults won’t touch:",
        },
        {
          kind: "ul",
          items: [
            [
              "DaemonSet pods. Drain won’t proceed without ",
              { code: "--ignore-daemonsets" },
              ", and even with it, it leaves them running, because the DaemonSet controller ignores the cordon and would recreate them on the same node.",
            ],
            [
              "Pods with no controller, meaning no ReplicaSet, StatefulSet, Job, DaemonSet or ReplicationController behind them, so nothing would recreate one that was deleted. Drain deletes none of the node’s pods unless you pass ",
              { code: "--force" },
              ", which deletes these ones anyway.",
            ],
            [
              "Pods with emptyDir volumes, whose local data is deleted when the node is drained. ",
              { code: "--delete-emptydir-data" },
              " lets drain continue anyway.",
            ],
            "Mirror pods, which can’t be deleted through the API server. Drain leaves them alone.",
          ],
        },
        {
          kind: "p",
          text: [
            "When drain returns without an error, every pod it handles has been evicted within its grace period and its PDB, and the Kubernetes docs call it safe to power down the machine or delete its VM. Drain doesn’t uncordon the node afterwards. Putting it back into service is a separate ",
            { code: "kubectl uncordon" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The procedure itself, with the replicas and budgets that keep apps serving while a node empties, is in ",
            {
              a: "how to drain a Kubernetes node without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            ". Every kubectl command and flag here follows the docs for Kubernetes 1.37, the current release in October 2026.",
          ],
        },
      ],
    },
    {
      id: "cordon-vs-drain-side-by-side",
      title: "Cordon vs drain, side by side",
      blocks: [
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Running pods is the row that settles kubectl drain vs cordon. Taints get two columns because they’re the other way to keep pods off a node, as the next section explains.",
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
      id: "kubernetes-cordon-vs-taint",
      title: "Kubernetes cordon vs taint",
      blocks: [
        {
          kind: "p",
          text: "A taint is a mark on a node that repels pods, and a toleration on a pod lets that pod past it. You choose the key, the value and one of three effects:",
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
              ": pods already running that don’t tolerate the taint are evicted immediately. A pod that tolerates it without ",
              { code: "tolerationSeconds" },
              " stays for good, and one with ",
              { code: "tolerationSeconds" },
              " stays that long before the node lifecycle controller evicts it.",
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
          kind: "p",
          text: [
            "Cordon works like one fixed ",
            { code: "NoSchedule" },
            " taint. Kubernetes’ node controller marks an unschedulable node with ",
            { code: "node.kubernetes.io/unschedulable" },
            ", and by default only DaemonSet pods get a toleration for it, so a cordon closes the node to almost everything. A taint is the finer control. Because it keeps out only the pods without a matching toleration, it can reserve a node rather than close it. The docs’ dedicated-nodes example gives the nodes ",
            { code: "dedicated=groupName:NoSchedule" },
            " and one group’s pods the toleration, then adds a matching node label and node affinity to keep that group on those nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            "A ",
            { code: "NoExecute" },
            " taint isn’t a faster drain. Kubernetes records those removals as deletions by the taint manager, a different path from the Eviction API that drain uses, and the Disruptions page notes that deleting pods bypasses PodDisruptionBudgets. A ",
            { code: "NoExecute" },
            " taint can therefore remove every replica on the node in one go, which is the outage a PDB exists to stop.",
          ],
        },
      ],
    },
    {
      id: "kubectl-uncordon-putting-the-node-back",
      title: "kubectl uncordon: putting the node back",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl uncordon <node-name>" },
            " sets ",
            { code: "spec.unschedulable" },
            " back to false. The Safely Drain a Node page puts its effect in one line: it tells Kubernetes “that it can resume scheduling new pods onto the node.” New is the word to watch. The pods a drain evicted were recreated on other nodes and stay there, so an uncordoned node fills up only as new pods are created, from rollouts, scale-ups and replaced pods. Spreading running pods back out is a different tool’s job: see ",
            { a: "the Kubernetes descheduler", href: "/learn/kubernetes-descheduler" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Uncordon a node in three cases: after maintenance on a node you kept in the cluster, after a drain that failed or timed out when you won’t retry it, and after you cordoned a node only to look at it. A cordon you didn’t make may be deliberate. On AKS, if you set a node pool’s undrainable-node behavior to ",
            { code: "Cordon" },
            ", an upgrade that can’t drain a node cordons it and labels it ",
            { code: "kubernetes.azure.com/upgrade-status=Quarantined" },
            ". Microsoft’s steps for it begin with removing the PDB that blocked the drain and then that label.",
          ],
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
            "They should finish where they are. A cordon alone does that: a long batch job runs to the end with nothing new landing beside it, and you drain or remove the node afterwards.",
            [
              "They should move so you can reboot, patch, replace or remove the node. Drain it, which includes the cordon. The Kubernetes guide says to issue ",
              { code: "kubectl drain" },
              " for one node at a time, though drains for different nodes can run in parallel in separate terminals and still respect your PDBs.",
            ],
            "You’re retiring a whole pool. Cordon every node in it first, so a pod evicted from the first node can’t land on the second, then drain them one at a time. On AKS, do this before you delete the node pool: Microsoft notes that “When you delete a node pool, AKS doesn’t perform cordon and drain.”",
            [
              "Only some workloads should run there. Taint the nodes ",
              { code: "NoSchedule" },
              " and give those workloads the toleration, adding node affinity if they must stay on those nodes too.",
            ],
            [
              "Pods without a toleration must leave now, whatever their budgets say. Use a ",
              { code: "NoExecute" },
              " taint, knowing that every one of them goes at once and no PDB will pace them.",
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
            " optimizes Kubernetes on AKS and Amazon Elastic Kubernetes Service (EKS). It rebalances CPU and memory requests to what each container uses, and its node optimization empties the nodes those smaller requests leave spare, so your autoscaler can remove them. That’s the step where ",
            { a: "reducing Kubernetes cost", href: "/learn/reduce-kubernetes-cost" },
            " reaches the bill, because a smaller request counts once the freed capacity lets a node go. Coral cordons and drains those nodes itself, under five rules:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A fit check first." },
              " Before it moves anything, Coral simulates the scheduler on the live cluster. Every pod on the node must fit on another Ready node, with its affinity, taints, spread, ports and zones, and the move must respect PDBs, do-not-disrupt markers and your autoscaler’s minimum pool size.",
            ],
            [
              { b: "One node at a time." },
              " Coral cordons and drains one node at a time, never in bulk. Where it can, it starts a replacement pod on another node and evicts the old one once the replacement is Ready. Otherwise it evicts within the pod’s PDB.",
            ],
            [
              { b: "A 10-minute limit." },
              " If a drain can’t finish in 10\u00a0minutes, the node goes back into service.",
            ],
            [
              { b: "Your cordons stay yours." },
              " Coral skips cordoned, NotReady and deleting nodes, and never drains a node someone else cordoned.",
            ],
            [
              { b: "The empty node." },
              " After “Wait before removing empty nodes” (5\u00a0minutes by default), Coral hands the node to your autoscaler, whose own timers decide when it goes. Coral deletes the machine itself only in fixed-size pools that nothing else manages.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "When a node is removed, a pod whose replacement can’t start first gets a short restart, and marking it do-not-disrupt prevents that, at the cost of keeping its node. On our own dev cluster on 6 October, Coral removed a spare 4-CPU worker on its own in under 10\u00a0minutes. Apps that run a single copy restarted once on another machine, and every app was running again afterwards, as ",
            { a: "the case study", href: "/case-studies/coral-dev-cluster" },
            " shows.",
          ],
        },
        {
          kind: "p",
          text: "Rebalancing, which replaces the nodes you choose with cheaper machines, never goes past a PDB either. A replacement copy must be Ready and serving for 5\u00a0minutes with no restarts before the old one goes, and a node that can’t be emptied within 45\u00a0minutes is kept. Upgrades cordon and drain nodes of their own, so we recommend pausing node optimization and the Evictor (the part of Coral that moves pods off lightly used nodes) during the upgrade window.",
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "The safe-to-evict and do-not-disrupt annotations explained",
      where: "Learn",
      href: "/learn/safe-to-evict-do-not-disrupt",
    },
    {
      title: "Pod disruption budget best practices for AKS and EKS",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    { title: "Consolidation", where: "Coral product guide", href: "/coral/guide#consolidation" },
    {
      title: "During cluster upgrades, is optimization paused or does it continue?",
      where: "Coral FAQ",
      href: "/coral/faq#during-cluster-upgrades-is-optimization-paused",
    },
  ],
};
