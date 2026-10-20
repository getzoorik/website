"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

import type { FilmChapter } from "@/content/product-films";
import {
  FILM_ID,
  filmAt,
  filmClock,
  OutGlyph,
  PlayGlyph,
  SoundGlyph,
  youtubeEmbed,
} from "@/features/product-page/film-parts";

/**
 * The film's screen and its chapters: the film plays on the page, in YouTube's
 * player: it plays by itself, with its sound, once the reader reaches it;
 * whoever wants YouTube itself clicks YouTube, in the player.
 *
 * ─── SOUND: AS SOON AS THE BROWSER ALLOWS IT ───────────────────────────────
 * A browser plays a film's sound only after the reader has clicked, tapped or
 * pressed a key on the page; scrolling does not count, and no page can change
 * that. So:
 * - **On arrival** (half the poster in view) the film starts by itself: with
 *   sound when the reader has already pressed something on the page
 *   (`navigator.userActivation`), otherwise muted, with "Turn on sound" over it.
 * - **The reader's first press anywhere** on the page, or that button, turns
 *   the sound on in place, without restarting the film (YouTube's `unMute`).
 * - **The poster, a chapter or the hero's "Watch the 2-minute film"** starts it
 *   with sound, a chapter at its second.
 * - **Under reduced motion** nothing starts by itself: the player loads only on
 *   a press.
 * - **Leaving it pauses it**: once less than half of the player is in view, or
 *   the reader moves to another tab, the film pauses. It waits there; the
 *   reader presses play to go on, so a pause of their own is never undone.
 *   **Without scripting,** or on a click asking for a new tab, the poster and
 *   every chapter open the film on YouTube, as the mock writes them.
 *
 * YouTube's own captions stay off (`cc_load_policy=0`, then `unloadModule`):
 * the films carry their own on the picture.
 *
 * Until the player loads, nothing is fetched from YouTube; privacy policy §4.6
 * says when it loads and what Google then receives.
 */

interface Playing {
  /** The player's address, fixed once it loads: the sound is turned on by command, not by reloading. */
  readonly src: string;
  /** Each press reloads the player, even at the same second. */
  readonly press: number;
}

