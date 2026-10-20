// Curly quotes, as every page prints its words: shared by the scripts that write words into the site.

/** A double quote opens after the start, a space, a bracket or a slash, and closes anywhere else; an apostrophe curls. */
export const curly = (s) =>
  s
    .replace(/(^|[\s([/])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/'/g, "’");
