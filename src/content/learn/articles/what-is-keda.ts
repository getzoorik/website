import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/what-is-keda/1";
import { figure as figure2 } from "@/features/learn/figures/what-is-keda/2";

export const article: Article = {
  slug: "what-is-keda",
  title: "What is KEDA? Kubernetes event-driven autoscaling",
  meta: "KEDA (Kubernetes Event-driven Autoscaling) scales pods on queue length and other events, down to zero. How it works, its scalers, and setup on AKS and EKS.",
  h1: "What is KEDA in Kubernetes?",
  deck: "KEDA decides how many pods run, never how much CPU or memory each one gets.",
  card: "KEDA scales pods from queue length and other events, down to zero. How it works on AKS and EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sushant",
  cover: "/learn-covers/zoorik-learn-what-is-keda-1200x630.webp",
  coverAlt: "With work waiting, KEDA runs pods, and with the queue empty it scales to zero pods",
  short:
    "KEDA (Kubernetes Event-driven Autoscaling) is a Kubernetes autoscaler that scales a workload on events, such as messages waiting in a queue, not just CPU. It creates and drives a Horizontal Pod Autoscaler (HPA) for the workload, and can scale it to zero while nothing waits. AKS offers it as a managed add-on, and on Amazon EKS you install its Helm chart.",
  sections: [
    {
      id: "what-is-keda-in-kubernetes",
      title: "What KEDA is for",
      blocks: [
        {
          kind: "p",
          text: "A CPU target misses load that waits outside the pod. Picture an orders worker on Azure Kubernetes Service (AKS) that reads an Azure Service Bus queue. Its backlog can grow while its CPU stays low, so a CPU-based HPA adds no pods. Overnight, with the queue empty, its pods keep running.",
        },
        {
          kind: "p",
          text: "KEDA reads the backlog itself and scales on it, down to zero pods while no orders wait. It suits:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Queue and stream consumers" },
              " on Apache Kafka, RabbitMQ, AWS SQS, Azure Service Bus or Azure Event Hubs.",
            ],
            [{ b: "Batch work" }, " that runs to completion, as Kubernetes Jobs."],
            [
              { b: "Costly workloads that sit idle" },
              " for long stretches, such as GPU inference. The Amazon Elastic Kubernetes Service (EKS) user guide gives scale to zero as a way to reduce GPU cost.",
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
      title: "How KEDA works",
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
              ", watches your ScaledObjects and ",
              {
                a: "creates and manages an HPA",
                href: "/learn/keda-vs-hpa-vs-vpa#keda-vs-hpa-keda-creates-an-hpa",
              },
              " for each one.",
            ],
            [
              { b: "The metrics server," },
              " ",
              { code: "keda-operator-metrics-apiserver" },
              ", serves event-source values to the HPA as external metrics. A cluster allows only one external metrics server, so KEDA must be the only one.",
            ],
            [
              { b: "The admission webhooks," },
              " ",
              { code: "keda-admission-webhooks" },
              ", check KEDA resources as you apply them. They refuse a ScaledObject for a workload that another HPA already scales.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Scaling runs in two phases, which KEDA’s docs call activation and scaling:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Activation, from 0 to 1 replica," },
              " belongs to the operator. It checks each trigger every 30\u00a0seconds by default and wakes the workload when one turns active.",
            ],
            [
              { b: "Scaling, from 1 to N replicas," },
              " belongs to the HPA. Its controller decides every 15\u00a0seconds by default, from the value KEDA’s metrics server returns.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "KEDA owns the HPA it creates and names it ",
            { code: "keda-hpa-<scaled-object-name>" },
            " unless you set another name. Don’t create or edit it yourself. Don’t point a second HPA at the same workload either: Microsoft says the two compete and scale oddly.",
          ],
        },
        {
          kind: "p",
          text: [
            "To hand an existing HPA to KEDA, annotate the ScaledObject with ",
            { code: 'scaledobject.keda.sh/transfer-hpa-ownership: "true"' },
            ". Then set ",
            { code: "advanced.horizontalPodAutoscalerConfig.name" },
            " to that HPA’s name.",
          ],
        },
      ],
    },
    {
      id: "a-keda-scaledobject-names-the-workload-its",
      title: "The ScaledObject",
      blocks: [
        {
          kind: "p",
          text: [
            "A ScaledObject links one workload to the event sources that scale it. The target can be a Deployment, a StatefulSet, or any custom resource with a ",
            { code: "/scale" },
            " subresource. For the orders worker, KEDA signs in to Service Bus with Microsoft Entra Workload ID through a TriggerAuthentication:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: keda.sh/v1alpha1\nkind: TriggerAuthentication\nmetadata:\n  name: servicebus-auth\n  namespace: <namespace>\nspec:\n  podIdentity:\n    provider: azure-workload\n---\napiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: orders-worker\n  namespace: <namespace>\nspec:\n  scaleTargetRef:\n    name: orders-worker          # a Deployment in the same namespace\n  pollingInterval: 30            # the default, in seconds\n  cooldownPeriod: 300            # seconds, the default\n  minReplicaCount: 0             # the default\n  maxReplicaCount: 20            # the default is 100\n  triggers:\n  - type: azure-servicebus\n    metadata:\n      queueName: orders\n      namespace: <service-bus-namespace>\n      messageCount: "5"          # the default\n    authenticationRef:\n      name: servicebus-auth',
        },
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
              " bound the replica count. KEDA passes the maximum to its HPA.",
            ],
            [{ code: "messageCount" }, " is the scaler’s target, in active messages."],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Overnight the queue is empty, so the worker sits at its ",
            { code: "minReplicaCount" },
            " of 0. When 20 messages arrive, KEDA’s next check, within 30\u00a0seconds, finds the trigger active and wakes the worker.",
          ],
        },
        {
          kind: "p",
          text: [
            "A trigger’s default metric type is ",
            { code: "AverageValue" },
            ", so the HPA divides the backlog by the target, whatever the current count. That gives 20 ÷ 5 = 4\u00a0replicas. From 20 × 5 = 100 waiting messages up, the worker stays at its cap of 20\u00a0replicas.",
          ],
        },
        {
          kind: "p",
          text: "Once the queue is empty, the HPA removes replicas. After 300\u00a0seconds with no active trigger, KEDA takes the worker to 0.",
        },
        {
          kind: "p",
          text: [
            "With several triggers, KEDA scales to whichever demands the most replicas, unless a ",
            { code: "scalingModifiers" },
            " formula combines them. Deleting the ScaledObject keeps the current replica count, unless you set ",
            { code: "advanced.restoreToOriginalReplicaCount: true" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "When the HPA scales in, you can’t control which replica stops, so a long task can end partway through. KEDA’s docs give two fixes. Delay shutdown with a lifecycle hook, up to ",
            { code: "terminationGracePeriodSeconds" },
            ", or run the work as Kubernetes Jobs, which a ScaledJob scales from events.",
          ],
        },
        { kind: "h3", id: "keda-scalers", title: "KEDA scalers" },
        {
          kind: "p",
          text: "A scaler is KEDA’s connector to one event source: it fetches the metric that decides when and how far to scale. The KEDA 2.21 docs list 80 scalers, two of them experimental. They include:",
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
          text: "If none fits, you can bring your own external scaler. CPU and Memory read pod use from the Kubernetes Metrics Server, not an outside event source. To scale on HTTP requests, KEDA has a separate HTTP add-on, which Microsoft lists as a preview.",
        },
        {
          kind: "h3",
          id: "authentication-with-triggerauthentication",
          title: "TriggerAuthentication",
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
            "With ",
            { code: "provider: azure-workload" },
            ", the keda-operator pods sign in to Azure, not your app. On AKS, enable Workload ID before the KEDA add-on. If KEDA came first, run ",
            { code: "kubectl rollout restart deployment keda-operator -n kube-system" },
            " so its pods pick up the identity settings.",
          ],
        },
        {
          kind: "p",
          text: "A Service Bus connection string works too, but its shared access policy must be of type Manage. KEDA needs that type to read Service Bus metrics.",
        },
      ],
    },
    {
      id: "keda-scale-to-zero-activation-wakes-a",
      title: "Scale to zero",
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
          text: "When the two settings disagree, activation wins. KEDA’s docs give a target of 10, an activation value of 50 and 40 waiting messages. The workload stays at zero, though the HPA would want 40 ÷ 10 = 4\u00a0replicas.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "The EKS user guide uses an activation threshold to keep a few requests from waking a GPU.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "If ",
            { code: "minReplicaCount" },
            " is 1 or more, the scaler always counts as active and the activation value is ignored. Set ",
            { code: "idleReplicaCount" },
            " to 0, its only supported value, and KEDA scales an idle workload to 0 and an active one straight to ",
            { code: "minReplicaCount" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "cooldownPeriod" },
            " sets how long KEDA waits after the last active trigger before it scales to zero. It applies only to that last step.",
          ],
        },
        {
          kind: "h3",
          id: "two-limits-of-keda-scale-to-zero",
          title: "Scale-to-zero limits",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "CPU or memory triggers alone can’t reach zero," },
              " because those metrics exist only on running pods. Add an event trigger if you need zero.",
            ],
            [
              { b: "The first event after zero waits for a pod to start," },
              " and for a node too if your node autoscaler removed it. In the EKS walkthrough, ",
              { a: "Karpenter", href: "/learn/what-is-karpenter" },
              " adds a GPU node when none is available, and the replica is Ready only once the model loads.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "In Kubernetes 1.37, a plain HPA can also scale to and from zero, on object or external metrics. Its ",
            { code: "HPAScaleToZero" },
            " feature gate is beta and on by default. Something still has to serve those external metrics, which is the role of KEDA’s metrics server.",
          ],
        },
      ],
    },
    {
      id: "keda-on-aks-and-eks-a-managed",
      title: "KEDA on AKS and EKS",
      blocks: [
        { kind: "h3", id: "what-is-keda-in-azure", title: "The AKS add-on" },
        {
          kind: "p",
          text: [
            "AKS Automatic clusters come with KEDA preconfigured. On AKS Standard, turn on the managed KEDA add-on, which installs into ",
            { code: "kube-system" },
            ". Your cluster’s Kubernetes version decides which KEDA version it runs.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              "Enable the add-on on an existing cluster. For a new cluster, add ",
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
        { kind: "ol", start: 2, items: ["Check that the add-on is enabled:"] },
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
        { kind: "h3", id: "keda-on-eks", title: "Helm on EKS" },
        { kind: "p", text: "The EKS user guide installs KEDA from its Helm chart:" },
        {
          kind: "ol",
          items: [
            ["Add the ", { code: "kedacore" }, " chart repository and update your repositories:"],
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
          items: ["Check that the three KEDA pods are running:"],
        },
        { kind: "code", lang: "bash", code: "kubectl get pods -n keda" },
        {
          kind: "p",
          text: "For CPU or memory triggers, also install the Kubernetes Metrics Server, an add-on the Kubernetes docs say you launch separately.",
        },
      ],
    },
    {
      id: "keda-changes-only-the-pod-count-and",
      title: "KEDA and pod requests",
      blocks: [
        {
          kind: "p",
          text: "A ScaledObject has no field for the pod template’s CPU and memory requests, so each pod keeps the request you gave it. KEDA doesn’t add nodes either.",
        },
        {
          kind: "p",
          text: [
            "Requests still shape its scaling. A ",
            { code: "cpu" },
            " or ",
            { code: "memory" },
            " trigger with ",
            { code: "metricType: Utilization" },
            " measures use as a percentage of the pods’ requests. A request set far above real use makes a busy pod look idle. With no request at all, utilization isn’t defined, and the HPA takes no action on that metric.",
          ],
        },
        {
          kind: "p",
          text: "Every replica KEDA adds asks for its full request. When the new pods don’t fit, a node autoscaler adds nodes for them, as Karpenter does in the EKS walkthrough.",
        },
        {
          kind: "p",
          text: [
            { a: "KEDA vs Karpenter", href: "/learn/keda-vs-karpenter" },
            " follows that path from backlog to nodes. ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers setting requests from measured use, and the ",
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
            { a: "Coral", href: "/coral" },
            " works on the layer KEDA leaves alone, on AKS and EKS. It rebalances each pod’s CPU and memory requests and removes the nodes you don’t need, without any downtime.",
          ],
        },
        {
          kind: "p",
          text: [
            "With a ",
            { code: "cpu" },
            " trigger, Coral picks the CPU request by replaying past load. The replay uses the trigger’s utilization target, the ScaledObject’s replica bounds and the HPA’s scaling behavior. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. Event triggers and paused ScaledObjects aren’t replayed.",
          ],
        },
        {
          kind: "p",
          text: "Coral never takes over or converts the HPA that KEDA creates. It changes the ScaledObject only in a rebalance, to move a KEDA-scaled Deployment or Argo Rollout:",
        },
        {
          kind: "ol",
          items: [
            "Coral raises the ScaledObject’s minimum.",
            "It waits until the new pod is Ready and serving on another node.",
            "It evicts the old pod within its PodDisruptionBudget.",
            "It puts the minimum back.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral works with KEDA", href: "/coral-works-with-keda" },
            " sets out who does what.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate 40–50% off AKS and EKS cost, a range rather than a promise. The free assessment works out your own figure.",
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
    { publisher: "KEDA", title: "“CPU”", url: "https://keda.sh/docs/2.21/scalers/cpu/" },
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
      title: "KEDA vs HPA vs VPA",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    {
      title: "KEDA vs Karpenter",
      where: "Learn",
      href: "/learn/keda-vs-karpenter",
    },
    {
      title: "Kubernetes autoscaling",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
    {
      title: "Does Coral change HPA minReplicas or maxReplicas?",
      where: "Coral FAQ",
      href: "/coral-faq#does-optimization-ever-modify-hpa-minreplicas",
    },
  ],
  relatedTitle: "More on KEDA",
};
