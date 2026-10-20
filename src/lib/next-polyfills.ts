/**
 * What stands in for Next's own polyfill module in the browser bundle.
 *
 * Next 16 imports `next/dist/build/polyfills/polyfill-module` into every App
 * Router page whatever browserslist says (vercel/next.js#86785), and Lighthouse
 * reports it as "Legacy JavaScript". next.config.ts points that import here.
 *
 * 🔴 NOTHING ELSE IS LOST. The bundle uses class static blocks, so a browser
 * that can run it at all (Chrome 94, Firefox 93, Safari 16.4) already has every
 * other feature that module patches: trimStart/trimEnd, flat/flatMap,
 * Object.fromEntries, Array.prototype.at, Object.hasOwn, Promise.finally and
 * Symbol.prototype.description.
 *
 * 🔴 EXCEPT URL.canParse, WHICH STAYS. It arrived in Chrome 120, Firefox 115 and
 * Safari 17, after the oldest browsers Next supports. Nothing of ours calls it
 * today; keeping the shim means a Next release that does cannot throw on them.
 * Lighthouse does not count it.
 */
if (!("canParse" in URL)) {
  (URL as { canParse?: (url: string | URL, base?: string | URL) => boolean }).canParse = (
    url,
    base,
  ) => {
    try {
      return Boolean(new URL(url, base));
    } catch {
      return false;
    }
  };
}

export {};
