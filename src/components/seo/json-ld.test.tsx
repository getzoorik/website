import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { JsonLd, serializeJsonLd } from "./json-ld";

describe("JSON-LD", () => {
  it("cannot be closed early by a string inside it", () => {
    const data = { name: "</script><p>x</p><!--" };
    const html = renderToStaticMarkup(<JsonLd data={data} />);
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
    const scripts = doc.querySelectorAll("script");

    expect(scripts).toHaveLength(1);
    expect(doc.querySelector("p")).toBeNull();
    expect(scripts[0].type).toBe("application/ld+json");
    expect(JSON.parse(scripts[0].textContent ?? "")).toEqual(data);
  });

  it("writes no raw <", () => {
    expect(serializeJsonLd({ a: "<b>" })).not.toContain("<");
  });
});
