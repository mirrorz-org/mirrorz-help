import React, { createContext, useContext, useState } from 'react';
import { noop } from '../lib/shared/util';

const MirrorHttpsEnabledContext = createContext<boolean>(true);
const MirrorHttpsEnabledDispatchContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(noop);

export const useMirrorHttpsEnabled = () => useContext(MirrorHttpsEnabledContext);
export const useSetMirrorHttpsEnabled = () => useContext(MirrorHttpsEnabledDispatchContext);

export const MirrorEnableHttpsProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [httpsEnabled, setHttpsEnabled] = useState(true);
  return (
    <MirrorHttpsEnabledContext.Provider value={httpsEnabled}>
      <MirrorHttpsEnabledDispatchContext.Provider value={setHttpsEnabled}>
        {children}
      </MirrorHttpsEnabledDispatchContext.Provider>
    </MirrorHttpsEnabledContext.Provider>
  );
};
