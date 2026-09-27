import { createContext, use, useCallback, useMemo } from 'react';
import type { SiteOverrides } from '@/types/site-override';
import type { CnameToMirrorZ, ParsedMirror, ParsedMirrorZLegacy } from '@/types/mirrorz';
import { useMirrorZData } from '@/hooks/use-mirrorz-data';
import { EMPTY_ARRAY } from '@/lib/client/constant';

const CurrentCnameContext = createContext<string | null>(null);
const EMPTY_OVERRIDES: SiteOverrides = {};
const SiteOverridesContext = createContext<SiteOverrides>(EMPTY_OVERRIDES);

export function useCurrentCname() {
  const value = use(CurrentCnameContext);
  if (value === null) {
    throw new Error('useCurrentCname can only be used in [...content] page');
  }
  return value;
}

export function useSiteOverrides() {
  return use(SiteOverridesContext);
}

/**
 * Returns the cname under which the given site (sanitized abbr) publishes
 * the current page's mirror, honoring `cname` in site overrides.
 */
export function useResolveSiteCname() {
  const cname = use(CurrentCnameContext);
  const siteOverrides = useSiteOverrides();
  return useCallback(
    (abbr: string | null) => (abbr && siteOverrides[abbr]?.cname) || cname,
    [cname, siteOverrides]
  );
}

type PageMirrors = CnameToMirrorZ[string];

/**
 * All mirror sites providing the current page, honoring `cname` in site overrides.
 * Keeps MirrorZ order; an aliased entry replaces the site's entry under the page cname.
 */
export function usePageMirrors(): PageMirrors {
  const cname = use(CurrentCnameContext);
  const siteOverrides = useSiteOverrides();
  const { data } = useMirrorZData();
  return useMemo(() => {
    if (!data || !cname) return EMPTY_ARRAY;
    return computePageMirrors(data[0], cname, siteOverrides);
  }, [data, cname, siteOverrides]);
}

export function computePageMirrors(sites: ParsedMirrorZLegacy, cname: string, siteOverrides: SiteOverrides): PageMirrors {
  const result: PageMirrors = [];
  // Object keys keep MirrorZ site order
  for (const [abbr, { site, baseUrl, mirrors }] of Object.entries(sites)) {
    const mirror = mirrors[siteOverrides[abbr]?.cname || cname] as ParsedMirror | undefined;
    if (mirror) result.push({ site, baseUrl, mirror });
  }
  return result;
}

export function CurrentCnameProvider({ children, cname, siteOverrides }: React.PropsWithChildren<{ cname: string | null, siteOverrides?: SiteOverrides }>) {
  return (
    <CurrentCnameContext value={cname}>
      <SiteOverridesContext value={siteOverrides ?? EMPTY_OVERRIDES}>
        {children}
      </SiteOverridesContext>
    </CurrentCnameContext>
  );
}
