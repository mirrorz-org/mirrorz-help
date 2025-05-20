import { createContext, use } from 'react';

const CurrentCnameContext = createContext<string | null>(null);

export function useCurrentCname() {
  const value = use(CurrentCnameContext);
  if (value === null) {
    throw new Error('useCurrentCname can only be used in [...content] page');
  }
  return value;
}

export function CurrentCnameProvider({ children, cname }: React.PropsWithChildren<{ cname: string | null }>) {
  return (
    <CurrentCnameContext value={cname}>
      {children}
    </CurrentCnameContext>
  );
}
