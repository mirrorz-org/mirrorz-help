import { createContext, use } from 'react';
import type { MetaFromFrontMatters } from '../types/front-matter';

const FrontMattersContext = createContext<MetaFromFrontMatters | null>(null);

export function useFrontMatters() {
  const value = use(FrontMattersContext);
  if (value === null) {
    throw new Error('useFrontMatters can only be used in [...content] page');
  }
  return value;
}

export function FrontMatterProvider({ children, meta = null }: React.PropsWithChildren<{ meta?: MetaFromFrontMatters | null | undefined }>) {
  return (
    <FrontMattersContext value={meta}>
      {children}
    </FrontMattersContext>
  );
}
