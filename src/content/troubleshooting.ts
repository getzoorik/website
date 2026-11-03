import { routes } from "@/config/site";
import type { OpenSourceGuide } from "@/content/open-source";

/**
 * The two troubleshooting pages, one per product: /coral-troubleshooting and /amoeba-troubleshooting. Each is a check
 * list in the docs guide frame (`OsGuidePage`, the install guides' frame): one section per symptom, opening on its
 * short answer, with each check under it as an h3 (the cause, then the fix), then "Still stuck?" and the foot links.
 * The symptoms keep their first headings' addresses (`id`), so older links still land. Text is the guides'
 * markup-lite: `code`, **bold** and [text](href).
 *
 * 🔴 PRODUCT LEVEL, CLIENT SOURCES ONLY. Every check traces to a line in the client-facing guides, FAQs and install
 * guides, never to an internal document: no thresholds, no internal timings, no phase names, no slot counts. Re-read
 * those sources before changing a line.
 */

/** The printed date ("Updated 2 November 2026"), which the sitemap gives both pages too. */
export const troubleshootingUpdated = "3 November 2026";

export type TroubleshootingId = "coral" | "amoeba";

export const troubleshootingGuides: Readonly<Record<TroubleshootingId, OpenSourceGuide>> = {
  coral: {
    route: routes.coralTroubleshooting,
    product: "coral",
    updated: troubleshootingUpdated,
    meta: {
      title: "Coral troubleshooting",
      description:
        "What to check, in order, when Coral won’t connect to an AKS or EKS cluster or doesn’t remove a node, and the fix for each.",
    },
    hero: {
      title: "Coral troubleshooting",
      deck: "What to check, in order, when a cluster won’t connect or a node isn’t removed.",
    },
    sections: [
      {
        title: "Cluster not connecting",
        id: "coral-is-not-connecting-to-my-cluster",
        blocks: [
          {
            kind: "p",
            text: "**Short answer.** Coral connects when the cluster is supported, you have the right access, the connect command is new, and the cluster can reach Zoorik. The cluster then appears on Overview, and its figures follow within minutes.",
          },
          { kind: "h3", text: "Supported cluster" },
          {
            kind: "p",
            text: "Coral works on AKS and EKS, on Kubernetes 1.30 or later, with at least one Linux node on amd64 or arm64. Other clusters connect as “Local”, without cloud prices.",
          },
          { kind: "h3", text: "Cluster access" },
          {
            kind: "p",
            text: "Run connect as a user with cluster-admin. Add `--kube-context <name>` to pick the cluster.",
          },
          { kind: "h3", text: "Connect token" },
          {
            kind: "p",
            text: "The command carries a connect token that works once and expires after one hour. Copy a new command from “Connect cluster” on Overview. With Helm, pass a new token:",
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
          { kind: "h3", text: "Cloud tools and permissions" },
          {
            kind: "p",
            text: "Connect needs these tools and permissions:",
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
                "Create IAM roles and EKS Pod Identity associations",
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
            text: "Sign in or get these permissions, then run the command again. zoorikctl lists every cloud change and asks you once. To review them first, add `--dry-run`: it prints every cloud command and everything the agent setup installs, and changes nothing.",
          },
          { kind: "h3", text: "Network access" },
          {
            kind: "p",
            text: "The agent starts its connection to Zoorik itself, and nothing connects into the cluster. Allow outbound HTTPS to:",
          },
          {
            kind: "ul",
            items: [
              "Zoorik, for the agent’s connection.",
              "`ghcr.io` and `pkg-containers.githubusercontent.com`, for the images.",
              "Your cloud’s APIs, for node removal: Azure Resource Manager and Entra ID, or AWS STS and Auto Scaling.",
            ],
          },
          { kind: "h3", text: "Cloud changes" },
          {
            kind: "p",
            text: "If you declined the cloud changes, the agent still installs. Pools an autoscaler runs are optimized as usual. Fixed-size pools wait for the permission to remove nodes. Grant it when you are ready:",
          },
          { kind: "cmd", text: "zoorikctl cluster grant-node-deletion" },
          {
            kind: "p",
            text: "On AKS, connect turns on NAP only when the cluster has no autoscaler. NAP needs Azure CNI and doesn’t work with kubenet. On kubenet with no autoscaler, nothing adds nodes until you set one up. To set up an autoscaler later, run `zoorikctl cluster prepare`.",
          },
          { kind: "h3", text: "Waiting for the first report" },
          {
            kind: "p",
            text: "After you approve, zoorikctl installs the agent and waits for it to register. Until data arrives, pages read “Waiting for the agent’s first report…”, then “Calculating” or “Fetching prices”. They update by themselves. If a page keeps waiting, check network access.",
          },
          { kind: "h3", text: "Helm install problems" },
          {
            kind: "p",
            text: "If you installed with the coral-agent Helm chart instead of zoorikctl:",
          },
          {
            kind: "table",
            head: ["If", "Why", "Fix"],
            rows: [
              [
                "You installed into `zoorik-agent` or `zoorik-node`",
                "The chart creates those namespaces itself, so the install fails with an ownership error.",
                "Install the release in another namespace, such as `default`.",
              ],
              [
                "zoorikctl connected the cluster before",
                "Helm won’t take over the objects zoorikctl created.",
                "Run `zoorikctl cluster disconnect`, then install with a new connect token.",
              ],
              [
                "`controlPlaneUrl` has a path or a trailing slash",
                "It takes the base address only, as the console shows it.",
                "Remove the path and the slash.",
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
          { kind: "h3", text: "“Not reporting”" },
          {
            kind: "p",
            text: "A disconnected cluster stays in the console as “Not reporting”, with the data Zoorik already received. To bring it back, connect it again with a new command from “Connect cluster”. If nobody disconnected it, email us.",
          },
          { kind: "h3", text: "“Re-run connect”" },
          {
            kind: "p",
            text: "The agent updates itself to each Zoorik release, but can’t give itself new permissions. When a release needs more, the “Agent release” card on the cluster’s Dashboard shows “Re-run connect”. Run the connect command again.",
          },
          {
            kind: "p",
            text: "An agent that Argo CD, Flux or Helm manages doesn’t update itself. With Helm, `helm upgrade` to a newer chart version updates it.",
          },
        ],
      },
      {
        title: "Node not removed",
        id: "coral-is-not-removing-a-node",
        blocks: [
          {
            kind: "p",
            text: "**Short answer.** A node usually stays because a switch is off, a pod can’t move safely, other nodes lack room, or the pool is at its minimum. Node list → “What’s holding them” gives the reason for each held node. An emptied node can also be waiting for your autoscaler.",
          },
          { kind: "h3", text: "Switches" },
          {
            kind: "table",
            head: ["Switch", "Where", "While it is off"],
            rows: [
              ["Node optimization", "Settings", "Coral plans no node removal."],
              [
                "Pool “Enabled”",
                "Configuration → Node pools",
                "Coral leaves that pool’s nodes alone.",
              ],
              [
                "Evictor",
                "Settings → General",
                "The Evictor moves no pods. Consolidation still drains nodes while Node optimization is on.",
              ],
            ],
            widths: ["26%", "30%", "44%"],
          },
          {
            kind: "p",
            text: "Switch on Node optimization and each pool Coral may empty. The Evictor moves pods off lightly used nodes. In “Dry run”, under its “Advanced settings”, it only lists the nodes it would empty in the Event log. To let it move pods, switch it on and untick “Dry run”.",
          },
          { kind: "h3", text: "Held nodes" },
          {
            kind: "p",
            text: "A held node has a pod that can’t move safely. The common reasons, and the fix for each:",
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
          { kind: "p", text: "These markers keep a pod, or its node, in place:" },
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
            text: "How each reason holds a node in Kubernetes: [Cluster Autoscaler not scaling down](/learn/cluster-autoscaler-not-scaling-down). Which autoscaler reads which marker: [Safe-to-evict and do-not-disrupt](/learn/safe-to-evict-do-not-disrupt).",
          },
          { kind: "h3", text: "Room on other nodes" },
          {
            kind: "p",
            text: "Before it moves anything, the agent checks the live cluster. Every pod on the node must fit on another Ready node, with its affinity, taints, spread, ports and zones. If one doesn’t fit, the node is still needed and stays.",
          },
          {
            kind: "p",
            text: "If placement rules hold a pod, open Optimization constraints. It lists workload setups that make optimization risky, such as topology spread, with the fix for each.",
          },
          { kind: "h3", text: "Pool minimum" },
          {
            kind: "p",
            text: "Every pool keeps at least one node, so the last node in a pool stays. Coral never raises your autoscaler’s minimum. By default, it may reduce a minimum that alone keeps an emptied node.",
          },
          {
            kind: "ul",
            items: [
              "With the Terraform module’s `lower_minimums = false`, Coral can’t. Set it back to `true`, the default.",
              "If Terraform manages your node pools, each apply undoes the agent’s change. Tell Terraform to ignore those fields, as [Your own node pool code](/docs/install-coral-with-terraform#your-own-node-pool-code) shows.",
            ],
          },
          { kind: "h3", text: "Empty node still running" },
          { kind: "p", text: "Coral empties the node. Who removes it depends on the pool:" },
          {
            kind: "ul",
            items: [
              "After “Wait before removing empty nodes”, set in Configuration → Node scaling, Coral hands the node to your autoscaler. Its own timers decide when the node goes.",
              "Pools that Karpenter or NAP already consolidates are left to them.",
              "In fixed-size pools that nothing else manages, Coral deletes the machine itself. That needs the permission to remove nodes.",
            ],
          },
          {
            kind: "p",
            text: "Check your autoscaler’s own settings. If you declined the permission at connect, grant it:",
          },
          { kind: "cmd", text: "zoorikctl cluster grant-node-deletion" },
          {
            kind: "p",
            text: "With Helm, [Install Coral with Terraform + Helm](/docs/install-coral-with-terraform) creates the same permission as code.",
          },
          { kind: "h3", text: "Cordoned nodes" },
          {
            kind: "p",
            text: "Coral skips cordoned, NotReady and deleting nodes, and never drains a node someone else cordoned. If you cordoned the node and Coral may empty it, uncordon it.",
          },
          {
            kind: "p",
            text: "During a cluster upgrade, Coral keeps working but stays out of the upgrade’s way. We recommend pausing Node optimization and the Evictor for the upgrade window.",
          },
          { kind: "h3", text: "Drain not finished" },
          {
            kind: "p",
            text: "Coral cordons and drains one node at a time. If a drain can’t finish in time, the node goes back into service. Find the node in the Event log, which lists everything Coral did or saw, newest first. Then see Held nodes for what keeps it.",
          },
        ],
      },
      {
        title: "Still stuck?",
        blocks: [
          {
            kind: "p",
            text: "The [Coral product guide](/coral-guide) and the [Coral FAQ](/coral-faq) have the full detail.",
          },
          {
            kind: "p",
            text: "Email founders@zoorik.com, or [pick a time to talk](https://cal.com/zoorik/talk). Tell us what you ran and what the console shows. For a node, add what Node list and the Event log show. Remove tokens, keys and other secrets first.",
          },
        ],
      },
    ],
    related: [
      { text: "Coral product guide: Before you start", href: "/coral-guide#before-you-start" },
      { text: "Coral product guide: Connect a cluster", href: "/coral-guide#connect-a-cluster" },
      {
        text: "Coral FAQ: What does connecting a cluster change?",
        href: "/coral-faq#what-does-connecting-a-cluster-change",
      },
      { text: "Coral product guide: Nodes held", href: "/coral-guide#nodes-held" },
      {
        text: "Coral FAQ: How does Coral avoid scheduling failures?",
        href: "/coral-faq#how-do-you-make-sure-node",
      },
      { text: "Coral product guide: Stay in control", href: "/coral-guide#stay-in-control" },
      { text: "Install Coral with Helm", href: "/docs/install-coral-with-helm" },
      { text: "Install Coral with Terraform + Helm", href: "/docs/install-coral-with-terraform" },
    ],
  },
  amoeba: {
    route: routes.amoebaTroubleshooting,
    product: "amoeba",
    updated: troubleshootingUpdated,
    meta: {
      title: "Amoeba troubleshooting",
      description:
        "What to check, in order, when Amoeba doesn’t list a VM or EC2 instance or hasn’t rightsized its disks yet, and the fix for each.",
    },
    hero: {
      title: "Amoeba troubleshooting",
      deck: "What to check, in order, when a VM is missing or its disks aren’t rightsized yet.",
    },
    sections: [
      {
        title: "VM not showing",
        id: "amoeba-is-not-showing-my-vm",
        blocks: [
          {
            kind: "p",
            text: "**Short answer.** Amoeba lists only running VMs with at least one data disk, from the Azure subscriptions Zoorik can read. The line under the list gives the reason for any VM it can’t onboard. On AWS, it works on running EC2 instances that Systems Manager manages. Used space and savings appear once the VM’s agent reports.",
          },
          { kind: "h3", text: "Onboarding list" },
          {
            kind: "p",
            text: "The line under “Onboard VMs” gives the reason, such as a stopped VM or one with only an OS disk. Amoeba works only on data disks, never the OS disk, and their data must sit on mounted filesystems.",
          },
          {
            kind: "p",
            text: "Fix the reason, for example start the VM, then open “Onboard VMs” again. On Azure, the list comes from Azure Resource Graph and can be a little behind. If you just created, started or changed the VM, try again a little later.",
          },
          { kind: "h3", text: "Azure connection" },
          {
            kind: "table",
            head: ["State", "What it means"],
            rows: [
              [
                "Verifying",
                "Zoorik can’t read a subscription yet. The console says why: Zoorik’s app isn’t in your directory, the role isn’t assigned, or the directory wasn’t found.",
              ],
              ["Connected", "Zoorik reads your subscriptions through the role."],
              [
                "Access lost",
                "Zoorik lost read access to a subscription. Figures from Azure keep their last value, with its date, and onboarding waits.",
              ],
            ],
            widths: ["24%", "76%"],
          },
          {
            kind: "ul",
            items: [
              "**Verifying:** run the connect script the console shows in Azure Cloud Shell, with your own Azure sign-in, then click “Verify”. The script adds Zoorik’s app to your directory, creates the role “Zoorik Storage Operator” and assigns it on each subscription you name. You need permission for all three.",
              "**Directory not found:** check the directory (tenant) ID you entered in “Connect Azure”.",
              "**Access lost:** check the role is still assigned to Zoorik’s app on that subscription. If it isn’t, run the connect script again. Zoorik checks access again regularly.",
            ],
          },
          { kind: "h3", text: "Subscription not included" },
          {
            kind: "p",
            text: "The script assigns the role only on the subscriptions you name, and Zoorik acts in your Azure only through that role. Run the script for the VM’s subscription too, then click “Verify” again to pick it up.",
          },
          { kind: "h3", text: "EC2 instances" },
          {
            kind: "p",
            text: "On AWS, Amoeba works on running EC2 instances managed by AWS Systems Manager, with the SSM agent connected. Each must be a Nitro type that exposes EBS as NVMe, with at least one EBS data volume.",
          },
          {
            kind: "p",
            text: "Connect the instance to Systems Manager, and check its type and volumes. If the account isn’t connected, enter its AWS account ID, then run the script in AWS CloudShell that creates the IAM role `ZoorikStorageOperator`.",
          },
          { kind: "h3", text: "Waiting for the first report" },
          {
            kind: "p",
            text: "Amoeba installs its agent on each VM you onboard, through Azure Run Command or AWS Systems Manager. On Overview, the VM’s agent reads “Installing”, then “Connected” once its first report arrives. Until then, used space and savings read “Available once the agent reports”.",
          },
          {
            kind: "p",
            text: "Each VM must reach Zoorik, for the agent’s reports and commands, and the sites the agent downloads from.",
          },
          { kind: "h3", text: "Failed install or stopped agent" },
          {
            kind: "p",
            text: "The console says why an install failed: the script failed, Azure refused the run, or the install stalled. It also says when Zoorik can’t reach the subscription, or the first report didn’t arrive in time. Amoeba tries again for as long as the VM stays onboarded.",
          },
          {
            kind: "p",
            text: "An agent that stops reporting reads “Disconnected”. Amoeba reinstalls it, but never during a move step or a pool operation. Until it reconnects, the pool stays mounted but can’t expand or shrink.",
          },
          {
            kind: "p",
            text: "“Needs you” on Overview lists agents to reinstall. To reinstall now, click “Reinstall” in Settings → Agent while the VM is running. It starts straight away, or when the current move step ends.",
          },
        ],
      },
      {
        title: "Disks not rightsized",
        id: "amoeba-has-not-rightsized-my-disks-yet",
        blocks: [
          {
            kind: "p",
            text: "**Short answer.** Amoeba first moves a VM’s data onto one btrfs pool sized to your data, then grows and shrinks the pool with it. A move can wait on the agent, free disk slots, a pause or a Linux requirement. A shrink waits until your data goes down and stays down, or for you in “Manual”.",
          },
          { kind: "h3", text: "Agent not reporting" },
          {
            kind: "p",
            text: "The move starts by itself after the agent’s first report, and “Ready for a pool” means it has reported. While the agent isn’t reporting, the pool can’t expand or shrink. If it hasn’t reported, or reads “Disconnected”, see [VM not showing](#amoeba-is-not-showing-my-vm).",
          },
          { kind: "h3", text: "Declined VM" },
          {
            kind: "p",
            text: "During the move, the pool’s disks attach beside the source disks, so the VM needs a few free disk slots. A VM Amoeba declines, for example one with too few slots, shows why and stays on its own disks. The Disks page shows how many data-disk slots are in use.",
          },
          {
            kind: "p",
            text: "Free some disk slots for the pool. Amoeba doesn’t move a VM that uses Azure Disk Encryption as it is. For one of those, email us.",
          },
          { kind: "h3", text: "Paused move" },
          {
            kind: "p",
            text: "The move pauses when a step can’t go on safely. For example, the VM can’t take a pool, a copy fails, or Amoeba can’t tell whether the switch worked. A disk error found after the switch also pauses it. Pool → Migration shows where it paused and why.",
          },
          {
            kind: "p",
            text: "Fix the reason shown, then click “Resume” when it appears. If Amoeba couldn’t tell whether the switch worked, the move waits for you to click “Resume”.",
          },
          { kind: "h3", text: "Linux requirements" },
          { kind: "p", text: "A Linux VM needs:" },
          {
            kind: "ul",
            items: [
              "A recent kernel with btrfs, built in or as a module. Amoeba loads the module if it isn’t loaded. Without btrfs, the move pauses.",
              "rsync, btrfs-progs and psmisc. The installer doesn’t add them.",
              "Every process that keeps a data mount open to run as a systemd service. Otherwise the switch can’t finish.",
              "cgroup v2, for the agent’s disk-load readings. Without it, the copy doesn’t slow down when your apps are busy.",
            ],
          },
          {
            kind: "p",
            text: "Amoeba checks the running kernel, never the OS name. Install what’s missing and run each service that uses a data mount under systemd. Then click “Resume” if the move paused.",
          },
          { kind: "h3", text: "Shrink timing" },
          {
            kind: "p",
            text: "A shrink waits until the move is done and Amoeba has seen enough of your use. Then it runs when your data goes down and stays down. Meanwhile, the pool still grows before it fills. Nothing needs fixing: Operations logs each expand and shrink, with its outcome and reason.",
          },
          { kind: "h3", text: "Shrink setting" },
          {
            kind: "p",
            text: "“When Zoorik shrinks”, in Settings → Shrinking, is “Auto” by default: each shrink starts by itself when the pool is quiet. In “Manual”, a shrink waits on Operations as “Waiting for you”, and Overview lists it under “Needs you”. Expands are automatic either way.",
          },
          {
            kind: "p",
            text: "Click “Start shrink” on Operations, or switch the setting to “Auto” and click “Save”.",
          },
          { kind: "h3", text: "“Can’t shrink now”" },
          {
            kind: "p",
            text: "In “Manual”, a shrink that fails a check reads “Can’t shrink now” on Operations, with the reason:",
          },
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
                "Nothing. Amoeba doesn’t shrink onto disks that couldn’t serve your load.",
              ],
              [
                "Amoeba is waiting for disk-load readings from the agent.",
                "Check the agent is reporting. On Linux, it needs cgroup v2 for these readings.",
              ],
              [
                "The VM’s kernel is too old, or doesn’t support btrfs.",
                "Use a recent kernel with btrfs.",
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
            text: "The [Amoeba product guide](/amoeba-guide) and the [Amoeba FAQ](/amoeba-faq) have the full detail.",
          },
          {
            kind: "p",
            text: "Email founders@zoorik.com, or [pick a time to talk](https://cal.com/zoorik/talk). Tell us what “Onboard VMs”, the VM’s agent, Pool → Migration and Operations show. Remove tokens, keys and other secrets first.",
          },
        ],
      },
    ],
    related: [
      { text: "Amoeba product guide: Before you start", href: "/amoeba-guide#before-you-start" },
      {
        text: "Amoeba product guide: Moving onto a pool",
        href: "/amoeba-guide#moving-a-vm-onto-its-pool",
      },
      {
        text: "Amoeba product guide: What stops a shrink",
        href: "/amoeba-guide#what-stops-a-shrink",
      },
      { text: "Amoeba product guide: Stay in control", href: "/amoeba-guide#stay-in-control" },
      {
        text: "Amoeba FAQ: What happens if the agent stops reporting?",
        href: "/amoeba-faq#what-happens-if-the-agent-stops",
      },
      {
        text: "Amoeba FAQ: Which Linux distributions does Amoeba support?",
        href: "/amoeba-faq#which-linux-distributions-does-amoeba-support",
      },
    ],
  },
};
