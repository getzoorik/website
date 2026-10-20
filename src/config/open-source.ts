/**
 * Where Zoorik's open source and install channels live. Every address here was checked and answered 200; the facts
 * behind them must stay true: the public repos are Apache-2.0, only zoorikctl's releases are cosign-signed, the
 * coral-agent chart declares no licence and its source is private, and Artifact Hub lists Zoorik as a Verified
 * Publisher.
 *
 * It also lists where zoorikctl and the assessment ship: zoorikctl from its Homebrew tap and its Scoop bucket, the
 * assessment as the `zoorik` package on PyPI (owned by the PyPI user `zoorik`). GitHub verifies that the getzoorik
 * organization controls zoorik.com.
 */

const GITHUB = "https://github.com/getzoorik";

export const openSourceLinks = {
  /** The coral-agent chart's page on Artifact Hub (Verified Publisher). */
  artifactHub: "https://artifacthub.io/packages/helm/zoorik/coral-agent",
  /** Zoorik's namespace on the Terraform Registry: both modules. */
  terraformRegistry: "https://registry.terraform.io/namespaces/getzoorik",
  terraformAks: "https://registry.terraform.io/modules/getzoorik/zoorik-coral/azurerm",
  terraformEks: "https://registry.terraform.io/modules/getzoorik/zoorik-coral/aws",
  /** The getzoorik organization (GitHub: Verified, for zoorik.com). */
  github: GITHUB,
  zoorikctl: `${GITHUB}/zoorikctl`,
  zoorikctlReleases: `${GITHUB}/zoorikctl/releases`,
  /** zoorikctl's Homebrew tap (`brew tap getzoorik/tap`) and its Scoop bucket. */
  homebrewTap: `${GITHUB}/homebrew-tap`,
  scoopBucket: `${GITHUB}/scoop-bucket`,
  /** The assessment as the `zoorik` package, and the PyPI user that publishes it. */
  pypiProject: "https://pypi.org/project/zoorik/",
  pypiUser: "https://pypi.org/user/zoorik/",
  terraformAksSource: `${GITHUB}/terraform-azurerm-zoorik-coral`,
  terraformEksSource: `${GITHUB}/terraform-aws-zoorik-coral`,
  /** zoorikctl's install section, which says how its releases are signed. */
  zoorikctlSigned: `${GITHUB}/zoorikctl#install`,
  kubernetesScenarios: `${GITHUB}/kubernetes-scenarios`,
  assessment: `${GITHUB}/assessment`,
  assessmentFirstIssues: `${GITHUB}/assessment/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
  goodFirstIssues:
    "https://github.com/search?q=org%3Agetzoorik+label%3A%22good+first+issue%22+state%3Aopen&type=issues",
  contributingGuide: `${GITHUB}/.github/blob/main/CONTRIBUTING.md`,
  codeOfConduct: `${GITHUB}/.github/blob/main/CODE_OF_CONDUCT.md`,
  securityPolicy: `${GITHUB}/.github/blob/main/SECURITY.md`,
  assessmentContributing: `${GITHUB}/assessment/blob/main/CONTRIBUTING.md`,
} as const;

/** The chart Helm installs the Coral agent from. */
export const agentChart = "oci://ghcr.io/getzoorik/charts/coral-agent";

export type ChannelId =
  "homebrew" | "scoop" | "pypi" | "artifact-hub" | "terraform-registry" | "github";

/** Where Zoorik is published, each as the mocks name and link it. */
export const channels: Readonly<
  Record<ChannelId, { readonly name: string; readonly href: string }>
> = {
  homebrew: { name: "Homebrew", href: openSourceLinks.homebrewTap },
  scoop: { name: "Scoop", href: openSourceLinks.scoopBucket },
  pypi: { name: "PyPI", href: openSourceLinks.pypiProject },
  "artifact-hub": { name: "Artifact Hub", href: openSourceLinks.artifactHub },
  "terraform-registry": { name: "Terraform Registry", href: openSourceLinks.terraformRegistry },
  github: { name: "GitHub", href: openSourceLinks.github },
};

/** One button: a channel, with a quieter qualifier after its name and its own address where the place differs. */
export interface ChannelItem {
  readonly id: ChannelId;
  readonly qualifier?: string;
  readonly href?: string;
}

/** The footer's "Install from" row, three over two at every width. */
export const installChannels: readonly ChannelItem[] = [
  { id: "homebrew" },
  { id: "scoop" },
  { id: "pypi" },
  { id: "artifact-hub" },
  { id: "terraform-registry" },
];

/** /about's "Published on" card: the footer's five, then GitHub. */
export const aboutChannels: readonly ChannelItem[] = [...installChannels, { id: "github" }];

/**
 * /open-source's "Published on" strip: GitHub first with GitHub's own "Verified",
 * PyPI at the user that publishes the package, Artifact Hub's Verified Publisher. The Terraform Registry has no
 * qualifier: neither module is registry-verified.
 */
export const publishedChannels: readonly ChannelItem[] = [
  { id: "github", qualifier: "Verified organization" },
  { id: "pypi", href: openSourceLinks.pypiUser },
  { id: "homebrew" },
  { id: "scoop" },
  { id: "artifact-hub", qualifier: "Verified Publisher" },
  { id: "terraform-registry" },
];
