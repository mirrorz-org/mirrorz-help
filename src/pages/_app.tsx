import type { AppProps } from 'next/app';
import { useFuckSafari } from '../hooks/use-fuck-safari';

import '@/styles/reset.css';
import '@/styles/styles.sass';

import 'stylex-webpack/stylex.css';

import { DarkModeProvider } from '../contexts/darkmode';
import { SearchOpenProvider } from '../contexts/search';
import { DialogProvider } from '../contexts/dialog';

export default function App({ Component, pageProps }: AppProps) {
  useFuckSafari();

  return (
    <DarkModeProvider>
      <SearchOpenProvider>
        <DialogProvider>
          <Component {...pageProps} />
        </DialogProvider>
      </SearchOpenProvider>
    </DarkModeProvider>
  );
}
