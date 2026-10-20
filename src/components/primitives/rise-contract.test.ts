import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * `.rise` ALONE IS STYLED TO DO NOTHING. The sheet animates `.rise.set`, and the
 * base rule deliberately carries no offset so a page with scripting off is
 * correct in its first painted frame.
 *
 * The consequence is easy to miss and was live on this site: an element written
 * as `className="sec-head rise"` with nothing to add `.set` never reveals, and
 * looks completely normal in review — the class is there, the keyframe is there,
 * the sheet is there. Only the half that animates is missing.
 *
 * The mock gets away with a bare class because it runs ONE document-wide
 * observer over `document.querySelectorAll(".rise")`. This port reveals per
 * component instead, so here the class alone is inert and every author of it
 * must also own the `set`.
 */
function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = join(dir, e.name);
    if (e.isDirectory()) return tsxFiles(full);
    return /\.tsx$/.test(e.name) && !e.name.includes(".test.") ? [full] : [];
  });
}

describe("the rise contract", () => {
  const files = [...tsxFiles("src/features"), ...tsxFiles("src/components")];

  it("finds the components (guards against a vacuous scan)", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("no element carries `rise` without owning its `set`", () => {
    const offenders: string[] = [];

    for (const file of files) {
      // `Reveal` is the mechanism; it is allowed to author the pair itself.
      if (file.endsWith("reveal.tsx")) continue;

      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (!/className/.test(line)) return;
          if (!/\brise\b/.test(line)) return;
          /* The `set` may be on the same line (a ternary over two literals, or a
             `cn()` call). If it is nowhere on the line, nothing animates. */
          if (/\bset\b/.test(line)) return;
          offenders.push(`${file}:${i + 1}  ${line.trim()}`);
        });
    }

    expect(offenders).toEqual([]);
  });
});
