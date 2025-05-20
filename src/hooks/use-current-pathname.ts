import { useRouter } from 'next/router';
import { useMemo } from 'react';

// TODO: replace it with next/compat/navigation's usePathname() once it is released
export function usePathname() {
  const { asPath } = useRouter();
  return useMemo(() => {
    const path = asPath.split(/[#?]/)[0];
    return path.endsWith('/') ? path : `${path}/`;
  }, [asPath]);
}
