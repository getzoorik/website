import { routes } from "@/config/site";
import type { FaqSection } from "@/content/faq";

/**
 * `/amoeba-faq`: every string the page prints, verbatim from the approved mock:
 * 8 groups ("About Amoeba" first), 29 questions, their short answers, and the
 * two callouts atop their groups. On 27 October 2026 its Amoeba answers were
 * rewritten at product level (docs PRODUCT-LEVEL-AMOEBA.md): what Amoeba does,
 * and none of its internal numbers. They replace the mock's older ones. The
 * mock's typography is kept: curly quotes and apostrophes.
 *
 * 🔴 CLIENT ANSWERS ONLY. Each question carries its short answer and nothing
 * else: the draft's technical answers are for Zoorik's own team and never reach
 * this site, nor do its deck, fine print, cards, sources or gaps.
 * `src/app/internal-docs.test.ts` fails if they come back.
 *
 * On 1 November 2026 the four "To come" bullets were dropped: the Windows
 * question gives its short yes, and the other three answers keep their written
 * bullets. A fact that is written later goes back in as a bullet of its answer.
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
      "Amoeba FAQ: how it keeps data safe, what restarts and when, what happens to your original disks, how pools grow and shrink, and how it runs on Azure and AWS.",
  },
  /* The deck is the Docs hub tile's line, with a period. */
  hero: {
    title: "Amoeba FAQ",
    deck: "Safety, downtime, expanding, agent and costs.",
  },
  updated: "Updated 1 November 2026",
} as const;

