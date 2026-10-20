/**
 * A fact a document does not have yet: "To come: " at weight 500 (`.ph-k`),
 * then the description of the missing fact, inline where the fact will go,
 * muted. "To come: " is the placeholder's own text, and the span carries
 * `data-nosnippet`, so a search result never quotes it (Google honours it on a
 * span).
 *
 * Nothing boxes it: no italics, underline, background or border, in a
 * sentence, a table cell, a bullet or a dark command well alike.
 */
export function DocPlaceholder({ children }: { readonly children: string }): React.JSX.Element {
  return (
    <span className="ph" data-nosnippet="">
      <span className="ph-k">To come: </span>
      {children}
    </span>
  );
}
