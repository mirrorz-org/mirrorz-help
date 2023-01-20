import useSWRImmutable from 'swr/immutable';
import type { CnameToMirrorZ, Mirror, MirrorZLegacyPack, ParsedMirror, ParsedMirrorZLegacy, Site } from '../types/mirrorz';
import { absoluteUrlOrConcatWithBase, emptyOrAbsolutUrlOrConcatWithBase } from '../lib/client/utils';

const parseMirror = (site: Site, { cname, url, help, size, desc, upstream, status }: Mirror): ParsedMirror => ({
  cname,
  full: absoluteUrlOrConcatWithBase(url, site.url),
  help: emptyOrAbsolutUrlOrConcatWithBase(help, site.url),
  upstream,
  desc,
  status: status === undefined ? 'U' : status,
  size,
  source: site.abbr,
  note: site.note
});

const mirrorsArrayToObject = (site: Site, mirrors: Mirror[]) => mirrors.reduce((acc, cur) => {
  const parsedMirror = parseMirror(site, cur);
  acc[parsedMirror.cname] = parsedMirror;
  return acc;
}, {} as Record<string, ParsedMirror>);

const fetcher = async () => {
  // TODO: support both mirrorz and cernet.edu.cn
  const pack: MirrorZLegacyPack = await (await fetch('https://mirrorz.org/static/json/legacy-pack.json')).json();

  const parsedMirrorZLegacy = pack.reduce((acc, cur) => {
    const { site, mirrors } = cur;
    const { abbr } = site;
    const url = new URL(site.url);
    acc[abbr] = {
      // TODO: implements MirrorZ extension D
      baseUrl: url.hostname + url.pathname,
      site,
      mirrors: mirrorsArrayToObject(site, mirrors)
    };
    return acc;
  }, {} as ParsedMirrorZLegacy);

  const cnameToMirrorZ = pack.reduce((acc, cur) => {
    cur.mirrors.forEach(mirror => {
      const { cname } = mirror;
      acc[cname] ||= [];
      acc[cname].push({
        site: cur.site,
        baseUrl: parsedMirrorZLegacy[cur.site.abbr].baseUrl,
        mirror: parseMirror(cur.site, mirror)
      });
    });
    return acc;
  }, {} as CnameToMirrorZ);

  return [parsedMirrorZLegacy, cnameToMirrorZ] as const;
};

export const useMirrorZData = () => useSWRImmutable('parsed-mirrorz-legacy-data', fetcher);
