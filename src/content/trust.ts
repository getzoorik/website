import type { DocumentId } from "@/content/documents";

/**
 * `/trust`: the Trust center, every string it prints, word for word from the checked draft
 * (docs/website-seo/new-pages-2026-10-30/trust/page.md, each claim traced in its ledger.md) and the mock (trust.html).
 * The owner, 29 Oct 2026: "yes, publish the security overview, DPA and sub-processor list on /trust".
 *
 * Laid out as /privacy is: the hero, the On this page rail beside the reading column, the Updated line, the opening
 * paragraph, then the four sections. The security overview's six parts are h3s with ids, listed under it in the rail.
 * The DPA v1.0 is a download (`coral-dpa` in `documents.ts`, its pages and size read from the file); the security
 * overview is this page alone, its PDF goes out with the pilot paperwork.
 *
 * The text is the draft's small markup, drawn by `RichText`: `code`, **bold**, [text](href), the address as a mailto.
 * A paragraph that is only bold, over a list, is that list's heading (an h4), as the mock draws it.
 *
 * ─── THE IDS ARE A CONTRACT ────────────────────────────────────────────────
 * Security teams are sent links to these sections (`/trust#dpa`, `/trust#sub-processors`). Keep an id when its
 * heading changes.
 */

export type TrustItem = string | { readonly download: DocumentId; readonly text: string };

export type TrustBlock =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "h3"; readonly id?: string; readonly text: string }
  | { readonly kind: "h4"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly TrustItem[] }
  | {
      readonly kind: "table";
      readonly head: readonly string[];
      readonly rows: readonly (readonly string[])[];
    };

export interface TrustSection {
  readonly id: string;
  readonly title: string;
  readonly blocks: readonly TrustBlock[];
}

/**
 * The day /trust's content last changed. The page prints it ("Updated 30 October 2026"), and the sitemap reads it;
 * whoever changes the page moves it in the same PR.
 */
export const trustUpdated = "Updated 30 October 2026";

