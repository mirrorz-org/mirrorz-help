# Per-site overrides

`zdoc/site/<abbr>/<page>/` customizes help page `<page>` for one mirror site.
`<abbr>` is the site's MirrorZ `abbr` with whitespace removed (e.g. `SJTUG - Siyuan` → `SJTUG-Siyuan`).

## Files

- `<lang>.yaml` (e.g. `zh.yaml`), all keys optional but at least one required:
  - `block`: block list for this site, replacing the page's `block`.
  - `cname`: cname this site publishes the mirror under in MirrorZ, if it differs from `<page>`.
    The site then shows up in the mirror selector of `<page>`, and `{{endpoint}}` etc. use that mirror's URL.
  - `rewrite_url`: list of `{ from, to }` regex substitutions applied in order to every rendered code block
    when this site is selected. `from` is a JavaScript regex source (applied with the `g` flag);
    `to` supports `$1`-style group references.
- `<block>.<lang>.md`: replaces the content of `<block>` for this site.

A separate page variant (with its own ToC) is generated only when the site sets `block` or overrides a block;
`cname` / `rewrite_url` alone reuse the default content.

## Example

```yaml
# SJTUG-Siyuan/pytorch/zh.yaml
cname: pytorch-wheels
rewrite_url:
- from: '/pytorch-wheels/whl/'
  to: '/pytorch-wheels/'
```
