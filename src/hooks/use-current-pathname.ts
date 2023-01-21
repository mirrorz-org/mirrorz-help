import { useRouter } from 'next/router';
import { useMemo } from 'react';

// TODO: replace it with next/compat/navigation's usePathname() once it is released
export const usePathname = () => {
  const { asPath } = useRouter();
  return useMemo(() => asPath.split(/[?#]/)[0], [asPath]);
};
