/**
 * `/terms`: the page's own words around the document. The clauses themselves
 * are the document's, read at build from `legal/terms-of-use.md`
 * (`features/terms/terms.ts`).
 */
export const termsCopy = {
  /**
   * The document's date line, as the page prints it from the markdown. Kept
   * here too for the sitemap, which a Worker runs where no file can be read; a
   * test holds the two equal.
   */
  effective: "Effective 6 October 2026 · Version 1.0",
  meta: {
    title: "Terms of use",
    description:
      "The agreement between Zoorik and the organisations that use zoorik.com, Coral and Amoeba: accounts, data, fees, liability and Indian law.",
  },
  hero: {
    title: "Terms of use",
    deck: "The agreement between Zoorik and the organisations that use our products.",
  },
  /**
   * The twenty clauses in six groups, in their own order: the group names are
   * the page's, the clauses and their numbers are the document's.
   */
  groups: [
    { id: "terms-agreement", title: "The agreement", clauses: [1, 2, 3] },
    { id: "terms-use", title: "Using our products", clauses: [4, 5, 6] },
    { id: "terms-data", title: "Data and software", clauses: [7, 8, 9] },
    { id: "terms-service", title: "Fees and service", clauses: [10, 11, 12] },
    { id: "terms-liability", title: "Liability", clauses: [13, 14, 15] },
    { id: "terms-general", title: "General", clauses: [16, 17, 18, 19, 20] },
  ],
} as const;
