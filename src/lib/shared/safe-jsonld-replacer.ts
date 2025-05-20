const ESCAPE_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;'
} as const;
const ESCAPE_REGEX = new RegExp(`[${Object.keys(ESCAPE_ENTITIES).join('')}]`, 'g');
const ESCAPE_REPLACER = (t: string): string => ESCAPE_ENTITIES[t as keyof typeof ESCAPE_ENTITIES];

/**
 * A replacer for JSON.stringify to strip JSON-LD of illegal HTML entities
 * per https://www.w3.org/TR/json-ld11/#restrictions-for-contents-of-json-ld-script-elements
 * Solution from https://stackoverflow.com/a/5499821/864313
 */
export function safeJsonLdReplacer(_: string, value: any) {
  switch (typeof value) {
    case 'object':
      // Omit null values.
      if (value === null) {
        return;
      }

      return value; // JSON.stringify will recursively call replacer.
    case 'number':
    case 'boolean':
    case 'bigint':
      return value; // These values are not risky.
    case 'string':
      return value.replace(ESCAPE_REGEX, ESCAPE_REPLACER);
    default: {
      // JSON.stringify will remove this element.
    }
  }
}
