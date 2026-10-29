import { routes } from "@/config/site";
import type { OpenSourceGuide } from "@/content/open-source";

/**
 * The four troubleshooting pages under /docs: two for Coral, two for Amoeba. Each is a check list in the docs guide
 * frame (`OsGuidePage`, the install guides' frame): the short answer under the byline, one section per check, then
 * "Still stuck?" and the foot links. Generated once from the checked drafts in
 * `docs/website-seo/new-pages-2026-10-29/troubleshooting/` through the mock's own parser, so every string is the
 * mock's. Text is the guides' markup-lite: `code`, **bold** and [text](href).
 *
 * 🔴 PRODUCT LEVEL, CLIENT SOURCES ONLY. Every check traces to a line in the client-facing guides, FAQs and install
 * guides (the drafts' `ledger.md`), never to an internal document: no thresholds, no internal timings, no phase
 * names, no slot counts. Re-read those sources before changing a line.
 */

/** The four pages' printed date ("Updated 29 October 2026"), which the sitemap gives them too. */
export const troubleshootingUpdated = "29 October 2026";

export type TroubleshootingId =
  "coralNotConnecting" | "coralNotRemovingNodes" | "amoebaNotShowingVm" | "amoebaNotRightsizing";

export const troubleshootingGuides: Readonly<Record<TroubleshootingId, OpenSourceGuide>> = {
  coralNotConnecting: {
    route: routes.docsCoralNotConnecting,
    product: "coral",
    updated: troubleshootingUpdated,
    meta: {
      title: "Coral is not connecting to my cluster",
      description:
        "Coral is not connecting to your AKS or EKS cluster? Check the cluster, your access, the connect token, the network and the first report, in that order.",
    },
    hero: {
      title: "Coral is not connecting to my cluster: what to check",
      deck: "The checks to run, in order, when a cluster does not connect or shows no figures.",
    },
    short:
      "**Short answer.** To connect, you need a supported cluster, the right access, a new connect command, and a cluster that can reach Zoorik. Check them in the order below. Once the agent registers, the cluster appears on Overview, and its figures follow within minutes.",
    sections: [
      {
        title: "Check the cluster is supported",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** the cluster’s cloud, its Kubernetes version and its nodes.",
          },
          {
            kind: "p",
            text: "**What it means:** Coral works on AKS on Azure and EKS on AWS. Other clusters connect as “Local”, without cloud prices. The cluster needs Kubernetes 1.30 or later, and at least one Linux node, on amd64 or arm64.",
          },
          {
            kind: "p",
            text: "**What to do:** Make sure the cluster meets these before you connect it. A cluster that shows as “Local” still connects, but its figures have no cloud prices.",
          },
        ],
      },
      {
        title: "Check the command points at the right cluster",
        blocks: [
          { kind: "p", text: "**Look at:** the kubeconfig context the connect command uses." },
          {
            kind: "p",
            text: "**What it means:** To connect, you need cluster-admin on the cluster, through a kubeconfig context.",
          },
          {
            kind: "p",
            text: "**What to do:** Add `--kube-context <name>` to the command to pick the cluster. Run it as a user with cluster-admin.",
          },
        ],
      },
      {
        title: "Check the connect command is new",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** when you copied the command, and whether you ran it before.",
          },
          {
            kind: "p",
            text: "**What it means:** The command carries a connect token. The token works only once, and only for a short time after you get it.",
          },
          {
            kind: "p",
            text: "**What to do:** On Overview, open “Connect cluster” again and copy a new command. If you installed with Helm, connect again with a new token:",
          },
          {
            kind: "cmd",
            text: "helm upgrade coral-agent \\\n  oci://ghcr.io/getzoorik/charts/coral-agent \\\n  --kube-context <context> --namespace default \\\n  --reuse-values --set connectToken.value=<new connect token>",
          },
          {
            kind: "p",
            text: "With `connectToken.existingSecret`, replace the token in the Secret, then restart the agent:",
          },
          {
            kind: "cmd",
            text: "kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent",
          },
        ],
      },
      {
        title: "Check your cloud tools and permissions",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** your cloud’s command-line tool, and your permissions in your cloud account.",
          },
          {
            kind: "p",
            text: "**What it means:** zoorikctl lists every change it will make in your cloud and asks you once. To connect, you need:",
          },
          {
            kind: "table",
            head: ["Cluster", "Tool", "Permissions"],
            rows: [
              [
                "AKS",
                "The Azure CLI (`az`), signed in",
                "Owner, or Contributor with User Access Administrator, on the cluster’s subscription",
              ],
              [
                "EKS",
                "The AWS CLI (`aws`), signed in",
                "Permission to create IAM roles and EKS Pod Identity associations",
              ],
              [
                "EKS, when connect installs Karpenter",
                "Also Helm 3.8 or later",
                "Also SQS, EventBridge and cluster updates",
              ],
            ],
            widths: ["26%", "30%", "44%"],
          },
          {
            kind: "p",
            text: "**What to do:** Sign in, or ask for these permissions, then run the command again. To see what connect will change first, add `--dry-run`. It prints every cloud command and everything the agent setup installs, and changes nothing.",
          },
        ],
      },
      {
        title: "Check the network",
        blocks: [
          { kind: "p", text: "**Look at:** what the cluster can reach on the internet." },
          {
            kind: "p",
            text: "**What it means:** The agent always starts the connection to Zoorik itself, over HTTPS. Nothing outside the cluster connects in. So the cluster must be able to reach these over HTTPS:",
          },
          {
            kind: "ul",
            items: [
              "Zoorik.",
              "`ghcr.io` and `pkg-containers.githubusercontent.com`, for the images.",
              "Your cloud’s APIs, for node removal: Azure Resource Manager and Entra ID, or AWS STS and Auto Scaling.",
            ],
          },
          {
            kind: "p",
            text: "**What to do:** Allow these, then wait for the agent’s first report.",
          },
        ],
      },
      {
        title: "Check what connect set up in your cloud",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** your answer when zoorikctl asked about the cloud changes.",
          },
          {
            kind: "p",
            text: "**What it means:** If you said no, the agent still installs. Pools that an autoscaler runs are optimized as usual. Fixed-size pools wait until you give the permission to remove nodes.",
          },
          {
            kind: "p",
            text: "On AKS, connect turns on NAP only if the cluster has no autoscaler. NAP needs Azure CNI networking and doesn’t work with kubenet. On kubenet with no autoscaler, nothing adds nodes until you set one up.",
          },
          {
            kind: "p",
            text: "**What to do:** Give the permission to remove nodes when you are ready:",
          },
          { kind: "cmd", text: "zoorikctl cluster grant-node-deletion" },
          { kind: "p", text: "To set up an autoscaler later, run `zoorikctl cluster prepare`." },
        ],
      },
      {
        title: "Wait for the first report",
        blocks: [
          { kind: "p", text: "**Look at:** Overview, and the cluster’s own pages." },
          {
            kind: "p",
            text: "**What it means:** After you approve, zoorikctl installs the agent and waits for it to register. The cluster then appears on Overview, and its figures follow within minutes. Until data arrives, pages show “Waiting for the agent’s first report…”, then “Calculating”.",
          },
          {
            kind: "p",
            text: "**What to do:** Keep the page open: it updates by itself. Until data arrives, figures read “Calculating” or “Fetching prices”, never a guess. If the page keeps waiting, check the network again.",
          },
        ],
      },
      {
        title: "Check your Helm install",
        blocks: [
          { kind: "p", text: "**Look at:** your `helm install` command and its values." },
          {
            kind: "p",
            text: "**What it means, and what to do:** If you installed with the coral-agent Helm chart rather than zoorikctl, check these.",
          },
          {
            kind: "table",
            head: ["If", "What it means", "What to do"],
            rows: [
              [
                "You installed into `zoorik-agent` or `zoorik-node`",
                "The chart creates those two namespaces itself, so the install fails with an ownership error.",
                "Install the release in any other namespace, such as `default`.",
              ],
              [
                "The cluster was connected with zoorikctl before",
                "Helm doesn’t own the objects zoorikctl created, so `helm install` won’t take them over.",
                "Run `zoorikctl cluster disconnect` first. Then install the chart with a new connect token.",
              ],
              [
                "`controlPlaneUrl` has a path or a trailing slash",
                "It must be the base address only, exactly as the console shows it.",
                "Remove the path and the trailing slash.",
              ],
              [
                "You set `connectToken.existingSecret`",
                "The agent pod waits until that Secret exists.",
                "Create it in `zoorik-agent`, with the token under the key `bootstrap-token`.",
              ],
              [
                "EKS, with Pod Identity",
                "The agent gets AWS credentials only if the association exists when its pod starts.",
                "Create the association first. If the agent already runs, restart it once: `kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent`",
              ],
              [
                "`helm install --wait` is slow to return",
                "It waits until the agent has stayed ready for a while.",
                "Nothing. This is expected.",
              ],
            ],
            widths: ["30%", "36%", "34%"],
          },
        ],
      },
      {
        title: "If the cluster shows “Not reporting”",
        blocks: [
          { kind: "p", text: "**Look at:** the cluster’s entry in the console." },
          {
            kind: "p",
            text: "**What it means:** After a disconnect, the cluster stays in the console as “Not reporting”. The data Zoorik already received stays with it.",
          },
          {
            kind: "p",
            text: "**What to do:** If you disconnected it, connect it again with a new command from “Connect cluster”. If you didn’t, email us.",
          },
        ],
      },
      {
        title: "If the Agent release card says “Re-run connect”",
        blocks: [
          { kind: "p", text: "**Look at:** the “Agent release” card on the cluster’s Dashboard." },
          {
            kind: "p",
            text: "**What it means:** The agent updates itself to each Zoorik release. It can’t give itself new permissions, so a release that needs more shows “Re-run connect”. An agent that Argo CD, Flux or Helm manages doesn’t update itself.",
          },
          {
            kind: "p",
            text: "**What to do:** Run the connect command again. With Helm, `helm upgrade` to a newer chart version updates the agent.",
          },
        ],
      },
      {
        title: "Still stuck?",
        blocks: [
          {
            kind: "p",
            text: "The [Coral product guide](/coral/guide) and the [Coral FAQ](/coral/faq) have the full detail.",
          },
          {
            kind: "p",
            text: "Email founders@zoorik.com, or [pick a time to talk](https://cal.com/zoorik/talk). Tell us what you ran and what the console shows. Remove tokens, keys and other secrets from anything you send.",
          },
        ],
      },
    ],
    related: [
      { text: "Coral product guide: Before you start", href: "/coral/guide#before-you-start" },
      { text: "Coral product guide: Connect a cluster", href: "/coral/guide#connect-a-cluster" },
      {
        text: "Coral FAQ: What does connecting a cluster change?",
        href: "/coral/faq#what-does-connecting-a-cluster-change",
      },
      { text: "Install Coral with Helm", href: "/docs/install-coral-with-helm" },
      { text: "Why Coral is not removing a node", href: "/docs/coral-not-removing-nodes" },
    ],
  },
  coralNotRemovingNodes: {
    route: routes.docsCoralNotRemovingNodes,
    product: "coral",
    updated: troubleshootingUpdated,
    meta: {
      title: "Why Coral is not removing a node",
      description:
        "A node you expected Coral to empty is still there? Check the switches, what holds the node, the pool minimum, your autoscaler and cordons.",
    },
    hero: {
      title: "Why Coral is not removing a node",
      deck: "The checks to run when a node you expected to go is still in the cluster.",
    },
    short:
      "**Short answer.** As Coral rebalances your cluster, it empties nodes you don’t need, and your autoscaler removes them. A node often stays because a switch is off, a pod can’t move safely, there’s no room elsewhere, or the pool is at its minimum. Node list → “What’s holding them” shows the reason for each held node.",
    sections: [
      {
        title: "Check Node optimization and the Evictor are on",
        blocks: [
          { kind: "p", text: "**Look at:** Settings, and the Evictor’s “Advanced settings”." },
          {
            kind: "p",
            text: "**What it means:** With Node optimization off, Coral plans no node removal. With the Evictor off, Coral still drains nodes while Node optimization is on.",
          },
          {
            kind: "p",
            text: "The Evictor moves pods off lightly used nodes, and has its own switch in Settings → General. In “Dry run”, it only writes the nodes it would empty to the Event log.",
          },
          {
            kind: "p",
            text: "**What to do:** Switch Node optimization on. When you are ready for the Evictor to move pods, switch it on and untick “Dry run”.",
          },
        ],
      },
      {
        title: "Check the node’s pool is enabled",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** the pool’s “Enabled” switch in Configuration → Node pools.",
          },
          {
            kind: "p",
            text: "**What it means:** When it is off, Coral leaves that pool’s nodes alone.",
          },
          { kind: "p", text: "**What to do:** Switch the pool on if Coral may empty its nodes." },
        ],
      },
      {
        title: "Check what is holding the node",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** Node list → “What’s holding them”. Its “Nodes held” figure counts the nodes Coral can’t empty.",
          },
          {
            kind: "p",
            text: "**What it means:** A held node is one Coral won’t empty, because a pod on it can’t be moved safely. The common reasons, and the fix for each, are below. How each one holds a node in Kubernetes is in [Cluster Autoscaler not scaling down](/learn/cluster-autoscaler-not-scaling-down).",
          },
          {
            kind: "table",
            head: ["Reason", "Fix"],
            rows: [
              [
                "The PodDisruptionBudget allows no disruption.",
                "Add replicas or relax the PodDisruptionBudget.",
              ],
              [
                "A kube-system pod has no PodDisruptionBudget.",
                "Add a PodDisruptionBudget that allows at least one disruption.",
              ],
              [
                "Data on the node’s own disk (hostPath).",
                "Move the data to a persistent volume, or mark the pod safe to evict.",
              ],
              ["Nothing would recreate the pod.", "Run it under a Deployment or StatefulSet."],
              [
                "Marked do-not-disrupt, not safe to evict, or excluded.",
                "Remove the marker if moving it is fine.",
              ],
            ],
            widths: ["50%", "50%"],
          },
          {
            kind: "p",
            text: "**What to do:** Apply the fix for each reason. These markers keep a pod, or its node, in place:",
          },
          {
            kind: "ul",
            items: [
              '`karpenter.sh/do-not-disrupt: "true"`, on a pod or a node.',
              '`cluster-autoscaler.kubernetes.io/safe-to-evict: "false"`, on a pod.',
              '`coral.zoorik.com/removal-disabled: "true"`, on a node or a pod.',
            ],
          },
          {
            kind: "p",
            text: "Which autoscaler reads which marker is in [Safe-to-evict and do-not-disrupt](/learn/safe-to-evict-do-not-disrupt).",
          },
        ],
      },
      {
        title: "Check the other nodes have room",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** the room on the cluster’s other Ready nodes, and the Optimization constraints page.",
          },
          {
            kind: "p",
            text: "**What it means:** Before it moves anything, the agent checks the live cluster. Every pod on the node must fit on another Ready node, with its affinity, taints, spread, ports and zones. If a pod doesn’t fit, the node stays.",
          },
          {
            kind: "p",
            text: "**What to do:** If the other nodes have no room, the node is still needed. If placement rules hold a pod here, open Optimization constraints. It lists workload setups that make optimization risky, such as topology spread, with the fix for each.",
          },
        ],
      },
      {
        title: "Check the pool is above its minimum",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** how many nodes the pool has, and your autoscaler’s minimum for it.",
          },
          {
            kind: "p",
            text: "**What it means:** Every pool keeps at least one node. Coral also respects your autoscaler’s minimum pool size.",
          },
          {
            kind: "p",
            text: "By default, the agent may reduce a pool’s minimum. With the Terraform module’s `lower_minimums = false`, it can’t.",
          },
          { kind: "p", text: "**What to do:** The last node in a pool stays." },
          {
            kind: "ul",
            items: [
              "If you set `lower_minimums = false`, set it back to `true`, the default, to let the agent reduce the minimum.",
              "If Terraform manages your node pools, each apply undoes what the agent changes. Tell Terraform to ignore those fields in your own code, as [Your own node pool code](/docs/install-coral-with-terraform#your-own-node-pool-code) shows.",
            ],
          },
        ],
      },
      {
        title: "Check who removes the empty node",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** a node Coral has emptied that is still in the cluster.",
          },
          {
            kind: "p",
            text: "**What it means:** Coral empties the node, and your autoscaler removes it.",
          },
          {
            kind: "ul",
            items: [
              "After “Wait before removing empty nodes”, Coral hands the empty node to your autoscaler. Its own timers decide when the node goes.",
              "Pools that Karpenter or NAP already consolidates are left to them.",
              "Coral deletes the machine itself only in fixed-size pools that nothing else manages.",
            ],
          },
          {
            kind: "p",
            text: "**What to do:** Check your autoscaler’s own settings. To change Coral’s wait, set “Wait before removing empty nodes” in Configuration → Node scaling.",
          },
          {
            kind: "p",
            text: "For a fixed-size pool, Coral needs the permission to remove nodes. If you declined it at connect, run:",
          },
          { kind: "cmd", text: "zoorikctl cluster grant-node-deletion" },
          {
            kind: "p",
            text: "If you installed with Helm, [Install Coral with Terraform + Helm](/docs/install-coral-with-terraform) creates the same permission as code.",
          },
        ],
      },
      {
        title: "Check the node is not cordoned",
        blocks: [
          { kind: "p", text: "**Look at:** the node’s state, and any cluster upgrade under way." },
          {
            kind: "p",
            text: "**What it means:** Coral skips cordoned, NotReady and deleting nodes. It never drains a node someone else cordoned. During a cluster upgrade, it keeps working but stays out of the upgrade’s way.",
          },
          {
            kind: "p",
            text: "**What to do:** If you cordoned the node yourself, Coral leaves it to you. Uncordon it if Coral may empty it. During an upgrade window, we recommend pausing Node optimization and the Evictor.",
          },
        ],
      },
      {
        title: "Check the drain finished",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** the Event log, which lists everything Coral did or saw, newest first.",
          },
          {
            kind: "p",
            text: "**What it means:** Coral cordons and drains one node at a time. If a drain can’t finish in time, the node goes back into service.",
          },
          {
            kind: "p",
            text: "**What to do:** Find the node in the Event log. Then check what is holding it, as above.",
          },
        ],
      },
      {
        title: "Still stuck?",
        blocks: [
          {
            kind: "p",
            text: "The [Coral product guide](/coral/guide#node-optimization) and the [Coral FAQ](/coral/faq) have the full detail.",
          },
          {
            kind: "p",
            text: "Email founders@zoorik.com, or [pick a time to talk](https://cal.com/zoorik/talk). Tell us what Node list and the Event log show for the node. Remove tokens, keys and other secrets from anything you send.",
          },
        ],
      },
    ],
    related: [
      { text: "Coral product guide: Node optimization", href: "/coral/guide#node-optimization" },
      { text: "Coral product guide: Nodes held", href: "/coral/guide#nodes-held" },
      { text: "Coral product guide: Stay in control", href: "/coral/guide#stay-in-control" },
      {
        text: "Coral FAQ: How do you make sure node consolidation doesn’t cause scheduling failures later?",
        href: "/coral/faq#how-do-you-make-sure-node",
      },
      {
        text: "Cluster Autoscaler not scaling down: what keeps nodes running",
        href: "/learn/cluster-autoscaler-not-scaling-down",
      },
      {
        text: "The safe-to-evict and do-not-disrupt annotations explained",
        href: "/learn/safe-to-evict-do-not-disrupt",
      },
      { text: "Install Coral with Terraform + Helm", href: "/docs/install-coral-with-terraform" },
      {
        text: "Coral is not connecting to my cluster",
        href: "/docs/coral-not-connecting-to-cluster",
      },
    ],
  },
  amoebaNotShowingVm: {
    route: routes.docsAmoebaNotShowingVm,
    product: "amoeba",
    updated: troubleshootingUpdated,
    meta: {
      title: "Amoeba is not showing my VM",
      description:
        "A VM is missing from Amoeba’s onboarding list, or shows no figures? Check the connection, the VM, its data disks and the agent, with what to do for each.",
    },
    hero: {
      title: "Amoeba is not showing my VM: what to check",
      deck: "The checks to run when a VM is missing from the onboarding list, or shows no figures yet.",
    },
    short:
      "**Short answer.** Amoeba lists only running VMs with at least one data disk, from the subscriptions Zoorik can read. A VM that can’t be onboarded is counted in one line under the list, with the reason. Once you onboard a VM, its used space and savings appear after its agent reports.",
    sections: [
      {
        title: "Read the line under the list",
        blocks: [
          { kind: "p", text: "**Look at:** “Onboard VMs”, and the line under the list." },
          {
            kind: "p",
            text: "**What it means:** VMs that can’t be onboarded are counted in one line under the list, with the reason. For example, the VM is stopped, or it has only an OS disk.",
          },
          {
            kind: "p",
            text: "**What to do:** Fix the reason shown, then open “Onboard VMs” again. The checks below explain what each requirement means.",
          },
        ],
      },
      {
        title: "Check the cloud connection",
        blocks: [
          { kind: "p", text: "**Look at:** the connection’s state in the console." },
          { kind: "p", text: "**What it means:**" },
          {
            kind: "table",
            head: ["State", "What it means"],
            rows: [
              [
                "Verifying",
                "Zoorik can’t read a subscription yet. The console says why: Zoorik’s app isn’t in your directory yet, the role isn’t assigned, or the directory wasn’t found.",
              ],
              ["Connected", "Zoorik reads your subscriptions through the role."],
              [
                "Access lost",
                "Zoorik lost read access to a subscription. Figures from Azure keep their last value, with its date, and onboarding waits.",
              ],
            ],
            widths: ["24%", "76%"],
          },
          { kind: "p", text: "**What to do:**" },
          {
            kind: "ul",
            items: [
              "For “Verifying”: run the connect script the console shows in Azure Cloud Shell, with your own Azure sign-in. Then click “Verify”.",
              "The script adds Zoorik’s app to your directory, creates the role “Zoorik Storage Operator”, and assigns it on each subscription you name. You need permission to do all three.",
              "If the directory wasn’t found, check the directory (tenant) ID you entered in “Connect Azure”.",
              "For “Access lost”: check the role is still assigned to Zoorik’s app on that subscription. If it isn’t, run the connect script again. Zoorik checks access again regularly.",
            ],
          },
        ],
      },
      {
        title: "Check the VM’s subscription is included",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** the subscriptions you named when you ran the connect script.",
          },
          {
            kind: "p",
            text: "**What it means:** The script assigns the role only on the subscriptions you name. Zoorik acts in your Azure only through that role.",
          },
          {
            kind: "p",
            text: "**What to do:** Run the script for the VM’s subscription too. Then click “Verify” again: it picks up the subscriptions you added since.",
          },
        ],
      },
      {
        title: "Check the VM is running and has a data disk",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** the VM in Azure: whether it is running, and its disks.",
          },
          {
            kind: "p",
            text: "**What it means:** Amoeba lists only running VMs with at least one data disk. It works on data disks and never touches the OS disk. The data on those disks must sit on mounted filesystems.",
          },
          {
            kind: "p",
            text: "**What to do:** Start a stopped VM, then open “Onboard VMs” again. A VM with only an OS disk has nothing for Amoeba to move.",
          },
        ],
      },
      {
        title: "Give the list a moment",
        blocks: [
          { kind: "p", text: "**Look at:** a VM you just created, started or changed." },
          {
            kind: "p",
            text: "**What it means:** The list comes from Azure Resource Graph, which can take a little while to catch up with changes.",
          },
          { kind: "p", text: "**What to do:** Open “Onboard VMs” again a little later." },
        ],
      },
      {
        title: "On AWS, check the instance",
        blocks: [
          { kind: "p", text: "**Look at:** the EC2 instance, and how the account is connected." },
          {
            kind: "p",
            text: "**What it means:** Amoeba works on EC2 instances that are running and managed by AWS Systems Manager, with the SSM agent connected. Each must be a Nitro type that exposes EBS as NVMe, with at least one EBS data volume. The account connects with its AWS account ID and the IAM role ZoorikStorageOperator.",
          },
          {
            kind: "p",
            text: "**What to do:** Connect the instance to Systems Manager, and check its type and volumes. If the account isn’t connected yet, run the script in AWS CloudShell that creates the role.",
          },
        ],
      },
      {
        title: "Check the agent has reported",
        blocks: [
          { kind: "p", text: "**Look at:** the VM’s agent on Overview, and its figures." },
          {
            kind: "p",
            text: "**What it means:** Amoeba installs its agent on each VM you onboard, through Azure Run Command or AWS Systems Manager. The VM’s agent reads “Installing”, then “Connected” once its first report arrives. Until then, used space and savings read “Available once the agent reports”.",
          },
          {
            kind: "p",
            text: "**What to do:** Wait for the first report. Each VM must be able to reach Zoorik, for the agent’s reports and commands, and the sites the agent downloads from.",
          },
        ],
      },
      {
        title: "If the install failed or the agent stopped",
        blocks: [
          { kind: "p", text: "**Look at:** “Needs you” on Overview, and the VM’s Settings page." },
          { kind: "p", text: "**What it means:**" },
          {
            kind: "ul",
            items: [
              "The console says why an install failed: the script failed, Azure refused the run, or the install stalled.",
              "It also says when Zoorik can’t reach the subscription, or when the first report didn’t arrive in time.",
              "Amoeba tries again for as long as the VM stays onboarded.",
              "An agent that stops reporting reads “Disconnected”. Amoeba reinstalls it, but never during a move step or a pool operation.",
              "Until the agent reconnects, the pool stays mounted but can’t expand or shrink.",
            ],
          },
          {
            kind: "p",
            text: "**What to do:** Click “Reinstall” in Settings → Agent. It starts a new install straight away, or when the current step of the move ends. It’s available while the VM is running.",
          },
        ],
      },
      {
        title: "Still stuck?",
        blocks: [
          {
            kind: "p",
            text: "The [Amoeba product guide](/amoeba/guide) and the [Amoeba FAQ](/amoeba/faq) have the full detail.",
          },
          {
            kind: "p",
            text: "Email founders@zoorik.com, or [pick a time to talk](https://cal.com/zoorik/talk). Tell us what “Onboard VMs” and the VM’s agent show. Remove tokens, keys and other secrets from anything you send.",
          },
        ],
      },
    ],
    related: [
      { text: "Amoeba product guide: Before you start", href: "/amoeba/guide#before-you-start" },
      {
        text: "Amoeba product guide: Which VMs are listed",
        href: "/amoeba/guide#which-vms-are-listed",
      },
      { text: "Amoeba product guide: Connection states", href: "/amoeba/guide#connection-states" },
      {
        text: "Amoeba FAQ: What happens if the agent stops reporting?",
        href: "/amoeba/faq#what-happens-if-the-agent-stops",
      },
      {
        text: "Why Amoeba has not rightsized my disks yet",
        href: "/docs/amoeba-not-rightsizing-disks",
      },
    ],
  },
  amoebaNotRightsizing: {
    route: routes.docsAmoebaNotRightsizing,
    product: "amoeba",
    updated: troubleshootingUpdated,
    meta: {
      title: "Why Amoeba has not rightsized my disks yet",
      description:
        "Onboarded a VM, but its disks have not moved or shrunk? Check the agent, a paused move, the Linux needs and the shrink setting, with what to do for each.",
    },
    hero: {
      title: "Why Amoeba has not rightsized my disks yet",
      deck: "The checks to run when a VM is onboarded, but its data has not moved onto a pool or the pool has not shrunk.",
    },
    short:
      "**Short answer.** Amoeba rightsizes a VM’s disks in two stages. First it moves the data onto one btrfs pool sized to your data, then it grows and shrinks the pool with your data. The checks below cover what holds each stage back, in order.",
    sections: [
      {
        title: "Check the agent is reporting",
        blocks: [
          { kind: "p", text: "**Look at:** the VM’s status and its agent on Overview." },
          {
            kind: "p",
            text: "**What it means:** The move onto the pool starts by itself after the agent’s first report. “Ready for a pool” means the agent has reported. While the agent isn’t reporting, the pool can’t expand or shrink.",
          },
          {
            kind: "p",
            text: "**What to do:** If the agent hasn’t reported, or reads “Disconnected”, see [Amoeba is not showing my VM](/docs/amoeba-not-showing-my-vm).",
          },
        ],
      },
      {
        title: "Check whether Amoeba declined the VM",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** the VM’s status, and the Disks page, which shows how many data-disk slots are in use.",
          },
          {
            kind: "p",
            text: "**What it means:** During the move, the pool’s disks attach beside the old disks, so the VM needs a few free disk slots. A VM Amoeba declines, for example one with too few slots, shows why and stays on its own disks. Amoeba doesn’t move a VM that uses Azure Disk Encryption as it is.",
          },
          {
            kind: "p",
            text: "**What to do:** Make room for the pool’s disks. For a VM that uses Azure Disk Encryption, email us.",
          },
        ],
      },
      {
        title: "Check whether the move paused",
        blocks: [
          { kind: "p", text: "**Look at:** Pool → Migration, and “Needs you” on Overview." },
          {
            kind: "p",
            text: "**What it means:** The move pauses when a step can’t go on safely. For example, the VM can’t take a pool, a copy fails, or Amoeba can’t tell whether the switch worked. A disk error found after the switch also pauses it.",
          },
          { kind: "p", text: "Pool → Migration shows where it paused and why." },
          {
            kind: "p",
            text: "**What to do:** Fix the reason shown. “Resume” appears when the move can run again: click it. If Amoeba can’t tell whether the switch worked, the move waits for you to click “Resume”.",
          },
        ],
      },
      {
        title: "Check the Linux requirements",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** on a Linux VM, its kernel, its packages and its services.",
          },
          { kind: "p", text: "**What it means:**" },
          {
            kind: "ul",
            items: [
              "The kernel must be recent and support btrfs, built in or as a module. Amoeba loads the module if it isn’t loaded. If the kernel has no btrfs, the move pauses.",
              "The agent needs rsync, btrfs-progs and psmisc. The installer doesn’t add them.",
              "Every process that keeps a data mount open must run as a systemd service. Otherwise the switch can’t finish.",
              "The agent needs cgroup v2 to read disk load. Without it, the copy can’t slow down when your apps are busy.",
              "Amoeba checks the running kernel, never the OS name.",
            ],
          },
          {
            kind: "p",
            text: "**What to do:** Install the missing packages, and run each service that uses a data mount under systemd. Then click “Resume” if the move paused.",
          },
        ],
      },
      {
        title: "Check the shrink setting",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** “When Zoorik shrinks” in Settings → Shrinking, and the Operations page.",
          },
          {
            kind: "p",
            text: "**What it means:** In “Auto”, the default, each shrink starts by itself when the pool is quiet. In “Manual”, a shrink waits for you on Operations as “Waiting for you”, and Overview lists it under “Needs you”. Expands are automatic either way.",
          },
          {
            kind: "p",
            text: "**What to do:** Click “Start shrink” on Operations. Or set “When Zoorik shrinks” to “Auto”, and click “Save”.",
          },
        ],
      },
      {
        title: "Give it time after the move",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** when the move finished, and how your data has changed since.",
          },
          {
            kind: "p",
            text: "**What it means:** A shrink waits until the move is done and Amoeba has watched your data for long enough. It runs when your data goes down and stays down. Meanwhile, the pool still grows before it fills.",
          },
          {
            kind: "p",
            text: "**What to do:** Nothing. Operations logs each expand and shrink, with its outcome and reason.",
          },
        ],
      },
      {
        title: "Read why a shrink can’t run",
        blocks: [
          {
            kind: "p",
            text: "**Look at:** Operations. In “Manual”, a shrink that fails a check reads “Can’t shrink now”, with the reason.",
          },
          { kind: "p", text: "**What it means, and what to do:**" },
          {
            kind: "table",
            head: ["Reason", "What to do"],
            rows: [
              [
                "No smaller layout would hold your data with room to grow.",
                "Nothing. Amoeba shrinks when your data goes down and stays down.",
              ],
              [
                "The pool is filling too fast to move the data safely.",
                "Nothing. Amoeba grows the pool before it fills.",
              ],
              [
                "The other disks couldn’t keep up with the VM’s disk load.",
                "Nothing. Amoeba doesn’t shrink a pool when the disks that stay couldn’t serve your load.",
              ],
              [
                "Amoeba is waiting for disk-load readings from the agent.",
                "Check the agent is reporting. On Linux, the agent needs cgroup v2 to read disk load.",
              ],
              [
                "The VM’s kernel is too old, or doesn’t support btrfs.",
                "Use a recent kernel that supports btrfs.",
              ],
              [
                "The pool reports disk errors.",
                "Email us. Amoeba never shrinks a pool that reports disk errors.",
              ],
              [
                "The VM size isn’t in Azure’s size list for its region yet.",
                "Email us if it stays.",
              ],
            ],
            widths: ["50%", "50%"],
          },
        ],
      },
      {
        title: "Still stuck?",
        blocks: [
          {
            kind: "p",
            text: "The [Amoeba product guide](/amoeba/guide) and the [Amoeba FAQ](/amoeba/faq) have the full detail.",
          },
          {
            kind: "p",
            text: "Email founders@zoorik.com, or [pick a time to talk](https://cal.com/zoorik/talk). Tell us what Pool → Migration and Operations show. Remove tokens, keys and other secrets from anything you send.",
          },
        ],
      },
    ],
    related: [
      {
        text: "Amoeba product guide: Moving a VM onto its pool",
        href: "/amoeba/guide#moving-a-vm-onto-its-pool",
      },
      {
        text: "Amoeba product guide: What stops a shrink",
        href: "/amoeba/guide#what-stops-a-shrink",
      },
      { text: "Amoeba product guide: Stay in control", href: "/amoeba/guide#stay-in-control" },
      {
        text: "Amoeba FAQ: Which Linux distributions does Amoeba support?",
        href: "/amoeba/faq#which-linux-distributions-does-amoeba-support",
      },
      { text: "Amoeba is not showing my VM", href: "/docs/amoeba-not-showing-my-vm" },
    ],
  },
};
