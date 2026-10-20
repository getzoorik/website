import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as notFoundModule from "./not-found";

/** A sheet with its comments taken out, so a rule named in a note never matches. */
const sheet = (file: string): string =>
  readFileSync(join("src/styles", file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

describe("the 404 page", () => {
  it("says the page is missing and offers the two ways on", () => {
    render(<notFoundModule.default />);
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeTruthy();
    const links = screen
      .getAllByRole("link")
      .map((link) => [link.textContent, link.getAttribute("href")]);
    expect(links).toEqual([
      ["Go to the home page", "/"],
      ["Estimate your saving", "/assessment"],
    ]);
  });

  it("stands alone: no header, footer, menus, hero or turning mark", () => {
    /* Its tree is in every page's payload, so anything drawn here is drawn
       (hidden) on every page too. */
    const { container } = render(<notFoundModule.default />);
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(
      container.querySelector("header, footer, nav, .hero, .zk-art, .zk-glow, svg"),
    ).toBeNull();
  });

  it("imports nothing but the routes (and the Metadata type): no chrome, no next/link, no sheet", () => {
    /* A bare `import "…css";` has no `from`, and it is the import that made
       every page preload the 404's sheet, so the pattern reads both. */
    const source = readFileSync(join("src/app", "not-found.tsx"), "utf8");
    const imports = [...source.matchAll(/^import\s+(?:[^;]*?\s+from\s+)?"([^"]+)";/gm)].map(
      ([, from]) => from,
    );
    expect(imports).toEqual(["next", "@/config/site"]);
    /* "next" is a type-only import, erased at build: nothing of it reaches the payload */
    expect(source).toMatch(/^import type \{ Metadata \} from "next";$/m);
  });

  it('titles itself "Page not found" through the layout\'s template, never the home title', () => {
    /* Next prints this one <title>, with noindex, only when the 404 renders */
    expect(notFoundModule.metadata).toEqual({ title: "Page not found", robots: { index: false } });
    expect(notFoundModule).not.toHaveProperty("generateMetadata");
  });
});

describe("the 404 page's button", () => {
  it("is the site's one button, 48px from the site system", () => {
    /* The top-level rules whose selector list names `.btn-ink` itself. */
    const rules = [...sheet("site-system.css").matchAll(/(?<=^|\})([^{}@]*)\{([^}]*)\}/g)]
      .filter(([, selector]) => /(^|,)\s*\.btn-ink\s*(,|$)/.test(selector!.trim()))
      .map(([, , body]) => body);
    expect(rules.some((body) => /height:48px;padding:0 22px;/.test(body!))).toBe(true);
  });

  it("is never sized by the 404's own sheet", () => {
    expect(sheet("not-found.css")).not.toMatch(/btn/);
  });
});

describe("the 404 page's heading", () => {
  it("keeps its own measure: site-system's 20ch hero h1 never reaches it", () => {
    const rule = /(?:^|\})\s*\.nf h1\{([^}]*)\}/.exec(sheet("not-found.css"))?.[1];
    expect(rule).toMatch(/(^|;)max-width:none(;|$)/);
  });
});
