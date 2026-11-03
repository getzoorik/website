import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/change-eks-node-group-instance-type/1";
import { figure as figure2 } from "@/features/learn/figures/change-eks-node-group-instance-type/2";

export const article: Article = {
  slug: "change-eks-node-group-instance-type",
  title: "How to change an EKS node group instance type",
  meta: "An EKS managed node group can’t change its instance type in place. The commands to create a new group, drain the old one within its PDBs, and delete it.",
  h1: "How to change an EKS node group instance type",
  deck: "The checks to run first, then the AWS CLI, eksctl and kubectl commands for each route.",
  card: "Create a new node group, drain the old one within its PDBs, then delete it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "rupesh",
  cover: "/learn-covers/zoorik-learn-change-eks-node-group-instance-type-1200x630.webp",
  coverAlt: "Change EKS instance types: create a new node group, drain the old one, then delete it",
  short: [
    "You can’t change an Amazon Elastic Kubernetes Service (EKS) ",
    { a: "managed node group", href: "/learn/glossary/node-pool" },
    "’s instance type in place. Create a new node group with the types you want, cordon and drain the old nodes within their ",
    { a: "PodDisruptionBudgets (PDBs)", href: "/learn/pod-disruption-budget-best-practices" },
    ", then delete the old group. If your own launch template sets the type, a new template version replaces the nodes instead. With Karpenter, change the NodePool’s requirements.",
  ],
  sections: [
    {
      id: "why-a-managed-node-group-cant-change",
      title: "Why the type is fixed",
      blocks: [
        {
          kind: "p",
          text: "A managed node group is an EC2 Auto Scaling group that EKS runs for you. Its instance types are set when you create it.",
        },
        {
          kind: "p",
          text: [
            "The types live in the group’s ",
            { code: "instanceTypes" },
            " list, which takes 0 to 20, or in your own launch template, which takes zero or one. Setting a type in both makes the create fail. With neither, EKS uses ",
            { code: "t3.medium" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "UpdateNodegroupConfig" },
            " changes a group’s labels, taints, scaling, update settings, node repair and warm pool. It can’t change instance types, so a new type means new nodes. Where the type is set decides the route:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "In the group’s list, or the default:" },
              " create a new group and drain the old one, as below. A group created without a custom launch template can’t add one later.",
            ],
            [
              { b: "In your own launch template:" },
              " a new template version carries the new type, and EKS replaces every node.",
            ],
            [{ b: "With Karpenter:" }, " change the NodePool’s requirements."],
          ],
        },
        {
          kind: "p",
          text: [
            "Say a managed node group, ",
            { code: "ng-old" },
            ", runs on m5.xlarge and you want m7i.xlarge. You create ",
            { code: "ng-new" },
            " beside it, move the pods one node at a time, then delete ",
            { code: "ng-old" },
            ". Until that delete, you pay for both groups.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "check-four-things-before-you-choose-the",
      title: "Checks before you switch",
      blocks: [
        { kind: "p", text: "The first three can stop pods running on the new nodes:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Architecture." },
              " ",
              { a: "AWS Graviton", href: "/learn/glossary/aws-graviton" },
              " types are Arm-based. Every image the group runs, ",
              { a: "DaemonSets", href: "/learn/glossary/daemonset" },
              " included, needs an arm64 build, and the group needs an Arm AMI type.",
            ],
            [
              { b: "Pod slots, not only vCPUs." },
              " With the Amazon VPC CNI, each pod takes its own IP address. So a type’s ",
              { a: "pod cap", href: "/learn/glossary/max-pods-per-node" },
              " follows its elastic network interfaces (ENIs) and the IPs on each, not its vCPUs. The same vCPUs on more, smaller nodes can give a different total of pod slots.",
            ],
            [
              { b: "Pinned pods." },
              " Search your manifests for nodeSelectors or node affinity on the ",
              { code: "node.kubernetes.io/instance-type" },
              " label, or on a node group name. A pod pinned to the old group won’t schedule on the new nodes.",
            ],
            [
              { b: "Region." },
              " AWS doesn’t offer every type in every Region, so check that yours has it.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Without a custom AMI, a managed node group also caps pods per node: 110 under 30 vCPUs, and 250 over 30 vCPUs. On AWS Nitro System types, prefix delegation in VPC CNI 1.9.0 or later raises the IPs per node.",
        },
        {
          kind: "p",
          text: [
            {
              a: "How to choose EKS instance types",
              href: "/learn/how-to-choose-eks-instance-types",
            },
            " covers the family and the size. The ",
            { a: "EKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives a node group’s monthly list price.",
          ],
        },
      ],
    },
    {
      id: "how-to-change-an-eks-node-group",
      title: "Replace the node group",
      blocks: [
        {
          kind: "p",
          text: "Drain the old nodes yourself, and delete the old group only once it’s empty.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Two shortcuts don’t wait for your PDBs. AWS states that reducing a group’s desired node count doesn’t respect PDBs, so a node can be terminated before its pods leave. Deleting a group drains each node, but EKS lets the termination go ahead if a node hasn’t drained after 5 minutes.",
        },
        {
          kind: "ol",
          items: ["Read the old group’s settings, so the new group can match them:"],
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
            " is null, go to step 2. If not, check whether that launch template version sets an instance type. If it does, follow “With a launch template” below.",
          ],
        },
        {
          kind: "p",
          text: [
            "If it doesn’t, add ",
            { code: "--launch-template id=<launch-template-id>" },
            " in step 2. Leave out ",
            { code: "--disk-size" },
            ", and ",
            { code: "--ami-type" },
            " too if the template sets a custom AMI, or the create fails.",
          ],
        },
        {
          kind: "ol",
          start: 2,
          items: [
            "Create the new group with the new types and the old group’s subnets, node role, capacity type and disk size. Size it to hold every pod the old group runs.",
          ],
        },
        {
          kind: "p",
          text: [
            "Copy the old group’s labels and taints too. Pods that select those labels won’t schedule on nodes without them. Drop ",
            { code: "--labels" },
            " or ",
            { code: "--taints" },
            " if it had none.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks create-nodegroup \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <new-nodegroup> \\\n  --instance-types <new-type-1> <new-type-2> \\\n  --ami-type <ami-type> \\\n  --node-role <node-role-arn> \\\n  --subnets <subnet-1> <subnet-2> \\\n  --capacity-type <ON_DEMAND-or-SPOT> \\\n  --disk-size <disk-size-gib> \\\n  --scaling-config minSize=<min>,maxSize=<max>,desiredSize=<desired> \\\n  --labels <key>=<value> \\\n  --taints key=<key>,value=<value>,effect=<effect>",
        },
        {
          kind: "p",
          text: [
            "With eksctl, use ",
            { code: "eksctl create nodegroup" },
            " instead. AWS’s procedure needs eksctl 0.215.0 or later. ",
            { code: "eksctl create nodegroup --help" },
            " lists every option and default.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "eksctl create nodegroup \\\n  --cluster <cluster-name> \\\n  --region <region-code> \\\n  --name <new-nodegroup> \\\n  --node-ami-family <ami-family> \\\n  --node-type <new-type> \\\n  --nodes <desired> \\\n  --nodes-min <min> \\\n  --nodes-max <max>",
        },
        {
          kind: "p",
          text: "Types of different sizes in one group give every node the smallest pod cap, as the next section shows. If the Cluster Autoscaler runs with auto-discovery, it finds the new group by the tags EKS adds. Leave the new group’s maximum size room to grow while pods move.",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Wait for the group to become active, and check that its nodes are Ready with the new type. EKS labels each node with its group’s name in ",
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
              " every old node, so evicted pods can’t land back on them: ",
              { code: "kubectl cordon -l eks.amazonaws.com/nodegroup=<old-nodegroup>" },
              ".",
            ],
            "Drain the old nodes one at a time. A drain deletes each pod’s emptyDir data, so first check that none of it is needed.",
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
            "The drain evicts pods through the Eviction API, which respects your PDBs. If a PDB allows no disruption, ",
            { code: "|| break" },
            " stops the loop at the timeout, so you can fix the budget or add a replica. ",
            {
              a: "Draining a node without downtime",
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
              "Check that only DaemonSet pods are left on each old node: ",
              { code: "kubectl get pods -A -o wide --field-selector spec.nodeName=<node-name>" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Check the node IAM role too. If the new group has a different role and no other managed group uses the old one, the delete removes it from the ",
            { code: "aws-auth" },
            " ConfigMap. Self-managed nodes that share that role then go ",
            { code: "NotReady" },
            ".",
          ],
        },
        {
          kind: "ol",
          start: 7,
          items: ["Delete the old group. This terminates its instances and can’t be undone:"],
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
      title: "Several types in one group",
      blocks: [
        {
          kind: "p",
          text: "Several types make a group easier to fill. But without a custom AMI, EKS gives every node in the group the smallest pod cap among its types.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "With the VPC CNI, a type caps a node at (ENIs × (IPs per ENI − 1)) + 2 pods. A type with 3 ENIs of 10 IPs each runs (3 × 9) + 2 = 29 pods. One with 4 ENIs of 15 runs (4 × 14) + 2 = 58. In one group, every node gets 29, so each larger node gives up 29 slots, half its cap.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "A group holds one capacity type, On-Demand or ",
            { a: "Spot", href: "/learn/glossary/spot-instance" },
            ". To run both, create two groups.",
          ],
        },
        {
          kind: "p",
          text: [
            "On-Demand groups use the ",
            { code: "prioritized" },
            " allocation strategy: EKS tries the types in the order you list them. Spot groups created on Kubernetes 1.28 or later use ",
            { code: "price-capacity-optimized" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "For Spot, AWS recommends several types. If the Cluster Autoscaler scales the group, choose types with the same vCPU and memory, so nodes scale as expected.",
        },
      ],
    },
    {
      id: "when-the-instance-type-is-in-your",
      title: "With a launch template",
      blocks: [
        {
          kind: "p",
          text: [
            "If your own launch template sets the type, create a new template version with the new type. Two limits apply: a template holds one instance type, and a group stays on the template it was created with. With ",
            { code: "--source-version" },
            ", the new version keeps the other launch settings:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ec2 create-launch-template-version \\\n  --launch-template-id <launch-template-id> \\\n  --source-version <current-version> \\\n  --launch-template-data \'{"InstanceType":"<new-instance-type>"}\'\n\naws eks update-nodegroup-version \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <nodegroup-name> \\\n  --launch-template id=<launch-template-id>,version=<new-version>',
        },
        {
          kind: "p",
          text: "EKS then replaces the nodes itself, one at a time by default. The default update strategy launches new nodes first. Once a new node is Ready, EKS cordons and drains an old one, then terminates it.",
        },
        {
          kind: "p",
          text: "The minimal strategy terminates old nodes before creating new ones. AWS suggests it where resources or cost are constrained, as with GPUs.",
        },
        {
          kind: "p",
          text: [
            "Pods that don’t leave a node within 15 minutes fail the update with a ",
            { code: "PodEvictionFailure" },
            " error. Adding ",
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
      title: "With Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " has no node group to replace. A NodePool’s requirements, under ",
            { code: "spec.template.spec.requirements" },
            ", decide which instance types it may launch. Narrow them, and every node whose type no longer fits is marked as drifted.",
          ],
        },
        {
          kind: "p",
          text: "Drift is a voluntary disruption. Karpenter taints the old node, waits until any replacements it needs are Ready, then evicts the pods within their PDBs. A NodePool with no budget set lets 10% of its nodes be disrupted at once.",
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
              a: "the do-not-disrupt guide",
              href: "/learn/safe-to-evict-do-not-disrupt",
            },
            " explains.",
          ],
        },
      ],
    },
    {
      id: "how-coral-moves-eks-nodes-onto-cheaper",
      title: "How Coral rebalances EKS nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "A new instance type pays off only when the pods’ requests fit it well, and neither Karpenter nor the Cluster Autoscaler changes requests. ",
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests to real use on AKS and EKS, without any downtime. What it does with your nodes depends on your autoscaler:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With Karpenter:" },
              " Coral rebalances the nodes you choose onto cheaper machines that still fit the work. You compare current and rebalanced cost before it starts. Coral creates fixed-size NodePools, your Karpenter launches the new machines, and the old nodes are drained and removed one by one.",
            ],
            [
              { b: "With only the Cluster Autoscaler:" },
              " Coral empties spare nodes one at a time without changing their size, and the Cluster Autoscaler removes them. To change a node group’s type, use the steps above.",
            ],
            [
              { b: "With no autoscaler:" },
              " connecting Coral can set up Karpenter, with your approval. On a cluster that uses only ",
              { code: "aws-auth" },
              ", that switches authentication to ",
              { code: "API_AND_CONFIG_MAP" },
              " for good.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A rebalance can also take nodes from a managed node group. Coral drains each one and terminates it through the group’s Auto Scaling group, reducing the desired count by one. It never adds machines to the group, and leaves groups the Cluster Autoscaler manages to that autoscaler.",
        },
        {
          kind: "p",
          text: "A rebalance needs Node optimization on and an IAM role that can terminate instances in the cluster’s Auto Scaling groups. Where only a group’s minimum size blocks a removal, Coral can reduce that minimum, given the permission, and puts it back later.",
        },
        {
          kind: "p",
          text: "Coral moves each pod by warm handover, by live migration where both nodes support it, or by eviction. A rebalance never goes past a PDB, and a node that can’t be emptied in time is kept.",
        },
        {
          kind: "p",
          text: [
            { a: "EKS cost optimization", href: "/eks-cost-optimization" },
            " covers what Coral does on EKS. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " puts rebalancing and node removal in order.",
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
      publisher: "Kubernetes",
      title: "“kubectl drain”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
  ],
  related: [
    {
      title: "kubectl drain without any downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "How to change an AKS node pool VM size",
      where: "Learn",
      href: "/learn/change-aks-node-pool-vm-size",
    },
    {
      title: "Karpenter vs Cluster Autoscaler",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "How do we get bigger machines back in a surge?",
      where: "Coral FAQ",
      href: "/coral-faq#after-node-and-workload-optimization-move",
    },
  ],
  relatedTitle: "More on replacing nodes",
};
