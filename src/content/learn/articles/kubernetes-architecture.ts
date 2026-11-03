import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-architecture/1";

export const article: Article = {
  slug: "kubernetes-architecture",
  title: "Kubernetes architecture: control plane and nodes",
  meta: "Kubernetes (K8s) architecture explained: the control plane components, what runs on each node, how a pod gets scheduled, and what AKS and EKS run for you.",
  h1: "Kubernetes architecture",
  deck: "One pod’s path from kubectl apply to a running container shows what each part does.",
  card: "The control plane, the node components, how a pod gets placed, and what AKS and EKS run for you.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-02",
  updated: "2026-11-03",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-kubernetes-architecture-1200x630.webp",
  coverAlt:
    "Kubernetes architecture: the control plane above two worker nodes running pods, with every arrow meeting the API server",
  short:
    "Kubernetes architecture has two parts: a control plane and worker nodes. The control plane (API server, etcd, scheduler and controller managers) stores the cluster’s state and decides where each pod runs. Each worker node runs the kubelet and a container runtime, which start the pods placed there, and usually kube-proxy for Service traffic. On Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS), the cloud provider operates the control plane.",
  sections: [
    {
      id: "the-two-halves-control-plane-and-worker",
      title: "Control plane and worker nodes",
      blocks: [
        {
          kind: "p",
          text: "The control plane makes cluster-wide decisions, such as scheduling. It also responds to events: for example, it starts a new pod when a Deployment has fewer replicas than it asks for.",
        },
        {
          kind: "p",
          text: "Worker nodes run the pods, and every cluster needs at least one. In production, the control plane usually runs across several machines and the cluster runs several nodes, for fault tolerance and high availability.",
        },
        {
          kind: "p",
          text: "A pod is one or more containers that share network and storage. The scheduler places each pod on one node.",
        },
      ],
    },
    {
      id: "kubernetes-control-plane-components",
      title: "Control plane components",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { code: "kube-apiserver" },
              ": the front end of the control plane, which exposes the Kubernetes API. The nodes, the scheduler, the controllers and kubectl all go through it. It scales by running more instances.",
            ],
            [
              { code: "etcd" },
              ": the consistent, highly available key-value store that holds all cluster data. The Kubernetes docs advise a backup plan for it.",
            ],
            [
              { code: "kube-scheduler" },
              ": watches for new pods with no node and picks a node for each. It weighs resource requests, hardware and policy constraints, ",
              { a: "affinity rules", href: "/learn/pod-affinity-vs-node-affinity" },
              " and other factors.",
            ],
            [
              { code: "kube-controller-manager" },
              ": runs the built-in controllers, such as the Node, Job, EndpointSlice and ServiceAccount controllers. They’re compiled into one binary and run as one process.",
            ],
            [
              { code: "cloud-controller-manager" },
              ": links the cluster to your cloud provider’s API. Its Node, Route and Service controllers check for deleted nodes, set up routes and manage load balancers. A cluster on your own premises has none.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "how-controllers-keep-the-cluster-at-its",
          title: "How controllers work",
        },
        {
          kind: "p",
          text: "A controller is a control loop, like a thermostat. It watches the cluster’s current state, then makes or requests changes that move it toward the desired state.",
        },
        {
          kind: "p",
          text: "Built-in controllers act through the API server. The Job controller runs no pods itself. It asks the API server to create or remove pods, then marks the Job finished when the work is done.",
        },
      ],
    },
    {
      id: "what-runs-on-each-node",
      title: "Node components",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { a: { code: "kubelet" }, href: "/learn/glossary/kubelet" },
              ": the agent on each node. It makes sure the containers in the node’s pods are running and healthy.",
            ],
            "Container runtime: runs the containers. Kubernetes supports containerd, CRI-O and any other runtime that implements the Container Runtime Interface (CRI). AKS uses containerd on Linux node pools on Kubernetes 1.19 and later.",
            [
              { code: "kube-proxy" },
              " (optional): a network proxy that maintains each node’s network rules for Services. A network plugin that forwards Service traffic itself can replace it. AKS clusters on Azure CNI powered by Cilium use Cilium instead.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Add-ons are cluster features that run as ordinary workloads, such as DaemonSets and Deployments, in the ",
            { code: "kube-system" },
            " namespace. Every cluster should have cluster DNS. On AKS, ",
            { code: "kube-system" },
            " holds ",
            { code: "coredns" },
            ", ",
            { code: "konnectivity-agent" },
            " and ",
            { a: { code: "metrics-server" }, href: "/learn/glossary/metrics-server" },
            ", among others.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pods don’t get the whole node. AKS reserves CPU and memory on each node to keep it working, so ",
            {
              a: "pods can use less than the node’s total",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-a-pod-gets-from-kubectl-apply",
      title: "How a pod gets placed",
      blocks: [
        {
          kind: "steps",
          items: [
            [
              "You run ",
              { code: "kubectl apply" },
              ". It sends the Deployment to the API server, which stores it in etcd.",
            ],
            "Controllers see that the Deployment has fewer pods than it asks for. They ask the API server to create the missing pods.",
            "The scheduler sees each new pod with no node. It picks a node and binds the pod to it through the API server.",
            "That node’s kubelet sees the pod and has the container runtime start its containers.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "how-the-scheduler-picks-a-node",
          title: "Filtering and scoring",
        },
        {
          kind: "p",
          text: "The scheduler picks a node in two steps. Filtering keeps the feasible nodes, such as those with enough free resources for the pod’s requests. Scoring ranks them, and the pod binds to the top-scoring node, with a tie broken at random.",
        },
        {
          kind: "p",
          text: [
            "The fit check adds up ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not use. Even on a node with very low CPU and memory use, the scheduler won’t place a pod whose requests don’t fit.",
          ],
        },
        {
          kind: "p",
          text: [
            "If no node passes filtering, the pod stays unscheduled. A ",
            { a: "node autoscaler", href: "/learn/kubernetes-autoscaling" },
            " reacts to such pending pods and can add a node with room for their requests.",
          ],
        },
      ],
    },
    {
      id: "how-the-control-plane-and-nodes-talk",
      title: "How the parts communicate",
      blocks: [
        {
          kind: "p",
          text: "Kubernetes uses a hub-and-spoke pattern. All API calls from nodes, and from the pods they run, end at the API server. No other control plane part is designed to expose remote services.",
        },
        {
          kind: "p",
          text: "In the other direction, the API server calls each node’s kubelet to fetch pod logs, attach to running pods and forward ports.",
        },
        {
          kind: "p",
          text: [
            "With the Konnectivity service, beta since Kubernetes 1.18, agents on the nodes open the connections to the control plane. All traffic from the control plane to the nodes then goes through them. On AKS, ",
            { code: "konnectivity-agent" },
            " pods run in ",
            { code: "kube-system" },
            ".",
          ],
        },
      ],
    },
    {
      id: "kubernetes-architecture-on-aks-and-eks",
      title: "On AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: [
            "Both follow the same architecture. Azure operates the ",
            { a: "AKS", href: "/learn/glossary/aks" },
            " control plane in both Automatic and Standard modes. AWS runs a separate control plane for each ",
            { a: "EKS", href: "/learn/glossary/eks" },
            " cluster.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "18%" },
            { label: "AKS", width: "41%" },
            { label: "EKS", width: "41%" },
          ],
          rows: [
            [
              "Control plane",
              "Operated by Azure: the API server, etcd, the scheduler and both controller managers",
              "One per cluster, with at least two API server instances and three etcd instances across three Availability Zones in a Region",
            ],
            [
              "Node options",
              "Node pools on Virtual Machine Scale Sets by default, or Virtual Machines node pools, where AKS manages each VM",
              "EKS Auto Mode, Karpenter, managed node groups, self-managed nodes, AWS Fargate and EKS Hybrid Nodes",
            ],
            [
              "Where the nodes live",
              "The node resource group, a second resource group AKS creates for the cluster’s VMs, scale sets and storage",
              "Amazon EC2 instances for managed node groups and self-managed nodes. Fargate needs no instances you manage, and hybrid nodes are your on-premises and edge machines",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On AKS, system ",
            { a: "node pools", href: "/learn/glossary/node-pool" },
            " host critical system pods such as CoreDNS and ",
            { code: "konnectivity-agent" },
            ". User node pools host your apps.",
          ],
        },
      ],
    },
    {
      id: "how-requests-and-nodes-shape-your-cloud",
      title: "Requests, nodes and cost",
      blocks: [
        {
          kind: "p",
          text: "On AKS, each node is charged as a standard VM, and VM discounts such as Azure reservations apply automatically. So the number and size of your nodes set that part of your cloud cost.",
        },
        {
          kind: "p",
          text: "Node autoscalers add nodes with room for pending pods’ requests. They don’t directly look at the pods’ real use. So a pod that requests far more than it uses still gets a node with room for its full request.",
        },
        {
          kind: "p",
          text: [
            "Requests set from measured use fit the same pods on fewer nodes. That is what ",
            { a: "pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " is for.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Cluster Architecture”",
      url: "https://kubernetes.io/docs/concepts/architecture/",
    },
    {
      publisher: "Kubernetes",
      title: "“Communication between Nodes and the Control Plane”",
      url: "https://kubernetes.io/docs/concepts/architecture/control-plane-node-communication/",
    },
    {
      publisher: "Kubernetes",
      title: "“Controllers”",
      url: "https://kubernetes.io/docs/concepts/architecture/controller/",
    },
    {
      publisher: "Kubernetes",
      title: "“Kubernetes Scheduler”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Core Concepts”",
      url: "https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts",
    },
    {
      publisher: "AWS",
      title: "“Amazon EKS architecture”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html",
    },
  ],
  related: [
    {
      title: "What is Kubernetes?",
      where: "Learn",
      href: "/learn/kubernetes-explained-simply",
    },
    {
      title: "Kubernetes allocatable vs capacity",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "Kubernetes autoscaling",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
    {
      title: "Kubernetes bin packing",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
  ],
};
