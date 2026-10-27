import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { documents, publishedDocuments, type DocumentId } from "@/content/documents";
import { documentFacts } from "@/features/documents/document-facts";

/**
 * The hosted files, read the way the build reads them. The facts are not
 * pinned here (a rebuilt PDF may change them, and that is the point of reading
 * them); what is pinned is that every published document is a readable A4 PDF
 * of at least one page, that its line is the size of the file on disk, and that
 * `public/docs/` and `public/_headers` serve exactly the published documents.
 */
const published = publishedDocuments.map((document) => document.id);

/** The `_headers` rules: a path line followed by indented header lines. */
function headerRules(): { path: string; lines: string[] }[] {
  const headers = readFileSync(join(process.cwd(), "public", "_headers"), "utf8");
  return headers
    .split(/\n(?=\S)/)
    .filter((block) => !block.startsWith("#"))
    .map((block) => {
      const [path = "", ...lines] = block.trim().split("\n");
      return { path: path.trim(), lines: lines.map((line) => line.trim()) };
    });
}

const matches = (pattern: string, path: string) =>
  new RegExp(`^${pattern.replace(/[.]/g, "\\.").replace(/\*/g, ".*")}$`).test(path);

describe("the published documents", () => {
  it.each(published)("%s is served from public/docs/ and reads as an A4 PDF", (id) => {
    const facts = documentFacts(id);
    const file = join(process.cwd(), "public", documents[id].pdf);
    expect(documents[id].pdf).toMatch(/^\/docs\/[a-z-]+\.pdf$/);
    expect(facts.bytes).toBe(statSync(file).size);
    expect(facts.pages).toBeGreaterThan(0);
    expect(facts.paper).toBe("A4");
    expect(facts.line).toMatch(/^PDF · \d+\u00a0pages? · (\d\.\d\u00a0MB|\d+\u00a0KB) · A4$/);
    expect(facts.short).toMatch(/^\d+\u00a0pages? · (\d\.\d\u00a0MB|\d+\u00a0KB)$/);
    expect(facts.spoken).toMatch(/^PDF, \d+ pages?, (\d\.\d MB|\d+ KB), A4$/);
  });

  it("are exactly the files under public/docs/: nothing held, nothing else", () => {
    const files = readdirSync(join(process.cwd(), "public", "docs")).sort();
    expect(files).toEqual(publishedDocuments.map((document) => document.pdf.slice(6)).sort());
  });

  it("leave a held document unread: it has no file to read", () => {
    const held = (Object.keys(documents) as DocumentId[]).filter((id) => !documents[id].released);
    for (const id of held) expect(() => documentFacts(id), id).toThrow(/is held/);
  });

  it("each names the page that is its web version in public/_headers, with one cache rule", () => {
    const rules = headerRules();
    for (const id of published) {
      const { pdf, canonical } = documents[id];
      const applied = rules.filter((rule) => matches(rule.path, pdf)).flatMap((rule) => rule.lines);
      expect(applied, pdf).toContain(`Link: <https://zoorik.com${canonical}>; rel="canonical"`);
      expect(applied, pdf).toContain("Cache-Control: public, max-age=2592000");
      expect(
        applied.filter((line) => line.startsWith("Cache-Control:")),
        pdf,
      ).toHaveLength(1);
    }
  });

  it("give public/_headers no rule for a PDF that is not published", () => {
    const named = headerRules()
      .map((rule) => rule.path)
      .filter((path) => path.endsWith(".pdf"));
    expect(named.sort()).toEqual(publishedDocuments.map((document) => document.pdf).sort());
  });

  it("send the guide's PDF to the guide, the FAQ's to the FAQ and each one-pager to its product", () => {
    expect(documents["coral-guide"].canonical).toBe("/coral/guide");
    expect(documents["coral-faq"].canonical).toBe("/coral/faq");
    expect(documents["coral-one-pager"].canonical).toBe("/coral");
    expect(documents["amoeba-guide"].canonical).toBe("/amoeba/guide");
    expect(documents["amoeba-one-pager"].canonical).toBe("/amoeba");
  });
});
