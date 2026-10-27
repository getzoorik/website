import { routes } from "@/config/site";
import type { FaqSection } from "@/content/faq";

/**
 * `/amoeba/faq`: every string the page prints, verbatim from the approved mock:
 * 8 groups ("About Amoeba" first), 29 questions, their short answers, and the
 * two callouts atop their groups. It keeps the 48-hour soak and going back, as
 * the approved mock does. The mock's typography is kept: curly quotes and
 * apostrophes, and a no-break space between a figure and its unit ("48 h",
 * "7 days").
 *
 * 🔴 CLIENT ANSWERS ONLY. Each question carries its short answer and nothing
 * else: the draft's technical answers are for Zoorik's own team and never reach
 * this site, nor do its deck, fine print, cards, sources or gaps.
 * `src/app/internal-docs.test.ts` fails if they come back.
 *
 * Five facts are still to come, each a whole bullet carried as a `{ ph }`
 * segment in the mock's place. Filling one is replacing its segment with text;
 * nothing else changes.
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
      "Answers on how Amoeba keeps data safe, what restarts and when, how pools expand and shrink, and how it runs on Azure managed disks and Amazon EBS.",
  },
  /* The deck is the Docs hub tile's line, with a period. */
  hero: {
    title: "Amoeba FAQ",
    deck: "Safety, downtime, expanding, agent and costs.",
  },
  updated: "Updated 19 October 2026",
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
          "It moves a VM’s data disks onto one pool sized to the data plus 20%, then expands and shrinks that pool online, one disk at a time.",
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
          "The data disks of running VMs: Azure managed disks, and Amazon EBS volumes on EC2 instances.",
          "On Linux: systemd, kernel 5.14 or later, btrfs, and a VM size with at least 8 data-disk slots. Red Hat family VMs are not moved.",
          "On AWS, the instance must be managed by AWS Systems Manager and be a Nitro type.",
        ],
      },
      {
        id: "what-does-onboarding-a-vm-change",
        question: "What does onboarding a VM change?",
        short: [
          "Amoeba installs its agent through Azure Run Command or AWS Systems Manager, builds the pool beside your disks and copies the data inside the VM.",
          "At the switch, the systemd services on the data mounts restart, and the pool is mounted at the same paths.",
          "For 48\u00a0hours you can go back to the original disks.",
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
            " works out your own figure from your Azure VMs, at list price. For Amazon EBS, book a call.",
          ],
        ],
      },
      {
        id: "how-do-i-get-amoeba",
        question: "How do I get Amoeba?",
        short: [
          "Amoeba is in early access. Book a demo for early access, or, on Azure, run the free assessment first.",
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
          [
            {
              ph: "what happens to writes made on the pool if a late check fails after the services restarted",
            },
          ],
          "Amoeba then tries the switch again, so your services can restart more than once.",
          "If the outcome can’t be known, the move pauses instead.",
        ],
      },
      {
        id: "can-i-go-back-to-my",
        question: "Can I go back to my original disks?",
        short: [
          "Yes, during the 48\u00a0h soak after the switch. “Go back” returns the VM to its source disks and deletes the pool’s disks.",
          "After the soak, the source disks are deleted. Each leaves a safety snapshot, kept for 7\u00a0days.",
          "Going back needs the agent connected.",
        ],
      },
      {
        id: "which-resources-does-amoeba-delete",
        question: "Which resources does Amoeba delete?",
        short: [
          "An elastic disk it emptied in a shrink.",
          "A source disk after the soak, once its snapshot is complete.",
          "The pool’s disks after you go back, and a disk an expand created and gave up on.",
          "A safety snapshot when its 7\u00a0days end.",
        ],
      },
    ],
  },
  {
    id: "downtime-and-performance",
    title: "Downtime and performance",
    callout: {
      title: "Services restart at the switch",
      text: "Moving a VM onto its pool restarts the systemd services that use its data mounts. After that, the pool expands and shrinks online.",
    },
    questions: [
      {
        id: "is-there-downtime",
        question: "Is there downtime?",
        short: [
          "At the switch onto the pool, and again if you go back: the systemd services that use the VM’s data mounts stop, the mounts move, and the services start again.",
          "The switch runs by itself as soon as the copy has caught up. You don’t pick its time.",
          "After that, the pool expands and shrinks online, without unmounting.",
        ],
      },
      {
        id: "does-the-copy-slow-down-my",
        question: "Does the copy slow down my VM?",
        short: [
          "The copy runs inside the VM, and Amoeba sets its speed from your VM’s own disk load.",
          "When the disks are busy, the copy slows down or waits. This needs cgroup v2 IO readings on the VM; without them the copy doesn’t back off.",
          [{ ph: "measured effect of the copy on disk latency" }],
        ],
      },
      {
        id: "what-disk-performance-does-the-pool",
        question: "What disk performance does the pool get?",
        short: [
          "On Premium SSD v2, each pool disk gets at least 3,000 IOPS and 125 MBps, and more IOPS when the VM’s own load needs it.",
          "On Premium SSD and Standard SSD, each disk has the performance of its size tier.",
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
      text: "Amoeba expands a pool on its own as it fills, except while a move is paused after the switch. Only shrinks can wait for you, in “Manual”.",
    },
    questions: [
      {
        id: "how-fast-does-amoeba-expand-when",
        question: "How fast does Amoeba expand when data grows suddenly?",
        short: [
          "The agent reports every 15\u00a0seconds, and Amoeba checks each pool every 60\u00a0seconds.",
          "When free space falls below 12% of the pool, or 25\u00a0GiB if that is more, it expands at once.",
          "It also expands when the pool is above its band, or would reach that floor within 6\u00a0hours at its fill rate.",
          [{ ph: "typical time from the trigger to the added capacity" }],
        ],
      },
      {
        id: "does-manual-stop-amoeba-from-expanding",
        question: "Does “Manual” stop Amoeba from expanding?",
        short: [
          "No. “When Zoorik shrinks” governs shrinks only. Expands run on their own, except while a move is paused after the switch.",
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
          "After 120\u00a0seconds without a report, the agent reads “Disconnected”. Amoeba then reinstalls it through Azure Run Command or AWS Systems Manager, never during a move step or a pool operation.",
          "Commands wait until it reconnects. The pool stays mounted, but it can’t expand or shrink in the meantime.",
          "“Reinstall” in Settings installs it again.",
        ],
      },
      {
        id: "what-does-the-agent-send-to",
        question: "What does the agent send to Zoorik?",
        short: [
          "Every 15\u00a0seconds: each mount’s size and use, the disks behind it, disk activity, and the pool’s error counters.",
          "Host facts: the kernel version, the OS family, whether btrfs is available, and the encryption state.",
          "During the move: copy progress, and how busy the disks are.",
        ],
      },
      {
        id: "how-is-the-agent-installed-and",
        question: "How is the agent installed and updated?",
        short: [
          "Through Azure Run Command or AWS Systems Manager, when you onboard the VM.",
          "It runs as the systemd service amoeba-agent.service, as root, on Java 17 or later.",
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
          "Linux with systemd, kernel 5.14 or later, and btrfs available.",
          "rsync, btrfs-progs and psmisc installed; the installer doesn’t add them.",
          "VMs whose OS is in the Red Hat family, as the agent reads it, are not moved onto a pool.",
          [{ ph: "supported Linux distributions and versions" }],
        ],
      },
      {
        id: "does-amoeba-work-on-windows-vms",
        question: "Does Amoeba work on Windows VMs?",
        short: [
          [{ ph: "Windows support: versions, filesystems, and how the pool works on Windows" }],
        ],
      },
      {
        id: "does-amoeba-work-on-aws",
        question: "Does Amoeba work on AWS?",
        short: [
          "Yes. Amoeba pools the non-root EBS data volumes of running EC2 instances onto gp3 volumes in the instance’s Availability Zone.",
          "You connect an account with its 12-digit ID and a script in AWS CloudShell that creates the IAM role ZoorikStorageOperator. The role trusts Zoorik only with your organisation’s external ID.",
          "The agent installs through AWS Systems Manager. Instances must be Linux, running, managed by Systems Manager, and a Nitro type.",
        ],
      },
      {
        id: "which-disk-types-does-the-pool",
        question: "Which disk types does the pool use?",
        short: [
          "On Azure: the type your data sits on today: Premium SSD v2, Premium SSD or Standard SSD.",
          "Where the VM’s region or zone doesn’t offer Premium SSD v2, the pool uses Premium SSD.",
          "Each VM gets one pool, on one disk type.",
          "Data on Standard HDD or Ultra Disk moves to Premium SSD v2 or Premium SSD, which costs more. Zone-redundant (ZRS) disks map to a locally redundant pool.",
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
          "On AWS, at the AWS Price List API’s list price. EBS bills per GB-month.",
        ],
      },
      {
        id: "do-i-pay-for-both-sets",
        question: "Do I pay for both sets of disks during the move?",
        short: [
          "Yes, from Provision until the source disks are deleted after the 48\u00a0h soak.",
          "Each safety snapshot is kept for 7\u00a0days, then deleted.",
          "The console’s disk spend counts both sets while the move runs.",
        ],
      },
      {
        id: "what-does-amoeba-cost",
        question: "What does Amoeba cost?",
        short: [
          "The assessment is free. If you pay for Amoeba, the price, billing period and payment terms are in your order.",
          "Your cloud provider bills you directly for the disks and snapshots Amoeba creates or keeps.",
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
          "Run the free block storage assessment in your terminal or Cloud Shell, on Azure or AWS. It writes one PDF report with each VM’s estimated saving at list price.",
          "It sends nothing anywhere, and asks once before it reads inside your VMs.",
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
          "Instances must be Linux, running, managed by Systems Manager and a Nitro type, with at least one EBS data volume.",
        ],
      },
    ],
  },
];
