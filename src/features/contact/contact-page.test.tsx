import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => "/contact",
}));

import Contact, { metadata } from "@/app/contact/page";
import { marketplaces } from "@/config/marketplaces";
import { about } from "@/content/about";
import { contactPage } from "@/content/contact";
import { footerSocialLinks } from "@/content/footer";

/**
 * `/contact`: the metadata and card, the two ways to reach us and nothing else, the topics, the grievance officer
 * as /privacy names them, /about's company facts, the footer's social row and Zoorik's own store pages.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const page = () => render(<Contact />).container;

describe("/contact", () => {
  it("is titled, described and canonicalised as its draft, with its own card", () => {
    expect(metadata.title).toBe("Contact");
    expect(metadata.description).toBe(
      "Book a call with the people who build Coral and Amoeba, or email founders@zoorik.com. For demos, early access, partners, press, security and privacy.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/contact" });
    expect(metadata.openGraph).toMatchObject({
      url: "/contact",
      title: "Contact | Zoorik",
      images: [{ url: "/og/pages/contact.png" }],
    });
  });

  it("opens on the pair: the calendar on the white card, the one address on the navy one", () => {
    const root = page();
    expect(text(root.querySelector("main > header.hero h1"))).toBe("Contact Zoorik");
    const pair = root.querySelector("main > section.cp-pair .as-grid")!;
    const call = pair.querySelector(".as-card.cp-w")!;
    expect(text(call.querySelector("h2"))).toBe("Book a call");
    expect(call.querySelector("a.btn-ink")).toHaveAttribute("href", "https://cal.com/zoorik/talk");
    expect(call.querySelector("a.btn-ink")).toHaveAttribute("target", "_blank");
    const mail = pair.querySelector(".as-cal.cp-d")!;
    expect(text(mail.querySelector("h2"))).toBe("Email");
    expect(mail.querySelector("a.cta-go")).toHaveAttribute("href", "mailto:founders@zoorik.com");
    expect(text(mail.querySelector(".cta-fine"))).toBe(
      "Remove tokens, keys and other secrets from anything you send.",
    );
  });

  it("reaches us only by the calendar and the one address: no phone, no form, no chat", () => {
    const root = page();
    const main = root.querySelector("main")!;
    expect(main.querySelector("form, input, textarea, iframe")).toBeNull();
    expect(main.querySelector('a[href^="tel:"]')).toBeNull();
    const mail = [...main.querySelectorAll('a[href^="mailto:"]')].map((a) =>
      a.getAttribute("href")!,
    );
    expect(new Set(mail.map((href) => href.split("?")[0]))).toEqual(
      new Set(["mailto:founders@zoorik.com"]),
    );
    const offSite = [...main.querySelectorAll('a[href^="http"]')].map((a) =>
      a.getAttribute("href")!,
    );
    expect([...new Set(offSite)].sort()).toEqual(
      [
        "https://cal.com/zoorik/talk",
        ...footerSocialLinks.map((link) => link.href),
        ...marketplaces.map((store) => store.profile),
      ].sort(),
    );
  });

  it("lists the topics in three groups, the grievance officer as /privacy names them under the last", () => {
    const root = page();
    const groups = [...root.querySelectorAll("#topics .ct-col > .ct-g")];
    expect(groups.map((group) => text(group.querySelector(":scope > h3")))).toEqual([
      "Coral and Amoeba",
      "Programs, press and jobs",
      "Security and privacy",
    ]);
    expect(groups.map((group) => [...group.querySelectorAll(".doc-sum dt")].map(text))).toEqual([
      [
        "A demo",
        "Early access",
        "Your assessment report",
        "Help with Coral or Amoeba",
        "Buying through a marketplace",
      ],
      ["Design partners", "Partners", "Referrals", "Press, or writing about Zoorik", "Jobs"],
      ["Report a security issue", "Privacy requests"],
    ]);
    const last = groups[2]!;
    expect(text(last.querySelector("h4"))).toBe("Grievance officer and privacy contact (India)");
    expect([...last.querySelectorAll(".ab-facts dd")].map(text)).toEqual([
      "Sheldon, CXO",
      "founders@zoorik.com",
      "Zoorik Private Limited, Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Bangalore South, Bangalore 560103, Karnataka",
    ]);
    const privacy = readFileSync("src/content/privacy.ts", "utf8");
    expect(privacy).toContain('[b("Name and title:"), " Sheldon, CXO"]');
    expect(privacy).toContain(
      "Zoorik Private Limited, Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Bangalore South, Bangalore 560103, Karnataka",
    );
    expect(privacy).toContain(
      "We acknowledge a grievance within 2 working days and resolve it within 30 days.",
    );
  });

  it("prints /about's company facts, then the footer's social row and Zoorik's own page in each store", () => {
    const root = page();
    const facts = [...root.querySelectorAll("#company .ab-facts .ab-f")].map((f) => [
      text(f.querySelector("dt")),
      text(f.querySelector("dd")),
    ]);
    expect(facts).toEqual(
      about.company.facts
        .filter((fact) =>
          ["Legal name", "Incorporated", "CIN", "Registered office"].includes(fact.term),
        )
        .map((fact) => [fact.term, fact.value]),
    );
    const social = [...root.querySelectorAll("#follow .ab-social a.soc")];
    expect(social.map((a) => [a.getAttribute("href"), a.getAttribute("aria-label")])).toEqual(
      footerSocialLinks.map((link) => [link.href, `${link.label} (opens in a new tab)`]),
    );
    expect(
      [...root.querySelectorAll("#follow .mkt-b")].map((a) => [
        text(a.querySelector("span")),
        a.getAttribute("href"),
      ]),
    ).toEqual(marketplaces.map((store) => [store.name, store.profile]));
    expect(root.querySelector("#follow a.cp-all")).toHaveAttribute("href", "/marketplaces");
    expect(contactPage.follow.title).toBe("Follow us");
  });

  it("links Pricing and the Trust center, and ends with no closing row", () => {
    const root = page();
    expect(root.querySelector('#topics a[href="/pricing"]')).not.toBeNull();
    expect(root.querySelector('#topics a[href="/trust"]')).not.toBeNull();
    expect(root.querySelector("#assess")).toBeNull();
  });

  it("prints no price", () => {
    const all = text(page().querySelector("main"));
    expect(all).not.toMatch(/[$€£₹]\s?\d|\b(USD|EUR|INR)\b/);
    expect(all).not.toMatch(/'/);
  });
});
