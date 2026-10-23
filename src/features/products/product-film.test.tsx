import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { filmCaption, homeFilms } from "@/content/home-films";
import { productOrder } from "@/content/products";
import { ProductFilm } from "@/features/products/product-film";

/**
 * The home page's product films: the markup the shared observer and the sheet
 * expect, and the files the markup names.
 */
const publicDir = join(process.cwd(), "public");

/** The `_headers` rules: a path line followed by indented header lines. */
function headerRules(): { path: string; lines: string[] }[] {
  return readFileSync(join(publicDir, "_headers"), "utf8")
    .split(/\n(?=\S)/)
    .filter((block) => !block.startsWith("#"))
    .map((block) => {
      const [path = "", ...lines] = block.trim().split("\n");
      return { path: path.trim(), lines: lines.map((line) => line.trim()) };
    });
}

const matches = (pattern: string, path: string) =>
  new RegExp(`^${pattern.replace(/[.]/g, "\\.").replace(/\*/g, ".*")}$`).test(path);

describe("ProductFilm", () => {
  it.each(productOrder)("draws %s's film as the mock's figure: screen, video, caption", (id) => {
    const { container } = render(<ProductFilm product={id} />);
    const film = container.firstElementChild as HTMLElement;

    expect(film.tagName).toBe("FIGURE");
    expect(film.className).toBe("mo-film mo-r");
    expect(film.style.getPropertyValue("--d")).toBe("120ms");
    expect([...film.children].map((el) => el.className)).toEqual(["mo-screen", "mo-cap"]);
    const video = film.querySelector(".mo-screen > video.mo-vid")!;
    expect(video).toHaveAttribute("src", homeFilms[id].src);
    expect(video).toHaveAttribute("poster", homeFilms[id].poster);
    expect(video).toHaveAttribute("aria-label", homeFilms[id].label);
    expect(film.querySelector("figcaption")!.textContent).toBe(filmCaption);
  });

  it("sends the server's markup silent and inline, so the observer may start it", () => {
    /* A browser lets a script start a film without a gesture only when it is
       muted; iOS keeps it in the page only with playsinline. Checked on the
       server's markup, which is what the browser parses before any script. */
    const html = renderToStaticMarkup(<ProductFilm product="coral" />);
    expect(html).toMatch(/<video [^>]*\bmuted=""/);
    expect(html).toMatch(/<video [^>]*\bplaysInline=""/i);
    expect(html).toMatch(/<video [^>]*\bpreload="none"/);
    expect(html).not.toMatch(/\b(autoplay|controls|loop)\b/i);
  });

  it("names each film's figures as examples, first", () => {
    for (const id of productOrder) {
      expect(homeFilms[id].label).toMatch(/^(Coral|Amoeba) product preview with example figures: /);
    }
    expect(filmCaption).toBe("Product preview with example figures.");
  });
});

describe("the films' files", () => {
  it("are in public/motion, every one the markup names and nothing else", () => {
    const named = productOrder.flatMap((id) => [homeFilms[id].src, homeFilms[id].poster]);
    for (const path of named) expect(statSync(join(publicDir, path)).size, path).toBeGreaterThan(0);
    expect(readdirSync(join(publicDir, "motion")).sort()).toEqual(
      named.map((path) => path.slice("/motion/".length)).sort(),
    );
  });

  it("are cached for a month, under exactly one Cache-Control rule", () => {
    const rules = headerRules();
    for (const id of productOrder) {
      for (const path of [homeFilms[id].src, homeFilms[id].poster]) {
        const applied = rules.filter((rule) => matches(rule.path, path)).flatMap((r) => r.lines);
        expect(
          applied.filter((line) => line.startsWith("Cache-Control:")),
          path,
        ).toEqual(["Cache-Control: public, max-age=2592000"]);
      }
    }
  });
});

describe("the film's screen", () => {
  it("is a panel with the blocks' corner, 4px at every width: no curve (23 Oct 2026)", () => {
    const sheet = readFileSync(join(process.cwd(), "src/styles/home-films.css"), "utf8");
    expect(sheet).toMatch(/\.mo-screen\{[^}]*border-radius:var\(--r-card\);/);
    expect(sheet).not.toMatch(/\.mo-screen\{[^}]*border-radius:\d/);
  });
});
