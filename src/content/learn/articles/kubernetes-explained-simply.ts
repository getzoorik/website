import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-explained-simply/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-explained-simply/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-explained-simply/3";

export const article: Article = {
  slug: "kubernetes-explained-simply",
  title: "What is Kubernetes? Kubernetes explained simply",
  meta: "What is Kubernetes in simple words? A plain Kubernetes definition, then clusters, nodes, pods and containers, explained with one shop app and a restaurant.",
  h1: "What is Kubernetes? Kubernetes explained simply, from clusters to containers",
  deck: "Think of a restaurant kitchen: Kubernetes decides which cook works at which counter.",
  card: "Clusters, nodes, pods and containers, explained with one shop app and a restaurant kitchen.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-02",
  updated: "2026-11-02",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-kubernetes-explained-simply-1200x630.webp",
  coverAlt:
    "Kubernetes explained as a restaurant: manager and control plane, counters and nodes, stations and pods, cooks and containers",
  short:
    "Kubernetes is open-source software that runs your app’s containers across a cluster of machines. You say what should run, such as 3\u00a0copies of a service, and it keeps it so. When a container fails, Kubernetes restarts or replaces it, and it sends traffic only to copies that are ready.",
  sections: [
    {
      id: "what-is-kubernetes-used-for",
      title: "What is Kubernetes used for?",
      blocks: [
        {
          kind: "p",
          text: "K8s means Kubernetes: the 8 counts the eight letters between the “K” and the “s”. The name Kubernetes comes from Greek, meaning helmsman or pilot.",
        },
        { kind: "p", text: "Day to day, Kubernetes does jobs like these:" },
        {
          kind: "ul",
          items: [
            "Restarting or replacing containers that fail.",
            "Spreading traffic over the copies of a service.",
            "Rolling a new version out at a controlled rate, and back again if needed.",
            "Packing containers onto machines by the CPU and memory each one needs.",
            "Adding or removing copies as load changes, by hand or automatically on CPU use.",
          ],
        },
      ],
    },
    {
      id: "what-is-a-kubernetes-cluster",
      title: "What is a Kubernetes cluster?",
      blocks: [
        {
          kind: "p",
          text: "Take a shop’s app of 5\u00a0services: website, catalog, cart, orders and payments. A Kubernetes cluster runs them on a control plane plus at least one worker machine, called a node. The control plane manages the nodes and what runs on them.",
        },
        {
          kind: "p",
          text: "In the restaurant, the cluster is the whole restaurant. The control plane is its manager, and the nodes are its kitchen counters.",
        },
        {
          kind: "p",
          text: "Kubernetes clustering means running many machines as one. You hand work to the cluster, and the scheduler, a part of the control plane, picks a node for each piece.",
        },
        {
          kind: "p",
          text: [
            { a: "Kubernetes architecture", href: "/learn/kubernetes-architecture" },
            " goes one level deeper, into each part of the control plane and of a node.",
          ],
        },
      ],
    },
    {
      id: "designing-your-clusters-in-7-steps",
      title: "How many Kubernetes clusters do I need? Design yours in 7 steps",
      blocks: [
        {
          kind: "steps",
          items: [
            [
              { b: "List your services." },
              " For the shop, that’s website, catalog, cart, orders and payments.",
            ],
            [
              { b: "See who depends on whom." },
              " Cart, orders and payments work as a chain. The website and catalog still show products while checkout is down.",
            ],
            [
              { b: "Split by environment first." },
              " Live, test and development make 3\u00a0clusters, with all 5\u00a0services in each. A small team can stop here.",
            ],
            [
              { b: "Look for special rules." },
              " Payments handles card data, so a growing business may give it its own cluster for stronger isolation.",
            ],
            [
              { b: "Look at where your users are." },
              " Users in one country can share one region. Users across continents may need a cluster in each region, near them.",
            ],
            [
              { b: "Ask what breaks if this breaks." },
              " That’s its blast radius. Keep together what fails together, like cart and orders, since one cluster per service adds no safety.",
            ],
            [
              { b: "Weigh the cost." },
              " Each extra cluster brings its own control plane, nodes and work to run it. Split only when the reason is worth that.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A growing business may split live into 3\u00a0clusters: shopping (website, catalog), checkout (cart, orders) and payments. Payments is kept apart for its rules.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "A large company runs these steps for many teams, regions and rules. So it ends with many clusters, each split for one of the reasons above.",
        },
        {
          kind: "p",
          text: "Inside one cluster, namespaces keep teams and services apart. Names don’t clash, and access rules can stop at a namespace. Services still reach each other across namespaces by name.",
        },
      ],
    },
    {
      id: "nodes-the-machines-that-do-the-work",
      title: "Nodes: the machines that do the work",
      blocks: [
        {
          kind: "p",
          text: [
            "A node is one worker machine in the cluster. On ",
            { a: "Azure Kubernetes Service (AKS)", href: "/learn/glossary/aks" },
            ", each node is an Azure virtual machine. On ",
            { a: "Amazon Elastic Kubernetes Service (EKS)", href: "/learn/glossary/eks" },
            ", it’s usually an Amazon EC2 instance.",
          ],
        },
        {
          kind: "p",
          text: "Like a kitchen counter shared by cooks making different dishes, one node runs parts of many services at once. The cart can sit beside the catalog.",
        },
        {
          kind: "p",
          text: "In production, a cluster usually runs several nodes, so one failure doesn’t stop the app. If a node fails, Kubernetes starts the lost copies again, and the scheduler places them on a healthy node.",
        },
      ],
    },
    {
      id: "image-container-pod-and-workload-how-they",
      title: "Image, container, pod and workload: how they fit together",
      blocks: [
        {
          kind: "p",
          text: "An image is the recipe: a ready-to-run package of a service’s code, runtime, libraries and default settings. The cart service is built once, as a cart image.",
        },
        {
          kind: "p",
          text: "A container is a cook following that recipe: one running copy of one image. Because the image carries everything, a container behaves the same wherever it runs.",
        },
        {
          kind: "p",
          text: "A pod is the cook’s station: the smallest unit you can run in Kubernetes, which the scheduler places on a node. It usually holds one app container, sometimes with a sidecar helper.",
        },
        {
          kind: "p",
          text: "A pod isn’t a physical thing. It’s an environment on one machine, where its containers share one IP address and, where they need it, storage.",
        },
        {
          kind: "p",
          text: "A workload is the standing order “always keep 3\u00a0pizza cooks”. A Deployment running 3\u00a0copies of the cart image is one workload: 3\u00a0pods, kept at 3.",
        },
        {
          kind: "p",
          text: [
            "Pods are generally created by a workload such as a Deployment, not by hand. If a service’s pods need to track state, the Kubernetes docs suggest a ",
            { a: "StatefulSet", href: "/learn/statefulset-vs-deployment" },
            " instead.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "how-one-click-reaches-the-right-container",
      title: "How one click reaches the right container",
      blocks: [
        {
          kind: "steps",
          items: [
            "The browser looks up the shop’s address in DNS and gets the address of a cloud load balancer.",
            "The load balancer passes the click to the Ingress: the restaurant’s front door, and the cluster’s entry point for web traffic.",
            [
              "The Ingress matches the path, such as ",
              { code: "/cart" },
              ", and sends the click to the cart Service, the order counter.",
            ],
            "The Service hands the click to one of the ready cart pods, as the order counter passes each order to an open station.",
            "The Service’s target port leads to the cart container inside that pod.",
            "The answer goes back to the browser the same way.",
          ],
        },
        {
          kind: "p",
          text: "Kubernetes keeps a list of each Service’s ready pods, updated whenever the set of pods changes. So a copy that isn’t ready yet gets no clicks.",
        },
        { kind: "svg", figure: figure3 },
      ],
    },
    {
      id: "where-kubernetes-cost-comes-from",
      title: "Where Kubernetes cost comes from",
      blocks: [
        {
          kind: "p",
          text: "You pay for the nodes. On AKS, compute is priced by each virtual machine’s type and running time. On EKS, you pay for the EC2 instances behind the nodes, plus an hourly fee per cluster.",
        },
        {
          kind: "p",
          text: "A node costs the same each hour, whether its pods are busy or idle. Pods on your nodes add no charge of their own. You pay for disks and public IP addresses separately.",
        },
        {
          kind: "p",
          text: [
            "Each container asks for CPU and memory: its ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            ". Kubernetes fits containers onto nodes by those amounts. Ask for more than a container uses, and the extra fills nodes you pay for.",
          ],
        },
        {
          kind: "p",
          text: [
            "In the restaurant, that’s counter space held for a cook who never uses it, paid for all the same. ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " sets requests from real use.",
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
      title: "“Overview”",
      url: "https://kubernetes.io/docs/concepts/overview/",
    },
    {
      publisher: "Kubernetes",
      title: "“Cluster Architecture”",
      url: "https://kubernetes.io/docs/concepts/architecture/",
    },
    {
      publisher: "Kubernetes",
      title: "“Containers”",
      url: "https://kubernetes.io/docs/concepts/containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Pods”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/",
    },
    {
      publisher: "Kubernetes",
      title: "“Service”",
      url: "https://kubernetes.io/docs/concepts/services-networking/service/",
    },
    {
      publisher: "Kubernetes",
      title: "“Multi-tenancy”",
      url: "https://kubernetes.io/docs/concepts/security/multi-tenancy/",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Azure Kubernetes Service (AKS) pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/",
    },
    { publisher: "AWS", title: "“Amazon EKS pricing”", url: "https://aws.amazon.com/eks/pricing/" },
  ],
  related: [
    {
      title: "Kubernetes architecture: control plane, nodes and pods",
      where: "Learn",
      href: "/learn/kubernetes-architecture",
    },
    {
      title: "Kubernetes pricing and cost estimation: count the nodes, then price them",
      where: "Learn",
      href: "/learn/kubernetes-cost-estimation",
    },
    {
      title: "Right-size Kubernetes pods: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Kubernetes cost optimization: rebalance requests, then remove spare nodes",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
  ],
};
