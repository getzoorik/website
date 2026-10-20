import { describe, expect, it } from "vitest";

import { byteRangeResponse } from "./byte-range";

const FILE = new Uint8Array(Array.from({ length: 1000 }, (_, i) => i % 256));

const HEADERS = {
  "Content-Type": "video/mp4",
  "Content-Length": "1000",
  "Cache-Control": "public, max-age=2592000",
  ETag: '"film-1"',
};

const asset = () => new Response(FILE, { status: 200, headers: HEADERS });

/** The file as the assets stream it: in chunks of 64 bytes, noting when the reader cancels. */
function chunked(): { response: Response; cancelled: () => boolean; pulled: () => number } {
  let offset = 0;
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (offset >= FILE.length) return controller.close();
      controller.enqueue(FILE.slice(offset, offset + 64));
      offset += 64;
    },
    cancel() {
      cancelled = true;
    },
  });
  return {
    response: new Response(stream, { status: 200, headers: HEADERS }),
    cancelled: () => cancelled,
    pulled: () => offset,
  };
}

const ask = (range?: string, method = "GET") =>
  new Request("https://zoorik.com/motion/coral-overview-5s.mp4", {
    method,
    headers: range ? { Range: range } : {},
  });

const bytes = async (response: Response) => new Uint8Array(await response.arrayBuffer());

describe("byteRangeResponse", () => {
  it("answers Safari's first probe, bytes=0-1, with those two bytes and a 206", async () => {
    const response = await byteRangeResponse(ask("bytes=0-1"), asset());
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Range")).toBe("bytes 0-1/1000");
    expect(response.headers.get("Content-Length")).toBe("2");
    expect(response.headers.get("Accept-Ranges")).toBe("bytes");
    expect([...(await bytes(response))]).toEqual([0, 1]);
  });

  it("serves an open range to the end, and a suffix range from the end", async () => {
    const open = await byteRangeResponse(ask("bytes=990-"), asset());
    expect(open.headers.get("Content-Range")).toBe("bytes 990-999/1000");
    expect((await bytes(open)).length).toBe(10);

    const suffix = await byteRangeResponse(ask("bytes=-100"), asset());
    expect(suffix.headers.get("Content-Range")).toBe("bytes 900-999/1000");
    expect((await bytes(suffix))[0]).toBe(900 % 256);
  });

  it("clamps a range past the end, and refuses one that starts past it", async () => {
    const clamped = await byteRangeResponse(ask("bytes=500-5000"), asset());
    expect(clamped.headers.get("Content-Range")).toBe("bytes 500-999/1000");

    const refused = await byteRangeResponse(ask("bytes=1000-"), asset());
    expect(refused.status).toBe(416);
    expect(refused.headers.get("Content-Range")).toBe("bytes */1000");
  });

  it("gives the whole file, with Accept-Ranges, when no single range is asked for", async () => {
    for (const range of [undefined, "bytes=0-1,5-9", "items=0-1"]) {
      const response = await byteRangeResponse(ask(range), asset());
      expect(response.status, String(range)).toBe(200);
      expect(response.headers.get("Accept-Ranges")).toBe("bytes");
      expect((await bytes(response)).length).toBe(1000);
    }
  });

  it("keeps the file's own type and cache rule, and sends no body for HEAD", async () => {
    const response = await byteRangeResponse(ask("bytes=0-99", "HEAD"), asset());
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Type")).toBe("video/mp4");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=2592000");
    expect(response.body).toBeNull();
  });

  it("cuts a range across chunk boundaries, then stops reading the file", async () => {
    const source = chunked();
    const response = await byteRangeResponse(ask("bytes=100-299"), source.response);
    const got = await bytes(response);
    expect(got.length).toBe(200);
    expect([...got]).toEqual([...FILE.slice(100, 300)]);
    expect(source.cancelled()).toBe(true);
    expect(source.pulled()).toBeLessThan(FILE.length);
  });

  it("serves the range only while If-Range still names this file", async () => {
    const same = await byteRangeResponse(
      new Request("https://zoorik.com/motion/a.mp4", {
        headers: { Range: "bytes=0-9", "If-Range": '"film-1"' },
      }),
      asset(),
    );
    expect(same.status).toBe(206);
    const changed = await byteRangeResponse(
      new Request("https://zoorik.com/motion/a.mp4", {
        headers: { Range: "bytes=0-9", "If-Range": '"film-0"' },
      }),
      asset(),
    );
    expect(changed.status).toBe(200);
    expect((await bytes(changed)).length).toBe(1000);
  });

  it("cuts against the size it is given when the assets send no length, as Cloudflare's do", async () => {
    const unsized = new Response(FILE, { status: 200, headers: { "Content-Type": "video/mp4" } });
    const response = await byteRangeResponse(ask("bytes=0-1"), unsized, 1000);
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Range")).toBe("bytes 0-1/1000");
    expect([...(await bytes(response))]).toEqual([0, 1]);
  });

  it("gives the whole file when the assets send no length to cut against", async () => {
    const unsized = new Response(FILE, { status: 200, headers: { "Content-Type": "video/mp4" } });
    const response = await byteRangeResponse(ask("bytes=0-1"), unsized);
    expect(response.status).toBe(200);
    expect((await bytes(response)).length).toBe(1000);
  });

  it("passes a 304 through, with no body, to a browser whose copy is current", async () => {
    const response = await byteRangeResponse(
      ask("bytes=0-1"),
      new Response(null, { status: 304, headers: { ETag: '"film-1"' } }),
    );
    expect(response.status).toBe(304);
    expect(response.body).toBeNull();
  });

  it("passes a missing file through untouched", async () => {
    const missing = await byteRangeResponse(
      ask("bytes=0-1"),
      new Response("not found", { status: 404 }),
    );
    expect(missing.status).toBe(404);
  });
});
