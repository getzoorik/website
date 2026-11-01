import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/what-is-keda/1";
import { figure as figure2 } from "@/features/learn/figures/what-is-keda/2";

export const article: Article = {
  slug: "what-is-keda",
  title: "What is KEDA in Kubernetes? Event-driven scaling",
  meta: "What is KEDA in Kubernetes? It scales a workload from events such as queue length, down to zero, by driving an HPA. ScaledObjects, scalers, AKS and EKS.",
  h1: "What is KEDA in Kubernetes? Event-driven scaling explained",
  deck: "KEDA scales a workload from events such as queue length, down to zero, through an HPA it manages.",
  card: "KEDA scales pods from queue length and other events, down to zero. How it works on AKS and EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sushant",
  cover: "/learn-covers/zoorik-learn-what-is-keda-1200x630.webp",
  coverAlt:
    "What is KEDA? With work waiting, KEDA runs pods, and with the queue empty it scales to zero pods",
  short:
    "KEDA (Kubernetes Event-driven Autoscaling) is a Kubernetes autoscaler that scales a workload from events, such as messages in a queue, not CPU alone. It drives a Horizontal Pod Autoscaler (HPA) for the workload, can scale it to zero, and decides how many pods run, not their size.",
  sections: [
    {
      id: "what-is-keda-in-kubernetes",
      title: "What is KEDA in Kubernetes used for?",
      blocks: [
        {
          kind: "p",
          text: "Picture an orders worker on Azure Kubernetes Service (AKS), reading each order from an Azure Service Bus queue. Overnight the queue is empty, yet its pods keep running. In the morning the worker can show little CPU use while its backlog grows, so a CPU target sees no reason to add pods.",
        },
        {
          kind: "p",
          text: "KEDA is for workloads whose load shows up as work waiting outside the pod. It reads the backlog itself and scales on that, down to zero pods while no orders wait. It works alongside the HPA instead of replacing it.",
        },
        { kind: "p", text: "Four kinds of work suit it:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Queue and stream consumers" },
              " on Apache Kafka, RabbitMQ, AWS SQS, Azure Service Bus or Azure Event Hubs.",
            ],
            [{ b: "Batch work" }, " that runs to completion, as Kubernetes Jobs."],
            [
              { b: "Expensive workloads that sit idle" },
              " for long stretches, such as GPU inference. The Amazon Elastic Kubernetes Service (EKS) user guide names scale to zero as a way to reduce GPU cost.",
            ],
            [
              { b: "Anything a Prometheus query can measure," },
              " such as requests waiting in an inference server’s queue.",
            ],
          ],
        },
      ],
    },
    {
      id: "keda-wakes-a-workload-from-zero-and",
      title: "KEDA wakes a workload from zero, and the HPA it creates scales it",
      blocks: [
        {
          kind: "p",
          text: "KEDA is a Cloud Native Computing Foundation (CNCF) graduated project. It runs three components in the cluster:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The operator," },
              " ",
              { code: "keda-operator" },
              ", watches your ScaledObjects and creates and manages an HPA for each one.",
            ],
            [
              { b: "The admission webhooks," },
              " ",
              { code: "keda-admission-webhooks" },
              ", check each KEDA resource when you apply it. They refuse a ScaledObject for a workload that another HPA already scales.",
            ],
            [
              { b: "The metrics server," },
              " ",
              { code: "keda-operator-metrics-apiserver" },
              ", serves the event-source values to the HPA as external metrics. Microsoft’s AKS docs say a cluster allows only one external metrics server, so KEDA must be the only one installed.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The job splits into two tracks, which KEDA’s docs call activation and scaling. Activation, from zero to one replica, is the operator’s alone: it checks each trigger every 30\u00a0seconds by default. It wakes the workload when one turns active.",
        },
        {
          kind: "p",
          text: "Scaling, from one to N replicas, is the HPA’s. It decides on its controller’s 15-second default cycle, from the value KEDA’s metrics server returns.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "The HPA belongs to KEDA, which names it ",
            { code: "keda-hpa-<scaled-object-name>" },
            " unless you set another name. The EKS user guide says not to create or edit it yourself.",
          ],
        },
        {
          kind: "p",
          text: "Don’t point a second HPA of your own at the same workload either. Microsoft says the two compete and produce odd scaling behavior.",
        },
        {
          kind: "p",
          text: [
            "To hand an existing HPA over to KEDA, annotate the ScaledObject with ",
            { code: 'scaledobject.keda.sh/transfer-hpa-ownership: "true"' },
            ". Then set ",
            { code: "advanced.horizontalPodAutoscalerConfig.name" },
            " to that HPA’s name.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "KEDA vs HPA vs VPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            " compares KEDA with a plain HPA and the Vertical Pod Autoscaler.",
          ],
        },
      ],
    },
    {
      id: "a-keda-scaledobject-names-the-workload-its",
      title: "A KEDA ScaledObject names the workload, its triggers and its limits",
      blocks: [
        {
          kind: "p",
          text: [
            "A KEDA ScaledObject links one workload to the event sources that should scale it. Its target can be a Deployment, a StatefulSet, or any custom resource that defines the ",
            { code: "/scale" },
            " subresource. For the orders worker, which authenticates with Microsoft Entra Workload ID, it looks like this:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: keda.sh/v1alpha1\nkind: TriggerAuthentication\nmetadata:\n  name: servicebus-auth\n  namespace: <namespace>\nspec:\n  podIdentity:\n    provider: azure-workload\n---\napiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: orders-worker\n  namespace: <namespace>\nspec:\n  scaleTargetRef:\n    name: orders-worker          # a Deployment in the same namespace\n  pollingInterval: 30            # the default, in seconds\n  cooldownPeriod: 300            # seconds, the default\n  minReplicaCount: 0             # the default\n  maxReplicaCount: 20            # the default is 100\n  triggers:\n  - type: azure-servicebus\n    metadata:\n      queueName: orders\n      namespace: <service-bus-namespace>\n      messageCount: "5"          # the default\n    authenticationRef:\n      name: servicebus-auth',
        },
        { kind: "p", text: "What each field does:" },
        {
          kind: "ul",
          items: [
            [
              { code: "scaleTargetRef.name" },
              " names the workload, which must be in the ScaledObject’s namespace.",
            ],
            [
              { code: "minReplicaCount" },
              " and ",
              { code: "maxReplicaCount" },
              " bound the count, and KEDA passes the maximum to its HPA.",
            ],
            [{ code: "messageCount" }, " is the scaler’s target, in active messages."],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Overnight the orders queue is empty, so the trigger isn’t active and the worker sits at its ",
            { code: "minReplicaCount" },
            " of 0. When 20 messages arrive, KEDA’s next check, at most 30\u00a0seconds later, finds the trigger active and wakes the worker.",
          ],
        },
        {
          kind: "p",
          text: [
            "A trigger’s default metric type is ",
            { code: "AverageValue" },
            ", so the HPA divides the backlog by the target, whatever the current count. That gives 20 ÷ 5 = 4\u00a0replicas, the KEDA spec’s example. From 20 × 5 = 100 waiting messages up, the worker stays at its cap of 20\u00a0replicas.",
          ],
        },
        {
          kind: "p",
          text: "Once the queue is empty, the HPA removes replicas. KEDA takes the worker to 0 after 300\u00a0seconds with no active trigger.",
        },
        {
          kind: "p",
          text: [
            "Give one ScaledObject several triggers and KEDA scales to whichever demands the most replicas, unless a ",
            { code: "scalingModifiers" },
            " formula combines them. Deleting the ScaledObject keeps the workload’s replica count, unless you set ",
            { code: "advanced.restoreToOriginalReplicaCount: true" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "When the HPA scales a Deployment in, it can’t choose which replica stops, and may end one partway through a message. So the KEDA docs give Jobs as one way to run long tasks. With a ScaledJob instead, KEDA scales Kubernetes Jobs from the events.",
        },
        { kind: "h3", id: "keda-scalers", title: "KEDA scalers" },
        {
          kind: "p",
          text: "A scaler is KEDA’s connector to one event source: it fetches the metric that decides when and how far to scale. The scaler list in the KEDA 2.21 docs has 80 entries, two of them marked experimental. They include:",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Message brokers" }, " such as Apache Kafka, RabbitMQ Queue and NATS JetStream."],
            [
              { b: "Cloud services" },
              " such as AWS SQS Queue, AWS Kinesis Stream, Azure Service Bus, Azure Event Hubs and Azure Storage Queue.",
            ],
            [{ b: "Data stores" }, " such as PostgreSQL, MySQL, MongoDB and Redis Lists."],
            [{ b: "Metrics systems" }, " such as Prometheus, AWS CloudWatch and Azure Monitor."],
            [{ b: "CPU, Memory and Cron." }],
          ],
        },
        {
          kind: "p",
          text: "If none fits, you can write a custom scaler. CPU and Memory differ from the rest: they take usage from the Kubernetes Metrics Server, not an outside event source. To scale on HTTP requests, KEDA has a separate HTTP add-on, which Microsoft lists as a preview.",
        },
        {
          kind: "h3",
          id: "authentication-with-triggerauthentication",
          title: "Authentication with TriggerAuthentication",
        },
        {
          kind: "p",
          text: [
            "KEDA queries the event source itself, so it needs credentials. A trigger’s ",
            { code: "authenticationRef" },
            " points to a TriggerAuthentication or a ClusterTriggerAuthentication. Either can supply a connection string or a cloud identity, such as Microsoft Entra Workload ID.",
          ],
        },
        {
          kind: "p",
          text: [
            "On AKS, enable Workload ID before you enable the KEDA add-on. If KEDA came first, restart the operator with ",
            { code: "kubectl rollout restart deployment keda-operator -n kube-system" },
            " so its pods pick up the identity settings.",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "provider: azure-workload" },
            ", the keda-operator pods sign in to Azure, not your app. If you use a Service Bus connection string instead, its shared access policy must be of type Manage. KEDA needs that type to read Service Bus metrics.",
          ],
        },
      ],
    },
    {
      id: "keda-scale-to-zero-activation-wakes-a",
      title: "KEDA scale to zero: activation wakes a workload, cooldown takes it back",
      blocks: [
        {
          kind: "p",
          text: [
            "A scaler that supports activation has a setting named after its target with an ",
            { code: "activation" },
            " prefix. So ",
            { code: "messageCount" },
            " pairs with ",
            { code: "activationMessageCount" },
            ", whose default is 0. Activation needs a value greater than that setting, so one waiting message wakes the workload.",
          ],
        },
        {
          kind: "p",
          text: "When the two settings disagree, activation wins. KEDA’s docs give the case of a threshold of 10, an activation value of 50 and 40 waiting messages. Here the workload stays at zero, even though the HPA would want 40 ÷ 10 = 4\u00a0replicas.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "The EKS user guide gives activation thresholds as a way to keep a few requests from waking a GPU.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "If ",
            { code: "minReplicaCount" },
            " is 1 or more, the scaler always counts as active and the activation value is ignored. The exception is ",
            { code: "idleReplicaCount" },
            ", whose only supported value is 0.",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "idleReplicaCount" },
            " set, KEDA scales an idle workload to 0 and an active one straight to ",
            { code: "minReplicaCount" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "On the way back down, ",
            { code: "cooldownPeriod" },
            " sets how long KEDA waits after the last active trigger before it scales to zero. It applies only to that last step.",
          ],
        },
        {
          kind: "h3",
          id: "two-limits-of-keda-scale-to-zero",
          title: "Two limits of KEDA scale to zero",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "CPU or memory triggers alone can’t take a workload to zero," },
              " because those metrics can only be measured on running pods. Add an event trigger if you need zero.",
            ],
            [
              { b: "The first event after zero waits for a pod to start," },
              " and for a node too if your node autoscaler removed it. In the EKS walkthrough, ",
              { a: "Karpenter", href: "/learn/what-is-karpenter" },
              " provisions a GPU node when none is available. The replica is Ready only once the model has loaded.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "In Kubernetes 1.37, a plain HPA can do part of this job. The ",
            { code: "HPAScaleToZero" },
            " feature gate is beta and on by default.",
          ],
        },
        {
          kind: "p",
          text: "With it, an HPA can scale to and from zero on object or external metrics. Something still has to serve those external metrics, which is the role KEDA’s metrics server plays.",
        },
      ],
    },
    {
      id: "keda-on-aks-and-eks-a-managed",
      title: "KEDA on AKS and EKS: a managed add-on or a Helm chart",
      blocks: [
        { kind: "h3", id: "what-is-keda-in-azure", title: "What is KEDA in Azure?" },
        {
          kind: "p",
          text: [
            "AKS Automatic clusters have KEDA preconfigured. On AKS Standard, you turn on the managed KEDA add-on, which installs into ",
            { code: "kube-system" },
            ". Your cluster’s Kubernetes version decides which KEDA version the add-on runs.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              "Enable the KEDA AKS add-on on an existing cluster. For a new cluster, add ",
              { code: "--enable-keda" },
              " to ",
              { code: "az aks create" },
              ".",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update --resource-group <resource-group> --name <cluster-name> --enable-keda",
        },
        { kind: "ol", start: 2, items: ["Check that the KEDA add-on is enabled:"] },
        {
          kind: "code",
          lang: "bash",
          code: 'az aks show --resource-group <resource-group> --name <cluster-name> --query "workloadAutoScalerProfile.keda.enabled"',
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Check the KEDA version: ",
              { code: "kubectl get crd/scaledobjects.keda.sh -o yaml" },
              " shows it in the ",
              { code: "app.kubernetes.io/version" },
              " label.",
            ],
          ],
        },
        { kind: "p", text: "Microsoft lists the add-on’s limits:" },
        {
          kind: "ul",
          items: [
            "You can’t change the CPU requests or limits, or other Helm values, of the KEDA operator and metrics server.",
            "The HTTP add-on and the Azure Cosmos DB external scaler aren’t installed with it, though you can deploy them separately.",
            "Multiple KEDA installations aren’t supported.",
          ],
        },
        { kind: "h3", id: "keda-on-eks", title: "KEDA on EKS" },
        { kind: "p", text: "The EKS user guide installs KEDA from its Helm chart:" },
        {
          kind: "ol",
          items: [
            ["Add the ", { code: "kedacore" }, " chart repository, then update your repositories:"],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "helm repo add kedacore https://kedacore.github.io/charts\nhelm repo update",
        },
        {
          kind: "ol",
          start: 2,
          items: [["Install KEDA into its own namespace, ", { code: "keda" }, ":"]],
        },
        {
          kind: "code",
          lang: "bash",
          code: "helm install keda kedacore/keda --namespace keda --create-namespace",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Check that its three components are running: ",
              { code: "keda-operator" },
              ", ",
              { code: "keda-admission-webhooks" },
              " and ",
              { code: "keda-operator-metrics-apiserver" },
              ".",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get pods -n keda" },
        {
          kind: "p",
          text: "For cpu or memory triggers, install the Kubernetes Metrics Server too, which the Kubernetes docs describe as an add-on you launch separately.",
        },
      ],
    },
    {
      id: "keda-changes-only-the-pod-count-and",
      title: "KEDA changes only the pod count, and pod requests still shape it",
      blocks: [
        {
          kind: "p",
          text: "A ScaledObject has no field for the CPU and memory requests in the pod template. So each pod keeps the request you gave it. KEDA doesn’t add nodes either.",
        },
        {
          kind: "p",
          text: [
            "A request set far above real use makes a busy pod look idle to a ",
            { code: "cpu" },
            " or ",
            { code: "memory" },
            " trigger with ",
            { code: "metricType: Utilization" },
            ". That trigger measures use as a percentage of the pods’ requests.",
          ],
        },
        {
          kind: "p",
          text: "With no request at all, the HPA docs say utilization isn’t defined, and the autoscaler takes no action on that metric.",
        },
        {
          kind: "p",
          text: "Every replica KEDA adds also asks for its full request. When the new pods don’t fit, a node autoscaler adds nodes for them, as Karpenter does in the EKS walkthrough.",
        },
        {
          kind: "p",
          text: [
            { a: "KEDA vs Karpenter", href: "/learn/keda-vs-karpenter" },
            " follows that path from backlog to nodes. ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers setting requests from measured use. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " covers requests first, then nodes.",
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
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS and works alongside KEDA. Its own work is the layer KEDA leaves alone. It rebalances CPU and memory requests, and drains spare nodes one at a time so your autoscaler can remove them.",
          ],
        },
        {
          kind: "p",
          text: [
            "Outside the warm handover below, Coral never changes the minimum or maximum of KEDA’s HPA. Nor does it convert that HPA into its own. ",
            { a: "Coral works with KEDA", href: "/coral-works-with-keda" },
            " sets out who does what.",
          ],
        },
        {
          kind: "p",
          text: [
            "For a ScaledObject with a ",
            { code: "cpu" },
            " trigger, Coral picks the CPU request by replaying past load through three settings:",
          ],
        },
        {
          kind: "ul",
          items: [
            "the trigger’s utilization target;",
            "the ScaledObject’s minimum and maximum replicas;",
            "the scaling behavior of the HPA that KEDA created.",
          ],
        },
        {
          kind: "p",
          text: "A smaller request wins only if its saving beats the cost of unserved load and extra scaling. Event triggers aren’t replayed, and neither is a paused ScaledObject.",
        },
        {
          kind: "p",
          text: "When a rebalance drains a node, a KEDA-scaled Deployment or Argo Rollout that qualifies gets a warm handover:",
        },
        {
          kind: "ol",
          items: [
            "Coral raises the autoscaler’s minimum.",
            "It waits until the new pod is Ready and serving on another node.",
            "It evicts the old pod within its PodDisruptionBudget.",
            "It scales back.",
          ],
        },
        {
          kind: "p",
          text: "Pods that don’t qualify are evicted, so a single-replica app gets a short restart.",
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
      publisher: "KEDA",
      title: "“Scaling Deployments, StatefulSets & Custom Resources”",
      url: "https://keda.sh/docs/2.21/concepts/scaling-deployments/",
    },
    {
      publisher: "KEDA",
      title: "“ScaledObject specification”",
      url: "https://keda.sh/docs/2.21/reference/scaledobject-spec/",
    },
    { publisher: "KEDA", title: "“Scalers”", url: "https://keda.sh/docs/2.21/scalers/" },
    {
      publisher: "KEDA",
      title: "“Azure Service Bus”",
      url: "https://keda.sh/docs/2.21/scalers/azure-service-bus/",
    },
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Kubernetes Event-Driven Autoscaling (KEDA) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/keda-about",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Install the Kubernetes Event-driven Autoscaling (KEDA) add-on using the Azure CLI”",
      url: "https://learn.microsoft.com/en-us/azure/aks/keda-deploy-add-on-cli",
    },
    {
      publisher: "Amazon EKS",
      title: "“Autoscale AI inference with HPA and KEDA”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-autoscaling-hpa-keda.html",
    },
  ],
  related: [
    {
      title: "KEDA vs HPA vs VPA: where event-driven scaling fits",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    {
      title: "KEDA vs Karpenter: pods, nodes and the requests in between",
      where: "Learn",
      href: "/learn/keda-vs-karpenter",
    },
    {
      title: "HPA vs VPA vs Cluster Autoscaler: what each one scales",
      where: "Learn",
      href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    },
    {
      title: "Does optimization ever modify HPA minReplicas or maxReplicas?",
      where: "Coral FAQ",
      href: "/coral-faq#does-optimization-ever-modify-hpa-minreplicas",
    },
  ],
};
