import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const post = (body: unknown) =>
  POST(
    new Request("https://zoorik.com/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const LEAD = { name: "Ada Lovelace", email: "ada@acme.com" };

beforeEach(() => {
  process.env.INSIGHTS_URL = "https://insights.example";
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.INSIGHTS_URL;
});

describe("POST /api/lead", () => {
  it("🔴 refuses to guess an upstream when INSIGHTS_URL is unset", async () => {
    /* The insights origin has to be confirmed before it is set.
       A default here would not fail — it would POST a real person's name and
       email at whatever host the guess named. */
    delete process.env.INSIGHTS_URL;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    expect((await post(LEAD)).status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("treats an empty INSIGHTS_URL as off", async () => {
    /* wrangler.jsonc ships it as "" while no Zoorik insights host exists. The
       deploy keeps the Worker's existing vars, so an explicit empty value is
       the only way to switch the proxy off, and it has to mean off here. */
    process.env.INSIGHTS_URL = "";
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    expect((await post(LEAD)).status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("forwards a valid lead and passes 201 back", async () => {
    const fetchSpy = vi.fn(async () => new Response(JSON.stringify({ id: 7 }), { status: 201 }));
    vi.stubGlobal("fetch", fetchSpy);

    expect((await post(LEAD)).status).toBe(201);
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://insights.example/api/leads");
    expect(JSON.parse(String(init.body))).toEqual(LEAD);
  });

  it("trims before forwarding, so a padded field is not a 400 upstream", async () => {
    const fetchSpy = vi.fn(async () => new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSpy);

    await post({ name: "  Ada  ", email: "  ada@acme.com \n" });
    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({ name: "Ada", email: "ada@acme.com" });
  });

  it("rejects blank and malformed input without a round trip", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    for (const bad of [
      {},
      { name: "Ada" },
      { email: "ada@acme.com" },
      { name: "   ", email: "ada@acme.com" },
      { name: "Ada", email: "nope" },
      { name: "Ada", email: "a".repeat(300) + "@acme.com" },
      { name: 42, email: "ada@acme.com" },
    ]) {
      expect((await post(bad)).status, JSON.stringify(bad)).toBe(400);
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("answers 400 on a body that is not JSON at all", async () => {
    vi.stubGlobal("fetch", vi.fn());
    expect((await post("not json")).status).toBe(400);
  });

  it("🔴 a 404 from insights is 502, NOT 400", async () => {
    /* Until the endpoint exists, 404 is the state this site will meet first.
       Mapping it to 400 would make the form tell a visitor their own details
       were wrong while the truth is that the service does not exist yet. */
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 404 })),
    );
    expect((await post(LEAD)).status).toBe(502);
  });

  it("passes a genuine upstream 400 through — that one IS about the input", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 400 })),
    );
    expect((await post(LEAD)).status).toBe(400);
  });

  it("answers 502 when insights cannot be reached", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ECONNREFUSED");
      }),
    );
    expect((await post(LEAD)).status).toBe(502);
  });

  it("bounds the upstream call, so a hung service cannot hang the visitor", async () => {
    const fetchSpy = vi.fn(async () => new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSpy);
    await post(LEAD);
    const call = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(call[1].signal).toBeInstanceOf(AbortSignal);
  });
});
