// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { amoebaFaqSections } from "@/content/amoeba-faq";
import { coralFaqSections } from "@/content/coral-faq";
import { documents } from "@/content/documents";

import nextConfig from "../../next.config";

/**
 * The Technical FAQ is for Zoorik's own team. It is never on this site: not its
 * PDF, not a link to it, not its facts, and not its answers.
 *
 * 🔴 IT SHIPPED ONCE. The documents section carried it to production:
 * the PDF answered 200 under /resources, the hub listed it, and every FAQ
 * answer printed the technical one under "In detail". Nothing else in the
 * suite would notice it coming back, so this file reads the repo itself.
 *
 * The documents now live under /docs, and /resources redirects there file by
 * file. Neither address may serve it, and the move must not carry it along.
 */

const root = process.cwd();
const self = relative(root, __filename);

/** Every file under `dir`, as a path from the repo root. */
function files(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name);
    return statSync(join(root, path)).isDirectory() ? files(path) : [path];
  });
}

const banned = /technical[-_ ]?faq/i;

describe("the internal Technical FAQ", () => {
  it("has no file under public/", () => {
    expect(files("public").filter((path) => /technical/i.test(path))).toEqual([]);
  });

  it("is named nowhere in the source, the headers, the redirects or the content", () => {
    const named = [...files("src"), "public/_headers", "next.config.ts"]
      .filter((path) => path !== self && !/\.(png|webp|ico|svg|pdf|woff2?)$/.test(path))
      .filter((path) => banned.test(readFileSync(join(root, path), "utf8")));
    expect(named).toEqual([]);
  });

  it("is not a published document", () => {
    expect(Object.keys(documents).filter((id) => /technical/i.test(id))).toEqual([]);
  });

  it("is not among the files /docs serves, which are the registry's and nothing else", () => {
    const served = readdirSync(join(root, "public", "docs"));
    const registered = Object.values(documents).map((document) =>
      document.pdf.slice("/docs/".length),
    );
    expect(served.filter((name) => !registered.includes(name))).toEqual([]);
  });

  it.each(["/docs/coral-technical-faq.pdf", "/resources/coral-technical-faq.pdf"])(
    "is not redirected from or to %s: the address answers 404, not a redirect",
    async (path) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://zoorik.com${path}`,
        nextConfig,
      });
      /* 200 here means no rule matched: the request falls through to the
         files, where there is none, so the site answers 404. */
      expect(response.status).toBe(200);
      const rules = (await nextConfig.redirects?.()) ?? [];
      expect(rules.filter((rule) => banned.test(`${rule.source} ${rule.destination}`))).toEqual([]);
    },
  );

  it("gives no FAQ answer a second, technical layer", () => {
    const questions = [
      ...coralFaqSections.flatMap((section) => section.questions),
      ...amoebaFaqSections.flatMap((section) => section.questions),
    ];
    for (const question of questions) {
      expect(Object.keys(question).sort(), question.id).toEqual(["id", "question", "short"]);
    }
  });
});
