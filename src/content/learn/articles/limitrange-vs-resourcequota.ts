import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/limitrange-vs-resourcequota/1";
import { figure as figure2 } from "@/features/learn/figures/limitrange-vs-resourcequota/2";
import { figure as figure3 } from "@/features/learn/figures/limitrange-vs-resourcequota/3";

export const article: Article = {
  slug: "limitrange-vs-resourcequota",
  title: "LimitRange vs ResourceQuota: what caps requests",
  meta: "LimitRange vs ResourceQuota: what each one checks, why to use both, how LimitRange defaults count against a quota, and how to fix a quota exceeded error.",
  h1: "LimitRange vs ResourceQuota: what caps namespace requests",
  deck: "A LimitRange bounds each container and a ResourceQuota caps the namespace total. How the two combine.",
  card: "What each one checks, how LimitRange defaults count against a quota, and what to do when a quota is full.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["LimitRange", "ResourceQuota"],
  published: "2026-10-25",
  updated: "2026-10-25",
  author: "soumya",
  cover: "/learn-covers/zoorik-learn-limitrange-vs-resourcequota-1200x630.webp",
  short:
    "LimitRange vs ResourceQuota is per-object rules against a namespace-wide total. A LimitRange works on each container, pod or PersistentVolumeClaim (PVC): it fills in default requests and limits for containers, and refuses values below a minimum, above a maximum or past a limit-to-request ratio. A ResourceQuota caps the namespace’s requests, limits and object counts. Use both with a CPU or memory quota: it may refuse pods with no requests or limits, and LimitRange defaults fill them in and count against it.",
  sections: [
    {
      id: "when-to-use-limitrange-vs-resourcequota",
      title: "When to use LimitRange vs ResourceQuota, and why you want both",
      blocks: [
        {
          kind: "p",
          text: "Picture a namespace with two objects. Its LimitRange gives containers a default CPU request of 100m, which is 0.1\u00a0CPU (m means thousandths of a CPU). Its ResourceQuota caps CPU requests at 4\u00a0CPU. Every container that sets no CPU request or limit gets the 100m, and the quota adds it to the namespace’s total, so 40 such pods fill the quota and a 41st is refused. At a 500m default only 8 fit, and at 2\u00a0CPU only 2. So the default you write in one object decides how many pods the other admits.",
        },
        {
          kind: "p",
          text: [
            "Both are namespaced objects in the core ",
            { code: "v1" },
            " API. They act at admission, when the API server receives a create or an update. Which you need depends on the job:",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ b: "Use a LimitRange to bound each container and fill in its defaults." }],
            [{ b: "Use a ResourceQuota to cap what the whole namespace asks for." }],
            [
              { b: "Use both when the quota tracks CPU or memory." },
              " Every new pod then has to specify requests or limits for that resource, or the control plane may reject it. The Kubernetes docs suggest a LimitRange to supply defaults for pods that set none.",
            ],
          ],
        },
        { kind: "p", text: "Here is resource quota vs limit range, point by point." },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "LimitRange", width: "45%" },
            { label: "ResourceQuota", width: "41%" },
          ],
          rows: [
            ["Works on", "Each container, pod or PVC in the namespace", "The namespace’s total"],
            [
              "What it checks",
              "Minimum and maximum per object, and the ratio of limit to request",
              "Sums of CPU and memory requests and limits, storage, and counts of objects such as pods or Services",
            ],
            [
              "Fills in values",
              "Yes: a default request and limit for containers that leave them out",
              "No",
            ],
            [
              "When it acts",
              "When a pod or PVC is created or updated, including an in-place resize",
              "When anything it counts is created or updated",
            ],
            [
              "Over the line",
              "403 Forbidden, with the rule that was broken",
              "403 Forbidden, with “exceeded quota” and the numbers (for a Deployment’s pods, in the Deployment’s status, not at apply)",
            ],
            [
              "Pods already running",
              "Kept as they are when you add or edit it",
              "Kept as they are when you add or reduce it",
            ],
            [
              "The job it does",
              "Stops one container asking for too much or too little",
              "Stops one team or app taking more than its share",
            ],
          ],
        },
      ],
    },
    {
      id: "kubernetes-limitrange",
      title: "A LimitRange sets defaults and bounds for each container",
      blocks: [
        {
          kind: "p",
          text: [
            "A LimitRange takes effect as soon as one exists in the namespace, and each item in its ",
            { code: "limits" },
            " list names what it applies to in ",
            { code: "type" },
            ": ",
            { code: "Container" },
            ", ",
            { code: "Pod" },
            " or ",
            { code: "PersistentVolumeClaim" },
            ". This Kubernetes LimitRange example covers the fields you’ll use most for containers:",
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
            " bound what a container may ask for: a request under the minimum or a limit over the maximum is refused with 403 Forbidden and a message naming the rule. The Kubernetes CPU walkthrough, with a 200m minimum and an 800m maximum, shows ",
            { code: "minimum cpu usage per Container is 200m, but request is 100m" },
            ". ",
            { code: "maxLimitRequestRatio" },
            " caps the ratio of limit to request, so with ",
            { code: 'cpu: "10"' },
            " a 100m request allows a CPU limit of at most 1\u00a0CPU.",
          ],
        },
        { kind: "p", text: "Two more rules:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Keep one LimitRange per namespace." },
              " With two or more, which default gets applied isn’t deterministic.",
            ],
            [
              { b: "Set the request and the limit together." },
              " A LimitRange doesn’t check its defaults against your values. A container that requests 700m CPU with no limit, where the default CPU limit is 500m, fails with ",
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
            ". The CPU walkthrough says a resize past them is rejected, and the pod keeps its previous values.",
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
            " is a request. Kubernetes applies each one only to the value a container leaves out, as the Kubernetes memory walkthrough shows with a ",
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
            "With only a 1Gi limit, it gets a 1Gi request, matching its own limit, not the 256Mi default.",
            "With only a 128Mi request, it keeps that request and gets the 512Mi limit.",
          ],
        },
        {
          kind: "p",
          text: [
            "The LimitRange gets defaults of its own too. Where a ",
            { code: "Container" },
            " item leaves fields out, Kubernetes fills the gaps in this order, set in its source code:",
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
              " when there’s neither a default nor a max to copy.",
            ],
          ],
        },
        { kind: "p", text: "To see what resulted, read the object back:" },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get limitrange --output=yaml --namespace=<namespace>",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A ",
            { code: "max" },
            " set without defaults becomes the default request and limit too. The CPU walkthrough’s LimitRange sets only a 200m ",
            { code: "min" },
            " and an 800m ",
            { code: "max" },
            ", and comes back with ",
            { code: "default" },
            " and ",
            { code: "defaultRequest" },
            " both at 800m. A container that sets neither a CPU request nor a CPU limit then asks for 800m, and the walkthrough warns that such a pod may not fit on a node with only 1\u00a0CPU. Set ",
            { code: "defaultRequest" },
            " on purpose, close to what a typical container in the namespace uses.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-resource-quota",
      title: "A Kubernetes resource quota caps what the whole namespace asks for",
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
              { b: "Compute keys" },
              " ",
              { code: "requests.cpu" },
              ", ",
              { code: "requests.memory" },
              ", ",
              { code: "limits.cpu" },
              " and ",
              { code: "limits.memory" },
              " cap the sums across every pod in a non-terminal state, and plain ",
              { code: "cpu" },
              " and ",
              { code: "memory" },
              " mean the same as the ",
              { code: "requests." },
              " forms.",
            ],
            [
              { b: "Storage keys" },
              " cap the total that PVCs request, overall or per StorageClass.",
            ],
            [
              { b: "Object counts" },
              " cap kinds such as ",
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
            "A quota doesn’t ",
            { a: "make a cluster smaller", href: "/learn/reduce-kubernetes-cost" },
            " by itself: it stops one namespace from asking for more than its share. It counts what pod specs ask for, in absolute units, so adding nodes doesn’t raise any namespace’s share. Nor does it restrict which nodes a namespace’s pods land on.",
          ],
        },
        {
          kind: "p",
          text: [
            "Scopes narrow what a quota counts: with a scope such as ",
            { code: "BestEffort" },
            ", ",
            { code: "NotBestEffort" },
            " or ",
            { code: "PriorityClass" },
            ", it counts only the pods that match. The ",
            { code: "PriorityClass" },
            " scope, stable since Kubernetes 1.17, lets you give high-priority pods a budget of their own.",
          ],
        },
      ],
    },
    {
      id: "limitrange-defaults-and-quota",
      title: "LimitRange defaults decide how many pods the quota admits",
      blocks: [
        {
          kind: "p",
          text: [
            "A container with no CPU request or limit counts against ",
            { code: "requests.cpu" },
            " at whatever ",
            { code: "defaultRequest" },
            " says, and one that sets only a limit is charged its limit, because its request is copied from it. Admission runs mutating controllers, which can change a pod, before validating ones: the LimitRange admission controller fills in its defaults in the first phase, and the ResourceQuota controller adds the pod up in the second, defaults included.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Take pods whose single container sets no CPU request or limit, under the ",
            { code: "container-defaults" },
            " LimitRange and the 4\u00a0CPU ",
            { code: "requests.cpu" },
            " cap of ",
            { code: "team-a" },
            ". Each pod is charged 100m, and 4\u00a0CPU is 4,000m, so 4,000m ÷ 100m = 40\u00a0pods fill the quota: the 40th takes ",
            { code: "requests.cpu" },
            " from 3.9\u00a0CPU (39 × 100m) to 4.0, and a 41st, which would make it 4.1, is refused. Remove the ",
            { code: "defaultRequest" },
            " block and Kubernetes copies ",
            { code: "default" },
            " into it: 500m per pod, so 4,000m ÷ 500m = 8\u00a0pods reach the cap. Keep only the ",
            { code: "max" },
            " block and every container asks for the full 2\u00a0CPUs, so 4,000m ÷ 2,000m = 2\u00a0pods fill it. The containers’ real use is the same in all three cases.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: [
            "Leave quota room for the surge of your largest Deployment. By default a rolling update can run up to 25% more pods than the replica count, rounded up (the max surge), and each surge pod counts against the quota. If the 40\u00a0pods above are one Deployment, its surge is 10\u00a0pods × 100m = 1\u00a0CPU, so ",
            { code: "team-a" },
            " needs a 5\u00a0CPU cap to roll it out at full surge. Without that room, old pods must go first, up to the max unavailable (25%, rounded down). For 3\u00a0replicas or fewer that’s 0, so the rollout gets stuck.",
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
      title: "How to set an AKS namespace resource quota",
      blocks: [
        {
          kind: "p",
          text: [
            "On Azure Kubernetes Service (AKS), you can apply both objects with ",
            { code: "kubectl" },
            ", or create a managed namespace through Azure Resource Manager. It can carry a quota on the namespace’s total CPU and memory requests and limits, plus network policies and optional labels and annotations:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks namespace add \\\n  --name <namespace> \\\n  --cluster-name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --cpu-request 250m \\\n  --cpu-limit 500m \\\n  --memory-request 512Mi \\\n  --memory-limit 2Gi",
        },
        {
          kind: "p",
          text: "Memory takes power-of-two units such as Mi and Gi. A namespace admin with the built-in Azure Kubernetes Service RBAC Admin role can’t raise the cap, because that role has no write access to the resource quota.",
        },
        {
          kind: "p",
          text: "Before you convert an existing namespace, compare its pods’ current requests with the values you plan: if they already ask for more, existing deployments aren’t affected, but new pods and scale-ups are refused.",
        },
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS), you apply the same two YAML objects with ",
            { code: "kubectl" },
            ".",
          ],
        },
      ],
    },
    {
      id: "resource-quota-exceeded",
      title: "When a Kubernetes resource quota is exceeded, find the refusal and free room",
      blocks: [
        {
          kind: "p",
          text: [
            "Where the refusal shows up depends on what creates the pod. A pod you create directly fails at once, with 403 Forbidden and an ",
            { code: "exceeded quota" },
            " message that gives the numbers. A Deployment is created successfully, so ",
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
            ", and the Deployment’s status carries the message, as in this example from the Kubernetes docs:",
          ],
        },
        {
          kind: "code",
          lang: "text",
          code: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:\n  object-counts, requested: pods=1, used: pods=3, limited: pods=2',
        },
        {
          kind: "p",
          text: "The message names the quota, the resource and the amounts requested, used and allowed. To clear a refusal:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Check which object refused the pod." },
              " A quota refusal says ",
              { code: "exceeded quota" },
              ". A LimitRange refusal names a per-container rule instead, such as the CPU walkthrough’s ",
              { code: "maximum cpu usage per Container is 800m, but limit is 1500m" },
              ". Its fix is in the pod spec or the LimitRange, not the quota.",
            ],
            [
              { b: "See every cap beside its current use" },
              " with ",
              { code: "kubectl describe quota --namespace=<namespace>" },
              ".",
            ],
            [
              { b: "Free room." },
              " The Deployments page lists three ways out: scale the Deployment down, scale down other controllers in the namespace, or raise the quota.",
            ],
            [
              { b: "When a request cap is full, rebalance requests." },
              " Compare each workload’s requests, LimitRange defaults included, with what its containers really use, and reduce those far above it. That frees quota without taking a replica away. ",
              { a: "Kubernetes pod rebalancing", href: "/learn/kubernetes-pod-right-sizing" },
              " walks through it.",
            ],
          ],
        },
      ],
    },
    {
      id: "where-coral-fits",
      title: "Where Coral fits with LimitRange and ResourceQuota",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS, and rebalances each container’s CPU and memory requests from observed use. A quota adds up requests, so smaller ones leave more of ",
            { code: "requests.cpu" },
            " and ",
            { code: "requests.memory" },
            " free.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Rebalancing." },
              " Every change respects your minimums, LimitRanges and quotas, and routine changes under 10% are skipped (",
              {
                a: "how Coral decides a change is safe",
                href: "/coral-faq#how-does-coral-decide-a-change",
              },
              "). Coral never changes your manifest. It sizes pods as they start, and resizes running pods in place on 1.33+ nodes where possible, or else restarts them one at a time.",
            ],
            [
              { b: "Limits." },
              " Where a ResourceQuota caps ",
              { code: "limits.cpu" },
              " or ",
              { code: "limits.memory" },
              ", Coral keeps the limits as they are.",
            ],
            [
              { b: "Warm handover." },
              " When Coral drains a node, it starts one extra copy of an eligible Deployment or Argo Rollout pod and waits for it to be Ready before the old pod goes. With no quota room for that copy, Coral falls back to eviction within the PodDisruptionBudget. A single-replica app then restarts briefly.",
            ],
            [
              { b: "Quotas and refusals." },
              " The agent’s inventory, sent every 5\u00a0minutes, covers nodes, namespaces, workloads with their requests, limits and labels, autoscalers, PodDisruptionBudgets and quotas. The only event text sent is the message when a pod can’t be created because of a quota, a limit range or an admission policy (",
              { a: "what never leaves", href: "/coral-guide#what-never-leaves" },
              ").",
            ],
            [{ b: "Opt-in." }, " Pod sizing waits until you switch on “Automatically optimize”."],
          ],
        },
        {
          kind: "p",
          text: [
            "Smaller requests reduce the bill only when a node goes. On our own AKS development cluster, Coral removed a spare worker and rebalanced the requests of 14 apps by 12 October 2026. The CPU the apps reserve went from 0.78 to 0.43\u00a0cores, 45% less, and memory from 6.4 to 5.4\u00a0GiB, 16% less. Then Coral swapped the remaining worker for a cheaper machine of the same size. Eight days after we connected it, ",
            { a: "the machine bill", href: "/coral-value-lab" },
            " was $154.76 a month instead of $368.65, 58% less.",
          ],
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
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "In-place pod resize: change CPU and memory without a restart",
      where: "Learn",
      href: "/learn/in-place-pod-resize",
    },
    {
      title: "Kubernetes overprovisioning: what it is and how to measure it",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "How does Coral decide a change is safe to apply automatically?",
      where: "Coral FAQ",
      href: "/coral-faq#how-does-coral-decide-a-change",
    },
    {
      title: "What never leaves",
      where: "Coral product guide",
      href: "/coral-guide#what-never-leaves",
    },
  ],
};
