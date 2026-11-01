import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/change-eks-node-group-instance-type/1";
import { figure as figure2 } from "@/features/learn/figures/change-eks-node-group-instance-type/2";

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
  published: "2026-10-21",
  updated: "2026-11-01",
  author: "rupesh",
  cover: "/learn-covers/zoorik-learn-change-eks-node-group-instance-type-1200x630.webp",
  coverAlt: "Change EKS instance types: create a new node group, drain the old one, then delete it",
  short: [
    "You can’t change an Amazon Elastic Kubernetes Service (EKS) ",
    { a: "managed node group", href: "/learn/glossary/node-pool" },
    "’s instance type in place. Create a new node group with the types you want, cordon and drain the old nodes within their ",
    { a: "PodDisruptionBudgets (PDBs)", href: "/learn/pod-disruption-budget-best-practices" },
    ", then delete the old group. If your own launch template sets the type, a new template version replaces the nodes instead.",
  ],
  sections: [
    {
      id: "why-a-managed-node-group-cant-change",
      title: "Why a managed node group can’t change instance types in place",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a managed node group, ",
            { code: "ng-old" },
            ", created with m5.xlarge in its list of instance types, that you want on m7i.xlarge. You create ",
            { code: "ng-new" },
            " beside it, move the pods across one node at a time, and delete ",
            { code: "ng-old" },
            " once it’s empty. Until that delete, you pay for the instances in both groups.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "A managed node group is an EC2 Auto Scaling group that EKS runs for you, and its instance types are set when the group is created. They live in one of two places: the node group’s ",
            { code: "instanceTypes" },
            " list, which takes 0 to 20 types, or the launch template you supply, which takes zero or one. Setting a type in both places makes the create fail. With neither, EKS uses ",
            { code: "t3.medium" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Once the group exists, ",
            { code: "UpdateNodegroupConfig" },
            " covers Kubernetes labels and taints, the scaling and update configuration, node repair and the warm pool. Instance types aren’t on that list, so a new type means new nodes. Where the type is set decides the route:",
          ],
        },
        {
          kind: "ul",
          items: [
            "If it’s in the node group’s list, or is the default, follow the steps below. A group created without a custom launch template can’t switch to one later, so this is its only route.",
            "If your own launch template sets it, a new template version can carry a different type, and EKS recycles every node to match it.",
            "With Karpenter, change the NodePool’s requirements.",
          ],
        },
      ],
    },
    {
      id: "check-four-things-before-you-choose-the",
      title: "Check four things before you choose the new EKS instance types",
      blocks: [
        { kind: "p", text: "The first three can keep pods off the new nodes:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Match the architecture." },
              " ",
              { a: "AWS Graviton types", href: "/learn/glossary/aws-instance-families" },
              " are Arm-based, so every image the group runs, ",
              { a: "DaemonSets", href: "/learn/glossary/daemonset" },
              " included, needs an arm64 build, and the group needs an Arm AMI type.",
            ],
            [
              { b: "Count pod slots, not only vCPUs." },
              " With the Amazon VPC CNI, each pod takes its own IP address, so a type’s address-based ",
              { a: "pod cap", href: "/learn/glossary/max-pods-per-node" },
              " follows its elastic network interfaces (ENIs) and the IPs on each, not its vCPUs. Spread the same vCPUs over more, smaller nodes and the total of pod slots can change. Without a custom AMI, managed node groups also cap a node at 110\u00a0pods for types under 30\u00a0vCPUs, and on AWS Nitro System types, prefix delegation in VPC CNI 1.9.0 or later raises the IPs per node.",
            ],
            [
              { b: "Find pinned pods." },
              " Search your manifests for nodeSelectors or node affinity on the ",
              { code: "node.kubernetes.io/instance-type" },
              " label, or on a node group name. A pod pinned to the old group stays Pending on the new nodes.",
            ],
            [
              { b: "Confirm the Region." },
              " AWS doesn’t offer every type in every Region, so check that yours has it first.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives the monthly list price of an EKS node pool.",
          ],
        },
      ],
    },
    {
      id: "how-to-change-an-eks-node-group",
      title: "How to change an EKS node group instance type, step by step",
      blocks: [
        {
          kind: "p",
          text: "Drain the old nodes yourself, and delete the group only once it’s empty.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Two shortcuts don’t wait for your PDBs. AWS states that PDBs aren’t respected when you reduce a group’s desired node count, so a node can be terminated before its pods have left. Deleting the group drains each node, but EKS lets the termination go ahead if a node hasn’t drained after 5\u00a0minutes.",
        },
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
            " is null, go to step 2. If not, the group runs on your own launch template: check whether the template version it names sets an instance type. If it holds the type, use the launch template section below. If it doesn’t, you still need a new group: in step 2, add ",
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
            [
              "Create the new group with the new instance types and the old group’s subnets, node role, capacity type and disk size, sized to hold every pod it runs. Copy its labels and taints too, because pods that select those labels won’t schedule on nodes without them. Drop ",
              { code: "--labels" },
              " or ",
              { code: "--taints" },
              " if the old group had none.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks create-nodegroup \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <new-nodegroup> \\\n  --instance-types <new-type-1> <new-type-2> \\\n  --ami-type <ami-type> \\\n  --node-role <node-role-arn> \\\n  --subnets <subnet-1> <subnet-2> \\\n  --capacity-type <ON_DEMAND-or-SPOT> \\\n  --disk-size <disk-size-gib> \\\n  --scaling-config minSize=<min>,maxSize=<max>,desiredSize=<desired> \\\n  --labels <key>=<value> \\\n  --taints key=<key>,value=<value>,effect=<effect>",
        },
        {
          kind: "p",
          text: "Types of different sizes can give every node the smallest pod cap, as shown after step 7. If the Cluster Autoscaler runs with auto-discovery, it picks up the new group, because EKS tags managed node group resources for it. Leave the new group’s maximum size room to grow while pods move.",
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
              " every old node, so evicted pods can’t land back on the old ones: ",
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
              ". Check the node IAM role too: if you gave the new group a different role and no other managed node group uses the old one, EKS removes it from the ",
              { code: "aws-auth" },
              " ConfigMap when you delete the group, and self-managed nodes that share the role go ",
              { code: "NotReady" },
              ".",
            ],
            "Delete the old group, which terminates its instances and can’t be undone:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks delete-nodegroup --cluster-name <cluster-name> --nodegroup-name <old-nodegroup>",
        },
      ],
    },
    {
      id: "multiple-instance-types-in-one-eks-node",
      title: "Multiple instance types in one EKS node group get the smallest pod cap",
      blocks: [
        {
          kind: "p",
          text: "Listing several types makes a group easier to fill. But mixed sizes cost pod slots, because without a custom AMI, a managed node group applies the smallest pod cap across its types to every node.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "With the VPC CNI, a type caps a node at (ENIs × (IPs per ENI − 1)) + 2\u00a0pods. A type with 3 ENIs of 10 IPs each runs (3 × 9) + 2 = 29\u00a0pods, and one with 4 ENIs of 15 runs (4 × 14) + 2 = 58. In one group, every node gets 29, so each larger node gives up 58 − 29 = 29 slots, half its cap.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "A group holds one capacity type, On-Demand or ",
            { a: "Spot", href: "/learn/glossary/spot-instance" },
            ", so to run both, create two groups. On-Demand groups use the ",
            { code: "prioritized" },
            " allocation strategy: EKS tries the types in the exact order you list them. Spot groups created in clusters on Kubernetes 1.28 or later use ",
            { code: "price-capacity-optimized" },
            ". For Spot, AWS recommends several types, and where the Cluster Autoscaler scales the group, a set with the same vCPU and memory so nodes scale as expected.",
          ],
        },
      ],
    },
    {
      id: "when-the-instance-type-is-in-your",
      title: "When the instance type is in your launch template, a new version replaces the nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "If you created the group with your own launch template and set the instance type there, a new template version changes it. This route is less work than a new group, with two limits: a launch template holds a single instance type, and the group stays on the template it was created with. Built on the current version with ",
            { code: "--source-version" },
            ", the new version inherits the other launch parameters:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ec2 create-launch-template-version \\\n  --launch-template-id <launch-template-id> \\\n  --source-version <current-version> \\\n  --launch-template-data \'{"InstanceType":"<new-instance-type>"}\'\n\naws eks update-nodegroup-version \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <nodegroup-name> \\\n  --launch-template id=<launch-template-id>,version=<new-version>',
        },
        {
          kind: "p",
          text: "EKS then replaces the nodes itself, one node at a time by default. With the default update strategy, it launches new nodes first, and once a new node is Ready, it cordons and drains an old one, then terminates it 60\u00a0seconds after the last eviction. The minimal strategy terminates old nodes before creating new ones, which AWS describes as useful when you’re constrained on resources or cost, as with GPUs.",
        },
        {
          kind: "p",
          text: [
            "Pods that haven’t left within 15\u00a0minutes fail the update with a ",
            { code: "PodEvictionFailure" },
            " error. Passing ",
            { code: "--force" },
            " to ",
            { code: "update-nodegroup-version" },
            " deletes those pods whatever their PDBs allow, so fix the budget instead where you can.",
          ],
        },
      ],
    },
    {
      id: "with-karpenter-the-nodepools-requirements-decide-the",
      title: "With Karpenter, the NodePool’s requirements decide the types",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            ", at v1.15 in October 2026, has no node group to replace. A NodePool’s requirements, under ",
            { code: "spec.template.spec.requirements" },
            ", decide which instance types Karpenter may launch, and narrowing them marks every existing node whose type no longer fits as drifted.",
          ],
        },
        {
          kind: "p",
          text: "Karpenter replaces drifted nodes as a voluntary disruption. It taints the old node, launches any replacements it needs and waits until they’re ready, then evicts the old node’s pods through the Eviction API, which respects PDBs. A NodePool with no budget set lets 10% of its nodes be disrupted at once.",
        },
        {
          kind: "p",
          text: [
            "Widening the requirements drifts nothing, because the existing nodes still match. A node running a pod annotated ",
            { code: "karpenter.sh/do-not-disrupt" },
            " is held back from drift unless its NodeClaim sets a ",
            { code: "terminationGracePeriod" },
            ", as ",
            {
              a: "the do-not-disrupt annotation guide",
              href: "/learn/safe-to-evict-do-not-disrupt",
            },
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
            "A new instance type pays off only when the pods’ requests fit it well, and Karpenter chooses machines from pod requests without changing them. ",
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS: it rebalances each container’s CPU and memory requests to what it really uses, and what it can then do with your nodes depends on the autoscaler you run.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "EKS cost optimization", href: "/eks-cost-optimization" },
            " covers what Coral does on EKS.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With Karpenter:" },
              " Coral can rebalance the nodes you choose onto cheaper machines that still fit the work, and you compare current and rebalanced cost before it starts. It creates fixed-size NodePools named zoorik-rb-…, your Karpenter launches the new machines, and the old nodes are drained and removed one by one.",
            ],
            [
              { b: "With only the Cluster Autoscaler:" },
              " Coral empties spare nodes one at a time but never changes their size, and the Cluster Autoscaler removes them within its minimums. Changing a node group’s type is still the route above.",
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
          text: "A rebalance can take nodes from an EKS managed node group too. Coral drains each one and terminates it through the group’s Auto Scaling group, reducing the desired count by one, and it never adds machines to the group. A group that the Cluster Autoscaler manages is left to it.",
        },
        {
          kind: "p",
          text: "A rebalance needs Node optimization on and the permission to remove nodes, which on EKS is an IAM role that can terminate instances in the cluster’s Auto Scaling groups. Where only a group’s minimum size blocks a removal, Coral can reduce that minimum, given the permission for it, and puts it back later.",
        },
        {
          kind: "p",
          text: [
            "A rebalance never goes past a PDB, and a node that can’t be emptied within 45\u00a0minutes is kept. Where a warm handover applies, Coral starts a new copy on another node first, and it must be Ready and serving for 5\u00a0minutes with no restarts before the old pod goes. Pods that don’t qualify, such as StatefulSet pods or pods with ReadWriteOnce volumes, are evicted instead, and a single-replica app among them gets a short restart. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
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
      { label: "Kubernetes optimization with Coral", href: "/coral" },
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
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title:
        "After node and workload optimization move us from larger machines to smaller ones, how do we get back to bigger machines in a sudden surge?",
      where: "Coral FAQ",
      href: "/coral-faq#after-node-and-workload-optimization-move",
    },
  ],
};
