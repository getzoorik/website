import { routes } from "@/config/site";

/**
 * `/security`: every string the page prints, laid out as the approved mock is;
 * the wording was tightened on 3 Nov 2026.
 * Laid out like the FAQ: the Updated line and the summary stay open, then the
 * sections are eleven numbered rows in three groups, Coral, Amoeba, and
 * Access and data. No closing row, no badges or
 * logos: the mock draws no trust strip, data-flow diagram or permission cards,
 * so the page has none.
 *
 * The text is plain data: a run of text is a string, or pieces where a piece
 * may be inline code or a link. The page keeps the product names out of
 * translation as it draws them (`named()`), so the strings here carry none of
 * that markup.
 *
 * ─── THE IDS ARE A CONTRACT ────────────────────────────────────────────────
 * The row ids are the sections' ids (`#coral-permissions`, `#report`…), so a
 * link to one opens its row. Keep an id when its heading changes.
 */

export type SecurityInline =
  string | { readonly code: string } | { readonly href: string; readonly text: string };

/** A run of text: one string, or pieces. */
export type SecurityText = string | readonly SecurityInline[];

export type SecurityBlock =
  | { readonly kind: "p"; readonly text: SecurityText }
  | { readonly kind: "ul"; readonly items: readonly SecurityText[] }
  /** A sub-heading inside a row: `h4.doc-sub` (the row's own heading is the h3). */
  | { readonly kind: "h4"; readonly title: string }
  | {
      readonly kind: "table";
      readonly columns: readonly { readonly label: string; readonly width: string }[];
      /** `null`: an empty cell, which draws nothing when the table stacks. */
      readonly rows: readonly (readonly (SecurityText | null)[])[];
    }
  /** The one line that must stand out: /privacy's untitled callout. */
  | { readonly kind: "callout"; readonly text: SecurityText }
  /** A row of text links with arrows, to the guide or the legal pages. */
  | {
      readonly kind: "links";
      readonly links: readonly { readonly text: string; readonly href: string }[];
    };

export interface SecurityRow {
  readonly id: string;
  readonly title: string;
  readonly body: readonly SecurityBlock[];
}

export interface SecurityGroup {
  readonly id: string;
  /** The h2, and the group's chip on a phone. */
  readonly title: string;
  readonly rows: readonly SecurityRow[];
}

export const securityPage = {
  path: routes.security,
  meta: {
    title: "Security",
    description:
      "What Coral and Amoeba can change in your cloud, what they send to Zoorik, where we keep it, and how to report a security issue.",
  },
  hero: {
    title: "Security and data handling",
    deck: "What Coral and Amoeba can change, what they send us, and where we keep it.",
  },
  /* 3 Nov 2026: the wording tightened, the internal timings and sizes taken out, Coral's minimum permission and the
     Cloudflare route outside India added from the Trust center. */
  updated: "Updated 3 November 2026",
  /** The summary's title is a paragraph, the list a summary list. */
  summaryTitle: "Summary",
} as const;

/** The summary, open over the groups: each term and its one paragraph. */
export const securitySummary: readonly { readonly term: string; readonly text: SecurityText }[] = [
  {
    term: "In your cloud",
    text: "Each product acts only through a role you create and can remove. We hold no cloud credential of yours.",
  },
  {
    term: "Connections",
    text: "Our agents open every connection themselves, over TLS, and accept none from outside.",
  },
  {
    term: "What never leaves",
    text: "File contents, request payloads, env var values, commands and your containers’ image names. Coral can’t read your Secrets.",
  },
  {
    term: "Where data lives",
    text: "Microsoft Azure, Central India. Encrypted at rest, and over HTTPS with HSTS in transit.",
  },
  {
    term: "Sign-in",
    text: "Microsoft or Google, no passwords. A session ends after 30\u00a0minutes idle or 12\u00a0hours.",
  },
  {
    term: "Report an issue",
    text: [{ href: "mailto:founders@zoorik.com", text: "founders@zoorik.com" }],
  },
];

