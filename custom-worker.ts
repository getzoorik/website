/**
 * The Worker Cloudflare runs: OpenNext's generated one, with the home page's
 * films served by byte range in front of it (`src/edge/byte-range.ts` says
 * why). OpenNext's documented way to extend its Worker
 * (opennext.js.org/cloudflare/howtos/custom-worker).
 *
 * Only `/motion/*` reaches this code before the static assets do
 * (`run_worker_first` in wrangler.jsonc); every other file is served as
 * before, and every page still goes to OpenNext.
 *
 * Kept out of tsconfig: `.open-next/worker.js` exists only after
 * `opennextjs-cloudflare build`, and wrangler bundles this file itself.
 */
import handler from "./.open-next/worker.js";
import { byteRangeResponse } from "./src/edge/byte-range";
import { motionSizes } from "./src/edge/motion-sizes";

interface Env {
  readonly ASSETS: { fetch(request: Request): Promise<Response> };
}

/** The validator a browser revalidates a cached film with: the assets answer 304 to it. */
const CONDITIONAL = ["If-None-Match"] as const;

const worker = {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    const motion = url.pathname.startsWith("/motion/");
    /* The films' posters: straight back to the assets, as they would be served without this Worker. */
    if (motion && !url.pathname.endsWith(".mp4")) return env.ASSETS.fetch(request);
    if (motion && (request.method === "GET" || request.method === "HEAD")) {
      /* The file from the assets (a 304 when the browser's copy is current), then the range cut from it. */
      const headers = new Headers();
      for (const name of CONDITIONAL) {
        const value = request.headers.get(name);
        if (value !== null) headers.set(name, value);
      }
      const asset = await env.ASSETS.fetch(new Request(url, { method: "GET", headers }));
      /* A film that does not exist gets the site's own 404 page, as every missing path does. */
      if (asset.status === 404) {
        await asset.body?.cancel();
        return handler.fetch(request, env, ctx);
      }
      return byteRangeResponse(request, asset, motionSizes[url.pathname]);
    }
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
