import { routes } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * /open-source and the three guides under /docs. Text is a small markup-lite: `code`, **bold** and [text](href).
 *
 * KEEP EVERY LINE TRUE. The facts, as read from their sources: the public repos are Apache-2.0, only
 * zoorikctl's releases are cosign-signed, the coral-agent chart declares no licence and its source (the Coral agent) is
 * private, and only the assessment has open good first issues. Re-read the sources before changing a line: the
 * coral-agent chart README, the two module READMEs, getzoorik/.github's CONTRIBUTING, SECURITY and CODE_OF_CONDUCT,
 * the zoorikctl README, and the assessment's and kubernetes-scenarios' CONTRIBUTING files.
 */

/** The guides' printed date ("Updated 3 November 2026"), which the sitemap gives them too. */
export const openSourceUpdated = "3 November 2026";

/** /open-source prints no date: the day its content last changed, for the sitemap. Move it in the PR that changes it. */
export const openSourceLastUpdated = "3 November 2026";

export type GuideBlock =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly string[] }
  | { readonly kind: "steps"; readonly items: readonly string[] }
  | { readonly kind: "h3"; readonly text: string }
  /** A command well: "$ " where a command starts, and a Copy button. */
  | { readonly kind: "cmd"; readonly text: string }
  /** A values, YAML or HCL block: it scrolls sideways, with no prompt and no copy. */
  | { readonly kind: "code"; readonly text: string }
  | {
      readonly kind: "table";
      readonly head: readonly string[];
      readonly rows: readonly (readonly string[])[];
      /** Each column's share, as the mock sets it. */
      readonly widths: readonly string[];
    };

/**
 * A guide in the docs guide frame (`OsGuidePage`): the three guides here, and the two troubleshooting pages
 * (`troubleshooting.ts`), which add their own product and date.
 */
export interface OpenSourceGuide {
  readonly route: string;
  /** The product the guide is about: the closing row's and the structured data's. Coral when none is given. */
  readonly product?: ProductId;
  /** The printed date ("Updated 29 October 2026"), which the sitemap gives it too; `openSourceUpdated` when none. */
  readonly updated?: string;
  /** The `<title>` (through the site's "%s | Zoorik" template) and the description. */
  readonly meta: { readonly title: string; readonly description: string };
  readonly hero: { readonly title: string; readonly deck: string };
  /** The short answer under the byline, where the guide has one. */
  readonly short?: string;
  readonly sections: readonly {
    readonly title: string;
    /** Its address, where links still point at an older heading's; `sectionSlug(title)` when none. */
    readonly id?: string;
    /** Its chip on a phone, where that is shorter than the heading; the heading when none. */
    readonly chip?: string;
    readonly blocks: readonly GuideBlock[];
  }[];
  readonly related: readonly { readonly text: string; readonly href: string }[];
}

export type OpenSourceGuideId = "helm" | "terraform" | "contributing";

