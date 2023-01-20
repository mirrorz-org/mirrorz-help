import { createContext, useContext } from 'react';
import type { MetaFromFrontMatters } from '../types/front-matter';

const FrontMattersContext = createContext<MetaFromFrontMatters | null>(null);

export const useFrontMatters = () => {
  const value = useContext(FrontMattersContext);
  if (value === null) {
    throw new Error('useFrontMatters can only be used in [...content] page');
  }
  return value;
};

export const FrontMatterProvider = ({ children, meta = null }: React.PropsWithChildren<{ meta?: MetaFromFrontMatters | null | undefined }>) => {
  return (
    <FrontMattersContext.Provider value={meta}>
      {children}
    </FrontMattersContext.Provider>
  );
};
