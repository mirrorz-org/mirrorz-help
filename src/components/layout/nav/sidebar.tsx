import { usePendingRoute } from '@/hooks/use-pending-route';
import { usePathname } from '@/hooks/use-current-pathname';

import SidebarLink from './nav-link';
import { memo } from 'react';

import _routesJson from '@/routes.json';
import type { RoutesJson } from '@/types/routes-json';

const routesJson = _routesJson as RoutesJson;
const pathnames = Object.keys(routesJson);

function Sidebar() {
  const pendingRoute = usePendingRoute();
  const cleanedPath = usePathname();

  return (
    <ul>
      {
        pathnames.map((pathname: string) => {
          const route = routesJson[pathname];
          const isPending = pendingRoute === pathname;
          const isActive = cleanedPath === pathname;

          return (
            <SidebarLink
              pathname={pathname}
              key={route.title}
              isActive={isActive}
              isPending={isPending}
              title={route.title}
            />
          );
        })
      }
    </ul>
  );
}

export default memo(Sidebar);
