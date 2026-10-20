import { routes } from "@/config/site";
import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "shrink-azure-managed-disk",
  title: "Can you shrink an Azure managed disk?",
  meta: "No, not in place: Azure managed disks and Amazon EBS volumes only grow. The manual copy route, its downtime, and how Amoeba resizes a pool online.",
  h1: "Can you shrink an Azure managed disk?",
  deck: "Not in place. What works instead, what it costs you, and how Amoeba does it online.",
  card: "Not in place. The manual copy route, and how Amoeba rightsizes a pool autonomously, without any downtime.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-09",
  updated: "2026-10-09",
  author: "zoorik",
  shareCard: {
    url: "/og/zoorik-learn-shrink-azure-managed-disk-1200x630.png",
    alt: "Zoorik. Can you shrink an Azure managed disk?",
  },
  short:
    "No, not in place. Azure lets you make a managed disk larger but never smaller: Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss.” To pay for less space, you copy the data to a new, smaller disk and switch over. Amazon Elastic Block Store (EBS) volumes work the same way.",
  sections: [
    {
      id: "why-the-space-you-bought-stays-on",
      title: "Why the space you bought stays on the bill",
      blocks: [
        {
          kind: "p",
          text: "A managed disk is billed on the size you provision, not on the data it holds. Premium SSD and Standard SSD are billed by size tier, so a 512\u00a0GiB Premium SSD costs the same whether it holds 500\u00a0GiB or 5\u00a0GiB. Premium SSD v2 is billed for the GiB you provision, plus any IOPS and throughput above its included 3,000 IOPS and 125 MB/s.",
        },
        {
          kind: "p",
          text: "Disks grow for good reasons: a migration, a bulk import, a log spike, a busy season. Growing is easy. Azure can expand many data disks without stopping the VM, and you then grow the partition and the filesystem. When the data shrinks again, the space stays, and so does the charge.",
        },
        {
          kind: "p",
          text: "The worked example on the Amoeba page shows the effect: a Linux VM with four 512\u00a0GiB Premium SSD data disks, 2,048\u00a0GiB in all, holding 1,000\u00a0GiB of data. More than half of what is billed is empty.",
        },
      ],
    },
    {
      id: "why-a-disk-cant-shrink-in-place",
      title: "Why a disk can’t shrink in place",
      blocks: [
        {
          kind: "p",
          text: "A disk is a block device, and the filesystem on it can place data in any block, including the last ones. Cutting the end off the device would cut through that data. Shrinking safely means the filesystem first moves its data away from the end, and Azure can’t do that from outside your VM. Some filesystems can’t shrink at all: XFS can only grow.",
        },
      ],
    },
    {
      id: "the-manual-route-copy-to-a-smaller",
      title: "The manual route: copy to a smaller disk",
      blocks: [
        { kind: "p", text: "For a data disk on a Linux VM, the usual route is a copy:" },
        {
          kind: "steps",
          items: [
            "Create a managed disk at the size you want and attach it to the VM.",
            "Partition it, create a filesystem and mount it at a temporary path.",
            ["Copy the data with ", { code: "rsync" }, " while the application keeps running."],
            "Stop every service that writes to the old mount.",
            ["Run ", { code: "rsync" }, " again to copy what changed since the first pass."],
            [
              "Point ",
              { code: "/etc/fstab" },
              " at the new disk’s UUID and mount it at the old path.",
            ],
            "Start the services and check them.",
            "Snapshot the old disk, detach it, and delete it when you no longer need it.",
          ],
        },
        { kind: "p", text: "What it costs you:" },
        {
          kind: "ul",
          items: [
            "Downtime from step 4 to step 7, for every service on that mount.",
            [
              "Risk: a mistake in ",
              { code: "/etc/fstab" },
              " can stop the VM from booting, so add the ",
              { code: "nofail" },
              " option and test a reboot.",
            ],
            "Both disks on the bill while you work.",
            "A new fixed size. When the data grows, you expand again. When it shrinks, you copy again.",
          ],
        },
        {
          kind: "p",
          text: "This covers data disks. Shrinking an OS disk is a harder job, and Amoeba works on data disks only.",
        },
      ],
    },
    {
      id: "how-amoeba-does-it-online",
      title: "How Amoeba does it online",
      blocks: [
        {
          kind: "p",
          text: "Amoeba turns the copy into a one-time move, then resizes online from there.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba installs its agent through Azure Run Command and builds one pool beside your disks, sized to the data on the VM’s data mounts plus 20%, and at least 50\u00a0GiB larger than the data. The pool is one btrfs filesystem across several managed disks, and each data mount keeps its path.",
            ],
            [
              { b: "The copy." },
              " The agent copies each data mount onto the pool inside the VM, then copies what changed until the pool has caught up. The copy slows down or waits when the VM’s disks are busy.",
            ],
            [
              { b: "The switch." },
              " The agent stops the systemd services that hold the data mounts open, checks that nothing is left to copy, backs up ",
              { code: "/etc/fstab" },
              " and mounts the pool at the same paths. Then it starts the services again. That restart is the service interruption. It happens again only if you go back or Amoeba retries a failed switch.",
            ],
            [
              { b: "The soak." },
              " For 48\u00a0hours Amoeba watches the pool, and “Go back” returns the VM to its source disks. After the soak, each source disk is snapshotted, then deleted once its snapshot is complete. The snapshot is kept for 7\u00a0days.",
            ],
            [
              { b: "After the move." },
              " When data grows, Amoeba adds a disk to the pool, or grows one in place, without unmounting. When data shrinks, it moves one disk’s data onto the others, checks it, removes the disk from the filesystem, then detaches and deletes it, which stops its billing. A disk leaves the pool only when it is empty.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On Linux, Amoeba needs systemd, kernel 5.14 or later, btrfs, and a VM size with at least 8 data-disk slots. VMs in the Red Hat family are not moved.",
        },
      ],
    },
    {
      id: "what-about-amazon-ebs",
      title: "What about Amazon EBS?",
      blocks: [
        {
          kind: "p",
          text: "The same rule holds on AWS. Elastic Volumes let you increase an EBS volume’s size, change its type or adjust its performance while it stays attached, but not decrease its size. The manual route above works the same way.",
        },
        {
          kind: "p",
          text: "Amoeba does the same job on AWS. It pools the non-root EBS data volumes of running EC2 instances onto gp3 volumes in the instance’s Availability Zone, installs its agent through AWS Systems Manager, and takes an EBS snapshot of each source volume before deleting it.",
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then expands and shrinks it online, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment reads your Azure VMs and managed disks and works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: routes.amoeba },
      { label: "Estimate your saving", href: `${routes.assessment}?p=amoeba` },
    ],
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure managed disk types”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
  ],
  related: [
    {
      title: "How the pool is sized",
      where: "Amoeba product guide",
      href: `${routes.amoebaGuide}#how-the-pool-is-sized`,
    },
    {
      title: "Is there downtime?",
      where: "Amoeba FAQ",
      href: `${routes.amoebaFaq}#is-there-downtime`,
    },
    {
      title: "Can a shrink lose data?",
      where: "Amoeba FAQ",
      href: `${routes.amoebaFaq}#can-a-shrink-lose-data`,
    },
  ],
};
