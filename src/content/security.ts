import { routes } from "@/config/site";

/**
 * `/security`: every string the page prints, verbatim from the approved mock.
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
    title: "Security and data handling",
    description:
      "What Coral and Amoeba may change in your cloud, what leaves your cluster or VM, where data is kept, our sub-processors, and how to report an issue.",
  },
  hero: {
    title: "Security and data handling",
    deck: "What each product may change, what it sends us, and where we keep it.",
  },
  updated: "Updated 9 October 2026",
  /** The summary's title is a paragraph, the list a summary list. */
  summaryTitle: "Summary",
} as const;

/** The summary, open over the groups: each term and its one paragraph. */
export const securitySummary: readonly { readonly term: string; readonly text: SecurityText }[] = [
  {
    term: "In your cloud",
    text: "Each product acts through a role you create and can remove. We hold no cloud credentials of yours.",
  },
  {
    term: "Connections",
    text: "Our agents open every connection themselves, over TLS, and accept none from outside.",
  },
  {
    term: "What never leaves",
    text: "No file contents, env var values, commands, image names or request payloads. Coral can’t read your Secrets or ConfigMaps.",
  },
  {
    term: "Where data lives",
    text: "Microsoft Azure, Central India. Encrypted at rest, HTTPS with HSTS in transit.",
  },
  {
    term: "Sign-in",
    text: "Microsoft or Google. No passwords. Sessions end after 30\u00a0minutes idle or 12\u00a0hours.",
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
                "Reads the cluster, sends usage summaries and carries out changes.",
                "Deployment in namespace zoorik-agent; non-root, read-only filesystem",
              ],
              [
                "zoorik-agent-webhook",
                "Sizes new pods as they start. It fails open, so it never blocks a pod.",
                "2 replicas",
              ],
              [
                "zoorik-node",
                "Checkpoints a pod and restores it on another node. It has no connection to Zoorik.",
                [
                  "Privileged DaemonSet in namespace zoorik-node (root, host PID, SYS_ADMIN); places CRIU at ",
                  { code: "/usr/local/bin/criu" },
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
                "Limit what the agent may change. For example, it may scale a Deployment by only one replica, and change only the HPAs and NodePools Coral manages.",
                null,
              ],
            ],
          },
          {
            kind: "p",
            text: [
              "Everything carries the label ",
              { code: "app.kubernetes.io/part-of=zoorik-agent" },
              ". The agent updates itself to each Zoorik release and rolls back a failed update. It can’t widen its own permissions: a release that needs more shows “Re-run connect”. If Argo CD, Flux or Helm manages the agent, it doesn’t update itself.",
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
              "The agent can’t read your Secrets or ConfigMaps, and has no ",
              { code: "pods/log" },
              ", ",
              { code: "pods/exec" },
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
              ", with the role “Zoorik Node Removal v1” on that cluster only. The role can read the cluster, its pools and machines, and delete machines. Connect also turns on workload identity and the OIDC issuer if they are off. The OIDC issuer can’t be turned off again.",
            ],
          },
          { kind: "h4", title: "On EKS" },
          {
            kind: "p",
            text: [
              "Connect creates an IAM role bound with EKS Pod Identity that can only terminate instances in this cluster’s Auto Scaling groups. On a cluster that uses only ",
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
              ". A connect token works once and expires after 60\u00a0minutes. A cluster credential lasts 90\u00a0days and is replaced automatically. Both are stored only as SHA-256 fingerprints.",
            ],
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
        title: "What leaves a Coral cluster",
        body: [
          {
            kind: "ul",
            items: [
              "Per-container usage summaries: CPU, memory, OOM kills, probe failures and CPU pressure, read every 30\u00a0seconds and sent in 5-minute windows.",
              "An inventory every 5\u00a0minutes: nodes, namespaces, workloads with requests and limits, autoscalers, PodDisruptionBudgets, quotas, and up to 64 labels per workload and namespace.",
              "Events, with pod and node names. A heartbeat every 60\u00a0seconds. At registration, the cloud account.",
              "If Zoorik can’t be reached, the agent buffers up to 1\u00a0GiB inside its own pod.",
            ],
          },
          { kind: "h4", title: "What never leaves" },
          {
            kind: "ul",
            items: [
              "Env var values, commands, image names and request payloads.",
              "Event text, except the message when a pod can’t be created because of a quota, a limit range or an admission policy.",
              "Pod memory. A live-migration checkpoint stays inside the cluster, moves between two nodes over mutual TLS and is deleted when the move ends.",
            ],
          },
          {
            kind: "p",
            text: "The agent opens every connection itself over HTTPS and accepts none from outside the cluster.",
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
                "One agent per onboarded VM: ",
                { code: "amoeba-agent.service" },
                ", running as root from ",
                { code: "/opt/amoeba-agent" },
                " on Java 17 or later. It opens no port and connects out only to Zoorik.",
              ],
              "It sends its reports, and keeps a command channel and a governance channel open, over WebSocket (wss), all with its own key. Zoorik signs every command with that key (HMAC-SHA256), and the agent checks the signature before it acts. A key from another VM can’t act for this one.",
              [
                "The key never travels in a cloud command. The install command carries a single-use bootstrap token, which the installer exchanges with Zoorik for the agent’s key. The key sits in ",
                { code: "/etc/amoeba-agent.env" },
                ", readable by root only. A reinstall replaces it.",
              ],
              [
                "Zoorik reaches the VM in one of two ways. Azure Run Command keeps a copy of each command under ",
                { code: "/var/lib/waagent" },
                " and logs each run in the activity log. AWS Systems Manager keeps the command history in your account.",
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
            text: "Zoorik acts only through the custom role “Zoorik Storage Operator”, assigned to Zoorik’s app on each subscription you connect. You set it up by running the connect script with your own Azure sign-in. Zoorik never receives your Azure password or a token for you. An action added later reaches your subscription only when you run the script again.",
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
                "Create, update, delete, and get access (the download link is never requested)",
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
            text: "New pool disks take the encryption key of the first encrypted source disk: your customer-managed KMS key on AWS, or your disk encryption set on Azure. Encryption at rest carries over.",
          },
        ],
      },
      {
        id: "amoeba-data",
        title: "What leaves a VM",
        body: [
          {
            kind: "ul",
            items: [
              "Every 15\u00a0seconds: each mount’s path, filesystem type and ID, its used and total size, the devices and cloud disk IDs behind it, and the name of the systemd service holding it open.",
              "Disk activity per device, the pool’s sizes and btrfs error counters, and host facts: kernel version, OS family, btrfs availability, sector sizes and encryption state.",
              "Copy progress during a move, and, if an install fails, the last log lines, with secrets removed.",
              "Never: file contents, hostnames, IP addresses, user names or process lists. The copy runs inside the VM, from your disks to the pool’s disks.",
            ],
          },
        ],
      },
      {
        id: "what-amoeba-deletes",
        title: "What Amoeba deletes",
        body: [
          {
            kind: "ul",
            items: [
              "Only these: an elastic disk a shrink emptied; a disk an expand created and gave up on; the pool’s disks after you go back; a source disk after the 48-hour soak, once its snapshot is complete; and a safety snapshot when its 7\u00a0days end.",
              "It never removes a disk that still holds data, never deletes a source disk before its snapshot is complete, and never looks inside a VM you haven’t onboarded.",
            ],
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
              "Sign in with Microsoft or Google. Zoorik never sees your password. Sign-in uses OpenID Connect with PKCE and a nonce, Secure and HttpOnly cookies, and anti-forgery tokens. A session ends after 30\u00a0minutes idle or 12\u00a0hours.",
              "Row-level security in the database keeps each Coral organisation’s data apart, and every agent upload is tied to the organisation of its credential.",
              "Only a small number of people at Zoorik, and the automated tools that build and deploy our products, can access or change the systems that run them.",
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
              "Every connection from the internet uses HTTPS, with HSTS. Cloudflare re-encrypts traffic to our servers, and our gateway accepts connections only from Cloudflare. Coral reaches its database over TLS 1.2 or later. Azure encrypts the database and disks at rest.",
              "Cluster data is kept while the cluster reports, then for 30\u00a0days. Amoeba’s agent reports sit in a cache for up to 72\u00a0hours.",
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
                "DNS and the secure proxy in front of Coral",
                "Every request in transit, agent uploads included. It decrypts and re-encrypts each request.",
              ],
            ],
          },
          {
            kind: "p",
            text: [
              "These two handle the cluster and VM data we process for you. The full list is in the ",
              { href: `${routes.privacy}#sharing`, text: "privacy policy" },
              ".",
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
              "If a breach affects your personal data, we tell you, and the authorities the law requires.",
              "If we process personal data for you, we answer your reasonable written security questions once a year.",
            ],
          },
          {
            kind: "links",
            links: [
              { text: "Privacy policy", href: routes.privacy },
              { text: "Terms of use", href: routes.terms },
            ],
          },
        ],
      },
    ],
  },
];
