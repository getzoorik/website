import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter", className: "font-inter" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex-mono", className: "font-plex-mono" }),
}));

const { metadata: layout } = await import("./layout");
const { metadata: home } = await import("./page");
const { metadata: assessment } = await import("./assessment/page");
const { metadata: login, viewport: loginViewport } = await import("./login/page");
const { metadata: amoeba } = await import("./amoeba/page");
const { metadata: coral } = await import("./coral/page");
const { metadata: docs } = await import("./docs/page");
const { metadata: coralGuide } = await import("./coral/guide/page");
const { metadata: coralFaq } = await import("./coral/faq/page");
const { metadata: amoebaFaq } = await import("./amoeba/faq/page");
const { metadata: privacy } = await import("./privacy/page");
const { metadata: terms } = await import("./terms/page");
const { metadata: security } = await import("./security/page");
const { metadata: learn } = await import("./learn/page");

describe("page metadata", () => {
  it("resolves every relative URL against the canonical origin", () => {
    expect(String(layout.metadataBase)).toBe("https://zoorik.com/");
  });

  it("titles every page through one template, and the home page takes the default", () => {
    expect(layout.title).toEqual({
      default: "Zoorik | Kubernetes and block storage cost optimization",
      template: "%s · Zoorik",
    });
    expect(home).not.toHaveProperty("title");
    expect(assessment.title).toBe("Free cloud cost assessment");
    expect(login.title).toBe("Sign in");
    expect(amoeba.title).toBe("Amoeba: Azure disk and Amazon EBS cost optimization");
    expect(coral.title).toBe("Coral: Kubernetes cost optimization for AKS and EKS");
  });

  it("keeps each full title within the 60 characters a search result shows", () => {
    /* "<title> · Zoorik", at most 60. */
    const { template } = layout.title as { template: string };
    const full = (title: unknown) => template.replace("%s", String(title));
    expect(full(amoeba.title)).toHaveLength(60);
    expect(full(coral.title)).toHaveLength(60);
    expect((layout.title as { default: string }).default).toHaveLength(55);
  });

  it("describes the home page and each product page in its own words, and the right product's", () => {
    expect(home.description).toBe(
      "Zoorik reduces cloud cost, autonomously, without any downtime. Coral rebalances Kubernetes on AKS and EKS. Amoeba rightsizes Azure disks and Amazon EBS.",
    );
    expect(amoeba.description).toBe(
      "Amoeba rightsizes Azure managed disks and Amazon EBS volumes to the data you store, to reduce your cloud bill, autonomously, without any downtime.",
    );
    expect(coral.description).toBe(
      "Coral rebalances AKS and EKS clusters to reduce your cloud bill, autonomously, without any downtime. Works with HPA, Karpenter, NAP and Cluster Autoscaler.",
    );
    /* Coral is never shown on Windows or Linux. */
    expect(String(coral.description)).not.toMatch(/Windows|Linux/);
  });

  it("puts a canonical on the indexed pages only, never in the layout", () => {
    expect(layout).not.toHaveProperty("alternates");
    /* the home page draws its canonical itself, with the slash (page.test.tsx) */
    expect(home).not.toHaveProperty("alternates");
    expect(assessment.alternates).toEqual({ canonical: "/assessment" });
    expect(amoeba.alternates).toEqual({ canonical: "/amoeba" });
    expect(coral.alternates).toEqual({ canonical: "/coral" });
    expect(amoeba).not.toHaveProperty("robots");
    expect(coral).not.toHaveProperty("robots");
    expect(login).not.toHaveProperty("alternates");
    expect(login.robots).toEqual({ index: false, follow: true });
  });

  it("lets every indexed page show a large image preview and an uncapped snippet (the layout's robots)", () => {
    expect(layout.robots).toEqual({
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    });
  });

  it("paints /login's browser chrome in the panel's ground, not the brand navy", () => {
    /* The sign-in mock sets #0B0D14, `--ground`; the layout's #070F52 serves every other page. */
    expect(loginViewport.themeColor).toBe("#0B0D14");
  });
});

