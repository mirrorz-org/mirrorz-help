import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

export function usePendingRoute() {
  const { events } = useRouter();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const currentRoute = useRef<string | null>(null);

  useEffect(() => {
    let routeTransitionTimer: ReturnType<typeof setTimeout> | null = null;

    const handleRouteChangeStart = (url: string) => {
      if (routeTransitionTimer) {
        clearTimeout(routeTransitionTimer);
      }
      routeTransitionTimer = setTimeout(() => {
        if (currentRoute.current !== url) {
          currentRoute.current = url;
          setPendingRoute(url);
        }
      }, 100);
    };
    const handleRouteChangeComplete = () => {
      setPendingRoute(null);
      if (routeTransitionTimer) {
        clearTimeout(routeTransitionTimer);
      }
    };
    events.on('routeChangeStart', handleRouteChangeStart);
    events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart);
      events.off('routeChangeComplete', handleRouteChangeComplete);
      if (routeTransitionTimer) {
        clearTimeout(routeTransitionTimer);
      }
    };
  }, [events]);

  return pendingRoute;
}
