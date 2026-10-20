import { Fragment } from "react";

/* A name is matched as written; this keeps a character that means something to
   a pattern from meaning it here. */
const literal = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Running text with a product name in it, the name kept out of translation.
 *
 * A page translator would otherwise turn "Amoeba" into its dictionary word and
 * "Coral" into a colour. The mocks mark the names `translate="no"`; this does it
 * for every sentence a content file hands the template, so a name added to the
 * copy later is covered without anyone remembering to wrap it.
 */
export function NamedText({
  text,
  name,
}: {
  text: string;
  /** One name, or several where a sentence names more than one (/login's panel:
   *  "Coral optimizes Kubernetes. Amoeba optimizes block storage."). */
  name: string | readonly string[];
}): React.JSX.Element {
  const names = typeof name === "string" ? [name] : name;
  /* Split on a capturing group, so every odd part is a name and every even part
     the text between two of them. */
  const parts = text.split(new RegExp(`(${names.map(literal).join("|")})`));
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>{index % 2 ? <span translate="no">{part}</span> : part}</Fragment>
      ))}
    </>
  );
}
