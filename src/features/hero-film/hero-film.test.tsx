import { act, render } from "@testing-library/react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroFilm } from "@/features/hero-film/hero-film";

/**
 * The heroes' film element: the server's markup, the box it fills, and the
 * file the browser takes, by its screen and the formats it plays: from the
 * element's own script as the page is parsed, or from its effect when it is
 * drawn in the browser.
 */

interface Browser {
  /** `screen.width`, `innerWidth` and `devicePixelRatio`. */
  readonly screen: number;
  readonly inner?: number;
  readonly dpr: number;
  readonly av1?: boolean;
  readonly hevc?: boolean;
  readonly reduced?: boolean;
}

const restore: (() => void)[] = [];

/** Sets one property of `window` for this test only. */
function set(name: "innerWidth" | "devicePixelRatio", value: number) {
  const own = Object.getOwnPropertyDescriptor(window, name);
  Object.defineProperty(window, name, { configurable: true, value });
  restore.push(() => (own ? Object.defineProperty(window, name, own) : delete window[name]));
}

/** A browser, as the film asks it; returns a switch for reduced motion and the play() spy. */
function browser({
  screen,
  inner = screen,
  dpr,
  av1 = false,
  hevc = false,
  reduced = false,
}: Browser) {
  vi.spyOn(Object.getPrototypeOf(window.screen), "width", "get").mockReturnValue(screen);
  set("innerWidth", inner);
  set("devicePixelRatio", dpr);
  vi.spyOn(HTMLMediaElement.prototype, "canPlayType").mockImplementation((type) =>
    (type.includes("av01") && av1) || (type.includes("hvc1") && hevc) ? "probably" : "",
  );
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});

  let less = reduced;
  const listeners = new Set<() => void>();
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return less && query === "(prefers-reduced-motion: reduce)";
        },
        media: query,
        addEventListener: (_: string, fn: () => void) => listeners.add(fn),
        removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
      }) as unknown as MediaQueryList,
  );
  const turn = (on: boolean) =>
    act(() => {
      less = on;
      for (const fn of listeners) fn();
    });
  return { play, load, reduce: () => turn(true), allow: () => turn(false) };
}

afterEach(() => {
  vi.restoreAllMocks();
  while (restore.length) restore.pop()!();
});

const videoIn = (container: HTMLElement) => container.querySelector("video")!;

const FOLDER = "https://media.zoorik.com/hero-films/";
const PRECONNECT = '<link rel="preconnect" href="https://media.zoorik.com"/>';

/**
 * The server's markup as a browser parses it: the film's own script run as the
 * parser reaches it (jsdom runs none), its element its `currentScript`'s parent.
 * The preconnect is left out: the page puts it in the head, not beside the film.
 */
function parse(film: "gargantua" | "datagrid"): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<HeroFilm film={film} />).replace(PRECONNECT, "");
  document.body.append(container);
  const video = videoIn(container);
  /* A browser's parser mutes the element from its `muted` attribute; jsdom does not. */
  video.muted = true;
  const script = video.querySelector("script")!;
  new Function("document", script.textContent!)({ currentScript: script });
  return container;
}

