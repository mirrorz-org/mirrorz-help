import React, { createContext, useContext, useState } from 'react';
import { noop } from '../lib/shared/util';

const SearchOpenContext = createContext<boolean>(false);
const SearchOpenDispatchContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(noop);

export const useSearchOpen = () => useContext(SearchOpenContext);
export const useSetSearchOpen = () => useContext(SearchOpenDispatchContext);

export const SearchOpenProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <SearchOpenContext.Provider value={searchOpen}>
      <SearchOpenDispatchContext.Provider value={setSearchOpen}>
        {children}
      </SearchOpenDispatchContext.Provider>
    </SearchOpenContext.Provider>
  );
};