export const openSourceGuides: Readonly<Record<OpenSourceGuideId, OpenSourceGuide>> = {
  helm: {
    route: "/docs/install-coral-with-helm",
    meta: {
      title: "Install Coral with Helm",
      description:
        "Install Coral with Helm: the coral-agent chart, what you need, the install command, values, cloud identity on AKS and EKS, Argo CD, upgrades and uninstall.",
    },
    hero: {
      title: "Install Coral with Helm",
      deck: "The coral-agent chart installs the same agent as zoorikctl, for teams on Helm, Argo CD or Flux.",
    },
    sections: [
      {
        title: "Before you install",
        blocks: [
          {
            kind: "ul",
            items: [
              "Kubernetes 1.30 or later, with nodes on amd64 or arm64.",
              "A connect token from the Connect dialog in the Coral console. It works once, within an hour of being issued. Coral is in early access: [book a demo](https://cal.com/zoorik/talk) for a console account.",
              "The control plane origin the console gives you, with no path and no trailing slash.",
              "A cloud identity, if Coral is to remove nodes. Create it with [our Terraform modules](/docs/install-coral-with-terraform) or `zoorikctl cluster grant-node-deletion`.",
            ],
          },
        ],
      },
      {
        title: "Install",
        blocks: [
          {
            kind: "cmd",
            text: "helm install coral-agent \\\n  oci://ghcr.io/getzoorik/charts/coral-agent \\\n  --kube-context <context> \\\n  --namespace default \\\n  --set controlPlaneUrl=<control plane origin> \\\n  --set connectToken.value=<connect token>",
          },
          {
            kind: "p",
            text: "Use any release namespace except `zoorik-agent` and `zoorik-node`. The chart creates those two itself, with their Pod Security labels, so `--namespace zoorik-agent --create-namespace` fails with an ownership error.",
          },
          {
            kind: "p",
            text: "On start, the agent redeems the token and keeps the cluster credential it receives in the Secret `zoorik-agent/zoorik-agent-credential`, which it owns. `helm install --wait` takes at least two minutes, because the agent Deployment sets `minReadySeconds: 120`.",
          },
          {
            kind: "p",
            text: "Already connected with zoorikctl? `helm install` refuses the objects it applied, as they carry no Helm ownership. Run `zoorikctl cluster disconnect` first, then install the chart with a new connect token.",
          },
        ],
      },
      {
        title: "Values",
        blocks: [
          {
            kind: "table",
            head: ["Value", "Default", "What it sets"],
            rows: [
              [
                "`controlPlaneUrl`",
                "required",
                "`controlPlaneUrl` in ConfigMap `zoorik-agent-config`",
              ],
              [
                "`connectToken.value`",
                "required unless `existingSecret` is set",
                "Secret `zoorik-agent-bootstrap`, and the agent pod annotation `coral.zoorik.com/connect-token` (the token’s key id)",
              ],
              [
                "`connectToken.existingSecret`",
                "empty",
                "a Secret in `zoorik-agent` that holds the token under `bootstrap-token`, used instead of `zoorik-agent-bootstrap`",
              ],
              [
                "`clusterName`",
                "empty",
                "`clusterName` in `zoorik-agent-config`; empty lets the control plane name the cluster",
              ],
              [
                "`clusterResourceId`",
                "empty",
                "`clusterResourceId` in `zoorik-agent-config`: the cluster’s cloud resource id",
              ],
              [
                "`scrapeIntervalSeconds`",
                "`30`",
                "`scrapeIntervalSeconds` in `zoorik-agent-config`",
              ],
              [
                "`image.repository`",
                "`ghcr.io/getzoorik/coral/agent`",
                "the agent and webhook image, and `agentRegistry` in `zoorik-agent-release-params`",
              ],
              ["`image.tag`", "the chart’s `appVersion`", "the agent and webhook image tag"],
              [
                "`image.digest`",
                "the chart’s released digest when `image.tag` is empty",
                "the image digest",
              ],
              [
                "`serviceAccount.annotations`",
                "empty",
                "annotations on ServiceAccount `zoorik-agent`, for the cloud identity",
              ],
              [
                "`agentEnv`",
                "empty",
                "ConfigMap `zoorik-agent-env`, read by the agent as environment variables",
              ],
              ["`agent.resources`", "built-in", "the agent container’s resources"],
              ["`webhook.resources`", "built-in", "the webhook container’s resources"],
              [
                "`webhook.hostNetwork`",
                "`false`",
                "runs the pod webhook on the host network on port 10263, for a control plane that cannot reach pod IPs (EKS with an overlay CNI, some hosted control planes); sets `zoorik-agent` to the `privileged` Pod Security level; not for OpenShift",
              ],
              [
                "`openshift`",
                "`false`",
                "drops the fixed `runAsUser`, `runAsGroup` and `fsGroup`, so OpenShift assigns them",
              ],
            ],
            widths: ["28%", "24%", "48%"],
          },
          {
            kind: "p",
            text: "The built-in resources suit clusters of up to 5,000 pods. For larger clusters, raise memory as zoorikctl does, and keep `cpu: 100m` (agent) and `cpu: 50m` (webhook) in the requests:",
          },
          {
            kind: "table",
            head: ["Pods", "agent.resources memory", "webhook.resources memory"],
            rows: [
              ["up to 20,000", "512Mi request, 1Gi limit", "256Mi request, 512Mi limit"],
              ["up to 50,000", "1Gi request, 2Gi limit", "512Mi request, 1Gi limit"],
            ],
            widths: ["24%", "38%", "38%"],
          },
        ],
      },
      {
        title: "Cloud identity",
        blocks: [
          {
            kind: "p",
            text: "The agent reads the cloud through the identity bound to its ServiceAccount. Set it with `serviceAccount.annotations`:",
          },
          {
            kind: "table",
            head: ["Cluster", "Annotation"],
            rows: [
              [
                "AKS, with workload identity",
                "`azure.workload.identity/client-id: <client id of the managed identity>`. The identity’s federated credential names the subject `system:serviceaccount:zoorik-agent:zoorik-agent`.",
              ],
              [
                "EKS, with IAM roles for service accounts (IRSA)",
                "`eks.amazonaws.com/role-arn: <role arn>`",
              ],
              ["EKS, with Pod Identity", "None. The association lives in AWS."],
            ],
            widths: ["34%", "66%"],
          },
          { kind: "p", text: "On the command line, for AKS:" },
          {
            kind: "code",
            text: "--set-string 'serviceAccount.annotations.azure\\.workload\\.identity/client-id=<client id>'",
          },
          {
            kind: "p",
            text: "Changing these annotations restarts the agent, because the cloud credential is injected only when a pod is created.",
          },
        ],
      },
      {
        title: "Argo CD and Flux",
        id: "with-argo-cd-or-flux",
        blocks: [
          {
            kind: "p",
            text: "To keep the token out of your values, set `connectToken.existingSecret` to a Secret in `zoorik-agent` that holds the token under the key `bootstrap-token`. The chart creates that namespace, so create the Secret after the install, or ship it in the same GitOps application. The agent pod waits for it.",
          },
          {
            kind: "p",
            text: "After the install, the pod webhook, the agent and the node daemon write to some objects. In an Argo CD application, ignore these fields:",
          },
          {
            kind: "code",
            text: 'ignoreDifferences:\n  - group: admissionregistration.k8s.io\n    kind: MutatingWebhookConfiguration\n    name: zoorik-agent-webhook\n    jqPathExpressions:\n      - .webhooks[].clientConfig.caBundle\n      - .webhooks[] | select(.name == "pods.webhook.coral.zoorik.com") | .objectSelector\n      - .metadata.annotations["coral.zoorik.com/webhook-state"]\n  - kind: Secret\n    name: zoorik-agent-webhook-tls\n    jsonPointers: [/data]\n  - kind: Secret\n    name: zoorik-node-tls\n    jsonPointers: [/data]\n  - kind: Secret\n    name: zoorik-node-ca\n    jsonPointers: [/data]\n  - kind: ConfigMap\n    name: zoorik-rollout-markers\n    jsonPointers: [/data]\n  - kind: ConfigMap\n    name: zoorik-agent-forced-drains\n    jsonPointers: [/data]\n  - kind: ConfigMap\n    name: zoorik-agent-live-migrations\n    jsonPointers: [/data]',
          },
        ],
      },
      {
        title: "Upgrade",
        blocks: [
          {
            kind: "p",
            text: "A Helm-installed agent doesn’t upgrade itself. Each chart version pins one agent release, so `helm upgrade` to a newer chart version moves the agent.",
          },
          {
            kind: "p",
            text: "Helm installs the custom resource definitions only on the first install. The agent applies the definitions its own release carries each time it starts.",
          },
          { kind: "h3", text: "Reconnect with a new token" },
          {
            kind: "cmd",
            text: "helm upgrade coral-agent \\\n  oci://ghcr.io/getzoorik/charts/coral-agent \\\n  --kube-context <context> --namespace default \\\n  --reuse-values --set connectToken.value=<new connect token>",
          },
          {
            kind: "p",
            text: "The new token changes the pod annotation, so the agent restarts and enrols with it. With `existingSecret`, replace the token in the Secret, then run `kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent`.",
          },
        ],
      },
      {
        title: "Uninstall",
        blocks: [
          {
            kind: "p",
            text: "`helm uninstall` removes the chart’s objects and both namespaces. It leaves the custom resource definitions, and it doesn’t undo what the agent changed on nodes and workloads.",
          },
          {
            kind: "p",
            text: "`zoorikctl cluster disconnect` undoes those changes: Coral’s cordons and taints, HPA and VPA holds, rollout markers and deletion-cost settings. It works whether or not the agent still runs.",
          },
        ],
      },
    ],
    related: [
      { text: "Install Coral with Terraform + Helm", href: "/docs/install-coral-with-terraform" },
      { text: "Coral works with Helm", href: routes.coralWorksWithHelm },
      { text: "Coral troubleshooting", href: routes.coralTroubleshooting },
      { text: "Open source", href: "/open-source" },
    ],
  },
  terraform: {
    route: "/docs/install-coral-with-terraform",
    meta: {
      title: "Install Coral with Terraform + Helm",
      description:
        "Install Coral with Terraform and Helm: the AKS and EKS modules, what each creates, the chart values to pass, and the ignore_changes your node pools need.",
    },
    hero: {
      title: "Install Coral with Terraform + Helm",
      deck: "Terraform creates Coral’s cloud permissions. Helm installs the agent.",
    },
    short:
      "Each module creates the same identity, role and permissions as `zoorikctl connect`, with the same names, so zoorikctl treats them as done. Both modules are Apache-2.0, on the Terraform Registry.",
    sections: [
      {
        title: "AKS",
        id: "aks",
        blocks: [
          { kind: "h3", text: "Before you apply" },
          {
            kind: "ul",
            items: [
              "Turn on the cluster’s OIDC issuer and workload identity (`oidc_issuer_enabled` and `workload_identity_enabled`).",
              "Point the azurerm provider at the cluster’s subscription.",
              "Custom role names are unique in a tenant, so only one module call creates the role. Other clusters pass that call’s `role_definition_id` output. If they are in other subscriptions, list those subscriptions in the creating call’s `role_assignable_scopes`.",
            ],
          },
          { kind: "h3", text: "The module" },
          {
            kind: "code",
            text: 'module "zoorik_coral" {\n  source          = "getzoorik/zoorik-coral/azurerm"\n  version         = "~> 0.1"\n  cluster_id      = "<AKS resource id>"\n  location        = "<region>"\n  oidc_issuer_url = "<the cluster\'s OIDC issuer URL>"\n}',
          },
          {
            kind: "p",
            text: "It creates the user-assigned managed identity `zoorik-agent-<cluster>` with the federated credential `zoorik-agent`, and the custom role `Zoorik Node Removal v2`, assigned on this cluster only. Its output `client_id` is the identity’s client id.",
          },
          { kind: "h3", text: "Install the agent" },
          {
            kind: "p",
            text: "Install the chart as [Install Coral with Helm](/docs/install-coral-with-helm) says, with these values:",
          },
          {
            kind: "code",
            text: "clusterResourceId: <cluster_id>\nserviceAccount:\n  annotations:\n    azure.workload.identity/client-id: <client_id>",
          },
          {
            kind: "p",
            text: "The namespace and the service account are both fixed at `zoorik-agent`, because the federated credential is bound to them.",
          },
        ],
      },
      {
        title: "EKS",
        blocks: [
          { kind: "h3", text: "Before you apply" },
          {
            kind: "ul",
            items: [
              "For Pod Identity, install the `eks-pod-identity-agent` add-on, unless EKS Auto Mode is on.",
              "For Pod Identity, apply this module before you install the chart: the agent gets AWS credentials only if the association exists when its pod starts. If the agent already runs, restart it once after the apply: `kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent`.",
              "For IRSA, set `irsa_oidc_issuer_url`. The cluster’s IAM OIDC provider must already exist.",
              "Point the aws provider at the cluster’s account and region.",
            ],
          },
          { kind: "h3", text: "The module" },
          {
            kind: "code",
            text: 'module "zoorik_coral" {\n  source       = "getzoorik/zoorik-coral/aws"\n  version      = "~> 0.1"\n  cluster_name = "<EKS cluster name>"\n}',
          },
          {
            kind: "p",
            text: "It creates the IAM role `zoorik-agent-<cluster>`, its inline policy, and the EKS Pod Identity association for `zoorik-agent/zoorik-agent`. With `irsa_oidc_issuer_url` set, the role trusts the cluster’s IAM OIDC provider instead, and no association is created. Its output `role_arn` is the role’s ARN.",
          },
          { kind: "h3", text: "Install the agent" },
          {
            kind: "p",
            text: "Install the chart as [Install Coral with Helm](/docs/install-coral-with-helm) says. With Pod Identity, set only:",
          },
          { kind: "code", text: "clusterResourceId: <cluster ARN>" },
          { kind: "p", text: "With IRSA:" },
          {
            kind: "code",
            text: "clusterResourceId: <cluster ARN>\nserviceAccount:\n  annotations:\n    eks.amazonaws.com/role-arn: <role_arn>",
          },
        ],
      },
      {
        title: "Pool minimums",
        id: "machine-deletion",
        blocks: [
          {
            kind: "p",
            text: "The modules let the agent remove nodes and, by default, reduce a pool’s or group’s minimum (`lower_minimums = true`), the same default as zoorikctl. With `lower_minimums = false`, the agent can’t reduce a minimum.",
          },
          {
            kind: "p",
            text: "The agent records the old minimum in tags, and `zoorikctl cluster disconnect` puts it back. The tags are `coral.zoorik.com_original-min` and `coral.zoorik.com_lowered-min` on AKS, and `coral.zoorik.com/original-min` and `coral.zoorik.com/lowered-min` on EKS.",
          },
        ],
      },
      {
        title: "Your own node pool code",
        blocks: [
          {
            kind: "p",
            text: "If Terraform manages your node pools, tell it to ignore the fields the agent changes, or each apply undoes them. On AKS, for `azurerm_kubernetes_cluster_node_pool`:",
          },
          {
            kind: "code",
            text: 'lifecycle {\n  ignore_changes = [\n    min_count,\n    tags["coral.zoorik.com_original-min"],\n    tags["coral.zoorik.com_lowered-min"],\n  ]\n}',
          },
          {
            kind: "p",
            text: "For the default pool in `azurerm_kubernetes_cluster`, the same fields sit under `default_node_pool[0]`.",
          },
          {
            kind: "p",
            text: "On EKS, each node the agent removes also reduces its group’s desired size. For `aws_eks_node_group`:",
          },
          {
            kind: "code",
            text: 'lifecycle {\n  ignore_changes = [\n    scaling_config[0].min_size,\n    scaling_config[0].desired_size,\n    tags["coral.zoorik.com/original-min"],\n    tags["coral.zoorik.com/lowered-min"],\n  ]\n}',
          },
          {
            kind: "p",
            text: "For `aws_autoscaling_group`, ignore `min_size`, `desired_capacity` and `tag`.",
          },
        ],
      },
    ],
    related: [
      { text: "Install Coral with Helm", href: "/docs/install-coral-with-helm" },
      { text: "Coral works with Terraform", href: routes.coralWorksWithTerraform },
      { text: "Coral troubleshooting", href: routes.coralTroubleshooting },
      { text: "Open source", href: "/open-source" },
    ],
  },
  contributing: {
    route: "/docs/contributing",
    meta: {
      title: "How to contribute",
      description:
        "How to contribute to Zoorik's open source: find an issue, run zoorikctl, the assessment or kubernetes-scenarios locally, and open a pull request.",
    },
    hero: {
      title: "How to contribute",
      deck: "Find an issue, run a repository locally and open a pull request on Zoorik’s public repositories.",
    },
    sections: [
      {
        title: "Pick an issue",
        blocks: [
          {
            kind: "ul",
            items: [
              "Search the open issues first. Someone may have reported it already.",
              "New here? Issues labelled [good first issue](https://github.com/search?q=org%3Agetzoorik+label%3A%22good+first+issue%22+state%3Aopen&type=issues) are small and say where to start.",
              "For a bug, use the bug report form. Say what you did, what you expected and what happened, and give the version you ran.",
              "For a big change, open an issue first, so we agree on the approach before you spend time on it.",
              "Remove tokens, keys and other secrets from anything you paste.",
            ],
          },
        ],
      },
      {
        title: "Run a repository locally",
        blocks: [
          {
            kind: "p",
            text: "Each repository’s README says how to run it and which checks CI runs. Most people start with one of these three.",
          },
          { kind: "h3", text: "zoorikctl" },
          { kind: "p", text: "You need Go, the version in `go.mod`." },
          {
            kind: "cmd",
            text: "git clone https://github.com/getzoorik/zoorikctl.git\ncd zoorikctl\ngo build -o bin/zoorikctl ./cmd/zoorikctl\n./bin/zoorikctl version",
          },
          { kind: "p", text: "Before a pull request, run these checks. CI runs them too:" },
          {
            kind: "cmd",
            text: 'go mod tidy && git diff --exit-code go.mod go.sum\ntest -z "$(gofmt -l .)"\ngo vet ./...\ngo test ./...',
          },
          { kind: "h3", text: "assessment" },
          {
            kind: "p",
            text: "Each script is one Python file that runs on Python 3.8 and later, with the standard library only. A local cluster (kind, minikube or k3d) is enough to try most changes to `k8s.py`:",
          },
          {
            kind: "cmd",
            text: "python3 k8s.py --help\npython3 k8s.py --context kind-kind --no-prices --sample-minutes 0",
          },
          {
            kind: "p",
            text: "`disks.py` needs an Azure subscription or an AWS account. A small Linux VM with one data disk is enough. On AWS, make it a Nitro instance that Systems Manager manages. The repository’s [contributing guide](https://github.com/getzoorik/assessment/blob/main/CONTRIBUTING.md) lists the checks CI runs.",
          },
          { kind: "h3", text: "kubernetes-scenarios" },
          {
            kind: "p",
            text: "A new scenario is a shape you met in a real cluster that the library doesn’t have yet. Check it on kind:",
          },
          {
            kind: "cmd",
            text: "scripts/validate.sh\nkind create cluster --config kind/cluster.yaml\nscripts/run.sh <new-name> kind-scenarios",
          },
        ],
      },
      {
        title: "Open a pull request",
        blocks: [
          {
            kind: "steps",
            items: [
              "Fork the repository and create a branch from `main`.",
              "Make one change per pull request. Small pull requests are easier to review and land sooner.",
              "Run the checks the repository’s README describes.",
              "Open the pull request and fill in the template: what you changed, why, and how you tested it.",
            ],
          },
          {
            kind: "p",
            text: "You do not need to sign off your commits or sign a contributor agreement. Our public repositories are licensed under Apache-2.0 (copyright Zoorik Private Limited). What you send is licensed the same way, as section 5 of the license says.",
          },
        ],
      },
      {
        title: "Review",
        blocks: [
          {
            kind: "ul",
            items: [
              "In zoorikctl, the assessment and kubernetes-scenarios, CI runs the repository’s checks on every pull request. They must pass.",
              "A maintainer reviews every pull request and merges it.",
              "In kubernetes-scenarios, a scenario’s shape changes only when it is wrong, because people test against it. A different shape is usually a new scenario.",
            ],
          },
        ],
      },
      {
        title: "Security and conduct",
        blocks: [
          {
            kind: "p",
            text: "Found a security problem? Don’t open an issue. Report it privately from the repository’s **Security** tab with **Report a vulnerability**, or write to founders@zoorik.com. We reply within 3 working days to confirm we have your report. The [security policy](https://github.com/getzoorik/.github/blob/main/SECURITY.md) has the details.",
          },
          {
            kind: "p",
            text: "Everyone here follows our [Code of Conduct](https://github.com/getzoorik/.github/blob/main/CODE_OF_CONDUCT.md). To report a problem, write to founders@zoorik.com.",
          },
        ],
      },
    ],
    related: [{ text: "Open source", href: "/open-source" }],
  },
};