/** The eleven sections in three groups, in their own order; the numbers run on across the groups. */
export const securityGroups: readonly SecurityGroup[] = [
  {
    id: "sec-coral",
    title: "Coral",
    rows: [
      {
        id: "coral-in-your-cluster",
        title: "Coral in your cluster",
        body: [
          {
            kind: "table",
            columns: [
              { label: "Component", width: "26%" },
              { label: "What it does", width: "42%" },
              { label: "Runs as", width: "32%" },
            ],
            rows: [
              [
                "zoorik-agent",
                "Reads the cluster, sends usage summaries and makes the changes your settings allow.",
                "Deployment in namespace zoorik-agent. Non-root, read-only root file system, no Linux capabilities.",
              ],
              [
                "zoorik-agent-webhook",
                "Sizes new pods as they start. It fails open, so it never blocks a pod.",
                "Deployment",
              ],
              [
                "zoorik-node",
                "Moves running pods between nodes without a restart, by checkpoint and restore. It has no connection to Zoorik.",
                [
                  "Privileged DaemonSet in namespace zoorik-node (root, host PID, SYS_ADMIN). Places CRIU at ",
                  { code: "/usr/local/bin/criu" },
                  " on each Linux node.",
                ],
              ],
              [
                "Two CRDs",
                [
                  { code: "recommendations.coral.zoorik.com" },
                  " and ",
                  { code: "actionrequests.coral.zoorik.com" },
                ],
                null,
              ],
              [
                "Admission policies",
                "Limit most of the agent’s writes, for example to the HPAs and NodePools Coral manages. They apply only to Zoorik’s own service accounts.",
                null,
              ],
            ],
          },
          {
            kind: "p",
            text: [
              "Everything Coral installs carries the label ",
              { code: "app.kubernetes.io/part-of=zoorik-agent" },
              ".",
            ],
          },
          {
            kind: "p",
            text: [
              "The agent updates itself to each Zoorik release and rolls back a failed update. It can’t widen its own permissions: a release that needs more waits until you run connect again. To review each release first, install the agent with our ",
              { href: routes.docsInstallHelm, text: "Helm chart" },
              ". An agent that Helm, Argo CD or Flux manages doesn’t update itself.",
            ],
          },
        ],
      },
      {
        id: "coral-permissions",
        title: "Coral permissions",
        body: [
          { kind: "h4", title: "In Kubernetes" },
          {
            kind: "p",
            text: [
              "The agent can’t read your Secrets, or your ConfigMaps other than the cluster autoscaler’s status. It has no ",
              { code: "pods/log" },
              ", ",
              { code: "pods/exec" },
              ", ",
              { code: "pods/attach" },
              " or ",
              { code: "pods/portforward" },
              " permission. It holds ",
              { code: "get" },
              " on ",
              { code: "nodes/proxy" },
              " to read kubelet metrics. That permission can also reach the kubelet’s log and exec endpoints, which Coral never calls.",
            ],
          },
          { kind: "h4", title: "On AKS" },
          {
            kind: "p",
            text: [
              "Connect creates a managed identity, ",
              { code: "zoorik-agent-<cluster>" },
              ", with the role “Zoorik Node Removal v2” on that cluster only. The role can read the cluster, its pools and machines, and delete machines. It can also reduce a pool’s minimum when that minimum alone keeps an emptied machine. That permission would also allow creating or changing node pools, but Coral never creates a pool or a machine.",
            ],
          },
          {
            kind: "p",
            text: "Connect also turns on workload identity and the OIDC issuer if they are off. The OIDC issuer can’t be turned off again.",
          },
          { kind: "h4", title: "On EKS" },
          {
            kind: "p",
            text: [
              "Connect creates an IAM role, ",
              { code: "zoorik-agent-<cluster>" },
              ", bound with EKS Pod Identity. It can terminate instances only in this cluster’s Auto Scaling groups and reduce the minimum of this cluster’s groups and managed node groups. It can read Auto Scaling groups and instances across your account. The permissions that reduce a minimum could also make AWS add instances. The role can’t launch instances itself, and Coral never raises a size.",
            ],
          },
          {
            kind: "p",
            text: [
              "On a cluster that uses only ",
              { code: "aws-auth" },
              ", installing Karpenter switches authentication to ",
              { code: "API_AND_CONFIG_MAP" },
              " for good.",
            ],
          },
          { kind: "h4", title: "Connect" },
          {
            kind: "p",
            text: [
              "zoorikctl lists every cloud change and asks once. ",
              { code: "--dry-run" },
              " prints everything and changes nothing. If you decline, the agent still installs, and fixed-size pools wait until you run ",
              { code: "zoorikctl cluster grant-node-deletion" },
              ".",
            ],
          },
          {
            kind: "p",
            text: "A connect token works once and expires after 60\u00a0minutes. The agent’s cluster credential is replaced automatically. Zoorik stores both only as SHA-256 fingerprints, and never receives your kubeconfig or a cloud credential.",
          },
          {
            kind: "links",
            links: [
              {
                text: "What connect asks to change",
                href: `${routes.coralGuide}#what-connect-asks-to-change`,
              },
            ],
          },
        ],
      },
      {
        id: "coral-data",
        title: "What Coral sends us",
        body: [
          {
            kind: "ul",
            items: [
              "Usage for each container: CPU, memory, out-of-memory kills, probe failures and CPU pressure.",
              "An inventory, such as nodes, namespaces, workloads with their requests and limits, autoscalers, PodDisruptionBudgets, quotas and labels.",
              "Events, with pod and node names, and what Coral did and why.",
              "A heartbeat with the agent’s status, and at registration the cluster’s name and cloud account.",
              "If Zoorik can’t be reached, the agent keeps its summaries in its own pod and sends them later.",
            ],
          },
          { kind: "h4", title: "What never leaves" },
          {
            kind: "ul",
            items: [
              "Pod logs, env var values, commands, your containers’ image names and request payloads.",
              "Event text, except the message Kubernetes or the cloud gives when it refuses a change Coral makes.",
              "Pod memory. A live-migration checkpoint stays inside the cluster, moves between two nodes over mutual TLS and is deleted when the move ends.",
            ],
          },
          {
            kind: "p",
            text: "The agent opens every connection itself, over HTTPS, and accepts none from outside the cluster.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-amoeba",
    title: "Amoeba",
    rows: [
      {
        id: "amoeba-on-your-vms",
        title: "Amoeba on your VMs",
        body: [
          {
            kind: "ul",
            items: [
              [
                "One agent per onboarded VM: the systemd service ",
                { code: "amoeba-agent.service" },
                ", run as root from ",
                { code: "/opt/amoeba-agent" },
                " on Java 17 or later. It opens no port and connects out only to Zoorik.",
              ],
              "It sends its reports and keeps two command channels open over secure WebSocket (wss), all with its own key. Zoorik signs every command with that key (HMAC-SHA256), and the agent checks the signature before it acts. A key from another VM can’t act for this one.",
              [
                "The key never travels in a cloud command. The install command carries a single-use token, which the installer exchanges with Zoorik for the key. The key is kept in ",
                { code: "/etc/amoeba-agent.env" },
                ", readable by root only. A reinstall replaces it.",
              ],
              [
                "Zoorik reaches the VM through Azure Run Command or AWS Systems Manager. Azure keeps a copy of each command under ",
                { code: "/var/lib/waagent" },
                " and logs each run in the activity log. Systems Manager keeps the command history in your account.",
              ],
            ],
          },
        ],
      },
      {
        id: "amoeba-permissions",
        title: "Amoeba permissions",
        body: [
          { kind: "h4", title: "On Azure" },
          {
            kind: "p",
            text: "Zoorik acts only through the custom role “Zoorik Storage Operator”, assigned to Zoorik’s app on each subscription you connect. You set it up by running the connect script with your own Azure sign-in. Zoorik never receives your Azure password or a token for you. A permission added later reaches your subscription only when you run the script again.",
          },
          {
            kind: "table",
            columns: [
              { label: "Area", width: "30%" },
              { label: "The role allows", width: "70%" },
            ],
            rows: [
              ["All resources", "Read"],
              ["VMs", "Update, reapply and run commands"],
              ["Network interfaces", "Join"],
              [
                "Disks",
                "Create, update, delete and get access, which a snapshot needs. Amoeba never requests a download link.",
              ],
              ["Snapshots", "Create and delete"],
            ],
          },
          { kind: "h4", title: "On AWS" },
          {
            kind: "p",
            text: "Zoorik acts only through the IAM role ZoorikStorageOperator, which a script you run in AWS CloudShell creates. The role trusts Zoorik’s AWS account only with your organisation’s external ID. Zoorik’s own AWS identity may only assume roles with that name and read AWS prices.",
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
          { kind: "h4", title: "Encryption" },
          {
            kind: "p",
            text: "New pool disks take the encryption key of the first encrypted source disk. That is your disk encryption set on Azure, or your customer-managed KMS key on AWS. Encryption at rest carries over to the pool.",
          },
        ],
      },
      {
        id: "amoeba-data",
        title: "What Amoeba sends us",
        body: [
          {
            kind: "ul",
            items: [
              "Each mount’s path, file system type and ID, and used and total size.",
              "The devices and cloud disk IDs behind each mount, and the systemd service that holds it open.",
              "Disk activity per device, the pool’s sizes and btrfs error counters, and host facts: kernel version, OS family, btrfs support, sector sizes and encryption state.",
              "Copy progress during a move. If an install fails, the last log lines, with secrets removed.",
            ],
          },
          { kind: "h4", title: "What never leaves" },
          {
            kind: "ul",
            items: [
              "File contents. The copy runs inside the VM, from your disks to the pool’s disks.",
              "Hostnames, user names, process lists and the VM’s IP addresses. Zoorik and Cloudflare still see the public address the VM connects from.",
            ],
          },
        ],
      },
      {
        id: "what-amoeba-deletes",
        title: "What Amoeba deletes",
        body: [
          { kind: "p", text: "Only these:" },
          {
            kind: "ul",
            items: [
              "A pool disk that a shrink emptied.",
              "A disk that an expand created and then gave up on.",
              "A source disk, once the switch is checked and the disk’s snapshot is complete.",
              "A safety snapshot, when its 7\u00a0days end.",
            ],
          },
          {
            kind: "p",
            text: "It never removes a pool disk that still holds data, and never deletes a source disk before its snapshot is complete. It never looks inside a VM you haven’t onboarded.",
          },
          {
            kind: "callout",
            text: "Once a safety snapshot is deleted, the data on that original disk can’t be recovered.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-access",
    title: "Access and data",
    rows: [
      {
        id: "sign-in",
        title: "Sign-in and access",
        body: [
          {
            kind: "ul",
            items: [
              "Sign in with Microsoft or Google. Zoorik never sees your password and keeps no Microsoft or Google token.",
              "Sign-in uses OpenID Connect with PKCE and a nonce. Cookies are Secure and HttpOnly, with anti-forgery tokens.",
              "A session ends after 30\u00a0minutes idle, after 12\u00a0hours, or at sign-out.",
              "Row-level security in our database keeps each Coral organisation’s data apart. Every agent upload is tied to the organisation of its credential.",
              "Only a small number of people at Zoorik can access or change the systems that run our products. So can the automated tools that build and deploy them.",
            ],
          },
        ],
      },
      {
        id: "where-data-is-kept",
        title: "Where data is kept",
        body: [
          {
            kind: "ul",
            items: [
              "Coral’s and Amoeba’s databases, backups, key vault and container registry are in Microsoft Azure, Central India. Backups are kept for 7\u00a0days and are not copied to another region.",
              "Azure encrypts the database and disks at rest. Coral’s connection to its database is encrypted.",
              "Every connection from the internet uses HTTPS, with HSTS. Cloudflare re-encrypts traffic to our servers, and our gateway accepts connections only from Cloudflare.",
              "On its way to Zoorik, data passes through Cloudflare’s network, which may route it outside India.",
              "We keep cluster data while the cluster reports, and for 30\u00a0days after it stops. Amoeba keeps its agent’s reports for 3 to 4\u00a0days.",
            ],
          },
          {
            kind: "links",
            links: [{ text: "Every retention period", href: `${routes.privacy}#retention` }],
          },
        ],
      },
      {
        id: "sub-processors",
        title: "Sub-processors",
        body: [
          {
            kind: "table",
            columns: [
              { label: "Company", width: "24%" },
              { label: "What it does for us", width: "38%" },
              { label: "What it handles", width: "38%" },
            ],
            rows: [
              [
                "Microsoft Azure",
                "Hosts Coral and Amoeba in Central India",
                "Everything Coral and Amoeba store",
              ],
              [
                "Cloudflare",
                "DNS and the secure proxy in front of Coral and Amoeba",
                "Every request in transit, agent uploads included. It decrypts and re-encrypts each request.",
              ],
              [
                "Google (Workspace)",
                "Zoorik’s email",
                "Our emails with you, such as the pilot report and support replies. They can name your clusters, nodes and workloads.",
              ],
            ],
          },
          {
            kind: "p",
            text: [
              "These three handle the cluster and VM data we process for you. Our ",
              { href: `${routes.privacy}#sharing`, text: "privacy policy" },
              " lists every company we use.",
            ],
          },
        ],
      },
      {
        id: "report",
        title: "Report a security issue",
        body: [
          {
            kind: "ul",
            items: [
              ["Email ", { href: "mailto:founders@zoorik.com", text: "founders@zoorik.com" }, "."],
              "Please don’t test Zoorik’s security without our written permission.",
              "If a breach affects your personal data, we tell you, and the authorities the law requires us to tell.",
              "If we process personal data for you, we answer your reasonable written security questions once a year.",
            ],
          },
          {
            kind: "links",
            links: [
              { text: "Privacy policy", href: routes.privacy },
              { text: "Terms of use", href: routes.terms },
              { text: "Trust center", href: routes.trust },
            ],
          },
        ],
      },
    ],
  },
];
