import { glossaryPath, routes } from "@/config/site";
import type { FaqSection } from "@/content/faq";

/**
 * `/amoeba-faq`: every string the page prints: 8 groups ("About Amoeba" first),
 * 30 questions, their short answers, and the two callouts atop their groups.
 * Written at product level (docs PRODUCT-LEVEL-AMOEBA.md): what Amoeba does,
 * none of its internal numbers, the answer first, and each fact in the answer
 * that asks for it. The mock's typography is kept: curly quotes and
 * apostrophes, and a no-break space before a unit.
 *
 * 🔴 CLIENT ANSWERS ONLY. Each question carries its short answer and nothing
 * else: the draft's technical answers are for Zoorik's own team and never reach
 * this site, nor do its deck, fine print, cards, sources or gaps.
 * `src/app/internal-docs.test.ts` fails if they come back.
 *
 * No fact is still to come. A later one would be a whole bullet carried as a
 * `{ ph }` segment; filling it is replacing that segment with text.
 *
 * ─── THE IDS ARE A CONTRACT ────────────────────────────────────────────────
 * Group and question ids are stored as fixed strings and never derived from
 * the text, so shared links keep working. Keep an id when its heading's wording
 * changes later.
 *
 * No download line (no Amoeba FAQ PDF exists), and no FAQPage structured data.
 */

export const amoebaFaqQuestionIds = [
  "what-is-amoeba",
  "which-disks-does-amoeba-work-on",
  "what-does-onboarding-a-vm-change",
  "do-my-applications-need-changes",
  "how-much-can-amoeba-save",
  "how-do-i-get-amoeba",
  "can-a-shrink-lose-data",
  "what-happens-if-the-switch-onto",
  "can-i-go-back-to-my",
  "which-resources-does-amoeba-delete",
  "is-there-downtime",
  "does-the-copy-slow-down-my",
  "what-disk-performance-does-the-pool",
  "how-fast-does-amoeba-expand-when",
  "when-does-amoeba-shrink-the-pool",
  "does-manual-stop-amoeba-from-expanding",
  "what-happens-if-the-agent-stops",
  "what-does-the-agent-send-to",
  "how-is-the-agent-installed-and",
  "which-linux-distributions-does-amoeba-support",
  "does-amoeba-work-on-windows-vms",
  "does-amoeba-work-on-aws",
  "which-disk-types-does-the-pool",
  "how-is-the-saving-worked-out",
  "do-i-pay-for-both-sets",
  "what-does-amoeba-cost",
  "how-do-i-see-what-my",
  "can-i-start-with-one-vm",
  "what-does-amoeba-need-in-my",
  "what-does-amoeba-need-on-aws",
] as const;

export type AmoebaFaqQuestionId = (typeof amoebaFaqQuestionIds)[number];

export const amoebaFaqPage = {
  path: routes.amoebaFaq,
  meta: {
    title: "Amoeba FAQ",
    description:
      "How Amoeba keeps your data safe, grows and shrinks block storage without any downtime, and what it needs and costs on Azure and AWS.",
  },
  /* One line under the h1: what the answers cover. */
  hero: {
    title: "Amoeba FAQ",
    deck: "Data safety, downtime, requirements and costs.",
  },
  updated: "Updated 3 November 2026",
} as const;

