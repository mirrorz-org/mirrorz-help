import type { RoutesJson } from '@/types/routesJson';
import { usePendingRoute } from '@/hooks/use-pending-route';
import { useRouter } from 'next/router';
import { SidebarLink } from './nav-link';
import { memo } from 'react';

interface SidebarProps {
  routes: RoutesJson
}

function Sidebar({ routes }: SidebarProps) {
  const pendingRoute = usePendingRoute();
  const cleanedPath = useRouter().asPath.split(/[?#]/)[0];

  return (
    <ul>
      {
        Object.keys(routes).map((href: string) => {
          const route = routes[href];
          const isPending = pendingRoute === href;
          const isActive = cleanedPath === href;

          return (
            <SidebarLink
              href={href}
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
