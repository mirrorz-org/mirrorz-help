import React, { createContext, useContext, useState } from 'react';
import { noop } from '../lib/shared/util';

const MirrorSudoEnabledContext = createContext<boolean>(true);
const MirrorSudoEnabledDispatchContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(noop);

export const useMirrorSudoEnabled = () => useContext(MirrorSudoEnabledContext);
export const useSetMirrorSudoEnabled = () => useContext(MirrorSudoEnabledDispatchContext);

export const MirrorEnableSudoProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [sudoEnabled, setSudoEnabled] = useState(true);
  return (
    <MirrorSudoEnabledContext.Provider value={sudoEnabled}>
      <MirrorSudoEnabledDispatchContext.Provider value={setSudoEnabled}>
        {children}
      </MirrorSudoEnabledDispatchContext.Provider>
    </MirrorSudoEnabledContext.Provider>
  );
};
