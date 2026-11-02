import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/pod-disruption-budget/1";

export const term: GlossaryTerm = {
  slug: "pod-disruption-budget",
  term: "Pod Disruption Budget (PDB)",
  title: "Pod disruption budget (PDB) in Kubernetes",
  meta: "A Kubernetes PodDisruptionBudget (PDB) limits how many of an app’s pods a drain can take down. See minAvailable, maxUnavailable, and what a strict one costs.",
  h1: "Pod disruption budget (PDB) in Kubernetes",
  card: "A pod disruption budget in Kubernetes (a PodDisruptionBudget, or PDB) limits how many of an app’s pods can be down at once during voluntary disruptions.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "A pod disruption budget in Kubernetes (a PodDisruptionBudget, or PDB) limits how many of an app’s pods can be down at once during voluntary disruptions. PDBs have been stable since Kubernetes v1.21.",
    },
    {
      kind: "p",
      text: [
        { a: "Draining a node", href: "/learn/cordon-vs-drain" },
        " to evict its pods is a voluntary disruption. A hardware failure is involuntary, so a PDB can’t stop it. A PDB also doesn’t limit deleting a pod directly or a rolling update.",
      ],
    },
  ],
  sections: [
    {
      id: "the-purpose-of-pod-disruption-budgets-in",
      title: "The purpose of pod disruption budgets in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "A PDB in Kubernetes helps keep enough of your app running during a drain. You set one of two fields, as a number or percentage:",
        },
        {
          kind: "ul",
          items: [
            [{ code: "minAvailable" }, ": pods that must stay up."],
            [{ code: "maxUnavailable" }, ": pods that may be down."],
          ],
        },
      ],
    },
    {
      id: "a-budget-that-blocks-a-drain",
      title: "A PodDisruptionBudget that blocks a drain",
      blocks: [
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: zk-pdb\nspec:\n  minAvailable: 2\n  selector:\n    matchLabels:\n      app: zookeeper",
        },
        {
          kind: "p",
          text: [
            "The docs’ example sets ",
            { code: "minAvailable: 2" },
            " for 3\u00a0pods, which allows 1 disruption. After one eviction, the next waits until a replacement pod is Ready.",
          ],
        },
        {
          kind: "p",
          text: [
            "Set ",
            { code: "maxUnavailable: 0" },
            " instead, and zero voluntary evictions are allowed. Draining a node that runs any of the 3 never completes.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why PDBs matter for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "The Cluster Autoscaler, which adds and removes nodes, checks PDBs before removing one. If any eviction fails, it keeps the node.",
            [
              "A PDB that allows no disruption, such as ",
              { code: "maxUnavailable: 0" },
              " or ",
              { code: "minAvailable: 100%" },
              ", is one reason for ",
              {
                a: "Cluster Autoscaler not scaling down",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              ". You keep paying for the node.",
            ],
            [
              "The ",
              {
                a: "safe-to-evict and do-not-disrupt annotations",
                href: "/learn/safe-to-evict-do-not-disrupt",
              },
              " can also keep a node running.",
            ],
            [{ a: "Coral", href: "/coral" }, " never evicts a pod past its PDB."],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Set a budget", href: "/learn/pod-disruption-budget-best-practices" },
            " that lets a drain finish.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Horizontal Pod Autoscaler",
      line: "Sets the replica count a percentage budget counts from.",
      href: "/learn/glossary/horizontal-pod-autoscaler",
    },
    {
      title: "Node pool",
      line: "Nodes with one setup, drained in a scale-down.",
      href: "/learn/glossary/node-pool",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "A kept spare node adds unused capacity.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  next: {
    title: "Pod disruption budget best practices for AKS and EKS",
    href: "/learn/pod-disruption-budget-best-practices",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Disruptions”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
    },
    {
      publisher: "Kubernetes",
      title: "“Specifying a Disruption Budget for your Application”",
      url: "https://kubernetes.io/docs/tasks/run-application/configure-pdb/",
    },
    {
      publisher: "Kubernetes Autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
  ],
};
