import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { productFilms } from "@/content/product-films";
import { youtubeEmbed, youtubeId } from "@/features/product-page/film-parts";
import { FilmPlayer } from "@/features/product-page/film-player";

const film = productFilms.coral;
const url = film.url!;
const origin = () => window.location.origin;
const embed = (start: number, muted: boolean) => youtubeEmbed(url, start, muted, origin());

const player = () => (
  <FilmPlayer
    url={url}
    poster={film.poster}
    length={film.length}
    posterLabel="Watch the 2-minute Coral film on YouTube (opens in a new tab)"
    playerTitle="Coral: the 2-minute film, on YouTube"
    tag="Watch on YouTube"
    soundLabel="Turn on sound"
    chaptersLabel="Chapters of the film"
    chapters={film.chapters}
  />
);

/** An observer the test can fire: `arrive()` reports the poster in view. */
function observe(): { arrive: () => void } {
  let report: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        report = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  return { arrive: () => act(() => report?.([{ isIntersecting: true }])) };
}

function reducedMotion(reduce: boolean): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
}

/** Whether the reader has pressed something on the page yet (`navigator.userActivation`). */
function pressedBefore(active: boolean): void {
  Object.defineProperty(navigator, "userActivation", {
    value: { hasBeenActive: active },
    configurable: true,
  });
}

/** The commands the page sends the player. */
function commands(frame: HTMLIFrameElement): string[] {
  const spy = vi.spyOn(frame.contentWindow!, "postMessage");
  return new Proxy([], {
    get: (_, key) =>
      Reflect.get(
        spy.mock.calls.map((call) => JSON.parse(call[0] as string).func),
        key,
      ),
  }) as string[];
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  pressedBefore(false);
});

describe("YouTube's player address", () => {
  it("reads the video's id from either kind of address", () => {
    expect(youtubeId("https://youtu.be/aHRnAWhbzlo")).toBe("aHRnAWhbzlo");
    expect(youtubeId("https://www.youtube.com/watch?v=H221xeryon4&t=21s")).toBe("H221xeryon4");
    expect(() => youtubeId("https://example.com/")).toThrow();
  });

  it("is the privacy-enhanced player, muted only when asked, taking commands from the page", () => {
    expect(youtubeEmbed(url, 0, true)).toBe(
      "https://www.youtube-nocookie.com/embed/aHRnAWhbzlo?autoplay=1&playsinline=1&rel=0&cc_load_policy=0&mute=1",
    );
    expect(youtubeEmbed(url, 21, false, "https://zoorik.com")).toBe(
      "https://www.youtube-nocookie.com/embed/aHRnAWhbzlo?autoplay=1&playsinline=1&rel=0&cc_load_policy=0&start=21&enablejsapi=1&origin=https%3A%2F%2Fzoorik.com",
    );
  });
});

