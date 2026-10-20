import { describe, expect, it } from "vitest";

import { footerSocialLinks, socialProfiles } from "@/content/footer";

/**
 * These links were `#` placeholders for the life of the port, under a note
 * saying not to guess a handle — a 404 or a squatted account linked from a
 * marketing footer is worse than no social row at all.
 *
 * The placeholders are gone, and nothing else would notice if one came back: a
 * `#` href renders, styles and passes every other check in this repo. It just
 * quietly goes nowhere.
 */
describe("the footer's social links", () => {
  it("point at real profiles, never a placeholder", () => {
    expect(footerSocialLinks.length).toBeGreaterThan(0);
    for (const link of socialProfiles) {
      expect(link.href, link.platform).toMatch(/^https:\/\//);
      expect(link.href, link.platform).not.toBe("#");
    }
  });

  it("names each account exactly once, so no tile links to another's profile", () => {
    const platforms = socialProfiles.map((l) => l.platform);
    expect(new Set(platforms).size).toBe(platforms.length);
    /* The row is drawn from the profiles, never a second copy of a URL. */
    for (const link of footerSocialLinks) expect(socialProfiles).toContain(link);

    /* The handle belongs to the platform whose tile carries it — a LinkedIn
       glyph over a youtube.com URL is the copy-paste this catches. */
    const host: Record<string, string> = {
      linkedin: "linkedin.com",
      youtube: "youtube.com",
      x: "x.com",
      reddit: "reddit.com",
      medium: "medium.com",
      github: "github.com",
    };
    for (const link of socialProfiles) {
      expect(link.href, link.platform).toContain(host[link.platform]!);
    }
  });

  it("gives every tile an accessible name — the glyph inside is aria-hidden", () => {
    for (const link of socialProfiles) {
      expect(link.label, link.platform).toMatch(/Zoorik on /);
    }
  });
});
