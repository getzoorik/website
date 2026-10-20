import { statSync } from "node:fs";
import { join } from "node:path";

import { brandKitDir, brandKitZip } from "@/content/brand-assets";

/**
 * The kit ZIP's size as the hero's button prints it ("2.5 MB"), read from the file the site serves
 * (`public/brand-kit/zoorik-brand-kit.zip`), never typed: a rebuilt kit changes the line with it.
 *
 * Written the mock's way: megabytes to one decimal from 1,000,000 bytes, else whole kilobytes, decimal units
 * both.
 *
 * 🔴 BUILD TIME ONLY, as `documentFacts` is. The page is prerendered, so this runs during `next build`, where
 * `process.cwd()` is the project; it never runs on the Worker. A missing file fails the build with its path rather
 * than shipping a size nobody measured.
 */
export function formatKitSize(bytes: number): string {
  return bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.round(bytes / 1e3)} KB`;
}

let size: string | undefined;

export function brandKitSize(): string {
  if (size !== undefined) return size;
  const file = join(process.cwd(), "public", brandKitDir, brandKitZip);
  try {
    size = formatKitSize(statSync(file).size);
  } catch (error) {
    throw new Error(`Cannot read the size of ${file}`, { cause: error });
  }
  return size;
}
