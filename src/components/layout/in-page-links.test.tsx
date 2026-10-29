import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { learnPath } from "@/config/site";
import { learnArticles } from "@/content/learn/published";

import { InPageLinks } from "./in-page-links";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

/**
 * The whole point of this component is a URL that does NOT change, which is the
 * one thing a rendered snapshot cannot show and a reviewer will not notice. A
 * regression here looks exactly like working software — the section still
 * scrolls into view — and only shows up when somebody copies the address out of
 * the bar and pastes `zoorik.com/#coral` into a deck.
 */
const scrollSpy = vi.fn();

beforeEach(() => {
  /* jsdom implements neither, and the component would throw on the first. */
  Element.prototype.scrollIntoView = scrollSpy;
  window.history.replaceState(null, "", "/");
  pathname.current = "/";
});

afterEach(() => {
  scrollSpy.mockClear();
  vi.restoreAllMocks();
});

function page() {
  return render(
    <>
      <InPageLinks />
      <nav>
        <a href="#coral">Coral</a>
        <a href="#">Placeholder</a>
        <a href="#nowhere">Broken</a>
      </nav>
      <section id="coral">Coral section</section>
    </>,
  );
}

describe("in-page links", () => {
  it("scrolls to the section without putting the hash in the URL", async () => {
    const { getByText } = page();
    await userEvent.click(getByText("Coral"));

    expect(scrollSpy).toHaveBeenCalledOnce();
    expect(window.location.hash).toBe("");
    expect(window.location.href).not.toContain("#");
  });

  it("moves focus to the section it scrolled to", async () => {
    const { getByText, container } = page();
    await userEvent.click(getByText("Coral"));

    /* Following a hash natively moves focus; intercepting the click takes that
       away, and a keyboard reader is left at the top of the nav they just used. */
    expect(document.activeElement).toBe(container.querySelector("#coral"));
  });

  it("does nothing at all for a bare # placeholder", async () => {
    const { getByText } = page();
    const clicked = vi.fn();
    document.addEventListener("click", clicked);
    await userEvent.click(getByText("Placeholder"));
    document.removeEventListener("click", clicked);

    /* A placeholder for a page that does not exist yet, as the footer's legal
       links were until /privacy. Left to the browser it scrolls the reader to
       the top for no reason AND writes a `#` — neither of which jsdom
       performs, so `preventDefault` is what the assertion has to be: it is the
       mechanism, not a proxy for it. */
    expect(clicked.mock.calls[0]![0].defaultPrevented).toBe(true);
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("cleans a hash the router left behind, on the next in-page click", async () => {
    const { getByText } = page();
    /* The mount pass cleans a hash that was there on load. This is the OTHER
       way one arrives: `/login`'s "Book a demo" is a client-side navigation to
       `/#contact`, and anything else that writes a fragment without a reload
       lands here too. */
    window.history.replaceState(null, "", "/#contact");
    expect(window.location.hash).toBe("#contact");

    await userEvent.click(getByText("Coral"));
    expect(window.location.hash).toBe("");
  });

  it("leaves a fragment that is not on this page to the browser", async () => {
    const { getByText } = page();
    const clicked = vi.fn();
    document.addEventListener("click", clicked);
    await userEvent.click(getByText("Broken"));
    document.removeEventListener("click", clicked);

    /* Not ours to intercept — and swallowing it would hide the broken link. */
    expect(scrollSpy).not.toHaveBeenCalled();
    expect(clicked.mock.calls[0]![0].defaultPrevented).toBe(false);
  });

  it("leaves a modified click alone", async () => {
    const { getByText } = page();
    const user = userEvent.setup();
    await user.keyboard("{Meta>}");
    await user.click(getByText("Coral"));
    await user.keyboard("{/Meta}");

    /* Cmd-click is a request to open elsewhere, not to scroll here. */
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("drops an inbound hash without scrolling a page the browser already positioned", () => {
    window.history.replaceState(null, "", "/#coral");
    render(
      <>
        <InPageLinks />
        <section id="coral">Coral section</section>
      </>,
    );

    expect(window.location.hash).toBe("");
    /* 🔴 AND NOT A SECOND SCROLL. The mock reproduces the jump itself because
       its script strips the hash while the document is still parsing, before
       the browser can act on it. An effect runs after the browser's fragment
       scroll and after the router's, so the reader is already in the right
       place — and scrolling again measurably LOST that position. */
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("lands an anchor from before the rename on the section that replaced it", () => {
    /* `#kubernetes` names no element any more, so the browser scrolled nowhere.
       A deck pasted before the products were named Amoeba and Coral must still
       open on Coral, not on the hero. */
    window.history.replaceState(null, "", "/#kubernetes");
    const { container } = render(
      <>
        <InPageLinks />
        <section id="amoeba">Amoeba section</section>
        <section id="coral">Coral section</section>
      </>,
    );

    expect(scrollSpy).toHaveBeenCalledOnce();
    expect(scrollSpy.mock.contexts[0]).toBe(container.querySelector("#coral"));
    expect(window.location.hash).toBe("");
  });

  it("follows an old anchor pasted into a tab already on the page", () => {
    const { container } = render(
      <>
        <InPageLinks />
        <section id="amoeba">Amoeba section</section>
      </>,
    );
    /* No reload: the browser only fires `hashchange`, and finds no `#elastic`
       to scroll to. */
    window.history.replaceState(null, "", "/#elastic");
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    expect(scrollSpy.mock.contexts[0]).toBe(container.querySelector("#amoeba"));
    expect(window.location.hash).toBe("");
  });

  it("follows an old anchor clicked on the page to its renamed section", async () => {
    const { getByText, container } = render(
      <>
        <InPageLinks />
        <a href="#elastic">Old link</a>
        <section id="amoeba">Amoeba section</section>
      </>,
    );
    await userEvent.click(getByText("Old link"));

    expect(scrollSpy.mock.contexts[0]).toBe(container.querySelector("#amoeba"));
    expect(window.location.hash).toBe("");
  });

  it("cleans a hash that arrived by client-side navigation, not just by page load", () => {
    /* 🔴 THE ROOT LAYOUT SURVIVES A ROUTE CHANGE, so a mount-only effect runs
       once per full page load and never again. `/login`'s "Book a demo" is a
       client-side navigation to `/#contact` — the reader would arrive at the
       contact section with `#contact` sitting in the bar, which is the one
       thing this component exists to prevent. */
    pathname.current = "/login";
    const { rerender } = render(
      <>
        <InPageLinks />
        <section id="contact">Contact</section>
      </>,
    );

    pathname.current = "/";
    window.history.replaceState(null, "", "/#contact");
    rerender(
      <>
        <InPageLinks />
        <section id="contact">Contact</section>
      </>,
    );

    expect(window.location.hash).toBe("");
  });

  it("does not animate the scroll for a reader who asked for less motion", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { getByText } = page();
    await userEvent.click(getByText("Coral"));

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
  });

  describe("the length of the jump", () => {
    const sectionAt = (container: HTMLElement, top: number) =>
      vi
        .spyOn(container.querySelector<HTMLElement>("#coral")!, "getBoundingClientRect")
        .mockReturnValue({ top } as DOMRect);

    it("lands at once when the section is more than two screens away", async () => {
      /* A smooth scroll that far runs past a second; interface motion should
         stay well under that. */
      const { getByText, container } = page();
      sectionAt(container, 2 * window.innerHeight + 1);
      await userEvent.click(getByText("Coral"));

      expect(scrollSpy).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    });

    it("lands at once going back up more than two screens, too", async () => {
      const { getByText, container } = page();
      sectionAt(container, -(2 * window.innerHeight + 1));
      await userEvent.click(getByText("Coral"));

      expect(scrollSpy).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    });

    it("glides when the section is within two screens", async () => {
      const { getByText, container } = page();
      sectionAt(container, window.innerHeight);
      await userEvent.click(getByText("Coral"));

      expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    });
  });
});

describe("in-page links on the long documents", () => {
  /* The four guides and FAQs and the two legal pages are exempt (the mocks'
     `data-keep-hash`): a reader shares the section they are on, so the address
     carries it. */
  function guide() {
    pathname.current = "/coral-guide";
    return render(
      <>
        <InPageLinks />
        <nav aria-label="On this page">
          <a href="#stay-in-control">Stay in control</a>
        </nav>
        <section id="stay-in-control">Stay in control</section>
      </>,
    );
  }

  it("scroll to the section and keep its hash in the address", async () => {
    window.history.replaceState(null, "", "/coral-guide");
    const { getByRole, container } = guide();
    await userEvent.click(getByRole("link", { name: "Stay in control" }));

    expect(scrollSpy).toHaveBeenCalledOnce();
    expect(window.location.pathname).toBe("/coral-guide");
    expect(window.location.hash).toBe("#stay-in-control");
    expect(document.activeElement).toBe(container.querySelector("#stay-in-control"));
  });

  it("leave a deep link's hash in place, without scrolling again", () => {
    window.history.replaceState(null, "", "/coral-guide#stay-in-control");
    guide();

    expect(window.location.hash).toBe("#stay-in-control");
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("apply to every guide and FAQ, both legal pages and every Learn article, and to no other page", async () => {
    for (const [path, kept] of [
      ...learnArticles.map((article) => [learnPath(article.slug), true] as const),
      ["/learn", false],
      ["/coral-faq", true],
      ["/coral-faq/", true],
      ["/amoeba-guide", true],
      ["/amoeba-faq", true],
      ["/privacy", true],
      ["/terms", true],
      ["/", false],
      ["/coral", false],
      ["/amoeba", false],
      ["/assessment", false],
      ["/docs", false],
    ] as const) {
      pathname.current = path;
      window.history.replaceState(null, "", `${path}#x`);
      const { unmount } = render(<InPageLinks />);
      expect(window.location.hash, path).toBe(kept ? "#x" : "");
      unmount();
    }
  });
});
