/**
 * `/privacy`: the privacy policy, every word of it, verbatim from its source
 * (Effective 19 October 2026, Version 1.4, with the Microsoft Clarity disclosure
 * in §4.6, §6, §7, §8, §9 and §11.5, the three click events in §4.6, and the
 * assessment's one PDF report in §4.8). The page is laid out as the mock draws
 * it.
 *
 * 🔴 THE POLICY IS THE SOURCE, NOT THIS FILE. A legal text is changed at its
 * source first, with a new date and version, then copied byte for byte to
 * `src/content/legal/privacy-policy.md`, and only then here. A paraphrase, a
 * tidied sentence or a "fixed" typo here is a policy nobody approved, and the
 * word-for-word test in `src/features/privacy/` fails on it: it reads the copy
 * and the rendered page and allows only the mock's rendering differences (the
 * hero's title in place of the markdown's h1, the date line's wording, "Stopping
 * Amoeba" without its period, and a cell list without its "; " separators).
 *
 * ─── PLAIN DATA, ONE SMALL MARKUP ──────────────────────────────────────────
 * As `coral-guide.ts` does it: a run of text is a string, or a list of pieces
 * where a piece is inline code, a bold run-in label, a cross-reference to a
 * section of this page, the contact address (a mailto, same tab) or an
 * off-site address (a new tab). `src/features/privacy/` draws it with the
 * documents section's kit, and keeps the product names out of translation.
 *
 * Where a table cell runs three or more clauses together, split by "; " at the
 * top level (never inside brackets), the mock draws it as a real list, one
 * clause per item, word for word: the "; " is dropped, and the clauses keep
 * their lower-case starts and their "and …". Five cells today: Registration,
 * Inventory, Events and Node actions in §4.2, and Cloudflare in §7.
 *
 * ─── THE ANCHOR IDS ARE A CONTRACT ─────────────────────────────────────────
 * The Coral console, the Marketplace listing and our replies to rights requests
 * deep-link to these ids. Keep an id when its heading changes. A
 * cross-reference names its target by id, so it cannot point at a section that
 * is not here.
 */

/** The h2 ids, in document order: §1 to §15. */
export const privacySectionIds = [
  "who-we-are",
  "scope",
  "roles",
  "what-we-collect",
  "not-collected",
  "cookies",
  "sharing",
  "storage-transfers",
  "retention",
  "security",
  "your-rights",
  "children",
  "changes",
  "language",
  "contact",
] as const;

/** The h3 ids, in document order: 4.1 to 4.8, then 11.1 to 11.6. */
export const privacySubsectionIds = [
  "account",
  "cluster-data",
  "amoeba",
  "zoorikctl",
  "logs",
  "website",
  "email-calls-leads",
  "assessment",
  "rights-how",
  "rights-india",
  "rights-eu-uk",
  "rights-elsewhere",
  "rights-required",
  "rights-automated",
] as const;

/** The short version's box, above §1. It is not in the contents. */
export const privacyShortVersionId = "short-version";

export type PrivacySectionId = (typeof privacySectionIds)[number];
export type PrivacySubsectionId = (typeof privacySubsectionIds)[number];
export type PrivacyAnchor = PrivacySectionId | PrivacySubsectionId;

/** One piece of a run of text. */
export type PolicyInline =
  | string
  | { readonly code: string }
  /** A bold run-in label: "Connecting Amoeba." */
  | { readonly b: string }
  /** A cross-reference by number, as the policy writes it: "section 4.2". */
  | { readonly ref: PrivacyAnchor; readonly text: string }
  /** The contact address, as a mailto in the same tab. */
  | { readonly mail: string }
  /** An address somewhere else, opened in a new tab. */
  | { readonly href: `https://${string}`; readonly text: string };

/** A run of text: one string, or pieces. */
export type PolicyText = string | readonly PolicyInline[];

/** A table cell: a run of text, or a list where the policy runs clauses together. */
export type PolicyCell = PolicyText | { readonly list: readonly PolicyText[] };

export type PolicyBlock =
  | { readonly kind: "p"; readonly text: PolicyText }
  /** A bold line on its own, naming the list or table under it: "Set by us". */
  | { readonly kind: "label"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly PolicyText[] }
  | {
      readonly kind: "h3";
      readonly id: PrivacySubsectionId;
      /** "4.1": printed before the title, because the policy cross-refers by number. */
      readonly number: string;
      readonly title: string;
    }
  | {
      readonly kind: "callout";
      /** The one callout that tells the reader to do something has a title; the other is one sentence. */
      readonly title?: string;
      readonly body: readonly PolicyBlock[];
    }
  | {
      readonly kind: "table";
      readonly columns: readonly string[];
      readonly rows: readonly (readonly PolicyCell[])[];
    };

export interface PolicySection {
  readonly id: PrivacySectionId;
  /** "4": the h2 reads "4. What we collect, and why"; the contents print the title alone. */
  readonly number: string;
  readonly title: string;
  readonly body: readonly PolicyBlock[];
}

export interface PrivacyContent {
  readonly meta: { readonly title: string; readonly description: string };
  readonly hero: { readonly title: string; readonly deck: string };
  /** The first line of the reading column, small and muted: a legal page shows its date. */
  readonly effective: string;
  readonly intro: string;
  readonly short: { readonly title: string; readonly items: readonly PolicyText[] };
  readonly sections: readonly PolicySection[];
}

/* The policy's own address. A test holds it to the one the site prints. */
const MAIL = { mail: "founders@zoorik.com" } as const;

const b = (text: string) => ({ b: text }) as const;
const code = (text: string) => ({ code: text }) as const;
const ref = (to: PrivacyAnchor, text: string) => ({ ref: to, text }) as const;

const cookieColumns = ["Name", "Type", "What it does", "How long it lasts"] as const;

