import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { contactPage } from "@/content/contact";
import { ContactPage } from "@/features/contact/contact-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/program-pages.css";
import "@/styles/about.css";
import "@/styles/contact-pricing.css";

/**
 * `/contact`: the calendar, the one address, what to write to us about, the company, and where to follow and buy.
 * Indexed, listed in the sitemap, and prerendered at build like every page here. In no menu and no footer column yet
 * (the owner's call): /pricing links it. It is drawn on /partners' frame with /about's facts and Find us cards, so it
 * carries both pages' sheets, as the mock does, then its own.
 */
/* Its title goes through the layout's template: "Contact | Zoorik". */
export const metadata: Metadata = documentMetadata(routes.contact, contactPage.meta);

export default function Contact(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.contact)} />
      <ContactPage />
    </>
  );
}
