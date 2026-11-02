import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/exit-code-143/1";

export const article: Article = {
  slug: "exit-code-143",
  title: "Exit code 143 in Kubernetes: SIGTERM explained",
  meta: "Code 143 is 128 plus signal 15: SIGTERM stopped the container. Tell a clean stop from a probe or app problem, and fix it in Kubernetes and Docker.",
  h1: "Exit code 143 in Kubernetes: what SIGTERM means for a container",
  deck: "It’s the normal stop after a drain or rollout, and a warning when the restart count keeps climbing.",
  card: "What 143 means, when it’s a normal stop or a restart loop, and how to make a SIGTERM stop clean.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-02",
  updated: "2026-11-02",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-exit-code-143-1200x630.webp",
  coverAlt:
    "SIGTERM, signal 15, reaches process 1, the app stops inside its grace period, and Kubernetes records 128 + 15 = 143",
  short:
    "In Kubernetes, exit code 143 means SIGTERM (signal 15) ended the container’s main process before its grace period ran out. The pod’s events show what sent it.",
  sections: [
    {
      id: "what-exit-code-143-means-in-kubernetes",
      title: "What exit code 143 means in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "A process ended by a signal gets an exit status of 128 plus the signal’s number. SIGTERM is signal 15, so the code is 128 + 15 = 143.",
        },
        {
          kind: "p",
          text: [
            "In a shell, a command stopped by SIGTERM leaves exit status 143, which ",
            { code: "echo $?" },
            " prints. Kubernetes shows that number as the container’s Exit Code in its Terminated state.",
          ],
        },
        {
          kind: "p",
          text: "SIGTERM asks a process to end, and its default action terminates it. Unlike SIGKILL (signal 9), it can be caught, so the process can clean up and exit on its own. Kubernetes waits a grace period for that, then sends SIGKILL.",
        },
        {
          kind: "table",
          columns: [
            { label: "Exit code after a stop", width: "28%" },
            { label: "What happened", width: "72%" },
          ],
          rows: [
            ["0, or the app’s own code", "The app caught SIGTERM, cleaned up and exited by itself"],
            ["143", "SIGTERM ended the process before the grace period ran out"],
            [
              "137",
              "The process was still running when the grace period ran out, so SIGKILL ended it",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Exit code 137 also follows an out-of-memory kill. ",
            { a: "OOMKilled exit code 137", href: "/learn/oomkilled-exit-code-137" },
            " covers that case in full.",
          ],
        },
        { kind: "h3", id: "docker-exit-code-143", title: "Docker exit code 143" },
        {
          kind: "p",
          text: [
            { code: "docker stop" },
            " sends a container’s stop signal: SIGTERM, unless the image’s STOPSIGNAL sets another. After a timeout, SIGKILL follows. Amazon Elastic Container Service (ECS) StopTask issues the equivalent of ",
            { code: "docker stop" },
            ", with a 30-second default timeout.",
          ],
        },
        {
          kind: "p",
          text: "So a Docker or ECS container that exits 143 stopped on the signal in time. One that exits 137 after a stop outlasted the timeout.",
        },
      ],
    },
    {
      id: "how-kubernetes-stops-a-container-with-sigterm",
      title: "How Kubernetes stops a container with SIGTERM",
      blocks: [
        {
          kind: "p",
          text: "A graceful pod deletion runs in order. The pod shows Terminating, and the kubelet runs any preStop hook. Then the container runtime sends TERM to process 1 in each container.",
        },
        {
          kind: "p",
          text: [
            "The grace period, ",
            { code: "terminationGracePeriodSeconds" },
            ", is 30\u00a0seconds by default, and a preStop hook runs inside it. Processes still running when it ends get SIGKILL.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "Three kinds of event start this stop:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Deletion." },
              " You run ",
              { code: "kubectl delete" },
              ", a rolling update replaces old pods, or a scale-down leaves fewer replicas.",
            ],
            [
              { b: "Eviction." },
              " ",
              { code: "kubectl drain" },
              " and node upgrades evict pods through the Eviction API. It respects PodDisruptionBudgets (PDBs) and the pod’s ",
              { code: "terminationGracePeriodSeconds" },
              ".",
            ],
            [
              { b: "Probe failure." },
              " When a liveness or startup probe fails, the kubelet restarts the container. It respects the grace period, or the probe’s own ",
              { code: "terminationGracePeriodSeconds" },
              " where one is set.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Both containerd and CRI-O send SIGTERM unless the image sets STOPSIGNAL. A per-container ",
            { code: "lifecycle.stopSignal" },
            " field is alpha since Kubernetes 1.33. It’s off by default, behind the ContainerStopSignals feature gate.",
          ],
        },
      ],
    },
    {
      id: "when-exit-code-143-is-normal-and",
      title: "When exit code 143 is normal, and when it’s a warning",
      blocks: [
        {
          kind: "p",
          text: "Read the container’s Last State and Restart Count, then the namespace’s events in time order. Together they show what stopped it.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl describe pod <pod-name> -n <namespace>\nkubectl get events -n <namespace> --sort-by=.lastTimestamp",
        },
        {
          kind: "p",
          text: "For example, a container the kubelet has restarted shows this, trimmed:",
        },
        {
          kind: "code",
          lang: "text",
          code: "    Last State:     Terminated\n      Exit Code:    143\n    Restart Count:  3",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Normal." },
              " A deletion, drain, rollout or scale-down stopped it, and the replacement runs. The old pod’s 143 shows only until the API server deletes its object.",
            ],
            [
              { b: "A warning." },
              " The pod is still there, with 143 in Last State and Restart Count climbing. Failed liveness or startup probes in its events mean the kubelet keeps restarting it.",
            ],
            [
              { b: "137 where you expected 143." },
              " The app outlasted its grace period. It stopped too slowly, or a shell script running as process 1 never passed SIGTERM on.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A clean 143 shows the app stopped in time, not that it finished its requests. Kubernetes takes the pod out of its Service’s endpoints alongside the shutdown, not before it, so requests can still arrive briefly.",
        },
      ],
    },
    {
      id: "how-to-make-a-sigterm-stop-clean",
      title: "How to make a SIGTERM stop clean",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Catch SIGTERM in the app." },
              " Stop taking new work, finish open connections, then exit by itself.",
            ],
            {
              text: [
                { b: "Make sure the app gets the signal." },
                " Kubernetes sends TERM only to process 1. A shell script that starts the app should end with ",
                { code: "exec" },
                ", so the app replaces the shell as process 1:",
              ],
              blocks: [{ kind: "code", lang: "bash", code: 'exec /app/server "$@"' }],
            },
            [
              {
                b: [
                  "Set ",
                  { code: "terminationGracePeriodSeconds" },
                  " above your slowest clean shutdown.",
                ],
              },
              " Include the preStop hook’s time, so SIGKILL never arrives first.",
            ],
            [
              { b: "Give probes room." },
              " Use a startup probe for slow starts, and liveness timeouts a busy app can meet. Then the kubelet doesn’t restart healthy containers under load.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For the requests still in flight, ",
            {
              a: "how to drain a Kubernetes node without any downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            " covers preStop hooks, readiness and PDBs.",
          ],
        },
      ],
    },
    {
      id: "exit-code-143-during-aks-and-eks",
      title: "Exit code 143 during AKS and EKS node upgrades",
      blocks: [
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), a rolling upgrade adds one surge node by default. It then cordons and drains the old nodes one at a time. If pods still run when the drain timeout ends, 30\u00a0minutes by default, the upgrade stops.",
        },
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), a managed node group update cordons and drains each old node. If its pods don’t leave within 15\u00a0minutes, the update fails with a PodEvictionFailure error. With the force flag, EKS deletes those pods instead.",
        },
        {
          kind: "p",
          text: "So a wave of 143s across workloads during an upgrade window is those drains working. Exit code 137 in the same window marks apps that outlasted their grace period.",
        },
      ],
    },
    {
      id: "exit-code-143-when-coral-drains-a",
      title: "Exit code 143 when Coral drains a node",
      blocks: [
        {
          kind: "p",
          text: "Coral, Zoorik’s Kubernetes optimization for AKS and EKS, drains spare nodes in two ways. Warm handover comes first, then eviction through the Eviction API, within each pod’s PDB. Old pods get the usual SIGTERM and grace period, so 143 is normal.",
        },
        {
          kind: "p",
          text: "For eligible Deployment and Argo Rollout pods, a new copy turns Ready on another node before the old one is evicted. Open connections to the old pod still end.",
        },
        {
          kind: "p",
          text: "StatefulSet and Job pods, and Deployments with the Recreate strategy, are evicted without a handover. A single-replica app among them gets a short restart. DaemonSet and static pods stay where they are.",
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
      title: "“Pod Lifecycle”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",
    },
    {
      publisher: "Kubernetes",
      title: "“Liveness, Readiness, and Startup Probes”",
      url: "https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/",
    },
    {
      publisher: "Kubernetes",
      title: "“API-initiated Eviction”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/api-eviction/",
    },
    {
      publisher: "Linux man-pages",
      title: "“signal(7)”",
      url: "https://man7.org/linux/man-pages/man7/signal.7.html",
    },
    {
      publisher: "Linux man-pages",
      title: "“bash(1)”",
      url: "https://man7.org/linux/man-pages/man1/bash.1.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Configure rolling upgrades for Azure Kubernetes Service (AKS) node pools”",
      url: "https://learn.microsoft.com/en-us/azure/aks/upgrade-aks-node-pools-rolling",
    },
    {
      publisher: "AWS",
      title: "“Understand each phase of node updates”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-update-behavior.html",
    },
    {
      publisher: "AWS",
      title: "“StopTask”",
      url: "https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_StopTask.html",
    },
  ],
  related: [
    {
      title: "Exit code 137 and OOMKilled: why Kubernetes kills a container",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
    {
      title: "kubectl drain: how to drain a Kubernetes node without any downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "kubectl cordon vs drain in Kubernetes: what each does to a node",
      where: "Learn",
      href: "/learn/cordon-vs-drain",
    },
    {
      title: "Pod disruption budget best practices for AKS and EKS",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
  ],
};
