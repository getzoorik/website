import { routes } from "@/config/site";

/**
 * `/cloud-cost-optimization-research-papers`: research papers on cloud cost optimization, by subject, each with who
 * wrote it and where, and a short note in our own words. Notes rewritten 2 Nov 2026; every figure in a note is the
 * paper's own, from its abstract. Curly apostrophes, and a figure kept with its unit ("50 ms").
 *
 * 🔴 OTHER PEOPLE'S WORK. Every paper is by outside researchers; each link goes to the publisher's page (a DOI where
 * there is one) and opens in a new tab. The notes are ours. No vendor product is named.
 */

/** The page prints no date: the day its content last changed, for the sitemap. Move it in the PR that changes it. */
export const researchLastUpdated = "3 November 2026";

export interface ResearchPaper {
  readonly title: string;
  /** Who wrote it, then where and when it was published: "Abhishek Verma et al. · ACM EuroSys, 2015". */
  readonly by: string;
  /** Our own short note on it. */
  readonly note: string;
  /** The publisher's page. */
  readonly href: string;
}

export interface ResearchGroup {
  /** The group's address on the page. Kept when the name changes, so links to it still work. */
  readonly id: string;
  readonly name: string;
  readonly line: string;
  readonly papers: readonly ResearchPaper[];
}

