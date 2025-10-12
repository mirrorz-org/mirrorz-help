import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const NavEnabledContext = createContext<boolean>(true);

export const useNavEnabled = () => useContext(NavEnabledContext);

export const NavEnableProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [navEnabled, setNavEnabled] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    const navFromUrlQuery = router.query.nav;
    if (navFromUrlQuery === '0') {
      setNavEnabled(false);
    }
  }, [router.query.nav]);

  return (
    <NavEnabledContext.Provider value={navEnabled}>
      {children}
    </NavEnabledContext.Provider>
  );
};
