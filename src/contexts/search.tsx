import { createContextState } from 'foxact/context-state';

const [SearchOpenProvider, useSearchOpen, useSetSearchOpen] = createContextState(false);

export { SearchOpenProvider, useSearchOpen, useSetSearchOpen };
