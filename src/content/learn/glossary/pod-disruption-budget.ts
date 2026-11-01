import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/pod-disruption-budget/1";

export const term: GlossaryTerm = {
  slug: "pod-disruption-budget",
  term: "Pod Disruption Budget (PDB)",
  title: "What is a Pod Disruption Budget (PDB)?",
  meta: "Pod disruption budget meaning, in plain words: how it limits the pods a node drain can take down, and why a strict one keeps you paying for a spare node.",
  h1: "What is a Pod Disruption Budget (PDB)?",
  card: "A pod disruption budget in Kubernetes, or PDB, limits how many of an app’s pods can be down at once during voluntary disruptions.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "A pod disruption budget in Kubernetes, or PDB, limits how many of an app’s pods can be down at once during voluntary disruptions. PDBs have been stable since Kubernetes v1.21.",
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
      title: "A budget that blocks a drain",
      blocks: [
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
      title: "Why it matters for your cloud cost",
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
            " that lets a drain finish. The ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " works out your own figure.",
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
  ],
};