/** A project's link; `who` is a screen-reader lead-in where a row names one place twice ("AKS module on GitHub"). */
export interface ProjectLink {
  readonly label: string;
  readonly href: string;
  readonly who?: string;
}

/** One Terraform module's links, after its muted name. */
export interface ProjectLinkGroup {
  readonly group: string;
  readonly links: readonly ProjectLink[];
}

export interface ProjectRow {
  readonly name: string;
  readonly line: string;
  readonly licence: string | null;
  readonly links: readonly (ProjectLink | ProjectLinkGroup)[];
}

export const openSourcePage = {
  meta: {
    title: "Open source",
    description:
      "Zoorik’s open-source projects, all Apache-2.0: the zoorikctl CLI, the free assessment, Terraform modules, test scenarios for kind, and how to contribute.",
  },
  hero: {
    title: "Open source",
    deck: "Read exactly what our CLI, assessment and Terraform modules do in your cluster and cloud account.",
  },
  /** Under the "Published on" strip, the trust sentence as the facts allow it: signing starts at v0.3.0, and PyPI's
   *  is a publish attestation. Each project row carries its own licence. */
  trust:
    "Every zoorikctl release since v0.3.0 is [signed with Sigstore](https://github.com/getzoorik/zoorikctl#install). Each assessment release on PyPI carries a provenance attestation from its GitHub release workflow.",
  projects: {
    title: "Projects",
    /* The Helm chart has no licence and no GitHub link: its source is private and it declares none. The chart and the
       Terraform modules end on their install guide, as zoorikctl ends on Install. */
    rows: [
      {
        name: "zoorikctl",
        line: "The CLI that connects a cluster to Coral and sets up its cloud permissions.",
        licence: "Apache-2.0",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/getzoorik/zoorikctl",
          },
          {
            label: "Releases",
            href: "https://github.com/getzoorik/zoorikctl/releases",
          },
          {
            label: "Homebrew",
            href: "https://github.com/getzoorik/homebrew-tap",
          },
          {
            label: "Scoop",
            href: "https://github.com/getzoorik/scoop-bucket",
          },
          {
            label: "Install",
            href: "/coral#install",
          },
        ],
      },
      {
        name: "kubernetes-scenarios",
        line: "Ready-made Kubernetes situations for testing cost optimizers on kind.",
        licence: "Apache-2.0",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/getzoorik/kubernetes-scenarios",
          },
        ],
      },
      {
        name: "assessment",
        line: "The free assessment for Kubernetes and block storage.",
        licence: "Apache-2.0",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/getzoorik/assessment",
          },
          {
            label: "PyPI",
            href: "https://pypi.org/project/zoorik/",
          },
          {
            label: "Good first issues",
            href: "https://github.com/getzoorik/assessment/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
          },
        ],
      },
      {
        name: "Terraform modules",
        line: "Coral’s cloud permissions for AKS and EKS.",
        licence: "Apache-2.0",
        links: [
          {
            group: "AKS",
            links: [
              {
                label: "GitHub",
                href: "https://github.com/getzoorik/terraform-azurerm-zoorik-coral",
                who: "AKS module on ",
              },
              {
                label: "Terraform Registry",
                href: "https://registry.terraform.io/modules/getzoorik/zoorik-coral/azurerm",
                who: "AKS module on the ",
              },
            ],
          },
          {
            group: "EKS",
            links: [
              {
                label: "GitHub",
                href: "https://github.com/getzoorik/terraform-aws-zoorik-coral",
                who: "EKS module on ",
              },
              {
                label: "Terraform Registry",
                href: "https://registry.terraform.io/modules/getzoorik/zoorik-coral/aws",
                who: "EKS module on the ",
              },
            ],
          },
          {
            label: "Install",
            href: routes.docsInstallTerraform,
          },
        ],
      },
      {
        name: "website",
        line: "The source of zoorik.com.",
        licence: "Apache-2.0",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/getzoorik/website",
          },
        ],
      },
      {
        name: "Helm chart",
        line: "The chart that installs the Coral agent.",
        licence: null,
        links: [
          {
            label: "Artifact Hub",
            href: "https://artifacthub.io/packages/helm/zoorik/coral-agent",
          },
          {
            label: "Install",
            href: routes.docsInstallHelm,
          },
        ],
      },
    ] as readonly ProjectRow[],
  },
  contribute: {
    title: "Contribute",
    rows: [
      {
        title: "How to contribute",
        line: "Pick an issue, run a repository and open a pull request.",
        href: "/docs/contributing",
      },
      {
        title: "Good first issues",
        line: "Small issues across our repositories that say where to start.",
        href: "https://github.com/search?q=org%3Agetzoorik+label%3A%22good+first+issue%22+state%3Aopen&type=issues",
      },
      {
        title: "Contributing guide",
        line: "The rules for every repository that has no guide of its own.",
        href: "https://github.com/getzoorik/.github/blob/main/CONTRIBUTING.md",
      },
      {
        title: "Code of conduct",
        line: "The Contributor Covenant, which everyone here follows.",
        href: "https://github.com/getzoorik/.github/blob/main/CODE_OF_CONDUCT.md",
      },
      {
        title: "Security policy",
        line: "How to report a vulnerability privately, and what happens next.",
        href: "https://github.com/getzoorik/.github/blob/main/SECURITY.md",
      },
    ] as readonly { readonly title: string; readonly line: string; readonly href: string }[],
  },
  /** The foot, muted: what is not open. Never "the parts you run yourself are open source": the agent's source is private. */
  foot: "Coral’s agent and its optimization engine are not open source. The engine runs as our service.",
  route: routes.openSource,
} as const;
