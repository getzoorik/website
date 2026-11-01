import { calendarUrl, routes } from "@/config/site";
import { agentChart, openSourceLinks } from "@/config/open-source";

/** The systems the zoorikctl card offers, keyed as the guides' OS switch keys them. */
export type InstallOsKey = "mac" | "linux" | "windows";

/**
 * /coral's "Install your way" (`#install`): zoorikctl, Helm and Terraform as three equal cards, each command in the
 * assessment's terminal (owner, 23 Oct 2026). The commands are the zoorikctl README's and the chart's; every string is
 * the mock's. A terminal's bar names what is in it: zoorikctl's holds the system switch instead. The Coral cloud pages
 * draw it too, their Terraform card with only their own cloud's module.
 */

export interface InstallOs {
  readonly os: InstallOsKey;
  readonly name: string;
  readonly prompt: "$ " | "PS> ";
  readonly lines: readonly string[];
  /** The line under the well, after "Or:"; none for Linux. */
  readonly alternative?: string;
}

export interface InstallLink {
  readonly label: string;
  readonly href: string;
}

/** A cluster's cloud, keyed as the Runs on chips key it: each has its own Terraform module. */
export type InstallCloud = "aks" | "eks";

/** Each cloud's Terraform module: /coral shows both, and a cloud page only its own (`/aks-cost-optimization`…). */
const terraformModules = {
  aks: ["# AKS", 'source = "getzoorik/zoorik-coral/azurerm"'],
  eks: ["# EKS", 'source = "getzoorik/zoorik-coral/aws"'],
} as const satisfies Record<InstallCloud, readonly string[]>;

export const coralInstall = {
  title: "Install your way",
  openSource: { label: "Open source", href: routes.openSource },
  zoorikctl: {
    name: "zoorikctl",
    tag: "Recommended",
    line: "Sets up the cloud permissions too.",
    /* macOS keeps `brew trust`: Homebrew refuses a formula from an untrusted tap. */
    systems: [
      {
        os: "mac",
        name: "macOS",
        prompt: "$ ",
        lines: ["brew tap getzoorik/tap", "brew trust getzoorik/tap", "brew install zoorikctl"],
        alternative: "curl -fsSL https://get.zoorik.com/macos | sh",
      },
      {
        os: "linux",
        name: "Linux",
        prompt: "$ ",
        lines: ["curl -fsSL https://get.zoorik.com/linux | sh"],
      },
      {
        os: "windows",
        name: "Windows",
        prompt: "PS> ",
        lines: [
          "scoop bucket add getzoorik https://github.com/getzoorik/scoop-bucket",
          "scoop install zoorikctl",
        ],
        alternative: "irm https://get.zoorik.com/windows.ps1 | iex",
      },
    ] satisfies readonly InstallOs[],
    links: [
      { label: "GitHub", href: openSourceLinks.zoorikctl },
      { label: "Releases", href: openSourceLinks.zoorikctlReleases },
      { label: "Signed releases", href: openSourceLinks.zoorikctlSigned },
    ] satisfies readonly InstallLink[],
  },
  helm: {
    name: "Helm",
    line: "For teams on Helm, Argo CD or Flux.",
    file: "Terminal",
    /* The whole install line: the chart on a line of its own, so nothing scrolls; a
       line longer than the card wraps with a hanging indent. Copy copies these five lines. */
    lines: [
      "helm install coral-agent \\",
      `  ${agentChart} \\`,
      "  --namespace default \\",
      "  --set controlPlaneUrl=<control plane origin> \\",
      "  --set connectToken.value=<connect token>",
    ],
    /* The console is not open yet (/login shows Coral "Coming soon"), so the token line says how to get an account. */
    earlyAccess: {
      name: "Coral",
      before: " is in early access — ",
      link: "book a demo",
      href: calendarUrl,
      after: " for a console account.",
    },
    links: [
      { label: "Artifact Hub · Verified Publisher", href: openSourceLinks.artifactHub },
      { label: "Helm guide", href: routes.docsInstallHelm },
    ] satisfies readonly InstallLink[],
  },
  terraform: {
    name: "Terraform",
    line: "Cloud permissions as code.",
    file: "main.tf",
    lines: [...terraformModules.aks, ...terraformModules.eks],
    modules: terraformModules,
    note: "Then install the agent with Helm.",
    links: [
      { label: "Terraform Registry", href: openSourceLinks.terraformRegistry },
      { label: "Terraform guide", href: routes.docsInstallTerraform },
    ] satisfies readonly InstallLink[],
  },
} as const;
