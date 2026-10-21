import { routes } from "@/config/site";

/**
 * /open-source and the three guides under /docs. Generated once from the mocks' data, so every string is the mock's.
 * Text is a small markup-lite: `code`, **bold** and [text](href).
 *
 * 🔴 KEEP EVERY LINE TRUE. The facts, as read from their sources: the public repos are Apache-2.0, only
 * zoorikctl's releases are cosign-signed, the coral-agent chart declares no licence and its source (the Coral agent) is
 * private, and only the assessment has open good first issues. Re-read the sources before changing a line: the
 * coral-agent chart README, the two module READMEs, getzoorik/.github's CONTRIBUTING, SECURITY and CODE_OF_CONDUCT,
 * the zoorikctl README, and the assessment's and kubernetes-scenarios' CONTRIBUTING files.
 */

/** The guides' printed date ("Updated 16 October 2026"), which the sitemap gives them too. */
export const openSourceUpdated = "16 October 2026";

/** /open-source prints no date: the day its content last changed, for the sitemap. Move it in the PR that changes it. */
export const openSourceLastUpdated = "21 October 2026";

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

export interface OpenSourceGuide {
  readonly route: string;
  /** The `<title>` (through the site's "Zoorik | %s" template) and the description. */
  readonly meta: { readonly title: string; readonly description: string };
  readonly hero: { readonly title: string; readonly deck: string };
  /** The short answer under the byline, where the guide has one. */
  readonly short?: string;
  readonly sections: readonly { readonly title: string; readonly blocks: readonly GuideBlock[] }[];
  readonly related: readonly { readonly text: string; readonly href: string }[];
}

export type OpenSourceGuideId = "helm" | "terraform" | "contributing";

