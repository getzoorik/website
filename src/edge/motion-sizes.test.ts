import { readdirSync, statSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { motionSizes } from "./motion-sizes";

describe("motionSizes", () => {
  it("names every film in public/motion, at its exact size, and nothing else", () => {
    const films = Object.fromEntries(
      readdirSync("public/motion")
        .filter((name) => name.endsWith(".mp4"))
        .map((name) => [`/motion/${name}`, statSync(`public/motion/${name}`).size]),
    );
    expect(motionSizes).toEqual(films);
  });
});
