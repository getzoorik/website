import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/df-vs-du/1";

export const term: GlossaryTerm = {
  slug: "df-vs-du",
  term: "df vs du",
  title: "df vs du in Linux: why the results differ",
  meta: "df and du are disk usage commands in Linux: df reads a whole file system, du adds up your files. See why they differ and find space you pay for but don’t use.",
  h1: "df vs du in Linux: why the results differ",
  card: "df and du are two Linux commands that show disk usage.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "df and du are two Linux commands that show disk usage. The difference between du and df in Linux is where each one looks:",
    },
    {
      kind: "ul",
      items: [
        [
          "The Linux command ",
          { code: "df" },
          " shows what a whole file system has used and has left.",
        ],
        [
          { code: "du" },
          " adds up the space your files take, folder by folder, so it can’t see a deleted file that’s still open.",
        ],
      ],
    },
  ],
  sections: [
    {
      id: "how-to-check-disk-space-in-linux",
      title: "How to check disk space in Linux with df and du",
      blocks: [
        { kind: "p", text: "Run both on the same mount:" },
        { kind: "code", lang: "", code: "df -h /data\ndu -shx /data" },
        {
          kind: "p",
          text: [
            "Use ",
            { code: "-h" },
            " to see disk usage in sizes such as 20G, ",
            { code: "-s" },
            " for one total, and ",
            { code: "-x" },
            " to stay on one file system. So ",
            { code: "du -sh" },
            " prints one readable total.",
          ],
        },
      ],
    },
    {
      id: "an-example-df-and-du-showing-different",
      title: "An example: df and du showing different results",
      blocks: [
        {
          kind: "p",
          text: [
            "Say a 100\u00a0GiB disk is mounted at /data (an illustration). Then ",
            { code: "df -h" },
            " says 50G used, but ",
            { code: "du" },
            " says only 30G.",
          ],
        },
        {
          kind: "p",
          text: [
            "The missing 20\u00a0GiB is a deleted log file. An app still has it open, and Linux keeps a deleted file until the last process closes it. So ",
            { code: "df" },
            " counts it, and ",
            { code: "du" },
            " can’t.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "code",
          lang: "",
          code: "# Deleted files still held open on /data\nlsof +aL1 /data",
        },
        { kind: "p", text: ["Restart the app, and ", { code: "df" }, " drops by 20\u00a0GiB."] },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why df and du matter for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Disk usage on Linux shows what your files use, but Amazon Elastic Block Store (EBS) volumes are charged per provisioned GB per month.",
            "On EBS, you pay for 100\u00a0GiB for the example’s 30\u00a0GiB of files.",
            [
              "If ",
              { code: "df" },
              " says Linux disk space is running out, check the df and du difference before you pay for a bigger disk.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To check a cloud virtual machine (VM), see ",
            { a: "Azure VM disks", href: "/learn/azure-vm-disk-usage" },
            " and ",
            { a: "EBS volumes", href: "/learn/check-ebs-volume-usage" },
            ". On a btrfs pool, plain ",
            { code: "df" },
            " can mislead; see ",
            { a: "btrfs unallocated space vs free space", href: "/learn/btrfs-unallocated-space" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously.",
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
    { title: "Block storage", line: "What both disks are.", href: "/learn/glossary/block-storage" },
  ],
  next: {
    title: "Azure VM disk usage: check used vs provisioned",
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
  ],
};