export const openSourceGuides: Readonly<Record<OpenSourceGuideId, OpenSourceGuide>> = {
  helm: {
    route: "/docs/install-coral-with-helm",
    meta: {
      title: "Install Coral with Helm",
      description:
        "Install the Coral agent with the coral-agent Helm chart: the values, the cloud identity on AKS and EKS, upgrades, GitOps with Argo CD, and uninstalling.",
    },
    hero: {
      title: "Install Coral with Helm",
      deck: "The coral-agent chart installs the same agent a zoorikctl connect does, for teams on Helm, Argo CD or Flux.",
    },
    sections: [
      {
        title: "Before you install",
        blocks: [
          {
            kind: "ul",
            items: [
              "Kubernetes 1.30 or later, with nodes on amd64 or arm64.",
              "A connect token from the Connect dialog in the Zoorik console. A token works once, within an hour of being issued. Coral is in early access — [book a demo](https://cal.com/zoorik/talk) for a console account.",
              "The control plane origin the console names. It is the origin only: no path and no trailing slash.",
              "The cloud identity, if Zoorik is to remove nodes. [Install Coral with Terraform + Helm](/docs/install-coral-with-terraform) creates it as code, or `zoorikctl cluster grant-node-deletion` creates it from the command line.",
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
            text: "Install the release in any namespace except `zoorik-agent` and `zoorik-node`. The chart creates those two namespaces itself with their Pod Security labels, so `--namespace zoorik-agent --create-namespace` fails with an ownership error.",
          },
          {
            kind: "p",
            text: "The agent redeems the token when it starts and keeps the cluster credential it receives in the Secret `zoorik-agent/zoorik-agent-credential`, which it creates and owns. The agent Deployment sets `minReadySeconds: 120`, so `helm install --wait` takes at least two minutes.",
          },
          {
            kind: "p",
            text: "Already connected with zoorikctl? Objects it applied carry no Helm ownership, so `helm install` refuses them. Run `zoorikctl cluster disconnect` first, then install the chart with a new connect token.",
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
                "`clusterResourceId` in `zoorik-agent-config`, the cloud resource id of the cluster",
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
              ["`agent.resources`", "the bundle’s", "the agent container’s resources"],
              ["`webhook.resources`", "the bundle’s", "the webhook container’s resources"],
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
            text: "The agent’s resources suit clusters of up to 5,000 pods. For larger clusters, raise them as zoorikctl does, and keep `cpu: 100m` (agent) and `cpu: 50m` (webhook) in the requests when you set them:",
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
                "EKS, with IAM roles for service accounts",
                "`eks.amazonaws.com/role-arn: <role arn>`",
              ],
              ["EKS, with Pod Identity", "No annotation. The association lives in AWS."],
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
            text: "A change to these annotations restarts the agent, because the cloud credential is injected only when a pod is created.",
          },
        ],
      },
      {
        title: "With Argo CD or Flux",
        blocks: [
          {
            kind: "p",
            text: "To keep the token out of your values, set `connectToken.existingSecret` to the name of a Secret in `zoorik-agent` with the token under the key `bootstrap-token`. The chart creates that namespace, so create the Secret after the install, or deliver it with the same GitOps application. The agent pod waits for it.",
          },
          {
            kind: "p",
            text: "The pod webhook, the agent and the node daemon write to some objects after the install. Ignore these fields in an Argo CD application:",
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
            text: "A Helm-installed agent does not upgrade itself. Each chart version pins one agent release, and `helm upgrade` to a newer chart version moves it. Helm installs the custom resource definitions only on the first install; the agent applies the definitions its own release carries every time it starts.",
          },
          { kind: "h3", text: "Connect again with a new token" },
          {
            kind: "cmd",
            text: "helm upgrade coral-agent \\\n  oci://ghcr.io/getzoorik/charts/coral-agent \\\n  --kube-context <context> --namespace default \\\n  --reuse-values --set connectToken.value=<new connect token>",
          },
          {
            kind: "p",
            text: "The new token changes the pod annotation, so the agent restarts and enrols with it. With `existingSecret`, replace the token in the Secret and run `kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent`.",
          },
        ],
      },
      {
        title: "Uninstall",
        blocks: [
          {
            kind: "p",
            text: "`helm uninstall` removes the objects this chart installed, including both namespaces. It does not undo what the agent changed on nodes and workloads (Zoorik cordons and taints, HPA and VPA holds, rollout markers and deletion-cost settings); `zoorikctl cluster disconnect` does. Helm leaves the custom resource definitions in place.",
          },
        ],
      },
    ],
    related: [
      { text: "Install Coral with Terraform + Helm", href: "/docs/install-coral-with-terraform" },
      { text: "Open source", href: "/open-source" },
    ],
  },
  terraform: {
    route: "/docs/install-coral-with-terraform",
    meta: {
      title: "Install Coral with Terraform + Helm",
      description:
        "Create the cloud permissions the Coral agent needs with Zoorik's Terraform modules for AKS and EKS, then install the agent with the coral-agent Helm chart.",
    },
    hero: {
      title: "Install Coral with Terraform + Helm",
      deck: "Terraform creates the cloud permissions; Helm installs the agent.",
    },
    short:
      "Each module creates the same identity, role and permissions that `zoorikctl connect` creates, with the same names, so zoorikctl sees them as already done. Both modules are on the Terraform Registry under Apache-2.0.",
    sections: [
      {
        title: "AKS",
        blocks: [
          { kind: "h3", text: "Before you apply" },
          {
            kind: "ul",
            items: [
              "Turn on the cluster’s OIDC issuer and workload identity (`oidc_issuer_enabled` and `workload_identity_enabled`).",
              "Point the azurerm provider at the cluster’s subscription.",
              "Custom role names are unique across a tenant, so only one module call creates the role. Every other cluster passes that call’s `role_definition_id` output. If those clusters are in other subscriptions, list those subscriptions in the creating call’s `role_assignable_scopes`.",
            ],
          },
          { kind: "h3", text: "The module" },
          {
            kind: "code",
            text: 'module "zoorik_coral" {\n  source          = "getzoorik/zoorik-coral/azurerm"\n  version         = "~> 0.1"\n  cluster_id      = "<AKS resource id>"\n  location        = "<region>"\n  oidc_issuer_url = "<the cluster\'s OIDC issuer URL>"\n}',
          },
          {
            kind: "p",
            text: "It creates the user-assigned managed identity `zoorik-agent-<cluster>` with the federated credential `zoorik-agent`, the custom role `Zoorik Node Removal v2` and one assignment of that role, scoped to this cluster only. Its output `client_id` is the client id of the agent’s identity.",
          },
          { kind: "h3", text: "Then install the agent" },
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
              "For Pod Identity, apply this module before installing the chart: the agent gets AWS credentials only if the association exists when its pod starts. If the agent already runs, restart it once after the apply: `kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent`.",
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
            text: "It creates the IAM role `zoorik-agent-<cluster>`, its inline policy and the EKS Pod Identity association for `zoorik-agent/zoorik-agent`. With `irsa_oidc_issuer_url` set, the role trusts the cluster’s IAM OIDC provider instead, and no association is created. Its output `role_arn` is the ARN of the agent’s role.",
          },
          { kind: "h3", text: "Then install the agent" },
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
        title: "Machine deletion",
        blocks: [
          {
            kind: "p",
            text: "Machine deletion and pool-minimum lowering are on by default (`lower_minimums = true`), the same as zoorikctl’s default Yes. With `lower_minimums = false`, the agent cannot lower a pool’s or group’s minimum.",
          },
          {
            kind: "p",
            text: "The agent records the old minimum in the tags `coral.zoorik.com_original-min` and `coral.zoorik.com_lowered-min` (AKS) or `coral.zoorik.com/original-min` and `coral.zoorik.com/lowered-min` (EKS), and disconnect puts it back.",
          },
        ],
      },
      {
        title: "Your own node pool code",
        blocks: [
          {
            kind: "p",
            text: "If Terraform manages your node pools, ignore what the agent changes, or each apply undoes it. On AKS:",
          },
          {
            kind: "code",
            text: 'lifecycle {\n  ignore_changes = [\n    min_count,\n    tags["coral.zoorik.com_original-min"],\n    tags["coral.zoorik.com_lowered-min"],\n  ]\n}',
          },
          {
            kind: "p",
            text: "On the cluster’s default pool, the same fields sit under `default_node_pool[0]`. On EKS, each node the agent removes also lowers the group’s desired size. For `aws_eks_node_group`:",
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
      { text: "Open source", href: "/open-source" },
    ],
  },
  contributing: {
    route: "/docs/contributing",
    meta: {
      title: "Contributing to our open source",
      description:
        "How to contribute to Zoorik's open-source repositories: pick an issue, run a repository locally, open a pull request, and what to expect from review.",
    },
    hero: {
      title: "Contributing to Zoorik’s open source",
      deck: "How to pick an issue, run a repository locally, open a pull request, and what to expect from review.",
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
              "For a bug, use the bug report form: say what you did, what you expected and what happened, and include the version you ran.",
              "For a big change, open an issue first so we can agree on the approach before you spend time on it.",
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
            text: "Each repository’s README says how to run it and which checks CI runs. The three most people start with:",
          },
          { kind: "h3", text: "zoorikctl" },
          { kind: "p", text: "You need Go, the version in `go.mod`." },
          {
            kind: "cmd",
            text: "git clone https://github.com/getzoorik/zoorikctl.git\ncd zoorikctl\ngo build -o bin/zoorikctl ./cmd/zoorikctl\n./bin/zoorikctl version",
          },
          { kind: "p", text: "Before a pull request, run the checks CI runs:" },
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
            text: "`disks.py` needs an Azure subscription; a small Linux VM with one data disk is enough. The repository’s [contributing guide](https://github.com/getzoorik/assessment/blob/main/CONTRIBUTING.md) lists the checks CI runs.",
          },
          { kind: "h3", text: "kubernetes-scenarios" },
          {
            kind: "p",
            text: "A new scenario is a shape you met in a real cluster that is not in the library yet. Check it on kind:",
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
            text: "You do not need to sign off your commits or sign a contributor agreement. Our public repositories are licensed under Apache-2.0 (copyright Zoorik Private Limited), and what you send is licensed the same way, as section 5 of the license says.",
          },
        ],
      },
      {
        title: "Review",
        blocks: [
          {
            kind: "ul",
            items: [
              "In zoorikctl, the assessment and kubernetes-scenarios, CI runs the repository’s checks on every pull request, and they must pass.",
              "A maintainer reviews every pull request and merges it.",
              "In kubernetes-scenarios, people test against each scenario, so a scenario’s shape changes only when it is wrong; a different shape is usually a new scenario.",
            ],
          },
        ],
      },
      {
        title: "Security and conduct",
        blocks: [
          {
            kind: "p",
            text: "Found a security problem? Do not open an issue. Report it privately from the repository’s **Security** tab with **Report a vulnerability**, or write to founders@zoorik.com. We reply within 3 working days to confirm we have your report. The [security policy](https://github.com/getzoorik/.github/blob/main/SECURITY.md) has the details.",
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
      "What is open source at Zoorik: zoorikctl, the free assessment, the Terraform modules and the Kubernetes test scenarios, all Apache-2.0, and how to contribute.",
  },
  hero: {
    title: "Open source",
    deck: "zoorikctl, the assessment and the Terraform modules are open source, so you can read exactly what they do in your cluster and cloud account.",
  },
  /** Under the "Published on" strip, the trust sentence as the facts allow it: the licence names the public
   *  repositories, signing starts at v0.3.0, and PyPI's is a publish attestation. */
  trust:
    "Our public GitHub repositories are open source under Apache-2.0. Every zoorikctl release since v0.3.0 is [signed with Sigstore](https://github.com/getzoorik/zoorikctl#install), and each PyPI release carries a provenance attestation from its GitHub release workflow.",
  projects: {
    title: "Projects",
    /* The Helm chart has no licence and no GitHub link: its source is private and it declares none. */
    rows: [
      {
        name: "zoorikctl",
        line: "The CLI that connects a cluster to Zoorik and sets up its cloud permissions.",
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
        line: "The free savings assessment for Kubernetes and cloud disks.",
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
        ],
      },
      {
        name: "website",
        line: "The source of zoorik.com, this website.",
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
        line: "Install the Coral agent with Helm.",
        licence: null,
        links: [
          {
            label: "Artifact Hub",
            href: "https://artifacthub.io/packages/helm/zoorik/coral-agent",
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
        line: "Pick an issue, run a repository, open a pull request, and what review looks like.",
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