export const privacy: PrivacyContent = {
  meta: {
    title: "Privacy policy",
    description:
      "How Zoorik collects, uses and protects personal data across zoorik.com, Coral and Amoeba.",
  },

  hero: {
    title: "Privacy policy",
    deck: "What we collect, why, and how you can see, correct or delete it.",
  },

  effective: "Effective 19 October 2026 · Version 1.4",

  intro:
    "This policy explains what personal data Zoorik collects, why, who we share it with, where we keep it, how long we keep it, and how you can see, correct or delete it. Where a point is technical, we say exactly what happens.",

  short: {
    title: "The short version",
    items: [
      "You sign in to Coral with Microsoft or Google. We never see your password.",
      "We keep your name, your email address and your sign-in details so that you can use Coral.",
      "The Coral agent sends us usage figures, an inventory of your nodes and workloads, and events. Its Kubernetes permissions do not let it read your Secrets or ConfigMaps. Its node daemon runs as root on each Linux node so that it can move running pods; the daemon has no connection to Zoorik, and nothing it can reach is sent to us.",
      "To connect Amoeba, your admin gives Zoorik's Amoeba app a role in your Azure subscription. The role lets the app read the settings of every resource there, run commands as root on its VMs, and create and delete disks and snapshots.",
      "Amoeba's agent runs as root on each VM you choose. Every 15 seconds it sends us storage figures, your mount paths and disk ids, and the names of the services writing to each disk. The contents of your files are never sent to us.",
      "zoorik.com has no forms, and its own code sets no cookies. Cloudflare hosts it, measures visits and checks for bots, and Microsoft Clarity records how visitors use its pages. The Coral and Amoeba pages play their films in YouTube's player.",
      "The free assessment scripts upload nothing. You decide whether to email us the file they write.",
      "Coral's and Amoeba's data are stored in Microsoft Azure, in the Central India region.",
      ["To see, correct, export or delete your data, email ", MAIL, "."],
    ],
  },

  sections: [
    {
      id: "who-we-are",
      number: "1",
      title: "Who we are",
      body: [
        {
          kind: "p",
          text: '"Zoorik", "we" and "us" mean Zoorik Private Limited, a company incorporated in India, CIN U62011KA2026PTC228102, with its registered office at Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Bangalore South, Bangalore 560103, Karnataka.',
        },
        {
          kind: "p",
          text: [
            "Zoorik makes two products: Coral, which rebalances Kubernetes clusters on Azure and AWS, and Amoeba, which rightsizes block storage on Azure. You can reach us at ",
            MAIL,
            ". ",
            ref("contact", "Section 15"),
            " names our grievance officer.",
          ],
        },
      ],
    },

    {
      id: "scope",
      number: "2",
      title: "What this policy covers",
      body: [
        {
          kind: "ul",
          items: [
            [
              b("zoorik.com"),
              ", including zoorik.com/login and zoorik.com/assessment. www.zoorik.com and our other domains only redirect to zoorik.com.",
            ],
            [b("Coral"), ": the service and its console, currently at dev.zoorik.com/coral."],
            [b("The Coral agent"), " and its node daemon, which you install in your own clusters."],
            [
              b("Amoeba"),
              ": the service and its console; ",
              b("the Amoeba agent"),
              ", which Amoeba installs on the Azure VMs you choose; and ",
              b("Amoeba's set-up script"),
              ", which you run in Azure Cloud Shell.",
            ],
            [b("zoorikctl"), ", our command-line tool, downloaded through get.zoorik.com."],
            [
              b("The free assessment scripts"),
              " at zoorik.com/assess/k8s and zoorik.com/assess/disks.",
            ],
            [
              b("Email"),
              " you send us, ",
              b("calls"),
              " you book with us, and ",
              b("leads"),
              " that reach us from Microsoft Marketplace.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            b("What other companies do for themselves."),
            " When you sign in with Microsoft or Google, book a call through Cal.com, download from GitHub, visit zoorik.com while Microsoft Clarity records the visit, or reach a film that YouTube's player shows on zoorik.com, those companies also use your data for their own purposes, under their own privacy policies. This policy covers what reaches Zoorik and what those companies do for us (",
            ref("sharing", "section 7"),
            "). It does not cover LinkedIn or X, which we only link to.",
          ],
        },
      ],
    },

    {
      id: "roles",
      number: "3",
      title: "Our two roles",
      body: [
        {
          kind: "p",
          text: [
            b("We decide how the data is used (controller)."),
            ' This covers your Coral account, your Amoeba organisation\'s records, our website, email you send us, calls you book, Marketplace leads, assessment files you send us, and our own logs. India\'s Digital Personal Data Protection Act, 2023 (the DPDP Act) calls this role a "Data Fiduciary"; the GDPR calls it a "controller".',
          ],
        },
        {
          kind: "p",
          text: [
            b("We act for our customer (processor)."),
            " When an organisation connects a cluster, the Coral agent sends us data about that cluster (",
            ref("cluster-data", "section 4.2"),
            "). When an organisation connects Amoeba, Amoeba reads data about its Azure VMs and disks, and the Amoeba agent sends us data about those VMs (",
            ref("amoeba", "section 4.3"),
            "). The customer organisation is the controller of that data. We use it only to provide Coral or Amoeba to that customer, under the customer's agreement with us.",
          ],
        },
        {
          kind: "p",
          text: "If your personal data appears in a customer's cluster or VM data, that customer's privacy notice applies, so please contact them. If you contact us instead, we will refer you to them.",
        },
      ],
    },

    {
      id: "what-we-collect",
      number: "4",
      title: "What we collect, and why",
      body: [
        {
          kind: "p",
          /* 🔴 "section 7(a) of the Act" is the DPDP Act's section, not this
             policy's §7, so it is not a link. The mock linked it to #sharing. */
          text: [
            b("Legal basis in India."),
            " Under India's DPDP Act, we use the data in ",
            ref("account", "sections 4.1"),
            ", ",
            ref("amoeba", "4.3"),
            " (your Amoeba organisation), ",
            ref("zoorikctl", "4.4"),
            " and ",
            ref("email-calls-leads", "4.7"),
            ' because you, or the person who connected your organisation, gave it to us or let our products read it for that purpose (section 7(a) of the Act). If you tell us you no longer want us to use it, we stop. We do not rely on your consent for anything else. The "Legal basis" entries below are the bases under the GDPR (',
            ref("rights-eu-uk", "section 11.3"),
            ").",
          ],
        },

        { kind: "h3", id: "account", number: "4.1", title: "Your Coral account" },
        {
          kind: "p",
          text: [
            "You sign in with Microsoft (a work, school or personal account) or Google. Your browser goes to them, they check your password, and they send us a signed sign-in token. We ask only for your basic profile and email address (the ",
            code("openid"),
            ", ",
            code("profile"),
            " and ",
            code("email"),
            " scopes). We keep only the facts in that token, and no Microsoft or Google token.",
          ],
        },
        {
          kind: "table",
          columns: ["What we keep", "Why", "Legal basis"],
          rows: [
            [
              "Your email address, whether it is verified (Google must confirm it or we refuse the sign-in; for Microsoft work accounts we use Microsoft's flag that your organisation owns the email domain, and we treat personal Microsoft accounts as unverified), and your display name",
              "To create your account, recognise you and show your name",
              "To provide Coral under our contract with you or your organisation; where the contract is with your organisation, our legitimate interest in providing the service it bought",
            ],
            [
              "Your sign-in identity: the provider and its issuer, your id there (your Microsoft Entra object id or Google account id), your directory (your Microsoft tenant id or Google Workspace domain), and when we first and last saw this sign-in",
              "To recognise you each time you sign in",
              "As above",
            ],
            [
              "Your organisation's name and status (active, suspended or closed), and your role in it (Owner, Admin or Viewer)",
              "To group your organisation's people and clusters, and to decide what you can see and do",
              "As above",
            ],
            [
              "Each connect token you create (each time you click Connect): who created it and in which organisation, whether you turned on Workload optimization and Node optimization, when it was issued, expired and used, and which cluster it connected. We store only a fingerprint (SHA-256 digest) of the token",
              "To connect your cluster securely, and to record who connected it",
              "As above, and our legitimate interest in security",
            ],
            [
              "Your session: a fingerprint of your session token, your person id, email address and display name, an anti-forgery (CSRF) token and timestamps",
              "To keep you signed in and block forged requests",
              "As above",
            ],
          ],
        },
        { kind: "label", text: "Your organisation" },
        {
          kind: "ul",
          items: [
            'When your first cluster connects, Coral creates an organisation and makes you its Owner. It is named after your email domain, or "[your name]\'s organization" if your email is unverified or on a consumer domain such as gmail.com.',
            "If someone later connects a cluster from an Azure subscription or AWS account your organisation already holds, they join your organisation as a Viewer.",
            "Other members can see your display name on rebalancing runs you started, and your person id on workload events you started.",
          ],
        },

        {
          kind: "h3",
          id: "cluster-data",
          number: "4.2",
          title: "Cluster data the Coral agent sends (we act for the customer)",
        },
        {
          kind: "p",
          text: [
            b("How the agent connects."),
            " Inside your environment, the agent reads from the Kubernetes API, each node's kubelet and your cloud's instance metadata. It also calls your cloud's API to look up and remove nodes, using a node-removal identity in your own account. The only place outside your cluster and cloud account it sends data to is Zoorik, over outbound HTTPS. It fetches Coral's instructions from Zoorik and accepts no inbound connection.",
          ],
        },
        {
          kind: "table",
          columns: ["What", "When", "What it contains"],
          rows: [
            [
              "Registration",
              "When the agent registers",
              {
                list: [
                  "The agent's id and version",
                  "the cluster's name and resource id (an AKS resource id, which includes your Azure subscription id, or an EKS ARN)",
                  "the capabilities it detected",
                  "and the cloud account from instance metadata (your Azure subscription id and resource group, or your AWS account id and region)",
                ],
              },
            ],
            [
              "Heartbeat",
              "Every 60 seconds",
              "The agent's id, the cluster's name and resource id, its capabilities and release status",
            ],
            [
              "Usage",
              "Read every 30 seconds, sent as 5-minute summaries",
              "CPU, memory, out-of-memory kills, probe failures and CPU pressure per container, tagged with the namespace, the workload's kind and name, and the container's name",
            ],
            [
              "Inventory",
              "Every 5 minutes",
              {
                list: [
                  "Nodes (name, id, cloud provider id, pool, VM size, zone, region, capacity and requests)",
                  "workloads (namespace, kind, name, replicas, each container's requests and limits, whether probes are set, scheduling facts, PodDisruptionBudgets, autoscalers)",
                  "namespaces, LimitRanges, ResourceQuotas and NodePools",
                  "up to 64 labels per workload and namespace",
                  ["the value of the ", code("coral.zoorik.com/configuration"), " annotation"],
                  "the names of pods that hold a node",
                ],
              },
            ],
            [
              "Events",
              "When they happen",
              {
                list: [
                  "Out-of-memory kills, memory-pressure evictions and startup failures, with the pod's name and id and its memory figures",
                  "node notices such as spot interruptions, with the node's name and id",
                  "what Coral did to a workload (resized or replaced pods, deleted a stuck pod, took over or handed back an autoscaler) and why, with the pod's name and id",
                  "the pods Coral moved off a node",
                ],
              },
            ],
            [
              "Kubernetes messages",
              "When Kubernetes refuses or cannot carry out a change Coral makes to a workload",
              "The message text, cut to 1,024 characters: a ResourceQuota, LimitRange or admission policy refusing a pod, an eviction or an in-place resize, or the scheduler being unable to place a pod",
            ],
            [
              "Node actions",
              "While Coral drains, cordons or removes a node, or changes a node pool, and when it finishes",
              {
                list: [
                  "The node and pool",
                  "the pods it moved (namespace, name and id) and how",
                  "the outcome",
                  "and a message that can name pods and quote the reason Kubernetes or your cloud API gave for refusing a step. These messages are not shortened",
                ],
              },
            ],
          ],
        },
        {
          kind: "p",
          text: "If the agent cannot reach us, it keeps usage summaries for later in a buffer of up to 1 GiB inside its own pod, in your cluster.",
        },
        {
          kind: "p",
          text: "Most of this data describes machines and software, not people, but it can contain personal data: a namespace, label, node name or message might include a person's name. Members of the customer's organisation see this data in the Coral console.",
        },

        { kind: "h3", id: "amoeba", number: "4.3", title: "Amoeba" },
        {
          kind: "p",
          text: "Amoeba rightsizes block storage on Azure. It moves the data on a VM's data disks onto a pool of new managed disks sized to what you use, then grows and shrinks that pool. Your Amoeba organisation is separate from any Coral organisation.",
        },
        {
          kind: "p",
          text: [
            b("Connecting Amoeba."),
            " You run a set-up script in Azure Cloud Shell, signed in to your own Azure account. It adds Zoorik's Amoeba app (one Microsoft Entra app, registered by Zoorik and used for every customer) to your directory, creates a custom role called Zoorik Storage Operator, and gives that role to the app on the current subscription. You then enter your directory (tenant) id in Amoeba. When a directory id is entered, Amoeba creates an organisation for it, even before the set-up script has run, and checks every 15 seconds whether the directory has connected. Amoeba acts in your subscription only through that app, with the role you gave it. We never receive your Azure password or a token for you.",
          ],
        },
        {
          kind: "p",
          text: [
            b("What the role allows."),
            " It lets Zoorik's app read the settings of every resource in the subscription, change VMs and run commands on them as root (as SYSTEM on Windows VMs), and create, change and delete managed disks and snapshots. The set-up script also grants permissions to manage VM extensions and resource locks and to download disks; Amoeba does not use them.",
          ],
        },
        {
          kind: "p",
          text: [
            b("Choosing a VM is an instruction."),
            " Choosing a VM in Amoeba is your organisation's instruction to us to:",
          ],
        },
        {
          kind: "ul",
          items: [
            "install the Amoeba agent on it;",
            "copy its data disks onto a pool of new disks, inside the VM;",
            "48 hours later, once each original disk's snapshot has succeeded, delete the original disks;",
            "delete those snapshots 7 days after that;",
            "grow and shrink the pool, deleting pool disks it no longer needs.",
          ],
        },
        {
          kind: "callout",
          body: [
            {
              kind: "p",
              text: "Once a snapshot is deleted, the data on that original disk cannot be recovered.",
            },
          ],
        },
        {
          kind: "p",
          text: [
            b("What Amoeba reads from your subscription (we act for the customer)."),
            " The VMs it can manage and their data disks: ids, names, resource group, region, zone, size, operating system type and image, power state, and each disk's name, type, size and performance. Also your subscriptions' and directory's display names, and Amoeba's own tags on disks and snapshots. It reads nothing from billing, Cost Management, Azure Monitor, the Activity Log or Microsoft Graph. Prices come from Microsoft's public price list (prices.azure.com).",
          ],
        },
        {
          kind: "p",
          text: "To keep your onboarded VMs current, Amoeba also checks every VM in your connected subscriptions every 60 seconds (its resource id, size and power state), and every data disk attached to a VM in any subscription that holds a VM you onboarded. It keeps only the rows for VMs you onboarded. The list of VMs you can onboard includes Windows and stopped VMs, and is kept only in our server's memory.",
        },
        {
          kind: "p",
          text: [
            b("The Amoeba agent."),
            " Amoeba installs the agent on each VM you choose by running a short command as root through Azure Run Command. The installer may install curl, Java 17 and a few system packages from your distribution's mirrors, and it downloads the agent from GitHub, which sees your VM's IP address. The agent runs as root as a systemd service, opens no port, and connects out only to Amoeba. It acts only on commands Amoeba signs with that VM's own key.",
          ],
        },
        { kind: "label", text: "What the agent sends us (we act for the customer)." },
        {
          kind: "ul",
          items: [
            [
              "Every 15 seconds, a storage report for each data mount: its path, filesystem type, the managed disks and devices behind it, total and used space, read and write performance, and the name of the systemd service writing to it, such as ",
              code("postgresql.service"),
              ". To find that service, the agent looks at which mount each open file is on; file paths are not sent.",
            ],
            "The VM's resource id, the agent's version, the kernel release and a few filesystem facts.",
            "Replies to Amoeba's commands, which can include device names, mount points and error messages that quote paths on your VM.",
            "Copy progress during a migration.",
            "If an install, restart or update fails, the last lines of the agent's log from the VM's system journal (keys removed, up to 300 characters). These can name mount paths, devices, services and files.",
          ],
        },
        {
          kind: "p",
          text: "The agent's reports contain no hostname, IP address, user names or process lists, and the contents of your files are never sent to us. Our servers and Cloudflare still see the public IP address your VM connects from. The rest of the agent's log stays in the VM's journal.",
        },
        {
          kind: "p",
          text: [
            b("What we store."),
            " Your organisation's record is ours (",
            ref("roles", "section 3"),
            "); we hold the rest for your organisation. Legal basis for our part: to provide Amoeba under our contract with your organisation, and our legitimate interest in security. We store your organisation (a random id, your directory's id and name, your subscriptions' ids and names, and when Amoeba lost access); the VMs and disks you onboard; usage history (6-hour peaks, daily savings and an hour-of-week activity profile); each VM's agent key, status and version; pool and migration records, including mount paths, plans and errors; an audit log of the actions Amoeba takes; and recent reports in a cache for up to 72 hours. Names of your directory, subscriptions, resource groups, VMs, disks, mounts and services are kept as you wrote them, and any of them might include a person's name. Everyone who opens Amoeba for your organisation sees this data.",
          ],
        },
        {
          kind: "p",
          text: [
            b("What Amoeba changes."),
            " In your subscription, it creates pool disks named ",
            code("zoorik-amoeba-pool-…"),
            ", tags and detaches your original disks, snapshots them as ",
            code("zoorik-amoeba-snap-…"),
            ", and deletes them as described above. On the VM, the agent formats the new disks as a btrfs pool, copies your files into it with rsync, rewrites ",
            code("/etc/fstab"),
            " after backing it up, and stops and restarts the services that use a mount while it switches the mount over.",
          ],
        },
        {
          kind: "callout",
          title: "Stopping Amoeba",
          body: [
            {
              kind: "p",
              text: [
                "First remove the Zoorik Storage Operator role assignment, or remove Zoorik's app from your directory; this stops the changes Amoeba makes through Azure. Then stop the agent on each VM with ",
                code("systemctl disable --now amoeba-agent"),
                ". Until it is stopped, the agent keeps reporting to us and carrying out Amoeba's commands. Amoeba deletes none of the data we hold when access stops; to have it deleted, email us.",
              ],
            },
          ],
        },

        { kind: "h3", id: "zoorikctl", number: "4.4", title: "zoorikctl and downloads" },
        {
          kind: "ul",
          items: [
            "zoorikctl sends us your connect token and a user agent naming the zoorikctl version, your operating system and your architecture. We use the token to connect your cluster to your organisation, and the user agent to see which versions are in use and fix problems. Legal basis: to provide Coral, and our legitimate interest in supporting the versions people run.",
            [code("zoorikctl cluster disconnect"), " does not contact Zoorik."],
            [
              "Cloud set-up runs under your own ",
              code("az"),
              " or ",
              code("aws"),
              " sign-in, so we never receive your cloud credentials.",
            ],
            "When you download zoorikctl through get.zoorik.com, Cloudflare and GitHub see your IP address and your download tool's user agent. When you install it from our Homebrew tap (getzoorik/tap), or your cluster pulls the Coral agent images from GitHub's registry, GitHub sees them.",
            [
              'zoorikctl\'s region is labelled "us". That is only a label: it points at the Coral service hosted in Central India (',
              ref("storage-transfers", "section 8"),
              ").",
            ],
          ],
        },

        { kind: "h3", id: "logs", number: "4.5", title: "Our logs" },
        {
          kind: "ul",
          items: [
            "Coral's backend identifies organisations, clusters, people and requests in its logs by id, not by email address. Some lines contain cluster names, node names and cluster resource ids.",
            "Coral's backend, and the gateway in front of it, do not log your IP address or your browser's user agent.",
            "Amoeba's backend logs directory, subscription and VM ids, the names of the disks it creates, attaches and deletes, the agent's install progress, and the reasons the agent gives for refusing a command, which can include mount paths, device names and error messages. It logs the IP address of an agent connection it refuses or that fails while connecting.",
            [
              "Cloudflare sits in front of our servers and handles every request, including your IP address (",
              ref("sharing", "section 7"),
              ").",
            ],
          ],
        },
        {
          kind: "p",
          text: "We use logs to run the service, keep it secure and fix problems. Legal basis: our legitimate interest in doing those things.",
        },

        { kind: "h3", id: "website", number: "4.6", title: "zoorik.com" },
        { kind: "label", text: "What the site itself does" },
        {
          kind: "ul",
          items: [
            "It has no forms. The choices on zoorik.com/assessment stay in your browser, and the Copy button writes the command only to your clipboard: Clarity learns that you copied it, not what (below).",
            "Its own code sets no cookies and uses no browser storage. It serves its own fonts.",
            "It has no advertising, no chat widget and no embedded maps. Its one analytics service is Microsoft Clarity, and its one embedded video player is YouTube's, on two pages (both below).",
          ],
        },
        {
          kind: "p",
          text: [
            b("Microsoft Clarity."),
            " Every page of zoorik.com, this one included, loads Microsoft Clarity once the page has finished loading. Clarity records how the page is used, so that we can see what helps visitors and what gets in their way. While you are on a page, it sends Microsoft:",
          ],
        },
        {
          kind: "ul",
          items: [
            "your clicks, taps, scrolling and mouse movements, and the size of your window;",
            "when you copy the command on zoorik.com/assessment, click a link to book a demo, or click our email address: the name of that action, so that we can count how often each one happens and on which pages. It is only the name: not the command, and nothing you then do on Cal.com or in your email app;",
            "the page's address, the page you came from, and what the page showed and how it changed, so that we can replay the visit and see heatmaps. Clarity hides what you type into a field, and the numbers and email addresses on the page, in your browser before anything is sent;",
            "your browser, operating system, device type and screen size;",
            "page-speed measures and script errors.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft receives your IP address with each upload and uses it to work out your country. On zoorik.com, Clarity sets no cookies and uses no browser storage, so it does not link one page you view to the next, or one visit to the next. Microsoft also uses this data for its own purposes, including Microsoft Advertising, as the Microsoft Privacy Statement describes (",
            {
              href: "https://privacy.microsoft.com/privacystatement",
              text: "https://privacy.microsoft.com/privacystatement",
            },
            "). To stop Clarity recording your visits, turn on Global Privacy Control in your browser, opt out of Microsoft at ",
            { href: "https://optout.aboutads.info", text: "https://optout.aboutads.info" },
            ", or block scripts from clarity.ms.",
          ],
        },
        {
          kind: "p",
          text: [
            b("YouTube."),
            " zoorik.com/coral and zoorik.com/amoeba each show a 2-minute film in YouTube's player, in its privacy-enhanced mode (youtube-nocookie.com). The player loads when you scroll to the film, and the film then starts by itself: with its sound if you have already clicked, tapped or typed on the page, otherwise muted until you do. If your device asks for reduced motion, the player loads only when you press play or a chapter. Once it loads, your browser connects to YouTube, which is Google: Google receives your IP address, your browser and device details and how you use the player, and the player may set cookies and use browser storage. Google uses this under its own privacy policy (",
            {
              href: "https://policies.google.com/privacy",
              text: "https://policies.google.com/privacy",
            },
            "). No other page of zoorik.com loads anything from YouTube. To avoid it, block youtube-nocookie.com in your browser, or leave the page before you reach the film.",
          ],
        },
        {
          kind: "p",
          text: [
            b("What Cloudflare adds."),
            " Cloudflare hosts zoorik.com and adds three things to every page:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              b("Web Analytics:"),
              " a script that sends Cloudflare the page address and the page you came from (without query strings), your browser's user agent and client hints, and page-speed measures. It sets no cookies and uses no browser storage.",
            ],
            [
              b("Bot detection:"),
              " a script that sends Cloudflare signals about your browser, sets the cookies ",
              code("cf_clearance"),
              " and ",
              code("__cf_ob"),
              ", and stores ",
              code("_cfPre_tabId"),
              " in your browser's session storage (",
              ref("cookies", "section 6"),
              ").",
            ],
            [
              b("Network error reports:"),
              " if a page fails to load because of a network problem, your browser may report the failure to Cloudflare.",
            ],
          ],
        },
        {
          kind: "p",
          text: "We use this to deliver the site, protect it from bots, see how fast it is and how it is used, and improve it. Legal basis: our legitimate interest in running a secure, working website and making it better.",
        },

        {
          kind: "h3",
          id: "email-calls-leads",
          number: "4.7",
          title: "Email, calls and Marketplace leads",
        },
        {
          kind: "ul",
          items: [
            [
              b("Email."),
              " When you email us at ",
              MAIL,
              ", we receive your email address, your name if you give it, your message and any attachments, such as an assessment file. Google Workspace hosts our email. We use it to answer you and to work out what Coral or Amoeba could do for you. Legal basis: steps you asked us to take before a contract, or our legitimate interest in answering you.",
            ],
            [
              b("Calls."),
              " When you book a call at ",
              { href: "https://cal.com/zoorik/talk", text: "cal.com/zoorik/talk" },
              ", you give your details to Cal.com and the booking reaches us. We use it to hold the call. Legal basis: steps you asked us to take.",
            ],
            [
              b("Microsoft Marketplace leads."),
              " If you ask to be contacted from Coral's Microsoft Marketplace listing, Microsoft sends us the details you gave, such as your name, email address, phone number, country, company and job title. We use them to contact you about Coral. Legal basis: our legitimate interest in answering your request.",
            ],
            "Coral itself sends no email.",
          ],
        },

        { kind: "h3", id: "assessment", number: "4.8", title: "The free assessment" },
        {
          kind: "ul",
          items: [
            [
              "You run it with ",
              code("npx -y zoorik assess coral"),
              " or ",
              code("npx -y zoorik assess amoeba"),
              ". npm and PyPI, which serve it, see your IP address and your tool's user agent. The older links zoorik.com/assess/k8s and zoorik.com/assess/disks redirect to the public scripts on GitHub; when you fetch one, Cloudflare and GitHub see the same.",
            ],
            [
              "It runs on your machine or in your Cloud Shell, with your own signed-in ",
              code("az"),
              ", ",
              code("aws"),
              " and ",
              code("kubectl"),
              " tools. It never contacts Zoorik. Its only other network call fetches public prices from Microsoft (prices.azure.com); AWS prices come through your own ",
              code("aws"),
              " tool.",
            ],
            [
              "It writes one PDF report on your machine and uploads nothing. If you email it to us, it contains the names of your clusters, node pools, namespaces and workloads, with machine sizes and counts, CPU and memory requests and peak use, and prices (Coral), or the names of your Azure subscriptions or AWS accounts and your VMs, with their sizes, disk sizes, used space and prices (Amoeba). Coral's ",
              code("--anonymize"),
              " option replaces namespace and workload names with hashes, and ",
              code("--anonymize-clusters"),
              " also replaces cluster names. Node-pool names are kept.",
            ],
            "If you allow it, the Amoeba assessment runs one read-only command inside your Linux VMs through Azure Run Command or AWS Systems Manager Run Command. Your cloud keeps a record of it in your own account; we do not receive it.",
          ],
        },
      ],
    },

    {
      id: "not-collected",
      number: "5",
      title: "What we do not collect",
      body: [
        {
          kind: "ul",
          items: [
            [
              b("Sensitive personal data"),
              " as listed in India's SPDI Rules: passwords, financial details, health, medical or biometric data, or sexual orientation.",
            ],
            [
              b("Your password, or any Microsoft or Google token."),
              " We read the sign-in token once to get the facts in ",
              ref("account", "section 4.1"),
              ", and keep no Microsoft or Google token.",
            ],
            [
              b("Your cloud credentials."),
              " Set-up runs under your own sign-in. Coral's node-removal identity lives in your own cloud account, and Amoeba acts through Zoorik's app with the role you give it.",
            ],
            [
              b("Your Kubernetes Secrets and ConfigMaps."),
              " The Coral agent can read only Zoorik's own Secrets and ConfigMaps, and the cluster autoscaler's status ConfigMap. Coral's node daemon runs as root and can reach anything on its node, including mounted Secrets, but it has no connection to Zoorik.",
            ],
            [
              b("Your pod logs, or a shell in your pods."),
              " The Coral agent has no permission to read pod logs, or to exec into, attach to or port-forward to pods. It reads kubelet metrics through the Kubernetes node proxy, which could also reach the kubelet's log and exec endpoints; Coral never calls them.",
            ],
            [
              b("Environment variables, commands and image names."),
              " The Coral agent reads pod specs to size and place workloads, and, inside your cluster, looks at environment variable names, Java option values, commands, arguments, image names and annotations to spot Java workloads. None of these is sent to us. The only annotation sent is ",
              code("coral.zoorik.com/configuration"),
              ".",
            ],
            [
              b("The memory of your pods."),
              " To move a running pod, Coral's node daemon runs as root on each Linux node and checkpoints the pod. The checkpoint holds the pod's memory, which can include secrets the program holds. It stays inside your cluster, moves between the two nodes over mutual TLS, and is deleted when the move ends. The node daemon has no connection to Zoorik.",
            ],
            [
              b("The contents of your files (Amoeba)."),
              " They are never sent to us. The Amoeba agent copies them only between disks attached to the VM, and the original disks and their snapshots stay in your subscription until Amoeba deletes them (",
              ref("amoeba", "section 4.3"),
              "). The agent's regular reports carry no file names, but an error message or a failed-install log extract can quote a path on your VM.",
            ],
            [b("Anything from the assessment scripts"), ", unless you email us the file."],
          ],
        },
      ],
    },

    {
      id: "cookies",
      number: "6",
      title: "Cookies and browser storage",
      body: [
        { kind: "label", text: "On the Coral console" },
        {
          kind: "table",
          columns: cookieColumns,
          rows: [
            [
              [code("__Host-coral_session")],
              "Cookie",
              "Keeps you signed in",
              "Up to 12 hours; a session ends after 30 minutes idle, after 12 hours, or when you sign out",
            ],
            [
              [code("__Host-coral_oidc_txn")],
              "Cookie",
              "Protects a sign-in while it is in progress",
              "10 minutes, cleared when sign-in completes",
            ],
            [
              [code("zoorik-cluster")],
              "Local storage",
              "Remembers the last cluster you chose",
              "Until you clear it",
            ],
            [
              [code("zoorik-connect-os")],
              "Session storage",
              "Remembers the install tab you chose",
              "Until you close the tab",
            ],
            [
              [code("zk-el-view")],
              "Session storage",
              "Remembers how you view the event log",
              "Until you close the tab",
            ],
            [
              [code("_cfPre_tabId")],
              "Session storage",
              "Set by Cloudflare's bot-detection script, which Cloudflare adds to console pages",
              "Until you close the tab",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The two cookies are needed to sign in; both are Secure and HttpOnly, use SameSite=Lax, and are sent only to the address the console is served from. The console's own three storage items only remember your choices; ",
            code("_cfPre_tabId"),
            " is Cloudflare's, for bot detection. None is used for analytics or advertising. The console's own code loads no analytics, tracking or third-party script, and its security policy blocks Cloudflare's Web Analytics script.",
          ],
        },
        { kind: "label", text: "On the Amoeba console" },
        {
          kind: "table",
          columns: cookieColumns,
          rows: [
            [
              [code("__Host-amoeba_session")],
              "Cookie",
              "Keeps Amoeba open for your organisation",
              "24 hours",
            ],
            [
              [code("zoorik:vm")],
              "Local storage",
              "Remembers the last VM you opened (its Azure resource id)",
              "Until you clear it",
            ],
          ],
        },
        {
          kind: "p",
          text: "The cookie is Secure and HttpOnly and uses SameSite=Lax. The Amoeba console loads no analytics, tracking or third-party script. It puts the open VM's resource id in its page and API addresses, so the id appears in your browser history and in any access logs Cloudflare or our gateway keep.",
        },
        { kind: "label", text: "On zoorik.com" },
        {
          kind: "table",
          columns: cookieColumns,
          rows: [
            [
              [code("cf_clearance")],
              "Cookie",
              "Set by Cloudflare's bot detection: records that your browser passed its check",
              "1 year",
            ],
            [
              [code("__cf_ob")],
              "Cookie",
              "Set by Cloudflare's bot detection while its check runs",
              "Until you close your browser",
            ],
            [
              [code("_cfPre_tabId")],
              "Session storage",
              "Set by Cloudflare's bot detection",
              "Until you close the tab",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "All three are Cloudflare's, for bot detection (",
            ref("website", "section 4.6"),
            "). ",
            code("cf_clearance"),
            " is set for zoorik.com and its subdomains, so your browser also sends it to the Coral and Amoeba consoles. zoorik.com's own code sets no cookies, and Microsoft Clarity is set to use no cookies or storage here. YouTube's player on the Coral and Amoeba pages may set its own cookies and browser storage once it loads (",
            ref("website", "section 4.6"),
            ").",
          ],
        },
        {
          kind: "p",
          text: "You can block or clear cookies and storage in your browser. If you block the consoles' cookies, you cannot sign in to Coral or open Amoeba.",
        },
      ],
    },

    {
      id: "sharing",
      number: "7",
      title: "Who we share data with",
      body: [
        {
          kind: "p",
          text: "We do not sell personal data and do not use it for advertising. We disclose personal data to a government body or court only when the law requires it.",
        },
        {
          kind: "p",
          text: [
            "These companies help us run Zoorik. When one of them handles personal data for us, we stay responsible for it. For the cluster and VM data we process for customers (",
            ref("roles", "section 3"),
            "), our sub-processors are Microsoft Azure and Cloudflare.",
          ],
        },
        {
          kind: "table",
          columns: ["Company", "What it does for us", "What it handles"],
          rows: [
            [
              "Microsoft Azure",
              "Hosts Coral and Amoeba in the Central India region",
              "Everything Coral and Amoeba store",
            ],
            ["Microsoft (Entra ID)", "Sign-in with Microsoft", "Your sign-in"],
            [
              "Microsoft Marketplace",
              "Our listing",
              "Lead details you give when asking to be contacted",
            ],
            [
              "Google",
              "Sign-in with Google, and our email (Google Workspace)",
              "Your sign-in, and email you send us with its attachments",
            ],
            [
              "Cloudflare",
              {
                list: [
                  "DNS and the secure proxy in front of Coral",
                  "hosting for zoorik.com",
                  "get.zoorik.com and the assessment redirects",
                  "bot detection, web analytics and error reports",
                ],
              },
              "Every request in transit, including IP addresses, cookies and agent uploads (it decrypts and re-encrypts each request); what its scripts send",
            ],
            [
              "Microsoft (Clarity)",
              "Analytics for zoorik.com: recordings of visits, heatmaps and page statistics",
              [
                "What ",
                ref("website", "section 4.6"),
                " lists, and your IP address. Microsoft also uses it for its own purposes (",
                ref("scope", "section 2"),
                ")",
              ],
            ],
            [
              "Google (YouTube)",
              "Plays the films on zoorik.com/coral and zoorik.com/amoeba",
              [
                "What ",
                ref("website", "section 4.6"),
                " lists, and your IP address. Google also uses it for its own purposes (",
                ref("scope", "section 2"),
                ")",
              ],
            ],
            [
              "GitHub",
              "Hosts zoorikctl, the Coral agent images, the Amoeba agent releases and the assessment scripts",
              "The IP address of whoever downloads them, including your VMs when Amoeba installs its agent",
            ],
            ["Cal.com", "Our booking page", "What you enter when you book"],
          ],
        },
        {
          kind: "p",
          text: [
            "Inside your organisation, other members see what ",
            ref("account", "section 4.1"),
            " describes and the cluster data your organisation connected. In Amoeba, everyone who opens it for your organisation sees its VM data (",
            ref("amoeba", "section 4.3"),
            ").",
          ],
        },
      ],
    },

    {
      id: "storage-transfers",
      number: "8",
      title: "Where data is stored, and international transfers",
      body: [
        {
          kind: "ul",
          items: [
            "Coral's and Amoeba's databases, backups, key vault and container registry are in Microsoft Azure, Central India. Backups are not copied to another region. Sessions are held in memory only, inside our cluster.",
            "Our email, sign-in, hosting, download, website analytics and video providers may process data in other countries, including the United States. Microsoft Clarity stores what it records in Microsoft's cloud.",
            [
              "If you are outside India, your data is transferred to India, where Coral and Amoeba are hosted. Some providers in ",
              ref("sharing", "section 7"),
              " handle data outside India. From about May 2027, India's DPDP Act allows this except to countries the Government of India restricts. India has no EU adequacy decision. Where the law requires a safeguard for such a transfer, such as standard contractual clauses for data from the EU or UK, we put one in place; email us for a copy.",
            ],
          ],
        },
      ],
    },

    {
      id: "retention",
      number: "9",
      title: "How long we keep data",
      body: [
        { kind: "label", text: "Set by how Coral and Amoeba work" },
        {
          kind: "ul",
          items: [
            "Sign-in cookie: 10 minutes, or until sign-in completes.",
            "Session: ends after 30 minutes idle, 12 hours, or sign-out; the server-side record is kept in memory only until then.",
            "Current inventory of namespaces, autoscalers, node pools and placements: replaced every 5 minutes.",
            "Short-lived workload signals: 24 hours.",
            "Database backups: 7 days.",
            "Amoeba's cache of recent agent reports: up to 72 hours; copy progress: 2 hours; Amoeba sessions: 24 hours, in memory only; the list of VMs you can onboard: in memory only, until the next check replaces it.",
            [
              "Your original disks after an Amoeba migration: deleted 48 hours after the copy, once their snapshot has succeeded; the snapshots: deleted 7 days later (",
              ref("amoeba", "section 4.3"),
              ").",
            ],
          ],
        },
        { kind: "label", text: "Set by us" },
        {
          kind: "ul",
          items: [
            "Your account, organisation and connect token records: while your organisation uses Coral, and for 30 days after it closes its account or you ask us to delete your data.",
            "Amoeba organisation, VM, usage and migration records, and the audit log: while your organisation uses Amoeba, and for 30 days after it stops or asks us to delete them.",
            "Cluster data (usage history, inventory, events): while the cluster reports to us, and for 30 days after it stops reporting or the customer asks us to delete it.",
            "Logs: 1 year. Logs the law requires us to keep longer stay for the period it sets.",
            "Email, assessment files and bookings: 2 years after our last exchange with you.",
          ],
        },
        { kind: "label", text: "Set by Microsoft Clarity (zoorik.com)" },
        {
          kind: "ul",
          items: [
            "Recordings of visits: 30 days. Recordings we mark as favourites, and a random sample Microsoft keeps: up to 9 months.",
            "Heatmaps: up to 9 months.",
          ],
        },
        {
          kind: "p",
          text: [
            b("Disconnecting a cluster."),
            " ",
            code("zoorikctl cluster disconnect"),
            " removes Coral from your cluster and offers to remove the cloud identity it created. It does not delete the data we already hold; to have it deleted, email ",
            MAIL,
            ".",
          ],
        },
      ],
    },

    {
      id: "security",
      number: "10",
      title: "How we protect data",
      body: [
        {
          kind: "ul",
          items: [
            [
              b("In transit:"),
              " every connection to Zoorik from the internet uses HTTPS. Plain HTTP is redirected, and browsers are told to use HTTPS only (HSTS). Inside our cluster, the session store accepts connections only from Coral's backend. Cloudflare re-encrypts traffic to our servers and checks their certificate, and our web gateway accepts connections only from Cloudflare. Coral reaches its database over TLS 1.2 or later.",
            ],
            [b("At rest:"), " Microsoft Azure encrypts our database and disks."],
            [
              b("Coral sign-in:"),
              " no passwords; OpenID Connect with PKCE and a nonce; Secure, HttpOnly cookies; anti-forgery tokens; sessions end after 30 minutes idle or 12 hours. The console cannot be framed by other sites, and it loads scripts only from its own address, which is also where Cloudflare serves its bot-detection script (",
              ref("cookies", "section 6"),
              ").",
            ],
            [
              b("Separation (Coral):"),
              " row-level security in the database keeps each organisation's data apart, and every agent upload is tied to the organisation of its authenticated credential.",
            ],
            [
              b("Credentials:"),
              " connect tokens and cluster credentials are stored only as SHA-256 fingerprints. A connect token works once and expires after 60 minutes; a cluster credential lasts 90 days and is replaced automatically before it expires. We hold no customer cloud credentials. Coral acts through an identity in your own cloud account. Amoeba acts through Zoorik's app, which your admin approves and gives a role; Zoorik proves the app's identity to Microsoft with a credential that only Zoorik's servers can use. Each Amoeba agent has its own key, which signs Amoeba's commands to it.",
            ],
            [
              b("Access:"),
              " only a small number of people at Zoorik, and the automated tools we use to build and deploy our products, can access or change the systems that run them.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "If a breach affects your personal data, we will tell you, and the authorities the law requires us to tell. To report a security problem, email ",
            MAIL,
            ".",
          ],
        },
      ],
    },

    {
      id: "your-rights",
      number: "11",
      title: "Your rights",
      body: [
        { kind: "h3", id: "rights-how", number: "11.1", title: "How to use them" },
        {
          kind: "p",
          text: [
            "Email ",
            MAIL,
            " from the address you sign in with, or the address you used to contact us, and tell us what you want. For Amoeba, include your directory id. We may ask you to confirm that you control that address. We reply within 30 days; if a request is complex, we will tell you within those 30 days why we need more time. If your data is part of a customer's cluster or VM data, ask that customer (",
            ref("roles", "section 3"),
            ").",
          ],
        },

        { kind: "h3", id: "rights-india", number: "11.2", title: "If you are in India" },
        {
          kind: "p",
          text: "We honour these rights now. India's DPDP Act makes them legal rights from about 13 May 2027. You can:",
        },
        {
          kind: "ul",
          items: [
            "get a summary of your personal data, what we do with it, and who we share it with;",
            "have your data corrected, completed, updated or erased;",
            [
              "tell us that you no longer want us to use data you gave us (",
              ref("what-we-collect", "section 4"),
              "): email us from the address you sign in with or, for Amoeba, include your directory id. We will stop, and tell you if that means you can no longer use Coral or Amoeba. This does not affect what we did before;",
            ],
            "nominate someone to use your rights if you die or cannot act: email us their name and contact details;",
            [
              "raise a grievance with our grievance officer (",
              ref("contact", "section 15"),
              "). If our answer does not resolve it, you can complain to the Data Protection Board of India.",
            ],
          ],
        },

        { kind: "h3", id: "rights-eu-uk", number: "11.3", title: "If you are in the EU or UK" },
        {
          kind: "p",
          text: "You can ask for access to your data, correction, erasure, restriction, and a machine-readable copy (portability). You can withdraw consent at any time where we rely on it, and object, for reasons about your own situation, to processing based on our legitimate interests; we will then stop unless we have compelling reasons that outweigh your interests or need the data for a legal claim. You can complain to us, to your country's data protection authority, or in the UK to the Information Commissioner's Office.",
        },

        { kind: "h3", id: "rights-elsewhere", number: "11.4", title: "Elsewhere" },
        {
          kind: "p",
          text: "Your local law may give you similar rights. Email us and we will help.",
        },

        {
          kind: "h3",
          id: "rights-required",
          number: "11.5",
          title: "Do you have to give us data?",
        },
        {
          kind: "p",
          text: [
            "You can browse zoorik.com without giving us your name or email address; Cloudflare and Microsoft Clarity still receive what ",
            ref("website", "section 4.6"),
            " describes, as does YouTube once its player loads on the Coral and Amoeba pages, and ",
            ref("website", "section 4.6"),
            " says how to stop Clarity recording your visits. To use Coral, you must sign in with Microsoft or Google. To use Amoeba, your admin must connect your Azure subscription (",
            ref("amoeba", "section 4.3"),
            ").",
          ],
        },

        { kind: "h3", id: "rights-automated", number: "11.6", title: "Automated decisions" },
        {
          kind: "p",
          text: [
            "We make no decision that has legal or similarly significant effects on you based only on automated processing. Coral does make some account decisions automatically: for example, it adds you to an organisation as a Viewer when you connect a cluster from a subscription or account that organisation already holds (",
            ref("account", "section 4.1"),
            "). You can ask us to review any of them.",
          ],
        },
      ],
    },

    {
      id: "children",
      number: "12",
      title: "Children",
      body: [
        {
          kind: "p",
          text: [
            "Zoorik is a service for businesses and is not meant for anyone under 18. We do not knowingly collect data from anyone under 18. If you think someone under 18 has given us personal data, email ",
            MAIL,
            " and we will delete it.",
          ],
        },
      ],
    },

    {
      id: "changes",
      number: "13",
      title: "Changes to this policy",
      body: [
        {
          kind: "p",
          text: [
            "When we change this policy, we post the new version here and update the date at the top. Before we use your personal data for a new purpose, we will tell you and update this policy first. Amoeba keeps no contact details, so for Amoeba we will show the notice in the Amoeba console. Earlier versions are available on request from ",
            MAIL,
            ".",
          ],
        },
      ],
    },

    {
      id: "language",
      number: "14",
      title: "Language",
      body: [{ kind: "p", text: "This policy is in English only." }],
    },

    {
      id: "contact",
      number: "15",
      title: "Contact us and grievance officer",
      body: [
        {
          kind: "p",
          text: [
            b("Email:"),
            " ",
            MAIL,
            " · ",
            b("Post:"),
            " our registered office (",
            ref("who-we-are", "section 1"),
            ").",
          ],
        },
        {
          kind: "p",
          text: [
            b("Grievance officer and privacy contact (India)."),
            " This person handles grievances and answers questions about how we process your personal data. Every reply we send to a rights request includes these details.",
          ],
        },
        {
          kind: "ul",
          items: [
            [b("Name and title:"), " Sheldon, CXO"],
            [b("Email:"), " ", MAIL],
            [
              b("Postal address:"),
              " Zoorik Private Limited, Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Bangalore South, Bangalore 560103, Karnataka",
            ],
          ],
        },
        {
          kind: "p",
          text: "We acknowledge a grievance within 2 working days and resolve it within 30 days.",
        },
      ],
    },
  ],
};
