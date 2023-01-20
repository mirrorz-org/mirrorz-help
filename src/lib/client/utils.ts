const PROTO_REGEX = /(^https?:)?\/\//;

export const stringIsNullOrEmpty = (s: string | null | undefined) => s === null || s === undefined || s === '';
export const absoluteUrlOrConcatWithBase = (url: string, baseUrl: string) => {
  const Url = new URL(PROTO_REGEX.test(url) ? url : baseUrl + url);
  const concated = Url.hostname + Url.pathname;
  return concated.endsWith('/') ? concated.slice(0, -1) : concated;
};
export const emptyOrAbsolutUrlOrConcatWithBase = (url: string | null | undefined, baseUrl: string) => (
  url
    ? absoluteUrlOrConcatWithBase(url, baseUrl)
    : null
);
