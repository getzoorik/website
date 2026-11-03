import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/df-vs-du/1";

export const term: GlossaryTerm = {
  slug: "df-vs-du",
  term: "df vs du",
  title: "df vs du: check disk space in Linux",
  meta: "How to check disk space in Linux with df and du: the commands to run, what each one measures, and why their numbers disagree.",
  h1: "df vs du: check disk space in Linux",
  card: "df and du are the two Linux commands for checking disk space.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "df and du are the two Linux commands for checking disk space. ",
        { code: "df" },
        " shows how full a whole file system is, and ",
        { code: "du" },
        " adds up your files’ disk usage, folder by folder.",
      ],
    },
    {
      kind: "p",
      text: [
        "So ",
        { code: "df" },
        " can count space that ",
        { code: "du" },
        " can’t see, such as a deleted file that a process still holds open.",
      ],
    },
  ],
  sections: [
    {
      id: "how-to-check-disk-space-in-linux",
      title: "Check disk space in Linux",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: "# Every mounted file system: size, used and free\ndf -h\n\n# The file system that holds /data\ndf -h /data\n\n# The files under /data, as one total\ndu -shx /data\n\n# Each folder under /data, to find what fills it\ndu -hx --max-depth=1 /data",
        },
        {
          kind: "p",
          text: [
            { code: "-h" },
            " prints sizes such as 20G, ",
            { code: "-s" },
            " gives one total, and ",
            { code: "-x" },
            " keeps ",
            { code: "du" },
            " on one file system.",
          ],
        },
      ],
    },
    {
      id: "an-example-df-and-du-showing-different",
      title: "Why df and du disagree",
      blocks: [
        {
          kind: "p",
          text: [
            "Say a 100\u00a0GiB disk is mounted at /data (an illustration). ",
            { code: "df -h" },
            " says 50G used, but ",
            { code: "du" },
            " says 30G.",
          ],
        },
        {
          kind: "p",
          text: [
            "The missing 20\u00a0GiB is a deleted log file that an app still holds open. Linux keeps a deleted file until the last process closes it. So ",
            { code: "df" },
            " counts it, and ",
            { code: "du" },
            " can’t see it.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "code",
          lang: "bash",
          code: "# Deleted files still held open on /data\nlsof +aL1 /data",
        },
        { kind: "p", text: ["Restart the app, and ", { code: "df" }, " drops by 20\u00a0GiB."] },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Amazon Elastic Block Store (EBS) volumes and Azure managed disks are charged by provisioned size, not by the data on them.",
            "In the example, you pay for 100\u00a0GiB to hold 30\u00a0GiB of files.",
            [
              "When ",
              { code: "df" },
              " says a disk is nearly full, check ",
              { code: "du" },
              " before you pay for a bigger one.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To compare used and provisioned space on a cloud virtual machine (VM), see ",
            { a: "Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
            " and ",
            { a: "EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            ". On a btrfs pool, plain ",
            { code: "df" },
            " can mislead: see ",
            { a: "btrfs unallocated vs free space", href: "/learn/btrfs-unallocated-space" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data. It then rightsizes the pool autonomously, so you pay for close to what you use.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Thin provisioning",
      line: "Space taken only as you write data.",
      href: "/learn/glossary/thin-provisioning",
    },
    { title: "EBS volume", line: "AWS block storage.", href: "/learn/glossary/ebs-volume" },
    {
      title: "Azure managed disk",
      line: "Azure’s block storage for a VM.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Block storage",
      line: "Storage a server uses as a disk.",
      href: "/learn/glossary/block-storage",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "How to check Azure VM disk usage",
    href: "/learn/azure-vm-disk-usage",
  },
  sources: [
    {
      publisher: "man7.org",
      title: "“df(1): Linux manual page”",
      url: "https://man7.org/linux/man-pages/man1/df.1.html",
    },
    {
      publisher: "man7.org",
      title: "“du(1): Linux manual page”",
      url: "https://man7.org/linux/man-pages/man1/du.1.html",
    },
    {
      publisher: "man7.org",
      title: "“unlink(2): Linux manual page”",
      url: "https://man7.org/linux/man-pages/man2/unlink.2.html",
    },
    {
      publisher: "man7.org",
      title: "“lsof(8): Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/lsof.8.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
  ],
};