describe("the documents section's metadata", () => {
  it("titles, describes and canonicalises /docs in the mock's words", () => {
    expect(docs.title).toBe("Product docs: guides, FAQs, one-pagers");
    expect(docs.description).toBe(
      "Product guides, FAQs and one-pagers for Coral (AKS and EKS cost optimization) and Amoeba (Azure managed disks and Amazon EBS), online or as PDFs.",
    );
    expect(docs.alternates).toEqual({ canonical: "/docs" });
    expect(docs).not.toHaveProperty("robots");
    expect(docs.openGraph).toMatchObject({
      url: "/docs",
      title: "Product docs: guides, FAQs, one-pagers · Zoorik",
    });
  });

  /* The mocks' heads: the title leads with the page, then what it is for, and the
     layout's template adds " · Zoorik". */
  it("titles, describes and canonicalises the Coral guide as its mock does", () => {
    expect(coralGuide.title).toBe("Coral product guide: AKS and EKS cost optimization");
    expect(coralGuide.description).toBe(
      "How to connect an AKS or EKS cluster to Coral, what it installs and changes, how it sizes pods and removes nodes, and how you stay in control.",
    );
    expect(coralGuide.alternates).toEqual({ canonical: "/coral/guide" });
    expect(coralGuide).not.toHaveProperty("robots");
    expect(coralGuide.openGraph).toMatchObject({
      url: "/coral/guide",
      title: "Coral product guide: AKS and EKS cost optimization · Zoorik",
    });
  });

  it("titles, describes and canonicalises the Coral FAQ as its mock does", () => {
    expect(coralFaq.title).toBe("Coral FAQ: AKS and EKS cost optimization");
    expect(coralFaq.description).toBe(
      "Answers on how Coral sizes CPU and memory requests, keeps workloads safe, works with HPA, KEDA, Karpenter, NAP and Cluster Autoscaler on AKS and EKS.",
    );
    expect(coralFaq.alternates).toEqual({ canonical: "/coral/faq" });
    expect(coralFaq).not.toHaveProperty("robots");
    expect(coralFaq.openGraph).toMatchObject({
      url: "/coral/faq",
      title: "Coral FAQ: AKS and EKS cost optimization · Zoorik",
    });
  });

  it("titles, describes and canonicalises the Amoeba FAQ as its mock does", () => {
    const description =
      "Answers on how Amoeba keeps data safe, what restarts and when, how pools expand and shrink, and how it runs on Azure managed disks and Amazon EBS.";
    expect(amoebaFaq.title).toBe("Amoeba FAQ: Azure managed disk and EBS cost");
    expect(amoebaFaq.description).toBe(description);
    expect(amoebaFaq.alternates).toEqual({ canonical: "/amoeba/faq" });
    expect(amoebaFaq.openGraph).toMatchObject({
      url: "/amoeba/faq",
      title: "Amoeba FAQ: Azure managed disk and EBS cost · Zoorik",
      description,
    });
  });
});

describe("the numbered-row pages' metadata", () => {
  it("titles, describes and canonicalises /terms as its mock does, and indexes it", () => {
    expect(terms.title).toBe("Terms of use");
    expect(terms.description).toBe(
      "The agreement between Zoorik and the organisations that use zoorik.com, Coral and Amoeba: accounts, data, fees, liability and Indian law.",
    );
    expect(terms.alternates).toEqual({ canonical: "/terms" });
    expect(terms).not.toHaveProperty("robots");
    expect(terms.openGraph).toMatchObject({ url: "/terms", title: "Terms of use · Zoorik" });
  });

  it("titles, describes and canonicalises /security as its mock does, and indexes it", () => {
    expect(security.title).toBe("Security and data handling");
    expect(security.description).toBe(
      "What Coral and Amoeba may change in your cloud, what leaves your cluster or VM, where data is kept, our sub-processors, and how to report an issue.",
    );
    expect(security.alternates).toEqual({ canonical: "/security" });
    expect(security).not.toHaveProperty("robots");
    expect(security.openGraph).toMatchObject({
      url: "/security",
      title: "Security and data handling · Zoorik",
    });
  });

  it("titles, describes and canonicalises /learn as its mock does, and indexes it", () => {
    /* The hub, titled "Zoorik Learn" as is, never followed by " · Zoorik". */
    expect(learn.title).toEqual({ absolute: "Zoorik Learn: cloud cost optimization guides" });
    expect(learn.description).toBe(
      "Guides and comparisons for Kubernetes, block storage and the whole cloud bill on Azure and AWS, from where the money goes to the right fix.",
    );
    expect(learn.alternates).toEqual({ canonical: "/learn" });
    expect(learn).not.toHaveProperty("robots");
    expect(learn.openGraph).toMatchObject({
      url: "/learn",
      title: "Zoorik Learn: cloud cost optimization guides",
    });
  });
});

describe("the privacy policy's metadata", () => {
  it("titles, describes and canonicalises /privacy, and indexes it", () => {
    expect(privacy.title).toBe("Privacy policy");
    expect(privacy.description).toBe(
      "How Zoorik collects, uses and protects personal data across zoorik.com, Coral and Amoeba.",
    );
    expect(privacy.alternates).toEqual({ canonical: "/privacy" });
    expect(privacy).not.toHaveProperty("robots");
    expect(privacy.openGraph).toMatchObject({
      url: "/privacy",
      title: "Privacy policy · Zoorik",
      description:
        "How Zoorik collects, uses and protects personal data across zoorik.com, Coral and Amoeba.",
    });
  });
});
