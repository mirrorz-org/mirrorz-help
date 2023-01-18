import type { AppProps } from 'next/app';
import { useFuckSafari } from '../hooks/use-fuck-safari';

import '@/styles/reset.css';
import '@/styles/styles.sass';

import { DarkModeProvider } from '../contexts/darkmode';
import { SearchOpenProvider } from '../contexts/search';

export default function App({ Component, pageProps }: AppProps) {
  useFuckSafari();

  return (
    <DarkModeProvider>
      <SearchOpenProvider>
        <Component {...pageProps} />
      </SearchOpenProvider>
    </DarkModeProvider>
  );
}
