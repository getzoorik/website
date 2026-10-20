#!/usr/bin/env node
// Writes src/content/learn/articles.generated.ts: one import per file in src/content/learn/articles/, A–Z by file
// name. An article is published when its file is there, so adding or removing a file is all it takes; the output is
// not committed. Runs before dev, typecheck, test and build (the "pre" scripts in package.json).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const learn = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "learn");
const out = join(learn, "articles.generated.ts");

const slugs = readdirSync(join(learn, "articles"))
  .filter((name) => name.endsWith(".ts"))
  .map((name) => name.slice(0, -".ts".length))
  .sort();

for (const slug of slugs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `articles/${slug}.ts: a file name is the article's slug, in lower case and hyphens`,
    );
  }
}

/* Written in Prettier's own shape, so the file reads like the rest of src/ and any formatter leaves it alone. */
const body = `/* Written by scripts/gen-learn-index.mjs from the files in ./articles. Do not edit: it is rewritten on every run. */

import type { Article } from "./article";
${slugs.map((slug, i) => `import { article as a${i} } from "./articles/${slug}";`).join("\n")}

/** Every article file, A–Z by its name, with the article it holds. */
export const articleFiles: readonly { readonly file: string; readonly article: Article }[] = [
${slugs.map((slug, i) => `  { file: "${slug}", article: a${i} },`).join("\n")}
];
`;

let current = "";
try {
  current = readFileSync(out, "utf8");
} catch {}
if (current !== body) writeFileSync(out, body);
console.log(`learn index: ${slugs.length} articles`);
