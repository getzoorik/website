import { learnPath, routes } from "@/config/site";
import type { GuideContent } from "@/content/guide";

/**
 * `/amoeba/guide`: every string the Amoeba product guide prints, verbatim from
 * the approved mock. A paraphrase here is a different claim.
 *
 * Laid out like the FAQ, as the Coral guide is: eleven groups, 35 numbered
 * rows, nothing removed. It keeps the 48-hour soak and going back, as the
 * approved mock does.
 *
 * The facts the draft does not have yet are placeholders (`{ ph }`): the page
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
  "two-stages-on-every-vm",
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
      "How to onboard a VM to Amoeba on Azure or AWS, how its data moves onto one pool, how the pool expands and shrinks online, and how you stay in control.",
  },
  /* No PDF yet: no download block (the Docs hub says "PDF to come"). */
  hero: {
    title: "Amoeba product guide",
    deck: "How to onboard a VM, what Amoeba changes, and how you stay in control.",
    downloads: [],
  },
  updated: "Updated 9 October 2026",
  summary: [
    {
      term: "Product page",
      text: [[{ href: routes.amoeba, text: "Block storage cost optimization on Azure and AWS" }]],
    },
    {
      term: "What Amoeba does",
      text: [
        "Moves each VM’s data mounts onto one pool of disks sized to your data, then adds and removes disks as the data grows and shrinks.",
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
        "You pick each VM. Per VM, you choose whether shrinks run on their own or wait for you, and the band the pool is held in.",
        [
          "Onboarding starts the move, and services on the data mounts restart at the switch. See ",
          { ref: "moving-a-vm-onto-its-pool", text: "Moving a VM onto its pool" },
          ".",
        ],
      ],
    },
  ],
  sections: [
    {
      id: "how-amoeba-works",
      title: "How Amoeba works",
      lede: "Amoeba optimizes the block storage of your VMs.",
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
                      text: "Connect your Azure directory once. A script you run in Azure Cloud Shell gives Zoorik’s app a custom role on the subscriptions you choose. On AWS, enter your 12-digit account ID, then run a script in AWS CloudShell that creates the IAM role ZoorikStorageOperator. It trusts Zoorik’s AWS account only with your organisation’s external ID.",
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
                      text: "The agent copies the VM’s data mounts onto one pool sized to the data plus 20%, and at least 50 GiB more, then switches the mounts over. The systemd services that use those mounts restart at the switch.",
                    },
                  ],
                },
                {
                  title: "Optimize",
                  body: [
                    {
                      kind: "p",
                      text: "The pool expands and shrinks online, without unmounting, to stay inside its target band.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "two-stages-on-every-vm",
          title: "Two stages on every VM",
          body: [
            {
              kind: "table",
              columns: [
                { label: "Stage", width: "24%" },
                { label: "What happens", width: "44%" },
                { label: "How it starts", width: "32%" },
              ],
              rows: [
                [
                  "The move onto a pool",
                  "Copies the data mounts onto the pool, switches over, watches the pool for 48 h, then deletes the source disks.",
                  "By itself, after the agent’s first report. You can go back during the 48 h soak.",
                ],
                [
                  "Autopilot",
                  "Expands the pool as it fills, and shrinks it as it empties, one disk at a time.",
                  "Expands can run once the pool is verified after the switch. Shrinks start after the soak, on their own in “Auto” or when you start them in “Manual”.",
                ],
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
                    " an AWS account whose EC2 instances run Linux, are managed by AWS Systems Manager (SSM agent online), are a Nitro type that exposes EBS as NVMe, and have at least one EBS data volume.",
                  ],
                ],
                [
                  "The rights to connect",
                  [
                    "In Azure, the rights to add Zoorik’s app to your directory, create a custom role, and assign it on each subscription. ",
                    { ph: "the exact Azure roles needed to run the connect script" },
                  ],
                ],
                [
                  "A running VM with data disks",
                  "Amoeba lists only running VMs with at least one data disk. The data on those disks must sit on mounted filesystems.",
                ],
                [
                  "Data-disk slots",
                  "A VM size with at least 8 data-disk slots. During the move the pool’s disks are attached beside the source disks, so the VM needs free slots for them. If it has too few, Amoeba declines the VM and says why.",
                ],
                [
                  "Linux",
                  [
                    "systemd, and kernel 5.14 or later with btrfs available. The agent also needs rsync, btrfs-progs (mkfs.btrfs and btrfs) and psmisc (fuser), which the installer doesn’t add, and cgroup v2 for its disk-load readings. Amoeba doesn’t shrink a pool on an older kernel. VMs whose OS is in the Red Hat family (RHEL, CentOS, Fedora, Rocky Linux and AlmaLinux, as the agent reads it) are not moved onto a pool. ",
                    { ph: "supported Linux distributions and versions" },
                  ],
                ],
                ["Windows", [{ ph: "supported Windows versions and what Amoeba needs on them" }]],
                [
                  "Services on data mounts",
                  "Every process that keeps a data mount open must run as a systemd service, so the agent can stop it and start it again at the switch.",
                ],
                [
                  "Java",
                  "The agent runs on Java 17 or later. If the VM has none, the installer adds OpenJDK 17 with apt, dnf, yum or zypper.",
                ],
                [
                  "Network",
                  [
                    "Outbound access from each VM to Zoorik for the agent’s reports and command channels, and to the hosts it downloads from. ",
                    {
                      ph: "hosts to allow: Zoorik, GitHub release downloads and the distribution’s package mirrors",
                    },
                  ],
                ],
                [
                  "A console account",
                  [
                    "Sign in with a Microsoft or Google account. ",
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
      lede: "You connect Azure once. Then you pick the VMs Amoeba manages, in the console.",
      callouts: [
        {
          kind: "callout",
          title: "Review it first",
          body: [
            {
              kind: "p",
              text: "Onboarding is your go-ahead. The move runs by itself, and services on the data mounts restart at the switch.",
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
                  title: "Connect Azure",
                  body: [
                    {
                      kind: "p",
                      text: "Click “Connect Azure” and enter your directory (tenant) ID. The console shows a script to run in Azure Cloud Shell. It adds Zoorik’s app to your directory, creates the role “Zoorik Storage Operator”, and assigns it to the app on each subscription you name.",
                    },
                    {
                      kind: "well",
                      lines: [[{ ph: "the connect script, exactly as the console prints it" }]],
                      prompt: "$ ",
                    },
                  ],
                },
                {
                  title: "Verify",
                  body: [
                    {
                      kind: "p",
                      text: "Click “Verify”. The connection reads “Verifying” until Zoorik can read a subscription through the role, and the console checks again every 15 seconds. Run Verify again later to add subscriptions you granted since.",
                    },
                  ],
                },
                {
                  title: "Onboard VMs",
                  body: [
                    {
                      kind: "p",
                      text: "Click “Onboard VMs”. The list shows each VM Amoeba can onboard, with its resource group, region, size, and the number and total size of its data disks. Tick the VMs you want, then click “Onboard”.",
                    },
                  ],
                },
                {
                  title: "The agent installs",
                  body: [
                    {
                      kind: "p",
                      text: "Amoeba installs its agent on each VM through Azure Run Command. The VM’s agent reads “Installing”, then “Connected” once its first report arrives.",
                    },
                  ],
                },
                {
                  title: "The move starts",
                  body: [
                    {
                      kind: "p",
                      text: "After the first report, Amoeba plans the pool and starts moving the VM onto it, with no further click.",
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
                "The list comes from Azure Resource Graph only. Amoeba doesn’t look inside a VM, or show its used space or savings, until the VM’s agent reports.",
                [
                  "VMs that can’t be onboarded are counted in one line under the list, with the reason, for example a VM that is stopped or has only an OS disk. ",
                  { ph: "how Windows VMs appear in the onboarding list" },
                ],
                "The list can be up to 60 seconds old.",
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
                  "Zoorik can’t read a subscription yet. The console says why: the app isn’t added to the directory, the role isn’t assigned, or the directory wasn’t found.",
                ],
                ["Connected", "Zoorik reads your subscriptions through the role."],
                [
                  "Access lost",
                  "Zoorik lost read access to a subscription. Figures that come from Azure keep their last value, dated, and onboarding waits. Access is checked again about every 5 minutes.",
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
                "The console shows why: the install script failed, Azure refused the run, there was no progress for 30 minutes, Zoorik can’t reach the subscription, or the agent installed but sent no report within 3 minutes.",
                "Amoeba tries again after 10 seconds, then waits twice as long each time, up to 5 minutes, for as long as the VM stays onboarded.",
                "“Reinstall” in Settings starts a new install straight away, or when the current step of the move ends.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "what-gets-installed",
      title: "What gets installed",
      lede: "Amoeba adds one agent to each VM you onboard, and creates its own disks and snapshots in your subscription.",
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
                  "Reports the VM’s disks and mounts every 15 seconds, and carries out the move, the expands and the shrinks. Runs as root from /opt/amoeba-agent, with IO accounting on.",
                ],
                [
                  "/etc/amoeba-agent.env",
                  "The agent’s settings: its own key, Zoorik’s address and the VM’s Azure resource ID. Readable by root only. The install command carries a single-use bootstrap token, never the key. The installer exchanges the token with Zoorik for the agent’s own key. A reinstall replaces the key.",
                ],
                ["Java", "OpenJDK 17, added only when the VM has no Java 17 or later."],
                [
                  "Other packages",
                  "curl, ca-certificates and procps, added when the VM lacks them.",
                ],
                ["btrfs kernel module", "The agent loads it when it isn’t loaded yet."],
                [
                  "The pool",
                  "One btrfs filesystem across the pool’s disks. Each data mount becomes a subvolume on it, mounted at the same path as before.",
                ],
                [
                  "/etc/fstab",
                  "At the switch, the agent saves a copy as /etc/fstab.amoeba-backup.<id> and points each data mount at the pool.",
                ],
              ],
            },
          ],
        },
        {
          id: "in-your-azure-subscription",
          title: "In your Azure subscription",
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
                  "The pool’s managed disks. Amoeba adds and removes them as the pool grows and shrinks. What Amoeba creates carries tags that start with amoeba-.",
                ],
                [
                  ["Safety snapshots", { sub: "zoorik-amoeba-snap-…" }],
                  "One incremental snapshot of each source disk, taken before the disk is deleted, in the disk’s own resource group. Deleted after 7 days.",
                ],
                [
                  "Zoorik Storage Operator",
                  "A custom role in your directory, assigned to Zoorik’s app on each subscription you connect. The connect script also adds the app to your directory.",
                ],
              ],
            },
          ],
        },
        {
          id: "in-your-aws-account",
          title: "In your AWS account",
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
                "The installer keeps the last 3 versions on the VM. If a new version fails its health check, it goes back to the previous one.",
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
                  "Every onboarded VM with its status, agent, disks, capacity, spend and savings; today’s disk spend, what is recoverable, and what Amoeba has saved to date. “Needs you” lists paused moves, shrinks waiting for you, and agents to reinstall. “Connect Azure” and “Onboard VMs” start here.",
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
                  "The VM’s status, what its disks cost (today and with a pool, or before and now), its capacity, and 30 days of used space, provisioned space and IOPS.",
                ],
                [
                  "Disks",
                  "Every data disk with its LUN, pool and monthly cost, and how many data-disk slots are in use.",
                ],
                [
                  "Pool",
                  "“Overview”: the pool’s disks, size, use, IOPS, throughput and spend, or the plan before the move. “Migration”: the move’s phases and copy progress, with “Resume” and “Go back” when they apply.",
                ],
                [
                  "Operations",
                  "Expands and shrinks running now, a shrink waiting for you in “Manual”, and a log of the last 30 days with each outcome and its reason.",
                ],
                [
                  "Impact",
                  "Before and now, what the pool has saved since it went live, and 30 days of capacity and spend.",
                ],
                [
                  "Settings",
                  "“When Zoorik shrinks”, the target band, the agent’s status with “Reinstall”, and the VM’s facts.",
                ],
              ],
              continuation: true,
            },
          ],
        },
        {
          id: "status-words",
          title: "Status words",
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
                ["Idle", "The pool is live and holding its band, or a shrink is waiting for you."],
              ],
            },
            {
              kind: "p",
              text: "Every figure is a value, or a dash that says why it is missing, such as “Available once the agent reports”, “No Azure price for this disk” or “Agent not reporting”. Amoeba never fills a gap with a guess.",
            },
          ],
        },
      ],
    },
    {
      id: "moving-a-vm-onto-its-pool",
      title: "Moving a VM onto its pool",
      lede: "It starts after the agent’s first report and runs in 9 phases: decide, build and switch, prove and clean up.",
      rows: [
        {
          id: "how-the-pool-is-sized",
          title: "How the pool is sized",
          body: [
            {
              kind: "ul",
              items: [
                "The pool is sized to the data on the VM’s data mounts plus 20%, and at least 50 GiB larger than the data.",
                "A pool of 512 GiB or more has anchor disks, which stay, and elastic disks, which Amoeba adds and removes: 2 anchor disks and 3 to 6 elastic disks, or 1 anchor disk and up to 3 elastic disks when the VM has too few free slots.",
                "A smaller pool has no anchor disk: 3 to 6 elastic disks of at least 64 GiB on Premium SSD v2, or 128 GiB on Premium SSD and Standard SSD. So a small amount of data gets a pool well above the data plus 20%.",
                "Amoeba keeps one data-disk slot free for an urgent expand. A pool with no anchor disk and no free slot can’t expand.",
                "Each VM gets one pool, on one disk type. The pool keeps the type your data sits on today: Premium SSD v2, Premium SSD or Standard SSD. Where the VM’s region or zone doesn’t offer Premium SSD v2, it uses Premium SSD.",
                "Data on Standard HDD or Ultra Disk moves to Premium SSD v2 or Premium SSD, which costs more. Zone-redundant (ZRS) disks map to a locally redundant (LRS) pool, so the data loses zone redundancy.",
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
                [
                  "Discover",
                  "Amoeba reads the VM’s facts from the agent and from Azure, and checks the VM can take a pool.",
                ],
                [
                  "Plan",
                  "It sizes the pool, and records as source disks only the disks Azure shows attached to this VM.",
                ],
                [
                  "Provision",
                  "It creates the pool’s disks and attaches them beside the source disks.",
                ],
                [
                  "Baseline",
                  "The agent copies each data mount onto the pool, inside the VM. The copy slows down or waits when the VM’s disks are busy.",
                ],
                ["Converge", "It copies what changed since, until the pool has caught up."],
                ["Cutover", "The switch. See “At the switch” below."],
                [
                  "Verify",
                  "Amoeba waits for a fresh reading of the pool, taken after the switch, that shows no disk errors.",
                ],
                [
                  "Soak",
                  "For 48 h, any disk error on the pool, or disk latency well above its level before the switch, pauses the move. You can go back during this time.",
                ],
                [
                  "Detach",
                  "Amoeba detaches each source disk, takes an incremental snapshot of it, waits until the snapshot is complete, and then deletes the disk.",
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
                "It checks nothing is left to copy, saves /etc/fstab, mounts the pool at each data mount’s path, and starts the services again. Your mount paths stay the same.",
                [
                  "If any step fails, the agent tries to put the original mounts back and start the services again. ",
                  {
                    ph: "what happens to writes made on the pool if a late check fails after the services restarted",
                  },
                  " The source disks are never written during the switch. Amoeba then tries the switch again, so your services can restart more than once.",
                ],
                "A process that holds a data mount open outside a systemd service can’t be stopped cleanly, so the switch can’t finish.",
              ],
            },
          ],
        },
        {
          id: "the-soak-and-going-back",
          title: "The soak, and going back",
          body: [
            {
              kind: "ul",
              items: [
                "During the 48 h soak, “Go back” on Pool → Migration returns the VM to its source disks. The pool’s disks are then detached and deleted. Going back needs the agent connected.",
                [
                  "After the soak, the source disks are deleted and going back is no longer offered. Each source disk leaves a safety snapshot for 7 days. ",
                  { ph: "how to restore from a safety snapshot, and who does it" },
                ],
                "After going back, “Schedule pool migration” on Pool starts a new move.",
                "No shrink runs during the soak. Expands can.",
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
                "The move pauses when a phase can’t go on safely, for example when the VM can’t take a pool, a copy fails, or the outcome of the switch can’t be known.",
                "Pool → Migration shows where it paused and why. “Resume” or “Go back” appears when it applies.",
                "A VM Amoeba declines, for example one with too few data-disk slots, shows why and stays on its own disks.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "expanding-and-shrinking",
      title: "Expanding and shrinking",
      lede: "After the switch, Amoeba holds each pool inside its target band, 75% to 85% full by default. It checks every pool every 60 seconds, from the agent’s reports every 15 seconds.",
      rows: [
        {
          id: "when-amoeba-expands",
          title: "When Amoeba expands",
          body: [
            {
              kind: "ul",
              items: [
                "When the pool is fuller than the band’s top edge.",
                "When, at its current fill rate, the pool would reach its safety floor within 6 hours.",
                "At once, when free space falls below the safety floor: 12% of the pool, or 25 GiB if that is more.",
                [
                  "Expands run on their own, in “Auto” and in “Manual”, except while the move is paused after the switch. Then the pool can’t expand, and the only way on is to go back. ",
                  { ph: "what you do if a paused pool fills" },
                ],
              ],
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
                "Each expand adds one step of capacity: a sixteenth of the pool, at least 64 GiB on Premium SSD v2 or 128 GiB on Premium SSD and Standard SSD, and at most 512 GiB.",
                "It attaches a new elastic disk while the VM has a free slot. When none is free, it grows an anchor disk in place. The slot Amoeba keeps free is used only for an urgent expand.",
                "It runs in three steps, Provision, Device add and Verify, while the pool stays mounted.",
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
              kind: "ul",
              items: [
                "When the pool is less full than the band’s bottom edge.",
                "Only if, after the disk leaves, the pool is at least 10 points under the top edge (75% with the default band).",
                "One disk at a time, and one shrink per VM at a time. Only elastic disks are removed.",
                "Not during the 48 h soak after the switch.",
                "In “Auto” the shrink starts by itself. In “Manual” it waits for you on Operations.",
              ],
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
                { label: "Steps", width: "30%" },
                { label: "What happens", width: "70%" },
              ],
              rows: [
                ["Claim, Preflight", "Amoeba picks the disk and checks the shrink is still safe."],
                [
                  "Drain",
                  "The agent moves the disk’s data onto the other disks with btrfs balance, until at most 2 GiB is left on it.",
                ],
                ["Verify empty", "A fresh reading confirms it."],
                [
                  "Remove, Verify gone",
                  "The disk is taken out of the btrfs filesystem, and Amoeba checks it has gone.",
                ],
                [
                  "Prepare detach, Detach",
                  "The disk is detached in Azure and deleted at once. Its billing stops.",
                ],
              ],
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
                [
                  "Room",
                  "The other disks wouldn’t have room for the data, or btrfs would lose its working space: 12% of the pool kept unallocated.",
                ],
                ["Filling fast", "The pool is filling too fast to move the data safely."],
                [
                  "Disk load",
                  "The other disks couldn’t keep up with the VM’s disk load, judged from the peak of recent readings.",
                ],
                ["No readings", "Amoeba is waiting for disk-load readings from the agent."],
                ["Kernel", "The VM’s kernel is older than 5.14, or btrfs isn’t available."],
                ["Disk errors", "The pool reports disk errors."],
                ["VM size", "The VM size isn’t in Azure’s size list for its region yet."],
              ],
            },
            {
              kind: "p",
              text: "A shrink is never held back for a missing backup, a short history, the hour of day, a recent shrink or a small saving.",
            },
          ],
        },
      ],
    },
    {
      id: "stay-in-control",
      title: "Stay in control",
      lede: "Every VM has its own settings.",
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
                  "“Auto” runs each shrink by itself. “Manual” holds it until you start it on Operations. Expands are automatic either way.",
                ],
                [
                  "Target band",
                  "Settings → Autopilot",
                  "75% to 85%",
                  "Expands a pool above the top edge and shrinks it below the bottom edge. Each edge is between 50% and 95%, in steps of 5, at least 10 apart.",
                ],
                [
                  "Reinstall",
                  "Settings → Agent",
                  "",
                  "Installs the agent again. Offered when the agent stopped reporting or its install failed, while the VM is running.",
                ],
              ],
            },
            { kind: "p", text: "Changes wait until you click “Save”." },
          ],
        },
        {
          id: "shrinking-by-hand",
          title: "Shrinking by hand",
          body: [
            {
              kind: "ul",
              items: [
                "In “Manual”, Amoeba keeps one ready plan per pool, and checks it again every 60 seconds or so.",
                "Operations shows it as “Waiting for you”: the disk it removes, what it saves, how full the pool is after, and how much data moves. Overview lists it under “Needs you”.",
                "“Start shrink” checks again on fresh readings and removes exactly that disk. If the plan has changed, the card refreshes instead.",
                "If a check fails, the card reads “Can’t shrink now” with the reason, and has no button.",
                "A shrink can’t be stopped once it starts.",
              ],
            },
          ],
        },
        {
          id: "go-back-and-resume",
          title: "Go back and resume",
          body: [
            {
              kind: "p",
              text: "“Go back” is offered during the 48 h soak, and “Resume” on a paused move that can run again. Both are on Pool → Migration.",
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
                "Run the free disk assessment first, to see what your own VMs could save.",
                "Onboard one VM whose services run under systemd, and set “When Zoorik shrinks” to “Manual” on its Settings page.",
                "Watch the move on Pool → Migration. Check your services after the switch, and go back during the 48 h soak if you need to.",
                "After the soak, start each shrink yourself from Operations, and read its log entry.",
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
                  "What the VM’s data disks cost a month now. During the move it counts both the source disks and the pool disks.",
                ],
                [
                  "Recoverable",
                  "Overview, Dashboard",
                  "Before the pool goes live: what the planned pool would save a month.",
                ],
                [
                  "Before, Now, Saving",
                  "Dashboard, Impact",
                  "After the move: what the source disks cost a month, what the pool costs, and the difference.",
                ],
                [
                  "Saved to date",
                  "Overview, Impact",
                  "What the pools have saved since they went live.",
                ],
                [
                  "Saved by shrinks, Offset by expands",
                  "Operations",
                  "The monthly change from the last 30 days of shrinks and expands, and the net.",
                ],
              ],
            },
            {
              kind: "ul",
              items: [
                "Prices are Azure’s public list prices for the disk type and region, from the Azure Retail Prices API. A month is 730 hours.",
                "On AWS, prices come from the AWS Price List API. EBS bills per GB-month.",
                "Standard SSD and Standard HDD are priced on capacity only, without transaction charges.",
                "Savings are measured against the source disks.",
                "A saving can be negative, for example when a pool has grown past the disks it replaced. It is shown as it is.",
                "Where Azure has no price for a disk, the figure reads “No Azure price for this disk”. Until the agent reports, used space and savings read “Available once the agent reports”.",
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
      lede: "Zoorik acts in your Azure only through the role you assign. The agent opens every connection to Zoorik itself.",
      rows: [
        {
          id: "what-the-role-allows",
          title: "What the role allows",
          body: [
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
                  "The same VM update: Azure checks every resource linked to the VM, its network interface included.",
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
                  "Creating and growing pool disks, tagging source disks, and deleting pool disks and source disks.",
                ],
                [
                  [{ code: "Microsoft.Compute/disks/beginGetAccess/action" }],
                  "Needed to snapshot a disk. The download link it can create is never requested.",
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
              text: "The role is the limit on what Zoorik can do in your Azure. An action added later reaches your subscription only when you run the script again.",
            },
            {
              kind: "p",
              text: "On AWS, Zoorik acts only through the IAM role ZoorikStorageOperator, which you create in AWS CloudShell. The role trusts Zoorik’s AWS account only with your organisation’s external ID. Zoorik’s own AWS identity may only assume roles with that name and read AWS prices.",
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
                  text: "The role can create and delete disks and snapshots. Zoorik deletes only these: an elastic disk a shrink emptied, a disk an expand created and gave up on, the pool’s disks after you go back, a source disk the move recorded and snapshotted, and a snapshot whose tag names its own move.",
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
                "Every 15 seconds: each mount’s path, filesystem type and ID, its used and total size, the devices, LUNs and cloud disk IDs behind it, and the name of the systemd service that holds it open.",
                "Disk activity per device: IOPS, latency and throughput, and the 99th percentile of IOPS.",
                "The pool’s sizes, and its btrfs error counters per disk.",
                "Host facts: the kernel version, whether the OS is in the Red Hat family, whether btrfs is available, the disks’ sector sizes, kernel features and the Azure Disk Encryption state.",
                "During a copy: its progress.",
                "Every 2 seconds while the VM has a pool: how busy the disks are, the copy’s own reads and writes included.",
                "If an install fails: the agent’s last log lines, with secrets removed.",
              ],
            },
            {
              kind: "p",
              text: "The copy itself runs inside the VM, from the source disks to the pool disks.",
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
                "The agent sends its reports to Zoorik, and keeps a command channel and a governance channel open to it over WebSocket (wss). All three use the agent’s own key, from /etc/amoeba-agent.env.",
                "Zoorik signs every command with that key (HMAC-SHA256), and the agent checks the signature before it acts. A key from another VM can’t act for this one.",
                "Zoorik reaches the VM through Azure Run Command, to install the agent and to check the move. Azure adds its Run Command extension to a VM that doesn’t have it yet, keeps a copy of each command and its output under /var/lib/waagent, and records each run in the activity log.",
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
              text: "New pool disks take the encryption key of the first encrypted source disk: your customer-managed KMS key on AWS, or your disk encryption set on Azure. Encryption at rest carries over. VMs that use Azure Disk Encryption are not moved as they are.",
            },
          ],
        },
        {
          id: "sign-in",
          title: "Sign-in",
          body: [
            {
              kind: "p",
              text: "Sign in with a Microsoft or Google account, as for Coral. A session ends after 30 minutes idle or 12 hours.",
            },
          ],
        },
      ],
    },
    {
      id: "remove-amoeba-from-a-vm",
      title: "Remove Amoeba from a VM",
      lede: [
        "During the soak, going back returns a VM to its own disks. To stop Amoeba, wait until no VM is creating a pool, or go back within the first 48 h. Then remove Zoorik’s access (on Azure, the Zoorik Storage Operator role assignment or Zoorik’s app; on AWS, the ZoorikStorageOperator role) and run ",
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
              text: "While a pool is live, Amoeba needs its role to add disks. If you remove the role’s assignment, the pool can’t expand.",
            },
          ],
        },
      ],
      rows: [
        {
          id: "going-back-during-the-soak",
          title: "Going back during the soak",
          body: [
            {
              kind: "p",
              text: "During the 48 h soak, “Go back” on Pool → Migration returns the VM to its source disks and deletes the pool’s disks. After the soak, the source disks are gone, and each leaves a safety snapshot for 7 days.",
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
                "On the VM: the agent in /opt/amoeba-agent, the service amoeba-agent.service, /etc/amoeba-agent.env, the /etc/fstab backup, and the pool with your data on it.",
                "In Azure: the pool disks, the safety snapshots for up to 7 days, the role “Zoorik Storage Operator” and its assignments, and Zoorik’s app in your directory.",
                "In AWS: the pool’s gp3 volumes, the safety snapshots for up to 7 days, and the IAM role ZoorikStorageOperator.",
                "Your data stays on the zoorik-amoeba-pool-… disks, and nothing grows them once Amoeba stops, so keep them and watch their free space. Snapshots not yet deleted stay in your account.",
              ],
            },
          ],
        },
      ],
    },
  ],
};
