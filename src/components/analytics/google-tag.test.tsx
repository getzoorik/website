import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import {
  GA_MEASUREMENT_ID,
  GoogleTag,
  GOOGLE_TAG_HOST,
  GOOGLE_TAG_SCRIPT_ID,
  googleTagSnippet,
  GTM_CONTAINER_ID,
  NO_COOKIE_REGIONS,
} from "./google-tag";

interface FakeWindow {
  dataLayer?: IArguments[];
  handlers: Record<string, () => void>;
  addEventListener: (type: string, handler: () => void) => void;
}

/** Runs the snippet as a page served from `hostname` would. `load` fires only when the test says so. */
function runOn(hostname: string): FakeWindow {
  const win: FakeWindow = {
    handlers: {},
    addEventListener(type, handler) {
      win.handlers[type] = handler;
    },
  };
  new Function("location", "window", "document", googleTagSnippet)({ hostname }, win, document);
  return win;
}

const tags = () =>
  Array.from(document.querySelectorAll<HTMLScriptElement>('script[src*="googletagmanager.com"]'));

const TAG = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;

describe("GoogleTag", () => {
  afterEach(() => {
    document.head.replaceChildren();
  });

  it("is for zoorik.com, the container and the stream", () => {
    expect(GOOGLE_TAG_HOST).toBe("zoorik.com");
    expect(GTM_CONTAINER_ID).toBe("GTM-MB7QLD5D");
    expect(GA_MEASUREMENT_ID).toBe("G-DPV4MD0ZBX");
  });

  it("renders one script", () => {
    const doc = new DOMParser().parseFromString(
      `<body>${renderToStaticMarkup(<GoogleTag />)}</body>`,
      "text/html",
    );
    const scripts = doc.querySelectorAll("script");

    expect(scripts).toHaveLength(1);
    expect(scripts[0].id).toBe(GOOGLE_TAG_SCRIPT_ID);
    expect(scripts[0].textContent).toBe(googleTagSnippet);
  });

  it("requests nothing until the page has loaded, then the container", () => {
    const win = runOn("zoorik.com");
    expect(tags()).toHaveLength(0);

    win.handlers.load();

    expect(tags().map((tag) => tag.src)).toEqual([TAG]);
  });

  it("queues the cookie default, then the start, then the stream, as Arguments", () => {
    const win = runOn("zoorik.com");
    win.handlers.load();

    const queue = win.dataLayer!;
    expect(queue.map((args) => Object.prototype.toString.call(args))).toEqual(
      Array(3).fill("[object Arguments]"),
    );
    expect(Array.from(queue[0])).toEqual([
      "consent",
      "default",
      {
        ad_personalization: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        analytics_storage: "denied",
        region: [...NO_COOKIE_REGIONS],
      },
    ]);
    expect(queue[1][0]).toBe("js");
    expect(queue[1][1]).toBeInstanceOf(Date);
    expect(Array.from(queue[2])).toEqual(["config", GA_MEASUREMENT_ID]);
  });

  it("keeps what is already queued", () => {
    const win = runOn("zoorik.com");
    const earlier = [] as unknown as IArguments[];
    win.dataLayer = earlier;

    win.handlers.load();

    expect(win.dataLayer).toBe(earlier);
    expect(earlier).toHaveLength(3);
  });

  it("covers the EEA's 30 countries, the UK and Switzerland, each once", () => {
    expect(NO_COOKIE_REGIONS).toHaveLength(32);
    expect(new Set(NO_COOKIE_REGIONS).size).toBe(32);
    expect(NO_COOKIE_REGIONS).toEqual(expect.arrayContaining(["DE", "FR", "GB", "CH", "NO"]));
  });

  it.each(["localhost", "127.0.0.1", "www.zoorik.com", "zoorik-marketing.example.workers.dev"])(
    "does nothing on %s",
    (hostname) => {
      const win = runOn(hostname);

      expect(win.handlers).toEqual({});
      expect(tags()).toHaveLength(0);
    },
  );
});
