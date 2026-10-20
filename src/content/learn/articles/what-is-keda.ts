import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/what-is-keda/1";

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
  published: "2026-11-11",
  updated: "2026-11-11",
  author: "sushant",
  short:
    "KEDA (Kubernetes Event-driven Autoscaling) is a Cloud Native Computing Foundation (CNCF) graduated project that scales a Kubernetes workload from events, such as messages waiting in a queue, instead of from CPU alone. You describe the event source in a ScaledObject, and KEDA creates and drives a Horizontal Pod Autoscaler (HPA) for the workload. It can scale the workload to zero when nothing is waiting. KEDA decides how many pods run, not how big each one is.",
  sections: [
    {
      id: "what-is-keda-in-kubernetes-used-for",
      title: "What is KEDA in Kubernetes used for?",
      blocks: [
        {
          kind: "p",
          text: "KEDA is for workloads whose load shows up as work waiting outside the pod. A worker that reads from an Azure Service Bus queue or a Kafka topic can show little CPU use while its backlog grows, so a CPU target sees no reason to add pods. KEDA reads the backlog itself and scales on that.",
        },
        {
          kind: "p",
          text: "KEDA works alongside the HPA instead of replacing it. Four kinds of work suit it:",
        },
        {
          kind: "ul",
          items: [
            "Queue and stream consumers on Apache Kafka, RabbitMQ, AWS SQS, Azure Service Bus or Azure Event Hubs.",
            "Batch work that runs to completion, as Kubernetes Jobs.",
            "Expensive workloads that sit idle for long stretches, such as GPU inference, where the Amazon Elastic Kubernetes Service (EKS) user guide names scale to zero as a way to reduce GPU cost.",
            "Anything you can measure with a Prometheus query, such as requests waiting in an inference server’s queue.",
          ],
        },
      ],
    },
    {
      id: "how-keda-works",
      title: "How KEDA works",
      blocks: [
        { kind: "p", text: "KEDA runs three components in the cluster, each with one job:" },
        {
          kind: "ul",
          items: [
            [
              { code: "keda-operator" },
              " watches your ScaledObjects, creates and manages an HPA for each one, and scales a workload between zero and one replica itself.",
            ],
            [
              { code: "keda-operator-metrics-apiserver" },
              ", KEDA’s metrics server, serves the event-source values to the HPA as external metrics.",
            ],
            [
              { code: "keda-admission-webhooks" },
              " check each KEDA resource when you apply it, and refuse a ScaledObject for a workload that another HPA already scales.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Scaling then runs on two tracks. Between zero and one replica, the keda-operator acts alone: it checks each trigger every 30\u00a0seconds by default and wakes the workload when one turns active. Between one and N replicas the HPA decides, on its controller’s 15-second default cycle, from the value KEDA’s metrics server returns.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "Microsoft’s Azure Kubernetes Service (AKS) docs say a cluster allows only one external metrics server, so KEDA must be the only one installed. Because KEDA drives an HPA, don’t point a second HPA of your own at the same workload: Microsoft says the two compete and produce odd scaling behavior. To hand an existing HPA over to KEDA, annotate the ScaledObject with ",
            { code: 'scaledobject.keda.sh/transfer-hpa-ownership: "true"' },
            " and set ",
            { code: "advanced.horizontalPodAutoscalerConfig.name" },
            " to that HPA’s name. ",
            { a: "KEDA vs HPA vs VPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            " compares KEDA with a plain HPA and the Vertical Pod Autoscaler.",
          ],
        },
      ],
    },
    {
      id: "a-keda-scaledobject-field-by-field",
      title: "A KEDA ScaledObject, field by field",
      blocks: [
        {
          kind: "p",
          text: [
            "A KEDA ScaledObject links one workload to the event sources that should scale it. Its target can be a Deployment, a StatefulSet, or any custom resource that defines the ",
            { code: "/scale" },
            " subresource. For a queue worker on AKS that reads an Azure Service Bus queue and authenticates with Microsoft Entra Workload ID, it looks like this:",
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
              { code: "cooldownPeriod" },
              " is how long KEDA waits after the last active trigger before it scales back to zero, and it applies only to that last step.",
            ],
            [
              { code: "minReplicaCount" },
              " and ",
              { code: "maxReplicaCount" },
              " bound the count, and KEDA passes the maximum to its HPA.",
            ],
            [
              { code: "messageCount" },
              " is the Service Bus scaler’s target number of active messages.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A trigger’s default metric type is ",
            { code: "AverageValue" },
            ", so the HPA divides the backlog by the target. With a target of 5 messages and 20 in the queue, the KEDA spec’s example, the HPA asks for 20 ÷ 5 = 4\u00a0replicas whatever the current count. Give one ScaledObject several triggers and KEDA scales to whichever demands the most replicas, unless a ",
            { code: "scalingModifiers" },
            " formula combines them.",
          ],
        },
        {
          kind: "p",
          text: [
            "KEDA names the HPA it creates ",
            { code: "keda-hpa-<scaled-object-name>" },
            " unless you set another name, and the EKS user guide says not to create or edit that HPA yourself. Deleting the ScaledObject leaves the workload at the replica count it had at that moment, unless you set ",
            { code: "advanced.restoreToOriginalReplicaCount: true" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "For work that runs to completion, use a ScaledJob instead, and KEDA scales Kubernetes Jobs from the events. The KEDA docs give Jobs as one way to run long tasks, because when the HPA scales a Deployment in, it can’t choose which replica stops and may end one partway through a message.",
        },
        { kind: "h3", id: "keda-scalers", title: "KEDA scalers" },
        {
          kind: "p",
          text: "A scaler is KEDA’s connector to one event source. It fetches the metric that decides when and how far to scale. The scaler list in the KEDA 2.21 docs has 80 entries, two of them marked experimental. They include:",
        },
        {
          kind: "ul",
          items: [
            "Message brokers such as Apache Kafka, RabbitMQ Queue and NATS JetStream.",
            "Cloud services such as AWS SQS Queue, AWS Kinesis Stream, Azure Service Bus, Azure Event Hubs and Azure Storage Queue.",
            "Data stores such as PostgreSQL, MySQL, MongoDB and Redis Lists.",
            "Metrics systems such as Prometheus, AWS CloudWatch and Azure Monitor.",
            "CPU, Memory and Cron.",
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
            "KEDA queries the event source itself, so it needs credentials to read it. A trigger’s ",
            { code: "authenticationRef" },
            " points to a TriggerAuthentication or a ClusterTriggerAuthentication, which can supply a connection string or a cloud identity such as Microsoft Entra Workload ID.",
          ],
        },
        {
          kind: "p",
          text: [
            "On AKS, enable Workload ID before you enable the KEDA add-on. If KEDA came first, restart the operator with ",
            { code: "kubectl rollout restart deployment keda-operator -n kube-system" },
            " so its pods pick up the identity settings. With ",
            { code: "provider: azure-workload" },
            ", the keda-operator pods sign in to Azure, not your app. If you use a Service Bus connection string instead, its shared access policy must be of type Manage, which KEDA needs to read Service Bus metrics.",
          ],
        },
      ],
    },
    {
      id: "keda-scale-to-zero-activation-and-cooldown",
      title: "KEDA scale to zero: activation and cooldown",
      blocks: [
        {
          kind: "p",
          text: "KEDA’s docs call the two tracks above activation (0 to 1\u00a0replica, decided by the keda-operator) and scaling (1 to N, decided by the HPA from the scaler’s target).",
        },
        {
          kind: "p",
          text: [
            "A scaler that supports activation has a setting named after its target with an ",
            { code: "activation" },
            " prefix, so ",
            { code: "messageCount" },
            " pairs with ",
            { code: "activationMessageCount" },
            ". Its default is 0, and activation needs a value greater than the setting, so one waiting message wakes the workload. When the two settings disagree, activation wins. KEDA’s docs give the case of a threshold of 10, an activation value of 50 and 40 waiting messages: the workload stays at zero, even though the HPA would want 4\u00a0replicas. The EKS user guide gives activation thresholds as a way to keep a few requests from waking a GPU.",
          ],
        },
        {
          kind: "p",
          text: [
            "On the way back down, KEDA scales to zero once ",
            { code: "cooldownPeriod" },
            " has passed with no active trigger. If ",
            { code: "minReplicaCount" },
            " is 1 or more, the scaler always counts as active and the activation value is ignored. The exception is ",
            { code: "idleReplicaCount" },
            ", whose only supported value is 0. With it set, KEDA scales an idle workload to 0 and an active one straight to ",
            { code: "minReplicaCount" },
            ".",
          ],
        },
        { kind: "p", text: "Plan for two limits:" },
        {
          kind: "ul",
          items: [
            "CPU or memory triggers alone can’t take a workload to zero, because those metrics can only be measured on running pods. Add an event trigger if you need zero.",
            [
              "The first event after zero waits for a pod to start, and for a node too if your node autoscaler removed it. In the EKS walkthrough, ",
              { a: "Karpenter", href: "/learn/what-is-karpenter" },
              " provisions a GPU node when none is available, and the replica is Ready only once the model has loaded.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A plain HPA can now do part of this job. In Kubernetes 1.37 the ",
            { code: "HPAScaleToZero" },
            " feature gate is beta and on by default, so an HPA can scale to and from zero on object or external metrics. Something still has to serve those external metrics, which is the role KEDA’s metrics server plays.",
          ],
        },
      ],
    },
    {
      id: "keda-on-aks-and-eks",
      title: "KEDA on AKS and EKS",
      blocks: [
        { kind: "h3", id: "what-is-keda-in-azure", title: "What is KEDA in Azure?" },
        {
          kind: "p",
          text: [
            "On AKS, KEDA comes two ways: AKS Automatic clusters have it preconfigured, and on AKS Standard you turn on the managed KEDA add-on, which installs into ",
            { code: "kube-system" },
            ". To enable the KEDA AKS add-on on an existing cluster, then check that it’s on:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az aks update --resource-group <resource-group> --name <cluster-name> --enable-keda\naz aks show --resource-group <resource-group> --name <cluster-name> --query "workloadAutoScalerProfile.keda.enabled"',
        },
        {
          kind: "p",
          text: [
            "For a new cluster, add ",
            { code: "--enable-keda" },
            " to ",
            { code: "az aks create" },
            ". Your cluster’s Kubernetes version decides which KEDA version the add-on runs, and ",
            { code: "kubectl get crd/scaledobjects.keda.sh -o yaml" },
            " shows it in the ",
            { code: "app.kubernetes.io/version" },
            " label.",
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
        {
          kind: "p",
          text: "The EKS user guide installs KEDA from its Helm chart into its own namespace:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "helm repo add kedacore https://kedacore.github.io/charts\nhelm repo update\nhelm install keda kedacore/keda --namespace keda --create-namespace\nkubectl get pods -n keda",
        },
        {
          kind: "p",
          text: [
            "You should see the same three components running: ",
            { code: "keda-admission-webhooks" },
            ", ",
            { code: "keda-operator" },
            " and ",
            { code: "keda-operator-metrics-apiserver" },
            ". If you plan to use cpu or memory triggers, install the Kubernetes Metrics Server too. The Kubernetes docs describe it as an add-on you launch separately.",
          ],
        },
      ],
    },
    {
      id: "what-keda-doesnt-decide",
      title: "What KEDA doesn’t decide",
      blocks: [
        {
          kind: "p",
          text: "KEDA changes one number: how many replicas run. A ScaledObject has no field for the CPU and memory requests in the pod template, so each pod keeps the request you gave it. KEDA doesn’t add nodes either.",
        },
        {
          kind: "p",
          text: [
            "Requests still shape what KEDA does. A ",
            { code: "cpu" },
            " or ",
            { code: "memory" },
            " trigger with ",
            { code: "metricType: Utilization" },
            " measures use as a percentage of the pods’ requests. A request set far above real use makes a busy pod look idle. With no request at all, the HPA docs say utilization isn’t defined and the autoscaler takes no action on that metric.",
          ],
        },
        {
          kind: "p",
          text: [
            "Every replica KEDA adds also asks for its full request, and when the new pods don’t fit, a node autoscaler adds nodes for them, as Karpenter does in the EKS walkthrough. ",
            { a: "KEDA vs Karpenter", href: "/learn/keda-vs-karpenter" },
            " follows that path from backlog to nodes, and ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers setting requests from measured use.",
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
            " on AKS and EKS and works alongside KEDA. Its own work is the layer KEDA leaves alone: rebalancing CPU and memory requests, and draining spare nodes one at a time so your autoscaler can remove them. Outside the warm handover below, Coral never changes the minimum or maximum of the HPA that KEDA created, and never converts it into one of its own.",
          ],
        },
        {
          kind: "p",
          text: [
            "For a ScaledObject with a ",
            { code: "cpu" },
            " trigger, Coral picks the CPU request by replaying past load through the trigger’s utilization target, the ScaledObject’s minimum and maximum replicas, and the scaling behavior of the HPA that KEDA created. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. Event triggers aren’t replayed, and neither is a paused ScaledObject.",
          ],
        },
        {
          kind: "p",
          text: "When a rebalance drains a node, a KEDA-scaled Deployment or Argo Rollout that qualifies gets a warm handover. Coral raises the autoscaler’s minimum, waits until the new pod has been Ready and serving on another node for 5\u00a0minutes with no restarts, evicts the old pod within its PodDisruptionBudget, then scales back. Pods that don’t qualify are evicted, so a single-replica app gets a short restart.",
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
      href: "/coral/faq#does-optimization-ever-modify-hpa-minreplicas",
    },
  ],
};