describe("HeroFilm on the server", () => {
  it("sends the mocks' element: silent, inline, looping, autoplay, hidden, out of the tab order", () => {
    const html = renderToStaticMarkup(<HeroFilm film="gargantua" />);
    expect(html.match(/<video[^>]*>/g)).toHaveLength(1);
    for (const attribute of [
      /\bmuted=""/,
      /\bplaysinline=""/i,
      /\bloop=""/,
      /\bautoplay=""/i,
      /\bpreload="auto"/,
      /\baria-hidden="true"/,
      /\btabindex="-1"/i,
      /\bdisablepictureinpicture=""/i,
    ]) {
      expect(html).toMatch(attribute);
    }
    expect(html).not.toMatch(/\bcontrols\b/);
  });

  it("sends no poster and no film, only the script inside the element that picks them", () => {
    for (const film of ["gargantua", "datagrid"] as const) {
      const html = renderToStaticMarkup(<HeroFilm film={film} />).replace(PRECONNECT, "");
      const [tag = ""] = html.match(/<video[^>]*>/) ?? [];
      /* A poster in the markup is fetched at once, by the preload scanner, before any script. */
      expect(tag).not.toMatch(/\bposter=/);
      expect(tag).not.toMatch(/\bsrc=/);
      expect(html).toMatch(
        /^<video[^>]*><script>\(function\(\)\{var v=document\.currentScript\.parentNode,/,
      );
      expect(html).toMatch(/<\/script><\/video>$/);
      expect(html).toContain(`u="${FOLDER}hero-${film}-"`);
    }
  });

  it("asks for one preconnect to media.zoorik.com, however many films the page draws", () => {
    const html = renderToStaticMarkup(
      <>
        <HeroFilm film="gargantua" />
        <HeroFilm film="datagrid" />
      </>,
    );
    expect(html.match(/<link[^>]*>/g)).toEqual([PRECONNECT]);
  });
});

describe("HeroFilm's box", () => {
  it("covers its parent whole, under the parent's scrim, on the film's own sky", () => {
    browser({ screen: 1440, dpr: 1 });
    const video = videoIn(render(<HeroFilm film="gargantua" />).container);
    expect(video).toHaveClass("hero-film", { exact: true });
    expect(video).toHaveStyle({
      position: "absolute",
      inset: "0px",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: "-2",
      pointerEvents: "none",
      userSelect: "none",
      backgroundColor: "#080014",
    });
    expect(video.style.objectPosition).toBe("");
    expect(videoIn(render(<HeroFilm film="datagrid" />).container)).toHaveStyle({
      backgroundColor: "#000817",
    });
  });

  it("takes a ground and the page's own class when given", () => {
    browser({ screen: 1440, dpr: 1 });
    const video = videoIn(
      render(<HeroFilm film="datagrid" ground="#000000" className="pp-film" />).container,
    );
    expect(video).toHaveClass("hero-film pp-film", { exact: true });
    expect(video).toHaveStyle({ backgroundColor: "#000000" });
  });
});

describe("HeroFilm as the page is parsed", () => {
  it("sets the screen's poster and the film from its own script, before the page hydrates", () => {
    const { play } = browser({ screen: 1440, dpr: 2, av1: true, hevc: true });
    const video = videoIn(parse("gargantua"));
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-gargantua-poster-1440.jpg`);
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-gargantua-1440-av1.mp4`);
    expect(video).toHaveAttribute("autoplay");
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("hydrates on what the script set, with no warning, and leaves it: one poster, one film", () => {
    const { play, load } = browser({ screen: 1440, dpr: 2, hevc: true });
    const container = parse("datagrid");
    const errors = vi.spyOn(console, "error");
    const posterSet = vi.spyOn(HTMLVideoElement.prototype, "poster", "set");
    const srcSet = vi.spyOn(HTMLMediaElement.prototype, "src", "set");

    render(<HeroFilm film="datagrid" />, { container, hydrate: true });
    const video = videoIn(container);
    expect(errors).not.toHaveBeenCalled();
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-datagrid-poster-1440.jpg`);
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-datagrid-1440-hevc.mp4`);
    expect(posterSet).not.toHaveBeenCalled();
    expect(srcSet).not.toHaveBeenCalled();
    expect(play).toHaveBeenCalledTimes(1);
    expect(load).not.toHaveBeenCalled();
  });

  it("under reduced motion, sets only the poster and takes autoplay off, and hydrates on that", () => {
    const { play } = browser({ screen: 1920, dpr: 2, av1: true, reduced: true });
    const container = parse("gargantua");
    const errors = vi.spyOn(console, "error");
    render(<HeroFilm film="gargantua" />, { container, hydrate: true });
    const video = videoIn(container);
    expect(errors).not.toHaveBeenCalled();
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-gargantua-poster-2160.jpg`);
    expect(video).not.toHaveAttribute("src");
    expect(video).not.toHaveAttribute("autoplay");
    expect(play).not.toHaveBeenCalled();
  });
});

describe("HeroFilm drawn in the browser", () => {
  it("makes the same pick itself, muted, and plays", () => {
    const { play } = browser({ screen: 390, dpr: 3, hevc: true });
    const video = videoIn(render(<HeroFilm film="datagrid" />).container);
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-datagrid-1080-hevc.mp4`);
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-datagrid-poster-1080.jpg`);
    expect(video.muted).toBe(true);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("puts one preconnect to media.zoorik.com in the head", () => {
    browser({ screen: 1440, dpr: 1 });
    render(<HeroFilm film="gargantua" />);
    render(<HeroFilm film="datagrid" />);
    expect(document.head.querySelectorAll('link[rel="preconnect"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="preconnect"]')).toHaveAttribute(
      "href",
      "https://media.zoorik.com",
    );
    expect(document.head.querySelector('link[rel="preconnect"]')).not.toHaveAttribute(
      "crossorigin",
    );
  });

  it("gives a 4K screen the 2160 film in AV1, its poster at 4K", () => {
    browser({ screen: 1920, dpr: 2, av1: true });
    const video = videoIn(render(<HeroFilm film="gargantua" />).container);
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-gargantua-2160-av1.mp4`);
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-gargantua-poster-2160.jpg`);
  });

  it("gives a 4K screen with neither AV1 nor HEVC the 1440 H.264 film, its poster at 4K", () => {
    browser({ screen: 1920, dpr: 2 });
    const video = videoIn(render(<HeroFilm film="gargantua" />).container);
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-gargantua-1440.mp4`);
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-gargantua-poster-2160.jpg`);
  });

  it("measures a window wider than its screen by the window", () => {
    browser({ screen: 1280, inner: 2560, dpr: 1, av1: true });
    const video = videoIn(render(<HeroFilm film="gargantua" />).container);
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-gargantua-1440-av1.mp4`);
  });
});

