import { useMemo } from 'react';
import { usePathname } from './use-current-pathname';

export const usePermalink = (baseDomain = 'mirrors.help') => {
  const cleanedPath = usePathname();
  return useMemo(() => new URL(cleanedPath, `https://${baseDomain}`).toString(), [baseDomain, cleanedPath]);
};
