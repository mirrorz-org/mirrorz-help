/**
 * Per-site, per-page overrides declared in `zdoc/site/<abbr>/<page>/<lang>.yaml`.
 */
export interface SiteOverride {
  /**
   * The cname this site publishes the page's mirror under in MirrorZ data,
   * when it differs from the page cname (e.g. `pytorch-wheels` for `pytorch`).
   */
  cname?: string,
  /**
   * Regex substitutions applied, in order, to every rendered code block
   * (after template expansion) when this site is selected.
   * `from` is a JavaScript RegExp source (global flag), `to` a replacement string
   * supporting `$1`-style group references.
   */
  rewriteUrl?: Array<{ from: string, to: string }>
}

/** Keyed by sanitized site abbr */
export type SiteOverrides = Partial<Record<string, SiteOverride>>;
