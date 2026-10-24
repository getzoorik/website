import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/limitrange-vs-resourcequota/1";
import { figure as figure2 } from "@/features/learn/figures/limitrange-vs-resourcequota/2";

export const article: Article = {
  slug: "limitrange-vs-resourcequota",
  title: "LimitRange vs ResourceQuota: what caps requests",
  meta: "LimitRange vs ResourceQuota: what each one checks, how LimitRange defaults count against a quota, and how to read and fix a quota exceeded error.",
  h1: "LimitRange vs ResourceQuota: what caps namespace requests",
  deck: "A LimitRange bounds each container and a ResourceQuota caps the namespace total. How the two combine.",
  card: "What each one checks, how LimitRange defaults count against a quota, and what to do when a quota is full.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["LimitRange", "ResourceQuota"],
  published: "2026-10-29",
  updated: "2026-10-29",
  author: "soumya",
  short:
    "LimitRange vs ResourceQuota is a question of scope. A LimitRange works on each container, pod or PersistentVolumeClaim (PVC) in a namespace: it fills in default requests and limits for containers, and refuses values below a minimum, above a maximum or past a limit-to-request ratio. A ResourceQuota works on the namespace as a whole and caps the sum of requests, limits and object counts. The defaults a LimitRange fills in count against the quota.",
  sections: [
    {
      id: "limitrange-vs-resourcequota-at-a-glance",
      title: "LimitRange vs ResourceQuota at a glance",
      blocks: [
        {
          kind: "p",
          text: [
            "Both are namespaced objects in the core ",
            { code: "v1" },
            " API, and both act at admission, when the API server receives a create or an update. Adding or changing either one leaves running pods as they are. They answer different questions: how big one container may be, and how much the whole namespace may hold.",
          ],
        },
        { kind: "p", text: "Put side by side, resource quota vs limit range looks like this:" },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "LimitRange", width: "48%" },
            { label: "ResourceQuota", width: "38%" },
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
              "403 Forbidden, with “exceeded quota” and the numbers",
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
        {
          kind: "p",
          text: "You’ll usually want both. If a quota tracks CPU or memory, every new pod has to specify requests or limits for that resource, or the control plane may reject it, so the Kubernetes docs suggest a LimitRange to supply defaults for pods that set none.",
        },
      ],
    },
    {
      id: "what-a-limitrange-sets-for-each-container",
      title: "What a LimitRange sets for each container",
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
            { code: "defaultRequest" },
            " fills in a missing request and ",
            { code: "default" },
            " fills in a missing limit, while ",
            { code: "min" },
            " and ",
            { code: "max" },
            " bound what a container may ask for. A request under the minimum or a limit over the maximum is refused with 403 Forbidden and a message naming the rule, such as ",
            { code: "minimum cpu usage per Container is 200m, but request is 100m" },
            " in the Kubernetes CPU walkthrough. ",
            { code: "maxLimitRequestRatio" },
            " caps the ratio of limit to request, so with ",
            { code: 'cpu: "10"' },
            " a 100m request allows a CPU limit of at most 1\u00a0CPU.",
          ],
        },
        {
          kind: "p",
          text: [
            "Three rules catch people out. A LimitRange is checked only at admission, so pods that exist when you add or edit one keep their values. If a namespace holds two or more LimitRanges, which default gets applied isn’t deterministic, so keep one per namespace. And a LimitRange doesn’t check its defaults against the container’s own values: a container that requests 700m CPU with no limit, in a namespace whose default CPU limit is 500m, fails with ",
            { code: "must be less than or equal to cpu limit" },
            ". Setting both the request and the limit avoids it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The minimum and maximum also hold for an ",
            { a: "in-place pod resize", href: "/learn/in-place-pod-resize" },
            ". The Kubernetes CPU walkthrough says a resize that would take a container’s CPU past them is rejected, and the pod keeps its previous values.",
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
            "Kubernetes also fills in the fields you leave out of a ",
            { code: "Container" },
            " item in the LimitRange itself, following an order written in the Kubernetes source code. A missing ",
            { code: "default" },
            " takes the ",
            { code: "max" },
            ". A missing ",
            { code: "defaultRequest" },
            " then takes the ",
            { code: "default" },
            ", or the ",
            { code: "min" },
            " when there’s neither a default nor a max to copy. To see what resulted, read the object back:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get limitrange --output=yaml --namespace=<namespace>",
        },
        {
          kind: "p",
          text: [
            "That chain decides what a container reserves when it sets neither a request nor a limit. A LimitRange that sets a ",
            { code: "max" },
            " of 800m CPU and a ",
            { code: "min" },
            " of 200m but no defaults, as in the Kubernetes CPU walkthrough, comes back with ",
            { code: "default" },
            " and ",
            { code: "defaultRequest" },
            " both at 800m. Every container that sets neither a CPU request nor a CPU limit then asks for 800m, and the walkthrough warns that such a pod may not fit on a node with only 1\u00a0CPU. Set ",
            { code: "defaultRequest" },
            " on purpose, close to what a typical container in the namespace uses, so it doesn’t inherit the ceiling.",
          ],
        },
      ],
    },
    {
      id: "what-a-kubernetes-resource-quota-caps",
      title: "What a Kubernetes resource quota caps",
      blocks: [
        {
          kind: "p",
          text: [
            "A ResourceQuota is enforced in a namespace as soon as one exists there, and its ",
            { code: "hard" },
            " map sets the caps. For compute, ",
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
            " forms. Storage keys cap the total that PVCs request, overall or per StorageClass, and object counts cap kinds such as ",
            { code: "pods" },
            ", ",
            { code: "services.loadbalancers" },
            " or ",
            { code: "count/deployments.apps" },
            ".",
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
            "A quota counts what pod specs ask for, and it’s written in absolute units. Adding nodes doesn’t raise any namespace’s share, and a quota puts no restriction on which nodes a namespace’s pods land on. So a quota doesn’t ",
            { a: "make a cluster smaller", href: "/learn/reduce-kubernetes-cost" },
            " by itself: it stops one namespace from asking for more than its share.",
          ],
        },
        {
          kind: "p",
          text: [
            "Scopes narrow what a quota counts. With a scope such as ",
            { code: "BestEffort" },
            ", ",
            { code: "NotBestEffort" },
            " or ",
            { code: "PriorityClass" },
            ", the quota counts only the pods that match. The ",
            { code: "PriorityClass" },
            " scope, stable since Kubernetes 1.17, lets you give high-priority pods a budget of their own.",
          ],
        },
        {
          kind: "p",
          text: "Reducing a quota below what’s already in use evicts nothing. The running pods stay, and new pods that would push the total past the cap are refused. Microsoft’s managed namespaces documentation for AKS describes the same effect: existing deployments aren’t affected, but scaling is denied.",
        },
      ],
    },
    {
      id: "how-limitrange-defaults-count-against-the-quota",
      title: "How LimitRange defaults count against the quota",
      blocks: [
        {
          kind: "p",
          text: [
            "Admission runs in two phases: mutating controllers first, then validating ones. The LimitRange admission controller fills in its defaults in the first phase, and the ResourceQuota controller checks the pod in the second, so the pod the quota adds up already carries them. A container you wrote with no CPU request or limit is charged against ",
            { code: "requests.cpu" },
            " at whatever ",
            { code: "defaultRequest" },
            " says. One that sets only a limit is charged at that limit, because its request is copied from it.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "Take the two examples above together. Each pod with one container that sets no CPU request or limit is admitted at 100m, so 40 of them fill the ",
            { code: "requests.cpu" },
            " cap of 4. Remove the ",
            { code: "defaultRequest" },
            " block from the LimitRange and Kubernetes copies ",
            { code: "default" },
            " into it, so each container requests 500m and 8\u00a0pods fill the same quota. Keep only the ",
            { code: "max" },
            " block and every container asks for the full 2\u00a0CPUs, so 2\u00a0pods fill it. The containers’ real use is the same in all three cases.",
          ],
        },
        { kind: "diagram", figure: figure2 },
        {
          kind: "p",
          text: "Rolling updates need room too. By default a Deployment’s rolling update can run up to 25% more pods than its replica count, rounded up to a whole pod (the max surge). Each surge pod is counted against the quota like any other. A namespace whose quota is full can keep its pods running but can’t create the extras, so leave room for at least the surge of the largest Deployment.",
        },
      ],
    },
    {
      id: "when-a-kubernetes-resource-quota-is-exceeded",
      title: "When a Kubernetes resource quota is exceeded",
      blocks: [
        {
          kind: "p",
          text: [
            "Where the refusal shows up depends on what creates the pod. A pod you create directly fails at once, with 403 Forbidden and an ",
            { code: "exceeded quota" },
            " message that gives the numbers. A Deployment is different. It’s created successfully, and its ReplicaSet then fails to create some or all of its pods, so ",
            { code: "kubectl apply" },
            " reports nothing wrong. ",
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
          text: "The message names the quota, the resource, the amount requested, the amount in use and the cap. To see every cap in the namespace beside its current use:",
        },
        { kind: "code", lang: "bash", code: "kubectl describe quota --namespace=<namespace>" },
        {
          kind: "p",
          text: [
            "The Kubernetes Deployments page lists three ways out: scale the Deployment down, scale down other controllers in the namespace, or raise the quota. When the cap that’s full is on requests, there’s a fourth. Compare each workload’s requests with what its containers really use, and reduce the ones that sit far above it. That frees quota without taking a replica away, and ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " walks through it.",
          ],
        },
        {
          kind: "p",
          text: [
            "A LimitRange refusal reads differently. It names a per-container rule, such as ",
            { code: "maximum cpu usage per Container is 800m, but limit is 1500m" },
            ", and the fix is in the pod spec or the LimitRange, not the quota.",
          ],
        },
      ],
    },
    {
      id: "setting-an-aks-namespace-resource-quota",
      title: "Setting an AKS namespace resource quota",
      blocks: [
        {
          kind: "p",
          text: [
            "On Azure Kubernetes Service (AKS) you can apply both objects with ",
            { code: "kubectl" },
            ", as on any cluster, or let AKS manage the namespace. A managed namespace is managed through Azure Resource Manager and can be created with a quota on CPU and memory requests and limits, plus network policies and, if you want them, labels and annotations:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks namespace add \\\n  --name <namespace> \\\n  --cluster-name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --cpu-request 250m \\\n  --cpu-limit 500m \\\n  --memory-request 512Mi \\\n  --memory-limit 2Gi",
        },
        {
          kind: "p",
          text: "CPU is given in milliCPU and memory in power-of-two units such as Mi and Gi. The built-in Azure Kubernetes Service RBAC Admin role has no write access to the resource quota. A namespace admin with that role can’t raise the cap. Before you convert an existing namespace, compare its pods’ current requests with the values you plan: if they already ask for more, new pods and scale-ups are refused. And because this quota tracks CPU and memory, a pod that sets no requests or limits can be refused unless a LimitRange in the namespace supplies defaults.",
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
      id: "how-coral-rebalances-requests-within-these-caps",
      title: "How Coral rebalances requests within these caps",
      blocks: [
        {
          kind: "p",
          text: [
            "Coral is Zoorik’s ",
            { a: "Kubernetes optimization for AKS and EKS", href: "/coral" },
            ". It rebalances each container’s CPU and memory requests from observed use, inside the bounds those two objects set.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Your rules hold." },
              " Every change respects your minimums, LimitRanges and quotas, and routine changes under 10% are skipped (",
              {
                a: "how Coral decides a change is safe",
                href: "/coral/faq#how-does-coral-decide-a-change",
              },
              ").",
            ],
            [
              { b: "Your manifest stays as written." },
              " Coral never changes it. It sizes pods as they start, and applies a new size by resizing running pods in place on 1.33+ nodes, or else by restarting them one at a time.",
            ],
            [
              { b: "Quota limits stay." },
              " Where a ResourceQuota caps ",
              { code: "limits.cpu" },
              " or ",
              { code: "limits.memory" },
              ", Coral keeps the limits as they are.",
            ],
            [
              { b: "Drains check quota room." },
              " When Coral drains a node, its warm handover starts one extra copy of an eligible Deployment or Argo Rollout pod and waits for it to be Ready before the old pod goes. With no quota room for that copy, Coral falls back to eviction within the PodDisruptionBudget, and a single-replica app restarts briefly.",
            ],
            [
              { b: "It reads the quotas." },
              " The agent’s inventory, sent every 5\u00a0minutes, covers nodes, namespaces, workloads with their requests and limits, autoscalers, PodDisruptionBudgets and quotas.",
            ],
            [
              { b: "One kind of event text leaves." },
              " No env var values, commands, image names or request payloads are sent. The only event text sent is the message when a pod can’t be created because of a quota, a limit range or an admission policy (",
              { a: "what never leaves", href: "/coral/guide#what-never-leaves" },
              ").",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Because a quota adds up requests, smaller requests leave more of ",
            { code: "requests.cpu" },
            " and ",
            { code: "requests.memory" },
            " free. We run Coral on our own AKS development cluster, and by 12 October 2026 it had rebalanced the requests of 14 apps there. The CPU the cluster’s apps reserve went from 0.78 to 0.43\u00a0cores, 45% less, and memory from 6.4 to 5.4\u00a0GiB, 16% less. ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            " has the full run.",
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
      href: "/coral/faq#how-does-coral-decide-a-change",
    },
    {
      title: "What never leaves",
      where: "Coral product guide",
      href: "/coral/guide#what-never-leaves",
    },
  ],
};
