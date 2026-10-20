import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { heroPhoto } from "@/features/hero/hero-image";
import { HeroSection } from "@/features/hero/hero-section";

vi.mock("@/features/hero/hero-racks-graded.webp", () => ({
  default: { src: "/_next/static/media/hero-racks-graded.webp", width: 1200, height: 1200 },
}));
vi.mock("@/features/hero/hero-racks-graded-960.webp", () => ({
  default: { src: "/_next/static/media/hero-racks-graded-960.webp", width: 960, height: 960 },
}));

/** A lossy WebP's frame width, from its VP8 header. */
function webpWidth(path: string): number {
  const file = readFileSync(path);
  expect(file.toString("ascii", 12, 16), path).toBe("VP8 ");
  return file.readUInt16LE(26) & 0x3fff;
}

describe("the hero photo", () => {
  it("is the frame at 960 and 1200 px, each file as wide as it says", () => {
    expect(heroPhoto.srcSet).toBe(
      "/_next/static/media/hero-racks-graded-960.webp 960w, /_next/static/media/hero-racks-graded.webp 1200w",
    );
    expect(webpWidth("src/features/hero/hero-racks-graded-960.webp")).toBe(960);
    expect(webpWidth("src/features/hero/hero-racks-graded.webp")).toBe(1200);
  });

  it("declares the width hero.css draws it at, with the phone's box as tall as 840 px", () => {
    const css = readFileSync("src/styles/hero.css", "utf8").replace(/\s+/g, "");
    expect(css).toContain("width:min(70%,1160px)");
    expect(css).toContain("@media(max-width:1080px){.hero-photo{width:82%}");
    expect(css).toContain("@media(max-width:760px){.hero-photo{width:100%}");
    expect(heroPhoto.sizes).toBe(
      "(max-width: 760px) 840px, (max-width: 1080px) 82vw, (max-width: 1657px) 70vw, 1160px",
    );
  });

  it("stays the plain img, with its class, its fetch priority and the 1200 frame as src", () => {
    const { container } = render(<HeroSection />);
    const img = container.querySelector("header.hero > img")!;

    expect(img).toHaveClass("hero-photo");
    expect(img).toHaveAttribute("src", "/_next/static/media/hero-racks-graded.webp");
    expect(img).toHaveAttribute("srcset", heroPhoto.srcSet);
    expect(img).toHaveAttribute("sizes", heroPhoto.sizes);
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("describes the photo to search engines, and stays hidden from screen readers", () => {
    const { container } = render(<HeroSection />);
    const img = container.querySelector("header.hero > img")!;

    expect(img).toHaveAttribute("alt", "Server racks in a data centre, lit by blue status lights");
    expect(img).toHaveAttribute("aria-hidden", "true");
  });
});
