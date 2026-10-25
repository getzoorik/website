import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/df-vs-du/1";

export const term: GlossaryTerm = {
  slug: "df-vs-du",
  term: "df vs du",
  title: "df vs du: meaning and cost impact",
  meta: "df vs du: df shows how much of a whole file system is used, and du adds up your files. See why the two differ and how to find space you pay for but don’t use.",
  h1: "df vs du: meaning and cost impact",
  card: "df vs du is the comparison of two Linux commands that report disk space.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: "df vs du is the comparison of two Linux commands that report disk space. The difference between du and df in Linux is where each one looks:",
    },
    {
      kind: "ul",
      items: [
        [{ code: "df" }, " shows what a whole file system has used and has left."],
        [{ code: "du" }, " adds up the space your files take, folder by folder."],
        [
          { code: "du" },
          " can’t see a file that no folder lists, such as a deleted file that’s still open.",
        ],
      ],
    },
    { kind: "code", lang: "", code: "df -h /data\ndu -shx /data" },
    {
      kind: "p",
      text: [
        "Use ",
        { code: "-h" },
        " for sizes such as 20G, ",
        { code: "-s" },
        " for one total, and ",
        { code: "-x" },
        " to stay on one file system.",
      ],
    },
  ],
  sections: [
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
            "The missing 20\u00a0GiB is a deleted log file. An app still has it open, and Linux keeps a deleted file until the last process using it closes it. So ",
            { code: "df" },
            " counts it, and ",
            { code: "du" },
            " can’t.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: ["Restart the app, and ", { code: "df" }, " drops by 20\u00a0GiB."] },
      ],
    },
    {
      id: "why-it-matters-for-your-bill",
      title: "Why it matters for your bill",
      blocks: [
        {
          kind: "ul",
          items: [
            "AWS bills Amazon Elastic Block Store (EBS) volumes by the GB you provision per month.",
            "On EBS, the example disk bills 100\u00a0GiB for 30\u00a0GiB of files.",
            [
              "If ",
              { code: "df" },
              " says a disk is full, check the df and du difference before you pay for a bigger one.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For a cloud virtual machine (VM), see how to check ",
            { a: "Azure VM disks", href: "/learn/azure-vm-disk-usage" },
            " and ",
            { a: "EBS volumes", href: "/learn/check-ebs-volume-usage" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. The ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " works out your own figure.",
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
      line: "The block storage volume Azure manages for a VM.",
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
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
  ],
};
