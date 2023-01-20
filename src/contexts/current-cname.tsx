import { createContext, useContext } from 'react';

const CurrentCnameContext = createContext<string | null>(null);

export const useCurrentCname = () => {
  const value = useContext(CurrentCnameContext);
  if (value === null) {
    throw new Error('useCurrentCname can only be used in [...content] page');
  }
  return value;
};

export const CurrentCnameProvider = ({ children, cname }: React.PropsWithChildren<{ cname: string | null }>) => {
  return (
    <CurrentCnameContext.Provider value={cname}>
      {children}
    </CurrentCnameContext.Provider>
  );
};
