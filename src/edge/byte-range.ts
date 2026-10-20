/**
 * A static file answered as a browser playing a video asks for it: the byte
 * range it names (206), or the whole file when it names none.
 *
 * ─── WHY THE WORKER SERVES THE FILMS AT ALL ────────────────────────────────
 * Cloudflare's static assets answer a `Range` request with the whole file and a
 * 200 (measured on zoorik.com). Safari plays a <video> only from
 * a server that answers its first `Range: bytes=0-1` with a 206, so on an
 * iPhone or a Mac the home page's films would sit on their posters. The Worker
 * takes `/motion/*` (`run_worker_first` in wrangler.jsonc), fetches the
 * file from the assets, and cuts the range here.
 *
 * ─── STREAMED, NEVER HELD ──────────────────────────────────────────────────
 * The range is cut from the asset's stream as it passes, and the source is
 * cancelled once the last byte is out. Holding the file (2.7 MB) per request
 * would cost several MB of the isolate's 128 MB for every film request in
 * flight, Safari's two-byte probe included, in the isolate that also serves
 * the pages. The size comes from the asset's Content-Length, or from the
 * caller (`motionSizes`), since the static assets' response has none.
 *
 * One range only, which is all a video element asks for; a request for several,
 * or an `If-Range` that no longer names this file, gets the whole file. The
 * file's own headers (its type, its ETag, its `_headers` cache rule) carry over.
 */
export async function byteRangeResponse(
  request: Request,
  asset: Response,
  knownSize?: number,
): Promise<Response> {
  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  const head = request.method === "HEAD";

  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range")?.trim() ?? "");
  const ifRange = request.headers.get("If-Range");
  /* The asset's own Content-Length when it sends one; the Worker's assets do not (`motionSizes`). */
  const size = Number(asset.headers.get("Content-Length") ?? knownSize ?? NaN);
  const whole =
    asset.status !== 200 ||
    range === null ||
    (range[1] === "" && range[2] === "") ||
    (ifRange !== null && ifRange !== asset.headers.get("ETag")) ||
    !Number.isInteger(size);
  if (whole) {
    /* A HEAD, or a 304 to a browser whose copy is current, has no body to pass on. */
    const bodiless = head || asset.status === 304;
    if (bodiless) await asset.body?.cancel();
    return new Response(bodiless ? null : asset.body, { status: asset.status, headers });
  }

  const [, from, to] = range;
  /* "bytes=-500" is the last 500 bytes; "bytes=500-" runs to the end. */
  const start = from === "" ? Math.max(size - Number(to), 0) : Number(from);
  const end = from === "" || to === "" ? size - 1 : Math.min(Number(to), size - 1);

  if (start >= size || start > end) {
    await asset.body?.cancel();
    headers.delete("Content-Length");
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const length = end - start + 1;
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(length));
  if (head || asset.body === null) {
    await asset.body?.cancel();
    return new Response(null, { status: 206, headers });
  }
  return new Response(fixedLength(asset.body.pipeThrough(slice(start, length)), length), {
    status: 206,
    headers,
  });
}

/** The bytes from `start`, `length` of them, then the end of the stream (which cancels the source). */
function slice(start: number, length: number): TransformStream<Uint8Array, Uint8Array> {
  let skip = start;
  let left = length;
  return new TransformStream({
    transform(chunk, controller) {
      let part = chunk;
      if (skip > 0) {
        if (part.byteLength <= skip) {
          skip -= part.byteLength;
          return;
        }
        part = part.subarray(skip);
        skip = 0;
      }
      if (part.byteLength > left) part = part.subarray(0, left);
      left -= part.byteLength;
      if (part.byteLength > 0) controller.enqueue(part);
      if (left === 0) controller.terminate();
    },
  });
}

type FixedLengthStreamConstructor = new (length: number) => TransformStream<Uint8Array, Uint8Array>;

/**
 * On Cloudflare, `FixedLengthStream` sends a streamed body with its exact
 * Content-Length rather than chunked. Elsewhere (the tests) the stream as it is.
 */
function fixedLength(body: ReadableStream<Uint8Array>, length: number): ReadableStream<Uint8Array> {
  const Fixed = (globalThis as { FixedLengthStream?: FixedLengthStreamConstructor })
    .FixedLengthStream;
  return Fixed ? body.pipeThrough(new Fixed(length)) : body;
}
