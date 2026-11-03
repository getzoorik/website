import { learnPath, routes } from "@/config/site";
import type { GuideContent } from "@/content/guide";

/**
 * `/amoeba-guide`: every string the Amoeba product guide prints. The PDF at
 * `/docs/amoeba-product-guide.pdf` was drawn from an earlier version of this
 * text; regenerate it when this copy changes.
 *
 * Laid out like the FAQ, as the Coral guide is: eleven groups, 34 numbered
 * rows. It describes Amoeba at product level (owner, 27 Oct 2026): what Amoeba
 * does, never its internal thresholds, sizes or timings. The move only goes
 * forward, and a VM's one setting is Auto or Manual shrinks.
 *
 * The facts the guide does not have yet are placeholders (`{ ph }`): the page
 * prints "To come: " and the description. Filling one is an edit to this file
 * alone: replace the piece with plain text, or text with bold or code.
 *
 * ─── THE ANCHOR IDS ARE A CONTRACT ─────────────────────────────────────────
 * Other pages and shared links point at these ids: the groups keep the
 * sections' ids and the rows the subsections', so a link made before the rows
 * still lands, and opens its row. Keep an id when its heading changes.
 */

/** The groups' ids, in page order. */
export const amoebaGuideSectionIds = [
  "how-amoeba-works",
  "before-you-start",
  "onboard-a-vm",
  "what-gets-installed",
  "the-console",
  "moving-a-vm-onto-its-pool",
  "expanding-and-shrinking",
  "stay-in-control",
  "savings-and-figures",
  "security-and-data",
  "remove-amoeba-from-a-vm",
] as const;

/** The rows' ids, in page order: row N is the Nth. */
export const amoebaGuideRowIds = [
  "how-amoeba-works-the-four-steps",
  "before-you-start-what-you-need",
  "onboard-a-vm-step-by-step",
  "which-vms-are-listed",
  "connection-states",
  "if-the-install-fails",
  "on-the-vm",
  "in-your-azure-subscription",
  "in-your-aws-account",
  "updates",
  "the-console-the-pages",
  "status-words",
  "how-the-pool-is-sized",
  "the-phases",
  "at-the-switch",
  "the-soak-and-going-back",
  "if-the-move-pauses",
  "when-amoeba-expands",
  "how-an-expand-runs",
  "when-amoeba-shrinks",
  "how-a-shrink-runs",
  "what-stops-a-shrink",
  "settings",
  "shrinking-by-hand",
  "go-back-and-resume",
  "a-careful-start",
  "savings-and-figures-the-figures",
  "what-the-role-allows",
  "what-leaves-the-vm",
  "how-the-agent-connects",
  "encryption",
  "sign-in",
  "going-back-during-the-soak",
  "what-amoeba-added",
] as const;

export type AmoebaGuideAnchor =
  (typeof amoebaGuideSectionIds)[number] | (typeof amoebaGuideRowIds)[number];

