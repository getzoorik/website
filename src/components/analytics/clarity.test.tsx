import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import {
  Clarity,
  CLARITY_HOST,
  CLARITY_PROJECT_ID,
  CLARITY_SCRIPT_ID,
  claritySnippet,
} from "./clarity";

interface FakeWindow {
  clarity?: unknown;
  handlers: Record<string, () => void>;
  idle: (() => void)[];
  addEventListener: (type: string, handler: () => void) => void;
  setTimeout: (run: () => void) => void;
  requestIdleCallback?: (run: () => void) => void;
}

/**
 * Runs the snippet as a page served from `hostname` would. `load` fires only
 * when the test says so; with `idle`, so does the idle callback, as in Chrome
 * and Firefox. Without it the window is Safari's, which has no
 * requestIdleCallback and takes the setTimeout path.
 */
function runOn(hostname: string, { idle = false } = {}): FakeWindow {
  const win: FakeWindow = {
    handlers: {},
    idle: [],
    addEventListener(type, handler) {
      win.handlers[type] = handler;
    },
    setTimeout(run) {
      run();
    },
  };
  if (idle) {
    win.setTimeout = () => {
      throw new Error("a browser with requestIdleCallback must not fall back to setTimeout");
    };
    win.requestIdleCallback = (run) => {
      win.idle.push(run);
    };
  }
  new Function("location", "window", "document", claritySnippet)({ hostname }, win, document);
  return win;
}

const tags = () =>
  Array.from(document.querySelectorAll<HTMLScriptElement>('script[src*="clarity.ms"]'));

const TAG = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}?ref=bwt`;

describe("Clarity", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("is for zoorik.com", () => {
    expect(CLARITY_HOST).toBe("zoorik.com");
  });

  it("renders one script, under an id the loader does not look up on window", () => {
    const doc = new DOMParser().parseFromString(
      `<body>${renderToStaticMarkup(<Clarity />)}</body>`,
      "text/html",
    );
    const scripts = doc.querySelectorAll("script");

    /* 🔴 The rendered element, not the constant: `id="clarity"` would make
       `window.clarity` this element in a real browser, and the loader would
       die calling it. */
    expect(scripts).toHaveLength(1);
    expect(scripts[0].id).toBe(CLARITY_SCRIPT_ID);
    expect(scripts[0].id).not.toBe("clarity");
    expect(scripts[0].textContent).toBe(claritySnippet);
  });

  it("requests nothing until the page has loaded, then the project's tag", () => {
    document.body.append(document.createElement("script"));
    const win = runOn("zoorik.com");
    expect(tags()).toHaveLength(0);

    win.handlers.load();

    expect(tags().map((tag) => tag.src)).toEqual([TAG]);
    expect(typeof win.clarity).toBe("function");
  });

  it("waits for an idle moment after load where the browser offers one", () => {
    document.body.append(document.createElement("script"));
    const win = runOn("zoorik.com", { idle: true });

    win.handlers.load();
    expect(win.idle).toHaveLength(1);
    expect(tags()).toHaveLength(0);

    win.idle[0]();

    expect(tags().map((tag) => tag.src)).toEqual([TAG]);
    expect(typeof win.clarity).toBe("function");
  });

  it("names a click on a link to the calendar or to founders@, by the name alone, once it has started", () => {
    document.body.append(document.createElement("script"));
    const link = (href: string, inner = false) => {
      const a = document.createElement("a");
      a.href = href;
      a.addEventListener("click", (event) => event.preventDefault());
      const target = inner ? a.appendChild(document.createElement("span")) : a;
      document.body.append(a);
      return target;
    };
    const demo = link("https://cal.com/zoorik/talk");
    const mail = link("mailto:founders@zoorik.com", true);
    const other = link("/coral");
    const win = runOn("zoorik.com");

    demo.click();
    expect(win.clarity).toBeUndefined();

    win.handlers.load();
    const queue = () =>
      ((win.clarity as { q?: ArrayLike<unknown>[] }).q ?? []).map((args) => [...Array.from(args)]);
    demo.click();
    mail.click();
    other.click();
    document.body.click();

    expect(queue()).toEqual([
      ["event", "book_demo_clicked"],
      ["event", "email_clicked"],
    ]);
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
