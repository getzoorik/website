/** Escapes every "<" so no string can close the script element (node_modules/next/dist/docs/01-app/02-guides/json-ld.md). */
export function serializeJsonLd(data: Readonly<Record<string, unknown>>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: Readonly<Record<string, unknown>> }): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
