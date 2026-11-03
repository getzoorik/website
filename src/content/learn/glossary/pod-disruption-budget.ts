import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/pod-disruption-budget/1";

export const term: GlossaryTerm = {
  slug: "pod-disruption-budget",
  term: "Pod Disruption Budget (PDB)",
  title: "What is a pod disruption budget (PDB)?",
  meta: "A pod disruption budget (PDB) limits how many of an app’s pods a drain can take down at once. How it works, and what a strict one costs.",
  h1: "What is a pod disruption budget (PDB)?",
  card: "A pod disruption budget (PDB) limits how many of an app’s pods can be down at once during voluntary disruptions.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A pod disruption budget (PDB) limits how many of an app’s pods can be down at once during voluntary disruptions. In Kubernetes it’s the PodDisruptionBudget object, stable since v1.21.",
    },
    {
      kind: "p",
      text: [
        { a: "Draining a node", href: "/learn/cordon-vs-drain" },
        " is a voluntary disruption. A hardware failure is involuntary, so a PDB can’t stop it. A PDB also doesn’t limit deleting a pod or Deployment directly, or a rolling update.",
      ],
    },
  ],
  sections: [
    {
      id: "the-purpose-of-pod-disruption-budgets-in",
      title: "How a PDB works",
      blocks: [
        {
          kind: "p",
          text: "A PDB selects an app’s pods by label. It sets one of two fields, as a number or a percentage:",
        },
        {
          kind: "ul",
          items: [
            [{ code: "minAvailable" }, ": pods that must stay up."],
            [{ code: "maxUnavailable" }, ": pods that may be down."],
          ],
        },
        {
          kind: "p",
          text: [
            "The Kubernetes docs recommend ",
            { code: "maxUnavailable" },
            ", because it follows changes in the replica count.",
          ],
        },
        {
          kind: "p",
          text: [
            "Tools that respect PDBs, such as ",
            { code: "kubectl drain" },
            ", evict pods through the Eviction API. If an eviction would break the budget, the API refuses it and the drain retries.",
          ],
        },
      ],
    },
    {
      id: "a-budget-that-blocks-a-drain",
      title: "A PodDisruptionBudget example",
      blocks: [
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: zk-pdb\nspec:\n  minAvailable: 2\n  selector:\n    matchLabels:\n      app: zookeeper",
        },
        {
          kind: "p",
          text: [
            "This example from the Kubernetes docs sets ",
            { code: "minAvailable: 2" },
            ". With 3 pods, it allows 1 disruption. After one eviction, the next waits until a replacement pod is Ready.",
          ],
        },
        {
          kind: "p",
          text: [
            "Set ",
            { code: "maxUnavailable: 0" },
            " instead, and no voluntary eviction is allowed. Draining a node that runs any of the 3 never completes.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "The Cluster Autoscaler checks PDBs before it removes a node. If any eviction fails, it keeps the node. Karpenter respects PDBs too.",
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
      line: "A node kept for a PDB adds unused capacity.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Pod disruption budget best practices",
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
