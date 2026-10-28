#!/usr/bin/env node
// Writes src/content/learn/articles.generated.ts: one import per file in src/content/learn/articles/, A–Z by file
// name; and src/content/learn/glossary.generated.ts the same way from src/content/learn/glossary/. An article or a
// term is published when its file is there, so adding or removing a file is all it takes; the output is not committed.
// Runs before dev, typecheck, test and build (the "pre" scripts in package.json).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const learn = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "learn");

/** The slugs of a folder's files, A–Z; a name that is not a slug fails the run. */
function slugsIn(folder, what) {
  const slugs = readdirSync(join(learn, folder))
    .filter((name) => name.endsWith(".ts"))
    .map((name) => name.slice(0, -".ts".length))
    .sort();
  for (const slug of slugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(
        `${folder}/${slug}.ts: a file name is the ${what}'s slug, in lower case and hyphens`,
      );
    }
  }
  return slugs;
}

/** Writes a file only when it changes, so a watcher sees no change on a run that adds nothing. */
function write(out, body) {
  let current = "";
  try {
    current = readFileSync(out, "utf8");
  } catch {}
  if (current !== body) writeFileSync(out, body);
}

const slugs = slugsIn("articles", "article");

/* Written in Prettier's own shape, so the file reads like the rest of src/ and any formatter leaves it alone. */
write(
  join(learn, "articles.generated.ts"),
  `/* Written by scripts/gen-learn-index.mjs from the files in ./articles. Do not edit: it is rewritten on every run. */

import type { Article } from "./article";
${slugs.map((slug, i) => `import { article as a${i} } from "./articles/${slug}";`).join("\n")}

/** Every article file, A–Z by its name, with the article it holds. */
export const articleFiles: readonly { readonly file: string; readonly article: Article }[] = [
${slugs.map((slug, i) => `  { file: "${slug}", article: a${i} },`).join("\n")}
];
`,
);

const terms = slugsIn("glossary", "term");

write(
  join(learn, "glossary.generated.ts"),
  `/* Written by scripts/gen-learn-index.mjs from the files in ./glossary. Do not edit: it is rewritten on every run. */

import type { GlossaryTerm } from "./glossary-term";
${terms.map((slug, i) => `import { term as t${i} } from "./glossary/${slug}";`).join("\n")}

/** Every glossary file, A–Z by its name, with the term it holds. */
export const glossaryFiles: readonly { readonly file: string; readonly term: GlossaryTerm }[] = [
${terms.map((slug, i) => `  { file: "${slug}", term: t${i} },`).join("\n")}
];
`,
);
console.log(`learn index: ${slugs.length} articles, ${terms.length} glossary terms`);
