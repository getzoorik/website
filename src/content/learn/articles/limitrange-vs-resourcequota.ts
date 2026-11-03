import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/limitrange-vs-resourcequota/1";
import { figure as figure2 } from "@/features/learn/figures/limitrange-vs-resourcequota/2";
import { figure as figure3 } from "@/features/learn/figures/limitrange-vs-resourcequota/3";

export const article: Article = {
  slug: "limitrange-vs-resourcequota",
  title: "Namespace limits: LimitRange vs ResourceQuota",
  meta: "LimitRange vs ResourceQuota in Kubernetes: how a LimitRange sets container defaults, how a quota caps a namespace, and how to fix exceeded quota errors.",
  h1: "LimitRange vs ResourceQuota",
  deck: "Both act only when an object is created or updated, so adding either leaves running pods as they are.",
  card: "What each one checks, how LimitRange defaults count against a quota, and what to do when a quota is full.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["LimitRange", "ResourceQuota"],
  published: "2026-10-25",
  updated: "2026-11-03",
  author: "soumya",
  cover: "/learn-covers/zoorik-learn-limitrange-vs-resourcequota-1200x630.webp",
  coverAlt:
    "LimitRange vs ResourceQuota: a LimitRange covers each container, a ResourceQuota the namespace total, with headroom left",
  short:
    "A LimitRange works on each container, pod or PersistentVolumeClaim (PVC). It fills in default requests and limits for containers, and refuses values below its minimum, above its maximum or past its limit-to-request ratio. A ResourceQuota caps the namespace’s total requests, limits and object counts.",
  sections: [
    {
      id: "when-to-use-limitrange-vs-resourcequota",
      title: "When to use each",
      blocks: [
        {
          kind: "p",
          text: "Use a LimitRange to bound each container and fill in its defaults. Use a ResourceQuota to cap what the whole namespace asks for.",
        },
        {
          kind: "p",
          text: "Use both when the quota covers CPU or memory. Every new pod must then set requests or limits for that resource, or the control plane may reject it. A LimitRange supplies defaults for pods that set none.",
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "LimitRange", width: "45%" },
            { label: "ResourceQuota", width: "41%" },
          ],
          rows: [
            ["Works on", "Each container, pod or PVC", "The namespace’s total"],
            [
              "Checks",
              "Minimum and maximum per object, and the limit-to-request ratio",
              "Summed CPU and memory requests and limits, storage, and counts of objects such as pods or Services",
            ],
            [
              "Fills in values",
              "Yes: a default request and limit for containers that set none",
              "No",
            ],
            [
              "Acts when",
              "A pod or PVC is created or updated, including an in-place resize",
              "Anything it counts is created or updated",
            ],
            [
              "Over the line",
              "403 Forbidden, naming the broken rule",
              "403 Forbidden, with “exceeded quota” and the numbers (for a Deployment’s pods, in its status, not at apply)",
            ],
            [
              "Running pods",
              "Unchanged when you add or edit it",
              "Unchanged when you add or reduce it",
            ],
            [
              "Stops",
              "One container asking for too much or too little",
              "One team or app taking more than its share",
            ],
          ],
        },
      ],
    },
    {
      id: "kubernetes-limitrange",
      title: "How a LimitRange works",
      blocks: [
        {
          kind: "p",
          text: [
            "A LimitRange applies as soon as it exists in the namespace. Each item in its ",
            { code: "limits" },
            " list names its target in ",
            { code: "type" },
            ": ",
            { code: "Container" },
            ", ",
            { code: "Pod" },
            " or ",
            { code: "PersistentVolumeClaim" },
            ". This example covers the container fields you’ll use most:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: v1\nkind: LimitRange\nmetadata:\n  name: container-defaults\n  namespace: <namespace>\nspec:\n  limits:\n  - type: Container\n    defaultRequest:\n      cpu: 100m\n      memory: 256Mi\n    default:\n      cpu: 500m\n      memory: 512Mi\n    min:\n      cpu: 50m\n      memory: 64Mi\n    max:\n      cpu: "2"\n      memory: 2Gi\n    maxLimitRequestRatio:\n      cpu: "10"',
        },
        {
          kind: "p",
          text: [
            { code: "min" },
            " and ",
            { code: "max" },
            " bound what a container may ask for. A request under the minimum or a limit over the maximum is refused with 403 Forbidden, naming the rule.",
          ],
        },
        {
          kind: "p",
          text: [
            "In the Kubernetes CPU walkthrough, a 200m minimum (m is a thousandth of a CPU) refuses a 100m ",
            { a: "CPU request", href: "/learn/glossary/kubernetes-resource-requests" },
            ". The error reads: ",
            { code: "minimum cpu usage per Container is 200m, but request is 100m" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "maxLimitRequestRatio" },
            " caps the limit-to-request ratio. With ",
            { code: 'cpu: "10"' },
            ", a 100m request allows a ",
            { a: "CPU limit", href: "/learn/glossary/kubernetes-resource-limits" },
            " of at most 1 CPU.",
          ],
        },
        { kind: "p", text: "Two more rules:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Keep one LimitRange per namespace." },
              " With two or more, which default applies isn’t deterministic.",
            ],
            [
              { b: "Set the request and the limit together." },
              " A LimitRange doesn’t check its defaults against your values. A container that requests 700m CPU with no limit, under a 500m default limit, fails with ",
              { code: "must be less than or equal to cpu limit" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The minimum and maximum also hold for an ",
            { a: "in-place pod resize", href: "/learn/in-place-pod-resize" },
            ". A resize past them is rejected, and the pod keeps its previous values.",
          ],
        },
        {
          kind: "h3",
          id: "limitrange-default-vs-defaultrequest",
          title: "LimitRange default vs defaultRequest",
        },
        {
          kind: "p",
          text: [
            { code: "default" },
            " is a limit and ",
            { code: "defaultRequest" },
            " is a request. Each fills only the value a container leaves out. The Kubernetes memory walkthrough shows this with a ",
            { code: "defaultRequest" },
            " of 256Mi and a ",
            { code: "default" },
            " of 512Mi:",
          ],
        },
        {
          kind: "ul",
          items: [
            "With neither set, the container gets both defaults.",
            "With only a 1Gi limit, it gets a 1Gi request to match, not the 256Mi default.",
            "With only a 128Mi request, it keeps that request and gets the 512Mi limit.",
          ],
        },
        {
          kind: "p",
          text: [
            "A LimitRange also fills its own missing ",
            { code: "Container" },
            " fields, in this order, set in the Kubernetes source code:",
          ],
        },
        {
          kind: "ul",
          items: [
            ["A missing ", { code: "default" }, " takes the ", { code: "max" }, "."],
            [
              "A missing ",
              { code: "defaultRequest" },
              " then takes the ",
              { code: "default" },
              ", or the ",
              { code: "min" },
              " when there’s no default.",
            ],
          ],
        },
        { kind: "p", text: "To see the result, read the object back:" },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get limitrange --output=yaml --namespace=<namespace>",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "The CPU walkthrough’s LimitRange sets only a 200m ",
            { code: "min" },
            " and an 800m ",
            { code: "max" },
            ", so it comes back with ",
            { code: "default" },
            " and ",
            { code: "defaultRequest" },
            " both at 800m. A container that sets no CPU values then asks for 800m, which may not fit on a node with only 1 CPU. Set ",
            { code: "defaultRequest" },
            " on purpose, close to what a typical container uses.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-resource-quota",
      title: "How a ResourceQuota works",
      blocks: [
        {
          kind: "p",
          text: [
            "A ResourceQuota is enforced as soon as one exists in a namespace. Its ",
            { code: "hard" },
            " map sets the caps:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Compute." },
              " ",
              { code: "requests.cpu" },
              ", ",
              { code: "requests.memory" },
              ", ",
              { code: "limits.cpu" },
              " and ",
              { code: "limits.memory" },
              " cap the sums across all pods in a non-terminal state. Plain ",
              { code: "cpu" },
              " and ",
              { code: "memory" },
              " mean the same as the ",
              { code: "requests." },
              " forms.",
            ],
            [{ b: "Storage." }, " Caps the total that PVCs request, overall or per StorageClass."],
            [
              { b: "Object counts." },
              " Caps kinds such as ",
              { code: "pods" },
              ", ",
              { code: "services.loadbalancers" },
              " or ",
              { code: "count/deployments.apps" },
              ".",
            ],
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: v1\nkind: ResourceQuota\nmetadata:\n  name: team-a\n  namespace: <namespace>\nspec:\n  hard:\n    requests.cpu: "4"\n    requests.memory: 16Gi\n    limits.memory: 32Gi\n    pods: "50"',
        },
        {
          kind: "p",
          text: [
            "A quota counts what pod specs ask for, in absolute units, so adding nodes raises no namespace’s share. It sets no rules about nodes, and it doesn’t make a cluster smaller. On its own, it isn’t ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Scopes narrow what a quota counts. With a scope such as ",
            { a: { code: "BestEffort" }, href: "/learn/glossary/kubernetes-qos-class" },
            ", ",
            { code: "NotBestEffort" },
            " or ",
            { code: "PriorityClass" },
            ", it counts only the pods that match. The ",
            { code: "PriorityClass" },
            " scope, stable since Kubernetes 1.17, gives high-priority pods a budget of their own.",
          ],
        },
      ],
    },
    {
      id: "limitrange-defaults-and-quota",
      title: "How defaults fill a quota",
      blocks: [
        {
          kind: "p",
          text: [
            "A container with no CPU request or limit is charged its ",
            { code: "defaultRequest" },
            " against ",
            { code: "requests.cpu" },
            ". One that sets only a limit is charged that limit, because its request is copied from it.",
          ],
        },
        {
          kind: "p",
          text: "Admission sets the order. Mutating controllers, which can change a pod, run before validating ones. The LimitRange controller fills in defaults first. Then the ResourceQuota controller adds up the pod, defaults included.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Take pods whose single container sets no CPU request or limit, under the ",
            { code: "container-defaults" },
            " LimitRange and the 4 CPU ",
            { code: "requests.cpu" },
            " cap of ",
            { code: "team-a" },
            ". Each pod is charged 100m, so 4,000m ÷ 100m = 40 pods fill the quota, and a 41st is refused. Remove the ",
            { code: "defaultRequest" },
            " block and Kubernetes copies ",
            { code: "default" },
            " into it: at 500m each, 8 pods fill it. Keep only the ",
            { code: "max" },
            " block and each container asks for 2 CPUs, so 2 pods fill it. Real use is the same in all three cases.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: [
            "Leave quota room for your largest Deployment’s surge. By default a rolling update’s max surge lets it run up to 25% more pods than its replica count, rounded up. Each surge pod counts against the quota. If the 40 pods above are one Deployment, its surge is 10 × 100m = 1 CPU, so ",
            { code: "team-a" },
            " needs a 5 CPU cap. Without that room, old pods must go first, up to the max unavailable: 25%, rounded down. For 3 replicas or fewer that’s 0, so the rollout gets stuck.",
          ],
        },
        { kind: "p", text: "To set up both, in order:" },
        {
          kind: "ol",
          items: [
            [
              { b: ["Write the LimitRange with a ", { code: "defaultRequest" }, " you chose"] },
              ", never a ",
              { code: "max" },
              " alone.",
            ],
            [{ b: "Size the quota" }, " to current requests plus the largest surge."],
            [{ b: "Check the room" }, " with ", { code: "kubectl describe quota" }, "."],
          ],
        },
      ],
    },
    {
      id: "aks-namespace-resource-quota",
      title: "Quotas on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: [
            "On Azure Kubernetes Service (AKS), apply both objects with ",
            { code: "kubectl" },
            ", or create a managed namespace with the Azure CLI. A managed namespace can carry a quota on CPU and memory requests and limits, plus network policies, labels and annotations:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks namespace add \\\n  --name <namespace> \\\n  --cluster-name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --cpu-request 250m \\\n  --cpu-limit 500m \\\n  --memory-request 512Mi \\\n  --memory-limit 2Gi",
        },
        {
          kind: "p",
          text: "Memory takes power-of-two units such as Mi and Gi. The built-in Azure Kubernetes Service RBAC Admin role has no write access to the resource quota, so a namespace admin can’t raise the cap.",
        },
        {
          kind: "p",
          text: "Before you convert an existing namespace, compare its pods’ requests with the planned quota. If they already ask for more, existing deployments keep running, but new pods and scale-ups are refused.",
        },
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS), apply the same two YAML objects with ",
            { code: "kubectl" },
            ".",
          ],
        },
      ],
    },
    {
      id: "resource-quota-exceeded",
      title: "Fix an exceeded quota",
      blocks: [
        {
          kind: "p",
          text: [
            "Where the refusal shows depends on what creates the pod. A pod you create directly fails at once, with 403 Forbidden and an ",
            { code: "exceeded quota" },
            " message. A Deployment is still created, so ",
            { code: "kubectl apply" },
            " reports nothing wrong. Its ReplicaSet then fails to create some or all of its pods.",
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            { code: "kubectl describe deployment" },
            " shows the condition ",
            { code: "ReplicaFailure" },
            " with reason ",
            { code: "FailedCreate" },
            ". The Deployment’s status carries the message, as in this Kubernetes docs example:",
          ],
        },
        {
          kind: "code",
          lang: "text",
          code: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:\n  object-counts, requested: pods=1, used: pods=3, limited: pods=2',
        },
        {
          kind: "p",
          text: "The message names the quota, the resource, and the amounts requested, used and allowed. To clear it:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Check which object refused the pod." },
              " A quota refusal says ",
              { code: "exceeded quota" },
              ". A LimitRange refusal names a per-container rule instead, such as ",
              { code: "maximum cpu usage per Container is 800m, but limit is 1500m" },
              ". Fix that in the pod spec or the LimitRange, not the quota.",
            ],
            [
              { b: "See each cap beside its current use" },
              " with ",
              { code: "kubectl describe quota --namespace=<namespace>" },
              ".",
            ],
            [
              { b: "Free room." },
              " Scale the Deployment down, scale down other controllers in the namespace, or raise the quota.",
            ],
            [
              { b: "Or reduce oversized requests." },
              " Compare each workload’s requests, LimitRange defaults included, with what its containers use. Reducing requests far above use frees quota without removing a replica. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " walks through it.",
            ],
          ],
        },
      ],
    },
    {
      id: "where-coral-fits",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances each container’s CPU and memory requests from observed use, on AKS and EKS. A quota adds up requests, so smaller ones free room in ",
            { code: "requests.cpu" },
            " and ",
            { code: "requests.memory" },
            ".",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Within your rules." },
              " Every change stays within your minimums, LimitRanges and quotas, and small routine changes are skipped (",
              {
                a: "how Coral decides a change is safe",
                href: "/coral-faq#how-does-coral-decide-a-change",
              },
              ").",
            ],
            [
              { b: "Your manifest stays as it is." },
              " Coral sizes pods as they start. It resizes running pods in place on 1.33+ nodes where possible, or else restarts them one at a time.",
            ],
            [
              { b: "Limits kept." },
              " Where a ResourceQuota caps ",
              { code: "limits.cpu" },
              " or ",
              { code: "limits.memory" },
              ", Coral keeps the limits as they are.",
            ],
            [
              { b: "Warm handover." },
              " When Coral drains a node, it starts one extra copy of an eligible Deployment or Argo Rollout pod. The old pod goes once that copy is Ready. With no quota room for the copy, Coral falls back to eviction within the ",
              { a: "PodDisruptionBudget", href: "/learn/glossary/pod-disruption-budget" },
              ", and a single-replica app restarts briefly.",
            ],
            [
              { b: "Refusals reported." },
              " Coral reads your ResourceQuotas and LimitRanges. The only event text it sends is the message when a quota, a limit range or an admission policy refuses a pod (",
              { a: "what never leaves", href: "/coral-guide#what-never-leaves" },
              ").",
            ],
            [{ b: "Opt-in." }, " Pod sizing waits until you switch on “Automatically optimize”."],
          ],
        },
        {
          kind: "p",
          text: "Smaller requests reduce cloud cost only when a node goes. On our own AKS development cluster, Coral removed a spare worker and rebalanced the requests of 14 apps by 12 October 2026.",
        },
        {
          kind: "p",
          text: [
            "Reserved CPU went from 0.78 to 0.43 cores, and memory from 6.4 to 5.4 GiB. Coral then swapped the remaining worker for a cheaper machine of the same size. ",
            { a: "The machine cost", href: "/coral-value-lab" },
            " went from $368.65 a month to $154.76, 58% less.",
          ],
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
      title: "“Limit Ranges”",
      url: "https://kubernetes.io/docs/concepts/policy/limit-range/",
    },
    {
      publisher: "Kubernetes",
      title: "“Configure Default Memory Requests and Limits for a Namespace”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/",
    },
    {
      publisher: "Kubernetes",
      title: "“Configure Minimum and Maximum CPU Constraints for a Namespace”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/",
    },
    {
      publisher: "Kubernetes on GitHub",
      title: "“pkg/apis/core/v1/defaults.go”",
      url: "https://github.com/kubernetes/kubernetes/blob/master/pkg/apis/core/v1/defaults.go",
      note: " (SetDefaults_LimitRangeItem and SetDefaults_Pod)",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Quotas”",
      url: "https://kubernetes.io/docs/concepts/policy/resource-quotas/",
    },
    {
      publisher: "Kubernetes",
      title: "“Admission Control in Kubernetes”",
      url: "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Deployments”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of managed namespaces in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-managed-namespaces",
    },
  ],
  related: [
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "In-place pod resize in Kubernetes",
      where: "Learn",
      href: "/learn/in-place-pod-resize",
    },
    {
      title: "Kubernetes overprovisioning",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "How does Coral decide a change is safe?",
      where: "Coral FAQ",
      href: "/coral-faq#how-does-coral-decide-a-change",
    },
    {
      title: "What Coral never sends out of your cluster",
      where: "Coral product guide",
      href: "/coral-guide#what-never-leaves",
    },
  ],
  relatedTitle: "More on namespace limits and pod requests",
};