/** A click that asks for a new tab or window keeps the link's own behaviour. */
const modified = (event: MouseEvent | globalThis.MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

/** Whether the reader has pressed something on the page yet, which lets a film play its sound. */
const mayPlaySound = () =>
  (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
    ?.hasBeenActive === true;

/** YouTube's player takes commands as messages, once it has loaded: these turn its sound on. */
const SOUND_ON = [
  { event: "command", func: "unMute", args: [] },
  { event: "command", func: "setVolume", args: [100] },
];
const YOUTUBE_PLAYER = "https://www.youtube-nocookie.com";

/** This pauses it, when the reader leaves it. */
const PAUSE = { event: "command", func: "pauseVideo", args: [] };

/** And these keep its captions off: the films carry their own on the picture,
 *  and YouTube turns its own on for a muted film. */
const CAPTIONS_OFF = [
  { event: "command", func: "unloadModule", args: ["captions"] },
  { event: "command", func: "unloadModule", args: ["cc"] },
];

export interface FilmPlayerProps {
  readonly url: string;
  readonly poster: string;
  readonly length: string;
  /** The poster link's name ("Watch the 2-minute Coral film on YouTube (opens in a new tab)"). */
  readonly posterLabel: string;
  /** The player's title, for a screen reader ("Coral: the 2-minute film, on YouTube"). */
  readonly playerTitle: string;
  readonly tag: string;
  /** The button over a muted film ("Turn on sound"). */
  readonly soundLabel: string;
  readonly chaptersLabel: string;
  readonly chapters: readonly FilmChapter[];
}

export function FilmPlayer({
  url,
  poster,
  length,
  posterLabel,
  playerTitle,
  tag,
  soundLabel,
  chaptersLabel,
  chapters,
}: FilmPlayerProps): React.JSX.Element {
  const [playing, setPlaying] = useState<Playing | null>(null);
  const [muted, setMuted] = useState(false);
  const screen = useRef<HTMLAnchorElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  const focusPlayer = useRef(false);

  const start = useCallback(
    (at: number, sound: boolean, focus: boolean) => {
      focusPlayer.current = focus;
      setMuted(!sound);
      setPlaying((now) => ({
        src: youtubeEmbed(url, at, !sound, window.location.origin),
        press: (now?.press ?? 0) + 1,
      }));
    },
    [url],
  );

  /* Commands to the player: sent now, and again shortly, in case it was still
     loading (it ignores commands until it has). */
  const tell = useCallback((list: readonly object[]) => {
    const send = () => {
      const target = player.current?.contentWindow;
      if (!target) return;
      for (const command of list) target.postMessage(JSON.stringify(command), YOUTUBE_PLAYER);
    };
    send();
    for (const ms of [400, 1200, 2500]) window.setTimeout(send, ms);
  }, []);

  /* The sound on, in place. */
  const soundOn = useCallback(() => {
    setMuted(false);
    tell(SOUND_ON);
  }, [tell]);

  /* On arrival: half the poster in view starts the film; with sound if the
     reader has pressed something already, otherwise muted. */
  useEffect(() => {
    if (playing !== null) return;
    const el = screen.current;
    if (el === null || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const arrival = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        arrival.disconnect();
        start(0, mayPlaySound(), false);
      },
      { threshold: 0.5 },
    );
    arrival.observe(el);
    return () => arrival.disconnect();
  }, [playing, start]);

  /* A muted film: the reader's first press anywhere on the page turns its sound on. */
  useEffect(() => {
    if (playing === null || !muted) return;
    const press = () => soundOn();
    document.addEventListener("pointerdown", press, { once: true });
    document.addEventListener("keydown", press, { once: true });
    return () => {
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("keydown", press);
    };
  }, [playing, muted, soundOn]);

  /* The hero's "Watch the 2-minute film" is a press: the film starts with sound. */
  useEffect(() => {
    const watch = (event: globalThis.MouseEvent) => {
      if (modified(event)) return;
      const link = (event.target as Element | null)?.closest?.(`a[href="#${FILM_ID}"]`);
      if (link) start(0, true, false);
    };
    document.addEventListener("click", watch);
    return () => document.removeEventListener("click", watch);
  }, [start]);

  /* Leaving the film pauses it: less than half of the player in view, once it has been in view (a chapter pressed
     below it scrolls it there first), or the page hidden behind another tab. */
  useEffect(() => {
    if (playing === null) return;
    const frame = player.current;
    const box = frame?.parentElement;
    if (!frame || !box) return;
    const pause = () => frame.contentWindow?.postMessage(JSON.stringify(PAUSE), YOUTUBE_PLAYER);
    const hidden = () => {
      if (document.visibilityState === "hidden") pause();
    };
    document.addEventListener("visibilitychange", hidden);
    let seen = false;
    const away =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.intersectionRatio >= 0.5) seen = true;
                else if (seen) pause();
              }
            },
            { threshold: 0.5 },
          );
    away?.observe(box);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      away?.disconnect();
    };
  }, [playing]);

  /* A press on the poster or a chapter moves the reader to the player, which took the poster's place. */
  useEffect(() => {
    if (playing !== null && focusPlayer.current) player.current?.focus();
  }, [playing]);

  const onPress = (at: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (modified(event)) return;
    event.preventDefault();
    start(at, true, true);
  };

  return (
    <>
      {playing === null ? (
        <a
          ref={screen}
          className="pf-film-p"
          href={url}
          target="_blank"
          rel="noopener"
          aria-label={posterLabel}
          onClick={onPress(0)}
        >
          {/* A plain <img>, as the hero's photograph: the ported sheet owns the
              box (`.pf-film-p img`), and the poster is a file in public/films. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
          <img src={poster} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
          <span className="pf-play" aria-hidden="true">
            <PlayGlyph />
          </span>
          <span className="pf-film-tag" aria-hidden="true">
            <b>{length}</b>
            <span>{tag}</span>
            <OutGlyph />
          </span>
        </a>
      ) : (
        <div className="pf-film-p pf-film-on">
          <iframe
            key={playing.press}
            ref={player}
            src={playing.src}
            title={playerTitle}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => tell(CAPTIONS_OFF)}
          />
          {muted ? (
            <button type="button" className="pf-sound" onClick={soundOn}>
              <SoundGlyph />
              {soundLabel}
            </button>
          ) : null}
        </div>
      )}
      <ol className="pf-ch" aria-label={chaptersLabel}>
        {chapters.map((chapter) => (
          <li key={chapter.at}>
            <a
              href={filmAt(url, chapter.at)}
              target="_blank"
              rel="noopener"
              onClick={onPress(chapter.at)}
            >
              <b>{filmClock(chapter.at)}</b>
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
    </>
  );
}
