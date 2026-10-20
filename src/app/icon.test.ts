import { readFileSync, statSync } from "node:fs";

import { describe, expect, it } from "vitest";

/**
 * The tab icon is a FILE CONVENTION, not a line of code: Next serves
 * `src/app/icon.svg` at `/icon.svg` and injects the `<link rel="icon">` itself.
 * Nothing imports these files, so nothing breaks if they are moved or deleted —
 * the site just quietly goes back to the browser's default globe, which is what
 * it was showing before this test existed. That is the failure this guards.
 */
describe("the tab icon", () => {
  const svg = readFileSync("src/app/icon.svg", "utf8");

  it("ships an SVG icon where the App Router looks for it", () => {
    expect(svg).toContain("<svg");
    /* Square, or browsers letterbox it into the tab: the brand kit's favicon
       (brand 2.0), authored on a 64 canvas. */
    expect(svg).toContain('viewBox="0 0 64 64"');
    expect(svg).toContain("<title>Zoorik</title>");
  });

  it("is a navy tile with the bone mark on it", () => {
    /* 🔴 THE GROUND IS PART OF THE ICON, not something to strip as decoration.
       A tab supplies no background of its own, so a mark shipped transparent
       reads as ink-on-whatever. The tile is the brand navy #050B3D and
       the mark on it is bone, which holds against a light tab strip and a dark
       one alike. */
    expect(svg).toContain('<rect width="64" height="64" rx="14" fill="#050B3D"/>');
    expect(svg).toContain("#FAF7F3");
    /* One ink for the mark, core included. */
    expect(svg).not.toContain("#3B5BF5");
  });

  it("draws the small 2.0 mark: one ring of ten squares round the core", () => {
    /* The small mark drops the inner ring, which at tab size would blur into
       the core. Counting tells it from the full mark and from the old mark. */
    const squares = [...svg.matchAll(/<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)"/g)].map(
      (m) => m[1],
    );
    expect(squares).toEqual(Array(10).fill("58.0"));
    expect(svg.match(/<circle /g)).toHaveLength(1);
  });

  it("ships an apple-touch-icon at the size iOS asks for", () => {
    const png = readFileSync("src/app/apple-icon.png");
    /* 180×180 is what iOS requests; Next reads the real dimensions off the file
       and writes them into the tag, so a wrong-sized file ships a wrong `sizes`.
       A PNG states its width and height in bytes 16–23 of its header. */
    expect(statSync("src/app/apple-icon.png").size).toBeGreaterThan(1000);
    expect(png.readUInt32BE(16)).toBe(180);
    expect(png.readUInt32BE(20)).toBe(180);
  });
});

describe("favicon.ico", () => {
  /* Browsers and crawlers still ask for /favicon.ico by name; without the file it
     is a 404 on every first visit. The brand kit's (brand 2.0): 16, 32 and 48
     PNG images in one ICO container. */
  const ico = readFileSync("src/app/favicon.ico");

  it("is an ICO holding the 16, 32 and 48 images, each a PNG", () => {
    expect(ico.readUInt16LE(2)).toBe(1);
    const count = ico.readUInt16LE(4);
    expect(count).toBe(3);
    const sizes = Array.from({ length: count }, (_, i) => ico.readUInt8(6 + 16 * i));
    expect(sizes).toEqual([16, 32, 48]);
    for (let i = 0; i < count; i++) {
      const offset = ico.readUInt32LE(6 + 16 * i + 12);
      expect(ico.subarray(offset, offset + 4).toString("latin1")).toBe("\u0089PNG");
    }
  });
});
