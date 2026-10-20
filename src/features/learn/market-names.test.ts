import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { cleanup, render } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";

import { learnPath } from "@/config/site";
import { learnArticles } from "@/content/learn/published";
import { marketGroups, versusFacts } from "@/content/learn-market";

/* The nav and the footer read the pathname: each page is rendered at its own. */
const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

/**
 * Competitors are named in one place: the market data (`src/content/learn-market.ts`), plus the
 * versus pages' titles in `src/content/learn-compare.ts`, and the pages that print them, the comparison pages under
 * /compare, read them from there. Every other file in src/ (pages, components, code identifiers, file and folder
 * names, CSS, comments, other tests) stays name-free, and so does every page outside /compare. This reads every
 * competitor's name from the data and looks for it everywhere else.
 *
 * A competitor is a tool of the market that is neither open source nor the clouds' own: so not the "Cloud providers’
 * own tools" group, and not a tool filed under "Open source", "Azure" or "AWS" (Karpenter, KEDA, Azure Advisor and the
 * rest, which the site's articles discuss). Each is looked for by its name (before any bracket), both halves of a
 * "<product> by <owner>" name, and its owner's name: as written, and as code and addresses write it, in any case,
 * run together, hyphenated or in camelCase ("Some Tool" is also "some-tool", "sometool", "someTool" and
 * "someToolRows"). A one-word name is looked for in lower case only inside such a compound (or in a path), since some
 * of them are plain English words too, and a comment may use the word.
 */

const ALLOWED = [
  "src/content/learn-market.ts",
  "src/content/learn-compare.ts",
  /* The tests of the features that draw the comparison pages, which read the names from the data: Learn's (the market
     rows, the versus and alternatives pages, this file among them) and the /compare hub's. */
  /^src\/features\/learn\/.+\.test\.tsx?$/,
  /^src\/features\/compare\/.+\.test\.tsx?$/,
];

/* An owner of three letters or fewer is looked for only through its products' names, with and without it: on its own
   it is too short to tell apart (one such owner also names the site's type face and its own events, `events.ts`). */
const alone = (name: string) => name.length > 3;

const NOT_COMPETITORS = new Set(["Open source", "Azure", "AWS"]);

const competitors = marketGroups
  .filter((group) => group.id !== "native")
  .flatMap((group) => group.tools)
  .filter((tool) => !NOT_COMPETITORS.has(tool.subgroup));

const names = [
  ...new Set(
    competitors.flatMap((tool) => {
      const head = tool.name.split(" (")[0]!;
      const owner = tool.company
        .split(/ \(|;|,/)[0]!
        .replace(/ Inc\.?$/, "")
        .trim();
      return [...head.split(" by "), owner].flatMap((name) => {
        const [first, ...rest] = name.trim().split(" ");
        return !alone(first!) && first === owner && rest.length > 0
          ? [name.trim(), rest.join(" ")]
          : [name.trim()];
      });
    }),
  ),
].filter((name) => name && alone(name));

const literal = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const found = (name: string) => new RegExp(`(?<![A-Za-z0-9])${literal(name)}(?![A-Za-z0-9])`);

/** A name's or a word's parts: split at anything but a letter or digit and at each camelCase hump, in lower case. */
const parts = (text: string) =>
  text
    .split(/[^A-Za-z0-9]+|(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());

/** One name, compiled once: its exact-case pattern, its parts and its parts run together. */
interface Matcher {
  readonly name: string;
  readonly exact: RegExp;
  readonly own: readonly string[];
  readonly together: string;
}

const matcher = (name: string): Matcher => {
  const own = parts(name);
  return { name, exact: found(name), own, together: own.join("") };
};

/** A text's words (cut at anything but a letter, a digit, "-" or "_", so prose never joins), each as its parts. */
const words = (text: string) =>
  text
    .split(/[^A-Za-z0-9_-]+/)
    .filter(Boolean)
    .map(parts);

/**
 * Whether a line of code or a path spells the name as code does. A word matches when one of its parts is the name run
 * together ("sometool", "sometoolRows"), or when its parts hold the name's parts in a row ("someToolRows",
 * "coral-vs-some-tool"). A one-word name matches a word of one part only in a path (`inPath`).
 */
function spelledIn(its: readonly (readonly string[])[], m: Matcher, inPath = false): boolean {
  return its.some((word) => {
    if (m.own.length === 1 && word.length === 1 && !inPath) return false;
    return word.some(
      (part, i) => part === m.together || m.own.every((piece, k) => word[i + k] === piece),
    );
  });
}

const spelled = (text: string, name: string, inPath = false) =>
  spelledIn(words(text), matcher(name), inPath);

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? [full, ...files(full)] : [full];
  });
}

const allowed = (path: string) =>
  ALLOWED.some((rule) => (typeof rule === "string" ? rule === path : rule.test(path)));

