const PROTO_REGEX = /(?:^https?:)?\/\//;

export const stringIsNullOrEmpty = (s: string | null | undefined) => s === null || s === undefined || s === '';
export const absoluteUrlOrConcatWithBase = (url: string, baseUrl: string, keepTrailingSlash = false) => {
  const Url = new URL(PROTO_REGEX.test(url) ? url : baseUrl + url);
  const concated = Url.hostname + Url.pathname;
  if (keepTrailingSlash) {
    return concated;
  }
  return concated.endsWith('/') ? concated.slice(0, -1) : concated;
};
export const emptyOrAbsolutUrlOrConcatWithBase = (url: string | null | undefined, baseUrl: string, keepTrailingSlash = true) => (
  url
    ? absoluteUrlOrConcatWithBase(url, baseUrl, keepTrailingSlash)
    : null
);

export const sanitizeAbbrForMirrorZ = (abbr: string) => abbr.replaceAll(/\s/g, '');
