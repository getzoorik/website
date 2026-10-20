import { readFileSync } from "node:fs";
import { join } from "node:path";

import { documents, type DocumentId } from "@/content/documents";
import { pdfFacts, type DocumentFacts } from "@/lib/pdf-facts";

/**
 * A published document's download facts ("11 pages · 0.3 MB", "PDF, 11 pages,
 * 0.3 MB, A4"), read from the file under `public/docs/` that the site serves.
 *
 * 🔴 BUILD TIME ONLY. Every page that prints these is prerendered, so this runs
 * during `next build`, where `process.cwd()` is the project. It never runs on
 * the Worker: the pages are served from the static-assets cache. A missing or
 * unreadable file fails the build with its path, rather than shipping a line
 * nobody measured, and so does asking for a held document: it has no file.
 */
const cache = new Map<DocumentId, DocumentFacts>();

export function documentFacts(id: DocumentId): DocumentFacts {
  const known = cache.get(id);
  if (known) return known;
  if (!documents[id].released) throw new Error(`${id} is held: it has no public file`);
  const file = join(process.cwd(), "public", documents[id].pdf);
  let facts: DocumentFacts;
  try {
    facts = pdfFacts(readFileSync(file));
  } catch (error) {
    throw new Error(`Cannot read the download facts of ${file}`, { cause: error });
  }
  cache.set(id, facts);
  return facts;
}
