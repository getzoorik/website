import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { docsHub } from "@/content/documents";
import { DocsHub } from "@/features/documents/docs-hub";
import { DocumentPage, documentMetadata } from "@/features/documents/document-page";

/**
 * `/docs`: the Docs hub. Every published document, grouped by product: the
 * utility hero ("Product docs"), the groups and the line to the articles, then
 * the closing row for both products, drawn still. Indexed, and prerendered at
 * build like every page here; the download facts are read from the PDFs then.
 *
 * 🔴 THE PAGE AND THE FILES SHARE A PATH. `/docs` is this page; `/docs/*.pdf`
 * are files under `public/docs/`, which Cloudflare serves as static assets
 * before the Worker. No file is named `docs` itself, so the two never collide.
 * The hub's old address, `/resources`, 308s here (next.config.ts).
 */
export const metadata: Metadata = documentMetadata(routes.docs, docsHub.meta);

export default function DocsPage(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.docs)} />
      <DocumentPage hero={{ title: docsHub.title, deck: docsHub.deck }}>
        <DocsHub />
      </DocumentPage>
    </>
  );
}