export const researchPage = {
  route: routes.research,
  /** The `<title>`'s own words, before " | Zoorik", and the description. */
  meta: {
    title: "Cloud cost research papers",
    description:
      "Research papers on cloud cost optimization: cluster scheduling, resource sizing, spot pricing, block storage and live migration, each with a short summary.",
  },
  hero: {
    title: "Cloud cost research papers",
    deck: "Papers by other researchers, each linked to its publisher and summed up in our own words.",
  },
  /** The section's name for a screen reader. */
  label: "Research papers",
  groups: [
    {
      id: "cluster-scheduling-bin-packing",
      name: "Cluster scheduling and autoscaling",
      line: "How clusters place work on machines, pack it tightly and scale with demand.",
      papers: [
        {
          title: "Large-scale cluster management at Google with Borg",
          by: "Abhishek Verma et al. · ACM EuroSys, 2015",
          note: "How Google’s cluster manager packs a huge mix of jobs onto shared machines to keep them busy. Many of its ideas carried over into Kubernetes.",
          href: "https://doi.org/10.1145/2741948.2741964",
        },
        {
          title: "Borg, Omega, and Kubernetes",
          by: "Brendan Burns et al. · ACM Queue, 2016",
          note: "Google’s lessons from more than ten years of running containers across three systems. It explains why Kubernetes works as it does, from pods to labels.",
          href: "https://doi.org/10.1145/2898442.2898444",
        },
        {
          title: "Multi-resource packing for cluster schedulers",
          by: "Robert Grandl et al. · ACM SIGCOMM, 2014",
          note: "Schedulers that look only at CPU and memory leave scattered gaps of unused capacity. Tetris packs tasks by CPU, memory, disk and network, so jobs finish faster on the same cluster.",
          href: "https://doi.org/10.1145/2619239.2626334",
        },
        {
          title: "Protean: VM Allocation Service at Scale",
          by: "Ori Hadary et al. · USENIX OSDI, 2020",
          note: "How Microsoft Azure picks a server for each new VM in very large zones. Rule-based placement keeps servers busy while meeting each VM’s constraints.",
          href: "https://www.usenix.org/conference/osdi20/presentation/hadary",
        },
        {
          title: "Kubernetes Scheduling: Taxonomy, Ongoing Issues and Challenges",
          by: "Carmen Carrión · ACM Computing Surveys, 2023",
          note: "A survey of research on the Kubernetes scheduler, sorted by approach. It maps what has been tried for better resource use, and what is still open.",
          href: "https://doi.org/10.1145/3539606",
        },
        {
          title: "Horizontal Pod Autoscaling in Kubernetes for Elastic Container Orchestration",
          by: "Thanh-Tung Nguyen et al. · Sensors (MDPI), 2020",
          note: "Experiments on how the Kubernetes Horizontal Pod Autoscaler behaves in practice. It compares resource metrics with custom metrics and gives tuning lessons.",
          href: "https://doi.org/10.3390/s20164621",
        },
      ],
    },
    {
      id: "resource-prediction-and-sizing",
      name: "Resource prediction and sizing",
      line: "How much CPU and memory a workload needs, and how to predict it.",
      papers: [
        {
          title:
            "Resource Central: Understanding and Predicting Workloads for Improved Resource Management in Large Cloud Platforms",
          by: "Eli Cortez et al. · ACM SOSP, 2017",
          note: "A study of Azure’s VM workload: a VM’s past behavior predicts its future well. A scheduler that uses these predictions can safely fit more VMs on each server.",
          href: "https://doi.org/10.1145/3132747.3132772",
        },
        {
          title: "Autopilot: workload autoscaling at Google",
          by: "Krzysztof Rzadca et al. · ACM EuroSys, 2020",
          note: "People set CPU and memory limits well above real use, to be safe. Google’s Autopilot sets them from past use: its jobs kept 23% unused headroom, against 46% for hand-tuned jobs.",
          href: "https://doi.org/10.1145/3342195.3387524",
        },
        {
          title: "Borg: the next generation",
          by: "Muhammad Tirmazi et al. · ACM EuroSys, 2020",
          note: "Compares a month of 2019 data from eight Borg clusters with the 2011 trace, to show how Borg and its workload changed. The 2019 trace is public.",
          href: "https://doi.org/10.1145/3342195.3387517",
        },
        {
          title: "Quasar: resource-efficient and QoS-aware cluster management",
          by: "Christina Delimitrou and Christos Kozyrakis · ACM ASPLOS, 2014",
          note: "Most cloud clusters leave much of their capacity idle, partly because users guess their resource needs. Quasar asks for a performance target instead and picks the resources itself.",
          href: "https://doi.org/10.1145/2541940.2541941",
        },
        {
          title:
            "Take it to the limit: peak prediction-driven resource overcommitment in datacenters",
          by: "Noman Bashir et al. · ACM EuroSys, 2021",
          note: "How far a machine can be safely overbooked if its peak use can be predicted. In Google’s data centers, these policies gave 10 to 16% more usable CPU than no overbooking.",
          href: "https://doi.org/10.1145/3447786.3456259",
        },
        {
          title:
            "CherryPick: Adaptively Unearthing the Best Cloud Configurations for Big Data Analytics",
          by: "Omid Alipourfard et al. · USENIX NSDI, 2017",
          note: "The wrong VM type and cluster size can make a recurring job cost 2 to 3 times more on average. CherryPick finds the best or a near-best setup in a few test runs.",
          href: "https://www.usenix.org/conference/nsdi17/technical-sessions/presentation/alipourfard",
        },
      ],
    },
    {
      id: "cloud-pricing-spot-and",
      name: "Cloud pricing and spot capacity",
      line: "How cloud prices work, and how to mix on-demand, reserved and spot capacity.",
      papers: [
        {
          title: "A view of cloud computing",
          by: "Michael Armbrust et al. · Communications of the ACM, 2010",
          note: "The Berkeley paper on cloud economics: no up-front commitment, pay for what you use, and capacity that seems endless. It also lists the top obstacles and opportunities.",
          href: "https://doi.org/10.1145/1721654.1721672",
        },
        {
          title: "Deconstructing Amazon EC2 Spot Instance Pricing",
          by: "Orna Agmon Ben-Yehuda et al. · ACM Transactions on Economics and Computation, 2013",
          note: "Works out how EC2 spot prices were set, from the public price history alone. Its findings suggest that, in that period, most prices were random picks from a narrow band, not set by supply and demand.",
          href: "https://doi.org/10.1145/2509413.2509416",
        },
        {
          title: "SpotCheck: designing a derivative IaaS cloud on the spot market",
          by: "Prateek Sharma et al. · ACM EuroSys, 2015",
          note: "Spot servers are cheap but can be taken back at any time. SpotCheck runs its users’ VMs on them and moves each VM to an on-demand server when its spot server is taken back.",
          href: "https://doi.org/10.1145/2741948.2741953",
        },
        {
          title:
            "To Reserve or Not to Reserve: Optimal Online Multi-Instance Acquisition in IaaS Clouds",
          by: "Wei Wang, Baochun Li and Ben Liang · USENIX ICAC, 2013",
          note: "Reserved instances cost less per hour but pay off only if used. This paper decides when to reserve and when to stay on demand, with no demand forecast.",
          href: "https://www.usenix.org/conference/icac13/technical-sessions/presentation/wang_wei",
        },
        {
          title: "Providing SLOs for Resource-Harvesting VMs in Cloud Platforms",
          by: "Pradeep Ambati et al. · USENIX OSDI, 2020",
          note: "Harvest VMs grow and shrink with Azure’s spare capacity, which is plentiful but changes over time. With the paper’s scheduling, they matched the computing power of regular VMs and reduced cost by 91%.",
          href: "https://www.usenix.org/conference/osdi20/presentation/ambati",
        },
        {
          title: "Snape: Reliable and Low-Cost Computing with Mixture of Spot and On-Demand VMs",
          by: "Fangkai Yang et al. · ACM ASPLOS, 2023",
          note: "Production traces show that spot VM evictions are partly predictable. Snape mixes spot and on-demand VMs, saving 44% against on-demand alone with 99.96% availability.",
          href: "https://doi.org/10.1145/3582016.3582028",
        },
      ],
    },
    {
      id: "block-storage-file-systems",
      name: "Block storage and file systems",
      line: "How file systems and cloud storage allocate space, keep data safe and need less capacity.",
      papers: [
        {
          title: "BTRFS: The Linux B-Tree Filesystem",
          by: "Ohad Rodeh, Josef Bacik and Chris Mason · ACM Transactions on Storage, 2013",
          note: "The design of Btrfs: copy-on-write, B-trees, checksums, snapshots and built-in RAID. It also covers one file system spread over disks of different sizes.",
          href: "https://doi.org/10.1145/2501620.2501623",
        },
        {
          title: "Scalability in the XFS File System",
          by: "Adam Sweeney et al. · USENIX ATC, 1996",
          note: "How XFS handles very large file systems, huge files and big directories. It explains how XFS allocates space, and why it uses B+ trees where older file systems used flat lists.",
          href: "https://www.usenix.org/legacy/publications/library/proceedings/sd96/sweeney.html",
        },
        {
          title: "A five-year study of file-system metadata",
          by: "Nitin Agrawal et al. · ACM Transactions on Storage, 2007",
          note: "Yearly snapshots of more than 60,000 Windows file systems at a large company, over five years. It tracks how file sizes, disk capacity and space used changed.",
          href: "https://doi.org/10.1145/1288783.1288788",
        },
        {
          title: "A Study of Practical Deduplication",
          by: "Dutch T. Meyer and William J. Bolosky · USENIX FAST, 2011",
          note: "Measures duplicate data on 857 desktop computers at Microsoft over four weeks. On live file systems, removing duplicate whole files saved about three quarters as much space as the most thorough block-level method.",
          href: "https://www.usenix.org/conference/fast11/study-practical-deduplication",
        },
        {
          title: "Minerva: An automated resource provisioning tool for large-scale storage systems",
          by: "Guillermo A. Alvarez et al. · ACM Transactions on Computer Systems, 2001",
          note: "Hand-designed storage is often over-provisioned, slow, or both. Minerva designs it automatically, and in one test matched a 30-disk expert design with 16 disks.",
          href: "https://doi.org/10.1145/502912.502915",
        },
        {
          title: "Erasure Coding in Windows Azure Storage",
          by: "Cheng Huang et al. · USENIX ATC, 2012",
          note: "Introduces Local Reconstruction Codes, which keep Azure Storage data durable with less extra space than full copies. Repairs stay fast because they read fewer pieces of data.",
          href: "https://www.usenix.org/conference/atc12/technical-sessions/presentation/huang",
        },
        {
          title: "An In-Depth Analysis of Cloud Block Storage Workloads in Large-Scale Production",
          by: "Jinhong Li et al. · IEEE IISWC, 2020",
          note: "Studies billions of I/O requests from Alibaba Cloud’s production block storage and compares them with Microsoft Research’s public traces. It gives 15 findings on load and access patterns, and releases the traces.",
          href: "https://doi.org/10.1109/iiswc50251.2020.00013",
        },
      ],
    },
    {
      id: "live-migration-of-vms",
      name: "Live migration",
      line: "How a running VM or container moves to another machine with only a short pause.",
      papers: [
        {
          title: "Live Migration of Virtual Machines",
          by: "Christopher Clark et al. · USENIX NSDI, 2005",
          note: "Moves a running VM to another host while it keeps working. Most memory is copied while the VM runs, so the final pause is very short.",
          href: "https://www.usenix.org/conference/nsdi-05/live-migration-virtual-machines",
        },
        {
          title: "Post-copy live migration of virtual machines",
          by: "Michael R. Hines, Umesh Deshpande and Kartik Gopalan · ACM SIGOPS Operating Systems Review, 2009",
          note: "Flips the usual order: move the VM’s CPU state first, then fetch memory pages as they are needed. Compared with pre-copy, this reduces total migration time and network traffic.",
          href: "https://doi.org/10.1145/1618525.1618528",
        },
        {
          title: "Live wide-area migration of virtual machines including local persistent state",
          by: "Robert Bradford et al. · ACM VEE, 2007",
          note: "Moves a running VM across a wide-area network together with its local disk, not just its memory. Open network connections keep working while the VM moves.",
          href: "https://doi.org/10.1145/1254810.1254834",
        },
        {
          title: "Black-box and Gray-box Strategies for Virtual Machine Migration",
          by: "Timothy Wood et al. · USENIX NSDI, 2007",
          note: "Sandpiper finds overloaded servers and moves VMs off them with live migration. It compares a black-box method with one that also reads OS and application statistics.",
          href: "https://www.usenix.org/conference/nsdi-07/black-box-and-gray-box-strategies-virtual-machine-migration",
        },
        {
          title:
            "Optimal online deterministic algorithms and adaptive heuristics for energy and performance efficient dynamic consolidation of virtual machines in Cloud data centers",
          by: "Anton Beloglazov and Rajkumar Buyya · Concurrency and Computation: Practice and Experience (Wiley), 2012",
          note: "Uses live migration to pack VMs onto fewer servers and put idle servers to sleep. Its algorithms use each VM’s history to reduce energy use while meeting service levels.",
          href: "https://doi.org/10.1002/cpe.1867",
        },
        {
          title: "VM Live Migration At Scale",
          by: "Adam Ruprecht et al. · ACM VEE, 2018",
          note: "How Google’s cloud moves VMs off hosts for updates and repairs without stopping them. It runs over a million migrations a month, with a median pause of 50 ms.",
          href: "https://doi.org/10.1145/3186411.3186415",
        },
        {
          title: "Voyager: Complete Container State Migration",
          by: "Shripad Nadgowda et al. · IEEE ICDCS, 2017",
          note: "Moves a container with its memory and disk data, using CRIU and a union mount. The container runs again right away on the new host, and its disk data follows.",
          href: "https://doi.org/10.1109/icdcs.2017.91",
        },
        {
          title: "Efficient Live Migration of Linux Containers",
          by: "Radostin Stoyanov and Martin J. Kollingbaum · ISC High Performance 2018 Workshops (Springer LNCS), 2018",
          note: "Uses CRIU’s image cache and proxy to send a container’s checkpoint straight to the new host, skipping the disk. This shortens total migration time and downtime.",
          href: "https://doi.org/10.1007/978-3-030-02465-9_13",
        },
      ],
    },
  ] satisfies readonly ResearchGroup[] as readonly ResearchGroup[],
} as const;
