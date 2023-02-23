import { useMemo } from 'react';
import { usePathname } from './use-current-pathname';
import { siteHost } from '../lib/client/constant';

export const usePermalink = (baseDomain = siteHost) => {
  const cleanedPath = usePathname();
  return useMemo(() => new URL(cleanedPath, `https://${baseDomain}`).toString(), [baseDomain, cleanedPath]);
};