describe("the film on the page", () => {
  it("starts as the poster, linking to YouTube, and loads nothing from it", () => {
    observe();
    reducedMotion(false);
    const { container } = render(player());
    expect(container.querySelector("a.pf-film-p")).toHaveAttribute("href", url);
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("starts by itself with its sound when the reader has already pressed something", () => {
    const { arrive } = observe();
    reducedMotion(false);
    pressedBefore(true);
    const { container } = render(player());
    arrive();
    const frame = container.querySelector(".pf-film-p.pf-film-on > iframe")!;
    expect(frame).toHaveAttribute("src", embed(0, false));
    expect(frame).toHaveAttribute("title", "Coral: the 2-minute film, on YouTube");
    expect(frame.getAttribute("allow")).toContain("autoplay");
    expect(container.querySelector(".pf-sound")).toBeNull();
  });

  it("starts by itself muted otherwise, with Turn on sound over it", () => {
    const { arrive } = observe();
    reducedMotion(false);
    pressedBefore(false);
    const { container } = render(player());
    arrive();
    expect(container.querySelector("iframe")).toHaveAttribute("src", embed(0, true));
    const button = container.querySelector("button.pf-sound")!;
    expect(button).toHaveAttribute("type", "button");
    expect(button.textContent).toBe("Turn on sound");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("turns the sound on in place when Turn on sound is pressed, without reloading", () => {
    const { arrive } = observe();
    reducedMotion(false);
    const { container } = render(player());
    arrive();
    const frame = container.querySelector("iframe")!;
    const sent = commands(frame);
    fireEvent.click(container.querySelector("button.pf-sound")!);
    expect(sent).toContain("unMute");
    expect(sent).toContain("setVolume");
    expect(container.querySelector(".pf-sound")).toBeNull();
    expect(container.querySelector("iframe")).toBe(frame);
    expect(frame).toHaveAttribute("src", embed(0, true));
  });

  it("keeps YouTube's captions off once the player has loaded: the films carry their own", () => {
    const { arrive } = observe();
    reducedMotion(false);
    const { container } = render(player());
    arrive();
    const frame = container.querySelector("iframe")!;
    const spy = vi.spyOn(frame.contentWindow!, "postMessage");
    fireEvent.load(frame);
    expect(spy.mock.calls.map((call) => JSON.parse(call[0] as string))).toEqual([
      { event: "command", func: "unloadModule", args: ["captions"] },
      { event: "command", func: "unloadModule", args: ["cc"] },
    ]);
    expect(frame.getAttribute("src")).toContain("cc_load_policy=0");
  });

  it("turns the sound on at the reader's first press anywhere on the page", () => {
    const { arrive } = observe();
    reducedMotion(false);
    const { container } = render(player());
    arrive();
    const sent = commands(container.querySelector("iframe")!);
    fireEvent.pointerDown(document.body);
    expect(sent).toContain("unMute");
    expect(container.querySelector(".pf-sound")).toBeNull();
  });

  it("waits for a press under reduced motion", () => {
    const { arrive } = observe();
    reducedMotion(true);
    const { container } = render(player());
    arrive();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("plays with sound on the page when the poster is pressed", () => {
    observe();
    reducedMotion(true);
    const { container } = render(player());
    const notPrevented = fireEvent.click(container.querySelector("a.pf-film-p")!);
    expect(notPrevented).toBe(false);
    expect(container.querySelector("iframe")).toHaveAttribute("src", embed(0, false));
    expect(container.querySelector(".pf-sound")).toBeNull();
  });

  it("plays from a chapter's second, before and after the player is there", () => {
    observe();
    reducedMotion(true);
    const { container } = render(player());
    const chapter = (label: string) =>
      [...container.querySelectorAll(".pf-ch a")].find((a) => a.textContent?.includes(label))!;
    fireEvent.click(chapter("Monitoring"));
    expect(container.querySelector("iframe")).toHaveAttribute("src", embed(21, false));
    fireEvent.click(chapter("Live migration"));
    expect(container.querySelector("iframe")).toHaveAttribute("src", embed(72, false));
  });

  it("leaves a click that asks for a new tab to the link: YouTube, at that chapter", () => {
    observe();
    reducedMotion(true);
    const { container } = render(player());
    const notPrevented = fireEvent.click(container.querySelector(".pf-ch a")!, { metaKey: true });
    expect(notPrevented).toBe(true);
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("starts with sound when the hero's Watch the 2-minute film is pressed", () => {
    observe();
    reducedMotion(true);
    const { container } = render(
      <>
        <a href="#film" className="pf-watch">
          Watch the 2-minute film
        </a>
        {player()}
      </>,
    );
    fireEvent.click(container.querySelector(".pf-watch")!);
    expect(container.querySelector("iframe")).toHaveAttribute("src", embed(0, false));
  });
});

describe("leaving the film", () => {
  type Report = (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void;

  /** Every observer the player makes, in order: the poster's arrival, then the player's own. */
  function observers(): Report[] {
    const made: Report[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: Report) {
          made.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
    return made;
  }

  const view = (ratio: number) => [{ isIntersecting: ratio > 0, intersectionRatio: ratio }];
  const sent = (spy: { mock: { calls: unknown[][] } }, func: string) =>
    spy.mock.calls.filter((call) => JSON.parse(call[0] as string).func === func).length;
  const paused = (spy: { mock: { calls: unknown[][] } }) => sent(spy, "pauseVideo");

  it("pauses once less than half of the player is in view, and waits there", () => {
    const made = observers();
    reducedMotion(false);
    const { container } = render(player());
    act(() => made[0]!(view(1)));
    const frame = container.querySelector("iframe")!;
    const spy = vi.spyOn(frame.contentWindow!, "postMessage");
    const away = made.at(-1)!;
    act(() => away(view(1)));
    expect(paused(spy)).toBe(0);
    act(() => away(view(0.3)));
    expect(paused(spy)).toBe(1);
    expect(spy).toHaveBeenLastCalledWith(
      JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
      "https://www.youtube-nocookie.com",
    );
    /* Back in view, it stays paused: the reader presses play to go on. */
    act(() => away(view(1)));
    expect(
      spy.mock.calls.filter((call) => JSON.parse(call[0] as string).func === "playVideo"),
    ).toEqual([]);
  });

  it("does not pause a film that has not been in view yet, as when a chapter below it is pressed", () => {
    const made = observers();
    reducedMotion(false);
    const { container } = render(player());
    fireEvent.click(container.querySelector(".pf-ch a")!);
    const frame = container.querySelector("iframe")!;
    const spy = vi.spyOn(frame.contentWindow!, "postMessage");
    act(() => made.at(-1)!(view(0.2)));
    expect(paused(spy)).toBe(0);
  });

  it("pauses when the reader moves to another tab", () => {
    const made = observers();
    reducedMotion(false);
    const { container } = render(player());
    act(() => made[0]!(view(1)));
    const frame = container.querySelector("iframe")!;
    const spy = vi.spyOn(frame.contentWindow!, "postMessage");
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(paused(spy)).toBe(1);
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  });
});
