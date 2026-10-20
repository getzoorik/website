import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { contactEmail, routes, site } from "@/config/site";
import { securityGroups } from "@/content/security";

/**
 * `/.well-known/security.txt` (RFC 9116): a static file, so the
 * Worker serves it as text/plain from the assets. Its addresses are the site's own.
 */
const file = readFileSync("public/.well-known/security.txt", "utf8");
const field = (name: string): string | undefined =>
  new RegExp(`^${name}: (.+)$`, "m").exec(file)?.[1];

describe("security.txt", () => {
  it("names the contact, the policy and itself, with the site's own addresses", () => {
    expect(field("Contact")).toBe(`mailto:${contactEmail}`);
    expect(field("Policy")).toBe(`${site.url}${routes.security}#report`);
    expect(field("Canonical")).toBe(`${site.url}/.well-known/security.txt`);
  });

  it("points its policy at a section /security really has", () => {
    const ids = securityGroups.flatMap((group) => group.rows.map((row) => row.id));
    expect(ids).toContain("report");
  });

  it("expires within a year, as RFC 9116 asks", () => {
    const expires = Date.parse(field("Expires") ?? "");
    expect(Number.isNaN(expires)).toBe(false);
    expect(field("Expires")).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
    /* one year from when it was written; renew it before then */
    expect(field("Expires")).toBe("2027-10-12T00:00:00.000Z");
  });
});
