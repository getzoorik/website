#!/usr/bin/env node
// Writes src/content/authors.ts from an author list in JSON:
//
//   node scripts/gen-authors.mjs <author-map.json>
//
// The JSON holds `authors`, an object of author records by key, each with `name`, `role` and `linkedin` (empty when
// there is no profile to link). Every author is written, so an article can name any of them by key. An author whose
// role starts with "Guest author" works outside Zoorik.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as prettier from "prettier";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/gen-authors.mjs <author-map.json>");
  process.exit(1);
}

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "authors.ts");
const { authors } = JSON.parse(readFileSync(source, "utf8"));

const entries = Object.entries(authors).map(([key, author]) => {
  for (const field of ["name", "role", "linkedin"]) {
    if (typeof author[field] !== "string") throw new Error(`author ${key}: no ${field}`);
  }
  const linkedin = author.linkedin.trim();
  if (linkedin && !/^https:\/\/www\.linkedin\.com\/in\/[^/\s]+\/$/.test(linkedin)) {
    throw new Error(`author ${key}: ${linkedin} is not a LinkedIn profile address`);
  }
  return [
    key,
    {
      name: author.name.trim(),
      role: author.role.trim(),
      linkedin,
      guest: author.role.trim().startsWith("Guest author"),
    },
  ];
});

const body = `/* Written by scripts/gen-authors.mjs from the author list; run it again to change an author. */

/**
 * The people a Learn article can be published under, by the key an article names (\`Article.author\`). The byline
 * reads "By <name>, <role>", the name a link to their LinkedIn profile when there is one; the structured data makes
 * them the article's author. A guest works outside Zoorik, so their structured data names no employer.
 */
export interface Author {
  readonly name: string;
  readonly role: string;
  /** Their LinkedIn profile, or "" when there is none to link. */
  readonly linkedin: "" | \`https://www.linkedin.com/in/\${string}/\`;
  readonly guest: boolean;
}

export const authors = {
${entries.map(([key, author]) => `  ${JSON.stringify(key)}: ${JSON.stringify(author)},`).join("\n")}
} as const satisfies Readonly<Record<string, Author>>;

export type AuthorKey = keyof typeof authors;
`;

const options = { ...(await prettier.resolveConfig(out)), filepath: out };
writeFileSync(out, await prettier.format(body, options));
console.log(`authors: ${entries.length} written to src/content/authors.ts`);
