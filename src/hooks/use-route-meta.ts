import { usePathname } from './use-current-pathname';
import _routesJson from '@/routes.json';

import type { RoutesJson } from '@/types/routes-json';

const routesJson = _routesJson as RoutesJson;

export function useRouteMeta(): RoutesJson[string] | null {
  const cleanedPath = usePathname();
  return cleanedPath in routesJson ? routesJson[cleanedPath] : null;
}