export const trustPage = {
  /** The page's `<title>` (through the site's "%s | Zoorik" template) and its description. */
  meta: {
    title: "Trust center",
    description:
      "Coral's security overview, our data processing agreement and our sub-processors: what runs in your cluster, what leaves it, and how we protect it.",
  },
  hero: {
    title: "Trust center",
    deck: "This page brings together our security overview, our data processing agreement and our sub-processor list. It is for the security and legal teams who review Coral before a pilot.",
  },
  /** The paragraph that opens the column, under the Updated line. */
  intro:
    "They cover Coral, which rebalances Kubernetes clusters on AKS and EKS, and the Zoorik platform that runs it. They do not cover Amoeba. For Amoeba's permissions and data, see our [security page](/security#amoeba-on-your-vms).",
  sections: [
    {
      id: "security-overview",
      title: "Security overview",
      blocks: [
        {
          kind: "p",
          text: "This is a plain-words summary of our security overview of 23 October 2026. The full overview goes into more detail, such as the exact Kubernetes and cloud permissions Coral holds. It comes with our pilot paperwork. You can also email [founders@zoorik.com](mailto:founders@zoorik.com) for a copy.",
        },
        { kind: "h3", id: "in-your-cluster", text: "What runs in your cluster" },
        { kind: "p", text: "Coral installs three parts in each cluster you connect:" },
        {
          kind: "ul",
          items: [
            "**An agent.** It reads the cluster, sends usage summaries to Zoorik and makes the changes your settings allow.",
            "**An admission webhook.** It sizes new pods as they are created. If it cannot answer, Kubernetes goes ahead without it.",
            "**A node daemon.** It moves running pods between nodes without a restart. It runs as root on each Linux node, and it has no connection to Zoorik.",
          ],
        },
        {
          kind: "p",
          text: "The agent runs as a non-root user. Its root file system is read-only, and every Linux capability is dropped.",
        },
        {
          kind: "p",
          text: "Everything Coral installs carries the label `app.kubernetes.io/part-of=zoorik-agent`.",
        },
        {
          kind: "p",
          text: "**Updates.** The agent updates itself, the webhook and the node daemon to each Zoorik release. It rolls back a failed update. It moves only to pinned images from `ghcr.io/getzoorik`.",
        },
        {
          kind: "p",
          text: "The agent cannot give itself a permission it does not hold. A release that needs more access waits until you run connect again.",
        },
        {
          kind: "p",
          text: "To review each release first, install the agent with our [Helm chart](/docs/install-coral-with-helm). An agent installed with Helm, Argo CD or Flux does not update itself. You upgrade it when you choose.",
        },
        { kind: "h3", id: "data", text: "What leaves your cluster, and what never does" },
        {
          kind: "p",
          text: "The agent opens every connection to Zoorik itself, over HTTPS. Nothing at Zoorik connects into your cluster. Your cluster needs no port open to the internet.",
        },
        { kind: "h4", text: "What the agent sends us" },
        {
          kind: "ul",
          items: [
            "Resource usage for each container: CPU, memory, out-of-memory kills, probe failures and CPU pressure.",
            "An inventory, such as nodes, workloads, namespaces, autoscalers, PodDisruptionBudgets, quotas and labels.",
            "Events, such as out-of-memory kills, evictions and spot interruptions, and what Coral did and why.",
            "A regular heartbeat with the agent's status.",
            "When the agent registers, the cluster's name and its cloud account.",
            "The message Kubernetes or the cloud gives when it refuses a change Coral makes.",
            "A record of each node action: the node, the pods moved and the outcome.",
          ],
        },
        { kind: "h4", text: "What never leaves your cluster" },
        {
          kind: "ul",
          items: [
            "Your Secrets, and your ConfigMaps other than the cluster autoscaler's status.",
            "Pod logs, and the data inside your applications, such as request payloads.",
            "Environment variables, Java options, commands, arguments and your containers' image names.",
            "Annotations, other than Coral's own `coral.zoorik.com/configuration`.",
            "Kubernetes event text, other than the refusal messages above.",
            "Pod memory. When Coral moves a running pod, its checkpoint stays inside your cluster. It moves between the two nodes over mutual TLS and is deleted when the move ends.",
          ],
        },
        {
          kind: "p",
          text: "The agent looks at some of these inside your cluster, for example to spot Java workloads. It does not send them. A message from Kubernetes or the cloud that refuses a change can still quote some of them.",
        },
        {
          kind: "p",
          text: "Most of this data describes machines and software, not people. It can still hold personal data, such as a person's name in a namespace or a label.",
        },
        {
          kind: "p",
          text: "If the agent cannot reach Zoorik, it keeps usage summaries inside its own pod and sends them later.",
        },
        { kind: "h3", id: "access", text: "Access and permissions" },
        { kind: "h4", text: "In Kubernetes" },
        {
          kind: "ul",
          items: [
            "The agent cannot read your Secrets.",
            "It cannot read your ConfigMaps, except the cluster autoscaler's status.",
            "It has no permission to read pod logs, or to exec into, attach to or port-forward to a pod.",
            "It reads kubelet metrics through `nodes/proxy`. That permission could also reach the kubelet's log and exec endpoints, which Coral never calls.",
            "It changes workloads and nodes only as your Coral settings allow.",
            "Admission policies in your cluster limit most of its writes. They apply only to Zoorik's own service accounts.",
            "Kubernetes applies your PodDisruptionBudgets to every eviction Coral makes.",
          ],
        },
        { kind: "h4", text: "In your cloud account" },
        {
          kind: "ul",
          items: [
            "To remove machines it has emptied, the agent uses an identity in your own cloud account.",
            "You create that identity with your own `az` or `aws` sign-in, when you connect or later. You can also create it with our public Terraform modules.",
            "The identity has no secret or key. On AKS it uses workload identity federation with Microsoft Entra ID. On EKS it uses EKS Pod Identity or IRSA, which give temporary credentials.",
            "Its changes are limited to one cluster.",
            "**On AKS,** a custom role on that one cluster lets Coral delete machines it has emptied. It can also reduce a pool's minimum when that minimum alone keeps such a machine.",
            "The Azure permission that reduces a minimum would also allow creating or changing node pools. Coral never creates a pool or a machine, and never raises a count.",
            "**On EKS,** an IAM role lets Coral terminate instances only in this cluster's Auto Scaling groups. It can also reduce the minimum of this cluster's groups and managed node groups. It can read Auto Scaling groups and instances across your account.",
            "The AWS permissions that reduce a minimum could also make AWS add instances. The role cannot launch instances itself. Coral only reduces a minimum and never raises a size.",
            "If you prefer, our Terraform modules for AKS and EKS can leave out the permission to change a minimum. Coral then removes emptied machines but does not reduce a minimum.",
            "Zoorik holds no credential for your cloud account, and keeps no kubeconfig.",
            "Observing needs no cloud permission. Without the identity, the agent still installs.",
            "To revoke Coral's cloud access, remove the role assignment or the policy. Node removal stops once your cloud applies the change.",
          ],
        },
        { kind: "h4", text: "Connecting a cluster" },
        {
          kind: "ul",
          items: [
            "A connect token works once and expires after 60 minutes.",
            "A person with cluster-admin rights runs `zoorikctl cluster connect` with their own kubeconfig.",
            "zoorikctl prints every change and asks before it makes one. With `--dry-run`, it prints everything and changes nothing.",
            "Zoorik never receives your kubeconfig, a cluster-admin credential or a cloud credential.",
            "The agent swaps the token for its own cluster credential, which is replaced automatically.",
            "Zoorik stores the token and the credential only as SHA-256 fingerprints.",
          ],
        },
        { kind: "h4", text: "See what Coral does" },
        {
          kind: "ul",
          items: [
            "Every change Coral makes in your cloud appears under its identity, `zoorik-agent-<cluster>`, in your Azure Activity Log or AWS CloudTrail.",
            "Every Kubernetes call Coral makes comes from one of its own three service accounts. Your cluster's audit log shows these calls when audit logging is on.",
            "Coral records each change it makes and why, and shows them in the Coral console. It also records who changed each setting.",
          ],
        },
        { kind: "h3", id: "sign-in", text: "Sign-in and data separation" },
        {
          kind: "ul",
          items: [
            "No passwords. Your people sign in with Microsoft or Google, through OpenID Connect with PKCE and a nonce.",
            "Coral keeps no Microsoft or Google token.",
            "Cookies are Secure and HttpOnly, with anti-forgery tokens.",
            "A session ends after 30 minutes idle, after 12 hours, or at sign-out.",
            "Coral has three roles: Owner, Admin and Viewer. A Viewer can see everything and change nothing.",
            "The first person to connect a cluster becomes the Owner. Others who join are Viewers.",
            "Row-level security in our database keeps each organisation's data apart.",
            "Every agent upload is tied to the organisation of its credential.",
            "Only a small number of people at Zoorik can access or change the systems that run Coral. So can the automated tools we use to build and deploy it.",
          ],
        },
        { kind: "h3", id: "storage", text: "Data storage and deletion" },
        { kind: "h4", text: "Where your data is kept" },
        {
          kind: "ul",
          items: [
            "We store Coral's data in Microsoft Azure, in the Central India region. Its servers, database, backups and key vault are all there.",
            "Backups are kept for 7 days, in that region only. They are not copied to another region.",
            "Azure encrypts our database and disks at rest.",
          ],
        },
        { kind: "h4", text: "How it travels" },
        {
          kind: "ul",
          items: [
            "Every connection to Zoorik from the internet uses HTTPS. Plain HTTP is redirected, and browsers are told to use HTTPS only (HSTS).",
            "Cloudflare re-encrypts traffic to our servers and checks their certificate. Our web gateway accepts connections only from Cloudflare.",
            "Coral's connection to its database is encrypted, and Coral checks the server's certificate.",
            "Between your cluster and Zoorik, data passes through Cloudflare's network, which may route it outside India.",
          ],
        },
        { kind: "h4", text: "Deletion" },
        {
          kind: "ul",
          items: [
            "We keep cluster data while the cluster reports to us.",
            "We delete it within 30 days after the pilot ends, you disconnect Coral, or you ask in writing. We confirm each deletion in writing.",
            "Copies in our database backups expire within 7 days after the deletion.",
            "Coral has no self-service tool to delete or export cluster data. We delete it by hand.",
            "Disconnecting a cluster does not delete its data or tell us. Email [founders@zoorik.com](mailto:founders@zoorik.com) when you disconnect one.",
          ],
        },
        { kind: "h3", id: "report", text: "Report a security issue" },
        {
          kind: "ul",
          items: [
            "Email [founders@zoorik.com](mailto:founders@zoorik.com). The same address is in our [security.txt](/.well-known/security.txt) file.",
            "Please do not test Zoorik's systems without our written permission ([Terms of use](/terms), section 6).",
            "If a personal data breach affects your cluster data, we tell your contacts within 24 hours of becoming aware of it. We send updates as we learn more.",
            "We also tell the authorities the law requires us to tell.",
          ],
        },
        { kind: "h4", text: "To stop Coral" },
        {
          kind: "ul",
          items: [
            "Switch Automatically optimize, Node optimization and the Evictor off in the Coral console.",
            "Remove the cloud role assignment or policy. Node removal stops once your cloud applies the change.",
            "Run `zoorikctl cluster disconnect`. It removes Coral from your cluster.",
          ],
        },
      ],
    },
    {
      id: "dpa",
      title: "Data processing agreement",
      blocks: [
        { kind: "p", text: "**Version 1.0 · 23 October 2026**" },
        { kind: "h3", text: "What it is" },
        {
          kind: "p",
          text: "Our data processing agreement (DPA) covers the cluster data the Coral agent sends us.",
        },
        {
          kind: "p",
          text: "It is the contract between a Data Fiduciary and its Data Processor that section 8(2) of India's Digital Personal Data Protection Act, 2023 requires. You are the Data Fiduciary for any personal data in it. Zoorik processes that data for you, as your Data Processor.",
        },
        { kind: "h3", text: "Who it is for" },
        { kind: "p", text: "It is for organisations that run a Coral pilot with us." },
        {
          kind: "ul",
          items: [
            "You do not sign the DPA on its own. It becomes part of your pilot when you sign the Pilot Schedule that names it, beside the Zoorik Pilot Terms.",
            "The DPA is the same for every client. A change for one client counts only if its Pilot Schedule states it.",
            "We never change a version once a Pilot Schedule names it.",
          ],
        },
        { kind: "h3", text: "Its key terms" },
        {
          kind: "ul",
          items: [
            "**Your instructions.** We process cluster data only on your instructions, and only to provide Coral. We do not sell it or use it for advertising.",
            "**Breach notice.** We tell your contacts about a personal data breach within 24 hours of becoming aware of it. We send updates as we learn more.",
            "**Sub-processors.** You approve the three [listed below](#sub-processors). We email you at least 30 days before we add or replace one. You may object within those 30 days. If we cannot resolve it, you may stop the pilot.",
            "**Where data is kept.** We store and back up cluster data only in Azure's Central India region. Cloudflare's network may route it outside India in transit. We make no other transfer outside India without telling you first.",
            "**Questions and audits.** Once a year, on written request, we answer your reasonable security questionnaire. A regulator with authority over you, such as the Reserve Bank of India, may require records about the processing. If it does, we give it and you access to them, on reasonable notice. We cannot extend this to Azure or Cloudflare beyond their own terms.",
            "**Deletion.** We delete cluster data within 30 days after the pilot ends, you disconnect Coral, or you ask in writing. We confirm it in writing. Backup copies expire within 7 days after that.",
            "**Liability.** The limits in section 10 of the Pilot Terms cover claims under the DPA. That section applies sections 13 to 15 of our [Terms of use](/terms). Nothing in them limits a liability the law does not allow to be limited.",
            "**Law.** The laws of India govern the DPA. The courts at Bengaluru, Karnataka have exclusive jurisdiction.",
            "**GDPR.** If the GDPR or the UK GDPR applies to your cluster data, we sign the European Commission's standard contractual clauses. For UK data, we add the UK addendum.",
          ],
        },
        { kind: "h3", text: "How to get it" },
        {
          kind: "ul",
          items: [
            "It comes with your pilot paperwork. The Pilot Schedule you sign names it.",
            {
              download: "coral-dpa",
              text: "Download the data processing agreement, version 1.0 (PDF)",
            },
            "Or email [founders@zoorik.com](mailto:founders@zoorik.com) for a copy.",
          ],
        },
      ],
    },
    {
      id: "sub-processors",
      title: "Sub-processors",
      blocks: [
        {
          kind: "p",
          text: "These companies handle the cluster data we process for you. The list is Annex 3 of DPA version 1.0.",
        },
        {
          kind: "table",
          head: ["Sub-processor", "What it does for Zoorik", "Where", "Cluster data it handles"],
          rows: [
            [
              "Microsoft Azure",
              "Hosts Coral: its servers, database, backups and key vault",
              "Central India region",
              "All cluster data Zoorik stores, and its backups",
            ],
            [
              "Cloudflare",
              "Runs DNS and the secure proxy in front of Coral",
              "Cloudflare's global network. A request can be handled outside India.",
              "Every request between your clusters or browsers and Coral, in transit, agent uploads included. It decrypts and re-encrypts each request.",
            ],
            [
              "Google (Workspace)",
              "Zoorik's email",
              "Google's data centres, which can be outside India",
              "Emails between us, such as the pilot report and support replies. They can name your clusters, nodes and workloads.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Signing your people in with Microsoft or Google passes no cluster data to those companies. Nor does GitHub, which serves the Coral agent's images to your clusters. Our [privacy policy](/privacy#sharing) covers what they handle.",
        },
        {
          kind: "p",
          text: "We email your contacts at least 30 days before we add or replace a sub-processor of cluster data. The email names the company, what it will do and where.",
        },
      ],
    },
    {
      id: "more",
      title: "More",
      blocks: [
        {
          kind: "ul",
          items: [
            "[Security and data handling](/security): what each product may change, what it sends us and where we keep it. Amoeba is there too.",
            "[Privacy policy](/privacy): the personal data Zoorik controls itself, and your rights.",
            "[Terms of use](/terms): the agreement between Zoorik and the organisations that use our products.",
          ],
        },
        {
          kind: "p",
          text: "Questions from your security or legal team? Email [founders@zoorik.com](mailto:founders@zoorik.com), or [pick a time to talk](https://cal.com/zoorik/talk).",
        },
      ],
    },
  ] satisfies readonly TrustSection[] as readonly TrustSection[],
} as const;
