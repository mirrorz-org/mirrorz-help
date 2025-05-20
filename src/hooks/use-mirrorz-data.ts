import useSWRImmutable from 'swr/immutable';
import type { CnameToMirrorZ, Mirror, MirrorZLegacyPack, ParsedMirror, ParsedMirrorZLegacy, Site } from '../types/mirrorz';
import { absoluteUrlOrConcatWithBase, emptyOrAbsolutUrlOrConcatWithBase, sanitizeAbbrForMirrorZ } from '../lib/client/utils';
import { jsonEndpoint, siteHost } from '../lib/client/constant';

class RedirectError extends Error {
  readonly redirect: string;
  readonly name = 'RedirectError';
  constructor(readonly input: string) {
    super();
    this.redirect = input;
  }
}

function parseMirror(site: Site, { cname, url, help, size, desc, upstream, status }: Mirror): ParsedMirror {
  return {
    cname,
    full: absoluteUrlOrConcatWithBase(url, site.url),
    help: emptyOrAbsolutUrlOrConcatWithBase(help, site.url),
    upstream,
    desc,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mirrorz spec inconsistency
    status: status === undefined ? 'U' : status,
    size,
    source: sanitizeAbbrForMirrorZ(site.abbr),
    note: site.note
  };
}

function mirrorsArrayToObject(site: Site, mirrors: Mirror[]) {
  return mirrors.reduce<Record<string, ParsedMirror>>((acc, cur) => {
    const parsedMirror = parseMirror(site, cur);
    acc[parsedMirror.cname] = parsedMirror;
    return acc;
  }, {});
}

async function fetcher() {
  // TODO: support both mirrorz and cernet.edu.cn
  const res = await fetch(jsonEndpoint);

  if (!res.ok && res.status === 403) {
    throw new RedirectError(`https://${siteHost}/`);
  }

  const pack: MirrorZLegacyPack = await res.json();

  if ('redirect' in pack) {
    throw new RedirectError(`https://${siteHost}/#${pack.redirect}`);
  }

  const parsedMirrorZLegacy = pack.reduce<ParsedMirrorZLegacy>((acc, cur) => {
    const { site, mirrors } = cur;
    const { abbr } = site;

    const url = new URL(site.url);
    acc[sanitizeAbbrForMirrorZ(abbr)] = {
      // TODO: implements MirrorZ extension D
      baseUrl: url.hostname + url.pathname,
      site,
      mirrors: mirrorsArrayToObject(site, mirrors)
    };
    return acc;
  }, {});

  const cnameToMirrorZ = pack.reduce<CnameToMirrorZ>((acc, cur) => {
    cur.mirrors.forEach(mirror => {
      const { cname } = mirror;
      acc[cname] ||= [];
      acc[cname].push({
        site: cur.site,
        baseUrl: parsedMirrorZLegacy[sanitizeAbbrForMirrorZ(cur.site.abbr)].baseUrl,
        mirror: parseMirror(cur.site, mirror)
      });
    });
    return acc;
  }, {});

  return [parsedMirrorZLegacy, cnameToMirrorZ] as const;
}

export function useMirrorZData() {
  return useSWRImmutable('parsed-mirrorz-legacy-data', fetcher, {
    onError(err) {
      if (err instanceof RedirectError) {
        window.location.assign(err.redirect);
      }
    }
  });
}
