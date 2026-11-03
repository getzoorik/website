import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/exit-code-143/1";

export const article: Article = {
  slug: "exit-code-143",
  title: "Exit code 143 in Kubernetes: SIGTERM explained",
  meta: "Exit code 143 means SIGTERM (signal 15) stopped the container. Tell a normal stop from a restart loop, and fix it in Kubernetes and Docker.",
  h1: "Exit code 143 in Kubernetes",
  deck: "The code names the signal, not its sender. The pod’s events show what sent it.",
  card: "What 143 means, when it’s a warning, and how to make a SIGTERM stop clean.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-02",
  updated: "2026-11-03",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-exit-code-143-1200x630.webp",
  coverAlt:
    "SIGTERM, signal 15, reaches process 1, the app stops inside its grace period, and Kubernetes records 128 + 15 = 143",
  short:
    "Exit code 143 means SIGTERM (signal 15) ended the container’s main process before its grace period ran out. After a deletion, drain or rollout, that’s a normal stop. If the restart count keeps climbing, check the pod’s events for failed probes.",
  sections: [
    {
      id: "what-exit-code-143-means-in-kubernetes",
      title: "What exit code 143 means",
      blocks: [
        {
          kind: "p",
          text: "A process ended by a signal exits with status 128 plus the signal’s number. SIGTERM is signal 15, so exit status 143 means SIGTERM ended it.",
        },
        {
          kind: "p",
          text: [
            "In a shell, ",
            { code: "echo $?" },
            " prints that status. Kubernetes shows it as the Exit Code of the container’s Terminated state.",
          ],
        },
        {
          kind: "p",
          text: "SIGTERM ends a process by default. Unlike SIGKILL (signal 9), it can be caught, so the app can clean up and exit by itself. Kubernetes waits a grace period for that, then sends SIGKILL.",
        },
        {
          kind: "table",
          columns: [
            { label: "Exit code after a stop", width: "28%" },
            { label: "What happened", width: "72%" },
          ],
          rows: [
            ["0, or the app’s own code", "The app caught SIGTERM, cleaned up and exited"],
            ["143", "SIGTERM ended the process within the grace period"],
            ["137", "The grace period ran out, so SIGKILL ended the process"],
          ],
        },
        {
          kind: "p",
          text: [
            "Exit code 137 can also mean an out-of-memory kill. ",
            { a: "OOMKilled exit code 137", href: "/learn/oomkilled-exit-code-137" },
            " covers that case.",
          ],
        },
        { kind: "h3", id: "docker-exit-code-143", title: "Docker exit code 143" },
        {
          kind: "p",
          text: [
            { code: "docker stop" },
            " sends the container’s stop signal, SIGTERM unless the image’s STOPSIGNAL sets another, then SIGKILL after a timeout. Amazon Elastic Container Service (ECS) StopTask issues the equivalent, with a 30-second default timeout.",
          ],
        },
        {
          kind: "p",
          text: "So 143 from Docker or ECS means the container stopped on the signal in time. 137 after a stop means it outlasted the timeout.",
        },
      ],
    },
    {
      id: "how-kubernetes-stops-a-container-with-sigterm",
      title: "How Kubernetes sends SIGTERM",
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
            ", is 30 seconds by default and includes the preStop hook. Processes still running when it ends get SIGKILL.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "Three kinds of event start this stop:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Deletion." },
              " ",
              { code: "kubectl delete" },
              ", a rolling update or a scale-down removes the pod.",
            ],
            [
              { b: "Eviction." },
              " ",
              { code: "kubectl drain" },
              " and node upgrades use the Eviction API, which respects PodDisruptionBudgets (PDBs) and the pod’s grace period.",
            ],
            [
              { b: "Probe failure." },
              " A failed liveness or startup probe makes the kubelet restart the container. The probe’s own ",
              { code: "terminationGracePeriodSeconds" },
              ", where set, replaces the pod’s.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "containerd and CRI-O send SIGTERM unless the image sets STOPSIGNAL. A per-container ",
            { code: "lifecycle.stopSignal" },
            " field is alpha since Kubernetes 1.33, off by default behind the ContainerStopSignals feature gate.",
          ],
        },
      ],
    },
    {
      id: "when-exit-code-143-is-normal-and",
      title: "Normal stop or warning",
      blocks: [
        {
          kind: "p",
          text: "Check the container’s Last State and Restart Count, then the namespace’s events in time order:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl describe pod <pod-name> -n <namespace>\nkubectl get events -n <namespace> --sort-by=.lastTimestamp",
        },
        {
          kind: "p",
          text: "A container the kubelet has restarted shows this, trimmed:",
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
              " A deletion, drain, rollout or scale-down stopped it, and its replacement runs. The old pod’s 143 shows until the API server deletes the pod.",
            ],
            [
              { b: "Warning." },
              " The pod is still there, with 143 in Last State and a climbing Restart Count. Failed liveness or startup probes in its events mean the kubelet keeps restarting it.",
            ],
            [
              { b: "137 instead of 143." },
              " The app outlasted its grace period. It stopped too slowly, or a shell script running as process 1 never passed SIGTERM on.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A clean 143 means the app stopped in time, not that it finished its requests. Kubernetes removes the pod from its Service’s endpoints during shutdown, not before, so requests can still arrive briefly.",
        },
      ],
    },
    {
      id: "how-to-make-a-sigterm-stop-clean",
      title: "How to shut down cleanly",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Catch SIGTERM in the app." },
              " Stop taking new work, finish open connections, then exit.",
            ],
            {
              text: [
                { b: "Make sure the app gets the signal." },
                " Kubernetes sends TERM only to process 1. A shell script that starts the app should end with ",
                { code: "exec" },
                ", so the app replaces the shell:",
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
              " Count the preStop hook too, so SIGKILL never arrives first.",
            ],
            [
              { b: "Give probes room." },
              " Use a startup probe for slow starts, and liveness timeouts a busy app can meet, so the kubelet doesn’t restart healthy containers.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For requests still in flight, ",
            {
              a: "draining a node without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            " covers preStop hooks, readiness and PDBs.",
          ],
        },
      ],
    },
    {
      id: "exit-code-143-during-aks-and-eks",
      title: "AKS and EKS node upgrades",
      blocks: [
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), a rolling upgrade adds one surge node by default, then cordons and drains old nodes one at a time. If pods still run when the drain timeout ends, 30 minutes by default, the upgrade stops.",
        },
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), a managed node group update cordons and drains each old node. If its pods don’t leave within 15 minutes, the update fails with PodEvictionFailure. The force flag deletes those pods instead.",
        },
        {
          kind: "p",
          text: "So a wave of 143s during an upgrade is the drains working. A 137 in the same window marks an app that outlasted its grace period.",
        },
      ],
    },
    {
      id: "exit-code-143-when-coral-drains-a",
      title: "When Coral drains a node",
      blocks: [
        {
          kind: "p",
          text: "Coral, Zoorik’s Kubernetes cost optimization for AKS and EKS, drains spare nodes in two ways. Warm handover comes first, then eviction through the Eviction API, within each pod’s PDB. Either way, old pods get the usual SIGTERM and grace period, so 143 is normal.",
        },
        {
          kind: "p",
          text: "For eligible Deployment and Argo Rollout pods, a new copy turns Ready on another node before the old one is evicted. Open connections to the old pod still end.",
        },
        {
          kind: "p",
          text: "StatefulSet and Job pods, and Deployments with the Recreate strategy, are evicted without a handover. A single-replica app among them restarts briefly. DaemonSet and static pods stay where they are.",
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      title: "Exit code 137 (OOMKilled) in Kubernetes",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
    {
      title: "kubectl drain without any downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "kubectl cordon vs drain",
      where: "Learn",
      href: "/learn/cordon-vs-drain",
    },
    {
      title: "Pod disruption budget best practices",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
  ],
};
