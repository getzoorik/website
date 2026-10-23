import { describe, expect, it } from "vitest";

import {
  heroFilm,
  heroFilmGrounds,
  heroFilmLargest,
  heroFilmOrigin,
  heroFilmPoster,
  type HeroFilmFormat,
  type HeroFilmId,
  type HeroFilmSize,
} from "@/features/hero-film/hero-films";

/** The heroes' films as hosted: the R2 bucket's folder on media.zoorik.com, the mocks' names. */
const FOLDER = "https://media.zoorik.com/hero-films/";

const FILMS: readonly HeroFilmId[] = ["gargantua", "datagrid"];
const SIZES: readonly HeroFilmSize[] = [1080, 1440, 2160];
const FORMATS: readonly HeroFilmFormat[] = ["av1", "hevc", "h264"];

/** What the bucket holds under /hero-films/ for one film, as the mocks name its files. */
const inBucket = (id: HeroFilmId) =>
  [
    `hero-${id}-2160-av1.mp4`,
    `hero-${id}-2160-hevc.mp4`,
    `hero-${id}-1440-av1.mp4`,
    `hero-${id}-1440-hevc.mp4`,
    `hero-${id}-1440.mp4`,
    `hero-${id}-1080-av1.mp4`,
    `hero-${id}-1080-hevc.mp4`,
    `hero-${id}-1080.mp4`,
    `hero-${id}-poster-2160.jpg`,
    `hero-${id}-poster-1440.jpg`,
    `hero-${id}-poster-1080.jpg`,
  ].map((name) => FOLDER + name);

/** Every file the code names for one film: each format at each size it is made in, and each poster. */
const named = (id: HeroFilmId) => [
  ...FORMATS.flatMap((format) =>
    SIZES.filter((size) => size <= heroFilmLargest[format]).map((size) =>
      heroFilm(id, size, format),
    ),
  ),
  ...SIZES.map((size) => heroFilmPoster(id, size)),
];

describe("the heroes' films", () => {
  it("are served from media.zoorik.com", () => {
    expect(heroFilmOrigin).toBe("https://media.zoorik.com");
  });

  it("are named for their film, size and format, as the mocks name them, in the bucket's folder", () => {
    expect(heroFilm("gargantua", 2160, "av1")).toBe(`${FOLDER}hero-gargantua-2160-av1.mp4`);
    expect(heroFilm("datagrid", 1440, "hevc")).toBe(`${FOLDER}hero-datagrid-1440-hevc.mp4`);
    expect(heroFilm("datagrid", 1080, "h264")).toBe(`${FOLDER}hero-datagrid-1080.mp4`);
    expect(heroFilmPoster("gargantua", 1440)).toBe(`${FOLDER}hero-gargantua-poster-1440.jpg`);
  });

  it("are the full set, per film: AV1 and HEVC at every size, H.264 at 1440 and 1080, and three posters", () => {
    expect(heroFilmLargest).toEqual({ av1: 2160, hevc: 2160, h264: 1440 });
    for (const id of FILMS) {
      expect(named(id).sort(), id).toEqual(inBucket(id).sort());
    }
  });

  it("stand on their own skies: the black hole #080014, the data grid #000817", () => {
    expect(heroFilmGrounds).toEqual({ gargantua: "#080014", datagrid: "#000817" });
  });
});
