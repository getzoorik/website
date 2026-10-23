import { describe, expect, it } from "vitest";

import type { HeroFilmFormat, HeroFilmId } from "@/features/hero-film/hero-films";
import {
  heroFilmCodecs,
  heroFilmFormat,
  heroFilmScript,
  heroFilmSize,
  pickHeroFilm,
} from "@/features/hero-film/pick-hero-film";

const FOLDER = "https://media.zoorik.com/hero-films/";
const FILMS: readonly HeroFilmId[] = ["gargantua", "datagrid"];
const PIXELS = [640, 1170, 1440, 1999, 2000, 2880, 2999, 3000, 3840, 5120];

/** Every browser the pick tells apart: whether it plays AV1, and HEVC. */
const BROWSERS = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
] as const;

/** The format a browser of `BROWSERS` gets. */
const formatOf = (av1: boolean, hevc: boolean): HeroFilmFormat =>
  av1 ? "av1" : hevc ? "hevc" : "h264";

/** The mocks' film script (make_options.py, make_product_pages.py), word for word but for the folder. */
function mockScript(id: HeroFilmId, px: number, av1: boolean, hevc: boolean) {
  const k = px >= 3000 ? "2160" : px >= 2000 ? "1440" : "1080";
  const c = av1 ? "-av1" : hevc ? "-hevc" : "";
  return {
    poster: `${FOLDER}hero-${id}-poster-${k}.jpg`,
    src: `${FOLDER}hero-${id}-${c || k !== "2160" ? k : "1440"}${c}.mp4`,
  };
}

describe("heroFilmSize", () => {
  it.each([
    [320 * 2, 1080],
    [390 * 3, 1080],
    [1440, 1080],
    [1999, 1080],
    [2000, 1440],
    [1440 * 2, 1440],
    [2999, 1440],
    [3000, 2160],
    [1920 * 2, 2160],
    [3840, 2160],
  ])("takes %i device pixels to %i", (px, size) => {
    expect(heroFilmSize(px)).toBe(size);
  });
});

describe("heroFilmFormat", () => {
  it("asks for AV1, then HEVC, with the mocks' codec strings, and never for H.264", () => {
    const asked: string[] = [];
    expect(
      heroFilmFormat((type) => {
        asked.push(type);
        return "";
      }),
    ).toBe("h264");
    expect(asked).toEqual([
      'video/mp4; codecs="av01.0.12M.10"',
      'video/mp4; codecs="hvc1.2.4.L153.B0"',
    ]);
    expect(heroFilmCodecs).toEqual({ av1: asked[0], hevc: asked[1] });
  });

  it("takes the first the browser plays, 'maybe' and 'probably' as yes, '' as no", () => {
    const answer = (av1: string, hevc: string) =>
      heroFilmFormat((type) => (type === heroFilmCodecs.av1 ? av1 : hevc));
    expect(answer("probably", "maybe")).toBe("av1");
    expect(answer("maybe", "")).toBe("av1");
    expect(answer("", "maybe")).toBe("hevc");
    expect(answer("", "")).toBe("h264");
  });
});

describe("pickHeroFilm", () => {
  it("picks what the mocks' script picks, at every size, for every browser, for both films", () => {
    for (const id of FILMS) {
      for (const px of PIXELS) {
        for (const [av1, hevc] of BROWSERS) {
          expect(
            pickHeroFilm(id, heroFilmSize(px), formatOf(av1, hevc)),
            `${id} ${px} ${av1} ${hevc}`,
          ).toEqual(mockScript(id, px, av1, hevc));
        }
      }
    }
  });

  it("gives a 4K screen the 2160 film in AV1 or HEVC, with its 2160 poster", () => {
    expect(pickHeroFilm("gargantua", 2160, "av1")).toEqual({
      poster: `${FOLDER}hero-gargantua-poster-2160.jpg`,
      src: `${FOLDER}hero-gargantua-2160-av1.mp4`,
    });
    expect(pickHeroFilm("datagrid", 2160, "hevc").src).toBe(`${FOLDER}hero-datagrid-2160-hevc.mp4`);
  });

  it("gives a 4K screen with neither AV1 nor HEVC the 1440 H.264 film, its poster at 4K", () => {
    expect(pickHeroFilm("gargantua", 2160, "h264")).toEqual({
      poster: `${FOLDER}hero-gargantua-poster-2160.jpg`,
      src: `${FOLDER}hero-gargantua-1440.mp4`,
    });
    expect(pickHeroFilm("datagrid", 2160, "h264").src).toBe(`${FOLDER}hero-datagrid-1440.mp4`);
  });

  it("gives the H.264 film at its own size up to 1440", () => {
    expect(pickHeroFilm("datagrid", 1440, "h264").src).toBe(`${FOLDER}hero-datagrid-1440.mp4`);
    expect(pickHeroFilm("gargantua", 1080, "h264").src).toBe(`${FOLDER}hero-gargantua-1080.mp4`);
  });
});