/** The 8 groups and 30 questions, in the page's order. */
export const amoebaFaqSections: readonly FaqSection<AmoebaFaqQuestionId>[] = [
  {
    id: "about-amoeba",
    title: "About Amoeba",
    questions: [
      {
        id: "what-is-amoeba",
        question: "What is Amoeba?",
        short: [
          [
            "Amoeba is ",
            { href: routes.amoeba, text: "block storage optimization" },
            " for Windows and Linux VMs on Azure and AWS.",
          ],
          [
            "It moves a VM’s data disks onto one ",
            { href: glossaryPath("btrfs"), text: "btrfs" },
            " pool sized to your data, with room to grow.",
          ],
          "It grows the pool before it fills and shrinks it when your data goes down and stays down, without any downtime. So you pay for close to what you use.",
        ],
      },
      {
        id: "which-disks-does-amoeba-work-on",
        question: "Which disks does Amoeba work on?",
        short: [
          "The data disks of running Windows and Linux VMs: Azure managed disks, and Amazon EBS volumes on EC2 instances.",
          "Amoeba never touches the OS disk or root volume.",
          "During the move, the pool’s disks attach beside the original ones, so the VM needs a few free disk slots.",
        ],
      },
      {
        id: "what-does-onboarding-a-vm-change",
        question: "What happens when I onboard a VM?",
        short: [
          "Onboarding starts the move onto the pool, and the move runs by itself.",
          "Amoeba installs its agent, builds the pool beside your disks, and copies your data while your services run.",
          "It then switches each mount to the pool at the same path, with a short restart of the services that use it.",
          "Once the switch is checked, it snapshots each original disk, then deletes the disk.",
          [
            "Every step is in the ",
            { href: routes.amoebaGuide, text: "Amoeba product guide" },
            ".",
          ],
        ],
      },
      {
        id: "do-my-applications-need-changes",
        question: "Do my applications need changes?",
        short: [
          "No. Each data mount keeps its path, so applications read and write where they did before.",
          "Each process that keeps a data mount open must run as a systemd service, so the agent can restart it at the switch.",
        ],
      },
      {
        id: "how-much-can-amoeba-save",
        question: "How much can Amoeba save?",
        short: [
          "We estimate Amoeba reduces block storage cost by 50–60%.",
          [
            "The ",
            { href: `${routes.assessment}?p=amoeba`, text: "free assessment" },
            " works out your own figure at list price.",
          ],
          [
            "Our ",
            { href: routes.caseStudyAmoebaLabVms, text: "Amoeba case study" },
            " shows a real shrink on one of our own lab VMs.",
          ],
        ],
      },
      {
        id: "how-do-i-get-amoeba",
        question: "How do I get Amoeba?",
        short: [
          "Amoeba is in early access. Book a demo to join, or run the free assessment first.",
          "It is also available in AWS Marketplace and Microsoft Marketplace.",
        ],
      },
    ],
  },
  {
    id: "safety-and-data",
    title: "Data safety",
    questions: [
      {
        id: "can-a-shrink-lose-data",
        question: "Can a shrink lose data?",
        short: [
          "A disk leaves the pool only after its data has moved onto the other disks and the filesystem no longer uses it.",
          "Before a shrink starts, Amoeba checks that the other disks have room for the data.",
          "Amoeba never shrinks a pool that reports disk errors.",
          "The emptied disk holds no data, so Amoeba deletes it at once, with no snapshot.",
        ],
      },
      {
        id: "what-happens-if-the-switch-onto",
        question: "What if the switch to the pool fails?",
        short: [
          "The agent puts the original mounts back and starts your services again.",
          "Your original disks are never written during the switch.",
          "Amoeba then tries the switch again, so your services can restart more than once.",
          "If Amoeba can’t confirm the result, the move pauses until you click “Resume”.",
        ],
      },
      {
        id: "can-i-go-back-to-my",
        question: "What happens to my original disks?",
        short: [
          "Once the switch is checked, Amoeba detaches each original disk and takes a snapshot of it.",
          "It deletes the disk only after that snapshot is complete, and keeps the snapshot for 7 days.",
          "Amoeba doesn’t move a VM back to its original disks.",
        ],
      },
      {
        id: "which-resources-does-amoeba-delete",
        question: "Which resources does Amoeba delete?",
        short: [
          "A pool disk that a shrink emptied.",
          "A disk an expand created, if that expand gave up.",
          "An original disk, once the switch is checked and its snapshot is complete.",
          "That snapshot, 7 days after its disk is deleted.",
        ],
      },
    ],
  },
  {
    id: "downtime-and-performance",
    title: "Downtime and performance",
    callout: {
      title: "No downtime to grow or shrink",
      text: "The pool stays mounted while it grows and shrinks. Only the move onto the pool restarts the services that use the data mounts.",
    },
    questions: [
      {
        id: "is-there-downtime",
        question: "Is there downtime?",
        short: [
          "Amoeba grows and shrinks the pool without any downtime. The pool stays mounted and your services keep running.",
          "The move onto the pool has a short restart at the switch. The services that use the data mounts stop, then start again on the pool.",
          "The switch runs by itself once the copy has caught up, so you don’t pick its time.",
        ],
      },
      {
        id: "does-the-copy-slow-down-my",
        question: "Does the copy slow down my VM?",
        short: [
          "The copy runs inside the VM, and slows down or pauses when your disks are busy.",
          "This needs cgroup v2 on the VM. Without it, the copy doesn’t slow down for your load.",
        ],
      },
      {
        id: "what-disk-performance-does-the-pool",
        question: "What performance does the pool get?",
        short: [
          "Amoeba sizes the pool’s performance to your VM’s measured disk load, within the VM size’s limits.",
          "On Premium SSD v2 and gp3, each disk gets at least its included baseline performance, and more when your load needs it.",
          "On Premium SSD, performance comes with disk size, so Amoeba picks sizes that carry the load.",
          "Amoeba never shrinks a pool if the remaining disks couldn’t carry the load.",
        ],
      },
    ],
  },
  {
    id: "expanding-when-data-grows",
    title: "Expanding and shrinking",
    callout: {
      title: "Expands run on their own",
      text: "Amoeba expands a pool on its own as it fills. Only shrinks can wait for you, in “Manual”.",
    },
    questions: [
      {
        id: "how-fast-does-amoeba-expand-when",
        question: "What if data grows suddenly?",
        short: [
          "Amoeba grows the pool before it fills, and sooner when data arrives fast.",
          "It checks the pool’s use on every report from the agent.",
          "An expand grows existing disks or adds new ones while the pool stays mounted, so your services keep running.",
        ],
      },
      {
        id: "when-does-amoeba-shrink-the-pool",
        question: "When does Amoeba shrink the pool?",
        short: [
          "When your data goes down and stays down. Amoeba then shrinks the pool one disk at a time.",
          "A shrink waits until the move is done and Amoeba has seen enough of your use.",
          "“Auto”, the default, starts each shrink by itself when the pool is quiet. “Manual” waits for you to start it.",
          "The pool stays mounted while it shrinks, so your services keep running.",
          [
            "If a pool hasn’t shrunk yet, ",
            {
              href: `${routes.amoebaTroubleshooting}#amoeba-has-not-rightsized-my-disks-yet`,
              text: "Amoeba troubleshooting",
            },
            " lists the checks.",
          ],
        ],
      },
      {
        id: "does-manual-stop-amoeba-from-expanding",
        question: "Does “Manual” stop Amoeba from expanding?",
        short: [
          "No. “Manual” in “When Zoorik shrinks” holds back shrinks only. Expands always run on their own.",
        ],
      },
    ],
  },
  {
    id: "the-agent",
    title: "The agent",
    questions: [
      {
        id: "what-happens-if-the-agent-stops",
        question: "What happens if the agent stops reporting?",
        short: [
          "The pool stays mounted, but it can’t expand or shrink until the agent reports again.",
          "After a few minutes without a report, the agent shows as “Disconnected”.",
          "Amoeba then reinstalls it through Azure Run Command or AWS Systems Manager, never in the middle of a move step or pool change.",
          "To reinstall it yourself, click “Reinstall” in Settings.",
        ],
      },
      {
        id: "what-does-the-agent-send-to",
        question: "What does the agent send to Zoorik?",
        short: [
          "Facts about the VM and its disks, not the data on them. The copy runs inside the VM, so your data never passes through Zoorik.",
          "Each mount’s path, size and use, and the disks and systemd service behind it.",
          "Disk activity, and the pool’s size and error counters.",
          "Host facts: the kernel version, whether btrfs is available, and the encryption state.",
          "During the copy: its progress.",
          "If an install fails: the agent’s last log lines, with secrets removed.",
        ],
      },
      {
        id: "how-is-the-agent-installed-and",
        question: "How is the agent installed and updated?",
        short: [
          "Amoeba installs it when you onboard the VM, through Azure Run Command or AWS Systems Manager.",
          ["It runs as root, as the systemd service ", { code: "amoeba-agent.service" }, "."],
          "Amoeba updates it to each new release on its own. If a new version fails its health check, the previous one is restored.",
        ],
      },
    ],
  },
  {
    id: "platforms-and-disk-types",
    title: "Platforms and disk types",
    questions: [
      {
        id: "which-linux-distributions-does-amoeba-support",
        question: "Which Linux distributions does Amoeba support?",
        short: [
          "Any Linux with systemd and a recent kernel that supports btrfs, built in or as a module. Amoeba loads the module if needed.",
          "Amoeba checks the running kernel, not the distribution’s name. If the kernel has no btrfs, the move pauses.",
          "The VM also needs rsync, btrfs-progs and psmisc. The installer doesn’t add them.",
        ],
      },
      {
        id: "does-amoeba-work-on-windows-vms",
        question: "Does Amoeba work on Windows VMs?",
        short: ["Yes. Amoeba works on the data disks of Windows and Linux VMs, on Azure and AWS."],
      },
      {
        id: "does-amoeba-work-on-aws",
        question: "Does Amoeba work on AWS?",
        short: [
          "Yes. Amoeba moves the EBS data volumes of running EC2 instances onto one pool of gp3 volumes.",
          "Each instance must be a Nitro type and managed by AWS Systems Manager, which installs the agent.",
        ],
      },
      {
        id: "which-disk-types-does-the-pool",
        question: "Which disk types does the pool use?",
        short: [
          "On Azure: Premium SSD v2 where the VM’s region and zone offer it, and Premium SSD elsewhere.",
          "On AWS: gp3 volumes in the instance’s Availability Zone.",
          "Each VM gets one pool, on one disk type.",
          "Data on Standard HDD, Standard SSD or Ultra Disk also moves to Premium SSD v2 or Premium SSD. From Standard HDD or Standard SSD, that can cost more.",
          "Zone-redundant (ZRS) disks move to a locally redundant pool, so that data loses zone redundancy.",
        ],
      },
    ],
  },
  {
    id: "costs-and-savings",
    title: "Costs and savings",
    questions: [
      {
        id: "how-is-the-saving-worked-out",
        question: "How is the saving worked out?",
        short: [
          "Before the move: what the planned pool would cost a month, against your current disks.",
          "After the move: what your original disks cost a month, against what the pool costs.",
          "On Azure, at the region’s list price from the Azure Retail Prices API, with a 730-hour month.",
          "On AWS, at list price from the AWS Price List API. AWS charges EBS per GB-month.",
        ],
      },
      {
        id: "do-i-pay-for-both-sets",
        question: "Do I pay for both sets of disks during the move?",
        short: [
          "Yes, but only while the move runs. Amoeba deletes your original disks once the switch is checked.",
          "After that, you pay for their snapshots for the 7 days they’re kept.",
          "The console’s disk spend counts both sets during the move.",
        ],
      },
      {
        id: "what-does-amoeba-cost",
        question: "What does Amoeba cost?",
        short: [
          [
            "Amoeba is ",
            { href: routes.pricing, text: "priced per GB it manages" },
            ". The assessment is free.",
          ],
          "Your order, or your marketplace purchase, sets the price and payment terms.",
          "Your cloud provider charges you directly for the disks and snapshots Amoeba creates or keeps.",
        ],
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    questions: [
      {
        id: "how-do-i-see-what-my",
        question: "How do I see what my VMs could save?",
        short: [
          [
            "Run the free ",
            { href: `${routes.assessment}?p=amoeba`, text: "block storage cost assessment" },
            " in your terminal or Cloud Shell, on Azure or AWS.",
          ],
          "It writes one PDF report with each VM’s estimated saving at list price.",
          "It sends nothing to Zoorik, and asks once before it reads inside your VMs.",
        ],
      },
      {
        id: "can-i-start-with-one-vm",
        question: "Can I start with one VM?",
        short: [
          "Yes. Amoeba acts only on the VMs you onboard, and leaves every other VM alone.",
          "To start each shrink yourself, set “When Zoorik shrinks” to “Manual”.",
        ],
      },
      {
        id: "what-does-amoeba-need-in-my",
        question: "What does Amoeba need on Azure?",
        short: [
          "A custom role, “Zoorik Storage Operator”, assigned to Zoorik’s app on each subscription you choose.",
          "The role can read every resource, update VMs, run commands on them, and create and delete disks and snapshots.",
          "A script you run in Azure Cloud Shell, under your own sign-in, adds the app, creates the role and assigns it.",
        ],
      },
      {
        id: "what-does-amoeba-need-on-aws",
        question: "What does Amoeba need on AWS?",
        short: [
          "An IAM role, ZoorikStorageOperator, created by a script you run in AWS CloudShell. It trusts Zoorik’s AWS account only with your organisation’s external ID.",
          "The role can read EC2 and Systems Manager, run commands through Systems Manager, and create, modify, attach, detach, delete and tag volumes.",
          "It can also create, delete and tag snapshots, and use KMS through EC2, so encrypted volumes keep their key.",
          "Each instance must be running, managed by Systems Manager and a Nitro type, with at least one EBS data volume.",
        ],
      },
    ],
  },
];