export const amoebaGuide: GuideContent<AmoebaGuideAnchor> = {
  meta: {
    title: "Amoeba product guide",
    description:
      "Onboard Azure and AWS VMs to Amoeba. See what it installs, how it moves data disks onto a btrfs pool, how the pool grows and shrinks, and what you control.",
  },
  hero: {
    title: "Amoeba product guide",
    deck: "Onboard an Azure or AWS VM, see what Amoeba changes, and stay in control.",
    downloads: [{ label: "PDF", document: "amoeba-guide" }],
  },
  updated: "Updated 3 November 2026",
  /* The product page first, then what Amoeba does, what it never does, and how
     you stay in control. */
  summary: [
    {
      term: "Product page",
      text: [[{ href: routes.amoeba, text: "Block storage optimization on Azure and AWS" }]],
    },
    {
      term: "What Amoeba does",
      text: [
        "Moves each VM’s data disks onto one btrfs pool sized to your data. Then it grows and shrinks the pool without any downtime, so you pay for close to what you use.",
      ],
    },
    {
      term: "What Amoeba never does",
      text: [
        "Look inside a VM you haven’t onboarded, remove a disk that still holds data, or delete a source disk before its snapshot is complete.",
      ],
    },
    {
      term: "You stay in control",
      text: [
        "You pick the VMs, and choose for each one whether shrinks run on their own or wait for you.",
        [
          "Onboarding starts the move, which briefly restarts the services on the data mounts. See ",
          { ref: "moving-a-vm-onto-its-pool", text: "“Moving onto a pool”" },
          ".",
        ],
      ],
    },
  ],
  sections: [
    {
      id: "how-amoeba-works",
      title: "How Amoeba works",
      lede: "Amoeba works on the data disks of running Windows and Linux VMs: Azure managed disks and Amazon EBS volumes. It never touches the OS disk or root volume.",
      rows: [
        {
          id: "how-amoeba-works-the-four-steps",
          title: "The four steps",
          body: [
            {
              kind: "steps",
              steps: [
                {
                  title: "Connect",
                  body: [
                    {
                      kind: "p",
                      text: "Run one script in Azure Cloud Shell or AWS CloudShell. It gives Zoorik a role on the subscriptions or account you choose.",
                    },
                  ],
                },
                {
                  title: "Onboard",
                  body: [
                    {
                      kind: "p",
                      text: "Pick the VMs Amoeba manages. It installs its agent on each one and leaves every other VM alone.",
                    },
                  ],
                },
                {
                  title: "Move onto a pool",
                  body: [
                    {
                      kind: "p",
                      text: "After the agent’s first report, Amoeba copies your data onto one btrfs pool sized to your data, while your services run.",
                    },
                    {
                      kind: "p",
                      text: "Then it switches each mount to the pool, with a short restart of the services that use it. Once the switch is checked, it snapshots and deletes each source disk.",
                    },
                  ],
                },
                {
                  title: "Autopilot",
                  body: [
                    {
                      kind: "p",
                      text: "Amoeba grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one disk at a time. Both run without any downtime.",
                    },
                    {
                      kind: "p",
                      text: "Expands run on their own. Shrinks run on their own in “Auto”, or wait for you in “Manual”.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      related: [
        {
          text: "Can you shrink an Azure managed disk?",
          href: learnPath("shrink-azure-managed-disk"),
        },
        {
          text: "How to shrink an EBS volume",
          href: learnPath("shrink-ebs-volume"),
        },
      ],
    },
    {
      id: "before-you-start",
      title: "Before you start",
      lede: "Check these before you onboard a VM.",
      rows: [
        {
          id: "before-you-start-what-you-need",
          title: "What you need",
          body: [
            {
              kind: "table",
              columns: [
                { label: "You need", width: "26%" },
                { label: "Details", width: "74%" },
              ],
              rows: [
                [
                  "A cloud account",
                  [
                    { b: "Azure:" },
                    " a Microsoft Entra directory (tenant) and the subscriptions that hold your VMs. ",
                    { b: "AWS:" },
                    " an account whose EC2 instances are managed by AWS Systems Manager, with the SSM agent connected. Each instance must be a Nitro type that exposes EBS as NVMe.",
                  ],
                ],
                [
                  "The rights to connect",
                  [
                    "On Azure, the rights to add Zoorik’s app to your directory, create a custom role and assign it on each subscription. On AWS, the rights to create an IAM role. ",
                    { ph: "the exact Azure roles needed to run the connect script" },
                  ],
                ],
                [
                  "A running VM with data disks",
                  "Amoeba lists only running VMs with at least one data disk. The data must be on mounted filesystems.",
                ],
                [
                  "Free disk slots",
                  "The pool’s disks attach beside the source disks during the move, so the VM needs a few free disk slots. If it has too few, Amoeba declines it and says why.",
                ],
                [
                  "Linux",
                  [
                    "A recent kernel that supports btrfs, built in or as a module. Amoeba checks the running kernel, never the OS name. The agent also needs rsync, btrfs-progs and psmisc, which the installer doesn’t add, and cgroup v2 for its disk-load readings. ",
                    { ph: "supported Linux distributions and versions" },
                  ],
                ],
                ["Windows", [{ ph: "supported Windows versions and what Amoeba needs on them" }]],
                [
                  "Services on data mounts",
                  "Every process that keeps a data mount open must run as a systemd service, so the agent can stop and start it at the switch.",
                ],
                [
                  "Java",
                  "Java 17 or later for the agent. If the VM has none, the installer adds OpenJDK 17 with apt, dnf, yum or zypper.",
                ],
                [
                  "Network",
                  [
                    "Outbound access from each VM to Zoorik, for the agent’s reports and commands, and to the hosts it downloads from. ",
                    {
                      ph: "hosts to allow: Zoorik, GitHub release downloads and the distribution’s package mirrors",
                    },
                  ],
                ],
                [
                  "A console account",
                  [
                    "A Microsoft or Google account to sign in. ",
                    { ph: "the Amoeba console address" },
                  ],
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "onboard-a-vm",
      title: "Onboard a VM",
      lede: "Connect your cloud once, then pick the VMs in the console.",
      callouts: [
        {
          kind: "callout",
          title: "Review it first",
          body: [
            {
              kind: "p",
              text: "Onboarding is your go-ahead. The move then runs by itself, and services on the data mounts restart at the switch.",
            },
          ],
        },
      ],
      rows: [
        {
          id: "onboard-a-vm-step-by-step",
          title: "Step by step",
          body: [
            {
              kind: "steps",
              steps: [
                {
                  title: "Open the console",
                  body: [
                    {
                      kind: "p",
                      text: [{ ph: "the Amoeba console address, and how you sign in" }],
                    },
                  ],
                },
                {
                  title: "Connect Azure or AWS",
                  body: [
                    {
                      kind: "p",
                      text: "On Azure, click “Connect Azure” and enter your directory (tenant) ID. Run the script the console shows in Azure Cloud Shell.",
                    },
                    {
                      kind: "p",
                      text: "The script adds Zoorik’s app to your directory, creates the role “Zoorik Storage Operator” and assigns it to the app on each subscription you name.",
                    },
                    {
                      kind: "well",
                      lines: [[{ ph: "the connect script, exactly as the console prints it" }]],
                      prompt: "$ ",
                    },
                    {
                      kind: "p",
                      text: "On AWS, enter your 12-digit account ID and run the script in AWS CloudShell. It creates the IAM role ZoorikStorageOperator, which trusts Zoorik’s AWS account only with your organisation’s external ID.",
                    },
                  ],
                },
                {
                  title: "Verify",
                  body: [
                    {
                      kind: "p",
                      text: "Click “Verify”. The connection reads “Verifying”, and the console keeps checking until Zoorik can read a subscription through the role. After you grant the role on more subscriptions, click “Verify” again to add them.",
                    },
                  ],
                },
                {
                  title: "Onboard VMs",
                  body: [
                    {
                      kind: "p",
                      text: "Click “Onboard VMs”. The list shows each VM Amoeba can onboard, with its resource group, region, size, and the count and total size of its data disks. Tick the VMs you want and click “Onboard”.",
                    },
                  ],
                },
                {
                  title: "The agent installs",
                  body: [
                    {
                      kind: "p",
                      text: "Amoeba installs its agent on each VM, through Azure Run Command or AWS Systems Manager. The agent reads “Installing”, then “Connected” when its first report arrives.",
                    },
                  ],
                },
                {
                  title: "The move starts",
                  body: [
                    {
                      kind: "p",
                      text: "After the agent’s first report, Amoeba plans the pool and starts the move, with no further click.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "which-vms-are-listed",
          title: "Which VMs are listed",
          body: [
            {
              kind: "ul",
              items: [
                "On Azure, the list comes from Azure Resource Graph, so it can lag a little behind Azure.",
                "Amoeba doesn’t look inside a VM, or show its used space or savings, until the VM’s agent reports.",
                [
                  "A line under the list counts the VMs that can’t be onboarded, and why. For example, a VM is stopped or has only an OS disk. ",
                  { ph: "how Windows VMs appear in the onboarding list" },
                ],
                "A VM you onboarded before keeps its settings when you onboard it again.",
              ],
            },
          ],
        },
        {
          id: "connection-states",
          title: "Connection states",
          body: [
            {
              kind: "table",
              columns: [
                { label: "State", width: "24%" },
                { label: "What it means", width: "76%" },
              ],
              rows: [
                [
                  "Verifying",
                  "Zoorik can’t read a subscription yet. The console says why: the app isn’t in the directory, the role isn’t assigned, or the directory wasn’t found.",
                ],
                ["Connected", "Zoorik reads your subscriptions through the role."],
                [
                  "Access lost",
                  "Zoorik lost read access to a subscription. Figures from Azure keep their last value, with its date, and onboarding waits. Zoorik checks access again regularly.",
                ],
              ],
            },
          ],
        },
        {
          id: "if-the-install-fails",
          title: "If the install fails",
          body: [
            {
              kind: "ul",
              items: [
                "The console shows why: the script failed, Azure refused the run, or the install stalled.",
                "It also shows when Zoorik can’t reach the subscription, or when the agent’s first report came too late.",
                "Amoeba retries, waiting longer each time, for as long as the VM stays onboarded.",
                "“Reinstall” in Settings starts a new install at once, or when the move’s current step ends.",
              ],
            },
          ],
        },
      ],
      related: [{ text: "Amoeba troubleshooting", href: routes.amoebaTroubleshooting }],
    },
    {
      id: "what-gets-installed",
      title: "What gets installed",
      lede: "Amoeba adds one agent to each VM you onboard, and its own disks and snapshots to your cloud account.",
      rows: [
        {
          id: "on-the-vm",
          title: "On the VM",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Item", width: "30%" },
                { label: "What it is", width: "70%" },
              ],
              rows: [
                [
                  ["amoeba-agent", { sub: "systemd service amoeba-agent.service" }],
                  "Reports the VM’s disks and mounts to Zoorik, and runs the move, the expands and the shrinks. Runs as root from /opt/amoeba-agent, with IO accounting on.",
                ],
                [
                  "/etc/amoeba-agent.env",
                  "The agent’s settings: its own key, Zoorik’s address and the VM’s resource ID. Readable by root only. The install command carries only a single-use token, which the installer exchanges with Zoorik for the key. A reinstall replaces the key.",
                ],
                ["Java", "OpenJDK 17, added only when the VM has no Java 17 or later."],
                ["Other packages", "curl, ca-certificates and procps, added when missing."],
                ["btrfs kernel module", "Loaded by the agent when it isn’t loaded yet."],
                [
                  "The pool",
                  "One btrfs filesystem across the pool’s disks. Each data mount becomes a subvolume on it, at the same path as before.",
                ],
                [
                  "/etc/fstab",
                  "At the switch, the agent saves a copy as /etc/fstab.amoeba-backup.<id>, then points each data mount at the pool.",
                ],
              ],
            },
          ],
        },
        {
          id: "in-your-azure-subscription",
          title: "In Azure",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Resource", width: "30%" },
                { label: "What it is", width: "70%" },
              ],
              rows: [
                [
                  ["Pool disks", { sub: "zoorik-amoeba-pool-…" }],
                  "The pool’s managed disks, which Amoeba adds, grows and removes. Everything Amoeba creates carries tags that start with amoeba-.",
                ],
                [
                  ["Safety snapshots", { sub: "zoorik-amoeba-snap-…" }],
                  "One incremental snapshot of each source disk, taken before the disk is deleted, in the disk’s own resource group. Deleted after 7 days.",
                ],
                [
                  "Zoorik Storage Operator",
                  "A custom role, assigned to Zoorik’s app on each subscription you connect. The connect script also adds the app to your directory.",
                ],
              ],
            },
          ],
        },
        {
          id: "in-your-aws-account",
          title: "In AWS",
          body: [
            {
              kind: "p",
              text: "The IAM role ZoorikStorageOperator, the pool’s gp3 volumes, and an EBS snapshot of each source volume, kept for 7 days.",
            },
          ],
        },
        {
          id: "updates",
          title: "Updates",
          body: [
            {
              kind: "ul",
              items: [
                "Amoeba updates the agent to each new release by itself.",
                "If a new version fails its health check, the installer restores the previous one.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "the-console",
      title: "The console",
      lede: "Overview lists every VM you onboarded. Pick a VM to see its pages.",
      rows: [
        {
          id: "the-console-the-pages",
          title: "The pages",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Page", width: "30%" },
                { label: "What it is for", width: "70%" },
              ],
              rows: [
                [
                  [{ b: "Overview" }],
                  "Every onboarded VM with its status, agent, disks, capacity, spend and savings. Totals for today’s disk spend, what is recoverable and what is saved to date. “Needs you” lists paused moves, shrinks waiting for you and agents to reinstall. You connect and onboard from here.",
                ],
              ],
            },
            { kind: "subhead", title: "Virtual machine" },
            {
              kind: "table",
              columns: [
                { label: "Page", width: "30%" },
                { label: "What it is for", width: "70%" },
              ],
              rows: [
                [
                  "Dashboard",
                  "The VM’s status and capacity, and its disk cost: today and with a pool, or before and now. Also its recent used space, provisioned space and IOPS.",
                ],
                [
                  "Disks",
                  "Every data disk with its LUN, pool and monthly cost, and how many disk slots are in use.",
                ],
                [
                  "Pool",
                  "“Overview”: the pool’s disks, size, use, IOPS, throughput and spend, or the plan before the move. “Migration”: the move’s phases and copy progress, and “Resume” when a paused move can run again.",
                ],
                [
                  "Operations",
                  "Expands and shrinks running now, and any shrink waiting for you in “Manual”. A log of recent expands and shrinks, with each outcome and reason.",
                ],
                [
                  "Impact",
                  "Before and now, what the pool has saved since it went live, and recent capacity and spend.",
                ],
                [
                  "Settings",
                  "“When Zoorik shrinks”, the agent’s status with “Reinstall”, and the VM’s details.",
                ],
              ],
              continuation: true,
            },
          ],
        },
        {
          id: "status-words",
          title: "Statuses",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Status", width: "30%" },
                { label: "Meaning", width: "70%" },
              ],
              rows: [
                [
                  "Pool onboarding",
                  "The move is running, waiting for the agent, or paused. The line says which phase.",
                ],
                ["Ready for a pool", "The agent has reported. The move starts by itself."],
                ["Expanding", "An expand is running."],
                ["Shrinking", "A shrink is running."],
                [
                  "Idle",
                  "The pool is live with no expand or shrink running, or a shrink is waiting for you.",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "moving-a-vm-onto-its-pool",
      title: "Moving onto a pool",
      lede: "The move starts after the agent’s first report and runs by itself. Your services keep running until a short restart at the switch.",
      rows: [
        {
          id: "how-the-pool-is-sized",
          title: "Pool sizing",
          body: [
            {
              kind: "ul",
              items: [
                "Amoeba sizes the pool to your data, with room to grow. It looks at your peak use and recent growth, not at the size of the source disks.",
                "It picks the cheapest disk layout that holds your data and carries the VM’s disk load.",
                "Each VM gets one pool, on one disk type. On Azure that is Premium SSD v2 where the VM’s region and zone offer it, and Premium SSD otherwise. On AWS it is gp3 volumes in the instance’s Availability Zone.",
                "Data on Standard SSD, Standard HDD or Ultra Disk also moves to Premium SSD v2 or Premium SSD. Per GiB, Premium disks can cost more than Standard ones.",
                "Data on zone-redundant (ZRS) disks moves to a locally redundant (LRS) pool, so it loses zone redundancy.",
              ],
            },
          ],
        },
        {
          id: "the-phases",
          title: "The phases",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Phase", width: "22%" },
                { label: "What happens", width: "78%" },
              ],
              rows: [
                ["Check and plan", "Amoeba checks the VM can take a pool, and sizes the pool."],
                [
                  "Build the pool",
                  "Amoeba creates the pool’s disks and attaches them beside the source disks.",
                ],
                [
                  "Copy",
                  "The agent copies your data onto the pool, inside the VM, while your services run. The copy slows down or waits when the VM’s disks are busy.",
                ],
                [
                  "Catch up",
                  "The agent copies what changed during the copy, until the pool has caught up.",
                ],
                [
                  "Switch",
                  "Each mount moves to the pool, with a short restart of the services that use it.",
                ],
                ["Check", "Amoeba checks the pool for disk errors. An error pauses the move."],
                [
                  "Clean up",
                  "Amoeba snapshots and deletes each source disk, then deletes each snapshot after 7 days.",
                ],
              ],
            },
          ],
        },
        {
          id: "at-the-switch",
          title: "At the switch",
          body: [
            {
              kind: "ul",
              items: [
                "The agent stops every systemd service that holds a data mount open, with systemctl stop. It never kills a process itself.",
                "It checks nothing is left to copy, saves /etc/fstab, mounts the pool at each data mount’s path and starts the services again. Your mount paths stay the same.",
                "If a step fails, the agent puts the original mounts back and starts the services again. The source disks are never written during the switch. Amoeba then retries, so your services can restart more than once.",
                [
                  {
                    ph: "what happens to writes made on the pool if a late check fails after the services restarted",
                  },
                ],
                "A process that holds a data mount open outside a systemd service can’t be stopped cleanly, so the switch can’t finish.",
              ],
            },
          ],
        },
        {
          id: "the-soak-and-going-back",
          title: "After the switch",
          body: [
            {
              kind: "ul",
              items: [
                "A move only goes forward. Amoeba deletes each source disk once its own snapshot succeeds, and only when the disk’s tag names this move.",
                "Each safety snapshot is kept for 7 days, then deleted. After that, the source disk’s data can’t be recovered.",
                [{ ph: "how to restore from a safety snapshot, and who does it" }],
                "You pay for both sets of disks only while the move runs, then for the snapshots while they’re kept.",
                "The pool can grow straight away. Shrinks wait until Amoeba has seen enough of your use after the move.",
              ],
            },
          ],
        },
        {
          id: "if-the-move-pauses",
          title: "If the move pauses",
          body: [
            {
              kind: "ul",
              items: [
                "The move pauses when a phase can’t go on safely. For example, the VM can’t take a pool, a copy fails, or the switch’s outcome can’t be known.",
                "Pool → Migration shows where it paused and why, with “Resume” once the move can run again.",
                "A VM Amoeba declines, for example one with too few free disk slots, shows why and stays on its own disks.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "expanding-and-shrinking",
      title: "Expanding and shrinking",
      lede: "Amoeba grows and shrinks each pool with your data, without any downtime. The pool stays mounted and your services keep running.",
      rows: [
        {
          id: "when-amoeba-expands",
          title: "When Amoeba expands",
          body: [
            {
              kind: "p",
              text: "Amoeba grows the pool before it fills, and sooner when data arrives fast. It also adds room when btrfs needs space for its own metadata.",
            },
            {
              kind: "p",
              text: "Expands always run on their own, in “Auto” and in “Manual”. The pool can grow during the move too, even while the move is paused.",
            },
          ],
        },
        {
          id: "how-an-expand-runs",
          title: "How an expand runs",
          body: [
            {
              kind: "ul",
              items: [
                "Amoeba grows existing disks in place, or adds new ones while the VM has a free disk slot.",
                [{ ph: "typical time from the trigger to the added capacity" }],
              ],
            },
          ],
        },
        {
          id: "when-amoeba-shrinks",
          title: "When Amoeba shrinks",
          body: [
            {
              kind: "p",
              text: "When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. A shrink waits until the move is done and Amoeba has seen enough of your use.",
            },
            {
              kind: "p",
              text: "The new size follows the same rule as a new pool: sized to your data, with room to grow. Amoeba picks the cheapest layout that passes its space, performance, saving and safety checks.",
            },
            {
              kind: "p",
              text: "In “Auto”, a shrink starts by itself when the pool is quiet. In “Manual”, it waits for you on Operations.",
            },
          ],
        },
        {
          id: "how-a-shrink-runs",
          title: "How a shrink runs",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Step", width: "30%" },
                { label: "What happens", width: "70%" },
              ],
              rows: [
                ["Check", "Amoeba picks the disk to remove and checks the shrink is still safe."],
                [
                  "Move the data",
                  "The agent moves the disk’s data onto the other disks and takes the disk out of the pool.",
                ],
                [
                  "Remove the disk",
                  "Amoeba checks the disk has left the pool, then detaches and deletes it. The disk is empty by then, so Amoeba takes no snapshot. You stop paying for it.",
                ],
              ],
            },
            {
              kind: "p",
              text: "A large shrink is split into parts.",
            },
          ],
        },
        {
          id: "what-stops-a-shrink",
          title: "What stops a shrink",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Reason", width: "30%" },
                { label: "What it means", width: "70%" },
              ],
              rows: [
                ["Room", "No smaller layout would hold your data with room to grow."],
                ["Filling fast", "The pool is filling too fast to move the data safely."],
                [
                  "Disk load",
                  "The other disks couldn’t keep up with the VM’s recent peak disk load.",
                ],
                ["No readings", "Amoeba is waiting for disk-load readings from the agent."],
                ["Kernel", "The VM’s kernel is too old, or doesn’t support btrfs."],
                ["Disk errors", "The pool reports disk errors."],
                ["VM size", "The VM size isn’t in Azure’s size list for its region yet."],
              ],
            },
            {
              kind: "p",
              text: "A running shrink stops when the pool needs room fast. Amoeba never detaches a disk while the pool is close to full.",
            },
          ],
        },
      ],
    },
    {
      id: "stay-in-control",
      title: "Stay in control",
      lede: "Each VM has one setting: whether shrinks run on their own or wait for you.",
      rows: [
        {
          id: "settings",
          title: "Settings",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Setting", width: "22%" },
                { label: "Where", width: "22%" },
                { label: "Default", width: "14%" },
                { label: "What it does", width: "42%" },
              ],
              rows: [
                [
                  "When Zoorik shrinks",
                  "Settings → Shrinking",
                  "Auto",
                  "“Auto” runs each shrink by itself when the pool is quiet. “Manual” holds it until you start it on Operations. Expands are automatic either way.",
                ],
                [
                  "Reinstall",
                  "Settings → Agent",
                  "",
                  "Installs the agent again. Offered while the VM is running, when the agent stopped reporting or its install failed.",
                ],
              ],
            },
            { kind: "p", text: "Changes wait until you click “Save”." },
          ],
        },
        {
          id: "shrinking-by-hand",
          title: "Manual shrinks",
          body: [
            {
              kind: "ul",
              items: [
                "In “Manual”, Amoeba keeps one shrink plan per pool ready and up to date.",
                "Operations shows it as “Waiting for you”: the disk it removes, what it saves, how full the pool will be and how much data moves. Overview lists it under “Needs you”.",
                "“Start shrink” checks again on fresh readings and removes exactly that disk. If the plan has changed, the card refreshes instead.",
                "If a check fails, the card reads “Can’t shrink now” with the reason, and has no button.",
                "You can’t stop a shrink once it starts. It stops only when the pool needs room fast.",
              ],
            },
          ],
        },
        {
          id: "go-back-and-resume",
          title: "Resume",
          body: [
            {
              kind: "p",
              text: "“Resume” on Pool → Migration continues a paused move once it can run. If the switch’s outcome can’t be known, the move waits for you to click it.",
            },
          ],
        },
        {
          id: "a-careful-start",
          title: "A careful start",
          body: [
            {
              kind: "ol",
              items: [
                "Run the free block storage cost assessment to see what your VMs could save.",
                "Onboard one VM whose services run under systemd, and set its “When Zoorik shrinks” to “Manual”.",
                "Watch the move on Pool → Migration, and check your services after the switch.",
                "When a shrink waits for you, start it from Operations and read its log entry.",
                "Then switch to “Auto” and onboard more VMs.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "savings-and-figures",
      title: "Savings and figures",
      lede: "Every figure says where it comes from. Amoeba never shows a made-up number.",
      rows: [
        {
          id: "savings-and-figures-the-figures",
          title: "The figures",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Figure", width: "30%" },
                { label: "Where", width: "20%" },
                { label: "What it means", width: "50%" },
              ],
              rows: [
                [
                  "Disk spend",
                  "Overview, Dashboard",
                  "What the VM’s data disks cost a month now. During the move, it counts both the source disks and the pool disks.",
                ],
                [
                  "Recoverable",
                  "Overview, Dashboard",
                  "Before the pool goes live: what the planned pool would save a month.",
                ],
                [
                  "Before, Now, Saving",
                  "Dashboard, Impact",
                  "After the move: the source disks’ monthly cost, the pool’s, and the difference.",
                ],
                [
                  "Saved to date",
                  "Overview, Impact",
                  "What the pools have saved since they went live.",
                ],
                [
                  "Saved by shrinks, Offset by expands",
                  "Operations",
                  "The monthly change from recent shrinks and expands, and the net.",
                ],
              ],
            },
            {
              kind: "ul",
              items: [
                "Prices are public list prices for the disk type and region, from the Azure Retail Prices API or the AWS Price List API.",
                "A month is 730 hours. AWS charges EBS per GB-month.",
                "Standard SSD and Standard HDD are priced on capacity only, without transaction charges.",
                "Savings are measured against the source disks. A saving can be negative, for example when a pool has grown past the disks it replaced. It is shown as it is.",
                "A missing figure is a dash that says why: “No Azure price for this disk”, “Available once the agent reports” or “Agent not reporting”.",
              ],
            },
          ],
        },
      ],
      related: [
        { text: "Free block storage cost assessment", href: `${routes.assessment}?p=amoeba` },
      ],
    },
    {
      id: "security-and-data",
      title: "Security and data",
      lede: "Zoorik acts in your cloud only through the role you grant it. The agent opens every connection to Zoorik itself.",
      rows: [
        {
          id: "what-the-role-allows",
          title: "What the role allows",
          body: [
            {
              kind: "p",
              text: "On Azure, the custom role “Zoorik Storage Operator” allows these actions:",
            },
            {
              kind: "table",
              columns: [
                { label: "Action", width: "46%" },
                { label: "Used for", width: "54%" },
              ],
              rows: [
                [
                  [{ code: "*/read" }],
                  "Reading every resource in the subscriptions you assign it on, such as VMs, disks and sizes.",
                ],
                [
                  [{ code: "Microsoft.Compute/virtualMachines/write" }],
                  "Attaching and detaching disks, which Azure does as a VM update.",
                ],
                [
                  [{ code: "Microsoft.Network/networkInterfaces/join/action" }],
                  "The same VM update: Azure checks every resource linked to the VM, including its network interface.",
                ],
                [
                  [{ code: "Microsoft.Compute/virtualMachines/runCommand/action" }],
                  "Installing the agent, and checking the copy and the switch during the move.",
                ],
                [
                  [{ code: "Microsoft.Compute/virtualMachines/reapply/action" }],
                  [{ ph: "when Amoeba reapplies a VM" }],
                ],
                [
                  [
                    { code: "Microsoft.Compute/disks/write" },
                    { br: true },
                    { code: "Microsoft.Compute/disks/delete" },
                  ],
                  "Creating and growing pool disks, tagging source disks, and deleting pool and source disks.",
                ],
                [
                  [{ code: "Microsoft.Compute/disks/beginGetAccess/action" }],
                  "Needed to snapshot a disk. Zoorik never requests the download link it can create.",
                ],
                [
                  [
                    { code: "Microsoft.Compute/snapshots/write" },
                    { br: true },
                    { code: "Microsoft.Compute/snapshots/delete" },
                  ],
                  "Taking safety snapshots, and deleting them after 7 days.",
                ],
              ],
            },
            {
              kind: "p",
              text: "The role is the limit of what Zoorik can do in your Azure. You run the script with your own sign-in, so Zoorik never receives your Azure password or a token that acts as you. An action added later reaches your subscription only when you run the script again.",
            },
            {
              kind: "p",
              text: "On AWS, Zoorik acts only through the IAM role ZoorikStorageOperator. It trusts Zoorik’s AWS account only with your organisation’s external ID. Zoorik’s own AWS identity can only assume roles with that name and read AWS prices.",
            },
            {
              kind: "table",
              columns: [
                { label: "Area", width: "30%" },
                { label: "The role allows", width: "70%" },
              ],
              rows: [
                [
                  "EC2 and Systems Manager",
                  "Read regions, instances, volumes, instance types and SSM status",
                ],
                ["Volumes", "Create, modify, attach, detach, delete and tag"],
                ["Snapshots", "Create, delete and tag"],
                ["Commands", "Run AWS-RunShellScript through Systems Manager"],
                [
                  "KMS",
                  "Create grants, decrypt and re-encrypt, only through EC2, so encrypted volumes keep their key",
                ],
              ],
            },
            {
              kind: "callout",
              title: "Good to know",
              body: [
                {
                  kind: "p",
                  text: "The role can create and delete disks and snapshots. Zoorik deletes a pool disk only when a shrink emptied it, or when an expand that created it gave up.",
                },
                {
                  kind: "p",
                  text: "It deletes a source disk only after the disk’s own snapshot succeeded, and a snapshot only when its tag names its own move.",
                },
              ],
            },
          ],
        },
        {
          id: "what-leaves-the-vm",
          title: "What leaves the VM",
          body: [
            {
              kind: "ul",
              items: [
                "Each mount’s path, filesystem type and ID, and its used and total size.",
                "The devices, LUNs and cloud disk IDs behind each mount, and the systemd service that holds it open.",
                "Disk activity per device: IOPS, latency, throughput and the 99th percentile of IOPS.",
                "The pool’s sizes, and its btrfs error counters per disk.",
                "Host facts: the kernel version, whether btrfs is available, the disks’ sector sizes, kernel features and the Azure Disk Encryption state.",
                "During a copy: its progress.",
                "While the VM has a pool: how busy the disks are, including the copy’s own reads and writes.",
                "If an install fails: the agent’s last log lines, with secrets removed.",
              ],
            },
            {
              kind: "p",
              text: "The reports carry no file contents, hostnames, IP addresses, user names or process lists. The copy runs inside the VM, from the source disks to the pool disks.",
            },
          ],
        },
        {
          id: "how-the-agent-connects",
          title: "How the agent connects",
          body: [
            {
              kind: "ul",
              items: [
                "The agent opens no port. It sends its reports to Zoorik and keeps two channels open to it over WebSocket (wss), all with its own key from /etc/amoeba-agent.env.",
                "Zoorik signs every command with that key (HMAC-SHA256), and the agent checks the signature before it acts. A key from another VM can’t act for this one.",
                "On Azure, Zoorik reaches the VM through Azure Run Command, to install the agent and check the move. Azure adds its Run Command extension to a VM that lacks it. It keeps each command and its output under /var/lib/waagent, and records each run in the activity log.",
                "On AWS, Zoorik reaches the instance through AWS Systems Manager (AWS-RunShellScript), which keeps each command’s history in your account.",
              ],
            },
          ],
        },
        {
          id: "encryption",
          title: "Encryption",
          body: [
            {
              kind: "p",
              text: "New pool disks take the key of the first encrypted source disk: your disk encryption set on Azure, or your customer-managed KMS key on AWS. Encryption at rest carries over.",
            },
            {
              kind: "p",
              text: "VMs that use Azure Disk Encryption are not moved as they are.",
            },
          ],
        },
        {
          id: "sign-in",
          title: "Sign-in",
          body: [
            {
              kind: "p",
              text: "Sign in to the console with a Microsoft or Google account. Zoorik never sees your password.",
            },
          ],
        },
      ],
    },
    {
      id: "remove-amoeba-from-a-vm",
      title: "Remove Amoeba",
      lede: [
        "A move only goes forward, so a VM stays on its pool. To stop Amoeba, wait until no VM is creating a pool. Then remove Zoorik’s access and run ",
        { code: "systemctl disable --now amoeba-agent" },
        " on each VM.",
      ],
      callouts: [
        {
          kind: "callout",
          title: "Review it first",
          body: [
            {
              kind: "p",
              text: "Zoorik’s access is the “Zoorik Storage Operator” role assignment or Zoorik’s app on Azure, and the ZoorikStorageOperator role on AWS. Without it, Amoeba can’t add disks, so a live pool can’t expand.",
            },
          ],
        },
      ],
      rows: [
        {
          id: "going-back-during-the-soak",
          title: "The source disks",
          body: [
            {
              kind: "p",
              text: "Amoeba deleted each source disk after the switch, once its snapshot succeeded. Snapshots not yet deleted stay in your account.",
            },
          ],
        },
        {
          id: "what-amoeba-added",
          title: "What Amoeba added",
          body: [
            {
              kind: "ul",
              items: [
                "On the VM: the agent in /opt/amoeba-agent, amoeba-agent.service, /etc/amoeba-agent.env, the /etc/fstab backup, and the pool with your data on it.",
                "In Azure: the pool disks, the safety snapshots while they’re kept, the “Zoorik Storage Operator” role and its assignments, and Zoorik’s app in your directory.",
                "In AWS: the pool’s gp3 volumes, the safety snapshots while they’re kept, and the IAM role ZoorikStorageOperator.",
                "Your data stays on the zoorik-amoeba-pool-… disks. Nothing grows them once Amoeba stops, so keep them and watch their free space.",
              ],
            },
          ],
        },
      ],
    },
  ],
};