/** A browser for the inline script: its screen, window and pixel ratio, the formats it plays, and the preference. */
interface Reader {
  readonly screen: number;
  readonly inner?: number;
  readonly dpr?: number;
  readonly av1?: boolean;
  readonly hevc?: boolean;
  readonly reduced?: boolean;
}

/** Runs `heroFilmScript` as a page would, on a stand-in for its element; what it set. */
function runScript(
  id: HeroFilmId,
  { screen, inner = 0, dpr = 1, av1 = false, hevc = false, reduced = false }: Reader,
) {
  const video = {
    poster: "",
    src: "",
    autoplay: true,
    played: 0,
    canPlayType: (type: string) =>
      (type === heroFilmCodecs.av1 && av1) || (type === heroFilmCodecs.hevc && hevc)
        ? "probably"
        : "",
    removeAttribute(name: string) {
      if (name === "autoplay") this.autoplay = false;
    },
    play() {
      this.played += 1;
      return Promise.resolve();
    },
  };
  new Function(
    "document",
    "screen",
    "innerWidth",
    "devicePixelRatio",
    "matchMedia",
    heroFilmScript(id),
  )({ currentScript: { parentNode: video } }, { width: screen }, inner, dpr, (query: string) => ({
    matches: reduced && query === "(prefers-reduced-motion: reduce)",
  }));
  return video;
}

describe("heroFilmScript, the pick inline in the element", () => {
  it("picks what pickHeroFilm picks, at every size, for every browser, for both films", () => {
    for (const id of FILMS) {
      for (const px of PIXELS) {
        for (const [av1, hevc] of BROWSERS) {
          const set = runScript(id, { screen: px, av1, hevc });
          expect({ poster: set.poster, src: set.src }, `${id} ${px} ${av1} ${hevc}`).toEqual(
            pickHeroFilm(id, heroFilmSize(px), formatOf(av1, hevc)),
          );
          expect(set.autoplay).toBe(true);
          expect(set.played).toBe(1);
        }
      }
    }
  });

  it("measures the larger of the screen and the window, in device pixels", () => {
    const at = (reader: Reader) => runScript("gargantua", { av1: true, ...reader });
    expect(at({ screen: 1440, dpr: 2 }).src).toBe(`${FOLDER}hero-gargantua-1440-av1.mp4`);
    expect(at({ screen: 1280, inner: 2560 }).src).toBe(`${FOLDER}hero-gargantua-1440-av1.mp4`);
    expect(at({ screen: 1920, dpr: 2 }).src).toBe(`${FOLDER}hero-gargantua-2160-av1.mp4`);
    expect(at({ screen: 390, dpr: 3 }).poster).toBe(`${FOLDER}hero-gargantua-poster-1080.jpg`);
  });

  it("under reduced motion sets the poster alone and takes autoplay off", () => {
    const set = runScript("datagrid", { screen: 1440, dpr: 2, av1: true, reduced: true });
    expect(set).toMatchObject({
      poster: `${FOLDER}hero-datagrid-poster-1440.jpg`,
      src: "",
      autoplay: false,
      played: 0,
    });
  });
});