describe("HeroFilm under reduced motion", () => {
  it("shows the poster for its screen and loads no film", () => {
    const { play } = browser({ screen: 1920, dpr: 2, av1: true, reduced: true });
    const video = videoIn(render(<HeroFilm film="gargantua" />).container);
    expect(video).not.toHaveAttribute("src");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-gargantua-poster-2160.jpg`);
    expect(play).not.toHaveBeenCalled();
  });

  it("stops the film when it is asked for while the film plays", async () => {
    const { load, reduce } = browser({ screen: 1440, dpr: 1, av1: true });
    const video = videoIn(parse("datagrid"));
    render(<HeroFilm film="datagrid" />, { container: video.parentElement!, hydrate: true });
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-datagrid-1080-av1.mp4`);

    await reduce();
    expect(video).not.toHaveAttribute("src");
    expect(video).not.toHaveAttribute("autoplay");
    expect(load).toHaveBeenCalledTimes(1);
    expect(video.getAttribute("poster")).toBe(`${FOLDER}hero-datagrid-poster-1080.jpg`);
  });

  it("starts the film when the preference is turned off again", async () => {
    const { play, reduce, allow } = browser({ screen: 1440, dpr: 1, av1: true, reduced: true });
    const video = videoIn(render(<HeroFilm film="gargantua" />).container);
    expect(video).not.toHaveAttribute("src");
    await allow();
    expect(video.getAttribute("src")).toBe(`${FOLDER}hero-gargantua-1080-av1.mp4`);
    expect(video).toHaveAttribute("autoplay");
    expect(play).toHaveBeenCalledTimes(1);
    await reduce();
    expect(video).not.toHaveAttribute("src");
  });
});
