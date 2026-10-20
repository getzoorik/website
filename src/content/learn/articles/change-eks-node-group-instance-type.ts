import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/change-eks-node-group-instance-type/1";

export const article: Article = {
  slug: "change-eks-node-group-instance-type",
  title: "How to change an EKS node group instance type",
  meta: "To change an EKS node group instance type, create a new node group, drain the old nodes within their PDBs, then delete the old group. Commands included.",
  h1: "How to change an EKS node group instance type",
  deck: "A managed node group keeps the instance types it was created with. How to move to new ones, one node at a time.",
  card: "New node group, cordon, drain within PDBs, delete: the route to new EKS instance types, step by step.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-28",
  updated: "2026-10-28",
  author: "rupesh",
  short: [
    "You can’t change the instance type of an existing Amazon Elastic Kubernetes Service (EKS) managed node group in place. Its update API changes settings such as labels, taints and scaling, not instance types. To change it, create a new node group with the types you want, cordon and drain the old nodes within their ",
    { a: "PodDisruptionBudgets (PDBs)", href: "/learn/pod-disruption-budget-best-practices" },
    ", then delete the old group. If the type is set in your own launch template, a new template version replaces the nodes instead.",
  ],
  sections: [
    {
      id: "why-a-managed-node-group-keeps-its",
      title: "Why a managed node group keeps its instance types",
      blocks: [
        {
          kind: "p",
          text: [
            "A managed node group is an EC2 Auto Scaling group that EKS runs for you, and EKS node group instance types are set when the group is created. They live in one of two places: the node group’s ",
            { code: "instanceTypes" },
            " list, which takes 0 to 20 types, or the launch template you supply, which takes zero or one. Setting a type in both places makes the create fail. With neither, EKS uses ",
            { code: "t3.medium" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "After that, the ",
            { code: "UpdateNodegroupConfig" },
            " API covers Kubernetes labels and taints, the scaling and update configuration, node repair and the warm pool. EKS managed node group instance types aren’t on that list, so for an AWS EKS node group, a change of instance type means new nodes: a new group beside the old one, a drain, then deleting the old group.",
          ],
        },
        {
          kind: "p",
          text: "There’s one exception. A node group created with your own launch template can move to a new version of that template, and every node is then recycled to match it. If the instance type is set in the template, the new version can carry a different one. A group created without a custom template can’t switch to one later, so for that group the new node group is the only route.",
        },
      ],
    },
    {
      id: "choose-the-new-eks-instance-types-first",
      title: "Choose the new EKS instance types first",
      blocks: [
        {
          kind: "p",
          text: "Before you create anything, check four things that change with the type. The first three can keep pods from running on the new nodes:",
        },
        {
          kind: "ul",
          items: [
            "Architecture. AWS Graviton types are Arm-based, so every image the group runs, DaemonSets included, needs an arm64 build, and the group needs an Arm AMI type.",
            "Pods per node. With the Amazon VPC CNI, each pod takes its own IP address, so the instance type caps a node’s pods at (number of elastic network interfaces (ENIs) × (IPs per ENI − 1)) + 2. A type with 3 interfaces of 10 addresses runs 29\u00a0pods, and one with 4 interfaces of 15 runs 58. Managed node groups without a custom AMI also cap the figure at 110 for types under 30\u00a0vCPUs. On AWS Nitro System types, prefix delegation in VPC CNI 1.9.0 or later raises the addresses per node.",
            [
              "Selectors. Search your manifests for nodeSelectors or node affinity on the ",
              { code: "node.kubernetes.io/instance-type" },
              " label, or on a node group name. A pod pinned to the old group stays Pending on the new nodes.",
            ],
            "Region. AWS notes that not every instance type is offered in every Region, so confirm yours has the type before you plan around it.",
          ],
        },
        {
          kind: "p",
          text: "The address-based pod cap follows a type’s interfaces and addresses, not its vCPUs. Spread the same vCPUs over more, smaller nodes and the total of pod slots can change, so count slots as well as vCPUs and memory when you size the new group.",
        },
        {
          kind: "h3",
          id: "eks-node-group-multiple-instance-types",
          title: "EKS node group multiple instance types",
        },
        {
          kind: "p",
          text: [
            "Listing several types makes a group easier to fill. On-Demand groups use the ",
            { code: "prioritized" },
            " allocation strategy, which means EKS tries the types in the exact order you list them, starting with the first. Spot groups created in clusters on Kubernetes 1.28 or later use ",
            { code: "price-capacity-optimized" },
            ". For Spot, AWS recommends several types, and where the Cluster Autoscaler scales the group, a set with the same vCPU and memory so nodes scale as expected.",
          ],
        },
        {
          kind: "p",
          text: "Mixed sizes also cost pod slots. A managed node group applies the smallest pod cap across its types to every node, so a 29-pod type listed beside a 58-pod type gives every node 29. A group also holds one capacity type, On-Demand or Spot. To run both, create two groups.",
        },
      ],
    },
    {
      id: "how-to-change-an-eks-node-group",
      title: "How to change an EKS node group instance type, step by step",
      blocks: [
        {
          kind: "p",
          text: "The order is new capacity first, then the pods, then the old capacity. Two shortcuts don’t wait for your PDBs. AWS states that PDBs aren’t respected when you reduce a group’s desired node count, so a node can be terminated before its pods have left. Deleting the group drains each node, but EKS lets the termination go ahead if a node hasn’t drained after 5\u00a0minutes. So drain the old nodes yourself, and delete the group once it’s empty.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "ol",
          items: [
            "Read the settings of the group you’re replacing, so the new one can match them:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks describe-nodegroup \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <old-nodegroup> \\\n  --query 'nodegroup.{types:instanceTypes,ami:amiType,capacity:capacityType,subnets:subnets,role:nodeRole,disk:diskSize,template:launchTemplate,scaling:scalingConfig,labels:labels,taints:taints}'",
        },
        {
          kind: "p",
          text: [
            "If ",
            { code: "template" },
            " isn’t null, the old group runs on your own launch template, which holds settings such as the disk size and may hold the instance type. If it holds the type, read the launch template section below. If not, you still need a new group: in step 2, add ",
            { code: "--launch-template id=<launch-template-id>" },
            " and leave out ",
            { code: "--disk-size" },
            ", plus ",
            { code: "--ami-type" },
            " if the template sets a custom AMI, or the create fails.",
          ],
        },
        {
          kind: "ol",
          start: 2,
          items: [
            "Create the new group with the new instance types and the old group’s subnets, node role, capacity type and disk size, sized to hold every pod it runs. Copy its labels and taints into the label and taint flags as well, because pods that select those labels won’t schedule on nodes without them. Drop either flag if the old group had none.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks create-nodegroup \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <new-nodegroup> \\\n  --instance-types <new-type-1> <new-type-2> \\\n  --ami-type <ami-type> \\\n  --node-role <node-role-arn> \\\n  --subnets <subnet-1> <subnet-2> \\\n  --capacity-type <ON_DEMAND-or-SPOT> \\\n  --disk-size <disk-size-gib> \\\n  --scaling-config minSize=<min>,maxSize=<max>,desiredSize=<desired> \\\n  --labels <key>=<value> \\\n  --taints key=<key>,value=<value>,effect=<NO_SCHEDULE>",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Wait for the group to become active, and check that its nodes are Ready with the type you chose. EKS labels each node with its group’s name in ",
              { code: "eks.amazonaws.com/nodegroup" },
              ":",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks wait nodegroup-active --cluster-name <cluster-name> --nodegroup-name <new-nodegroup>\nkubectl get nodes -l eks.amazonaws.com/nodegroup=<new-nodegroup> -L node.kubernetes.io/instance-type",
        },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              { a: "Cordon", href: "/learn/cordon-vs-drain" },
              " every old node, so evicted pods can only land on the new ones: ",
              { code: "kubectl cordon -l eks.amazonaws.com/nodegroup=<old-nodegroup>" },
              ".",
            ],
            "Drain the old nodes one at a time. A drain evicts each pod on the node and deletes the data in its emptyDir volumes, so check first that no emptyDir there holds data you need.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "for node in $(kubectl get nodes -l eks.amazonaws.com/nodegroup=<old-nodegroup> -o jsonpath='{.items[*].metadata.name}'); do\n  kubectl drain \"$node\" --ignore-daemonsets --delete-emptydir-data --timeout=15m || break\ndone",
        },
        {
          kind: "p",
          text: [
            "The evictions go through the Kubernetes Eviction API, which respects your PDBs. If a PDB allows no disruption, the drain waits until the timeout, and ",
            { code: "|| break" },
            " stops the loop there so you can fix the budget or add a replica. ",
            {
              a: "Draining without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            " covers single-replica apps, which restart under any drain.",
          ],
        },
        {
          kind: "ol",
          start: 6,
          items: [
            [
              "Check that only DaemonSet pods are left on each old node, with ",
              { code: "kubectl get pods -A -o wide --field-selector spec.nodeName=<node-name>" },
              ". Check the node IAM role too: if the old group’s role isn’t used by any other managed node group, EKS removes it from the ",
              { code: "aws-auth" },
              " ConfigMap, and self-managed nodes that share the role go ",
              { code: "NotReady" },
              ". Deleting the group then terminates its instances, and it can’t be undone:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks delete-nodegroup --cluster-name <cluster-name> --nodegroup-name <old-nodegroup>",
        },
        {
          kind: "p",
          text: "If the Cluster Autoscaler runs with auto-discovery, it picks up the new group, because EKS tags managed node group resources for it. Leave the new group’s maximum size room to grow while pods move.",
        },
      ],
    },
    {
      id: "when-the-instance-type-is-set-in",
      title: "When the instance type is set in a launch template",
      blocks: [
        {
          kind: "p",
          text: [
            "If you created the group with your own launch template and set the instance type there, you change an EKS instance type with a new template version. Built on the current version with ",
            { code: "--source-version" },
            ", the new one inherits the other launch parameters:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ec2 create-launch-template-version \\\n  --launch-template-id <launch-template-id> \\\n  --source-version <current-version> \\\n  --launch-template-data \'{"InstanceType":"<new-instance-type>"}\'\n\naws eks update-nodegroup-version \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <nodegroup-name> \\\n  --launch-template id=<launch-template-id>,version=<new-version>',
        },
        {
          kind: "p",
          text: [
            "EKS then replaces the nodes itself. With the default update strategy, it launches new nodes first, cordons an old node once a new one is Ready, drains it, and waits 60\u00a0seconds after the last eviction before terminating it. By default it updates one node at a time. Pods that haven’t left within 15\u00a0minutes fail the update with a ",
            { code: "PodEvictionFailure" },
            " error. Passing ",
            { code: "--force" },
            " to ",
            { code: "update-nodegroup-version" },
            " deletes those pods whatever their PDBs allow, so fix the budget instead where you can. The minimal strategy terminates old nodes before creating new ones, which AWS describes as useful when you’re constrained on resources or cost, as with GPUs.",
          ],
        },
        {
          kind: "p",
          text: "It’s less work, with two limits: a launch template holds a single instance type, and the group stays on the template it was created with.",
        },
      ],
    },
    {
      id: "changing-instance-types-with-karpenter",
      title: "Changing instance types with Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " (v1.15 in October 2026) has no node group to replace. A NodePool’s requirements, under ",
            { code: "spec.template.spec.requirements" },
            ", decide which instance types Karpenter may launch. Narrow them, and every existing node whose type no longer fits is marked drifted.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter replaces drifted nodes as a voluntary disruption. It taints the old node, launches any replacements it needs and waits until they’re ready, then evicts the old node’s pods through the Eviction API, which respects PDBs. A NodePool with no budget set lets 10% of its nodes be disrupted at once. Widening the requirements drifts nothing, because the existing nodes still match. A node running a pod annotated ",
            { code: "karpenter.sh/do-not-disrupt" },
            " is held back from drift unless its NodeClaim sets a ",
            { code: "terminationGracePeriod" },
            ", as ",
            { a: "the annotations guide", href: "/learn/safe-to-evict-do-not-disrupt" },
            " explains.",
          ],
        },
      ],
    },
    {
      id: "how-coral-moves-eks-nodes-onto-cheaper",
      title: "How Coral moves EKS nodes onto cheaper machines",
      blocks: [
        {
          kind: "p",
          text: [
            "A new instance type pays off only when the pods’ requests fit it well. Karpenter chooses machines from pod requests and doesn’t change them. ",
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS: it rebalances each container’s CPU and memory requests to what it really uses, and what it can then do with your nodes depends on the autoscaler you run.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With Karpenter:" },
              " Coral can rebalance the nodes you choose onto cheaper machines that still fit the work. You prepare a plan, choose nodes, generate it and compare current and rebalanced cost before you start, and a plan expires after 1\u00a0hour. Coral creates fixed-size NodePools named zoorik-rb-…, your Karpenter launches the new machines, and the old nodes are drained and removed one by one. The new pools stay after the run. You can choose nodes in an EKS managed node group too: Coral drains each one and terminates it through the group’s Auto Scaling group, reducing the desired count by one, and it never adds machines to the group. A group that the Cluster Autoscaler manages is left to it.",
            ],
            [
              { b: "With only the Cluster Autoscaler:" },
              " Coral removes nodes but never changes their size. It empties spare nodes one at a time, and the Cluster Autoscaler deletes them within its minimums, so a new instance type for a node group is still the route above.",
            ],
            [
              { b: "With no autoscaler:" },
              " connecting Coral can set up Karpenter on EKS, with your approval. On a cluster that uses only ",
              { code: "aws-auth" },
              ", that switches authentication to ",
              { code: "API_AND_CONFIG_MAP" },
              ", which can’t be undone.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A rebalance needs Node optimization on and the permission to remove nodes, which on EKS is an IAM role that can terminate instances in the cluster’s Auto Scaling groups. Where only a group’s minimum size blocks a removal, Coral can reduce that minimum, given the permission for it, and puts it back later. A rebalance never goes past a PDB, and a node that can’t be emptied within 45\u00a0minutes is kept. Where a warm handover applies, Coral starts a new copy on another node first, and it must be Ready and serving for 5\u00a0minutes with no restarts before the old pod goes. Pods that don’t qualify, such as StatefulSet pods or pods with ReadWriteOnce volumes, are evicted instead, and a single-replica app among them gets a short restart. ",
            { a: "Reducing Kubernetes cost", href: "/learn/reduce-kubernetes-cost" },
            " puts rebalancing and node removal in order.",
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
      publisher: "AWS",
      title: "“Customize managed nodes with launch templates”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html",
    },
    {
      publisher: "AWS",
      title: "“UpdateNodegroupConfig”",
      url: "https://docs.aws.amazon.com/eks/latest/APIReference/API_UpdateNodegroupConfig.html",
      note: " (Amazon EKS API Reference)",
    },
    {
      publisher: "AWS",
      title: "“Simplify node lifecycle with managed node groups”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
    },
    {
      publisher: "AWS",
      title: "“Create a managed node group for your cluster”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/create-managed-node-group.html",
    },
    {
      publisher: "AWS",
      title: "“Choose an optimal Amazon EC2 node instance type”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/choosing-instance-type.html",
    },
    {
      publisher: "AWS",
      title: "“Understand each phase of node updates”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-update-behavior.html",
    },
    {
      publisher: "AWS",
      title: "“Delete a managed node group from your cluster”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/delete-managed-node-group.html",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
  ],
  related: [
    {
      title: "How to drain a Kubernetes node without downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "How to change an AKS node pool VM size",
      where: "Learn",
      href: "/learn/change-aks-node-pool-vm-size",
    },
    {
      title: "Karpenter vs Cluster Autoscaler: how each removes nodes",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title:
        "After node and workload optimization move us from larger machines to smaller ones, how do we get back to bigger machines in a sudden surge?",
      where: "Coral FAQ",
      href: "/coral/faq#after-node-and-workload-optimization-move",
    },
  ],
};
