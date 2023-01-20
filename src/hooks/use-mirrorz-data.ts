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
      mirrors: mirrors.map(mirror => parseMirror(site, mirror))
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

  return [parsedMirrorZLegacy, cnameToMirrorZ];
};

export const useMirrorZData = () => useSWRImmutable('parsed-mirrorz-legacy-data', fetcher);