/** The 8 groups and 29 questions, in the mock's order. */
export const amoebaFaqSections: readonly FaqSection<AmoebaFaqQuestionId>[] = [
  {
    id: "about-amoeba",
    title: "About Amoeba",
    questions: [
      {
        id: "what-is-amoeba",
        question: "What is Amoeba?",
        short: [
          "Amoeba is block storage cost optimization for VMs on Azure and AWS.",
          "It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. It grows the pool before it fills, and shrinks it one disk at a time when your data goes down and stays down. So you pay for close to what you use.",
          [
            "More on the product page: ",
            { href: routes.amoeba, text: "Block storage cost optimization on Azure and AWS" },
            ".",
          ],
        ],
      },
      {
        id: "which-disks-does-amoeba-work-on",
        question: "Which disks does Amoeba work on?",
        short: [
          "The data disks of running Windows and Linux VMs: Azure managed disks, and Amazon EBS volumes on EC2 instances. Amoeba never touches the OS disk or root volume.",
          "On Linux, the kernel must be recent and support btrfs. Every service that keeps a data mount open must run under systemd. The VM needs a few free disk slots for the pool.",
          "On AWS, the instance must be managed by AWS Systems Manager and be a Nitro type.",
        ],
      },
      {
        id: "what-does-onboarding-a-vm-change",
        question: "What does onboarding a VM change?",
        short: [
          "Amoeba installs its agent through Azure Run Command or AWS Systems Manager. It builds the pool beside your disks and copies your data while your services run.",
          "Then it switches each mount to the pool at the same path, with a short restart of the services that use it.",
          "Once the switch is checked, Amoeba snapshots each source disk and deletes the disk. It keeps each snapshot for 7 days, then deletes it too.",
        ],
      },
      {
        id: "do-my-applications-need-changes",
        question: "Do my applications need changes?",
        short: [
          "No. Each data mount keeps its path, so applications read and write where they did before.",
          "Every process that keeps a data mount open must run as a systemd service, so the agent can stop and start it at the switch.",
        ],
      },
      {
        id: "how-much-can-amoeba-save",
        question: "How much can Amoeba save?",
        short: [
          "We estimate 50–60% off block storage cost. It is an estimated range, not a promise.",
          [
            "The ",
            { href: `${routes.assessment}?p=amoeba`, text: "free block storage cost assessment" },
            " works out your own figure from your Azure VMs and EC2 instances, at list price.",
          ],
        ],
      },
      {
        id: "how-do-i-get-amoeba",
        question: "How do I get Amoeba?",
        short: [
          "Amoeba is in early access. Book a demo for early access, or run the free assessment first.",
        ],
      },
    ],
  },
  {
    id: "safety-and-data",
    title: "Safety and data",
    questions: [
      {
        id: "can-a-shrink-lose-data",
        question: "Can a shrink lose data?",
        short: [
          "A disk leaves the pool only after its data has moved to the other disks and the filesystem no longer uses it.",
          "Before it starts, Amoeba checks the other disks have room for the data and can serve the VM’s disk load.",
          "A pool that reports disk errors is never shrunk.",
          "The emptied disk holds no data, so it is deleted at once, with no snapshot.",
        ],
      },
      {
        id: "what-happens-if-the-switch-onto",
        question: "What happens if the switch onto the pool fails?",
        short: [
          "The agent tries to put the original mounts back and start your services again. The source disks are never written during the switch.",
          "Amoeba then tries the switch again, so your services can restart more than once.",
          "If the outcome can’t be known, the move pauses instead.",
        ],
      },
      {
        id: "can-i-go-back-to-my",
        question: "What happens to my original disks?",
        short: [
          "A move only goes forward. Once the switch is checked, Amoeba detaches each source disk and takes a snapshot of it.",
          "It deletes a source disk only after that disk’s own snapshot is complete.",
          "It keeps each safety snapshot for 7 days, then deletes it too.",
        ],
      },
      {
        id: "which-resources-does-amoeba-delete",
        question: "Which resources does Amoeba delete?",
        short: [
          "A pool disk it emptied in a shrink.",
          "A source disk after the switch is checked, once its snapshot is complete.",
          "A disk an expand created and gave up on.",
          "A safety snapshot, 7 days after its source disk is deleted.",
        ],
      },
    ],
  },
  {
    id: "downtime-and-performance",
    title: "Downtime and performance",
    callout: {
      title: "Services restart at the switch",
      text: "Moving a VM onto its pool restarts the systemd services that use its data mounts. After that, the pool expands and shrinks while it stays mounted.",
    },
    questions: [
      {
        id: "is-there-downtime",
        question: "Is there downtime?",
        short: [
          "At the switch onto the pool: the systemd services that use the VM’s data mounts stop, the mounts move, and the services start again.",
          "The switch runs by itself as soon as the copy has caught up. You don’t pick its time.",
          "After that, the pool expands and shrinks while your services run, without unmounting.",
        ],
      },
      {
        id: "does-the-copy-slow-down-my",
        question: "Does the copy slow down my VM?",
        short: [
          "The copy runs inside the VM, and Amoeba sets its speed from your VM’s own disk load.",
          "When the disks are busy, the copy slows down or waits. This needs cgroup v2 on the VM. Without it, the copy doesn’t slow down for your load.",
        ],
      },
      {
        id: "what-disk-performance-does-the-pool",
        question: "What disk performance does the pool get?",
        short: [
          "On Premium SSD v2 and gp3, each pool disk gets at least the baseline performance its cloud includes. It gets more when the VM’s own load needs it.",
          "On Premium SSD, each disk carries the performance of its size, and Amoeba picks sizes that carry the load.",
          "Amoeba doesn’t shrink a pool when the disks that stay couldn’t serve the VM’s disk load.",
        ],
      },
    ],
  },
  {
    id: "expanding-when-data-grows",
    title: "Expanding when data grows",
    callout: {
      title: "Expands run on their own",
      text: "Amoeba expands a pool on its own as it fills. Only shrinks can wait for you, in “Manual”.",
    },
    questions: [
      {
        id: "how-fast-does-amoeba-expand-when",
        question: "How fast does Amoeba expand when data grows suddenly?",
        short: [
          "Amoeba grows the pool before it fills, and sooner when data arrives fast.",
          "The agent reports the pool’s use regularly, and Amoeba weighs an expand on every report.",
          "An expand adds room while the pool stays mounted, so your services keep running.",
        ],
      },
      {
        id: "does-manual-stop-amoeba-from-expanding",
        question: "Does “Manual” stop Amoeba from expanding?",
        short: [
          "No. “When Zoorik shrinks” governs shrinks only. Expands run on their own, whatever the setting.",
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
          "If the agent stops reporting for a few minutes, it reads “Disconnected”. Amoeba then reinstalls it through Azure Run Command or AWS Systems Manager, never during a move step or a pool operation.",
          "Commands wait until it reconnects. The pool stays mounted, but it can’t expand or shrink in the meantime.",
          "“Reinstall” in Settings installs it again.",
        ],
      },
      {
        id: "what-does-the-agent-send-to",
        question: "What does the agent send to Zoorik?",
        short: [
          "In its regular reports: each mount’s size and use, the disks behind it, disk activity, and the pool’s error counters.",
          "Host facts: the kernel version, whether btrfs is available, and the encryption state.",
          "During the move: copy progress, and how busy the disks are.",
        ],
      },
      {
        id: "how-is-the-agent-installed-and",
        question: "How is the agent installed and updated?",
        short: [
          "Through Azure Run Command or AWS Systems Manager, when you onboard the VM.",
          "It runs as the systemd service amoeba-agent.service, as root.",
          "Amoeba updates it to each new release by itself. A version that fails its health check rolls back.",
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
          "Any Linux with systemd and a recent kernel that supports btrfs.",
          "It also needs rsync, btrfs-progs and psmisc. The installer doesn’t add them.",
          "Amoeba doesn’t read the OS name. The running kernel alone decides.",
          "Amoeba loads a btrfs module that isn’t loaded yet. If the kernel has no btrfs, the move pauses.",
        ],
      },
      {
        id: "does-amoeba-work-on-windows-vms",
        question: "Does Amoeba work on Windows VMs?",
        short: [
          "Yes. Amoeba works on the data disks of running Windows and Linux VMs, on Azure and AWS.",
        ],
      },
      {
        id: "does-amoeba-work-on-aws",
        question: "Does Amoeba work on AWS?",
        short: [
          "Yes. Amoeba pools the non-root EBS data volumes of running EC2 instances onto gp3 volumes in the instance’s Availability Zone.",
          "You connect an account with its 12-digit ID and a script in AWS CloudShell that creates the IAM role ZoorikStorageOperator. The role trusts Zoorik only with your organisation’s external ID.",
          "The agent installs through AWS Systems Manager. Instances must be running, managed by Systems Manager, and a Nitro type.",
        ],
      },
      {
        id: "which-disk-types-does-the-pool",
        question: "Which disk types does the pool use?",
        short: [
          "On Azure: Premium SSD v2 where the VM’s region and zone offer it.",
          "Where the VM’s region or zone doesn’t offer Premium SSD v2, the pool uses Premium SSD.",
          "Each VM gets one pool, on one disk type.",
          "Data on Standard HDD, Standard SSD or Ultra Disk moves to Premium SSD v2 or Premium SSD. From Standard HDD or Standard SSD, that can cost more. Zone-redundant (ZRS) disks map to a locally redundant pool.",
          "On AWS, the pool uses gp3 volumes in the instance’s Availability Zone.",
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
          "Before the pool: what the planned pool would cost, against the disks you have now.",
          "After the move: what the source disks cost a month, against what the pool costs.",
          "At Azure’s list price for the region, with a 730-hour month.",
          "On AWS, at the AWS Price List API’s list price. AWS charges for EBS per GB-month.",
        ],
      },
      {
        id: "do-i-pay-for-both-sets",
        question: "Do I pay for both sets of disks during the move?",
        short: [
          "Yes, but only while the move runs. The source disks are deleted once the switch is checked.",
          "Then you pay for the safety snapshots for the 7 days they’re kept.",
          "The console’s disk spend counts both sets while the move runs.",
        ],
      },
      {
        id: "what-does-amoeba-cost",
        question: "What does Amoeba cost?",
        short: [
          "The assessment is free. If you pay for Amoeba, your order sets the price, how often you pay and the payment terms.",
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
          "Run the free block storage cost assessment in your terminal or Cloud Shell, on Azure or AWS. It writes one PDF report with each VM’s estimated saving at list price.",
          "It sends nothing to Zoorik, and asks once before it reads inside your VMs.",
        ],
      },
      {
        id: "can-i-start-with-one-vm",
        question: "Can I start with one VM?",
        short: [
          "Yes. Amoeba acts only on the VMs you onboard, and leaves every other VM alone.",
          "Set “When Zoorik shrinks” to “Manual” to start each shrink yourself.",
        ],
      },
      {
        id: "what-does-amoeba-need-in-my",
        question: "What does Amoeba need in my Azure subscription?",
        short: [
          "The custom role “Zoorik Storage Operator”, assigned to Zoorik’s app on each subscription.",
          "It can read every resource, update VMs, run commands on them, and create and delete disks and snapshots.",
          "You set it up by running the connect script with your own Azure sign-in.",
        ],
      },
      {
        id: "what-does-amoeba-need-on-aws",
        question: "What does Amoeba need on AWS?",
        short: [
          "The IAM role ZoorikStorageOperator, created by a script you run in AWS CloudShell. It trusts Zoorik’s AWS account only with your organisation’s external ID.",
          "It can read EC2 and Systems Manager; create, modify, attach, detach and delete volumes; create and delete snapshots; and run commands through Systems Manager.",
          "Instances must be running, managed by Systems Manager and a Nitro type, with at least one EBS data volume.",
        ],
      },
    ],
  },
];