describe("competitors' names", () => {
  it("are read from the market data", () => {
    expect(competitors.length).toBeGreaterThan(40);
    expect(names.length).toBeGreaterThan(40);
    /* The two the live versus pages print among them. */
    expect(names).toEqual(expect.arrayContaining(versusFacts.map((facts) => facts.name)));
  });

  it("appear in no file in src/ but the market data, the versus pages' titles and the comparison pages' tests", () => {
    const paths = files("src");
    expect(paths.length).toBeGreaterThan(200);
    const matchers = names.map(matcher);
    const offenders = paths
      .filter((path) => /\.(ts|tsx|css|svg|json|md)$/.test(path) && !allowed(path))
      .flatMap((path) => {
        const text = readFileSync(path, "utf8");
        const lower = text.toLowerCase();
        /* Every match holds the name's first part somewhere, in some case: skip the names a file cannot hold. */
        const candidates = matchers.filter((m) => lower.includes(m.own[0]!));
        if (candidates.length === 0) return [];
        return text.split("\n").flatMap((line, i) => {
          const its = words(line);
          return candidates
            .filter((m) => m.exact.test(line) || spelledIn(its, m))
            .map((m) => `${path}:${i + 1}  ${m.name}`);
        });
      });
    expect(offenders).toEqual([]);
  });

  it("name no file or folder in src/", () => {
    const offenders = files("src").filter((path) =>
      names.some((name) => spelled(path, name, true)),
    );
    expect(offenders).toEqual([]);
  });

  it("are found however code would spell them, and a one-word name in lower case only in a compound or a path", () => {
    const [name] = versusFacts.map((facts) => facts.name).filter((n) => parts(n).length > 1);
    const run = parts(name!);
    const camel = run.map((part, i) => (i === 0 ? part : part[0]!.toUpperCase() + part.slice(1)));
    for (const spelling of [
      `/compare/coral-vs-${run.join("-")}`,
      `src/app/compare/coral-vs-${run.join("-")}/page.tsx`,
      `const ${camel.join("")}Rows = [];`,
      `const ${run.join("")}Rows = [];`,
      `${run.join("_").toUpperCase()}_URL`,
    ]) {
      expect(spelled(spelling, name!), spelling).toBe(true);
    }
    expect(spelled(`the ${run.join(" ")} of it`, name!)).toBe(false);

    const word = names.find((n) => parts(n).length === 1)!.toLowerCase();
    expect(spelled(`a ${word} in a comment`, word)).toBe(false);
    expect(spelled(`const ${word}Rows = [];`, word)).toBe(true);
    expect(spelled(`src/features/${word}.tsx`, word, true)).toBe(true);
  });

  /** What a rendered page prints, each text node apart (one element's text never runs into the next one's), and the
   *  words its attributes say for the ear or on hover. */
  const printed = (root: Element): string => {
    const out: string[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode())
      out.push(node.textContent ?? "");
    for (const el of root.querySelectorAll("[aria-label],[alt],[title]"))
      for (const attr of ["aria-label", "alt", "title"]) out.push(el.getAttribute(attr) ?? "");
    return out.join("\n");
  };

  /* It renders every page of the site, so it has the time `structured-data.test.ts` allows its own pass over them. */
  it("are printed by the pages under /compare only: every other page renders none", async () => {
    /* Every page of the site, by its file; the comparison pages (/compare, its versus pages and its alternatives pages)
       are the ones allowed to name competitors. */
    const pages = files("src/app").filter((path) => path.endsWith("/page.tsx"));
    expect(pages.length).toBeGreaterThan(30);
    const others = pages.filter((path) => !path.startsWith("src/app/compare/"));
    expect(pages.length - others.length).toBe(4);
    expect(others).toContain("src/app/learn/page.tsx");
    const load = async (path: string) =>
      ((await import(/* @vite-ignore */ join(process.cwd(), path))) as { default: ComponentType })
        .default;
    const matchers = names.map((name) => [name, found(name)] as const);
    const offenders: string[] = [];
    /* Each page, at its address; the one dynamic route outside /compare, /learn/[slug], once per article. */
    const article = "src/app/learn/[slug]/page.tsx";
    expect(others).toContain(article);
    const drawn: [string, () => Promise<React.ReactElement>][] = [
      ...others
        .filter((path) => path !== article)
        .map(
          (path) =>
            [
              path.slice("src/app".length).replace(/\/?page\.tsx$/, "") || "/",
              async () => createElement(await load(path)),
            ] as [string, () => Promise<React.ReactElement>],
        ),
      ...learnArticles.map(
        (entry) =>
          [
            learnPath(entry.slug),
            async () => {
              const page = (await import("@/app/learn/[slug]/page")).default;
              return page({ params: Promise.resolve({ slug: entry.slug }) });
            },
          ] as [string, () => Promise<React.ReactElement>],
      ),
    ];
    for (const [route, draw] of drawn) {
      pathname.current = route;
      const shown = printed(render(await draw()).container);
      for (const [name, pattern] of matchers)
        if (pattern.test(shown)) offenders.push(`${pathname.current}  ${name}`);
      cleanup();
    }
    expect(offenders).toEqual([]);
    /* And the hub names them: the check would see a name on a page. */
    pathname.current = "/compare";
    const hub = printed(render(createElement(await load("src/app/compare/page.tsx"))).container);
    expect(versusFacts.every((facts) => found(facts.name).test(hub))).toBe(true);
    cleanup();
  }, 20_000);

  it("look for a short owner through its products, with and without it", () => {
    const owned = competitors
      .map((tool) => tool.name.split(" "))
      .filter(([first, ...rest]) => !alone(first!) && rest.length > 0);
    expect(owned.length).toBeGreaterThan(0);
    for (const [first, ...rest] of owned) {
      expect(names).not.toContain(first);
      expect(names).toEqual(expect.arrayContaining([[first, ...rest].join(" "), rest.join(" ")]));
    }
    /* It renders every page of the site: past vitest's 5s once the suite runs in parallel. */
  }, 20_000);
});
